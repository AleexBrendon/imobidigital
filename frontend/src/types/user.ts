export type UserRole = "Administrador" | "Corretor" | "Proposta" | "Função";

export type UserStatus = "Online" | "Offline";

export type UserItem = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: number;
};