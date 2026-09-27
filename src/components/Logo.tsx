import { site } from '@/site.config'

/** Wordmark: the brand name with its signature highlighter stroke. */
export function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <rect width="64" height="64" rx="14" fill={inverted ? '#f6f3ec' : '#0b1020'} />
        <rect x="12" y="36" width="40" height="10" rx="2" fill="#e5ff45" />
        <text x="32" y="41" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="30" fontWeight="700" fill={inverted ? '#0b1020' : '#f6f3ec'}>
          M
        </text>
      </svg>
      <span className={`font-display text-[1.15rem] leading-none font-semibold tracking-tight ${inverted ? 'text-paper' : 'text-ink-950'}`}>
        mrshakhriyor<span className="ml-1 font-sans text-[0.72em] font-bold tracking-[0.18em] text-ink-500 uppercase">ielts</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  )
}
