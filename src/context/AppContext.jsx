import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import confetti from "canvas-confetti";
import { authApi, dataApi } from "../services/api";
import { motherboardFitsCase } from "../utils/productSpecs";
import { summarizeProductReviews } from "../utils/productUtils";

const AppContext = createContext();

const FALLBACK_PRODUCTS = [
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 449,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "8-core gaming CPU with 3D V-Cache.",
    performanceScore: 96,
    wattage: 120,
    specs: { socket: "AM5", cores: "8C/16T" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
  },
  {
    id: "gpu-1",
    name: "NVIDIA GeForce RTX 5090 32GB",
    brand: "NVIDIA",
    category: "gpu",
    price: 1999,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "Flagship ray-traced gaming graphics card.",
    performanceScore: 99,
    wattage: 575,
    specs: { length: "304mm", vram: "32GB GDDR7" },
    featured: true,
    isPopular: true,
    rating: 4.98,
    reviewsCount: 142,
    inStock: true,
  },
  {
    id: "mb-1",
    name: "MSI MAG X670E Tomahawk WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 279,
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "AM5 DDR5 motherboard with PCIe 5.0.",
    performanceScore: 92,
    wattage: 70,
    specs: { socket: "AM5" },
    featured: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 204,
    inStock: true,
  },
  {
    id: "ram-1",
    name: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
    brand: "G.Skill",
    category: "ram",
    price: 139,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "Low-latency dual-channel DDR5 kit.",
    performanceScore: 90,
    wattage: 10,
    specs: { speed: "DDR5-6000", capacity: "32GB" },
    featured: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 188,
    inStock: true,
  },
  {
    id: "storage-1",
    name: "Samsung 990 PRO 2TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 179,
    stock: 22,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "High-speed PCIe 4.0 NVMe storage.",
    performanceScore: 93,
    wattage: 8,
    specs: { capacity: "2TB", interface: "PCIe 4.0" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 260,
    inStock: true,
  },
  {
    id: "psu-1",
    name: "Corsair RM1000x Shift 1000W",
    brand: "Corsair",
    category: "psu",
    price: 189,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "ATX 3.0 modular power supply.",
    performanceScore: 91,
    wattage: 1000,
    specs: { efficiency: "80+ Gold" },
    featured: false,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 120,
    inStock: true,
  },
  {
    id: "case-1",
    name: "Lian Li O11 Dynamic EVO RGB",
    brand: "Lian Li",
    category: "case",
    price: 159,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "Dual-chamber tempered-glass chassis.",
    performanceScore: 88,
    wattage: 0,
    specs: { gpuClearance: "420mm", includedFans: "Free fans included" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 198,
    inStock: true,
  },
  {
    id: "cooler-1",
    name: "NZXT Kraken Elite 360 RGB",
    brand: "NZXT",
    category: "cooler",
    price: 249,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "360mm liquid CPU cooler with LCD display.",
    performanceScore: 95,
    wattage: 15,
    specs: { sockets: "AM5,LGA1700" },
    featured: true,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 96,
    inStock: true,
  },
];

const normalizeCatalogProducts = (items) =>
  items
    .filter((product) => product.category !== "fans")
    .map((product) =>
      product.category === "case"
        ? {
            ...product,
            specs: {
              ...product.specs,
              includedFans: "Free fans included",
            },
          }
        : product,
    );

const mergeCatalogProducts = (catalogItems) => {
  const apiProductIds = new Set(catalogItems.map((product) => product.id));
  return normalizeCatalogProducts([
    ...FALLBACK_PRODUCTS.filter((product) => !apiProductIds.has(product.id)),
    ...catalogItems,
  ]);
};

const FALLBACK_USERS = [
  { id: "u-1", name: "Ava Reyes", status: "Active" },
  { id: "u-2", name: "Liam Cole", status: "Active" },
  { id: "u-3", name: "Maya Patel", status: "Active" },
  { id: "u-4", name: "Noah Smith", status: "Suspended" },
  { id: "u-5", name: "Isla Gomez", status: "Active" },
  { id: "u-6", name: "Ethan Park", status: "Active" },
];

export function AppProvider({ children }) {
  // User Role: 'guest' | 'user' | 'admin'
  const [authUser, setAuthUser] = useState(() =>
    JSON.parse(localStorage.getItem("nextgear_user") || "null"),
  );
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("nextgear_token"),
  );
  const [userRole, setUserRole] = useState(() => authUser?.role || "guest");
  const [currentPage, setCurrentPage] = useState("home");
  const [adminTab, setAdminTab] = useState("dashboard");

  // Products & Prebuilts catalog (dynamic for admin mutations)
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [prebuilts] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState({
    totalSales: 0,
    salesGrowth: "+0.0%",
    totalOrders: 0,
    ordersGrowth: "+0.0%",
    totalProducts: 0,
    lowStockCount: 0,
    activeCustomers: 0,
    monthlySales: [],
    categoryBreakdown: [],
    totalAddresses: 0,
  });

  // Cart & Wishlist
  const [cart, setCart] = useState([]);
  const [checkoutItemIds, setCheckoutItemIds] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);

  // PC Builder Configuration
  const [builderConfig, setBuilderConfig] = useState({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    cooler: null,
  });

  // Priority Slider Weights: Budget vs Performance vs Upgradability (0-100)
  const [priorityProfile, setPriorityProfile] = useState({
    budget: 60,
    performance: 85,
    upgradability: 80,
  });

  // Saved Builds & Orders & Users
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [users, setUsers] = useState(FALLBACK_USERS);
  const [models3d, setModels3d] = useState([]);
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    dataApi
      .catalog()
      .then((catalog) => {
        const catalogItems = Array.isArray(catalog)
          ? catalog
          : catalog.products || [];
        setProducts(mergeCatalogProducts(catalogItems));
        setBuilderConfig((current) => {
          if (Object.keys(current).some((key) => current[key])) {
            return current;
          }

          return {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooler: null,
          };
        });
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS);
      });
    dataApi
      .models()
      .then(setModels3d)
      .catch(() => setModels3d([]));
    if (authToken && authUser?.role === "admin") {
      dataApi
        .adminAnalytics(authToken)
        .then(setAdminAnalytics)
        .catch(() => setAdminAnalytics({
          totalSales: 0,
          salesGrowth: "+0.0%",
          totalOrders: 0,
          ordersGrowth: "+0.0%",
          totalProducts: 0,
          lowStockCount: 0,
          activeCustomers: 0,
          monthlySales: [],
          categoryBreakdown: [],
          totalAddresses: 0,
        }));
    }
  }, [authToken, authUser?.role]);

  useEffect(() => {
    const refreshCatalog = () => {
      dataApi.catalog().then((catalog) => {
        const catalogItems = Array.isArray(catalog)
          ? catalog
          : catalog.products || [];
        setProducts(mergeCatalogProducts(catalogItems));
      }).catch(() => {});
    };
    const interval = setInterval(refreshCatalog, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authToken || authUser?.role !== "admin") return;
    dataApi
      .adminAnalytics(authToken)
      .then(setAdminAnalytics)
      .catch(() => setAdminAnalytics({
        totalSales: 0,
        salesGrowth: "+0.0%",
        totalOrders: 0,
        ordersGrowth: "+0.0%",
        totalProducts: products.length,
        lowStockCount: 0,
        activeCustomers: 0,
        monthlySales: [],
        categoryBreakdown: [],
        totalAddresses: 0,
      }));
  }, [authToken, authUser?.role, products.length]);

  useEffect(() => {
    if (authToken) {
      dataApi
        .account(authToken)
        .then((account) => {
          setCart(account.cart || []);
          setWishlist(account.wishlist || []);
          setSavedBuilds(account.savedBuilds || []);
          setAddresses(account.addresses || []);
          dataApi
            .orders(authToken)
            .then(setOrders)
            .catch(() => setOrders(account.orders || []));
          if (authUser?.role === "admin") {
            dataApi
              .users(authToken)
              .then(setUsers)
              .catch(() => setUsers([]));
            dataApi
              .adminAnalytics(authToken)
              .then(setAdminAnalytics)
              .catch(() => setAdminAnalytics({
                totalSales: 0,
                salesGrowth: "+0.0%",
                totalOrders: 0,
                ordersGrowth: "+0.0%",
                totalProducts: products.length,
                lowStockCount: 0,
                activeCustomers: 0,
                monthlySales: [],
                categoryBreakdown: [],
                totalAddresses: 0,
              }));
          }
        })
        .catch(() => {
          setCart([]);
          setWishlist([]);
          setSavedBuilds([]);
          setAddresses([]);
        });
    }
  }, [authToken, authUser?.role, products.length]);

  useEffect(() => {
    let active = true;
    const refreshReviews = () =>
      dataApi.reviews().then((items) => {
        if (active) setReviews(items);
      }).catch(() => {});
    refreshReviews();
    const interval = setInterval(refreshReviews, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!authToken) {
      setNotifications([]);
      setMyReviews([]);
      setAdminReviews([]);
      return undefined;
    }
    let active = true;
    const refreshAccountActivity = () => {
      dataApi.notifications(authToken).then((items) => {
        if (active) setNotifications(items);
      }).catch(() => {});
      dataApi.orders(authToken).then((items) => {
        if (active) setOrders(items);
      }).catch(() => {});
      dataApi.myReviews(authToken).then((items) => {
        if (active) setMyReviews(items);
      }).catch(() => {});
      if (authUser?.role === "admin") {
        dataApi.adminReviews(authToken).then((items) => {
          if (active) setAdminReviews(items);
        }).catch(() => {});
      } else {
        setAdminReviews([]);
      }
    };
    refreshAccountActivity();
    const interval = setInterval(refreshAccountActivity, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [authToken, authUser?.role]);

  // Global UI Modals & State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'register'
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [guestActionName, setGuestActionName] = useState("");
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [exportSpecModalOpen, setExportSpecModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Toasts
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showConfirmDialog = ({ title, message, confirmText = "OK", cancelText = "Cancel", onConfirm, onCancel }) => {
    setConfirmDialog({ title, message, confirmText, cancelText, onConfirm, onCancel });
  };

  const hideConfirmDialog = () => setConfirmDialog(null);

  const showToast = (title, message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
    try {
      await dataApi.markNotificationRead(authToken, notificationId);
    } catch (error) {
      showToast("Notification could not be updated", error.message, "warning");
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      await dataApi.markAllNotificationsRead(authToken);
    } catch (error) {
      showToast("Notifications could not be updated", error.message, "warning");
    }
  };

  const submitReview = async (product, reviewData) => {
    if (!requireAuth(null, "submit a product review")) return null;
    try {
      const review = await dataApi.createReview(authToken, {
        ...reviewData,
        productId: product.id,
        productName: product.name,
      });
      setMyReviews((prev) => [review, ...prev]);
      setReviews((prev) => [review, ...prev.filter((item) => item.id !== review.id)]);
      showToast("Review published", "Your review is now visible on this product.", "success");
      return review;
    } catch (error) {
      showToast("Review could not be submitted", error.message, "warning");
      return null;
    }
  };

  const getProductReviewSummary = (product) =>
    summarizeProductReviews(product, reviews);
  const productsWithReviewStats = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        ...getProductReviewSummary(product),
      })),
    [products, reviews],
  );

  // Guard action for guests
  const requireAuth = (callback, actionName = "perform this action") => {
    if (userRole === "guest") {
      setGuestActionName(actionName);
      setGuestPromptOpen(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Auth Functions
  const applyAuthSession = (session) => {
    setAuthToken(session.token);
    setAuthUser(session.user);
    localStorage.setItem("nextgear_token", session.token);
    localStorage.setItem("nextgear_user", JSON.stringify(session.user));
    setUserRole(session.user.role);
    setAuthModalOpen(false);
    setGuestPromptOpen(false);
    if (session.user.role === "admin") {
      setCurrentPage("admin");
      showToast(
        "Admin Terminal Initialized",
        "Welcome back, System Administrator.",
        "success",
      );
    } else {
      showToast(
        "Welcome Back",
        `Signed in as ${session.user.name}.`,
        "success",
      );
    }
  };

  const requestVerificationCode = async (
    email,
    captchaToken,
    purpose = "register",
  ) => authApi.requestCode({ email, purpose, captchaToken });

  const resetPassword = async (payload) => {
    const result = await authApi.resetPassword(payload);
    showToast("Password updated", "You can now sign in with your new password.", "success");
    return result;
  };

  const loginUser = async (credentials) => {
    const session = await authApi.login(credentials);
    applyAuthSession(session);
    issueRandomOffer(session.token);
    return session;
  };

  const loginWithGoogle = async (payload) => {
    const session = await authApi.googleLogin(payload);
    applyAuthSession(session);
    issueRandomOffer(session.token);
    return session;
  };

  const logout = () => {
    setUserRole("guest");
    setAuthUser(null);
    setAuthToken(null);
    localStorage.removeItem("nextgear_token");
    localStorage.removeItem("nextgear_user");
    setCurrentPage("home");
    showToast("Signed Out", "You are now browsing as Guest.", "info");
  };

  const registerUser = async (userData) => {
    const session = await authApi.register(userData);
    applyAuthSession(session);
    issueRandomOffer(session.token);
    showToast(
      "Account Created!",
      `Welcome to Next Gear, ${session.user.username}!`,
      "success",
    );
    return session;
  };

  const issueRandomOffer = async (token) => {
    try {
      const response = await dataApi.randomOffer(token);
      if (!response.offer) return;
      localStorage.setItem("nextgear_random_offer", JSON.stringify(response.offer));
      showToast("Private login offer", `${Math.round(response.offer.discount * 100)}% off with code ${response.offer.code}.`, "success");
    } catch (error) {
      // Promotional offers should never block authentication.
    }
  };

  const persistAccount = (changes) => {
    if (!authToken) return;
    dataApi
      .updateAccount(authToken, changes)
      .catch((error) =>
        showToast("Account sync failed", error.message, "warning"),
      );
  };

  const updateProfile = async (profile) => {
    const session = await dataApi.updateProfile(authToken, profile);
    setAuthToken(session.token);
    setAuthUser(session.user);
    setUserRole(session.user.role);
    localStorage.setItem("nextgear_token", session.token);
    localStorage.setItem("nextgear_user", JSON.stringify(session.user));
    return session.user;
  };

  const refreshProfile = useCallback(async () => {
    if (!authToken) throw new Error("Sign in to manage your profile.");
    const user = await dataApi.profile(authToken);
    setAuthUser(user);
    localStorage.setItem("nextgear_user", JSON.stringify(user));
    return user;
  }, [authToken]);

  const connectDiscord = useCallback(async () => {
    if (!authToken) throw new Error("Sign in to connect a Discord account.");
    const { authorizationUrl } = await dataApi.discordConnect(authToken);
    window.location.assign(authorizationUrl);
  }, [authToken]);

  const disconnectDiscord = useCallback(async () => {
    if (!authToken) throw new Error("Sign in to manage your Discord connection.");
    const user = await dataApi.discordDisconnect(authToken);
    setAuthUser(user);
    localStorage.setItem("nextgear_user", JSON.stringify(user));
    return user;
  }, [authToken]);

  const addModelAsset = async (asset) => {
    try {
      const savedAsset = await dataApi.createModel(authToken, asset);
      setModels3d((prev) => [savedAsset, ...prev]);
      showToast(
        "3D Model Registered",
        `${savedAsset.name} is now stored in MongoDB.`,
        "success",
      );
      return savedAsset;
    } catch (error) {
      showToast("3D model could not be saved", error.message, "warning");
      return null;
    }
  };

  const updateModelAsset = async (id, asset) => {
    try {
      const savedAsset = await dataApi.updateModel(authToken, id, asset);
      setModels3d((prev) =>
        prev.map((item) =>
          item.id === id || item._id === id ? savedAsset : item,
        ),
      );
      showToast(
        "3D Model Updated",
        `${savedAsset.name} has been replaced successfully.`,
        "success",
      );
      return savedAsset;
    } catch (error) {
      showToast("3D model could not be updated", error.message, "warning");
      return null;
    }
  };

  const deleteModelAsset = async (id) => {
    if (!id) {
      showToast("Model missing", "Select a 3D model before deleting it.", "warning");
      return false;
    }
    if (!authToken) {
      showToast("Admin login required", "Sign in as an admin to remove 3D model assets.", "warning");
      return false;
    }

    try {
      await dataApi.deleteModel(authToken, id);
      setModels3d((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      showToast("3D Model Deleted", "The asset has been removed from the builder catalog.", "warning");
      return true;
    } catch (error) {
      showToast("3D model could not be deleted", error.message, "warning");
      return false;
    }
  };

  const addAddress = async (address) => {
    const savedAddress = await dataApi.createAddress(authToken, address);
    setAddresses((prev) =>
      address.isDefault
        ? [savedAddress, ...prev.map((item) => ({ ...item, isDefault: false }))]
        : [savedAddress, ...prev],
    );
    return savedAddress;
  };

  // Cart Functions
  const addToCart = (
    product,
    quantity = 1,
    customName = null,
    { checkoutOnly = false, notificationTitle = "Added to Cart", notificationMessage } = {},
  ) => {
    if (!requireAuth(null, "add items to cart")) return null;

    const existing = cart.find(
      (item) => item.product.id === product.id && !item.isCustomBuild,
    );
    const nextCart = existing
      ? cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [
          ...cart,
          {
            id: "cart-" + Date.now(),
            product,
            quantity,
            customName,
          },
        ];
    setCart(nextCart);
    persistAccount({ cart: nextCart });
    const cartItemId = existing
      ? nextCart.find((item) => item.product.id === product.id && !item.isCustomBuild)?.id
      : nextCart[nextCart.length - 1].id;
    setCheckoutItemIds((currentIds) => {
      if (checkoutOnly) return [cartItemId];
      return currentIds === null
        ? null
        : [...new Set([...currentIds, cartItemId])];
    });

    if (notificationTitle) {
      showToast(
        notificationTitle,
        notificationMessage || `${product.name} (x${quantity}) added.`,
        "success",
      );
    }
    return cartItemId;
  };

  const addCustomBuildToCart = (build) => {
    if (!requireAuth(null, "order custom PC builds")) return;

    const buildProduct = {
      id: "custom-" + Date.now(),
      name: build.name || "Next Gear Custom Battlestation",
      price: build.totalPrice || 2499,
      image:
        build.image ||
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80",
      specs: build.components || {},
      isCustomBuild: true,
    };

    const nextCart = [
      ...cart,
      {
        id: "cart-build-" + Date.now(),
        product: buildProduct,
        quantity: 1,
        isCustomBuild: true,
      },
    ];
    setCart(nextCart);
    setCheckoutItemIds((currentIds) =>
      currentIds === null ? null : [...new Set([...currentIds, nextCart[nextCart.length - 1].id])],
    );
    persistAccount({ cart: nextCart });

    showToast(
      "Build Added to Cart",
      `${buildProduct.name} is ready for checkout.`,
      "success",
    );
  };

  const removeFromCart = (cartItemId) => {
    const nextCart = cart.filter((item) => item.id !== cartItemId);
    setCart(nextCart);
    setCheckoutItemIds((currentIds) =>
      currentIds === null ? null : currentIds.filter((id) => id !== cartItemId),
    );
    persistAccount({ cart: nextCart });
    showToast("Item Removed", "Item removed from shopping cart.", "info");
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const nextCart = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity: newQty } : item,
    );
    setCart(nextCart);
    persistAccount({ cart: nextCart });
  };

  const clearCart = () => {
    setCart([]);
    setCheckoutItemIds(null);
    persistAccount({ cart: [] });
  };

  // Wishlist Functions
  const toggleWishlist = (productId) => {
    if (!requireAuth(null, "save items to your wishlist")) return;

    const exists = wishlist.includes(productId);
    const nextWishlist = exists
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(nextWishlist);
    persistAccount({ wishlist: nextWishlist });
    showToast(
      exists ? "Removed from Wishlist" : "Saved to Wishlist",
      exists
        ? "Product removed from your wishlist."
        : "Product added to your wishlist.",
      exists ? "info" : "success",
    );
  };

  // Compare Functions
  const addToCompare = (productId) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast(
          "Already in Compare",
          "This component is already selected for comparison.",
          "info",
        );
        return prev;
      }
      if (prev.length >= 4) {
        showToast(
          "Compare Limit Reached",
          "You can compare up to 4 components at once.",
          "warning",
        );
        return prev;
      }
      showToast(
        "Added to Compare",
        "Component added to side-by-side comparison.",
        "success",
      );
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  };

  // Builder Functions
  const setBuilderSlot = (slotKey, component) => {
    setBuilderConfig((prev) => ({
      ...prev,
      [slotKey]: component,
    }));
    showToast(
      "Component Mounted",
      `${component.name} installed in ${slotKey.toUpperCase()} slot.`,
      "success",
    );
  };

  const clearBuilderSlot = (slotKey) => {
    setBuilderConfig((prev) => ({
      ...prev,
      [slotKey]: null,
    }));
    showToast(
      "Slot Cleared",
      `${slotKey.toUpperCase()} component removed.`,
      "info",
    );
  };

  const saveCurrentBuild = (buildName) => {
    if (!requireAuth(null, "save custom builds to your profile")) return;

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
      id: "build-" + Date.now(),
      name: buildName || "Next Gear Custom Rig #" + (savedBuilds.length + 1),
      createdAt: new Date().toISOString().split("T")[0],
      totalPrice: total,
      score: Math.round(count > 0 ? scoreSum / count : 90),
      wattage,
      image:
        builderConfig.case?.image ||
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
      components: componentsSummary,
    };

    const nextSavedBuilds = [newBuild, ...savedBuilds];
    setSavedBuilds(nextSavedBuilds);
    persistAccount({ savedBuilds: nextSavedBuilds });
    showToast(
      "Build Saved!",
      `"${newBuild.name}" saved to My Builds.`,
      "success",
    );
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
        status: "Awaiting Hardware Selection",
        tier: "Balanced",
        description:
          "Mount both CPU and GPU to analyze architectural bottleneck percentage.",
        cpuScore: cpu?.performanceScore || 85,
        gpuScore: gpu?.performanceScore || 85,
      };
    }

    const cpuScore = cpu.performanceScore || 90;
    const gpuScore = gpu.performanceScore || 90;
    const scoreDiff = Math.abs(cpuScore - gpuScore);

    let bottleneckPercent = Math.min(25, Math.max(1, scoreDiff * 2.8));
    let status = "Perfect Harmony (< 5% Bottleneck)";
    let tier = "Optimal";
    let description =
      "CPU single-core throughput and GPU shader bandwidth are ideally matched for high-framerate 1440p & 4K gaming.";

    if (cpuScore < gpuScore - 8) {
      status = "Slight CPU Bottleneck at 1080p";
      tier = "CPU Heavy";
      bottleneckPercent = Math.round(scoreDiff * 3.2);
      description = `The ${gpu.name} has immense raster power that may be slightly limited by ${cpu.name} in competitive 1080p esports.`;
    } else if (gpuScore < cpuScore - 8) {
      status = "GPU Bound at 4K Ultra";
      tier = "GPU Bound";
      bottleneckPercent = Math.round(scoreDiff * 2.5);
      description = `The ${cpu.name} has massive calculation headroom. Your framerates will be purely limited by GPU raytracing performance.`;
    }

    return {
      percentage: Math.min(100, bottleneckPercent),
      status,
      tier,
      description,
      cpuScore,
      gpuScore,
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
      const cpuSocket = cpu.specs?.socket;
      const mbSocket = mb.specs?.socket;
      if (!cpuSocket || !mbSocket) {
        issues.push({
          type: "warning",
          title: "Socket data missing",
          message: "Add socket specifications to both the CPU and motherboard to verify their fit.",
          category: "motherboard",
        });
      } else if (cpuSocket !== mbSocket) {
        issues.push({
          type: "error",
          title: `Socket Mismatch: ${cpuSocket} vs ${mbSocket}`,
          message: `${cpu.name} (${cpuSocket}) cannot mount onto ${mb.name} (${mbSocket}).`,
          category: "motherboard",
        });
      } else {
        passes.push(`Socket Match Verified: ${cpuSocket}`);
      }
    }

    // 2. Power Wattage Headroom
    const totalWattage = Object.entries(builderConfig)
      .filter(([slot]) => slot !== "psu")
      .reduce((sum, [, component]) => sum + (component?.wattage || 0), 0);
    const psuCapacity = Number(psu?.wattage) || 0;

    if (totalWattage > 0 && !psu) {
      issues.push({
        type: "warning",
        title: "Power supply not selected",
        message: "Select a PSU to verify power capacity and headroom.",
        category: "psu",
      });
    } else if (psu && totalWattage > psuCapacity) {
      issues.push({
        type: "error",
        title: "PSU Capacity Exceeded",
        message: `Total load (${totalWattage}W) exceeds PSU capacity (${psuCapacity}W). Select a higher-wattage PSU.`,
        category: "psu",
      });
    } else if (psu && totalWattage > psuCapacity * 0.9) {
      issues.push({
        type: "warning",
        title: "PSU Wattage Headroom Low",
        message: `Total load (${totalWattage}W) approaches PSU limit (${psuCapacity}W). Recommend 1000W+ for safety margin.`,
        category: "psu",
      });
    } else if (psu && totalWattage > 0) {
      passes.push(
        `Power Safety Headroom: ${Math.round((totalWattage / psuCapacity) * 100)}% load`,
      );
    }

    // 3. Thermal Clearance
    if (cpu && cooler) {
      const supportedSockets = cooler.specs?.sockets;
      const cpuSocket = cpu.specs?.socket;
      if (!supportedSockets || !cpuSocket) {
        issues.push({
          type: "warning",
          title: "Cooler socket data missing",
          message: "Add CPU socket and cooler support specifications to verify fit.",
          category: "cooler",
        });
      } else if (!supportedSockets.includes(cpuSocket)) {
        issues.push({
          type: "error",
          title: "Cooler Socket Mismatch",
          message: `${cooler.name} does not support the ${cpu.specs?.socket} CPU socket.`,
          category: "cooler",
        });
      } else {
        passes.push("Thermal Dispersion: CPU socket support verified");
      }
    }

    // 4. Motherboard-to-Case Fit
    if (mb && builderConfig.case) {
      const boardFormFactor = mb.specs?.formFactor;
      const caseFormFactor = builderConfig.case.specs?.formFactor ||
        builderConfig.case.specs?.supportedFormFactors;
      if (!boardFormFactor || !caseFormFactor) {
        issues.push({
          type: "warning",
          title: "Form-factor data missing",
          message: "Add motherboard and case form-factor specifications to verify fit.",
          category: "case",
        });
      } else if (!motherboardFitsCase(mb, builderConfig.case)) {
        issues.push({
          type: "error",
          title: "Motherboard Does Not Fit Case",
          message: `${mb.name} (${boardFormFactor}) does not fit inside ${builderConfig.case.name} (${caseFormFactor}).`,
          category: "case",
        });
      } else {
        passes.push(`Case Fit: ${boardFormFactor} fits in ${builderConfig.case.name}`);
      }
    }

    // 5. GPU Length & Chassis Clearance
    const gpuLength = Number.parseFloat(
      String(gpu?.specs?.length || "").match(/[\d.]+/)?.[0] || 0,
    );
    const caseClearance = Number.parseFloat(
      String(builderConfig.case?.specs?.gpuClearance || "").match(
        /[\d.]+/,
      )?.[0] || 0,
    );
    if (gpu && builderConfig.case) {
      if (!gpuLength || !caseClearance) {
        issues.push({
          type: "warning",
          title: "GPU clearance data missing",
          message: "Add GPU length and case GPU-clearance specifications to verify fit.",
          category: "case",
        });
      } else if (gpuLength > caseClearance) {
        issues.push({
          type: "error",
          title: "GPU Chassis Clearance Failure",
          message: `${gpu.name} is ${gpuLength}mm long, but ${builderConfig.case.name} supports ${caseClearance}mm.`,
          category: "case",
        });
      } else {
        passes.push(`Chassis Clearance: ${gpuLength}mm GPU fits ${caseClearance}mm case`);
      }
    }

    if (mb && builderConfig.ram) {
      const boardMemoryType = mb.specs?.memoryType;
      const ramType = builderConfig.ram.specs?.type;
      if (boardMemoryType && ramType && boardMemoryType !== ramType) {
        issues.push({
          type: "error",
          title: "Memory type mismatch",
          message: `${builderConfig.ram.name} (${ramType}) does not match ${mb.name} (${boardMemoryType}).`,
          category: "ram",
        });
      } else if (boardMemoryType && ramType) {
        passes.push(`Memory Type Match: ${ramType}`);
      }
    }

    return {
      isCompatible: issues.filter((i) => i.type === "error").length === 0,
      issues,
      passes,
    };
  }, [builderConfig]);

  // Dynamic Component Recommendation Engine (Tailored to Selected CPU & Priorities)
  const getRecommendationsForSlot = useCallback((categoryKey) => {
    const currentCpu = builderConfig.cpu;
    const cpuSocket = currentCpu?.specs?.socket || "AM5";

    const parseMillimeters = (value) =>
      Number.parseFloat(String(value || "").match(/[\d.]+/)?.[0] || 0);
    const currentCaseClearance = parseMillimeters(
      builderConfig.case?.specs?.gpuClearance,
    );
    const currentGpuLength = parseMillimeters(builderConfig.gpu?.specs?.length);
    const currentLoadWithoutSlot = Object.entries(builderConfig)
      .filter(([slot]) => slot !== categoryKey && slot !== "psu")
      .reduce((sum, [, component]) => sum + (component?.wattage || 0), 0);

    const isCompatibleCandidate = (candidate) => {
      if (categoryKey === "motherboard" && currentCpu) {
        const socketMatch = candidate.specs?.socket === cpuSocket;
        const caseFit =
          !builderConfig.case ||
          motherboardFitsCase(candidate, builderConfig.case);
        return socketMatch && caseFit;
      }

      if (categoryKey === "cpu" && builderConfig.motherboard) {
        return (
          candidate.specs?.socket === builderConfig.motherboard.specs?.socket
        );
      }

      if (
        categoryKey === "gpu" &&
        currentCaseClearance &&
        candidate.specs?.length
      ) {
        return parseMillimeters(candidate.specs.length) <= currentCaseClearance;
      }

      if (categoryKey === "case") {
        if (currentGpuLength && candidate.specs?.gpuClearance) {
          const gpuFitsCase =
            currentGpuLength <= parseMillimeters(candidate.specs.gpuClearance);
          if (!gpuFitsCase) return false;
        }

        if (builderConfig.motherboard) {
          return motherboardFitsCase(builderConfig.motherboard, candidate);
        }

        return true;
      }

      if (categoryKey === "cooler" && currentCpu && candidate.specs?.sockets) {
        return candidate.specs.sockets.includes(cpuSocket);
      }

      if (categoryKey === "psu") {
        return currentLoadWithoutSlot <= candidate.wattage * 0.9;
      }

      if (builderConfig.psu && categoryKey !== "psu") {
        return (
          currentLoadWithoutSlot + (candidate.wattage || 0) <=
          builderConfig.psu.wattage * 0.9
        );
      }

      return true;
    };

    let candidates = products
      .filter((p) => p.category !== "fans")
      .filter((p) => p.category === categoryKey)
      .filter(isCompatibleCandidate);

    const requestedWeights = {
      budget: Math.max(0, Number(priorityProfile.budget) || 0),
      performance: Math.max(0, Number(priorityProfile.performance) || 0),
      upgradability: Math.max(0, Number(priorityProfile.upgradability) || 0),
    };
    const weights =
      requestedWeights.budget + requestedWeights.performance + requestedWeights.upgradability > 0
        ? requestedWeights
        : { budget: 1, performance: 1, upgradability: 1 };
    const weightTotal = weights.budget + weights.performance + weights.upgradability;
    const maximumPrice = Math.max(...candidates.map((product) => Number(product.price) || 0), 1);
    const maximumValue = Math.max(
      ...candidates.map((product) =>
        (Number(product.performanceScore) || 0) / Math.max(Number(product.price) || 1, 1),
      ),
      0.001,
    );
    const featureValue = (product) => {
      const rawValue = categoryKey === "psu"
        ? product.wattage
        : categoryKey === "case"
          ? product.specs?.gpuClearance
          : categoryKey === "ram" || categoryKey === "storage"
            ? product.specs?.capacity
            : categoryKey === "gpu"
              ? product.specs?.vram
              : categoryKey === "cpu"
                ? product.specs?.cores
                : categoryKey === "cooler"
                  ? product.specs?.radiator
                  : product.specs?.slots;
      return Number.parseFloat(String(rawValue || "").match(/[\d.]+/)?.[0] || 0);
    };
    const maximumFeature = Math.max(...candidates.map(featureValue), 1);
    const primaryPriority = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] || "performance";
    const priorityLabels = {
      budget: "price efficiency",
      performance: "performance",
      upgradability: "upgrade potential",
    };

    return candidates
      .map((product) => {
        const price = Number(product.price) || maximumPrice;
        const affordabilityScore = Math.max(0, 100 - (price / maximumPrice) * 100);
        const performanceScore = Math.max(
          0,
          Math.min(100, Number(product.performanceScore) || 50),
        );
        const valueScore = Math.min(
          100,
          ((Number(product.performanceScore) || 0) / Math.max(price, 1) / maximumValue) * 100,
        );
        const budgetScore = (affordabilityScore + valueScore) / 2;
        const upgradeScore = Math.min(100, (featureValue(product) / maximumFeature) * 100);
        const score = Math.round(
          (budgetScore * weights.budget +
            performanceScore * weights.performance +
            upgradeScore * weights.upgradability) /
            weightTotal,
        );
        return { ...product, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .map((product, index) => ({
        ...product,
        isRecommendedMatch: index === 0,
        recommendationReason: `${product.recommendationScore}/100 match; prioritizes ${priorityLabels[primaryPriority]}.`,
      }));
  }, [builderConfig, products, priorityProfile]);

  // Future Upgrade Advisor
  const futureUpgradesAdvice = useMemo(() => {
    const numericSpec = (value) =>
      Number.parseFloat(String(value || "").match(/[\d.]+/)?.[0] || 0);
    const upgradeSlots = ["cpu", "gpu", "motherboard", "ram", "storage", "psu", "cooler", "case"];
    return upgradeSlots.flatMap((slot) => {
      const current = builderConfig[slot];
      if (!current) return [];
      const currentCapacity = slot === "psu"
        ? Number(current.wattage) || 0
        : slot === "case"
          ? numericSpec(current.specs?.gpuClearance)
          : slot === "ram" || slot === "storage"
            ? numericSpec(current.specs?.capacity)
            : Number(current.performanceScore) || 0;
      const upgrade = getRecommendationsForSlot(slot).find((candidate) => {
        if (candidate.id === current.id) return false;
        const candidateCapacity = slot === "psu"
          ? Number(candidate.wattage) || 0
          : slot === "case"
            ? numericSpec(candidate.specs?.gpuClearance)
            : slot === "ram" || slot === "storage"
              ? numericSpec(candidate.specs?.capacity)
              : Number(candidate.performanceScore) || 0;
        return candidateCapacity > currentCapacity;
      });
      if (!upgrade) return [];
      const upgradeDetail = slot === "psu"
        ? `${upgrade.wattage}W vs ${current.wattage || 0}W`
        : slot === "case"
          ? `${upgrade.specs?.gpuClearance || "More GPU clearance"} clearance`
          : slot === "ram" || slot === "storage"
            ? `${upgrade.specs?.capacity || "Higher capacity"} capacity`
            : `Performance score ${upgrade.performanceScore || "higher"}`;
      return [{
        slot,
        product: upgrade,
        title: `Upgrade ${slot.toUpperCase()}: ${upgrade.name}`,
        desc: `Compatible alternative to ${current.name}; ${upgradeDetail}.`,
      }];
    });
  }, [builderConfig, getRecommendationsForSlot]);

  // Checkout & Place Order
  const placeOrder = async (orderData) => {
    if (!requireAuth(null, "place orders")) return null;

    const selectedIds = new Set(
      orderData.selectedCartItemIds ?? cart.map((item) => item.id),
    );
    const selectedCartItems = cart.filter((item) => selectedIds.has(item.id));
    if (selectedCartItems.length === 0) {
      showToast("Select items first", "Choose at least one item to check out.", "warning");
      return null;
    }

    const orderId = "NG-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      customer: orderData.name || authUser?.name || "Customer",
      email: orderData.email || authUser?.email,
      total: orderData.total,
      status: "Processing",
      trackingNumber:
        "NG-US-" + Math.floor(100000000 + Math.random() * 900000000),
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
      gcashReference: orderData.gcashReference || "",
      promoCode: orderData.promoCode || "",
      customerPhone: orderData.customerPhone || "",
      shippingAddress: orderData.shippingAddress || "",
      city: orderData.city || "",
      postalCode: orderData.postalCode || "",
      country: orderData.country || "",
      shippingMethod: orderData.shippingMethod || "express",
      shippingCost: orderData.shippingCost || 0,
      tax: orderData.tax || 0,
      items: selectedCartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      })),
    };

    let persistedOrder;
    try {
      persistedOrder = await dataApi.createOrder(authToken, newOrder);
      setOrders((prev) => [persistedOrder, ...prev]);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("promotion has already been used")
      ) {
        throw error;
      }
      showToast("Order could not be saved", error.message, "error");
      return null;
    }
    const remainingCart = cart.filter((item) => !selectedIds.has(item.id));
    setCart(remainingCart);
    setCheckoutItemIds(remainingCart.length ? [] : null);
    persistAccount({ cart: remainingCart });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00d4ff", "#8b5cf6", "#3b82f6", "#10b981"],
      });
    } catch (e) {
      // safe fallback
    }

    showToast(
      "Order Placed Successfully!",
      `Order #${orderId} has been confirmed.`,
      "success",
    );
    return persistedOrder;
  };

  // Admin Mutations
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await dataApi.updateOrderStatus(
        authToken,
        orderId,
        newStatus,
      );
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      showToast(
        "Order Status Updated",
        `Order ${orderId} is now ${newStatus}.`,
        "info",
      );
    } catch (error) {
      showToast("Order update failed", error.message, "warning");
    }
  };

  const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
    try {
      const updatedOrder = await dataApi.updateOrderPaymentStatus(
        authToken,
        orderId,
        paymentStatus,
      );
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      showToast(
        "Payment Status Updated",
        `Order ${orderId} payment is ${paymentStatus.toLowerCase()}.`,
        "success",
      );
    } catch (error) {
      showToast("Payment status update failed", error.message, "warning");
    }
  };

  const replyToReview = async (reviewId, reply) => {
    try {
      const updatedReview = await dataApi.replyToReview(
        authToken,
        reviewId,
        reply,
      );
      setAdminReviews((prev) =>
        prev.map((review) => review.id === reviewId ? updatedReview : review),
      );
      setMyReviews((prev) =>
        prev.map((review) => review.id === reviewId ? updatedReview : review),
      );
      setReviews((prev) =>
        prev.map((review) => review.id === reviewId ? updatedReview : review),
      );
      showToast("Reply published", "Your response is visible with the review.", "success");
    } catch (error) {
      showToast("Reply could not be saved", error.message, "warning");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await dataApi.deleteReview(authToken, reviewId);
      setAdminReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setMyReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      showToast("Review deleted", "The review was removed.", "info");
    } catch (error) {
      showToast("Review could not be deleted", error.message, "warning");
    }
  };

  const toggleUserStatus = async (userId) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) return;
    const nextStatus = currentUser.status === "Active" ? "Suspended" : "Active";
    try {
      const updatedUser = await dataApi.updateUserStatus(
        authToken,
        userId,
        nextStatus,
      );
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user)),
      );
      showToast(
        "Account Status Changed",
        `${currentUser.name} is now ${nextStatus}.`,
        "info",
      );
    } catch (error) {
      showToast("Account update failed", error.message, "warning");
    }
  };

  const deleteUser = async (userId) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) return;

    showConfirmDialog({
      title: "Delete user?",
      message: `Delete user ${currentUser.name || currentUser.email}? This action cannot be undone.`,
      confirmText: "OK",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await dataApi.deleteUser(authToken, userId);
          setUsers((prev) => prev.filter((user) => user.id !== userId));
          showToast("User Deleted", `${currentUser.name || currentUser.email} removed.`, "warning");
        } catch (error) {
          showToast("User could not be deleted", error.message, "warning");
        }
      },
    });
  };

  const addProduct = async (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: (newProduct.category || "comp") + "-" + Date.now(),
      createdAt: new Date().toISOString(),
      isNewArrival: true,
      rating: 0,
      reviewsCount: 0,
      inStock: (newProduct.stock || 1) > 0,
    };
    try {
      const persistedProduct = await dataApi.createProduct(
        authToken,
        productWithId,
      );
      const normalizedProduct = normalizeCatalogProducts([{
        ...persistedProduct,
        createdAt: persistedProduct.createdAt || new Date().toISOString(),
        isNewArrival: persistedProduct.isNewArrival ?? true,
      }])[0];
      setProducts((prev) => [normalizedProduct, ...prev]);
      showToast(
        "New Arrival Live",
        `${normalizedProduct.name} is now on the storefront and marked as new.`,
        "success",
      );
    } catch (error) {
      showToast("Product could not be added", error.message, "warning");
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const updatedProductResponse = await dataApi.updateProduct(
        authToken,
        updatedProduct.id,
        updatedProduct,
      );
      const persistedProduct = normalizeCatalogProducts([updatedProductResponse])[0];
      setProducts((prev) =>
        prev.map((product) =>
          product.id === persistedProduct.id ? persistedProduct : product,
        ),
      );
      showToast(
        "Product Updated",
        `${persistedProduct.name} has been updated.`,
        "success",
      );
    } catch (error) {
      showToast("Product could not be updated", error.message, "warning");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await dataApi.deleteProduct(authToken, productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      showToast("Product Deleted", "Product removed from catalog.", "warning");
    } catch (error) {
      showToast("Product could not be deleted", error.message, "warning");
    }
  };

  const restockProduct = (productId, amount = 10) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    updateProduct({
      ...product,
      stock: (product.stock || 0) + amount,
      inStock: (product.stock || 0) + amount > 0,
    });
    showToast(
      "Stock Replenished",
      `Added +${amount} units to inventory.`,
      "success",
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentPage,
        setCurrentPage,
        adminTab,
        setAdminTab,
        products: productsWithReviewStats,
        prebuilts,
        cart,
        checkoutItemIds,
        setCheckoutItemIds,
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
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        reviews,
        myReviews,
        adminReviews,
        submitReview,
        getProductReviewSummary,
        replyToReview,
        deleteReview,
        users,
        toggleUserStatus,
        deleteUser,
        models3d,
        setModels3d,
        addModelAsset,
        updateModelAsset,
        deleteModelAsset,
        updateProfile,
        refreshProfile,
        connectDiscord,
        disconnectDiscord,
        addAddress,
        addresses,
        toasts,
        showToast,
        removeToast,
        confirmDialog,
        showConfirmDialog,
        hideConfirmDialog,
        requireAuth,
        adminAnalytics,
        setAdminAnalytics,
        authUser,
        authToken,
        requestVerificationCode,
        resetPassword,
        loginUser,
        loginWithGoogle,
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
        updateOrderPaymentStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
