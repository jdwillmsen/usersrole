import { Role } from '../../core/models/users.model';

export interface NavItem {
  path: string;
  icon: string;
  title: string;
  roles?: Role[];
}
