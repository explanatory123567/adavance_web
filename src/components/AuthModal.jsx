import React, { useState } from 'react';
import './AuthModal.css';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, User, Check, X, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    guestPromptOpen,
    setGuestPromptOpen,
    guestActionName,
    loginAs,
    registerUser
  } = useApp();
  const [loginIdentifier, setLoginIdentifier] = useState('alex.mercer@cyberforge.io');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const isOpen = authModalOpen || guestPromptOpen;
  if (!isOpen) return null;
  const handleClose = () => {
    setAuthModalOpen(false);
    setGuestPromptOpen(false);
  };
  const handleLoginSubmit = e => {
    e.preventDefault();
    loginAs('user');
  };
  const handleRegisterSubmit = e => {
    e.preventDefault();
    if (!regEmail || !regUsername || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    registerUser({
      fullName: regFullName,
      email: regEmail,
      username: regUsername
    });
  };
  return <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content inline-authmodal-0" onClick={e => e.stopPropagation()}>
        {/* Header Glow Bar */}
        <div className="inline-authmodal-1" />

        {/* Guest Action Alert (if triggered by restricted action) */}
        {guestPromptOpen && <div className="inline-authmodal-2">
            <AlertTriangle size={18} color="#f59e0b" />
            <div className="inline-authmodal-3">
              <strong>Login Required:</strong> Please sign in to {guestActionName || 'access this feature'}.
            </div>
          </div>}

        <div className="inline-authmodal-4">
          {/* Top Bar with Title & Close */}
          <div className="flex-between inline-authmodal-5">
            <div className="inline-authmodal-6">
              <div className="inline-authmodal-7">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="inline-authmodal-8">
                  {authModalMode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
                </h3>
                <p className="inline-authmodal-9">
                  CYBERFORGE SECURE ACCESS MATRIX
                </p>
              </div>
            </div>

            <button onClick={handleClose} className="btn-icon inline-authmodal-10">
              <X size={18} />
            </button>
          </div>

          {/* Quick 1-Click Demo Buttons for Fast Evaluator Testing */}
          <div className="inline-authmodal-11">
            <div className="inline-authmodal-12">
              <Sparkles size={12} /> Instant 1-Click Demo Logins
            </div>
            <div className="inline-authmodal-13">
              <button type="button" className="btn btn-secondary btn-sm inline-authmodal-14" onClick={() => loginAs('user')}>
                👤 Regular User
              </button>
              <button type="button" className="btn btn-secondary btn-sm inline-authmodal-15" onClick={() => loginAs('admin')}>
                🛡️ Admin Portal
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-authmodal-16">
            <button type="button" onClick={() => setAuthModalMode('login')} style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: authModalMode === 'login' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
            color: authModalMode === 'login' ? 'var(--neon-cyan)' : 'var(--text-muted)',
            border: authModalMode === 'login' ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s'
          }}>
              Sign In
            </button>
            <button type="button" onClick={() => setAuthModalMode('register')} style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: authModalMode === 'register' ? 'rgba(157, 78, 221, 0.18)' : 'transparent',
            color: authModalMode === 'register' ? '#c084fc' : 'var(--text-muted)',
            border: authModalMode === 'register' ? '1px solid rgba(157, 78, 221, 0.35)' : '1px solid transparent',
            transition: 'all 0.2s'
          }}>
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {authModalMode === 'login' && <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span>Email or Username</span>
                </label>
                <div className="inline-authmodal-17">
                  <input type="text" className="form-control inline-authmodal-18" placeholder="gamer@domain.com or AlexMercer" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} required />
                  <Mail size={16} color="var(--text-muted)" className="inline-authmodal-19" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Password</span>
                  <a href="#forgot" onClick={e => {
                e.preventDefault();
                alert("Prototype password reset link sent to demo email.");
              }} className="inline-authmodal-20">
                    Forgot Password?
                  </a>
                </label>
                <div className="inline-authmodal-21">
                  <input type="password" className="form-control inline-authmodal-22" placeholder="Enter security key" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                  <Lock size={16} color="var(--text-muted)" className="inline-authmodal-23" />
                </div>
              </div>

              <div className="inline-authmodal-24">
                <label className="inline-authmodal-25">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="inline-authmodal-26" />
                  Remember Me on this device
                </label>
              </div>

              <button type="submit" className="btn btn-primary inline-authmodal-27">
                Sign In <ArrowRight size={16} />
              </button>

              <div className="inline-authmodal-28">
                Don't have an account?{' '}
                <button type="button" onClick={() => setAuthModalMode('register')} className="inline-authmodal-29">
                  Create one now
                </button>
              </div>
            </form>}

          {/* REGISTER FORM */}
          {authModalMode === 'register' && <form onSubmit={handleRegisterSubmit}>
              {regError && <div className="inline-authmodal-30">
                  {regError}
                </div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="inline-authmodal-31">
                  <input type="text" className="form-control inline-authmodal-32" placeholder="Alex Mercer" value={regFullName} onChange={e => setRegFullName(e.target.value)} required />
                  <User size={16} color="var(--text-muted)" className="inline-authmodal-33" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="inline-authmodal-34">
                  <input type="email" className="form-control inline-authmodal-35" placeholder="alex@cyberforge.io" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  <Mail size={16} color="var(--text-muted)" className="inline-authmodal-36" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username (Gamer Tag)</label>
                <input type="text" className="form-control" placeholder="ShadowRider99" value={regUsername} onChange={e => setRegUsername(e.target.value)} required />
              </div>

              <div className="grid-cols-2 inline-authmodal-37">
                <div className="form-group inline-authmodal-38">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
                <div className="form-group inline-authmodal-39">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-purple inline-authmodal-40">
                Create Account <Check size={16} />
              </button>

              <div className="inline-authmodal-41">
                Already registered?{' '}
                <button type="button" onClick={() => setAuthModalMode('login')} className="inline-authmodal-42">
                  Sign In here
                </button>
              </div>
            </form>}
        </div>
      </div>
    </div>;
}
