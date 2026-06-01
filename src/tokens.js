export const C = {
  magenta:  "#E0006E", magentaL: "#FCE0EF", magentaD: "#A80052",
  turquesa: "#00A8B8", turquesaL:"#E0F6F8", turquesaD:"#007E8A",
  azul:     "#00A8E0", azulL:    "#E0F4FC", azulD:    "#0078A8",
  limon:    "#88C800", limonL:   "#EEF8D0", limonD:   "#5A8400",
  morado:   "#8830A0",
  rojo:     "#C8002A", rojoL:    "#FCE0E6",
  negro:    "#0A0A0F", blanco:   "#FFFFFF",
  grisS:    "#F6F7F9", grisB:    "#E8E8F0",
  textH:    "#0A0A0F", textB:    "#1F1F2E",
  textS:    "#5A5A70", textM:    "#9A9AB0", textF:    "#C8C8D8",
};

export const btn = (bg, extra = {}) => ({
  background: bg,
  border: "none",
  color: "#FFFFFF",
  padding: "14px 28px",
  borderRadius: 50,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: -0.3,
  transition: "all 0.2s",
  boxShadow: `0 3px 14px ${bg}40`,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  ...extra,
});

export const outlineBtn = (color) => ({
  background: "#FFFFFF",
  border: `1.5px solid ${color}`,
  color: color,
  padding: "9px 20px",
  borderRadius: 50,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  transition: "all 0.2s",
});

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; color: #0A0A0F; }
  button { font-family: 'Plus Jakarta Sans', sans-serif; }
  button:hover  { opacity: 0.9; transform: translateY(-1px); }
  button:active { opacity: 0.8; transform: scale(0.98); }
  a:hover { opacity: 0.8; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes wave    { from { transform:scaleY(0.3); } to { transform:scaleY(1.4); } }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
  @keyframes spin    { to { transform: rotate(360deg); } }
  ::-webkit-scrollbar       { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #E0E0F0; border-radius: 3px; }
  ::selection { background: #E0F6F8; }

  .desktop-nav { display: flex !important; }
  .mobile-menu-btn { display: none !important; }
  .hero-inner { flex-direction: row; }
  .hero-image { display: block; min-height: 380px; }
  .garantia-inner { flex-direction: row; }
  .garantia-image { display: block; min-height: 320px; }

  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .hero-inner { flex-direction: column !important; }
    .hero-image { width: 100% !important; min-height: 260px !important; order: -1; }
    .garantia-inner { flex-direction: column !important; }
    .garantia-image { width: 100% !important; min-height: 240px !important; order: -1; }
  }
`;
