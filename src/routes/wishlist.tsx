import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Heart,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/prototype-cart";
import {
  clearWishlist,
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/prototype-wishlist";
import { clearSession, getCurrentSession, type PrototypeSession } from "@/lib/prototype-auth";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — QuickFeast" },
      { name: "description", content: "Your saved favorite dishes, all in one place on QuickFeast." },
      { property: "og:title", content: "My Wishlist — QuickFeast" },
      { property: "og:description", content: "Your saved favorite dishes, all in one place on QuickFeast." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PrototypeSession | null>(() => getCurrentSession());
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() =>
    getWishlist(session?.id)
  );
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSession(getCurrentSession());
    const authHandler = () => setSession(getCurrentSession());
    window.addEventListener("quickfeast_auth_change", authHandler);
    window.addEventListener("storage", authHandler);
    return () => {
      window.removeEventListener("quickfeast_auth_change", authHandler);
      window.removeEventListener("storage", authHandler);
    };
  }, []);

  useEffect(() => {
    function syncWishlist() {
      setWishlistItems(getWishlist(session?.id));
    }
    syncWishlist();
    window.addEventListener("quickfeast_wishlist_change", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("quickfeast_wishlist_change", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [session?.id]);

  function handleLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  function handleNavigate(view: CustomerView) {
    if (view === "Home" || view === "Restaurants") {
      navigate({ to: "/home" });
    } else if (view === "Cart") {
      navigate({ to: "/cart" });
    } else if (view === "Wishlist") {
      // already on wishlist
    } else if (view === "Orders") {
      navigate({ to: "/orders" });
    } else {
      navigate({ to: "/home" });
    }
  }

  function handleRemove(foodItemId: string) {
    const updated = removeFromWishlist(foodItemId, session?.id);
    setWishlistItems(updated);
  }

  function handleAddToCart(item: WishlistItem) {
    addToCart(
      {
        id: item.foodItemId,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        name: item.name,
        image: item.image,
        price: item.price,
      },
      1,
      session?.id
    );

    setAddedMap((prev) => ({ ...prev, [item.foodItemId]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.foodItemId]: false }));
    }, 1200);
  }

  return (
    <CustomerShell
      activeView="Wishlist"
      onNavigate={handleNavigate}
      customerId={session?.id ?? "QF1024"}
      customerName={session?.name}
      onLogout={handleLogout}
    >
      <div className="space-y-8 animate-in fade-in duration-200">
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

          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your saved favorites, all in one place.
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <span className="text-sm font-semibold text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item saved" : "items saved"}
              </span>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-xs">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-rose-500/10 text-rose-500">
              <Heart className="size-10 fill-rose-500" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Save the dishes you love and find them here later with quick 1-click ordering.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-8 shadow-md shadow-primary/20">
              <Link to="/home">
                <UtensilsCrossed className="mr-2 size-5" />
                Explore Restaurants
              </Link>
            </Button>
          </div>
        ) : (
          /* Populated Wishlist Grid */
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => {
                const isAdded = Boolean(addedMap[item.foodItemId]);

                return (
                  <article
                    key={item.foodItemId}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none"
                  >
                    {/* Food Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={640}
                        height={400}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                      {item.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur-xs">
                          {item.category}
                        </span>
                      )}

                      {/* Remove from Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.foodItemId)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        title="Remove from wishlist"
                        className="absolute right-3 top-3 grid size-8.5 place-items-center rounded-full bg-card/95 text-rose-500 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 motion-reduce:transform-none"
                      >
                        <Heart className="size-4.5 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    {/* Food Content Details */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                            {item.restaurantName}
                          </p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 rounded-md bg-accent/30 px-2 py-0.5 text-xs font-bold text-foreground">
                          <Star className="size-3.5 fill-accent text-accent" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>

                      {item.ingredients && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          <span className="font-medium text-foreground/80">Ingredients: </span>
                          {item.ingredients}
                        </p>
                      )}

                      {/* Pricing & Add to Cart */}
                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-border/50">
                        <div>
                          <span className="text-xs font-normal text-muted-foreground">Price</span>
                          <p className="text-lg font-extrabold text-foreground">₹{item.price}</p>
                        </div>

                        <Button
                          type="button"
                          variant={isAdded ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="h-9 gap-1.5 rounded-xl px-3.5 font-semibold shadow-xs transition-all duration-200"
                          aria-label={`Add ${item.name} to cart`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">Added!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="size-4" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Clear All Wishlist Action */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearWishlist(session?.id);
                  setWishlistItems([]);
                }}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Clear all wishlist items
              </Button>
            </div>
          </div>
        )}
      </div>
    </CustomerShell>
  );
}
