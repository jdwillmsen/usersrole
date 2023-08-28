export type Role = 'admin' | 'manager' | 'user';

export interface User {
  uid: string;
  displayName: string;
  roles: Role[];
  email: string;
}
