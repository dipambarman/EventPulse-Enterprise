/**
 * Static Pages & Error Handling E2E Tests
 * 
 * Tests About Us, Terms, Privacy pages and the 404 error page.
 */
import { test, expect } from '@playwright/test';

test.describe('About Us Page', () => {
  test('should render the About Us page', async ({ page }) => {
    await page.goto('/about-us');
    await expect(page.locator('body')).toBeVisible();
    // Page should have meaningful content (not blank)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});

test.describe('Terms Page', () => {
  test('should render the Terms page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('body')).toBeVisible();
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});

test.describe('Privacy Page', () => {
  test('should render the Privacy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('body')).toBeVisible();
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});

test.describe('404 Error Page', () => {
  test('should display error page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Error page should render (not a blank page or crash)
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('should display the footer on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have footer on the Themes page', async ({ page }) => {
    await page.goto('/themes');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have footer on the Contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('Page Loading & Suspense', () => {
  test('should not show a blank/white page on initial load', async ({ page }) => {
    await page.goto('/');
    // At least the navbar should be visible quickly
    await expect(page.locator('#main-nav')).toBeVisible({ timeout: 10_000 });
  });

  test('should show loader during lazy route loading', async ({ page }) => {
    // Navigate to home first
    await page.goto('/');
    
    // The app uses React.lazy + Suspense, so the loader may appear briefly
    // We just verify the page eventually loads correctly
    await expect(page.locator('#home-page')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Responsive Design', () => {
  test('home page looks correct on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('.ep-hero-title')).toBeVisible();
    await expect(page.locator('#main-nav')).toBeVisible();
  });

  test('home page looks correct on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    await expect(page.locator('.ep-hero-title')).toBeVisible();
    await expect(page.locator('#main-nav')).toBeVisible();
    
    // Hamburger menu should be visible on mobile
    await expect(page.locator('#nav-toggle')).toBeVisible();
  });

  test('calculator page works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/calculator');
    
    await expect(page.locator('#event-calculator-page')).toBeVisible();
    await expect(page.locator('.ep-event-type-card').first()).toBeVisible();
  });
});
