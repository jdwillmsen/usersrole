#!/usr/bin/env bash
# Read-only snapshot of the live Firebase/GCP configuration, written as
# Markdown. Every byte goes through redact.py before it reaches the output
# file, so nothing unredacted is ever written to disk.
#
# Usage: RETIREMENT_KEEP=<test email>,<test uid> cli-snapshot.sh <project> <out.md>
set -euo pipefail

PROJECT=${1:?project id}
OUT=${2:?output markdown path}
REGION=us-central1
HERE=$(cd "$(dirname "$0")" && pwd)

# The token only ever lives inside curl's argv; it is never echoed or stored.
api() {
  curl -sS --max-time 60 \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "x-goog-user-project: $PROJECT" \
    -H 'Content-Type: application/json' "$@"
}

section() {
  local title=$1 cmd=$2
  printf '\n## %s\n\n```console\n$ %s\n' "$title" "$cmd"
  bash -c "$cmd" 2>&1 || printf '(exit %s)\n' "$?"
  printf '```\n'
}
# The password-hash signer key and IdP client secrets are dropped here, before
# anything is printed, rather than left to redact.py: a pattern miss there
# would put a live secret in the repo.
strip_secrets() {
  jq 'del(.signIn.hashConfig) | del(.. | .signerKey?, .saltSeparator?, .clientSecret?, .privateKey?)'
}
export -f api strip_secrets
export PROJECT REGION

hosting_summary() {
  local sites
  sites=$(api "https://firebasehosting.googleapis.com/v1beta1/projects/$PROJECT/sites" | jq -r '.sites[].name')
  for site in $sites; do
    echo "# $site"
    api "https://firebasehosting.googleapis.com/v1beta1/$site" | jq '{defaultUrl, type, appId: (.appId // null)}'
    echo "# channels"
    api "https://firebasehosting.googleapis.com/v1beta1/$site/channels?pageSize=100" |
      jq -r '.channels[]? | [(.name | split("/") | last), .url, (.expireTime // "never"), .release.version.status, .release.releaseTime] | @tsv'
    echo "# last 10 releases"
    api "https://firebasehosting.googleapis.com/v1beta1/$site/releases?pageSize=10" |
      jq -r '.releases[]? | [.releaseTime, .type, (.version.name | split("/") | last), .version.status, (.version.fileCount // "" | tostring), (.message // "")] | @tsv'
  done
}

rules_summary() {
  api "https://firebaserules.googleapis.com/v1/projects/$PROJECT/releases" |
    jq -r '.releases[]? | [.name, .rulesetName, .updateTime] | @tsv'
  local rulesets
  rulesets=$(api "https://firebaserules.googleapis.com/v1/projects/$PROJECT/releases" | jq -r '[.releases[]?.rulesetName] | unique | .[]')
  for rs in $rulesets; do
    echo "# $rs"
    api "https://firebaserules.googleapis.com/v1/$rs" | jq -r '.source.files[] | "--- \(.name)\n\(.content)"'
  done
}

service_accounts() {
  gcloud iam service-accounts list --project "$PROJECT" --format='table(email,displayName,disabled)'
  for sa in $(gcloud iam service-accounts list --project "$PROJECT" --format='value(email)'); do
    echo "# keys for $sa (IDs and validity only)"
    gcloud iam service-accounts keys list --iam-account "$sa" --project "$PROJECT" \
      --format='table(name.basename():label=KEY_ID,keyType,validAfterTime,validBeforeTime,disabled)'
  done
}
export -f hosting_summary rules_summary service_accounts

{
  printf '# CLI snapshot: `%s`\n\n' "$PROJECT"
  printf 'Captured %s with read-only calls by `scripts/retirement-capture/app/cli-snapshot.sh`.\n' "$(date -u +%Y-%m-%dT%H:%MZ)"
  printf 'Redacted before writing: emails and UIDs other than the walkthrough account, tokens, API keys, the password-hash signer key, billing account IDs.\n'

  section 'Billing linkage' "gcloud billing projects describe $PROJECT"
  section 'Enabled services' "gcloud services list --enabled --project $PROJECT --format='value(config.name)' | sort"
  section 'Cloud Functions: api' "gcloud functions describe api --region $REGION --project $PROJECT --format=yaml"
  section 'Cloud Functions: beforecreated' "gcloud functions describe beforecreated --region $REGION --project $PROJECT --format=yaml"
  section 'Cloud Run services' "gcloud run services list --project $PROJECT --format='table(metadata.name,status.url,status.latestReadyRevisionName)'"
  for svc in $(gcloud run services list --project "$PROJECT" --format='value(metadata.name)' 2>/dev/null); do
    section "Cloud Run: $svc" "gcloud run services describe $svc --region $REGION --project $PROJECT --format=yaml"
  done
  section 'Identity Toolkit config' "api https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT/config | strip_secrets"
  section 'Identity Toolkit: built-in IdPs (Google, GitHub, Twitter, ...)' "api https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT/defaultSupportedIdpConfigs | strip_secrets"
  section 'Identity Toolkit: OAuth/OIDC IdPs' "api https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT/oauthIdpConfigs | strip_secrets"
  section 'Auth user count (count only, no user records)' "api -X POST -d '{\"returnUserInfo\": false}' https://identitytoolkit.googleapis.com/v1/projects/$PROJECT/accounts:query | jq '{recordsCount}'"
  section 'App Check enforcement' "api https://firebaseappcheck.googleapis.com/v1/projects/$PROJECT/services | jq ."
  section 'Hosting sites, channels, releases' hosting_summary
  section 'Security rules releases and sources (Storage, Firestore)' rules_summary
  section 'Firestore databases' "gcloud firestore databases list --project $PROJECT --format=yaml"
  section 'Realtime Database instances' "api https://firebasedatabase.googleapis.com/v1beta/projects/$PROJECT/locations/-/instances | jq ."
  section 'Cloud Storage buckets' "gcloud storage buckets list --project $PROJECT --format='table(name,location,storage_class,creation_time)'"
  section 'Artifact Registry repositories and sizes' "gcloud artifacts repositories list --project $PROJECT --format='table(name.basename(),format,location,sizeBytes.size(units_out=M):label=SIZE_MB,updateTime)'"
  section 'IAM service accounts (key IDs only, never key material)' service_accounts
} | python3 "$HERE/redact.py" >"$OUT"
