import React from "react";
import { Styled } from "./styled";

const E2eCypress = () => {
    return (
        <Styled.Page>
            <Styled.Title>End-to-End (E2E) Testing with Cypress</Styled.Title>

            <Styled.Lead>
                <b>E2E testing</b> verifies your app the way a real user would—by driving the browser and
                asserting on the final UI and network side-effects. <b>Cypress</b> is a test runner that
                runs inside the browser, giving <em>automatic waiting</em>, <em>time-travel debugging</em>,
                and a simple command API.
            </Styled.Lead>

            {/* 1) Key Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions (clear & precise)</Styled.H2>
                <Styled.List>
                    <li><b>End-to-End (E2E) Test:</b> A test that exercises the app through the UI and browser APIs, from user action to final effect (UI or network).</li>
                    <li><b>Spec file:</b> A test file (e.g., <Styled.InlineCode>*.cy.js/ts</Styled.InlineCode>) containing suites and tests.</li>
                    <li><b>Suite:</b> A group of tests created with <Styled.InlineCode>describe()</Styled.InlineCode>.</li>
                    <li><b>Test:</b> An individual case created with <Styled.InlineCode>it()</Styled.InlineCode> or <Styled.InlineCode>test()</Styled.InlineCode>.</li>
                    <li><b>Assertion:</b> A check that must be true (e.g., <Styled.InlineCode>cy.contains('Welcome')</Styled.InlineCode>).</li>
                    <li><b>Selector:</b> A way to find elements (e.g., <Styled.InlineCode>[data-cy="submit"]</Styled.InlineCode>) in the DOM.</li>
                    <li><b>Command queue:</b> Cypress schedules commands (e.g., <Styled.InlineCode>cy.get()</Styled.InlineCode>) and runs them with built-in retries and waits.</li>
                    <li><b>Automatic waiting:</b> Cypress retries commands/assertions until they pass or time out—no manual <Styled.InlineCode>sleep()</Styled.InlineCode> needed.</li>
                    <li><b>Fixture:</b> A static file (JSON, etc.) used as test data (<Styled.InlineCode>cypress/fixtures</Styled.InlineCode>).</li>
                    <li><b>Stub/Spy:</b> Test doubles—stubs replace a function/endpoint; spies observe calls.</li>
                    <li><b>Intercept:</b> Cypress API (<Styled.InlineCode>cy.intercept()</Styled.InlineCode>) to observe or mock network requests.</li>
                    <li><b>Flaky test:</b> A test that sometimes passes and sometimes fails without code changes (usually timing or selector issues).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why Cypress */}
            <Styled.Section>
                <Styled.H2>Why Cypress?</Styled.H2>
                <Styled.List>
                    <li><b>Runs in the browser:</b> See the app and test side-by-side, with <i>time-travel</i> snapshots.</li>
                    <li><b>Automatic waiting & retries:</b> Less manual timing code; fewer flakes when used correctly.</li>
                    <li><b>Great DX:</b> Live reloading, readable failures, and helpful screenshots/videos in CI.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) File Structure */}
            <Styled.Section>
                <Styled.H2>Project Structure (typical)</Styled.H2>
                <Styled.Pre>
                    {`cypress/
  e2e/
    home.cy.js
    login.cy.js
  fixtures/
    user.json
  support/
    e2e.js          // global hooks & custom commands
cypress.config.js   // baseUrl, viewport, retries, etc.`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Spec files</b> live in <Styled.InlineCode>cypress/e2e</Styled.InlineCode>. Put reusable helpers in{" "}
                    <Styled.InlineCode>cypress/support</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) First Test */}
            <Styled.Section>
                <Styled.H2>Your First Test (smoke)</Styled.H2>
                <Styled.Pre>
                    {`// cypress/e2e/home.cy.js
describe('Home Page', () => {
  it('loads and shows the title', () => {
    cy.visit('/');                               // baseUrl + '/'
    cy.findByRole('heading', { name: /react notes/i }); // if using @testing-library/cypress
    // or: cy.contains('React Notes');           // minimal assertion
  });
});`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer <b>role-based queries</b> (via <Styled.InlineCode>@testing-library/cypress</Styled.InlineCode>) for accessibility.
                    Otherwise use a stable <Styled.InlineCode>data-cy</Styled.InlineCode> attribute.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Stable Selectors */}
            <Styled.Section>
                <Styled.H2>Stable Selectors</Styled.H2>
                <Styled.List>
                    <li><b>Do:</b> add <Styled.InlineCode>data-cy</Styled.InlineCode> attributes to important elements.</li>
                    <li><b>Don't:</b> rely on CSS classes or text that frequently changes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// in your app markup
<button data-cy="nav-home">Home</button>

