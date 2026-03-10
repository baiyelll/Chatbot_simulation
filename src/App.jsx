import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import "./styles.css";

const ROTATING_WORDS = ["Security.", "Innovation.", "Resilience.", "Excellence.", "Protection."];

function useTypewriter(words, typeSpeed = 80, deleteSpeed = 50, pause = 1900) {
  const [display,    setDisplay]    = useState("");
  const [wordIdx,    setWordIdx]    = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx % words.length];
    let timeout;
    if (!isDeleting && display === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && display === "") {
      setIsDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setDisplay(isDeleting ? current.slice(0, display.length - 1) : current.slice(0, display.length + 1));
      }, isDeleting ? deleteSpeed : typeSpeed);
    }
    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);
  return display;
}

function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#000" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "gridScroll 10s linear infinite",
      }} />
      <div style={{ position: "absolute", top: "12%", left: "8%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)", filter: "blur(70px)", animation: "orb1 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "6%", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)", filter: "blur(90px)", animation: "orb2 15s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)" }} />
    </div>
  );
}

function Nav() {
  return (
    <nav className="hero-fade" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", color: "#fff" }}>HKT</span>
      <div style={{ display: "flex", gap: 32 }}>
        {["Solutions","Security","Platform","Contact"].map((item) => (
          <a key={item} href="#" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >{item}</a>
        ))}
      </div>
      <div style={{ padding: "8px 22px", borderRadius: 100, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
      >Get Started →</div>
    </nav>
  );
}

function Hero() {
  const typed = useTypewriter(ROTATING_WORDS);
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 32px 80px" }}>
      <div className="hero-fade-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", marginBottom: 36, fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em" }}>
        <span style={{ animation: "pulse 2s infinite", color: "#fff" }}>⬤</span>
        UNIFIED IT PLATFORM · ONE CLICK
      </div>
      <h1 className="hero-fade-2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(50px, 9vw, 130px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: "#fff", marginBottom: 10 }}>
        Welcome to<br />
        <span style={{ background: "linear-gradient(90deg,#fff,rgba(255,255,255,0.6),#fff) 0/200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 5s linear infinite", backgroundClip: "text" }}>
          Webpage of HKT
        </span>
      </h1>
      <div className="hero-fade-3" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 52px)", marginTop: 18, marginBottom: 28, minHeight: "1.2em", color: "#fff", letterSpacing: "-0.02em" }}>
        <span style={{ color: "rgba(255,255,255,0.28)" }}>Built for </span>
        <span style={{ color: "#fff" }}>{typed}</span>
        <span style={{ display: "inline-block", width: 3, height: "0.82em", background: "#fff", marginLeft: 3, verticalAlign: "middle", borderRadius: 2, animation: "blink 1s step-end infinite" }} />
      </div>
      <p className="hero-fade-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(15px, 1.8vw, 19px)", color: "rgba(255,255,255,0.38)", maxWidth: 580, lineHeight: 1.75, marginBottom: 48 }}>
        Please find below all the IT solutions you need —{" "}
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>unified platform, one click.</span> 🚀
      </p>
      <div className="hero-fade-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <button style={{ padding: "13px 36px", borderRadius: 100, background: "#fff", border: "none", color: "#000", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer", transition: "transform 0.2s, opacity 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
        >Explore Solutions ⚡</button>
        <button style={{ padding: "13px 36px", borderRadius: 100, background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >Talk to AI →</button>
      </div>
      <div className="hero-fade-4" style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.18)", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35))", animation: "pulse 2s infinite" }} />
        SCROLL
      </div>
    </section>
  );
}

const CARDS = [
  { icon: "🛡️", tag: "FOUNDATION", title: "Security Engineering", desc: "Zero-trust architectures and hardened infrastructure built by seasoned security engineers who've seen the edge cases." },
  { icon: "🔐", tag: "PROTECTION",  title: "Cybersecurity",       desc: "24/7 threat detection, incident response, and compliance advisory for organisations that can't afford downtime." },
  { icon: "⚙️", tag: "OPERATIONS", title: "IT Solutions",        desc: "End-to-end managed services, cloud migration, and digital transformation at a pace that suits your business." },
];

function Cards() {
  return (
    <section style={{ padding: "60px 48px 160px", maxWidth: 1160, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", marginBottom: 16 }}>OUR CAPABILITIES</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", color: "#fff", letterSpacing: "-0.02em" }}>Everything you need, in one place</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
        {CARDS.map((c) => (
          <div key={c.title} className="card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 30 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", marginBottom: 10 }}>{c.tag}</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 19, color: "#fff", marginBottom: 12 }}>{c.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}>{c.desc}</p>
            <div style={{ marginTop: 24, color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >Learn more →</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.18)" }}>© 2026 HKT · All rights reserved</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.18)" }}>Unified Platform · One Click 🔷</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Background />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Cards />
        <Footer />
      </div>
      <ChatBot />
    </>
  );
}
