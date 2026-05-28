import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS — Chat in Spanish
// ═══════════════════════════════════════════════════════════════
const C = {
  magenta:  "#E0006E", magentaL: "#FCE0EF", magentaD: "#A80052",
  turquesa: "#00A8B8", turquesaL:"#E0F6F8", turquesaD:"#007E8A",
  azul:     "#00A8E0", azulL:    "#E0F4FC", azulD:    "#0078A8",
  morado:   "#8830A0",
  negro:    "#0A0A0F", blanco:   "#FFFFFF",
  grisS:    "#F6F7F9", grisB:    "#E8E8F0",
  textH:    "#0A0A0F", textS:    "#5A5A70", textM:    "#9A9AB0",
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const btn = (bg, extra = {}) => ({
  background: bg, border: "none", color: C.blanco,
  padding: "14px 28px", borderRadius: 50, cursor: "pointer",
  fontSize: 15, fontWeight: 800, letterSpacing: -0.3,
  transition: "all 0.2s", boxShadow: `0 3px 14px ${bg}40`,
  ...extra,
});

const outlineBtn = (color) => ({
  background: C.blanco, border: `1.5px solid ${color}`,
  color: color, padding: "9px 20px", borderRadius: 50,
  cursor: "pointer", fontSize: 13, fontWeight: 700,
  transition: "all 0.2s",
});

// ═══════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════
function ChatLogo({ size = 36, bg = C.magenta }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 10px ${bg}50` }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H7L12 23L17 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white" opacity="0.95"/>
        <circle cx="8" cy="10" r="1.5" fill={bg}/>
        <circle cx="12" cy="10" r="1.5" fill={bg}/>
        <circle cx="16" cy="10" r="1.5" fill={bg}/>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — HEADER
// ═══════════════════════════════════════════════════════════════
function Header({ onStartFree }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.grisB}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <ChatLogo size={36} bg={C.magenta} />
          <span style={{ fontSize: 18, fontWeight: 800, color: C.negro, letterSpacing: -0.5 }}>Chat in Spanish</span>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 600, color: C.textS, textDecoration: "none" }}>How it Works</a>
          <a href="#pricing" style={{ fontSize: 14, fontWeight: 600, color: C.textS, textDecoration: "none" }}>Pricing</a>
        </nav>

        {/* Desktop buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="desktop-nav">
          <button style={outlineBtn(C.negro)}>Log In</button>
          <button onClick={onStartFree} style={{ ...btn(C.negro), padding: "9px 20px", fontSize: 13 }}>Start Free</button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 22, height: 2, background: C.negro, marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: C.negro, marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: C.negro, borderRadius: 2 }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: C.blanco, borderTop: `1px solid ${C.grisB}`, padding: "20px 24px" }} className="mobile-menu">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} style={{ display: "block", fontSize: 16, fontWeight: 600, color: C.textS, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${C.grisB}` }}>How it Works</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ display: "block", fontSize: 16, fontWeight: 600, color: C.textS, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${C.grisB}` }}>Pricing</a>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ ...outlineBtn(C.negro), flex: 1, padding: "12px" }}>Log In</button>
            <button onClick={onStartFree} style={{ ...btn(C.negro), flex: 1, padding: "12px", borderRadius: 12 }}>Start Free</button>
          </div>
        </div>
      )}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — HERO
// ═══════════════════════════════════════════════════════════════
function Hero({ onStartFree }) {
  return (
    <section style={{ background: C.magenta, padding: "0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "flex", alignItems: "center", gap: 48, minHeight: 480 }} className="hero-inner">
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: C.blanco, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 20 }}>
            Imagine ordering tacos in Spanish, making Mexican friends, and feeling at home in Mexico.
          </h1>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: C.blanco, opacity: 0.9, lineHeight: 1.7, marginBottom: 32, fontWeight: 500 }}>
            The only course that listens to you speak — and takes you on a virtual journey through Mexico from Cancún to Oaxaca.
          </p>
          <button onClick={onStartFree} style={{ ...btn(C.negro, { fontSize: 16, padding: "16px 32px", borderRadius: 50, boxShadow: `0 6px 24px rgba(0,0,0,0.3)` }) }}>
            Start Your Journey Free →
          </button>
          <p style={{ fontSize: 13, color: C.blanco, opacity: 0.7, marginTop: 12, fontWeight: 500 }}>
            No credit card required · 3 free lessons
          </p>
        </div>

        {/* Image */}
        <div style={{ width: "45%", flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }} className="hero-image">
          <img
            src="/img_tacos.png"
            alt="Backpackers enjoying tacos at authentic Mexican taqueria"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — EL PROBLEMA
// ═══════════════════════════════════════════════════════════════
function ElProblema() {
  const problems = [
    { img: "/img_frustrated.png", alt: "Frustrated woman with phone", text: '"Tried other apps for months but still can\'t hold a real conversation."' },
    { img: "/img_airport.png",    alt: "Confused backpacker at airport", text: '"Going to Mexico but scared I won\'t understand anything people say."' },
    { img: "/img_bored.png",      alt: "Bored student at laptop", text: '"Every course feels like studying for a test — boring and forgettable."' },
  ];

  return (
    <section style={{ background: C.blanco, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.negro, textAlign: "center", letterSpacing: -0.8, marginBottom: 12 }}>Sound familiar?</h2>
        <p style={{ fontSize: 16, color: C.textS, textAlign: "center", marginBottom: 48, fontWeight: 500 }}>You're not alone. Most Spanish learners face the same 3 problems.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 40 }}>
          {problems.map((p, i) => (
            <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, overflow: "hidden" }}>
              <img src={p.img} alt={p.alt} style={{ width: "100%", height: 220, objectFit: "cover", objectPosition: "top", display: "block" }} />
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.negro, lineHeight: 1.6, margin: 0 }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.magentaL, borderRadius: 14, padding: "20px 32px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: C.magentaD, margin: 0 }}>
            "You don't have a motivation problem. You have a method problem."
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4+5 — SOLUCIÓN + CÓMO FUNCIONA
// ═══════════════════════════════════════════════════════════════
function SolucionMetodo({ onStartFree }) {
  const steps = [
    { num: "1", icon: "🎬", title: "Watch", desc: "See the city on YouTube before you study it", color: C.magenta },
    { num: "2", icon: "🔊", title: "Listen", desc: "Tap any word to hear native Mexican Spanish", color: C.turquesaD },
    { num: "3", icon: "🃏", title: "Play", desc: "Memorama memory game with audio every lesson", color: C.morado },
    { num: "4", icon: "🎙️", title: "Speak", desc: "Say it out loud — the app listens and grades you instantly", color: C.magenta },
  ];

  return (
    <section id="how-it-works" style={{ background: C.turquesa, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.blanco, textAlign: "center", letterSpacing: -0.8, marginBottom: 12 }}>
          There's a better way to learn Spanish.
        </h2>
        <p style={{ fontSize: 16, color: C.blanco, opacity: 0.9, textAlign: "center", marginBottom: 8, fontWeight: 500 }}>
          Built for people who want to speak — not study.
        </p>
        <p style={{ fontSize: 16, color: C.blanco, opacity: 0.9, textAlign: "center", marginBottom: 48, fontWeight: 500 }}>
          Real Mexican Spanish. Real places. Real pronunciation feedback.
        </p>

        <div style={{ height: 1, background: "rgba(255,255,255,0.3)", marginBottom: 48 }} />

        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.blanco, textAlign: "center", marginBottom: 8 }}>How Chat in Spanish works</h3>
        <p style={{ fontSize: 14, color: C.blanco, opacity: 0.8, textAlign: "center", marginBottom: 40 }}>4 simple steps from zero to speaking real Spanish</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: C.blanco, borderRadius: 16, padding: "28px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: s.color, borderRadius: "16px 16px 0 0" }} />
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.num}. {s.title}</div>
              <div style={{ fontSize: 13, color: C.textS, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.3)", marginBottom: 40 }} />

        <div style={{ textAlign: "center" }}>
          <button onClick={onStartFree} style={{ ...btn(C.negro, { fontSize: 16, padding: "16px 36px" }) }}>
            Start Your Journey Free →
          </button>
          <p style={{ fontSize: 13, color: C.blanco, opacity: 0.7, marginTop: 12 }}>No credit card required · 3 free lessons</p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6+7 — PRICING
// ═══════════════════════════════════════════════════════════════
function Pricing({ onStartFree }) {
  const items = [
    { text: "60 lessons", sub: null },
    { text: "21 YouTube travel videos", sub: "discover Mexico while you learn" },
    { text: "Memorama every lesson", sub: null },
    { text: "3 levels:", sub: "Basic · Intermediate · Advanced" },
    { text: "Voice recognition feedback", sub: null },
    { text: "Native Mexican Spanish audio", sub: null },
  ];

  return (
    <section id="pricing" style={{ background: C.blanco, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.negro, textAlign: "center", letterSpacing: -0.8, marginBottom: 4 }}>Your entire Spanish journey:</h2>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.negro, textAlign: "center", letterSpacing: -0.8, marginBottom: 4 }}>One-time payment,</h2>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.negro, textAlign: "center", letterSpacing: -0.8, marginBottom: 48 }}>6 months full access.</h2>

        <div style={{ maxWidth: 520, margin: "0 auto", background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 24, padding: "40px 48px" }}>
          {/* Price */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 16, color: C.textM, textDecoration: "line-through", marginBottom: 4 }}>$54 USD</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: C.magenta, letterSpacing: -2, lineHeight: 1 }}>$27 USD</div>
            <div style={{ fontSize: 13, color: C.textS, marginTop: 8, fontWeight: 500 }}>Less than a coffee/week</div>
          </div>

          <div style={{ height: 1, background: C.grisB, marginBottom: 24 }} />

          {/* Items */}
          <div style={{ marginBottom: 28 }}>
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: item.sub ? 16 : 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.negro }}>{item.text}</span>
                </div>
                {item.sub && (
                  <div style={{ fontSize: 13, color: C.textS, marginLeft: 26, marginTop: 2 }}>{item.sub}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: C.grisB, marginBottom: 24 }} />

          <button onClick={onStartFree} style={{ ...btn(C.negro, { width: "100%", fontSize: 16, padding: "16px", borderRadius: 50 }) }}>
            Get Full Access →
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 8 — GARANTÍA
// ═══════════════════════════════════════════════════════════════
function Garantia({ onStartFree }) {
  return (
    <section style={{ background: C.magenta, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }} className="garantia-inner">
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, color: C.blanco, letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 20 }}>
            Try Chat in Spanish free with 3 full lessons.
          </h2>
          <p style={{ fontSize: 17, color: C.blanco, opacity: 0.9, lineHeight: 1.7, marginBottom: 16, fontWeight: 500 }}>
            If you love it, unlock everything for $27 USD.
          </p>
          <p style={{ fontSize: 17, color: C.blanco, opacity: 0.9, lineHeight: 1.7, marginBottom: 32, fontWeight: 500 }}>
            If not — no pressure, no charge.
          </p>
          <button onClick={onStartFree} style={{ ...btn(C.negro, { fontSize: 15, padding: "14px 28px" }) }}>
            Start Free →
          </button>
        </div>

        {/* Image */}
        <div style={{ width: "45%", flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }} className="garantia-image">
          <img
            src="/img_phones.png"
            alt="Students learning Spanish with Chat in Spanish app"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 9 — FAQ
// ═══════════════════════════════════════════════════════════════
function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "Do I need to have any Spanish knowledge to start?",
      a: "No, just motivation to learn a new language.",
    },
    {
      q: "Is this a subscription?",
      a: "No. One single payment of $27 USD gives you 6 months full access.",
    },
    {
      q: "What if I don't like it?",
      a: "Try 3 full lessons completely free. No credit card needed to start.",
    },
    {
      q: "What level of Spanish will I reach?",
      a: "By the end you'll handle real conversations in Mexico — ordering food, asking directions, making friends.",
    },
    {
      q: "Does it work on iPhone (iOS)?",
      a: "Yes — download Chrome on your iPhone for the full experience including voice recognition. Works on all iOS versions.",
    },
    {
      q: "Does it work on Android?",
      a: "Yes — works perfectly on Chrome for Android. Full voice recognition experience out of the box.",
    },
  ];

  return (
    <section style={{ background: C.blanco, padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 900, color: C.negro, textAlign: "center", letterSpacing: -0.8, marginBottom: 12 }}>
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: 15, color: C.textS, textAlign: "center", marginBottom: 48, fontWeight: 500 }}>
          Everything you need to know before you start
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: C.magenta, flex: 1 }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: C.magenta, fontWeight: 900, flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px", fontSize: 14, color: C.textS, lineHeight: 1.7, fontWeight: 500, animation: "fadeUp 0.2s ease" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 11 — FOOTER
// ═══════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer style={{ background: C.turquesa, padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 48 }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <ChatLogo size={32} bg="rgba(255,255,255,0.25)" />
              <span style={{ fontSize: 16, fontWeight: 800, color: C.blanco }}>Chat in Spanish</span>
            </div>
            <p style={{ fontSize: 13, color: C.blanco, opacity: 0.8, lineHeight: 1.6 }}>
              "The only Spanish course that listens back."
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.blanco, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>COURSE</div>
            {["How it Works", "Pricing", "Start Free"].map((l, i) => (
              <a key={i} href="#" style={{ display: "block", fontSize: 13, color: C.blanco, opacity: 0.8, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>{l}</a>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.blanco, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>LEGAL</div>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l, i) => (
              <a key={i} href="#" style={{ display: "block", fontSize: 13, color: C.blanco, opacity: 0.8, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>{l}</a>
            ))}
          </div>

          {/* Col 4 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.blanco, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>FOLLOW US</div>
            {["📘 Facebook", "📸 Instagram", "▶️ YouTube", "🎵 TikTok"].map((l, i) => (
              <a key={i} href="#" style={{ display: "block", fontSize: 13, color: C.blanco, opacity: 0.8, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.3)", marginBottom: 28 }} />

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.blanco, opacity: 0.65, marginBottom: 6 }}>
            © 2025 Chat in Spanish · chatinspanish.com · All rights reserved
          </p>
          <p style={{ fontSize: 12, color: C.blanco, opacity: 0.65 }}>
            contact@chatinspanish.com
          </p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHROME DETECTION MODAL
// ═══════════════════════════════════════════════════════════════
function ChromeModal({ onContinue, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.blanco, borderRadius: 20, padding: "36px 32px", maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: C.negro, marginBottom: 12 }}>For the best experience</h3>
        <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 28 }}>
          Chat in Spanish uses voice recognition to evaluate your pronunciation. For the full experience including voice feedback, please use <strong>Chrome</strong> on your iPhone. It's free and takes 30 seconds to download.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href="https://apps.apple.com/app/google-chrome/id535886823" target="_blank" rel="noreferrer" style={{ ...btn(C.negro, { textDecoration: "none", display: "block", padding: "14px" }), borderRadius: 12 }}>
            Download Chrome →
          </a>
          <button onClick={onContinue} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "13px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [showChromeModal, setShowChromeModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  function isSafariIOS() {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua);
  }

  function handleStartFree() {
    if (isSafariIOS()) {
      setPendingAction("start");
      setShowChromeModal(true);
    } else {
      startLesson();
    }
  }

  function startLesson() {
    // Navigate to lesson — implement routing here
    window.location.href = "/lesson";
  }

  function handleChromeModalContinue() {
    setShowChromeModal(false);
    startLesson();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: #FFFFFF; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        a:hover { opacity: 0.8; }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        button:active { transform: scale(0.98); }

        /* Desktop nav visible, mobile hidden */
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-menu { display: block; }
        .hero-inner { flex-direction: row; }
        .hero-image { display: block; min-height: 380px; }
        .garantia-inner { flex-direction: row; }
        .garantia-image { display: block; min-height: 320px; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-inner { flex-direction: column !important; }
          .hero-image { width: 100% !important; min-height: 260px !important; order: -1; }
          .garantia-inner { flex-direction: column !important; }
          .garantia-image { width: 100% !important; min-height: 240px !important; order: -1; }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #E0E0F0; border-radius: 3px; }
        ::selection { background: #E0F6F8; }
      `}</style>

      {showChromeModal && (
        <ChromeModal
          onContinue={handleChromeModalContinue}
          onClose={() => setShowChromeModal(false)}
        />
      )}

      <Header onStartFree={handleStartFree} />
      <Hero onStartFree={handleStartFree} />
      <ElProblema />
      <SolucionMetodo onStartFree={handleStartFree} />
      <Pricing onStartFree={handleStartFree} />
      <Garantia onStartFree={handleStartFree} />
      <FAQ />
      <Footer />
    </>
  );
}
