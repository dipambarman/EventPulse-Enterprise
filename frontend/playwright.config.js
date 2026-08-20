// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for EventPulse Frontend
 * 
 * Tests run against the Vite dev server (auto-started via webServer config).
 * Uses Chromium only for fast local development.
 * 
 * Run all tests:    npx playwright test
 * Run with UI:      npx playwright test --ui
 * Run specific:     npx playwright test tests/home.spec.js
 * Debug mode:       npx playwright test --debug
 * View report:      npx playwright show-report
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Maximum time for the entire test suite */
  timeout: 30_000,
  
  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  /* Shared settings for all tests */
  use: {
    /* Base URL for navigation actions like `page.goto('/')` */
    baseURL: 'http://localhost:5173',
    
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record trace on first retry (useful for debugging) */
    trace: 'on-first-retry',
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Auto-start the Vite dev server before running tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
