/**
 * Home Page E2E Tests
 * 
 * Tests the main landing page: hero section, navigation,
 * stats counter, theme showcase, and CTA buttons.
 */
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page with hero section', async ({ page }) => {
    // Hero title should be visible
    await expect(page.locator('.ep-hero-title')).toBeVisible();
    await expect(page.locator('.ep-hero-title')).toContainText('Craft Unforgettable');
    await expect(page.locator('.ep-hero-title-gradient')).toContainText('Events');
  });

  test('should display the EventPulse badge', async ({ page }) => {
    await expect(page.locator('.ep-hero-badge')).toContainText('#1 Event Management Platform');
  });

  test('should have working CTA buttons in hero', async ({ page }) => {
    // "Estimate Your Event Cost" button
    const calcBtn = page.locator('#hero-cta-calculator');
    await expect(calcBtn).toBeVisible();
    await calcBtn.click();
    await expect(page).toHaveURL(/\/calculator/);
  });

  test('should navigate to Themes page from hero CTA', async ({ page }) => {
    const themesBtn = page.locator('#hero-cta-themes');
    await expect(themesBtn).toBeVisible();
    await themesBtn.click();
    await expect(page).toHaveURL(/\/themes/);
  });

  test('should display stats section with counter cards', async ({ page }) => {
    const statsSection = page.locator('#stats-section');
    await expect(statsSection).toBeVisible();

    // Should have 4 stat cards
    const statCards = page.locator('.ep-stat-card');
    await expect(statCards).toHaveCount(4);

    // Check stat labels
    await expect(page.locator('.ep-stat-label').nth(0)).toContainText('Events Delivered');
    await expect(page.locator('.ep-stat-label').nth(1)).toContainText('Business Partners');
    await expect(page.locator('.ep-stat-label').nth(2)).toContainText('Client Satisfaction');
    await expect(page.locator('.ep-stat-label').nth(3)).toContainText('Cities Covered');
  });

  test('should display theme showcase section with category tabs', async ({ page }) => {
    const showcase = page.locator('#themes-showcase');
    await expect(showcase).toBeVisible();
    await expect(page.locator('#category-tabs')).toBeVisible();

    // Should have category filter buttons
    const categoryTabs = page.locator('.ep-category-tab');
    await expect(categoryTabs.first()).toContainText('All');
  });

  test('should filter themes when clicking category tabs', async ({ page }) => {
    // Click a category tab and verify it gets active class
    const birthdayTab = page.locator('.ep-category-tab', { hasText: 'Birthday' });
    await birthdayTab.click();
    await expect(birthdayTab).toHaveClass(/active/);
  });

  test('should display "Why Choose Us" features section', async ({ page }) => {
    const whyUs = page.locator('#why-us-section');
    await expect(whyUs).toBeVisible();
    await expect(page.locator('.ep-feature-card')).toHaveCount(6);
  });

  test('should display testimonials section', async ({ page }) => {
    const testimonials = page.locator('#testimonials-section');
    await expect(testimonials).toBeVisible();

    // 3 testimonial cards
    const cards = page.locator('.ep-testimonial-card');
    await expect(cards).toHaveCount(3);
  });

  test('should display bottom CTA section', async ({ page }) => {
    const cta = page.locator('#cta-section');
    await expect(cta).toBeVisible();
    await expect(page.locator('.ep-cta-title')).toContainText('Ready to Transform');

    // CTA buttons should work
    const ctaCalcBtn = page.locator('#cta-calculator');
    await expect(ctaCalcBtn).toBeVisible();
  });

  test('should have trust badges with avatars', async ({ page }) => {
    await expect(page.locator('.ep-trust-avatars')).toBeVisible();
    await expect(page.locator('.ep-trust-text')).toContainText('500+');
  });

  test('should display the "View All Packages" link', async ({ page }) => {
    const viewAllBtn = page.locator('#view-all-themes');
    await expect(viewAllBtn).toBeVisible();
    await viewAllBtn.click();
    await expect(page).toHaveURL(/\/themes/);
  });
});
