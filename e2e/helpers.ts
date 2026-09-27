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
