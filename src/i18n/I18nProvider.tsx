import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setPreference } from '@/lib/storage'
import { DICTS, I18nContext, initialLang, type Lang } from './context'

/** Site chrome is translated; the exam itself stays in English, as on test day. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    setPreference('lang', next)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
