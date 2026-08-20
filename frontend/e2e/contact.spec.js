/**
 * Contact Us Page E2E Tests
 * 
 * Tests the contact form, info cards, social links, and map section.
 */
import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should render the contact page hero', async ({ page }) => {
    await expect(page.locator('.hero-title')).toContainText('Contact Us');
    await expect(page.locator('.hero-subtitle')).toBeVisible();
  });

  test('should display contact information cards', async ({ page }) => {
    // Email
    await expect(page.locator('.contact-text', { hasText: 'Email' })).toBeVisible();
    await expect(page.locator('a[href="mailto:info@gueventplanner.com"]')).toBeVisible();

    // Phone
    await expect(page.locator('.contact-text', { hasText: 'Phone' })).toBeVisible();
    await expect(page.locator('a[href="tel:7635847253"]')).toBeVisible();

    // Location
    await expect(page.locator('.contact-text', { hasText: 'Location' })).toBeVisible();

    // Business Hours
    await expect(page.locator('.contact-text', { hasText: 'Business Hours' })).toBeVisible();
  });

  test('should display social media links', async ({ page }) => {
    const socialLinks = page.locator('.social-link');
    await expect(socialLinks).toHaveCount(4);
  });

  test('should render the contact form with all fields', async ({ page }) => {
    await expect(page.locator('.contact-form')).toBeVisible();

    // Name field
    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');

    // Email field
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Subject field
    const subjectInput = page.locator('#subject');
    await expect(subjectInput).toBeVisible();

    // Message field
    const messageArea = page.locator('#message');
    await expect(messageArea).toBeVisible();

    // Submit button
    await expect(page.locator('.submit-button')).toContainText('Send Message');
  });

  test('should allow filling the contact form', async ({ page }) => {
    await page.locator('#name').fill('John Doe');
    await page.locator('#email').fill('john@example.com');
    await page.locator('#subject').fill('Event Inquiry');
    await page.locator('#message').fill('I would like to know more about your corporate event packages.');

    await expect(page.locator('#name')).toHaveValue('John Doe');
    await expect(page.locator('#email')).toHaveValue('john@example.com');
    await expect(page.locator('#subject')).toHaveValue('Event Inquiry');
    await expect(page.locator('#message')).toHaveValue('I would like to know more about your corporate event packages.');
  });

  test('should show alert on form submission', async ({ page }) => {
    // Fill the form
    await page.locator('#name').fill('John Doe');
    await page.locator('#email').fill('john@example.com');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('Test message content');

    // Listen for dialog (alert)
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain("Thank you for your message");
      await dialog.accept();
    });

    // Submit
    await page.locator('.submit-button').click();
  });

  test('should display the map section', async ({ page }) => {
    const mapSection = page.locator('.map-section');
    await expect(mapSection).toBeVisible();
    await expect(page.locator('.map-info')).toContainText('Visit Our Office');
    await expect(page.locator('.directions-button')).toContainText('Get Directions');
  });
});
