import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export function PublicRoute() {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}