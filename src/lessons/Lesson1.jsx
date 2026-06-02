import { useState, useRef, useCallback, useEffect } from "react";
import { C, btn } from "../tokens";
import ChatLogo from "../components/ChatLogo";

const SECTIONS = [
  {
    id: "airport", icon: "✈", title: "At the Airport", subtitle: "En el Aeropuerto",
    color: C.turquesa, colorL: C.turquesaL, colorD: C.turquesaD,
    vocab: [
      { es: "el aeropuerto",          pron: "el ah-eh-roh-PWER-toh",           en: "the airport" },
      { es: "el vuelo",               pron: "el BWEH-loh",                     en: "the flight" },
      { es: "la llegada",             pron: "lah yeh-GAH-dah",                 en: "the arrival" },
      { es: "la salida",              pron: "lah sah-LEE-dah",                 en: "the exit" },
      { es: "la maleta",              pron: "lah mah-LEH-tah",                 en: "the suitcase" },
      { es: "la mochila",             pron: "lah moh-CHEE-lah",                en: "the backpack" },
      { es: "el pasaporte",           pron: "el pah-sah-POR-teh",              en: "the passport" },
      { es: "la aduana",              pron: "lah ah-DWAH-nah",                 en: "customs" },
    ],
    exercises: [
      { prompt: "How do you say 'the passport'?", answer: "el pasaporte", pron: "el pah-sah-POR-teh" },
      { prompt: "How do you say 'the backpack'?", answer: "la mochila",   pron: "lah moh-CHEE-lah" },
      { prompt: "How do you say 'customs'?",      answer: "la aduana",    pron: "lah ah-DWAH-nah" },
    ],
  },
  {
    id: "greetings", icon: "👋", title: "First Words", subtitle: "Primeras Palabras",
    color: C.magenta, colorL: C.magentaL, colorD: C.magentaD,
    vocab: [
      { es: "Hola",                    pron: "OH-lah",                        en: "Hello / Hi" },
      { es: "Buenos días",             pron: "BWEH-nos DEE-as",               en: "Good morning" },
      { es: "Buenas tardes",           pron: "BWEH-nas TAR-des",              en: "Good afternoon" },
      { es: "Por favor",               pron: "por fah-VOR",                   en: "Please" },
      { es: "Gracias",                 pron: "GRAH-syahs",                    en: "Thank you" },
      { es: "De nada",                 pron: "deh NAH-dah",                   en: "You're welcome" },
      { es: "Perdón",                  pron: "pehr-DON",                      en: "Excuse me" },
      { es: "Más despacio, por favor", pron: "mahs des-PAH-syoh por fah-VOR", en: "Slower, please" },
    ],
    exercises: [
      { prompt: "How do you say 'Hello'?",         answer: "hola",                   pron: "OH-lah" },
      { prompt: "How do you say 'Thank you'?",      answer: "gracias",                pron: "GRAH-syahs" },
      { prompt: "How do you say 'Slower, please'?", answer: "más despacio por favor", pron: "mahs des-PAH-syoh por fah-VOR" },
    ],
  },
  {
    id: "money", icon: "💵", title: "Money & Exchange", subtitle: "Dinero y Cambio",
    color: C.azul, colorL: C.azulL, colorD: C.azulD,
    vocab: [
      { es: "el dinero",              pron: "el dee-NEH-roh",                 en: "the money" },
      { es: "el peso mexicano",       pron: "el PEH-soh meh-hee-KAH-noh",    en: "Mexican peso" },
      { es: "¿A cómo está el dólar?", pron: "ah KOH-moh es-TAH el DOH-lar",  en: "What's the dollar rate?" },
      { es: "Quiero cambiar dinero",  pron: "KYEH-roh kam-BYAR dee-NEH-roh", en: "I want to exchange money" },
      { es: "¿Cuánto cuesta?",        pron: "KWAHN-toh KWES-tah",             en: "How much does it cost?" },
      { es: "la propina",             pron: "lah proh-PEE-nah",               en: "the tip" },
      { es: "el recibo",              pron: "el reh-SEE-boh",                 en: "the receipt" },
      { es: "Es barato",              pron: "ehs bah-RAH-toh",                en: "It's cheap" },
    ],
    exercises: [
      { prompt: "How do you say 'How much?'",          answer: "cuánto cuesta",         pron: "KWAHN-toh KWES-tah" },
      { prompt: "How do you say 'the tip'?",            answer: "la propina",            pron: "lah proh-PEE-nah" },
      { prompt: "How do you say 'I want to exchange'?", answer: "quiero cambiar dinero", pron: "KYEH-roh kam-BYAR dee-NEH-roh" },
    ],
  },
  {
    id: "transport", icon: "🚕", title: "Getting Around", subtitle: "Transporte",
    color: C.limon, colorL: C.limonL, colorD: C.limonD,
    vocab: [
      { es: "el taxi",        pron: "el TAK-see",         en: "the taxi" },
      { es: "el autobús",     pron: "el ow-toh-BOOS",     en: "the bus" },
      { es: "el hostal",      pron: "el os-TAL",          en: "the hostel" },
      { es: "Voy a...",       pron: "BOY ah",             en: "I'm going to..." },
      { es: "¿A dónde va?",   pron: "ah DON-deh BAH",     en: "Where are you going?" },
      { es: "¿Cuánto cobra?", pron: "KWAHN-toh KOH-brah", en: "How much do you charge?" },
      { es: "Aquí está bien", pron: "ah-KEE es-TAH BYEN", en: "Stop here" },
      { es: "Lléveme a...",   pron: "YEH-beh-meh ah",     en: "Take me to..." },
    ],
    exercises: [
      { prompt: "How do you say 'the taxi'?",   answer: "el taxi",        pron: "el TAK-see" },
      { prompt: "How do you say 'Stop here'?",  answer: "aquí está bien", pron: "ah-KEE es-TAH BYEN" },
      { prompt: "How do you say 'Take me to'?", answer: "lléveme a",      pron: "YEH-beh-meh ah" },
    ],
  },
];

