// ==========================================================================
// NEXT GEAR MOCK DATA ENGINE - HIGH PERFORMANCE GAMING HARDWARE
// ==========================================================================

export const PREBUILT_PCS = [
  {
    id: "prebuilt-1",
    name: "NextGear Apex 5090 Ultra",
    tier: "God Tier Enthusiast",
    price: 3999,
    rating: 4.98,
    reviewsCount: 142,
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "The absolute pinnacle of gaming performance. Powered by the groundbreaking NVIDIA RTX 5090 and Intel Core Ultra 9 285K with custom dual-loop 360mm liquid cooling.",
    fps4k: "165+ FPS @ 4K Ultra",
    benchmarkScore: 99,
    specs: {
      cpu: "Intel Core Ultra 9 285K (24 Cores, 5.7 GHz)",
      gpu: "NVIDIA GeForce RTX 5090 32GB GDDR7",
      motherboard: "ASUS ROG Maximus Z790 Dark Hero",
      ram: "64GB (2x32GB) DDR5-6400 RGB",
      storage: "4TB Samsung 990 PRO Gen4 NVMe M.2",
      cooler: "NZXT Kraken Elite 360 RGB LCD",
      psu: "1200W Corsair RM1200x Shift 80+ Gold ATX 3.0",
      case: "Lian Li O11 Dynamic EVO RGB Black"
    },
    inStock: true,
    stockCount: 6,
    tags: ["RTX 5090", "4K Gaming", "Liquid Cooled", "Stream Ready"]
  },
  {
    id: "prebuilt-2",
    name: "NextGear Vanguard 4080 Super",
    tier: "Competitive Enthusiast",
    price: 2599,
    rating: 4.92,
    reviewsCount: 310,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80",
    description: "Dominating 1440p and 4K esports battlefields. AMD's legendary Ryzen 7 7800X3D paired with the RTX 4080 Super provides unmatched frame rates and latency.",
    fps4k: "120+ FPS @ 4K Ultra",
    benchmarkScore: 94,
    specs: {
      cpu: "AMD Ryzen 7 7800X3D (8C/16T, 3D V-Cache)",
      gpu: "MSI GeForce RTX 4080 Super 16GB GDDR6X",
      motherboard: "MSI MAG X670E Tomahawk WiFi",
      ram: "32GB (2x16GB) G.Skill Trident Z5 DDR5-6000",
      storage: "2TB Samsung 990 PRO Gen4 NVMe M.2",
      cooler: "Corsair iCUE LINK TITAN 360 RX RGB",
      psu: "850W be quiet! Pure Power 12 M 80+ Gold",
      case: "NZXT H9 Flow Dual-Chamber Tempered Glass"
    },
    inStock: true,
    stockCount: 14,
    tags: ["7800X3D", "RTX 4080 Super", "Dual-Chamber", "Esports"]
  },
  {
    id: "prebuilt-3",
    name: "NextGear Valkyrie Studio",
    tier: "Aesthetic Masterpiece",
    price: 2899,
    rating: 4.95,
    reviewsCount: 88,
    badge: "Pure White",
    image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800&auto=format&fit=crop&q=80",
    description: "Pristine arctic aesthetics meets unrestrained power. Featuring the HYTE Y70 panoramic chassis and an all-white component matrix with customizable touchscreen widget display.",
    fps4k: "135+ FPS @ 4K Ultra",
    benchmarkScore: 96,
    specs: {
      cpu: "AMD Ryzen 9 7950X3D (16C/32T, 5.7GHz)",
      gpu: "GIGABYTE GeForce RTX 4070 Ti Super Aero 16GB",
      motherboard: "ASRock X670E Taichi Carrara White",
      ram: "64GB (2x32GB) Corsair Dominator Titanium White DDR5",
      storage: "2TB Crucial T705 Gen5 NVMe (14,500 MB/s)",
      cooler: "Lian Li Galahad II LCD SL-INF 360 White",
      psu: "1000W Corsair RM1000x White Edition",
      case: "HYTE Y70 Touch Infinite Snow White"
    },
    inStock: true,
    stockCount: 4,
    tags: ["All White", "Touchscreen", "Gen5 NVMe", "Aesthetics"]
  },
  {
    id: "prebuilt-4",
    name: "NextGear Pulse Nova 4070 Ti",
    tier: "High-Performance Value",
    price: 1899,
    rating: 4.88,
    reviewsCount: 215,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
    description: "The sweet spot for maximum 1440p high-refresh rate gaming and VR. Intel Core i7 20-core architecture backed by high-speed DDR5 memory.",
    fps4k: "90+ FPS @ 4K Ultra",
    benchmarkScore: 89,
    specs: {
      cpu: "Intel Core i7-14700KF (20 Cores, 5.6 GHz)",
      gpu: "ZOTAC Gaming RTX 4070 Ti Super 16GB",
      motherboard: "GIGABYTE B650 AORUS Elite AX",
      ram: "32GB (2x16GB) Kingston FURY Beast DDR5-5600",
      storage: "2TB WD_BLACK SN850X NVMe M.2",
      cooler: "Thermalright Peerless Assassin 120 SE",
      psu: "750W EVGA SuperNOVA 750 GT 80+ Gold",
      case: "Corsair 4000D AIRFLOW Tempered Glass"
    },
    inStock: true,
    stockCount: 19,
    tags: ["1440p Max", "20-Core", "Air Cooled", "Value King"]
  }
];

