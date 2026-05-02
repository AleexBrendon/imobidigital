import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#050d18] p-5 text-white">
      <div className="mx-auto flex h-[calc(100vh-40px)] max-w-[1540px] overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] shadow-2xl">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-h-0 flex-1 overflow-auto no-scrollbar bg-[#07111f] p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}