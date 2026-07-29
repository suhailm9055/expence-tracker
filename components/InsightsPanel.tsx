import { clsx } from "clsx";
import { AlertTriangle, TrendingUp, CheckCircle2, Info } from "lucide-react";
import type { Insight } from "@/lib/insights";

const ICONS = {
  warning: AlertTriangle,
  danger: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const TONE_STYLES = {
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
  success: "text-success bg-success/10",
  info: "text-primary bg-primary/10",
};

export default function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="font-medium text-sm">Smart insights</h3>
      </div>
      <div className="space-y-3">
        {insights.length === 0 && (
          <p className="text-sm text-muted">
            Set a monthly budget in Settings to unlock personalized insights.
          </p>
        )}
        {insights.map((insight) => {
          const Icon = ICONS[insight.tone];
          return (
            <div
              key={insight.id}
              className={clsx(
                "flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
                TONE_STYLES[insight.tone]
              )}
            >
              <Icon size={16} className="mt-0.5 shrink-0" />
              <span className="text-text">{insight.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
