/**
 * Authentication E2E Tests
 * 
 * Tests the Login, Register, and Forgot Password pages:
 * form rendering, validation, error handling, navigation between auth flows.
 */
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render the login form correctly', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Login');

    // Email field
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    // Password field
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required', '');

    // Submit button
    await expect(page.locator('.login-btn')).toBeVisible();
    await expect(page.locator('.login-btn')).toContainText('Login');
  });

  test('should have a link to Forgot Password', async ({ page }) => {
    const forgotLink = page.locator('a', { hasText: 'Forgot Password?' });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should allow typing in email and password fields', async ({ page }) => {
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');

    await expect(page.locator('#email')).toHaveValue('test@example.com');
    await expect(page.locator('#password')).toHaveValue('password123');
  });

  test('should show error on invalid login attempt', async ({ page }) => {
    await page.locator('#email').fill('wrong@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('.login-btn').click();

    // Should display an error message
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 10_000 });
  });

  test('should not submit with empty fields (HTML5 validation)', async ({ page }) => {
    // Try submitting empty form — HTML5 required should prevent submission
    await page.locator('.login-btn').click();

    // Should still be on login page
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should render the registration form correctly', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Register');

    // All 4 form fields
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();

    // Submit button
    await expect(page.locator('.register-btn')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.locator('#username').fill('testuser');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('#confirmPassword').fill('differentPassword');
    await page.locator('.register-btn').click();

    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Passwords do not match');
  });

  test('should allow filling all registration fields', async ({ page }) => {
    await page.locator('#username').fill('newuser');
    await page.locator('#email').fill('newuser@example.com');
    await page.locator('#password').fill('SecureP@ss1');
    await page.locator('#confirmPassword').fill('SecureP@ss1');

    await expect(page.locator('#username')).toHaveValue('newuser');
    await expect(page.locator('#email')).toHaveValue('newuser@example.com');
    await expect(page.locator('#password')).toHaveValue('SecureP@ss1');
    await expect(page.locator('#confirmPassword')).toHaveValue('SecureP@ss1');
  });
});

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('should render forgot password form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Forgot Password');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('.login-btn')).toContainText('Send Reset Link');
  });

  test('should have a back to login link', async ({ page }) => {
    const backLink = page.locator('a', { hasText: 'Back to Login' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should allow entering email for password reset', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await expect(page.locator('#email')).toHaveValue('user@example.com');
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing /booking without auth', async ({ page }) => {
    await page.goto('/booking');
    await expect(page).toHaveURL(/\/login\?redirect/);
  });

  test('should redirect to login when accessing /client-portal without auth', async ({ page }) => {
    await page.goto('/client-portal');
    await expect(page).toHaveURL(/\/login\?redirect/);
  });

  test('should redirect to login when accessing /admin without auth', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?redirect/);
  });

  test('should redirect to login when accessing /payment without auth', async ({ page }) => {
    await page.goto('/payment');
    await expect(page).toHaveURL(/\/login\?redirect/);
  });
});
