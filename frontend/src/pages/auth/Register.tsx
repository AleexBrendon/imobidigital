import { BadgeCheck, IdCard, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth";

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(value: string) {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/^(\d{2})(\d)/, "($1)$2")
    .replace(/(\d{1})(\d{4})(\d{0,4})$/, "$1 $2-$3")
    .replace(/-$/, "");
}

function formatCpf(value: string) {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatCnpj(value: string) {
  const numbers = onlyNumbers(value).slice(0, 14);

  return numbers
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    company_document: "",
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
    password_confirmation: "",
  });

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      await register(form);

      navigate("/dashboard");
    } catch (error: any) {
      console.log("REGISTER ERROR:", error.response?.data);
      alert(error.response?.data?.message ?? "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
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
          <Field icon={<User size={20} />} placeholder="Empresa" value={form.company_name} onChange={(value) => setForm({ ...form, company_name: value })} />

          <Field icon={<IdCard size={20} />} placeholder="CNPJ" value={form.company_document} onChange={(value) => setForm({ ...form, company_document: formatCnpj(value) })} />

          <Field icon={<User size={20} />} placeholder="Nome" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />

          <Field icon={<Mail size={20} />} placeholder="E-mail" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />

          <Field icon={<Phone size={20} />} placeholder="Telefone" value={form.phone} onChange={(value) => setForm({ ...form, phone: formatPhone(value) })} />

          <Field icon={<IdCard size={20} />} placeholder="CPF" value={form.document} onChange={(value) => setForm({ ...form, document: formatCpf(value) })} />

          <Field icon={<Lock size={20} />} placeholder="Senha" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />

          <Field icon={<Lock size={20} />} placeholder="Confirmar senha" type="password" value={form.password_confirmation} onChange={(value) => setForm({ ...form, password_confirmation: value })} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <BadgeCheck size={20} />
          {loading ? "Criando conta..." : "Criar Minha Conta"}
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
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-slate-400 focus-within:border-cyan-400">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
      />
    </div>
  );
}