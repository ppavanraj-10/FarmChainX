// ============================================================
// FarmChainX API Service
// All HTTP calls to the backend go through here
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helper: get stored token ──
const getToken = () => localStorage.getItem('fcx_token');

// ── Helper: build headers ──
const headers = (auth = true) => ({
  'Content-Type': 'application/json',
  ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Helper: handle response ──
const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ============================================================
// AUTH
// ============================================================
export const authAPI = {
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({ email, password }),
    }).then(handle),

  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handle),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handle),

  updateProfile: (data) =>
    fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handle),
};

// ============================================================
// PRODUCTS
// ============================================================
export const productAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/products`, { headers: headers() }).then(handle),

  getOne: (id) =>
    fetch(`${BASE_URL}/products/${id}`, { headers: headers() }).then(handle),

  create: (data) =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handle),

  runAI: (productId) =>
    fetch(`${BASE_URL}/products/${productId}/ai-analysis`, {
      method: 'POST',
      headers: headers(),
    }).then(handle),

  updateTransport: (productId, stage) =>
    fetch(`${BASE_URL}/products/${productId}/transport`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ stage }),
    }).then(handle),

  markReceived: (productId) =>
    fetch(`${BASE_URL}/products/${productId}/receive`, {
      method: 'PUT',
      headers: headers(),
    }).then(handle),

  generateQR: (productId) =>
    fetch(`${BASE_URL}/products/${productId}/generate-qr`, {
      method: 'PUT',
      headers: headers(),
    }).then(handle),

  verify: (productId) =>
    fetch(`${BASE_URL}/products/verify/${productId}`, {
      headers: headers(false), // public route
    }).then(handle),
};

// ============================================================
// ORDERS
// ============================================================
export const orderAPI = {
  create: (data) =>
    fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handle),

  getMine: () =>
    fetch(`${BASE_URL}/orders/my-orders`, {
      headers: headers(),
    }).then(handle),
};
