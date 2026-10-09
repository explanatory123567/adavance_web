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
  resetPassword: (payload) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const dataApi = {
  catalog: () => request("/catalog"),
  subscribeNewsletter: (email) =>
    request("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  profile: (token) =>
    request("/profile", { headers: { Authorization: `Bearer ${token}` } }),
  discordConnect: (token) =>
    request("/discord/connect", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
  discordDisconnect: (token) =>
    request("/discord/disconnect", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
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
  notifications: (token) =>
    request("/notifications", { headers: { Authorization: `Bearer ${token}` } }),
  markNotificationRead: (token, id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }),
  markAllNotificationsRead: (token) =>
    request("/notifications/read-all", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
  reviews: () => request("/reviews"),
  myReviews: (token) =>
    request("/reviews/mine", { headers: { Authorization: `Bearer ${token}` } }),
  createReview: (token, payload) =>
    request("/reviews", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  adminReviews: (token) =>
    request("/admin/reviews", { headers: { Authorization: `Bearer ${token}` } }),
  replyToReview: (token, id, reply) =>
    request(`/admin/reviews/${id}/reply`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reply }),
    }),
  deleteReview: (token, id) =>
    request(`/admin/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
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
  updateOrderPaymentStatus: (token, id, paymentStatus) =>
    request(`/orders/${id}/payment-status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentStatus }),
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
