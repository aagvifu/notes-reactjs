import React from "react";
import { Styled } from "./styled";

const Debugging = () => {
    return (
        <Styled.Page>
            <Styled.Title>Debugging (React + Vite)</Styled.Title>
            <Styled.Lead>
                Core workflows to find and fix issues quickly: browser DevTools, React
                DevTools, source maps, breakpoints, network inspection, and a few
                patterns that prevent bugs in the first place.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Goals while debugging</Styled.H2>
                <Styled.List>
                    <li>Reproduce the problem consistently.</li>
                    <li>Locate the failing code path (stack trace or breakpoint).</li>
                    <li>Inspect state/props/variables at the moment of failure.</li>
                    <li>Fix with a minimal change and verify no regressions.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Browser DevTools — quick tour</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Elements</b>: inspect DOM, view applied CSS, toggle rules, force
                        states (:hover, :focus).
                    </li>
                    <li>
                        <b>Console</b>: logs, expressions, stack traces, <em>live</em> access
                        to selected element as <Styled.InlineCode>$0</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Sources</b>: set breakpoints, step through code, watch variables.
                    </li>
                    <li>
                        <b>Network</b>: request/response headers, status, payloads, caching.
                    </li>
                    <li>
                        <b>Application/Storage</b>: LocalStorage, SessionStorage, IndexedDB,
                        cookies; clear stale data.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Console essentials (beyond <code>log</code>)</Styled.H2>
                <Styled.Pre>
                    {`// Label logs so stacks are scannable
console.log("[FetchUser] start", { userId });

// Pretty-print arrays/objects
console.table(rows);
console.dir(node, { depth: 1 });

// Timings
console.time("expensive");
doWork();
console.timeEnd("expensive");

// Group related logs
console.group("Submit form");
console.log("payload", payload);
console.log("valid", isValid);
console.groupEnd();

// Assertions (throws if condition is false in dev)
console.assert(Array.isArray(items), "items must be an array");

// Where did this log come from?
console.trace("who called me?");`}
                </Styled.Pre>
                <Styled.Small>
                    Keep production logs minimal; excessive logging can leak data and slow apps.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Breakpoints & stepping</Styled.H2>
                <Styled.List>
                    <li>
                        Click the line number in <b>Sources</b> to set a breakpoint; refresh to hit it.
                    </li>
                    <li>
                        Use <b>conditional breakpoints</b> (right-click line) e.g.{" "}
                        <Styled.InlineCode>count &gt; 100</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Logpoints</b> (Chromium): print without editing code.
                    </li>
                    <li>
                        The <Styled.InlineCode>debugger;</Styled.InlineCode> statement pauses when DevTools is open.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: pause only when value is unexpected
if (total < 0) debugger;`}
                </Styled.Pre>
                <Styled.Small>
                    Use <b>Watch</b> panel for expressions and <b>Call Stack</b> to navigate frames. Blackbox vendor code to
                    focus on app modules.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Source maps (see real files in stack traces)</Styled.H2>
                <Styled.List>
                    <li>Vite enables source maps in <b>dev</b> automatically.</li>
                    <li>
                        For <b>production</b> maps, enable in Vite:
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// vite.config.js (snippet)
export default defineConfig({
  build: { sourcemap: true }   // generate *.map files for prod debugging
});`}
                </Styled.Pre>
                <Styled.Small>
                    Ship prod maps only if needed (private deployments); otherwise keep them off to avoid exposing source.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>React DevTools</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Components</b> panel: inspect the component tree, view{" "}
                        <Styled.InlineCode>props</Styled.InlineCode>, <Styled.InlineCode>state</Styled.InlineCode>, and hook values.
                    </li>
                    <li>
                        Edit props/state inline to test UI behavior without changing code.
                    </li>
                    <li>
                        <b>Profiler</b>: record commits, find slow renders, see why updates occurred.
                    </li>
                    <li>
                        Verify component identity and <b>keys</b> in lists to avoid unnecessary remounts.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Typical gotcha: stale closure in effects
useEffect(() => {
  const id = setInterval(() => {
    // 'count' might be stale if not in deps:
    setCount(c => c + 1);  // prefer functional update
  }, 1000);
  return () => clearInterval(id);
}, []);  // OK with functional updates`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Network debugging</Styled.H2>
                <Styled.List>
                    <li>
                        Check <b>Status</b>, <b>Request URL</b>, <b>Method</b>, <b>Query</b>, and{" "}
                        <b>Response</b>. Inspect <b>CORS</b> and <b>cache</b> headers (200 vs 304).
                    </li>
                    <li>
                        Retry logic and timeouts prevent hanging UIs; log errors with context (endpoint, payload, user action).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Simple fetch with timeout and basic error surface
async function fetchJson(url, { signal, ...opts } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Runtime errors & boundaries</Styled.H2>
                <Styled.List>
                    <li>
                        Uncaught errors: see the red overlay in dev (Vite). Read the <b>top</b> of the stack first.
                    </li>
                    <li>
                        Add a small error boundary to catch render errors and show a fallback UI.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal error boundary (class-based)
import React from "react";
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Boundary caught:", error, info); }
  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>;
    return this.props.children;
  }
}
// Usage: <ErrorBoundary><App /></ErrorBoundary>`}
                </Styled.Pre>
                <Styled.Small>
                    For function components, use a small wrapper library or keep this class boundary; boundaries catch render,
                    lifecycle, and constructor errors below them.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Cleaning effects & avoiding leaks</Styled.H2>
                <Styled.List>
                    <li>
                        Clear timers, intervals, and event listeners in effect cleanups to avoid memory leaks.
                    </li>
                    <li>
                        Abort in-flight fetches on unmount to stop state updates on unmounted components.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`useEffect(() => {
  const controller = new AbortController();
  window.addEventListener("resize", onResize);
  const id = setInterval(tick, 1000);
  return () => {
    controller.abort();
    window.removeEventListener("resize", onResize);
    clearInterval(id);
  };
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Common causes & quick fixes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>"Cannot read property of undefined"</b>: log the value before use; add guards; check async timing.
                    </li>
                    <li>
                        <b>State not updating</b>: ensure immutable updates; avoid mutating arrays/objects directly.
                    </li>
                    <li>
                        <b>Effect runs too often</b>: check dependency array; move stable functions with{" "}
                        <Styled.InlineCode>useCallback</Styled.InlineCode> if needed; avoid putting fresh objects in deps.
                    </li>
                    <li>
                        <b>List re-renders / remounts</b>: make keys stable and unique; never use array index for dynamic lists.
                    </li>
                    <li>
                        <b>GH Pages deep-link 404</b>: add SPA fallback <code>404.html</code> or use HashRouter.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Small checklist</Styled.H2>
                <Styled.List>
                    <li>Reproduce → Inspect stack/trace → Set a breakpoint → Inspect variables.</li>
                    <li>Use React DevTools to verify props/state/hook values.</li>
                    <li>Clear caches/storage if stale data is suspected.</li>
                    <li>Add minimal logs with clear labels; remove noisy logs later.</li>
                    <li>Write a small test if the bug is subtle (prevents regressions).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: use DevTools + React DevTools for visibility, breakpoints for precision,
                source maps for readable stacks, and clean effect patterns to prevent leaks.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Debugging;
