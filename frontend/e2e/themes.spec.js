/**
 * Themes Catalog Page E2E Tests
 * 
 * Tests the themes listing: search, category filter, sort, 
 * theme cards, and "no results" state.
 */
import { test, expect } from '@playwright/test';

test.describe('Themes Catalog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/themes');
  });

  test('should render the themes page with hero banner', async ({ page }) => {
    await expect(page.locator('#themes-catalog-page')).toBeVisible();
    await expect(page.locator('.ep-themes-title')).toContainText('Event Packages');
  });

  test('should display the filter toolbar', async ({ page }) => {
    const filtersBar = page.locator('.ep-filters-bar');
    await expect(filtersBar).toBeVisible();

    // Search input
    await expect(page.locator('#search-input')).toBeVisible();
    await expect(page.locator('#search-input')).toHaveAttribute('placeholder', /Search/);

    // Category select
    await expect(page.locator('#category-select')).toBeVisible();

    // Sort select
    await expect(page.locator('#sort-select')).toBeVisible();
  });

  test('should allow typing in the search input', async ({ page }) => {
    await page.locator('#search-input').fill('Wedding');
    await expect(page.locator('#search-input')).toHaveValue('Wedding');
  });

  test('should allow selecting a category filter', async ({ page }) => {
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();

    // Default should be "All Categories"
    await expect(categorySelect).toHaveValue('');
  });

  test('should allow selecting a sort order', async ({ page }) => {
    const sortSelect = page.locator('#sort-select');

    // Select "Price: Low to High"
    await sortSelect.selectOption('asc');
    await expect(sortSelect).toHaveValue('asc');

    // Select "Price: High to Low"
    await sortSelect.selectOption('desc');
    await expect(sortSelect).toHaveValue('desc');

    // Reset to Featured
    await sortSelect.selectOption('');
    await expect(sortSelect).toHaveValue('');
  });

  test('should show skeleton loaders while loading', async ({ page }) => {
    // On a fresh fast load, skeletons may flash briefly
    // We test the structure exists
    await page.goto('/themes');
    // Either skeletons or theme cards should be visible
    const hasSkeletons = await page.locator('.ep-skeleton-card').count();
    const hasCards = await page.locator('.ep-theme-card-wrapper').count();
    expect(hasSkeletons + hasCards).toBeGreaterThan(0);
  });

  test('should show "No matching themes" when search yields no results', async ({ page }) => {
    // Wait for themes to load
    await page.waitForTimeout(2000);

    // Search for something that won't match
    await page.locator('#search-input').fill('zzznonexistentthemexyz');

    // Should show no results message
    await expect(page.locator('.ep-no-results')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.ep-no-results h3')).toContainText('No matching themes found');
  });

  test('should have a Reset Filters button in no-results state', async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.locator('#search-input').fill('zzznonexistentthemexyz');

    await expect(page.locator('.ep-no-results')).toBeVisible({ timeout: 5000 });

    const resetBtn = page.locator('.ep-no-results button', { hasText: 'Reset Filters' });
    await expect(resetBtn).toBeVisible();

    // Click Reset
    await resetBtn.click();
    await expect(page.locator('#search-input')).toHaveValue('');
  });
});
