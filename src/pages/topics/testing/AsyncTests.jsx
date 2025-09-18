import React from "react";
import { Styled } from "./styled";

const AsyncTests = () => {
    return (
        <Styled.Page>
            <Styled.Title>Async Tests (React Testing Library + Jest)</Styled.Title>

            <Styled.Lead>
                In UI tests, “async” means the UI changes <b>later</b> (after a timer, a network call,
                a state transition, or the browser's event loop). We use <Styled.InlineCode>await</Styled.InlineCode>{" "}
                with helpers like <Styled.InlineCode>findBy*</Styled.InlineCode> and{" "}
                <Styled.InlineCode>waitFor</Styled.InlineCode> to <em>wait</em> for the UI to settle
                before asserting.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms (Plain English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Promise:</b> an object that represents a value that will be ready later.
                        It can <i>resolve</i> (succeed) or <i>reject</i> (fail).
                    </li>
                    <li>
                        <b>async/await:</b> syntax to pause until a Promise finishes, making async code read like sync.
                    </li>
                    <li>
                        <b>Event loop:</b> the browser/runtime scheduler that runs tasks. Two key queues:
                        <ul>
                            <li>
                                <b>Microtasks:</b> run ASAP after the current code (e.g., <Styled.InlineCode>Promise.then</Styled.InlineCode>).
                            </li>
                            <li>
                                <b>Macrotasks:</b> run later (e.g., <Styled.InlineCode>setTimeout</Styled.InlineCode>, timers, I/O).
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>React Testing Library (RTL):</b> testing helpers focused on user behavior and accessible queries.
                    </li>
                    <li>
                        <b>Jest fake timers:</b> a Jest feature that lets tests <i>fast-forward time</i> instead of waiting in real time.
                    </li>
                    <li>
                        <b>findBy*</b>: RTL queries that <i>wait</i> until an element appears, then return it.
                    </li>
                    <li>
                        <b>waitFor(fn)</b>: repeatedly runs <i>fn</i> until its assertions pass (or timeout).
                    </li>
                    <li>
                        <b><code>act(...)</code></b>: wraps updates so React can flush state/effects. RTL usually does this for you,
                        but with manual timer jumps you may still need it.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) findBy* (waits for DOM to appear) */}
            <Styled.Section>
                <Styled.H2>Pattern 1 — Use <code>findBy*</code> to wait for UI after fetch</Styled.H2>
                <Styled.Pre>
                    {`// Component: loads users on mount
function Users() {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(setUsers);
  }, []);
  return (
    <ul aria-label="users">
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// Test: mock fetch, then await the list item
import { render, screen } from "@testing-library/react";

test("loads and renders users", async () => {
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => [{ id: 1, name: "Ada" }],
  });

  render(<Users />);
  const item = await screen.findByText("Ada"); // waits until it appears
  expect(item).toBeInTheDocument();

  global.fetch.mockRestore();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> The list item doesn't exist immediately; <code>findBy*</code> waits for it.
                </Styled.Small>
            </Styled.Section>

            {/* 3) waitFor for conditions (no single element to await) */}
            <Styled.Section>
                <Styled.H2>Pattern 2 — Use <code>waitFor</code> when there's no single “findable” element</Styled.H2>
                <Styled.Pre>
                    {`// Component: button enabled after async validation
function Form() {
  const [value, setValue] = React.useState("");
  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!value) return setValid(false);
    Promise.resolve().then(() => {  // pretend async validation
      if (!cancelled) setValid(value.length >= 3);
    });
    return () => { cancelled = true; };
  }, [value]);

  return (
    <form>
      <input
        aria-label="name"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button disabled={!valid}>Submit</button>
    </form>
  );
}

