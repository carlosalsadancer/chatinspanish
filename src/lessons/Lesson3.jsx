import { useState, useRef, useCallback, useEffect } from "react";
import { C, btn } from "../tokens";
import { supabase } from "../supabase";

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════
const Check = ({size=24,color="#fff",strokeWidth=2}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

// ═══════════════════════════════════════════════════════════════
// EXPLORE VIDEOS
// ═══════════════════════════════════════════════════════════════
const EXPLORE_VIDEOS = [
  { city: "Cancún",       videoId: "nYIL6eAlHxA" },
  { city: "Isla Mujeres", videoId: "r6DDu_7mc5E" },
  { city: "Holbox",       videoId: "hxwcpunIgnk" },
];

// ═══════════════════════════════════════════════════════════════
// CHEAT SHEET L2
// ═══════════════════════════════════════════════════════════════
const CHEAT_SHEET_L2 = [
  { display: "pesos",          phrase: { es: "¿Dónde puedo conseguir pesos?",              en: "Where can I get pesos?" } },
  { display: "casa de cambio", phrase: { es: "¿Dónde está la casa de cambio más cercana?", en: "Where is the nearest exchange office?" } },
  { display: "cajero",         phrase: { es: "¿Hay un cajero cerca?",                       en: "Is there an ATM nearby?" } },
  { display: "precio",         phrase: { es: "¿Cuál es el precio de esto?",                 en: "What is the price of this?" } },
  { display: "cuenta",         phrase: { es: "¿Me puede traer la cuenta, por favor?",       en: "Can you bring me the bill, please?" } },
  { display: "efectivo",       phrase: { es: "¿Puedo pagar en efectivo?",                   en: "Can I pay in cash?" } },
  { display: "tarjeta",        phrase: { es: "¿Aceptan tarjeta?",                           en: "Do you accept card?" } },
  { display: "cambio",         phrase: { es: "¿Me puede dar mi cambio, por favor?",         en: "Can you give me my change, please?" } },
];

// ═══════════════════════════════════════════════════════════════
// SECTION DATA
// ═══════════════════════════════════════════════════════════════
const SECTION = {
  id: "transport", title: "Getting Around", subtitle: "Transporte",
  color: C.turquesa, colorL: C.turquesaL, colorD: C.turquesaD,
  skills: [
    "Find the right bus and your seat",
    "Ask for a taxi and share your destination",
    "Negotiate a price for your ride",
    "Check in at your hostel",
  ],
  words: [
    { es: "parada",      display: "parada",      pron: "pah-RAH-dah",       en: "bus stop",    phrase: { es: "¿Dónde está la parada del autobús ADO?",          pron: "DON-deh es-TAH lah pah-RAH-dah del ow-toh-BOOS ah-deh-OH",    en: "Where is the ADO bus stop?" } },
    { es: "autobús",     display: "autobús",     pron: "ow-toh-BOOS",       en: "bus",         phrase: { es: "¿Cuál autobús va a Cancún?",                       pron: "kwal ow-toh-BOOS bah ah kan-KOON",                             en: "Which bus goes to Cancún?" } },
    { es: "boleto",      display: "boleto",      pron: "boh-LEH-toh",       en: "ticket",      phrase: { es: "Aquí está mi boleto.",                              pron: "ah-KEE es-TAH mee boh-LEH-toh",                                en: "Here is my ticket." } },
    { es: "asiento",     display: "asiento",     pron: "ah-SYEN-toh",       en: "seat",        phrase: { es: "Disculpe, ese es mi asiento. Tengo el ocho.",       pron: "dees-KUL-peh EH-seh ehs mee ah-SYEN-toh TEN-goh el OH-choh", en: "Excuse me, that is my seat. I have number eight." } },
    { es: "taxi",        display: "taxi",        pron: "TAK-see",           en: "taxi",        phrase: { es: "¿Dónde puedo tomar un taxi?",                       pron: "DON-deh PWEH-doh toh-MAR oon TAK-see",                        en: "Where can I get a taxi?" } },
    { es: "dirección",   display: "dirección",   pron: "dee-rek-SYON",      en: "address",     phrase: { es: "Esta es la dirección de mi hotel.",                 pron: "ES-tah ehs lah dee-rek-SYON deh mee oh-TEL",                  en: "This is the address of my hotel." } },
    { es: "precio",      display: "precio",      pron: "PREH-syoh",         en: "price",       phrase: { es: "¿Cuál es el precio por llevarme al hostal?",        pron: "kwal ehs el PREH-syoh por yeh-BAR-meh al os-TAL",             en: "What is the price to take me to the hostel?" } },
    { es: "reservación", display: "reservación", pron: "reh-ser-bah-SYON",  en: "reservation", phrase: { es: "Buen día, tengo una reservación a nombre de...",    pron: "bwen DEE-ah TEN-goh OO-nah reh-ser-bah-SYON ah NOM-breh deh", en: "Good day, I have a reservation under the name of..." } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA
// ═══════════════════════════════════════════════════════════════
const QUIZ_DATA = [
  { scene: "Airport — looking for ADO bus",         q: "You need to find the ADO bus stop. What do you ask?",    correct: "¿Dónde está la parada del autobús ADO?",        options: ["¿Dónde está la parada del autobús ADO?", "¿Cuál autobús va a Cancún?", "¿Dónde puedo tomar un taxi?", "¿Cuál es el precio?"] },
  { scene: "Bus station",                            q: "You need to find the right bus. What do you ask?",       correct: "¿Cuál autobús va a Cancún?",                     options: ["¿Cuál autobús va a Cancún?", "¿Dónde está la parada?", "¿Cuál es el precio?", "Aquí está mi boleto."] },
  { scene: "Boarding the bus",                       q: "The driver asks for your ticket. What do you say?",      correct: "Aquí está mi boleto.",                           options: ["Aquí está mi boleto.", "Disculpe, ese es mi asiento.", "¿Cuál autobús va a Cancún?", "Esta es la dirección de mi hotel."] },
  { scene: "Inside the bus — someone in your seat",  q: "Someone is sitting in your seat. What do you say?",     correct: "Disculpe, ese es mi asiento. Tengo el ocho.",   options: ["Disculpe, ese es mi asiento. Tengo el ocho.", "Aquí está mi boleto.", "¿Cuál autobús va a Cancún?", "¿Dónde está la parada?"] },
  { scene: "Outside the airport — need a ride",      q: "You want to get a taxi. What do you ask?",              correct: "¿Dónde puedo tomar un taxi?",                    options: ["¿Dónde puedo tomar un taxi?", "¿Cuál es el precio?", "¿Dónde está la parada?", "Esta es la dirección de mi hotel."] },
  { scene: "Inside a taxi",                          q: "You show the driver where to go. What do you say?",     correct: "Esta es la dirección de mi hotel.",              options: ["Esta es la dirección de mi hotel.", "¿Dónde puedo tomar un taxi?", "¿Cuál es el precio?", "Aquí está mi boleto."] },
  { scene: "Negotiating taxi fare",                  q: "You want to know how much it costs. What do you ask?",  correct: "¿Cuál es el precio por llevarme al hostal?",    options: ["¿Cuál es el precio por llevarme al hostal?", "Esta es la dirección de mi hotel.", "¿Dónde puedo tomar un taxi?", "¿Dónde está la parada?"] },
  { scene: "Arriving at the hostel",                 q: "You need to check in. What do you say?",                correct: "Buen día, tengo una reservación a nombre de...", options: ["Buen día, tengo una reservación a nombre de...", "¿Cuál es el precio?", "Esta es la dirección de mi hotel.", "Aquí está mi boleto."] },
];

const TOTAL = 5;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function scoreMatch(heard, expected) {
  const norm = s => s.toLowerCase().replace(/[¿¡.,!?]/g,"").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n").trim();
  const h = norm(heard), e = norm(expected);
  if (h === e) return 100;
  const hw = h.split(" ").filter(w => w.length > 0);
  const ew = e.split(" ").filter(w => w.length > 0);
  const hits = ew.filter(ew => hw.some(hw => hw === ew || ew.includes(hw) || hw.includes(ew))).length;
  const extras = hw.filter(hw => !ew.some(ew => ew === hw || ew.includes(hw) || hw.includes(ew))).length;
  const coverage = hits / ew.length;
  const penalty = Math.min(extras * 0.08, 0.3);
  return Math.round(Math.max(0, coverage - penalty) * 100);
}

function getWordFeedback(heard, expected) {
  const norm = s => s.toLowerCase().replace(/[¿¡.,!?]/g,"").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n").trim();
  const hw = norm(heard).split(" ").filter(w => w.length > 0);
  const ew = norm(expected).split(" ").filter(w => w.length > 0);
  const missing = ew.filter(ew => !hw.some(hw => hw === ew || ew.includes(hw) || hw.includes(ew)));
  const extra = hw.filter(hw => !ew.some(ew => ew === hw || ew.includes(hw) || hw.includes(ew)));
  return { missing, extra };
}

const CELEBRATE_MESSAGES = ["Perfect!", "Great job!", "Nice pronunciation!", "Excellent!", "Well done!"];

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════
function useTTS() {
  const synth = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => { synth.current = window.speechSynthesis; return () => synth.current?.cancel(); }, []);
  const speak = useCallback((text, onWordBoundary) => {
    if (!synth.current) return;
    synth.current.cancel(); setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    const isQuestion = text.includes('¿') || text.trim().endsWith('?');
    u.lang = "es-MX"; u.rate = 0.78; u.pitch = isQuestion ? 1.15 : 1.05;
    const voices = synth.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("es-MX")) || voices.find(v => v.lang.startsWith("es"));
    if (v) u.voice = v;
    if (onWordBoundary) {
      let boundaryFired = false;
      const words = text.split(" ");
      let timerFallback = null;
      u.onboundary = (e) => {
        if (e.name === "word") {
          boundaryFired = true;
          if (timerFallback) { clearTimeout(timerFallback); timerFallback = null; }
          onWordBoundary(e.charIndex, e.charLength);
        }
      };
      timerFallback = setTimeout(() => {
        if (!boundaryFired) {
          const msPerChar = 68;
          const minMs = 220;
          let elapsed = 0;
          words.forEach((word, i) => {
            const delay = elapsed;
            setTimeout(() => {
              const charIndex = words.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);
              const charLength = words[i].length;
              onWordBoundary(charIndex, charLength);
            }, delay);
            elapsed += Math.max(minMs, word.length * msPerChar);
          });
          setTimeout(() => onWordBoundary(-1, 0), elapsed + 300);
        }
      }, 600);
    }
    u.onend = () => { setSpeaking(false); if (onWordBoundary) onWordBoundary(-1, 0); };
    u.onerror = () => { setSpeaking(false); if (onWordBoundary) onWordBoundary(-1, 0); };
    synth.current.speak(u);
  }, []);
  return { speak, speaking };
}

function useSpeechRec() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.lang = "es-MX"; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = e => { setTranscript(Array.from(e.results[0]).map(r => r.transcript.toLowerCase().trim())[0] || ""); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    recRef.current = rec;
  }, []);
  const start = useCallback(() => { if (!recRef.current) return; setTranscript(""); setListening(true); try { recRef.current.start(); } catch(e) { setListening(false); } }, []);
  const stop  = useCallback(() => { try { recRef.current?.stop(); } catch(e) {} setListening(false); }, []);
  return { transcript, listening, supported, start, stop, setTranscript };
}

