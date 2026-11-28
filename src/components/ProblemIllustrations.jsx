/**
 * Inline SVG illustrations for the StartSmall landing page.
 * All "text" in the SVGs is represented as shapes/icons — no <text> nodes —
 * so they render identically across all browsers and screen sizes.
 */

/** Illustration 1: Overwhelmed student at desk, paralyzed by mountain of tasks. */
export function OverwhelmedStudentIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 600 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Student overwhelmed by tasks before starting"
      role="img"
    >
      {/* Background */}
      <rect width="600" height="340" fill="#FFF0EE" rx="16" />

      {/* Desk */}
      <rect x="60" y="248" width="480" height="20" rx="8" fill="#E8DCD0" stroke="#2D3436" strokeWidth="2.5" />
      <rect x="100" y="266" width="14" height="55" rx="5" fill="#D0C4B4" stroke="#2D3436" strokeWidth="1.5" />
      <rect x="486" y="266" width="14" height="55" rx="5" fill="#D0C4B4" stroke="#2D3436" strokeWidth="1.5" />

      {/* Laptop screen blank */}
      <rect x="195" y="160" width="210" height="88" rx="8" fill="#2D3436" />
      <rect x="204" y="168" width="192" height="72" rx="4" fill="#EEF0FF" />
      {/* Blank screen shimmer — emptiness */}
      <rect x="204" y="168" width="192" height="72" rx="4" fill="white" opacity="0.4" />
      {/* Blinking cursor block */}
      <rect x="218" y="183" width="3" height="18" rx="1" fill="#9BA8E0" opacity="0.7" />
      {/* Laptop base */}
      <rect x="176" y="246" width="248" height="10" rx="5" fill="#3D4446" stroke="#2D3436" strokeWidth="1.5" />

      {/* Student head */}
      <circle cx="300" cy="118" r="36" fill="#FFDBB5" stroke="#2D3436" strokeWidth="2.5" />
      {/* Hair */}
      <ellipse cx="300" cy="88" rx="36" ry="20" fill="#2D3436" />
      <ellipse cx="270" cy="104" rx="10" ry="18" fill="#2D3436" />
      <ellipse cx="330" cy="104" rx="10" ry="18" fill="#2D3436" />

      {/* Wide stressed eyes */}
      <ellipse cx="287" cy="118" rx="6" ry="6" fill="white" stroke="#2D3436" strokeWidth="1.5" />
      <ellipse cx="313" cy="118" rx="6" ry="6" fill="white" stroke="#2D3436" strokeWidth="1.5" />
      <circle cx="288" cy="119" r="3" fill="#2D3436" />
      <circle cx="314" cy="119" r="3" fill="#2D3436" />
      {/* Pupils reflecting blank screen */}
      <circle cx="289" cy="118" r="1" fill="white" />
      <circle cx="315" cy="118" r="1" fill="white" />
      {/* Worried mouth */}
      <path d="M287 134 Q300 128 313 134" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Hands on head (overwhelmed) */}
      <path d="M270 148 Q252 134 260 118" stroke="#FFDBB5" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M330 148 Q348 134 340 118" stroke="#FFDBB5" strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M270 148 Q265 195 260 248" stroke="#5B7FD4" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M330 148 Q335 195 340 248" stroke="#5B7FD4" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M270 148 Q300 164 330 148" stroke="#5B7FD4" strokeWidth="24" strokeLinecap="round" fill="none" />

      {/* ── FLOATING TASK BUBBLES ── */}

      {/* Bubble 1 — top left "BIG TASK" */}
      <rect x="22" y="38" width="148" height="70" rx="14" fill="white" stroke="#FF6B6B" strokeWidth="2.5" />
      {/* Book icon */}
      <rect x="38" y="52" width="22" height="28" rx="3" fill="#FF6B6B" opacity="0.3" stroke="#FF6B6B" strokeWidth="1.5" />
      <line x1="49" y1="52" x2="49" y2="80" stroke="#FF6B6B" strokeWidth="1.5" />
      {/* Lines representing text */}
      <rect x="68" y="54" width="84" height="7" rx="3" fill="#FF6B6B" opacity="0.5" />
      <rect x="68" y="66" width="66" height="7" rx="3" fill="#FF6B6B" opacity="0.35" />
      <rect x="68" y="78" width="74" height="7" rx="3" fill="#FF6B6B" opacity="0.25" />
      {/* Exclamation badge */}
      <circle cx="154" cy="44" r="12" fill="#FF6B6B" stroke="white" strokeWidth="2" />
      <rect x="152" y="37" width="4" height="8" rx="2" fill="white" />
      <circle cx="154" cy="49" r="2" fill="white" />
      {/* Dashed connect line */}
      <line x1="170" y1="85" x2="262" y2="142" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />

      {/* Bubble 2 — top right "CODE BUGS" */}
      <rect x="430" y="28" width="148" height="70" rx="14" fill="white" stroke="#FF6B6B" strokeWidth="2.5" />
      {/* Code brackets icon */}
      <path d="M448 52 L440 66 L448 80" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M468 52 L476 66 L468 80" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="455" y1="66" x2="461" y2="66" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" />
      {/* Bug count bars */}
      <rect x="486" y="52" width="74" height="7" rx="3" fill="#FF6B6B" opacity="0.5" />
      <rect x="486" y="64" width="56" height="7" rx="3" fill="#FF6B6B" opacity="0.35" />
      <rect x="486" y="76" width="66" height="7" rx="3" fill="#FF6B6B" opacity="0.25" />
      <circle cx="562" cy="34" r="12" fill="#FF6B6B" stroke="white" strokeWidth="2" />
      <rect x="560" y="27" width="4" height="8" rx="2" fill="white" />
      <circle cx="562" cy="39" r="2" fill="white" />
      <line x1="430" y1="68" x2="338" y2="142" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />

      {/* Bubble 3 — left mid "ESSAY" */}
      <rect x="14" y="148" width="148" height="58" rx="14" fill="white" stroke="#FFD93D" strokeWidth="2.5" />
      {/* Pencil icon */}
      <rect x="30" y="162" width="8" height="22" rx="2" fill="#FFD93D" stroke="#B8900A" strokeWidth="1.5" transform="rotate(-15 34 173)" />
      <rect x="52" y="160" width="78" height="7" rx="3" fill="#FFD93D" opacity="0.5" />
      <rect x="52" y="172" width="62" height="7" rx="3" fill="#FFD93D" opacity="0.35" />
      <rect x="52" y="184" width="70" height="7" rx="3" fill="#FFD93D" opacity="0.25" />
      <line x1="162" y1="170" x2="265" y2="160" stroke="#FFD93D" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />

      {/* Bubble 4 — right mid "PROBLEMS" */}
      <rect x="438" y="148" width="148" height="58" rx="14" fill="white" stroke="#FFD93D" strokeWidth="2.5" />
      {/* Math sigma icon (simplified) */}
      <path d="M458 162 L478 162 L468 177 L478 192" stroke="#B8900A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="488" y="160" width="78" height="7" rx="3" fill="#FFD93D" opacity="0.5" />
      <rect x="488" y="172" width="60" height="7" rx="3" fill="#FFD93D" opacity="0.35" />
      <rect x="488" y="184" width="70" height="7" rx="3" fill="#FFD93D" opacity="0.25" />
      <line x1="438" y1="170" x2="336" y2="162" stroke="#FFD93D" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />

      {/* Clock — deadline looming */}
      <circle cx="300" cy="40" r="25" fill="white" stroke="#2D3436" strokeWidth="2.5" />
      <circle cx="300" cy="40" r="3" fill="#2D3436" />
      <line x1="300" y1="40" x2="300" y2="20" stroke="#2D3436" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="300" y1="40" x2="318" y2="34" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
      {/* Tick marks */}
      <line x1="300" y1="16" x2="300" y2="20" stroke="#2D3436" strokeWidth="2" />
      <line x1="323" y1="40" x2="319" y2="40" stroke="#2D3436" strokeWidth="2" />
      <line x1="300" y1="63" x2="300" y2="59" stroke="#2D3436" strokeWidth="2" />
      <line x1="277" y1="40" x2="281" y2="40" stroke="#2D3436" strokeWidth="2" />

      {/* Sweat drops */}
      <ellipse cx="254" cy="136" rx="5" ry="8" fill="#87CEEB" opacity="0.75" />
      <ellipse cx="348" cy="140" rx="5" ry="8" fill="#87CEEB" opacity="0.75" />

      {/* Stress squiggles */}
      <path d="M272 86 Q267 79 272 72 Q277 65 272 58" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M328 86 Q333 79 328 72 Q323 65 328 58" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/** Illustration 2: Before → After split.  Left = paralyzed. Right = focused + timer. */
