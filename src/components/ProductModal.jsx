import React, { useState } from "react";
import "./ProductModal.css";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  Wrench,
  ArrowRight,
} from "lucide-react";
export default function ProductModal() {
  const {
    activeProductModal,
    setActiveProductModal,
    userRole,
    addToCart,
    wishlist,
    toggleWishlist,
    setBuilderSlot,
    setCurrentPage,
    requireAuth,
    reviews,
    myReviews,
    submitReview,
    getProductReviewSummary,
  } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  if (!activeProductModal) return null;
  const product = activeProductModal;
  const reviewSummary = getProductReviewSummary(product);
  const productReviews = reviews.filter((review) => review.productId === product.id);
  const ownReview = myReviews.find((review) => review.productId === product.id);
  const productSpecs =
    product.category === "case"
      ? { ...product.specs, includedFans: "Free fans included" }
      : product.specs;
  const isWishlisted = wishlist.includes(product.id);
  const handleClose = () => {
    setActiveProductModal(null);
  };
  const handleAddToCart = () => {
    if (!requireAuth(null, "add items to cart")) return;
    addToCart(product, quantity);
  };
  const handleBuyNow = () => {
    if (!requireAuth(null, "proceed to direct checkout")) return;
    const cartItemId = addToCart(product, quantity, null, {
      checkoutOnly: true,
      notificationTitle: "Ready for Checkout",
      notificationMessage: `${product.name} is ready for checkout.`,
    });
    if (!cartItemId) return;
    setActiveProductModal(null);
    setCurrentPage("checkout");
  };
  const handleMountInBuilder = () => {
    if (product.category) {
      setBuilderSlot(product.category, product);
      setActiveProductModal(null);
      setCurrentPage("builder");
    }
  };
  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewSubmitting(true);
    const submittedReview = await submitReview(product, {
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    });
    setReviewSubmitting(false);
    if (submittedReview) {
      setReviewTitle("");
      setReviewComment("");
    }
  };
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-content-lg product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Edge */}
        <div className="product-modal__glow-edge" />

        {/* Modal Header */}
        <div className="flex-between product-modal__header">
          <div className="product-modal__identity">
            <span className="badge badge-cyan product-modal__brand">
              {product.brand || "CYBERFORGE CERTIFIED"}
            </span>
            <span className="product-modal__sku">
              SKU: CF-{product.id?.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="btn-icon product-modal__close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="product-modal__body">
          <div className="product-modal__columns">
            {/* Left: Product Media Gallery */}
            <div>
              <div className="product-modal__gallery">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-modal__image"
                />

                {product.performanceScore && (
                  <div className="product-modal__score">
                    <Zap size={14} color="var(--neon-cyan)" />
                    <span className="product-modal__score-label">
                      Bench Score {product.performanceScore}/100
                    </span>
                  </div>
                )}
              </div>

              {/* Guarantees Row */}
              <div className="product-modal__guarantees">
                <div className="product-modal__guarantee">
                  <Truck size={16} color="var(--neon-cyan)" />
                  <div className="product-modal__guarantee-title">
                    24H Dispatch
                  </div>
                  <div className="product-modal__guarantee-copy">
                    Insured Air Freight
                  </div>
                </div>

                <div className="product-modal__guarantee">
                  <ShieldCheck size={16} color="#34d399" />
                  <div className="product-modal__guarantee-title">
                    3-Yr Warranty
                  </div>
                  <div className="product-modal__guarantee-copy">
                    100% Genuine
                  </div>
                </div>

                <div className="product-modal__guarantee">
                  <RotateCcw size={16} color="#c084fc" />
                  <div className="product-modal__guarantee-title">
                    30-Day Hassle Free
                  </div>
                  <div className="product-modal__guarantee-copy">
                    Direct Replacement
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div>
              <div className="product-modal__rating-row">
                <div className="product-modal__rating">
                  <Star size={15} fill="#fbbf24" color="#fbbf24" />
                  <strong>{reviewSummary.rating || "New"}</strong>
                  <span className="product-modal__muted">
                    ({reviewSummary.reviewsCount} reviews)
                  </span>
                </div>
                <span className="product-modal__separator">|</span>
                <span className="badge badge-green product-modal__stock">
                  In Stock
                </span>
              </div>

              <h2 className="product-modal__title">{product.name}</h2>

              <p className="product-modal__description">
                {product.description}
              </p>

              {/* Price Banner */}
              <div className="product-modal__price-banner">
                <div>
                  <div className="product-modal__price-label">
                    Special Price
                  </div>
                  <div className="product-modal__price">
                    {formatCurrency(product.price, 0)}
                  </div>
                </div>
                <div className="product-modal__installment">
                  Or from <strong>₱{Math.round(product.price / 12)}/mo</strong>{" "}
                  with Affirm
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="product-modal__actions">
                <div className="product-modal__quantity">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="product-modal__quantity-button"
                  >
                    -
                  </button>
                  <span className="product-modal__quantity-value">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="product-modal__quantity-button"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary product-modal__grow"
                >
                  <ShoppingCart size={16} />
                  <span>
                    {userRole === "guest"
                      ? "Login to Add to Cart"
                      : "Add to Cart"}
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="btn btn-secondary"
                  title="Wishlist"
                >
                  <Heart
                    size={16}
                    color={isWishlisted ? "#f43f5e" : "currentColor"}
                    fill={isWishlisted ? "#f43f5e" : "none"}
                  />
                </button>
              </div>

              {/* Direct Buy & Mount Actions */}
              <div className="product-modal__secondary-actions">
                <button
                  onClick={handleBuyNow}
                  className="btn btn-purple product-modal__grow"
                >
                  Buy Now <ArrowRight size={15} />
                </button>

                {product.category && (
                  <button
                    onClick={handleMountInBuilder}
                    className="btn btn-outline-cyan product-modal__grow"
                  >
                    <Wrench size={15} /> Mount in PC Builder
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Specifications Table Section */}
          {productSpecs && (
            <div className="product-modal__specifications">
              <h3 className="product-modal__specifications-title">
                <SlidersHorizontal size={18} color="var(--neon-cyan)" />
                Technical Specifications & Architecture
              </h3>

              <div className="product-modal__spec-grid">
                {Object.entries(productSpecs).map(([key, val]) => (
                  <div key={key} className="product-modal__spec-row">
                    <span className="product-modal__spec-key">
                      {key === "includedFans"
                        ? "Included Fans"
                        : key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="product-modal__spec-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <section className="product-reviews" aria-labelledby="product-reviews-title">
            <div className="product-reviews__heading">
              <div>
                <h3 id="product-reviews-title">Customer Reviews</h3>
                <span>{reviewSummary.reviewsCount} reviews</span>
              </div>
              {reviewSummary.rating > 0 && (
                <div className="product-reviews__average">
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <strong>{reviewSummary.rating}</strong>
                </div>
              )}
            </div>

            {userRole === "user" && ownReview ? (
              <p className="product-reviews__notice">
                Your review is live.
              </p>
            ) : userRole === "user" ? (
              <form className="product-review-form" onSubmit={handleReviewSubmit}>
                <label className="product-review-form__label">Your rating</label>
                <div className="product-review-form__stars" role="radiogroup" aria-label="Rating">
                  {Array.from({ length: 5 }, (_, index) => {
                    const rating = index + 1;
                    return (
                      <button
                        type="button"
                        key={rating}
                        role="radio"
                        aria-checked={reviewRating === rating}
                        aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                        onClick={() => setReviewRating(rating)}
                      >
                        <Star
                          size={20}
                          fill={rating <= reviewRating ? "#fbbf24" : "none"}
                          color="#fbbf24"
                        />
                      </button>
                    );
                  })}
                </div>
                <label className="product-review-form__label" htmlFor="product-review-title">
                  Review title
                </label>
                <input
                  id="product-review-title"
                  className="form-control"
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                  maxLength={100}
                  required
                />
                <label className="product-review-form__label" htmlFor="product-review-comment">
                  Your review
                </label>
                <textarea
                  id="product-review-comment"
                  className="form-control product-review-form__comment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  minLength={10}
                  maxLength={2000}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit review"}
                </button>
              </form>
            ) : userRole === "guest" ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm product-reviews__login"
                onClick={() => requireAuth(null, "submit a product review")}
              >
                Sign in to write a review
              </button>
            ) : null}

            {productReviews.length ? (
              <div className="product-reviews__list">
                {productReviews.map((review) => (
                  <article key={review.id} className="product-review">
                    <div className="product-review__meta">
                      <strong>{review.userName}</strong>
                      <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <div className="product-review__stars" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }, (_, index) => (
                        <Star key={index} size={13} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </div>
                    <h4>{review.title}</h4>
                    <p>{review.comment}</p>
                    {review.adminReply && (
                      <div className="product-review__reply">
                        <strong>Store reply</strong>
                        <p>{review.adminReply}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="product-reviews__empty">No published reviews yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