// ═══════════════════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════════════════
function Confetti({ show, message }) {
  const particles = Array.from({ length: 32 });
  const colors = [C.turquesa, C.limon, C.azul, "#fff"];
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {particles.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 6 + Math.random() * 8;
        const col = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div key={i} style={{ position: "absolute", bottom: "-10px", left: `${x}%`, width: size, height: size, borderRadius: Math.random() > 0.5 ? "50%" : 2, background: col, opacity: 0.9, animation: `confettiRise ${0.8 + Math.random() * 0.8}s ease-out ${delay}s forwards` }} />
        );
      })}
      <div style={{ background: C.turquesa, borderRadius: 20, padding: "20px 36px", textAlign: "center", boxShadow: `0 8px 32px ${C.turquesa}60`, animation: "celebPop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <Check size={32} color="#fff" strokeWidth={3} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{message}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KARAOKE TEXT
// ═══════════════════════════════════════════════════════════════
function KaraokeText({ text, charIndex, charLength, color }) {
  if (charIndex < 0) return <span style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>{text}</span>;
  const before = text.slice(0, charIndex);
  const current = text.slice(charIndex, charIndex + charLength);
  const after = text.slice(charIndex + charLength);
  return (
    <span style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>
      {before}<span style={{ background: color, color: "#fff", borderRadius: 4, padding: "0 2px" }}>{current}</span>{after}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRON EXERCISE
// ═══════════════════════════════════════════════════════════════
function PronExercise({ answer, onListenPress, onPass, color = C.turquesa, passLabel = "Next →", blockMicMs = 0 }) {
  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);
  const [micBlocked, setMicBlocked] = useState(blockMicMs > 0);
  const [wordFeedback, setWordFeedback] = useState(null);
  const [btnBlocked, setBtnBlocked] = useState(false);

  useEffect(() => {
    if (blockMicMs > 0) { setMicBlocked(true); const t = setTimeout(() => setMicBlocked(false), blockMicMs); return () => clearTimeout(t); }
  }, [blockMicMs]);

  useEffect(() => {
    if (!transcript || listening) return;
    const score = scoreMatch(transcript, answer);
    const feedback = getWordFeedback(transcript, answer);
    setWordFeedback(feedback);
    setResult(score >= 90 ? "perfect" : score >= 75 ? "good" : "retry");
    setAttempts(a => a + 1);
  }, [transcript, listening]);

  function handleMic() {
    if (micBlocked) return;
    if (listening) { stop(); return; }
    setResult(null); setTranscript(""); setWordFeedback(null); start();
  }

  // FIX TRANSICIÓN 2
  function handlePass() {
    if (btnBlocked) return;
    setBtnBlocked(true);
    setTimeout(() => setBtnBlocked(false), 600);
    onPass();
  }

  const canAdvance = result === "perfect" || result === "good" || attempts >= 2;
  const resultColor = result === "perfect" ? C.limon : result === "good" ? C.azul : C.rojo;
  const resultBg    = result === "perfect" ? C.limonL : result === "good" ? C.azulL : C.rojoL;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button type="button" onClick={onListenPress}
          style={{ flex: 1, background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, touchAction: "manipulation" }}>
          <span style={{ fontSize: 24 }}>♪</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.azulD }}>Listen</span>
        </button>
        <button type="button" onClick={handleMic}
          style={{ flex: 2, border: "none", borderRadius: 14, padding: "14px 12px", cursor: micBlocked ? "default" : "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: micBlocked ? C.grisB : listening ? C.turquesa : canAdvance && result !== "retry" ? C.limon : color, transition: "all 0.2s", touchAction: "manipulation", opacity: micBlocked ? 0.5 : 1 }}>
          <span style={{ fontSize: 24 }}>{listening ? "⏹" : "◉"}</span>
          <span style={{ fontSize: 12, fontWeight: 900 }}>{listening ? "Listening…" : result ? "Try again" : "Speak now"}</span>
        </button>
      </div>
      {listening && (
        <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", height: 28, marginBottom: 10 }}>
          {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
            <div key={i} style={{ width: 3, borderRadius: 2, background: C.turquesa, height: h * 2.5, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
          ))}
        </div>
      )}
      {result && transcript && (
        <div style={{ background: resultBg, border: `1.5px solid ${resultColor}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{result === "perfect" ? "✓" : result === "good" ? "◎" : "✗"}</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: result === "perfect" ? C.limonD : result === "good" ? C.azulD : C.rojo }}>
              {result === "perfect" ? "Perfect!" : result === "good" ? "Good job!" : "Try again!"}
            </span>
          </div>
          <div style={{ fontSize: 13, color: C.textS, marginBottom: 6 }}>
            I heard: <strong style={{ color: C.textB }}>"{transcript}"</strong>
          </div>
          {result === "perfect" && (
            <div style={{ fontSize: 13, color: C.limonD, fontWeight: 600 }}>Native speakers will understand you!</div>
          )}
          {result === "good" && wordFeedback?.missing?.length > 0 && (
            <div style={{ fontSize: 13, color: C.azulD, fontWeight: 600 }}>
              Almost! Try to include: <strong>{wordFeedback.missing.join(", ")}</strong>
            </div>
          )}
          {result === "retry" && wordFeedback && (
            <div style={{ fontSize: 13, color: C.rojo, fontWeight: 600 }}>
              {wordFeedback.missing.length > 0 && <div>Missing: <strong>{wordFeedback.missing.join(", ")}</strong></div>}
              {wordFeedback.extra.length > 0 && <div style={{ marginTop: 4 }}>Extra words: <strong>{wordFeedback.extra.join(", ")}</strong></div>}
            </div>
          )}
          {attempts >= 2 && result === "retry" && (
            <div style={{ marginTop: 6, fontSize: 13, color: C.textM, fontStyle: "italic" }}>You can continue — pronunciation improves with practice!</div>
          )}
        </div>
      )}
      {!supported && <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 14, color: C.textS }}>Voice recognition works best in Chrome.</div>}
      {(canAdvance || !supported) && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button type="button" onClick={handlePass} onPointerDown={(e) => { e.preventDefault(); handlePass(); }}
            style={{ ...btn(result === "perfect" ? C.limon : color, { fontSize: 15, padding: "13px 28px", borderRadius: 50 }), touchAction: "manipulation", opacity: btnBlocked ? 0.7 : 1 }}>
            {passLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXERCISE SLIDE
// ═══════════════════════════════════════════════════════════════
function ExerciseSlide({ speak, onComplete, onBackRequest }) {
  const sec = SECTION;
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("word");
  const [done, setDone] = useState(false);
  const [karaokeIdx, setKaraokeIdx] = useState(-1);
  const [karaokeLen, setKaraokeLen] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [celebrateMsg, setCelebrateMsg] = useState("");
  const [blockMic, setBlockMic] = useState(600);
  const [btnBlocked, setBtnBlocked] = useState(false);

  useEffect(() => {
    if (onBackRequest) {
      onBackRequest.current = () => {
        if (phase === "phrase") { setPhase("word"); setKaraokeIdx(-1); setBlockMic(0); return true; }
        if (phase === "word" && wordIdx > 0) { setWordIdx(wordIdx - 1); setPhase("phrase"); setKaraokeIdx(-1); setBlockMic(0); return true; }
        return false;
      };
    }
  }, [phase, wordIdx, onBackRequest]);

  function showCelebration(msg) { setCelebrateMsg(msg); setCelebrate(true); setTimeout(() => setCelebrate(false), 1500); }
  function handleWordPass() { setBlockMic(600); setPhase("phrase"); setKaraokeIdx(-1); }
  function handlePhrasePass() {
    setKaraokeIdx(-1); setBlockMic(600);
    showCelebration(CELEBRATE_MESSAGES[wordIdx % CELEBRATE_MESSAGES.length]);
    setTimeout(() => {
      if (wordIdx + 1 < sec.words.length) { setWordIdx(wordIdx + 1); setPhase("word"); }
      else { setDone(true); }
    }, 1600);
  }
  function handleListenPhrase() {
    setKaraokeIdx(0); setKaraokeLen(0);
    speak(sec.words[wordIdx].phrase.es, (ci, cl) => { setKaraokeIdx(ci); setKaraokeLen(cl); });
  }

  // FIX TRANSICIÓN 3
  function handleComplete() {
    if (btnBlocked) return;
    setBtnBlocked(true);
    setTimeout(() => setBtnBlocked(false), 600);
    onComplete();
  }

  const cardStyle = (bg, borderColor) => ({ background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" });

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Check size={32} color={C.limonD} strokeWidth={3} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Speaking Complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 32 }}>Great work on <strong>{sec.title}</strong>!</div>
      <button type="button" onClick={handleComplete} onPointerDown={(e) => { e.preventDefault(); handleComplete(); }}
        style={{ ...btn(C.turquesa, { fontSize: 15, padding: "15px 40px", borderRadius: 50 }), touchAction: "manipulation", opacity: btnBlocked ? 0.7 : 1 }}>
        Continue →
      </button>
    </div>
  );

  const word = sec.words[wordIdx];
  return (
    <div>
      <Confetti show={celebrate} message={celebrateMsg} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "14px 16px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: sec.colorL, border: `1.5px solid ${sec.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🚌</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.textH }}>Speaking Practice</div>
          <div style={{ fontSize: 11, color: sec.colorD, fontWeight: 700 }}>{sec.title} · Word {wordIdx + 1} of {sec.words.length}</div>
        </div>
      </div>
      <div style={{ height: 4, background: C.grisB, borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(wordIdx / sec.words.length) * 100}%`, background: sec.color, borderRadius: 2, transition: "width 0.4s" }} />
      </div>
      <div style={cardStyle(sec.colorL, `${sec.color}30`)}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: sec.colorD, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Word</div>
        <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.3, marginBottom: 8 }}>{word.display}</div>
        <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 14, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.pron}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 600 }}>{word.en}</div>
      </div>
      {phase === "word" && (
        <PronExercise key={`word-${wordIdx}`} answer={word.es} onListenPress={() => speak(word.display)} onPass={handleWordPass} color={sec.color} passLabel="Now practice the phrase →" blockMicMs={blockMic} />
      )}
      {phase === "phrase" && (
        <>
          <div style={cardStyle(C.grisS, C.grisB)}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.textM, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Used in a phrase</div>
            <div style={{ marginBottom: 8, lineHeight: 1.4 }}>
              <KaraokeText text={word.phrase.es} charIndex={karaokeIdx} charLength={karaokeLen} color={sec.color} />
            </div>
            <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 14, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.phrase.pron}</div>
            <div style={{ fontSize: 14, color: C.textS, fontWeight: 600 }}>{word.phrase.en}</div>
          </div>
          <PronExercise key={`phrase-${wordIdx}`} answer={word.phrase.es} onListenPress={handleListenPhrase} onPass={handlePhrasePass} color={sec.color} passLabel={wordIdx + 1 < sec.words.length ? "Next word →" : "Section complete →"} blockMicMs={blockMic} />
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION QUIZ
// ═══════════════════════════════════════════════════════════════
function SectionQuiz({ speak, onComplete, onBackRequest }) {
  const section = SECTION;
  const questions = QUIZ_DATA;
  const [idx, setIdx] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState(() => shuffle(questions[0].options));
  const [sel, setSel] = useState(null);
  const [selBlocked, setSelBlocked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [pronResult, setPronResult] = useState(null);
  const [pronAttempts, setPronAttempts] = useState(0);
  const [micBlocked, setMicBlocked] = useState(false);
  const [nextBlocked, setNextBlocked] = useState(false);

  useEffect(() => {
    if (onBackRequest) {
      onBackRequest.current = () => {
        if (sel !== null) { setSel(null); setPronResult(null); setPronAttempts(0); setTranscript(""); return true; }
        if (idx > 0) { setIdx(i => i - 1); setSel(null); setPronResult(null); setPronAttempts(0); setTranscript(""); return true; }
        return false;
      };
    }
  }, [sel, idx, onBackRequest]);

  useEffect(() => {
    if (!transcript || listening) return;
    const sc = scoreMatch(transcript, questions[idx].correct);
    setPronResult(sc >= 90 ? "perfect" : sc >= 75 ? "good" : "retry");
    setPronAttempts(a => a + 1);
  }, [transcript, listening]);

  useEffect(() => {
    setShuffledOptions(shuffle(questions[idx].options));
    setSelBlocked(true);
    const t = setTimeout(() => setSelBlocked(false), 400);
    return () => clearTimeout(t);
  }, [idx]);

  // FIX TRANSICIÓN 4
  function select(opt) {
    if (sel !== null || selBlocked) return;
    setSel(opt);
    if (opt === questions[idx].correct) setScore(s => s + 1);
    setMicBlocked(true);
    setTimeout(() => setMicBlocked(false), 600);
  }

  function handleMic() {
    if (micBlocked || listening) { if (listening) stop(); return; }
    setPronResult(null); setTranscript(""); start();
  }

  // FIX TRANSICIÓN 5
  function nextQuestion() {
    if (nextBlocked) return;
    setNextBlocked(true);
    setTimeout(() => setNextBlocked(false), 600);
    if (idx + 1 >= questions.length) { setCelebrate(true); setTimeout(() => { setCelebrate(false); setDone(true); }, 1600); return; }
    setIdx(i => i + 1); setSel(null); setPronResult(null); setPronAttempts(0); setTranscript("");
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Check size={32} color={C.limonD} strokeWidth={3} />
        </div>
        <div style={{ fontSize: "clamp(48px,12vw,64px)", fontWeight: 900, color: section.color, lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>{score}/{questions.length}</div>
        <div style={{ fontSize: 20, color: C.textH, fontWeight: 800, marginBottom: 8 }}>{pct >= 75 ? "Excellent!" : pct >= 50 ? "Well done!" : "Keep going!"}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>{pct >= 75 ? "You really know your transport phrases!" : "Practice makes perfect — you've got this."}</div>
        <button type="button" onClick={onComplete} onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ ...btn(C.turquesa, { fontSize: 15, padding: "15px 36px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Continue →
        </button>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = sel === q.correct;
  const canAdvancePron = pronResult === "perfect" || pronResult === "good" || pronAttempts >= 2;

  return (
    <div>
      <Confetti show={celebrate} message="Practice Complete!" />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, fontSize: 24, color: "#fff" }}>?</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Practice</div>
          <div style={{ fontSize: 12, color: section.colorD, fontWeight: 700 }}>{section.title} · Question {idx + 1} of {questions.length}</div>
        </div>
      </div>
      <div style={{ height: 6, background: C.grisS, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / questions.length) * 100}%`, background: `linear-gradient(90deg,${section.color},${section.colorD})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 20 }}>
        <span>{idx + 1} / {questions.length}</span>
        <span style={{ color: section.color, fontWeight: 900 }}>Score: {score}</span>
      </div>
      <div style={{ background: C.azulL, border: `1.5px solid ${C.azul}30`, borderLeft: `5px solid ${C.azul}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.azulD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{q.scene}</div>
        <div style={{ fontSize: "clamp(14px,3vw,17px)", color: C.textH, lineHeight: 1.65, fontWeight: 700 }}>{q.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {shuffledOptions.map((opt, i) => {
          const isC = opt === q.correct, isS = opt === sel;
          let bg = "#fff", border = C.grisB, tc = C.textB, fw = 600;
          if (sel !== null) {
            if (isC) { bg = C.limonL; border = C.limon; tc = C.limonD; fw = 800; }
            else if (isS) { bg = C.rojoL; border = C.rojo; tc = C.rojo; fw = 700; }
          }
          return (
            <button type="button" key={i} onClick={() => select(opt)} onPointerDown={(e) => { e.preventDefault(); select(opt); }}
              style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "14px 16px", textAlign: "left", cursor: sel !== null ? "default" : "pointer", color: tc, fontSize: 14, fontWeight: fw, transition: "all 0.18s", display: "flex", alignItems: "center", gap: 12, touchAction: "manipulation" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: sel !== null && isC ? C.limon : isS && !isC ? C.rojo : C.grisS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: sel !== null && (isC || (isS && !isC)) ? "#fff" : C.textM }}>
                {sel !== null && isC ? "✓" : isS && !isC ? "✗" : ["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <>
          <div style={{ background: C.limonL, border: `1.5px solid ${C.limon}60`, borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: C.limonD, marginBottom: 8 }}>
              {isCorrect ? "✓ Correct! Now say it out loud:" : "This is the correct answer, say it out loud:"}
            </div>
            <div style={{ fontSize: "clamp(14px,3vw,17px)", fontWeight: 900, color: C.limonD, lineHeight: 1.3 }}>{q.correct}</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <button type="button" onClick={handleMic}
              style={{ ...btn(micBlocked || listening ? C.turquesa : pronResult === "perfect" || pronResult === "good" ? C.limon : section.color, { fontSize: 15, padding: "14px 32px", borderRadius: 50 }), touchAction: "manipulation", opacity: micBlocked ? 0.5 : 1 }}>
              {listening ? "⏹  Listening…" : pronResult ? "◉  Try again" : "◉  Tap to speak"}
            </button>
          </div>
          {listening && (
            <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", height: 28, marginBottom: 10 }}>
              {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: C.turquesa, height: h * 2.5, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
              ))}
            </div>
          )}
          {pronResult && transcript && (
            <div style={{ background: pronResult === "perfect" ? C.limonL : pronResult === "good" ? C.azulL : C.rojoL, border: `1.5px solid ${pronResult === "perfect" ? C.limon : pronResult === "good" ? C.azul : C.rojo}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: pronResult === "perfect" ? C.limonD : pronResult === "good" ? C.azulD : C.rojo, marginBottom: 4 }}>
                {pronResult === "perfect" ? "Perfect!" : pronResult === "good" ? "Good job!" : "Try again!"}
              </div>
              <div style={{ fontSize: 14, color: C.textS }}>
                {pronResult === "retry" && <>I heard: <strong>"{transcript}"</strong></>}
                {pronResult === "perfect" && "Native speakers will understand you!"}
                {pronResult === "good" && "Good pronunciation!"}
              </div>
            </div>
          )}
          {!supported && <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 14, color: C.textS }}>Voice recognition works best in Chrome.</div>}
          {(canAdvancePron || !supported) && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button type="button" onClick={nextQuestion} onPointerDown={(e) => { e.preventDefault(); nextQuestion(); }}
                style={{ ...btn(pronResult === "perfect" ? C.limon : section.color, { fontSize: 15, padding: "14px 32px", borderRadius: 50 }), touchAction: "manipulation", opacity: nextBlocked ? 0.7 : 1 }}>
                {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FINAL QUIZ
// ═══════════════════════════════════════════════════════════════
function FinalQuiz({ speak, onComplete }) {
  const situations = [
    { en: "You need to find the ADO bus stop. What do you ask, in Spanish?",             correct: "¿Dónde está la parada del autobús ADO?" },
    { en: "You need to find the right bus to Cancún. What do you ask, in Spanish?",      correct: "¿Cuál autobús va a Cancún?" },
    { en: "The driver asks for your ticket. What do you say, in Spanish?",               correct: "Aquí está mi boleto." },
    { en: "Someone is sitting in your seat. What do you say, in Spanish?",               correct: "Disculpe, ese es mi asiento. Tengo el ocho." },
    { en: "You need to get a taxi. What do you ask, in Spanish?",                        correct: "¿Dónde puedo tomar un taxi?" },
    { en: "You want to show the driver where to go. What do you say, in Spanish?",       correct: "Esta es la dirección de mi hotel." },
    { en: "You want to know how much the ride costs. What do you ask, in Spanish?",      correct: "¿Cuál es el precio por llevarme al hostal?" },
    { en: "You arrive at the hostel and need to check in. What do you say, in Spanish?", correct: "Buen día, tengo una reservación a nombre de..." },
  ];
  const [order] = useState(() => shuffle([0,1,2,3,4,5,6,7]));
  const [phase, setPhase] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [counted, setCounted] = useState(false);
  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [result, setResult] = useState(null);
  const [micBlocked, setMicBlocked] = useState(false);
  const [nextBlocked, setNextBlocked] = useState(false);

  useEffect(() => {
    if (!transcript || listening) return;
    const q = situations[order[idx]];
    const sc = scoreMatch(transcript, q.correct);
    setResult(sc >= 90 ? "perfect" : sc >= 75 ? "good" : "retry");
    setAttempts(a => a + 1);
  }, [transcript, listening]);

  function handleListen() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(situations[order[idx]].en);
    u.lang = "en-US"; u.rate = 0.95; synth.speak(u);
  }

  function handleMic() {
    if (micBlocked) return;
    if (listening) { stop(); return; }
    setResult(null); setTranscript(""); start();
  }

  // FIX TRANSICIÓN 6
  function handleStart() {
    setPhase("quiz");
    setMicBlocked(true);
    setTimeout(() => setMicBlocked(false), 600);
  }

  // FIX TRANSICIÓN 7
  function nextSituation() {
    if (nextBlocked) return;
    setNextBlocked(true);
    setTimeout(() => setNextBlocked(false), 600);
    if ((result === "perfect" || result === "good") && !counted) { setScore(s => s + 1); setCounted(true); }
    if (idx + 1 >= order.length) { setCelebrate(true); setTimeout(() => { setCelebrate(false); setDone(true); }, 1600); return; }
    setIdx(i => i + 1); setAttempts(0); setResult(null); setTranscript(""); setCounted(false);
    setMicBlocked(true);
    setTimeout(() => setMicBlocked(false), 600);
  }

  const canAdvance = result === "perfect" || result === "good" || attempts >= 2;

  if (phase === "intro") return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "16px 18px", background: C.turquesaL, borderRadius: 16, border: `1.5px solid ${C.turquesa}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🎤</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Final Challenge</div>
          <div style={{ fontSize: 12, color: C.turquesaD, fontWeight: 700 }}>Getting Around · Quiz</div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.7, marginBottom: 24 }}>
        Listen to the situation in English. Then say the Spanish phrase from memory — no text, no hints. Just you and your Spanish.
      </p>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={handleStart} onPointerDown={(e) => { e.preventDefault(); handleStart(); }}
          style={{ ...btn(C.turquesa, { fontSize: 15, padding: "16px 44px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Start →
        </button>
      </div>
    </div>
  );

  if (done) {
    const pct = Math.round((score / order.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Check size={32} color={C.limonD} strokeWidth={3} />
        </div>
        <div style={{ fontSize: "clamp(48px,12vw,64px)", fontWeight: 900, color: C.turquesa, lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>{score}/{order.length}</div>
        <div style={{ fontSize: 20, color: C.textH, fontWeight: 800, marginBottom: 8 }}>{pct >= 75 ? "Excellent!" : pct >= 50 ? "Well done!" : "Keep going!"}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>{pct >= 75 ? "You can really speak this!" : "Practice makes perfect — you've got this."}</div>
        <button type="button" onClick={onComplete} onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ ...btn(C.turquesa, { fontSize: 15, padding: "15px 36px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Continue →
        </button>
      </div>
    );
  }

  const q = situations[order[idx]];
  return (
    <div>
      <Confetti show={celebrate} message="Quiz Complete!" />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 8 }}>
        <span>{idx + 1} / {order.length}</span>
        <span style={{ color: C.turquesa, fontWeight: 900 }}>Score: {score}</span>
      </div>
      <div style={{ height: 5, background: C.grisS, borderRadius: 3, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(idx / order.length) * 100}%`, background: C.turquesa, borderRadius: 3, transition: "width 0.4s" }} />
      </div>
      <div style={{ background: C.grisS, borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center" }}>
        <button type="button" onClick={handleListen}
          style={{ background: C.turquesa, border: "none", width: 64, height: 64, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", touchAction: "manipulation" }}>
          <span style={{ fontSize: 26, color: "#fff" }}>♪</span>
        </button>
        <div style={{ fontSize: 13, color: C.textM }}>Tap to hear the situation</div>
      </div>
      {result && transcript && (
        <div style={{ background: result === "perfect" ? C.limonL : result === "good" ? C.azulL : C.rojoL, border: `1.5px solid ${result === "perfect" ? C.limon : result === "good" ? C.azul : C.rojo}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: result === "perfect" ? C.limonD : result === "good" ? C.azulD : C.rojo, marginBottom: 4 }}>
            {result === "perfect" ? "Perfect!" : result === "good" ? "Good job!" : "Try again!"}
          </div>
          <div style={{ fontSize: 13, color: C.textS }}>
            {result === "retry" ? <>I heard: <strong>"{transcript}"</strong></> : "Native speakers will understand you!"}
          </div>
        </div>
      )}
      {attempts >= 2 && result === "retry" && (
        <div style={{ background: C.grisS, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.textM, marginBottom: 6 }}>The phrase was:</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.textH }}>{q.correct}</div>
        </div>
      )}
      <button type="button" onClick={handleMic}
        style={{ width: "100%", border: "none", borderRadius: 50, padding: "16px", fontSize: 15, fontWeight: 900, color: "#fff", cursor: "pointer", marginBottom: 12, background: micBlocked ? C.grisB : listening ? C.turquesa : (result === "perfect" || result === "good") ? C.limon : C.turquesa, touchAction: "manipulation", opacity: micBlocked ? 0.5 : 1 }}>
        {listening ? "⏹ Listening…" : result ? "◉ Try again" : "◉ Tap to speak"}
      </button>
      {!supported && <div style={{ background: C.grisS, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: C.textS, textAlign: "center" }}>Voice recognition works best in Chrome.</div>}
      {(canAdvance || !supported) && (
        <div style={{ textAlign: "center" }}>
          <button type="button" onClick={nextSituation} onPointerDown={(e) => { e.preventDefault(); nextSituation(); }}
            style={{ ...btn(result === "perfect" ? C.limon : C.turquesa, { fontSize: 15, padding: "14px 32px", borderRadius: 50 }), touchAction: "manipulation", opacity: nextBlocked ? 0.7 : 1 }}>
            {idx + 1 >= order.length ? "See Results →" : "Next Situation →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LESSON COMPLETE
// ═══════════════════════════════════════════════════════════════
function LessonComplete({ onNext }) {
  const section = SECTION;
  const [celebrate, setCelebrate] = useState(true);
  useEffect(() => { setTimeout(() => setCelebrate(false), 2000); }, []);
  return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
      <Confetti show={celebrate} message="Lesson 3 Complete!" />
      <div style={{ width: 72, height: 72, borderRadius: 22, background: C.turquesaL, border: `1.5px solid ${C.turquesa}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>🚌</div>
      <h2 style={{ fontSize: "clamp(24px,6vw,32px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 8 }}>Lesson 3 Complete!</h2>
      <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 24 }}>You just navigated to Holbox — in Spanish!</p>
      <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 16, padding: "20px", marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesaD, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>You can now:</div>
        {section.skills.map((skill, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.limon, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={13} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 14, color: C.textB, fontWeight: 600 }}>{skill}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Words learned",       value: "8", color: C.turquesa },
          { label: "Phrases practiced",   value: "8", color: C.turquesa },
          { label: "Situations mastered", value: "8", color: C.turquesa },
        ].map((s, i) => (
          <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textS, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onNext} onPointerDown={(e) => { e.preventDefault(); onNext(); }}
        style={{ ...btn(C.turquesa, { fontSize: 15, padding: "16px 40px", borderRadius: 50, boxShadow: `0 6px 24px ${C.turquesa}40` }), touchAction: "manipulation" }}>
        Continue to Lesson 4 →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEAVE CONTENT
// ═══════════════════════════════════════════════════════════════
const LEAVE_CONTENT = {
  screen:   { q: "Leave this screen?",   d: "Your progress is saved. Come back anytime to pick up right here.",                          stay: "Keep Going",      leave: "Leave Screen" },
  exercise: { q: "Leave this exercise?", d: "You'll restart this exercise from the beginning next time. Keep going to lock it in!",       stay: "Keep Practicing", leave: "Leave Exercise" },
  practice: { q: "Leave this practice?", d: "You'll restart this practice from the beginning next time. You're doing great — keep going!", stay: "Keep Going",      leave: "Leave Practice" },
  quiz:     { q: "Leave this quiz?",     d: "You'll restart the quiz from the beginning next time. You're doing great — keep going!",     stay: "Keep Going",      leave: "Leave Quiz" },
};

function getLeaveGroup(slide) {
  if (slide === 1) return "exercise";
  if (slide === 2) return "practice";
  if (slide === 3) return "quiz";
  return "screen";
}

// ═══════════════════════════════════════════════════════════════
// MAIN LESSON 3 COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Lesson3({ onBack, initialSlide = 0, onSlideChange, onComplete, userId, lesson2Completed = false }) {
  const { speak } = useTTS();
  const [slide, setSlide] = useState(initialSlide);
  const exerciseBackRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuEnabled, setMenuEnabled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [navBlocked, setNavBlocked] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMenuEnabled(true), 800);
    return () => clearTimeout(t);
  }, []);

  async function saveProgress(slideNum, completed = false) {
    if (!userId) return;
    await supabase.from("progress").upsert(
      { user_id: userId, lesson_number: 3, completed, slide: slideNum },
      { onConflict: "user_id,lesson_number" }
    );
  }

  function goTo(n) {
    if (n < 0 || n >= TOTAL) return;
    setSlide(n);
    setNavBlocked(true);
    setTimeout(() => setNavBlocked(false), 600);
    if (onSlideChange) onSlideChange(n);
    saveProgress(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function advance() { goTo(slide + 1); }

  async function handleLessonComplete() {
    await saveProgress(4, true);
    if (onComplete) onComplete();
  }

  const leaveGroup = getLeaveGroup(slide);
  const leaveContent = LEAVE_CONTENT[leaveGroup];
  const showCloseButton = slide !== 4;

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 64 }}>
      <style>{`
        @keyframes confettiRise { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; } }
        @keyframes celebPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wave { from { transform: scaleY(1); } to { transform: scaleY(2); } }
      `}</style>

      {showCloseButton && (
        <div style={{ position: "fixed", top: 16, left: 16, zIndex: 55 }}>
          <button type="button" onClick={() => setShowLeave(true)} aria-label="Leave"
            style={{ width: 36, height: 36, borderRadius: "50%", background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, fontWeight: 700, touchAction: "manipulation" }}>
            ✕
          </button>
        </div>
      )}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 20px 80px", animation: "fadeUp 0.3s ease" }} key={slide}>

        {slide === 0 && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.turquesaL, border: `1.5px solid ${C.turquesa}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28 }}>🚌</div>
              <div>
                <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, lineHeight: 1.1 }}>Time to Move!</div>
              </div>
            </div>
            <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "22px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${C.turquesa} 33%,#fff 33%,#fff 66%,${C.turquesa} 66%)` }} />
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesa, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Your Story Continues</div>
              <p style={{ margin: 0, fontSize: "clamp(14px,2.5vw,16px)", color: C.textS, lineHeight: 1.85, fontStyle: "italic", fontWeight: 500 }}>
                It's 6:15 PM. You've got your pesos and you're ready to keep moving. Next stop: <strong style={{ color: C.textH }}>Holbox</strong> — a car-free island with no ATMs and no rush. But first, you need to find the right bus, grab your seat, and figure out how to get from the ferry dock to your hostel. <strong style={{ color: C.turquesa }}>All in Spanish.</strong>
              </p>
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "16px 18px", marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesaD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>What you'll learn</div>
              {SECTION.skills.map((skill, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>🚌</span>
                  <span style={{ fontSize: 13, color: C.textB, fontWeight: 500 }}>{skill}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={() => !navBlocked && advance()} onPointerDown={(e) => { e.preventDefault(); }}
                style={{ ...btn(C.turquesa, { fontSize: 15, padding: "14px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
                Start →
              </button>
            </div>
          </div>
        )}

        {slide === 1 && <ExerciseSlide speak={speak} onComplete={advance} onBackRequest={exerciseBackRef} />}
        {slide === 2 && <SectionQuiz speak={speak} onComplete={advance} onBackRequest={exerciseBackRef} />}
        {slide === 3 && <FinalQuiz speak={speak} onComplete={advance} />}
        {slide === 4 && <LessonComplete onNext={handleLessonComplete} />}
      </div>

      {/* FOOTER */}
      <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.grisB}`, padding: "12px 20px", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, boxShadow: "0 -2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.negro, letterSpacing: -0.2 }}>Basic - Lesson 3 of 10</span>
          <div style={{ position: "relative" }}>
            <button type="button" onClick={() => menuEnabled && setMenuOpen(!menuOpen)}
              style={{ ...btn(C.magenta, { fontSize: 13, padding: "8px 18px", borderRadius: 50 }), touchAction: "manipulation" }}>
              Menu
            </button>
            {menuOpen && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: "#fff", border: `1.5px solid ${C.grisB}`, borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200, overflow: "hidden", zIndex: 60 }}>
                <button type="button" onClick={() => { setMenuOpen(false); setShowExplore(true); setSelectedVideo(null); }}
                  style={{ width: "100%", textAlign: "left", padding: "14px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.textB, touchAction: "manipulation", borderBottom: `1px solid ${C.grisB}` }}>
                  Explore Mexico
                </button>
                {lesson2Completed && (
                  <button type="button" onClick={() => { setMenuOpen(false); setShowCheatSheet(true); }}
                    style={{ width: "100%", textAlign: "left", padding: "14px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.textB, touchAction: "manipulation", borderBottom: `1px solid ${C.grisB}` }}>
                    Cheat Sheet - L2
                  </button>
                )}
                <button type="button" onClick={() => { setMenuOpen(false); setShowHelp(true); }}
                  style={{ width: "100%", textAlign: "left", padding: "14px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.textB, touchAction: "manipulation" }}>
                  Need Help?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHEAT SHEET L2 MODAL */}
      {showCheatSheet && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowCheatSheet(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.textH, marginBottom: 4 }}>Cheat Sheet - L2</div>
            <div style={{ fontSize: 13, color: C.textS, marginBottom: 20 }}>Money & Exchange · Isla Mujeres</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {CHEAT_SHEET_L2.map((word, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid ${C.grisB}` }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: C.textH, marginBottom: 4 }}>{word.display}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.turquesaD }}>{word.phrase.es}</div>
                    <button type="button" onClick={() => speak(word.phrase.es)}
                      style={{ background: C.turquesaL, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, touchAction: "manipulation" }}>
                      <span style={{ fontSize: 16 }}>♪</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: C.textS }}>{word.phrase.en}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <button type="button" onClick={() => setShowCheatSheet(false)}
                style={{ ...btn(C.turquesa, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEED HELP MODAL */}
      {showHelp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowHelp(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 440, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.textH, marginBottom: 16 }}>Need Help?</div>
            <div style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 12 }}>
              <strong style={{ color: C.textH }}>iPhone:</strong> Voice recognition works best in <strong>Chrome</strong>, not Safari. Tap the microphone button once and wait for it to listen.
            </div>
            <div style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 20 }}>
              <strong style={{ color: C.textH }}>Android:</strong> If buttons don't respond right away, wait a second after the screen changes before tapping again.
            </div>
            <button type="button" onClick={() => setShowHelp(false)}
              style={{ ...btn(C.turquesa, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* EXPLORE MEXICO MODAL */}
      {showExplore && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowExplore(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            {!selectedVideo ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.textH, marginBottom: 6 }}>Explore Mexico</div>
                <div style={{ fontSize: 13, color: C.textS, marginBottom: 20 }}>See the places before you visit them.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {EXPLORE_VIDEOS.map((v, i) => (
                    <button type="button" key={i} onClick={() => setSelectedVideo(v)}
                      style={{ width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.grisB}`, background: C.grisS, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, touchAction: "manipulation" }}>
                      <span style={{ fontSize: 20 }}>🎬</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: C.textH }}>{v.city}</div>
                        <div style={{ fontSize: 12, color: C.textM }}>Watch travel video</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setShowExplore(false)}
                  style={{ ...btn(C.turquesa, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
                  Got it
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.textH, marginBottom: 16 }}>{selectedVideo.city}</div>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 16, marginBottom: 20 }}>
                  <iframe src={`https://www.youtube.com/embed/${selectedVideo.videoId}`} title={selectedVideo.city}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 16 }} />
                </div>
                <button type="button" onClick={() => setSelectedVideo(null)}
                  style={{ width: "100%", background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "13px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, touchAction: "manipulation" }}>
                  ← Back to list
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* LEAVE MODAL */}
      {showLeave && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowLeave(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 440, width: "100%", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.textH, marginBottom: 12 }}>{leaveContent.q}</div>
            <div style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 24 }}>{leaveContent.d}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button type="button" onClick={() => setShowLeave(false)}
                style={{ ...btn(C.turquesa, { fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
                {leaveContent.stay}
              </button>
              <button type="button" onClick={onBack}
                style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "13px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, touchAction: "manipulation" }}>
                {leaveContent.leave}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
