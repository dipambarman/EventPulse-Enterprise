/**
 * Navigation & Navbar E2E Tests
 * 
 * Tests the main navigation bar: links, logo, mobile menu toggle,
 * scroll behavior, auth buttons (Sign In / Get Started).
 */
import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the navbar with logo', async ({ page }) => {
    const navbar = page.locator('#main-nav');
    await expect(navbar).toBeVisible();

    const logo = page.locator('#nav-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('EventPulse');
  });

  test('should have all main navigation links', async ({ page }) => {
    const navMenu = page.locator('#nav-menu');
    await expect(navMenu).toBeVisible();

    const expectedLinks = ['Home', 'Themes', 'Cost Estimator', 'About', 'Contact'];
    for (const linkText of expectedLinks) {
      await expect(navMenu.locator('.ep-navbar-link', { hasText: linkText })).toBeVisible();
    }
  });

  test('should highlight active navigation link', async ({ page }) => {
    // Home should be active on the home page
    const homeLink = page.locator('.ep-navbar-link', { hasText: 'Home' });
    await expect(homeLink).toHaveClass(/active/);
  });

  test('should navigate to each page via navbar links', async ({ page }) => {
    // Navigate to Themes
    await page.locator('.ep-navbar-link', { hasText: 'Themes' }).click();
    await expect(page).toHaveURL(/\/themes/);

    // Navigate to Cost Estimator
    await page.locator('.ep-navbar-link', { hasText: 'Cost Estimator' }).click();
    await expect(page).toHaveURL(/\/calculator/);

    // Navigate to About
    await page.locator('.ep-navbar-link', { hasText: 'About' }).click();
    await expect(page).toHaveURL(/\/about-us/);

    // Navigate to Contact
    await page.locator('.ep-navbar-link', { hasText: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact/);

    // Navigate back Home via logo
    await page.locator('#nav-logo').click();
    await expect(page).toHaveURL('/');
  });

  test('should show auth buttons when not logged in', async ({ page }) => {
    const authSection = page.locator('#nav-auth');
    await expect(authSection).toBeVisible();

    await expect(authSection.locator('a', { hasText: 'Sign In' })).toBeVisible();
    await expect(authSection.locator('a', { hasText: 'Get Started' })).toBeVisible();
  });

  test('should navigate to login when clicking Sign In', async ({ page }) => {
    await page.locator('#nav-auth a', { hasText: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register when clicking Get Started', async ({ page }) => {
    await page.locator('#nav-auth a', { hasText: 'Get Started' }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should add scrolled class on scroll', async ({ page }) => {
    const navbar = page.locator('#main-nav');

    // Initially not scrolled
    await expect(navbar).not.toHaveClass(/ep-navbar-scrolled/);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(300);

    await expect(navbar).toHaveClass(/ep-navbar-scrolled/);
  });
});

test.describe('Navbar - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#nav-toggle');
    await expect(toggle).toBeVisible();
  });

  test('should toggle mobile menu when clicking hamburger', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#nav-toggle');
    const menuWrapper = page.locator('.ep-navbar-menu-wrapper');

    // Menu should not be active initially
    await expect(menuWrapper).not.toHaveClass(/active/);

    // Click toggle
    await toggle.click();
    await expect(menuWrapper).toHaveClass(/active/);
    await expect(toggle).toHaveClass(/open/);

    // Click again to close
    await toggle.click();
    await expect(menuWrapper).not.toHaveClass(/active/);
  });

  test('should close mobile menu when navigating', async ({ page }) => {
    await page.goto('/');

    // Open menu
    await page.locator('#nav-toggle').click();
    await expect(page.locator('.ep-navbar-menu-wrapper')).toHaveClass(/active/);

    // Click a link
    await page.locator('.ep-navbar-link', { hasText: 'Themes' }).click();
    await expect(page).toHaveURL(/\/themes/);

    // Menu should close
    await expect(page.locator('.ep-navbar-menu-wrapper')).not.toHaveClass(/active/);
  });
});
