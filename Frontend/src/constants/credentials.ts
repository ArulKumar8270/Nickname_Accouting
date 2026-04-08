import type { Credential } from "../types";

export const CREDENTIALS: Credential[] = [
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