import React from "react";
import { Styled } from "./styled";

const JestBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Jest Basics</Styled.Title>

            <Styled.Lead>
                <b>Jest</b> is a JavaScript testing framework that bundles a <i>test runner</i>, an <i>assertion library</i>,
                a <i>mocking</i> system, and <i>coverage</i> in one tool. You write tests in files like{" "}
                <Styled.InlineCode>*.test.js</Styled.InlineCode> or <Styled.InlineCode>*.spec.js</Styled.InlineCode>, and run them
                with a single command.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is testing? Why Jest?</Styled.H2>
                <Styled.List>
                    <li><b>Testing</b>: writing small programs (<i>tests</i>) that automatically verify your code's behavior.</li>
                    <li><b>Unit test</b>: checks one function/component in isolation.</li>
                    <li><b>Integration test</b>: checks how multiple units work together.</li>
                    <li><b>End-to-End (E2E)</b>: drives the app like a user (usually via a browser) to validate real flows.</li>
                    <li><b>Jest</b>: all-in-one tool: <i>runner</i> (discovers/executes tests), <i>assertions</i> (e.g., <Styled.InlineCode>expect()</Styled.InlineCode>), <i>mocks</i>, and <i>coverage</i>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core Terms */}
            <Styled.Section>
                <Styled.H2>Core Terms (learn these first)</Styled.H2>
                <Styled.List>
                    <li><b>Test file</b>: any file named <Styled.InlineCode>*.test.js</Styled.InlineCode> or <Styled.InlineCode>*.spec.js</Styled.InlineCode>.</li>
                    <li><b>Test suite</b>: a group of tests in a file or inside <Styled.InlineCode>describe()</Styled.InlineCode>.</li>
                    <li><b>Test case</b>: an individual <Styled.InlineCode>test()</Styled.InlineCode> (alias <Styled.InlineCode>it()</Styled.InlineCode>).</li>
                    <li><b>Assertion</b>: a check like <Styled.InlineCode>expect(value).toBe(42)</Styled.InlineCode>.</li>
                    <li><b>Matcher</b>: the method after <Styled.InlineCode>expect()</Styled.InlineCode> (e.g., <Styled.InlineCode>toBe</Styled.InlineCode>, <Styled.InlineCode>toEqual</Styled.InlineCode>).</li>
                    <li><b>Test environment</b>: the runtime for tests — usually <Styled.InlineCode>jsdom</Styled.InlineCode> (browser-like) or <Styled.InlineCode>node</Styled.InlineCode>.</li>
                    <li><b>Mock</b>: a fake function/module you control during tests (created with <Styled.InlineCode>jest.fn</Styled.InlineCode>, <Styled.InlineCode>jest.spyOn</Styled.InlineCode>, or <Styled.InlineCode>jest.mock</Styled.InlineCode>).</li>
                    <li><b>Spy</b>: a special mock that wraps a real function to record calls (<Styled.InlineCode>jest.spyOn(obj, "method")</Styled.InlineCode>).</li>
                    <li><b>Stub</b>: a mock that returns canned values (a preprogrammed fake).</li>
                    <li><b>Fake timers</b>: simulated time so you can test timers instantly (<Styled.InlineCode>jest.useFakeTimers()</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) First test */}
            <Styled.Section>
                <Styled.H2>First Test (arrange → act → assert)</Styled.H2>
                <Styled.Pre>
                    {`// src/utils/sum.js
export function sum(a, b) {
  return a + b;
}

// src/utils/sum.test.js
import { sum } from "./sum";

describe("sum()", () => {
  test("adds two numbers", () => {
    // arrange
    const a = 2, b = 3;
    // act
    const result = sum(a, b);
    // assert
    expect(result).toBe(5);
  });
});`}
                </Styled.Pre>
                <Styled.Small>
                    Run with <Styled.InlineCode>npx jest</Styled.InlineCode> (or <Styled.InlineCode>npm test</Styled.InlineCode> if configured).
                    In watch mode, Jest reruns tests on file changes.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Essential matchers */}
            <Styled.Section>
                <Styled.H2>Essential Matchers</Styled.H2>
                <Styled.Pre>
                    {`test("primitive equality", () => {
  expect(2 + 2).toBe(4);                  // strict === for primitives
});

test("deep equality", () => {
  expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });    // deep equal
  expect([1, 2, 3]).toEqual([1, 2, 3]);
});

test("strict deep equality", () => {
  expect({ a: 1 }).toStrictEqual({ a: 1 }); // like toEqual but stricter (no extra props, respects undefined)
});

test("truthiness", () => {
  expect(true).toBeTruthy();
  expect(0).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
});

test("numbers", () => {
  expect(10).toBeGreaterThan(5);
  expect(0.1 + 0.2).toBeCloseTo(0.3); // avoid floating point pitfalls
});

test("strings/regex", () => {
  expect("Hello Jest").toMatch(/jest/i);
});

test("arrays/iterables", () => {
  expect(["a", "b", "c"]).toContain("b");
});

test("objects", () => {
  expect({ user: { id: 1 } }).toHaveProperty("user.id", 1);
});

test("errors", () => {
  function willThrow() { throw new Error("boom"); }
  expect(willThrow).toThrow("boom");
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Async tests */}
            <Styled.Section>
                <Styled.H2>Async Tests (Promises & async/await)</Styled.H2>
                <Styled.List>
                    <li><b>Return/await the Promise</b> so Jest knows when the test finishes.</li>
                    <li>Use <Styled.InlineCode>resolves</Styled.InlineCode> / <Styled.InlineCode>rejects</Styled.InlineCode> helpers for concise assertions.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Function under test
export async function fetchUser(id, fetcher = fetch) {
  const res = await fetcher(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

// Test
test("fetchUser resolves with data", async () => {
  // stub 'fetch' with a controllable mock
  const fakeFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, name: "Ada" })
  });

  await expect(fetchUser(1, fakeFetch)).resolves.toEqual({ id: 1, name: "Ada" });
  expect(fakeFetch).toHaveBeenCalledWith("/api/users/1");
});

test("fetchUser rejects on HTTP error", async () => {
  const fakeFetch = jest.fn().mockResolvedValue({ ok: false });
  await expect(fetchUser(1, fakeFetch)).rejects.toThrow("Network error");
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Setup & teardown */}
            <Styled.Section>
                <Styled.H2>Setup &amp; Teardown</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>beforeAll/afterAll</Styled.InlineCode>: run once per suite (e.g., open/close DB).</li>
                    <li><Styled.InlineCode>beforeEach/afterEach</Styled.InlineCode>: run around every test (e.g., reset state).</li>
                </Styled.List>
                <Styled.Pre>
                    {`describe("with timers", () => {
  let arr;
  beforeAll(() => { /* connect or init once */ });
  beforeEach(() => { arr = []; });
  afterEach(() => { arr = null; });
  afterAll(() => { /* teardown once */ });

  test("pushes values", () => {
    arr.push(1);
    expect(arr).toHaveLength(1);
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Mocks & spies */}
            <Styled.Section>
                <Styled.H2>Mocks &amp; Spies</Styled.H2>
                <Styled.List>
                    <li><b><Styled.InlineCode>jest.fn()</Styled.InlineCode></b>: create a stand-alone mock function.</li>
                    <li><b><Styled.InlineCode>jest.spyOn(obj, "method")</Styled.InlineCode></b>: wrap and observe a real method, optionally mock its implementation.</li>
                    <li><b><Styled.InlineCode>jest.mock("module")</Styled.InlineCode></b>: replace an entire module with mocks during the test.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// jest.fn()
const log = jest.fn();
log("hello");
expect(log).toHaveBeenCalledWith("hello");

// jest.spyOn()
const api = { get: (id) => ({ id, ok: true }) };
const spy = jest.spyOn(api, "get").mockReturnValue({ id: 1, ok: false });
expect(api.get(1)).toEqual({ id: 1, ok: false });
expect(spy).toHaveBeenCalledTimes(1);
spy.mockRestore();

// jest.mock() — mock a module
// userService.js
export async function getUserName(fetcher, id) {
  const r = await fetcher(\`/u/\${id}\`);
  return (await r.json()).name;
}

// userService.test.js
jest.mock("./userService"); // if you provide __mocks__/userService.js, Jest will use it
import { getUserName } from "./userService";
getUserName.mockResolvedValue("Grace"); // override in test
await expect(getUserName(jest.fn(), 1)).resolves.toBe("Grace");`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: Prefer dependency injection (pass collaborators as params) so you can mock <i>at the call site</i> without heavy module mocking.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Fake timers */}
            <Styled.Section>
                <Styled.H2>Fake Timers (testing debounce/throttle)</Styled.H2>
                <Styled.Pre>
                    {`function debounce(fn, wait = 200) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), wait);
  };
}

jest.useFakeTimers();

test("debounce delays calls", () => {
  const fn = jest.fn();
  const d = debounce(fn, 300);

  d("A");
  d("B"); // only the last call should fire after 300ms

  // fast-forward time
  jest.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledWith("B");
});`}
                </Styled.Pre>
                <Styled.Small>Remember to switch back with <Styled.InlineCode>jest.useRealTimers()</Styled.InlineCode> if needed.</Styled.Small>
            </Styled.Section>

            {/* 9) Test environment */}
            <Styled.Section>
                <Styled.H2>Test Environment (jsdom vs node)</Styled.H2>
                <Styled.List>
                    <li><b>jsdom</b>: simulates a browser DOM in Node. Use for DOM-related tests.</li>
                    <li><b>node</b>: pure Node environment. Use for server-side or logic-only tests.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/**
 * @jest-environment jsdom
 */
// put this docblock at the top of a test file to force jsdom

/**
 * @jest-environment node
 */
// ...or node, depending on the test's needs`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) CLI & coverage */}
            <Styled.Section>
                <Styled.H2>Running Tests &amp; Coverage</Styled.H2>
                <Styled.List>
                    <li><b>Run all:</b> <Styled.InlineCode>npx jest</Styled.InlineCode></li>
                    <li><b>Watch:</b> <Styled.InlineCode>npx jest --watch</Styled.InlineCode></li>
                    <li><b>Filter by name:</b> <Styled.InlineCode>npx jest -t "sum"</Styled.InlineCode></li>
                    <li><b>Coverage:</b> <Styled.InlineCode>npx jest --coverage</Styled.InlineCode> (creates a coverage report)</li>
                </Styled.List>
                <Styled.Pre>
                    {`// jest.config.js (example)
module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> name tests clearly: what behavior is validated?</li>
                    <li><b>Do</b> test <i>observables</i> (outputs, DOM, calls), not implementation details.</li>
                    <li><b>Do</b> await/return Promises in async tests.</li>
                    <li><b>Don't</b> test private internals; refactor to expose behavior through public APIs.</li>
                    <li><b>Don't</b> over-mock; prefer small real collaborators when possible.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Runner</b>: program that finds and executes tests.</li>
                    <li><b>Assertion</b>: an expectation you claim must be true.</li>
                    <li><b>Matcher</b>: assertion helper (e.g., <Styled.InlineCode>toBe</Styled.InlineCode>).</li>
                    <li><b>Fixture</b>: reusable sample data or setup for tests.</li>
                    <li><b>Test double</b>: any fake used in tests (mock/spy/stub/fake).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: With Jest you write readable tests using <i>describe</i>/<i>test</i> and <i>expect</i>.
                Learn the essential matchers, handle async correctly, mock dependencies thoughtfully, and use fake
                timers for timing code. Keep tests focused on behavior, not internals.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default JestBasics;
