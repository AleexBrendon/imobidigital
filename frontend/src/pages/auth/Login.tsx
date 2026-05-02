import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    localStorage.setItem("token", "fake-token");
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">Entrar</h1>
        <p className="mt-2 text-slate-400">Acesse sua conta ImobiDigital</p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none"
            placeholder="E-mail"
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none"
            placeholder="Senha"
            type="password"
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}