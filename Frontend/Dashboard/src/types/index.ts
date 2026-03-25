export type Role = "admin" | "user";
export type Page = "login" | "admin" | "user";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}