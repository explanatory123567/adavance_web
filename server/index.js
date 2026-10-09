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

app.post("/api/newsletter/subscribe", async (req, res) => {
  const email =
    typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  if (!dbConnected) {
    const alreadySubscribed = fallbackNewsletterSubscribers.has(email);
    fallbackNewsletterSubscribers.add(email);
    return res.status(alreadySubscribed ? 200 : 201).json({
      message: alreadySubscribed
        ? "This email is already subscribed."
        : "Subscription saved for this server session.",
      alreadySubscribed,
    });
  }

  try {
    await NewsletterSubscriber.create({ email });
    return res.status(201).json({ message: "Subscription saved." });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(200)
        .json({ message: "This email is already subscribed.", alreadySubscribed: true });
    }
    throw error;
  }
});

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
    discordId: { type: String, unique: true, sparse: true },
    discordUsername: { type: String, default: "" },
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
    customerPhone: String,
    shippingAddress: String,
    city: String,
    postalCode: String,
    country: String,
    shippingMethod: String,
    shippingCost: Number,
    tax: Number,
    total: Number,
    status: { type: String, default: "Processing" },
    statusHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
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

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    audience: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    page: { type: String, default: "home" },
    tab: { type: String, default: "" },
    readBy: { type: [String], default: [] },
  },
  { timestamps: true },
);

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    comment: { type: String, required: true, maxlength: 2000 },
    adminReply: { type: String, default: "", maxlength: 2000 },
    adminReplyAt: Date,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
      index: true,
    },
  },
  { timestamps: true },
);
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
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
const Notification = mongoose.model("Notification", notificationSchema);
const Review = mongoose.model("Review", reviewSchema);
const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema,
);
const fallbackNewsletterSubscribers = new Set();

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
const fallbackNotifications = [];
const fallbackReviews = [];
let dbConnected = false;
const discordOAuthStates = new Map();

async function publishNotification(notificationData) {
  const notification = {
    id: `NT-${Date.now()}-${crypto.randomInt(1000, 10000)}`,
    createdAt: new Date(),
    ...notificationData,
    readBy: [],
  };
  try {
    if (dbConnected) await Notification.create(notification);
    else fallbackNotifications.unshift(notification);
    if (!dbConnected) fallbackNotifications.splice(200);
  } catch (error) {
    console.error("Notification could not be saved:", error.message);
  }
}

function serializeNotification(notification, email) {
  const { _id, readBy = [], ...data } = notification;
  return {
    ...data,
    id: data.id || _id?.toString(),
    isRead: readBy.includes(email),
  };
}

function serializeReview(review, includePrivate = false) {
  const { _id, email, userId, ...data } = review;
  return {
    ...data,
    id: data.id || _id?.toString(),
    ...(includePrivate ? { email, userId } : {}),
  };
}

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
    id: user._id?.toString() || user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    discordId: user.discordId || "",
    discordUsername: user.discordUsername || "",
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

