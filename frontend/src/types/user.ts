export type UserRole = "Administrador" | "Corretor" | string;

export type UserStatus = "Online" | "Offline" | string;

export type UserItem = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  role: UserRole;
  status: UserStatus;
  avatar: number;
};