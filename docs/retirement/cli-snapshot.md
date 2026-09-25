# CLI snapshot: `usersrole`

Captured 2026-09-25T00:29Z with read-only calls by `scripts/retirement-capture/app/cli-snapshot.sh`.
Redacted before writing: emails and UIDs other than the walkthrough account, tokens, API keys, the password-hash signer key, billing account IDs.

## Billing linkage

```console
$ gcloud billing projects describe usersrole
billingAccountName: billingAccounts/XXXXXX-XXXXXX-XX291D
billingEnabled: true
name: projects/usersrole/billingInfo
projectId: usersrole
```

## Enabled services

```console
$ gcloud services list --enabled --project usersrole --format='value(config.name)' | sort
appengine.googleapis.com
artifactregistry.googleapis.com
bigquery.googleapis.com
bigquerymigration.googleapis.com
bigquerystorage.googleapis.com
cloudapis.googleapis.com
cloudbilling.googleapis.com
cloudbuild.googleapis.com
cloudfunctions.googleapis.com
cloudresourcemanager.googleapis.com
cloudtrace.googleapis.com
containerregistry.googleapis.com
datastore.googleapis.com
deploymentmanager.googleapis.com
eventarc.googleapis.com
fcm.googleapis.com
fcmregistrations.googleapis.com
firebaseappcheck.googleapis.com
firebaseappdistribution.googleapis.com
firebasedynamiclinks.googleapis.com
firebaseextensions.googleapis.com
firebase.googleapis.com
firebasehosting.googleapis.com
firebaseinstallations.googleapis.com
firebaseml.googleapis.com
firebaseremoteconfig.googleapis.com
<redacted-uid>.googleapis.com
firebaserules.googleapis.com
firestore.googleapis.com
identitytoolkit.googleapis.com
logging.googleapis.com
mlkit.googleapis.com
mobilecrashreporting.googleapis.com
monitoring.googleapis.com
pubsub.googleapis.com
recaptchaenterprise.googleapis.com
run.googleapis.com
runtimeconfig.googleapis.com
securetoken.googleapis.com
servicemanagement.googleapis.com
serviceusage.googleapis.com
source.googleapis.com
sql-component.googleapis.com
storage-api.googleapis.com
storage-component.googleapis.com
storage.googleapis.com
testing.googleapis.com
```

## Cloud Functions: api

```console
$ gcloud functions describe api --region us-central1 --project usersrole --format=yaml
buildConfig:
  automaticUpdatePolicy: {}
  build: projects/867125446811/locations/us-central1/builds/dce4ab3e-f79b-4acc-9d5f-0abd78adfd67
  dockerRegistry: ARTIFACT_REGISTRY
  dockerRepository: projects/usersrole/locations/us-central1/repositories/gcf-artifacts
  entryPoint: api
  environmentVariables:
    GOOGLE_NODE_RUN_SCRIPTS: ''
  runtime: nodejs22
  source:
    storageSource:
      bucket: gcf-v2-sources-867125446811-us-central1
      generation: '1790138789187399'
      object: api/function-source.zip
  sourceProvenance:
    resolvedStorageSource:
      bucket: gcf-v2-sources-867125446811-us-central1
      generation: '1790138789187399'
      object: api/function-source.zip
createTime: '2026-09-23T03:02:46.683622916Z'
environment: GEN_2
labels:
  deployment-tool: cli-firebase
  firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
name: projects/usersrole/locations/us-central1/functions/api
satisfiesPzi: true
serviceConfig:
  allTrafficOnLatestRevision: true
  availableCpu: '1'
  availableMemory: 256Mi
  environmentVariables:
    EVENTARC_CLOUD_EVENT_SOURCE: projects/usersrole/locations/us-central1/services/api
    FIREBASE_CONFIG: '{"projectId":"usersrole","storageBucket":"usersrole.firebasestorage.app"}'
    FUNCTION_REGION: us-central1
    FUNCTION_TARGET: api
    GCLOUD_PROJECT: usersrole
    LOG_EXECUTION_ID: 'true'
  ingressSettings: ALLOW_ALL
  maxInstanceCount: 20
  maxInstanceRequestConcurrency: 80
  revision: api-00002-guy
  service: projects/usersrole/locations/us-central1/services/api
  serviceAccountEmail: <redacted-email>
  timeoutSeconds: 60
  uri: https://api-yuquaflafa-uc.a.run.app
state: ACTIVE
updateTime: '2026-09-23T04:47:14.726211330Z'
url: https://us-central1-usersrole.cloudfunctions.net/api
```

## Cloud Functions: beforecreated

