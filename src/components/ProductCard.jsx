import React from 'react';
import './ProductCard.css';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Heart, Eye, Star, SlidersHorizontal, Zap } from 'lucide-react';
export default function ProductCard({
  product,
  isPrebuilt = false
}) {
  const {
    userRole,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    addToCompare,
    setActiveProductModal,
    requireAuth
  } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const handleAddToCart = e => {
    e.stopPropagation();
    if (userRole === 'guest') {
      requireAuth(null, 'add items to cart');
      return;
    }
    addToCart(product, 1);
  };
  const handleWishlist = e => {
    e.stopPropagation();
    if (userRole === 'guest') {
      requireAuth(null, 'save products to your wishlist');
      return;
    }
    toggleWishlist(product.id);
  };
  const handleCompare = e => {
    e.stopPropagation();
    addToCompare(product.id);
  };
  return <div className="cyber-card product-card inline-productcard-0" onClick={() => setActiveProductModal(product)}>
      {/* Product Image & Badges Container */}
      <div className="inline-productcard-1">
        <img src={product.image} alt={product.name} className="product-img-hover inline-productcard-2" />

        {/* Top Badges */}
        <div className="inline-productcard-3">
          {product.badge && <span className="badge badge-purple inline-productcard-4">
              {product.badge}
            </span>}
          {product.performanceScore && <span className="badge badge-cyan inline-productcard-5">
              <Zap size={10} /> Score {product.performanceScore}
            </span>}
        </div>

        {/* Wishlist & Compare Quick Actions */}
        <div className="inline-productcard-6">
          <button onClick={handleWishlist} className="btn-icon" style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(8, 12, 24, 0.7)',
          borderColor: isWishlisted ? '#f43f5e' : 'rgba(255, 255, 255, 0.15)'
        }} title={userRole === 'guest' ? 'Login to Wishlist' : 'Add to Wishlist'}>
            <Heart size={15} color={isWishlisted ? '#f43f5e' : 'var(--text-secondary)'} fill={isWishlisted ? '#f43f5e' : 'none'} />
          </button>

          {!isPrebuilt && <button onClick={handleCompare} className="btn-icon" style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(8, 12, 24, 0.7)',
          borderColor: isCompared ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.15)',
          color: isCompared ? 'var(--neon-cyan)' : 'var(--text-secondary)'
        }} title="Add to Compare">
              <SlidersHorizontal size={14} />
            </button>}
        </div>

        {/* Stock Status Pill */}
        <div className="inline-productcard-7">
          {product.stock <= 5 && product.stock > 0 ? <span className="badge badge-amber inline-productcard-8">
              Only {product.stock} Left
            </span> : product.inStock ? <span className="badge badge-green inline-productcard-9">
              In Stock
            </span> : <span className="badge badge-red inline-productcard-10">
              Out of Stock
            </span>}
        </div>
      </div>

      {/* Product Info & Specs */}
      <div className="inline-productcard-11">
        {/* Brand & Category */}
        <div className="flex-between inline-productcard-12">
          <span className="inline-productcard-13">
            {product.brand || (isPrebuilt ? 'PRE-BUILT RIG' : product.category?.toUpperCase())}
          </span>
          <div className="inline-productcard-14">
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span className="inline-productcard-15">{product.rating}</span>
            <span className="inline-productcard-16">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="inline-productcard-17">
          {product.name}
        </h4>

        {/* Spec snippet */}
        <div className="inline-productcard-18">
          {isPrebuilt ? <div>{product.fps4k}</div> : product.specs ? <div>
              {product.specs.socket || product.specs.vram || product.specs.capacity || product.specs.wattage || product.specs.type || 'High Performance'}
              {product.specs.boostClock ? ` • ${product.specs.boostClock}` : ''}
            </div> : <div>Premium Gaming Grade</div>}
        </div>

        {/* Price & Action Row */}
        <div className="flex-between inline-productcard-19">
          <div>
            <span className="inline-productcard-20">Price</span>
            <span className="inline-productcard-21">
              ₱{product.price.toLocaleString()}
            </span>
          </div>

          <div className="inline-productcard-22">
            <button onClick={e => {
            e.stopPropagation();
            setActiveProductModal(product);
          }} className="btn btn-secondary btn-sm" title="View Specifications">
              <Eye size={14} />
            </button>

            <button onClick={handleAddToCart} className="btn btn-primary btn-sm inline-productcard-23" title={userRole === 'guest' ? 'Login to Purchase' : 'Add to Cart'}>
              <ShoppingCart size={14} />
              <span>{userRole === 'guest' ? 'Cart' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}
