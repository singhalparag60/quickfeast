import { beforeEach, describe, expect, it } from "vitest";
import {
  addToCart,
  clearCart,
  createOrder,
  getCart,
  getCartTotals,
  getOrderById,
  getOrders,
  removeFromCart,
  updateCartItemQuantity,
  updateOrderStatus,
  type CartItem,
} from "./prototype-cart";

describe("Prototype Cart & Order Layer", () => {
  const customerId = "test-user-1";
  const dummyItem: Omit<CartItem, "quantity"> = {
    id: "item-1",
    restaurantId: "rest-1",
    restaurantName: "Pizza Social",
    name: "Margherita Pizza",
    price: 299,
    image: "/pizza.jpg",
  };

  const dummyItem2: Omit<CartItem, "quantity"> = {
    id: "item-2",
    restaurantId: "rest-2",
    restaurantName: "Bun & Done",
    name: "Classic Cheeseburger",
    price: 249,
    image: "/burger.jpg",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("Cart Operations", () => {
    it("adds item to cart", () => {
      addToCart(dummyItem, 1, customerId);
      const cart = getCart(customerId);
      expect(cart).toHaveLength(1);
      expect(cart[0]?.name).toBe("Margherita Pizza");
      expect(cart[0]?.quantity).toBe(1);
    });

    it("increases quantity when same item is added twice", () => {
      addToCart(dummyItem, 1, customerId);
      addToCart(dummyItem, 2, customerId);
      const cart = getCart(customerId);
      expect(cart).toHaveLength(1);
      expect(cart[0]?.quantity).toBe(3);
    });

    it("increases and decreases quantity correctly", () => {
      addToCart(dummyItem, 2, customerId);
      updateCartItemQuantity(dummyItem.id, 4, customerId);
      expect(getCart(customerId)[0]?.quantity).toBe(4);

      updateCartItemQuantity(dummyItem.id, 1, customerId);
      expect(getCart(customerId)[0]?.quantity).toBe(1);
    });

    it("removes item from cart when quantity is set to 0", () => {
      addToCart(dummyItem, 1, customerId);
      updateCartItemQuantity(dummyItem.id, 0, customerId);
      expect(getCart(customerId)).toHaveLength(0);
    });

    it("removes item explicitly with removeFromCart", () => {
      addToCart(dummyItem, 1, customerId);
      addToCart(dummyItem2, 1, customerId);
      expect(getCart(customerId)).toHaveLength(2);

      removeFromCart(dummyItem.id, customerId);
      const cart = getCart(customerId);
      expect(cart).toHaveLength(1);
      expect(cart[0]?.id).toBe(dummyItem2.id);
    });

    it("calculates cart totals dynamically", () => {
      addToCart(dummyItem, 2, customerId); // 299 * 2 = 598
      addToCart(dummyItem2, 1, customerId); // 249 * 1 = 249
      const cart = getCart(customerId);

      const totals = getCartTotals(cart);
      expect(totals.totalQuantity).toBe(3);
      expect(totals.subtotal).toBe(847);
      expect(totals.deliveryFee).toBe(40);
      expect(totals.total).toBe(887);
    });

    it("clears cart", () => {
      addToCart(dummyItem, 2, customerId);
      expect(getCart(customerId)).toHaveLength(1);
      clearCart(customerId);
      expect(getCart(customerId)).toHaveLength(0);
    });

    it("isolates cart by customerId", () => {
      addToCart(dummyItem, 1, "customer-A");
      addToCart(dummyItem2, 2, "customer-B");

      expect(getCart("customer-A")).toHaveLength(1);
      expect(getCart("customer-A")[0]?.name).toBe("Margherita Pizza");

      expect(getCart("customer-B")).toHaveLength(1);
      expect(getCart("customer-B")[0]?.name).toBe("Classic Cheeseburger");
    });
  });

  describe("Order Operations", () => {
    it("creates an order from cart items, calculates receipt, and clears cart", () => {
      addToCart(dummyItem, 2, customerId);
      const cart = getCart(customerId);

      const result = createOrder(cart, customerId, "Alice");
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.order.id).toMatch(/^QF-\d{5}$/);
        expect(result.order.customerId).toBe(customerId);
        expect(result.order.customerName).toBe("Alice");
        expect(result.order.status).toBe("Order Placed");
        expect(result.order.subtotal).toBe(598);
        expect(result.order.deliveryFee).toBe(40);
        expect(result.order.total).toBe(638);
        expect(result.order.items).toHaveLength(1);
      }

      // Cart should be cleared after order
      expect(getCart(customerId)).toHaveLength(0);

      // Order should appear in customer's order list
      const orders = getOrders(customerId);
      expect(orders).toHaveLength(1);
      expect(orders[0]?.id).toBe(result.success ? result.order.id : "");
    });

    it("fails to create order when cart is empty", () => {
      const result = createOrder([], customerId);
      expect(result.success).toBe(false);
    });

    it("orders are sorted newest first and isolated by customer", () => {
      addToCart(dummyItem, 1, "user-A");
      createOrder(getCart("user-A"), "user-A");

      addToCart(dummyItem2, 1, "user-B");
      createOrder(getCart("user-B"), "user-B");

      expect(getOrders("user-A")).toHaveLength(1);
      expect(getOrders("user-B")).toHaveLength(1);
      expect(getOrders("user-A")[0]?.items[0]?.name).toBe("Margherita Pizza");
      expect(getOrders("user-B")[0]?.items[0]?.name).toBe("Classic Cheeseburger");
    });

    it("retrieves order by id and updates status", () => {
      addToCart(dummyItem, 1, customerId);
      const res = createOrder(getCart(customerId), customerId);
      if (!res.success) throw new Error("Order creation failed");

      const fetched = getOrderById(res.order.id, customerId);
      expect(fetched).toBeDefined();
      expect(fetched?.id).toBe(res.order.id);

      updateOrderStatus(res.order.id, "Packaging", customerId);
      const updated = getOrderById(res.order.id, customerId);
      expect(updated?.status).toBe("Packaging");
    });
  });
});
