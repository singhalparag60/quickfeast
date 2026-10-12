import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import {
  clearCart,
  createOrder,
  getCart,
  getCartTotals,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
  type Order,
} from "@/lib/prototype-cart";
import { clearSession, getCurrentSession, type PrototypeSession } from "@/lib/prototype-auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — QuickFeast" },
      { name: "description", content: "Review items in your QuickFeast cart and place your order." },
      { property: "og:title", content: "Your Cart — QuickFeast" },
      { property: "og:description", content: "Review items in your QuickFeast cart and place your order." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PrototypeSession | null>(() => getCurrentSession());
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCart(session?.id));
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
    function syncCart() {
      setCartItems(getCart(session?.id));
    }
    syncCart();
    window.addEventListener("quickfeast_cart_change", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("quickfeast_cart_change", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [session?.id]);

  function handleLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  function handleNavigate(view: CustomerView) {
    if (view === "Home" || view === "Restaurants") {
      navigate({ to: "/home" });
    } else if (view === "Wishlist") {
      navigate({ to: "/wishlist" });
    } else if (view === "Orders") {
      navigate({ to: "/orders" });
    } else if (view === "Cart") {
      // already on cart
      setPlacedOrder(null);
    } else {
      navigate({ to: "/home" });
    }
  }

  function handleQuantityChange(itemId: string, newQty: number) {
    if (newQty < 1) {
      removeFromCart(itemId, session?.id);
    } else {
      updateCartItemQuantity(itemId, newQty, session?.id);
    }
  }

  function handleRemove(itemId: string) {
    removeFromCart(itemId, session?.id);
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);

    const result = createOrder(cartItems, session?.id, session?.name);
    if (result.success) {
      setPlacedOrder(result.order);
      setIsPlacingOrder(false);
    } else {
      alert(result.error);
      setIsPlacingOrder(false);
    }
  }

  const totals = getCartTotals(cartItems);

  // Group items by restaurant
  const itemsByRestaurant = cartItems.reduce(
    (acc, item) => {
      const group = acc[item.restaurantName];
      if (!group) {
        acc[item.restaurantName] = [item];
      } else {
        group.push(item);
      }
      return acc;
    },
    {} as Record<string, CartItem[]>
  );

  return (
    <CustomerShell
      activeView="Cart"
      onNavigate={handleNavigate}
      customerId={session?.id ?? "QF1024"}
      customerName={session?.name}
      onLogout={handleLogout}
    >
      {placedOrder ? (
        /* Order Success State */
        <div className="mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-300 py-6">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center shadow-lg">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>

            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Order placed successfully!
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Your order <span className="font-bold text-foreground">#{placedOrder.id}</span> has been received and sent to the kitchen.
            </p>

            <div className="mt-8 rounded-2xl border border-border/80 bg-background/60 p-5 text-left">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                  {placedOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-3 text-sm">
                <span className="text-muted-foreground">Restaurants</span>
                <span className="font-medium text-foreground">
                  {placedOrder.restaurantNames.join(", ")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-3 text-sm">
                <span className="text-muted-foreground">Items count</span>
                <span className="font-medium text-foreground">
                  {placedOrder.items.reduce((sum, i) => sum + i.quantity, 0)} items
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="font-semibold text-foreground">Total Paid</span>
                <span className="text-xl font-extrabold text-foreground">₹{placedOrder.total}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="h-12 rounded-xl px-6 font-bold shadow-md shadow-primary/20"
              >
                <Link to="/orders">
                  View Orders
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl px-6"
              >
                <Link to="/home">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="py-16 text-center animate-in fade-in duration-200">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="size-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-foreground">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-base text-muted-foreground">
            Looks like you haven't added anything delicious yet. Browse our curated restaurant menus to get started.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8 text-base shadow-lg shadow-primary/20">
            <Link to="/home">
              <UtensilsCrossed className="mr-2 size-5" />
              Explore Restaurants
            </Link>
          </Button>
        </div>
      ) : (
        /* Populated Cart State */
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
                <span>Continue browsing restaurants</span>
              </Link>
            </Button>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Your Cart
              </h1>
              <span className="text-sm font-semibold text-muted-foreground">
                {totals.totalQuantity} {totals.totalQuantity === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
            {/* Cart Items List */}
            <div className="space-y-6">
              {Object.entries(itemsByRestaurant).map(([restaurantName, items]) => (
                <section
                  key={restaurantName}
                  aria-labelledby={`restaurant-group-${restaurantName}`}
                  className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs"
                >
                  <div className="mb-4 border-b border-border/70 pb-3">
                    <h2
                      id={`restaurant-group-${restaurantName}`}
                      className="font-display text-lg font-bold text-foreground"
                    >
                      {restaurantName}
                    </h2>
                  </div>

                  <div className="divide-y divide-border/60">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        {/* Image + Info */}
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={160}
                            height={120}
                            className="size-20 shrink-0 rounded-2xl object-cover border border-border/50"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-base font-bold text-foreground truncate">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">
                              {item.restaurantName}
                            </p>
                            <p className="mt-1.5 text-sm font-extrabold text-foreground">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-foreground hover:bg-background"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-9 text-center text-sm font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-foreground hover:bg-background"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <p className="text-base font-extrabold text-foreground">
                              ₹{item.price * item.quantity}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="size-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearCart(session?.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Clear entire cart
                </Button>
              </div>
            </div>

            {/* Order Summary Card */}
            <div>
              <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3.5 border-b border-border/70 pb-5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">₹{totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery fee</span>
                    <span className="font-semibold text-foreground">₹{totals.deliveryFee}</span>
                  </div>
                </div>

                <div className="flex justify-between py-5 text-lg font-extrabold text-foreground">
                  <span>Total</span>
                  <span>₹{totals.total}</span>
                </div>

                <Button
                  type="button"
                  size="lg"
                  disabled={isPlacingOrder || cartItems.length === 0}
                  onClick={handlePlaceOrder}
                  className="h-13 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Standard delivery · 20–35 mins estimated
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
}
