# Replicating Users Role

The hosted app at `usersrole.web.app` is retired and its Google Cloud project
is deleted. This guide gets you your own copy, two ways:

1. **[Run it locally on the Firebase Emulator Suite](#1-run-it-locally-on-the-emulators)**:
   no Google account, no billing, nothing leaves your machine.
2. **[Deploy it to your own Firebase project](#2-deploy-it-to-your-own-firebase-project)**:
   with the three things that make an unattended Firebase app dangerous
   (uncapped billing, open storage, open sign-up) closed off first.

## 1. Run it locally on the emulators

### Prerequisites

| Tool    | Version      | Check             |
| ------- | ------------ | ----------------- |
| Node.js | 22 or newer  | `node --version`  |
| npm     | ships with Node | `npm --version` |
| Java    | 11 or newer (the Firestore and Storage emulators run on it) | `java -version` |

On Debian or Ubuntu, `sudo apt-get install -y openjdk-21-jre-headless`
provides Java. You do not need the Firebase CLI installed globally, a Google
account, or `firebase login`: the scripts run a pinned `firebase-tools`
through `npx`, and the `demo-usersrole` project ID tells it to stay offline.

### Steps

```bash
git clone https://github.com/jdwillmsen/usersrole.git
cd usersrole

# Dependencies for the app and for the Cloud Functions.
CYPRESS_INSTALL_BINARY=0 npm ci
npm --prefix functions ci

# Terminal 1: build the functions and start the Auth, Functions, Firestore
# and Storage emulators. Leave it running; it is ready when it prints
# "All emulators ready!".
npm run emulators

# Terminal 2: create the seed accounts.
npm run emulators:seed

# Terminal 2 (or 3): serve the app against the emulators.
npm run start:emulator
```

Open <http://localhost:4200/sign-in> and sign in with email and password as
one of the seeded accounts:

| Email               | Password         | Roles         | Admin pages (`/admin/users`, `/admin/roles`) |
| ------------------- | ---------------- | ------------- | -------------------------------------------- |
| `admin@example.com` | `admin-password` | `user, admin` | yes                                          |
| `user@example.com`  | `user-password`  | `user`        | no, redirected to Forbidden                  |

The Emulator Suite UI at <http://127.0.0.1:4000> shows the accounts, their
`roles` claims, Firestore documents and function logs. Signing up through the
app works for any `@example.com` address (see
[`functions/.env.demo-usersrole`](functions/.env.demo-usersrole)); anything
else is refused, exactly as it would be in production.

`CYPRESS_INSTALL_BINARY=0` only skips a large download the emulator run does
not need; drop it if you want to run the Cypress suites.

### How it fits together

- **Roles** live in one place: a `roles` custom claim on the Auth account
  (`user`, `read`, `manager`, `admin`). The `api` function reads it from the
  caller's ID token to authorize each route in
  [`functions/src/users/routes-config.ts`](functions/src/users/routes-config.ts),
  and the app's route guards read it through `GET /api/users/:id`.
  `beforecreated` gives every new account `['user']`. The seed script sets the
  claim directly, so no Firestore documents are needed for roles.
- **Firestore** only holds `users/{uid}` theme preferences.
- **`src/environments/environment.emulator.ts`** sets `useEmulators: true`,
  which makes [`app-firebase.module.ts`](src/app/core/app-firebase.module.ts)
  connect Auth, Firestore, Functions and Storage to the local emulators and
  skip App Check. `npm run start:emulator` builds with that file in place of
  `environment.ts`; Angular still insists the replaced file exists, so the
  script copies the blank template to `environment.ts` if you have none.
- Emulator data is thrown away when you stop the emulators. To keep it
  between runs, add `--import ./emulators-data --export-on-exit` to the
  `emulators` script (that folder is gitignored); re-running the seed is
  always safe.

### Troubleshooting

- **`Port 9099 is not open` / `port taken`**: another emulator run is using
  the ports in `firebase.json`. Stop it, or change the ports there and in
  `EMULATOR_PORTS` in `app-firebase.module.ts`.
- **`Could not spawn java`**: install Java (see prerequisites).
- **Sign-in works but the Users page is empty or 401s**: the functions
  emulator did not load. Check terminal 1 for a TypeScript build error and
  re-run `npm run emulators`.
- **"Your requested node version 22 doesn't match your global version"**:
  harmless; the emulator uses whatever Node you have.

## 2. Deploy it to your own Firebase project

Everything below runs against a project **you** own and pay for. Do the
billing guard (step 2) before the first deploy, not after.

### Step 1: create the project

1. In the [Firebase console](https://console.firebase.google.com/), **Add
   project**. Note the project ID (below: `YOUR_PROJECT_ID`).
2. **Build > Authentication > Get started**, enable **Email/Password** and
   any of Google, GitHub or Twitter you want.
3. **Build > Firestore Database > Create database** (production mode; the
   rules in this repo replace the defaults on deploy).
4. **Build > Storage > Get started**.
5. **Project settings > General > Your apps > Web app**: register an app and
   copy its config object.
6. Blocking functions (`beforecreated`) need **Authentication > Settings >
   Upgrade to Firebase Authentication with Identity Platform**.
7. **App Check**: register the web app with reCAPTCHA v3 and copy the site
   key, or remove the `initializeAppCheck` call if you do not want it.

### Step 2: Blaze plan, a budget, and a billing kill switch

Cloud Functions require the pay-as-you-go **Blaze** plan, and Blaze has **no
spending cap**. A budget alone only emails you; the kill switch below
**detaches the billing account** from the project when the budget is
exceeded, which stops every paid service in it.

> Disabling billing shuts down the project's paid resources, and some may be
> deleted if billing stays off. That is the point for a hobby deployment. Do
> not point this at a project that must stay up. Budget data also lags actual
> spend by up to a day, so this bounds a runaway bill rather than stopping it
> at the exact cent.

1. Upgrade to Blaze: **Project settings > Usage and billing > Modify plan**,
   linking a billing account. Note the billing account ID
   (`gcloud billing accounts list`; below: `BILLING_ACCOUNT_ID`).

2. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install), then:

   ```bash
   PROJECT=YOUR_PROJECT_ID
   gcloud config set project "$PROJECT"
   gcloud services enable cloudbilling.googleapis.com billingbudgets.googleapis.com \
     pubsub.googleapis.com cloudfunctions.googleapis.com run.googleapis.com \
     cloudbuild.googleapis.com eventarc.googleapis.com
   gcloud pubsub topics create billing-alerts
   ```

3. Create the budget and have it publish to that topic (here: USD 10 for the
   project; pick your own amount):

   ```bash
   gcloud billing budgets create \
     --billing-account=BILLING_ACCOUNT_ID \
     --display-name="usersrole cap" \
     --budget-amount=10USD \
     --filter-projects="projects/$PROJECT" \
     --threshold-rule=percent=0.5 \
     --threshold-rule=percent=0.9 \
     --threshold-rule=percent=1.0 \
     --notifications-rule-pubsub-topic="projects/$PROJECT/topics/billing-alerts"
   ```

   The console route is **Billing > Budgets & alerts > Create budget**, and
   under **Manage notifications** tick **Connect a Pub/Sub topic to this
   budget** and pick `billing-alerts`.

4. Give the kill switch its own service account, allowed to change this
   project's billing and nothing else:

   ```bash
   gcloud iam service-accounts create billing-guard
   gcloud projects add-iam-policy-binding "$PROJECT" \
     --member="serviceAccount:billing-guard@$PROJECT.iam.gserviceaccount.com" \
     --role=roles/billing.projectManager
   ```

5. Save the function in a new folder **outside** this repo:

   `package.json`

   ```json
   {
     "name": "billing-guard",
     "main": "index.js",
     "dependencies": {
       "@google-cloud/billing": "^5.0.0",
       "@google-cloud/functions-framework": "^4.0.0"
     }
   }
   ```

   `index.js`

   ```js
   const functions = require('@google-cloud/functions-framework');
   const { CloudBillingClient } = require('@google-cloud/billing');

   const billing = new CloudBillingClient();
   const name = `projects/${process.env.CAPPED_PROJECT_ID}`;
   const dryRun = process.env.DRY_RUN === 'true';

   functions.cloudEvent('stopBilling', async (event) => {
     const budget = JSON.parse(
       Buffer.from(event.data.message.data, 'base64').toString()
     );
     if (budget.costAmount <= budget.budgetAmount) {
       console.log(`Under budget: ${budget.costAmount} / ${budget.budgetAmount}`);
       return;
     }
     const [info] = await billing.getProjectBillingInfo({ name });
     if (!info.billingEnabled) {
       console.log(`Billing already disabled for ${name}`);
       return;
     }
     if (dryRun) {
       console.log(`DRY_RUN: would disable billing for ${name}`);
       return;
     }
     await billing.updateProjectBillingInfo({
       name,
       projectBillingInfo: { billingAccountName: '' }
     });
     console.log(`Disabled billing for ${name}`);
   });
   ```

6. Deploy it in dry-run mode, prove the wiring, then arm it:

   ```bash
   gcloud functions deploy stop-billing --gen2 --region=us-central1 \
     --runtime=nodejs22 --source=. --entry-point=stopBilling \
     --trigger-topic=billing-alerts \
     --service-account="billing-guard@$PROJECT.iam.gserviceaccount.com" \
     --set-env-vars="CAPPED_PROJECT_ID=$PROJECT,DRY_RUN=true"

   gcloud pubsub topics publish billing-alerts \
     --message='{"costAmount": 11, "budgetAmount": 10}'
   gcloud functions logs read stop-billing --gen2 --region=us-central1 --limit=5
   # Expect: "DRY_RUN: would disable billing for projects/YOUR_PROJECT_ID"

   gcloud functions deploy stop-billing --gen2 --region=us-central1 \
     --update-env-vars=DRY_RUN=false
   ```

   To re-enable billing after it trips, relink the account under **Billing >
   Account management** (or `gcloud billing projects link`) once you know
   what ran up the cost.

### Step 3: storage and Firestore rules

[`storage.rules`](storage.rules) confines each signed-in user to
`users/{uid}/...`, caps objects at 5 MB, and denies every other path. The
app itself stores no files, so nothing breaks. The previous rules allowed any
signed-in account to read and overwrite the whole bucket; do not bring them
back.

[`firestore.rules`](firestore.rules) lets a user read and write only their own
`users/{uid}` preferences document. Both files deploy with
`firebase deploy --only firestore:rules,storage` and are already what the
emulators enforce, so behaviour you saw locally is what you get.

### Step 4: close sign-up

Anyone who can reach the app can otherwise create accounts, and each one can
call your functions. Sign-up is **closed unless you open it**: the
`SIGNUP_ALLOWLIST` parameter is checked both by the `beforecreated` blocking
function (Google, GitHub and Twitter sign-ups) and by the public `POST
/api/users` route (email sign-up). Empty means nobody.

Create `functions/.env.YOUR_PROJECT_ID`:

```bash
# Exact addresses and/or whole domains, comma-separated.
SIGNUP_ALLOWLIST=you@example.com,@your-team.example
```

Existing accounts are unaffected. Once you have signed up yourself, make
yourself an admin: in **Authentication > Users** copy your UID, then from
`functions/` run

```bash
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID node -e "
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp();
getAuth().setCustomUserClaims(process.argv[1], { roles: ['user', 'admin'] })
  .then(() => console.log('done'));
" YOUR_UID
```

after `gcloud auth application-default login`. Sign out and back in for the
new claim to reach your ID token.

### Step 5: point the repo at your project

1. `.firebaserc`: replace every `usersrole` with `YOUR_PROJECT_ID` (the
   `default` project and the hosting target), or run
   `npx firebase-tools use --add` and
   `npx firebase-tools target:apply hosting usersrole YOUR_PROJECT_ID`.
2. `src/environments/environment.ts` (gitignored; copy
   `environment.template.ts`): paste the web app config from step 1, the
   reCAPTCHA site key, and set
   `functionsBaseUrl: 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net'`.
3. `functions/src/index.ts`: replace the `usersrole` entries in
   `allowedOrigins` with your hosting domains
   (`https://YOUR_PROJECT_ID.web.app`, `https://YOUR_PROJECT_ID.firebaseapp.com`),
   or the browser will block every API call.
4. `.github/workflows`: the release, deploy and preview workflows target
   `usersrole` and read the `FIREBASE_SERVICE_ACCOUNT_USERSROLE` and
   `ENVIRONMENT_FILE` secrets. Either update the project ID and secrets in a
   fork, or delete those workflows and deploy by hand.

### Step 6: deploy

```bash
npx firebase-tools login
npm run build
npx firebase-tools deploy --project YOUR_PROJECT_ID \
  --only hosting,functions,firestore:rules,storage
```

Then check the three guards are live:

- **Billing**: **Billing > Budgets & alerts** shows the budget with the
  Pub/Sub topic attached, and `stop-billing` is deployed with
  `DRY_RUN=false`.
- **Storage**: in the **Storage > Rules** tab, the published rules match
  `storage.rules`.
- **Sign-up**: signing up with an address not on the allowlist fails with
  "Sign-up is closed".
