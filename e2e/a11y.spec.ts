import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { beginTest, seedCompletedAttempt } from './helpers'

async function audit(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
}

for (const path of ['/', '/tests', '/tests/mock-1', '/band-calculator', '/articles', '/articles/writing-task-1-overview', '/dashboard']) {
  test(`no serious accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await audit(page)
  })
}

test('no serious accessibility issues in the reading test', async ({ page }) => {
  await beginTest(page, 'mock-1', /^Reading/)
  await page.getByRole('button', { name: 'Start test' }).click()
  await audit(page)
  await page.getByRole('button', { name: /Part 2/ }).first().click()
  await audit(page)
})

test('no serious accessibility issues in the listening test', async ({ page }) => {
  await beginTest(page, 'mock-1', /^Listening/)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Start test' }).click()
  await audit(page)
  await page.getByRole('button', { name: /Part 2/ }).first().click()
  await audit(page)
})

test('no serious accessibility issues on the result report', async ({ page }) => {
  const id = await seedCompletedAttempt(page)
  await page.goto(`/results/${id}`)
  await audit(page)
  await page.getByRole('tab', { name: /Writing/ }).click()
  await audit(page)
  await page.getByRole('tab', { name: /Speaking/ }).click()
  await audit(page)
  await page.goto('/dashboard')
  await audit(page)
})

test('no serious accessibility issues in writing, in every colour scheme', async ({ page }) => {
  await beginTest(page, 'mock-1', /^Writing/)
  await page.getByRole('button', { name: 'Start test' }).click()
  await audit(page)
  for (const scheme of ['White on black', 'Yellow on black']) {
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByRole('radio', { name: new RegExp(scheme) }).check()
    await page.getByRole('button', { name: 'Done' }).click()
    await audit(page)
  }
})

test.describe('speaking', () => {
  test.use({ permissions: ['microphone'] })
  test('no serious accessibility issues in the speaking test', async ({ page }) => {
    await beginTest(page, 'mock-1', /^Speaking/)
    await page.getByRole('button', { name: 'Allow microphone' }).click()
    await audit(page)
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Start test' }).click()
    await expect(page.getByText('Recording', { exact: true })).toBeVisible({ timeout: 20_000 })
    await audit(page)
  })
})
