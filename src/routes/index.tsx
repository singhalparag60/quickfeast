import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bike, ChevronDown, Clock3, Leaf, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { useState, type FormEvent } from "react";

import burgerImage from "@/assets/burger.jpg";
import heroImage from "@/assets/quickfeast-hero.jpg";
import pizzaImage from "@/assets/pizza.jpg";
import pokeImage from "@/assets/poke.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickFeast — Better food, delivered fast" },
      { name: "description", content: "Order from trusted local restaurants and get your choice of food fast and hot." },
      { property: "og:title", content: "QuickFeast — Better food, delivered fast" },
      { property: "og:description", content: "Order from trusted local restaurants and get your choice of food fast and hot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "Pizza", image: pizzaImage },
  { name: "Burgers", image: burgerImage },
  { name: "Healthy", image: pokeImage },
  { name: "Asian", image: heroImage },
];

const restaurants = [
  { name: "Forno & Flour", cuisine: "Italian · Pizza", time: "20–30 min", price: "$$", rating: "4.9", image: pizzaImage },
  { name: "Stacked Social", cuisine: "Burgers · American", time: "15–25 min", price: "$$", rating: "4.8", image: burgerImage },
  { name: "Mizu Bowl", cuisine: "Japanese · Healthy", time: "25–35 min", price: "$$", rating: "4.9", image: pokeImage },
];

function Logo() {
  return <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold"><span className="grid size-9 place-items-center rounded-full bg-primary text-lg text-primary-foreground">Q</span>QuickFeast</a>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="mb-2 text-sm font-bold uppercase text-primary">{eyebrow}</p><h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2></div>;
}

