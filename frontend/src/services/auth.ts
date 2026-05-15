import { api } from "./api";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  company_name: string;
  company_document?: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  password: string;
  password_confirmation: string;
};

export type LoggedUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  document?: string | null;
  avatar?: string | null;
};

export async function login(data: LoginData) {
  const response = await api.post("/login", data);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post("/register", data);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}

export async function logout() {
  await api.post("/logout");

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export async function getMe() {
  const { data } = await api.get("/me");

  return (data.user ?? data) as LoggedUser;
}

export type UpdateProfilePayload = {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  password?: string;
  password_confirmation?: string;
};

export async function updateMe(payload: UpdateProfilePayload) {
  const { data } = await api.put("/me", payload);

  const user = data.user ?? data;

  localStorage.setItem("user", JSON.stringify(user));

  return user as LoggedUser;
}