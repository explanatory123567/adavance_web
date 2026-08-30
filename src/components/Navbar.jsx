import React, { useState } from 'react';
import './Navbar.css';
import { useApp } from '../context/AppContext';
import { Cpu, Search, ShoppingCart, Heart, User, Shield, Layers, SlidersHorizontal, LogOut, Package, Wrench, ChevronDown, ExternalLink } from 'lucide-react';
export default function Navbar() {
  const {
    userRole,
    setUserRole,
    currentPage,
    setCurrentPage,
    cart,
    wishlist,
    setAuthModalOpen,
    setAuthModalMode,
    searchQuery,
    setSearchQuery,
    logout
  } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (currentPage !== 'components') {
      setCurrentPage('components');
    }
  };
  const navLinkStyle = pageKey => ({
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
    color: currentPage === pageKey ? 'var(--neon-cyan)' : 'var(--text-secondary)',
    background: currentPage === pageKey ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
    border: currentPage === pageKey ? '1px solid rgba(0, 240, 255, 0.25)' : '1px solid transparent',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });
  return <header className="inline-navbar-0">
      {/* Top Demo State Switcher Bar */}
      <div className="inline-navbar-1">
        <div className="container-wide inline-navbar-2">
          <div className="inline-navbar-3">
            <span className="badge badge-cyan inline-navbar-4">PROTOTYPE MATRIX</span>
            <span className="inline-navbar-5">
              Current State: <strong style={{
              color: userRole === 'admin' ? '#c084fc' : userRole === 'user' ? 'var(--neon-cyan)' : '#fbbf24'
            }}>
                {userRole.toUpperCase()} {userRole === 'user' ? '(Alex Mercer)' : userRole === 'admin' ? '(System Admin)' : '(Unauthenticated)'}
              </strong>
            </span>
          </div>

          <div className="inline-navbar-6">
            <span className="inline-navbar-7">Quick Persona Switch:</span>
            <button onClick={() => {
            setUserRole('guest');
            setCurrentPage('home');
          }} style={{
            background: userRole === 'guest' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: userRole === 'guest' ? '#fbbf24' : 'var(--text-secondary)',
            border: userRole === 'guest' ? '1px solid #fbbf24' : '1px solid var(--border-subtle)',
            padding: '2px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600
          }}>
              Guest
            </button>
            <button onClick={() => {
            setUserRole('user');
          }} style={{
            background: userRole === 'user' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: userRole === 'user' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            border: userRole === 'user' ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
            padding: '2px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600
          }}>
              User (Alex)
            </button>
            <button onClick={() => {
            setUserRole('admin');
            setCurrentPage('admin');
          }} style={{
            background: userRole === 'admin' ? 'rgba(157, 78, 221, 0.25)' : 'rgba(255, 255, 255, 0.05)',
            color: userRole === 'admin' ? '#c084fc' : 'var(--text-secondary)',
            border: userRole === 'admin' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
            padding: '2px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600
          }}>
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-wide inline-navbar-8">
        {/* Brand Logo */}
        <div onClick={() => setCurrentPage(userRole === 'admin' ? 'admin' : 'home')} className="inline-navbar-9">
          <div className="inline-navbar-10">
            <Cpu size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="inline-navbar-11">
              <span className="inline-navbar-12">NEXT</span>
              <span className="inline-navbar-13">GEAR</span>
            </div>
            <div className="inline-navbar-14">
              {userRole === 'admin' ? 'ADMIN CONSOLE' : 'PC BUILDER & RETAIL'}
            </div>
          </div>
        </div>

        {/* Search Bar (Storefront view) */}
        {userRole !== 'admin' && <form onSubmit={handleSearchSubmit} className="inline-navbar-15">
            <input type="text" placeholder="Search RTX 5090, 7800X3D, Cases, Liquid Coolers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-control inline-navbar-16" />
            <Search size={16} color="var(--neon-cyan)" className="inline-navbar-17" />
          </form>}

        {/* Navigation Links based on User Role */}
        <nav className="inline-navbar-18">
          {userRole === 'admin' ?
        // ADMIN NAV
        <>
              <button onClick={() => setCurrentPage('admin')} style={navLinkStyle('admin')}>
                <Shield size={16} color="var(--neon-purple)" />
                Admin Dashboard
              </button>
              <button onClick={() => {
            setUserRole('user');
            setCurrentPage('home');
          }} className="btn btn-secondary btn-sm inline-navbar-19">
                <ExternalLink size={14} /> View Storefront
              </button>
            </> :
        // GUEST & REGULAR USER NAV
        <>
              <button onClick={() => setCurrentPage('home')} style={navLinkStyle('home')}>
                Home
              </button>
              <button onClick={() => setCurrentPage('components')} style={navLinkStyle('components')}>
                Components
              </button>
              <button onClick={() => setCurrentPage('builder')} style={{
            ...navLinkStyle('builder'),
            background: currentPage === 'builder' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: 'var(--neon-cyan)'
          }}>
                <Wrench size={14} /> PC Builder
              </button>
              <button onClick={() => setCurrentPage('compare')} style={navLinkStyle('compare')}>
                <SlidersHorizontal size={14} /> Compare
              </button>

              {userRole === 'user' && <button onClick={() => setCurrentPage('my-builds')} style={navLinkStyle('my-builds')}>
                  <Layers size={14} /> My Builds
                </button>}
            </>}
        </nav>

        {/* Action Controls & Authentication Area */}
        <div className="inline-navbar-20">
          {/* Guest Role: Login & Register Buttons */}
          {userRole === 'guest' && <div className="inline-navbar-21">
              <button onClick={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }} className="btn btn-secondary btn-sm">
                Login
              </button>
              <button onClick={() => {
            setAuthModalMode('register');
            setAuthModalOpen(true);
          }} className="btn btn-primary btn-sm">
                Register
              </button>
            </div>}

          {/* User Role: Wishlist, Cart & Profile Dropdown */}
          {userRole === 'user' && <>
              <button onClick={() => setCurrentPage('wishlist')} className="btn-icon inline-navbar-22" title="Wishlist">
                <Heart size={18} color={wishlistCount > 0 ? '#f43f5e' : 'currentColor'} fill={wishlistCount > 0 ? '#f43f5e' : 'none'} />
                {wishlistCount > 0 && <span className="inline-navbar-23">
                    {wishlistCount}
                  </span>}
              </button>

              <button onClick={() => setCurrentPage('cart')} className="btn-icon inline-navbar-24" title="Shopping Cart">
                <ShoppingCart size={18} color={cartItemsCount > 0 ? 'var(--neon-cyan)' : 'currentColor'} />
                {cartItemsCount > 0 && <span className="inline-navbar-25">
                    {cartItemsCount}
                  </span>}
              </button>

              {/* User Avatar Menu */}
              <div className="inline-navbar-26">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="inline-navbar-27">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Alex Mercer" className="inline-navbar-28" />
                  <div className="inline-navbar-29">
                    <div className="inline-navbar-30">Alex Mercer</div>
                    <div className="inline-navbar-31">PRO GAMER</div>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {userMenuOpen && <div className="inline-navbar-32">
                    <div className="inline-navbar-33">
                      <div className="inline-navbar-34">Alex Mercer</div>
                      <div className="inline-navbar-35">alex.mercer@cyberforge.io</div>
                      <span className="badge badge-cyan inline-navbar-36">Elite Tier</span>
                    </div>

                    <button onClick={() => {
                setCurrentPage('profile');
                setUserMenuOpen(false);
              }} className="inline-navbar-37">
                      <User size={15} /> My Profile & Settings
                    </button>

                    <button onClick={() => {
                setCurrentPage('my-builds');
                setUserMenuOpen(false);
              }} className="inline-navbar-38">
                      <Layers size={15} /> Saved PC Builds
                    </button>

                    <button onClick={() => {
                setCurrentPage('orders');
                setUserMenuOpen(false);
              }} className="inline-navbar-39">
                      <Package size={15} /> Order History
                    </button>

                    <button onClick={() => {
                setCurrentPage('wishlist');
                setUserMenuOpen(false);
              }} className="inline-navbar-40">
                      <Heart size={15} /> Wishlist ({wishlistCount})
                    </button>

                    <div className="inline-navbar-41" />

                    <button onClick={() => {
                logout();
                setUserMenuOpen(false);
              }} className="inline-navbar-42">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>}
              </div>
            </>}

          {/* Admin Role: Logout & Admin Controls */}
          {userRole === 'admin' && <button onClick={() => logout()} className="btn btn-danger btn-sm inline-navbar-43">
              <LogOut size={14} /> Exit Admin
            </button>}
        </div>
      </div>
    </header>;
}
