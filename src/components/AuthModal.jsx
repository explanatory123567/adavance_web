import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AuthModal.css";
import { useApp } from "../context/AppContext";
import {
  Shield,
  Lock,
  Mail,
  User,
  Check,
  X,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";

function GoogleSignInButton({ label = "Continue with Google", onClick, disabled = false, buttonId }) {
  return (
    <button type="button" className="auth-social-button" onClick={onClick} disabled={disabled} data-google-button-id={buttonId}>
      <span className="auth-google-badge" aria-hidden="true">
        <Globe size={15} />
      </span>
      {label}
    </button>
  );
}

function decodeGoogleJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    const json = decodeURIComponent(
      Array.from(decoded).map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join(""),
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

function GoogleCaptcha({ onVerify }) {
  const containerRef = useRef(null);
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return undefined;
    const renderCaptcha = () => {
      if (
        !containerRef.current ||
        !window.grecaptcha ||
        containerRef.current.dataset.rendered
      )
        return;
      window.grecaptcha.ready(() => {
        if (!containerRef.current || containerRef.current.dataset.rendered)
          return;
        try {
          window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": () => onVerify(""),
          });
          containerRef.current.dataset.rendered = "true";
        } catch (error) {
          onVerify("");
        }
      });
    };
    if (window.grecaptcha) renderCaptcha();
    else {
      const existingScript = document.querySelector(
        'script[src*="google.com/recaptcha/api.js"]',
      );
      if (existingScript)
        existingScript.addEventListener("load", renderCaptcha, { once: true });
      else {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.onload = renderCaptcha;
        document.body.appendChild(script);
      }
    }
    return undefined;
  }, [onVerify, siteKey]);

  return siteKey ? (
    <div ref={containerRef} className="auth-captcha" />
  ) : (
    <div className="auth-captcha-missing">
      Google reCAPTCHA is not configured. Add REACT_APP_RECAPTCHA_SITE_KEY to
      the frontend environment.
    </div>
  );
}

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    guestPromptOpen,
    setGuestPromptOpen,
    guestActionName,
    requestVerificationCode,
    loginUser,
    loginWithGoogle,
    registerUser,
    showToast,
  } = useApp();
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regCode, setRegCode] = useState("");
  const [regError, setRegError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [showRegisterCaptcha, setShowRegisterCaptcha] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef(null);
  const googleInitKeyRef = useRef("");

  const initializeGoogleSdk = useCallback(() => {
    if (!googleClientId || !window.google?.accounts?.id) return false;
    if (googleInitKeyRef.current === googleClientId) return true;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        const payload = decodeGoogleJwt(response.credential);
        if (!payload) {
          setRegError("Google session could not be read. Please try again.");
          return;
        }

        try {
          const result = await loginWithGoogle({
            googleToken: response.credential,
            email: payload.email,
            name: payload.name || payload.given_name || "Google User",
            avatar: payload.picture || "",
          });
          showToast("Google sign-in successful", `Welcome, ${result.user.name}.`, "success");
        } catch (error) {
          setRegError(error.message);
        }
      },
    });

    googleInitKeyRef.current = googleClientId;
    return true;
  }, [googleClientId, loginWithGoogle, showToast]);

  useEffect(() => {
    if (authModalMode !== "register") {
      setShowRegisterCaptcha(false);
      setCaptchaToken("");
    }
  }, [authModalMode]);

  useEffect(() => {
    if (!googleClientId) return undefined;

    const loadGoogleSdk = () => {
      if (!window.google?.accounts?.id) return;

      initializeGoogleSdk();

      const buttonTarget = googleButtonRef.current;
      if (buttonTarget && !buttonTarget.dataset.googleRendered) {
        window.google.accounts.id.renderButton(buttonTarget, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 280,
        });
        buttonTarget.dataset.googleRendered = "true";
      }
    };

    if (window.google?.accounts?.id) {
      loadGoogleSdk();
      return undefined;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener("load", loadGoogleSdk, { once: true });
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = loadGoogleSdk;
    document.body.appendChild(script);
    return undefined;
  }, [googleClientId, initializeGoogleSdk]);

  const ensureGoogleSdk = () => {
    if (!googleClientId) {
      setRegError("Google account selection is not configured yet. Add REACT_APP_GOOGLE_CLIENT_ID to the frontend environment.");
      return false;
    }

    if (window.google?.accounts?.id) {
      return initializeGoogleSdk();
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      return false;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSdk();
    };
    document.body.appendChild(script);
    return false;
  };

  const isOpen = authModalOpen || guestPromptOpen;
  if (!isOpen) return null;
  const clearAuthFields = () => {
    setLoginIdentifier("");
    setLoginPassword("");
    setShowLoginPassword(false);
    setRegFullName("");
    setRegEmail("");
    setRegUsername("");
    setRegPassword("");
    setRegConfirmPassword("");
    setShowRegPassword(false);
    setShowConfirmPassword(false);
    setRegCode("");
    setRegError("");
    setCaptchaToken("");
    setShowRegisterCaptcha(false);
    setCodeSent(false);
  };

  const registrationFormReady =
    Boolean(regFullName.trim()) &&
    Boolean(regEmail.trim()) &&
    Boolean(regUsername.trim()) &&
    Boolean(regPassword.trim()) &&
    Boolean(regConfirmPassword.trim()) &&
    regPassword === regConfirmPassword;

  const switchAuthMode = (mode) => {
    clearAuthFields();
    setShowRegisterCaptcha(false);
    setAuthModalMode(mode);
  };
  const handleClose = () => {
    clearAuthFields();
    setShowRegisterCaptcha(false);
    setAuthModalOpen(false);
    setGuestPromptOpen(false);
  };
  const handleRequestCode = async () => {
    setRegError("");
    const email = regEmail.trim();

    if (!email) {
      setRegError("Enter your email address before requesting a verification code.");
      return;
    }

    if (!registrationFormReady) {
      setRegError("Please complete the registration form before requesting a verification code.");
      return;
    }

    if (!showRegisterCaptcha) {
      setShowRegisterCaptcha(true);
      setRegError("Complete the Google reCAPTCHA challenge, then click Send code again.");
      return;
    }

    if (!captchaToken) {
      setRegError("Complete the Google reCAPTCHA challenge to continue.");
      return;
    }

    try {
      await requestVerificationCode(email, captchaToken);
      setCodeSent(true);
      setRegError("");
      showToast(
        "Verification code sent",
        "Check your inbox for the six-digit security code.",
        "success",
      );
    } catch (error) {
      setRegError(error.message);
    }
  };

  const handleGoogleAccountChooser = () => {
    if (!ensureGoogleSdk()) {
      if (!window.google?.accounts?.id) return;
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setRegError("No Google account is available on this device. Sign in to Google or choose an account in the browser.");
      }
    });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setIsSubmitting(true);
    try {
      await loginUser({ identifier: loginIdentifier, password: loginPassword });
    } catch (error) {
      setRegError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regUsername || !regPassword) {
      setRegError("Please complete all required fields.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (!regCode) {
      setRegError(
        "Request and enter the verification code sent to your email.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await registerUser({
        fullName: regFullName,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        code: regCode,
      });
    } catch (error) {
      setRegError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content inline-authmodal-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Glow Bar */}
        <div className="inline-authmodal-1" />

        {/* Guest Action Alert (if triggered by restricted action) */}
        {guestPromptOpen && (
          <div className="inline-authmodal-2">
            <AlertTriangle size={18} color="#f59e0b" />
            <div className="inline-authmodal-3">
              <strong>Login Required:</strong> Please sign in to{" "}
              {guestActionName || "access this feature"}.
            </div>
          </div>
        )}

        <div className="inline-authmodal-4">
          {/* Top Bar with Title & Close */}
          <div className="flex-between inline-authmodal-5">
            <div className="inline-authmodal-6">
              <div className="inline-authmodal-7">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="inline-authmodal-8">
                  {authModalMode === "login"
                    ? "LOGIN TO YOUR ACCOUNT"
                    : "CREATE ACCOUNT"}
                </h3>
                <p className="inline-authmodal-9">NEXT GEAR</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn-icon inline-authmodal-10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-authmodal-16">
            <button
              type="button"
              onClick={() => switchAuthMode("login")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                background:
                  authModalMode === "login"
                    ? "rgba(0, 240, 255, 0.15)"
                    : "transparent",
                color:
                  authModalMode === "login"
                    ? "var(--neon-cyan)"
                    : "var(--text-muted)",
                border:
                  authModalMode === "login"
                    ? "1px solid rgba(0, 240, 255, 0.3)"
                    : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode("register")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                background:
                  authModalMode === "register"
                    ? "rgba(157, 78, 221, 0.18)"
                    : "transparent",
                color:
                  authModalMode === "register"
                    ? "#c084fc"
                    : "var(--text-muted)",
                border:
                  authModalMode === "register"
                    ? "1px solid rgba(157, 78, 221, 0.35)"
                    : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {authModalMode === "login" && (
            <>
              {regError && (
                <div className="inline-authmodal-30">{regError}</div>
              )}
              <form onSubmit={handleLoginSubmit}>
                <div className="auth-divider">
                  <span>or continue with email</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Email or Username</span>
                  </label>
                  <div className="inline-authmodal-17">
                    <input
                      type="text"
                      className="form-control inline-authmodal-18"
                      placeholder="Email"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                    />
                    <Mail
                      size={16}
                      color="var(--text-muted)"
                      className="inline-authmodal-19"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Password</span>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        setRegError(
                          "Password recovery is available through account support.",
                        );
                      }}
                      className="inline-authmodal-20"
                    >
                      Forgot Password?
                    </a>
                  </label>
                  <div className="inline-authmodal-21">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      className="form-control inline-authmodal-22"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <Lock
                      size={16}
                      color="var(--text-muted)"
                      className="inline-authmodal-23"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowLoginPassword((current) => !current)
                      }
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showLoginPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="inline-authmodal-24">
                  <label className="inline-authmodal-25">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="inline-authmodal-26"
                    />
                    Keep me signed in
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary inline-authmodal-27"
                  disabled={isSubmitting}
                >
                  Sign In <ArrowRight size={16} />
                </button>

                <div className="auth-divider">
                  <span>or continue with Google</span>
                </div>

                <div className="auth-social-stack">
                  <div ref={googleButtonRef} className="google-signin-shell" />
                </div>

                <div className="inline-authmodal-28">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchAuthMode("register")}
                    className="inline-authmodal-29"
                  >
                    Create one now
                  </button>
                </div>
              </form>
            </>
          )}

          {/* REGISTER FORM */}
          {authModalMode === "register" && (
            <form onSubmit={handleRegisterSubmit}>
              {regError && (
                <div className="inline-authmodal-30">{regError}</div>
              )}

              <div className="auth-divider">
                <span>or create your account</span>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="inline-authmodal-31">
                  <input
                    type="text"
                    className="form-control inline-authmodal-32"
                    placeholder="Full Name"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                  <User
                    size={16}
                    color="var(--text-muted)"
                    className="inline-authmodal-33"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="inline-authmodal-34">
                  <input
                    type="email"
                    className="form-control inline-authmodal-35"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    className="inline-authmodal-36"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2 inline-authmodal-37">
                <div className="form-group inline-authmodal-38">
                  <label className="form-label">Password</label>
                  <div className="auth-password-field">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowRegPassword((current) => !current)}
                      aria-label={
                        showRegPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showRegPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-group inline-authmodal-39">
                  <label className="form-label">Confirm Password</label>
                  <div className="auth-password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {showRegisterCaptcha && <GoogleCaptcha onVerify={setCaptchaToken} />}
              <div className="auth-verification-row">
                <div className="auth-code-field">
                  <span>EMAIL CODE</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    className="form-control"
                    placeholder="000000"
                    value={regCode}
                    onChange={(e) =>
                      setRegCode(e.target.value.replace(/\D/g, ""))
                    }
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleRequestCode}
                  disabled={
                    !regEmail ||
                    !registrationFormReady ||
                    (showRegisterCaptcha && !captchaToken)
                  }
                >
                  <RefreshCw size={13} />{" "}
                  {codeSent ? "Resend code" : "Send code"}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-purple inline-authmodal-40"
                disabled={isSubmitting}
              >
                Create Account <Check size={16} />
              </button>

              <div className="auth-divider">
                <span>or continue with Google</span>
              </div>

              <div className="auth-social-stack">
                <div ref={googleButtonRef} className="google-signin-shell" />
              </div>

              <div className="inline-authmodal-41">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => switchAuthMode("login")}
                  className="inline-authmodal-42"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
