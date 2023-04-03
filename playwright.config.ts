import { defineConfig } from '@playwright/test';
import { devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'src/__tests__/e2e/',

  // add global setup (auth mainly)
  globalSetup: 'src/__tests__/e2e/setup/global.ts',

  // Run all tests in parallel.
  fullyParallel: true,

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    // the PLAYWRIGHT_TEST_BASE_URL env var is set in the github action
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test.
    // trace: 'on-first-retry',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'src/__tests__/e2e/setup/storage-state.json',
      },
    },
  ],
});
