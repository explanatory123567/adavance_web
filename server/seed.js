require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verifiedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
    cart: { type: [mongoose.Schema.Types.Mixed], default: [] },
    wishlist: { type: [String], default: [] },
    savedBuilds: { type: [mongoose.Schema.Types.Mixed], default: [] },
    promoOffers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: String,
    brand: String,
    category: String,
    price: Number,
    stock: Number,
    inStock: Boolean,
    image: String,
    description: String,
    performanceScore: Number,
    wattage: Number,
    specs: mongoose.Schema.Types.Mixed,
    featured: Boolean,
    isPopular: Boolean,
    rating: Number,
    reviewsCount: Number,
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    customer: String,
    email: String,
    total: Number,
    status: { type: String, default: "Processing" },
    trackingNumber: String,
    paymentMethod: { type: String, enum: ["GCash", "Cash on Delivery"], default: "GCash" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "To Collect", "Failed"], default: "Pending" },
    promoCode: { type: String, trim: true, uppercase: true },
    promoDiscount: { type: Number, default: 0 },
    items: mongoose.Schema.Types.Mixed,
    date: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, required: true, trim: true },
    recipient: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Address = mongoose.model("Address", addressSchema);

const image =
  "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80";
const products = [
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 449,
    stock: 18,
    image,
    description: "8-core gaming CPU with 3D V-Cache.",
    performanceScore: 96,
    wattage: 120,
    specs: { socket: "AM5", cores: "8C/16T" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 310,
  },
  {
    id: "gpu-1",
    name: "NVIDIA GeForce RTX 5090 32GB",
    brand: "NVIDIA",
    category: "gpu",
    price: 1999,
    stock: 6,
    image,
    description: "Flagship ray-traced gaming graphics card.",
    performanceScore: 99,
    wattage: 575,
    specs: { length: "304mm", vram: "32GB GDDR7" },
    featured: true,
    isPopular: true,
    rating: 4.98,
    reviewsCount: 142,
  },
  {
    id: "mb-1",
    name: "MSI MAG X670E Tomahawk WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 279,
    stock: 14,
    image,
    description: "AM5 DDR5 motherboard with PCIe 5.0.",
    performanceScore: 92,
    wattage: 70,
    specs: { socket: "AM5" },
    featured: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 204,
  },
  {
    id: "ram-1",
    name: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
    brand: "G.Skill",
    category: "ram",
    price: 139,
    stock: 25,
    image,
    description: "Low-latency dual-channel DDR5 kit.",
    performanceScore: 90,
    wattage: 10,
    specs: { speed: "DDR5-6000", capacity: "32GB" },
    featured: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 188,
  },
  {
    id: "storage-1",
    name: "Samsung 990 PRO 2TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 179,
    stock: 22,
    image,
    description: "High-speed PCIe 4.0 NVMe storage.",
    performanceScore: 93,
    wattage: 8,
    specs: { capacity: "2TB", interface: "PCIe 4.0" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 260,
  },
  {
    id: "psu-1",
    name: "Corsair RM1000x Shift 1000W",
    brand: "Corsair",
    category: "psu",
    price: 189,
    stock: 12,
    image,
    description: "ATX 3.0 modular power supply.",
    performanceScore: 91,
    wattage: 1000,
    specs: { efficiency: "80+ Gold" },
    featured: false,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 120,
  },
  {
    id: "case-1",
    name: "Lian Li O11 Dynamic EVO RGB",
    brand: "Lian Li",
    category: "case",
    price: 159,
    stock: 10,
    image,
    description: "Dual-chamber tempered-glass chassis.",
    performanceScore: 88,
    wattage: 0,
    specs: { gpuClearance: "420mm" },
    featured: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 198,
  },
  {
    id: "cooler-1",
    name: "NZXT Kraken Elite 360 RGB",
    brand: "NZXT",
    category: "cooler",
    price: 249,
    stock: 9,
    image,
    description: "360mm liquid CPU cooler with LCD display.",
    performanceScore: 95,
    wattage: 15,
    specs: { sockets: "AM5,LGA1700" },
    featured: true,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 96,
  },
  {
    id: "fans-1",
    name: "Lian Li UNI FAN SL-INFINITY 120 Triple Pack",
    brand: "Lian Li",
    category: "fans",
    price: 99,
    stock: 20,
    image,
    description: "Linked high-airflow RGB fan system.",
    performanceScore: 87,
    wattage: 12,
    specs: { airflow: "63.1 CFM" },
    featured: false,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 88,
  },
].map((product) => ({ ...product, inStock: product.stock > 0 }));

const sampleUsers = [
  {
    name: "System Administrator",
    username: "admin",
    email: "admin@nextgear.local",
    passwordHash: bcrypt.hashSync("admin123", 12),
    role: "admin",
    verifiedAt: new Date(),
    status: "Active",
    cart: [],
    wishlist: [],
    savedBuilds: [],
    promoOffers: [],
  },
  {
    name: "Ava Reyes",
    username: "ava",
    email: "ava@nextgear.local",
    passwordHash: bcrypt.hashSync("user123", 12),
    role: "user",
    verifiedAt: new Date(),
    status: "Active",
    cart: [],
    wishlist: [],
    savedBuilds: [],
  },
  {
    name: "Liam Cole",
    username: "liam",
    email: "liam@nextgear.local",
    passwordHash: bcrypt.hashSync("user123", 12),
    role: "user",
    verifiedAt: new Date(),
    status: "Active",
  },
];

const sampleOrders = [
  { id: "NG-10001", customer: "Ava Reyes", email: "ava@nextgear.local", total: 3890, status: "Paid", paymentMethod: "GCash", paymentStatus: "Paid", date: "2026-08-02", trackingNumber: "NG-US-100001" },
  { id: "NG-10002", customer: "Liam Cole", email: "liam@nextgear.local", total: 2190, status: "Processing", paymentMethod: "Cash on Delivery", paymentStatus: "To Collect", date: "2026-08-05", trackingNumber: "NG-US-100002" },
  { id: "NG-10003", customer: "Maya Patel", email: "maya@nextgear.local", total: 4975, status: "Shipped", paymentMethod: "GCash", paymentStatus: "Paid", date: "2026-08-09", trackingNumber: "NG-US-100003" },
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
  await mongoose.connect(process.env.MONGODB_URI);

  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Address.deleteMany({});

  const createdUsers = await User.insertMany(sampleUsers);
  await Product.insertMany(products);
  await Order.insertMany(sampleOrders);

  const defaultUser = createdUsers.find((user) => user.username === "ava");
  if (defaultUser) {
    await Address.insertMany([
      {
        userId: defaultUser._id,
        label: "Home",
        recipient: "Ava Reyes",
        phone: "+639171234567",
        line1: "123 Luna Street",
        line2: "Unit 4B",
        city: "Cebu City",
        state: "Central Visayas",
        postalCode: "6000",
        country: "Philippines",
        isDefault: true,
      },
      {
        userId: defaultUser._id,
        label: "Office",
        recipient: "Ava Reyes",
        phone: "+639171234567",
        line1: "45 Bayfront Avenue",
        line2: "Floor 7",
        city: "Makati",
        state: "Metro Manila",
        postalCode: "1226",
        country: "Philippines",
        isDefault: false,
      },
    ]);
  }

  console.log(`Seeded ${products.length} products, ${createdUsers.length} users, ${sampleOrders.length} orders, and address records.`);
  await mongoose.disconnect();
}
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
