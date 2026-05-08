import { api } from "./api";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  role: "admin" | "corretor" | "usuario";
  status: "active" | "blocked";
  avatar: number;
};

export type UserPayload = {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  role: "admin" | "corretor" | "usuario";
  status?: "active" | "blocked";
  password?: string;
};

export async function getUsers() {
  const { data } = await api.get("/users");
  return data as ApiUser[];
}

export async function createUser(payload: UserPayload) {
  const { data } = await api.post("/users", payload);
  return data as ApiUser;
}

export async function updateUser(id: number, payload: UserPayload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data as ApiUser;
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`);
}