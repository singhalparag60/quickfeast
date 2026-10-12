/**
 * Frontend Prototype Auth & Session Management
 *
 * NOTE: This is currently only a frontend prototype using localStorage.
 * This is NOT a production authentication system and does not talk to a backend server.
 * The functions and types here are structured so they can later be replaced with real backend API calls.
 */

export interface PrototypeUser {
  id: string; // e.g. "QF-4821"
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface PrototypeSession {
  id: string;
  name: string;
  email: string;
}

const STORAGE_USERS_KEY = "quickfeast_prototype_users";
const STORAGE_SESSION_KEY = "quickfeast_prototype_session";

// Email validation helper: strictly ending in @gmail.com (case-insensitive)
export function isValidGmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  // Ensure exactly one @ before gmail.com, valid chars before @, and nothing after .com
  const gmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/;
  return gmailRegex.test(trimmed);
}

// Generate unique customer ID (e.g., QF-4912)
export function generateCustomerId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `QF-${randomSuffix}`;
}

export function getRegisteredUsers(): PrototypeUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read prototype users from localStorage:", e);
    return [];
  }
}

export function saveRegisteredUsers(users: PrototypeUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save prototype users to localStorage:", e);
  }
}

export function getCurrentSession(): PrototypeSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to read session from localStorage:", e);
    return null;
  }
}

export function setSession(user: PrototypeSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    // Dispatch a storage event or custom event for cross-component sync if needed
    window.dispatchEvent(new Event("quickfeast_auth_change"));
  } catch (e) {
    console.error("Failed to write session to localStorage:", e);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    window.dispatchEvent(new Event("quickfeast_auth_change"));
  } catch (e) {
    console.error("Failed to clear session from localStorage:", e);
  }
}

/**
 * Prototype registration
 */
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): { success: true; user: PrototypeSession } | { success: false; error: string } {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!name) {
    return { success: false, error: "Full name is required." };
  }

  if (!isValidGmail(email)) {
    return { success: false, error: "Email must be a valid @gmail.com address." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email);
  if (existing) {
    return { success: false, error: "An account with this Gmail address already exists. Please log in." };
  }

  const customerId = generateCustomerId();
  const newUser: PrototypeUser = {
    id: customerId,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const session: PrototypeSession = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  setSession(session);

  return { success: true, user: session };
}

/**
 * Prototype authentication
 */
export function loginUser(data: {
  email: string;
  password: string;
}): { success: true; user: PrototypeSession } | { success: false; error: string } {
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!isValidGmail(email)) {
    return { success: false, error: "Please enter a valid @gmail.com address." };
  }

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);

  if (!user || user.password !== password) {
    return { success: false, error: "Incorrect Gmail address or password." };
  }

  const session: PrototypeSession = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  setSession(session);

  return { success: true, user: session };
}