const QUIZ_QS = [
  { scene: "Cancún Airport — Migración", q: "The officer holds out his hand. He needs your travel document. What does he want?", options: ["La maleta","El pasaporte","La propina","El recibo"], correct: 1, exp: "El pasaporte = the passport. Always have it ready at migración." },
  { scene: "Taxi stand — 3:30 PM", q: "You want to greet your taxi driver politely. What do you say?", options: ["Buenos días","Buenas noches","Buenas tardes","Hola amigo"], correct: 2, exp: "Buenas tardes = Good afternoon. Use from noon until ~7pm." },
  { scene: "Inside the taxi", q: "The driver asks '¿A dónde va?' — what is he asking?", options: ["How much money?","Where are you going?","How long is your stay?","First visit?"], correct: 1, exp: "¿A dónde va? = Where are you going? Reply with 'Voy a...'" },
  { scene: "Casa de cambio", q: "You want the exchange rate for your dollars. What do you say?", options: ["¿Cuánto cuesta?","¿Habla inglés?","¿A cómo está el dólar?","¿Cuánto cobra?"], correct: 2, exp: "¿A cómo está el dólar? = What's the dollar rate?" },
  { scene: "Arriving at your hostel", q: "Your taxi arrives. How do you tell the driver to stop here?", options: ["Por favor para","Voy a aquí","Aquí está bien","Hasta luego"], correct: 2, exp: "Aquí está bien = Here is fine. Used by locals every day." },
  { scene: "Anywhere in Cancún", q: "A Mexican speaks very fast. What do you say?", options: ["No hablo español","Más despacio, por favor","¿Habla inglés?","No entiendo nada"], correct: 1, exp: "Más despacio, por favor = Slower please. Your #1 power phrase!" },
];

const TOTAL = 16;

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

