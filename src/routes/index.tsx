import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bike, Leaf, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/quickfeast-hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickFeast — Better food. Faster." },
      { name: "description", content: "QuickFeast is a food-delivery platform. Get your choice of food fast and hot — sign up or log in to get started." },
      { property: "og:title", content: "QuickFeast — Better food. Faster." },
      { property: "og:description", content: "QuickFeast is a food-delivery platform. Get your choice of food fast and hot — sign up or log in to get started." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function Logo() {
  return (
    <span className="flex items-center gap-2 font-display text-xl font-extrabold">
      <span className="grid size-9 place-items-center rounded-full bg-primary text-lg text-primary-foreground">Q</span>
      QuickFeast
    </span>
  );
}

const values = [
  { icon: Bike, title: "Fast delivery", copy: "Smart routing gets every order to your door fast and hot." },
  { icon: Leaf, title: "Fresh food", copy: "Made to order with ingredients chosen for quality and flavor." },
  { icon: ShieldCheck, title: "Trusted restaurants", copy: "Every partner kitchen is carefully selected and customer rated." },
] as const;

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <nav aria-label="Primary navigation" className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">Already have an account?</span>
            <Button asChild variant="ghost"><a href="/login">Log in</a></Button>
            <Button asChild className="rounded-full"><a href="/signup">Sign Up</a></Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">Food delivery, done right</div>
            <h1 className="text-5xl font-extrabold leading-[1.03] sm:text-6xl lg:text-7xl">Better food. Faster.</h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">Get your choice of food fast and hot. QuickFeast brings the meals you love from trusted local kitchens straight to your door.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-full px-8 text-base shadow-lg shadow-primary/20">
                <a href="/signup">Get Started <ArrowRight /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-full px-8 text-base">
                <a href="/login">Log In</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Free to join. Order from your favorite local restaurants in minutes.</p>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-3xl shadow-2xl shadow-foreground/10 sm:min-h-[480px]">
            <img
              src={heroImage}
              alt="A vibrant spread of pizza, bowls, salads, and crispy chicken"
              width={1600}
              height={1104}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-card/95 p-4 shadow-lg backdrop-blur">
              <p className="text-sm font-bold">Hungry yet?</p>
              <p className="text-xs text-muted-foreground">Your next favorite meal is a tap away</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="why-quickfeast" className="border-t border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 id="why-quickfeast" className="text-center text-3xl font-extrabold sm:text-4xl">Why hungry people choose QuickFeast</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon /></div>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2026 QuickFeast. Made for hungry people.</p>
        </div>
      </footer>
    </div>
  );
}
