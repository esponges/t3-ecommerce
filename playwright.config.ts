import { defineConfig } from '@playwright/test';
import { devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'src/__tests__/e2e/',

  // add global setup (auth mainly)
  globalSetup: 'src/__tests__/e2e/setup/global.ts',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  // forbidOnly: !!process.env.CI,

  // Retry on CI only.
  // retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  // workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  // reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://127.0.0.1:3000',

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
  // Run your local dev server before starting the tests.
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
