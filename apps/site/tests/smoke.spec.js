import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/CSS-Only Showcase/)
})

test('modal can be opened', async ({ page }) => {
  await page.goto('/')

  // Look for a modal trigger button
  const modalButton = page.locator('button[commandfor]').first()
  if ((await modalButton.count()) > 0) {
    await modalButton.click()

    // Check that dialog is open
    const dialog = page.locator('dialog[open]')
    await expect(dialog).toBeVisible()
  }
})

test('invoker dialog opens and closes from HTML', async ({ page }) => {
  await page.goto('/features/invoker-commands')

  const open = page.getByRole('button', { name: 'Open with HTML' })
  const dialog = page.locator('dialog#invoker-dialog')

  await open.click()
  await expect(dialog).toBeVisible()

  await dialog.locator('button[command="close"]').click()
  await expect(dialog).toBeHidden()

  await open.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('useState dialog opens after hydration', async ({ page }) => {
  await page.goto('/features/invoker-commands')

  const open = page.getByRole('button', { name: 'Open with JavaScript' })
  const dialog = page.locator('dialog#state-dialog')

  await expect(async () => {
    if (!(await dialog.isVisible())) await open.click()
    await expect(dialog).toBeVisible()
  }).toPass()

  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
})
