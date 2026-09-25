const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(body.message || `Request failed (${response.status}).`);
    return body;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to fetch data.";
    throw new Error(
      message.includes("Failed to fetch") || message.includes("fetch")
        ? `Unable to reach the backend at ${API_URL}${path}. Start the API server or check the server URL.`
        : message,
    );
  }
}

export const authApi = {
  requestCode: (payload) =>
    request("/auth/request-code", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  googleLogin: (payload) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const dataApi = {
  catalog: () => request("/catalog"),
  randomOffer: (token) => request("/promotions/random-offer", { method: "POST", headers: { Authorization: `Bearer ${token}` } }),
  account: (token) =>
    request("/account", { headers: { Authorization: `Bearer ${token}` } }),
  updateProfile: (token, payload) =>
    request("/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  models: () => request("/models"),
  createModel: (token, payload) =>
    request("/models", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateModel: (token, id, payload) =>
    request(`/models/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteModel: (token, id) =>
    request(`/models/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  addresses: (token) =>
    request("/addresses", { headers: { Authorization: `Bearer ${token}` } }),
  createAddress: (token, payload) =>
    request("/addresses", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateAddress: (token, id, payload) =>
    request(`/addresses/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteAddress: (token, id) =>
    request(`/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateAccount: (token, payload) =>
    request("/account", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  orders: (token) =>
    request("/orders", { headers: { Authorization: `Bearer ${token}` } }),
  users: (token) =>
    request("/users", { headers: { Authorization: `Bearer ${token}` } }),
  createProduct: (token, payload) =>
    request("/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateProduct: (token, id, payload) =>
    request(`/products/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteProduct: (token, id) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminAnalytics: (token) =>
    request("/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateOrderStatus: (token, id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  updateUserStatus: (token, id, status) =>
    request(`/users/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  deleteUser: (token, id) =>
    request(`/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  createOrder: (token, payload) =>
    request("/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
};