export const CATEGORIES = [
  { id: "cpu", name: "CPU / Processors", icon: "Cpu", short: "CPU", count: 18 },
  { id: "gpu", name: "Graphics Cards", icon: "Monitor", short: "GPU", count: 24 },
  { id: "motherboard", name: "Motherboards", icon: "CircuitBoard", short: "Motherboard", count: 16 },
  { id: "ram", name: "Memory / RAM", icon: "Layers", short: "RAM", count: 20 },
  { id: "storage", name: "Storage / SSD", icon: "HardDrive", short: "Storage", count: 22 },
  { id: "psu", name: "Power Supplies", icon: "Zap", short: "PSU", count: 15 },
  { id: "case", name: "PC Cases", icon: "Box", short: "Case", count: 18 },
  { id: "cooler", name: "CPU Coolers", icon: "Snowflake", short: "Cooler", count: 19 },
  { id: "fans", name: "Case Fans", icon: "Wind", short: "Fans", count: 14 }
];

export const BRANDS = [
  "NVIDIA", "AMD", "Intel", "ASUS ROG", "MSI", "Corsair", "NZXT", "Lian Li", "G.Skill", "Samsung", "Crucial", "be quiet!"
];

export const COMPONENTS = [
  // ==================== CPUS ====================
  {
    id: "cpu-1",
    category: "cpu",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    price: 449,
    rating: 4.95,
    reviewsCount: 680,
    stock: 28,
    inStock: true,
    wattage: 120,
    performanceScore: 98,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "AM5",
      cores: "8 Cores / 16 Threads",
      baseClock: "4.2 GHz",
      boostClock: "5.0 GHz",
      cache: "96MB 3D V-Cache",
      tdp: "120W",
      pcie: "PCIe 5.0 Support",
      integratedGpu: "AMD Radeon Graphics"
    },
    description: "The undisputed champion of gaming CPUs. With 96MB of groundbreaking 3D V-Cache stacked on top of high-performance Zen 4 cores.",
    featured: true,
    isPopular: true
  },
  {
    id: "cpu-2",
    category: "cpu",
    name: "Intel Core Ultra 9 285K",
    brand: "Intel",
    price: 589,
    rating: 4.88,
    reviewsCount: 140,
    stock: 15,
    inStock: true,
    wattage: 125,
    performanceScore: 99,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "LGA1851",
      cores: "24 Cores (8P + 16E)",
      baseClock: "3.7 GHz",
      boostClock: "5.7 GHz",
      cache: "36MB Intel Smart Cache",
      tdp: "125W Base / 250W Boost",
      pcie: "PCIe 5.0 & 4.0",
      integratedGpu: "Intel Graphics Xe"
    },
    description: "Next-generation Arrow Lake architecture with dedicated NPU for AI acceleration and supreme multithreaded rendering performance.",
    featured: true,
    isPopular: true
  },
  {
    id: "cpu-3",
    category: "cpu",
    name: "AMD Ryzen 9 9950X",
    brand: "AMD",
    price: 649,
    rating: 4.94,
    reviewsCount: 195,
    stock: 12,
    inStock: true,
    wattage: 170,
    performanceScore: 100,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "AM5",
      cores: "16 Cores / 32 Threads",
      baseClock: "4.3 GHz",
      boostClock: "5.7 GHz",
      cache: "80MB Total Cache",
      tdp: "170W",
      pcie: "PCIe 5.0 Ready",
      integratedGpu: "AMD Radeon Graphics"
    },
    description: "The ultimate dual-threat CPU for extreme 4K gaming and heavy 3D workstation rendering. Zen 5 architecture on TSMC 4nm.",
    featured: true,
    isPopular: false
  },
  {
    id: "cpu-4",
    category: "cpu",
    name: "Intel Core i7-14700KF",
    brand: "Intel",
    price: 379,
    rating: 4.82,
    reviewsCount: 320,
    stock: 35,
    inStock: true,
    wattage: 125,
    performanceScore: 93,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "LGA1700",
      cores: "20 Cores (8P + 12E)",
      baseClock: "3.4 GHz",
      boostClock: "5.6 GHz",
      cache: "33MB Intel Smart Cache",
      tdp: "125W Base / 253W Max",
      pcie: "PCIe 5.0",
      integratedGpu: "None (KF Series)"
    },
    description: "Tremendous performance value with 20 unlocked cores for high-refresh competitive gaming and streaming simultaneously.",
    featured: false,
    isPopular: true
  },
  {
    id: "cpu-5",
    category: "cpu",
    name: "AMD Ryzen 5 7600X",
    brand: "AMD",
    price: 219,
    rating: 4.78,
    reviewsCount: 450,
    stock: 42,
    inStock: true,
    wattage: 105,
    performanceScore: 86,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "AM5",
      cores: "6 Cores / 12 Threads",
      baseClock: "4.7 GHz",
      boostClock: "5.3 GHz",
      cache: "38MB Total Cache",
      tdp: "105W",
      pcie: "PCIe 5.0",
      integratedGpu: "AMD Radeon Graphics"
    },
    description: "The budget gaming superstar. Exceptional single-core IPC speeds on the future-proof AM5 platform.",
    featured: false,
    isPopular: false
  },

  // ==================== GPUS ====================
  {
    id: "gpu-1",
    category: "gpu",
    name: "NVIDIA GeForce RTX 5090 Founders Edition",
    brand: "NVIDIA",
    price: 1999,
    rating: 4.99,
    reviewsCount: 89,
    stock: 3,
    inStock: true,
    wattage: 600,
    performanceScore: 100,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: {
      vram: "32GB GDDR7",
      memoryBus: "512-bit",
      boostClock: "2550 MHz",
      cudaCores: "21,760",
      powerConnector: "1x 16-pin 12V-2x6",
      recommendedPsu: "1000W+",
      length: "336mm",
      slotWidth: "3.5 Slot"
    },
    description: "The monarch of graphic rendering. Blackwell architecture, DLSS 4 Neural Rendering, and unmatched 32GB high-bandwidth GDDR7 memory.",
    featured: true,
    isPopular: true
  },
  {
    id: "gpu-2",
    category: "gpu",
    name: "ASUS ROG Strix GeForce RTX 4090 OC 24GB",
    brand: "ASUS ROG",
    price: 1849,
    rating: 4.96,
    reviewsCount: 540,
    stock: 7,
    inStock: true,
    wattage: 450,
    performanceScore: 98,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    specs: {
      vram: "24GB GDDR6X",
      memoryBus: "384-bit",
      boostClock: "2640 MHz (OC Mode)",
      cudaCores: "16,384",
      powerConnector: "1x 16-pin",
      recommendedPsu: "850W+",
      length: "357mm",
      slotWidth: "3.5 Slot"
    },
    description: "Premium die-cast shroud, massive vapor chamber cooling, and patented axial-tech fans with reverse rotation.",
    featured: true,
    isPopular: true
  },
  {
    id: "gpu-3",
    category: "gpu",
    name: "MSI Gaming X Trio RTX 4080 Super 16GB",
    brand: "MSI",
    price: 999,
    rating: 4.91,
    reviewsCount: 410,
    stock: 18,
    inStock: true,
    wattage: 320,
    performanceScore: 93,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    specs: {
      vram: "16GB GDDR6X",
      memoryBus: "256-bit",
      boostClock: "2595 MHz",
      cudaCores: "10,240",
      powerConnector: "1x 16-pin",
      recommendedPsu: "750W+",
      length: "337mm",
      slotWidth: "3 Slot"
    },
    description: "TRI FROZR 3 thermal design with TORX Fan 5.0 and copper baseplate for whisper-quiet high-FPS 4K raytracing.",
    featured: true,
    isPopular: true
  },
  {
    id: "gpu-4",
    category: "gpu",
    name: "AMD Radeon RX 7900 XTX 24GB",
    brand: "AMD",
    price: 929,
    rating: 4.87,
    reviewsCount: 290,
    stock: 14,
    inStock: true,
    wattage: 355,
    performanceScore: 92,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    specs: {
      vram: "24GB GDDR6",
      memoryBus: "384-bit",
      boostClock: "2500 MHz",
      streamProcessors: "6,144",
      powerConnector: "2x 8-pin",
      recommendedPsu: "800W+",
      length: "287mm",
      slotWidth: "2.5 Slot"
    },
    description: "RDNA 3 chiplet technology delivering enormous 24GB VRAM capacity, DisplayPort 2.1, and AMD FSR 3.1 frame generation.",
    featured: false,
    isPopular: true
  },
  {
    id: "gpu-5",
    category: "gpu",
    name: "GIGABYTE RTX 4070 Ti Super Aero White 16GB",
    brand: "GIGABYTE",
    price: 799,
    rating: 4.89,
    reviewsCount: 175,
    stock: 22,
    inStock: true,
    wattage: 285,
    performanceScore: 88,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    specs: {
      vram: "16GB GDDR6X",
      memoryBus: "256-bit",
      boostClock: "2655 MHz",
      cudaCores: "8,448",
      powerConnector: "1x 16-pin",
      recommendedPsu: "700W+",
      length: "300mm",
      slotWidth: "2.5 Slot"
    },
    description: "Stunning silver-white aesthetic with WINDFORCE cooling system and RGB Fusion custom lighting.",
    featured: false,
    isPopular: false
  },

  // ==================== MOTHERBOARDS ====================
  {
    id: "mb-1",
    category: "motherboard",
    name: "ASUS ROG Maximus Z790 Dark Hero",
    brand: "ASUS ROG",
    price: 599,
    rating: 4.93,
    reviewsCount: 165,
    stock: 10,
    inStock: true,
    wattage: 65,
    performanceScore: 99,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      chipset: "Intel Z790",
      memorySlots: "4x DDR5 (Up to 8000+ MHz OC)",
      pcieSlots: "2x PCIe 5.0 x16",
      m2Slots: "5x M.2 (1x PCIe 5.0)",
      networking: "Wi-Fi 7 + 2.5Gb LAN",
      audio: "ROG SupremeFX 7.1 HD"
    },
    description: "Flagship gaming motherboard with 20+1+2 power stages, Polymo Lighting, dual Thunderbolt 4 ports, and onboard Wi-Fi 7.",
    featured: true,
    isPopular: true
  },
  {
    id: "mb-2",
    category: "motherboard",
    name: "MSI MAG X670E Tomahawk WiFi",
    brand: "MSI",
    price: 279,
    rating: 4.88,
    reviewsCount: 380,
    stock: 25,
    inStock: true,
    wattage: 50,
    performanceScore: 94,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      chipset: "AMD X670E",
      memorySlots: "4x DDR5 (Up to 6600+ MHz)",
      pcieSlots: "1x PCIe 5.0 x16",
      m2Slots: "4x M.2 (1x PCIe 5.0)",
      networking: "Wi-Fi 6E + 2.5G LAN",
      audio: "Realtek ALC1200"
    },
    description: "Rugged military-grade durability with 14+2+1 Duet Rail power design and extended heatsinks for AMD Ryzen 7000/9000.",
    featured: false,
    isPopular: true
  },
  {
    id: "mb-3",
    category: "motherboard",
    name: "ASRock X670E Taichi Carrara Marble",
    brand: "ASRock",
    price: 499,
    rating: 4.90,
    reviewsCount: 82,
    stock: 8,
    inStock: true,
    wattage: 60,
    performanceScore: 97,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    specs: {
      socket: "AM5",
      formFactor: "E-ATX",
      chipset: "AMD X670E",
      memorySlots: "4x DDR5 (Up to 6600+ MHz)",
      pcieSlots: "2x PCIe 5.0 x16",
      m2Slots: "4x M.2 (1x Blazing M.2 Gen5)",
      networking: "Killer Wi-Fi 6E + Killer 2.5G LAN",
      audio: "ESS SABRE9218 DAC"
    },
    description: "Unique Carrara marble aesthetic cover with 24+2+1 Phase SPS Smart Power Stage design and USB4 Type-C ports.",
    featured: false,
    isPopular: false
  },

  // ==================== RAM ====================
  {
    id: "ram-1",
    category: "ram",
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6400",
    brand: "G.Skill",
    price: 139,
    rating: 4.94,
    reviewsCount: 520,
    stock: 60,
    inStock: true,
    wattage: 15,
    performanceScore: 95,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    specs: {
      capacity: "32GB (2x 16GB)",
      speed: "DDR5-6400 MHz",
      timings: "CL32-39-39-102",
      voltage: "1.40V",
      rgb: "Customizable RGB Lightbar",
      profile: "Intel XMP 3.0 & AMD EXPO",
      heatSpreader: "Matte Black Aluminum"
    },
    description: "Ultra-high frequency DDR5 memory with sleek aerodynamic aluminum heatspreaders and fluid RGB illumination.",
    featured: true,
    isPopular: true
  },
  {
    id: "ram-2",
    category: "ram",
    name: "Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5-6000",
    brand: "Corsair",
    price: 279,
    rating: 4.96,
    reviewsCount: 210,
    stock: 24,
    inStock: true,
    wattage: 20,
    performanceScore: 98,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    specs: {
      capacity: "64GB (2x 32GB)",
      speed: "DDR5-6000 MHz",
      timings: "CL30-36-36-76",
      voltage: "1.35V",
      rgb: "11 Individually Addressable LEDs",
      profile: "iCUE Compatible + AMD EXPO",
      heatSpreader: "Forged Aluminum & Swappable Top Bars"
    },
    description: "Premium forged aluminum construction, DHX cooling technology, and modular swappable top fins.",
    featured: true,
    isPopular: true
  },

  // ==================== STORAGE ====================
  {
    id: "storage-1",
    category: "storage",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD",
    brand: "Samsung",
    price: 179,
    rating: 4.97,
    reviewsCount: 890,
    stock: 80,
    inStock: true,
    wattage: 8,
    performanceScore: 96,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    specs: {
      capacity: "2TB",
      interface: "PCIe Gen 4.0 x4, NVMe 2.0",
      seqRead: "7,450 MB/s",
      seqWrite: "6,900 MB/s",
      randomRead: "1,400,000 IOPS",
      tbw: "1,200 TBW",
      formFactor: "M.2 2280"
    },
    description: "Unrivaled read/write speeds reaching the theoretical limits of PCIe 4.0 with nickel-coated heat controller.",
    featured: true,
    isPopular: true
  },
  {
    id: "storage-2",
    category: "storage",
    name: "Crucial T705 2TB PCIe 5.0 NVMe M.2 SSD",
    brand: "Crucial",
    price: 289,
    rating: 4.91,
    reviewsCount: 140,
    stock: 18,
    inStock: true,
    wattage: 12,
    performanceScore: 100,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    specs: {
      capacity: "2TB",
      interface: "PCIe Gen 5.0 x4, NVMe 2.0",
      seqRead: "14,500 MB/s",
      seqWrite: "12,700 MB/s",
      randomRead: "1,550,000 IOPS",
      tbw: "1,200 TBW",
      formFactor: "M.2 2280 with Heatsink"
    },
    description: "Insane next-gen speed up to 14.5 GB/s. DirectStorage enabled for near-instant game loading times.",
    featured: false,
    isPopular: false
  },

  // ==================== PSU ====================
  {
    id: "psu-1",
    category: "psu",
    name: "Corsair RM1000x Shift 1000W 80+ Gold ATX 3.0",
    brand: "Corsair",
    price: 189,
    rating: 4.95,
    reviewsCount: 390,
    stock: 35,
    inStock: true,
    wattage: 1000,
    performanceScore: 97,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    specs: {
      wattage: "1000 Watts",
      efficiency: "80 PLUS Gold Certified",
      modular: "Fully Modular (Side Interface)",
      atxVersion: "ATX 3.0 & PCIe 5.0 Ready",
      fan: "140mm Fluid Dynamic Bearing Zero-RPM",
      warranty: "10 Years"
    },
    description: "Innovative side-mounted cable interface for effortless cable routing, 105°C Japanese capacitors, and ATX 3.0 12VHPWR support.",
    featured: true,
    isPopular: true
  },
  {
    id: "psu-2",
    category: "psu",
    name: "be quiet! Pure Power 12 M 850W 80+ Gold ATX 3.0",
    brand: "be quiet!",
    price: 134,
    rating: 4.90,
    reviewsCount: 220,
    stock: 45,
    inStock: true,
    wattage: 850,
    performanceScore: 94,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    specs: {
      wattage: "850 Watts",
      efficiency: "80 PLUS Gold (up to 93.2%)",
      modular: "Fully Modular",
      atxVersion: "ATX 3.0 with 12VHPWR Cable",
      fan: "Silence-Optimized 120mm be quiet! Fan",
      warranty: "10 Years"
    },
    description: "Peerless silence and rock-solid voltage regulation across dual 12V rails with full PCIe 5.0 GPU support.",
    featured: false,
    isPopular: true
  },

  // ==================== CASES ====================
  {
    id: "case-1",
    category: "case",
    name: "Lian Li O11 Dynamic EVO RGB Dual-Chamber",
    brand: "Lian Li",
    price: 169,
    rating: 4.98,
    reviewsCount: 750,
    stock: 30,
    inStock: true,
    wattage: 0,
    performanceScore: 98,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: {
      formFactor: "Mid-Tower Dual-Chamber",
      motherboardSupport: "E-ATX, ATX, Micro-ATX, Mini-ITX",
      radiatorSupport: "Up to 3x 360mm Radiators",
      gpuClearance: "455.7 mm Max Length",
      cpuCoolerClearance: "167 mm Max Height",
      lighting: "Dual ARGB Light Strips (Front & Bottom)",
      panels: "Tempered Glass Front & Left"
    },
    description: "The gold standard in showpiece PC cases. Dual-chamber layout with reversible chassis orientation and wrap-around ARGB lighting.",
    featured: true,
    isPopular: true
  },
  {
    id: "case-2",
    category: "case",
    name: "HYTE Y70 Touch Infinite Panoramic Case",
    brand: "HYTE",
    price: 379,
    rating: 4.96,
    reviewsCount: 190,
    stock: 8,
    inStock: true,
    wattage: 0,
    performanceScore: 99,
    image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80",
    specs: {
      formFactor: "Mid-Tower 3-Piece Glass",
      screen: "14.1\" 4K Touchscreen Display (60Hz)",
      gpuClearance: "390 mm Length, 4-Slot Vertical",
      radiatorSupport: "Top & Side up to 360mm",
      dimensions: "470 x 320 x 470 mm",
      included: "Luxury PCIe 4.0 Riser Cable"
    },
    description: "Pioneering integrated 4K multi-touch screen showing live system telemetry, animated game backgrounds, and Twitch chat widgets.",
    featured: true,
    isPopular: false
  },
  {
    id: "case-3",
    category: "case",
    name: "NZXT H9 Flow Dual-Chamber Tempered Glass",
    brand: "NZXT",
    price: 159,
    rating: 4.92,
    reviewsCount: 420,
    stock: 22,
    inStock: true,
    wattage: 0,
    performanceScore: 95,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&auto=format&fit=crop&q=80",
    specs: {
      formFactor: "Mid-Tower",
      glass: "Uninterrupted Seamless Glass Corner",
      radiatorSupport: "Up to 3x 360mm Radiators",
      fansIncluded: "4x 120mm Quiet Fans",
      gpuClearance: "435 mm",
      cableManagement: "Wide cable channels & straps"
    },
    description: "Continuous glass design providing an unobstructed panoramic view of your powerhouse internal hardware.",
    featured: false,
    isPopular: true
  },

  // ==================== CPU COOLERS ====================
  {
    id: "cooler-1",
    category: "cooler",
    name: "NZXT Kraken Elite 360 RGB LCD Liquid Cooler",
    brand: "NZXT",
    price: 279,
    rating: 4.97,
    reviewsCount: 630,
    stock: 20,
    inStock: true,
    wattage: 25,
    performanceScore: 98,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: {
      type: "360mm AIO Liquid Cooler",
      display: "2.36\" Wide-Angle TFT-LCD (640x640, 60 FPS)",
      fans: "3x 120mm F120 RGB Core Fans",
      pumpSpeed: "800 - 2,800 RPM Asetek 7th Gen V2",
      tubeLength: "400mm Braided Nylon",
      sockets: "Intel LGA1700/1851/1200 & AMD AM5/AM4"
    },
    description: "Display custom animated GIFs, real-time hardware temperatures, and Spotify artwork on the vibrant 60 FPS pump head display.",
    featured: true,
    isPopular: true
  },
  {
    id: "cooler-2",
    category: "cooler",
    name: "Thermalright Peerless Assassin 120 SE Air Cooler",
    brand: "Thermalright",
    price: 38,
    rating: 4.92,
    reviewsCount: 1100,
    stock: 90,
    inStock: true,
    wattage: 5,
    performanceScore: 91,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    specs: {
      type: "Dual Tower Air Cooler",
      heatpipes: "6x 6mm AGHP Technology Heatpipes",
      fans: "2x 120mm TL-C12C-S PWM Fans (1550 RPM)",
      noiseLevel: "25.6 dBA Max",
      height: "155 mm",
      tdpRating: "Up to 245W TDP"
    },
    description: "Unbeatable price-to-performance air cooler outperforming liquid units at a fraction of the cost.",
    featured: false,
    isPopular: true
  },

  // ==================== CASE FANS ====================
  {
    id: "fans-1",
    category: "fans",
    name: "Lian Li UNI FAN SL-INFINITY 120 RGB Triple Pack",
    brand: "Lian Li",
    price: 99,
    rating: 4.96,
    reviewsCount: 510,
    stock: 45,
    inStock: true,
    wattage: 15,
    performanceScore: 97,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: {
      quantity: "3x 120mm Fans + Controller Hub",
      effects: "Infinity Mirror Center & Side Accents",
      connector: "Daisy-chain interlocking modular system",
      speed: "200 - 2100 RPM",
      airflow: "61.3 CFM",
      noiseLevel: "29 dBA"
    },
    description: "Interlocking daisy-chain cableless fans with mesmerizing 3D infinity mirrors in the center and aluminum side frames.",
    featured: true,
    isPopular: true
  },
  {
    id: "fans-2",
    category: "fans",
    name: "Corsair iCUE LINK QX120 RGB 120mm 3-Pack",
    brand: "Corsair",
    price: 139,
    rating: 4.89,
    reviewsCount: 180,
    stock: 30,
    inStock: true,
    wattage: 18,
    performanceScore: 95,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: {
      quantity: "3x 120mm Fans + iCUE LINK System Hub",
      leds: "34 RGB LEDs across two distinct light loops",
      sensor: "Individual built-in temperature sensor",
      speed: "Up to 2,400 RPM with Zero RPM mode",
      airflow: "63.1 CFM",
      control: "Single cable digital bus linking"
    },
    description: "Next-gen iCUE LINK smart ecosystem linking power and data across one single unified cable.",
    featured: false,
    isPopular: false
  }
];

