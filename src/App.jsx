import { useState, useEffect } from "react";
import { GLOBAL_CSS, C, btn } from "./tokens";
import { Header, ChromeModal } from "./components/LandingPage";
import LandingPage from "./components/LandingPage";
import Lesson1 from "./lessons/Lesson1";
import { FinalQuiz } from "./lessons/Lesson1";
import AuthScreen from "./components/AuthScreen";
import Lesson2 from "./lessons/Lesson2";
import Lesson3 from "./lessons/Lesson3";
import Lesson4 from "./lessons/Lesson4";
import Dashboard from "./components/Dashboard";
import { supabase } from "./supabase";
import ChatLogo from "./components/ChatLogo";

// ═══════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════
function LoadingScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <ChatLogo size={72} bg={C.turquesa} />
      <div style={{ marginTop: 24, display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: C.turquesa,
            animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

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
          <button type="button" onClick={onContinue} onPointerDown={(e) => { e.preventDefault(); onContinue(); }}
            style={{ ...btn(C.magenta, { fontSize: 15, padding: "14px", borderRadius: 12 }), touchAction: "manipulation" }}>
            Continue where I left off →
          </button>
          <button type="button" onClick={onRestart} onPointerDown={(e) => { e.preventDefault(); onRestart(); }}
            style={{ background: C.grisS, border: `1.5px solid ${C.grisB}`, color: C.textS, padding: "13px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, touchAction: "manipulation" }}>
            Start over
          </button>
        </div>
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
  const testAuth  = urlParams.get('test') === 'auth';
  const [view, setView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [showChromeModal, setShowChromeModal] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [savedSlide, setSavedSlide] = useState(0);
  const [startSlide, setStartSlide] = useState(0);
  const [landingKey, setLandingKey] = useState(0);
  const [userId, setUserId] = useState(null);
  const [lesson2Slide, setLesson2Slide] = useState(0);
  const [lesson3Slide, setLesson3Slide] = useState(0);
  const [lesson4Slide, setLesson4Slide] = useState(0);
  const [lesson1Completed, setLesson1Completed] = useState(false);
  const [lesson2Completed, setLesson2Completed] = useState(false);
  const [lesson3Completed, setLesson3Completed] = useState(false);

  const LESSON1_TOTAL = 7;

  async function saveLesson1Progress(uid) {
    await supabase.from("progress").upsert(
      { user_id: uid, lesson_number: 1, completed: true, slide: 6 },
      { onConflict: "user_id,lesson_number" }
    );
  }

  async function restoreUserProgress(uid) {
    const { data } = await supabase
      .from("progress")
      .select("lesson_number, completed, slide")
      .eq("user_id", uid)
      .order("lesson_number", { ascending: false });

    if (!data || data.length === 0) {
      setView("lesson2");
      return;
    }

    const l1 = data.find(r => r.lesson_number === 1);
    const l2 = data.find(r => r.lesson_number === 2);
    const l3 = data.find(r => r.lesson_number === 3);
    if (l1?.completed) setLesson1Completed(true);
    if (l2?.completed) setLesson2Completed(true);
    if (l3?.completed) setLesson3Completed(true);

    const incomplete = data.find(r => !r.completed);
    const highestCompleted = data.find(r => r.completed);

    if (incomplete) {
      const lessonNum = incomplete.lesson_number;
      const slide = incomplete.slide || 0;
      if (lessonNum === 2) { setLesson2Slide(slide); setView("lesson2"); }
      else if (lessonNum === 3) { setLesson3Slide(slide); setView("lesson3"); }
      else if (lessonNum === 4) { setLesson4Slide(slide); setView("lesson4"); }
      else { setView("lesson2"); }
    } else if (highestCompleted) {
      const next = highestCompleted.lesson_number + 1;
      if (next === 3) { setView("lesson3"); }
      else if (next === 4) { setView("lesson4"); }
      else { goToLanding(); }
    } else {
      setView("lesson2");
    }
  }

  // ─── DETECTAR SESIÓN ────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        await saveLesson1Progress(session.user.id);
        await restoreUserProgress(session.user.id);
        trackEvent("auth_complete", { method: "magic_link" });
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        await restoreUserProgress(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cis_lesson1_slide");
    if (saved && parseInt(saved) > 0) setSavedSlide(parseInt(saved));
  }, []);

  function isSafariIOS() {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua);
  }

  function handleStartFree() {
    if (isSafariIOS()) { setShowChromeModal(true); return; }
    if (savedSlide > 0) { setShowWelcomeBack(true); return; }
    goToLesson(0);
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
    setView("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLesson2SlideChange(slide) {
    setLesson2Slide(slide);
    trackEvent("slide_change", { lesson: "lesson_2", slide_number: slide });
  }

  function handleLesson2Complete() {
    setLesson2Completed(true);
    trackEvent("lesson_complete", { lesson: "lesson_2" });
    setView("lesson3");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLesson2Back() { setView("dashboard"); }

  function handleLesson3SlideChange(slide) {
    setLesson3Slide(slide);
    trackEvent("slide_change", { lesson: "lesson_3", slide_number: slide });
  }

  function handleLesson3Complete() {
    setLesson3Completed(true);
    trackEvent("lesson_complete", { lesson: "lesson_3" });
    setView("lesson4");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLesson3Back() { setView("dashboard"); }

  function handleLesson4SlideChange(slide) {
    setLesson4Slide(slide);
    trackEvent("slide_change", { lesson: "lesson_4", slide_number: slide });
  }

  function handleLesson4Complete() {
    trackEvent("lesson_complete", { lesson: "lesson_4" });
    goToLanding();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLesson4Back() { setView("dashboard"); }

  function getCurrentLesson() {
    if (!lesson2Completed) return 2;
    if (!lesson3Completed) return 3;
    return 4;
  }

  function getCompletedLessons() {
    const completed = [];
    if (lesson1Completed) completed.push(1);
    if (lesson2Completed) completed.push(2);
    if (lesson3Completed) completed.push(3);
    return completed;
  }

  // ─── LOADING SCREEN ─────────────────────────────────────────
  if (loading && !testQuiz2 && !testAuth) return <LoadingScreen />;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

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
          total={LESSON1_TOTAL}
          onContinue={() => { setShowWelcomeBack(false); goToLesson(savedSlide); }}
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

      {testAuth && (
        <AuthScreen onSuccess={() => alert("Auth complete! User registered.")} />
      )}

      {!testQuiz2 && !testAuth && view === "landing" && (
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

      {view === "auth" && (
        <AuthScreen onSuccess={() => restoreUserProgress(userId)} />
      )}

      {view === "dashboard" && (
        <Dashboard
          completedLessons={getCompletedLessons()}
          currentLesson={getCurrentLesson()}
        />
      )}

      {view === "lesson2" && (
        <Lesson2
          onBack={handleLesson2Back}
          initialSlide={lesson2Slide}
          onSlideChange={handleLesson2SlideChange}
          onComplete={handleLesson2Complete}
          userId={userId}
          lesson1Completed={lesson1Completed}
        />
      )}

      {view === "lesson3" && (
        <Lesson3
          onBack={handleLesson3Back}
          initialSlide={lesson3Slide}
          onSlideChange={handleLesson3SlideChange}
          onComplete={handleLesson3Complete}
          userId={userId}
          lesson2Completed={lesson2Completed}
        />
      )}

      {view === "lesson4" && (
        <Lesson4
          onBack={handleLesson4Back}
          initialSlide={lesson4Slide}
          onSlideChange={handleLesson4SlideChange}
          onComplete={handleLesson4Complete}
          userId={userId}
          lesson3Completed={lesson3Completed}
        />
      )}
    </>
  );
}
