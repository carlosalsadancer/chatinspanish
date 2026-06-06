import { useState, useRef, useCallback, useEffect } from "react";
import { C, btn } from "../tokens";
import ChatLogo from "../components/ChatLogo";

// ═══════════════════════════════════════════════════════════════
// GOOGLE SHEETS URL
// ═══════════════════════════════════════════════════════════════
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzUiHHTyLbu-efTHCzP-GZfs51qEq9hDFmvqnFnAVQCJLXYXcwxRaLG_rTSXImbr0mnFQ/exec";

// ═══════════════════════════════════════════════════════════════
// LESSON DATA — 4 approved blocks (no articles in display)
// ═══════════════════════════════════════════════════════════════
const SECTIONS = [
  {
    id: "airport", icon: "✈", title: "At the Airport", subtitle: "En el Aeropuerto",
    color: C.turquesa, colorL: C.turquesaL, colorD: C.turquesaD,
    words: [
      { es: "el internet",          display: "internet",          pron: "een-ter-NET",                     en: "internet",          phrase: { es: "¿Hay internet gratis en el aeropuerto?",        pron: "hay een-ter-NET GRAH-tees en el ah-eh-roh-PWER-toh",          en: "Is there free internet at the airport?" } },
      { es: "la migración",         display: "migración",         pron: "mee-grah-SYON",                   en: "immigration",        phrase: { es: "¿Dónde está la zona de migración?",             pron: "DON-deh es-TAH lah SO-nah deh mee-grah-SYON",                en: "Where is the immigration area?" } },
      { es: "la fila",              display: "fila",              pron: "FEE-lah",                         en: "line",               phrase: { es: "Perdón, ¿esta es la fila para extranjeros?",    pron: "pehr-DON ES-tah ehs lah FEE-lah PAH-rah eks-tran-HEH-ros",  en: "Excuse me, is this the line for foreigners?" } },
      { es: "el pasaporte",         display: "pasaporte",         pron: "pah-sah-POR-teh",                 en: "passport",           phrase: { es: "Hola, aquí está mi pasaporte.",                 pron: "OH-lah ah-KEE es-TAH mee pah-sah-POR-teh",                   en: "Hello, here is my passport." } },
      { es: "el boleto de regreso", display: "boleto",            pron: "boh-LEH-toh",                     en: "ticket",             phrase: { es: "Tengo mi boleto de regreso aquí.",               pron: "TEN-goh mee boh-LEH-toh deh reh-GREH-soh ah-KEE",            en: "I have my return ticket here." } },
      { es: "la maleta",            display: "maleta",            pron: "mah-LEH-tah",                     en: "suitcase",           phrase: { es: "¿Dónde recojo mi maleta?",                      pron: "DON-deh reh-KOH-hoh mee mah-LEH-tah",                        en: "Where do I pick up my suitcase?" } },
      { es: "la salida",            display: "salida",            pron: "sah-LEE-dah",                     en: "exit",               phrase: { es: "¿Por dónde es la salida?",                      pron: "por DON-deh ehs lah sah-LEE-dah",                            en: "Which way is the exit?" } },
      { es: "el autobús ADO",       display: "autobús",           pron: "ow-toh-BOOS",                     en: "bus",                phrase: { es: "¿Dónde compro el boleto de autobús ADO?",       pron: "DON-deh KOM-proh el boh-LEH-toh deh ow-toh-BOOS ah-deh-OH", en: "Where do I buy the ADO bus ticket?" } },
    ],
  },
  {
    id: "money", icon: "💵", title: "Money & Exchange", subtitle: "Dinero y Cambio",
    color: C.azul, colorL: C.azulL, colorD: C.azulD,
    words: [
      { es: "los pesos",         display: "pesos",          pron: "PEH-sos",                  en: "pesos",           phrase: { es: "¿Dónde puedo conseguir pesos?",               pron: "DON-deh PWEH-doh kon-seh-GHEER PEH-sos",             en: "Where can I get pesos?" } },
      { es: "la casa de cambio", display: "casa de cambio", pron: "KAH-sah deh KAM-byoh",     en: "exchange office",  phrase: { es: "¿Dónde está la casa de cambio más cercana?",  pron: "DON-deh es-TAH lah KAH-sah deh KAM-byoh mas ser-KAH-nah", en: "Where is the nearest exchange office?" } },
      { es: "el cajero",         display: "cajero",         pron: "kah-HEH-roh",              en: "ATM",             phrase: { es: "¿Hay un cajero cerca?",                       pron: "hay oon kah-HEH-roh SER-kah",                        en: "Is there an ATM nearby?" } },
      { es: "¿Cuánto cuesta?",   display: "¿Cuánto cuesta?",pron: "KWAHN-toh KWES-tah",       en: "How much is it?", phrase: { es: "¿Cuánto cuesta esto?",                        pron: "KWAHN-toh KWES-tah ES-toh",                          en: "How much is this?" } },
      { es: "la cuenta",         display: "cuenta",         pron: "KWEN-tah",                 en: "the bill",        phrase: { es: "¿Me puede traer la cuenta, por favor?",       pron: "meh PWEH-deh trah-EHR lah KWEN-tah por fah-VOR",    en: "Can you bring me the bill, please?" } },
      { es: "el efectivo",       display: "efectivo",       pron: "eh-fek-TEE-boh",           en: "cash",            phrase: { es: "¿Solo aceptan efectivo?",                     pron: "SO-loh ah-SEP-tan eh-fek-TEE-boh",                   en: "Do you only accept cash?" } },
      { es: "la tarjeta",        display: "tarjeta",        pron: "tar-HEH-tah",              en: "card",            phrase: { es: "¿Aceptan tarjeta?",                           pron: "ah-SEP-tan tar-HEH-tah",                             en: "Do you accept card?" } },
      { es: "el cambio",         display: "cambio",         pron: "KAM-byoh",                 en: "change",          phrase: { es: "¿Me puede dar mi cambio, por favor?",         pron: "meh PWEH-deh dar mee KAM-byoh por fah-VOR",          en: "Can you give me my change, please?" } },
    ],
  },
  {
    id: "transport", icon: "🚌", title: "Getting Around", subtitle: "Transporte",
    color: C.limon, colorL: C.limonL, colorD: C.limonD,
    words: [
      { es: "la parada",      display: "parada",      pron: "pah-RAH-dah",           en: "bus stop",      phrase: { es: "¿Dónde está la parada del autobús ADO?",           pron: "DON-deh es-TAH lah pah-RAH-dah del ow-toh-BOOS ah-deh-OH",    en: "Where is the ADO bus stop?" } },
      { es: "el autobús",     display: "autobús",     pron: "ow-toh-BOOS",           en: "bus",           phrase: { es: "¿Cuál autobús va a Cancún?",                       pron: "kwal ow-toh-BOOS bah ah kan-KOON",                             en: "Which bus goes to Cancún?" } },
      { es: "el boleto",      display: "boleto",      pron: "boh-LEH-toh",           en: "ticket",        phrase: { es: "Aquí está mi boleto.",                             pron: "ah-KEE es-TAH mee boh-LEH-toh",                                en: "Here is my ticket." } },
      { es: "el asiento",     display: "asiento",     pron: "ah-SYEN-toh",           en: "seat",          phrase: { es: "Disculpe, ese es mi asiento. Tengo el ocho.",      pron: "dees-KUL-peh EH-seh ehs mee ah-SYEN-toh TEN-goh el OH-choh",  en: "Excuse me, that is my seat. I have number eight." } },
      { es: "el taxi",        display: "taxi",        pron: "TAK-see",               en: "taxi",          phrase: { es: "¿Dónde puedo tomar un taxi?",                      pron: "DON-deh PWEH-doh toh-MAR oon TAK-see",                         en: "Where can I get a taxi?" } },
      { es: "la dirección",   display: "dirección",   pron: "dee-rek-SYON",          en: "address",       phrase: { es: "Esta es la dirección de mi hotel.",                pron: "ES-tah ehs lah dee-rek-SYON deh mee oh-TEL",                   en: "This is the address of my hotel." } },
      { es: "el precio",      display: "precio",      pron: "PREH-syoh",             en: "price",         phrase: { es: "¿Cuál es el precio por llevarme al hostal?",       pron: "kwal ehs el PREH-syoh por yeh-BAR-meh al os-TAL",              en: "What is the price to take me to the hostel?" } },
      { es: "la reservación", display: "reservación", pron: "reh-ser-bah-SYON",      en: "reservation",   phrase: { es: "Buen día, tengo una reservación a nombre de...",   pron: "bwen DEE-ah TEN-goh OO-nah reh-ser-bah-SYON ah NOM-breh deh", en: "Good day, I have a reservation under the name of..." } },
    ],
  },
  {
    id: "people", icon: "👋", title: "Meeting People", subtitle: "Conociendo Gente",
    color: C.magenta, colorL: C.magentaL, colorD: C.magentaD,
    words: [
      { es: "Hola",        display: "Hola",        pron: "OH-lah",            en: "Hello / Hi",       phrase: { es: "Hola, me llamo...",                      pron: "OH-lah meh YAH-moh",                           en: "Hello, my name is..." } },
      { es: "Soy",         display: "Soy",         pron: "SOY",               en: "I am",             phrase: { es: "Soy de...",                              pron: "SOY deh",                                      en: "I am from..." } },
      { es: "¿Y tú?",      display: "¿Y tú?",      pron: "ee TOO",            en: "And you?",         phrase: { es: "¿Y tú, cómo te llamas?",                 pron: "ee TOO KOH-moh teh YAH-mas",                   en: "And you, what is your name?" } },
      { es: "Mucho gusto", display: "Mucho gusto", pron: "MOO-choh GOOS-toh", en: "Nice to meet you", phrase: { es: "Mucho gusto conocerte.",                  pron: "MOO-choh GOOS-toh koh-noh-SER-teh",            en: "Nice to meet you." } },
      { es: "¿De dónde?",  display: "¿De dónde?",  pron: "deh DON-deh",       en: "From where?",      phrase: { es: "¿De dónde eres?",                        pron: "deh DON-deh EH-res",                           en: "Where are you from?" } },
      { es: "Vamos",       display: "Vamos",       pron: "BAH-mos",           en: "Let's go",         phrase: { es: "¿Vamos por unos tacos?",                  pron: "BAH-mos por OO-nos TAH-kos",                   en: "Shall we go get some tacos?" } },
      { es: "Quiero",      display: "Quiero",      pron: "KYEH-roh",          en: "I want",           phrase: { es: "Quiero probar unos tacos de pastor.",     pron: "KYEH-roh proh-BAR OO-nos TAH-kos deh pas-TOR", en: "I want to try some tacos al pastor." } },
      { es: "cerveza",     display: "cerveza",     pron: "ser-BEH-sah",       en: "beer",             phrase: { es: "Una cerveza bien fría, por favor.",       pron: "OO-nah ser-BEH-sah byen FREE-ah por fah-VOR",  en: "One very cold beer, please." } },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA — 8 questions per block, one per phrase
// Each question: recognition (choose) + production (speak)
// ═══════════════════════════════════════════════════════════════
const QUIZ_DATA = {
  airport: [
    { scene: "Cancún Airport — arrival", q: "You just landed and need WiFi. What do you ask?", correct: "¿Hay internet gratis en el aeropuerto?", options: ["¿Hay internet gratis en el aeropuerto?","¿Dónde está la maleta?","¿Cuánto cuesta el WiFi?","¿Hay un cajero cerca?"] },
    { scene: "Immigration area", q: "You need to find immigration. What do you ask?", correct: "¿Dónde está la zona de migración?", options: ["¿Dónde está la zona de migración?","¿Dónde está la salida?","¿Dónde recojo mi maleta?","¿Por dónde es la fila?"] },
    { scene: "Immigration — foreigner line", q: "You're not sure which line to join. What do you ask?", correct: "Perdón, ¿esta es la fila para extranjeros?", options: ["Perdón, ¿esta es la fila para extranjeros?","¿Dónde está la migración?","¿Cuál es mi asiento?","Aquí está mi pasaporte"] },
    { scene: "Immigration officer asks for your document", q: "The officer asks for your travel document. What do you say?", correct: "Hola, aquí está mi pasaporte.", options: ["Hola, aquí está mi pasaporte.","Tengo mi boleto de regreso aquí.","¿Por dónde es la salida?","Aquí está la reservación de mi hotel."] },
    { scene: "Immigration — proof of return", q: "The officer asks for proof you're leaving Mexico. What do you show?", correct: "Tengo mi boleto de regreso aquí.", options: ["Tengo mi boleto de regreso aquí.","Hola, aquí está mi pasaporte.","¿Dónde recojo mi maleta?","¿Hay internet gratis?"] },
    { scene: "Baggage claim", q: "You need to find your suitcase. What do you ask?", correct: "¿Dónde recojo mi maleta?", options: ["¿Dónde recojo mi maleta?","¿Dónde está la fila?","¿Cuánto cuesta el boleto?","¿Dónde está la migración?"] },
    { scene: "After baggage claim", q: "You need to find the way out. What do you ask?", correct: "¿Por dónde es la salida?", options: ["¿Por dónde es la salida?","¿Dónde está la maleta?","¿Hay internet gratis?","¿Dónde está la fila?"] },
    { scene: "Outside the airport", q: "You want to get a bus to Cancún. What do you ask?", correct: "¿Dónde compro el boleto de autobús ADO?", options: ["¿Dónde compro el boleto de autobús ADO?","¿Por dónde es la salida?","¿Dónde recojo mi maleta?","¿Hay un cajero cerca?"] },
  ],
  money: [
    { scene: "Just arrived — need local currency", q: "You need Mexican pesos. What do you ask?", correct: "¿Dónde puedo conseguir pesos?", options: ["¿Dónde puedo conseguir pesos?","¿Aceptan tarjeta?","¿Cuánto cuesta esto?","¿Hay un cajero cerca?"] },
    { scene: "Looking for exchange office", q: "You want to exchange your dollars. What do you ask?", correct: "¿Dónde está la casa de cambio más cercana?", options: ["¿Dónde está la casa de cambio más cercana?","¿Dónde puedo conseguir pesos?","¿Solo aceptan efectivo?","¿Me puede dar mi cambio?"] },
    { scene: "Need cash", q: "You need to find an ATM. What do you ask?", correct: "¿Hay un cajero cerca?", options: ["¿Hay un cajero cerca?","¿Dónde está la casa de cambio?","¿Aceptan tarjeta?","¿Cuánto cuesta esto?"] },
    { scene: "Market stall", q: "You want to know the price of a souvenir. What do you ask?", correct: "¿Cuánto cuesta esto?", options: ["¿Cuánto cuesta esto?","¿Me puede dar mi cambio?","¿Solo aceptan efectivo?","¿Hay un cajero cerca?"] },
    { scene: "Restaurant — end of meal", q: "You want to pay. What do you ask the waiter?", correct: "¿Me puede traer la cuenta, por favor?", options: ["¿Me puede traer la cuenta, por favor?","¿Cuánto cuesta esto?","¿Aceptan tarjeta?","¿Me puede dar mi cambio?"] },
    { scene: "Small taco stand", q: "You want to know if they take cards or cash only. What do you ask?", correct: "¿Solo aceptan efectivo?", options: ["¿Solo aceptan efectivo?","¿Aceptan tarjeta?","¿Me puede traer la cuenta?","¿Dónde está el cajero?"] },
    { scene: "Restaurant — paying", q: "You want to pay with your card. What do you ask?", correct: "¿Aceptan tarjeta?", options: ["¿Aceptan tarjeta?","¿Solo aceptan efectivo?","¿Me puede traer la cuenta?","¿Cuánto cuesta esto?"] },
    { scene: "Paying at a store", q: "The cashier owes you change. What do you ask?", correct: "¿Me puede dar mi cambio, por favor?", options: ["¿Me puede dar mi cambio, por favor?","¿Cuánto cuesta esto?","¿Aceptan tarjeta?","¿Me puede traer la cuenta?"] },
  ],
  transport: [
    { scene: "Airport — looking for ADO bus", q: "You need to find the ADO bus stop. What do you ask?", correct: "¿Dónde está la parada del autobús ADO?", options: ["¿Dónde está la parada del autobús ADO?","¿Cuál autobús va a Cancún?","¿Dónde puedo tomar un taxi?","¿Cuál es el precio?"] },
    { scene: "Bus station", q: "You need to find the right bus. What do you ask?", correct: "¿Cuál autobús va a Cancún?", options: ["¿Cuál autobús va a Cancún?","¿Dónde está la parada?","¿Cuál es el precio?","Aquí está mi boleto."] },
    { scene: "Boarding the bus", q: "The driver asks for your ticket. What do you say?", correct: "Aquí está mi boleto.", options: ["Aquí está mi boleto.","Disculpe, ese es mi asiento.","¿Cuál autobús va a Cancún?","Esta es la dirección de mi hotel."] },
    { scene: "Inside the bus — someone in your seat", q: "Someone is sitting in your seat. What do you say?", correct: "Disculpe, ese es mi asiento. Tengo el ocho.", options: ["Disculpe, ese es mi asiento. Tengo el ocho.","Aquí está mi boleto.","¿Cuál autobús va a Cancún?","¿Dónde está la parada?"] },
    { scene: "Outside the airport — need a ride", q: "You want to get a taxi. What do you ask?", correct: "¿Dónde puedo tomar un taxi?", options: ["¿Dónde puedo tomar un taxi?","¿Cuál es el precio?","¿Dónde está la parada?","Esta es la dirección de mi hotel."] },
    { scene: "Inside a taxi", q: "You show the driver where to go. What do you say?", correct: "Esta es la dirección de mi hotel.", options: ["Esta es la dirección de mi hotel.","¿Dónde puedo tomar un taxi?","¿Cuál es el precio?","Aquí está mi boleto."] },
    { scene: "Negotiating taxi fare", q: "You want to know how much it costs. What do you ask?", correct: "¿Cuál es el precio por llevarme al hostal?", options: ["¿Cuál es el precio por llevarme al hostal?","Esta es la dirección de mi hotel.","¿Dónde puedo tomar un taxi?","¿Dónde está la parada?"] },
    { scene: "Arriving at the hostel", q: "You need to check in. What do you say?", correct: "Buen día, tengo una reservación a nombre de...", options: ["Buen día, tengo una reservación a nombre de...","¿Cuál es el precio?","Esta es la dirección de mi hotel.","Aquí está mi boleto."] },
  ],
  people: [
    { scene: "Meeting someone at the hostel", q: "You want to say hello and introduce yourself. What do you say?", correct: "Hola, me llamo...", options: ["Hola, me llamo...","Mucho gusto conocerte.","¿De dónde eres?","Soy de..."] },
    { scene: "Introducing yourself", q: "You want to say where you're from. What do you say?", correct: "Soy de...", options: ["Soy de...","Hola, me llamo...","¿Y tú, cómo te llamas?","Mucho gusto conocerte."] },
    { scene: "After introducing yourself", q: "You want to ask their name. What do you say?", correct: "¿Y tú, cómo te llamas?", options: ["¿Y tú, cómo te llamas?","¿De dónde eres?","Soy de...","Mucho gusto conocerte."] },
    { scene: "After shaking hands", q: "You want to say nice to meet you. What do you say?", correct: "Mucho gusto conocerte.", options: ["Mucho gusto conocerte.","Hola, me llamo...","¿Y tú, cómo te llamas?","¿Vamos por unos tacos?"] },
    { scene: "Getting to know someone", q: "You want to ask where they're from. What do you ask?", correct: "¿De dónde eres?", options: ["¿De dónde eres?","¿Y tú, cómo te llamas?","Soy de...","Mucho gusto conocerte."] },
    { scene: "Hungry after a long day", q: "You want to suggest going for tacos. What do you say?", correct: "¿Vamos por unos tacos?", options: ["¿Vamos por unos tacos?","Quiero probar unos tacos de pastor.","Una cerveza bien fría, por favor.","¿De dónde eres?"] },
    { scene: "At the taquería", q: "You want to order tacos al pastor. What do you say?", correct: "Quiero probar unos tacos de pastor.", options: ["Quiero probar unos tacos de pastor.","¿Vamos por unos tacos?","Una cerveza bien fría, por favor.","Mucho gusto conocerte."] },
    { scene: "At the taquería — ordering a drink", q: "You want a cold beer. What do you say?", correct: "Una cerveza bien fría, por favor.", options: ["Una cerveza bien fría, por favor.","Quiero probar unos tacos de pastor.","¿Vamos por unos tacos?","Soy de..."] },
  ],
};

// ═══════════════════════════════════════════════════════════════
// SLIDE MAP
// 0  = Onboarding
// 1  = Video
// 2  = Story
// 3  = Pronounce Airport    4  = Memorama Airport   5  = Quiz Airport   6  = Survey Airport
// 7  = Pronounce Money      8  = Memorama Money     9  = Quiz Money     10 = Survey Money
// 11 = Pronounce Transport  12 = Memorama Transport 13 = Quiz Transport 14 = Survey Transport
// 15 = Pronounce People     16 = Memorama People    17 = Quiz People    18 = Survey People
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
  const speak = useCallback((text, onWordBoundary) => {
    if (!synth.current) return;
    synth.current.cancel(); setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX"; u.rate = 0.78; u.pitch = 1.05;
    const voices = synth.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("es-MX")) || voices.find(v => v.lang.startsWith("es"));
    if (v) u.voice = v;
    if (onWordBoundary) {
      u.onboundary = (e) => { if (e.name === "word") onWordBoundary(e.charIndex, e.charLength); };
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
// KARAOKE TEXT — highlights word being spoken
// ═══════════════════════════════════════════════════════════════
function KaraokeText({ text, charIndex, charLength, color }) {
  if (charIndex < 0) {
    return <span style={{ fontSize: "clamp(16px,3.5vw,20px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>{text}</span>;
  }
  const before = text.slice(0, charIndex);
  const current = text.slice(charIndex, charIndex + charLength);
  const after = text.slice(charIndex + charLength);
  return (
    <span style={{ fontSize: "clamp(16px,3.5vw,20px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>
      {before}
      <span style={{ background: color, color: "#fff", borderRadius: 4, padding: "0 2px" }}>{current}</span>
      {after}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRON EXERCISE
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
        <button type="button" onClick={onListenPress}
          style={{ flex: 1, background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, touchAction: "manipulation" }}>
          <span style={{ fontSize: 24 }}>♪</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.azulD }}>Listen</span>
        </button>
        <button type="button" onClick={handleMic}
          style={{ flex: 2, border: "none", borderRadius: 14, padding: "14px 12px", cursor: "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: listening ? C.magenta : canAdvance && result !== "retry" ? C.limon : color, transition: "all 0.2s", touchAction: "manipulation" }}>
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
        <button type="button" onClick={onPass}
          style={{ ...btn(result === "perfect" ? C.limon : color, { width: "100%", fontSize: 14, padding: "13px", borderRadius: 12 }), touchAction: "manipulation" }}>
          {passLabel}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXERCISE SLIDE — word + phrase with karaoke highlighting
// ═══════════════════════════════════════════════════════════════
function ExerciseSlide({ sectionIndex, speak, onComplete, onBackRequest }) {
  const sec = SECTIONS[sectionIndex];
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("word");
  const [done, setDone] = useState(false);
  const [karaokeIdx, setKaraokeIdx] = useState(-1);
  const [karaokeLen, setKaraokeLen] = useState(0);

  useEffect(() => { setWordIdx(0); setPhase("word"); setDone(false); }, [sectionIndex]);

  useEffect(() => {
    if (onBackRequest) {
      onBackRequest.current = () => {
        if (phase === "phrase") { setPhase("word"); setKaraokeIdx(-1); return true; }
        if (phase === "word" && wordIdx > 0) { setWordIdx(wordIdx - 1); setPhase("phrase"); setKaraokeIdx(-1); return true; }
        return false;
      };
    }
  }, [phase, wordIdx, onBackRequest]);

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, letterSpacing: -0.5, marginBottom: 8 }}>Section complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 32 }}>Great work on <strong>{sec.title}</strong>!</div>
      <button type="button" onClick={onComplete} style={{ ...btn(sec.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 }), touchAction: "manipulation" }}>Continue →</button>
    </div>
  );

  const word = sec.words[wordIdx];

  function handleWordPass() { setPhase("phrase"); setKaraokeIdx(-1); }
  function handlePhrasePass() {
    setKaraokeIdx(-1);
    if (wordIdx + 1 < sec.words.length) { setWordIdx(wordIdx + 1); setPhase("word"); }
    else { setDone(true); onComplete(); }
  }

  function handleListenPhrase() {
    setKaraokeIdx(0); setKaraokeLen(0);
    speak(word.phrase.es, (ci, cl) => { setKaraokeIdx(ci); setKaraokeLen(cl); });
  }

  const cardStyle = (bg, borderColor) => ({
    background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center",
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "14px 16px", background: sec.colorL, borderRadius: 16, border: `1.5px solid ${sec.color}20` }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, color: "#fff" }}>{sec.icon}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.textH }}>Speaking Practice</div>
          <div style={{ fontSize: 11, color: sec.colorD, fontWeight: 700 }}>{sec.title} · Word {wordIdx + 1} of {sec.words.length}</div>
        </div>
      </div>
      <div style={{ height: 4, background: C.grisB, borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(wordIdx / sec.words.length) * 100}%`, background: sec.color, borderRadius: 2, transition: "width 0.4s" }} />
      </div>

      {/* WORD BLOCK */}
      <div style={cardStyle(sec.colorL, `${sec.color}30`)}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: sec.colorD, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Word</div>
        <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 900, color: C.textH, letterSpacing: -0.3, marginBottom: 8 }}>{word.display}</div>
        <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 12, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.pron}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 600 }}>{word.en}</div>
      </div>

      {phase === "word" && (
        <PronExercise
          key={`word-${sectionIndex}-${wordIdx}`}
          answer={word.es}
          onListenPress={() => speak(word.display)}
          onPass={handleWordPass}
          color={sec.color}
          passLabel="Now practice the phrase →"
        />
      )}

      {/* PHRASE BLOCK — with karaoke */}
      {phase === "phrase" && (
        <>
          <div style={cardStyle(C.grisS, C.grisB)}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.textM, fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>Used in a phrase</div>
            <div style={{ marginBottom: 8, lineHeight: 1.4 }}>
              <KaraokeText text={word.phrase.es} charIndex={karaokeIdx} charLength={karaokeLen} color={sec.color} />
            </div>
            <div style={{ display: "inline-block", background: C.azulL, border: `1.5px solid ${C.azul}40`, borderRadius: 8, padding: "3px 12px", fontSize: 12, color: C.azulD, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6 }}>◉ {word.phrase.pron}</div>
            <div style={{ fontSize: 14, color: C.textS, fontWeight: 600 }}>{word.phrase.en}</div>
          </div>

          <PronExercise
            key={`phrase-${sectionIndex}-${wordIdx}`}
            answer={word.phrase.es}
            onListenPress={handleListenPhrase}
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
      <div style={{ fontSize: 26, fontWeight: 900, color: C.textH, marginBottom: 8 }}>Memorama Complete!</div>
      <div style={{ fontSize: 15, color: C.textS, fontWeight: 500, marginBottom: 8 }}>You matched all {pairs.length} pairs in <strong style={{ color: section.color }}>{moves} moves</strong></div>
      <div style={{ fontSize: 13, color: C.textM, marginBottom: 32 }}>{moves <= pairs.length + 2 ? "Excellent memory!" : moves <= pairs.length + 5 ? "Good job!" : "Keep practicing!"}</div>
      <button type="button" onClick={onComplete} style={{ ...btn(section.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 }), touchAction: "manipulation" }}>Continue →</button>
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
            <div key={card.id} onClick={() => flip(card)}
              style={{ height: 84, borderRadius: 14, cursor: isM ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 6px", background: isM ? section.colorL : show ? (card.type === "es" ? C.turquesaL : C.magentaL) : C.grisS, border: `1.5px solid ${isM ? section.color + "60" : show ? (card.type === "es" ? C.turquesa : C.magenta) + "50" : C.grisB}`, transform: show ? "scale(1.03)" : "scale(1)", touchAction: "manipulation" }}>
              {show ? (
                <div>
                  {isM && <div style={{ fontSize: 13, marginBottom: 2, color: section.colorD }}>✓</div>}
                  <div style={{ fontSize: "clamp(10px,2.2vw,12px)", fontWeight: 800, color: isM ? section.colorD : card.type === "es" ? C.turquesaD : C.magentaD, lineHeight: 1.3 }}>{card.word}</div>
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
// SECTION QUIZ — recognition + production (8 questions per block)
// ═══════════════════════════════════════════════════════════════
function SectionQuiz({ section, speak, onComplete }) {
  const questions = QUIZ_DATA[section.id];
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRec();
  const [pronResult, setPronResult] = useState(null);
  const [pronAttempts, setPronAttempts] = useState(0);

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
    if (idx + 1 >= questions.length) { setDone(true); return; }
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
        <div style={{ fontSize: "clamp(48px,12vw,64px)", fontWeight: 900, color: section.color, lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>{score}/{questions.length}</div>
        <div style={{ fontSize: 20, color: C.textH, fontWeight: 800, marginBottom: 8 }}>{pct >= 75 ? "Excellent!" : pct >= 50 ? "Well done!" : "Keep going!"}</div>
        <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>{pct >= 75 ? `You really know your ${section.title} phrases!` : "Practice makes perfect — you've got this."}</div>
        <button type="button" onClick={onComplete} style={{ ...btn(section.color, { fontSize: 16, padding: "15px 36px", borderRadius: 50 }), touchAction: "manipulation" }}>Continue →</button>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = sel === q.correct;
  const canAdvancePron = pronResult === "perfect" || pronResult === "good" || pronAttempts >= 2;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "16px 18px", background: section.colorL, borderRadius: 16, border: `1.5px solid ${section.color}20` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "#fff", fontWeight: 900 }}>?</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.textH }}>Quick Quiz</div>
          <div style={{ fontSize: 12, color: section.colorD, fontWeight: 700 }}>{section.title} · Question {idx + 1} of {questions.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 6, background: C.grisS, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / questions.length) * 100}%`, background: `linear-gradient(90deg,${section.color},${section.colorD})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textM, fontWeight: 700, marginBottom: 20 }}>
        <span>{idx + 1} / {questions.length}</span>
        <span style={{ color: section.color, fontWeight: 900 }}>Score: {score}</span>
      </div>

      {/* Scene */}
      <div style={{ background: C.azulL, border: `1.5px solid ${C.azul}30`, borderLeft: `5px solid ${C.azul}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.azulD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{q.scene}</div>
        <div style={{ fontSize: "clamp(14px,3vw,17px)", color: C.textH, lineHeight: 1.65, fontWeight: 700 }}>{q.q}</div>
      </div>

      {/* OPTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          const isC = opt === q.correct, isS = opt === sel;
          let bg = "#fff", border = C.grisB, tc = C.textB, fw = 600;
          if (sel !== null) {
            if (isC) { bg = C.limonL; border = C.limon; tc = C.limonD; fw = 800; }
            else if (isS) { bg = C.rojoL; border = C.rojo; tc = C.rojo; fw = 700; }
          }
          return (
            <button type="button" key={i} onClick={() => select(opt)}
              style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "14px 16px", textAlign: "left", cursor: sel !== null ? "default" : "pointer", color: tc, fontSize: 14, fontWeight: fw, transition: "all 0.18s", display: "flex", alignItems: "center", gap: 12, touchAction: "manipulation" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: sel !== null && isC ? C.limon : isS && !isC ? C.rojo : C.grisS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: sel !== null && (isC || (isS && !isC)) ? "#fff" : C.textM }}>
                {sel !== null && isC ? "✓" : isS && !isC ? "✗" : ["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* FEEDBACK + MIC — aparece después de seleccionar */}
      {sel !== null && (
        <>
          {/* Mensaje de resultado */}
          <div style={{ background: isCorrect ? C.limonL : C.rojoL, border: `1.5px solid ${isCorrect ? C.limon+"60" : C.rojo+"60"}`, borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: isCorrect ? C.limonD : C.rojo, marginBottom: 8 }}>
              {isCorrect ? "✓ Correct! Now say it out loud:" : "✗ Not quite! The correct phrase is:"}
            </div>
            <div style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 900, color: C.textH, lineHeight: 1.3 }}>
              "{q.correct}"
            </div>
          </div>

          {/* Botón micrófono */}
          <button type="button" onClick={handleMic}
            style={{ ...btn(listening ? C.magenta : pronResult === "perfect" || pronResult === "good" ? C.limon : section.color, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 50 }), touchAction: "manipulation", marginBottom: 12 }}>
            {listening ? "⏹  Listening…" : pronResult ? "◉  Try again" : "◉  Tap to speak"}
          </button>

          {/* Onda de audio */}
          {listening && (
            <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", height: 28, marginBottom: 10 }}>
              {[2,4,6,8,6,4,2,4,6,8,6,4,2].map((h, i) => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: C.magenta, height: h * 2.5, animation: `wave ${0.3 + (i % 3) * 0.15}s ease-in-out infinite alternate` }} />
              ))}
            </div>
          )}

          {/* Resultado pronunciación */}
          {pronResult && transcript && (
            <div style={{ background: pronResult === "perfect" ? C.limonL : pronResult === "good" ? C.azulL : C.rojoL, border: `1.5px solid ${pronResult === "perfect" ? C.limon : pronResult === "good" ? C.azul : C.rojo}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: pronResult === "perfect" ? C.limonD : pronResult === "good" ? C.azulD : C.rojo, marginBottom: 4 }}>
                {pronResult === "perfect" ? "Perfect!" : pronResult === "good" ? "Good job!" : "Try again!"}
              </div>
              <div style={{ fontSize: 12, color: C.textS }}>
                {pronResult === "retry" && <>I heard: <strong>"{transcript}"</strong></>}
                {pronResult === "perfect" && "Native speakers will understand you!"}
                {pronResult === "good" && "Good pronunciation!"}
              </div>
            </div>
          )}

          {!supported && (
            <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: C.textS }}>
              Voice recognition works best in Chrome.
            </div>
          )}

          {/* Next button — aparece después de intentar */}
          {(canAdvancePron || !supported) && (
            <button type="button" onClick={nextQuestion}
              style={{ ...btn(pronResult === "perfect" ? C.limon : section.color, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 50 }), touchAction: "manipulation" }}>
              {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════
// BLOCK SURVEY — with email field
// ═══════════════════════════════════════════════════════════════
function BlockSurvey({ section, blockNumber, onComplete }) {
  const [answers, setAnswers] = useState({ email: "", continueNext: 0, pronunciation: 0, memorama: 0, instructions: 0, voiceRecognition: "", comments: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nextLabel = blockNumber < 4 ? `Block ${blockNumber + 1}` : "Lesson Complete";

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch(SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...answers, block: section.id }) });
      // 🎯 GA EVENT 4 — survey_submit
      if (typeof window.gtag === "function") {
        window.gtag("event", "survey_submit", {
          block: section.id,
          block_number: blockNumber,
          has_email: answers.email.trim() !== "",
        });
      }
    } catch(e) { console.log("Submit error:", e); }
    setSubmitted(true); setSubmitting(false);
  }

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.textH, marginBottom: 12 }}>Thank you!</div>
      <div style={{ fontSize: 14, color: C.textS, fontWeight: 500, lineHeight: 1.7, marginBottom: 32 }}>Your feedback goes directly to the course creator.</div>
      <button type="button" onClick={onComplete} style={{ ...btn(section.color, { fontSize: 16, padding: "15px 40px", borderRadius: 14 }), touchAction: "manipulation" }}>Continue to {nextLabel} →</button>
    </div>
  );

  function ScoreRow({ label, field }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 10 }}>{label}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button type="button" key={n} onClick={() => setAnswers(p => ({ ...p, [field]: n }))}
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
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#fff", fontWeight: 800, textTransform: "uppercase", opacity: 0.8, marginBottom: 8 }}>Block {blockNumber} Complete — {section.title}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>You're one of our first testers!</div>
        <div style={{ fontSize: 13, color: "#fff", opacity: 0.9, lineHeight: 1.6 }}>Chat in Spanish is in development. Your feedback shapes the final product. 2 minutes — every answer counts.</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textH, marginBottom: 6 }}>Your email <span style={{ fontSize: 12, color: C.textM, fontWeight: 500 }}>(optional)</span></div>
        <div style={{ fontSize: 12, color: C.textS, fontWeight: 500, marginBottom: 10 }}>We'll notify you when the full course is ready — and send you a special launch discount.</div>
        <input type="email" value={answers.email} onChange={e => setAnswers(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.grisB}`, fontSize: 16, color: C.textH, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none", background: C.grisS, boxSizing: "border-box" }} />
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
      <button type="button" onClick={handleSubmit} disabled={!allDone || submitting}
        style={{ ...btn(allDone ? section.color : C.grisB, { width: "100%", fontSize: 16, padding: "16px", borderRadius: 50 }), opacity: allDone ? 1 : 0.5, cursor: allDone ? "pointer" : "not-allowed", touchAction: "manipulation" }}>
        {submitting ? "Sending..." : "Submit Feedback →"}
      </button>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.textM }}>Thank you — your response goes directly to the course creator.</div>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button type="button" onClick={onComplete} style={{ background: "none", border: "none", color: C.textM, fontSize: 13, cursor: "pointer", textDecoration: "underline", touchAction: "manipulation" }}>Skip survey</button>
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
        You've learned 32 words, practiced pronunciation with real phrases, and completed 32 quiz questions. Great work!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, maxWidth: 400, margin: "0 auto 40px" }}>
        {[
          { label: "Words learned",      value: "32",   color: C.turquesa },
          { label: "Phrases practiced",  value: "32",   color: C.magenta },
          { label: "Quiz questions",     value: "32",   color: C.azul },
          { label: "Lesson",             value: "1/60", color: C.limonD },
        ].map((s, i) => (
          <div key={i} style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textS, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onBack} style={{ ...btn(C.magenta, { fontSize: 16, padding: "16px 40px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` }), touchAction: "manipulation" }}>
        Back to Home →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LESSON COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Lesson1({ onBack, initialSlide = 0, onSlideChange, onComplete }) {
  const { speak } = useTTS();
  const [slide, setSlide] = useState(initialSlide);
  const [maxUnlocked, setMaxUnlocked] = useState(Math.max(1, initialSlide));
  const exerciseBackRef = useRef(null);

  function isPronSlide()   { return [3,7,11,15].includes(slide); }
  function isMemoSlide()   { return [4,8,12,16].includes(slide); }
  function isQuizSlide()   { return [5,9,13,17].includes(slide); }
  function isSurveySlide() { return [6,10,14,18].includes(slide); }
  function sectionIdx() {
    if ([3,4,5,6].includes(slide))     return 0;
    if ([7,8,9,10].includes(slide))    return 1;
    if ([11,12,13,14].includes(slide)) return 2;
    if ([15,16,17,18].includes(slide)) return 3;
    return 0;
  }
  function blockNumber() { return sectionIdx() + 1; }

  const accentColor =
    isPronSlide() || isMemoSlide() || isQuizSlide() || isSurveySlide()
      ? SECTIONS[sectionIdx()].color : C.turquesa;

  function goTo(n) { if (n < 0 || n >= TOTAL || n > maxUnlocked) return; setSlide(n); if (onSlideChange) onSlideChange(n); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function unlock(n) { setMaxUnlocked(prev => Math.max(prev, n)); }
  function advance() { const next = slide + 1; unlock(next); goTo(next); }

  function handleBack() {
    if (isPronSlide() && exerciseBackRef.current) {
      const handled = exerciseBackRef.current();
      if (handled) return;
    }
    if (slide === 0) { onBack(); return; }
    goTo(slide - 1);
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.grisB}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleBack}>
              <ChatLogo size={32} bg={C.magenta} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.negro, letterSpacing: -0.5, lineHeight: 1 }}>Chat in Spanish</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.textM, fontWeight: 700, textTransform: "uppercase" }}>Lesson 1 · Cancún</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: accentColor, fontWeight: 900 }}>{slide + 1} / {TOTAL}</span>
              <button type="button" onClick={handleBack}
                style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontSize: 13, fontWeight: 700, touchAction: "manipulation" }}>← Back</button>
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
  <div style={{ textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><ChatLogo size={80} bg={C.magenta} /></div>
    <h2 style={{ fontSize: "clamp(26px,6vw,34px)", fontWeight: 900, color: C.textH, letterSpacing: -1, marginBottom: 12 }}>Lesson 1 — Cancún</h2>
    <p style={{ fontSize: 15, color: C.textS, lineHeight: 1.75, fontWeight: 500, marginBottom: 28 }}>Here's what you'll do in this lesson:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                { num: "01", color: C.turquesa, title: "Watch",    desc: "A travel video of Cancún to get you inspired." },
                { num: "02", color: C.magenta,  title: "Story",    desc: "You just landed at Cancún airport. Your journey begins." },
                { num: "03", color: C.azul,     title: "Speak",    desc: "32 words across 4 topics — listen, repeat, get graded." },
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
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, fontSize: 13, color: C.turquesaD, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>◉</span>Allow microphone access when prompted. Works best in Chrome.
            </div>
            <button type="button" onClick={() => { unlock(1); goTo(1); }}
  style={{ ...btn(C.magenta, { fontSize: 17, padding: "16px 44px", borderRadius: 50, boxShadow: `0 6px 24px ${C.magenta}40` }), touchAction: "manipulation", display: "inline-block" }}>
  Let's Start! →
</button>
          </div>
        )}

        {/* SLIDE 1 — VIDEO */}
        {slide === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.turquesa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, color: "#fff", fontWeight: 900 }}>▶</div>
              <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: C.textH, letterSpacing: -0.5, lineHeight: 1.1 }}>Welcome to Cancún</div>
            </div>
            <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>
              We picked this video to give you a feel for Cancún before your first lesson.
            </p>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 20, marginBottom: 20, boxShadow: `0 8px 32px ${C.turquesa}25` }}>
              <iframe src="https://www.youtube.com/embed/FWEXKQ0BXIU" title="Cancún travel guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 20 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={advance}
