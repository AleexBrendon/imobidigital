import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout, type LoggedUser } from "../services/auth";
import { ProfileModal } from "./ProfileModal";

function formatRole(role?: string) {
    if (role === "admin") return "Administrador";
    if (role === "corretor") return "Corretor";
    if (role === "funcionario") return "Funcionário";
    return "Usuário";
}

export function UserDropdown() {

    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<LoggedUser | null>(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : null;
    });

    async function loadUser() {
        try {
            const data = await getMe();

            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error("Erro ao carregar usuário logado:", error);
        }
    }

    async function handleLogout() {
        await logout();
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const avatar =
        user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Usuário")}&background=1e293b&color=fff`;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-white/10"
            >
                <img
                    src={avatar}
                    className="h-11 w-11 rounded-full border border-white/20 object-cover"
                />

                <div className="hidden text-left xl:block">
                    <p className="max-w-[130px] truncate text-sm font-semibold text-white">
                        {user?.name ?? "Carregando..."}
                    </p>
                    <p className="text-xs text-slate-400">{formatRole(user?.role)}</p>
                </div>

                <ChevronDown size={18} className="text-slate-400" />
            </button>

            {open && (
                <div className="absolute right-0 top-14 z-50 w-[280px] overflow-hidden rounded-3xl border border-white/10 bg-[#101c2d] shadow-2xl shadow-black/40">
                    <div className="border-b border-white/10 px-5 py-4">
                        <p className="truncate text-sm font-semibold text-white">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        <span className="mt-3 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            {formatRole(user?.role)}
                        </span>
                    </div>

                    <div className="p-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setProfileOpen(true);
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                            <User size={17} />
                            Perfil
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200 cursor-pointer"
                        >
                            <LogOut size={17} />
                            Sair
                        </button>
                    </div>
                </div>
            )}
            <ProfileModal
                open={profileOpen}
                user={user}
                onClose={() => setProfileOpen(false)}
                onUpdated={(updatedUser) => setUser(updatedUser)}
            />
        </div>
    );
}