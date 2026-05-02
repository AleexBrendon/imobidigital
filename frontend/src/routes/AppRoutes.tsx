import { Navigate, Route, Routes } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/Dashboard";
import { Users } from "../pages/Users";
import { Clients } from "../pages/Clients";
import { Properties } from "../pages/Properties";
import { Documents } from "../pages/Documents";
import { Contracts } from "../pages/Contracts";
import { Reports } from "../pages/Reports";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/imoveis" element={<Properties />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/contratos" element={<Contracts />} />
          <Route path="/relatorios" element={<Reports />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}