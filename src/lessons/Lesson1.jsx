import { useState, useRef, useCallback, useEffect } from "react";
import { C, btn } from "../tokens";
import ChatLogo from "../components/ChatLogo";

// ═══════════════════════════════════════════════════════════════
// GOOGLE SHEETS URL
// ═══════════════════════════════════════════════════════════════
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzUiHHTyLbu-efTHCzP-GZfs51qEq9hDFmvqnFnAVQCJLXYXcwxRaLG_rTSXImbr0mnFQ/exec";

// ═══════════════════════════════════════════════════════════════
// LESSON DATA — 4 sections, 8 words + 8 phrases each
// ═══════════════════════════════════════════════════════════════
const SECTIONS = [
  {
    id: "airport", icon: "✈", title: "At the Airport", subtitle: "En el Aeropuerto",
    color: C.turquesa, colorL: C.turquesaL, colorD: C.turquesaD,
    words: [
      { es: "el aeropuerto",  pron: "el ah-eh-roh-PWER-toh", en: "the airport",   phrase: { es: "¿Dónde está el aeropuerto?",       pron: "DON-deh es-TAH el ah-eh-roh-PWER-toh",      en: "Where is the airport?" } },
      { es: "el vuelo",       pron: "el BWEH-loh",           en: "the flight",    phrase: { es: "¿A qué hora llega el vuelo?",       pron: "ah KEH OH-rah YEH-gah el BWEH-loh",         en: "What time does the flight arrive?" } },
      { es: "la llegada",     pron: "lah yeh-GAH-dah",       en: "the arrival",   phrase: { es: "¿Dónde está la llegada?",           pron: "DON-deh es-TAH lah yeh-GAH-dah",            en: "Where is the arrivals area?" } },
      { es: "la salida",      pron: "lah sah-LEE-dah",       en: "the exit",      phrase: { es: "¿Dónde está la salida?",            pron: "DON-deh es-TAH lah sah-LEE-dah",            en: "Where is the exit?" } },
      { es: "la maleta",      pron: "lah mah-LEH-tah",       en: "the suitcase",  phrase: { es: "Mi maleta no llegó",                pron: "mee mah-LEH-tah no yeh-GO",                 en: "My suitcase didn't arrive" } },
      { es: "la mochila",     pron: "lah moh-CHEE-lah",      en: "the backpack",  phrase: { es: "Tengo una mochila y una maleta",    pron: "TEN-goh OO-nah moh-CHEE-lah ee OO-nah mah-LEH-tah", en: "I have a backpack and a suitcase" } },
      { es: "el pasaporte",   pron: "el pah-sah-POR-teh",    en: "the passport",  phrase: { es: "Aquí está mi pasaporte",            pron: "ah-KEE es-TAH mee pah-sah-POR-teh",         en: "Here is my passport" } },
      { es: "la aduana",      pron: "lah ah-DWAH-nah",       en: "customs",       phrase: { es: "¿Dónde está la aduana?",            pron: "DON-deh es-TAH lah ah-DWAH-nah",            en: "Where is customs?" } },
    ],
    quizQs: [
      { scene: "Cancún Airport — Migración", q: "The officer holds out his hand. He needs your travel document. What does he want?", options: ["la maleta","el pasaporte","la propina","el recibo"], correct: 1, exp: "el pasaporte = the passport. Always have it ready at migración." },
      { scene: "Baggage claim", q: "You're looking for your bag. What Spanish word describes it?", options: ["el vuelo","la llegada","la maleta","la aduana"], correct: 2, exp: "la maleta = the suitcase. Tell staff 'mi maleta no llegó' if it's missing." },
      { scene: "Customs — Aduana", q: "The sign says ADUANA. Where are you?", options: ["At the gate","At the exit","At baggage claim","At customs"], correct: 3, exp: "la aduana = customs. You'll pass through here with your bags." },
    ],
  },
  {
    id: "greetings", icon: "👋", title: "First Words", subtitle: "Primeras Palabras",
    color: C.magenta, colorL: C.magentaL, colorD: C.magentaD,
    words: [
      { es: "Hola",                    pron: "OH-lah",                        en: "Hello / Hi",       phrase: { es: "Hola, buenos días",                   pron: "OH-lah BWEH-nos DEE-as",                        en: "Hello, good morning" } },
      { es: "Buenos días",             pron: "BWEH-nos DEE-as",               en: "Good morning",     phrase: { es: "Buenos días, ¿cómo está?",             pron: "BWEH-nos DEE-as KOH-moh es-TAH",                en: "Good morning, how are you?" } },
      { es: "Buenas tardes",           pron: "BWEH-nas TAR-des",              en: "Good afternoon",   phrase: { es: "Buenas tardes, por favor",             pron: "BWEH-nas TAR-des por fah-VOR",                  en: "Good afternoon, please" } },
      { es: "Por favor",               pron: "por fah-VOR",                   en: "Please",           phrase: { es: "Por favor, ¿me puede ayudar?",         pron: "por fah-VOR meh PWEH-deh ah-yoo-DAR",           en: "Please, can you help me?" } },
      { es: "Gracias",                 pron: "GRAH-syahs",                    en: "Thank you",        phrase: { es: "Muchas gracias, muy amable",           pron: "MOO-chas GRAH-syahs mwee ah-MAH-bleh",          en: "Thank you very much, very kind" } },
      { es: "De nada",                 pron: "deh NAH-dah",                   en: "You're welcome",   phrase: { es: "Gracias — de nada",                   pron: "GRAH-syahs deh NAH-dah",                        en: "Thank you — you're welcome" } },
      { es: "Perdón",                  pron: "pehr-DON",                      en: "Excuse me",        phrase: { es: "Perdón, no entiendo",                 pron: "pehr-DON no en-TYEN-doh",                       en: "Excuse me, I don't understand" } },
      { es: "Más despacio, por favor", pron: "mahs des-PAH-syoh por fah-VOR", en: "Slower, please",   phrase: { es: "Perdón, más despacio por favor",       pron: "pehr-DON mahs des-PAH-syoh por fah-VOR",        en: "Excuse me, slower please" } },
    ],
    quizQs: [
      { scene: "Taxi stand — 3:30 PM", q: "You want to greet your taxi driver politely. What do you say?", options: ["Buenos días","Buenas noches","Buenas tardes","Hola amigo"], correct: 2, exp: "Buenas tardes = Good afternoon. Use from noon until ~7pm." },
      { scene: "Someone helps you with your bag", q: "How do you say thank you?", options: ["Por favor","De nada","Perdón","Gracias"], correct: 3, exp: "Gracias = Thank you. One of the most important words you'll use." },
      { scene: "A Mexican speaks very fast", q: "What do you say to ask them to slow down?", options: ["No hablo español","Más despacio por favor","¿Habla inglés?","No entiendo"], correct: 1, exp: "Más despacio, por favor = Slower, please. Your #1 survival phrase!" },
    ],
  },
  {
    id: "money", icon: "💵", title: "Money & Exchange", subtitle: "Dinero y Cambio",
    color: C.azul, colorL: C.azulL, colorD: C.azulD,
    words: [
      { es: "el dinero",              pron: "el dee-NEH-roh",                 en: "the money",              phrase: { es: "No tengo dinero",                    pron: "no TEN-goh dee-NEH-roh",                       en: "I don't have money" } },
      { es: "el peso mexicano",       pron: "el PEH-soh meh-hee-KAH-noh",    en: "Mexican peso",           phrase: { es: "¿Acepta pesos mexicanos?",            pron: "ah-SEP-tah PEH-sos meh-hee-KAH-nos",           en: "Do you accept Mexican pesos?" } },
      { es: "¿A cómo está el dólar?", pron: "ah KOH-moh es-TAH el DOH-lar",  en: "What's the dollar rate?",phrase: { es: "¿A cómo está el dólar hoy?",          pron: "ah KOH-moh es-TAH el DOH-lar OY",              en: "What's the dollar rate today?" } },
      { es: "Quiero cambiar dinero",  pron: "KYEH-roh kam-BYAR dee-NEH-roh", en: "I want to exchange",     phrase: { es: "Quiero cambiar cien dólares",         pron: "KYEH-roh kam-BYAR syen DOH-lah-res",           en: "I want to exchange 100 dollars" } },
      { es: "¿Cuánto cuesta?",        pron: "KWAHN-toh KWES-tah",             en: "How much?",              phrase: { es: "¿Cuánto cuesta esto?",               pron: "KWAHN-toh KWES-tah ES-toh",                    en: "How much does this cost?" } },
      { es: "la propina",             pron: "lah proh-PEE-nah",               en: "the tip",                phrase: { es: "La propina está incluida",           pron: "lah proh-PEE-nah es-TAH een-kloo-EE-dah",     en: "The tip is included" } },
      { es: "el recibo",              pron: "el reh-SEE-boh",                 en: "the receipt",            phrase: { es: "¿Me da el recibo?",                  pron: "meh dah el reh-SEE-boh",                       en: "Can I have the receipt?" } },
      { es: "Es barato",              pron: "ehs bah-RAH-toh",                en: "It's cheap",             phrase: { es: "Es muy barato, gracias",             pron: "ehs mwee bah-RAH-toh GRAH-syahs",              en: "It's very cheap, thank you" } },
    ],
    quizQs: [
      { scene: "Casa de cambio", q: "You want the exchange rate for your dollars. What do you say?", options: ["¿Cuánto cuesta?","¿Habla inglés?","¿A cómo está el dólar?","¿Cuánto cobra?"], correct: 2, exp: "¿A cómo está el dólar? = What's the dollar rate?" },
      { scene: "Restaurant — end of meal", q: "The waiter brings the bill. You want to leave a tip. What word do you use?", options: ["el recibo","el dinero","la propina","el peso"], correct: 2, exp: "la propina = the tip. 10-15% is standard in Mexico." },
      { scene: "Market stall", q: "You want to know the price of a souvenir. What do you ask?", options: ["¿A cómo está?","¿Cuánto cuesta?","¿Es barato?","¿Quiero cambiar?"], correct: 1, exp: "¿Cuánto cuesta? = How much does it cost? Use it everywhere." },
    ],
  },
  {
    id: "transport", icon: "🚕", title: "Getting Around", subtitle: "Transporte",
    color: C.limon, colorL: C.limonL, colorD: C.limonD,
    words: [
      { es: "el taxi",        pron: "el TAK-see",         en: "the taxi",           phrase: { es: "¿Dónde está el taxi?",              pron: "DON-deh es-TAH el TAK-see",                    en: "Where is the taxi?" } },
      { es: "el autobús",     pron: "el ow-toh-BOOS",     en: "the bus",            phrase: { es: "¿El autobús va al centro?",          pron: "el ow-toh-BOOS bah al SEN-troh",               en: "Does the bus go downtown?" } },
      { es: "el hostal",      pron: "el os-TAL",          en: "the hostel",         phrase: { es: "Lléveme al hostal, por favor",       pron: "YEH-beh-meh al os-TAL por fah-VOR",           en: "Take me to the hostel, please" } },
      { es: "Voy a...",       pron: "BOY ah",             en: "I'm going to...",    phrase: { es: "Voy al aeropuerto",                  pron: "BOY al ah-eh-roh-PWER-toh",                    en: "I'm going to the airport" } },
      { es: "¿A dónde va?",   pron: "ah DON-deh BAH",     en: "Where are you going?",phrase:{ es: "¿A dónde va el autobús?",            pron: "ah DON-deh BAH el ow-toh-BOOS",                en: "Where does the bus go?" } },
      { es: "¿Cuánto cobra?", pron: "KWAHN-toh KOH-brah", en: "How much do you charge?", phrase: { es: "¿Cuánto cobra al hostal?",      pron: "KWAHN-toh KOH-brah al os-TAL",                 en: "How much to the hostel?" } },
      { es: "Aquí está bien", pron: "ah-KEE es-TAH BYEN", en: "Stop here",          phrase: { es: "Aquí está bien, gracias",            pron: "ah-KEE es-TAH BYEN GRAH-syahs",                en: "Stop here, thank you" } },
      { es: "Lléveme a...",   pron: "YEH-beh-meh ah",     en: "Take me to...",      phrase: { es: "Lléveme a la playa, por favor",      pron: "YEH-beh-meh ah lah PLAH-yah por fah-VOR",     en: "Take me to the beach, please" } },
    ],
    quizQs: [
      { scene: "Inside the taxi", q: "The driver asks '¿A dónde va?' — what is he asking?", options: ["How much money?","Where are you going?","How long is your stay?","First visit?"], correct: 1, exp: "¿A dónde va? = Where are you going? Reply with 'Voy a...'" },
      { scene: "Arriving at your hostel", q: "Your taxi arrives. How do you tell the driver to stop here?", options: ["Por favor para","Voy a aquí","Aquí está bien","Hasta luego"], correct: 2, exp: "Aquí está bien = Here is fine. Used by locals every day." },
      { scene: "Taxi stand", q: "You want to know the fare before you get in. What do you ask?", options: ["¿Cuánto cobra?","¿A dónde va?","Lléveme a","Voy a..."], correct: 0, exp: "¿Cuánto cobra? = How much do you charge? Always ask before getting in." },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// SLIDE MAP
// 0  = Onboarding
// 1  = Video
// 2  = Story
// 3  = Pronounce Airport    4  = Memorama Airport   5  = Quiz Airport   6  = Survey Airport
// 7  = Pronounce Greetings  8  = Memorama Greetings 9  = Quiz Greetings 10 = Survey Greetings
// 11 = Pronounce Money      12 = Memorama Money     13 = Quiz Money     14 = Survey Money
// 15 = Pronounce Transport  16 = Memorama Transport 17 = Quiz Transport 18 = Survey Transport
// 19 = Completed!
const TOTAL = 20;

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

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════
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
    rec.onend   = () => setListening(false);
    recRef.current = rec;
  }, []);
  const start = useCallback(() => { if (!recRef.current) return; setTranscript(""); setListening(true); try { recRef.current.start(); } catch(e) { setListening(false); } }, []);
  const stop  = useCallback(() => { try { recRef.current?.stop(); } catch(e) {} setListening(false); }, []);
  return { transcript, listening, supported, start, stop, setTranscript };
}

