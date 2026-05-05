import { Check } from "lucide-react";
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
  const total = steps.length;
  const done = steps.filter((s) => s.completed).length;

  const progress =
    total > 1 ? ((done - 1) / (total - 1)) * 85 : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5">
      <h3 className="mb-5 text-xl font-semibold">Assinatura</h3>

      <div className="relative mb-6 flex justify-between">
        <div className="absolute left-6 right-6 top-3 h-[2px] bg-slate-700" />

        <div
          className="absolute left-6 top-3 h-[2px] bg-cyan-400 transition-all"
          style={{ width: `${progress}%` }}
        />

        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onToggleStep(step.id)}
            className="z-10 text-center"
          >
            <div
              className={`mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full ${step.completed
                  ? "bg-cyan-400 text-black"
                  : "bg-slate-600"
                }`}
            >
              {step.completed && <Check size={14} />}
            </div>

            <span className="text-xs text-slate-300">
              {step.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhuma assinatura registrada.
          </p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="text-sm">
              <p className="font-semibold text-slate-100">{event.title}</p>
              <p className="text-slate-400">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}