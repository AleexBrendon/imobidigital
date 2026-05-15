import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateMe, type LoggedUser } from "../services/auth";
import { formatCPF, formatPhone, onlyNumbers } from "../utils/format";
import { useToast } from "../contexts/ToastContext";

type Props = {
    open: boolean;
    user: LoggedUser | null;
    onClose: () => void;
    onUpdated: (user: LoggedUser) => void;
};

export function ProfileModal({ open, user, onClose, onUpdated }: Props) {

    const toast = useToast();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        document: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setForm({
            name: user.name ?? "",
            email: user.email ?? "",
            phone: (user as any).phone ?? "",
            document: (user as any).document ?? "",
            password: "",
            password_confirmation: "",
        });
    }, [user]);

    if (!open) return null;

    function updateField(field: keyof typeof form, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (form.password && form.password !== form.password_confirmation) {
            toast.error("As senhas não conferem.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                email: form.email,
                phone: onlyNumbers(form.phone),
                document: onlyNumbers(form.document),
                ...(form.password
                    ? {
                        password: form.password,
                        password_confirmation: form.password_confirmation,
                    }
                    : {}),
            };

            const updated = await updateMe(payload);

            toast.success("Perfil atualizado com sucesso.");

            onUpdated(updated);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[560px] overflow-hidden rounded-3xl border border-white/10 bg-[#101c2d] shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Editar perfil
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Atualize seus dados de acesso e identificação.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                            Nome
                        </label>
                        <input
                            value={form.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                                Telefone
                            </label>
                            <input
                                value={form.phone}
                                onChange={(event) =>
                                    updateField("phone", formatPhone(event.target.value))
                                }
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                                Documento
                            </label>
                            <input
                                value={form.document}
                                onChange={(event) =>
                                    updateField("document", formatCPF(event.target.value))
                                }
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                                Nova senha
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(event) =>
                                    updateField("password", event.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                                placeholder="Opcional"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                value={form.password_confirmation}
                                onChange={(event) =>
                                    updateField("password_confirmation", event.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#172337] px-3 text-sm text-white outline-none focus:border-cyan-400/60"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                        >
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}