```console
$ gcloud functions describe beforecreated --region us-central1 --project usersrole --format=yaml
buildConfig:
  build: projects/867125446811/locations/us-central1/builds/fadab52b-4bab-442e-981c-ba8ccd0492ae
  dockerRegistry: ARTIFACT_REGISTRY
  dockerRepository: projects/usersrole/locations/us-central1/repositories/gcf-artifacts
  entryPoint: beforecreated
  environmentVariables:
    GOOGLE_NODE_RUN_SCRIPTS: ''
  runtime: nodejs22
  source:
    storageSource:
      bucket: gcf-v2-sources-867125446811-us-central1
      generation: '1790138827552296'
      object: beforecreated/function-source.zip
  sourceProvenance:
    resolvedStorageSource:
      bucket: gcf-v2-sources-867125446811-us-central1
      generation: '1790138827552296'
      object: beforecreated/function-source.zip
createTime: '2023-08-12T19:26:36.712283678Z'
environment: GEN_2
labels:
  deployment-blocking: before-create
  deployment-tool: cli-firebase
  firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
name: projects/usersrole/locations/us-central1/functions/beforecreated
satisfiesPzi: true
serviceConfig:
  allTrafficOnLatestRevision: true
  availableCpu: '1'
  availableMemory: 256Mi
  environmentVariables:
    EVENTARC_CLOUD_EVENT_SOURCE: projects/usersrole/locations/us-central1/services/beforecreated
    FIREBASE_CONFIG: '{"projectId":"usersrole","storageBucket":"usersrole.firebasestorage.app"}'
    FUNCTION_REGION: us-central1
    FUNCTION_SIGNATURE_TYPE: http
    FUNCTION_TARGET: beforecreated
    GCLOUD_PROJECT: usersrole
    LOG_EXECUTION_ID: 'true'
  ingressSettings: ALLOW_ALL
  maxInstanceCount: 20
  maxInstanceRequestConcurrency: 80
  revision: beforecreated-00010-mit
  service: projects/usersrole/locations/us-central1/services/beforecreated
  serviceAccountEmail: <redacted-email>
  timeoutSeconds: 60
  uri: https://beforecreated-yuquaflafa-uc.a.run.app
state: ACTIVE
updateTime: '2026-09-23T04:47:58.896187815Z'
url: https://us-central1-usersrole.cloudfunctions.net/beforecreated
```

## Cloud Run services

```console
$ gcloud run services list --project usersrole --format='table(metadata.name,status.url,status.latestReadyRevisionName)'
NAME           URL                                            LATEST_READY_REVISION_NAME
api            https://api-yuquaflafa-uc.a.run.app            api-00002-guy
beforecreated  https://beforecreated-yuquaflafa-uc.a.run.app  beforecreated-00010-mit
```

## Cloud Run: api

