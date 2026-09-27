import { expect, test } from '@playwright/test'
import { beginTest, submitSection } from './helpers'

const ESSAY =
  'The line graph compares how many households owned desktop computers, laptops and tablets between 2000 and 2020.\n\nOverall, laptops became the most common device, while desktop ownership fell after 2008.'

test('full mock runs Listening, Reading and Writing back to back', async ({ page }) => {
  await beginTest(page, 'mock-1', /Full mock test/)

  // Listening
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Start test' }).click()
  await submitSection(page)

  // Reading follows immediately, like the real test.
  await expect(page.getByText('Your Listening answers have been submitted.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reading' })).toBeVisible()
  await page.getByRole('button', { name: 'Start test' }).click()
  await submitSection(page)

  // Writing
  await expect(page.getByRole('heading', { name: 'Writing' })).toBeVisible()
  await page.getByRole('button', { name: 'Start test' }).click()
  await page.getByRole('textbox', { name: 'Answer for Part 1' }).fill(ESSAY)
  await expect(page.getByText('Word count: 30')).toBeVisible()
  await page.getByRole('button', { name: /Part 2/ }).click()
  await page.getByRole('textbox', { name: 'Answer for Part 2' }).fill('I agree that students benefit from studying other subjects.')
  await page.getByRole('button', { name: /^Submit$/ }).click()
  await expect(page.getByText(/below the minimum word count/)).toBeVisible()
  await page.getByRole('button', { name: 'Submit answers' }).click()

  // Results
  await expect(page).toHaveURL(/\/results\//)
  await expect(page.getByText('The overall band needs all four skills.')).toBeVisible()
  await page.getByRole('tab', { name: /Writing/ }).click()
  await expect(page.getByText('An overview of the main trends')).toBeVisible()
  for (const radiogroup of await page.getByRole('radiogroup').all()) await radiogroup.getByRole('radio', { name: '6' }).click()
  await expect(page.getByText('Estimated Writing band')).toBeVisible()

  // Progress page lists the attempt.
  await page.getByRole('link', { name: 'Go to my progress' }).click()
  await expect(page.getByRole('cell', { name: 'Full Mock Test 1' })).toBeVisible()
})
