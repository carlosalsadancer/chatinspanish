import { useState } from "react";
import { GLOBAL_CSS } from "./tokens";
import { Header, ChromeModal } from "./components/LandingPage";
import LandingPage from "./components/LandingPage";
import Lesson1 from "./lessons/Lesson1";

export default function App() {
  const [view, setView] = useState("landing");
  const [showChromeModal, setShowChromeModal] = useState(false);

  function isSafariIOS() {
    const ua = navigator.userAgent;
    return (
      /iPad|iPhone|iPod/.test(ua) &&
      /Safari/.test(ua) &&
      !/Chrome/.test(ua) &&
      !/CriOS/.test(ua)
    );
  }

  function handleStartFree() {
    if (isSafariIOS()) {
      setShowChromeModal(true);
    } else {
      goToLesson();
    }
  }

  function goToLesson() {
    setView("lesson1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToLanding() {
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {showChromeModal && (
        <ChromeModal
          onContinue={() => { setShowChromeModal(false); goToLesson(); }}
          onClose={() => setShowChromeModal(false)}
        />
      )}

      {view === "landing" && (
        <>
          <Header onStartFree={handleStartFree} />
          <LandingPage onStartFree={handleStartFree} />
        </>
      )}

      {view === "lesson1" && (
        <Lesson1 onBack={goToLanding} />
      )}
    </>
  );
}
