import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";
import type { OrderStatus } from "@/lib/prototype-cart";
import { cn } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { status: "Order Placed", label: "Order Placed", icon: CheckCircle2 },
  { status: "Packaging", label: "Packaging", icon: PackageCheck },
  { status: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: Clock },
];

const STATUS_RANK: Record<OrderStatus, number> = {
  "Order Placed": 0,
  Packaging: 1,
  "Out for Delivery": 2,
  Delivered: 3,
};

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentRank = STATUS_RANK[status] ?? 0;

  return (
    <div className="w-full py-4">
      {/* Desktop / Tablet Horizontal Timeline */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Progress bar line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{
                width: `${(currentRank / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentRank;
            const isCurrent = idx === currentRank;
            const isUpcoming = idx > currentRank;
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    "grid size-11 place-items-center rounded-full border-2 transition-all duration-300 shadow-xs",
                    isCurrent && "border-primary bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isUpcoming && "border-border bg-card text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs font-bold transition-colors whitespace-nowrap",
                    isCurrent && "text-primary",
                    isCompleted && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-6">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentRank;
          const isCurrent = idx === currentRank;
          const isUpcoming = idx > currentRank;
          const isLast = idx === STEPS.length - 1;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-5 top-10 bottom-0 w-0.5 -ml-px",
                    idx < currentRank ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
              <div
                className={cn(
                  "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 transition-all shadow-xs",
                  isCurrent && "border-primary bg-primary text-primary-foreground scale-105 ring-4 ring-primary/20",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isUpcoming && "border-border bg-card text-muted-foreground"
                )}
              >
                <Icon className="size-4.5" />
              </div>
              <div className="pt-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-bold",
                    isCurrent && "text-primary",
                    isCompleted && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isCurrent
                    ? "Currently in progress"
                    : isCompleted
                    ? "Completed"
                    : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
