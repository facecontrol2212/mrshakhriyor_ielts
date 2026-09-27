import { expect, test } from '@playwright/test'

test.describe('Public site', () => {
  test('home page leads to the first mock test', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('real exam')
    await page.getByRole('link', { name: /Start Full Mock Test 1/ }).first().click()
    await expect(page).toHaveURL(/\/tests\/mock-1$/)
    await expect(page.getByRole('heading', { name: 'Full Mock Test 1' })).toBeVisible()
  })

  test('language choice translates the site and is remembered', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'UZ' }).click()
    await expect(page.getByRole('link', { name: 'Testlar' }).first()).toBeVisible()
    await page.reload()
    await expect(page.getByRole('link', { name: 'Testlar' }).first()).toBeVisible()
    await page.getByRole('button', { name: 'RU' }).click()
    await expect(page.getByRole('link', { name: 'Тесты' }).first()).toBeVisible()
  })

  test('band calculator applies the rounding rule', async ({ page }) => {
    await page.goto('/band-calculator')
    await page.getByRole('spinbutton', { name: /Listening/ }).fill('35')
    await page.getByRole('spinbutton', { name: /Reading/ }).fill('33')
    await page.getByRole('combobox', { name: /Writing band/ }).selectOption('6')
    await page.getByRole('combobox', { name: /Speaking band/ }).selectOption('6.5')
    // (8.0 + 7.5 + 6.0 + 6.5) / 4 = 7.0
    await expect(page.getByText('= 7 → 7.0')).toBeVisible()
  })

  test('guides and unknown pages render', async ({ page }) => {
    await page.goto('/articles')
    await page.getByRole('link', { name: /True, False or Not Given/ }).click()
    await expect(page.getByRole('heading', { name: /True, False or Not Given/ })).toBeVisible()
    await page.goto('/no-such-page')
    await expect(page.getByText('This page is not on the test')).toBeVisible()
  })

  test('progress page starts empty and offers a backup', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText(/No tests yet/).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Export progress' })).toBeVisible()
  })
})
