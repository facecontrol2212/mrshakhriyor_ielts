import { expect, test } from '@playwright/test'
import { beginTest } from './helpers'

test('the menu opens on a phone', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Band calculator' }).click()
  await expect(page).toHaveURL(/band-calculator/)
})

test('reading works on a phone with tabs and tap-to-place', async ({ page }) => {
  await beginTest(page, 'mock-1', /^Reading/)
  await page.getByRole('button', { name: 'Start test' }).click()
  await expect(page.getByRole('tab', { name: 'Passage' })).toBeVisible()
  await page.getByRole('tab', { name: /Questions/ }).click()
  await page.locator('[data-q="1"]').getByLabel('FALSE', { exact: true }).check()
  await expect(page.getByRole('tab', { name: /Questions \(1\/13\)/ })).toBeVisible()

  await page.getByRole('button', { name: /Part 2/ }).first().click()
  await page.getByRole('tab', { name: /Questions/ }).click()
  await page.getByRole('button', { name: /The first group to be affected/ }).click()
  await page.locator('[data-pane="right"] [data-q="15"]').click()
  await expect(page.locator('[data-pane="right"] [data-q="15"]')).toContainText('vii')
})