```console
$ gcloud run services describe api --region us-central1 --project usersrole --format=yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  annotations:
    cloudfunctions.googleapis.com/function-id: api
    run.googleapis.com/build-base-image: us-central1-docker.pkg.dev/serverless-runtimes/google-22-full/runtimes/nodejs22
    run.googleapis.com/build-enable-automatic-updates: 'true'
    run.googleapis.com/build-environment-variables: '{"GOOGLE_NODE_RUN_SCRIPTS":""}'
    run.googleapis.com/build-function-target: api
    run.googleapis.com/build-image-uri: us-central1-docker.pkg.dev/usersrole/gcf-artifacts/usersrole__us--central1__api:version_1
    run.googleapis.com/build-name: projects/867125446811/locations/us-central1/builds/dce4ab3e-f79b-4acc-9d5f-0abd78adfd67
    run.googleapis.com/build-source-location: gs://gcf-v2-sources-867125446811-us-central1/api/function-source.zip#1790138789187399
    run.googleapis.com/client-name: cli-firebase
    run.googleapis.com/custom-audiences: '["https://us-central1-usersrole.cloudfunctions.net/api"]'
    run.googleapis.com/ingress: all
    run.googleapis.com/ingress-status: all
    run.googleapis.com/maxScale: '20'
    run.googleapis.com/operation-id: 7b9bcd52-5c89-447d-977f-d870cd9f3a0e
    run.googleapis.com/urls: '["https://api-867125446811.us-central1.run.app","https://us-central1-usersrole.cloudfunctions.net/api","https://api-yuquaflafa-uc.a.run.app"]'
    serving.knative.dev/creator: <redacted-email>
    serving.knative.dev/lastModifier: <redacted-email>
  creationTimestamp: '2026-09-23T03:03:36.837232Z'
  generation: 2
  labels:
    cloud.googleapis.com/location: us-central1
    firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
    goog-cloudfunctions-runtime: nodejs22
    goog-drz-cloudfunctions-id: api
    goog-drz-cloudfunctions-location: us-central1
    goog-managed-by: cloudfunctions
  name: api
  namespace: '867125446811'
  resourceVersion: AAZcHy1Sw2g
  selfLink: /apis/serving.knative.dev/v1/namespaces/867125446811/services/api
  uid: 9c31e65f-5c27-418d-a6b2-88410bc8ff28
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: '20'
        cloudfunctions.googleapis.com/trigger-type: HTTP_TRIGGER
        run.googleapis.com/base-images: '{"worker":"us-central1-docker.pkg.dev/serverless-runtimes/google-22-full/runtimes/nodejs22"}'
        run.googleapis.com/client-name: cli-firebase
        run.googleapis.com/startup-cpu-boost: 'true'
      labels:
        firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
        goog-drz-cloudfunctions-id: api
        goog-drz-cloudfunctions-location: us-central1
        run.googleapis.com/startupProbeType: Default
      name: api-00002-guy
    spec:
      containerConcurrency: 80
      containers:
      - env:
        - name: FIREBASE_CONFIG
          value: '{"projectId":"usersrole","storageBucket":"usersrole.firebasestorage.app"}'
        - name: GCLOUD_PROJECT
          value: usersrole
        - name: EVENTARC_CLOUD_EVENT_SOURCE
          value: projects/usersrole/locations/us-central1/services/api
        - name: FUNCTION_REGION
          value: us-central1
        - name: FUNCTION_TARGET
          value: api
        - name: LOG_EXECUTION_ID
          value: 'true'
        image: us-central1-docker.pkg.dev/usersrole/gcf-artifacts/usersrole__us--central1__api:version_1
        name: worker
        ports:
        - containerPort: 8080
          name: http1
        resources:
          limits:
            cpu: '1'
            memory: 256Mi
        startupProbe:
          failureThreshold: 1
          periodSeconds: 240
          tcpSocket:
            port: 8080
          timeoutSeconds: 240
      runtimeClassName: run.googleapis.com/linux-base-image-update
      serviceAccountName: <redacted-email>
      timeoutSeconds: 60
  traffic:
  - latestRevision: true
    percent: 100
status:
  address:
    url: https://api-yuquaflafa-uc.a.run.app
  conditions:
  - lastTransitionTime: '2026-09-23T04:47:14.404200Z'
    status: 'True'
    type: Ready
  - lastTransitionTime: '2026-09-23T04:47:08.367501Z'
    status: 'True'
    type: ConfigurationsReady
  - lastTransitionTime: '2026-09-23T04:47:14.354380Z'
    status: 'True'
    type: RoutesReady
  latestCreatedRevisionName: api-00002-guy
  latestReadyRevisionName: api-00002-guy
  observedGeneration: 2
  traffic:
  - latestRevision: true
    percent: 100
    revisionName: api-00002-guy
  url: https://api-yuquaflafa-uc.a.run.app
```

## Cloud Run: beforecreated

