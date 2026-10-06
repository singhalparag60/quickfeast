import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MapPin, Package, Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { findRestaurants, type Restaurant, type RestaurantSort } from "@/lib/customer-restaurants";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [
    { title: "Restaurants near you — QuickFeast" },
    { name: "description", content: "Find your next favorite meal on QuickFeast. Explore local restaurants, fresh food, and fast delivery." },
    { property: "og:title", content: "Restaurants near you — QuickFeast" },
    { property: "og:description", content: "Explore the QuickFeast customer marketplace and discover your next favorite restaurant." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CustomerHome,
});

// Frontend customer preview only. Add a managed session gate when real login is connected.
function CustomerHome() {
  const [view, setView] = useState<CustomerView>("Home");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<RestaurantSort>("recommended");
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const matches = findRestaurants(query, sort);
  const marketplace = view === "Home" || view === "Restaurants";

  function search(event: FormEvent) {
    event.preventDefault();
    setQuery(input);
    setView("Restaurants");
  }

  return (
    <CustomerShell activeView={view} onNavigate={(next) => { setView(next); if (next === "Home") { setQuery(""); setInput(""); } }}>
      {marketplace ? <>
        <section aria-labelledby="customer-heading" className="pb-9">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><MapPin className="size-4 text-primary" />Your neighborhood favorites</div>
          <h1 id="customer-heading" className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">Good food. <span className="text-primary">Great day.</span></h1>
          <p className="mt-3 text-base text-muted-foreground">Something delicious is just around the corner.</p>
          <form onSubmit={search} role="search" className="mt-7 flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm sm:gap-3 sm:p-3">
            <Search className="ml-1 hidden size-5 shrink-0 text-muted-foreground sm:block" />
            <Input type="search" aria-label="What would you like to eat today?" placeholder="What would you like to eat today?" value={input} onChange={(event) => setInput(event.target.value)} className="h-12 min-w-0 flex-1 border-0 px-2 text-sm shadow-none sm:text-base" />
            <Button type="submit" className="h-12 shrink-0 px-4 sm:px-7"><Search className="sm:hidden" />Search</Button>
          </form>
        </section>
        <section aria-labelledby="restaurants-heading">
          <div className="mb-6 grid min-w-0 grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0"><h2 id="restaurants-heading" className="font-display text-2xl font-extrabold">{query.trim() ? "Your search results" : "Restaurants near you"}</h2><p className="mt-2 break-words text-sm text-muted-foreground" aria-live="polite">{matches.length} restaurants{query.trim() ? ` matching “${query.trim()}”` : " · Freshly made, delivered to you"}</p></div>
            <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="size-4 shrink-0" /><span className="sr-only">Sort restaurants</span><select aria-label="Sort restaurants" value={sort} onChange={(event) => setSort(event.target.value as RestaurantSort)} className="max-w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-ring"><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="fastest">Fastest delivery</option></select></label>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{matches.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} onSelect={setSelected} />)}</div>
          {matches.length === 0 && <div className="py-16 text-center"><UtensilsCrossed className="mx-auto size-10 text-muted-foreground" /><h3 className="mt-4 text-xl font-bold">No restaurants found</h3><p className="mt-2 text-muted-foreground">Try another restaurant or cuisine.</p><Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setInput(""); }}>Clear search</Button></div>}
          <p className="mt-8 text-xs text-muted-foreground">Sample restaurants · Delivery times and ratings are illustrative.</p>
        </section>
      </> : <section className="py-6"><h1 className="text-3xl font-extrabold">{view}</h1><div className="py-20 text-center"><Package className="mx-auto size-12 text-brand-orange" /><h2 className="mt-5 text-xl font-bold">{view === "Orders" ? "No orders yet" : "We’re here for you"}</h2><p className="mx-auto mt-3 max-w-md text-muted-foreground">{view === "Orders" ? "Your order history will appear here once ordering is available." : "Customer support will be available when QuickFeast launches."}</p><Button className="mt-6" onClick={() => setView("Home")}>Back to restaurants</Button></div></section>}
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-lg p-0">
          {selected && <><img src={selected.image} alt={selected.imageAlt} width={1024} height={768} className="aspect-[16/9] w-full object-cover" /><div className="p-6"><DialogTitle className="font-display text-2xl">{selected.name}</DialogTitle><p className="mt-2 text-sm text-muted-foreground">{selected.cuisine} · {selected.rating.toFixed(1)} stars · {selected.deliveryMinutes}–{selected.deliveryMinutes + 10} min</p><DialogDescription className="mt-4">This sample restaurant’s menu is not available yet.</DialogDescription><Button variant="outline" className="mt-6" onClick={() => setSelected(null)}>Keep exploring</Button></div></>}
        </DialogContent>
      </Dialog>
    </CustomerShell>
  );
}