async function sendCode(email, code, purpose = "register") {
  const isPasswordReset = purpose === "reset";
  if (!transporter) {
    console.log(`[${isPasswordReset ? "password-reset" : "verification"}-code] ${email}: ${code}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: isPasswordReset ? "Next Gear password reset code" : "Next Gear verification code",
    text: `Your Next Gear ${isPasswordReset ? "password reset" : "verification"} code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="margin:0;background:#080b16;padding:40px 16px;font-family:Arial,sans-serif;color:#e6edf7;">
        <div style="max-width:520px;margin:0 auto;background:#101729;border:1px solid #263653;border-radius:18px;overflow:hidden;">
          <div style="height:5px;background:linear-gradient(90deg,#00d4ff,#9d4edd,#3b82f6);"></div>
          <div style="padding:34px 34px 30px;">
            <div style="font-size:12px;letter-spacing:3px;color:#00d4ff;font-weight:700;">NEXT GEAR / IDENTITY</div>
            <h1 style="margin:14px 0 10px;font-size:28px;color:#ffffff;">${isPasswordReset ? "Reset your password" : "Confirm your access"}</h1>
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
    if (!["register", "login", "reset"].includes(purpose))
      return res.status(400).json({ message: "Unsupported verification purpose." });
    if (!identifier || !(await verifyCaptcha(captchaToken)))
      return res
        .status(400)
        .json({ message: "Valid Google reCAPTCHA verification is required." });
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const existingUser = dbConnected
      ? await User.findOne({
          $or: [
            { email: normalizedIdentifier },
            { username: normalizedIdentifier },
          ],
        })
      : fallbackUsers.find(
          (user) => user.email === normalizedIdentifier || user.username === normalizedIdentifier,
        );
    if (purpose === "register" && existingUser)
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    if (purpose === "login" && !existingUser)
      return res.status(401).json({ message: "Account not found." });
    if (purpose === "reset" && !existingUser) {
      return res.json({ message: "If the account exists, a reset code was sent." });
    }
    const destination = purpose === "register"
      ? normalizedIdentifier
      : existingUser.email;
    await sendCode(destination, issueCode(destination, purpose), purpose);
    res.json({
      message: purpose === "reset"
        ? "If the account exists, a reset code was sent."
        : "Verification code sent.",
    });
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

app.post("/api/auth/reset-password", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").trim();
  const password = String(req.body.password || "");
  if (!email || password.length < 8) {
    return res.status(400).json({ message: "Enter a valid email and a password with at least 8 characters." });
  }
  if (!consumeCode(email, "reset", code)) {
    return res.status(400).json({ message: "Reset code is invalid or expired." });
  }
  if (!dbConnected) {
    const user = fallbackUsers.find((item) => item.email === email);
    if (!user) return res.status(400).json({ message: "Reset code is invalid or expired." });
    user.passwordHash = await bcrypt.hash(password, 12);
    return res.json({ message: "Password updated successfully." });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Reset code is invalid or expired." });
  user.passwordHash = await bcrypt.hash(password, 12);
  await user.save();
  res.json({ message: "Password updated successfully." });
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

function requireDatabase(req, res, next) {
  if (!dbConnected) {
    return res.status(503).json({ message: "Product catalog is unavailable until the database is connected." });
  }
  next();
}

app.get("/api/catalog", requireDatabase, async (req, res) => {
  res.json(await Product.find().sort({ category: 1, name: 1 }).lean());
});
app.get("/api/notifications", requireAuth, async (req, res) => {
  const audience = req.auth.role === "admin" ? "admins" : "users";
  if (!dbConnected) {
    return res.json(
      fallbackNotifications
        .filter((item) => item.audience === audience || item.audience === req.auth.email)
        .map((item) => serializeNotification(item, req.auth.email)),
    );
  }
  const notifications = await Notification.find({
    audience: { $in: [audience, req.auth.email] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(notifications.map((item) => serializeNotification(item, req.auth.email)));
});
app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
  const audiences = [req.auth.role === "admin" ? "admins" : "users", req.auth.email];
  if (!dbConnected) {
    const notification = fallbackNotifications.find(
      (item) => item.id === req.params.id && audiences.includes(item.audience),
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    if (!notification.readBy.includes(req.auth.email)) notification.readBy.push(req.auth.email);
    return res.json(serializeNotification(notification, req.auth.email));
  }
  const notification = await Notification.findOneAndUpdate(
    { id: req.params.id, audience: { $in: audiences } },
    { $addToSet: { readBy: req.auth.email } },
    { new: true },
  ).lean();
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  res.json(serializeNotification(notification, req.auth.email));
});
app.post("/api/notifications/read-all", requireAuth, async (req, res) => {
  const audiences = [req.auth.role === "admin" ? "admins" : "users", req.auth.email];
  if (!dbConnected) {
    fallbackNotifications.forEach((item) => {
      if (audiences.includes(item.audience) && !item.readBy.includes(req.auth.email)) {
        item.readBy.push(req.auth.email);
      }
    });
    return res.json({ updated: true });
  }
  await Notification.updateMany(
    { audience: { $in: audiences }, readBy: { $ne: req.auth.email } },
    { $addToSet: { readBy: req.auth.email } },
  );
  res.json({ updated: true });
});
app.get("/api/reviews", async (req, res) => {
  if (!dbConnected) {
    return res.json(
      fallbackReviews
        .map((review) => serializeReview(review)),
    );
  }
  const reviews = await Review.find().sort({ createdAt: -1 }).lean();
  res.json(reviews.map((review) => serializeReview(review)));
});
app.get("/api/reviews/mine", requireAuth, async (req, res) => {
  if (!dbConnected) {
    return res.json(
      fallbackReviews
        .filter((review) => review.userId === req.auth.sub)
        .map((review) => serializeReview(review)),
    );
  }
  const reviews = await Review.find({ userId: req.auth.sub })
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews.map((review) => serializeReview(review)));
});
app.post("/api/reviews", requireAuth, async (req, res) => {
  const productId = String(req.body.productId || "").trim();
  const productName = String(req.body.productName || "").trim().slice(0, 160);
  const title = String(req.body.title || "").trim().slice(0, 100);
  const comment = String(req.body.comment || "").trim().slice(0, 2000);
  const rating = Number(req.body.rating);
  if (!productId || !productName || !title || comment.length < 10 ||
      !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Provide a product, 1-5 star rating, title, and review of at least 10 characters." });
  }
  const user = dbConnected
    ? await User.findById(req.auth.sub).select("name").lean()
    : fallbackUsers.find((item) => item.id === req.auth.sub || item.email === req.auth.email);
  const reviewData = {
    id: `RV-${Date.now()}-${crypto.randomInt(1000, 10000)}`,
    productId,
    productName,
    userId: req.auth.sub,
    userName: user?.name || req.auth.email.split("@")[0],
    email: req.auth.email,
    rating,
    title,
    comment,
    status: "Approved",
  };
  if (!dbConnected) {
    if (fallbackReviews.some((item) => item.productId === productId && item.userId === req.auth.sub)) {
      return res.status(409).json({ message: "You have already reviewed this product." });
    }
    fallbackReviews.unshift({ ...reviewData, createdAt: new Date() });
    await publishNotification({
      audience: "admins",
      title: "New customer review",
      message: `${reviewData.userName} reviewed ${productName}.`,
      type: "review",
      page: "admin",
      tab: "reviews",
    });
    return res.status(201).json(serializeReview(fallbackReviews[0]));
  }
  if (await Review.exists({ productId, userId: req.auth.sub })) {
    return res.status(409).json({ message: "You have already reviewed this product." });
  }
  try {
    const review = await Review.create(reviewData);
    await publishNotification({
      audience: "admins",
      title: "New customer review",
      message: `${reviewData.userName} reviewed ${productName}.`,
      type: "review",
      page: "admin",
      tab: "reviews",
    });
    return res.status(201).json(serializeReview(review.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this product." });
    }
    throw error;
  }
});
app.get("/api/admin/reviews", requireAuth, requireAdmin, async (req, res) => {
  if (!dbConnected) {
    return res.json(fallbackReviews.map((review) => serializeReview(review, true)));
  }
  const reviews = await Review.find().sort({ createdAt: -1 }).lean();
  res.json(reviews.map((review) => serializeReview(review, true)));
});
app.patch("/api/admin/reviews/:id/reply", requireAuth, requireAdmin, async (req, res) => {
  const adminReply = String(req.body.reply || "").trim().slice(0, 2000);
  if (!adminReply) return res.status(400).json({ message: "Write a reply before saving." });
  let review;
  if (!dbConnected) {
    review = fallbackReviews.find((item) => item.id === req.params.id);
    if (review) {
      review.adminReply = adminReply;
      review.adminReplyAt = new Date();
    }
  } else {
    review = await Review.findOneAndUpdate(
      { id: req.params.id },
      { $set: { adminReply, adminReplyAt: new Date() } },
      { new: true },
    ).lean();
  }
  if (!review) return res.status(404).json({ message: "Review not found." });
  await publishNotification({
    audience: review.email,
    title: "Response to your review",
    message: `The store replied to your review of ${review.productName}.`,
    type: "review",
    page: "components",
  });
  res.json(serializeReview(review, true));
});
app.delete("/api/admin/reviews/:id", requireAuth, requireAdmin, async (req, res) => {
  if (!dbConnected) {
    const index = fallbackReviews.findIndex((item) => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ message: "Review not found." });
    fallbackReviews.splice(index, 1);
    return res.status(204).end();
  }
  const result = await Review.deleteOne({ id: req.params.id });
  if (!result.deletedCount) return res.status(404).json({ message: "Review not found." });
  res.status(204).end();
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
        products: [],
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
    orders: await Order.find(
      req.auth.role === "admin" ? {} : { email: req.auth.email },
    )
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
  if (!dbConnected) {
    const user = fallbackUsers.find(
      (item) => item.email === req.auth.email || item.id === req.auth.sub,
    );
    if (!user) return res.status(404).json({ message: "Account not found." });
    Object.assign(user, allowed);
    return res.json({
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      savedBuilds: user.savedBuilds || [],
    });
  }
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
app.get("/api/profile", requireAuth, async (req, res) => {
  if (!dbConnected) {
    const user = fallbackUsers.find(
      (item) => item.email === req.auth.email || item.id === req.auth.sub,
    );
    if (!user) return res.status(404).json({ message: "Account not found." });
    return res.json(publicUser(user));
  }
  const user = await User.findById(req.auth.sub).lean();
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json(publicUser(user));
});
app.post("/api/discord/connect", requireAuth, (req, res) => {
  const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } =
    process.env;
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
    return res.status(503).json({
      message:
        "Discord OAuth is not configured. Set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_REDIRECT_URI in the API environment.",
    });
  }

  const now = Date.now();
  for (const [state, entry] of discordOAuthStates) {
    if (entry.expiresAt <= now || entry.userId === req.auth.sub) {
      discordOAuthStates.delete(state);
    }
  }
  const state = crypto.randomBytes(32).toString("hex");
  discordOAuthStates.set(state, {
    userId: req.auth.sub,
    expiresAt: now + 10 * 60 * 1000,
  });

  const authorizationUrl = new URL("https://discord.com/oauth2/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify",
    state,
  }).toString();
  res.json({ authorizationUrl: authorizationUrl.toString() });
});
app.get("/api/discord/callback", async (req, res) => {
  const redirectToClient = (status) => {
    const redirectUrl = new URL(clientOrigin);
    redirectUrl.searchParams.set("discord", status);
    return res.redirect(redirectUrl.toString());
  };
  const state = String(req.query.state || "");
  const pending = discordOAuthStates.get(state);
  if (state) discordOAuthStates.delete(state);
  if (!pending || pending.expiresAt <= Date.now()) {
    return redirectToClient("error");
  }
  if (req.query.error) return redirectToClient("cancelled");
  const code = String(req.query.code || "");
  if (!code) return redirectToClient("error");

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });
    if (!tokenResponse.ok) {
      throw new Error(`Discord token exchange failed (${tokenResponse.status}).`);
    }
    const tokenData = await tokenResponse.json();
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!discordResponse.ok) {
      throw new Error(`Discord profile request failed (${discordResponse.status}).`);
    }
    const discordUser = await discordResponse.json();
    if (!discordUser.id || !discordUser.username) {
      throw new Error("Discord did not return a valid user profile.");
    }

    if (!dbConnected) {
      const user = fallbackUsers.find(
        (item) => item.id === pending.userId || item._id === pending.userId,
      );
      const linkedUser = fallbackUsers.find(
        (item) => item.discordId === discordUser.id && item !== user,
      );
      if (!user || linkedUser) throw new Error("This Discord account cannot be linked.");
      user.discordId = discordUser.id;
      user.discordUsername = discordUser.username;
    } else {
      const linkedUser = await User.findOne({ discordId: discordUser.id }).lean();
      if (linkedUser && linkedUser._id.toString() !== pending.userId) {
        throw new Error("This Discord account is already linked to another profile.");
      }
      const user = await User.findByIdAndUpdate(
        pending.userId,
        {
          $set: {
            discordId: discordUser.id,
            discordUsername: discordUser.username,
          },
        },
        { new: true, runValidators: true },
      );
      if (!user) throw new Error("Account not found.");
    }
    return redirectToClient("connected");
  } catch (error) {
    console.error("Discord account linking failed:", error.message);
    return redirectToClient("error");
  }
});
app.post("/api/discord/disconnect", requireAuth, async (req, res) => {
  if (!dbConnected) {
    const user = fallbackUsers.find(
      (item) => item.email === req.auth.email || item.id === req.auth.sub,
    );
    if (!user) return res.status(404).json({ message: "Account not found." });
    delete user.discordId;
    delete user.discordUsername;
    return res.json(publicUser(user));
  }
  const user = await User.findByIdAndUpdate(
    req.auth.sub,
    { $unset: { discordId: "", discordUsername: "" } },
    { new: true },
  );
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json(publicUser(user));
});
app.get("/api/users", requireAuth, requireRole(["admin"]), async (req, res) => {
  if (!dbConnected) {
    return res.json(
      fallbackUsers.map((user) => ({
        ...user,
        id: user.id,
        _id: user.id,
        ordersCount: 0,
        totalSpent: 0,
      })),
    );
  }
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();
  const orderSummaries = await Order.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $in: [
                { $toLower: { $ifNull: ["$email", ""] } },
                users.map((user) => user.email.toLowerCase()),
              ],
            },
            {
              $not: [
                {
                  $in: [
                    { $toLower: { $ifNull: ["$status", ""] } },
                    ["cancelled", "canceled", "failed"],
                  ],
                },
              ],
            },
            {
              $ne: [
                { $toLower: { $ifNull: ["$paymentStatus", ""] } },
                "failed",
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: { $toLower: "$email" },
        ordersCount: { $sum: 1 },
        totalSpent: { $sum: { $ifNull: ["$total", 0] } },
      },
    },
  ]);
  const summariesByEmail = new Map(
    orderSummaries.map((summary) => [summary._id, summary]),
  );
  res.json(
    users.map((user) => {
      const summary = summariesByEmail.get(user.email.toLowerCase());
      return {
        ...user,
        id: user._id.toString(),
        ordersCount: summary?.ordersCount || 0,
        totalSpent: summary?.totalSpent || 0,
      };
    }),
  );
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
app.post("/api/products", requireAuth, requireAdmin, requireDatabase, async (req, res) => {
  const productData = {
    ...req.body,
    id:
      req.body.id ||
      `${req.body.category || "product"}-${crypto.randomInt(100000, 999999)}`,
  };
  const product = await Product.create(productData);
  await publishNotification({
    audience: "users",
    title: "New product added",
    message: `${product.name} is now available in the components shop.`,
    type: "product",
    page: "components",
  });
  if ((Number(product.stock) || 0) <= 5) {
    await publishNotification({
      audience: "admins",
      title: "Low stock alert",
      message: `${product.name} was added with ${Number(product.stock) || 0} units in stock.`,
      type: "inventory",
      page: "admin",
      tab: "inventory",
    });
  }
  res.status(201).json(product);
});
app.patch("/api/products/:id", requireAuth, requireAdmin, requireDatabase, async (req, res) => {
  const previousProduct = await Product.findOne({ id: req.params.id }).lean();
  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true },
  ).lean();
  if (!product) return res.status(404).json({ message: "Product not found." });
  if (
    previousProduct &&
    (Number(previousProduct.stock) || 0) > 5 &&
    (Number(product.stock) || 0) <= 5
  ) {
    await publishNotification({
      audience: "admins",
      title: "Low stock alert",
      message: `${product.name} now has ${Number(product.stock) || 0} units in stock.`,
      type: "inventory",
      page: "admin",
      tab: "inventory",
    });
  }
  res.json(product);
});
app.delete("/api/products/:id", requireAuth, requireAdmin, requireDatabase, async (req, res) => {
  await Product.deleteOne({ id: req.params.id });
  res.status(204).end();
});
app.patch(
  "/api/orders/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Choose a valid order status." });
    }
    if (!dbConnected) {
      const demoOrder = fallbackOrders.find(
        (item) => item.id === req.params.id,
      );
      if (!demoOrder) return res.status(404).json({ message: "Order not found." });
      if (demoOrder.status === req.body.status) return res.json(demoOrder);
      demoOrder.status = req.body.status;
      demoOrder.statusHistory = [
        ...(demoOrder.statusHistory || []),
        { status: demoOrder.status, at: new Date(), note: "Status updated" },
      ];
      await publishNotification({
        audience: demoOrder.email,
        title: "Order status updated",
        message: `Order #${demoOrder.id} is now ${demoOrder.status}.`,
        type: "order",
        page: "orders",
      });
      return res.json(demoOrder);
    }

    const existingOrder = await Order.findOne({ id: req.params.id }).lean();
    if (!existingOrder) return res.status(404).json({ message: "Order not found." });
    if (existingOrder.status === req.body.status) return res.json(existingOrder);
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: { status: req.body.status },
        $push: {
          statusHistory: {
            status: req.body.status,
            at: new Date(),
            note: "Status updated",
          },
        },
      },
      { new: true },
    ).lean();
    if (!order) return res.status(404).json({ message: "Order not found." });
    await publishNotification({
      audience: order.email,
      title: "Order status updated",
      message: `Order #${order.id} is now ${order.status}.`,
      type: "order",
      page: "orders",
    });
    res.json(order);
  },
);
app.patch(
  "/api/orders/:id/payment-status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const allowedPaymentStatuses = ["Pending", "Paid", "Failed"];
    if (!allowedPaymentStatuses.includes(req.body.paymentStatus)) {
      return res.status(400).json({ message: "Choose a valid payment status." });
    }

    let order;
    if (!dbConnected) {
      order = fallbackOrders.find((item) => item.id === req.params.id);
      if (order?.paymentMethod !== "GCash") {
        return res.status(400).json({
          message: "Only manual GCash payments can be verified here.",
        });
      }
      if (order) order.paymentStatus = req.body.paymentStatus;
    } else {
      order = await Order.findOneAndUpdate(
        { id: req.params.id, paymentMethod: "GCash" },
        { $set: { paymentStatus: req.body.paymentStatus } },
        { new: true, runValidators: true },
      ).lean();
    }
    if (!order) return res.status(404).json({ message: "GCash order not found." });

    await publishNotification({
      audience: order.email,
      title: "Payment status updated",
      message: `Your GCash payment for order #${order.id} is ${req.body.paymentStatus.toLowerCase()}.`,
      type: "order",
      page: "orders",
    });
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
  const paymentReference =
    typeof gcashReference === "string" ? gcashReference.trim() : "";
  if (paymentMethod === "GCash" && !paymentReference)
    return res.status(400).json({
      message: "Enter the transaction reference from your GCash receipt.",
    });
  if (paymentMethod === "GCash" && paymentReference.length > 80)
    return res.status(400).json({
      message: "GCash reference must be 80 characters or fewer.",
    });
  if (!dbConnected) {
    const order = {
      ...req.body,
      id: `NG-${crypto.randomInt(10000, 100000)}`,
      email: req.auth.email,
      date: new Date().toISOString().slice(0, 10),
      status: paymentMethod === "GCash" ? "Pending" : "Processing",
      trackingNumber: `NG-US-${crypto.randomInt(100000000, 1000000000)}`,
      paymentStatus: paymentMethod === "GCash" ? "Pending" : "To Collect",
      gcashReference: paymentMethod === "GCash" ? paymentReference : undefined,
      statusHistory: [
        {
          status: paymentMethod === "GCash" ? "Pending" : "Processing",
          at: new Date(),
          note:
            paymentMethod === "GCash"
              ? "Awaiting manual GCash payment verification"
              : "Order placed",
        },
      ],
    };
    fallbackOrders.unshift(order);
    await Promise.all([
      publishNotification({
        audience: "admins",
        title: "New order received",
        message: `Order #${order.id} was placed by ${order.customer}.`,
        type: "order",
        page: "admin",
        tab: "orders",
      }),
      publishNotification({
        audience: req.auth.email,
        title: "Order placed",
        message: `Order #${order.id} is being processed.`,
        type: "order",
        page: "orders",
      }),
    ]);
    return res.status(201).json(order);
  }
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
    gcashReference: paymentMethod === "GCash" ? paymentReference : undefined,
    promoCode: validPromoCode,
    promoDiscount: validPromoDiscount,
    paymentStatus: paymentMethod === "GCash" ? "Pending" : "To Collect",
    id: `NG-${crypto.randomInt(10000, 100000)}`,
    email: req.auth.email,
    date: new Date().toISOString().slice(0, 10),
    trackingNumber: `NG-US-${crypto.randomInt(100000000, 1000000000)}`,
    status: paymentMethod === "GCash" ? "Pending" : "Processing",
    statusHistory: [
      {
        status: paymentMethod === "GCash" ? "Pending" : "Processing",
        at: new Date(),
        note:
          paymentMethod === "GCash"
            ? "Awaiting manual GCash payment verification"
            : "Order placed",
      },
    ],
  });
  if (validPromoCode && validPromoCode !== "CYBER2026") await User.updateOne({ _id: req.auth.sub, "promoOffers.code": validPromoCode }, { $set: { "promoOffers.$.usedAt": new Date() } });
  await Promise.all([
    publishNotification({
      audience: "admins",
      title: "New order received",
      message: `Order #${order.id} was placed by ${order.customer}.`,
      type: "order",
      page: "admin",
      tab: "orders",
    }),
    publishNotification({
      audience: req.auth.email,
      title: "Order placed",
      message: `Order #${order.id} is being processed.`,
      type: "order",
      page: "orders",
    }),
  ]);
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
