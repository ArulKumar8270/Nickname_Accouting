export type Role = "admin" | "user" | null;

export interface AuthState {
  isLoggedIn: boolean;
  username: string;
  role: Role;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface User {
  username: string;
  password: string;
  role: Exclude<Role, null>;
}