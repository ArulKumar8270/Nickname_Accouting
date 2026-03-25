import type { AuthUser } from "../types";

export const CREDENTIALS: {
  username: string;
  password: string;
  user: AuthUser;
}[] = [
  {
    username: "admin",
    password: "admin123",
    user: { name: "Alex Carter", email: "admin@company.com", role: "admin" },
  },
  {
    username: "user",
    password: "user123",
    user: { name: "Sam Rivera", email: "user@company.com", role: "user" },
  },
];