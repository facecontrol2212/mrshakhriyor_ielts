import { ArrowRight, Check, Clock, EyeOff, Highlighter, Keyboard, MessageCircle, Plus, Volume2 } from 'lucide-react'
import { Link } from 'react-router'
import { ExamPreview } from '@/components/ExamPreview'
import { SkillIcon } from '@/components/SkillIcon'
import { useI18n } from '@/i18n'
import { SKILL_COLOR } from '@/lib/skills'
import { site } from '@/site.config'
import type { Skill } from '@/types/content'

const FEATURE_ICONS = [EyeOff, Volume2, Clock, Highlighter, Keyboard, MessageCircle]
const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']

export function HomePage() {
  const { t } = useI18n()
  const h = t.home

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-sm ring-1 ring-ink-900/10">
              <span className="h-2 w-2 rounded-full bg-[#16a34a]" aria-hidden />
              {h.eyebrow}
            </p>
            <h1
              className={`mt-6 font-display leading-[1.02] font-semibold tracking-tight text-ink-950 ${
                `${h.titleA}${h.titleMark}${h.titleB}`.length > 45 ? 'text-[2.3rem] sm:text-5xl lg:text-[3.3rem]' : 'text-[2.7rem] sm:text-6xl lg:text-[4.1rem]'
              }`}
            >
              {h.titleA} <span className="marker">{h.titleMark}</span> {h.titleB}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">{h.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tests/mock-1" className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3.5 font-semibold text-paper shadow-lg shadow-ink-950/20 transition-transform hover:-translate-y-0.5">
                {h.ctaPrimary} <ArrowRight size={18} />
              </Link>
              <Link to="/tests/practice-whale" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink-950 ring-1 ring-ink-900/15 transition-colors hover:ring-ink-900/40">
                {h.ctaSecondary}
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
              {h.trust.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check size={16} className="text-[#16a34a]" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 sm:px-8 lg:px-0">
            <ExamPreview />
          </div>
        </div>
      </section>

      {/* Why it feels real */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">{h.realTitle}</h2>
          <p className="mt-4 text-lg text-ink-600">{h.realLead}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {h.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? Check
            return (
              <article key={f.title} className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5 transition-shadow hover:shadow-md">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-mark transition-transform group-hover:-rotate-6">
                  <Icon size={20} aria-hidden />
                </span>
                <h3 className="text-lg font-semibold text-ink-950">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{f.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-950 text-paper">
        <div className="grain">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4">
            {h.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-4xl font-semibold tracking-tight text-mark sm:text-5xl">{s.value}</span>
                  <span className="mt-2 block text-sm text-paper/65">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The four sections */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-950">{h.sectionsTitle}</h2>
            <p className="mt-4 text-lg text-ink-600">{h.sectionsLead}</p>
            <Link to="/tests" className="mt-6 inline-flex items-center gap-2 font-semibold text-signal hover:underline">
              {t.nav.tests} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SKILLS.map((skill, i) => {
              const s = h.sections[skill]
              return (
                <article key={skill} className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5">
                  <span className="absolute top-0 left-6 h-1 w-12 rounded-b-full" style={{ background: SKILL_COLOR[skill] }} aria-hidden />
                  <div className="flex items-start justify-between">
                    <SkillIcon skill={skill} size={26} />
                    <span className="text-xs font-semibold tracking-widest text-ink-400">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink-950">{t.common[skill]}</h3>
                  <p className="mt-1 text-sm font-medium text-ink-500">
                    {s.time} · {s.detail}
                  </p>
                  <p className="mt-3 leading-relaxed text-ink-600">{s.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">{h.howTitle}</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {h.steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="font-display text-6xl font-semibold text-ink-900/15">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Modes */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-950">{h.modesTitle}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(['exam', 'practice'] as const).map((m) => {
            const mode = h.modes[m]
            const dark = m === 'exam'
            return (
              <article key={m} className={`rounded-3xl p-7 sm:p-9 ${dark ? 'bg-ink-950 text-paper' : 'bg-white text-ink-950 ring-1 ring-ink-900/10'}`}>
                <h3 className="text-2xl font-semibold">{mode.title}</h3>
                <ul className="mt-6 space-y-3">
                  {mode.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-mark text-ink-950' : 'bg-ink-950 text-paper'}`}>
                        <Check size={13} strokeWidth={3} aria-hidden />
                      </span>
                      <span className={dark ? 'text-paper/85' : 'text-ink-700'}>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* Teacher */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <figure className="relative overflow-hidden rounded-[2rem] bg-mark px-7 py-12 sm:px-14">
          <p className="text-xs font-bold tracking-[0.2em] text-ink-900/60 uppercase">{h.teacherTitle}</p>
          <blockquote className="mt-4 max-w-3xl font-display text-2xl leading-snug font-medium text-ink-950 sm:text-3xl">“{site.teacher.bio}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-950 font-display text-lg font-semibold text-mark">{site.teacher.name.replace('Mr ', '')[0]}</span>
            <span>
              <span className="block font-semibold text-ink-950">{site.teacher.name}</span>
              <span className="text-sm text-ink-800">{site.teacher.headline}</span>
            </span>
          </figcaption>
        </figure>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-950">{h.faqTitle}</h2>
        <div className="mt-8 divide-y divide-ink-900/10 border-y border-ink-900/10">
          {h.faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink-950 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-ink-900/15 transition-transform group-open:rotate-45">
                  <Plus size={16} aria-hidden />
                </span>
              </summary>
              <p className="mt-3 pr-10 leading-relaxed text-ink-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-7 py-14 text-center text-paper sm:px-14">
          <div className="grain pointer-events-none absolute inset-0" aria-hidden />
          <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{h.finalTitle}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-paper/70">{h.finalText}</p>
          <Link to="/tests/mock-1" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-mark px-7 py-3.5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5">
            {h.ctaPrimary} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
