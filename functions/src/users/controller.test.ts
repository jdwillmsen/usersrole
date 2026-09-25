import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as adminAuth from 'firebase-admin/auth';
import { canModifyRoles, patch } from './controller';

test('only an admin caller may modify roles', () => {
  assert.equal(canModifyRoles(['user', 'admin']), true);
  assert.equal(canModifyRoles(['user']), false);
  assert.equal(canModifyRoles(['manager']), false);
  assert.equal(canModifyRoles([]), false);
  assert.equal(canModifyRoles(undefined), false);
});

// getAuth is dereferenced from the module namespace at call time, so replacing
// it on the shared module object lets the test observe what the handler writes
// without a live Auth backend.
function stubAuth() {
  const setClaims: { id: string; claims: unknown }[] = [];
  (adminAuth as any).getAuth = () => ({
    updateUser: async () => undefined,
    setCustomUserClaims: async (id: string, claims: unknown) => {
      setClaims.push({ id, claims });
    },
    getUser: async (id: string) => ({
      uid: id,
      email: '',
      displayName: '',
      customClaims: { roles: ['user'] },
      metadata: {}
    })
  });
  return setClaims;
}

function fakeRes(callerRoles: string[]) {
  const res: any = { locals: { roles: callerRoles }, statusCode: 0 };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.send = () => res;
  return res;
}

const editBody = {
  displayName: 'Someone',
  password: 'password',
  email: 'someone@example.com',
  roles: ['user', 'admin']
};

test('a non-admin self-edit with roles in the body does not change claims', async () => {
  const setClaims = stubAuth();
  const req: any = { params: { id: 'self' }, body: editBody };
  await patch(req, fakeRes(['user']));
  assert.deepEqual(setClaims, []);
});

test('an admin edit still applies the roles from the body', async () => {
  const setClaims = stubAuth();
  const req: any = { params: { id: 'target' }, body: editBody };
  await patch(req, fakeRes(['user', 'admin']));
  assert.deepEqual(setClaims, [
    { id: 'target', claims: { roles: ['user', 'admin'] } }
  ]);
});
