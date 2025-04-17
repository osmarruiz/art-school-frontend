import { Role } from './role';

export interface User {
  id: number;
  role: Role;
  username: string;
  name: string;
  id_card: string;
  registered_at: Date;
  exp?: number;
}
