import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { formatCurrency } from "../utils/currency";
import { isNewArrivalProduct } from "../utils/productUtils";
import PCAssemblyScene from "../components/PCAssemblyScene";
import {
  Wrench,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  Cpu,
  Monitor,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
export default function HomePage() {
  const {
    prebuilts,
    products,
    builderConfig,
    models3d,
    setCurrentPage,
    setSelectedCategoryFilter,
  } = useApp();
  const [activeTab, setActiveTab] = useState("bestsellers"); // 'bestsellers' | 'newarrivals' | 'popular'

  // Countdown timer for Flash Sale
  const [saleEndsAt, setSaleEndsAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [saleActive, setSaleActive] = useState(false);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000/api"}/promotions/CYBER2026`)
      .then((response) => response.json())
      .then((promotion) => {
        setSaleEndsAt(new Date(promotion.endsAt).getTime());
        setSaleActive(promotion.active);
      })
      .catch(() => setSaleActive(false));
  }, []);
  useEffect(() => {
    if (!saleEndsAt) return undefined;
    const timer = setInterval(() => {
      const remaining = Math.max(0, saleEndsAt - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      setTimeLeft({ hours: Math.floor(totalSeconds / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 });
      if (remaining === 0) setSaleActive(false);
    }, 1000);
    return () => clearInterval(timer);
  }, [saleEndsAt]);
  const popularCpus = products.filter(
    (p) => p.category === "cpu" && p.isPopular,
  );
  const popularGpus = products.filter(
    (p) => p.category === "gpu" && p.isPopular,
  );
  const featuredComponents = products.filter((p) => p.featured);
  const bestSellers = products.filter((product) =>
    product.isPopular || product.rating >= 4.8 || product.performanceScore >= 90,
  );
  const newArrivals = products.filter((product) => isNewArrivalProduct(product));
  const visibleFeaturedComponents =
    activeTab === "bestsellers"
      ? bestSellers.length > 0
        ? bestSellers
        : featuredComponents
      : activeTab === "newarrivals"
        ? newArrivals.length > 0
          ? newArrivals
          : featuredComponents
        : featuredComponents;
  return (
    <div className="home-page inline-homepage-0">
      {/* ==================== HERO SECTION ==================== */}
      <section className="inline-homepage-1">
        {/* Ambient Neon Blobs */}
        <div className="inline-homepage-2" />
        <div className="inline-homepage-3" />

        <div className="container-wide">
          <div className="inline-homepage-4">
            {/* Left Content */}
            <div className="inline-homepage-5">
              <div className="inline-homepage-6">
                <Sparkles size={14} color="var(--accent-cyan)" />
                <span className="inline-homepage-7">
                  NEXT GEAR GAMING PC STORE
                </span>
              </div>

              <h1 className="inline-homepage-8">
                BUILD YOUR <br />
                <span className="inline-homepage-9">DREAM GAMING PC</span>
              </h1>

              <p className="inline-homepage-10">
                Create a PC that fits your needs and budget. Choose your
                components, check compatibility, compare performance, and
                customize your build with confidence. Shop pre-built gaming PCs
                or design your own in our interactive 3D builder. Pick every
                part, check compatibility instantly, and see your rig come to
                life before you buy.
              </p>

              {/* CTAs */}
              <div className="inline-homepage-11">
                <button
                  onClick={() => setCurrentPage("builder")}
                  className="btn btn-primary btn-lg inline-homepage-12"
                >
                  <Wrench size={18} />
                  <span>Build Your Custom PC</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setCurrentPage("components")}
                  className="btn btn-secondary btn-lg"
                >
                  <SlidersHorizontal size={18} />
                  <span>Explore Components</span>
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="inline-homepage-13">
                <div>
                  <div className="inline-homepage-14">Interactive</div>
                  <div className="inline-homepage-15">3D PC Builder Tool</div>
                </div>
                <div>
                  <div className="inline-homepage-16">24-Hour</div>
                  <div className="inline-homepage-17">
                    Stress-Test & Dispatch
                  </div>
                </div>
                <div>
                  <div className="inline-homepage-18">3-Year</div>
                  <div className="inline-homepage-19">
                    Full Warranty Coverage
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive 3D Showcase Preview Card */}
            <div className="inline-homepage-20">
              <div className="cyber-card-static inline-homepage-21">
                {/* Rig Card Top Pill */}
                <div className="flex-between inline-homepage-22">
                  <div className="inline-homepage-23">
                    <span className="inline-homepage-24" />
                    <span className="inline-homepage-25">
                      SYSTEM ONLINE • 4K ULTRA READY
                    </span>
                  </div>
                  <span className="badge badge-purple">FLAGSHIP RIG</span>
                </div>

                {/* Hero Chassis Render with animated floating */}
                <div className="inline-homepage-26">
                  <PCAssemblyScene
                    builderConfig={builderConfig}
                    modelAssets={models3d}
                    cameraView="front"
                    zoomLevel={0.82}
                    showControls={false}
                  />

                  {/* Hotspot Floating Spec Tags */}
                  <div className="inline-homepage-28">
                    <span className="inline-homepage-29">Choose Your GPU</span>
                  </div>

                  <div className="inline-homepage-30">
                    <span className="inline-homepage-31">
                      Pick Your CPU
                    </span>
                  </div>
                </div>

                {/* Card Bottom Specs */}
                <div className="inline-homepage-32">
                  <div className="flex-between inline-homepage-33">
                    <h3 className="inline-homepage-34">Build Your Dream Rig</h3>
                    <div className="inline-homepage-35">From ₱3,999</div>
                  </div>
                  <div className="inline-homepage-36">
                    <span>Custom CPU</span> • <span>Custom GPU</span> •{" "}
                    <span>Custom Cooling</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage("builder")}
                    className="btn btn-outline-cyan inline-homepage-37"
                  >
                    Customize in 3D PC Builder <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FLASH PROMOTIONS BANNER ==================== */}
      <section className="inline-homepage-38">
        <div className="container-wide">
          <div className="inline-homepage-39">
            <div className="inline-homepage-40">
              <div className="inline-homepage-41">
                <Flame size={28} />
              </div>
              <div>
                <div className="inline-homepage-42">
                  <span className="badge badge-red inline-homepage-43">
                    CYBER FLASH SALE
                  </span>
                  <span className="inline-homepage-44">
                    GET 10% OFF WITH CODE: CYBER2026
                  </span>
                </div>
                <h3 className="inline-homepage-45">
                  Save Up to {formatCurrency(400, 0)} on RTX 4080 Super & Ryzen
                  7 7800X3D Pre-Builts
                </h3>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="inline-homepage-46">
              <div className="inline-homepage-47">
                <Clock size={16} color="var(--neon-cyan)" />
                <span className="inline-homepage-48">Sale Ends In:</span>
              </div>
              <div className="inline-homepage-49">
                <div className="inline-homepage-50">
                  <div className="inline-homepage-51">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="inline-homepage-52">HRS</div>
                </div>
                <div className="inline-homepage-53">
                  <div className="inline-homepage-54">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="inline-homepage-55">MIN</div>
                </div>
                <div className="inline-homepage-56">
                  <div className="inline-homepage-57">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="inline-homepage-58">SEC</div>
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("nextgear_promo", "CYBER2026");
                  setCurrentPage("cart");
                }}
                disabled={!saleActive}
                className="btn btn-primary inline-homepage-59"
              >
                Claim Deal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRE-BUILT GAMING PCS ==================== */}
      <section className="inline-homepage-60">
        <div className="container-wide">
          <div className="flex-between inline-homepage-61">
            <div>
              <div className="inline-homepage-62">
                <TrendingUp size={14} /> Certified Ready-To-Ship Rigs
              </div>
              <h2 className="inline-homepage-63">Featured Gaming Pre-Builts</h2>
            </div>

            <button
              onClick={() => setCurrentPage("components")}
              className="btn btn-secondary"
            >
              <span>View All Battlestations</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid-cols-4">
            {prebuilts.map((pc) => (
              <ProductCard key={pc.id} product={pc} isPrebuilt={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== POPULAR CPUS & GPUS SHOWCASE ==================== */}
      <section className="inline-homepage-64">
        <div className="container-wide">
          <div className="inline-homepage-65">
            <span className="badge badge-purple inline-homepage-66">
              FLAGSHIP HARDWARE
            </span>
            <h2 className="inline-homepage-67">
              Popular CPUs & Powerhouse GPUs
            </h2>
            <p className="inline-homepage-68">
              Hand-selected silicon tested for peak overclocking headroom and
              low thermal resistance.
            </p>
          </div>

          {/* Dual Columns: Left Top CPUs, Right Top GPUs */}
          <div className="inline-homepage-69">
            {/* Top CPUs */}
            <div className="cyber-card-static inline-homepage-70">
              <div className="flex-between inline-homepage-71">
                <div className="inline-homepage-72">
                  <div className="inline-homepage-73">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className="inline-homepage-74">
                      Top Gaming Processors (CPUs)
                    </h3>
                    <div className="inline-homepage-75">
                      AM5 & LGA1851 Flagships
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter("cpu");
                    setCurrentPage("components");
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  View CPUs
                </button>
              </div>

              <div className="inline-homepage-76">
                {popularCpus.map((cpu) => (
                  <ProductCard key={cpu.id} product={cpu} />
                ))}
              </div>
            </div>

            {/* Top GPUs */}
            <div className="cyber-card-static inline-homepage-77">
              <div className="flex-between inline-homepage-78">
                <div className="inline-homepage-79">
                  <div className="inline-homepage-80">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h3 className="inline-homepage-81">
                      Top Graphics Cards (GPUs)
                    </h3>
                    <div className="inline-homepage-82">
                      RTX 5090 / 4080 Super & RX 7900 XTX
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter("gpu");
                    setCurrentPage("components");
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  View GPUs
                </button>
              </div>

              <div className="inline-homepage-83">
                {popularGpus.map((gpu) => (
                  <ProductCard key={gpu.id} product={gpu} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED COMPONENTS & MARKETPLACE ==================== */}
      <section className="inline-homepage-84">
        <div className="container-wide">
          <div className="flex-between inline-homepage-85">
            <div>
              <span className="badge badge-cyan inline-homepage-86">
                COMPONENT INVENTORY
              </span>
              <h2 className="inline-homepage-87">
                Featured Hardware & Components
              </h2>
            </div>

            {/* Tabs Switcher */}
            <div className="inline-homepage-88">
              <button
                onClick={() => setActiveTab("bestsellers")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background:
                    activeTab === "bestsellers"
                      ? "rgba(0, 240, 255, 0.15)"
                      : "transparent",
                  color:
                    activeTab === "bestsellers"
                      ? "var(--neon-cyan)"
                      : "var(--text-muted)",
                }}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab("newarrivals")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background:
                    activeTab === "newarrivals"
                      ? "rgba(157, 78, 221, 0.18)"
                      : "transparent",
                  color:
                    activeTab === "newarrivals"
                      ? "#c084fc"
                      : "var(--text-muted)",
                }}
              >
                New Arrivals
              </button>
            </div>
          </div>

          <div className="grid-cols-4">
            {visibleFeaturedComponents.slice(0, 8).map((comp) => (
              <ProductCard key={comp.id} product={comp} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3D BUILDER CTA BANNER ==================== */}
      <section className="inline-homepage-89">
        <div className="container-wide">
          <div className="inline-homepage-90">
            {/* Background cyber grid */}
            <div className="inline-homepage-91" />

            <div className="inline-homepage-92">
              <span className="badge badge-cyan inline-homepage-93">
                <Sparkles size={12} /> 3D INTERACTIVE WORKSPACE
              </span>
              <h2 className="inline-homepage-94">
                Visualize Your Dream Rig In{" "}
                <span className="text-gradient-cyan">Real-Time 3D</span>
              </h2>
              <p className="inline-homepage-95">
                Select matching CPU sockets, custom liquid cooling loops,
                high-wattage ATX 3.0 PSUs, and panoramic glass cases. Our
                interactive 3D viewport lets you rotate 360°, inspect internal
                components, and test RGB lighting presets in real-time.
              </p>

              <div className="inline-homepage-96">
                <button
                  onClick={() => setCurrentPage("builder")}
                  className="btn btn-primary btn-lg"
                >
                  <Wrench size={18} /> Launch 3D PC Builder Studio
                </button>
                <button
                  onClick={() => setCurrentPage("compare")}
                  className="btn btn-secondary btn-lg"
                >
                  <SlidersHorizontal size={18} /> Compare Hardware Specs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
