import { describe, expect, it, beforeEach } from "vitest";
import {
  isValidGmail,
  registerUser,
  loginUser,
  getCurrentSession,
  clearSession,
  getRegisteredUsers,
} from "./prototype-auth";

describe("Prototype Auth Validation & Operations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("isValidGmail", () => {
    it("accepts valid gmail addresses", () => {
      expect(isValidGmail("user@gmail.com")).toBe(true);
      expect(isValidGmail("test123@gmail.com")).toBe(true);
      expect(isValidGmail("USER@GMAIL.COM")).toBe(true);
      expect(isValidGmail("john.doe+tag@gmail.com")).toBe(true);
    });

    it("rejects non-gmail and malformed addresses", () => {
      expect(isValidGmail("user@yahoo.com")).toBe(false);
      expect(isValidGmail("user@gmail.co")).toBe(false);
      expect(isValidGmail("user@gmail.com.evil")).toBe(false);
      expect(isValidGmail("user@gmail.com.example")).toBe(false);
      expect(isValidGmail("user@notgmail.com")).toBe(false);
      expect(isValidGmail("user@gmail")).toBe(false);
      expect(isValidGmail("")).toBe(false);
      expect(isValidGmail("   ")).toBe(false);
    });
  });

  describe("registerUser", () => {
    it("rejects non-gmail emails", () => {
      const res = registerUser({
        name: "Alice",
        email: "alice@outlook.com",
        password: "password123",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toMatch(/@gmail\.com/);
      }
    });

    it("rejects short passwords (< 6 chars)", () => {
      const res = registerUser({
        name: "Alice",
        email: "alice@gmail.com",
        password: "123",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toMatch(/at least 6 characters/);
      }
    });

    it("successfully creates a prototype user, generates customer ID, and sets session", () => {
      const res = registerUser({
        name: "Alice Smith",
        email: "alice@gmail.com",
        password: "password123",
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.user.name).toBe("Alice Smith");
        expect(res.user.email).toBe("alice@gmail.com");
        expect(res.user.id).toMatch(/^QF-\d{4}$/);
      }

      // Check session
      const session = getCurrentSession();
      expect(session).not.toBeNull();
      expect(session?.name).toBe("Alice Smith");
      expect(session?.email).toBe("alice@gmail.com");

      // Check stored users
      const users = getRegisteredUsers();
      expect(users.length).toBe(1);
    });

    it("prevents duplicate registration with same email (case-insensitive)", () => {
      registerUser({
        name: "Alice",
        email: "alice@gmail.com",
        password: "password123",
      });
      const duplicate = registerUser({
        name: "Alice 2",
        email: "ALICE@gmail.com",
        password: "differentpassword",
      });
      expect(duplicate.success).toBe(false);
      if (!duplicate.success) {
        expect(duplicate.error).toMatch(/already exists/);
      }
    });
  });

  describe("loginUser", () => {
    it("rejects non-gmail emails", () => {
      const res = loginUser({
        email: "someone@yahoo.com",
        password: "password123",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toMatch(/@gmail\.com/);
      }
    });

    it("rejects non-existent users or incorrect passwords", () => {
      registerUser({
        name: "Bob",
        email: "bob@gmail.com",
        password: "correctpassword",
      });

      const badEmail = loginUser({
        email: "nobody@gmail.com",
        password: "correctpassword",
      });
      expect(badEmail.success).toBe(false);

      const badPass = loginUser({
        email: "bob@gmail.com",
        password: "wrongpassword",
      });
      expect(badPass.success).toBe(false);
    });

    it("successfully logs in matching registered user and updates session", () => {
      registerUser({
        name: "Bob",
        email: "bob@gmail.com",
        password: "correctpassword",
      });
      clearSession();
      expect(getCurrentSession()).toBeNull();

      const res = loginUser({
        email: "BOB@GMAIL.COM",
        password: "correctpassword",
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.user.name).toBe("Bob");
      }
      expect(getCurrentSession()?.name).toBe("Bob");
    });
  });

  describe("clearSession", () => {
    it("clears current session", () => {
      registerUser({
        name: "Carol",
        email: "carol@gmail.com",
        password: "password123",
      });
      expect(getCurrentSession()).not.toBeNull();
      clearSession();
      expect(getCurrentSession()).toBeNull();
    });
  });
});
