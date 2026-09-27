import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ARTICLES } from '@/content/articles'
import { useI18n } from '@/i18n'

export function ArticlesPage() {
  const { t } = useI18n()
  const [first, ...rest] = ARTICLES
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-950">{t.articles.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-600">{t.articles.lead}</p>

      <Link to={`/articles/${first.slug}`} className="group mt-10 grid overflow-hidden rounded-[2rem] bg-ink-950 text-paper md:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-10">
          <p className="text-xs font-bold tracking-[0.2em] text-mark uppercase">{first.category}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{first.title}</h2>
          <p className="mt-4 text-paper/70">{first.summary}</p>
          <span className="mt-8 inline-flex items-center gap-2 font-semibold text-mark">
            {t.articles.read} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
        <div className="grain hidden items-end justify-end bg-ink-800 p-10 md:flex">
          <span className="font-display text-[9rem] leading-none font-semibold text-paper/10">CD</span>
        </div>
      </Link>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {rest.map((a) => (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xs font-bold tracking-[0.18em] text-ink-400 uppercase">{a.category}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-950">{a.title}</h2>
            <p className="mt-2 flex-1 text-ink-600">{a.summary}</p>
            <span className="mt-6 flex items-center justify-between text-sm">
              <span className="text-ink-400">{t.articles.minRead(a.minutes)}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-ink-950">
                {t.articles.read} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
