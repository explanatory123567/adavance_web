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
  } = useApp();
  const [quantity, setQuantity] = useState(1);
  if (!activeProductModal) return null;
  const product = activeProductModal;
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
    addToCart(product, quantity);
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
                  <strong>{product.rating}</strong>
                  <span className="product-modal__muted">
                    ({product.reviewsCount} verified reviews)
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
          {product.specs && (
            <div className="product-modal__specifications">
              <h3 className="product-modal__specifications-title">
                <SlidersHorizontal size={18} color="var(--neon-cyan)" />
                Technical Specifications & Architecture
              </h3>

              <div className="product-modal__spec-grid">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="product-modal__spec-row">
                    <span className="product-modal__spec-key">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="product-modal__spec-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
