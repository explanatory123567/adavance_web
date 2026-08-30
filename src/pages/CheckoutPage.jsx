import React, { useState } from 'react';
import './CheckoutPage.css';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Lock, ArrowLeft, Package } from 'lucide-react';
export default function CheckoutPage() {
  const {
    cart,
    placeOrder,
    setCurrentPage
  } = useApp();

  // Form States
  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState('alex.mercer@cyberforge.io');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9921');
  const [address, setAddress] = useState('742 Evergreen Battlestation Way');
  const [city, setCity] = useState('Seattle');
  const [postalCode, setPostalCode] = useState('98101');
  const [country, setCountry] = useState('United States');
  const [shippingMethod, setShippingMethod] = useState('express'); // 'ground' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'crypto' | 'affirm'

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('789');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = shippingMethod === 'express' ? 0 : 25;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;
  const handlePlaceOrderSubmit = e => {
    e.preventDefault();
    const orderData = {
      name: customerName,
      email: customerEmail,
      total,
      paymentMethod: paymentMethod === 'card' ? `Credit Card (${cardNumber})` : paymentMethod.toUpperCase()
    };
    const newOrder = placeOrder(orderData);
    if (newOrder) {
      setCompletedOrder(newOrder);
    }
  };

  // If order was placed, show celebratory confirmation screen
  if (completedOrder) {
    return <div className="checkout-page inline-checkoutpage-0">
        <div className="container inline-checkoutpage-1">
          <div className="cyber-card-static inline-checkoutpage-2">
            <div className="inline-checkoutpage-3">
              <CheckCircle2 size={40} color="#34d399" />
            </div>

            <span className="badge badge-green inline-checkoutpage-4">PAYMENT AUTHORIZED</span>
            <h2 className="inline-checkoutpage-5">
              Battlestation Order Confirmed!
            </h2>
            <p className="inline-checkoutpage-6">
              Your order <strong className="inline-checkoutpage-7">#{completedOrder.id}</strong> has been transmitted to our cleanroom assembly laboratory.
            </p>

            <div className="inline-checkoutpage-8">
              <div className="flex-between">
                <span className="inline-checkoutpage-9">Tracking Number:</span>
                <span className="inline-checkoutpage-10">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex-between">
                <span className="inline-checkoutpage-11">Estimated Delivery:</span>
                <span className="inline-checkoutpage-12">2-3 Business Days (Air Freight)</span>
              </div>
              <div className="flex-between">
                <span className="inline-checkoutpage-13">Total Billed:</span>
                <span className="inline-checkoutpage-14">
                  ₱{completedOrder.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
                </span>
              </div>
            </div>

            <div className="inline-checkoutpage-15">
              <button onClick={() => setCurrentPage('orders')} className="btn btn-primary inline-checkoutpage-16">
                <Package size={16} /> View in Order History
              </button>
              <button onClick={() => setCurrentPage('home')} className="btn btn-secondary inline-checkoutpage-17">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="checkout-page inline-checkoutpage-18">
      <div className="container-wide">
        {/* Header */}
        <div className="inline-checkoutpage-19">
          <button onClick={() => setCurrentPage('cart')} className="inline-checkoutpage-20">
            <ArrowLeft size={14} /> Back to Shopping Cart
          </button>
          <h1 className="inline-checkoutpage-21">Encrypted Checkout</h1>
          <p className="inline-checkoutpage-22">
            Complete your shipping address and payment method to begin cleanroom assembly.
          </p>
        </div>

        <form onSubmit={handlePlaceOrderSubmit}>
          <div className="inline-checkoutpage-23">
            {/* Left: 3-Step Checkout Sections */}
            <div className="inline-checkoutpage-24">
              {/* STEP 1: Customer Information */}
              <div className="cyber-card-static inline-checkoutpage-25">
                <div className="inline-checkoutpage-26">
                  <div className="inline-checkoutpage-27">
                    1
                  </div>
                  <h3 className="inline-checkoutpage-28">Customer Information</h3>
                </div>

                <div className="grid-cols-2 inline-checkoutpage-29">
                  <div className="form-group inline-checkoutpage-30">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                  </div>
                  <div className="form-group inline-checkoutpage-31">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group inline-checkoutpage-32">
                  <label className="form-label">Phone Number (For Carrier Delivery PIN)</label>
                  <input type="tel" className="form-control" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
                </div>
              </div>

              {/* STEP 2: Shipping Destination */}
              <div className="cyber-card-static inline-checkoutpage-33">
                <div className="inline-checkoutpage-34">
                  <div className="inline-checkoutpage-35">
                    2
                  </div>
                  <h3 className="inline-checkoutpage-36">Shipping Address</h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>

                <div className="grid-cols-3 inline-checkoutpage-37">
                  <div className="form-group inline-checkoutpage-38">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} required />
                  </div>
                  <div className="form-group inline-checkoutpage-39">
                    <label className="form-label">Postal / Zip Code</label>
                    <input type="text" className="form-control" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
                  </div>
                  <div className="form-group inline-checkoutpage-40">
                    <label className="form-label">Country</label>
                    <input type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Shipping Speed & Handling</label>
                  <div className="inline-checkoutpage-41">
                    <button type="button" onClick={() => setShippingMethod('express')} style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: shippingMethod === 'express' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: shippingMethod === 'express' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                    border: shippingMethod === 'express' ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}>
                      <div className="inline-checkoutpage-42">⚡ Insured Air Freight (Free)</div>
                      <div className="inline-checkoutpage-43">2-3 Business Days Delivery</div>
                    </button>

                    <button type="button" onClick={() => setShippingMethod('ground')} style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: shippingMethod === 'ground' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: shippingMethod === 'ground' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                    border: shippingMethod === 'ground' ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}>
                      <div className="inline-checkoutpage-44">📦 Secured Ground Crate ($25)</div>
                      <div className="inline-checkoutpage-45">5-7 Business Days Delivery</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3: Payment Method */}
              <div className="cyber-card-static inline-checkoutpage-46">
                <div className="inline-checkoutpage-47">
                  <div className="inline-checkoutpage-48">
                    3
                  </div>
                  <h3 className="inline-checkoutpage-49">Payment Method</h3>
                </div>

                {/* Payment Tabs */}
                <div className="inline-checkoutpage-50">
                  {[{
                  id: 'card',
                  label: 'Credit Card',
                  icon: '💳'
                }, {
                  id: 'paypal',
                  label: 'PayPal',
                  icon: '🅿️'
                }, {
                  id: 'crypto',
                  label: 'Crypto (ETH/BTC)',
                  icon: '⚡'
                }, {
                  id: 'affirm',
                  label: 'Affirm (0% APR)',
                  icon: '💎'
                }].map(tab => <button key={tab.id} type="button" onClick={() => setPaymentMethod(tab.id)} style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: paymentMethod === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: paymentMethod === tab.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  border: paymentMethod === tab.id ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                      <div className="inline-checkoutpage-51">{tab.icon}</div>
                      {tab.label}
                    </button>)}
                </div>

                {/* Card Inputs Mockup */}
                {paymentMethod === 'card' && <div className="inline-checkoutpage-52">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input type="text" className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 •••• •••• 4242" />
                    </div>

                    <div className="grid-cols-2 inline-checkoutpage-53">
                      <div className="form-group inline-checkoutpage-54">
                        <label className="form-label">Expiry MM/YY</label>
                        <input type="text" className="form-control" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                      </div>
                      <div className="form-group inline-checkoutpage-55">
                        <label className="form-label">Security CVC</label>
                        <input type="text" className="form-control" value={cardCvc} onChange={e => setCardCvc(e.target.value)} />
                      </div>
                    </div>
                  </div>}

                {paymentMethod !== 'card' && <div className="inline-checkoutpage-56">
                    Instant authentication via <strong>{paymentMethod.toUpperCase()} Gate</strong> will execute seamlessly upon order placement.
                  </div>}
              </div>
            </div>

            {/* Right: Order Pricing Breakdown */}
            <div className="cyber-card-static inline-checkoutpage-57">
              <h3 className="inline-checkoutpage-58">
                Order Summary ({cart.length} items)
              </h3>

              <div className="inline-checkoutpage-59">
                {cart.map(item => <div key={item.id} className="flex-between inline-checkoutpage-60">
                    <span className="inline-checkoutpage-61">
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className="inline-checkoutpage-62">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>)}
              </div>

              <div className="inline-checkoutpage-63">
                <div className="flex-between">
                  <span className="inline-checkoutpage-64">Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span className="inline-checkoutpage-65">Shipping:</span>
                  <span style={{
                  color: shipping === 0 ? '#34d399' : 'inherit'
                }}>
                    {shipping === 0 ? 'FREE Insured Air' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex-between">
                  <span className="inline-checkoutpage-66">Estimated Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex-between inline-checkoutpage-67">
                  <span>Total:</span>
                  <span className="inline-checkoutpage-68">
                    ${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary inline-checkoutpage-69">
                <Lock size={16} /> Place Order Now
              </button>

              <div className="inline-checkoutpage-70">
                Prototype checkout simulation with instant confirmation.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>;
}
