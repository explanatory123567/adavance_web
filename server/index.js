require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.API_PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const flashSaleEndsAt = process.env.FLASH_SALE_END_AT || "2026-12-31T23:59:59.000Z";
const allowedOrigins = Array.from(
  new Set(
    [clientOrigin, "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"].filter(Boolean),
  ),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "8mb" }));

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verifiedAt: Date,
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
    isNewArrival: { type: Boolean, default: false },
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
    paymentMethod: {
      type: String,
      enum: ["GCash", "Cash on Delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "To Collect", "Failed"],
      default: "Pending",
    },
    gcashReference: { type: String, trim: true, maxlength: 80 },
    promoCode: { type: String, trim: true, uppercase: true },
    promoDiscount: { type: Number, min: 0, max: 1, default: 0 },
    items: mongoose.Schema.Types.Mixed,
    date: String,
  },
  { timestamps: true },
);

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: { type: String, required: true, trim: true, maxlength: 40 },
    recipient: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    line1: { type: String, required: true, trim: true, maxlength: 160 },
    line2: { type: String, trim: true, maxlength: 160 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.index({ userId: 1, isDefault: -1 });

const modelAssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    productId: { type: String, required: true, index: true },
    assignedProduct: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    format: { type: String, enum: ["GLB", "GLTF", "OBJ"], required: true },
    fileSize: { type: String, trim: true },
    polygonCount: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    status: { type: String, enum: ["Active", "Archived"], default: "Active" },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

modelAssetSchema.index({ assignedProduct: 1, status: 1 });

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Address = mongoose.model("Address", addressSchema);
const ModelAsset = mongoose.model("ModelAsset", modelAssetSchema);

function buildModelAssetLookup(id) {
  const rawId = String(id ?? "").trim();
  if (!rawId) return null;

  const candidates = [{ _id: rawId }];
  if (mongoose.isValidObjectId(rawId)) {
    candidates.push({ _id: new mongoose.Types.ObjectId(rawId) });
  }

  return { $or: candidates };
}

async function findModelAssetById(id) {
  const lookup = buildModelAssetLookup(id);
  if (!lookup) return null;
  return ModelAsset.findOne(lookup).lean();
}

async function updateModelAssetById(id, updates) {
  const lookup = buildModelAssetLookup(id);
  if (!lookup) return null;
  return ModelAsset.findOneAndUpdate(
    lookup,
    { $set: updates },
    { new: true, runValidators: true },
  ).lean();
}

async function deleteModelAssetById(id) {
  const lookup = buildModelAssetLookup(id);
  if (!lookup) return null;
  return ModelAsset.findOneAndDelete(lookup).lean();
}

const verificationCodes = new Map();
const fallbackCatalog = [
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 449,
    stock: 18,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "Dual-chamber tempered-glass chassis.",
    performanceScore: 88,
    wattage: 0,
    specs: { gpuClearance: "420mm" },
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
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
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
  {
    id: "fans-1",
    name: "Lian Li UNI FAN SL-INFINITY 120 Triple Pack",
    brand: "Lian Li",
    category: "fans",
    price: 99,
    stock: 20,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    description: "Linked high-airflow RGB fan system.",
    performanceScore: 87,
    wattage: 12,
    specs: { airflow: "63.1 CFM" },
    featured: false,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 88,
    inStock: true,
  },
];
const fallbackUsers = [
  {
    id: "admin-1",
    name: "System Administrator",
    username: "admin",
    email: "admin@nextgear.local",
    passwordHash: bcrypt.hashSync("admin123", 12),
    role: "admin",
    status: "Active",
    verifiedAt: new Date(),
    cart: [],
    wishlist: [],
    savedBuilds: [],
  },
];
const fallbackOrders = [
  { id: "NG-10001", date: "2026-08-02", customer: "Ava Reyes", total: 3890, status: "Paid", email: "admin@nextgear.local" },
  { id: "NG-10002", date: "2026-08-05", customer: "Liam Cole", total: 2190, status: "Processing", email: "admin@nextgear.local" },
  { id: "NG-10003", date: "2026-08-09", customer: "Maya Patel", total: 4975, status: "Shipped", email: "admin@nextgear.local" },
  { id: "NG-10004", date: "2026-08-13", customer: "Noah Smith", total: 2760, status: "Paid", email: "admin@nextgear.local" },
  { id: "NG-10005", date: "2026-08-15", customer: "Isla Gomez", total: 6240, status: "Processing", email: "admin@nextgear.local" },
];
let dbConnected = false;

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar || "",
    role: user.role,
    status: user.status,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };
}

