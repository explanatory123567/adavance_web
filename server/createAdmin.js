require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verifiedAt: Date,
    status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
    cart: { type: [mongoose.Schema.Types.Mixed], default: [] },
    wishlist: { type: [String], default: [] },
    savedBuilds: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

function ask(question, hidden = false) {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  if (!hidden)
    return new Promise((resolve) =>
      input.question(question, (answer) => {
        input.close();
        resolve(answer.trim());
      }),
    );
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    let answer = "";
    const onData = (key) => {
      const character = key.toString();
      if (character === "\r" || character === "\n") {
        process.stdin.setRawMode?.(false);
        process.stdin.removeListener("data", onData);
        input.close();
        process.stdout.write("\n");
        resolve(answer);
      } else if (character === "\u0003") {
        process.exit(130);
      } else if (character === "\u007f") {
        answer = answer.slice(0, -1);
      } else {
        answer += character;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function createAdmin() {
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is required in .env.");
  await mongoose.connect(process.env.MONGODB_URI);
  const name = await ask("Admin full name: ");
  const username = (await ask("Admin username: ")).toLowerCase();
  const email = (await ask("Admin email: ")).toLowerCase();
  const password = await ask("Admin password: ", true);
  if (!name || !username || !email || password.length < 8)
    throw new Error(
      "All fields are required and the password must be at least 8 characters.",
    );
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error("That email or username already exists.");
  const user = await User.create({
    name,
    username,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    verifiedAt: new Date(),
  });
  console.log(`Admin account created for ${user.email}.`);
  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
