import { useState, useEffect } from "react";
import { GLOBAL_CSS, C, btn } from "./tokens";
import { Header, ChromeModal } from "./components/LandingPage";
import LandingPage from "./components/LandingPage";
import Lesson1 from "./lessons/Lesson1";
import { FinalQuiz } from "./lessons/Lesson1";

// ═══════════════════════════════════════════════════════════════
// WELCOME BACK MODAL
// ═══════════════════════════════════════════════════════════════
function WelcomeBackModal({ slide, total, onContinue, onRestart }) {
  const pct = Math.round((slide / total) * 100);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.blanco, borderRadius: 20, padding: "36px 32px", maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: C.negro, marginBottom: 12 }}>Welcome back!</h3>
        <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 20 }}>
          You were on slide <strong style={{ color: C.magenta }}>{slide} of {total}</strong> last time.
        </p>
        <div style={{ height: 8, background: C.grisB, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.turquesa},${C.magenta})`, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            onClick={onContinue}
            onPointerDown={(e) => { e.preventDefault(); onContinue(); }}
            style={{ ...btn(C.magenta, { fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
            Continue where I left off →
          </button>
          <button
            type="button"
            onClick={onRestart}
            onPointerDown={(e) => { e.preventDefault(); onRestart(); }}
            style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "13px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, touchAction: "manipulation" }}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN PROMPT MODAL
// ═══════════════════════════════════════════════════════════════
function HomeScreenModal({ onClose }) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.blanco, borderRadius: 20, padding: "32px 24px", maxWidth: 440, width: "100%", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📱</div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: C.negro, marginBottom: 8 }}>Get quick access!</h3>
        <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, marginBottom: 20 }}>
          Add Chat in Spanish to your home screen so you can find it instantly.
        </p>
        {isIOS ? (
          <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 13, color: C.textB, fontWeight: 600, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 6 }}>1. Tap the <strong>Share</strong> button at the bottom of your browser</div>
              <div>2. Tap <strong>"Add to Home Screen"</strong></div>
            </div>
          </div>
        ) : (
          <div style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 13, color: C.textB, fontWeight: 600, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 6 }}>1. Tap the <strong>menu (⋮)</strong> at the top right of Chrome</div>
              <div>2. Tap <strong>"Add to Home Screen"</strong></div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          onPointerDown={(e) => { e.preventDefault(); onClose(); }}
          style={{ ...btn(C.negro, { width: "100%", fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
          Got it →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GA HELPER
// ═══════════════════════════════════════════════════════════════
function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const testQuiz2 = urlParams.get('test') === 'quiz2';
  const [view, setView] = useState("landing");
  const [showChromeModal, setShowChromeModal] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showHomeScreen, setShowHomeScreen] = useState(false);
  const [savedSlide, setSavedSlide] = useState(0);
  const [startSlide, setStartSlide] = useState(0);
  const [landingKey, setLandingKey] = useState(0);

  const LESSON_TOTAL = 8;

  useEffect(() => {
    const saved = localStorage.getItem("cis_lesson1_slide");
    if (saved && parseInt(saved) > 0) {
      setSavedSlide(parseInt(saved));
    }
  }, []);

  function hasSeenHomeScreenPrompt() {
    return localStorage.getItem("cis_home_prompt") === "true";
  }

  function markHomeScreenPromptSeen() {
    localStorage.setItem("cis_home_prompt", "true");
  }

  function isSafariIOS() {
    const ua = navigator.userAgent;
    return (
      /iPad|iPhone|iPod/.test(ua) &&
      /Safari/.test(ua) &&
      !/Chrome/.test(ua) &&
      !/CriOS/.test(ua)
    );
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function handleStartFree() {
    if (isMobile() && !hasSeenHomeScreenPrompt()) {
      setShowHomeScreen(true);
      return;
    }
    if (isSafariIOS()) {
      setShowChromeModal(true);
      return;
    }
    if (savedSlide > 0) {
      setShowWelcomeBack(true);
      return;
    }
    goToLesson(0);
  }

  function handleHomeScreenClose() {
    markHomeScreenPromptSeen();
    setShowHomeScreen(false);
    if (isSafariIOS()) {
      setShowChromeModal(true);
    } else if (savedSlide > 0) {
      setShowWelcomeBack(true);
    } else {
      goToLesson(0);
    }
  }

  function goToLesson(slide = 0) {
    setStartSlide(slide);
    setView("lesson1");
    trackEvent("lesson_start", { lesson: "lesson_1", slide_from: slide });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToLanding() {
    setLandingKey(k => k + 1);
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSlideChange(slide) {
    localStorage.setItem("cis_lesson1_slide", slide.toString());
    setSavedSlide(slide);
    trackEvent("slide_change", { lesson: "lesson_1", slide_number: slide });
  }

  function handleLessonComplete() {
    localStorage.removeItem("cis_lesson1_slide");
    setSavedSlide(0);
    trackEvent("lesson_complete", { lesson: "lesson_1" });
    goToLanding();
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {showHomeScreen && (
        <HomeScreenModal onClose={handleHomeScreenClose} />
      )}

      {showChromeModal && (
        <ChromeModal
          onContinue={() => {
            setShowChromeModal(false);
            if (savedSlide > 0) setShowWelcomeBack(true);
            else goToLesson(0);
          }}
          onClose={() => setShowChromeModal(false)}
        />
      )}

      {showWelcomeBack && (
        <WelcomeBackModal
          slide={savedSlide}
          total={LESSON_TOTAL}
          onContinue={() => {
            setShowWelcomeBack(false);
            goToLesson(savedSlide);
          }}
          onRestart={() => {
            localStorage.removeItem("cis_lesson1_slide");
            setSavedSlide(0);
            setShowWelcomeBack(false);
            goToLesson(0);
          }}
        />
      )}

      {testQuiz2 && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
          <FinalQuiz speak={() => {}} onComplete={() => alert("Quiz complete!")} />
        </div>
      )}

      {!testQuiz2 && view === "landing" && (
        <>
          <Header key={landingKey} onStartFree={handleStartFree} />
          <LandingPage onStartFree={handleStartFree} />
        </>
      )}

      {view === "lesson1" && (
        <Lesson1
          onBack={goToLanding}
          initialSlide={startSlide}
          onSlideChange={handleSlideChange}
          onComplete={handleLessonComplete}
        />
      )}
    </>
  );
}
