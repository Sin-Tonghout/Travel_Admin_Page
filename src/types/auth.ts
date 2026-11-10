export type Role = "super_admin" | "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}