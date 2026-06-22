import { useState, useRef, useEffect } from "react";
import { C, btn } from "../tokens";
import { supabase } from "../supabase";
import ChatLogo from "../components/ChatLogo";

// ═══════════════════════════════════════════════════════════════
// AUTH SCREEN — Email OTP (4 dígitos)
// Flujo: email → OTP → Supabase guarda progress → onSuccess()
// ═══════════════════════════════════════════════════════════════
export default function AuthScreen({ onSuccess }) {
  const [phase, setPhase] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const emailRef = useRef(null);

  useEffect(() => {
    if (phase === "email" && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 300);
    }
    if (phase === "otp") {
      setTimeout(() => inputRefs[0].current?.focus(), 300);
    }
  }, [phase]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // ─── SEND OTP ───────────────────────────────────────────────
  async function handleSendCode() {
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
        options: { shouldCreateUser: true },
      });
      if (err) throw err;
      setPhase("otp");
      setResendCooldown(60);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── OTP INPUT HANDLING ─────────────────────────────────────
  function handleOtpChange(i, val) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    setError("");
    if (digit && i < 3) {
      inputRefs[i + 1].current?.focus();
    }
    if (next.every(d => d !== "") && next.join("").length === 4) {
      verifyOtp(next.join(""));
    }
  }

  function handleOtpKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs[i - 1].current?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 3);
    inputRefs[focusIdx].current?.focus();
    if (pasted.length === 4) verifyOtp(pasted);
  }

  // ─── VERIFY OTP ─────────────────────────────────────────────
  async function verifyOtp(code) {
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "email",
      });
      if (err) throw err;

      const userId = data.user?.id;
      if (userId) {
        // Guardar lesson 1 completada en Supabase
        const { error: dbErr } = await supabase
          .from("progress")
          .upsert(
            { user_id: userId, lesson_number: 1, completed: true, slide: 5 },
            { onConflict: "user_id,lesson_number" }
          );
        if (dbErr) console.error("Progress save error:", dbErr);
      }

      onSuccess();
    } catch (err) {
      setError("Incorrect code. Please check your email and try again.");
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } finally {
      setLoading(false);
    }
  }

  // ─── RESEND ─────────────────────────────────────────────────
  async function handleResend() {
    if (resendCooldown > 0) return;
    setError("");
    setOtp(["", "", "", ""]);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true },
      });
      if (err) throw err;
      setResendCooldown(60);
      setTimeout(() => inputRefs[0].current?.focus(), 300);
    } catch {
      setError("Couldn't resend. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── STYLES ─────────────────────────────────────────────────
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

  const otpBox = {
    width: "100%",
    height: 64,
    borderRadius: 14,
    border: `1.5px solid ${C.grisB}`,
    fontSize: 28,
    fontWeight: 900,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: C.textH,
    background: C.grisS,
    textAlign: "center",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    caretColor: C.magenta,
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER — PHASE: EMAIL
  // ═══════════════════════════════════════════════════════════
  if (phase === "email") {
    return (
      <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.35s ease" }}>

          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <ChatLogo size={64} bg={C.magenta} />
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, marginBottom: 8 }}>
              Create your free account
            </h2>
            <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>
              Continue to Lesson 2 — Isla Mujeres.<br />No password needed.
            </p>
          </div>

          {/* Card */}
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
              onKeyDown={e => e.key === "Enter" && !loading && handleSendCode()}
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
              onClick={handleSendCode}
              disabled={loading}
              style={{ ...btn(C.magenta, { width: "100%", fontSize: 15, padding: "15px", borderRadius: 14, marginTop: 16, opacity: loading ? 0.7 : 1 }), touchAction: "manipulation" }}>
              {loading ? "Sending…" : "Send my code →"}
            </button>

            <p style={{ fontSize: 12, color: C.textM, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
              We'll send a 4-digit code to your inbox.<br />No spam, ever.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER — PHASE: OTP
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.35s ease" }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <ChatLogo size={64} bg={C.magenta} />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, marginBottom: 8 }}>
            Check your email
          </h2>
          <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>
            We sent a 4-digit code to<br />
            <strong style={{ color: C.textH }}>{email}</strong>
          </p>
        </div>

        {/* Card */}
        <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 20, padding: "28px 24px" }}>

          <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: C.textH, marginBottom: 12, letterSpacing: -0.2 }}>
            Enter your code
          </label>

          {/* 4 OTP boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                disabled={loading}
                style={{
                  ...otpBox,
                  borderColor: digit ? C.magenta : C.grisB,
                  background: digit ? C.magentaL : C.grisS,
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: "10px 14px", background: C.rojoL, border: `1.5px solid ${C.rojo}30`, borderRadius: 10, fontSize: 13, color: C.rojo, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => verifyOtp(otp.join(""))}
            disabled={loading || otp.some(d => !d)}
            style={{ ...btn(C.magenta, { width: "100%", fontSize: 15, padding: "15px", borderRadius: 14, opacity: (loading || otp.some(d => !d)) ? 0.5 : 1 }), touchAction: "manipulation" }}>
            {loading ? "Verifying…" : "Verify →"}
          </button>

          {/* Resend */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            {resendCooldown > 0 ? (
              <p style={{ fontSize: 13, color: C.textM, fontWeight: 500 }}>
                Resend code in <strong style={{ color: C.textS }}>{resendCooldown}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                style={{ background: "none", border: "none", fontSize: 13, color: C.magenta, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0, touchAction: "manipulation" }}>
                Didn't get it? Resend code
              </button>
            )}
          </div>

          {/* Change email */}
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              type="button"
              onClick={() => { setPhase("email"); setOtp(["", "", "", ""]); setError(""); }}
              style={{ background: "none", border: "none", fontSize: 12, color: C.textM, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0, touchAction: "manipulation" }}>
              Wrong email? Change it
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
