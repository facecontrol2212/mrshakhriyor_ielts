import { expect, test } from '@playwright/test'
import { beginTest } from './helpers'

test.use({ permissions: ['microphone'] })

test('speaking records answers after each examiner question', async ({ page }) => {
  await beginTest(page, 'mock-1', /^Speaking/)
  await page.getByRole('button', { name: 'Allow microphone' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Start test' }).click()

  await expect(page.getByText('The examiner is speaking…')).toBeVisible()
  await expect(page.getByText('Recording', { exact: true })).toBeVisible({ timeout: 20_000 })
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByText('The examiner is speaking…')).toBeVisible()

  const stored = await page.waitForFunction(
    () =>
      new Promise<number>((resolve) => {
        const request = indexedDB.open('msi-recordings')
        request.onsuccess = () => {
          const count = request.result.transaction('blobs').objectStore('blobs').count()
          count.onsuccess = () => resolve(count.result)
        }
        request.onerror = () => resolve(0)
      }),
  )
  expect(await stored.jsonValue()).toBeGreaterThanOrEqual(1)
})
