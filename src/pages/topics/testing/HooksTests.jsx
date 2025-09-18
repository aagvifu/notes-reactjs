import React from "react";
import { Styled } from "./styled";

const HooksTests = () => {
    return (
        <Styled.Page>
            <Styled.Title>Hooks Tests</Styled.Title>

            <Styled.Lead>
                <b>Hooks tests</b> verify the <i>behavior</i> of React hooks (built-in or custom) in isolation.
                You don't render real UI - you execute the hook and assert its <b>returned values</b>,
                <b>effects</b>, and <b>side-effects</b>. The goal is to test <em>observable outcomes</em>, not implementation details.
            </Styled.Lead>

            {/* 1) What is a hook test? */}
            <Styled.Section>
                <Styled.H2>What is a Hook Test?</Styled.H2>
                <Styled.List>
                    <li><b>Hook:</b> a function like <Styled.InlineCode>useState</Styled.InlineCode>, <Styled.InlineCode>useEffect</Styled.InlineCode>, or a <i>custom hook</i> (e.g., <Styled.InlineCode>useCounter</Styled.InlineCode>).</li>
                    <li><b>Hook test:</b> run the hook in a controlled test harness and assert its outputs (state, returned API) and effects (timers, storage, network).</li>
                    <li><b>Unit vs Integration:</b> a unit hook test isolates the hook; an integration test renders a component that uses the hook.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Tooling: renderHook, act, waitFor, wrapper */}
            <Styled.Section>
                <Styled.H2>Essential Tools & Terms</Styled.H2>
                <Styled.List>
                    <li>
                        <b><Styled.InlineCode>renderHook</Styled.InlineCode>:</b> utility from <Styled.InlineCode>@testing-library/react</Styled.InlineCode> that lets you execute a hook and returns a test handle:
                        <Styled.InlineCode>{`{ result, rerender, unmount }`}</Styled.InlineCode>. <i>(Older setups used <Styled.InlineCode>@testing-library/react-hooks</Styled.InlineCode>.)</i>
                    </li>
                    <li>
                        <b><Styled.InlineCode>act</Styled.InlineCode>:</b> batches React updates in tests. Wrap any state-changing operation (e.g., calling a returned setter) so assertions see the final state.
                    </li>
                    <li>
                        <b><Styled.InlineCode>waitFor</Styled.InlineCode>:</b> retries an assertion until it passes or times out - useful for async effects (fetch, timers).
                    </li>
                    <li>
                        <b><Styled.InlineCode>wrapper</Styled.InlineCode>:</b> an optional React component that provides context/providers while the hook runs (e.g., <Styled.InlineCode>ThemeProvider</Styled.InlineCode>, <Styled.InlineCode>Router</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Mocking:</b> replacing real modules/APIs (fetch, storage, timers) with controllable test doubles. In Jest use <Styled.InlineCode>jest.fn()</Styled.InlineCode>/<Styled.InlineCode>jest.mock()</Styled.InlineCode>. In Vitest use <Styled.InlineCode>vi.fn()</Styled.InlineCode>/<Styled.InlineCode>vi.mock()</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Cleanup:</b> releasing resources (listeners, timers) on <Styled.InlineCode>unmount</Styled.InlineCode> and verifying no leaks remain.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy of a Hook Test</Styled.H2>
                <Styled.Pre>
                    {`import { renderHook, act, waitFor } from "@testing-library/react";
// (Jest shown; in Vitest replace 'jest' with 'vi')

describe("useSomething", () => {
  it("returns initial state and updates on action", () => {
    const { result } = renderHook(() => useSomething(/* initial options */));
    expect(result.current.value).toBe(/* initial */);

    act(() => {
      result.current.actions.doThing(); // triggers a state update
    });
    expect(result.current.value).toBe(/* updated */);
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Example 1: useCounter (state) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useCounter</code> (state & actions)</Styled.H2>
                <Styled.Small>
                    We test initial state, actions, and clamping logic. We also verify <i>stable function identities</i> across re-renders when promised.
                </Styled.Small>
                <Styled.Pre>
                    {`// hook (for reference)
/*
function useCounter({ initial = 0, step = 1, min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = React.useState(initial);
  const clamp = React.useCallback(n => Math.min(max, Math.max(min, n)), [min, max]);
  const inc = React.useCallback(() => setCount(c => clamp(c + step)), [step, clamp]);
  const dec = React.useCallback(() => setCount(c => clamp(c - step)), [step, clamp]);
  const set = React.useCallback(n => setCount(() => clamp(n)), [clamp]);
  const reset = React.useCallback(() => setCount(initial), [initial]);
  return { count, inc, dec, set, reset };
}
*/

import { renderHook, act } from "@testing-library/react";

describe("useCounter", () => {
  it("initializes and updates correctly", () => {
    const { result } = renderHook(() => useCounter({ initial: 1, step: 2, min: 0, max: 10 }));

    expect(result.current.count).toBe(1);

    act(() => result.current.inc());
    expect(result.current.count).toBe(3);

    act(() => result.current.dec());
    expect(result.current.count).toBe(1);

    act(() => result.current.set(100));
    expect(result.current.count).toBe(10); // clamped to max

    act(() => result.current.reset());
    expect(result.current.count).toBe(1);
  });

  it("returns stable action references", () => {
    const { result, rerender } = renderHook(() => useCounter());

    const { inc, dec, set, reset } = result.current;
    rerender();

    expect(result.current.inc).toBe(inc);
    expect(result.current.dec).toBe(dec);
    expect(result.current.set).toBe(set);
    expect(result.current.reset).toBe(reset);
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Example 2: useLocalStorage (effects + browser APIs) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useLocalStorage</code> (effects & browser APIs)</Styled.H2>
                <Styled.List>
                    <li><b>Arrange:</b> mock <Styled.InlineCode>localStorage</Styled.InlineCode>.</li>
                    <li><b>Act:</b> update the value via the hook setter.</li>
                    <li><b>Assert:</b> storage was read/written; updates reflect in state.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// test-time localStorage double
const store = new Map();
const localStorageMock = {
  getItem: jest.fn((k) => (store.has(k) ? store.get(k) : null)),
  setItem: jest.fn((k, v) => store.set(k, v)),
  removeItem: jest.fn((k) => store.delete(k)),
  clear: jest.fn(() => store.clear()),
};

beforeEach(() => {
  store.clear();
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});

import { renderHook, act } from "@testing-library/react";

describe("useLocalStorage", () => {
  it("reads initial and persists updates", () => {
    store.set("theme", JSON.stringify("dark"));

    const { result } = renderHook(() => useLocalStorage("theme", "light"));
    expect(result.current[0]).toBe("dark");

    act(() => result.current[1]("light"));
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", JSON.stringify("light"));
    expect(result.current[0]).toBe("light");
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Example 3: useAsync (async + cancellation) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useAsync</code> (async + cancellation)</Styled.H2>
                <Styled.List>
                    <li><b>Async state machine:</b> {`{ status: "idle" | "loading" | "success" | "error", data, error }`}.</li>
                    <li><b>Cancellation:</b> ignore late results after unmount.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { renderHook, waitFor } from "@testing-library/react";

const ok = () => Promise.resolve({ user: "Ashish" });
const fail = () => Promise.reject(new Error("Nope"));

describe("useAsync", () => {
  it("resolves happy path", async () => {
    const { result, rerender } = renderHook(({ fn }) => useAsync(fn, [fn]), { initialProps: { fn: ok }});
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.data).toEqual({ user: "Ashish" });

    // change deps (simulate new request)
    rerender({ fn: fail });
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("ignores late resolution after unmount (cancellation)", async () => {
    let resolve;
    const p = new Promise((r) => (resolve = r));
    const { unmount, result } = renderHook(() => useAsync(() => p, []));

    expect(result.current.status).toBe("loading");
    unmount();
    resolve("late");

    // no throw and no state update after unmount → test passes by not crashing
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Example 4: Context-dependent hook (wrapper) */}
            <Styled.Section>
                <Styled.H2>Example: Context-Dependent Hook (using <code>wrapper</code>)</Styled.H2>
                <Styled.Small>Use the <b>wrapper</b> option to supply providers that your hook needs.</Styled.Small>
                <Styled.Pre>
                    {`import { renderHook } from "@testing-library/react";

// suppose useTheme() reads React context
/*
const ThemeContext = React.createContext("light");
function useTheme() {
  return React.useContext(ThemeContext);
}
*/
function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

it("reads theme from context", () => {
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current).toBe("dark");
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Example 5: Cleanup & listeners */}
            <Styled.Section>
                <Styled.H2>Cleanup: listeners & timers</Styled.H2>
                <Styled.Pre>
                    {`/*
function useWindowResize(handler) {
  const latest = React.useRef(handler);
  React.useEffect(() => { latest.current = handler; });
  React.useEffect(() => {
    const onResize = () => latest.current();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
}
*/
it("attaches and cleans up the listener", () => {
  const add = jest.spyOn(window, "addEventListener");
  const rem = jest.spyOn(window, "removeEventListener");

  const handler = jest.fn();
  const { unmount } = renderHook(() => useWindowResize(handler));

  expect(add).toHaveBeenCalledWith("resize", expect.any(Function));
  unmount();
  expect(rem).toHaveBeenCalledWith("resize", expect.any(Function));

  add.mockRestore(); rem.mockRestore();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> assert <i>outputs and externally visible effects</i> (returned values, calls to storage/network, timers).</li>
                    <li><b>Do</b> use <Styled.InlineCode>act</Styled.InlineCode> around state updates; use <Styled.InlineCode>waitFor</Styled.InlineCode> for async.</li>
                    <li><b>Do</b> use a <Styled.InlineCode>wrapper</Styled.InlineCode> for context-dependent hooks.</li>
                    <li><b>Don't</b> test private implementation details (internal variable names, setState calls).</li>
                    <li><b>Don't</b> rely on exact timing; prefer logical outcomes over millisecond precision.</li>
                    <li><b>Don't</b> forget cleanup assertions for listeners/timers.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Test double:</b> a generic replacement for a real dependency (mock, stub, or spy).</li>
                    <li><b>Mock:</b> a programmable fake with expectations (e.g., <Styled.InlineCode>jest.fn()</Styled.InlineCode>).</li>
                    <li><b>Spy:</b> records calls to real or fake functions (e.g., <Styled.InlineCode>jest.spyOn()</Styled.InlineCode>).</li>
                    <li><b>Stub:</b> preprogrammed fake that returns fixed data.</li>
                    <li><b>act:</b> helper that ensures React processes updates before assertions.</li>
                    <li><b>renderHook:</b> executes a hook and returns a handle to inspect results and lifecycle.</li>
                    <li><b>wrapper:</b> provider component to supply context while the hook runs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Test hooks by exercising their public API - returned values and actions -
                simulate effects with mocks, wait for async outcomes, and verify cleanup. Prefer
                <i>behavior</i> over implementation details for durable tests.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default HooksTests;
