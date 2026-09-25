import React, { useState } from "react";
import "./Navbar.css";
import { useApp } from "../context/AppContext";
import {
  Cpu,
  Search,
  ShoppingCart,
  Heart,
  User,
  Shield,
  Layers,
  SlidersHorizontal,
  LogOut,
  Package,
  Wrench,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
export default function Navbar() {
  const {
    userRole,
    authUser,
    setUserRole,
    currentPage,
    setCurrentPage,
    cart,
    wishlist,
    setAuthModalOpen,
    setAuthModalMode,
    searchQuery,
    setSearchQuery,
    logout,
  } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentPage !== "components") {
      setCurrentPage("components");
    }
  };
  const navLinkStyle = (pageKey) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13.5px",
    fontWeight: 600,
    color:
      currentPage === pageKey ? "var(--neon-cyan)" : "var(--text-secondary)",
    background:
      currentPage === pageKey ? "rgba(0, 240, 255, 0.08)" : "transparent",
    border:
      currentPage === pageKey
        ? "1px solid rgba(0, 240, 255, 0.25)"
        : "1px solid transparent",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });
  return (
    <header className="inline-navbar-0">
      {/* Main Navbar */}
      <div className="container-wide inline-navbar-8">
        {/* Brand Logo */}
        <div
          onClick={() =>
            setCurrentPage(userRole === "admin" ? "admin" : "home")
          }
          className="inline-navbar-9"
        >
          <img
            src="/images/logo.png"
            alt="Next Gear logo"
            className="brand-logo-image"
          />
          <div>
            <div className="inline-navbar-11">
              <span className="inline-navbar-12">NEXT</span>
              <span className="inline-navbar-13">GEAR</span>
            </div>
            <div className="inline-navbar-14">
              {userRole === "admin" ? "ADMIN CONSOLE" : "PC BUILDER & RETAIL"}
            </div>
          </div>
        </div>

        {/* Search Bar (Storefront view) */}
        {userRole !== "admin" && (
          <form onSubmit={handleSearchSubmit} className="inline-navbar-15">
            <input
              type="text"
              placeholder="Search RTX 5090, 7800X3D, Cases, Liquid Coolers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control inline-navbar-16"
            />
            <Search
              size={16}
              color="var(--neon-cyan)"
              className="inline-navbar-17"
            />
          </form>
        )}

        {/* Navigation Links based on User Role */}
        <nav className="inline-navbar-18">
          {userRole === "admin" ? (
            // ADMIN NAV
            <>
              <button
                onClick={() => setCurrentPage("admin")}
                style={navLinkStyle("admin")}
              >
                <Shield size={16} color="var(--neon-purple)" />
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage("storefront");
                }}
                className="btn btn-secondary btn-sm inline-navbar-19"
              >
                <ExternalLink size={14} /> View Storefront
              </button>
            </>
          ) : (
            // GUEST & REGULAR USER NAV
            <>
              <button
                onClick={() => setCurrentPage("home")}
                style={navLinkStyle("home")}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("components")}
                style={navLinkStyle("components")}
              >
                Components
              </button>
              <button
                onClick={() => setCurrentPage("builder")}
                style={{
                  ...navLinkStyle("builder"),
                  background:
                    currentPage === "builder"
                      ? "rgba(0, 240, 255, 0.15)"
                      : "rgba(0, 240, 255, 0.05)",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  color: "var(--neon-cyan)",
                }}
              >
                <Wrench size={14} /> PC Builder
              </button>
              <button
                onClick={() => setCurrentPage("compare")}
                style={navLinkStyle("compare")}
              >
                <SlidersHorizontal size={14} /> Compare
              </button>

              {userRole === "user" && (
                <button
                  onClick={() => setCurrentPage("my-builds")}
                  style={navLinkStyle("my-builds")}
                >
                  <Layers size={14} /> My Builds
                </button>
              )}
            </>
          )}
        </nav>

        {/* Action Controls & Authentication Area */}
        <div className="inline-navbar-20">
          {userRole === "admin" && currentPage === "storefront" && (
            <button
              onClick={() => setCurrentPage("admin")}
              className="btn btn-primary btn-sm"
            >
              <Shield size={14} /> Back to Admin Dashboard
            </button>
          )}

          {/* Guest Role: Login & Register Buttons */}
          {userRole === "guest" && (
            <div className="inline-navbar-21">
              <button
                onClick={() => {
                  setAuthModalMode("login");
                  setAuthModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthModalMode("register");
                  setAuthModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            </div>
          )}

          {/* User Role: Wishlist & Profile Dropdown */}
          {userRole === "user" && (
            <>
              <button
                onClick={() => setCurrentPage("wishlist")}
                className="btn-icon inline-navbar-22"
                title="Wishlist"
              >
                <Heart
                  size={18}
                  color={wishlistCount > 0 ? "#f43f5e" : "currentColor"}
                  fill={wishlistCount > 0 ? "#f43f5e" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="inline-navbar-23">{wishlistCount}</span>
                )}
              </button>

              <button
                onClick={() => setCurrentPage("cart")}
                className="btn-icon inline-navbar-24"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart
                  size={19}
                  strokeWidth={2.3}
                  color="#00f0ff"
                  style={{ display: "block", flex: "0 0 auto" }}
                />
                {cartItemsCount > 0 && (
                  <span className="inline-navbar-25">{cartItemsCount}</span>
                )}
              </button>

              {/* User Avatar Menu */}
              <div className="inline-navbar-26">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-navbar-27"
                >
                  <img
                    src={
                      authUser?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    }
                    alt={authUser?.name || "Account"}
                    className="inline-navbar-28"
                  />
                  <div className="inline-navbar-29">
                    <div className="inline-navbar-30">
                      {authUser?.name || "Account"}
                    </div>
                    <div className="inline-navbar-31">PRO GAMER</div>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {userMenuOpen && (
                  <div className="inline-navbar-32">
                    <div className="inline-navbar-33">
                      <div className="inline-navbar-34">
                        {authUser?.name || "Account"}
                      </div>
                      <div className="inline-navbar-35">
                        {authUser?.email || ""}
                      </div>
                      <span className="badge badge-cyan inline-navbar-36">
                        Elite Tier
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setUserMenuOpen(false);
                      }}
                      className="inline-navbar-37"
                    >
                      <User size={15} /> My Profile & Settings
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("my-builds");
                        setUserMenuOpen(false);
                      }}
                      className="inline-navbar-38"
                    >
                      <Layers size={15} /> Saved PC Builds
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("orders");
                        setUserMenuOpen(false);
                      }}
                      className="inline-navbar-39"
                    >
                      <Package size={15} /> Order History
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("wishlist");
                        setUserMenuOpen(false);
                      }}
                      className="inline-navbar-40"
                    >
                      <Heart size={15} /> Wishlist ({wishlistCount})
                    </button>

                    <div className="inline-navbar-41" />

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="inline-navbar-42"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {userRole === "guest" && (
            <button
              onClick={() => setCurrentPage("cart")}
              className="btn-icon inline-navbar-24"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart
                size={19}
                strokeWidth={2.3}
                color="#00f0ff"
                style={{ display: "block", flex: "0 0 auto" }}
              />
            </button>
          )}

          {/* Admin Role: Logout & Admin Controls */}
          {userRole === "admin" && (
            <button
              onClick={() => logout()}
              className="btn btn-danger btn-sm inline-navbar-43"
            >
              <LogOut size={14} /> Exit Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
