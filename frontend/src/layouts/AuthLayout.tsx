import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Outlet />
    </main>
  );
}