export const INITIAL_SAVED_BUILDS = [
  {
    id: "build-1",
    name: "Night City Ripper 4090 OC",
    createdAt: "2026-08-16",
    totalPrice: 3450,
    score: 98,
    wattage: 680,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    components: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "ASUS ROG Strix GeForce RTX 4090 OC 24GB",
      motherboard: "MSI MAG X670E Tomahawk WiFi",
      ram: "G.Skill Trident Z5 RGB 32GB DDR5-6400",
      storage: "Samsung 990 PRO 2TB PCIe 4.0",
      psu: "Corsair RM1000x Shift 1000W 80+ Gold",
      case: "Lian Li O11 Dynamic EVO RGB Dual-Chamber",
      cooler: "NZXT Kraken Elite 360 RGB LCD",
      fans: "Lian Li UNI FAN SL-INFINITY 120 RGB Triple Pack"
    }
  },
  {
    id: "build-2",
    name: "Whiteout Streaming Studio Rig",
    createdAt: "2026-08-04",
    totalPrice: 2840,
    score: 95,
    wattage: 560,
    image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80",
    components: {
      cpu: "Intel Core Ultra 9 285K",
      gpu: "GIGABYTE RTX 4070 Ti Super Aero White 16GB",
      motherboard: "ASRock X670E Taichi Carrara Marble",
      ram: "Corsair Dominator Titanium RGB 64GB DDR5",
      storage: "Crucial T705 2TB PCIe 5.0",
      psu: "be quiet! Pure Power 12 M 850W 80+ Gold",
      case: "HYTE Y70 Touch Infinite Panoramic Case",
      cooler: "NZXT Kraken Elite 360 RGB LCD",
      fans: "Lian Li UNI FAN SL-INFINITY 120 RGB Triple Pack"
    }
  },
  {
    id: "build-3",
    name: "Esports Champion 1440p",
    createdAt: "2026-07-22",
    totalPrice: 1690,
    score: 88,
    wattage: 480,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    components: {
      cpu: "AMD Ryzen 5 7600X",
      gpu: "MSI Gaming X Trio RTX 4080 Super 16GB",
      motherboard: "MSI MAG X670E Tomahawk WiFi",
      ram: "G.Skill Trident Z5 RGB 32GB DDR5-6400",
      storage: "Samsung 990 PRO 2TB PCIe 4.0",
      psu: "be quiet! Pure Power 12 M 850W 80+ Gold",
      case: "NZXT H9 Flow Dual-Chamber Tempered Glass",
      cooler: "Thermalright Peerless Assassin 120 SE Air Cooler",
      fans: "Lian Li UNI FAN SL-INFINITY 120 RGB Triple Pack"
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: "CF-98214",
    date: "2026-08-19",
    customer: "Alex Mercer",
    email: "alex.mercer@cyberforge.io",
    total: 3999.00,
    status: "Shipped",
    trackingNumber: "CF-US-991827419",
    paymentMethod: "Credit Card (Visa •••• 4242)",
    items: [
      { name: "Apex Phantom Ultra 5090 Custom Rig", quantity: 1, price: 3999.00, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "CF-97640",
    date: "2026-08-11",
    customer: "Alex Mercer",
    email: "alex.mercer@cyberforge.io",
    total: 588.00,
    status: "Completed",
    trackingNumber: "CF-US-887123901",
    paymentMethod: "PayPal Express",
    items: [
      { name: "AMD Ryzen 7 7800X3D", quantity: 1, price: 449.00, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&auto=format&fit=crop&q=80" },
      { name: "G.Skill Trident Z5 RGB 32GB DDR5", quantity: 1, price: 139.00, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "CF-96102",
    date: "2026-08-01",
    customer: "Elena Rostova",
    email: "elena.r@nexus.gg",
    total: 1248.00,
    status: "Processing",
    trackingNumber: "CF-US-776219800",
    paymentMethod: "Crypto (ETH)",
    items: [
      { name: "MSI Gaming X Trio RTX 4080 Super", quantity: 1, price: 999.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&auto=format&fit=crop&q=80" },
      { name: "Samsung 990 PRO 2TB NVMe", quantity: 1, price: 179.00, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&auto=format&fit=crop&q=80" },
      { name: "Thermalright Peerless Assassin 120", quantity: 1, price: 38.00, image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "CF-94520",
    date: "2026-07-28",
    customer: "Marcus Vance",
    email: "mvance@titan.dev",
    total: 179.00,
    status: "Cancelled",
    trackingNumber: "-",
    paymentMethod: "Credit Card (Mastercard •••• 8812)",
    items: [
      { name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe", quantity: 1, price: 179.00, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&auto=format&fit=crop&q=80" }
    ]
  }
];

export const INITIAL_USERS = [
  { id: "u-1", name: "Alex Mercer", email: "alex.mercer@cyberforge.io", ordersCount: 4, totalSpent: 4890, tier: "Elite Enthusiast", status: "Active", joined: "2025-11-12" },
  { id: "u-2", name: "Elena Rostova", email: "elena.r@nexus.gg", ordersCount: 2, totalSpent: 1850, tier: "Pro Gamer", status: "Active", joined: "2026-02-05" },
  { id: "u-3", name: "Marcus Vance", email: "mvance@titan.dev", ordersCount: 6, totalSpent: 7320, tier: "Overclocker Legend", status: "Active", joined: "2025-08-20" },
  { id: "u-4", name: "Sarah Jenkins", email: "sarah.j@twitch.tv", ordersCount: 1, totalSpent: 2899, tier: "Streamer VIP", status: "Active", joined: "2026-06-14" },
  { id: "u-5", name: "Devon Chen", email: "dchen99@gmail.com", ordersCount: 0, totalSpent: 0, tier: "Cadet", status: "Suspended", joined: "2026-08-01" }
];

export const INITIAL_3D_MODELS = [
  {
    id: "model-1",
    name: "Lian Li O11 Dynamic EVO Glass Chassis",
    format: "GLB (glTF 2.0)",
    fileSize: "14.2 MB",
    polygonCount: "84,200 Triangles",
    assignedProduct: "Lian Li O11 Dynamic EVO RGB Dual-Chamber",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80",
    lastUpdated: "2026-08-10",
    status: "Active"
  },
  {
    id: "model-2",
    name: "NVIDIA RTX 5090 Founders Shroud",
    format: "GLTF + PBR Textures",
    fileSize: "22.8 MB",
    polygonCount: "128,400 Triangles",
    assignedProduct: "NVIDIA GeForce RTX 5090 Founders Edition",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80",
    lastUpdated: "2026-08-14",
    status: "Active"
  },
  {
    id: "model-3",
    name: "NZXT Kraken Elite 360 LCD Pump & Radiator",
    format: "GLB Animated",
    fileSize: "18.5 MB",
    polygonCount: "96,100 Triangles",
    assignedProduct: "NZXT Kraken Elite 360 RGB LCD Liquid Cooler",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80",
    lastUpdated: "2026-07-29",
    status: "Active"
  },
  {
    id: "model-4",
    name: "HYTE Y70 Panoramic 4K Touchscreen Case",
    format: "GLB",
    fileSize: "29.1 MB",
    polygonCount: "152,000 Triangles",
    assignedProduct: "HYTE Y70 Touch Infinite Panoramic Case",
    thumbnail: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=300&auto=format&fit=crop&q=80",
    lastUpdated: "2026-08-02",
    status: "Active"
  }
];

export const ADMIN_STATS = {
  totalSales: 248950,
  salesGrowth: "+18.4%",
  totalOrders: 1429,
  ordersGrowth: "+12.1%",
  totalProducts: 348,
  lowStockCount: 7,
  activeCustomers: 5120,
  monthlySales: [
    { month: "Jan", sales: 18400, orders: 98 },
    { month: "Feb", sales: 22100, orders: 114 },
    { month: "Mar", sales: 26800, orders: 135 },
    { month: "Apr", sales: 24200, orders: 122 },
    { month: "May", sales: 31500, orders: 168 },
    { month: "Jun", sales: 38900, orders: 210 },
    { month: "Jul", sales: 42300, orders: 245 },
    { month: "Aug", sales: 44750, orders: 260 }
  ],
  categoryBreakdown: [
    { category: "Graphics Cards", percentage: 42, color: "#00f0ff" },
    { category: "Processors (CPUs)", percentage: 26, color: "#9d4edd" },
    { category: "Custom Pre-built Rigs", percentage: 18, color: "#3b82f6" },
    { category: "Chassis & Cooling", percentage: 14, color: "#10b981" }
  ]
};
