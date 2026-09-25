export const isNewArrivalProduct = (product) => {
  if (!product) return false;
  if (product.isNewArrival === true) return true;

  const createdAt = product.createdAt || product.created_at;
  if (!createdAt) return false;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const now = Date.now();
  const diffDays = (now - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

export const isBestSellerProduct = (product) => {
  if (!product) return false;
  if (product.isPopular === true) return true;
  if (product.badge === "Best Seller") return true;
  if (typeof product.rating === "number" && product.rating >= 4.8) return true;
  if (typeof product.performanceScore === "number" && product.performanceScore >= 90) return true;
  return false;
};
