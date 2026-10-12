import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2, MapPin, Package, RefreshCw, Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Restaurant, RestaurantSort } from "@/lib/customer-restaurants";
import { fetchRestaurants } from "@/lib/api-client";
import { clearSession, getCurrentSession, type PrototypeSession } from "@/lib/prototype-auth";

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

// Frontend customer marketplace backed by the QuickFeast Express API.
function CustomerHome() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PrototypeSession | null>(() => getCurrentSession());

  useEffect(() => {
    // Keep in sync with prototype session in storage
    setSession(getCurrentSession());
    const handler = () => {
      setSession(getCurrentSession());
    };
    window.addEventListener("quickfeast_auth_change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("quickfeast_auth_change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const [view, setView] = useState<CustomerView>("Home");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<RestaurantSort>("recommended");

  // API State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load restaurants from database API whenever search or sort parameters change
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRestaurants({
          sort: sort !== "recommended" ? sort : undefined,
          search: query.trim() || undefined,
        });
        if (!isCancelled) {
          setRestaurants(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to connect to the restaurant server. Please make sure the backend is running."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isCancelled = true;
    };
  }, [sort, query]);

  const marketplace = view === "Home" || view === "Restaurants";

  function handleLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  function search(event: FormEvent) {
    event.preventDefault();
    setQuery(input);
    setView("Restaurants");
  }

  function handleNavigate(next: CustomerView) {
    if (next === "Cart") {
      navigate({ to: "/cart" });
    } else if (next === "Wishlist") {
      navigate({ to: "/wishlist" });
    } else if (next === "Orders") {
      navigate({ to: "/orders" });
    } else {
      setView(next);
      if (next === "Home") {
        setQuery("");
        setInput("");
      }
    }
  }

  function retryFetch() {
    setIsLoading(true);
    setError(null);
    fetchRestaurants({
      sort: sort !== "recommended" ? sort : undefined,
      search: query.trim() || undefined,
    })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to restaurant server. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <CustomerShell
      activeView={view}
      onNavigate={handleNavigate}
      customerId={session?.id ?? "QF1024"}
      customerName={session?.name}
      onLogout={handleLogout}
    >
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
            <div className="min-w-0"><h2 id="restaurants-heading" className="font-display text-2xl font-extrabold">{query.trim() ? "Your search results" : "Restaurants near you"}</h2><p className="mt-2 break-words text-sm text-muted-foreground" aria-live="polite">{restaurants.length} restaurants{query.trim() ? ` matching “${query.trim()}”` : " · Freshly made, delivered to you"}</p></div>
            <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="size-4 shrink-0" /><span className="sr-only">Sort restaurants</span><select aria-label="Sort restaurants" value={sort} onChange={(event) => setSort(event.target.value as RestaurantSort)} className="max-w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-ring"><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="fastest">Fastest delivery</option></select></label>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center" role="status">
              <Loader2 className="mx-auto size-9 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">Loading restaurants from server...</p>
            </div>
          )}

          {/* Error State with Retry Button */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center" role="alert">
              <AlertCircle className="mx-auto size-10 text-destructive" />
              <h3 className="mt-4 text-lg font-bold text-foreground">Could not load restaurants</h3>
              <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">{error}</p>
              <Button onClick={retryFetch} variant="outline" className="mt-5 gap-2">
                <RefreshCw className="size-4" />
                Retry
              </Button>
            </div>
          )}

          {/* Success / Loaded Grid */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>

              {restaurants.length === 0 && (
                <div className="py-16 text-center">
                  <UtensilsCrossed className="mx-auto size-10 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-bold">No restaurants found</h3>
                  <p className="mt-2 text-muted-foreground">Try another restaurant or cuisine.</p>
                  <Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setInput(""); }}>Clear search</Button>
                </div>
              )}
            </>
          )}

          <p className="mt-8 text-xs text-muted-foreground">Sample restaurants · Delivery times and ratings are illustrative.</p>
        </section>
      </> : <section className="py-6"><h1 className="text-3xl font-extrabold">{view}</h1><div className="py-20 text-center"><Package className="mx-auto size-12 text-brand-orange" /><h2 className="mt-5 text-xl font-bold">{view === "Orders" ? "No orders yet" : "We’re here for you"}</h2><p className="mx-auto mt-3 max-w-md text-muted-foreground">{view === "Orders" ? "Your order history will appear here once ordering is available." : "Customer support will be available when QuickFeast launches."}</p><Button className="mt-6" onClick={() => setView("Home")}>Back to restaurants</Button></div></section>}
    </CustomerShell>
  );
}