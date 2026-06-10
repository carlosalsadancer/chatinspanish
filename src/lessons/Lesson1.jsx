import { useState, useRef, useCallback, useEffect } from "react";
import { C, btn } from "../tokens";
import ChatLogo from "../components/ChatLogo";

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════
const Check = ({size=24,color="#fff",strokeWidth=2}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Star  = ({size=24,color="#fff"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

// ═══════════════════════════════════════════════════════════════
// GOOGLE SHEETS URL
// ═══════════════════════════════════════════════════════════════
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzUiHHTyLbu-efTHCzP-GZfs51qEq9hDFmvqnFnAVQCJLXYXcwxRaLG_rTSXImbr0mnFQ/exec";

// ═══════════════════════════════════════════════════════════════
// LESSON MAP — Basic Level
// ═══════════════════════════════════════════════════════════════
const LESSONS = [
  { id: 1,  title: "At the Airport",   emoji: "✈️", color: C.turquesa },
  { id: 2,  title: "Money & Exchange", emoji: "💵", color: C.azul     },
  { id: 3,  title: "Getting Around",   emoji: "🚌", color: C.limon    },
  { id: 4,  title: "Meeting People",   emoji: "👥", color: C.magenta  },
  { id: 5,  title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
  { id: 6,  title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
  { id: 7,  title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
  { id: 8,  title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
  { id: 9,  title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
  { id: 10, title: "Coming Soon",      emoji: "🔒", color: C.grisB    },
];

// ═══════════════════════════════════════════════════════════════
// SECTION DATA
// ═══════════════════════════════════════════════════════════════
const SECTION = {
  id: "airport", title: "At the Airport", subtitle: "En el Aeropuerto",
  color: C.turquesa, colorL: C.turquesaL, colorD: C.turquesaD,
  skills: [
    "Find immigration",
    "Show your passport",
    "Find your luggage",
    "Buy an ADO bus ticket",
  ],
  words: [
    { es: "el internet",          display: "internet",  pron: "een-ter-NET",         en: "internet",    phrase: { es: "¿Hay internet gratis en el aeropuerto?",      pron: "hay een-ter-NET GRAH-tees en el ah-eh-roh-PWER-toh",          en: "Is there free internet at the airport?" } },
    { es: "la migración",         display: "migración", pron: "mee-grah-SYON",       en: "immigration", phrase: { es: "¿Dónde está la zona de migración?",           pron: "DON-deh es-TAH lah SO-nah deh mee-grah-SYON",                en: "Where is the immigration area?" } },
    { es: "la fila",              display: "fila",      pron: "FEE-lah",             en: "line",        phrase: { es: "Perdón, ¿esta es la fila para extranjeros?",  pron: "pehr-DON ES-tah ehs lah FEE-lah PAH-rah eks-tran-HEH-ros",  en: "Excuse me, is this the line for foreigners?" } },
    { es: "el pasaporte",         display: "pasaporte", pron: "pah-sah-POR-teh",     en: "passport",    phrase: { es: "Hola, aquí está mi pasaporte.",               pron: "OH-lah ah-KEE es-TAH mee pah-sah-POR-teh",                   en: "Hello, here is my passport." } },
    { es: "el boleto de regreso", display: "boleto",    pron: "boh-LEH-toh",         en: "ticket",      phrase: { es: "Tengo mi boleto de regreso aquí.",             pron: "TEN-goh mee boh-LEH-toh deh reh-GREH-soh ah-KEE",            en: "I have my return ticket here." } },
    { es: "la maleta",            display: "maleta",    pron: "mah-LEH-tah",         en: "suitcase",    phrase: { es: "¿Dónde recojo mi maleta?",                    pron: "DON-deh reh-KOH-hoh mee mah-LEH-tah",                        en: "Where do I pick up my suitcase?" } },
    { es: "la salida",            display: "salida",    pron: "sah-LEE-dah",         en: "exit",        phrase: { es: "¿Por dónde es la salida?",                    pron: "por DON-deh ehs lah sah-LEE-dah",                            en: "Which way is the exit?" } },
    { es: "el autobús ADO",       display: "autobús",   pron: "ow-toh-BOOS",         en: "bus",         phrase: { es: "¿Dónde compro el boleto de autobús ADO?",     pron: "DON-deh KOM-proh el boh-LEH-toh deh ow-toh-BOOS ah-deh-OH", en: "Where do I buy the ADO bus ticket?" } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA
// ═══════════════════════════════════════════════════════════════
const QUIZ_DATA = [
  { scene: "Cancún Airport — arrival",             q: "You just landed and need WiFi. What do you ask?",                       correct: "¿Hay internet gratis en el aeropuerto?",     options: ["¿Hay internet gratis en el aeropuerto?","¿Dónde está la maleta?","¿Cuánto cuesta el WiFi?","¿Hay un cajero cerca?"] },
  { scene: "Immigration area",                      q: "You need to find immigration. What do you ask?",                       correct: "¿Dónde está la zona de migración?",          options: ["¿Dónde está la zona de migración?","¿Dónde está la salida?","¿Dónde recojo mi maleta?","¿Por dónde es la fila?"] },
  { scene: "Immigration — foreigner line",          q: "You're not sure which line to join. What do you ask?",                 correct: "Perdón, ¿esta es la fila para extranjeros?", options: ["Perdón, ¿esta es la fila para extranjeros?","¿Dónde está la migración?","¿Cuál es mi asiento?","Aquí está mi pasaporte"] },
  { scene: "Immigration officer asks for document", q: "The officer asks for your travel document. What do you say?",          correct: "Hola, aquí está mi pasaporte.",              options: ["Hola, aquí está mi pasaporte.","Tengo mi boleto de regreso aquí.","¿Por dónde es la salida?","Aquí está la reservación de mi hotel."] },
  { scene: "Immigration — proof of return",         q: "The officer asks for proof you're leaving Mexico. What do you show?",  correct: "Tengo mi boleto de regreso aquí.",           options: ["Tengo mi boleto de regreso aquí.","Hola, aquí está mi pasaporte.","¿Dónde recojo mi maleta?","¿Hay internet gratis?"] },
  { scene: "Baggage claim",                         q: "You need to find your suitcase. What do you ask?",                     correct: "¿Dónde recojo mi maleta?",                   options: ["¿Dónde recojo mi maleta?","¿Dónde está la fila?","¿Cuánto cuesta el boleto?","¿Dónde está la migración?"] },
  { scene: "After baggage claim",                   q: "You need to find the way out. What do you ask?",                       correct: "¿Por dónde es la salida?",                   options: ["¿Por dónde es la salida?","¿Dónde está la maleta?","¿Hay internet gratis?","¿Dónde está la fila?"] },
  { scene: "Outside the airport",                   q: "You want to get a bus to Cancún. What do you ask?",                    correct: "¿Dónde compro el boleto de autobús ADO?",    options: ["¿Dónde compro el boleto de autobús ADO?","¿Por dónde es la salida?","¿Dónde recojo mi maleta?","¿Hay un cajero cerca?"] },
];

// ═══════════════════════════════════════════════════════════════
// SLIDE MAP
const TOTAL = 8;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function scoreMatch(heard, expected) {
  const norm = s => s.toLowerCase().replace(/[¿¡.,!?]/g,"").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n").trim();
  const h = norm(heard), e = norm(expected);
  if (h === e) return 100;
  if (h.includes(e) || e.includes(h)) return 92;
  const hw = h.split(" "), ew = e.split(" ");
  const hits = hw.filter(w => ew.some(ew => ew.includes(w) || w.includes(ew))).length;
  return Math.round((hits / Math.max(hw.length, ew.length)) * 100);
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
    u.lang = "es-MX"; u.rate = 0.78; u.pitch = 1.05;
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
          const msPerWord = 380;
          words.forEach((_, i) => {
            setTimeout(() => {
              const charIndex = words.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);
              const charLength = words[i].length;
              onWordBoundary(charIndex, charLength);
            }, i * msPerWord);
          });
          setTimeout(() => onWordBoundary(-1, 0), words.length * msPerWord + 400);
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
  const colors = [C.magenta, C.turquesa, C.limon, C.azul, "#fff"];
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {particles.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 6 + Math.random() * 8;
        const col = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div key={i} style={{
            position: "absolute", bottom: "-10px", left: `${x}%`,
            width: size, height: size, borderRadius: Math.random() > 0.5 ? "50%" : 2,
            background: col, opacity: 0.9,
            animation: `confettiRise ${0.8 + Math.random() * 0.8}s ease-out ${delay}s forwards`,
          }} />
        );
      })}
      <div style={{
        background: C.magenta, borderRadius: 20, padding: "20px 36px",
        textAlign: "center", boxShadow: `0 8px 32px ${C.magenta}60`,
        animation: "celebPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
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
  if (charIndex < 0) {
    return <span style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>{text}</span>;
  }
  const before = text.slice(0, charIndex);
  const current = text.slice(charIndex, charIndex + charLength);
  const after = text.slice(charIndex + charLength);
  return (
    <span style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>
      {before}
      <span style={{ background: color, color: "#fff", borderRadius: 4, padding: "0 2px" }}>{current}</span>
      {after}
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

  useEffect(() => {
    if (blockMicMs > 0) {
      setMicBlocked(true);
      const t = setTimeout(() => setMicBlocked(false), blockMicMs);
      return () => clearTimeout(t);
    }
  }, [blockMicMs]);

  useEffect(() => {
    if (!transcript || listening) return;
    const score = scoreMatch(transcript, answer);
    setResult(score >= 85 ? "perfect" : score >= 60 ? "good" : "retry");
    setAttempts(a => a + 1);
  }, [transcript, listening]);

  function handleMic() {
    if (micBlocked) return;
    if (listening) { stop(); return; }
    setResult(null); setTranscript(""); start();
  }

  const canAdvance = result === "perfect" || result === "good" || attempts >= 2;
  const resultColor = result === "perfect" ? C.limon : result === "good" ? C.azul : C.rojo;
  const resultBg    = result === "perfect" ? C.limonL : result === "good" ? C.azulL : C.rojoL;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button type="button"
          onClick={onListenPress}
          style={{ flex: 1, background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, touchAction: "manipulation" }}>
          <span style={{ fontSize: 24 }}>♪</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.azulD }}>Listen</span>
        </button>
        <button type="button"
          onClick={handleMic}
          style={{ flex: 2, border: "none", borderRadius: 14, padding: "14px 12px", cursor: micBlocked ? "default" : "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: micBlocked ? C.grisB : listening ? C.magenta : canAdvance && result !== "retry" ? C.limon : color, transition: "all 0.2s", touchAction: "manipulation", opacity: micBlocked ? 0.5 : 1 }}>
          <span style={{ fontSize: 24 }}>{listening ? "⏹" : "◉"}</span>
          <span style={{ fontSize: 12, fontWeight: 900 }}>{listening ? "Listening…" : result ? "Try again" : "Speak now"}</span>
        </button>
      </div>
      {listening && (
        <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", height: 28, marginBottom: 10 }}>
          {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
            <div key={i} style={{ width: 3, borderRadius: 2, background: C.magenta, height: h * 2.5, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
          ))}
        </div>
      )}
      {result && transcript && (
        <div style={{ background: resultBg, border: `1.5px solid ${resultColor}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{result === "perfect" ? "✓" : result === "good" ? "◎" : "✗"}</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: result === "perfect" ? C.limonD : result === "good" ? C.azulD : C.rojo }}>
              {result === "perfect" ? "Perfect!" : result === "good" ? "Good job!" : "Try again!"}
            </span>
          </div>
          <div style={{ fontSize: 14, color: C.textS, fontWeight: 500 }}>
            {result === "perfect" && "Native speakers will understand you!"}
            {result === "good"    && "Good pronunciation! Keep going."}
            {result === "retry"   && <>I heard: <strong>"{transcript}"</strong> — listen first, then try again.</>}
          </div>
          {attempts >= 2 && result === "retry" && <div style={{ marginTop: 6, fontSize: 14, color: C.textM, fontStyle: "italic" }}>You can continue — pronunciation improves with practice!</div>}
        </div>
      )}
      {!supported && <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 14, color: C.textS }}>Voice recognition works best in Chrome.</div>}
      {(canAdvance || !supported) && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button type="button"
            onClick={onPass}
            onPointerDown={(e) => { e.preventDefault(); onPass(); }}
            style={{ ...btn(result === "perfect" ? C.limon : color, { fontSize: 15, padding: "13px 28px", borderRadius: 50 }), touchAction: "manipulation" }}>
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
  const [blockMic, setBlockMic] = useState(0);

  useEffect(() => {
    if (onBackRequest) {
      onBackRequest.current = () => {
        if (phase === "phrase") { setPhase("word"); setKaraokeIdx(-1); setBlockMic(0); return true; }
        if (phase === "word" && wordIdx > 0) { setWordIdx(wordIdx - 1); setPhase("phrase"); setKaraokeIdx(-1); setBlockMic(0); return true; }
        return false;
      };
    }
  }, [phase, wordIdx, onBackRequest]);

  function showCelebration(msg) {
    setCelebrateMsg(msg);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1500);
  }

  function handleWordPass() {
    setBlockMic(400);
    setPhase("phrase");
    setKaraokeIdx(-1);
  }

  function handlePhrasePass() {
    setKaraokeIdx(-1);
    setBlockMic(0);
    const msg = CELEBRATE_MESSAGES[wordIdx % CELEBRATE_MESSAGES.length];
    showCelebration(msg);
    setTimeout(() => {
      if (wordIdx + 1 < sec.words.length) {
        setWordIdx(wordIdx + 1);
        setPhase("word");
        setBlockMic(400);
      } else {
        setDone(true);
      }
    }, 1600);
  }

  function handleListenPhrase() {
    setKaraokeIdx(0); setKaraokeLen(0);
    speak(sec.words[wordIdx].phrase.es, (ci, cl) => { setKaraokeIdx(ci); setKaraokeLen(cl); });
  }

  const cardStyle = (bg, borderColor) => ({
    background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center",
  });

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Check size={32} color={C.limonD} strokeWidth={3} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Speaking Complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 32 }}>Great work on <strong>{sec.title}</strong>!</div>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={onComplete}
          onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ ...btn(C.magenta, { fontSize: 15, padding: "15px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Continue →
        </button>
      </div>
    </div>
  );

  const word = sec.words[wordIdx];

  return (
    <div>
      <Confetti show={celebrate} message={celebrateMsg} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "14px 16px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: sec.colorL, border: `1.5px solid ${sec.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>✈️</div>
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
        <PronExercise
          key={`word-${wordIdx}`}
          answer={word.es}
          onListenPress={() => speak(word.display)}
          onPass={handleWordPass}
          color={sec.color}
          passLabel="Now practice the phrase →"
          blockMicMs={blockMic}
        />
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
          <PronExercise
            key={`phrase-${wordIdx}`}
            answer={word.phrase.es}
            onListenPress={handleListenPhrase}
            onPass={handlePhrasePass}
            color={sec.color}
            passLabel={wordIdx + 1 < sec.words.length ? "Next word →" : "Section complete →"}
            blockMicMs={blockMic}
          />
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MEMORAMA
// ═══════════════════════════════════════════════════════════════
function Memorama({ speak, onComplete }) {
  const section = SECTION;
  const pairs = section.words.slice(0, 6).map(w => ({ es: w.display, en: w.en }));
  const [cards] = useState(() => {
    const all = [];
    pairs.forEach((v, i) => {
      all.push({ id: `es-${i}`, type: "es", word: v.es, pairId: i });
      all.push({ id: `en-${i}`, type: "en", word: v.en, pairId: i });
    });
    return shuffle(all);
  });
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [checking, setChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  function flip(card) {
    if (checking || matched.includes(card.pairId) || flipped.includes(card.id) || flipped.length === 2) return;
    const nf = [...flipped, card.id];
    setFlipped(nf);
    if (card.type === "es") speak(card.word);
    if (nf.length === 2) {
      setMoves(m => m + 1); setChecking(true);
      const [a, b] = nf.map(id => cards.find(c => c.id === id));
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          const nm = [...matched, a.pairId];
          setMatched(nm); setFlipped([]); setChecking(false);
          if (nm.length === pairs.length) {
            setCelebrate(true);
            setTimeout(() => { setCelebrate(false); setDone(true); }, 1600);
          }
        }, 700);
      } else {
        setTimeout(() => { setFlipped([]); setChecking(false); }, 1100);
      }
    }
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Check size={32} color={C.limonD} strokeWidth={3} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.textH, marginBottom: 8 }}>Memorama Complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 8 }}>You matched all {pairs.length} pairs in <strong style={{ color: section.color }}>{moves} moves</strong></div>
      <div style={{ fontSize: 14, color: C.textM, marginBottom: 32 }}>{moves <= pairs.length + 2 ? "Excellent memory!" : moves <= pairs.length + 5 ? "Good job!" : "Keep practicing!"}</div>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={onComplete}
          onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ ...btn(C.magenta, { fontSize: 15, padding: "15px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Continue →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <Confetti show={celebrate} message="Memorama Complete!" />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Star size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Memorama</div>
          <div style={{ fontSize: 12, color: section.colorD, fontWeight: 700 }}>{section.title} · Match Spanish ↔ English</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: section.color }}>{matched.length}/{pairs.length}</div>
          <div style={{ fontSize: 11, color: C.textM, fontWeight: 600 }}>{moves} moves</div>
        </div>
      </div>
      <div style={{ height: 6, background: C.grisB, borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: "100%", width: `${(matched.length / pairs.length) * 100}%`, background: `linear-gradient(90deg,${section.color},${section.colorD})`, borderRadius: 3, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: 14, color: C.textM, fontWeight: 600, marginBottom: 16 }}>Tap two cards to find matching pairs — Spanish ↔ English</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        {cards.map(card => {
          const isF = flipped.includes(card.id), isM = matched.includes(card.pairId), show = isF || isM;
          return (
            <div key={card.id}
              onClick={() => flip(card)}
              onPointerDown={(e) => { e.preventDefault(); flip(card); }}
              style={{ height: 84, borderRadius: 14, cursor: isM ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 6px", background: isM ? section.colorL : show ? (card.type === "es" ? C.turquesaL : C.magentaL) : C.grisS, border: `1.5px solid ${isM ? section.color + "60" : show ? (card.type === "es" ? C.turquesa : C.magenta) + "50" : C.grisB}`, transform: show ? "scale(1.03)" : "scale(1)", touchAction: "manipulation" }}>
              {show ? (
                <div>
                  {isM && <div style={{ fontSize: 13, marginBottom: 2, color: section.colorD }}>✓</div>}
                  <div style={{ fontSize: "clamp(12px,2.8vw,15px)", fontWeight: 800, color: isM ? section.colorD : card.type === "es" ? C.turquesaD : C.magentaD, lineHeight: 1.3 }}>{card.word}</div>
                </div>
              ) : (
                <div style={{ fontSize: 26, color: C.textF }}>?</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ background: section.colorL, border: `1.5px solid ${section.color}30`, borderRadius: 12, padding: "10px 14px", fontSize: 14, color: section.colorD, fontWeight: 600 }}>Spanish cards play audio when flipped — listen carefully!</div>
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
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [pronResult, setPronResult] = useState(null);
  const [pronAttempts, setPronAttempts] = useState(0);

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
    setPronResult(sc >= 85 ? "perfect" : sc >= 60 ? "good" : "retry");
    setPronAttempts(a => a + 1);
  }, [transcript, listening]);

  function select(opt) {
    if (sel !== null) return;
    setSel(opt);
    if (opt === questions[idx].correct) setScore(s => s + 1);
  }

  function handleMic() {
    if (listening) { stop(); return; }
    setPronResult(null); setTranscript(""); start();
  }

  function nextQuestion() {
    if (idx + 1 >= questions.length) {
      setCelebrate(true);
      setTimeout(() => { setCelebrate(false); setDone(true); }, 1600);
      return;
    }
    setIdx(i => i + 1);
    setSel(null);
    setPronResult(null);
    setPronAttempts(0);
    setTranscript("");
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
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>{pct >= 75 ? "You really know your Airport phrases!" : "Practice makes perfect — you've got this."}</div>
        <div style={{ textAlign: "center" }}>
          <button type="button" onClick={onComplete}
            onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
            style={{ ...btn(C.magenta, { fontSize: 15, padding: "15px 36px", borderRadius: 50 }), touchAction: "manipulation" }}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = sel === q.correct;
  const canAdvancePron = pronResult === "perfect" || pronResult === "good" || pronAttempts >= 2;

  return (
    <div>
      <Confetti show={celebrate} message="Quiz Complete!" />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, fontSize: 24, color: "#fff" }}>?</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Quick Quiz</div>
          <div style={{ fontSize: 12, color: section.colorD, fontWeight: 700 }}>{section.title} · Question {idx + 1} of {questions.length}</div>
        </div>
      </div>
      <div style={{ height: 6, background: C.grisS, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / questions.length) * 100}%`, background: `linear-gradient(90deg,${section.color},${section.colorD})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 20 }}>
        <span style={{ whiteSpace: "nowrap" }}>{idx + 1} / {questions.length}</span>
        <span style={{ color: section.color, fontWeight: 900 }}>Score: {score}</span>
      </div>
      <div style={{ background: C.azulL, border: `1.5px solid ${C.azul}30`, borderLeft: `5px solid ${C.azul}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.azulD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{q.scene}</div>
        <div style={{ fontSize: "clamp(14px,3vw,17px)", color: C.textH, lineHeight: 1.65, fontWeight: 700 }}>{q.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          const isC = opt === q.correct, isS = opt === sel;
          let bg = "#fff", border = C.grisB, tc = C.textB, fw = 600;
          if (sel !== null) {
            if (isC) { bg = C.limonL; border = C.limon; tc = C.limonD; fw = 800; }
            else if (isS) { bg = C.rojoL; border = C.rojo; tc = C.rojo; fw = 700; }
          }
          return (
            <button type="button" key={i}
              onClick={() => select(opt)}
              onPointerDown={(e) => { e.preventDefault(); select(opt); }}
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
              {isCorrect ? "✓ Correct! Now say it out loud:" : "This is the correct answer, say it loud:"}
            </div>
            <div style={{ fontSize: "clamp(14px,3vw,17px)", fontWeight: 900, color: C.limonD, lineHeight: 1.3 }}>{q.correct}</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <button type="button"
              onClick={handleMic}
              style={{ ...btn(listening ? C.magenta : pronResult === "perfect" || pronResult === "good" ? C.limon : section.color, { fontSize: 15, padding: "14px 32px", borderRadius: 50 }), touchAction: "manipulation" }}>
              {listening ? "⏹  Listening…" : pronResult ? "◉  Try again" : "◉  Tap to speak"}
            </button>
          </div>
          {listening && (
            <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", height: 28, marginBottom: 10 }}>
              {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: C.magenta, height: h * 2.5, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
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
          {!supported && (
            <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 14, color: C.textS }}>
              Voice recognition works best in Chrome.
            </div>
          )}
          {(canAdvancePron || !supported) && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button type="button"
                onClick={nextQuestion}
                onPointerDown={(e) => { e.preventDefault(); nextQuestion(); }}
                style={{ ...btn(pronResult === "perfect" ? C.limon : section.color, { fontSize: 15, padding: "14px 32px", borderRadius: 50 }), touchAction: "manipulation" }}>
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
// BLOCK SURVEY
// ═══════════════════════════════════════════════════════════════
function BlockSurvey({ onComplete }) {
  const section = SECTION;
  const [answers, setAnswers] = useState({ email: "", continueNext: 0, pronunciation: 0, memorama: 0, instructions: 0, voiceRecognition: "", comments: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch(SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...answers, block: section.id }) });
      if (typeof window.gtag === "function") {
        window.gtag("event", "survey_submit", { block: section.id, block_number: 1, has_email: answers.email.trim() !== "" });
      }
    } catch(e) { console.log("Submit error:", e); }
    setSubmitted(true); setSubmitting(false);
  }

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.limonL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Check size={32} color={C.limonD} strokeWidth={3} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.textH, marginBottom: 12 }}>Thank you!</div>
      <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>Your feedback goes directly to the course creator.</div>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={onComplete}
          onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ ...btn(C.magenta, { fontSize: 15, padding: "15px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
          Continue →
        </button>
      </div>
    </div>
  );

  function ScoreRow({ label, field }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>{label}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button type="button" key={n}
              onClick={() => setAnswers(p => ({ ...p, [field]: n }))}
              onPointerDown={(e) => { e.preventDefault(); setAnswers(p => ({ ...p, [field]: n })); }}
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${answers[field] === n ? section.color : C.grisB}`, background: answers[field] === n ? section.color : C.grisS, color: answers[field] === n ? "#fff" : C.textS, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", touchAction: "manipulation" }}>
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textM, marginTop: 4 }}>
          <span>Not at all</span><span>Definitely</span>
        </div>
      </div>
    );
  }

  const allDone = answers.continueNext > 0 && answers.pronunciation > 0 && answers.memorama > 0 && answers.instructions > 0 && answers.voiceRecognition !== "";

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: section.color, borderRadius: 20, padding: "24px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#fff", fontWeight: 800, textTransform: "uppercase", opacity: 0.8, marginBottom: 8 }}>Basic · Lesson 1 — Feedback</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>You're one of our first testers!</div>
        <div style={{ fontSize: 13, color: "#fff", opacity: 0.9, lineHeight: 1.6 }}>Chat in Spanish is in development. Your feedback shapes the final product. 2 minutes — every answer counts.</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 6 }}>Your email <span style={{ fontSize: 12, color: C.textM, fontWeight: 500 }}>(optional)</span></div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, marginBottom: 10 }}>We'll notify you when the full course is ready — and send you a special launch discount.</div>
        <input type="email" value={answers.email} onChange={e => setAnswers(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.grisB}`, fontSize: 16, color: C.textH, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none", background: C.grisS, boxSizing: "border-box" }} />
      </div>
      <ScoreRow label="1. How likely are you to continue to Lesson 2?" field="continueNext" />
      <ScoreRow label="2. How useful was the pronunciation practice?" field="pronunciation" />
      <ScoreRow label="3. How fun was the Memorama game?" field="memorama" />
      <ScoreRow label="4. How clear were the instructions?" field="instructions" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>5. Did the voice recognition work correctly?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Yes, perfectly", "Sometimes", "No, it didn't work"].map(opt => (
            <button type="button" key={opt}
              onClick={() => setAnswers(p => ({ ...p, voiceRecognition: opt }))}
              onPointerDown={(e) => { e.preventDefault(); setAnswers(p => ({ ...p, voiceRecognition: opt })); }}
              style={{ padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${answers.voiceRecognition === opt ? section.color : C.grisB}`, background: answers.voiceRecognition === opt ? section.colorL : C.grisS, color: answers.voiceRecognition === opt ? section.colorD : C.textS, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "all 0.15s", touchAction: "manipulation" }}>
              {answers.voiceRecognition === opt ? "◉ " : "○ "}{opt}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>6. What would you change or improve? <span style={{ fontSize: 12, color: C.textM, fontWeight: 500 }}>(optional)</span></div>
        <textarea value={answers.comments} onChange={e => setAnswers(p => ({ ...p, comments: e.target.value }))} placeholder="Your ideas go directly to the course creator..."
          style={{ width: "100%", minHeight: 90, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.grisB}`, fontSize: 13, color: C.textH, fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "vertical", outline: "none", background: C.grisS }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={handleSubmit}
          onPointerDown={(e) => { e.preventDefault(); if (allDone && !submitting) handleSubmit(); }}
          disabled={!allDone || submitting}
          style={{ ...btn(allDone ? section.color : C.grisB, { fontSize: 15, padding: "16px 40px", borderRadius: 50 }), opacity: allDone ? 1 : 0.5, cursor: allDone ? "pointer" : "not-allowed", touchAction: "manipulation" }}>
          {submitting ? "Sending..." : "Submit Feedback →"}
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: C.textM }}>Thank you — your response goes directly to the course creator.</div>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button type="button" onClick={onComplete}
          onPointerDown={(e) => { e.preventDefault(); onComplete(); }}
          style={{ background: "none", border: "none", color: C.textM, fontSize: 13, cursor: "pointer", textDecoration: "underline", touchAction: "manipulation" }}>
          Skip survey
        </button>
      </div>
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
      <Confetti show={celebrate} message="Lesson 1 Complete!" />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 50, padding: "6px 16px", marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: C.turquesaD, letterSpacing: 1.5, textTransform: "uppercase" }}>Basic · Lesson 1</span>
      </div>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: C.turquesaL, border: `1.5px solid ${C.turquesa}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>✈️</div>
      <h2 style={{ fontSize: "clamp(24px,6vw,32px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 8 }}>Lesson 1 Complete!</h2>
      <p style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 24 }}>You just survived the Cancún airport — in Spanish!</p>
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
          { label: "Words learned",     value: "8", color: C.turquesa },
          { label: "Phrases practiced", value: "8", color: C.magenta  },
          { label: "Quiz questions",    value: "8", color: C.azul     },
        ].map((s, i) => (
          <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textS, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onNext}
        onPointerDown={(e) => { e.preventDefault(); onNext(); }}
        style={{ ...btn(C.magenta, { fontSize: 15, padding: "16px 40px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` }), touchAction: "manipulation" }}>
        Continue to Lesson 2 →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// JOURNEY BAR — solo lección activa desbloqueada, resto con 🔒
// ═══════════════════════════════════════════════════════════════
function JourneyBar({ completedLessons = [] }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
      {LESSONS.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isActive = lesson.id === 1;
        const isLocked = !isActive && !isCompleted;
        return (
          <div key={lesson.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: isCompleted ? C.limon : isActive ? lesson.color + "20" : C.grisS,
              border: `1.5px solid ${isCompleted ? C.limonD : isActive ? lesson.color + "60" : C.grisB}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: isLocked ? 0.5 : 1, fontSize: 14,
            }}>
              {isLocked ? "🔒" : lesson.emoji}
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, color: isCompleted ? C.limonD : isLocked ? C.textF : C.textM }}>L{lesson.id}</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LESSON COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Lesson1({ onBack, initialSlide = 0, onSlideChange, onComplete, completedLessons = [] }) {
  const { speak } = useTTS();
  const [slide, setSlide] = useState(initialSlide);
  const [maxUnlocked, setMaxUnlocked] = useState(Math.max(1, initialSlide));
  const exerciseBackRef = useRef(null);
  const [backEnabled, setBackEnabled] = useState(false);

  useEffect(() => {
    setBackEnabled(false);
    const t = setTimeout(() => setBackEnabled(true), 800);
    return () => clearTimeout(t);
  }, [slide]);

  function isExerciseSlide() { return slide === 3; }
  function isQuizSlide()     { return slide === 5; }

  function goTo(n) {
    if (n < 0 || n >= TOTAL) return;
    setSlide(n);
    if (onSlideChange) onSlideChange(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function unlock(n) { setMaxUnlocked(prev => Math.max(prev, n)); }
  function advance() { const next = slide + 1; unlock(next); goTo(next); }

  function handleBack() {
    if ((isExerciseSlide() || isQuizSlide()) && exerciseBackRef.current) {
      const handled = exerciseBackRef.current();
      if (handled) return;
    }
    if (slide === 0) { onBack(); return; }
    goTo(slide - 1);
  }

  const accentColor = [3,4,5,6].includes(slide) ? SECTION.color : C.turquesa;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @keyframes confettiRise {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebPop {
          0%   { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          from { transform: scaleY(1); }
          to   { transform: scaleY(2); }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.grisB}`, padding: "12px 20px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Fila 1: Logo + nombre + contador + back */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onBack}>
              <ChatLogo size={32} bg={C.magenta} />
              <div style={{ fontSize: 16, fontWeight: 900, color: C.negro, letterSpacing: -0.5 }}>Chat in Spanish</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: accentColor, fontWeight: 900, whiteSpace: "nowrap" }}>{slide + 1} / {TOTAL}</span>
              <button type="button"
                onClick={() => backEnabled && handleBack()}
                style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontSize: 13, fontWeight: 700, touchAction: "manipulation" }}>← Back</button>
            </div>
          </div>

          {/* Fila 2: BASIC · LESSON 1 · CANCÚN */}
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.textM, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>
            Basic · Lesson 1 · Cancún
          </div>

          {/* Fila 3: Barra de progreso */}
          <div style={{ height: 5, background: C.grisS, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${((slide + 1) / TOTAL) * 100}%`, background: `linear-gradient(90deg,${C.turquesa},${C.magenta})`, borderRadius: 3, transition: "width 0.4s" }} />
          </div>

          {/* Fila 4: Journey Bar */}
          <JourneyBar completedLessons={completedLessons} />

        </div>
      </div>

      {/* SLIDE CONTENT */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 100px", animation: "fadeUp 0.3s ease" }} key={slide}>

        {/* SLIDE 0 — ONBOARDING */}
        {slide === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><ChatLogo size={80} bg={C.magenta} /></div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 50, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.turquesaD, letterSpacing: 1.5, textTransform: "uppercase" }}>Basic Level · Lesson 1</span>
            </div>
            <h2 style={{ fontSize: "clamp(26px,6vw,34px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 12 }}>At the Airport</h2>
            <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 28 }}>Here's what you'll do in this lesson:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                { num: "01", color: C.turquesa, title: "Watch",    desc: "A travel video of Cancún to get you inspired." },
                { num: "02", color: C.magenta,  title: "Story",    desc: "You just landed at Cancún airport. Your journey begins." },
                { num: "03", color: C.azul,     title: "Speak",    desc: "8 words — listen, repeat, get graded." },
                { num: "04", color: C.morado,   title: "Phrases",  desc: "Each word comes with a real phrase — practice both." },
                { num: "05", color: C.limonD,   title: "Memorama", desc: "Match Spanish and English cards to lock words in memory." },
                { num: "06", color: C.magentaD, title: "Quiz",     desc: "Real-life situations — choose the right phrase, then say it." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "16px 18px", alignItems: "center", textAlign: "left" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 13, fontWeight: 900 }}>{s.num}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.textH, marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, fontSize: 13, color: C.turquesaD, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
              <span style={{ flexShrink: 0, fontSize: 18 }}>🎤</span>
              Allow microphone access when prompted. Works best in Chrome.
            </div>
            <button type="button"
              onClick={() => { unlock(1); goTo(1); }}
              onPointerDown={(e) => { e.preventDefault(); unlock(1); goTo(1); }}
              style={{ ...btn(C.magenta, { fontSize: 15, padding: "16px 44px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` }), touchAction: "manipulation", display: "inline-block" }}>
              Let's Start! →
            </button>
          </div>
        )}

        {/* SLIDE 1 — VIDEO */}
        {slide === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 12 }}>Welcome to Cancún</div>
            <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>
              We picked this video to give you a feel for Cancún before your first lesson.
            </p>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 20, marginBottom: 20, boxShadow: `0 8px 32px ${C.turquesa}25` }}>
              <iframe src="https://www.youtube.com/embed/nYIL6eAlHxA" title="Cancún travel guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 20 }} />
            </div>
            <button type="button" onClick={advance}
              onPointerDown={(e) => { e.preventDefault(); advance(); }}
              style={{ ...btn(C.magenta, { fontSize: 15, padding: "14px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
              Continue →
            </button>
          </div>
        )}

        {/* SLIDE 2 — STORY */}
        {slide === 2 && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.turquesaL, border: `1.5px solid ${C.turquesa}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28 }}>✈️</div>
              <div>
                <div style={{ display: "inline-block", background: C.turquesaL, color: C.turquesaD, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: 8, marginBottom: 6 }}>Basic · Lesson 1 · Free</div>
                <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, lineHeight: 1.1 }}>You Just Landed!</div>
                <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, marginTop: 4 }}>Cancún International Airport</div>
              </div>
            </div>
            <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "22px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${C.turquesa} 33%,#fff 33%,#fff 66%,${C.magenta} 66%)` }} />
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesa, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Your Story Begins</div>
              <p style={{ margin: 0, fontSize: "clamp(14px,2.5vw,16px)", color: C.textS, lineHeight: 1.85, fontStyle: "italic", fontWeight: 500 }}>
                It's 2:47 PM. Your plane just touched down at <strong style={{ color: C.textH }}>Cancún International Airport — CUN</strong>. Through the window: palm trees, a sunny day, a sign reading <strong style={{ color: C.turquesa }}>"BIENVENIDOS A MÉXICO."</strong> Your heart races. First challenge: immigration, baggage, your ADO bus ticket — all in Spanish.
              </p>
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "16px 18px", marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesaD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>What you'll learn</div>
              {SECTION.skills.map((skill, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>✈️</span>
                  <span style={{ fontSize: 13, color: C.textB, fontWeight: 500 }}>{skill}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={advance}
                onPointerDown={(e) => { e.preventDefault(); advance(); }}
                style={{ ...btn(C.magenta, { fontSize: 15, padding: "14px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
                Start →
              </button>
            </div>
          </div>
        )}

        {slide === 3 && <ExerciseSlide speak={speak} onComplete={advance} onBackRequest={exerciseBackRef} />}
        {slide === 4 && <Memorama speak={speak} onComplete={advance} />}
        {slide === 5 && <SectionQuiz speak={speak} onComplete={advance} onBackRequest={exerciseBackRef} />}
        {slide === 6 && <BlockSurvey onComplete={advance} />}
        {slide === 7 && <LessonComplete onNext={onComplete || onBack} />}

      </div>
    </div>
  );
}
