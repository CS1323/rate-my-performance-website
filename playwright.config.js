// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',

  // Run all tests serially — tests share a real database
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: 'html',

  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start both servers automatically if they are not already running.
  // In local dev (reuseExistingServer: true) the servers are reused when
  // already up, so you won't pay the cold-start penalty on every run.
  webServer: [
    {
      command: 'npm run dev',
      cwd: './server',
      url: 'http://127.0.0.1:5001/api/posts/drew-dumontier',
      reuseExistingServer: !process.env.CI,
      timeout: 90_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      cwd: './client',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