```console
$ gcloud run services describe beforecreated --region us-central1 --project usersrole --format=yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  annotations:
    cloudfunctions.googleapis.com/function-id: beforecreated
    run.googleapis.com/build-base-image: us-central1-docker.pkg.dev/serverless-runtimes/google-22-full/runtimes/nodejs22
    run.googleapis.com/build-enable-automatic-updates: 'false'
    run.googleapis.com/build-environment-variables: '{"GOOGLE_NODE_RUN_SCRIPTS":""}'
    run.googleapis.com/build-function-target: beforecreated
    run.googleapis.com/build-image-uri: us-central1-docker.pkg.dev/usersrole/gcf-artifacts/usersrole__us--central1__beforecreated:version_1
    run.googleapis.com/build-name: projects/867125446811/locations/us-central1/builds/fadab52b-4bab-442e-981c-ba8ccd0492ae
    run.googleapis.com/build-source-location: gs://gcf-v2-sources-867125446811-us-central1/beforecreated/function-source.zip#1790138827552296
    run.googleapis.com/client-name: cli-firebase
    run.googleapis.com/custom-audiences: '["https://us-central1-usersrole.cloudfunctions.net/beforecreated"]'
    run.googleapis.com/ingress: all
    run.googleapis.com/ingress-status: all
    run.googleapis.com/operation-id: f88ac26f-366b-4839-8370-bdc7b745a567
    run.googleapis.com/urls: '["https://beforecreated-867125446811.us-central1.run.app","https://us-central1-usersrole.cloudfunctions.net/beforecreated","https://beforecreated-yuquaflafa-uc.a.run.app"]'
    serving.knative.dev/creator: <redacted-email>
    serving.knative.dev/lastModifier: <redacted-email>
  creationTimestamp: '2023-08-12T19:27:18.320392Z'
  generation: 10
  labels:
    cloud.googleapis.com/location: us-central1
    deployment-blocking: before-create
    firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
    goog-cloudfunctions-runtime: nodejs22
    goog-managed-by: cloudfunctions
  name: beforecreated
  namespace: '867125446811'
  resourceVersion: AAZcHy/1FLw
  selfLink: /apis/serving.knative.dev/v1/namespaces/867125446811/services/beforecreated
  uid: 3a0b6a3b-fd0b-4f17-85a1-b62b8d045f76
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: '20'
        cloudfunctions.googleapis.com/trigger-type: HTTP_TRIGGER
        run.googleapis.com/client-name: cli-firebase
        run.googleapis.com/startup-cpu-boost: 'true'
      labels:
        deployment-blocking: before-create
        firebase-functions-hash: 4376aa28f8d5d81d712f5d96b62c09120674d7ce
        run.googleapis.com/startupProbeType: Default
      name: beforecreated-00010-mit
    spec:
      containerConcurrency: 80
      containers:
      - env:
        - name: FIREBASE_CONFIG
          value: '{"projectId":"usersrole","storageBucket":"usersrole.firebasestorage.app"}'
        - name: GCLOUD_PROJECT
          value: usersrole
        - name: EVENTARC_CLOUD_EVENT_SOURCE
          value: projects/usersrole/locations/us-central1/services/beforecreated
        - name: FUNCTION_REGION
          value: us-central1
        - name: FUNCTION_TARGET
          value: beforecreated
        - name: LOG_EXECUTION_ID
          value: 'true'
        - name: FUNCTION_SIGNATURE_TYPE
          value: http
        image: us-central1-docker.pkg.dev/usersrole/gcf-artifacts/usersrole__us--central1__beforecreated:version_1
        name: worker
        ports:
        - containerPort: 8080
          name: http1
        resources:
          limits:
            cpu: '1'
            memory: 256Mi
        startupProbe:
          failureThreshold: 1
          periodSeconds: 240
          tcpSocket:
            port: 8080
          timeoutSeconds: 240
      serviceAccountName: <redacted-email>
      timeoutSeconds: 60
  traffic:
  - latestRevision: true
    percent: 100
status:
  address:
    url: https://beforecreated-yuquaflafa-uc.a.run.app
  conditions:
  - lastTransitionTime: '2026-09-23T04:47:58.596284Z'
    status: 'True'
    type: Ready
  - lastTransitionTime: '2026-09-23T04:47:53.165094Z'
    status: 'True'
    type: ConfigurationsReady
  - lastTransitionTime: '2026-09-23T04:47:58.547494Z'
    status: 'True'
    type: RoutesReady
  latestCreatedRevisionName: beforecreated-00010-mit
  latestReadyRevisionName: beforecreated-00010-mit
  observedGeneration: 10
  traffic:
  - latestRevision: true
    percent: 100
    revisionName: beforecreated-00010-mit
  url: https://beforecreated-yuquaflafa-uc.a.run.app
```

## Identity Toolkit config