function Index() {
  const [message, setMessage] = useState("");
  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Welcome back! Demo sign-in is ready for the next release.");
  }

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <nav aria-label="Primary navigation" className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#discover" className="transition-colors hover:text-primary">Discover</a>
            <a href="#restaurants" className="transition-colors hover:text-primary">Restaurants</a>
            <a href="#why" className="transition-colors hover:text-primary">Why us</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost"><a href="#login">Login</a></Button>
            <Button asChild className="hidden rounded-full sm:inline-flex"><a href="#login">Sign up</a></Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"><Clock3 className="size-4" /> Dinner, delivered better</div>
            <h1 className="text-5xl font-extrabold leading-[1.03] sm:text-6xl lg:text-7xl">Better food for most people</h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">Get your choice of food fast and hot.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-full px-7 text-base shadow-lg shadow-primary/20"><a href="#discover">Order Now <ArrowRight /></a></Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-full px-7 text-base"><a href="#restaurants">Browse restaurants</a></Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"><div className="flex -space-x-2"><span className="size-8 rounded-full border-2 border-background bg-promo" /><span className="size-8 rounded-full border-2 border-background bg-primary" /><span className="size-8 rounded-full border-2 border-background bg-foreground" /></div><span><strong className="text-foreground">12k+</strong> happy food lovers</span></div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl shadow-2xl shadow-foreground/10 sm:min-h-[500px]">
            <img src={heroImage} alt="A vibrant spread of pizza, bowls, salads, and crispy chicken" width={1600} height={1104} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-card/95 p-4 shadow-lg backdrop-blur"><p className="text-sm font-bold">Free delivery</p><p className="text-xs text-muted-foreground">on your first order</p></div>
          </div>
        </section>

        <section id="discover" className="scroll-mt-24 px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-foreground p-6 text-background shadow-xl sm:p-9">
            <p className="font-display text-2xl font-bold">What are you craving?</p>
            <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => e.preventDefault()}>
              <label className="relative"><span className="sr-only">Delivery address</span><MapPin className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" /><Input className="h-13 rounded-xl border-background/20 bg-background pl-12 text-foreground" placeholder="Enter delivery address" /></label>
              <label className="relative"><span className="sr-only">Search food or restaurant</span><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" /><Input className="h-13 rounded-xl border-background/20 bg-background pl-12 text-foreground" placeholder="Food, cuisine or restaurant" /></label>
              <Button className="h-13 rounded-xl px-7">Find food</Button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex items-end justify-between gap-6"><SectionTitle eyebrow="Find your favorite" title="Popular categories" /><a href="#restaurants" className="hidden items-center gap-1 font-bold text-primary sm:flex">View all <ArrowRight className="size-4" /></a></div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => <a key={category.name} href="#restaurants" className="group overflow-hidden rounded-2xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><img src={category.image} alt="" width={912} height={912} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="flex items-center justify-between p-4 font-display text-lg font-bold">{category.name}<ArrowRight className="size-4 text-primary" /></div></a>)}
          </div>
        </section>

        <section id="restaurants" className="scroll-mt-24 bg-surface py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="Local favorites" title="Popular near you" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {restaurants.map((restaurant) => <article key={restaurant.name} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative overflow-hidden"><img src={restaurant.image} alt={`${restaurant.name} food`} width={912} height={912} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-card px-3 py-1 text-xs font-bold">Featured</span></div><div className="p-5"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><h3 className="truncate text-xl font-bold">{restaurant.name}</h3><span className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-foreground"><Star className="size-3 fill-current" />{restaurant.rating}</span></div><p className="mt-2 text-sm text-muted-foreground">{restaurant.cuisine}</p><div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm font-semibold"><span>{restaurant.time}</span><span aria-hidden="true">·</span><span>{restaurant.price}</span><span className="ml-auto text-primary">Free delivery</span></div></div></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="relative overflow-hidden rounded-3xl bg-promo p-8 text-promo-foreground sm:p-12"><div className="relative z-10 max-w-2xl"><p className="text-sm font-extrabold uppercase">Your first feast is on us</p><h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Save 30% on your first order.</h2><p className="mt-4 max-w-lg text-lg">Discover a new local favorite tonight. Use code <strong>FIRSTBITE</strong> at checkout.</p><Button asChild size="lg" className="mt-7 h-12 rounded-full px-7"><a href="#discover">Claim offer <ArrowRight /></a></Button></div><div className="absolute -bottom-14 -right-10 size-56 rounded-full border-[34px] border-background/40" /></div></section>

        <section id="why" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="text-center"><SectionTitle eyebrow="The QuickFeast way" title="Good food, without the wait" /></div><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{[
          [Bike, "Fast delivery", "Smart routing gets every order to your door fast and hot."],
          [Leaf, "Fresh food", "Made to order with ingredients chosen for quality and flavor."],
          [Search, "Easy ordering", "Find what you love and order in just a few simple taps."],
          [ShieldCheck, "Trusted restaurants", "Every partner is carefully selected and customer rated."],
        ].map(([Icon, title, copy]) => { const FeatureIcon = Icon as typeof Bike; return <div key={title as string}><div className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground"><FeatureIcon /></div><h3 className="mt-5 text-xl font-bold">{title as string}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{copy as string}</p></div>; })}</div></section>

        <section id="login" className="scroll-mt-24 bg-foreground py-20 text-background"><div className="mx-auto grid max-w-5xl items-center gap-12 px-5 md:grid-cols-2 lg:px-8"><div><p className="text-sm font-bold uppercase text-accent">Welcome back</p><h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Your next favorite meal is waiting.</h2><p className="mt-5 max-w-md text-background/70">Sign in to see your saved places, recent orders, and personalized picks.</p></div><form onSubmit={submitLogin} className="rounded-3xl bg-card p-6 text-card-foreground shadow-2xl sm:p-8"><label className="text-sm font-bold" htmlFor="email">Email address</label><Input id="email" type="email" required placeholder="you@example.com" className="mt-2 h-12 rounded-xl" /><label className="mt-5 block text-sm font-bold" htmlFor="password">Password</label><Input id="password" type="password" required placeholder="••••••••" className="mt-2 h-12 rounded-xl" /><div className="mt-4 flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" />Remember me</label><button type="button" className="font-semibold text-primary">Forgot password?</button></div><Button type="submit" className="mt-6 h-12 w-full rounded-xl">Sign in <ArrowRight /></Button>{message && <p role="status" className="mt-4 text-center text-sm text-muted-foreground">{message}</p>}<div className="mt-5 flex items-center justify-center gap-1 text-sm text-muted-foreground">New to QuickFeast? <button type="button" className="font-bold text-primary">Create an account</button></div></form></div></section>
      </main>

      <footer className="border-t border-border bg-background"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:px-8"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Great local food, delivered fast and hot whenever hunger calls.</p></div><div><p className="font-bold">Explore</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><a href="#discover">Discover food</a><a href="#restaurants">Restaurants</a><a href="#why">Why QuickFeast</a></div></div><div><p className="font-bold">Get the good stuff</p><button type="button" className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">Choose your location <ChevronDown className="size-4" /></button></div></div><div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 QuickFeast. Made for hungry people.</div></footer>
    </div>
  );
}
