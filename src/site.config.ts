/**
 * Everything specific to the school lives here: brand, teacher and contact
 * links. Edit this file to personalise the site; no other code changes needed.
 */
export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  teacher: { name: string; headline: string; bio: string }
  contact: { telegram: string; instagram: string; email: string }
  city: string
}

export const site: SiteConfig = {
  name: 'mrshakhriyor IELTS',
  shortName: 'MS·IELTS',
  tagline: 'The real exam, before the real exam.',
  teacher: {
    name: 'Mr Shakhriyor',
    /** Replace with your real overall band and experience. */
    headline: 'IELTS instructor',
    bio: 'I built this platform so that my students walk into the test centre already knowing every screen, every timer and every rule. Sit the mock here, then bring your results to class — we will work on exactly what cost you marks.',
  },
  /**
   * Fill these in with your real accounts (e.g. 'https://t.me/your_username').
   * Empty values are hidden from the site.
   */
  contact: {
    telegram: '',
    instagram: '',
    email: '',
  },
  /** Shown in the footer and in writing submissions to the teacher. */
  city: 'Tashkent, Uzbekistan',
}

export const DISCLAIMER =
  'IELTS is a registered trademark of the British Council, IDP IELTS and Cambridge University Press & Assessment. This website is an independent practice platform and is not affiliated with, approved or endorsed by them. Band scores shown here are estimates.'
