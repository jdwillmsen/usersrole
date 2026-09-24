// Seeds the Auth emulator with one admin and one regular user.
//
// Roles live only in the `roles` custom claim (see functions/src/users), so
// that claim is all a seeded account needs. Accounts are written through the
// emulator's admin REST surface, which bypasses the beforecreated allowlist
// the same way the Admin SDK does in production.
//
// Safe to run repeatedly: existing accounts are overwritten, not duplicated.

const PROJECT_ID = process.env.EMULATOR_PROJECT_ID ?? 'demo-usersrole';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099';

// demo-* projects cannot resolve to real Google Cloud resources, so a
// mistyped variable can never aim the seed at a live project.
if (!PROJECT_ID.startsWith('demo-')) {
  console.error(`Refusing to seed ${PROJECT_ID}: only demo-* projects.`);
  process.exit(1);
}

const SEED_USERS = [
  {
    localId: 'seed-admin',
    email: 'admin@example.com',
    password: 'admin-password',
    displayName: 'Seed Admin',
    roles: ['user', 'admin']
  },
  {
    localId: 'seed-user',
    email: 'user@example.com',
    password: 'user-password',
    displayName: 'Seed User',
    roles: ['user']
  }
];

const base = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}`;
// "owner" is the emulator's stand-in for an admin credential.
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer owner'
};

async function call(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function waitForAuthEmulator(attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`http://${AUTH_HOST}/`);
      if (res.ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(
    `Auth emulator not reachable at ${AUTH_HOST}; start it with npm run emulators`
  );
}

async function seed() {
  await waitForAuthEmulator();
  await call('/accounts:batchDelete', {
    localIds: SEED_USERS.map((user) => user.localId),
    force: true
  });
  for (const user of SEED_USERS) {
    await call('/accounts', {
      localId: user.localId,
      email: user.email,
      password: user.password,
      displayName: user.displayName
    });
    await call('/accounts:update', {
      localId: user.localId,
      emailVerified: true,
      customAttributes: JSON.stringify({ roles: user.roles })
    });
    console.log(`seeded ${user.email} roles=${user.roles.join(',')}`);
  }
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
