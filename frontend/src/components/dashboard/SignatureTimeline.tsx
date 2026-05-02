import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

export function SignatureTimeline() {
  return (
    <Card className="border-cyan-400/70 shadow-[0_0_24px_rgba(34,211,238,.35)]">
      <SectionHeader title="Linha do Tempo de Assinaturas" />

      <p className="mb-5 text-sm text-slate-400">
        Contrato de contracto → SH:0719-2019
      </p>

      <div className="relative mb-5 flex items-center justify-between">
        {["Locador", "Locatário", "Fiador", "Testemunhas"].map((item, index) => (
          <div key={item} className="z-10 text-center">
            <div
              className={`mx-auto mb-2 h-5 w-5 rounded-full ${
                index < 3 ? "bg-cyan-400" : "bg-slate-600"
              }`}
            />
            <span className="text-xs text-slate-300">{item}</span>
          </div>
        ))}

        <div className="absolute left-5 right-5 top-2 h-0.5 bg-slate-700" />
        <div className="absolute left-5 top-2 h-0.5 w-[66%] bg-cyan-400" />
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
      </div>
    </Card>
  );
}