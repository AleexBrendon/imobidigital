import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch {
      alert("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[470px] rounded-[28px] border border-white/10 bg-white/[0.07] p-8 shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
      <Brand />

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Acesse sua conta para continuar no ImobiDigital.
        </p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <Field
          icon={<Mail size={20} />}
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
        />

        <Field
          icon={<Lock size={20} />}
          placeholder="Senha"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-indigo-600"
            />
            Lembrar acesso
          </label>

          <button type="button" className="text-cyan-300 hover:text-cyan-200">
            Esqueci minha senha
          </button>
        </div>

        <button
          disabled={loading}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Ainda não tem uma conta?{" "}
        <Link
          to="/register"
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-10 items-end gap-1">
        <span className="h-5 w-2 rounded bg-indigo-500" />
        <span className="h-8 w-2 rounded bg-cyan-400" />
        <span className="h-10 w-2 rounded bg-blue-500" />
      </div>
      <span className="text-3xl font-bold tracking-tight">ImobiDigital</span>
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