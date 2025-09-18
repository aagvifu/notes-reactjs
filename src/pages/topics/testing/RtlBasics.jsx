import { Styled } from "./styled";

const RtlBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>React Testing Library (RTL) — Basics</Styled.Title>

            <Styled.Lead>
                <b>React Testing Library (RTL)</b> helps you test React components
                by interacting with them the way a user would—via the DOM. It's built
                on top of <b>DOM Testing Library</b> and typically runs with <b>Jest</b> in a
                <b> JSDOM</b> environment. Focus on <i>behavior</i> and <i>accessibility</i>, not implementation details.
            </Styled.Lead>

            {/* 1) What is what */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Jest:</b> a JavaScript <i>test runner</i> and <i>assertion library</i>. It discovers tests, runs them, and reports results.</li>
                    <li><b>JSDOM:</b> a Node.js-based <i>browser-like</i> DOM used during tests (no real browser UI).</li>
                    <li><b>DOM Testing Library (DTL):</b> low-level utilities to query and assert against DOM nodes.</li>
                    <li><b>React Testing Library (RTL):</b> React bindings around DTL that render components and encourage user-centric tests.</li>
                    <li><b>Unit test:</b> tests a small piece (e.g., a component) in isolation.</li>
                    <li><b>Integration test:</b> tests how pieces work together (e.g., component + context + router).</li>
                    <li><b>Assertion:</b> a statement you expect to be true (e.g., <Styled.InlineCode>expect(button).toBeDisabled()</Styled.InlineCode>).</li>
                    <li><b>Matcher:</b> the function after <Styled.InlineCode>expect(...)</Styled.InlineCode> (e.g., <Styled.InlineCode>toBeInTheDocument()</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) First test */}
            <Styled.Section>
                <Styled.H2>First Test (happy path)</Styled.H2>
                <Styled.Pre>
                    {`// Example: src/components/Greet.jsx
export default function Greet({ name }) {
  return <h1>Hello, {name ?? "stranger"}!</h1>;
}

// Example test: src/components/__tests__/Greet.test.jsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Greet from "../Greet";

test("renders greeting with provided name", () => {
  render(<Greet name="Ashish" />);                   // Render component into JSDOM
  const heading = screen.getByRole("heading", { name: /hello, ashish!/i });
  expect(heading).toBeInTheDocument();               // Assertion via jest-dom matcher
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>@testing-library/jest-dom</b> extends Jest with DOM-specific matchers like{" "}
                    <Styled.InlineCode>toBeInTheDocument</Styled.InlineCode>,{" "}
                    <Styled.InlineCode>toHaveTextContent</Styled.InlineCode>, and{" "}
                    <Styled.InlineCode>toBeDisabled</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Queries */}
            <Styled.Section>
                <Styled.H2>Queries (how you find elements)</Styled.H2>
                <Styled.List>
                    <li><b>By role (preferred):</b> <Styled.InlineCode>getByRole("button", {`{{ name: /submit/i }}`})</Styled.InlineCode> — role + accessible name (best for a11y).</li>
                    <li><b>By label text:</b> <Styled.InlineCode>getByLabelText("Email")</Styled.InlineCode> — for form controls with <Styled.InlineCode>&lt;label&gt;</Styled.InlineCode>.</li>
                    <li><b>By placeholder:</b> <Styled.InlineCode>getByPlaceholderText("Search")</Styled.InlineCode> — when no label exists (use sparingly).</li>
                    <li><b>By text:</b> <Styled.InlineCode>getByText(/hello/i)</Styled.InlineCode> — visible text content.</li>
                    <li><b>By alt text:</b> <Styled.InlineCode>getByAltText("User avatar")</Styled.InlineCode> — for images.</li>
                    <li><b>By title:</b> <Styled.InlineCode>getByTitle("tooltip")</Styled.InlineCode> — last resort for non-interactive labels.</li>
                    <li><b>By test id (escape hatch):</b> <Styled.InlineCode>getByTestId("sum")</Styled.InlineCode> — use only when no accessible query fits.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// getBy*: returns the element or throws if not found
// queryBy*: returns the element or null (no throw)
// findBy*: async; returns a Promise that resolves when the element appears

// Example:
screen.getByRole("button", { name: /save/i });     // throws if missing
screen.queryByText(/loading/i);                    // null if missing (good for "not present" checks)
await screen.findByText(/welcome/i);               // waits until it appears (use with async UI)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Interactions */}
            <Styled.Section>
                <Styled.H2>Interactions with <code>userEvent</code></Styled.H2>
                <Styled.List>
                    <li><b>userEvent:</b> simulates real user actions (typing, clicking) with proper events and timing.</li>
                    <li><b>fireEvent:</b> lower-level event trigger; prefer <Styled.InlineCode>userEvent</Styled.InlineCode> for realism.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Login() {
  const [email, setEmail] = React.useState("");
  return (
    <form>
      <label htmlFor="em">Email</label>
      <input id="em" value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={!email}>Submit</button>
    </form>
  );
}

test("enables submit after typing email", async () => {
  const user = userEvent.setup();                 // setup once per test
  render(<Login />);

  const input = screen.getByLabelText(/email/i);
  const button = screen.getByRole("button", { name: /submit/i });

  expect(button).toBeDisabled();

  await user.type(input, "ashish@example.com");  // async; await it
  expect(button).toBeEnabled();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Async UI */}
            <Styled.Section>
                <Styled.H2>Asynchronous UI</Styled.H2>
                <Styled.List>
                    <li><b>findBy*</b> waits for element to appear (uses <Styled.InlineCode>waitFor</Styled.InlineCode> under the hood).</li>
                    <li><b>waitFor</b> retries an assertion until it passes or times out (use for state that settles asynchronously).</li>
                    <li><b>waitForElementToBeRemoved</b> waits for a loading spinner or toast to disappear.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function FetchUser() {
  const [name, setName] = React.useState(null);
  async function load() {
    const data = await Promise.resolve({ name: "Ashish" }); // pretend fetch
    setName(data.name);
  }
  return (
    <div>
      <button onClick={load}>Load</button>
      {!name ? <span role="status">Loading…</span> : <p>Hello, {name}</p>}
    </div>
  );
}

test("loads and shows user", async () => {
  const user = userEvent.setup();
  render(<FetchUser />);

  await user.click(screen.getByRole("button", { name: /load/i }));
  await waitForElementToBeRemoved(() => screen.getByRole("status")); // spinner gone
  await screen.findByText(/hello, ashish/i);                          // appears
  await waitFor(() => expect(screen.queryByRole("status")).toBeNull()); // stays gone
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Scoping & structure */}
            <Styled.Section>
                <Styled.H2>Scoping with <code>within</code> & structural queries</Styled.H2>
                <Styled.List>
                    <li><b>within(container)</b> limits queries to a subtree.</li>
                    <li>Use to avoid ambiguous matches in complex UIs (tables, lists, modals).</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen, within } from "@testing-library/react";

function Table() {
  return (
    <table>
      <tbody>
        <tr aria-label="row-1"><td>Item</td><td><button>Edit</button></td></tr>
        <tr aria-label="row-2"><td>Item</td><td><button>Edit</button></td></tr>
      </tbody>
    </table>
  );
}

test("clicks Edit in row-2", () => {
  render(<Table />);
  const row2 = screen.getByRole("row", { name: /row-2/i });
  const { getByRole } = within(row2);
  expect(getByRole("button", { name: /edit/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Accessibility-first mindset */}
            <Styled.Section>
                <Styled.H2>Accessibility-First Queries</Styled.H2>
                <Styled.List>
                    <li><b>Role:</b> what the element <i>is</i> (button, textbox, link, heading, alert, status, dialog, etc.).</li>
                    <li><b>Accessible name:</b> the label users hear/see (content, <Styled.InlineCode>aria-label</Styled.InlineCode>, associated <Styled.InlineCode>&lt;label&gt;</Styled.InlineCode>).</li>
                    <li><b>Examples:</b> <Styled.InlineCode>getByRole("button", {`{{ name: /save/i }}`})</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>getByRole("heading", {`{{ level: 2, name: /profile/i }}`})</Styled.InlineCode></li>
                    <li><b>Avoid:</b> <Styled.InlineCode>getByTestId</Styled.InlineCode> unless absolutely necessary.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Custom render (providers) */}
            <Styled.Section>
                <Styled.H2>Custom <code>render</code> with Providers</Styled.H2>
                <Styled.Small>Wrap components with Router/Context/Redux in a single helper.</Styled.Small>
                <Styled.Pre>
                    {`// src/test-utils.jsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

const customRender = (ui, options) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";
export { customRender as render };`}
                </Styled.Pre>
                <Styled.Small>Then import <Styled.InlineCode>render</Styled.InlineCode> from <Styled.InlineCode>src/test-utils</Styled.InlineCode> in your tests.</Styled.Small>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> test <i>behavior</i> and <i>outcomes</i> (what the user sees/does).</li>
                    <li><b>Do</b> prefer role-based queries and real interactions with <Styled.InlineCode>userEvent</Styled.InlineCode>.</li>
                    <li><b>Do</b> use <Styled.InlineCode>findBy*</Styled.InlineCode> for async UI and <Styled.InlineCode>waitFor</Styled.InlineCode> for eventually-true assertions.</li>
                    <li><b>Don't</b> assert internal state or call component functions directly (implementation details).</li>
                    <li><b>Don't</b> stub timers/network without reason—mock them purposefully for deterministic tests.</li>
                    <li><b>Don't</b> overuse <Styled.InlineCode>getByTestId</Styled.InlineCode>—it bypasses accessibility.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Role:</b> the semantic purpose of an element for assistive tech (e.g., button, dialog).</li>
                    <li><b>Accessible name:</b> the text label announced by screen readers (from content/label/aria-label).</li>
                    <li><b>Assertion:</b> a check using <Styled.InlineCode>expect(...)</Styled.InlineCode> that must pass.</li>
                    <li><b>Matcher:</b> function chained off <Styled.InlineCode>expect</Styled.InlineCode> (e.g., <Styled.InlineCode>toHaveValue</Styled.InlineCode>).</li>
                    <li><b>Fixture:</b> sample component/data used in tests.</li>
                    <li><b>Mock:</b> a fake function/module used to control side effects (network, time, storage).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Write tests that reflect how users interact with your app. Query by role and accessible
                name, use <code>userEvent</code> for realistic input, and handle async UI with <code>findBy</code> and <code>waitFor</code>.
                Favor clarity and behavior over internals—your tests will be reliable and maintainable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RtlBasics;
