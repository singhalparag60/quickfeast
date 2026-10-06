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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleNavigation() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarExpanded((expanded) => !expanded);
    } else {
      setMobileOpen((open) => !open);
    }
  }

  return (
    <div className="min-h-screen min-w-0 bg-background text-foreground">
      <header className="sticky top-0 z-40 grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card px-4 sm:flex sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Toggle navigation" aria-controls="customer-navigation" title="Toggle navigation" className="shrink-0" onClick={toggleNavigation}>
            <span className="lg:hidden">{mobileOpen ? <X /> : <Menu />}</span>
            <span className="hidden lg:block">{sidebarExpanded ? <X /> : <Menu />}</span>
          </Button>
          <QuickFeastLogo className="h-14 w-auto min-w-0" />
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden size-10 shrink-0 place-items-center rounded-full bg-accent/50 text-foreground sm:grid"><UserRound className="size-5" /></div>
          <div className="min-w-0 text-sm font-bold"><span className="hidden text-xs font-normal text-muted-foreground sm:block">Good food, good day</span><span className="block sm:inline">Customer </span>#{customerId}</div>
        </div>
      </header>
      {mobileOpen && <div className="fixed inset-x-0 bottom-0 top-20 z-20 bg-foreground/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <aside id="customer-navigation" aria-label="Customer navigation" data-expanded={sidebarExpanded} data-mobile-open={mobileOpen} className={cn("fixed bottom-0 left-0 top-20 z-30 flex w-56 flex-col border-r border-border bg-card p-4 lg:translate-x-0", mobileOpen ? "translate-x-0" : "invisible -translate-x-full lg:visible", sidebarExpanded ? "lg:w-56" : "lg:w-18 lg:p-3")}>
        <nav className="flex h-full flex-col gap-2">
          {navigation.map(({ label, icon: Icon }) => (
            <Button key={label} variant="ghost" aria-label={label} title={label} aria-current={activeView === label ? "page" : undefined} className={cn("h-12 shrink-0 justify-start gap-3 px-4 text-sm", !sidebarExpanded && "lg:justify-center lg:gap-0 lg:px-0", label === "Contact Us" && "mt-auto", activeView === label ? "bg-primary/10 font-bold text-primary hover:bg-primary/15 hover:text-primary" : "text-muted-foreground")} onClick={() => { onNavigate(label); setMobileOpen(false); }}>
              <Icon className="size-5 shrink-0" /><span className={cn(!sidebarExpanded && "lg:sr-only")}>{label}</span>
            </Button>
          ))}
          <p className={cn("px-4 pt-5 text-xs text-muted-foreground", !sidebarExpanded && "lg:hidden")}>A little closer to delicious.</p>
        </nav>
      </aside>
      <main className={cn("min-w-0 px-4 py-8 sm:px-8 sm:py-10", sidebarExpanded ? "lg:ml-56" : "lg:ml-18")}>
        <div className="mx-auto min-w-0 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}