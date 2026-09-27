import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Markup } from '@/components/Markup'
import { getArticle, type Block } from '@/content/articles'
import { useI18n } from '@/i18n'
import { NotFoundPage } from './NotFoundPage'

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="text-lg leading-8 text-ink-800">
          <Markup text={block.text} />
        </p>
      )
    case 'h2':
      return <h2 className="pt-4 font-display text-2xl font-semibold text-ink-950">{block.text}</h2>
    case 'ul':
    case 'ol': {
      const List = block.type === 'ul' ? 'ul' : 'ol'
      return (
        <List className={`space-y-2 pl-6 text-lg leading-8 text-ink-800 ${block.type === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-ink-400`}>
          {block.items.map((item) => (
            <li key={item}>
              <Markup text={item} />
            </li>
          ))}
        </List>
      )
    }
    case 'quote':
      return (
        <blockquote className="border-l-4 border-mark-deep bg-white px-6 py-4 font-display text-xl leading-relaxed text-ink-900 italic">
          <Markup text={block.text} />
        </blockquote>
      )
    case 'tip':
      return (
        <p className="flex gap-3 rounded-2xl bg-mark/70 p-5 text-ink-950">
          <Lightbulb size={20} className="mt-1 shrink-0" aria-hidden />
          <span className="leading-7">
            <Markup text={block.text} />
          </span>
        </p>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-900/10">
          <table className="w-full min-w-[420px] text-left">
            <thead className="bg-paper-2 text-sm text-ink-600">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/8">
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    <td key={i} className={`px-4 py-2.5 align-top ${i === 0 ? 'font-semibold text-ink-950' : 'text-ink-700'}`}>
                      <Markup text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export function ArticlePage() {
  const { slug = '' } = useParams()
  const { t } = useI18n()
  const article = getArticle(slug)
  if (!article) return <NotFoundPage />
  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-950">
        <ArrowLeft size={16} /> {t.articles.back}
      </Link>
      <p className="mt-8 text-xs font-bold tracking-[0.2em] text-ink-400 uppercase">
        {article.category} · {t.articles.minRead(article.minutes)}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink-950 sm:text-5xl">{article.title}</h1>
      <p className="mt-4 text-xl leading-relaxed text-ink-600">{article.summary}</p>
      <div className="mt-10 space-y-6">
        {article.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
      {article.source && (
        <p className="mt-10 border-t border-ink-900/10 pt-4 text-sm text-ink-500">
          <Markup text={article.source} />
        </p>
      )}
      {article.practice && (
        <Link to={article.practice.to} className="mt-10 flex items-center justify-between gap-4 rounded-3xl bg-ink-950 p-6 text-paper transition-transform hover:-translate-y-0.5">
          <span className="font-display text-xl font-semibold">{article.practice.label}</span>
          <ArrowRight className="text-mark" />
        </Link>
      )}
    </article>
  )
}
