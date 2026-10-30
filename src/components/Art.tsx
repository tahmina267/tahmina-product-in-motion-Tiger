import { useMemo } from 'react'

const rnd = (seed: number) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647 }

/** Custom illustration: a figure whose hair dissolves into a starry sky. */
export function StarGirl({ className = '' }: { className?: string }) {
  const stars = useMemo(() => { const r = rnd(7); return Array.from({ length: 46 }, () => ({ x: 20 + r() * 260, y: 10 + r() * 190, s: 0.8 + r() * 2.2, d: r() * 3 })) }, [])
  return (
    <svg viewBox="0 0 300 400" className={className} role="img" aria-label="Illustration of a girl whose hair turns into a starry night sky">
      <defs>
        <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1b4b" /><stop offset="1" stopColor="#3b2a6b" /></linearGradient>
        <clipPath id="sg-hair"><path d="M150 18C70 18 28 78 36 150c6 50-6 70-16 100 40-12 70-6 90 12h80c20-18 50-24 90-12-10-30-22-50-16-100C272 78 230 18 150 18Z" /></clipPath>
      </defs>
      <g clipPath="url(#sg-hair)">
        <rect width="300" height="300" fill="url(#sg-sky)" />
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#ffe9b0" className="twinkle" style={{ animationDelay: `${s.d}s` }} />)}
        <circle cx="228" cy="62" r="16" fill="#ffe9b0" /><circle cx="236" cy="57" r="14" fill="#2a2368" />
      </g>
      <path d="M118 150c0 36 14 58 32 58s32-22 32-58c0-30-14-48-32-48s-32 18-32 48Z" fill="#f1c9a5" />
      <path d="M118 140c6-34 22-44 32-44s26 10 32 44c-10-18-24-24-32-24s-22 6-32 24Z" fill="#1a1b4b" />
      <circle cx="139" cy="156" r="2.4" fill="#16120e" /><circle cx="161" cy="156" r="2.4" fill="#16120e" />
      <path d="M143 176c4 4 10 4 14 0" stroke="#b5533a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="132" cy="168" r="5" fill="#e0492b" opacity=".25" /><circle cx="168" cy="168" r="5" fill="#e0492b" opacity=".25" />
      <path d="M132 204c-40 12-70 40-80 100l-8 96h212l-8-96c-10-60-40-88-80-100-10 10-24 16-18 16s-8-6-18-16Z" fill="#e0492b" />
      <path d="M150 220l-22 30 22 150 22-150Z" fill="#f3ecde" opacity=".9" />
    </svg>
  )
}

/** Closing illustration: a blank sky with a small figure holding a brush. */
export function BlankSky({ className = '' }: { className?: string }) {
  const stars = useMemo(() => { const r = rnd(21); return Array.from({ length: 30 }, () => ({ x: r() * 600, y: r() * 220, s: 0.8 + r() * 2, d: r() * 3 })) }, [])
  return (
    <svg viewBox="0 0 600 300" className={className} role="img" aria-label="A hillside under a sky with a few stars, one still unpainted">
      <rect width="600" height="300" fill="none" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="currentColor" className="twinkle" style={{ animationDelay: `${s.d}s` }} />)}
      <path d="M0 300V240c80-40 150-30 230-10 90 22 180-30 370-6v76Z" fill="currentColor" opacity=".14" />
      <path d="M0 300v-30c100-30 200-10 300 0s200 10 300-20v50Z" fill="currentColor" opacity=".28" />
      <g className="bob"><circle cx="440" cy="120" r="30" fill="none" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1.5" /><path d="M436 112l8 8m0-8l-8 8" stroke="#e0492b" strokeWidth="2" /></g>
      <g transform="translate(300 232)"><circle cx="0" cy="-26" r="8" fill="currentColor" /><path d="M-9 -16h18l4 28h-26Z" fill="#e0492b" /><path d="M10 -8l36-40" stroke="currentColor" strokeWidth="2" /></g>
    </svg>
  )
}

