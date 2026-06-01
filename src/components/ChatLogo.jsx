import { C } from "../tokens";

export default function ChatLogo({ size = 36, bg = C.magenta }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.28,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 2px 10px ${bg}50`,
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H7L12 23L17 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="white" opacity="0.95"
        />
        <circle cx="8"  cy="10" r="1.5" fill={bg} />
        <circle cx="12" cy="10" r="1.5" fill={bg} />
        <circle cx="16" cy="10" r="1.5" fill={bg} />
      </svg>
    </div>
  );
}
