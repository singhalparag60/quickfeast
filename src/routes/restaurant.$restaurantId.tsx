import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Clock3, Loader2, RefreshCw, Star, UtensilsCrossed } from "lucide-react";

import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { FoodCard } from "@/components/food-card";
import { Button } from "@/components/ui/button";
import type { MenuItem, Restaurant } from "@/lib/customer-restaurants";
import { fetchRestaurantById } from "@/lib/api-client";
import { clearSession, getCurrentSession, type PrototypeSession } from "@/lib/prototype-auth";

export const Route = createFileRoute("/restaurant/$restaurantId")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `Restaurant Menu — QuickFeast` },
        { name: "description", content: "Explore fresh food and hand-crafted dishes on QuickFeast." },
        { property: "og:title", content: `Restaurant Menu — QuickFeast` },
        { property: "og:description", content: "Explore delicious food on QuickFeast." },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: RestaurantMenuPage,
});

function RestaurantMenuPage() {
  const { restaurantId } = Route.useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<PrototypeSession | null>(() => getCurrentSession());

  useEffect(() => {
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

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadRestaurant() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await fetchRestaurantById(restaurantId);
        if (!isCancelled) {
          setRestaurant(data.restaurant);
          setItems(data.menuItems);
        }
      } catch (err) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes("404") || message.includes("not found")) {
            setNotFound(true);
          } else {
            setError(message || "Failed to load restaurant menu. Please try again.");
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRestaurant();

    return () => {
      isCancelled = true;
    };
  }, [restaurantId]);

  function handleLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  function handleNavigate(view: CustomerView) {
    if (view === "Cart") {
      navigate({ to: "/cart" });
    } else if (view === "Wishlist") {
      navigate({ to: "/wishlist" });
    } else if (view === "Orders") {
      navigate({ to: "/orders" });
    } else {
      navigate({ to: "/home" });
    }
  }

  function retryFetch() {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    fetchRestaurantById(restaurantId)
      .then((data) => {
        setRestaurant(data.restaurant);
        setItems(data.menuItems);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("404") || message.includes("not found")) {
          setNotFound(true);
        } else {
          setError(message || "Failed to load restaurant menu.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Not Found State
  if (notFound) {
    return (
      <CustomerShell
        activeView="Restaurants"
        onNavigate={handleNavigate}
        customerId={session?.id ?? "QF1024"}
        customerName={session?.name}
        onLogout={handleLogout}
      >
        <div className="py-20 text-center">
          <UtensilsCrossed className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-extrabold">Restaurant Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find the restaurant you were looking for.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/home">Back to restaurants</Link>
          </Button>
        </div>
      </CustomerShell>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <CustomerShell
        activeView="Restaurants"
        onNavigate={handleNavigate}
        customerId={session?.id ?? "QF1024"}
        customerName={session?.name}
        onLogout={handleLogout}
      >
        <div className="py-24 text-center" role="status">
          <Loader2 className="mx-auto size-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Loading menu items from server...
          </p>
        </div>
      </CustomerShell>
    );
  }

  // Error State
  if (error || !restaurant) {
    return (
      <CustomerShell
        activeView="Restaurants"
        onNavigate={handleNavigate}
        customerId={session?.id ?? "QF1024"}
        customerName={session?.name}
        onLogout={handleLogout}
      >
        <div className="py-20 text-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 max-w-lg mx-auto" role="alert">
          <AlertCircle className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Could not load restaurant menu</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error ?? "An unexpected error occurred."}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={retryFetch} variant="default" className="gap-2">
              <RefreshCw className="size-4" />
              Retry
            </Button>
            <Button asChild variant="outline">
              <Link to="/home">Back to restaurants</Link>
            </Button>
          </div>
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell
      activeView="Restaurants"
      onNavigate={handleNavigate}
      customerId={session?.id ?? "QF1024"}
      customerName={session?.name}
      onLogout={handleLogout}
    >
      <div className="space-y-8">
        {/* Navigation back button */}
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link to="/home">
              <ArrowLeft className="size-4" />
              <span>Back to restaurants</span>
            </Link>
          </Button>
        </div>

        {/* Restaurant Header Section */}
        <section
          aria-labelledby="restaurant-header-heading"
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold sm:text-sm">
                <span className="flex items-center gap-1 rounded-md bg-accent/40 px-2 py-0.5 font-bold text-foreground">
                  <Star className="size-3.5 fill-accent text-accent" />
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{restaurant.cuisine}</span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  {restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} min
                </span>
              </div>

              <h1
                id="restaurant-header-heading"
                className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground"
              >
                {restaurant.name}
              </h1>

              {restaurant.description && (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {restaurant.description}
                </p>
              )}
            </div>

            {/* Restaurant Cover Image */}
            <div className="relative aspect-[16/10] w-full max-w-xs overflow-hidden rounded-2xl border border-border/60 shadow-sm md:w-64">
              <img
                src={restaurant.image}
                alt={restaurant.imageAlt}
                width={640}
                height={400}
                className="h-full w-full object-cover"
              />
              {restaurant.highlight && (
                <span className="absolute left-3 top-3 rounded-md bg-card/90 px-2.5 py-1 text-xs font-bold text-card-foreground shadow-sm">
                  {restaurant.highlight}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section aria-labelledby="menu-heading" className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="menu-heading" className="font-display text-2xl font-extrabold text-foreground">
                Menu
              </h2>
              <p className="text-sm text-muted-foreground">
                {items.length} delicious items available
              </p>
            </div>
          </div>

          {/* Responsive Food Grid: 1 column mobile, 2 columns tablet, 3 columns desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                restaurantName={restaurant.name}
                customerId={session?.id}
              />
            ))}
          </div>
        </section>
      </div>
    </CustomerShell>
  );
}