function buildAdminAnalytics({ users = [], products = [], orders = [], addresses = [] }) {
  const userRecords = Array.isArray(users) ? users : [];
  const productRecords = Array.isArray(products) ? products : [];
  const orderRecords = Array.isArray(orders) ? orders : [];
  const addressRecords = Array.isArray(addresses) ? addresses : [];

  const totalSales = orderRecords.reduce((sum, order) => {
    const amount = Number(order.total || 0);
    const status = String(order.status || "").toLowerCase();
    if (status === "failed" || status === "cancelled" || status === "canceled") {
      return sum;
    }
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const orderedByMonth = new Map();
  const now = new Date();
  for (let index = 7; index >= 0; index -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = monthDate.toLocaleString("en-US", { month: "short" });
    orderedByMonth.set(key, { month: key, sales: 0, orders: 0 });
  }

  for (const order of orderRecords) {
    const rawDate = order.date || order.createdAt;
    if (!rawDate) continue;
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) continue;
    const key = parsed.toLocaleString("en-US", { month: "short" });
    const bucket = orderedByMonth.get(key);
    if (!bucket) continue;
    bucket.sales += Number(order.total || 0);
    bucket.orders += 1;
  }

  const monthlySales = Array.from(orderedByMonth.values());
  const currentMonthSales = monthlySales[monthlySales.length - 1]?.sales || 0;
  const previousMonthSales = monthlySales[monthlySales.length - 2]?.sales || 0;
  const currentMonthOrders = monthlySales[monthlySales.length - 1]?.orders || 0;
  const previousMonthOrders = monthlySales[monthlySales.length - 2]?.orders || 0;

  const salesGrowth = previousMonthSales > 0
    ? `${(((currentMonthSales - previousMonthSales) / previousMonthSales) * 100).toFixed(1)}%`
    : currentMonthSales > 0 ? "+100.0%" : "+0.0%";
  const ordersGrowth = previousMonthOrders > 0
    ? `${(((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100).toFixed(1)}%`
    : currentMonthOrders > 0 ? "+100.0%" : "+0.0%";

  const lowStockCount = productRecords.filter((product) => (Number(product.stock) || 0) <= 5).length;
  const activeCustomers = userRecords.filter(
    (user) => user.role !== "admin" && user.status === "Active",
  ).length;

  const categoryTotals = new Map();
  for (const product of productRecords) {
    const categoryName = String(product.category || "Uncategorized");
    categoryTotals.set(categoryName, (categoryTotals.get(categoryName) || 0) + 1);
  }

  const categoryColors = ["#00f0ff", "#9d4edd", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  let categoryIndex = 0;
  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, count]) => ({
      category: category.replace(/(^|\s)([a-z])/g, (match, prefix, letter) => `${prefix}${letter.toUpperCase()}`),
      percentage: productRecords.length ? Math.max(5, Math.round((count / productRecords.length) * 100)) : 0,
      color: categoryColors[categoryIndex++ % categoryColors.length],
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  const normalizedBreakdown = categoryBreakdown.length
    ? categoryBreakdown
    : [{ category: "Hardware", percentage: 100, color: "#00f0ff" }];

  return {
    totalSales,
    salesGrowth,
    totalOrders: orderRecords.length,
    ordersGrowth,
    totalProducts: productRecords.length,
    lowStockCount,
    activeCustomers,
    monthlySales,
    categoryBreakdown: normalizedBreakdown,
    totalAddresses: addressRecords.length,
  };
}

async function verifyCaptcha(token) {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) return false;
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    },
  );
  const result = await response.json();
  return result.success === true;
}

