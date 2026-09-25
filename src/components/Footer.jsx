import React, { useState } from "react";
import "./Footer.css";
import { useApp } from "../context/AppContext";
import {
  Cpu,
  ShieldCheck,
  Zap,
  Award,
  Headphones,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
export default function Footer() {
  const { setCurrentPage, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!newsletterEmail) return;
    showToast(
      "Subscription confirmed",
      "Next Gear updates will be sent to your inbox.",
      "success",
    );
    setNewsletterEmail("");
  };
  return (
    <footer className="inline-footer-0">
      {/* Top Value Propositions Bar */}
      <div className="inline-footer-1">
        <div className="container-wide">
          <div className="inline-footer-2">
            <div className="inline-footer-3">
              <div className="inline-footer-4">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 className="inline-footer-5">
                  3-Year Comprehensive Warranty
                </h5>
                <p className="inline-footer-6">
                  100% parts and lifetime labor coverage
                </p>
              </div>
            </div>

            <div className="inline-footer-7">
              <div className="inline-footer-8">
                <Zap size={24} />
              </div>
              <div>
                <h5 className="inline-footer-9">Zero-Bottleneck Certified</h5>
                <p className="inline-footer-10">
                  48-hour thermal stress and stress benchmarked
                </p>
              </div>
            </div>

            <div className="inline-footer-11">
              <div className="inline-footer-12">
                <Award size={24} />
              </div>
              <div>
                <h5 className="inline-footer-13">Handcrafted in Cleanrooms</h5>
                <p className="inline-footer-14">
                  Laser-routed premium braided cable combs
                </p>
              </div>
            </div>

            <div className="inline-footer-15">
              <div className="inline-footer-16">
                <Headphones size={24} />
              </div>
              <div>
                <h5 className="inline-footer-17">24/7 Overclocker Support</h5>
                <p className="inline-footer-18">
                  Direct Discord & live tech support lines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-wide inline-footer-19">
        <div className="inline-footer-20">
          {/* Col 1: Brand Info */}
          <div>
            <div className="inline-footer-21">
              <div className="inline-footer-22">
                <Cpu size={18} strokeWidth={2.5} />
              </div>
              <div className="inline-footer-23">
                <span className="inline-footer-24">NEXT</span>
                <span className="inline-footer-25">GEAR</span>
              </div>
            </div>

            <p className="inline-footer-26">
              Intelligent PC builder studio, real-time bottleneck telemetry, and
              high-performance gaming hardware retail.
            </p>

            <div className="inline-footer-27">
              {["Instagram", "Facebook"].map((social) => (
                <span key={social} className="inline-footer-28">
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="inline-footer-29">Navigation</h5>
            <ul className="inline-footer-30">
              <li>
                <button onClick={() => setCurrentPage("home")}>Home</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("about")}>About</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("contact")}>
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("faq")}>FAQ</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("resources")}>
                  Blog / Resources
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hardware Categories */}
          <div>
            <h5 className="inline-footer-31">Company</h5>
            <ul className="inline-footer-32">
              <li>
                <button onClick={() => setCurrentPage("team")}>
                  Meet the Team
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("components")}>
                  Hardware Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("builder")}>
                  PC Builder Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("compare")}>
                  Compare Components
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("orders")}>
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h5 className="inline-footer-33">Legal</h5>
            <ul className="inline-footer-34">
              <li>
                <button onClick={() => setCurrentPage("privacy")}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("terms")}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("cookies")}>
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("accessibility")}>
                  Accessibility
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h5 className="inline-footer-35">Contact & Updates</h5>
            <p className="inline-footer-36">
              <span className="footer-contact-line">
                <Mail size={13} /> support@nextgear.example
              </span>
              <span className="footer-contact-line">
                <Phone size={13} /> +63 2 8000 1234
              </span>
              <span className="footer-contact-line">
                <MapPin size={13} /> Manila, Philippines
              </span>
            </p>
            <form className="inline-footer-37" onSubmit={handleNewsletter}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                className="form-control inline-footer-38"
              />
              <button className="btn btn-primary btn-sm" type="submit">
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="inline-footer-39">
          <div>© 2026 Next Gear. All rights reserved.</div>
          <div className="inline-footer-40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
