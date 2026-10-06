import { ArrowUpRight, Clock3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/lib/customer-restaurants";

export function RestaurantCard({ restaurant, onSelect }: { restaurant: Restaurant; onSelect: (restaurant: Restaurant) => void }) {
  return (
    <Button variant="ghost" className="group h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 text-left whitespace-normal shadow-sm transition-all hover:-translate-y-1 hover:bg-card hover:shadow-md motion-reduce:transform-none" onClick={() => onSelect(restaurant)} aria-label={`View ${restaurant.name}`}>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img src={restaurant.image} alt={restaurant.imageAlt} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none" />
        {restaurant.highlight && <span className="absolute left-3 top-3 rounded-md bg-card/95 px-3 py-1.5 text-xs font-bold text-card-foreground shadow-sm">{restaurant.highlight}</span>}
      </div>
      <div className="w-full p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-extrabold">{restaurant.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold"><Star className="fill-accent text-accent" />{restaurant.rating.toFixed(1)}</span>
        </div>
        <p className="mt-1 text-sm font-normal text-muted-foreground">{restaurant.cuisine}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Clock3 />{restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} min</span>
          <ArrowUpRight className="text-primary" />
        </div>
      </div>
    </Button>
  );
}