import { Check, Clock3 } from "lucide-react";
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
  const done = steps.filter((step) => step.completed).length;
  const activeIndex = steps.findLastIndex((step) => step.completed);

  const progress =
    total > 1 && activeIndex >= 0
      ? (activeIndex / (total - 1)) * 100
      : 0;

  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Assinatura</h3>
          <p className="mt-1 text-sm text-slate-400">
            {done} de {total} etapas concluídas
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {percent}%
        </span>
      </div>

      {steps.length > 0 && (
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="relative flex min-w-[320px] items-start justify-between">
            <div className="absolute left-5 right-5 top-3 h-[2px] bg-slate-700">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => onToggleStep(step.id)}
                className="relative z-10 flex w-16 shrink-0 flex-col items-center text-center"
              >
                <div
                  className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-full border transition ${step.completed
                      ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,.45)]"
                      : "border-slate-500 bg-slate-700 text-slate-400"
                    }`}
                >
                  {step.completed ? (
                    <Check size={12} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  )}
                </div>

                <span
                  className={`line-clamp-2 min-h-[28px] text-[10px] leading-3 ${step.completed ? "text-cyan-100" : "text-slate-400"
                    }`}
                >
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Histórico
        </h4>

        <div className="max-h-[220px] space-y-4 overflow-y-auto pr-2 no-scrollbar">
          {events.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhuma assinatura registrada.
            </p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                  <Clock3 size={15} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-100">
                      {event.title}
                    </p>

                    {event.time && (
                      <span className="text-xs text-slate-500">
                        {event.time}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}