```console
$ api https://identitytoolkit.googleapis.com/admin/v2/projects/usersrole/config | strip_secrets
{
  "name": "projects/867125446811/config",
  "signIn": {
    "email": {
      "enabled": true,
      "passwordRequired": true
    },
    "anonymous": {}
  },
  "notification": {
    "sendEmail": {
      "method": "DEFAULT",
      "resetPasswordTemplate": {
        "senderLocalPart": "noreply",
        "subject": "Reset your password for %APP_NAME%",
        "body": "<p>Hello,</p>\n<p>Follow this link to reset your %APP_NAME% password for your %EMAIL% account.</p>\n<p><a href='%LINK%'>%LINK%</a></p>\n<p>If you didn’t ask to reset your password, you can ignore this email.</p>\n<p>Thanks,</p>\n<p>Your %APP_NAME% team</p>",
        "bodyFormat": "HTML",
        "replyTo": "noreply"
      },
      "verifyEmailTemplate": {
        "senderLocalPart": "noreply",
        "subject": "Verify your email for %APP_NAME%",
        "body": "<p>Hello %DISPLAY_NAME%,</p>\n<p>Follow this link to verify your email address.</p>\n<p><a href='%LINK%'>%LINK%</a></p>\n<p>If you didn’t ask to verify this address, you can ignore this email.</p>\n<p>Thanks,</p>\n<p>Your %APP_NAME% team</p>",
        "bodyFormat": "HTML",
        "replyTo": "noreply"
      },
      "changeEmailTemplate": {
        "senderLocalPart": "noreply",
        "subject": "Your sign-in email was changed for %APP_NAME%",
        "body": "<p>Hello %DISPLAY_NAME%,</p>\n<p>Your sign-in email for %APP_NAME% was changed to %NEW_EMAIL%.</p>\n<p>If you didn’t ask to change your email, follow this link to reset your sign-in email.</p>\n<p><a href='%LINK%'>%LINK%</a></p>\n<p>Thanks,</p>\n<p>Your %APP_NAME% team</p>",
        "bodyFormat": "HTML",
        "replyTo": "noreply"
      },
      "callbackUri": "https://usersrole.firebaseapp.com/__/auth/action",
      "dnsInfo": {
        "customDomainState": "NOT_STARTED",
        "domainVerificationRequestTime": "1970-01-01T00:00:00Z"
      },
      "revertSecondFactorAdditionTemplate": {
        "senderLocalPart": "noreply",
        "subject": "You've added 2 step verification to your %APP_NAME% account.",
        "body": "<p>Hello %DISPLAY_NAME%,</p>\n<p>Your account in %APP_NAME% has been updated with %SECOND_FACTOR% for 2-step verification.</p>\n<p>If you didn't add this 2-step verification, click the link below to remove it.</p>\n<p><a href='%LINK%'>%LINK%</a></p>\n<p>Thanks,</p>\n<p>Your %APP_NAME% team</p>",
        "bodyFormat": "HTML",
        "replyTo": "noreply"
      }
    },
    "sendSms": {
      "smsTemplate": {
        "content": "%LOGIN_CODE% is your verification code for %APP_NAME%."
      }
    },
    "defaultLocale": "en"
  },
  "quota": {},
  "monitoring": {
    "requestLogging": {}
  },
  "multiTenant": {},
  "authorizedDomains": [
    "localhost",
    "usersrole.firebaseapp.com",
    "usersrole.web.app",
    "jdwillmsen.github.io",
    "usersrole--pr125-fix-js-yaml-override-rixqd6f9.web.app",
    "usersrole--pr126-ci-automerge-dependa-vnvqpfiy.web.app",
    "usersrole--pr127-ci-dependabot-versio-8oj2m3f1.web.app",
    "usersrole--pr132-fix-dependabot-group-2vwurmpx.web.app",
    "usersrole--pr135-fix-dependabot-angul-prmlxpkf.web.app",
    "usersrole--pr136-ci-automerge-dev-maj-1nqp7wif.web.app",
    "usersrole--pr137-fix-ci-concurrency-a-qzjgemih.web.app",
    "usersrole--pr139-chore-remove-dead-ci-j37b1vvb.web.app",
    "usersrole--pr140-chore-renovate-repla-0k59gd7v.web.app",
    "usersrole--pr138-fix-deps-clear-advis-klh8xzvb.web.app",
    "usersrole--pr141-renovate-configure-87xpihei.web.app",
    "usersrole--pr143-fix-deps-drop-cypres-8mabuw5i.web.app",
    "usersrole--pr144-fix-deps-functions-l-fd2egegx.web.app",
    "usersrole--pr145-fix-usersrole-codeql-hh26oip1.web.app",
    "usersrole--pr146-chore-renovate-autom-m8rvix4n.web.app",
    "usersrole--pr147-feat-release-equals-537ji3h6.web.app",
    "usersrole--pr148-feat-deploy-function-mz1a29o4.web.app",
    "usersrole--pr149-renovate-all-minor-p-dm4s553f.web.app",
    "usersrole--pr150-feat-jdwlabs-627-cap-3odfzwin.web.app",
    "usersrole--pr151-feat-jdwlabs-630-rep-dkok6rhg.web.app"
  ],
  "subtype": "IDENTITY_PLATFORM",
  "client": {
    "apiKey": "<redacted>",
    "permissions": {},
    "firebaseSubdomain": "usersrole"
  },
  "mfa": {
    "state": "DISABLED"
  },
  "blockingFunctions": {
    "triggers": {
      "beforeCreate": {
        "functionUri": "https://beforecreated-yuquaflafa-uc.a.run.app",
        "updateTime": "2026-09-24T03:26:45.441Z"
      }
    },
    "forwardInboundCredentials": {}
  },
  "smsRegionConfig": {},
  "mobileLinksConfig": {},
  "defaultHostingSite": "usersrole"
}
```

## Identity Toolkit: built-in IdPs (Google, GitHub, Twitter, ...)

