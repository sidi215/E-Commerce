export type Role = 'agriculteur' | 'acheteur' | 'admin' | string;

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Message {
  id: string;
  from: string; // user id
  to: string; // user id
  text: string;
  createdAt: string;
}