onPointerDown={(e) => { e.preventDefault(); advance(); }}
                style={{ ...btn(C.magenta, { fontSize: 16, padding: "14px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
                Continue →
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
                It's 2:47 PM. Your plane just touched down at <strong style={{ color: C.textH }}>Cancún International Airport — CUN</strong>. Through the window: palm trees, a sunny day, a sign reading <strong style={{ color: C.turquesa }}>"BIENVENIDOS A MÉXICO."</strong> Your heart races. First challenge: immigration, baggage, your ADO bus ticket — all in Spanish.
              </p>
            </div>
            <div style={{ background: C.turquesaL, border: `1.5px solid ${C.turquesa}30`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.turquesaD, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>What you'll learn in this lesson</div>
              {[
                "Airport — internet, migration, passport, ADO bus",
                "Money — pesos, ATM, cash, card, change",
                "Transport — bus stop, seat, taxi, address",
                "Meeting people — greetings, tacos, making friends",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: C.turquesa, fontWeight: 900, fontSize: 14 }}>→</span>
                  <span style={{ fontSize: 13, color: C.textB, fontWeight: 500 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPronSlide() && <ExerciseSlide key={slide} sectionIndex={sectionIdx()} speak={speak} onComplete={advance} onBackRequest={exerciseBackRef} />}
        {isMemoSlide() && (() => { const sec = SECTIONS[sectionIdx()]; return <Memorama key={slide} section={sec} speak={speak} onComplete={advance} />; })()}
        {isQuizSlide() && <SectionQuiz key={slide} section={SECTIONS[sectionIdx()]} speak={speak} onComplete={advance} />}
        {isSurveySlide() && <BlockSurvey key={slide} section={SECTIONS[sectionIdx()]} blockNumber={blockNumber()} onComplete={advance} />}
        {slide === 19 && <CompletedSlide onBack={onComplete || onBack} />}

      </div>

      {/* BOTTOM NAV — story slide only */}
      {slide === 2 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.grisB}`, padding: "14px 20px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={advance}
              onPointerDown={(e) => { e.preventDefault(); advance(); }}
              style={{ ...btn(C.turquesa, { fontSize: 16, padding: "14px 40px", borderRadius: 50 }), touchAction: "manipulation" }}>
              Start →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