function issueCode(email, purpose) {
  const code = String(crypto.randomInt(100000, 1000000));
  verificationCodes.set(`${purpose}:${email}`, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return code;
}

async function sendCode(email, code) {
  if (!transporter) {
    console.log(`[verification-code] ${email}: ${code}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Next Gear verification code",
    text: `Your Next Gear verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="margin:0;background:#080b16;padding:40px 16px;font-family:Arial,sans-serif;color:#e6edf7;">
        <div style="max-width:520px;margin:0 auto;background:#101729;border:1px solid #263653;border-radius:18px;overflow:hidden;">
          <div style="height:5px;background:linear-gradient(90deg,#00d4ff,#9d4edd,#3b82f6);"></div>
          <div style="padding:34px 34px 30px;">
            <div style="font-size:12px;letter-spacing:3px;color:#00d4ff;font-weight:700;">NEXT GEAR / IDENTITY</div>
            <h1 style="margin:14px 0 10px;font-size:28px;color:#ffffff;">Confirm your access</h1>
            <p style="margin:0;color:#96a6bf;font-size:15px;line-height:1.6;">Use the one-time security code below to continue. This code expires in 10 minutes.</p>
            <div style="margin:28px 0;padding:22px;text-align:center;background:#080b16;border:1px solid #27445e;border-radius:12px;">
              <div style="font-size:11px;letter-spacing:3px;color:#8293ad;font-weight:700;margin-bottom:9px;">VERIFICATION CODE</div>
              <div style="font-size:36px;letter-spacing:10px;color:#00d4ff;font-weight:800;">${code}</div>
            </div>
            <p style="margin:0;color:#73839d;font-size:12px;line-height:1.6;">If you did not request this code, no action is needed. Your account remains secure.</p>
          </div>
          <div style="padding:16px 34px;background:#0b1020;border-top:1px solid #1d2a42;color:#60718b;font-size:11px;">Next Gear secure account services</div>
        </div>
      </div>`,
  });
}

function consumeCode(email, purpose, code) {
  const key = `${purpose}:${email}`;
  const record = verificationCodes.get(key);
  if (!record || record.expiresAt < Date.now() || record.code !== String(code))
    return false;
  verificationCodes.delete(key);
  return true;
}

app.get("/api/health", (req, res) =>
  res.json({ ok: true, database: mongoose.connection.readyState === 1 }),
);
app.get("/api/promotions/CYBER2026", (req, res) => {
  const endsAt = new Date(flashSaleEndsAt);
  res.json({
    code: "CYBER2026",
    discount: 0.1,
    endsAt: endsAt.toISOString(),
    active: Date.now() < endsAt.getTime(),
  });
});
app.post("/api/promotions/random-offer", requireAuth, async (req, res) => {
  if (Math.random() > 0.45) return res.json({ offer: null });
  const discount = [0.05, 0.1, 0.15][crypto.randomInt(0, 3)];
  const offer = { code: `GEAR${crypto.randomInt(1000, 9999)}`, discount, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), usedAt: null };
  await User.findByIdAndUpdate(req.auth.sub, { $push: { promoOffers: offer } });
  res.json({ offer });
});

app.post("/api/auth/request-code", async (req, res) => {
  try {
    const { email: identifier, purpose = "register", captchaToken } = req.body;
    if (!identifier || !(await verifyCaptcha(captchaToken)))
      return res
        .status(400)
        .json({ message: "Valid Google reCAPTCHA verification is required." });
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    });
    if (purpose === "register" && existingUser)
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    if (purpose === "login" && !existingUser)
      return res.status(401).json({ message: "Account not found." });
    const destination =
      purpose === "login" ? existingUser.email : normalizedIdentifier;
    await sendCode(destination, issueCode(destination, purpose));
    res.json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Verification email failed:", error.message);
    res
      .status(500)
      .json({
        message:
          "Unable to send verification code. Check SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.",
      });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, username, password, code } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    if (!consumeCode(normalizedEmail, "register", code))
      return res
        .status(400)
        .json({ message: "Verification code is invalid or expired." });
    if (
      await User.findOne({
        $or: [
          { email: normalizedEmail },
          { username: username.trim().toLowerCase() },
        ],
      })
    )
      return res
        .status(409)
        .json({ message: "Email or username is already registered." });
    const user = await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      username: username.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      verifiedAt: new Date(),
    });
    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Unable to create account." });
  }
});

async function ensureUniqueUsername(baseUsername) {
  const root = String(baseUsername || "nextgear-user")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 28) || "nextgear-user";

  let candidate = root;
  let counter = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${root}${counter}`;
    counter += 1;
  }

  return candidate;
}

app.post("/api/auth/google", async (req, res) => {
  try {
    const { googleToken, email, name, avatar, username } = req.body;
    let profile = null;

    if (googleToken) {
      const parts = String(googleToken).split(".");
      if (parts.length >= 2) {
        const payloadPart = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = payloadPart + "=".repeat((4 - (payloadPart.length % 4)) % 4);
        const decoded = Buffer.from(padded, "base64").toString("utf8");
        profile = JSON.parse(decoded);
      }
    }

    const normalizedEmail = String(profile?.email || email || "").trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@"))
      return res.status(400).json({ message: "Google email is required." });

    if (profile && profile.iss && !["accounts.google.com", "https://accounts.google.com"].includes(profile.iss)) {
      return res.status(401).json({ message: "Invalid Google token issuer." });
    }

    if (!dbConnected) {
      const existingUser = fallbackUsers.find(
        (user) => user.email === normalizedEmail || user.username === String(username || "").trim().toLowerCase(),
      );

      if (existingUser) {
        if (existingUser.status === "Suspended")
          return res.status(403).json({ message: "This account is suspended." });
        return res.json({
          token: createToken({ ...existingUser, _id: existingUser.id }),
          user: publicUser({ ...existingUser, _id: existingUser.id }),
        });
      }

      const generatedUsername = String(username || name || profile?.given_name || normalizedEmail.split("@")[0] || "google-user")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "")
        .slice(0, 28) || "google-user";

      const finalUsername = await ensureUniqueUsername(generatedUsername);
      const newUser = {
        id: `google-${Date.now()}`,
        name: name || profile?.name || "Google User",
        email: normalizedEmail,
        username: finalUsername,
        passwordHash: await bcrypt.hash(`google-${Date.now()}-${Math.random().toString(36).slice(2)}`, 12),
        role: "user",
        verifiedAt: new Date(),
        status: "Active",
        avatar: avatar || profile?.picture || "",
      };

      fallbackUsers.push(newUser);
      return res.json({
        token: createToken({ ...newUser, _id: newUser.id }),
        user: publicUser({ ...newUser, _id: newUser.id }),
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.status !== "Active")
        return res.status(403).json({ message: "This account is suspended." });
      return res.json({ token: createToken(existingUser), user: publicUser(existingUser) });
    }

    const fallbackUsername = String(username || name || profile?.given_name || normalizedEmail.split("@")[0] || "google-user")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 28) || "google-user";

    const uniqueUsername = await ensureUniqueUsername(fallbackUsername);
    const user = await User.create({
      name: name || profile?.name || "Google User",
      username: uniqueUsername,
      email: normalizedEmail,
      avatar: avatar || profile?.picture || "",
      passwordHash: await bcrypt.hash(`google-${Date.now()}-${Math.random().toString(36).slice(2)}`, 12),
      verifiedAt: new Date(),
      role: "user",
      status: "Active",
    });

    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Google auth failed:", error.message);
    res.status(500).json({ message: "Unable to complete Google sign-in." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!dbConnected) {
      const normalizedIdentifier = String(identifier || "").trim().toLowerCase();
      const match = fallbackUsers.find(
        (user) =>
          user.email === normalizedIdentifier ||
          user.username === normalizedIdentifier,
      );
      if (!match || !(await bcrypt.compare(password, match.passwordHash)))
        return res.status(401).json({ message: "Invalid credentials." });
      return res.json({
        token: createToken({ ...match, _id: match.id }),
        user: publicUser({ ...match, _id: match.id }),
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { username: identifier.trim().toLowerCase() },
      ],
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: "Invalid credentials." });
    if (user.status !== "Active")
      return res.status(403).json({ message: "This account is suspended." });
    if (!user.verifiedAt)
      return res
        .status(403)
        .json({
          message: "Please complete account verification before signing in.",
        });
    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Unable to sign in." });
  }
});

function requireAuth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication required." });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userRole = req.auth.role || "user";
    const normalizedRoles = allowedRoles.map((role) => String(role).toLowerCase());

    if (!normalizedRoles.length || !normalizedRoles.includes(userRole.toLowerCase())) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ") || "authorized user"}.`,
      });
    }

    next();
  };
}