function useTTS() {
  const synth = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => { synth.current = window.speechSynthesis; return () => synth.current?.cancel(); }, []);
  const speak = useCallback((text) => {
    if (!synth.current) return;
    synth.current.cancel(); setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX"; u.rate = 0.78; u.pitch = 1.05;
    const voices = synth.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("es-MX")) || voices.find(v => v.lang.startsWith("es"));
    if (v) u.voice = v;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
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
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);
  const start = useCallback(() => { if (!recRef.current) return; setTranscript(""); setListening(true); try { recRef.current.start(); } catch(e) { setListening(false); } }, []);
  const stop = useCallback(() => { try { recRef.current?.stop(); } catch(e) {} setListening(false); }, []);
  return { transcript, listening, supported, start, stop, setTranscript };
}

function VocabCard({ item, revealed, onReveal, speak, color, colorL, index }) {
  return (
    <div onClick={() => { speak(item.es); if (!revealed) onReveal(); }}
      style={{ background: revealed ? colorL : "#fff", border: `1.5px solid ${revealed ? color + "50" : C.grisB}`, borderRadius: 16, padding: "14px 18px", cursor: "pointer", transition: "all 0.2s", animation: `fadeUp 0.25s ease ${index * 0.04}s both`, display: "flex", alignItems: "center", gap: 14, boxShadow: revealed ? "none" : "0 2px 8px rgba(0,0,0,0.05)" }}>
      <button onClick={e => { e.stopPropagation(); speak(item.es); }}
        style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: C.grisS, border: `1.5px solid ${C.grisB}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>♪</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "clamp(15px,3.5vw,18px)", fontWeight: 800, color: C.textH, letterSpacing: -0.3 }}>{item.es}</div>
        {revealed ? (
          <>
            <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}30`, borderRadius: 8, padding: "3px 10px", margin: "5px 0 3px", fontSize: 12, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>◉ {item.pron}</div>
            <div style={{ fontSize: 13, color: C.textS, fontWeight: 500 }}>{item.en}</div>
          </>
        ) : (
          <div style={{ fontSize: 11, color: C.textF, fontWeight: 700, letterSpacing: 1, marginTop: 3 }}>TAP TO REVEAL + LISTEN</div>
        )}
      </div>
      {revealed && <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>✓</div>}
    </div>
  );
}

