import { C } from "../tokens";
import ChatLogo from "./ChatLogo";

const LESSON_META = [
  { number: 1, city: "Cancún",           topic: "At the airport" },
  { number: 2, city: "Isla Mujeres",     topic: "Money & exchange" },
  { number: 3, city: "Holbox",           topic: "Getting around" },
  { number: 4, city: "Playa del Carmen", topic: "Making friends" },
  { number: 5, city: "Cozumel",          topic: "Water adventures" },
  { number: 6, city: "Tulum",            topic: "Ruins & cenotes" },
  { number: 7, city: "Bacalar",          topic: "The lake of seven colors" },
  { number: 8, city: "Valladolid bus",   topic: "Long distance bus" },
  { number: 9, city: "Valladolid",       topic: "Colonial town life" },
  { number: 10, city: "Chichén Itzá",   topic: "Ancient Mexico" },
];

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const Play = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export default function Dashboard({ completedLessons = [], currentLesson = null }) {
  const visibleLessons = LESSON_META.filter(l =>
    completedLessons.includes(l.number) || l.number === currentLesson
  );

  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 20, marginBottom: 20, borderBottom: `0.5px solid ${C.grisB}` }}>
          <ChatLogo size={56} bg={C.magenta} />
          <div style={{ fontSize: 16, fontWeight: 800, color: C.textH, marginTop: 8 }}>Chat in Spanish</div>
          <div style={{ fontSize: 13, color: C.textM, marginTop: 2 }}>Basic Level</div>
        </div>

        <div style={{ fontSize: 11, letterSpacing: 2, color: C.textM, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Your progress</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleLessons.map(l => {
            const isDone = completedLessons.includes(l.number);
            const isActive = l.number === currentLesson;
            return (
              <div key={l.number} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: isActive ? C.turquesaL : C.grisS,
                border: `${isActive ? "1.5px" : "0.5px"} solid ${isActive ? C.turquesa : C.grisB}`,
                borderRadius: 12, padding: "12px 14px"
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: isDone ? "#E1F5EE" : C.turquesa,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {isDone ? <Check /> : <Play />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? C.turquesaD : C.textH }}>
                    Lesson {l.number} — {l.city}
                  </div>
                  <div style={{ fontSize: 12, color: isActive ? C.turquesaD : C.textM, opacity: isActive ? 0.8 : 1 }}>
                    {l.topic}{isActive ? " · In progress" : ""}
                  </div>
                </div>
                {isDone && (
                  <div style={{ fontSize: 11, color: "#0F6E56", fontWeight: 700, background: "#E1F5EE", padding: "3px 8px", borderRadius: 20 }}>
                    Done
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