```console
$ api https://identitytoolkit.googleapis.com/admin/v2/projects/usersrole/defaultSupportedIdpConfigs | strip_secrets
{
  "defaultSupportedIdpConfigs": [
    {
      "name": "projects/867125446811/defaultSupportedIdpConfigs/github.com",
      "enabled": true,
      "clientId": "1554ed7f5124f305aef7"
    },
    {
      "name": "projects/867125446811/defaultSupportedIdpConfigs/google.com",
      "enabled": true,
      "clientId": "867125446811-2habp7jva0lvr5mjl21p6pgj1uods4qd.apps.googleusercontent.com"
    },
    {
      "name": "projects/867125446811/defaultSupportedIdpConfigs/twitter.com",
      "enabled": true,
      "clientId": "tlbmgFJ9K3Jz7F8bxX9K1mx7i"
    }
  ]
}
```

## Identity Toolkit: OAuth/OIDC IdPs

```console
$ api https://identitytoolkit.googleapis.com/admin/v2/projects/usersrole/oauthIdpConfigs | strip_secrets
{}
```

## Auth user count (count only, no user records)

```console
$ api -X POST -d '{"returnUserInfo": false}' https://identitytoolkit.googleapis.com/v1/projects/usersrole/accounts:query | jq '{recordsCount}'
{
  "recordsCount": "89"
}
```

## App Check enforcement

```console
$ api https://firebaseappcheck.googleapis.com/v1/projects/usersrole/services | jq .
{
  "services": [
    {
      "name": "projects/867125446811/services/firestore.googleapis.com",
      "enforcementMode": "ENFORCED",
      "updateTime": "2023-10-01T04:29:52.941551Z",
      "etag": "\"KmwaffwVQ7rYBA0=\""
    },
    {
      "name": "projects/867125446811/services/identitytoolkit.googleapis.com",
      "enforcementMode": "ENFORCED",
      "updateTime": "2023-10-01T04:29:35.469791Z",
      "etag": "\"RZdQvVrXeEsOptE=\""
    }
  ]
}
```

## Hosting sites, channels, releases