export function BeforeAfterIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Before: student paralyzed. After: student focused in 60 seconds."
      role="img"
    >
      <rect width="600" height="300" fill="#FFF8F0" rx="16" />

      {/* ── LEFT PANEL ── */}
      <rect x="0" y="0" width="274" height="300" rx="16" fill="#FFF0EE" />

      {/* BEFORE pill */}
      <rect x="16" y="16" width="80" height="26" rx="8" fill="#FF6B6B" />
      <rect x="22" y="22" width="22" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="22" y="31" width="16" height="5" rx="2.5" fill="white" opacity="0.6" />
      <rect x="52" y="22" width="34" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="52" y="31" width="26" height="5" rx="2.5" fill="white" opacity="0.6" />

      {/* Giant task mountain shape */}
      <path d="M50 255 L137 90 L224 255 Z" fill="#FF6B6B" opacity="0.15" stroke="#FF6B6B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M80 255 L137 118 L194 255 Z" fill="#FF6B6B" opacity="0.2" />

      {/* Task label bars on mountain */}
      <rect x="97" y="170" width="80" height="7" rx="3" fill="#FF6B6B" opacity="0.5" />
      <rect x="102" y="185" width="68" height="7" rx="3" fill="#FF6B6B" opacity="0.4" />
      <rect x="108" y="200" width="56" height="7" rx="3" fill="#FF6B6B" opacity="0.3" />
      <rect x="113" y="215" width="46" height="7" rx="3" fill="#FF6B6B" opacity="0.2" />

      {/* Peak danger flag */}
      <line x1="137" y1="90" x2="137" y2="58" stroke="#2D3436" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M137 58 L162 69 L137 80 Z" fill="#FF6B6B" stroke="#2D3436" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Stressed student at base */}
      <circle cx="137" cy="236" r="16" fill="#FFDBB5" stroke="#2D3436" strokeWidth="2" />
      <ellipse cx="137" cy="223" rx="16" ry="8" fill="#2D3436" />
      <ellipse cx="121" cy="231" rx="5" ry="10" fill="#2D3436" />
      <ellipse cx="153" cy="231" rx="5" ry="10" fill="#2D3436" />
      {/* Tiny distressed eyes */}
      <circle cx="131" cy="237" r="2.5" fill="white" stroke="#2D3436" strokeWidth="1" />
      <circle cx="143" cy="237" r="2.5" fill="white" stroke="#2D3436" strokeWidth="1" />
      <circle cx="131" cy="237" r="1.2" fill="#2D3436" />
      <circle cx="143" cy="237" r="1.2" fill="#2D3436" />
      {/* Mouth */}
      <path d="M130 244 Q137 240 144 244" stroke="#2D3436" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Sweat + stress */}
      <ellipse cx="118" cy="232" rx="4" ry="6" fill="#87CEEB" opacity="0.6" />
      <ellipse cx="156" cy="235" rx="4" ry="6" fill="#87CEEB" opacity="0.6" />

      {/* ── ARROW DIVIDER ── */}
      <rect x="263" y="0" width="74" height="300" fill="#FFF8F0" />
      <circle cx="300" cy="150" r="22" fill="#2D3436" />
      <path d="M290 150 L310 150 M303 141 L312 150 L303 159" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 60s label above arrow */}
      <rect x="280" y="112" width="40" height="22" rx="8" fill="#FFD93D" stroke="#2D3436" strokeWidth="1.5" />
      <rect x="286" y="118" width="28" height="4" rx="2" fill="#2D3436" opacity="0.7" />
      <rect x="290" y="125" width="20" height="4" rx="2" fill="#2D3436" opacity="0.5" />

      {/* ── RIGHT PANEL ── */}
      <rect x="326" y="0" width="274" height="300" rx="16" fill="#F0FFF4" />

      {/* AFTER pill */}
      <rect x="342" y="16" width="80" height="26" rx="8" fill="#6BCB77" />
      <rect x="348" y="22" width="22" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="348" y="31" width="16" height="5" rx="2.5" fill="white" opacity="0.6" />
      <rect x="378" y="22" width="34" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="378" y="31" width="26" height="5" rx="2.5" fill="white" opacity="0.6" />

      {/* Focus timer circle */}
      <circle cx="463" cy="98" r="52" fill="white" stroke="#E8DCD0" strokeWidth="4" />
      <circle cx="463" cy="98" r="52" fill="none" stroke="#6BCB77" strokeWidth="5"
        strokeDasharray="245 85" strokeDashoffset="-40" strokeLinecap="round" />
      {/* Timer display bars */}
      <rect x="438" y="85" width="50" height="10" rx="4" fill="#2D3436" opacity="0.85" />
      <rect x="444" y="100" width="38" height="7" rx="3" fill="#6BCB77" opacity="0.7" />

      {/* Tiny first-step card */}
      <rect x="342" y="168" width="208" height="56" rx="10" fill="white" stroke="#6BCB77" strokeWidth="2.5" />
      {/* Check mark */}
      <circle cx="362" cy="196" r="12" fill="#6BCB77" />
      <path d="M356 196 L360 200 L370 190" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Task text bars */}
      <rect x="382" y="185" width="120" height="7" rx="3" fill="#2D3436" opacity="0.6" />
      <rect x="382" y="197" width="90" height="7" rx="3" fill="#2D3436" opacity="0.35" />
      <rect x="382" y="209" width="100" height="7" rx="3" fill="#6BCB77" opacity="0.4" />

      {/* Happy focused student */}
      <circle cx="400" cy="258" r="22" fill="#FFDBB5" stroke="#2D3436" strokeWidth="2" />
      <ellipse cx="400" cy="240" rx="22" ry="10" fill="#2D3436" />
      <ellipse cx="381" cy="250" rx="6" ry="12" fill="#2D3436" />
      <ellipse cx="419" cy="250" rx="6" ry="12" fill="#2D3436" />
      {/* Happy eyes */}
      <path d="M392 258 Q394 255 397 258" stroke="#2D3436" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M403 258 Q406 255 409 258" stroke="#2D3436" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Big smile */}
      <path d="M390 266 Q400 273 410 266" stroke="#2D3436" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Music note — focus audio on */}
      <path d="M488 238 Q496 232 496 244 Q496 250 490 250 Q484 250 484 244 Q484 238 490 238 L490 228 L504 224 L504 236 Q504 240 498 240"
        stroke="#6BCB77" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stars around the happy student */}
      <path d="M448 240 L450 245 L455 245 L451 248 L452 253 L448 250 L444 253 L445 248 L441 245 L446 245 Z"
        fill="#FFD93D" stroke="#2D3436" strokeWidth="1" />
      <path d="M422 228 L423 232 L427 232 L424 234 L425 238 L422 236 L419 238 L420 234 L417 232 L421 232 Z"
        fill="#FFD93D" stroke="#2D3436" strokeWidth="1" />
    </svg>
  );
}
