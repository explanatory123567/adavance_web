import React, { useState } from "react";
import "./ProfilePage.css";
import { useApp } from "../context/AppContext";
import {
  User,
  Layers,
  Heart,
  Package,
  LogOut,
  Bell,
  Key,
  MapPin,
} from "lucide-react";
export default function ProfilePage() {
  const {
    savedBuilds,
    wishlist,
    orders,
    addresses,
    authUser,
    updateProfile,
    addAddress,
    logout,
    setCurrentPage,
    showToast,
  } = useApp();
  const [activeTab, setActiveTab] = useState("account"); // 'account' | 'security' | 'notifications' | 'addresses'

  const memberSince = authUser?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(authUser.createdAt))
    : "recently";

  const orderXp = orders.reduce((total, order) => {
    const orderTotal = Number(order.total || 0);
    return total + Math.max(0, Math.round(orderTotal / 10));
  }, 0);

  const buildXp = (savedBuilds?.length || 0) * 25;
  const wishlistXp = (wishlist?.length || 0) * 10;
  const referralXp = 0;
  const xpAccumulated = orderXp + buildXp + wishlistXp + referralXp;

  // User form states
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [gamerTag, setGamerTag] = useState(authUser?.username || "");
  const [discordTag, setDiscordTag] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    recipient: authUser?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [avatar, setAvatar] = useState(authUser?.avatar || "");
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      showToast(
        "Invalid profile picture",
        "Choose an image smaller than 5MB.",
        "warning",
      );
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };
  const handleAddAddress = async (event) => {
    event.preventDefault();
    try {
      await addAddress(newAddress);
      setAddressFormOpen(false);
      setNewAddress({
        label: "",
        recipient: name,
        phone: "",
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
      showToast("Address Added", "Your delivery address was saved.", "success");
    } catch (error) {
      showToast("Address could not be saved", error.message, "warning");
    }
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email, username: gamerTag, avatar });
      showToast(
        "Profile Updated",
        "Your account details were saved to MongoDB.",
        "success",
      );
    } catch (error) {
      showToast("Profile update failed", error.message, "warning");
    }
  };
  return (
    <div className="profile-page inline-profilepage-0">
      <div className="container-wide">
        {/* User Gamer Profile Header Card */}
        <div className="cyber-card-static inline-profilepage-1">
          <div className="inline-profilepage-2">
            {/* Avatar & User Details */}
            <div className="inline-profilepage-3">
              <div className="inline-profilepage-4">
                <img
                  src={
                    avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={name || "Account"}
                  className="inline-profilepage-5"
                />
                <span className="inline-profilepage-6" />
              </div>

              <div>
                <div className="inline-profilepage-7">
                  <h2 className="inline-profilepage-8">{name}</h2>
                  <span className="badge badge-cyan inline-profilepage-9">
                    ELITE ENTHUSIAST
                  </span>
                </div>
                <div className="inline-profilepage-10">
                  Gamer Tag:{" "}
                  <strong className="inline-profilepage-11">{gamerTag}</strong>{" "}
                  • {email}
                </div>
                <div className="inline-profilepage-12">
                  Member since {memberSince} • {xpAccumulated.toLocaleString()} XP Accumulated
                </div>
              </div>
            </div>

            {/* Quick Metrics & Logout */}
            <div className="inline-profilepage-13">
              <div className="inline-profilepage-14">
                <div className="inline-profilepage-15">
                  {savedBuilds.length}
                </div>
                <div className="inline-profilepage-16">Saved Builds</div>
              </div>

              <div className="inline-profilepage-17">
                <div className="inline-profilepage-18">{orders.length}</div>
                <div className="inline-profilepage-19">Total Orders</div>
              </div>

              <button
                onClick={() => logout()}
                className="btn btn-danger btn-sm inline-profilepage-20"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Layout */}
        <div className="inline-profilepage-21">
          {/* Left: Navigation Menu */}
          <div className="cyber-card-static inline-profilepage-22">
            {[
              {
                id: "account",
                label: "Account Information",
                icon: User,
              },
              {
                id: "security",
                label: "Security & Password",
                icon: Key,
              },
              {
                id: "addresses",
                label: "Saved Addresses",
                icon: MapPin,
              },
              {
                id: "notifications",
                label: "Drop Notifications",
                icon: Bell,
              },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: isSelected ? 700 : 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "4px",
                    background: isSelected
                      ? "rgba(0, 240, 255, 0.12)"
                      : "transparent",
                    color: isSelected
                      ? "var(--neon-cyan)"
                      : "var(--text-secondary)",
                    border: isSelected
                      ? "1px solid rgba(0, 240, 255, 0.3)"
                      : "1px solid transparent",
                  }}
                >
                  <IconComp size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="inline-profilepage-23" />

            <button
              onClick={() => setCurrentPage("my-builds")}
              className="inline-profilepage-24"
            >
              <Layers size={16} />
              <span>Saved Builds ({savedBuilds.length})</span>
            </button>

            <button
              onClick={() => setCurrentPage("orders")}
              className="inline-profilepage-25"
            >
              <Package size={16} />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setCurrentPage("wishlist")}
              className="inline-profilepage-26"
            >
              <Heart size={16} />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          </div>

          {/* Right: Active Tab Pane */}
          <div className="cyber-card-static inline-profilepage-27">
            {activeTab === "account" && (
              <form onSubmit={handleSaveProfile}>
                <h3 className="inline-profilepage-28">
                  Personal Telemetry & Account Information
                </h3>

                <div className="grid-cols-2 inline-profilepage-29">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username (Gamer Tag)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gamerTag}
                      onChange={(e) => setGamerTag(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discord Integration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={discordTag}
                      onChange={(e) => setDiscordTag(e.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-avatar-editor">
                  <img
                    src={
                      avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    }
                    alt="Profile preview"
                  />
                  <div>
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleAvatarChange}
                    />
                    <small>
                      Choose an image up to 5MB, then save your profile.
                    </small>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary inline-profilepage-30"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <div>
                <h3 className="inline-profilepage-31">
                  Security & Key Management
                </h3>

                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="form-control"
                  />
                </div>

                <div className="grid-cols-2 inline-profilepage-32">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="form-control"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Password Updated",
                      "Security key changed successfully.",
                      "success",
                    )
                  }
                  className="btn btn-purple"
                >
                  Update Password Key
                </button>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h3 className="inline-profilepage-33">
                  Registered Delivery Addresses
                </h3>

                {addresses.length === 0 ? (
                  <p className="inline-profilepage-38">
                    No delivery addresses saved yet.
                  </p>
                ) : (
                  addresses.map((address) => (
                    <div key={address._id} className="inline-profilepage-34">
                      <div className="flex-between inline-profilepage-35">
                        <strong className="inline-profilepage-36">
                          {address.label}
                        </strong>
                        {address.isDefault && (
                          <span className="badge badge-green inline-profilepage-37">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="inline-profilepage-38">
                        {address.recipient} · {address.line1}, {address.city},{" "}
                        {address.state} {address.postalCode}, {address.country}
                      </div>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => setAddressFormOpen((current) => !current)}
                  className="btn btn-secondary btn-sm"
                >
                  + Add New Address
                </button>
                {addressFormOpen && (
                  <form className="address-form" onSubmit={handleAddAddress}>
                    {[
                      "label",
                      "recipient",
                      "phone",
                      "line1",
                      "city",
                      "state",
                      "postalCode",
                      "country",
                    ].map((field) => (
                      <input
                        key={field}
                        className="form-control"
                        placeholder={
                          field === "line1" ? "Street address" : field
                        }
                        value={newAddress[field]}
                        onChange={(event) =>
                          setNewAddress((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        required
                      />
                    ))}
                    <label className="address-default-toggle">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(event) =>
                          setNewAddress((current) => ({
                            ...current,
                            isDefault: event.target.checked,
                          }))
                        }
                      />{" "}
                      Make default address
                    </label>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Address
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h3 className="inline-profilepage-39">
                  Cyber Alert Notifications
                </h3>

                <div className="inline-profilepage-40">
                  {[
                    {
                      label: "GeForce RTX 50-Series Drop Alerts",
                      desc: "Instant push notifications for Founders Edition restocks.",
                    },
                    {
                      label: "Order Telemetry Updates",
                      desc: "SMS tracking for lab assembly & carrier delivery.",
                    },
                    {
                      label: "Discord VIP Exclusive Deals",
                      desc: "Special community promo codes and private sales.",
                    },
                  ].map((item, idx) => (
                    <label key={idx} className="inline-profilepage-41">
                      <div>
                        <div className="inline-profilepage-42">
                          {item.label}
                        </div>
                        <div className="inline-profilepage-43">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="inline-profilepage-44"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