```console
$ hosting_summary
# projects/usersrole/sites/usersrole
{
  "defaultUrl": "https://usersrole.web.app",
  "type": "DEFAULT_SITE",
  "appId": "1:867125446811:web:a9e028ab9b9805c4381e3e"
}
# channels
pr151-feat-JDWLABS-630-rep	https://usersrole--pr151-feat-jdwlabs-630-rep-dkok6rhg.web.app	2026-10-01T03:26:40.411616991Z	FINALIZED	2026-09-24T03:26:43.345Z
pr150-feat-JDWLABS-627-cap	https://usersrole--pr150-feat-jdwlabs-627-cap-3odfzwin.web.app	2026-10-01T03:01:38.511369394Z	FINALIZED	2026-09-24T03:01:41.787Z
live	https://usersrole.web.app	never	FINALIZED	2026-09-23T04:49:56.389Z
pr149-renovate-all-minor-p	https://usersrole--pr149-renovate-all-minor-p-dm4s553f.web.app	2026-09-30T04:43:06.621628760Z	FINALIZED	2026-09-23T04:43:08.910Z
pr148-feat-deploy-function	https://usersrole--pr148-feat-deploy-function-mz1a29o4.web.app	2026-09-30T02:44:38.935109103Z	FINALIZED	2026-09-23T02:44:42.318Z
pr147-feat-release-equals-	https://usersrole--pr147-feat-release-equals-537ji3h6.web.app	2026-09-29T17:19:05.167056055Z	FINALIZED	2026-09-22T17:19:08.638Z
pr146-chore-renovate-autom	https://usersrole--pr146-chore-renovate-autom-m8rvix4n.web.app	2026-09-29T06:33:26.363078010Z	FINALIZED	2026-09-22T06:33:29.813Z
pr145-fix-usersrole-codeql	https://usersrole--pr145-fix-usersrole-codeql-hh26oip1.web.app	2026-09-29T04:51:34.352223695Z	FINALIZED	2026-09-22T04:51:38.166Z
pr144-fix-deps-functions-l	https://usersrole--pr144-fix-deps-functions-l-fd2egegx.web.app	2026-09-29T03:24:07.261581902Z	FINALIZED	2026-09-22T03:24:09.138Z
pr143-fix-deps-drop-cypres	https://usersrole--pr143-fix-deps-drop-cypres-8mabuw5i.web.app	2026-09-28T07:52:25.790996935Z	FINALIZED	2026-09-21T07:52:28.013Z
pr141-renovate-configure	https://usersrole--pr141-renovate-configure-87xpihei.web.app	2026-09-28T07:19:09.855375136Z	FINALIZED	2026-09-21T07:19:12.034Z
pr140-chore-renovate-repla	https://usersrole--pr140-chore-renovate-repla-0k59gd7v.web.app	2026-09-28T07:18:03.605709336Z	FINALIZED	2026-09-21T07:18:07.171Z
pr138-fix-deps-clear-advis	https://usersrole--pr138-fix-deps-clear-advis-klh8xzvb.web.app	2026-09-28T06:56:42.013966410Z	FINALIZED	2026-09-21T06:56:44.052Z
pr139-chore-remove-dead-ci	https://usersrole--pr139-chore-remove-dead-ci-j37b1vvb.web.app	2026-09-28T06:13:16.736874413Z	FINALIZED	2026-09-21T06:13:20.186Z
pr137-fix-ci-concurrency-a	https://usersrole--pr137-fix-ci-concurrency-a-qzjgemih.web.app	2026-09-28T05:22:26.078931416Z	FINALIZED	2026-09-21T05:22:27.845Z
pr136-ci-automerge-dev-maj	https://usersrole--pr136-ci-automerge-dev-maj-1nqp7wif.web.app	2026-09-28T05:19:53.063675939Z	FINALIZED	2026-09-21T05:19:57.900Z
pr135-fix-dependabot-angul	https://usersrole--pr135-fix-dependabot-angul-prmlxpkf.web.app	2026-09-28T03:49:07.149939949Z	FINALIZED	2026-09-21T03:49:10.203Z
pr132-fix-dependabot-group	https://usersrole--pr132-fix-dependabot-group-2vwurmpx.web.app	2026-09-28T01:32:37.566367160Z	FINALIZED	2026-09-21T01:32:39.443Z
pr127-ci-dependabot-versio	https://usersrole--pr127-ci-dependabot-versio-8oj2m3f1.web.app	2026-09-25T06:21:24.815485650Z	FINALIZED	2026-09-18T06:21:28.491Z
pr126-ci-automerge-dependa	https://usersrole--pr126-ci-automerge-dependa-vnvqpfiy.web.app	2026-09-25T05:15:51.319718192Z	FINALIZED	2026-09-18T05:15:54.634Z
# last 10 releases
2026-09-23T04:49:56.389Z	DEPLOY	2582c305234b7319	FINALIZED	33	
2026-09-22T17:29:31.227Z	DEPLOY	0bd3e572cd61a57b	FINALIZED	33	
2026-09-22T06:40:20.152Z	DEPLOY	fa6af97bf9c57f76	FINALIZED	33	
2026-09-22T04:59:41.881Z	DEPLOY	88d05ee1315527d2	FINALIZED	33	
2026-09-22T03:26:27.425Z	DEPLOY	f7f930bbafc994ca	FINALIZED	33	
2026-09-21T07:54:50.586Z	DEPLOY	5c0fc926c7d1b265	FINALIZED	33	
2026-09-21T07:24:48.164Z	DEPLOY	5547eabeb2b0405a	FINALIZED	33	
2026-09-21T06:59:09.694Z	DEPLOY	dbbaf573f87000d4	FINALIZED	33	
2026-09-21T06:15:46.265Z	DEPLOY	acafee5d98afc295	FINALIZED	33	
2026-09-21T05:25:48.228Z	DEPLOY	b9ebb2f8e662ff88	FINALIZED	33	
```

## Security rules releases and sources (Storage, Firestore)

```console
$ rules_summary
projects/usersrole/releases/cloud.firestore	projects/usersrole/rulesets/7089022e-31bb-4629-80ab-abcb78ef1b91	2023-08-12T02:59:13.057930Z
# projects/usersrole/rulesets/7089022e-31bb-4629-80ab-abcb78ef1b91
--- firestore.rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{user} {
    	allow create: if request.auth.uid != null;
      allow read, write, update, delete: if request.auth.uid == user || isAdminOrManager();
    }
    
    function isAdminOrManager() {
    	return request.auth.token.roles.hasAny(["manager", "admin"]);
    }
  }
}
```

## Firestore databases

```console
$ gcloud firestore databases list --project usersrole --format=yaml
---
appEngineIntegrationMode: DISABLED
concurrencyMode: PESSIMISTIC
createTime: '2023-07-24T01:49:14.393378Z'
databaseEdition: STANDARD
deleteProtectionState: DELETE_PROTECTION_DISABLED
earliestVersionTime: '2026-09-24T23:29:57.488750Z'
enhancedTextSearchQueryMode: ENHANCED_QUERY_MODE_ENABLED
etag: IKCdhYe9iJcDMLKlwJnU0JYD
freeTier: true
keyPrefix: s
locationId: nam5
name: projects/usersrole/databases/(default)
pointInTimeRecoveryEnablement: POINT_IN_TIME_RECOVERY_DISABLED
realtimeUpdatesMode: REALTIME_UPDATES_MODE_ENABLED
type: FIRESTORE_NATIVE
uid: 9e32c248-bc47-46a9-ab8b-ac275f161b4e
updateTime: '2023-07-24T01:49:14.393378Z'
versionRetentionPeriod: 3600s
```

