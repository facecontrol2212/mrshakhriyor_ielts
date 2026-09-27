import { createContext, useContext } from 'react'
import { getPreference } from '@/lib/storage'
import { en, type Dictionary } from './en'
import { ru } from './ru'
import { uz } from './uz'

export type Lang = 'en' | 'uz' | 'ru'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'uz', label: "O'zbekcha", short: 'UZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
]

export const DICTS: Record<Lang, Dictionary> = { en, uz, ru }

export interface I18n {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18n | null>(null)

export function initialLang(): Lang {
  const saved = getPreference<Lang | null>('lang', null)
  if (saved && saved in DICTS) return saved
  const browser = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en'
  return browser === 'uz' || browser === 'ru' ? browser : 'en'
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