function Memorama({ section, speak, onComplete }) {
  const pairs = section.vocab.slice(0, 6);
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

  function flip(card) {
    if (checking || matched.includes(card.pairId) || flipped.includes(card.id) || flipped.length === 2) return;
    const nf = [...flipped, card.id];
    setFlipped(nf);
    if (card.type === "es") speak(card.word);
    if (nf.length === 2) {
      setMoves(m => m + 1); setChecking(true);
      const [a, b] = nf.map(id => cards.find(c => c.id === id));
      if (a.pairId === b.pairId) {
        setTimeout(() => { const nm = [...matched, a.pairId]; setMatched(nm); setFlipped([]); setChecking(false); if (nm.length === pairs.length) setTimeout(() => setDone(true), 600); }, 700);
      } else {
        setTimeout(() => { setFlipped([]); setChecking(false); }, 1100);
      }
    }
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Memorama completado!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 8, textAlign: "left" }}>You matched all {pairs.length} pairs in <strong style={{ color: section.color }}>{moves} moves</strong></div>
      <div style={{ fontSize: 13, color: C.textM, marginBottom: 32, textAlign: "left" }}>{moves <= pairs.length + 2 ? "Excellent memory!" : moves <= pairs.length + 5 ? "Good job!" : "Keep practicing!"}</div>
      <button onClick={onComplete} style={btn(section.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 })}>Continue →</button>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "#fff" }}>◈</div>
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
      <div style={{ fontSize: 13, color: C.textM, fontWeight: 600, marginBottom: 16 }}>Tap two cards to find matching pairs — Spanish ↔ English</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        {cards.map(card => {
          const isF = flipped.includes(card.id), isM = matched.includes(card.pairId), show = isF || isM;
          return (
            <div key={card.id} onClick={() => flip(card)} style={{ height: 84, borderRadius: 14, cursor: isM ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 6px", background: isM ? section.colorL : show ? (card.type === "es" ? C.turquesaL : C.magentaL) : C.grisS, border: `1.5px solid ${isM ? section.color + "60" : show ? (card.type === "es" ? C.turquesa : C.magenta) + "50" : C.grisB}`, transform: show ? "scale(1.03)" : "scale(1)", boxShadow: show && !isM ? `0 3px 12px ${card.type === "es" ? C.turquesa : C.magenta}25` : "none" }}>
              {show ? (
                <div>
                  {isM && <div style={{ fontSize: 13, marginBottom: 2, color: section.colorD }}>✓</div>}
                  <div style={{ fontSize: "clamp(11px,2.5vw,13px)", fontWeight: 800, color: isM ? section.colorD : card.type === "es" ? C.turquesaD : C.magentaD, lineHeight: 1.3 }}>{card.word}</div>
                  <div style={{ fontSize: 9, color: C.textM, fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.type === "es" ? "ES" : "EN"}</div>
                </div>
              ) : (
                <div style={{ fontSize: 26, color: C.textF }}>?</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ background: section.colorL, border: `1.5px solid ${section.color}30`, borderRadius: 12, padding: "10px 14px", fontSize: 12, color: section.colorD, fontWeight: 600 }}>Spanish cards play audio when flipped — listen carefully!</div>
    </div>
  );
}

function PronExercise({ answer, onListenPress, onPass, color = C.turquesa }) {
  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!transcript || listening) return;
    const score = scoreMatch(transcript, answer);
    setResult(score >= 85 ? "perfect" : score >= 60 ? "good" : "retry");
    setAttempts(a => a + 1);
  }, [transcript, listening]);

  function handleMic() { if (listening) { stop(); return; } setResult(null); setTranscript(""); start(); }
  const canAdvance = result === "perfect" || result === "good" || attempts >= 2;
  const resultColor = result === "perfect" ? C.limon : result === "good" ? C.azul : C.rojo;
  const resultBg = result === "perfect" ? C.limonL : result === "good" ? C.azulL : C.rojoL;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={onListenPress} style={{ flex: 1, background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 14, padding: "18px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28 }}>♪</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.azulD }}>Listen</span>
        </button>
        <button onClick={handleMic} style={{ flex: 2, border: "none", borderRadius: 14, padding: "18px 12px", cursor: "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: listening ? C.magenta : canAdvance && result !== "retry" ? C.limon : color, boxShadow: listening ? `0 4px 20px ${C.magenta}50` : `0 4px 16px ${color}40`, transition: "all 0.2s" }}>
          <span style={{ fontSize: 28 }}>{listening ? "⏹" : "◉"}</span>
          <span style={{ fontSize: 13, fontWeight: 900 }}>{listening ? "Listening… stop" : result ? "Try again" : "Speak now"}</span>
        </button>
      </div>
      {listening && (
        <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "center", height: 36, marginBottom: 16 }}>
          {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
            <div key={i} style={{ width: 4, borderRadius: 2, background: C.magenta, height: h * 3, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
          ))}
        </div>
      )}
      {result && transcript && (
        <div style={{ background: resultBg, border: `1.5px solid ${resultColor}40`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{result === "perfect" ? "✓" : result === "good" ? "◎" : "✗"}</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: result === "perfect" ? C.limonD : result === "good" ? C.azulD : C.rojo }}>{result === "perfect" ? "Perfecto!" : result === "good" ? "Muy bien!" : "Try again!"}</span>
          </div>
          <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>
            {result === "perfect" && "Native speakers will understand you!"}
            {result === "good" && "Good pronunciation! Keep going."}
            {result === "retry" && <>I heard: <strong style={{ color: C.textH }}>"{transcript}"</strong> — listen first, then try again.</>}
          </div>
          {attempts >= 2 && result === "retry" && <div style={{ marginTop: 8, fontSize: 12, color: C.textM, fontStyle: "italic" }}>You can continue — pronunciation improves with practice!</div>}
        </div>
      )}
      {!supported && <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: C.textS }}>Voice recognition works best in Chrome.</div>}
      {(canAdvance || !supported) && (
        <button onClick={onPass} style={btn(result === "perfect" ? C.limon : color, { width: "100%", fontSize: 15, padding: "15px", borderRadius: 14 })}>
          {result === "perfect" ? "Perfecto! Next →" : result === "good" ? "Bien! Next →" : "Continue →"}
        </button>
      )}
    </div>
  );
}

function ExerciseSlide({ sectionIndex, speak, onComplete }) {
  const sec = SECTIONS[sectionIndex];
  const [exIdx, setExIdx] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => { setExIdx(0); setDone(false); }, [sectionIndex]);

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Section complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 32 }}>Great speaking on <strong>{sec.title}</strong>!</div>
      <button onClick={onComplete} style={btn(sec.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 })}>Continue →</button>
    </div>
  );

  const ex = sec.exercises[exIdx];
  function handlePass() { if (exIdx + 1 < sec.exercises.length) setExIdx(exIdx + 1); else { setDone(true); onComplete(); } }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px 18px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "#fff" }}>{sec.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Speaking Practice</div>
          <div style={{ fontSize: 12, color: sec.colorD, fontWeight: 700 }}>{sec.title} · Exercise {exIdx + 1} of {sec.exercises.length}</div>
        </div>
      </div>
      <div style={{ height: 4, background: C.grisB, borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ height: "100%", width: `${(exIdx / sec.exercises.length) * 100}%`, background: sec.color, borderRadius: 2, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: 14, color: C.textM, fontWeight: 700, letterSpacing: 0.5, marginBottom: 12 }}>{ex.prompt}</div>
      <div style={{ background: sec.colorL, border: `1.5px solid ${sec.color}30`, borderRadius: 16, padding: "24px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 10 }}>{ex.answer}</div>
        <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "4px 14px", fontSize: 12, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>◉ {ex.pron}</div>
      </div>
      <PronExercise key={`${sectionIndex}-${exIdx}`} answer={ex.answer} onListenPress={() => speak(ex.answer)} onPass={handlePass} color={sec.color} />
    </div>
  );
}

function QuizFinal({ speak, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function select(i) { if (sel !== null) return; setSel(i); if (i === QUIZ_QS[idx].correct) { setScore(s => s + 1); speak(QUIZ_QS[idx].options[i]); } }
  function next() { if (idx + 1 >= QUIZ_QS.length) { setDone(true); return; } setIdx(i => i + 1); setSel(null); }

  if (done) {
    const pct = Math.round((score / QUIZ_QS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: "clamp(52px,12vw,72px)", fontWeight: 900, color: C.magenta, lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>{score}/{QUIZ_QS.length}</div>
        <div style={{ fontSize: 20, color: C.textH, fontWeight: 800, marginBottom: 8, textAlign: "left" }}>{pct >= 83 ? "Excelente! Cancún is yours!" : pct >= 50 ? "Bien! Keep practicing." : "Review and try again"}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, marginBottom: 32, textAlign: "left" }}>{pct >= 83 ? "Ready for Lesson 2 — Isla Mujeres" : "Go back and practice the vocabulary"}</div>
        <button onClick={onComplete} style={btn(C.magenta, { fontSize: 16, padding: "15px 36px", borderRadius: 14 })}>{pct >= 83 ? "Next Lesson →" : "← Back to Landing"}</button>
      </div>
    );
  }

  const q = QUIZ_QS[idx];
  return (
    <div>
      <div style={{ height: 6, background: C.grisS, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / QUIZ_QS.length) * 100}%`, background: `linear-gradient(90deg,${C.turquesa},${C.magenta})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 24 }}>
        <span>{idx + 1} / {QUIZ_QS.length}</span>
        <span style={{ color: C.magenta, fontWeight: 900 }}>Score: {score}</span>
      </div>
      <div style={{ background: C.azulL, border: `1.5px solid ${C.azul}30`, borderLeft: `5px solid ${C.azul}`, borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.azulD, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>{q.scene}</div>
        <div style={{ fontSize: "clamp(15px,3vw,18px)", color: C.textH, lineHeight: 1.65, fontWeight: 700 }}>{q.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {q.options.map((opt, i) => {
          const isC = i === q.correct, isS = i === sel;
          let bg = "#fff", border = C.grisB, tc = C.textB, fw = 600;
          if (sel !== null) { if (isC) { bg = C.limonL; border = C.limon; tc = C.limonD; fw = 800; } else if (isS) { bg = C.rojoL; border = C.rojo; tc = C.rojo; fw = 700; } }
          return (
            <button key={i} onClick={() => select(i)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "15px 18px", textAlign: "left", cursor: sel !== null ? "default" : "pointer", color: tc, fontSize: 15, fontWeight: fw, transition: "all 0.18s", display: "flex", alignItems: "center", gap: 14, boxShadow: sel === null ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: sel !== null && isC ? C.limon : isS && !isC ? C.rojo : C.grisS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: sel !== null && (isC || isS) ? "#fff" : C.textM }}>
                {sel !== null && isC ? "✓" : isS && !isC ? "✗" : ["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <>
          <div style={{ background: sel === q.correct ? C.limonL : C.rojoL, border: `1.5px solid ${sel === q.correct ? C.limon+"60" : C.rojo+"60"}`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, fontSize: 14, color: C.textB, lineHeight: 1.7, fontWeight: 500 }}>
            <span style={{ fontWeight: 900, color: sel === q.correct ? C.limonD : C.rojo }}>{sel === q.correct ? "Correcto! " : "Not quite — "}</span>{q.exp}
          </div>
          <button onClick={next} style={btn(C.magenta, { width: "100%", fontSize: 16, padding: "15px", borderRadius: 14 })}>{idx + 1 >= QUIZ_QS.length ? "See My Results →" : "Next Question →"}</button>
        </>
      )}
    </div>
  );
}

export default function Lesson1({ onBack }) {
  const { speak } = useTTS();
  const [slide, setSlide] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [revealed, setRevealed] = useState({});
  const [memoDone, setMemoDone] = useState({});
  const [pracDone, setPracDone] = useState({});

  function isVocabSlide() { return  [3,5,7,9].includes(slide); }
  function isMemoSlide()  { return [4,6,8,10].includes(slide); }
  function isPracSlide()  { return slide >= 11 && slide <= 14; }
  function vocabSecIdx()  { return (slide - 3) / 2; }

  const currentVocabSec = isVocabSlide() ? SECTIONS[vocabSecIdx()] : null;
  const revCount = currentVocabSec ? currentVocabSec.vocab.filter((_, vi) => revealed[`${currentVocabSec.id}-${vi}`]).length : 0;
  const vocabComplete = currentVocabSec ? revCount === currentVocabSec.vocab.length : false;
  const accentColor = isVocabSlide() ? SECTIONS[vocabSecIdx()].color : isMemoSlide() ? SECTIONS[(slide - 4) / 2].color : isPracSlide() ? SECTIONS[slide - 11].color : C.turquesa;

  function goTo(n) { if (n < 0 || n >= TOTAL || n > maxUnlocked) return; setSlide(n); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function unlock(n) { setMaxUnlocked(prev => Math.max(prev, n)); }
  function advance() { const next = slide + 1; unlock(next); goTo(next); }
  function revealCard(sId, vi) { const key = `${sId}-${vi}`; if (revealed[key]) return; setRevealed(prev => ({ ...prev, [key]: true })); }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.grisB}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onBack}>
              <ChatLogo size={32} bg={C.magenta} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.negro, letterSpacing: -0.5, lineHeight: 1 }}>Chat in Spanish</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.textM, fontWeight: 700, textTransform: "uppercase" }}>Lesson 1 · Cancún</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: accentColor, fontWeight: 900 }}>{slide + 1} / {TOTAL}</span>
              <button onClick={onBack} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>← Back</button>
            </div>
          </div>
          <div style={{ height: 6, background: C.grisS, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ height: "100%", width: `${((slide + 1) / TOTAL) * 100}%`, background: `linear-gradient(90deg,${C.turquesa},${C.magenta})`, borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{ width: i === slide ? 22 : 8, height: 8, borderRadius: 4, background: i === slide ? accentColor : i < slide ? accentColor + "70" : C.grisB, transition: "all 0.3s", cursor: i <= maxUnlocked ? "pointer" : "default", opacity: i > maxUnlocked ? 0.4 : 1 }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 140px", animation: "fadeUp 0.3s ease" }} key={slide}>

        {slide === 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><ChatLogo size={80} bg={C.magenta} /></div>
            <h2 style={{ fontSize: "clamp(26px,6vw,34px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 12 }}>Welcome to Chat in Spanish</h2>
            <p style={{ fontSize: 16, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 32 }}>This course teaches you to <strong style={{ color: C.textH }}>speak Spanish</strong> — not just read it. Hear every word, say it out loud, and get instant feedback.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                { icon: "♪", color: C.turquesa, title: "Listen first", desc: "Tap any word to hear it spoken by a native Mexican Spanish voice." },
                { icon: "◉", color: C.magenta, title: "Speak out loud", desc: "The app listens and gives you instant feedback on your pronunciation." },
                { icon: "✓", color: C.limon, title: "Instant feedback", desc: "Perfecto! · Muy bien! · Try again — honest coaching every step." },
                { icon: "→", color: C.azul, title: "Travel through Mexico", desc: "Each lesson takes you to a real Mexican destination." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "16px 18px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, color: "#fff", fontWeight: 900 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.textH, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, fontSize: 13, color: C.turquesaD, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>◉</span>Allow microphone access when prompted. Works best in Chrome.
            </div>
            <button onClick={() => { unlock(1); goTo(1); }} style={btn(C.magenta, { fontSize: 17, padding: "16px 44px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` })}>Vamos! Start Lesson →</button>
          </div>
        )}

        {slide === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, color: "#fff", fontWeight: 900 }}>▶</div>
              <div>
                
                <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, lineHeight: 1.1 }}>Welcome to Cancún</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 20 }}>Before we start, get inspired. Watch this travel guide to Cancún and imagine yourself there.</p>
            <a href="https://www.youtube.com/watch?v=FWEXKQ0BXIU" target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", marginBottom: 20 }}>
              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1.5px solid ${C.turquesa}40`, boxShadow: `0 8px 32px ${C.turquesa}25`, background: "#000" }}>
                <img src="https://img.youtube.com/vi/FWEXKQ0BXIU/maxresdefault.jpg" alt="Cancún travel guide" style={{ width: "100%", display: "block", opacity: 0.88 }} onError={e => { e.target.src = "https://img.youtube.com/vi/FWEXKQ0BXIU/hqdefault.jpg"; }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(255,0,0,0.5)" }}>
                    <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid white", marginLeft: 4 }} />
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.85)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>~12 min</div>
              </div>
            </a>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="https://www.youtube.com/watch?v=FWEXKQ0BXIU" target="_blank" rel="noreferrer" style={{ ...btn("#FF0000", { fontSize: 15, padding: "15px 24px", borderRadius: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }) }}>▶ Watch on YouTube</a>
              
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button onClick={advance} style={{ background: "none", border: "none", color: C.textM, fontSize: 13, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Continue without watching</button>
            </div>
          </div>
        )}

        {slide === 2 && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, boxShadow: `0 4px 16px ${C.turquesa}40`, color: "#fff", fontWeight: 900 }}>✈</div>
              <div>
                <div style={{ display: "inline-block", background: C.turquesaL, color: C.turquesaD, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: 8, marginBottom: 6 }}>Lesson 1 · Beginner · Free</div>
                <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.8, lineHeight: 1.1 }}>You Just Landed!</div>
                <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, marginTop: 4 }}>Cancún International Airport</div>
              </div>
            </div>
            <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "22px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${C.turquesa} 33%,#fff 33%,#fff 66%,${C.magenta} 66%)` }} />
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesa, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Your Story Begins</div>
              <p style={{ margin: 0, fontSize: "clamp(14px,2.5vw,16px)", color: C.textS, lineHeight: 1.85, fontStyle: "italic", fontWeight: 500 }}>
                It's 2:47 PM. Your plane just touched down at <strong style={{ color: C.textH }}>Cancún International Airport — CUN</strong>. Through the window: palm trees, turquoise sky, a sign reading <strong style={{ color: C.turquesa }}>"BIENVENIDOS A MÉXICO."</strong> Your heart races. First challenge: immigration, baggage, money exchange, taxi — all in Spanish.
              </p>
            </div>
            
    
          </div>
        )}

        

        {isVocabSlide() && (() => {
          const sec = SECTIONS[vocabSecIdx()];
          return (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px 18px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: `0 3px 12px ${sec.color}40`, color: "#fff" }}>{sec.icon}</div>
                <div>
                  <div style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5 }}>{sec.title}</div>
                  <div style={{ fontSize: 12, color: sec.colorD, fontWeight: 700, marginTop: 2 }}>{sec.subtitle} · {revCount}/{sec.vocab.length} revealed</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.textM, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Tap each word — listen then reveal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {sec.vocab.map((item, vi) => (
                  <VocabCard key={vi} item={item} index={vi} revealed={!!revealed[`${sec.id}-${vi}`]} onReveal={() => revealCard(sec.id, vi)} speak={speak} color={sec.color} colorL={sec.colorL} />
                ))}
              </div>
              {!vocabComplete && (
                <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 14, padding: "16px", textAlign: "center" }}>
                  <div style={{ height: 6, background: C.grisB, borderRadius: 3, overflow: "hidden", maxWidth: 260, margin: "0 auto 10px" }}>
                    <div style={{ height: "100%", width: `${(revCount / sec.vocab.length) * 100}%`, background: `linear-gradient(90deg,${sec.color},${sec.colorD})`, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontSize: 13, color: C.textM, fontWeight: 700 }}>Reveal all {sec.vocab.length} words to continue</div>
                </div>
              )}
            </div>
          );
        })()}

        {isMemoSlide() && (() => {
          const sIdx = (slide - 4) / 2;
          const sec = SECTIONS[sIdx];
          return <Memorama key={slide} section={sec} speak={speak} onComplete={() => { setMemoDone(p => ({ ...p, [sIdx]: true })); advance(); }} />;
        })()}

        {isPracSlide() && (
          <ExerciseSlide key={slide} sectionIndex={slide - 11} speak={speak} onComplete={() => { setPracDone(p => ({ ...p, [slide - 11]: true })); advance(); }} />
        )}

        {slide === 15 && (
          <div>
            <div style={{ background: C.magenta, borderRadius: 20, padding: "28px 24px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>Final Quiz — Cancún</div>
              <div style={{ fontSize: 14, color: "#fff", opacity: 0.85, fontWeight: 500, marginTop: 6, textAlign: "left" }}>6 real-life situations · Show what you've learned</div>
            </div>
            <QuizFinal speak={speak} onComplete={onBack} />
          </div>
        )}

      </div>

      {(slide === 2 || isVocabSlide()) && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.grisB}`, padding: "14px 20px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 12 }}>
            <button onClick={() => goTo(slide - 1)} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "14px 20px", borderRadius: 50, cursor: "pointer", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>←</button>
            {slide === 2 && (
              <button onClick={advance} style={btn(accentColor, { flex: 1, fontSize: 16, padding: "14px", borderRadius: 50 })}>
                Start Vocabulary →
              </button>
            )}
            {isVocabSlide() && (
              <button onClick={vocabComplete ? advance : undefined} style={{ ...btn(vocabComplete ? accentColor : C.textF), flex: 1, fontSize: 15, padding: "14px", borderRadius: 50, background: vocabComplete ? accentColor : C.grisS, color: vocabComplete ? "#fff" : C.textM, cursor: vocabComplete ? "pointer" : "not-allowed", boxShadow: vocabComplete ? `0 4px 16px ${accentColor}40` : "none", border: vocabComplete ? "none" : `1.5px solid ${C.grisB}` }}>
                {vocabComplete ? "Play Memorama →" : `Reveal all words (${revCount}/${currentVocabSec?.vocab.length})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
