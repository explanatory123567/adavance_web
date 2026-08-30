import React from 'react';
import './Footer.css';
import { useApp } from '../context/AppContext';
import { Cpu, ShieldCheck, Zap, Award, Headphones, ArrowRight } from 'lucide-react';
export default function Footer() {
  const {
    setCurrentPage
  } = useApp();
  return <footer className="inline-footer-0">
      {/* Top Value Propositions Bar */}
      <div className="inline-footer-1">
        <div className="container-wide">
          <div className="inline-footer-2">
            <div className="inline-footer-3">
              <div className="inline-footer-4">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 className="inline-footer-5">3-Year Comprehensive Warranty</h5>
                <p className="inline-footer-6">100% parts and lifetime labor coverage</p>
              </div>
            </div>

            <div className="inline-footer-7">
              <div className="inline-footer-8">
                <Zap size={24} />
              </div>
              <div>
                <h5 className="inline-footer-9">Zero-Bottleneck Certified</h5>
                <p className="inline-footer-10">48-hour thermal stress and stress benchmarked</p>
              </div>
            </div>

            <div className="inline-footer-11">
              <div className="inline-footer-12">
                <Award size={24} />
              </div>
              <div>
                <h5 className="inline-footer-13">Handcrafted in Cleanrooms</h5>
                <p className="inline-footer-14">Laser-routed premium braided cable combs</p>
              </div>
            </div>

            <div className="inline-footer-15">
              <div className="inline-footer-16">
                <Headphones size={24} />
              </div>
              <div>
                <h5 className="inline-footer-17">24/7 Overclocker Support</h5>
                <p className="inline-footer-18">Direct Discord & live tech support lines</p>
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
              Intelligent PC builder studio, real-time bottleneck telemetry, and high-performance gaming hardware retail.
            </p>

            <div className="inline-footer-27">
              {['Discord', 'YouTube', 'Twitch', 'X (Twitter)', 'Instagram'].map(social => <span key={social} className="inline-footer-28">
                  {social}
                </span>)}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="inline-footer-29">
              Storefront
            </h5>
            <ul className="inline-footer-30">
              <li><button onClick={() => setCurrentPage('home')}>Home</button></li>
              <li><button onClick={() => setCurrentPage('components')}>Components Marketplace</button></li>
              <li><button onClick={() => setCurrentPage('builder')}>3D PC Builder</button></li>
              <li><button onClick={() => setCurrentPage('compare')}>Component Compare</button></li>
              <li><button onClick={() => setCurrentPage('components')}>Featured Pre-builts</button></li>
            </ul>
          </div>

          {/* Col 3: Hardware Categories */}
          <div>
            <h5 className="inline-footer-31">
              Hardware
            </h5>
            <ul className="inline-footer-32">
              <li><button onClick={() => setCurrentPage('components')}>GeForce RTX GPUs</button></li>
              <li><button onClick={() => setCurrentPage('components')}>AMD Ryzen & Intel CPUs</button></li>
              <li><button onClick={() => setCurrentPage('components')}>DDR5 High-Speed RAM</button></li>
              <li><button onClick={() => setCurrentPage('components')}>PCIe 5.0 NVMe SSDs</button></li>
              <li><button onClick={() => setCurrentPage('components')}>Panoramic Showpiece Cases</button></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h5 className="inline-footer-33">
              Support & Lab
            </h5>
            <ul className="inline-footer-34">
              <li><button onClick={() => alert("Prototype documentation: 3-Year Zero-Bottleneck Warranty covers all components with advance RMA.")}>Warranty Coverage</button></li>
              <li><button onClick={() => alert("Prototype documentation: Insured Air Delivery arrives in custom wooden crate foam-mold packaging.")}>Insured Shipping</button></li>
              <li><button onClick={() => alert("Prototype documentation: Overclock stability report provided with every custom build.")}>Overclock Lab</button></li>
              <li><button onClick={() => alert("Prototype documentation: Affirm 0% APR financing available on approval.")}>Financing Plans</button></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h5 className="inline-footer-35">
              Cyber Drop Alerts
            </h5>
            <p className="inline-footer-36">
              Subscribe for RTX 5090 restock alerts and private Discord drops.
            </p>
            <div className="inline-footer-37">
              <input type="email" placeholder="pilot@cyberforge.io" className="form-control inline-footer-38" />
              <button className="btn btn-primary btn-sm" onClick={() => alert("Subscribed to drop alerts!")}>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Prototype disclaimer */}
        <div className="inline-footer-39">
          <div>
            © 2026 CYBERFORGE GAMING TECHNOLOGIES INC. HIGH-FIDELITY PROTOTYPE.
          </div>
          <div className="inline-footer-40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Matrix</span>
          </div>
        </div>
      </div>
    </footer>;
}
