import React, { useState } from "react";
import "./ComparePage.css";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  ShoppingCart,
  Zap,
  Star,
  CheckCircle2,
  X,
  Eye,
} from "lucide-react";
export default function ComparePage() {
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    products,
    addToCart,
    setActiveProductModal,
    requireAuth,
  } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Selected products for comparison
  const comparedProducts = products.filter((p) => compareList.includes(p.id));
  const handleAddToCart = (product) => {
    if (!requireAuth(null, "add items to cart")) return;
    addToCart(product, 1);
  };
  return (
    <div className="compare-page inline-comparepage-0">
      <div className="container-wide">
        {/* Page Header */}
        <div className="flex-between inline-comparepage-1">
          <div>
            <div className="inline-comparepage-2">
              <span className="badge badge-cyan">
                BENCHMARK COMPARISON MATRIX
              </span>
              <span className="inline-comparepage-3">
                Comparing {comparedProducts.length} / 4 items
              </span>
            </div>
            <h1 className="inline-comparepage-4">Component Head-to-Head</h1>
            <p className="inline-comparepage-5">
              Evaluate architectural specifications, power TDP, clock speeds,
              and benchmark score ratios side-by-side.
            </p>
          </div>

          {comparedProducts.length < 4 && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Component to Compare
            </button>
          )}
        </div>

        {/* Comparison Table / Grid */}
        {comparedProducts.length === 0 ? (
          <div className="cyber-card-static inline-comparepage-6">
            <SlidersHorizontal
              size={48}
              color="var(--text-muted)"
              className="inline-comparepage-7"
            />
            <h3 className="inline-comparepage-8">
              No Components in Compare Queue
            </h3>
            <p className="inline-comparepage-9">
              Select CPUs, GPUs, or Motherboards to compare architectural
              benchmarks and pricing.
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              Add Component Now
            </button>
          </div>
        ) : (
          <div className="cyber-card-static inline-comparepage-10">
            <table className="inline-comparepage-11">
              <thead>
                <tr className="inline-comparepage-12">
                  <th className="inline-comparepage-13">Metric / Spec</th>
                  {comparedProducts.map((product) => (
                    <th key={product.id} className="inline-comparepage-14">
                      <div className="inline-comparepage-15">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="inline-comparepage-16"
                        />
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          title="Remove from comparison"
                          className="inline-comparepage-17"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="inline-comparepage-18">
                        {product.brand}
                      </div>
                      <div className="inline-comparepage-19">
                        {product.name}
                      </div>

                      <div className="inline-comparepage-20">
                        <button
                          onClick={() => setActiveProductModal(product)}
                          className="btn btn-secondary btn-sm inline-comparepage-21"
                          title="View full specs"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-primary btn-sm inline-comparepage-22"
                        >
                          <ShoppingCart size={13} /> Add
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Price Row */}
                <tr className="inline-comparepage-23">
                  <td className="inline-comparepage-24">Retail Price</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-25">
                      {formatCurrency(p.price, 0)}
                    </td>
                  ))}
                </tr>

                {/* Benchmark Performance Score */}
                <tr className="inline-comparepage-26">
                  <td className="inline-comparepage-27">Benchmark Score</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-28">
                      <div className="inline-comparepage-29">
                        <span className="inline-comparepage-30">
                          {p.performanceScore || 90}/100
                        </span>
                        <Zap size={14} color="var(--neon-cyan)" />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Customer Rating */}
                <tr className="inline-comparepage-31">
                  <td className="inline-comparepage-32">Verified Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-33">
                      <div className="inline-comparepage-34">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <strong>{p.rating}</strong>
                        <span className="inline-comparepage-35">
                          ({p.reviewsCount})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Power TDP / Wattage */}
                <tr className="inline-comparepage-36">
                  <td className="inline-comparepage-37">
                    Power Consumption (TDP)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-38">
                      {p.wattage ? `${p.wattage} Watts` : "System Dependent"}
                    </td>
                  ))}
                </tr>

                {/* VRAM / Core Spec */}
                <tr className="inline-comparepage-39">
                  <td className="inline-comparepage-40">
                    Core Architecture / VRAM
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-41">
                      {p.specs?.vram ||
                        p.specs?.cores ||
                        p.specs?.capacity ||
                        p.specs?.socket ||
                        "Standard"}
                    </td>
                  ))}
                </tr>

                {/* Boost Clocks */}
                <tr className="inline-comparepage-42">
                  <td className="inline-comparepage-43">
                    Boost Frequency / Speeds
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-44">
                      {p.specs?.boostClock ||
                        p.specs?.speed ||
                        p.specs?.seqRead ||
                        "Standard"}
                    </td>
                  ))}
                </tr>

                {/* Price to Performance Value */}
                <tr>
                  <td className="inline-comparepage-45">Value Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="inline-comparepage-46">
                      <span className="badge badge-green">
                        <CheckCircle2 size={11} /> 9.4 / 10 Tier Value
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Component Picker Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div
            className="modal-content modal-content-lg inline-comparepage-47"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-comparepage-48">
              <h3 className="inline-comparepage-49">
                Choose Component to Compare
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div className="compare-picker">
              {products
                .filter((p) => !compareList.includes(p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="cyber-card compare-picker__card"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="compare-picker__image"
                    />
                    <div className="compare-picker__details">
                      <div className="compare-picker__brand">
                        {product.brand}
                      </div>
                      <div className="compare-picker__name">{product.name}</div>
                      <div className="compare-picker__price">
                        {formatCurrency(product.price, 0)}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCompare(product.id);
                        setAddModalOpen(false);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
