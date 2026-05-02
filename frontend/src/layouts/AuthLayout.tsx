import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050d18] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.22),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <Outlet />
      </div>
    </main>
  );
}