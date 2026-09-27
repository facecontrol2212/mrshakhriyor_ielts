import { expect, test } from '@playwright/test'
import { beginTest, submitSection, WHALE_ANSWERS } from './helpers'

test.describe('Reading', () => {
  test('a perfect paper scores 13/13 and the review shows the evidence', async ({ page }) => {
    await beginTest(page, 'practice-whale', /^Reading/)
    await expect(page.getByRole('heading', { name: 'Reading' })).toBeVisible()
    await page.getByRole('button', { name: 'Start test' }).click()
    await expect(page.getByRole('timer')).toContainText('20:00')

    for (const [n, answer] of Object.entries(WHALE_ANSWERS)) {
      if (Number(n) <= 7) await page.locator(`[data-q="${n}"]`).getByLabel(answer, { exact: true }).check()
      else await page.locator(`input[data-q="${n}"]`).fill(answer)
    }
    await expect(page.getByRole('button', { name: 'Question 13, answered' })).toBeVisible()

    await submitSection(page)
    await expect(page).toHaveURL(/\/results\//)
    await expect(page.getByText('13 / 13 correct')).toBeVisible()
    await expect(page.getByText('9.0').first()).toBeVisible()

    await page.getByRole('link', { name: /Review answers/ }).click()
    await expect(page.getByText('Answer review')).toBeVisible()
    await expect(page.locator('mark.evidence').first()).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page).toHaveURL(/\/results\//)
  })

  test('highlights survive a reload and the clock keeps running', async ({ page }) => {
    // Leaving a running test asks for confirmation; accept it for the reload.
    page.on('dialog', (dialog) => void dialog.accept())
    await beginTest(page, 'practice-whale', /^Reading/)
    await page.getByRole('button', { name: 'Start test' }).click()
    const paragraph = page.locator('[data-hl-block="w1-p0"]')
    const box = (await paragraph.boundingBox())!
    await page.mouse.move(box.x + 4, box.y + 8)
    await page.mouse.down()
    await page.mouse.move(box.x + 260, box.y + 8, { steps: 6 })
    await page.mouse.up()
    await page.getByRole('menuitem', { name: 'Highlight' }).click()
    await expect(paragraph.locator('mark.hl')).toHaveCount(1)
    await page.locator('input[data-q="8"]').fill('lecturer')

    await page.reload()
    await expect(page.locator('[data-hl-block="w1-p0"] mark.hl')).toHaveCount(1)
    await expect(page.locator('input[data-q="8"]')).toHaveValue('lecturer')
    await expect(page.getByRole('timer')).not.toContainText('20:00')
  })

  test('headings can be dragged or tapped into the passage', async ({ page }) => {
    await beginTest(page, 'mock-1', /^Reading/)
    await page.getByRole('button', { name: 'Start test' }).click()
    await page.getByRole('button', { name: /Part 2/ }).first().click()

    await page
      .locator('[data-pane="right"] button', { hasText: 'Where light pollution comes from' })
      .dragTo(page.locator('[data-pane="left"] [data-q="14"]'))
    await expect(page.locator('[data-pane="left"] [data-q="14"]')).toContainText('v')

    await page.locator('[data-pane="right"] button', { hasText: 'The first group to be affected' }).click()
    await page.locator('[data-pane="left"] [data-q="15"]').click()
    await expect(page.locator('[data-pane="left"] [data-q="15"]')).toContainText('vii')
  })

  test('answers are submitted automatically when time runs out', async ({ page }) => {
    await page.clock.install()
    await beginTest(page, 'practice-whale', /^Reading/)
    await page.getByRole('button', { name: 'Start test' }).click()
    await page.locator('input[data-q="12"]').fill('fuel')
    await page.clock.fastForward('10:30')
    await expect(page.getByRole('status').filter({ hasText: '10 minutes remaining' })).toBeVisible()
    await page.clock.fastForward('10:00')
    await expect(page).toHaveURL(/\/results\//)
    await expect(page.getByText('1 / 13 correct')).toBeVisible()
  })
})
