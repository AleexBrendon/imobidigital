import { ShieldCheck, ShieldX, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserItem } from "../../types/user";

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function EditUserModal({
  open,
  user,
  onClose,
  onSave,
}: {
  open: boolean;
  user: UserItem | null;
  onClose: () => void;
  onSave: (data: UserItem) => void;
}) {
  const [form, setForm] = useState<UserItem | null>(null);

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!open || !form) return null;

  const isBlocked = form.status === "Bloqueado";

  function handleToggleBlocked() {
    if (form) {
      setForm({
        ...form,
        status: isBlocked ? "Online" : "Bloqueado"
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1523] shadow-[0_25px_80px_rgba(0,0,0,.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,.12),transparent_30%)]" />

        <div className="relative z-10">
          <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.18)]">
                {getInitials(form.name)}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Editar Usuário
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Atualize os dados e permissões do usuário.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
            >
              <X className="text-slate-300" size={20} />
            </button>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Nome completo
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                  placeholder="Nome do usuário"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  E-mail
                </label>

                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                  placeholder="email@empresa.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Função
                </label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as UserItem["role"],
                    })
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                >
                  <option value="Administrador">
                    Administrador
                  </option>

                  <option value="Corretor">
                    Corretor
                  </option>

                  <option value="Usuário">
                    Usuário
                  </option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">
                  Controle de acesso
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Defina se este usuário pode acessar o sistema.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleBlocked}
                className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${isBlocked
                  ? "border-red-400/25 bg-red-500/10 hover:bg-red-500/15"
                  : "border-emerald-400/25 bg-emerald-500/10 hover:bg-emerald-500/15"
                  }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${isBlocked
                        ? "bg-red-500/15 text-red-300"
                        : "bg-emerald-500/15 text-emerald-300"
                        }`}
                    >
                      {isBlocked ? <ShieldX size={22} /> : <ShieldCheck size={22} />}
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {isBlocked ? "Acesso bloqueado" : "Acesso liberado"}
                      </h4>

                      <p className="mt-1 text-sm leading-5 text-slate-300">
                        {isBlocked
                          ? "Este usuário não poderá entrar na plataforma."
                          : "Este usuário pode acessar normalmente o sistema."}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`relative flex h-8 w-16 shrink-0 items-center rounded-full p-1 transition-all duration-300 ${isBlocked ? "bg-red-500/80" : "bg-emerald-500/80"
                      }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-300 ${isBlocked ? "translate-x-0" : "translate-x-8"
                        }`}
                    />
                  </span>
                </div>
              </button>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status atual
                </span>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${isBlocked ? "bg-red-400" : "bg-emerald-400"
                        }`}
                    />

                    <span className="font-semibold text-white">
                      {isBlocked ? "Bloqueado" : "Ativo"}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${isBlocked
                      ? "bg-red-500/10 text-red-300"
                      : "bg-emerald-500/10 text-emerald-300"
                      }`}
                  >
                    {isBlocked ? "Sem acesso" : "Com acesso"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={() => onSave(form)}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90 cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}