import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import "./AdminDashboard.css";
import { useApp } from "../context/AppContext";
import { CATEGORIES, BRANDS } from "../data/catalogMeta";
import { formatCurrency } from "../utils/currency";
import { buildProductSpecs } from "../utils/productSpecs";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  Cpu,
  Sparkles,
  Box,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Eye,
  Shield,
  X,
  Bell,
} from "lucide-react";
export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    orders,
    updateOrderStatus,
    users,
    toggleUserStatus,
    deleteUser,
    models3d,
    addModelAsset,
    updateModelAsset,
    deleteModelAsset,
    adminAnalytics = {},
    logout,
    setCurrentPage,
    showToast,
  } = useApp();
  const lowStockProducts = useMemo(
    () => products.filter((product) => (product.stock || 0) <= 5),
    [products],
  );

  // Active Admin Sub-page Tab
  const [adminTab, setAdminTab] = useState("dashboard");
  // 'dashboard' | 'products' | 'categories' | 'inventory' | 'compatibility' | 'recommendations' | 'models' | 'orders' | 'users' | 'analytics' | 'settings'

  // Product Modals State
  const [productModalMode, setProductModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

  // New Product Form State
  const [pName, setPName] = useState("");
  const [pBrand, setPBrand] = useState("ASUS ROG");
  const [pCategory, setPCategory] = useState("gpu");
  const [pPrice, setPPrice] = useState(799);
  const [pStock, setPStock] = useState(25);
  const [pImage, setPImage] = useState("");
  const [pScore, setPScore] = useState(92);
  const [pWattage, setPWattage] = useState(300);
  const [pDesc, setPDesc] = useState("");
  const [pSocket, setPSocket] = useState("AM5");
  const [pLength, setPLength] = useState("");
  const [pVram, setPVram] = useState("");
  const [pGpuClearance, setPGpuClearance] = useState("");
  const [pFormFactor, setPFormFactor] = useState("");
  const [pCapacity, setPCapacity] = useState("");
  const [pSpeed, setPSpeed] = useState("");
  const [pInterface, setPInterface] = useState("");
  const [pAirflow, setPAirflow] = useState("");
  const [pSockets, setPSockets] = useState("");
  const [pCores, setPCores] = useState("");
  const [pThreads, setPThreads] = useState("");
  const [pBoostClock, setPBoostClock] = useState("");
  const [pEfficiency, setPEfficiency] = useState("");
  const [pRadiator, setPRadiator] = useState("");
  const [pNoiseLevel, setPNoiseLevel] = useState("");
  const [pDriveSupport, setPDriveSupport] = useState("");
  const [pFanSupport, setPFanSupport] = useState("");
  const [pDimensions, setPDimensions] = useState("");

  const categoriesWithWattage = ["cpu", "gpu", "psu", "cooler", "fans"];

  const categorySpecFields = {
    cpu: [
      { key: "socket", label: "Socket", value: pSocket, setter: setPSocket, placeholder: "AM5" },
      { key: "cores", label: "Cores", value: pCores, setter: setPCores, placeholder: "8" },
      { key: "threads", label: "Threads", value: pThreads, setter: setPThreads, placeholder: "16" },
      { key: "boostClock", label: "Boost Clock", value: pBoostClock, setter: setPBoostClock, placeholder: "5.7GHz" },
    ],
    gpu: [
      { key: "length", label: "GPU Length", value: pLength, setter: setPLength, placeholder: "304mm" },
      { key: "vram", label: "VRAM", value: pVram, setter: setPVram, placeholder: "32GB GDDR7" },
      { key: "tdp", label: "TDP / Power Draw", value: `${pWattage || ""}W`, placeholder: "575W" },
      { key: "boostClock", label: "Boost Clock", value: pBoostClock, setter: setPBoostClock, placeholder: "2.7GHz" },
    ],
    motherboard: [
      { key: "socket", label: "Socket", value: pSocket, setter: setPSocket, placeholder: "AM5" },
      { key: "formFactor", label: "Form Factor", value: pFormFactor, setter: setPFormFactor, placeholder: "ATX" },
      { key: "memoryType", label: "Memory Type", value: pSpeed, setter: setPSpeed, placeholder: "DDR5" },
      { key: "slots", label: "Expansion Slots", value: pCapacity, setter: setPCapacity, placeholder: "4x M.2" },
    ],
    ram: [
      { key: "speed", label: "Memory Speed", value: pSpeed, setter: setPSpeed, placeholder: "DDR5-6000" },
      { key: "capacity", label: "Capacity", value: pCapacity, setter: setPCapacity, placeholder: "32GB" },
      { key: "type", label: "Type", value: pInterface, setter: setPInterface, placeholder: "DDR5" },
      { key: "modules", label: "Modules", value: pFormFactor, setter: setPFormFactor, placeholder: "2x16GB" },
    ],
    storage: [
      { key: "capacity", label: "Capacity", value: pCapacity, setter: setPCapacity, placeholder: "2TB" },
      { key: "interface", label: "Interface", value: pInterface, setter: setPInterface, placeholder: "PCIe 4.0" },
      { key: "type", label: "Drive Type", value: pFormFactor, setter: setPFormFactor, placeholder: "NVMe" },
      { key: "readSpeed", label: "Read Speed", value: pSpeed, setter: setPSpeed, placeholder: "7000 MB/s" },
    ],
    psu: [
      { key: "wattage", label: "Output Wattage", value: pWattage, setter: setPWattage, placeholder: "1000" },
      { key: "efficiency", label: "Efficiency", value: pEfficiency, setter: setPEfficiency, placeholder: "80+ Gold" },
      { key: "modular", label: "Modularity", value: pFormFactor, setter: setPFormFactor, placeholder: "Fully Modular" },
      { key: "formFactor", label: "PSU Form Factor", value: pDimensions, setter: setPDimensions, placeholder: "ATX" },
    ],
    case: [
      { key: "gpuClearance", label: "GPU Clearance", value: pGpuClearance, setter: setPGpuClearance, placeholder: "420mm" },
      { key: "formFactor", label: "Supported Form Factor", value: pFormFactor, setter: setPFormFactor, placeholder: "ATX / Micro-ATX" },
      { key: "dimensions", label: "Dimensions", value: pDimensions, setter: setPDimensions, placeholder: "460 x 230 x 480mm" },
      { key: "fanSupport", label: "Fan Support", value: pFanSupport, setter: setPFanSupport, placeholder: "3 x 120mm" },
    ],
    cooler: [
      { key: "socket", label: "Socket", value: pSocket, setter: setPSocket, placeholder: "AM5" },
      { key: "sockets", label: "Compatible Sockets", value: pSockets, setter: setPSockets, placeholder: "AM5, LGA1700" },
      { key: "radiator", label: "Radiator / Size", value: pRadiator, setter: setPRadiator, placeholder: "360mm" },
      { key: "noiseLevel", label: "Noise Level", value: pNoiseLevel, setter: setPNoiseLevel, placeholder: "32 dBA" },
    ],
    fans: [
      { key: "airflow", label: "Airflow", value: pAirflow, setter: setPAirflow, placeholder: "63.1 CFM" },
      { key: "size", label: "Fan Size", value: pFormFactor, setter: setPFormFactor, placeholder: "120mm" },
      { key: "rpm", label: "RPM", value: pSpeed, setter: setPSpeed, placeholder: "1500 RPM" },
      { key: "noiseLevel", label: "Noise Level", value: pNoiseLevel, setter: setPNoiseLevel, placeholder: "29 dBA" },
    ],
  };

  const visibleCategoryFields = (categorySpecFields[pCategory] || []).filter(
    (field) => {
      if ((field.key === "tdp" || field.key === "wattage") && !categoriesWithWattage.includes(pCategory)) {
        return false;
      }
      return true;
    },
  );

  const resetProductForm = () => {
    setPName("");
    setPBrand("ASUS ROG");
    setPCategory("gpu");
    setPPrice(799);
    setPStock(20);
    setPScore(92);
    setPWattage(280);
    setPImage("");
    setPDesc("High-performance gaming silicon with custom vapor chamber.");
    setPSocket("AM5");
    setPLength("");
    setPVram("");
    setPGpuClearance("");
    setPFormFactor("");
    setPCapacity("");
    setPSpeed("");
    setPInterface("");
    setPAirflow("");
    setPSockets("");
    setPCores("");
    setPThreads("");
    setPBoostClock("");
    setPEfficiency("");
    setPRadiator("");
    setPNoiseLevel("");
    setPDriveSupport("");
    setPFanSupport("");
    setPDimensions("");
  };

  // 3D Model Upload Modal State
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [replaceModelId, setReplaceModelId] = useState(null);
  const [previewModel, setPreviewModel] = useState(null);
  const [modelName, setModelName] = useState("");
  const [modelProductAssign, setModelProductAssign] = useState(
    products[0]?.name || "",
  );
  const [modelFile, setModelFile] = useState(null);

  const closeModelModal = () => {
    setModelModalOpen(false);
    setReplaceModelId(null);
    setModelName("");
    setModelFile(null);
    setModelProductAssign(products[0]?.name || "");
  };

  function PreviewModel({ url }) {
    const { scene } = useGLTF(url);
    return (
      <primitive
        object={scene.clone()}
        scale={0.9}
        position={[0, -0.2, 0]}
      />
    );
  }
  const handleOpenAddProduct = () => {
    resetProductForm();
    setProductModalMode("add");
  };
  const handleOpenEditProduct = (product) => {
    setSelectedProductForEdit(product);
    setPName(product.name);
    setPBrand(product.brand || "ASUS ROG");
    setPCategory(product.category || "gpu");
    setPPrice(product.price);
    setPStock(product.stock || 10);
    setPImage(product.image);
    setPScore(product.performanceScore || 90);
    setPWattage(product.wattage || 150);
    setPDesc(product.description || "");
    setPSocket(product.specs?.socket || "AM5");
    setPLength(product.specs?.length || "");
    setPVram(product.specs?.vram || "");
    setPGpuClearance(product.specs?.gpuClearance || "");
    setPFormFactor(product.specs?.formFactor || "");
    setPCapacity(product.specs?.capacity || "");
    setPSpeed(product.specs?.speed || "");
    setPInterface(product.specs?.interface || "");
    setPAirflow(product.specs?.airflow || "");
    setPSockets(Array.isArray(product.specs?.sockets) ? product.specs.sockets.join(", ") : product.specs?.sockets || "");
    setPCores(product.specs?.cores || "");
    setPThreads(product.specs?.threads || "");
    setPBoostClock(product.specs?.boostClock || "");
    setPEfficiency(product.specs?.efficiency || "");
    setPRadiator(product.specs?.radiator || "");
    setPNoiseLevel(product.specs?.noiseLevel || "");
    setPDriveSupport(product.specs?.driveSupport || "");
    setPFanSupport(product.specs?.fanSupport || "");
    setPDimensions(product.specs?.dimensions || "");
    setProductModalMode("edit");
  };
  const handleProductImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast(
        "Invalid image",
        "Please choose a JPG, PNG, WEBP, or GIF image.",
        "warning",
      );
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(
        "Image is too large",
        "Please choose an image smaller than 5MB.",
        "warning",
      );
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPImage(String(reader.result));
    reader.readAsDataURL(file);
  };
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (productModalMode === "add" && !pImage) {
      showToast(
        "Product image required",
        "Choose an image before creating the SKU.",
        "warning",
      );
      return;
    }

    const specsPayload = buildProductSpecs({
      category: pCategory,
      socket: pSocket,
      sockets: pSockets,
      gpuClearance: pGpuClearance,
      length: pLength,
      vram: pVram,
      capacity: pCapacity,
      speed: pSpeed,
      interface: pInterface,
      airflow: pAirflow,
      formFactor: pFormFactor,
      wattage: Number(pWattage),
      tdp: `${pWattage}W`,
      cores: pCores,
      threads: pThreads,
      boostClock: pBoostClock,
      efficiency: pEfficiency,
      radiator: pRadiator,
      noiseLevel: pNoiseLevel,
      driveSupport: pDriveSupport,
      fanSupport: pFanSupport,
      dimensions: pDimensions,
    });

    const productPayload = {
      name: pName,
      brand: pBrand,
      category: pCategory,
      price: Number(pPrice),
      stock: Number(pStock),
      image: pImage,
      performanceScore: Number(pScore),
      wattage: Number(pWattage),
      description: pDesc,
      specs: specsPayload,
      inStock: Number(pStock) > 0,
    };

    if (productModalMode === "add") {
      addProduct(productPayload);
    } else if (productModalMode === "edit" && selectedProductForEdit) {
      updateProduct({
        ...selectedProductForEdit,
        ...productPayload,
      });
    }
    setProductModalMode(null);
  };
  const handleUpload3DModel = (e) => {
    e.preventDefault();
    if (!modelFile) {
      showToast(
        "3D model file required",
        "Choose a GLB, GLTF, or OBJ file before registering it.",
        "warning",
      );
      return;
    }
    if (modelFile.size > 10 * 1024 * 1024) {
      showToast(
        "3D model is too large",
        "Choose a model file smaller than 10MB.",
        "warning",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const product = products.find((item) => item.name === modelProductAssign);
      const payload = {
        name: modelName || "Custom 3D Chassis Asset",
        productId: product?.id || "unassigned",
        assignedProduct: modelProductAssign,
        url: String(reader.result),
        format:
          modelFile.name.split(".").pop().toUpperCase() === "GLTF"
            ? "GLTF"
            : modelFile.name.split(".").pop().toUpperCase() === "OBJ"
              ? "OBJ"
              : "GLB",
        fileSize: `${(modelFile.size / 1024 / 1024).toFixed(1)} MB`,
        status: "Active",
      };

      const savedModel = replaceModelId
        ? await updateModelAsset(replaceModelId, payload)
        : await addModelAsset(payload);

      if (savedModel) {
        closeModelModal();
      }
    };
    reader.readAsDataURL(modelFile);
  };
  return (
    <div className="admin-dashboard inline-admindashboard-0">
      {/* ==================== ADMIN SIDEBAR (260px) ==================== */}
      <aside className="inline-admindashboard-1">
        {/* Admin Header Branding */}
        <div className="inline-admindashboard-2">
          <div className="inline-admindashboard-3">
            <Shield size={20} />
          </div>
          <div>
            <div className="inline-admindashboard-4">ADMIN MATRIX</div>
            <div className="inline-admindashboard-5">CYBERFORGE ROOT</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="inline-admindashboard-6">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: LayoutDashboard,
            },
            {
              id: "products",
              label: "Products",
              icon: Package,
            },
            {
              id: "categories",
              label: "Categories",
              icon: FolderTree,
            },
            {
              id: "inventory",
              label: "Inventory",
              icon: Boxes,
            },
            {
              id: "compatibility",
              label: "Compatibility UI",
              icon: Cpu,
            },
            {
              id: "recommendations",
              label: "Recommendations UI",
              icon: Sparkles,
            },
            {
              id: "models",
              label: "3D Models",
              icon: Box,
            },
            {
              id: "orders",
              label: "Orders",
              icon: ShoppingCart,
            },
            {
              id: "users",
              label: "Users",
              icon: Users,
            },
            {
              id: "analytics",
              label: "Analytics",
              icon: BarChart3,
            },
            {
              id: "settings",
              label: "Settings",
              icon: Settings,
            },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSelected = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isSelected ? 700 : 500,
                  textAlign: "left",
                  background: isSelected
                    ? "rgba(157, 78, 221, 0.2)"
                    : "transparent",
                  color: isSelected ? "#c084fc" : "var(--text-secondary)",
                  border: isSelected
                    ? "1px solid rgba(157, 78, 221, 0.4)"
                    : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <IconComp size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Exit & Return to Storefront */}
        <div className="inline-admindashboard-7">
          <button
            onClick={() => {
              setCurrentPage("home");
            }}
            className="btn btn-secondary btn-sm inline-admindashboard-8"
          >
            ← View Storefront
          </button>
          <button
            onClick={() => logout()}
            className="btn btn-danger btn-sm inline-admindashboard-9"
          >
            <LogOut size={13} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* ==================== ADMIN MAIN CONTENT AREA ==================== */}
      <main className="inline-admindashboard-10">
        {/* ==================== 1. DASHBOARD OVERVIEW ==================== */}
        {adminTab === "dashboard" && (
          <div>
            {/* Top Title & Quick Actions */}
            <div className="flex-between inline-admindashboard-11">
              <div>
                <h1 className="inline-admindashboard-12">
                  Admin Telemetry Overview
                </h1>
                <p className="inline-admindashboard-13">
                  Live retail throughput, order fulfillment queues, and hardware
                  inventory telemetry.
                </p>
              </div>

              <div className="inline-admindashboard-14">
                <button
                  onClick={handleOpenAddProduct}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </div>

            {/* 5 Stat KPI Cards */}
            <div className="inline-admindashboard-15">
              <div className="cyber-card-static inline-admindashboard-16">
                <div className="inline-admindashboard-17">Total Sales</div>
                <div className="inline-admindashboard-18">
                  {formatCurrency(adminAnalytics.totalSales || 0, 0)}
                </div>
                <div className="inline-admindashboard-19">
                  {adminAnalytics.salesGrowth || "+0.0%"} vs last mo
                </div>
              </div>

              <div className="cyber-card-static inline-admindashboard-20">
                <div className="inline-admindashboard-21">Total Orders</div>
                <div className="inline-admindashboard-22">
                  {(adminAnalytics.totalOrders || 0).toLocaleString()}
                </div>
                <div className="inline-admindashboard-23">
                  {adminAnalytics.ordersGrowth || "+0.0%"} volume
                </div>
              </div>

              <div className="cyber-card-static inline-admindashboard-24">
                <div className="inline-admindashboard-25">Total Products</div>
                <div className="inline-admindashboard-26">
                  {adminAnalytics.totalProducts || products.length}
                </div>
                <div className="inline-admindashboard-27">
                  Across {new Set(products.map((p) => p.category)).size || 0} categories
                </div>
              </div>

              <div className="cyber-card-static inline-admindashboard-28">
                <div className="inline-admindashboard-29">Low Stock Alert</div>
                <div className="inline-admindashboard-30">
                  {(adminAnalytics.lowStockCount ?? lowStockProducts.length)} Items
                </div>
                <div className="inline-admindashboard-31">
                  Immediate reorder needed
                </div>
              </div>

              <div className="cyber-card-static inline-admindashboard-32">
                <div className="inline-admindashboard-33">Active Customers</div>
                <div className="inline-admindashboard-34">
                  {(adminAnalytics.activeCustomers || 0).toLocaleString()}
                </div>
                <div className="inline-admindashboard-35">
                  Registered accounts
                </div>
              </div>
            </div>

            <div className="admin-stock-notification">
              <div className="admin-stock-notification__header">
                <div><Bell size={17} /><strong>Live Inventory Notifications</strong></div>
                <span className={lowStockProducts.length ? "badge badge-amber" : "badge badge-green"}>
                  {lowStockProducts.length ? `${lowStockProducts.length} NEED ATTENTION` : "INVENTORY HEALTHY"}
                </span>
              </div>
              {lowStockProducts.length ? <div className="admin-stock-notification__list">
                {lowStockProducts.slice(0, 5).map((product) => <div key={product.id}>
                  <span>{product.name}</span><strong>{product.stock || 0} left</strong>
                </div>)}
              </div> : <p>MongoDB inventory is above the low-stock threshold for every product.</p>}
            </div>

            {/* Charts & Graphs Row: Left Monthly Revenue Bars, Right Category Breakdown */}
            <div className="inline-admindashboard-36">
              {/* Sales Chart */}
              <div className="cyber-card-static inline-admindashboard-37">
                <div className="flex-between inline-admindashboard-38">
                  <h3 className="inline-admindashboard-39">
                    Monthly Revenue Growth (2026)
                  </h3>
                  <span className="badge badge-cyan inline-admindashboard-40">
                    AVG +18.4% MOM
                  </span>
                </div>

                {/* SVG/CSS Bar Graph */}
                <div className="inline-admindashboard-41">
                  {(adminAnalytics.monthlySales?.length ? adminAnalytics.monthlySales : [{ month: "No data", sales: 0, orders: 0 }]).map((item) => {
                    const maxSales = Math.max(...(adminAnalytics.monthlySales?.map((entry) => Number(entry.sales) || 0) || [1]), 1);
                    const heightPercent = maxSales > 0 ? (Number(item.sales || 0) / maxSales) * 100 : 0;
                    return (
                      <div
                        key={item.month}
                        className="inline-admindashboard-42"
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${heightPercent || 6}%`,
                            background:
                              "linear-gradient(180deg, #00f0ff 0%, #3b82f6 100%)",
                            borderRadius: "4px 4px 0 0",
                            boxShadow: "0 0 10px rgba(0, 240, 255, 0.3)",
                            transition: "height 0.4s ease",
                          }}
                          title={`${formatCurrency(item.sales || 0, 0)} (${item.orders || 0} orders)`}
                        />
                        <span className="inline-admindashboard-43">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="cyber-card-static inline-admindashboard-44">
                <h3 className="inline-admindashboard-45">
                  Revenue by Hardware Sector
                </h3>
                <div className="inline-admindashboard-46">
                  {(adminAnalytics.categoryBreakdown?.length ? adminAnalytics.categoryBreakdown : [{ category: "No data", percentage: 100, color: "#00f0ff" }]).map((cat) => (
                    <div key={cat.category}>
                      <div className="flex-between inline-admindashboard-47">
                        <span className="inline-admindashboard-48">
                          {cat.category}
                        </span>
                        <strong
                          style={{
                            color: cat.color,
                          }}
                        >
                          {cat.percentage}%
                        </strong>
                      </div>
                      <div className="inline-admindashboard-49">
                        <div
                          style={{
                            height: "100%",
                            width: `${cat.percentage}%`,
                            background: cat.color,
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders & Low Stock Quick Alert Tables */}
            <div className="inline-admindashboard-50">
              {/* Recent Orders */}
              <div className="cyber-card-static inline-admindashboard-51">
                <div className="flex-between inline-admindashboard-52">
                  <h3 className="inline-admindashboard-53">
                    Recent Laboratory Orders
                  </h3>
                  <button
                    onClick={() => setAdminTab("orders")}
                    className="btn btn-secondary btn-sm inline-admindashboard-54"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="inline-admindashboard-55">
                  {orders.slice(0, 4).map((o) => (
                    <div
                      key={o.id}
                      className="flex-between inline-admindashboard-56"
                    >
                      <div>
                        <strong className="inline-admindashboard-57">
                          #{o.id}
                        </strong>{" "}
                        • {o.customer}
                        <div className="inline-admindashboard-58">{o.date}</div>
                      </div>
                      <div className="inline-admindashboard-59">
                        <div className="inline-admindashboard-60">
                          {formatCurrency(o.total, 0)}
                        </div>
                        <span className="badge badge-cyan inline-admindashboard-61">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="cyber-card-static inline-admindashboard-62">
                <div className="flex-between inline-admindashboard-63">
                  <h3 className="inline-admindashboard-64">
                    Critical Stock Alerts
                  </h3>
                  <button
                    onClick={() => setAdminTab("inventory")}
                    className="btn btn-secondary btn-sm inline-admindashboard-65"
                  >
                    Manage Stock
                  </button>
                </div>

                <div className="inline-admindashboard-66">
                  {products
                    .filter((p) => (p.stock || 0) <= 8)
                    .slice(0, 4)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex-between inline-admindashboard-67"
                      >
                        <div>
                          <div className="inline-admindashboard-68">
                            {p.name}
                          </div>
                          <div className="inline-admindashboard-69">
                            Only {p.stock} units remaining
                          </div>
                        </div>
                        <button
                          onClick={() => restockProduct(p.id, 10)}
                          className="btn btn-primary btn-sm inline-admindashboard-70"
                        >
                          +10 Restock
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. ADMIN PRODUCTS CRUD ==================== */}
        {adminTab === "products" && (
          <div>
            <div className="flex-between inline-admindashboard-71">
              <div>
                <h1 className="inline-admindashboard-72">
                  Products Catalog Management
                </h1>
                <p className="inline-admindashboard-73">
                  Add new hardware SKUs, edit specifications, modify pricing,
                  and delete obsolete entries.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="btn btn-primary"
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="cyber-card-static inline-admindashboard-74">
              <table className="inline-admindashboard-75">
                <thead>
                  <tr className="inline-admindashboard-76">
                    <th className="inline-admindashboard-77">Product</th>
                    <th className="inline-admindashboard-78">Category</th>
                    <th className="inline-admindashboard-79">Brand</th>
                    <th className="inline-admindashboard-80">Price</th>
                    <th className="inline-admindashboard-81">Stock</th>
                    <th className="inline-admindashboard-82">Bench Score</th>
                    <th className="inline-admindashboard-83">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="inline-admindashboard-84">
                      <td className="inline-admindashboard-85">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="inline-admindashboard-86"
                        />
                        <strong className="inline-admindashboard-87">
                          {p.name}
                        </strong>
                      </td>
                      <td className="inline-admindashboard-88">{p.category}</td>
                      <td className="inline-admindashboard-89">{p.brand}</td>
                      <td className="inline-admindashboard-90">
                        {formatCurrency(p.price, 0)}
                      </td>
                      <td className="inline-admindashboard-91">
                        <span
                          className={`badge ${p.stock <= 5 ? "badge-amber" : "badge-green"}`}
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          {p.stock} Units
                        </span>
                      </td>
                      <td className="inline-admindashboard-93">
                        {p.performanceScore}/100
                      </td>
                      <td className="inline-admindashboard-94">
                        <div className="inline-admindashboard-95">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="btn btn-secondary btn-sm inline-admindashboard-96"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="btn btn-danger btn-sm inline-admindashboard-97"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 3. ADMIN CATEGORIES ==================== */}
        {adminTab === "categories" && (
          <div>
            <h1 className="inline-admindashboard-98">Hardware Categories</h1>
            <p className="inline-admindashboard-99">
              Manage active product taxonomy, slot definitions, and
              compatibility matrices.
            </p>

            <div className="grid-cols-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="cyber-card-static inline-admindashboard-100"
                >
                  <div className="flex-between inline-admindashboard-101">
                    <h3 className="inline-admindashboard-102">{cat.name}</h3>
                    <span className="badge badge-cyan">{cat.short}</span>
                  </div>
                  <div className="inline-admindashboard-103">
                    Active Hardware Items:{" "}
                    <strong>
                      {products.filter((p) => p.category === cat.id).length}{" "}
                      Products
                    </strong>
                  </div>
                  <button
                    onClick={() => setAdminTab("products")}
                    className="btn btn-secondary btn-sm inline-admindashboard-104"
                  >
                    Manage Category SKUs
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. ADMIN INVENTORY ==================== */}
        {adminTab === "inventory" && (
          <div>
            <div className="flex-between inline-admindashboard-105">
              <div>
                <h1 className="inline-admindashboard-106">
                  Warehouse Inventory Controls
                </h1>
                <p className="inline-admindashboard-107">
                  Monitor stock thresholds, restock critical components, and
                  view out-of-stock items.
                </p>
              </div>
            </div>

            <div className="cyber-card-static inline-admindashboard-108">
              <table className="inline-admindashboard-109">
                <thead>
                  <tr className="inline-admindashboard-110">
                    <th className="inline-admindashboard-111">Product</th>
                    <th className="inline-admindashboard-112">SKU</th>
                    <th className="inline-admindashboard-113">Stock Level</th>
                    <th className="inline-admindashboard-114">Stock Status</th>
                    <th className="inline-admindashboard-115">Unit Value</th>
                    <th className="inline-admindashboard-116">
                      Restock Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="inline-admindashboard-117">
                      <td className="inline-admindashboard-118">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="inline-admindashboard-119"
                        />
                        <strong className="inline-admindashboard-120">
                          {p.name}
                        </strong>
                      </td>
                      <td className="inline-admindashboard-121">
                        CF-{p.id.toUpperCase()}
                      </td>
                      <td className="inline-admindashboard-122">
                        {p.stock} units
                      </td>
                      <td className="inline-admindashboard-123">
                        {p.stock === 0 ? (
                          <span className="badge badge-red">Out of Stock</span>
                        ) : p.stock <= 5 ? (
                          <span className="badge badge-amber">
                            Low Stock ({p.stock})
                          </span>
                        ) : (
                          <span className="badge badge-green">
                            Healthy ({p.stock})
                          </span>
                        )}
                      </td>
                      <td className="inline-admindashboard-124">
                        {formatCurrency(p.price, 0)}
                      </td>
                      <td className="inline-admindashboard-125">
                        <button
                          onClick={() => restockProduct(p.id, 10)}
                          className="btn btn-primary btn-sm inline-admindashboard-126"
                        >
                          +10 Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 5. ADMIN ORDERS MANAGEMENT ==================== */}
        {adminTab === "orders" && (
          <div>
            <div className="flex-between inline-admindashboard-127">
              <div>
                <h1 className="inline-admindashboard-128">
                  Orders & Fulfillment Manager
                </h1>
                <p className="inline-admindashboard-129">
                  Change fulfillment status, assign carrier tracking, and audit
                  payment methods.
                </p>
              </div>
            </div>

            <div className="cyber-card-static inline-admindashboard-130">
              <table className="inline-admindashboard-131">
                <thead>
                  <tr className="inline-admindashboard-132">
                    <th className="inline-admindashboard-133">Order ID</th>
                    <th className="inline-admindashboard-134">Customer</th>
                    <th className="inline-admindashboard-135">Date</th>
                    <th className="inline-admindashboard-136">Items</th>
                    <th className="inline-admindashboard-137">Total</th>
                    <th className="inline-admindashboard-138">Payment</th>
                    <th className="inline-admindashboard-139">
                      Current Status
                    </th>
                    <th className="inline-admindashboard-140">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="inline-admindashboard-141">
                      <td className="inline-admindashboard-142">#{o.id}</td>
                      <td className="inline-admindashboard-143">
                        <div>{o.customer}</div>
                        <div className="inline-admindashboard-144">
                          {o.email}
                        </div>
                      </td>
                      <td className="inline-admindashboard-145">{o.date}</td>
                      <td className="inline-admindashboard-146">
                        {o.items?.length || 1} items
                      </td>
                      <td className="inline-admindashboard-147">
                        {formatCurrency(o.total, 0)}
                      </td>
                      <td className="inline-admindashboard-148">
                        {o.paymentMethod}
                      </td>
                      <td className="inline-admindashboard-149">
                        <span
                          className={`badge ${o.status === "Completed" ? "badge-green" : o.status === "Shipped" ? "badge-cyan" : o.status === "Processing" ? "badge-purple" : "badge-amber"}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="inline-admindashboard-150">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            updateOrderStatus(o.id, e.target.value)
                          }
                          className="form-control inline-admindashboard-151"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 6. ADMIN USERS DIRECTORY ==================== */}
        {adminTab === "users" && (
          <div>
            <h1 className="inline-admindashboard-152">
              User Accounts & Pilots
            </h1>
            <p className="inline-admindashboard-153">
              Inspect customer lifetime spend, rank tiers, and manage account
              statuses.
            </p>

            <div className="cyber-card-static inline-admindashboard-154">
              <table className="inline-admindashboard-155">
                <thead>
                  <tr className="inline-admindashboard-156">
                    <th className="inline-admindashboard-157">Customer Name</th>
                    <th className="inline-admindashboard-158">Email</th>
                    <th className="inline-admindashboard-159">Total Orders</th>
                    <th className="inline-admindashboard-160">
                      Lifetime Spend
                    </th>
                    <th className="inline-admindashboard-161">Gamer Tier</th>
                    <th className="inline-admindashboard-162">
                      Account Status
                    </th>
                    <th className="inline-admindashboard-163">Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="inline-admindashboard-164">
                      <td className="inline-admindashboard-165">{u.name}</td>
                      <td className="inline-admindashboard-166">{u.email}</td>
                      <td className="inline-admindashboard-167">
                        {u.ordersCount} Orders
                      </td>
                      <td className="inline-admindashboard-168">
                        {formatCurrency(u.totalSpent, 0)}
                      </td>
                      <td className="inline-admindashboard-169">
                        <span className="badge badge-purple inline-admindashboard-170">
                          {u.tier}
                        </span>
                      </td>
                      <td className="inline-admindashboard-171">
                        <span
                          className={`badge ${u.status === "Active" ? "badge-green" : "badge-red"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="inline-admindashboard-172" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`btn ${u.status === "Active" ? "btn-danger" : "btn-primary"} btn-sm`}
                          style={{
                            padding: "4px 10px",
                            fontSize: "11px",
                          }}
                        >
                          {u.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderColor: "rgba(248, 113, 113, 0.5)",
                            color: "#fecaca",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 7. ADMIN 3D MODELS HUB ==================== */}
        {adminTab === "models" && (
          <div>
            <div className="flex-between inline-admindashboard-174">
              <div>
                <h1 className="inline-admindashboard-175">
                  3D Model Asset Matrix
                </h1>
                <p className="inline-admindashboard-176">
                  Upload GLB/GLTF assets, inspect polygon counts, and assign 3D
                  geometry to PC Builder slots.
                </p>
              </div>

              <button
                onClick={() => {
                  setReplaceModelId(null);
                  setModelName("");
                  setModelProductAssign(products[0]?.name || "");
                  setModelModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Upload size={16} /> Upload 3D Asset (GLB)
              </button>
            </div>

            <div className="grid-cols-2 inline-admindashboard-177">
              {models3d.map((model, index) => (
                <div
                  key={model._id || model.id || `${model.name || "model"}-${index}`}
                  className="cyber-card-static inline-admindashboard-178"
                >
                  <div className="inline-admindashboard-179">
                    <img
                      src={model.thumbnail}
                      alt={model.name}
                      className="inline-admindashboard-180"
                    />
                    <div className="inline-admindashboard-181">
                      <div className="flex-between">
                        <span className="badge badge-cyan inline-admindashboard-182">
                          {model.format}
                        </span>
                        <span className="inline-admindashboard-183">
                          {model.fileSize}
                        </span>
                      </div>
                      <h4 className="inline-admindashboard-184">
                        {model.name}
                      </h4>
                      <div className="inline-admindashboard-185">
                        Assigned To:{" "}
                        <strong className="inline-admindashboard-186">
                          {model.assignedProduct}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="inline-admindashboard-187">
                    Geometry: {model.polygonCount} • PBR Materials Active
                  </div>

                  <div className="inline-admindashboard-188">
                    <button
                      onClick={() => setPreviewModel(model)}
                      className="btn btn-secondary btn-sm inline-admindashboard-189"
                    >
                      <Eye size={13} /> Preview 3D Wireframe
                    </button>
                    <button
                      onClick={() => {
                        setReplaceModelId(model.id || model._id);
                        setModelName(model.name);
                        setModelProductAssign(model.assignedProduct || products[0]?.name || "");
                        setModelModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => {
                        const id = model._id || model.id;
                        if (!id) return;
                        if (window.confirm(`Delete 3D model "${model.name}"?`)) {
                          deleteModelAsset(id);
                        }
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 8. ADMIN ANALYTICS HUB ==================== */}
        {adminTab === "analytics" && (
          <div>
            <h1 className="inline-admindashboard-190">
              Retail Telemetry & Analytics
            </h1>
            <p className="inline-admindashboard-191">
              Live performance trends from MongoDB-backed sales and inventory data.
            </p>

            <div className="grid-cols-2 inline-admindashboard-192">
              <div className="cyber-card-static inline-admindashboard-193">
                <h3 className="inline-admindashboard-194">Revenue Trend</h3>
                <div style={{ display: "flex", alignItems: "end", gap: "12px", height: "180px", marginTop: "18px" }}>
                  {(adminAnalytics.monthlySales?.length ? adminAnalytics.monthlySales : [{ month: "No data", sales: 0, orders: 0 }]).map((entry) => {
                    const maxSales = Math.max(...(adminAnalytics.monthlySales?.map((item) => Number(item.sales) || 0) || [1]), 1);
                    const height = Math.max(12, ((Number(entry.sales) || 0) / maxSales) * 100);
                    return (
                      <div key={entry.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "100%", display: "flex", alignItems: "end", justifyContent: "center", height: "140px" }}>
                          <div
                            title={`${formatCurrency(Number(entry.sales) || 0, 0)} (${entry.orders || 0} orders)`}
                            style={{
                              width: "100%",
                              maxWidth: "40px",
                              height: `${height}%`,
                              borderRadius: "8px 8px 0 0",
                              background: "linear-gradient(180deg, #00f0ff 0%, #3b82f6 100%)",
                              boxShadow: "0 0 18px rgba(0, 240, 255, 0.28)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{entry.month}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="cyber-card-static inline-admindashboard-200">
                <h3 className="inline-admindashboard-201">Category Share</h3>
                <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
                  {(adminAnalytics.categoryBreakdown?.length ? adminAnalytics.categoryBreakdown : [{ category: "No data", percentage: 100, color: "#00f0ff" }]).map((item) => (
                    <div key={item.category}>
                      <div className="flex-between" style={{ marginBottom: "6px" }}>
                        <span>{item.category}</span>
                        <strong style={{ color: item.color }}>{item.percentage}%</strong>
                      </div>
                      <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${item.percentage}%`, height: "100%", background: item.color, borderRadius: "999px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-cols-3 inline-admindashboard-192" style={{ marginTop: "18px" }}>
              <div className="cyber-card-static inline-admindashboard-207">
                <h3 className="inline-admindashboard-208">Total Sales</h3>
                <div className="inline-admindashboard-209">{formatCurrency(adminAnalytics.totalSales || 0, 0)}</div>
                <div className="inline-admindashboard-210">{adminAnalytics.salesGrowth || "+0.0%"} vs last month</div>
              </div>

              <div className="cyber-card-static inline-admindashboard-207">
                <h3 className="inline-admindashboard-208">Total Orders</h3>
                <div className="inline-admindashboard-209">{(adminAnalytics.totalOrders || 0).toLocaleString()}</div>
                <div className="inline-admindashboard-210">{adminAnalytics.ordersGrowth || "+0.0%"} volume</div>
              </div>

              <div className="cyber-card-static inline-admindashboard-207">
                <h3 className="inline-admindashboard-208">Active Customers</h3>
                <div className="inline-admindashboard-209">{(adminAnalytics.activeCustomers || 0).toLocaleString()}</div>
                <div className="inline-admindashboard-210">Registered and active user base</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 9. ADMIN COMPATIBILITY RULES UI ==================== */}
        {adminTab === "compatibility" && (
          <div>
            <h1 className="inline-admindashboard-211">
              Compatibility Engine Matrix
            </h1>
            <p className="inline-admindashboard-212">
              Define socket clearance rules, GPU length constraints, and PSU
              wattage safety factors.
            </p>

            <div className="inline-admindashboard-213">
              {[
                {
                  rule: "Socket AM5 Verification",
                  desc: "Validates AMD Ryzen 7000/9000 against X670E, B650, and X870 motherboards.",
                  status: "Active",
                },
                {
                  rule: "LGA1851 / LGA1700 Check",
                  desc: "Ensures Arrow Lake & Raptor Lake coolers and mounts align precisely.",
                  status: "Active",
                },
                {
                  rule: "ATX 3.0 12V-2x6 Power Overhead Rule",
                  desc: "Calculates +20% overhead margin for RTX 5090 600W transient spikes.",
                  status: "Active",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="cyber-card-static inline-admindashboard-214"
                >
                  <div>
                    <div className="inline-admindashboard-215">{item.rule}</div>
                    <div className="inline-admindashboard-216">{item.desc}</div>
                  </div>
                  <span className="badge badge-green">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 10. ADMIN RECOMMENDATIONS UI ==================== */}
        {adminTab === "recommendations" && (
          <div>
            <h1 className="inline-admindashboard-217">
              AI Component Recommendations
            </h1>
            <p className="inline-admindashboard-218">
              Configure smart upsell pairings and bottleneck prevention
              triggers.
            </p>

            <div className="cyber-card-static inline-admindashboard-219">
              <h3 className="inline-admindashboard-220">
                Active Recommendation Triggers
              </h3>
              <ul className="inline-admindashboard-221">
                <li>
                  ⚡ <strong>When RTX 5090 Selected:</strong> Recommend 1200W
                  Titanium PSU + 360mm AIO Liquid Cooler.
                </li>
                <li>
                  ⚡ <strong>When Ryzen 7 7800X3D Selected:</strong> Recommend
                  32GB DDR5-6000 CL30 Low-Latency Memory.
                </li>
                <li>
                  ⚡ <strong>When Dual-Chamber Chassis Selected:</strong>{" "}
                  Recommend 3-Pack Interlocking Infinity Mirror Fans.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== 11. ADMIN SETTINGS ==================== */}
        {adminTab === "settings" && (
          <div>
            <h1 className="inline-admindashboard-222">
              Admin Environment Settings
            </h1>
            <p className="inline-admindashboard-223">
              Store currency, tax rates, test API webhooks, and security access
              policies.
            </p>

            <div className="cyber-card-static inline-admindashboard-224">
              <div className="form-group">
                <label className="form-label">Store Currency</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="PHP (₱)"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Default Tax Rate</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="7.5%"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Cleanroom Build Queue Status
                </label>
                <select className="form-control">
                  <option>Normal (24-Hour Dispatch)</option>
                  <option>High Surge (48-Hour Dispatch)</option>
                </select>
              </div>

              <button
                onClick={() =>
                  showToast(
                    "Settings Saved",
                    "Global store configuration updated.",
                    "success",
                  )
                }
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==================== ADD / EDIT PRODUCT MODAL ==================== */}
      {productModalMode && (
        <div
          className="modal-overlay"
          onClick={() => setProductModalMode(null)}
        >
          <div
            className="modal-content modal-content-lg inline-admindashboard-225"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-admindashboard-226">
              <h3 className="inline-admindashboard-227">
                {productModalMode === "add"
                  ? "Add New Hardware SKU"
                  : "Edit Product Specifications"}
              </h3>
              <button
                onClick={() => setProductModalMode(null)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="grid-cols-2 inline-admindashboard-228">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. GeForce RTX 5080 Super 16GB"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manufacturer Brand</label>
                  <select
                    className="form-control"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Retail Price (PHP)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock Count</label>
                  <input
                    type="number"
                    className="form-control"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Performance Benchmark Score (1-100)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={pScore}
                    onChange={(e) => setPScore(e.target.value)}
                  />
                </div>

                {categoriesWithWattage.includes(pCategory) && (
                  <div className="form-group">
                    <label className="form-label">Wattage (W)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pWattage}
                      onChange={(e) => setPWattage(e.target.value)}
                      placeholder="575"
                    />
                  </div>
                )}

                {visibleCategoryFields.map((field) => (
                  <div key={field.key} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={field.value ?? ""}
                      onChange={(e) => field.setter?.(e.target.value)}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                <label className="admin-image-upload">
                  <Upload size={20} />
                  <span>
                    {pImage ? "Replace product image" : "Choose product image"}
                  </span>
                  <small>JPG, PNG, WEBP, or GIF • max 5MB</small>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleProductImageChange}
                  />
                </label>
                {pImage && (
                  <div className="admin-image-preview">
                    <img src={pImage} alt="Product preview" />
                    <span>Preview</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Description & Architecture Notes
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                />
              </div>

              <div className="inline-admindashboard-229">
                <button
                  type="button"
                  onClick={() => setProductModalMode(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {productModalMode === "add" ? "Create SKU" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 3D MODEL PREVIEW MODAL ==================== */}
      {previewModel && (
        <div className="modal-overlay" onClick={() => setPreviewModel(null)}>
          <div
            className="modal-content inline-admindashboard-230"
            style={{ maxWidth: "900px", height: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-admindashboard-231">
              <h3 className="inline-admindashboard-232">
                {previewModel.name}
              </h3>
              <button
                onClick={() => setPreviewModel(null)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ width: "100%", height: "470px", marginTop: "12px" }}>
              <Canvas camera={{ position: [2.5, 1.6, 3.2], fov: 35 }}>
                <ambientLight intensity={1.3} />
                <directionalLight position={[4, 5, 3]} intensity={1.8} />
                <group rotation={[0.2, -0.8, 0]}>
                  <PreviewModel url={previewModel.url} />
                </group>
                <gridHelper args={[8, 16, "#1dd3f8", "#123143"]} position={[0, -1.1, 0]} />
                <Environment preset="city" />
                <OrbitControls enablePan={false} minDistance={1.5} maxDistance={8} />
              </Canvas>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3D MODEL UPLOAD MODAL ==================== */}
      {modelModalOpen && (
        <div className="modal-overlay" onClick={() => setModelModalOpen(false)}>
          <div
            className="modal-content inline-admindashboard-230"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-admindashboard-231">
              <h3 className="inline-admindashboard-232">
                Upload 3D Asset (GLB/GLTF)
              </h3>
              <button
                onClick={closeModelModal}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpload3DModel}>
              <div className="form-group">
                <label className="form-label">Asset Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Lian Li O11 Vision Chassis GLB"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign to Product SKU</label>
                <select
                  className="form-control"
                  value={modelProductAssign}
                  onChange={(e) => setModelProductAssign(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">3D Model File</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".glb,.gltf,.obj,model/gltf-binary,model/gltf+json,model/obj"
                  onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                  required
                />
                <small className="form-hint">
                  Files are stored as model assets in MongoDB. Keep files under
                  10MB.
                </small>
              </div>

              <div className="inline-admindashboard-233">
                <Upload
                  size={32}
                  color="var(--neon-cyan)"
                  className="inline-admindashboard-234"
                />
                <div className="inline-admindashboard-235">
                  Drag & Drop GLB, GLTF, or OBJ 3D Model Here
                </div>
                <div className="inline-admindashboard-236">
                  Maximum 50MB with embedded PBR textures.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary inline-admindashboard-237"
              >
                {replaceModelId ? "Replace 3D Model Asset" : "Register 3D Model Asset"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
