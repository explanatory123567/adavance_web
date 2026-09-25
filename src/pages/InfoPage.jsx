import React, { useState } from "react";
import "./InfoPage.css";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const pageContent = {
  about: {
    title: "Build with intent.",
    subtitle: "The command center for better gaming hardware decisions.",
    body: "Next Gear brings component discovery, compatibility analysis, saved builds, and order tracking into one focused workspace.",
    label: "THE STUDIO",
    cards: [
      [
        "01",
        "Discover",
        "Browse verified hardware with performance data and real stock.",
      ],
      ["02", "Design", "Assemble a rig and see compatibility before you buy."],
      [
        "03",
        "Deploy",
        "Checkout, track, and manage your build from one account.",
      ],
    ],
  },
  contact: {
    title: "Need a second set of eyes?",
    subtitle: "Our support channel is built for real hardware questions.",
    body: "Reach the Next Gear team for account, order, delivery, and component support.",
    label: "CONTACT",
    cards: [
      [
        "EMAIL",
        "support@nextgear.example",
        "Account and order support, answered by a real person.",
      ],
      ["PHONE", "+63 2 8000 1234", "Monday to Saturday, 9:00 AM to 6:00 PM."],
      ["HQ", "Manila, Philippines", "Serving builders across the Philippines."],
    ],
  },
  faq: {
    title: "Answers before assembly.",
    subtitle: "The short version of how Next Gear works.",
    body: "Save builds and orders after signing in. Use the Builder to check compatibility. GCash orders require a payment reference; COD orders are collected on delivery.",
    label: "FAQ / FIELD NOTES",
    cards: [
      [
        "ACCOUNT",
        "Why sign in?",
        "Your cart, wishlist, builds, addresses, and orders follow your account.",
      ],
      [
        "BUILDER",
        "Can I check fit?",
        "Socket, power, cooler, and GPU clearance checks run as you build.",
      ],
      [
        "PAYMENT",
        "How do I pay?",
        "Choose GCash with a receipt reference or Cash on Delivery.",
      ],
    ],
  },
  resources: {
    title: "Signals for smarter builds.",
    subtitle: "Guides, notes, and performance context for the next upgrade.",
    body: "Our resource desk is being assembled around practical hardware decisions, not generic noise.",
    label: "RESOURCE DESK",
    cards: [
      [
        "THERMALS",
        "Cooling notes",
        "Understand airflow, socket support, and thermal headroom.",
      ],
      [
        "PERFORMANCE",
        "Benchmark context",
        "Compare parts by the work and games you actually run.",
      ],
      [
        "UPGRADES",
        "Plan forward",
        "Build around platforms with useful upgrade paths.",
      ],
    ],
  },
  privacy: {
    title: "Your data, in focus.",
    subtitle:
      "Privacy that supports the product instead of distracting from it.",
    body: "We use account, address, order, and saved-build information to provide authentication, checkout, delivery, and account features.",
    label: "LEGAL / PRIVACY",
    cards: [
      [
        "ACCOUNT",
        "Identity",
        "Used to secure your session and keep your profile current.",
      ],
      [
        "ORDERS",
        "Fulfillment",
        "Used to deliver hardware and show order history.",
      ],
      [
        "CONTROL",
        "Your choice",
        "Contact support to ask about your account data.",
      ],
    ],
  },
  terms: {
    title: "Clear rules. Clean builds.",
    subtitle: "The operating principles behind the Next Gear marketplace.",
    body: "Use accurate account and delivery information, respect payment requirements, and use the service lawfully.",
    label: "LEGAL / TERMS",
    cards: [
      [
        "HONESTY",
        "Accurate details",
        "Keep account, shipping, and payment details current.",
      ],
      [
        "CARE",
        "Responsible use",
        "Treat the marketplace and support team respectfully.",
      ],
      [
        "TRUST",
        "Secure checkout",
        "Never share passwords or verification codes.",
      ],
    ],
  },
  cookies: {
    title: "Small files. Useful work.",
    subtitle: "Essential cookies keep your Next Gear session steady.",
    body: "Essential cookies support authentication and secure checkout. We do not use cookies to sell personal information.",
    label: "LEGAL / COOKIES",

    cards: [
      [
        "SESSION",
        "Stay signed in",
        "Keeps your account session available while you work.",
      ],
      [
        "SECURITY",
        "Protect checkout",
        "Helps prevent invalid or unexpected requests.",
      ],
      [
        "CHOICE",
        "Your control",
        "Contact support for questions about browser storage.",
      ],
    ],
  },
  accessibility: {
    title: "Designed to be usable.",
    subtitle: "A better hardware workflow should be open to every builder.",
    body: "Contact support@nextgear.example when you need an alternate format, assistance, or an accessibility issue addressed.",
    label: "ACCESSIBILITY",
    cards: [
      [
        "ACCESS",
        "Ask for help",
        "Our support team can provide an alternate route.",
      ],
      [
        "CLARITY",
        "Readable flows",
        "Controls and states are designed for scanning.",
      ],
      [
        "CARE",
        "Report an issue",
        "Tell us what blocked you so we can improve it.",
      ],
    ],
  },
};

