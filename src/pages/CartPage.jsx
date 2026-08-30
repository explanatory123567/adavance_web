import React, { useState } from 'react';
import './CartPage.css';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    setCurrentPage,
    showToast
  } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g. 0.10 for 10%

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = (subtotal - discountAmount) * 0.075;
  const total = subtotal - discountAmount + shipping + tax;
  const handleApplyCoupon = e => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'CYBER2026') {
      setAppliedDiscount(0.10);
      showToast('Coupon Applied!', '10% Cyber Drop discount active.', 'success');
    } else {
      showToast('Invalid Code', 'Try coupon code: CYBER2026', 'warning');
    }
  };
  return <div className="cart-page inline-cartpage-0">
      <div className="container-wide">
        {/* Header */}
        <div className="inline-cartpage-1">
          <div className="inline-cartpage-2">
            <span className="badge badge-cyan">SHOPPING CART</span>
            <span className="inline-cartpage-3">
              {cart.length} unique line items
            </span>
          </div>
          <h1 className="inline-cartpage-4">Cart & Order Overview</h1>
        </div>

        {cart.length === 0 ? <div className="cyber-card-static inline-cartpage-5">
            <ShoppingCart size={48} color="var(--text-muted)" className="inline-cartpage-6" />
            <h3 className="inline-cartpage-7">Your Shopping Cart is Empty</h3>
            <p className="inline-cartpage-8">
              Explore pre-built gaming PCs, individual GPUs, and custom rigs to get started.
            </p>
            <button onClick={() => setCurrentPage('components')} className="btn btn-primary btn-sm">
              Explore Hardware
            </button>
          </div> : <div className="inline-cartpage-9">
            {/* Left: Cart Items List */}
            <div className="cyber-card-static inline-cartpage-10">
              <div className="inline-cartpage-11">
                {cart.map(item => <div key={item.id} className="inline-cartpage-12">
                    {/* Item Image & Title */}
                    <div className="inline-cartpage-13">
                      <div className="inline-cartpage-14">
                        <img src={item.product.image} alt={item.product.name} className="inline-cartpage-15" />
                      </div>

                      <div>
                        {item.isCustomBuild && <span className="badge badge-purple inline-cartpage-16">
                            CUSTOM 3D BUILD
                          </span>}
                        <h4 className="inline-cartpage-17">
                          {item.product.name}
                        </h4>
                        <div className="inline-cartpage-18">
                          ₱{item.product.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="inline-cartpage-19">
                      <div className="inline-cartpage-20">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="inline-cartpage-21">
                          -
                        </button>
                        <span className="inline-cartpage-22">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="inline-cartpage-23">
                          +
                        </button>
                      </div>

                      <div className="inline-cartpage-24">
                        <div className="inline-cartpage-25">Line Total</div>
                        <div className="inline-cartpage-26">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} className="btn-icon inline-cartpage-27" title="Remove from cart">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>)}
              </div>

              {/* Continue Shopping Link */}
              <div className="inline-cartpage-28">
                <button onClick={() => setCurrentPage('components')} className="btn btn-secondary btn-sm inline-cartpage-29">
                  <ArrowLeft size={14} /> Continue Shopping
                </button>
              </div>
            </div>

            {/* Right: Order Pricing Summary & Checkout Button */}
            <div className="cyber-card-static inline-cartpage-30">
              <h3 className="inline-cartpage-31">
                Order Summary
              </h3>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="inline-cartpage-32">
                <label className="form-label inline-cartpage-33">
                  <Tag size={13} /> Promotional Promo Code
                </label>
                <div className="inline-cartpage-34">
                  <input type="text" placeholder="Try CYBER2026" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="form-control inline-cartpage-35" />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Apply
                  </button>
                </div>
                {appliedDiscount > 0 && <div className="inline-cartpage-36">
                    ✓ 10% Cyber Drop discount applied!
                  </div>}
              </form>

              {/* Price Calculations Breakdown */}
              <div className="inline-cartpage-37">
                <div className="flex-between">
                  <span className="inline-cartpage-38">Subtotal</span>
                  <span className="inline-cartpage-39">₱{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscount > 0 && <div className="flex-between inline-cartpage-40">
                    <span>Promo Discount (10%)</span>
                    <span>-₱{discountAmount.toFixed(2)}</span>
                  </div>}

                <div className="flex-between">
                  <span className="inline-cartpage-41">Insured Air Shipping</span>
                  <span style={{
                fontWeight: 700,
                color: shipping === 0 ? '#34d399' : 'inherit'
              }}>
                    {shipping === 0 ? 'FREE (Over $500)' : `$${shipping}`}
                  </span>
                </div>

                <div className="flex-between">
                  <span className="inline-cartpage-42">Estimated Tax (7.5%)</span>
                  <span className="inline-cartpage-45">₱{tax.toFixed(2)}</span>
                </div>

                <div className="inline-cartpage-44" />

                <div className="flex-between">
                  <span className="inline-cartpage-45">Total Due</span>
                  <span className="inline-cartpage-46">
                    ${total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button onClick={() => setCurrentPage('checkout')} className="btn btn-primary inline-cartpage-47">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="inline-cartpage-48">
                <ShieldCheck size={14} color="#34d399" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}
