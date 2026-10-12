/**
 * QuickFeast Cart & Order Prototype Management Layer
 *
 * NOTE: This is currently a frontend prototype state layer using localStorage.
 * Structured cleanly with types and helper functions so it can easily be replaced
 * by a REST/GraphQL API or MongoDB backend without touching the UI components.
 */

import { getCurrentSession } from "./prototype-auth";

export interface CartItem {
  id: string; // food item id (e.g., 'bd-classic-cheeseburger')
  restaurantId: string;
  restaurantName: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "Order Placed"
  | "Packaging"
  | "Out for Delivery"
  | "Delivered";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string; // e.g., 'QF-10482'
  customerId: string;
  customerName?: string | undefined;
  items: OrderItem[];
  restaurantNames: string[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string
}

export const DELIVERY_FEE = 40; // Flat INR delivery fee in prototype

function getCartStorageKey(customerId: string): string {
  return `quickfeast_cart_${customerId}`;
}

function getOrdersStorageKey(customerId: string): string {
  return `quickfeast_orders_${customerId}`;
}

function getActiveCustomerId(): string {
  const session = getCurrentSession();
  return session?.id ?? "guest";
}

/* ==========================================================================
   CART OPERATIONS
   ========================================================================== */

export function getCart(customerId?: string): CartItem[] {
  if (typeof window === "undefined") return [];
  const cid = customerId ?? getActiveCustomerId();
  try {
    const raw = localStorage.getItem(getCartStorageKey(cid));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read cart from localStorage:", err);
    return [];
  }
}

export function saveCart(items: CartItem[], customerId?: string): void {
  if (typeof window === "undefined") return;
  const cid = customerId ?? getActiveCustomerId();
  try {
    localStorage.setItem(getCartStorageKey(cid), JSON.stringify(items));
    window.dispatchEvent(new Event("quickfeast_cart_change"));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity = 1,
  customerId?: string
): CartItem[] {
  const current = getCart(customerId);
  const existingIndex = current.findIndex((i) => i.id === item.id);

  const existingItem = current[existingIndex];
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    current.push({ ...item, quantity });
  }

  saveCart(current, customerId);
  return current;
}

export function updateCartItemQuantity(
  itemId: string,
  quantity: number,
  customerId?: string
): CartItem[] {
  const current = getCart(customerId);
  const updated = current
    .map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCart(updated, customerId);
  return updated;
}

export function removeFromCart(itemId: string, customerId?: string): CartItem[] {
  const current = getCart(customerId);
  const filtered = current.filter((item) => item.id !== itemId);
  saveCart(filtered, customerId);
  return filtered;
}

export function clearCart(customerId?: string): void {
  if (typeof window === "undefined") return;
  const cid = customerId ?? getActiveCustomerId();
  try {
    localStorage.removeItem(getCartStorageKey(cid));
    window.dispatchEvent(new Event("quickfeast_cart_change"));
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
}

export function getCartTotals(items: CartItem[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return {
    totalQuantity,
    subtotal,
    deliveryFee,
    total,
  };
}

/* ==========================================================================
   ORDER OPERATIONS
   ========================================================================== */

export function generateOrderId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `QF-${randomSuffix}`;
}

export function getOrders(customerId?: string): Order[] {
  if (typeof window === "undefined") return [];
  const cid = customerId ?? getActiveCustomerId();
  try {
    const raw = localStorage.getItem(getOrdersStorageKey(cid));
    const orders: Order[] = raw ? JSON.parse(raw) : [];

    // Dynamically update prototype progression status based on order age
    // (Progression: Order Placed -> Packaging (after 1m) -> Out for Delivery (after 3m) -> Delivered (after 6m))
    const now = Date.now();
    let updated = false;

    for (const order of orders) {
      if (order.status !== "Delivered") {
        const orderAgeMs = now - new Date(order.createdAt).getTime();
        let newStatus: OrderStatus = order.status;

        if (orderAgeMs > 6 * 60 * 1000) {
          newStatus = "Delivered";
        } else if (orderAgeMs > 3 * 60 * 1000) {
          newStatus = "Out for Delivery";
        } else if (orderAgeMs > 60 * 1000) {
          newStatus = "Packaging";
        }

        if (newStatus !== order.status) {
          order.status = newStatus;
          updated = true;
        }
      }
    }

    if (updated) {
      localStorage.setItem(getOrdersStorageKey(cid), JSON.stringify(orders));
    }

    // Sort newest first
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error("Failed to read orders from localStorage:", err);
    return [];
  }
}

export function getOrderById(orderId: string, customerId?: string): Order | undefined {
  const orders = getOrders(customerId);
  return orders.find((o) => o.id === orderId);
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  customerId?: string
): Order | undefined {
  if (typeof window === "undefined") return undefined;
  const cid = customerId ?? getActiveCustomerId();
  const orders = getOrders(cid);
  const target = orders.find((o) => o.id === orderId);

  if (target) {
    target.status = newStatus;
    localStorage.setItem(getOrdersStorageKey(cid), JSON.stringify(orders));
    window.dispatchEvent(new Event("quickfeast_orders_change"));
    return target;
  }
  return undefined;
}

export function createOrder(
  cartItems: CartItem[],
  customerId?: string,
  customerName?: string
): { success: true; order: Order } | { success: false; error: string } {
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Cannot create an order with an empty cart." };
  }

  const cid = customerId ?? getActiveCustomerId();
  const totals = getCartTotals(cartItems);

  // Extract unique restaurant names
  const restaurantNames = Array.from(
    new Set(cartItems.map((item) => item.restaurantName))
  );

  const orderItems: OrderItem[] = cartItems.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    restaurantId: i.restaurantId,
    restaurantName: i.restaurantName,
  }));

  const newOrder: Order = {
    id: generateOrderId(),
    customerId: cid,
    customerName: customerName ?? getCurrentSession()?.name,
    items: orderItems,
    restaurantNames,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    status: "Order Placed",
    createdAt: new Date().toISOString(),
  };

  const existingOrders = getOrders(cid);
  existingOrders.unshift(newOrder);

  try {
    localStorage.setItem(getOrdersStorageKey(cid), JSON.stringify(existingOrders));
    // Clear purchased cart items for this customer
    clearCart(cid);
    window.dispatchEvent(new Event("quickfeast_orders_change"));
    return { success: true, order: newOrder };
  } catch (err) {
    console.error("Failed to save order:", err);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}
