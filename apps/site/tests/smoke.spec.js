import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/CSS-Only Showcase/)
})

test('modal can be opened', async ({ page }) => {
  await page.goto('/')
  
  // Look for a modal trigger button
  const modalButton = page.locator('button[commandfor]').first()
  if (await modalButton.count() > 0) {
    await modalButton.click()
    
    // Check that dialog is open
    const dialog = page.locator('dialog[open]')
    await expect(dialog).toBeVisible()
  }
})
