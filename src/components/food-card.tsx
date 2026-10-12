import { useEffect, useState } from "react";
import { Check, Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/lib/customer-restaurants";
import { addToCart } from "@/lib/prototype-cart";
import { isItemInWishlist, toggleWishlist } from "@/lib/prototype-wishlist";
import { cn } from "@/lib/utils";

export function FoodCard({
  item,
  restaurantName = "QuickFeast Kitchen",
  customerId,
  onWishlistChange,
}: {
  item: MenuItem;
  restaurantName?: string;
  customerId?: string | undefined;
  onWishlistChange?: ((isWishlisted: boolean) => void) | undefined;
}) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => isItemInWishlist(item.id, customerId));

  useEffect(() => {
    function syncWishlist() {
      setWishlisted(isItemInWishlist(item.id, customerId));
    }
    syncWishlist();
    window.addEventListener("quickfeast_wishlist_change", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("quickfeast_wishlist_change", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [item.id, customerId]);

  function handleAddToCart() {
    addToCart({
      id: item.id,
      restaurantId: item.restaurantId,
      restaurantName,
      name: item.name,
      image: item.image,
      price: item.price,
    }, 1, customerId);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist(
      {
        foodItemId: item.id,
        restaurantId: item.restaurantId,
        restaurantName,
        name: item.name,
        image: item.image,
        price: item.price,
        rating: item.rating,
        ingredients: item.ingredients,
        category: item.category,
      },
      customerId
    );
    setWishlisted(result.isWishlisted);
    onWishlistChange?.(result.isWishlisted);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none">
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

        {/* Wishlist / Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 grid size-8.5 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 motion-reduce:transform-none",
            wishlisted
              ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              : "text-muted-foreground hover:text-rose-500 hover:bg-card"
          )}
        >
          <Heart
            className={cn(
              "size-4.5 transition-all duration-200",
              wishlisted && "fill-rose-500 text-rose-500"
            )}
          />
        </button>
      </div>

      {/* Food Content Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
            {item.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-accent/30 px-2 py-0.5 text-xs font-bold text-foreground">
            <Star className="size-3.5 fill-accent text-accent" />
            {item.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          <span className="font-medium text-foreground/80">Ingredients: </span>
          {item.ingredients}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-border/50">
          <div>
            <span className="text-xs font-normal text-muted-foreground">Price</span>
            <p className="text-lg font-extrabold text-foreground">₹{item.price}</p>
          </div>

          <Button
            type="button"
            variant={added ? "secondary" : "default"}
            size="sm"
            onClick={handleAddToCart}
            className="h-9 gap-1.5 rounded-xl px-3.5 font-semibold shadow-xs transition-all duration-200"
            aria-label={`Add ${item.name} to cart`}
          >
            {added ? (
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
}
