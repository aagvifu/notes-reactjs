import React from "react";
import { Styled } from "./styled";

const E2ePlaywright = () => {
    return (
        <Styled.Page>
            <Styled.Title>E2E Testing with Playwright</Styled.Title>

            <Styled.Lead>
                <b>End-to-End (E2E) tests</b> verify the app as a user would: open a browser, visit pages,
                click/typing, network calls, and UI results. <b>Playwright</b> is a modern E2E framework
                that launches real browsers (Chromium, Firefox, WebKit), gives stable <i>locators</i>,
                <i>auto-waiting</i>, and an integrated <i>test runner</i>, <i>tracing</i>, and
                <i>parallelism</i>.
            </Styled.Lead>

            {/* 0) What is Playwright? */}
            <Styled.Section>
                <Styled.H2>What is Playwright?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Playwright Test Runner:</b> built-in test framework to define tests, fixtures,
                        reporters, retries, parallel workers, and CI integration.
                    </li>
                    <li>
                        <b>Browsers:</b> controls <i>Chromium</i>, <i>Firefox</i>, and <i>WebKit</i> (Safari engine).
                    </li>
                    <li>
                        <b>Auto-waiting:</b> Playwright waits for elements to be ready (attached, visible, stable)
                        before actions (<Styled.InlineCode>click</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>fill</Styled.InlineCode>) and assertions.
                    </li>
                    <li>
                        <b>Locators:</b> handles finding elements reliably (by role, label, test id, text, CSS).
                    </li>
                    <li>
                        <b>Tracing & screenshots:</b> capture recordings and debug failures with a visual timeline.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Core concepts & glossary */}
            <Styled.Section>
                <Styled.H2>Core Concepts & Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Headless vs Headed:</b> <i>Headless</i> runs without UI (faster); <i>Headed</i> shows the real browser window for debugging.
                    </li>
                    <li>
                        <b>BrowserContext:</b> an isolated browser state (cookies/localStorage). Use a fresh context per test to avoid leakage.
                    </li>
                    <li>
                        <b>Page:</b> a single tab within a context. Tests typically drive one or more pages.
                    </li>
                    <li>
                        <b>Locator:</b> a Playwright object that lazily finds elements and auto-waits for actions.
                    </li>
                    <li>
                        <b>Fixture:</b> reusable test setup/teardown or shared utilities injected into tests.
                    </li>
                    <li>
                        <b>Trace:</b> a debug artifact (screenshots, DOM snapshots, network, console) viewable in the Trace Viewer.
                    </li>
                    <li>
                        <b>Flakiness:</b> unstable tests that pass/fail randomly; minimize with auto-waiting, proper locators, and retries.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Install & scripts (reference) */}
            <Styled.Section>
                <Styled.H2>Install & Project Scripts</Styled.H2>
                <Styled.Small>
                    Add as dev dependencies and wire scripts. (If your project already has Playwright, keep only what you need.)
                </Styled.Small>
                <Styled.Pre>
                    {`# dev deps (JS)
npm i -D @playwright/test

# run once to download browsers
npx playwright install

# package.json scripts (example)
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",            // visual test runner
    "test:e2e:debug": "playwright test --debug",      // time travel debugger
    "test:e2e:update-snap": "playwright test --update-snapshots",
    "test:e2e:report": "playwright show-report"
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Minimal config */}
            <Styled.Section>
                <Styled.H2>Minimal Configuration</Styled.H2>
                <Styled.Pre>
                    {`// playwright.config.js
// JS config; if using TS, name it playwright.config.ts
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',               // where your *.spec files live
  timeout: 30_000,                // per-test timeout
  retries: 1,                     // retry flaky tests once in CI
  use: {
    baseURL: 'http://localhost:5173',  // vite dev or preview URL
    trace: 'on-first-retry',           // collect trace on retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit',   use: { ...devices['Desktop Safari'] } },
  ],
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>projects</b> let you run the same tests across browsers/devices. <b>baseURL</b> avoids repeating full URLs.
                </Styled.Small>
            </Styled.Section>

            {/* 4) First test */}
            <Styled.Section>
                <Styled.H2>Your First Test</Styled.H2>
                <Styled.Pre>
                    {`// e2e/home.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Home', () => {
  test('loads and shows the main heading', async ({ page }) => {
    await page.goto('/');  // resolves against baseURL
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/react/i);
  });

  test('navigates via sidebar link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /jsx basics/i }).click();
    await expect(page).toHaveURL(/\\/jsx\\/basics/i);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/jsx basics/i);
  });
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>getByRole</b> uses ARIA roles—great for accessibility and stability. Assertions auto-wait until they pass or time out.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Locators — stable selectors */}
            <Styled.Section>
                <Styled.H2>Locators: Stable Selectors</Styled.H2>
                <Styled.List>
                    <li><b>By role:</b> <Styled.InlineCode>getByRole('button', {`{ '{'} name: /save/i {'}'}`})</Styled.InlineCode> — prefer semantic roles.</li>
                    <li><b>By label:</b> <Styled.InlineCode>getByLabel('Email')</Styled.InlineCode> — matches form labels.</li>
                    <li><b>By placeholder:</b> <Styled.InlineCode>getByPlaceholder('Search')</Styled.InlineCode> — quick for inputs.</li>
                    <li><b>By test id:</b> <Styled.InlineCode>getByTestId('cart-count')</Styled.InlineCode> — add <Styled.InlineCode>data-testid</Styled.InlineCode> only when needed.</li>
                    <li><b>Filter & nth:</b> <Styled.InlineCode>locator('.row').filter({`{ '{'}} hasText: 'Total' {{ '}'}`}).nth(0)</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// e2e/locators.spec.js
const { test, expect } = require('@playwright/test');

test('uses robust locators', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /save/i }).click();
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByPlaceholder('Search').fill('hooks');

  // test id example
  await expect(page.getByTestId('cart-count')).toHaveText('0');
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Test lifecycle, fixtures, auth */}
            <Styled.Section>
                <Styled.H2>Test Lifecycle, Fixtures & Auth</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Hooks:</b> <Styled.InlineCode>beforeAll</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>beforeEach</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>afterEach</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>afterAll</Styled.InlineCode> manage setup/cleanup.
                    </li>
                    <li>
                        <b>Fixtures:</b> reusable context (e.g., logged-in page). Use{" "}
                        <Styled.InlineCode>test.use</Styled.InlineCode> or custom fixtures.
                    </li>
                    <li>
                        <b>Storage state:</b> save login cookies/localStorage to skip UI login in every test.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// e2e/auth.setup.js (global setup to create storage state)
const { chromium } = require('@playwright/test');
module.exports = async config => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/login');
  await page.fill('[name=email]', 'demo@example.com');
  await page.fill('[name=password]', 'pass1234');
  await page.click('button[type=submit]');
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'e2e/.auth/state.json' });
  await browser.close();
};

// playwright.config.js (add)
globalSetup: require.resolve('./e2e/auth.setup.js'),
use: {
  baseURL: 'http://localhost:5173',
  storageState: 'e2e/.auth/state.json'
};`}
                </Styled.Pre>
                <Styled.Small>
                    With <b>storageState</b>, tests start already authenticated—fast and consistent.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Network mocking */}
            <Styled.Section>
                <Styled.H2>Network Mocking</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Why:</b> make tests fast, deterministic, and avoid hitting real APIs for known flows.
                    </li>
                    <li>
                        <b>How:</b> use <Styled.InlineCode>page.route()</Styled.InlineCode> to{" "}
                        <i>fulfill</i> (mock) or <i>continue</i> (pass through) requests.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// e2e/mock.spec.js