## Realtime Database instances

```console
$ api https://firebasedatabase.googleapis.com/v1beta/projects/usersrole/locations/-/instances | jq .
{
  "error": {
    "code": 403,
    "message": "Firebase Realtime Database Management API has not been used in project usersrole before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/firebasedatabase.googleapis.com/overview?project=usersrole then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.",
    "status": "PERMISSION_DENIED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "SERVICE_DISABLED",
        "domain": "googleapis.com",
        "metadata": {
          "containerInfo": "usersrole",
          "service": "firebasedatabase.googleapis.com",
          "consumer": "projects/usersrole",
          "serviceTitle": "Firebase Realtime Database Management API",
          "activationUrl": "https://console.developers.google.com/apis/api/firebasedatabase.googleapis.com/overview?project=usersrole"
        }
      },
      {
        "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
        "locale": "en-US",
        "message": "Firebase Realtime Database Management API has not been used in project usersrole before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/firebasedatabase.googleapis.com/overview?project=usersrole then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry."
      },
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Google developers console API activation",
            "url": "https://console.developers.google.com/apis/api/firebasedatabase.googleapis.com/overview?project=usersrole"
          }
        ]
      }
    ]
  }
}
```

## Cloud Storage buckets

```console
$ gcloud storage buckets list --project usersrole --format='table(name,location,storage_class,creation_time)'
NAME                                                                LOCATION     STORAGE_CLASS  CREATION_TIME
gcf-sources-867125446811-us-central1                                US-CENTRAL1                 2023-06-07T05:17:59+0000
gcf-v2-sources-867125446811-us-central1                             US-CENTRAL1                 2023-08-12T19:26:36+0000
gcf-v2-uploads-867125446811-us-central1                             US-CENTRAL1                 2023-08-12T19:26:35+0000
gcf-v2-uploads-867125446811.us-central1.cloudfunctions.appspot.com  US-CENTRAL1                 2026-09-23T02:53:31+0000
```

## Artifact Registry repositories and sizes

```console
$ gcloud artifacts repositories list --project usersrole --format='table(name.basename(),format,location,sizeBytes.size(units_out=M):label=SIZE_MB,updateTime)'
Listing items under project usersrole, across all locations.

REPOSITORY     FORMAT  LOCATION  SIZE_MB  UPDATE_TIME
gcf-artifacts  DOCKER            0        2026-09-24T08:42:32
```

## IAM service accounts (key IDs only, never key material)

```console
$ service_accounts
EMAIL                                                      DISPLAY NAME                          DISABLED
<redacted-email>  GitHub Actions (jdwillmsen/frontend)  False
<redacted-email>  firebase-adminsdk                     False
<redacted-email>         Default compute service account       False
<redacted-email>                      App Engine default service account    False
# keys for <redacted-email> (IDs and validity only)
KEY_ID                                    KEY_TYPE        CREATED_AT            EXPIRES_AT            DISABLED
4e3a475ea4badecad3ae6b9458a87486ad73d305  USER_MANAGED    2023-05-29T23:45:36Z  9999-12-31T23:59:59Z
d385260754d8b4aec53e025dcc7b489b4566bfa7  SYSTEM_MANAGED  2025-03-05T19:10:37Z  2027-03-28T03:17:36Z
# keys for <redacted-email> (IDs and validity only)
KEY_ID                                    KEY_TYPE        CREATED_AT            EXPIRES_AT            DISABLED
a49c0fecfdebd074c1b5efcb7f0a8b1fc4a0775c  SYSTEM_MANAGED  2025-01-24T04:43:02Z  2027-02-09T13:15:55Z
# keys for <redacted-email> (IDs and validity only)
KEY_ID                                    KEY_TYPE        CREATED_AT            EXPIRES_AT            DISABLED
8c01ccb320931b09f7cf44f8a3579ab3c9890e17  SYSTEM_MANAGED  2025-05-31T17:17:37Z  2027-06-19T05:11:56Z
# keys for <redacted-email> (IDs and validity only)
KEY_ID                                    KEY_TYPE        CREATED_AT            EXPIRES_AT            DISABLED
a7d8d3b422a5965c48b32348568313b38151cf86  SYSTEM_MANAGED  2025-03-26T23:36:17Z  2027-03-29T16:11:35Z
```
