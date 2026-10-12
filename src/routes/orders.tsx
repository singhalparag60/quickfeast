import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Package,
  Store,
  UtensilsCrossed,
} from "lucide-react";

import { CustomerShell, type CustomerView } from "@/components/customer-shell";
import { OrderStatusTracker } from "@/components/order-status-tracker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOrders, type Order } from "@/lib/prototype-cart";
import { clearSession, getCurrentSession, type PrototypeSession } from "@/lib/prototype-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — QuickFeast" },
      { name: "description", content: "View your order history and live delivery statuses on QuickFeast." },
      { property: "og:title", content: "Your Orders — QuickFeast" },
      { property: "og:description", content: "View your order history and live delivery statuses on QuickFeast." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PrototypeSession | null>(() => getCurrentSession());
  const [orders, setOrders] = useState<Order[]>(() => getOrders(session?.id));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
    function syncOrders() {
      const current = getOrders(session?.id);
      setOrders(current);
      // If modal open, update selected order reference
      setSelectedOrder((prev) => (prev ? current.find((o) => o.id === prev.id) || prev : null));
    }
    syncOrders();
    window.addEventListener("quickfeast_orders_change", syncOrders);
    window.addEventListener("storage", syncOrders);
    return () => {
      window.removeEventListener("quickfeast_orders_change", syncOrders);
      window.removeEventListener("storage", syncOrders);
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
      navigate({ to: "/wishlist" });
    } else if (view === "Orders") {
      // already on orders
    } else {
      navigate({ to: "/home" });
    }
  }

  function formatOrderDate(isoString: string): string {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    } catch {
      return isoString;
    }
  }

  return (
    <CustomerShell
      activeView="Orders"
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Your Orders
            </h1>
            <span className="text-sm font-semibold text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order placed" : "orders placed"}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          /* Empty Orders State */
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-xs">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
              <Package className="size-10" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">
              No orders yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              You haven’t placed any orders yet. Discover your neighborhood favorites and enjoy hot food delivered to your door.
            </p>
            <Button asChild className="mt-6 rounded-full px-7">
              <Link to="/home">
                <UtensilsCrossed className="mr-2 size-4" />
                Explore Restaurants
              </Link>
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {orders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-extrabold text-foreground">
                          Order #{order.id}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-3 py-0.5 text-xs font-bold",
                            order.status === "Delivered"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : order.status === "Out for Delivery"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : order.status === "Packaging"
                              ? "bg-brand-orange/15 text-brand-orange"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-muted-foreground">Order Total</span>
                      <p className="text-xl font-extrabold text-foreground">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Store className="size-4 text-primary" />
                        {order.restaurantNames.join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {totalItems} {totalItems === 1 ? "item" : "items"} · {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="gap-1.5 self-start rounded-xl font-semibold sm:self-center"
                    >
                      <span>View Details</span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl p-6 sm:p-8">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <DialogTitle className="font-display text-2xl font-extrabold">
                      Order #{selectedOrder.id}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-xs">
                      Placed on {formatOrderDate(selectedOrder.createdAt)}
                    </DialogDescription>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      selectedOrder.status === "Delivered"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : selectedOrder.status === "Out for Delivery"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : selectedOrder.status === "Packaging"
                        ? "bg-brand-orange/15 text-brand-orange"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </DialogHeader>

              {/* Status Tracker */}
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xs">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Delivery Status
                </h3>
                <OrderStatusTracker status={selectedOrder.status} />
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Items ({selectedOrder.restaurantNames.join(", ")})
                </h3>
                <div className="max-h-56 overflow-y-auto divide-y divide-border/60 rounded-2xl border border-border bg-card px-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="size-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.restaurantName} · ₹{item.price} each
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-foreground">₹{selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-2 text-base font-extrabold text-foreground">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="rounded-xl">
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </CustomerShell>
  );
}
