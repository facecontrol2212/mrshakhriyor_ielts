import { Link } from 'react-router'
import { useI18n } from '@/i18n'

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
      <p className="font-display text-7xl font-semibold text-ink-950">
        4<span className="marker">0</span>4
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-3 text-ink-600">{t.notFound.text}</p>
      <Link to="/" className="mt-8 rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
        {t.notFound.home}
      </Link>
    </div>
  )
}
