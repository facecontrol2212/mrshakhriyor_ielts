import { expect, type Page } from '@playwright/test'

/** Open a test, pick how to take it and get through the candidate-details screen. */
export async function beginTest(page: Page, testId: string, plan: RegExp, options: { mode?: 'exam' | 'practice'; name?: string } = {}) {
  await page.goto(`/tests/${testId}`)
  await page.getByRole('button', { name: plan }).or(page.getByRole('radio', { name: plan })).first().click()
  if (options.mode === 'practice') await page.getByRole('radio', { name: /Practice mode/ }).check()
  await page.getByPlaceholder(/Aziza/).fill(options.name ?? 'Test Candidate')
  await page.getByRole('button', { name: /Start the test/ }).click()
  await expect(page).toHaveURL(/\/exam\//)
  await page.getByRole('button', { name: 'My details are correct' }).click()
}

export async function submitSection(page: Page) {
  await page.getByRole('button', { name: /^Submit$/ }).click()
  await page.getByRole('button', { name: 'Submit answers' }).click()
}

/** Answers for the 13-question practice passage, "The Whale Goes to Court". */
export const WHALE_ANSWERS: Record<number, string> = {
  1: 'FALSE',
  2: 'TRUE',
  3: 'NOT GIVEN',
  4: 'TRUE',
  5: 'TRUE',
  6: 'NOT GIVEN',
  7: 'FALSE',
  8: 'lecturer',
  9: 'whalers',
  10: 'Europe',
  11: 'merchants',
  12: 'fuel',
  13: 'climate',
}

/** Store a finished full mock (all four skills) so result pages can be tested without sitting it. */
export async function seedCompletedAttempt(page: Page, id = 'e2e-complete'): Promise<string> {
  const now = Date.now()
  const done = (extra: object = {}) => ({ phase: 'done', startedAt: now - 3_600_000, finishedAt: now - 60_000, answers: {}, flagged: [], highlights: {}, ...extra })
  const attempt = {
    id,
    testId: 'mock-1',
    mode: 'exam',
    skills: ['listening', 'reading', 'writing', 'speaking'],
    current: 3,
    candidate: { name: 'Seeded Candidate', number: '100200' },
    createdAt: now - 4 * 3_600_000,
    confirmedAt: now - 4 * 3_600_000,
    completedAt: now,
    status: 'completed',
    sections: {
      listening: done({ answers: { '1': 'Denholm', '2': 'Kingsley', '11': 'B', '25-26': ['C', 'A'] } }),
      reading: done({ answers: { '1': 'FALSE', '8': 'workers', '14': 'v', '37': 'C' } }),
      writing: done({ essays: { w1: 'Overall, laptops became the most common device.', w2: 'I believe students should study other subjects.' } }),
      speaking: done({ recordings: [] }),
    },
  }
  await page.goto('/')
  await page.evaluate((a) => {
    localStorage.setItem(`msi:v1:attempt:${a.id}`, JSON.stringify(a))
    localStorage.setItem('msi:v1:attempts', JSON.stringify([a.id]))
  }, attempt)
  return id
}
