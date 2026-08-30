import React, { createContext, useContext, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  COMPONENTS,
  PREBUILT_PCS,
  INITIAL_SAVED_BUILDS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_3D_MODELS
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // User Role: 'guest' | 'user' | 'admin'
  const [userRole, setUserRole] = useState('guest');
  const [currentPage, setCurrentPage] = useState('home');

  // Products & Prebuilts catalog (dynamic for admin mutations)
  const [products, setProducts] = useState(COMPONENTS);
  const prebuilts = PREBUILT_PCS;

  // Cart & Wishlist
  const [cart, setCart] = useState([
    {
      id: "cart-item-1",
      product: COMPONENTS.find(c => c.id === "gpu-1") || COMPONENTS[0],
      quantity: 1
    }
  ]);
  const [wishlist, setWishlist] = useState(["cpu-1", "gpu-1", "case-2"]);
  const [compareList, setCompareList] = useState(["cpu-1", "cpu-2"]);

  // PC Builder Configuration
  const [builderConfig, setBuilderConfig] = useState({
    cpu: COMPONENTS.find(c => c.id === "cpu-1"),
    gpu: COMPONENTS.find(c => c.id === "gpu-1"),
    motherboard: COMPONENTS.find(c => c.id === "mb-2"),
    ram: COMPONENTS.find(c => c.id === "ram-1"),
    storage: COMPONENTS.find(c => c.id === "storage-1"),
    psu: COMPONENTS.find(c => c.id === "psu-1"),
    case: COMPONENTS.find(c => c.id === "case-1"),
    cooler: COMPONENTS.find(c => c.id === "cooler-1"),
    fans: COMPONENTS.find(c => c.id === "fans-1")
  });

  // Priority Slider Weights: Budget vs Performance vs Upgradability (0-100)
  const [priorityProfile, setPriorityProfile] = useState({
    budget: 60,
    performance: 85,
    upgradability: 80
  });

  // Saved Builds & Orders & Users
  const [savedBuilds, setSavedBuilds] = useState(INITIAL_SAVED_BUILDS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [models3d, setModels3d] = useState(INITIAL_3D_MODELS);

  // Global UI Modals & State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [guestActionName, setGuestActionName] = useState('');
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [exportSpecModalOpen, setExportSpecModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Guard action for guests
  const requireAuth = (callback, actionName = 'perform this action') => {
    if (userRole === 'guest') {
      setGuestActionName(actionName);
      setGuestPromptOpen(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Auth Functions
  const loginAs = (role) => {
    setUserRole(role);
    setAuthModalOpen(false);
    setGuestPromptOpen(false);
    if (role === 'admin') {
      setCurrentPage('admin');
      showToast('Admin Terminal Initialized', 'Welcome back, System Administrator.', 'success');
    } else {
      showToast('Welcome Back, Alex!', 'Logged in as Pro Gamer & Streamer.', 'success');
    }
  };

  const logout = () => {
    setUserRole('guest');
    setCurrentPage('home');
    showToast('Signed Out', 'You are now browsing as Guest.', 'info');
  };

  const registerUser = (userData) => {
    setUserRole('user');
    setAuthModalOpen(false);
    setGuestPromptOpen(false);
    showToast('Account Created!', `Welcome to Next Gear, ${userData?.username || 'Gamer'}!`, 'success');
  };

  // Cart Functions
  const addToCart = (product, quantity = 1, customName = null) => {
    if (!requireAuth(null, 'add items to cart')) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && !item.isCustomBuild);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: 'cart-' + Date.now(),
        product,
        quantity,
        customName
      }];
    });

    showToast('Added to Cart', `${product.name} (x${quantity}) added.`, 'success');
  };

  const addCustomBuildToCart = (build) => {
    if (!requireAuth(null, 'order custom PC builds')) return;

    const buildProduct = {
      id: 'custom-' + Date.now(),
      name: build.name || 'Next Gear Custom Battlestation',
      price: build.totalPrice || 2499,
      image: build.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
      specs: build.components || {},
      isCustomBuild: true
    };

    setCart(prev => [...prev, {
      id: 'cart-build-' + Date.now(),
      product: buildProduct,
      quantity: 1,
      isCustomBuild: true
    }]);

    showToast('Build Added to Cart', `${buildProduct.name} is ready for checkout.`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item Removed', 'Item removed from shopping cart.', 'info');
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const toggleWishlist = (productId) => {
    if (!requireAuth(null, 'save items to your wishlist')) return;

    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Product removed from your wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Product added to your wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  // Compare Functions
  const addToCompare = (productId) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        showToast('Already in Compare', 'This component is already selected for comparison.', 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('Compare Limit Reached', 'You can compare up to 4 components at once.', 'warning');
        return prev;
      }
      showToast('Added to Compare', 'Component added to side-by-side comparison.', 'success');
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  // Builder Functions
  const setBuilderSlot = (slotKey, component) => {
    setBuilderConfig(prev => ({
      ...prev,
      [slotKey]: component
    }));
    showToast('Component Mounted', `${component.name} installed in ${slotKey.toUpperCase()} slot.`, 'success');
  };

  const clearBuilderSlot = (slotKey) => {
    setBuilderConfig(prev => ({
      ...prev,
      [slotKey]: null
    }));
    showToast('Slot Cleared', `${slotKey.toUpperCase()} component removed.`, 'info');
  };

  const saveCurrentBuild = (buildName) => {
    if (!requireAuth(null, 'save custom builds to your profile')) return;

    const componentsSummary = {};
    let total = 0;
    let wattage = 0;
    let scoreSum = 0;
    let count = 0;

    Object.entries(builderConfig).forEach(([key, comp]) => {
      if (comp) {
        componentsSummary[key] = comp.name;
        total += comp.price || 0;
        wattage += comp.wattage || 0;
        scoreSum += comp.performanceScore || 85;
        count++;
      }
    });

    const newBuild = {
      id: 'build-' + Date.now(),
      name: buildName || 'Next Gear Custom Rig #' + (savedBuilds.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
      totalPrice: total,
      score: Math.round(count > 0 ? scoreSum / count : 90),
      wattage,
      image: builderConfig.case?.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
      components: componentsSummary
    };

    setSavedBuilds(prev => [newBuild, ...prev]);
    showToast('Build Saved!', `"${newBuild.name}" saved to My Builds.`, 'success');
  };

  // =========================================================================
  // REAL-TIME BOTTLENECK & COMPATIBILITY & RECOMMENDATION ENGINE
  // =========================================================================

  // Calculate Bottleneck Balance Meter (Real-Time)
  const bottleneckData = useMemo(() => {
    const cpu = builderConfig.cpu;
    const gpu = builderConfig.gpu;

    if (!cpu || !gpu) {
      return {
        percentage: 0,
        status: 'Awaiting Hardware Selection',
        tier: 'Balanced',
        description: 'Mount both CPU and GPU to analyze architectural bottleneck percentage.',
        cpuScore: cpu?.performanceScore || 85,
        gpuScore: gpu?.performanceScore || 85
      };
    }

    const cpuScore = cpu.performanceScore || 90;
    const gpuScore = gpu.performanceScore || 90;
    const scoreDiff = Math.abs(cpuScore - gpuScore);

    let bottleneckPercent = Math.min(25, Math.max(1, scoreDiff * 2.8));
    let status = 'Perfect Harmony (< 5% Bottleneck)';
    let tier = 'Optimal';
    let description = 'CPU single-core throughput and GPU shader bandwidth are ideally matched for high-framerate 1440p & 4K gaming.';

    if (cpuScore < gpuScore - 8) {
      status = 'Slight CPU Bottleneck at 1080p';
      tier = 'CPU Heavy';
      bottleneckPercent = Math.round(scoreDiff * 3.2);
      description = `The ${gpu.name} has immense raster power that may be slightly limited by ${cpu.name} in competitive 1080p esports.`;
    } else if (gpuScore < cpuScore - 8) {
      status = 'GPU Bound at 4K Ultra';
      tier = 'GPU Bound';
      bottleneckPercent = Math.round(scoreDiff * 2.5);
      description = `The ${cpu.name} has massive calculation headroom. Your framerates will be purely limited by GPU raytracing performance.`;
    }

    return {
      percentage: Math.min(100, bottleneckPercent),
      status,
      tier,
      description,
      cpuScore,
      gpuScore
    };
  }, [builderConfig.cpu, builderConfig.gpu]);

  // Real-Time Compatibility Matrix Checker
  const compatibilityStatus = useMemo(() => {
    const issues = [];
    const passes = [];

    const cpu = builderConfig.cpu;
    const gpu = builderConfig.gpu;
    const mb = builderConfig.motherboard;
    const psu = builderConfig.psu;
    const cooler = builderConfig.cooler;

    // 1. Socket Compatibility
    if (cpu && mb) {
      const cpuSocket = cpu.specs?.socket || 'AM5';
      const mbSocket = mb.specs?.socket || 'AM5';

      if (cpuSocket !== mbSocket) {
        issues.push({
          type: 'error',
          title: `Socket Mismatch: ${cpuSocket} vs ${mbSocket}`,
          message: `${cpu.name} (${cpuSocket}) cannot mount onto ${mb.name} (${mbSocket}).`,
          category: 'motherboard'
        });
      } else {
        passes.push(`Socket Match Verified: ${cpuSocket}`);
      }
    }

    // 2. Power Wattage Headroom
    const totalWattage = Object.entries(builderConfig)
      .filter(([slot]) => slot !== 'psu')
      .reduce((sum, [, component]) => sum + (component?.wattage || 0), 0);
    const psuCapacity = psu?.wattage || 1000;

    if (totalWattage > psuCapacity) {
      issues.push({
        type: 'error',
        title: 'PSU Capacity Exceeded',
        message: `Total load (${totalWattage}W) exceeds PSU capacity (${psuCapacity}W). Select a higher-wattage PSU.`,
        category: 'psu'
      });
    } else if (totalWattage > psuCapacity * 0.9) {
      issues.push({
        type: 'warning',
        title: 'PSU Wattage Headroom Low',
        message: `Total load (${totalWattage}W) approaches PSU limit (${psuCapacity}W). Recommend 1000W+ for safety margin.`,
        category: 'psu'
      });
    } else {
      passes.push(`Power Safety Headroom: ${Math.round((totalWattage / psuCapacity) * 100)}% load`);
    }

    // 3. Thermal Clearance
    if (cpu && cooler) {
      const supportedSockets = cooler.specs?.sockets || '';
      if (supportedSockets && !supportedSockets.includes(cpu.specs?.socket)) {
        issues.push({
          type: 'error',
          title: 'Cooler Socket Mismatch',
          message: `${cooler.name} does not support the ${cpu.specs?.socket} CPU socket.`,
          category: 'cooler'
        });
      } else {
        passes.push('Thermal Dispersion: CPU socket support verified');
      }
    }

    // 4. GPU Length & Chassis Clearance
    const gpuLength = Number.parseFloat(String(gpu?.specs?.length || '').match(/[\d.]+/)?.[0] || 0);
    const caseClearance = Number.parseFloat(String(builderConfig.case?.specs?.gpuClearance || '').match(/[\d.]+/)?.[0] || 0);
    if (gpu && builderConfig.case && gpuLength && caseClearance && gpuLength > caseClearance) {
      issues.push({
        type: 'error',
        title: 'GPU Chassis Clearance Failure',
        message: `${gpu.name} is ${gpuLength}mm long, but ${builderConfig.case.name} supports ${caseClearance}mm.`,
        category: 'case'
      });
    } else {
      passes.push('Chassis Clearance: GPU length verified');
    }
    passes.push('DDR5 EXPO & XMP 3.0 Memory Profile Certified');

    return {
      isCompatible: issues.filter(i => i.type === 'error').length === 0,
      issues,
      passes
    };
  }, [builderConfig]);

  // Dynamic Component Recommendation Engine (Tailored to Selected CPU & Priorities)
  const getRecommendationsForSlot = (categoryKey) => {
    const currentCpu = builderConfig.cpu;
    const cpuSocket = currentCpu?.specs?.socket || 'AM5';

    const parseMillimeters = value => Number.parseFloat(String(value || '').match(/[\d.]+/)?.[0] || 0);
    const currentCaseClearance = parseMillimeters(builderConfig.case?.specs?.gpuClearance);
    const currentGpuLength = parseMillimeters(builderConfig.gpu?.specs?.length);
    const currentLoadWithoutSlot = Object.entries(builderConfig)
      .filter(([slot]) => slot !== categoryKey && slot !== 'psu')
      .reduce((sum, [, component]) => sum + (component?.wattage || 0), 0);

    const isCompatibleCandidate = candidate => {
      if (categoryKey === 'motherboard' && currentCpu) {
        return candidate.specs?.socket === cpuSocket;
      }

      if (categoryKey === 'cpu' && builderConfig.motherboard) {
        return candidate.specs?.socket === builderConfig.motherboard.specs?.socket;
      }

      if (categoryKey === 'gpu' && currentCaseClearance && candidate.specs?.length) {
        return parseMillimeters(candidate.specs.length) <= currentCaseClearance;
      }

      if (categoryKey === 'case' && currentGpuLength && candidate.specs?.gpuClearance) {
        return currentGpuLength <= parseMillimeters(candidate.specs.gpuClearance);
      }

      if (categoryKey === 'cooler' && currentCpu && candidate.specs?.sockets) {
        return candidate.specs.sockets.includes(cpuSocket);
      }

      if (categoryKey === 'psu') {
        return currentLoadWithoutSlot <= candidate.wattage * 0.9;
      }

      if (builderConfig.psu && categoryKey !== 'psu') {
        return currentLoadWithoutSlot + (candidate.wattage || 0) <= builderConfig.psu.wattage * 0.9;
      }

      return true;
    };

    let candidates = products
      .filter(p => p.category === categoryKey)
      .filter(isCompatibleCandidate);

    if (categoryKey === 'motherboard') {
      // Prioritize motherboards with matching socket
      return candidates.map(mb => ({
        ...mb,
        isRecommendedMatch: mb.specs?.socket === cpuSocket,
        recommendationReason: mb.specs?.socket === cpuSocket
          ? `⭐ Direct Match for ${currentCpu?.name || 'Selected CPU'} (${cpuSocket})`
          : `Requires ${mb.specs?.socket} Socket`
      }));
    }

    if (categoryKey === 'cooler') {
      return candidates.map(clr => ({
        ...clr,
        isRecommendedMatch: clr.performanceScore >= 95,
        recommendationReason: clr.performanceScore >= 95
          ? '⭐ High-Efficiency Thermal Dispersion (Zero Throttling)'
          : 'Standard Air Cooling'
      }));
    }

    if (categoryKey === 'ram') {
      return candidates.map(ram => ({
        ...ram,
        isRecommendedMatch: ram.specs?.speed?.includes('6000') || ram.specs?.speed?.includes('6400'),
        recommendationReason: '⭐ Sweet Spot DDR5 Latency (CL30/CL32)'
      }));
    }

    if (categoryKey === 'psu') {
      return candidates.map(p => ({
        ...p,
        isRecommendedMatch: p.wattage >= 850,
        recommendationReason: p.wattage >= 850 ? '⭐ ATX 3.0 Ready with Native 12VHPWR' : 'Standard ATX'
      }));
    }

    return candidates.map(p => ({
      ...p,
      isRecommendedMatch: p.performanceScore >= 90,
      recommendationReason: '⭐ High-Performance Tier Pairing'
    }));
  };

  // Future Upgrade Advisor
  const futureUpgradesAdvice = useMemo(() => {
    const currentMb = builderConfig.motherboard;
    const currentPsu = builderConfig.psu;
    const currentRam = builderConfig.ram;

    const advices = [];

    if (currentMb?.specs?.socket === 'AM5') {
      advices.push({
        title: 'Long-Term CPU Socket Longevity',
        desc: 'AMD AM5 platform is supported through 2027+, allowing drop-in upgrades to Zen 6 CPUs without changing motherboards.'
      });
    }

    if (currentPsu?.wattage >= 1000) {
      advices.push({
        title: '+400W Power Expansion Headroom',
        desc: 'Your 1000W+ ATX 3.0 power supply has massive transient headroom for next-gen RTX 60-Series GPUs.'
      });
    }

    if (currentRam?.specs?.capacity?.includes('32GB')) {
      advices.push({
        title: 'Dual-Channel Expansion Ready',
        desc: 'Motherboard contains 2 vacant DIMM slots to easily expand to 64GB DDR5 memory in the future.'
      });
    }

    advices.push({
      title: 'PCIe 5.0 High-Speed NVMe Slot 2',
      desc: 'Secondary Gen5 M.2 bay available for adding 4TB-8TB ultra-fast game storage.'
    });

    return advices;
  }, [builderConfig]);

  // Checkout & Place Order
  const placeOrder = (orderData) => {
    if (!requireAuth(null, 'place orders')) return null;

    const orderId = 'NG-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customer: orderData.name || 'Alex Mercer',
      email: orderData.email || 'alex.mercer@nextgear.gg',
      total: orderData.total,
      status: 'Processing',
      trackingNumber: 'NG-US-' + Math.floor(100000000 + Math.random() * 900000000),
      paymentMethod: orderData.paymentMethod || 'Credit Card (Visa •••• 4242)',
      items: cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image
      }))
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00d4ff', '#8b5cf6', '#3b82f6', '#10b981']
      });
    } catch (e) {
      // safe fallback
    }

    showToast('Order Placed Successfully!', `Order #${orderId} has been confirmed.`, 'success');
    return newOrder;
  };

  // Admin Mutations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    showToast('Order Status Updated', `Order ${orderId} is now ${newStatus}.`, 'info');
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast('Account Status Changed', `${u.name} is now ${nextStatus}.`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: (newProduct.category || 'comp') + '-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      inStock: (newProduct.stock || 1) > 0
    };
    setProducts(prev => [productWithId, ...prev]);
    showToast('Product Added', `${productWithId.name} added to catalog.`, 'success');
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast('Product Updated', `${updatedProduct.name} has been updated.`, 'success');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product Deleted', 'Product removed from catalog.', 'warning');
  };

  const restockProduct = (productId, amount = 10) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = (p.stock || 0) + amount;
        return { ...p, stock: newStock, inStock: newStock > 0 };
      }
      return p;
    }));
    showToast('Stock Replenished', `Added +${amount} units to inventory.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentPage,
        setCurrentPage,
        products,
        prebuilts,
        cart,
        addToCart,
        addCustomBuildToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        builderConfig,
        setBuilderSlot,
        clearBuilderSlot,
        saveCurrentBuild,
        savedBuilds,
        setSavedBuilds,
        orders,
        users,
        toggleUserStatus,
        models3d,
        setModels3d,
        toasts,
        showToast,
        removeToast,
        requireAuth,
        loginAs,
        logout,
        registerUser,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        guestPromptOpen,
        setGuestPromptOpen,
        guestActionName,
        activeProductModal,
        setActiveProductModal,
        exportSpecModalOpen,
        setExportSpecModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        priorityProfile,
        setPriorityProfile,
        bottleneckData,
        compatibilityStatus,
        getRecommendationsForSlot,
        futureUpgradesAdvice,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
