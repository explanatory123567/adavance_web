import React, { useState } from 'react';
import './ProfilePage.css';
import { useApp } from '../context/AppContext';
import { User, Layers, Heart, Package, LogOut, Bell, Key, MapPin } from 'lucide-react';
export default function ProfilePage() {
  const {
    savedBuilds,
    wishlist,
    orders,
    logout,
    setCurrentPage,
    showToast
  } = useApp();
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'notifications' | 'addresses'

  // User form states
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@cyberforge.io');
  const [gamerTag, setGamerTag] = useState('ShadowRider99');
  const [discordTag, setDiscordTag] = useState('AlexM#4090');
  const handleSaveProfile = e => {
    e.preventDefault();
    showToast('Profile Updated', 'Your pilot telemetry settings have been updated.', 'success');
  };
  return <div className="profile-page inline-profilepage-0">
      <div className="container-wide">
        {/* User Gamer Profile Header Card */}
        <div className="cyber-card-static inline-profilepage-1">
          <div className="inline-profilepage-2">
            {/* Avatar & User Details */}
            <div className="inline-profilepage-3">
              <div className="inline-profilepage-4">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Alex Mercer" className="inline-profilepage-5" />
                <span className="inline-profilepage-6" />
              </div>

              <div>
                <div className="inline-profilepage-7">
                  <h2 className="inline-profilepage-8">{name}</h2>
                  <span className="badge badge-cyan inline-profilepage-9">ELITE ENTHUSIAST</span>
                </div>
                <div className="inline-profilepage-10">
                  Gamer Tag: <strong className="inline-profilepage-11">{gamerTag}</strong> • {email}
                </div>
                <div className="inline-profilepage-12">
                  Member since November 2025 • 4,890 XP Accumulated
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
                <div className="inline-profilepage-18">
                  {orders.length}
                </div>
                <div className="inline-profilepage-19">Total Orders</div>
              </div>

              <button onClick={() => logout()} className="btn btn-danger btn-sm inline-profilepage-20">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Layout */}
        <div className="inline-profilepage-21">
          {/* Left: Navigation Menu */}
          <div className="cyber-card-static inline-profilepage-22">
            {[{
            id: 'account',
            label: 'Account Information',
            icon: User
          }, {
            id: 'security',
            label: 'Security & Password',
            icon: Key
          }, {
            id: 'addresses',
            label: 'Saved Addresses',
            icon: MapPin
          }, {
            id: 'notifications',
            label: 'Drop Notifications',
            icon: Bell
          }].map(tab => {
            const IconComp = tab.icon;
            const isSelected = activeTab === tab.id;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: isSelected ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px',
              background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
              color: isSelected ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              border: isSelected ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent'
            }}>
                  <IconComp size={16} />
                  <span>{tab.label}</span>
                </button>;
          })}

            <div className="inline-profilepage-23" />

            <button onClick={() => setCurrentPage('my-builds')} className="inline-profilepage-24">
              <Layers size={16} />
              <span>Saved Builds ({savedBuilds.length})</span>
            </button>

            <button onClick={() => setCurrentPage('orders')} className="inline-profilepage-25">
              <Package size={16} />
              <span>Order History ({orders.length})</span>
            </button>

            <button onClick={() => setCurrentPage('wishlist')} className="inline-profilepage-26">
              <Heart size={16} />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          </div>

          {/* Right: Active Tab Pane */}
          <div className="cyber-card-static inline-profilepage-27">
            {activeTab === 'account' && <form onSubmit={handleSaveProfile}>
                <h3 className="inline-profilepage-28">
                  Personal Telemetry & Account Information
                </h3>

                <div className="grid-cols-2 inline-profilepage-29">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username (Gamer Tag)</label>
                    <input type="text" className="form-control" value={gamerTag} onChange={e => setGamerTag(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discord Integration</label>
                    <input type="text" className="form-control" value={discordTag} onChange={e => setDiscordTag(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary inline-profilepage-30">
                  Save Profile Changes
                </button>
              </form>}

            {activeTab === 'security' && <div>
                <h3 className="inline-profilepage-31">
                  Security & Key Management
                </h3>

                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="form-control" />
                </div>

                <div className="grid-cols-2 inline-profilepage-32">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" placeholder="••••••••••••" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" placeholder="••••••••••••" className="form-control" />
                  </div>
                </div>

                <button type="button" onClick={() => showToast('Password Updated', 'Security key changed successfully.', 'success')} className="btn btn-purple">
                  Update Password Key
                </button>
              </div>}

            {activeTab === 'addresses' && <div>
                <h3 className="inline-profilepage-33">
                  Registered Delivery Addresses
                </h3>

                <div className="inline-profilepage-34">
                  <div className="flex-between inline-profilepage-35">
                    <strong className="inline-profilepage-36">Primary Battlestation Address</strong>
                    <span className="badge badge-green inline-profilepage-37">Default</span>
                  </div>
                  <div className="inline-profilepage-38">
                    742 Evergreen Battlestation Way, Seattle, WA 98101, United States
                  </div>
                </div>

                <button type="button" onClick={() => showToast('Address Added', 'New delivery node saved.', 'info')} className="btn btn-secondary btn-sm">
                  + Add New Address
                </button>
              </div>}

            {activeTab === 'notifications' && <div>
                <h3 className="inline-profilepage-39">
                  Cyber Alert Notifications
                </h3>

                <div className="inline-profilepage-40">
                  {[{
                label: 'GeForce RTX 50-Series Drop Alerts',
                desc: 'Instant push notifications for Founders Edition restocks.'
              }, {
                label: 'Order Telemetry Updates',
                desc: 'SMS tracking for lab assembly & carrier delivery.'
              }, {
                label: 'Discord VIP Exclusive Deals',
                desc: 'Special community promo codes and private sales.'
              }].map((item, idx) => <label key={idx} className="inline-profilepage-41">
                      <div>
                        <div className="inline-profilepage-42">{item.label}</div>
                        <div className="inline-profilepage-43">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="inline-profilepage-44" />
                    </label>)}
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
