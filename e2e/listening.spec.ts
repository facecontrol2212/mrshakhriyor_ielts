import { expect, test } from '@playwright/test'
import { beginTest, submitSection } from './helpers'

test.describe('Listening', () => {
  test('exam mode plays the recording once and survives a reload', async ({ page }) => {
    page.on('dialog', (dialog) => void dialog.accept())
    await beginTest(page, 'mock-1', /^Listening/)
    await expect(page.getByRole('heading', { name: 'Sound check' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Start test' }).click()

    await expect(page.getByText(/Recording playing — Part 1/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pause' })).toHaveCount(0)
    await page.locator('input[data-q="1"]').fill('Denholm')

    await page.reload()
    await page.getByRole('button', { name: /Resume the recording/ }).click()
    await expect(page.getByText(/Recording playing — Part 1/)).toBeVisible()
    await expect(page.locator('input[data-q="1"]')).toHaveValue('Denholm')
  })

  test('practice mode has audio controls and the review shows the transcript', async ({ page }) => {
    await beginTest(page, 'mock-1', /^Listening/, { mode: 'practice' })
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Start test' }).click()
    await expect(page.getByRole('button', { name: /Pause|Play/ })).toBeVisible()
    await page.locator('input[data-q="2"]').fill('Kingsley')
    await page.getByRole('button', { name: /Part 2/ }).first().click()
    await page.locator('[data-q="15"]').getByLabel('Question 15: C').check()

    await submitSection(page)
    await expect(page).toHaveURL(/\/results\//)
    await expect(page.getByText('2 / 40 correct')).toBeVisible()
    await page.getByRole('link', { name: /Review answers/ }).click()
    await expect(page.getByRole('heading', { name: 'Transcript — Part 1' })).toBeVisible()
    await expect(page.locator('mark.evidence').first()).toBeVisible()
  })
})
