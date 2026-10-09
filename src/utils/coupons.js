export const resolveCoupon = (value, randomOffer, now = Date.now()) => {
  const code = String(value || "").trim().toUpperCase();
  if (!code) return null;
  if (code === "CYBER2026") {
    return { code, discount: 0.1, label: "Cyber Drop" };
  }

  const offerCode = String(randomOffer?.code || "").trim().toUpperCase();
  const expiresAt = randomOffer?.expiresAt
    ? new Date(randomOffer.expiresAt).getTime()
    : Number.POSITIVE_INFINITY;
  const discount = Number(randomOffer?.discount);
  if (
    code !== offerCode ||
    expiresAt <= now ||
    !Number.isFinite(discount) ||
    discount <= 0 ||
    discount > 1
  ) {
    return null;
  }

  return { code, discount, label: "Private offer" };
};