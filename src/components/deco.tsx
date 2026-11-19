/** Coffee-bar drawings: steam, beans, a cup with latte art, a moka pot. Decorative only (aria-hidden). */

export function Steam({ className = "", color = "currentColor", width = 60 }: { className?: string; color?: string; width?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={width} height={width} className={`steam ${className}`} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" aria-hidden>
      <path d="M16 54c-7-9 7-13 0-24s5-14 0-24" />
      <path d="M30 54c-7-9 7-13 0-24s5-14 0-24" />
      <path d="M44 54c-7-9 7-13 0-24s5-14 0-24" />
    </svg>
  );
}

export function Bean({ size = 22, className = "", color = "#5a3522", style }: { size?: number; className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 32" width={size} height={(size * 32) / 24} className={className} style={style} aria-hidden>
      <ellipse cx="12" cy="16" rx="10.5" ry="14.5" fill={color} />
      <path d="M12 2.5c-5 6 5 9 0 14s5 8 0 13" fill="none" stroke="rgb(0 0 0 / 0.35)" strokeWidth={2.2} strokeLinecap="round" />
      <ellipse cx="8" cy="9" rx="2.4" ry="4" fill="rgb(255 255 255 / 0.14)" />
    </svg>
  );
}

const SPOTS = [
  { l: "6%", t: "14%", s: 20, r: -20, d: 0 },
  { l: "88%", t: "10%", s: 16, r: 30, d: 1.5 },
  { l: "78%", t: "72%", s: 22, r: 70, d: 3 },
  { l: "14%", t: "80%", s: 14, r: 110, d: 2 },
  { l: "48%", t: "6%", s: 12, r: -60, d: 4 },
  { l: "94%", t: "44%", s: 13, r: 15, d: 5 },
];
/** A few beans drifting slowly behind a section. */
export function Beans({ color, count = 6 }: { color?: string; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden>
      {SPOTS.slice(0, count).map((b, i) => (
        <span key={i} className="drift absolute" style={{ left: b.l, top: b.t, ["--r" as string]: `${b.r}deg`, animationDelay: `${-b.d}s` }}>
          <Bean size={b.s} color={color} />
        </span>
      ))}
    </div>
  );
}

/** An espresso cup from above-front, with a latte-art heart and rising steam (home hero, empty cart). */
export function CupArt({ className = "", width = 260 }: { className?: string; width?: number }) {
  return (
    <svg viewBox="0 0 260 230" width={width} height={(width * 230) / 260} className={className} aria-hidden>
      <g className="steam" fill="none" stroke="#c98a4b" strokeWidth={5} strokeLinecap="round" opacity={0.75}>
        <path d="M104 70c-10-12 10-18 0-32s7-18 0-30" />
        <path d="M130 66c-10-12 10-18 0-32s7-18 0-30" />
        <path d="M156 70c-10-12 10-18 0-32s7-18 0-30" />
      </g>
      <ellipse cx="130" cy="206" rx="112" ry="20" fill="#e8d9c3" />
      <ellipse cx="130" cy="200" rx="96" ry="15" fill="#fff" stroke="#e8d9c3" strokeWidth={3} />
      <path d="M210 112c34 0 34 52-4 52" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
      <path d="M210 112c34 0 34 52-4 52" fill="none" stroke="#e8d9c3" strokeWidth={3} strokeLinecap="round" />
      <path d="M44 100h172c0 58-34 96-86 96s-86-38-86-96z" fill="#fff" stroke="#e8d9c3" strokeWidth={3} />
      <path d="M50 150c26 8 134 8 160 0" fill="none" stroke="#17714a" strokeWidth={6} />
      <path d="M52 160c26 8 130 8 156 0" fill="none" stroke="#e1251b" strokeWidth={6} />
      <ellipse cx="130" cy="100" rx="86" ry="20" fill="#6b4024" />
      <ellipse cx="130" cy="100" rx="78" ry="16" fill="#a8693c" />
      <path d="M130 116c-20-10-30-18-24-24 4-4 12-2 16 4 2-6 4-9 8-9s6 3 8 9c4-6 12-8 16-4 6 6-4 14-24 24z" fill="#f7e7cf" />
      <path d="M130 116v-9" stroke="#a8693c" strokeWidth={2} />
    </svg>
  );
}

/** A Bialetti-style octagonal moka pot outline, filled by `fill` (finder, empty states). */
export function MokaArt({ className = "", width = 120, fill = "#c9ccd1", accent = "#2a1a12" }: { className?: string; width?: number; fill?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 120 150" width={width} height={(width * 150) / 120} className={className} aria-hidden>
      <path d="M52 8h16l3 10H49z" fill={accent} />
      <path d="M36 22h48l6 50H30z" fill={fill} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
      <path d="M30 26 12 34l20 10" fill={fill} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
      <path d="M86 30c22 2 26 34 4 42" fill="none" stroke={accent} strokeWidth={8} strokeLinecap="round" />
      <rect x="28" y="72" width="64" height="9" rx="2" fill="#e7e9ec" stroke={accent} strokeWidth={3} />
      <path d="M30 81h60l8 58H22z" fill={fill} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
      <path d="M46 26v44M60 24v46M74 26v44M42 84l-4 54M60 84v54M78 84l4 54" stroke={accent} strokeOpacity={0.18} strokeWidth={2} />
    </svg>
  );
}

/** 1–3 beans filled for light / medium / dark roast; a crossed bean for decaf. */
export function RoastMeter({ level, size = 16, className = "" }: { level: number; size?: number; className?: string }) {
  if (level === 0)
    return (
      <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden>
        <Bean size={size} color="#c9b39d" />
      </span>
    );
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden>
      {[1, 2, 3].map((i) => (
        <Bean key={i} size={size} color={i <= level ? ["", "#a8693c", "#6b4024", "#2f1a10"][level] : "#e8d9c3"} />
      ))}
    </span>
  );
}

/** Little cups in a row: how many espresso cups a moka pot makes. */
export function CupsRow({ n, size = 14, className = "" }: { n: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-end gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: Math.min(n, 12) }, (_, i) => (
        <svg key={i} viewBox="0 0 20 16" width={size} height={(size * 16) / 20}>
          <path d="M2 3h12c0 6-2 11-6 11S2 9 2 3z" fill="currentColor" />
          <path d="M14 5c4 0 4 5 0 5" fill="none" stroke="currentColor" strokeWidth={2} />
        </svg>
      ))}
    </span>
  );
}
