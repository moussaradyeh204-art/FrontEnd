// ============================================================
// FashionSync — localStorage Utilities
// Only cart, wishlist, orders, auth, and theme use localStorage.
// Products are static (see src/data/products.js).
// When you add a backend, replace the relevant functions with API calls.
// ============================================================

import PRODUCTS from '../data/products';

export const LS = {
  USERS:        'fs_users',
  CURRENT_USER: 'fs_current_user',
  MODE:         'fs_customer_mode',
  THEME:        'fs_theme',
  CART:         'fs_cart',
  WISHLIST:     'fs_wishlist',
  ORDERS:       'fs_orders',
  EMP_SHIFTS:   'fs_emp_shifts',
  FEEDBACK:     'fs_feedback',
};

export function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

export function getItem(key, fallback = null) {
  const val = safeJsonParse(localStorage.getItem(key), fallback);
  return val !== null ? val : fallback;
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const getCurrentUser = () => getItem(LS.CURRENT_USER, null);

// ── Products: always static, never from localStorage ─────────
export const loadProducts = () => PRODUCTS;

// ── Cart ──────────────────────────────────────────────────────
export function loadCart() {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getItem(LS.CART, {});
  return Array.isArray(all[user.email]) ? all[user.email] : [];
}

export function saveCart(items = []) {
  const user = getCurrentUser();
  if (!user) return;
  const all = getItem(LS.CART, {});
  all[user.email] = items;
  setItem(LS.CART, all);
}

// ── Wishlist ──────────────────────────────────────────────────
export function loadWishlist() {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getItem(LS.WISHLIST, {});
  return Array.isArray(all[user.email]) ? all[user.email] : [];
}

export function saveWishlist(items = []) {
  const user = getCurrentUser();
  if (!user) return;
  const all = getItem(LS.WISHLIST, {});
  all[user.email] = items;
  setItem(LS.WISHLIST, all);
}

// ── Orders ────────────────────────────────────────────────────
export function loadOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getItem(LS.ORDERS, {});
  return Array.isArray(all[user.email]) ? all[user.email] : [];
}

export function saveOrders(orders = []) {
  const user = getCurrentUser();
  if (!user) return;
  const all = getItem(LS.ORDERS, {});
  all[user.email] = orders;
  setItem(LS.ORDERS, all);
}

// ── Product overrides (employee/manager can edit stock & sale) ─
// Static product data is the base; overrides are stored in localStorage.
// When you add a backend, replace this with an API call.
export function loadProductsWithOverrides() {
  const overrides = getItem('fs_product_overrides', {});
  return PRODUCTS.map(p => ({
    ...p,
    ...(overrides[p.code] || {}),
  }));
}

export function saveProductOverride(code, changes) {
  const overrides = getItem('fs_product_overrides', {});
  overrides[code] = { ...(overrides[code] || {}), ...changes };
  setItem('fs_product_overrides', overrides);
}

export function saveAllProductOverrides(products) {
  const overrides = {};
  products.forEach(p => {
    const base = PRODUCTS.find(b => b.code === p.code);
    if (base) overrides[p.code] = { stock: p.stock, sale: p.sale };
  });
  setItem('fs_product_overrides', overrides);
}