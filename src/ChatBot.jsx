import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG  (replace placeholder when connecting real LLM)
// ─────────────────────────────────────────────────────────────────────────────
export const API_KEY   = "PLACEHOLDER_REPLACE_WITH_YOUR_ANTHROPIC_API_KEY";
export const API_MODEL = "claude-sonnet-4-20250514";

// ─────────────────────────────────────────────────────────────────────────────
//  CHAT CONTENT
// ─────────────────────────────────────────────────────────────────────────────
export const CHAT_CONTENT = {
  root: {
    greeting: "Good evening! 👋",
    subtext: "What would you like to explore today?",
    options: [
      { id: "security-eng",  label: "🛡️  Security Engineering Solutions" },
      { id: "cybersecurity", label: "🔐  Cybersecurity Solutions"         },
      { id: "it-solutions",  label: "⚙️  IT Solutions"                   },
    ],
  },
  "security-eng": {
    title: "🛡️ Security Engineering",
    body: `We design and build security infrastructure from the ground up — hardened networks, zero-trust architectures, and resilient systems that stand up to real-world threats.\n\nOur engineers work across cloud, on-prem, and hybrid environments to embed security at every layer of your stack.\n\n✦ Zero-trust network design\n✦ Secure SDLC integration\n✦ Identity & access management\n✦ Security automation & DevSecOps`,
  },
  cybersecurity: {
    title: "🔐 Cybersecurity Solutions",
    body: `From threat detection to incident response, we protect your organisation with proactive, intelligence-driven cybersecurity.\n\nOur SOC analysts and threat hunters operate 24/7 to detect, contain, and remediate threats before they become breaches.\n\n✦ Managed detection & response (MDR)\n✦ Penetration testing & red teaming\n✦ Vulnerability management\n✦ Compliance & risk advisory (ISO 27001, NIST, MAS TRM)`,
  },
  "it-solutions": {
    title: "⚙️ IT Solutions",
    body: `End-to-end IT services tailored for businesses that need to move fast without breaking things.\n\nWe handle everything from infrastructure modernisation to managed support — so your team can focus on what matters.\n\n✦ Cloud migration & optimisation\n✦ Managed IT support & helpdesk\n✦ Business continuity & disaster recovery\n✦ IT strategy & digital transformation`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────
const FOLLOW_UP_RESPONSE =
  "Excellent choice! ✅\n\nOur specialist will review your message and contact you shortly.\n\nIn the meantime, is there anything else you'd like to explore?";

function formatText(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**"))
      return (
        <strong key={i} style={{ color: "#fff", display: "block", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>
          {line.slice(2, -2)}
        </strong>
      );
    if (line.startsWith("✦"))
      return (
        <div key={i} style={{ paddingLeft: 8, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.7 }}>
          {line}
        </div>
      );
    return <span key={i} style={{ display: "block", lineHeight: 1.65 }}>{line}</span>;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  ChatBot component
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen]               = useState(true);
  const [messages, setMessages]       = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [inputValue, setInputValue]   = useState("");
  const messagesEndRef                = useRef(null);
  const inputRef                      = useRef(null);

  // Seed greeting once
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      const root = CHAT_CONTENT.root;
      setMessages([{
        id: 1, type: "bot",
        text: `${root.greeting}\n${root.subtext}`,
        options: root.options,
      }]);
    }
  }, [initialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── option button clicked ──────────────────────────────────────────────────
  const handleOption = (option) => {
    const content = CHAT_CONTENT[option.id];
    setMessages((prev) => [
      ...prev,
      { id: Date.now(),     type: "user", text: option.label },
      { id: Date.now() + 1, type: "bot",  text: `**${content.title}**\n\n${content.body}`, showBack: true },
    ]);
  };

  // ── free-text submitted ────────────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: trimmed },
      {
        id: Date.now() + 1,
        type: "bot",
        text: FOLLOW_UP_RESPONSE,
        options: CHAT_CONTENT.root.options,   // show the 3 choices again
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── back to menu ───────────────────────────────────────────────────────────
  const handleBack = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), type: "bot",
        text: "Anything else I can help you explore? 😊",
        options: CHAT_CONTENT.root.options,
      },
    ]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toggle pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: open ? "calc(clamp(440px, 57vh, 620px) + 112px)" : 28,
          right: 28,
          padding: "10px 20px",
          borderRadius: 100,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          cursor: "pointer",
          zIndex: 1001,
          transition: "bottom 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.2s",
          display: "flex", alignItems: "center", gap: 8,
          backdropFilter: "blur(12px)",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
      >
        <span style={{ fontSize: 15 }}>{open ? "✕" : "🤖"}</span>
        {open ? "Close chat" : "Chat with HKT AI"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 28, right: 28,
          width: "clamp(360px, 30vw, 480px)",
          height: "clamp(504px, 66vh, 744px)",
          background: "rgba(8,8,14,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
          display: "flex", flexDirection: "column",
          zIndex: 1000, overflow: "hidden",
          animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          backdropFilter: "blur(24px)",
        }}>

          {/* ── Header ── */}
          <div style={{
            padding: "15px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 11,
            flexShrink: 0,
            background: "rgba(255,255,255,0.03)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>
                HKT Assistant
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 5px #fff", animation: "pulse 2s infinite" }} />
                <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontFamily: "monospace" }}>online</span>
              </div>
            </div>
          </div>

          {/* ── Messages ── */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "13px 13px 6px",
            display: "flex", flexDirection: "column", gap: 9,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Bubble */}
                <div style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  background: msg.type === "user" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: msg.type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "9px 13px",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {formatText(msg.text)}
                </div>

                {/* Option buttons */}
                {msg.options && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
                    {msg.options.map((opt) => (
                      <button key={opt.id} onClick={() => handleOption(opt)} style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 10, padding: "8px 13px",
                        color: "#fff", fontSize: 12.5,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.18s ease",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateX(0)"; }}
                      >{opt.label}</button>
                    ))}
                  </div>
                )}

                {/* Back button */}
                {msg.showBack && (
                  <button onClick={handleBack} style={{
                    alignSelf: "flex-start",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "5px 11px",
                    color: "rgba(255,255,255,0.38)", fontSize: 11.5,
                    cursor: "pointer", marginTop: 2,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.18s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >← Back to menu</button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input row ── */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", gap: 8, alignItems: "flex-end",
            flexShrink: 0,
            background: "rgba(255,255,255,0.02)",
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // auto-grow up to ~3 lines
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 72) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "9px 13px",
                color: "#fff",
                fontSize: 12.5,
                fontFamily: "'DM Sans', sans-serif",
                resize: "none",
                outline: "none",
                lineHeight: 1.5,
                height: 38,
                overflowY: "hidden",
                transition: "border-color 0.2s",
                // placeholder colour
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                flexShrink: 0,
                width: 36, height: 36,
                borderRadius: 10,
                background: inputValue.trim() ? "#fff" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: inputValue.trim() ? "#000" : "rgba(255,255,255,0.25)",
                fontSize: 15,
                cursor: inputValue.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
                marginBottom: 1,
              }}
              title="Send (Enter)"
            >
              ↑
            </button>
          </div>

          {/* ── Footer hint ── */}
          <div style={{
            padding: "6px 14px 8px",
            textAlign: "center",
            color: "rgba(255,255,255,0.16)",
            fontSize: 10,
            fontFamily: "monospace",
            flexShrink: 0,
          }}>
            AI-powered by HKT · LLM upgrade coming soon
          </div>
        </div>
      )}
    </>
  );
}
