import { useState, type ReactNode } from "react";
import { Home, Menu, MessageCircle, Package, UserRound, UtensilsCrossed, X } from "lucide-react";
import { QuickFeastLogo } from "@/components/quickfeast-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CustomerView = "Home" | "Restaurants" | "Orders" | "Contact Us";
const navigation = [
  { label: "Home", icon: Home },
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Orders", icon: Package },
  { label: "Contact Us", icon: MessageCircle },
] as const;

export function CustomerShell({ children, activeView, onNavigate, customerId = "QF1024" }: {
  children: ReactNode;
  activeView: CustomerView;
  onNavigate: (view: CustomerView) => void;
  customerId?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="customer-navigation" title="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <QuickFeastLogo className="h-14 w-auto" />
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/50 text-foreground"><UserRound className="size-5" /></div>
          <div className="min-w-0 text-sm font-bold"><span className="hidden text-xs font-normal text-muted-foreground sm:block">Good food, good day</span>Customer #{customerId}</div>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-x-0 bottom-0 top-20 z-20 bg-foreground/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <aside id="customer-navigation" aria-label="Customer navigation" className={cn("fixed bottom-0 left-0 top-20 z-30 flex w-56 flex-col border-r border-border bg-card p-4 transition-transform motion-reduce:transition-none", menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", menuOpen && "lg:hidden")}>
        <nav className="flex h-full flex-col gap-2">
          {navigation.map(({ label, icon: Icon }) => (
            <Button key={label} variant="ghost" aria-current={activeView === label ? "page" : undefined} className={cn("h-12 justify-start gap-3 px-4 text-sm", label === "Contact Us" && "mt-auto", activeView === label ? "bg-primary/10 font-bold text-primary hover:bg-primary/15 hover:text-primary" : "text-muted-foreground")} onClick={() => { onNavigate(label); setMenuOpen(false); }}>
              <Icon className="size-5" />{label}
            </Button>
          ))}
          <p className="px-4 pt-5 text-xs text-muted-foreground">A little closer to delicious.</p>
        </nav>
      </aside>
      <main className={cn("px-4 py-8 sm:px-8 sm:py-10 lg:pl-64 lg:pr-8", menuOpen && "lg:pl-8")}>
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}