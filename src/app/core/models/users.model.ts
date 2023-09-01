export type Role = 'admin' | 'manager' | 'user' | 'read';

export interface User {
  uid: string;
  displayName: string;
  roles: Role[];
  email: string;
}
