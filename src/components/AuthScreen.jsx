import { useState, useRef, useEffect } from "react";
import { C, btn } from "../tokens";
import { supabase } from "../supabase";
import ChatLogo from "../components/ChatLogo";

export default function AuthScreen({ onSuccess }) {
  const [phase, setPhase] = useState("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    if (phase === "email" && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 300);
    }
  }, [phase]);

  // Detectar cuando Supabase redirige de vuelta con sesión activa
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const userId = session.user.id;
        const { error: dbErr } = await supabase
          .from("progress")
          .upsert(
            { user_id: userId, lesson_number: 1, completed: true, slide: 5 },
            { onConflict: "user_id,lesson_number" }
          );
        if (dbErr) console.error("Progress save error:", dbErr);
        onSuccess();
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSendLink() {
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: "https://www.chatinspanish.com",
        },
      });
      if (err) throw err;
      setPhase("sent");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputBase = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1.5px solid ${C.grisB}`,
    fontSize: 16,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    color: C.textH,
    background: C.grisS,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  if (phase === "email") {
    return (
      <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.35s ease" }}>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <ChatLogo size={64} bg={C.magenta} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, marginBottom: 8 }}>
              Create your free account
            </h2>
            <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>
              Continue to Lesson 2 — Isla Mujeres.<br />No password needed.
            </p>
          </div>

          <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 20, padding: "28px 24px" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: C.textH, marginBottom: 8, letterSpacing: -0.2 }}>
              Your email
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && !loading && handleSendLink()}
              style={inputBase}
              autoComplete="email"
              autoCapitalize="none"
              disabled={loading}
            />

            {error && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: C.rojoL, border: `1.5px solid ${C.rojo}30`, borderRadius: 10, fontSize: 13, color: C.rojo, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSendLink}
              disabled={loading}
              style={{ ...btn(C.magenta, { width: "100%", fontSize: 15, padding: "15px", borderRadius: 14, marginTop: 16, opacity: loading ? 0.7 : 1 }), touchAction: "manipulation" }}>
              {loading ? "Sending…" : "Send my link →"}
            </button>

            <p style={{ fontSize: 12, color: C.textM, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
              We'll send a sign-in link to your inbox.<br />No password, no spam, ever.
            </p>
          </div>
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // Phase: sent
  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.35s ease" }}>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <ChatLogo size={64} bg={C.magenta} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, marginBottom: 8 }}>
            Check your email
          </h2>
          <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>
            We sent a sign-in link to<br />
            <strong style={{ color: C.textH }}>{email}</strong>
          </p>
        </div>

        <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
            ✉️
          </div>
          <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.7, marginBottom: 24 }}>
            Tap the link in your email to continue.<br />
            <span style={{ fontSize: 13, color: C.textM }}>It may take a minute to arrive.</span>
          </p>
          <button
            type="button"
            onClick={() => { setPhase("email"); setError(""); }}
            style={{ background: "none", border: "none", fontSize: 13, color: C.magenta, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0, touchAction: "manipulation" }}>
            Wrong email? Try again
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
