import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

type Timeline = {
  contract: string;
  code: string;
  progress: number;
  steps: {
    label: string;
    completed: boolean;
  }[];
};

export function SignatureTimeline({
  timeline,
}: {
  timeline?: Timeline;
}) {
  if (!timeline) return null;

  return (
    <Card className="border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,.15)]">
      <SectionHeader title="Linha do Tempo de Assinaturas" />

      <p className="mb-5 text-sm text-slate-400">
        {timeline.contract} → {timeline.code}
      </p>

      <div className="relative mb-6 flex items-center justify-between">
        {timeline.steps.map((step) => (
          <div
            key={step.label}
            className="z-10 text-center"
          >
            <div
              className={`
                mx-auto mb-3 h-6 w-6 rounded-full border-4
                ${
                  step.completed
                    ? "border-cyan-300 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.7)]"
                    : "border-slate-600 bg-slate-700"
                }
              `}
            />

            <span className="text-xs text-slate-300">
              {step.label}
            </span>
          </div>
        ))}

        <div className="absolute left-7 right-7 top-3 h-[3px] rounded-full bg-slate-700" />

        <div
          className="absolute left-7 top-3 h-[3px] rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.6)]"
          style={{
            width: `${timeline.progress}%`,
          }}
        />
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{
            width: `${timeline.progress}%`,
          }}
        />
      </div>
    </Card>
  );
}