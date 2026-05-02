import { Check, MoreHorizontal } from "lucide-react";
import type { SignatureEvent, SignatureStep } from "../../types/contract";

export function SignatureTimelinePanel({
  steps,
  events,
  onToggleStep,
}: {
  steps: SignatureStep[];
  events: SignatureEvent[];
  onToggleStep: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Linha do Tempo de Assinaturas</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <p className="mb-5 text-sm text-slate-400">
        Contrato de contracto → SH:0718-2019
      </p>

      <div className="relative mb-5 flex items-center justify-between">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onToggleStep(step.id)}
            className="z-10 text-center"
          >
            <div
              className={`mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full ${
                step.completed ? "bg-cyan-400 text-slate-950" : "bg-slate-600"
              }`}
            >
              {step.completed && <Check size={15} />}
            </div>
            <span className="text-xs text-slate-300">{step.label}</span>
          </button>
        ))}

        <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-700" />
        <div className="absolute left-6 top-3 h-0.5 w-[65%] bg-cyan-400" />
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="grid grid-cols-[90px_30px_1fr] gap-3">
            <span className="text-sm text-slate-400">{event.time}</span>

            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  event.completed ? "bg-cyan-400" : "bg-emerald-400"
                }`}
              />
              {index !== events.length - 1 && (
                <div className="mt-2 h-8 w-px bg-cyan-400/50" />
              )}
            </div>

            <div>
              <p className="font-medium text-slate-100">{event.title}</p>
              <p className="text-sm text-slate-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}