// ═══════════════════════════════════════════════════════════════
// SINGLE PRON EXERCISE (word or phrase)
// ═══════════════════════════════════════════════════════════════
function PronExercise({ answer, onListenPress, onPass, color = C.turquesa, passLabel = "Next →" }) {
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
  const resultBg    = result === "perfect" ? C.limonL : result === "good" ? C.azulL : C.rojoL;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button type="button" onClick={onListenPress} style={{ flex: 1, background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 24 }}>♪</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.azulD }}>Listen</span>
        </button>
        <button type="button" onClick={handleMic} style={{ flex: 2, border: "none", borderRadius: 14, padding: "14px 12px", cursor: "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: listening ? C.magenta : canAdvance && result !== "retry" ? C.limon : color, transition: "all 0.2s" }}>
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
          <div style={{ fontSize: 12, color: C.textS, fontWeight: 500, textAlign: "center" }}>
            {result === "perfect" && "Native speakers will understand you!"}
            {result === "good"    && "Good pronunciation! Keep going."}
            {result === "retry"   && <>I heard: <strong>"{transcript}"</strong> — listen first, then try again.</>}
          </div>
          {attempts >= 2 && result === "retry" && <div style={{ marginTop: 6, fontSize: 11, color: C.textM, fontStyle: "italic" }}>You can continue — pronunciation improves with practice!</div>}
        </div>
      )}

      {!supported && <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: C.textS }}>Voice recognition works best in Chrome.</div>}

      {(canAdvance || !supported) && (
        <button type="button" onClick={onPass} style={btn(result === "perfect" ? C.limon : color, { width: "100%", fontSize: 14, padding: "13px", borderRadius: 12 })}>
          {passLabel}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXERCISE SLIDE — word + phrase together
// ═══════════════════════════════════════════════════════════════
function ExerciseSlide({ sectionIndex, speak, onComplete }) {
  const sec = SECTIONS[sectionIndex];
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("word"); // "word" | "phrase"
  const [done, setDone] = useState(false);
  useEffect(() => { setWordIdx(0); setPhase("word"); setDone(false); }, [sectionIndex]);

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Section complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 32 }}>Great work on <strong>{sec.title}</strong>!</div>
      <button type="button" onClick={onComplete} style={btn(sec.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 })}>Continue →</button>
    </div>
  );

  const word = sec.words[wordIdx];

  function handleWordPass() { setPhase("phrase"); }
  function handlePhrasePass() {
    if (wordIdx + 1 < sec.words.length) { setWordIdx(wordIdx + 1); setPhase("word"); }
    else { setDone(true); onComplete(); }
  }

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "14px 16px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, color: "#fff" }}>{sec.icon}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.textH }}>Speaking Practice</div>
          <div style={{ fontSize: 11, color: sec.colorD, fontWeight: 700 }}>{sec.title} · Word {wordIdx + 1} of {sec.words.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: C.grisB, borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(wordIdx / sec.words.length) * 100}%`, background: sec.color, borderRadius: 2, transition: "width 0.4s" }} />
      </div>

      {/* WORD BLOCK */}
      <div style={{ background: sec.colorL, border: `1.5px solid ${sec.color}30`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: sec.colorD, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Word</div>
        <div style={{ fontSize: "clamp(24px,6vw,32px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>{word.es}</div>
        <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 11, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.pron}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 600 }}>{word.en}</div>
      </div>

      {phase === "word" && (
        <PronExercise
          key={`word-${sectionIndex}-${wordIdx}`}
          answer={word.es}
          onListenPress={() => speak(word.es)}
          onPass={handleWordPass}
          color={sec.color}
          passLabel="Now practice the phrase →"
        />
      )}

      {/* PHRASE BLOCK — shown after word is done */}
      {phase === "phrase" && (
        <>
          <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.textM, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Used in a phrase</div>
            <div style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 900, color: C.textH, marginBottom: 8 }}>{word.phrase.es}</div>
            <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 11, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.phrase.pron}</div>
            <div style={{ fontSize: 13, color: C.textS, fontWeight: 500 }}>{word.phrase.en}</div>
          </div>

          <PronExercise
            key={`phrase-${sectionIndex}-${wordIdx}`}
            answer={word.phrase.es}
            onListenPress={() => speak(word.phrase.es)}
            onPass={handlePhrasePass}
            color={sec.color}
            passLabel={wordIdx + 1 < sec.words.length ? "Next word →" : "Section complete →"}
          />
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MEMORAMA
// ═══════════════════════════════════════════════════════════════
function Memorama({ section, speak, onComplete }) {
  const pairs = section.words.slice(0, 6).map(w => ({ es: w.es, en: w.en }));
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
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, marginBottom: 8, textAlign: "center" }}>Memorama Complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 8, textAlign: "center" }}>You matched all {pairs.length} pairs in <strong style={{ color: section.color }}>{moves} moves</strong></div>
      <div style={{ fontSize: 13, color: C.textM, marginBottom: 32, textAlign: "center" }}>{moves <= pairs.length + 2 ? "Excellent memory!" : moves <= pairs.length + 5 ? "Good job!" : "Keep practicing!"}</div>
      <button type="button" onClick={onComplete} style={btn(section.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 })}>Continue →</button>
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
            <div key={card.id} onClick={() => flip(card)} style={{ height: 84, borderRadius: 14, cursor: isM ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 6px", background: isM ? section.colorL : show ? (card.type === "es" ? C.turquesaL : C.magentaL) : C.grisS, border: `1.5px solid ${isM ? section.color + "60" : show ? (card.type === "es" ? C.turquesa : C.magenta) + "50" : C.grisB}`, transform: show ? "scale(1.03)" : "scale(1)" }}>
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

// ═══════════════════════════════════════════════════════════════
// SECTION QUIZ
// ═══════════════════════════════════════════════════════════════
function SectionQuiz({ section, speak, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const qs = section.quizQs;

  function select(i) {
    if (sel !== null) return;
    setSel(i);
    if (i === qs[idx].correct) { setScore(s => s + 1); speak(qs[idx].options[i]); }
  }
  function next() {
    if (idx + 1 >= qs.length) { setDone(true); return; }
    setIdx(i => i + 1); setSel(null);
  }

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
        <div style={{ fontSize: "clamp(48px,12vw,64px)", fontWeight: 900, color: section.color, lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>{score}/{qs.length}</div>
        <div style={{ fontSize: 20, color: C.textH, fontWeight: 800, marginBottom: 8 }}>{pct >= 67 ? "Well done!" : "Keep going!"}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, marginBottom: 32 }}>{pct >= 67 ? `You know your ${section.title} vocabulary!` : "Practice makes perfect — you've got this."}</div>
        <button type="button" onClick={onComplete} style={btn(section.color, { fontSize: 16, padding: "15px 36px", borderRadius: 14 })}>Continue →</button>
      </div>
    );
  }

  const q = qs[idx];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "#fff", fontWeight: 900 }}>?</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Quick Quiz</div>
          <div style={{ fontSize: 12, color: section.colorD, fontWeight: 700 }}>{section.title} · Question {idx + 1} of {qs.length}</div>
        </div>
      </div>
      <div style={{ height: 6, background: C.grisS, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / qs.length) * 100}%`, background: `linear-gradient(90deg,${section.color},${section.colorD})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 24 }}>
        <span>{idx + 1} / {qs.length}</span>
        <span style={{ color: section.color, fontWeight: 900 }}>Score: {score}</span>
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
            <button type="button" key={i} onClick={() => select(i)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "15px 18px", textAlign: "left", cursor: sel !== null ? "default" : "pointer", color: tc, fontSize: 15, fontWeight: fw, transition: "all 0.18s", display: "flex", alignItems: "center", gap: 14, boxShadow: sel === null ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}>
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
            <span style={{ fontWeight: 900, color: sel === q.correct ? C.limonD : C.rojo }}>{sel === q.correct ? "Correct! " : "Not quite — "}</span>{q.exp}
          </div>
          <button type="button" onClick={next} style={btn(section.color, { width: "100%", fontSize: 16, padding: "15px", borderRadius: 14 })}>{idx + 1 >= qs.length ? "See Results →" : "Next Question →"}</button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BLOCK SURVEY
// ═══════════════════════════════════════════════════════════════
function BlockSurvey({ section, blockNumber, onComplete }) {
  const [answers, setAnswers] = useState({ continueNext: 0, pronunciation: 0, memorama: 0, instructions: 0, voiceRecognition: "", comments: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nextLabel = blockNumber < 4 ? `Block ${blockNumber + 1}` : "Lesson Complete";

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, block: section.id }),
      });
    } catch(e) { console.log("Submit error:", e); }
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.textH, marginBottom: 12 }}>Thank you!</div>
      <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>Your feedback goes directly to the course creator.</div>
      <button type="button" onClick={onComplete} style={btn(section.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 })}>Continue to {nextLabel} →</button>
    </div>
  );

  function ScoreRow({ label, field }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>{label}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button type="button" key={n} onClick={() => setAnswers(p => ({ ...p, [field]: n }))}
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${answers[field] === n ? section.color : C.grisB}`, background: answers[field] === n ? section.color : C.grisS, color: answers[field] === n ? "#fff" : C.textS, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
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
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#fff", fontWeight: 800, textTransform: "uppercase", opacity: 0.8, marginBottom: 8 }}>Block {blockNumber} Complete — {section.title}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>You're one of our first testers!</div>
        <div style={{ fontSize: 13, color: "#fff", opacity: 0.9, lineHeight: 1.6 }}>
          Chat in Spanish is in development. Your feedback shapes the final product. 2 minutes — every answer counts.
        </div>
      </div>

      <ScoreRow label={`1. How likely are you to continue to ${nextLabel}?`} field="continueNext" />
      <ScoreRow label="2. How useful was the pronunciation practice?" field="pronunciation" />
      <ScoreRow label="3. How fun was the Memorama game?" field="memorama" />
      <ScoreRow label="4. How clear were the instructions?" field="instructions" />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>5. Did the voice recognition work correctly?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Yes, perfectly", "Sometimes", "No, it didn't work"].map(opt => (
            <button type="button" key={opt} onClick={() => setAnswers(p => ({ ...p, voiceRecognition: opt }))}
              style={{ padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${answers.voiceRecognition === opt ? section.color : C.grisB}`, background: answers.voiceRecognition === opt ? section.colorL : C.grisS, color: answers.voiceRecognition === opt ? section.colorD : C.textS, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {answers.voiceRecognition === opt ? "◉ " : "○ "}{opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>6. What would you change or improve? <span style={{ fontSize: 12, color: C.textM, fontWeight: 500 }}>(optional)</span></div>
        <textarea
          value={answers.comments}
          onChange={e => setAnswers(p => ({ ...p, comments: e.target.value }))}
          placeholder="Your ideas go directly to the course creator..."
          style={{ width: "100%", minHeight: 90, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.grisB}`, fontSize: 13, color: C.textH, fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "vertical", outline: "none", background: C.grisS }}
        />
      </div>

      <button type="button" onClick={handleSubmit} disabled={!allDone || submitting}
        style={{ ...btn(allDone ? section.color : C.grisB, { width: "100%", fontSize: 16, padding: "16px", borderRadius: 50 }), opacity: allDone ? 1 : 0.5, cursor: allDone ? "pointer" : "not-allowed" }}>
        {submitting ? "Sending..." : "Submit Feedback →"}
      </button>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.textM }}>
        Thank you — your response goes directly to the course creator.
      </div>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button type="button" onClick={onComplete} style={{ background: "none", border: "none", color: C.textM, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
          Skip survey
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPLETED SLIDE
// ═══════════════════════════════════════════════════════════════
function CompletedSlide({ onBack }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
      <h2 style={{ fontSize: "clamp(28px,6vw,36px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 12 }}>Lesson 1 Complete!</h2>
      <p style={{ fontSize: 16, color: C.textS, lineHeight: 1.75, fontWeight: 500, maxWidth: 400, margin: "0 auto 32px" }}>
        You've learned 32 words, practiced pronunciation with real phrases, and completed 4 quizzes. Great work!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, maxWidth: 400, margin: "0 auto 40px" }}>
        {[
          { label: "Words learned",      value: "32",   color: C.turquesa },
          { label: "Phrases practiced",  value: "32",   color: C.magenta },
          { label: "Quizzes completed",  value: "4",    color: C.azul },
          { label: "Lesson",             value: "1/60", color: C.limonD },
        ].map((s, i) => (
          <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textS, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onBack} style={btn(C.magenta, { fontSize: 16, padding: "16px 40px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` })}>
        Back to Home →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LESSON COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Lesson1({ onBack }) {
  const { speak } = useTTS();
  const [slide, setSlide] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  // Section helpers
  function isPronSlide()   { return [3,7,11,15].includes(slide); }
  function isMemoSlide()   { return [4,8,12,16].includes(slide); }
  function isQuizSlide()   { return [5,9,13,17].includes(slide); }
  function isSurveySlide() { return [6,10,14,18].includes(slide); }
  function sectionIdx() {
    if ([3,4,5,6].includes(slide))   return 0;
    if ([7,8,9,10].includes(slide))  return 1;
    if ([11,12,13,14].includes(slide)) return 2;
    if ([15,16,17,18].includes(slide)) return 3;
    return 0;
  }
  function blockNumber() { return sectionIdx() + 1; }

  const accentColor =
    isPronSlide() || isMemoSlide() || isQuizSlide() || isSurveySlide()
      ? SECTIONS[sectionIdx()].color
      : C.turquesa;

  function goTo(n) { if (n < 0 || n >= TOTAL || n > maxUnlocked) return; setSlide(n); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function unlock(n) { setMaxUnlocked(prev => Math.max(prev, n)); }
  function advance() { const next = slide + 1; unlock(next); goTo(next); }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* HEADER */}
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
              <button type="button" onClick={onBack} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>← Back</button>
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

      {/* SLIDE CONTENT */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 100px", animation: "fadeUp 0.3s ease" }} key={slide}>

        {/* SLIDE 0 — ONBOARDING */}
        {slide === 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><ChatLogo size={80} bg={C.magenta} /></div>
            <h2 style={{ fontSize: "clamp(26px,6vw,34px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 12 }}>Lesson 1 — Cancún</h2>
            <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 28 }}>Here's what you'll do in this lesson:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                { num: "01", color: C.turquesa,  title: "Watch",    desc: "A travel video of Cancún to get you inspired." },
                { num: "02", color: C.magenta,   title: "Story",    desc: "You just landed at Cancún airport. Your journey begins." },
                { num: "03", color: C.azul,      title: "Speak",    desc: "32 words across 4 topics — listen, repeat, get graded." },
                { num: "04", color: C.morado,    title: "Phrases",  desc: "Each word comes with a real phrase — practice both." },
                { num: "05", color: C.limonD,    title: "Memorama", desc: "Match Spanish and English cards to lock words in memory." },
                { num: "06", color: C.magentaD,  title: "Quiz",     desc: "Real-life situations — use what you just learned." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "16px 18px", alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 13, fontWeight: 900 }}>{s.num}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.textH, marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: C.textS, fontWeight: 500, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, fontSize: 13, color: C.turquesaD, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>◉</span>Allow microphone access when prompted. Works best in Chrome.
            </div>
            <button type="button" onClick={() => { unlock(1); goTo(1); }} style={btn(C.magenta, { fontSize: 17, padding: "16px 44px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` })}>
              Vamos! Start Lesson →
            </button>
          </div>
        )}

        {/* SLIDE 1 — VIDEO */}
        {slide === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, color: "#fff", fontWeight: 900 }}>▶</div>
              <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, lineHeight: 1.1 }}>Welcome to Cancún</div>
            </div>
            <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 20 }}>
              Before we start, get inspired. Watch this travel guide to Cancún and imagine yourself there.
            </p>
            {/* YouTube embed */}
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 20, marginBottom: 20, boxShadow: `0 8px 32px ${C.turquesa}25` }}>
              <iframe
                src="https://www.youtube.com/embed/FWEXKQ0BXIU"
                title="Cancún travel guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 20 }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={advance} style={{ background: "none", border: "none", color: C.textM, fontSize: 13, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>
                Continue without watching
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 2 — STORY */}
        {slide === 2 && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, color: "#fff", fontWeight: 900 }}>✈</div>
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
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesaD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>What you'll learn in this lesson</div>
              {["Airport vocabulary — passport, customs, baggage","Greetings — hello, thank you, excuse me","Money — pesos, exchange rate, how much?","Transport — taxi, bus, directions"].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: C.turquesa, fontWeight: 900, fontSize: 14 }}>→</span>
                  <span style={{ fontSize: 13, color: C.textB, fontWeight: 500 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDES 3,7,11,15 — PRONOUNCE */}
        {isPronSlide() && (
          <ExerciseSlide key={slide} sectionIndex={sectionIdx()} speak={speak} onComplete={advance} />
        )}

        {/* SLIDES 4,8,12,16 — MEMORAMA */}
        {isMemoSlide() && (() => {
          const sec = SECTIONS[sectionIdx()];
          return <Memorama key={slide} section={sec} speak={speak} onComplete={advance} />;
        })()}

        {/* SLIDES 5,9,13,17 — QUIZ */}
        {isQuizSlide() && (
          <SectionQuiz key={slide} section={SECTIONS[sectionIdx()]} speak={speak} onComplete={advance} />
        )}

        {/* SLIDES 6,10,14,18 — SURVEY */}
        {isSurveySlide() && (
          <BlockSurvey key={slide} section={SECTIONS[sectionIdx()]} blockNumber={blockNumber()} onComplete={advance} />
        )}

        {/* SLIDE 19 — COMPLETED */}
        {slide === 19 && (
          <CompletedSlide onBack={onBack} />
        )}

      </div>

      {/* BOTTOM NAV — story slide only */}
      {slide === 2 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.grisB}`, padding: "14px 20px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 12 }}>
            <button type="button" onClick={() => goTo(slide - 1)} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "14px 20px", borderRadius: 50, cursor: "pointer", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>←</button>
            <button type="button" onClick={advance} style={btn(C.turquesa, { flex: 1, fontSize: 16, padding: "14px", borderRadius: 50 })}>
              Start Speaking Practice →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