const { test, expect } = require('@playwright/test');

test('uses mocked products API', async ({ page }) => {
  await page.route('**/api/products', async route => {
    const body = [{ id: 1, name: 'Mock Phone', price: 199 }];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  });

  await page.goto('/products');
  await expect(page.getByText('Mock Phone')).toBeVisible();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Visual & accessibility checks */}
            <Styled.Section>
                <Styled.H2>Visual & Accessibility Checks</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Visual snapshot:</b>{" "}
                        <Styled.InlineCode>await expect(page).toHaveScreenshot()</Styled.InlineCode> captures a
                        baseline image to detect unexpected UI changes.
                    </li>
                    <li>
                        <b>a11y smoke:</b> integrate an accessibility scanner (e.g., axe) in E2E for quick regressions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// e2e/visual.spec.js
const { test, expect } = require('@playwright/test');

test('homepage visual snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home.png'); // run once with --update-snapshots
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Debugging failures */}
            <Styled.Section>
                <Styled.H2>Debugging Failures</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trace Viewer:</b> open with{" "}
                        <Styled.InlineCode>npx playwright show-report</Styled.InlineCode> and click a failed test
                        → <i>Trace</i>.
                    </li>
                    <li>
                        <b>Debug mode:</b>{" "}
                        <Styled.InlineCode>npx playwright test --debug</Styled.InlineCode> pauses before actions;
                        use <Styled.InlineCode>page.pause()</Styled.InlineCode> to drop into the inspector.
                    </li>
                    <li>
                        <b>Headed run:</b>{" "}
                        <Styled.InlineCode>npx playwright test --headed --project=Chromium</Styled.InlineCode> to see the browser.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Parallelism, retries, timeouts */}
            <Styled.Section>
                <Styled.H2>Parallelism, Retries & Timeouts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Workers:</b> number of parallel processes. Balance speed vs. server load.
                        <Styled.InlineCode>workers: 4</Styled.InlineCode>
                    </li>
                    <li>
                        <b>Retries:</b> re-run failing tests to reduce flakiness in CI.
                    </li>
                    <li>
                        <b>Expect timeout:</b> per-assertion timeout (default ~5s) can be tweaked per test if needed.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// in playwright.config.js
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 2 : undefined,
use: { actionTimeout: 10_000, expect: { timeout: 5_000 } }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) CI example (GitHub Actions) */}
            <Styled.Section>
                <Styled.H2>CI Example (GitHub Actions)</Styled.H2>
                <Styled.Pre>
                    {`# .github/workflows/e2e.yml
name: E2E
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      # Start your app (vite preview or dev). Example with preview:
      - run: npm run build && npm run preview & npx wait-on http://localhost:4173
      - run: npx playwright test
      - run: npx playwright show-report || true`}
                </Styled.Pre>
                <Styled.Small>
                    In CI, serve a built preview (fast, production-like). Use wait-on to ensure the server is ready before tests.
                </Styled.Small>
            </Styled.Section>

            {/* 12) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use role/label based locators first; add <Styled.InlineCode>data-testid</Styled.InlineCode> only when necessary.</li>
                    <li><b>Do</b> keep tests independent; reset backend state or mock network per test.</li>
                    <li><b>Do</b> capture traces/screenshots on failures to debug quickly.</li>
                    <li><b>Don’t</b> sleep with fixed timeouts—let Playwright auto-wait or assert on UI state.</li>
                    <li><b>Don’t</b> log in via UI for every test—reuse <b>storageState</b> to speed up suites.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Quick Reference */}
            <Styled.Section>
                <Styled.H2>Quick Reference</Styled.H2>
                <Styled.Pre>
                    {`// actions
await page.goto('/settings');
await page.getByRole('button', { name: /save/i }).click();
await page.fill('[name="email"]', 'user@example.com');

// assertions
await expect(page).toHaveURL(/\\/settings/);
await expect(page.getByText('Saved')).toBeVisible();

// debug
await page.pause();  // with: npx playwright test --debug`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                Summary: Playwright gives reliable, fast E2E tests with smart waiting, strong locators,
                and first-class debugging. Start small (one happy path), reuse authentication via storage
                state, mock critical APIs for determinism, and scale with projects, retries, and CI.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default E2ePlaywright;