// Test
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("enables submit after async validation", async () => {
  render(<Form />);
  await userEvent.type(screen.getByLabelText("name"), "Ash"); // 3 chars

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> There isn't a “loading → done” element to <code>findBy</code>; instead,
                    wait for the <i>state</i> (button enabled) to become true.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Debounce + Fake Timers */}
            <Styled.Section>
                <Styled.H2>Pattern 3 — Debounced logic with <code>jest.useFakeTimers()</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Debounce:</b> delay running a function until input “goes quiet” for N ms.
                    </li>
                    <li>
                        Use Jest fake timers to jump time forward instantly (no real waiting).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Component: debounced echo
function Debounced({ delay = 300 }) {
  const [text, setText] = React.useState("");
  const [echo, setEcho] = React.useState("");

  React.useEffect(() => {
    const id = setTimeout(() => setEcho(text), delay);
    return () => clearTimeout(id);
  }, [text, delay]);

  return (
    <>
      <input aria-label="search" value={text} onChange={(e) => setText(e.target.value)} />
      <p role="status">{echo}</p>
    </>
  );
}

// Test: advance timers instead of waiting
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

test("updates after debounce", async () => {
  jest.useFakeTimers(); // turn on fake timers

  render(<Debounced delay={300} />);
  await userEvent.type(screen.getByLabelText("search"), "hi");

  act(() => { jest.advanceTimersByTime(300); }); // flush the timeout
  expect(screen.getByRole("status")).toHaveTextContent("hi");

  jest.useRealTimers(); // cleanup
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why <code>act</code>?</b> Jumping timers causes React updates; wrapping in <code>act</code> lets React flush them.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Loading / error states */}
            <Styled.Section>
                <Styled.H2>Pattern 4 — Assert loading and error states</Styled.H2>
                <Styled.Pre>
                    {`function Loader() {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });
  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });
    fetch("/api/item")
      .then(r => r.json())
      .then(data => !cancelled && setState({ status: "success", data, error: null }))
      .catch(error => !cancelled && setState({ status: "error", data: null, error }));
    return () => { cancelled = true; };
  }, []);

  if (state.status === "loading") return <p role="status">Loading…</p>;
  if (state.status === "error") return <p role="alert">Something went wrong</p>;
  return <p>{state.data.name}</p>;
}

// Test the 3 states
test("shows loading, then data", async () => {
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => ({ name: "Widget" }),
  });

  render(<Loader />);
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  expect(await screen.findByText("Widget")).toBeInTheDocument();

  global.fetch.mockRestore();
});

test("shows error on failure", async () => {
  jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("network"));

  render(<Loader />);
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(await screen.findByRole("alert")).toHaveTextContent(/wrong/i);

  global.fetch.mockRestore();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Best practices */}
            <Styled.Section>
                <Styled.H2>Do / Don't (Async Tests)</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefer <Styled.InlineCode>findBy*</Styled.InlineCode> for elements that appear later.</li>
                    <li><b>Do</b> use <Styled.InlineCode>waitFor</Styled.InlineCode> for conditions (enabled/disabled, counts, styles).</li>
                    <li><b>Do</b> mock network I/O; real servers make tests flaky. (Use <i>MSW</i> for realistic mocks.)</li>
                    <li><b>Do</b> prefer <Styled.InlineCode>userEvent</Styled.InlineCode> over <Styled.InlineCode>fireEvent</Styled.InlineCode> to simulate real user behavior.</li>
                    <li><b>Do</b> use Jest fake timers for debounce/throttle/interval tests.</li>
                    <li><b>Don't</b> sprinkle arbitrary <Styled.InlineCode>setTimeout</Styled.InlineCode> in tests; they slow and flake.</li>
                    <li><b>Don't</b> assert immediately after an async action—<i>wait</i> for the UI.</li>
                    <li><b>Don't</b> over-mock React internals; test visible behavior, not implementation details.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Resolution:</b> a Promise finishing successfully.</li>
                    <li><b>Rejection:</b> a Promise finishing with an error.</li>
                    <li><b>Flaky test:</b> sometimes passes, sometimes fails—often due to real time or network.</li>
                    <li><b>Deterministic:</b> same input → same output every time (goal of good tests).</li>
                    <li><b>MSW:</b> Mock Service Worker; intercepts requests and returns mock responses like a real server.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Async tests wait for the UI to reflect reality—use <i>findBy*</i> for elements,
                <i> waitFor</i> for conditions, and fake timers for time-based logic. Keep tests deterministic
                by mocking I/O and avoiding real delays.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AsyncTests;
