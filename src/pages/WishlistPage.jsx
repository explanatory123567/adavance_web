import React from "react";
import "./WishlistPage.css";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import { Heart, ShoppingCart, Trash2, Star, Eye } from "lucide-react";
export default function WishlistPage() {
  const {
    wishlist,
    toggleWishlist,
    products,
    prebuilts,
    addToCart,
    setActiveProductModal,
    setCurrentPage,
  } = useApp();

  // Combine products and prebuilts matching wishlist IDs
  const allItems = [...products, ...prebuilts];
  const wishlistedItems = allItems.filter((item) => wishlist.includes(item.id));
  return (
    <div className="wishlist-page inline-wishlistpage-0">
      <div className="container-wide">
        {/* Header */}
        <div className="inline-wishlistpage-1">
          <div className="inline-wishlistpage-2">
            <span className="badge badge-purple">SAVED HARDWARE</span>
            <span className="inline-wishlistpage-3">
              {wishlistedItems.length} Products in Wishlist
            </span>
          </div>
          <h1 className="inline-wishlistpage-4">My Wishlist</h1>
          <p className="inline-wishlistpage-5">
            Track hardware price reductions, restock notices, and quick-add to
            your active cart.
          </p>
        </div>

        {/* Wishlist Items List */}
        {wishlistedItems.length === 0 ? (
          <div className="cyber-card-static inline-wishlistpage-6">
            <Heart
              size={48}
              color="var(--text-muted)"
              className="inline-wishlistpage-7"
            />
            <h3 className="inline-wishlistpage-8">Your Wishlist is Empty</h3>
            <p className="inline-wishlistpage-9">
              Explore the component catalogue and click the heart icon on any
              product to save it here.
            </p>
            <button
              onClick={() => setCurrentPage("components")}
              className="btn btn-primary btn-sm"
            >
              Explore Hardware
            </button>
          </div>
        ) : (
          <div className="cyber-card-static inline-wishlistpage-10">
            <div className="inline-wishlistpage-11">
              {wishlistedItems.map((item) => (
                <div key={item.id} className="inline-wishlistpage-12">
                  {/* Left: Thumbnail & Name */}
                  <div className="inline-wishlistpage-13">
                    <div className="inline-wishlistpage-14">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="inline-wishlistpage-15"
                      />
                    </div>

                    <div>
                      <div className="inline-wishlistpage-16">
                        {item.brand || "PRE-BUILT"}
                      </div>
                      <h4 className="inline-wishlistpage-17">{item.name}</h4>
                      <div className="inline-wishlistpage-18">
                        <span className="badge badge-green inline-wishlistpage-19">
                          In Stock
                        </span>
                        <div className="inline-wishlistpage-20">
                          <Star size={12} fill="#fbbf24" color="#fbbf24" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Actions */}
                  <div className="inline-wishlistpage-21">
                    <div className="inline-wishlistpage-22">
                      <div className="inline-wishlistpage-23">Unit Price</div>
                      <div className="inline-wishlistpage-24">
                        {formatCurrency(item.price, 0)}
                      </div>
                    </div>

                    <div className="inline-wishlistpage-25">
                      <button
                        onClick={() => setActiveProductModal(item)}
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => addToCart(item, 1)}
                        className="btn btn-primary btn-sm"
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>

                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="btn btn-danger btn-sm"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