export function ProjectVisual({ kind }: { kind: 'kova' | 'relay' | 'lattice' | 'vital' | 'tally' }) {
  const L = 'rgba(255,255,255,.85)', D = 'rgba(255,255,255,.22)'
  const common = 'h-full w-full'
  switch (kind) {
    case 'kova': return (
      <svg viewBox="0 0 480 320" className={common} aria-hidden>
        <rect x="30" y="30" width="420" height="260" rx="14" fill="rgba(0,0,0,.25)" />
        <text x="54" y="70" fill={D} fontFamily="monospace" fontSize="11">BALANCE · USD</text>
        <text x="54" y="108" fill={L} fontFamily="Georgia,serif" fontSize="34">$482,910.40</text>
        <path d="M54 220c40-10 50-60 90-50s50 40 90 20 60-70 100-60 40 10 80-10" stroke="#ffd29a" strokeWidth="2.5" fill="none" strokeDasharray="600" strokeDashoffset="600"><animate attributeName="stroke-dashoffset" from="600" to="0" dur="2.4s" fill="freeze" /></path>
        {['USD', 'EUR', 'GBP', 'USDC', 'BDT'].map((c, i) => <g key={c}><rect x={54 + i * 76} y="244" width="64" height={14} rx="7" fill={D} /><rect x={54 + i * 76} y="244" width={[64, 46, 36, 24, 14][i]} height="14" rx="7" fill={L} /><text x={58 + i * 76} y="238" fill={D} fontFamily="monospace" fontSize="9">{c}</text></g>)}
      </svg>)
    case 'relay': return (
      <svg viewBox="0 0 480 320" className={common} aria-hidden>
        {[0, 1, 2, 3].map(i => <g key={i}><rect x={40 + i * 110} y={i % 2 ? 160 : 90} width="90" height="56" rx="10" fill="rgba(0,0,0,.28)" stroke={i === 3 ? '#ffb454' : D} /><text x={52 + i * 110} y={(i % 2 ? 160 : 90) + 33} fill={i === 3 ? '#ffb454' : L} fontFamily="monospace" fontSize="11">{['plan', 'search', 'draft', 'STOP?'][i]}</text>{i < 3 && <path d={`M${130 + i * 110} ${(i % 2 ? 188 : 118)}C${150 + i * 110} ${(i % 2 ? 188 : 118)} ${140 + i * 110} ${(i % 2 ? 118 : 188)} ${150 + i * 110} ${(i % 2 ? 118 : 188)}`} stroke={L} fill="none" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" /></path>}</g>)}
        <circle cx="85" cy="250" r="5" fill="#ffb454"><animate attributeName="cx" values="85;415;85" dur="5s" repeatCount="indefinite" /></circle>
        <line x1="85" y1="250" x2="415" y2="250" stroke={D} />
      </svg>)
    case 'lattice': return (
      <svg viewBox="0 0 480 320" className={common} aria-hidden>
        <g transform="translate(240 160)"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
          {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * 6.283, x = Math.cos(a) * 90, y = Math.sin(a) * 90, x2 = Math.cos(a + 1.3) * 55, y2 = Math.sin(a + 1.3) * 55; return <g key={i}><line x1={x} y1={y} x2={x2} y2={y2} stroke={D} /><line x1={x} y1={y} x2={Math.cos(a + .45) * 90} y2={Math.sin(a + .45) * 90} stroke={L} strokeWidth="2" /><circle cx={x} cy={y} r="8" fill={i % 3 ? L : '#ffd29a'} /><circle cx={x2} cy={y2} r="5" fill={D} /></g> })}</g></g>
      </svg>)
    case 'vital': return (
      <svg viewBox="0 0 480 320" className={common} aria-hidden>
        <path d="M20 170h110l20-60 30 120 30-90 20 30h230" stroke={L} strokeWidth="3" fill="none" strokeDasharray="700" strokeDashoffset="700"><animate attributeName="stroke-dashoffset" values="700;0;0;-700" dur="4s" repeatCount="indefinite" /></path>
        <rect x="60" y="244" width="360" height="30" rx="15" fill="rgba(0,0,0,.28)" /><text x="84" y="264" fill={L} fontFamily="Georgia,serif" fontStyle="italic" fontSize="14">Slept well. Heart rate steady. Rest today.</text>
        <circle cx="240" cy="70" r="26" fill="none" stroke="#ffd29a" strokeWidth="3"><animate attributeName="r" values="22;30;22" dur="1.6s" repeatCount="indefinite" /></circle>
      </svg>)
    default: return (
      <svg viewBox="0 0 480 320" className={common} aria-hidden>
        <rect x="60" y="50" width="250" height="44" rx="22" fill="rgba(0,0,0,.28)" /><text x="84" y="78" fill={L} fontFamily="sans-serif" fontSize="14">Where did my money go?</text>
        <rect x="150" y="120" width="270" height="130" rx="20" fill="rgba(255,255,255,.14)" />
        {[0, 1, 2].map(i => <rect key={i} x="174" y={146 + i * 30} width={[200, 170, 120][i]} height="10" rx="5" fill={L}><animate attributeName="opacity" values=".25;1;.25" dur="1.8s" begin={`${i * .3}s`} repeatCount="indefinite" /></rect>)}
        <circle cx="90" cy="150" r="22" fill="#ffd29a" /><circle cx="82" cy="146" r="3" fill="#16120e" /><circle cx="98" cy="146" r="3" fill="#16120e" /><path d="M80 158q10 8 20 0" stroke="#16120e" strokeWidth="2" fill="none" />
      </svg>)
  }
}
