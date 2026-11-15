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

const unfinishedFeatures = [
  '/features/view-transitions',
  '/features/custom-select',
  '/features/css-carousel',
  '/features/sibling-functions',
]

for (const path of unfinishedFeatures) {
  test(`${path} shows a coming soon state`, async ({ page }) => {
    await page.goto(path)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Coming soon', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to the showcase' })).toHaveAttribute(
      'href',
      '/'
    )
    await expect(page.getByText(/TODO/)).toHaveCount(0)
  })
}

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

test('anchored popover opens from HTML and stays on the button', async ({ page }) => {
  await page.goto('/features/anchor-positioning')

  const open = page.getByRole('button', { name: 'Open with HTML' })
  const popover = page.locator('#anchor-note')

  await open.click()
  await expect(popover).toBeVisible()

  const buttonBox = await open.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(buttonBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  if (buttonBox && popoverBox) {
    const gap = buttonBox.y - (popoverBox.y + popoverBox.height)
    expect(gap).toBeGreaterThan(-1)
    expect(gap).toBeLessThan(24)
    const buttonCenter = buttonBox.x + buttonBox.width / 2
    const popoverCenter = popoverBox.x + popoverBox.width / 2
    expect(Math.abs(buttonCenter - popoverCenter)).toBeLessThan(24)
  }

  await page.keyboard.press('Escape')
  await expect(popover).toBeHidden()
})

test('measured popover tracks the button after hydration', async ({ page }) => {
  await page.goto('/features/anchor-positioning')

  const open = page.getByRole('button', { name: 'Open with JavaScript' })
  const popover = page.locator('#measured-note')

  await expect(async () => {
    if (!(await popover.isVisible())) await open.click()
    await expect(popover).toBeVisible()
  }).toPass()

  const buttonBox = await open.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(buttonBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  if (buttonBox && popoverBox) {
    const gap = buttonBox.y - (popoverBox.y + popoverBox.height)
    expect(gap).toBeGreaterThan(-1)
    expect(gap).toBeLessThan(24)
  }

  await page.keyboard.press('Escape')
  await expect(popover).toBeHidden()
})
