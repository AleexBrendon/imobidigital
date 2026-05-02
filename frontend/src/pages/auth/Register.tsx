import { BadgeCheck, IdCard, Lock, Mail, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    localStorage.setItem("token", "fake-token");
    navigate("/dashboard");
  }

  return (
    <div className="w-full max-w-[720px] rounded-[28px] border border-white/10 bg-white/[0.07] p-8 shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
      <div className="flex items-center justify-center gap-3">
        <div className="flex h-10 items-end gap-1">
          <span className="h-5 w-2 rounded bg-indigo-500" />
          <span className="h-8 w-2 rounded bg-cyan-400" />
          <span className="h-10 w-2 rounded bg-blue-500" />
        </div>
        <span className="text-3xl font-bold tracking-tight">ImobiDigital</span>
      </div>

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-semibold italic tracking-tight">
          Bem-vindo ao ImobiDigital
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Crie sua conta para gerenciar clientes, imóveis, contratos e documentos.
        </p>
      </div>

      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field icon={<User size={20} />} placeholder="Nome" />
          <Field icon={<Mail size={20} />} placeholder="E-mail" type="email" />
          <Field icon={<Phone size={20} />} placeholder="Telefone" />
          <Field icon={<IdCard size={20} />} placeholder="CPF/CNPJ" />
          <Field icon={<Lock size={20} />} placeholder="Senha" type="password" />
          <Field icon={<Lock size={20} />} placeholder="Confirma Senha" type="password" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded accent-indigo-600" />
            Eu aceito os <button type="button" className="underline">termos de uso</button>
          </label>

          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded accent-indigo-600" />
            Quero receber novidades
          </label>
        </div>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,.45)] transition hover:brightness-110">
          <BadgeCheck size={20} />
          Criar Minha Conta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Já tem uma conta?{" "}
        <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
          Entrar
        </Link>
      </p>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-slate-400 focus-within:border-cyan-400">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
      />
    </div>
  );
}