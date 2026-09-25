import React, { useState, useMemo } from "react";
import "./ComponentsPage.css";
import { useApp } from "../context/AppContext";
import { CATEGORIES, BRANDS } from "../data/catalogMeta";
import ProductCard from "../components/ProductCard";
import { formatCurrency } from "../utils/currency";
import {
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Cpu,
  Monitor,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Box,
  Snowflake,
  Wind,
} from "lucide-react";
const iconMap = {
  Cpu: Cpu,
  Monitor: Monitor,
  CircuitBoard: CircuitBoard,
  Layers: Layers,
  HardDrive: HardDrive,
  Zap: Zap,
  Box: Box,
  Snowflake: Snowflake,
  Wind: Wind,
};
export default function ComponentsPage() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useApp();

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMax, setPriceMax] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [performanceTier, setPerformanceTier] = useState("all"); // 'all' | '90' | '95'
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'score'

  // Brand Toggle Handler
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedCategoryFilter("all");
    setSelectedBrands([]);
    setPriceMax(2500);
    setMinRating(0);
    setInStockOnly(false);
    setPerformanceTier("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (
          selectedCategoryFilter !== "all" &&
          product.category !== selectedCategoryFilter
        ) {
          return false;
        }
        // Brand filter
        if (
          selectedBrands.length > 0 &&
          !selectedBrands.includes(product.brand)
        ) {
          return false;
        }
        // Price filter
        if (product.price > priceMax) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }
        // Performance Tier
        if (performanceTier === "90" && (product.performanceScore || 0) < 90) {
          return false;
        }
        if (performanceTier === "95" && (product.performanceScore || 0) < 95) {
          return false;
        }
        // Search query
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesBrand = product.brand?.toLowerCase().includes(query);
          const matchesDesc = product.description
            ?.toLowerCase()
            .includes(query);
          if (!matchesName && !matchesBrand && !matchesDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "score")
          return (b.performanceScore || 0) - (a.performanceScore || 0);
        return 0; // featured default
      });
  }, [
    products,
    selectedCategoryFilter,
    selectedBrands,
    priceMax,
    minRating,
    inStockOnly,
    performanceTier,
    searchQuery,
    sortBy,
  ]);
  return (
    <div className="components-page inline-componentspage-0">
      <div className="container-wide">
        {/* Marketplace Header */}
        <div className="inline-componentspage-1">
          <div className="inline-componentspage-2">
            <span className="badge badge-cyan">COMPONENT MARKETPLACE</span>
            <span className="inline-componentspage-3">
              Showing {filteredProducts.length} high-performance items
            </span>
          </div>
          <h1 className="inline-componentspage-4">Gaming Hardware Catalog</h1>
          <p className="inline-componentspage-5">
            Explore certified hardware with verified benchmark scores, socket
            compatibility matrixes, and live stock tracking.
          </p>
        </div>

        {/* Category Horizontal Quick Strip */}
        <div className="inline-componentspage-6">
          <button
            onClick={() => setSelectedCategoryFilter("all")}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              background:
                selectedCategoryFilter === "all"
                  ? "var(--neon-cyan)"
                  : "rgba(255, 255, 255, 0.05)",
              color:
                selectedCategoryFilter === "all"
                  ? "#070913"
                  : "var(--text-secondary)",
              border:
                selectedCategoryFilter === "all"
                  ? "1px solid var(--neon-cyan)"
                  : "1px solid var(--border-subtle)",
              boxShadow:
                selectedCategoryFilter === "all"
                  ? "0 0 15px var(--neon-cyan-glow)"
                  : "none",
              transition: "all 0.2s",
            }}
          >
            All Categories ({products.length})
          </button>

          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Cpu;
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                  background: isSelected
                    ? "rgba(0, 240, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: isSelected
                    ? "var(--neon-cyan)"
                    : "var(--text-secondary)",
                  border: isSelected
                    ? "1px solid var(--neon-cyan)"
                    : "1px solid var(--border-subtle)",
                  boxShadow: isSelected
                    ? "0 0 15px rgba(0,240,255,0.2)"
                    : "none",
                  transition: "all 0.2s",
                }}
              >
                <IconComponent size={16} />
                <span>{cat.short}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Left Filter Sidebar (280px), Right Product Grid */}
        <div className="inline-componentspage-7">
          {/* ==================== FILTERS SIDEBAR ==================== */}
          <aside className="cyber-card-static inline-componentspage-8">
            <div className="flex-between inline-componentspage-9">
              <div className="inline-componentspage-10">
                <Filter size={16} color="var(--neon-cyan)" />
                Filter Matrix
              </div>
              <button
                onClick={resetFilters}
                className="inline-componentspage-11"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="form-group inline-componentspage-12">
              <label className="form-label">Keyword Search</label>
              <div className="inline-componentspage-13">
                <input
                  type="text"
                  placeholder="e.g. 5090, 7800X3D, RGB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control inline-componentspage-14"
                />
                <Search
                  size={14}
                  color="var(--text-muted)"
                  className="inline-componentspage-15"
                />
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="form-group inline-componentspage-16">
              <div className="flex-between inline-componentspage-17">
                <label className="form-label inline-componentspage-18">
                  Max Budget
                </label>
                <span className="inline-componentspage-19">
                  {formatCurrency(priceMax, 0)}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="2500"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="inline-componentspage-20"
              />
              <div className="flex-between inline-componentspage-21">
                <span>₱30</span>
                <span>₱2,500+</span>
              </div>
            </div>

            {/* Performance Tier Selector */}
            <div className="form-group inline-componentspage-22">
              <label className="form-label">Performance Tier</label>
              <div className="inline-componentspage-23">
                {[
                  {
                    id: "all",
                    label: "All Silicon Tiers",
                  },
                  {
                    id: "90",
                    label: "Elite Tier (Score 90+)",
                  },
                  {
                    id: "95",
                    label: "God Tier (Score 95+)",
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPerformanceTier(tier.id)}
                    style={{
                      textAlign: "left",
                      padding: "7px 12px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      background:
                        performanceTier === tier.id
                          ? "rgba(0, 240, 255, 0.12)"
                          : "rgba(255, 255, 255, 0.03)",
                      color:
                        performanceTier === tier.id
                          ? "var(--neon-cyan)"
                          : "var(--text-secondary)",
                      border:
                        performanceTier === tier.id
                          ? "1px solid rgba(0, 240, 255, 0.3)"
                          : "1px solid transparent",
                      fontWeight: performanceTier === tier.id ? 700 : 500,
                    }}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Checklist */}
            <div className="form-group inline-componentspage-24">
              <label className="form-label">Manufacturers & Brands</label>
              <div className="inline-componentspage-25">
                {BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12.5px",
                        color: isChecked
                          ? "var(--neon-cyan)"
                          : "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        background: isChecked
                          ? "rgba(0, 240, 255, 0.08)"
                          : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand)}
                        className="inline-componentspage-26"
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="form-group inline-componentspage-27">
              <label className="form-label">Customer Rating</label>
              <div className="inline-componentspage-28">
                {[
                  {
                    rating: 0,
                    label: "All",
                  },
                  {
                    rating: 4.8,
                    label: "4.8★+",
                  },
                  {
                    rating: 4.9,
                    label: "4.9★+",
                  },
                ].map((r) => (
                  <button
                    key={r.rating}
                    onClick={() => setMinRating(r.rating)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      background:
                        minRating === r.rating
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(255,255,255,0.03)",
                      color:
                        minRating === r.rating
                          ? "#fbbf24"
                          : "var(--text-secondary)",
                      border:
                        minRating === r.rating
                          ? "1px solid #fbbf24"
                          : "1px solid var(--border-subtle)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="inline-componentspage-29">
              <label className="inline-componentspage-30">
                <span>In-Stock Items Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="inline-componentspage-31"
                />
              </label>
            </div>
          </aside>

          {/* ==================== PRODUCT GRID & CONTROLS ==================== */}
          <main>
            {/* Top Sort & Count Bar */}
            <div className="cyber-card-static inline-componentspage-32">
              <div className="inline-componentspage-33">
                Showing{" "}
                <strong className="inline-componentspage-34">
                  {filteredProducts.length}
                </strong>{" "}
                items in catalogue
              </div>

              <div className="inline-componentspage-35">
                <span className="inline-componentspage-36">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-control inline-componentspage-37"
                >
                  <option value="featured">Featured & Recommended</option>
                  <option value="score">Highest Benchmark Score</option>
                  <option value="rating">Highest Customer Rating</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="cyber-card-static inline-componentspage-38">
                <SlidersHorizontal
                  size={40}
                  color="var(--text-muted)"
                  className="inline-componentspage-39"
                />
                <h3 className="inline-componentspage-40">
                  No Hardware Matches Your Filters
                </h3>
                <p className="inline-componentspage-41">
                  Try relaxing your price budget or clearing specific brand
                  checklists.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary btn-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
