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