function requireAdmin(req, res, next) {
  return requireRole(["admin"])(req, res, next);
}

app.get("/api/catalog", async (req, res) => {
  if (!dbConnected) return res.json(fallbackCatalog);
  res.json(await Product.find().sort({ category: 1, name: 1 }).lean());
});
app.get("/api/orders", requireAuth, async (req, res) => {
  if (!dbConnected) {
    const visibleOrders = req.auth.role === "admin"
      ? fallbackOrders
      : fallbackOrders.filter((order) => order.email === req.auth.email);
    return res.json(visibleOrders);
  }

  const query = req.auth.role === "admin" ? {} : { email: req.auth.email };
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
  res.json(orders.map((order) => ({ ...order, id: order.id || order._id.toString() })));
});
app.get("/api/admin/analytics", requireAuth, requireAdmin, async (req, res) => {
  if (!dbConnected) {
    return res.json(
      buildAdminAnalytics({
        users: fallbackUsers,
        products: fallbackCatalog,
        orders: fallbackOrders,
        addresses: [],
      }),
    );
  }

  const [users, products, orders, addresses] = await Promise.all([
    User.find().select("-passwordHash").sort({ createdAt: -1 }).lean(),
    Product.find().sort({ category: 1, name: 1 }).lean(),
    Order.find().sort({ createdAt: -1 }).lean(),
    Address.find().sort({ createdAt: -1 }).lean(),
  ]);

  res.json(
    buildAdminAnalytics({
      users: users.map((user) => ({ ...user, id: user._id.toString() })),
      products,
      orders: orders.map((order) => ({ ...order, id: order.id || order._id.toString() })),
      addresses,
    }),
  );
});
app.get("/api/account", requireAuth, async (req, res) => {
  if (!dbConnected) {
    const user = fallbackUsers.find(
      (item) => item.email === req.auth.email || item.id === req.auth.sub,
    );
    return res.json({
      cart: user?.cart || [],
      wishlist: user?.wishlist || [],
      savedBuilds: user?.savedBuilds || [],
      orders: req.auth.role === "admin"
        ? fallbackOrders
        : fallbackOrders.filter((order) => order.email === req.auth.email),
      addresses: [],
    });
  }

  const user = await User.findById(req.auth.sub)
    .select("cart wishlist savedBuilds")
    .lean();
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json({
    cart: user.cart || [],
    wishlist: user.wishlist || [],
    savedBuilds: user.savedBuilds || [],
    orders: await Order.find({ email: req.auth.email })
      .sort({ createdAt: -1 })
      .lean(),
    addresses: await Address.find({ userId: req.auth.sub })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean(),
  });
});
app.patch("/api/account", requireAuth, async (req, res) => {
  const allowed = {};
  if (Array.isArray(req.body.cart)) allowed.cart = req.body.cart;
  if (Array.isArray(req.body.wishlist)) allowed.wishlist = req.body.wishlist;
  if (Array.isArray(req.body.savedBuilds))
    allowed.savedBuilds = req.body.savedBuilds;
  const user = await User.findByIdAndUpdate(
    req.auth.sub,
    { $set: allowed },
    { new: true },
  )
    .select("cart wishlist savedBuilds")
    .lean();
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json(user);
});
app.patch("/api/profile", requireAuth, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const username = String(req.body.username || "")
    .trim()
    .toLowerCase();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  if (!name || !username || !email)
    return res
      .status(400)
      .json({ message: "Name, username, and email are required." });
  const duplicate = await User.findOne({
    $or: [{ email }, { username }],
    _id: { $ne: req.auth.sub },
  }).lean();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "That email or username is already in use." });
  const avatar =
    typeof req.body.avatar === "string" ? req.body.avatar : undefined;
  const updates = { name, username, email };
  if (avatar !== undefined) updates.avatar = avatar;
  const user = await User.findByIdAndUpdate(
    req.auth.sub,
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json({ token: createToken(user), user: publicUser(user) });
});
app.get("/api/users", requireAuth, requireRole(["admin"]), async (req, res) => {
  if (!dbConnected) {
    return res.json(
      fallbackUsers.map((user) => ({
        ...user,
        id: user.id,
        _id: user.id,
      })),
    );
  }
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();
  res.json(users.map((user) => ({ ...user, id: user._id.toString() })));
});
app.get("/api/models", async (req, res) => {
  if (!dbConnected) return res.json([]);
  res.json(
    await ModelAsset.find({ status: "Active" }).sort({ createdAt: -1 }).lean(),
  );
});
app.post("/api/models", requireAuth, requireAdmin, async (req, res) => {
  const asset = await ModelAsset.create({
    ...req.body,
    uploadedBy: req.auth.sub,
  });
  res.status(201).json(asset);
});
app.patch("/api/models/:id", requireAuth, requireAdmin, async (req, res) => {
  const asset = await updateModelAssetById(req.params.id, req.body);
  if (!asset)
    return res.status(404).json({ message: "3D model asset not found." });
  res.json(asset);
});
app.delete("/api/models/:id", requireAuth, requireAdmin, async (req, res) => {
  const asset = await deleteModelAssetById(req.params.id);
  if (!asset)
    return res.status(404).json({ message: "3D model asset not found." });
  res.status(204).end();
});
app.get("/api/addresses", requireAuth, async (req, res) =>
  res.json(
    await Address.find({ userId: req.auth.sub })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean(),
  ),
);
app.post("/api/addresses", requireAuth, async (req, res) => {
  if (req.body.isDefault)
    await Address.updateMany(
      { userId: req.auth.sub },
      { $set: { isDefault: false } },
    );
  res
    .status(201)
    .json(await Address.create({ ...req.body, userId: req.auth.sub }));
});
app.patch("/api/addresses/:id", requireAuth, async (req, res) => {
  if (req.body.isDefault)
    await Address.updateMany(
      { userId: req.auth.sub },
      { $set: { isDefault: false } },
    );
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.auth.sub },
    { $set: req.body },
    { new: true, runValidators: true },
  ).lean();
  if (!address) return res.status(404).json({ message: "Address not found." });
  res.json(address);
});
app.delete("/api/addresses/:id", requireAuth, async (req, res) => {
  await Address.deleteOne({ _id: req.params.id, userId: req.auth.sub });
  res.status(204).end();
});
app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.create({
    ...req.body,
    id:
      req.body.id ||
      `${req.body.category || "product"}-${crypto.randomInt(100000, 999999)}`,
  });
  res.status(201).json(product);
});
app.patch("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true },
  ).lean();
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});
app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  await Product.deleteOne({ id: req.params.id });
  res.status(204).end();
});
app.patch(
  "/api/orders/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true },
    ).lean();
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  },
);
app.patch(
  "/api/users/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true },
    )
      .select("-passwordHash")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  },
);
app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
  if (req.auth.sub === req.params.id) {
    return res.status(400).json({ message: "You cannot delete your own admin account." });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  if (user.role === "admin") {
    return res.status(403).json({ message: "Admin accounts cannot be deleted from this panel." });
  }

  await User.deleteOne({ _id: req.params.id });
  res.status(204).end();
});
app.post("/api/orders", requireAuth, async (req, res) => {
  const { paymentMethod, gcashReference, promoCode } = req.body;
  if (!["GCash", "Cash on Delivery"].includes(paymentMethod))
    return res
      .status(400)
      .json({ message: "Choose GCash or Cash on Delivery." });
  if (paymentMethod === "GCash" && !gcashReference)
    return res
      .status(400)
      .json({ message: "GCash reference number is required." });
  let validPromoCode;
  let validPromoDiscount = 0;
  let randomOffer;
  if (promoCode) {
    const endsAt = new Date(flashSaleEndsAt);
    if (promoCode.toUpperCase() === "CYBER2026" && Date.now() < endsAt.getTime()) {
      validPromoCode = "CYBER2026";
      validPromoDiscount = 0.1;
    } else {
      randomOffer = await User.findOne({ _id: req.auth.sub, promoOffers: { $elemMatch: { code: promoCode.toUpperCase(), usedAt: null, expiresAt: { $gt: new Date() } } } }, { promoOffers: 1 }).lean();
      const matchedOffer = randomOffer?.promoOffers?.find((offer) => offer.code === promoCode.toUpperCase() && !offer.usedAt && new Date(offer.expiresAt) > new Date());
      if (!matchedOffer) return res.status(400).json({ message: "This promotion has expired or is invalid." });
      validPromoCode = matchedOffer.code;
      validPromoDiscount = matchedOffer.discount;
    }
    if (validPromoCode === "CYBER2026" && await Order.exists({ email: req.auth.email, promoCode: "CYBER2026" }))
      return res.status(409).json({ message: "This promotion has already been used on your account." });
    if (validPromoCode !== "CYBER2026" && randomOffer && await Order.exists({ email: req.auth.email, promoCode: validPromoCode }))
      return res.status(409).json({ message: "This promotion has already been used on your account." });
  }
  const order = await Order.create({
    ...req.body,
    paymentMethod,
    gcashReference: paymentMethod === "GCash" ? gcashReference : undefined,
    promoCode: validPromoCode,
    promoDiscount: validPromoDiscount,
    paymentStatus: paymentMethod === "GCash" ? "Pending" : "To Collect",
    id: `NG-${crypto.randomInt(10000, 100000)}`,
    email: req.auth.email,
    date: new Date().toISOString().slice(0, 10),
    trackingNumber: `NG-US-${crypto.randomInt(100000000, 1000000000)}`,
  });
  if (validPromoCode && validPromoCode !== "CYBER2026") await User.updateOne({ _id: req.auth.sub, "promoOffers.code": validPromoCode }, { $set: { "promoOffers.$.usedAt": new Date() } });
  res.status(201).json(order);
});

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is required in .env.");
    process.exit(1);
  }

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      dbConnected = true;
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.warn("MongoDB unavailable; starting in demo mode.");
      console.warn(error.message);
    }
  } else {
    console.warn("MONGODB_URI missing; starting in demo mode.");
  }

  app.listen(port, () =>
    console.log(`API listening on http://localhost:${port}${dbConnected ? " (database connected)" : " (demo mode)"}`),
  );
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