const team = [
  {
    name: "Karlo Cabasal",
    role: "Project Lead | Frontend/Backend Developer",
    bio: "I think, therefore I am",
    image: "/images/meet-the-team/karlo.png",
  },
  {
    name: "Misael Arcega",
    role: "Frontend Developer",
    bio: "Tres is passed",
    image: "/images/meet-the-team/misael.jpg",
  },
  {
    name: "Klint Reniel Bautista",
    role: "Frontend Developer",
    bio: "Hello",
    image: "/images/meet-the-team/klint.jpg",
  },
  {
    name: "Mark Renz Villanueva",
    role: "Backend Developer/Database",
    bio: "Hi",
    image: "/images/meet-the-team/mark.jpg",
  },
  {
    name: "Bryan Dominic De Leon",
    role: "UI/UX Designer",
    bio: "hi",
    image: "/images/meet-the-team/bryan.png",
  },
  {
    name: "Angelo Sebastian",
    role: "Frontend Developer",
    bio: "hello",
    image: "/images/meet-the-team/angelo.jpg",
  },
];

export default function InfoPage({ pageKey }) {
  const { setCurrentPage } = useApp();
  const [selectedMember, setSelectedMember] = useState(null);
  if (pageKey === "team")
    return (
      <main className="info-page team-page">
        <div className="container-wide">
          <button className="info-back" onClick={() => setCurrentPage("home")}>
            <ArrowLeft size={15} /> Back to storefront
          </button>
          <section className="info-hero team-hero">
            <div className="info-kicker">NEXT GEAR / PEOPLE</div>
            <h1>Meet the team.</h1>
            <p>
              The people behind the control room, the catalog, and the builder
              experience.
            </p>
          </section>
          <div className="team-grid">
            {team.map((member) => (
              <button
                className="team-card"
                key={member.name}
                onClick={() => setSelectedMember(member)}
              >
                <img src={member.image} alt={member.name} />
                <span className="team-card__body">
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                  <ArrowUpRight size={16} />
                </span>
              </button>
            ))}
          </div>
          {selectedMember && (
            <div
              className="team-modal-backdrop"
              onClick={() => setSelectedMember(null)}
            >
              <div
                className="team-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="team-modal__close"
                  onClick={() => setSelectedMember(null)}
                >
                  <X size={18} />
                </button>
                <img src={selectedMember.image} alt={selectedMember.name} />
                <div>
                  <div className="info-kicker">NEXT GEAR / TEAM</div>
                  <h2>{selectedMember.name}</h2>
                  <h3>{selectedMember.role}</h3>
                  <p>{selectedMember.bio}</p>
                  <div className="team-modal__status">
                    <CheckCircle2 size={15} /> Building the next rig
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  const content = pageContent[pageKey] || pageContent.about;
  return (
    <main className="info-page">
      <div className="container-wide">
        <button className="info-back" onClick={() => setCurrentPage("home")}>
          <ArrowLeft size={15} /> Back to storefront
        </button>
        <section className="info-hero info-hero--visual">
          <div className="info-hero__copy">
            <div className="info-kicker">NEXT GEAR / {content.label}</div>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>
        </section>
        <section className="info-intro">
          <div className="info-icon">
            <ShieldCheck size={21} />
          </div>
          <p>{content.body}</p>
        </section>
        <section className="info-cards">
          {content.cards.map((card) => (
            <article key={card[0]}>
              <span>{card[0]}</span>
              <h2>{card[1]}</h2>
              <p>{card[2]}</p>
              <ArrowUpRight size={18} />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
