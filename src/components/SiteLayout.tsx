import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'
import { LANGS, useI18n } from '@/i18n'
import { DISCLAIMER, site } from '@/site.config'
import { Logo } from './Logo'

function LanguageSwitch({ compact }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t.nav.language} className="flex rounded-full border border-ink-900/15 p-0.5 text-xs font-semibold">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === l.code ? 'bg-ink-950 text-paper' : 'text-ink-600 hover:text-ink-950'}`}
        >
          {compact ? l.short : l.short}
        </button>
      ))}
    </div>
  )
}

function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const links = [
    { to: '/tests', label: t.nav.tests },
    { to: '/band-calculator', label: t.nav.calculator },
    { to: '/articles', label: t.nav.articles },
    { to: '/dashboard', label: t.nav.dashboard },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label={`${site.name} home`} onClick={close}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-ink-950/5 text-ink-950' : 'text-ink-600 hover:text-ink-950'}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch />
          <Link to="/tests/mock-1" className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
            {t.nav.start}
          </Link>
        </div>
        <button type="button" className="rounded-full p-2 lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={t.nav.menu}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-ink-900/10 bg-paper px-4 pb-6 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col py-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={close} className="border-b border-ink-900/5 py-3.5 text-lg font-medium">
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitch compact />
            <Link to="/tests/mock-1" onClick={close} className="rounded-full bg-ink-950 px-4 py-2.5 text-sm font-semibold text-paper">
              {t.nav.start}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { t } = useI18n()
  const contacts = [
    { href: site.contact.telegram, label: 'Telegram' },
    { href: site.contact.instagram, label: 'Instagram' },
    { href: site.contact.email && `mailto:${site.contact.email}`, label: site.contact.email },
  ].filter((c) => c.href)

  return (
    <footer className="mt-24 bg-ink-950 text-paper/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">{t.footer.madeFor}</p>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-paper/40 uppercase">{t.footer.practice}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/tests" className="hover:text-mark">
                {t.footer.fullMocks}
              </Link>
            </li>
            <li>
              <Link to="/tests/practice-whale" className="hover:text-mark">
                {t.footer.readingPractice}
              </Link>
            </li>
            <li>
              <Link to="/band-calculator" className="hover:text-mark">
                {t.nav.calculator}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-paper/40 uppercase">{t.footer.learn}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/articles" className="hover:text-mark">
                {t.nav.articles}
              </Link>
            </li>
            <li>
              <Link to="/#how" className="hover:text-mark">
                {t.nav.how}
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-mark">
                {t.nav.dashboard}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-paper/40 uppercase">{t.footer.contact}</h2>
          <ul className="space-y-2 text-sm">
            {contacts.length ? (
              contacts.map((c) => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noreferrer" className="hover:text-mark">
                    {c.label}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-paper/50">{site.city}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-paper/45 sm:px-6">
          <p className="mb-2">{DISCLAIMER}</p>
          <p>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-ink-950 focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
