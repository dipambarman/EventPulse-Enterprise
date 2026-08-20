/**
 * Event Calculator E2E Tests
 * 
 * Tests the multi-step cost estimator wizard: event type selection,
 * guest count slider, package tier selection, add-ons, and price breakdown.
 */
import { test, expect } from '@playwright/test';

test.describe('Event Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('should render the calculator page with hero', async ({ page }) => {
    await expect(page.locator('#event-calculator-page')).toBeVisible();
    await expect(page.locator('.ep-calc-title')).toContainText('Instant Event Cost Estimator');
  });

  test('should display 4-step progress bar', async ({ page }) => {
    const steps = page.locator('.ep-calc-step-item');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText('Event Type');
    await expect(steps.nth(1)).toContainText('Package Tier');
    await expect(steps.nth(2)).toContainText('Add-On Services');
    await expect(steps.nth(3)).toContainText('Quote Breakdown');
  });

  test('should start on Step 1 - Event Type & Capacity', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Select Event Category');

    // 5 event type cards
    const eventCards = page.locator('.ep-event-type-card');
    await expect(eventCards).toHaveCount(5);
  });

  test('should show Wedding selected by default', async ({ page }) => {
    const weddingCard = page.locator('.ep-event-type-card', { hasText: 'Wedding' });
    await expect(weddingCard).toHaveClass(/selected/);
  });

  test('should allow selecting a different event type', async ({ page }) => {
    const corporateCard = page.locator('.ep-event-type-card', { hasText: 'Corporate' });
    await corporateCard.click();
    await expect(corporateCard).toHaveClass(/selected/);

    // Wedding should no longer be selected
    const weddingCard = page.locator('.ep-event-type-card', { hasText: 'Wedding' });
    await expect(weddingCard).not.toHaveClass(/selected/);
  });

  test('should display guest count slider with default value', async ({ page }) => {
    const slider = page.locator('.ep-range-input');
    await expect(slider).toBeVisible();

    // Default is 100 guests
    const badge = page.locator('.ep-guest-count-badge');
    await expect(badge).toContainText('100 Guests');
  });

  test('should display duration buttons', async ({ page }) => {
    const durationBtns = page.locator('.ep-duration-btn');
    await expect(durationBtns).toHaveCount(4); // 1, 2, 3, 5 days

    // 1 Day should be active by default
    await expect(durationBtns.first()).toHaveClass(/active/);
    await expect(durationBtns.first()).toContainText('1 Day');
  });

  test('should change duration when clicking duration buttons', async ({ page }) => {
    const twoDaysBtn = page.locator('.ep-duration-btn', { hasText: '2 Days' });
    await twoDaysBtn.click();
    await expect(twoDaysBtn).toHaveClass(/active/);
  });

  test('should display the Live Price Summary sidebar', async ({ page }) => {
    const sidebar = page.locator('.ep-calc-sidebar-card');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText('Live Price Summary');
    await expect(sidebar).toContainText('Wedding');
    await expect(sidebar).toContainText('100 People');
    await expect(sidebar).toContainText('premium');
  });

  test('should navigate to Step 2 when clicking Next', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();
    await expect(page.locator('h2')).toContainText('Select Package Experience Tier');
  });

  test('Step 2: should display 3 tier cards', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();

    const tierCards = page.locator('.ep-tier-card');
    await expect(tierCards).toHaveCount(3);

    await expect(page.locator('.ep-tier-card', { hasText: 'Standard Tier' })).toBeVisible();
    await expect(page.locator('.ep-tier-card', { hasText: 'Premium Tier' })).toBeVisible();
    await expect(page.locator('.ep-tier-card', { hasText: 'Exclusive VIP' })).toBeVisible();
  });

  test('Step 2: should have Premium pre-selected', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();

    const premiumCard = page.locator('.ep-tier-card', { hasText: 'Premium Tier' });
    await expect(premiumCard).toHaveClass(/selected/);
  });

  test('Step 2: should allow selecting a different tier', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();

    const exclusiveCard = page.locator('.ep-tier-card', { hasText: 'Exclusive VIP' });
    await exclusiveCard.click();
    await expect(exclusiveCard).toHaveClass(/selected/);
  });

  test('Step 2: should navigate back to Step 1', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();
    await page.locator('button', { hasText: '← Back' }).click();
    await expect(page.locator('h2')).toContainText('Select Event Category');
  });

  test('Step 3: should display add-on service cards', async ({ page }) => {
    // Navigate through Step 1 → Step 2 → Step 3
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();
    await page.locator('button', { hasText: 'Next: Add-On Services' }).click();

    await expect(page.locator('h2')).toContainText('Customize Add-On Services');

    // 6 add-on cards
    const addonCards = page.locator('.ep-addon-card');
    await expect(addonCards).toHaveCount(6);
  });

  test('Step 3: should toggle add-on selection', async ({ page }) => {
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();
    await page.locator('button', { hasText: 'Next: Add-On Services' }).click();

    // Catering should be pre-selected
    const cateringCard = page.locator('.ep-addon-card', { hasText: 'Gourmet Catering' });
    await expect(cateringCard).toHaveClass(/selected/);

    // Click to deselect
    await cateringCard.click();
    await expect(cateringCard).not.toHaveClass(/selected/);

    // Click to re-select
    await cateringCard.click();
    await expect(cateringCard).toHaveClass(/selected/);
  });

  test('Step 4: should display the full quote breakdown', async ({ page }) => {
    // Navigate through all steps
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();
    await page.locator('button', { hasText: 'Next: Add-On Services' }).click();
    await page.locator('button', { hasText: 'View Detailed Breakdown' }).click();

    await expect(page.locator('h2')).toContainText('Itemized Estimate');

    // Should display price breakdown lines
    await expect(page.locator('.ep-quote-summary-box')).toBeVisible();
    const quoteLineCount = await page.locator('.ep-quote-line').count();
    expect(quoteLineCount).toBeGreaterThan(2);
    await expect(page.locator('.ep-total-price')).toBeVisible();

    // Should show deposit
    await expect(page.locator('.ep-quote-deposit-callout')).toContainText('25%');
  });

  test('Step 4: sidebar prices should update dynamically', async ({ page }) => {
    // Get initial price from sidebar
    const priceText = await page.locator('.ep-price-amount').textContent();

    // Change event type to Birthday (cheaper)
    const birthdayCard = page.locator('.ep-event-type-card', { hasText: 'Birthday' });
    await birthdayCard.click();

    // Price should change in sidebar
    const newPriceText = await page.locator('.ep-price-amount').textContent();
    expect(priceText).not.toBe(newPriceText);
  });

  test('full wizard flow: should complete all steps', async ({ page }) => {
    // Step 1: Select Corporate, change duration
    await page.locator('.ep-event-type-card', { hasText: 'Corporate' }).click();
    await page.locator('.ep-duration-btn', { hasText: '2 Days' }).click();
    await page.locator('button', { hasText: 'Next: Choose Tier' }).click();

    // Step 2: Select Exclusive
    await page.locator('.ep-tier-card', { hasText: 'Exclusive VIP' }).click();
    await page.locator('button', { hasText: 'Next: Add-On Services' }).click();

    // Step 3: Toggle lighting on
    const lightingCard = page.locator('.ep-addon-card', { hasText: 'Laser Lighting' });
    await lightingCard.click();
    await page.locator('button', { hasText: 'View Detailed Breakdown' }).click();

    // Step 4: Verify summary
    await expect(page.locator('.ep-quote-summary-box')).toBeVisible();
    await expect(page.locator('.ep-total-price')).toBeVisible();

    // Should have "Reserve Date with Deposit" button
    await expect(page.locator('button', { hasText: 'Reserve Date with Deposit' })).toBeVisible();
  });
});