// in the test
cy.get('[data-cy="nav-home"]').click();`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Intercept & Mocking */}
            <Styled.Section>
                <Styled.H2>Network: Observe or Mock with <code>cy.intercept()</code></Styled.H2>
                <Styled.List>
                    <li><b>Observe:</b> let the real request happen, make assertions on it.</li>
                    <li><b>Mock:</b> return fixture data to test edge cases deterministically.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Observe a real GET
cy.intercept('GET', '/api/notes').as('getNotes');
cy.visit('/notes');
cy.wait('@getNotes').its('response.statusCode').should('eq', 200);

// Mock a GET with fixture
cy.intercept('GET', '/api/notes', { fixture: 'notes.json' }).as('getNotesMock');
cy.visit('/notes');
cy.wait('@getNotesMock');
cy.contains('My First Note');`}
                </Styled.Pre>
                <Styled.Small>
                    Use <b>fixtures</b> for predictable tests. Keep separate specs for “real API” smoke vs “mocked” flows.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Custom Commands */}
            <Styled.Section>
                <Styled.H2>Custom Commands (reuse flows)</Styled.H2>
                <Styled.Pre>
                    {`// cypress/support/e2e.js
Cypress.Commands.add('login', (email, password) => {
  cy.session([email], () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password, { log: false });
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// usage in spec
cy.login('user@example.com', 'Secret#123');`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>cy.session()</Styled.InlineCode> caches auth between tests for speed and stability.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Fixtures & Env */}
            <Styled.Section>
                <Styled.H2>Fixtures & Environment Variables</Styled.H2>
                <Styled.Pre>
                    {`// cypress/fixtures/user.json
{ "email": "demo@site.com", "name": "Demo User" }

// in spec
cy.fixture('user').then((u) => {
  cy.get('[data-cy="email"]').type(u.email);
});

// cypress.config.js (snippet)
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: { API_URL: 'http://localhost:4000' },
  },
});`}
                </Styled.Pre>
                <Styled.Small>
                    Access env via <Styled.InlineCode>Cypress.env('API_URL')</Styled.InlineCode>. Keep secrets in CI, not in git.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Flake Reduction */}
            <Styled.Section>
                <Styled.H2>Reducing Flaky Tests</Styled.H2>
                <Styled.List>
                    <li><b>Assert UI that users see:</b> text, roles, visible elements—not internal state.</li>
                    <li><b>Avoid fixed waits:</b> don't use <Styled.InlineCode>cy.wait(1000)</Styled.InlineCode>. Prefer query + assertion; Cypress will retry.</li>
                    <li><b>Use stable selectors:</b> <Styled.InlineCode>data-cy</Styled.InlineCode> everywhere critical.</li>
                    <li><b>Control network:</b> mock or seed test data for deterministic scenarios.</li>
                    <li><b>Reset state:</b> use <Styled.InlineCode>cy.session</Styled.InlineCode> and seed/cleanup hooks if your app stores auth or data.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep E2E specs small and focused on critical user flows.</li>
                    <li><b>Do</b> prefer semantic/role queries for accessibility.</li>
                    <li><b>Do</b> isolate “mocked” vs “real API” specs to make failures meaningful.</li>
                    <li><b>Don't</b> test implementation details (classes, internals).</li>
                    <li><b>Don't</b> stack multiple unrelated assertions in one test—failures become hard to debug.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Example Flow */}
            <Styled.Section>
                <Styled.H2>Example Flow: Create Note (mocked)</Styled.H2>
                <Styled.Pre>
                    {`// cypress/e2e/notes-create.cy.js
describe('Notes - Create', () => {
  it('creates a note and shows it in the list', () => {
    cy.intercept('GET', '/api/notes', { fixture: 'notes-empty.json' }).as('getNotes');
    cy.intercept('POST', '/api/notes', (req) => {
      expect(req.body).to.have.keys(['title', 'content']);
      req.reply({ id: 'n_123', ...req.body });
    }).as('createNote');

    cy.visit('/notes');
    cy.wait('@getNotes');
    cy.get('[data-cy="new-note"]').click();
    cy.get('[data-cy="note-title"]').type('E2E with Cypress');
    cy.get('[data-cy="note-content"]').type('This is reliable and fast.');
    cy.get('[data-cy="save-note"]').click();

    cy.wait('@createNote').its('response.statusCode').should('eq', 200);
    cy.contains('E2E with Cypress'); // appears in the list
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) CI & Headless */}
            <Styled.Section>
                <Styled.H2>CI &amp; Headless Runs</Styled.H2>
                <Styled.List>
                    <li><b>Headless:</b> <Styled.InlineCode>cypress run</Styled.InlineCode> (no GUI) for CI. Artifacts: screenshots/videos on failure.</li>
                    <li><b>Parallelization:</b> Split specs across CI workers to speed up suites.</li>
                    <li><b>Retries:</b> Configure test retries in <Styled.InlineCode>cypress.config.js</Styled.InlineCode> (use judiciously; fix root causes).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// cypress.config.js (retry & video example)
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    retries: 1,          // one retry on CI
    video: true,         // keep videos for failures
    screenshotOnRunFailure: true,
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 13) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (quick recall)</Styled.H2>
                <Styled.List>
                    <li><b>Base URL:</b> Root address used by <Styled.InlineCode>cy.visit()</Styled.InlineCode> (set in config).</li>
                    <li><b>Viewport:</b> Browser window size controlled via <Styled.InlineCode>cy.viewport()</Styled.InlineCode>.</li>
                    <li><b>Fixture:</b> Static test data loaded via <Styled.InlineCode>cy.fixture()</Styled.InlineCode>.</li>
                    <li><b>Intercept:</b> Network observation/mocking via <Styled.InlineCode>cy.intercept()</Styled.InlineCode>.</li>
                    <li><b>Flaky:</b> Unreliable test due to timing/selector/env issues.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use Cypress to automate real user flows with stable selectors, minimal mocking
                where needed, and assertions on user-visible results. Keep specs focused, control network
                deterministically, and avoid timing hacks to build a fast, reliable E2E suite.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default E2eCypress;
