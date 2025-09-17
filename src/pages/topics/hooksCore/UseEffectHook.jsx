import React from "react";
import { Styled } from "./styled";

const UseEffectHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useEffect</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useEffect</Styled.InlineCode> runs <b>side effects</b> after React updates the DOM.
                Use it for work that touches the outside world: fetching, subscriptions, timers, logging, and imperative APIs.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Effect:</b> code that runs after the component commits to the DOM.</li>
                    <li><b>Cleanup:</b> a function returned by the effect; React calls it before the effect re-runs and on unmount.</li>
                    <li><b>Dependency array:</b> list of reactive values used by the effect. React re-runs the effect when any of them change.</li>
                    <li><b>Render phase:</b> calculating JSX (no DOM changes). Effects do <em>not</em> run here.</li>
                    <li><b>Commit phase:</b> DOM is updated, then effects run.</li>
                    <li><b>useLayoutEffect:</b> like <Styled.InlineCode>useEffect</Styled.InlineCode>, but runs <em>synchronously</em> after DOM mutations and <em>before</em> the browser paints. Use for measurements and synchronous DOM reads/writes.</li>
                    <li><b>Strict Mode (dev):</b> React mounts, immediately cleans up, then mounts again to surface bugs; effects may run twice in development only.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use vs avoid */}
            <Styled.Section>
                <Styled.H2>When to use (and when to avoid)</Styled.H2>
                <Styled.List>
                    <li><b>Use for:</b> network requests, event listeners, subscriptions, timers, logging/analytics, imperative APIs (focus, media, third-party widgets).</li>
                    <li><b>Avoid for:</b> deriving values from props/state (compute during render), formatting values (render or <Styled.InlineCode>useMemo</Styled.InlineCode>), or handling UI events (use handlers directly).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Basic usage & dependency forms */}
            <Styled.Section>
                <Styled.H2>Basic usage & dependency forms</Styled.H2>
                <Styled.Pre>
                    {`import { useEffect, useState } from "react";

// A) No deps → runs after every render
useEffect(() => {
  document.title = "Counter app";
});

// B) Empty deps [] → run once on mount, cleanup on unmount
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);   // cleanup
}, []);

// C) With deps [count] → run when 'count' changes
function Title({ count }) {
  useEffect(() => {
    document.title = "Count: " + count;
  }, [count]);
  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Always include every reactive value used inside the effect in the dependency array.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cleanup examples */}
            <Styled.Section>
                <Styled.H2>Cleanup examples</Styled.H2>
                <Styled.Pre>
                    {`// Event listener
useEffect(() => {
  function onKey(e) { if (e.key === "Escape") console.log("esc"); }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

// Subscriptions (e.g., WebSocket)
useEffect(() => {
  const socket = new WebSocket("wss://example.test");
  socket.addEventListener("message", ev => console.log(ev.data));
  return () => socket.close();
}, []);`}
                </Styled.Pre>
                <Styled.Small>
                    If the effect sets something up, the cleanup should undo it (remove listener, clear timer, close connection).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Fetching with cancellation (avoid race conditions) */}
            <Styled.Section>
                <Styled.H2>Fetching with cancellation (avoid races)</Styled.H2>
                <Styled.Pre>
                    {`import { useEffect, useState } from "react";

function User({ id }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "error" | "ready"

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    fetch("https://api.example.test/users/" + id, { signal: ctrl.signal })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(json => setData(json))
      .then(() => setStatus("ready"))
      .catch(err => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => ctrl.abort(); // cancel stale request when id changes or unmounts
  }, [id]);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error")   return <p role="alert">Failed to load</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Changing <Styled.InlineCode>id</Styled.InlineCode> cancels the previous request and starts a fresh one, preventing stale data from winning the race.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Measuring layout → useLayoutEffect */}
            <Styled.Section>
                <Styled.H2>Measuring layout (useLayoutEffect)</Styled.H2>
                <Styled.Pre>
                    {`import { useLayoutEffect, useRef, useState } from "react";

function MeasureBox() {
  const ref = useRef(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    // DOM is updated but not painted yet → measurement is safe, no flicker
    const rect = ref.current.getBoundingClientRect();
    setH(rect.height);
  }, []);

  return <div ref={ref}>Height is {h}px</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer <Styled.InlineCode>useEffect</Styled.InlineCode> for most work. Use <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> only for synchronous reads/writes where flicker matters.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Dependency rules */}
            <Styled.Section>
                <Styled.H2>Dependency rules</Styled.H2>
                <Styled.List>
                    <li>Include all values used inside the effect that come from props, state, or context.</li>
                    <li>Functions created in render are reactive values; wrap them with <Styled.InlineCode>useCallback</Styled.InlineCode> if the effect depends on a stable reference.</li>
                    <li>Refs (<Styled.InlineCode>ref.current</Styled.InlineCode>) are mutable and do not trigger renders; reading/writing them does not require adding the ref object to deps (unless you replace the ref).</li>
                    <li>It’s safe to exclude <Styled.InlineCode>setState</Styled.InlineCode> functions; setters are stable.</li>
                    <li>Avoid disabling the ESLint rule permanently; fix dependency issues by restructuring code (split effects, move computations, memoize callbacks).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Split effects if they depend on different things
useEffect(() => { document.title = "Count: " + count; }, [count]);
useEffect(() => { console.log("User changed", userId); }, [userId]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Making the effect callback <em>async</em> directly. Declare an async function inside and call it.</li>
                    <li>Missing deps → stale closures (effect reads old values). Always include dependencies or refactor.</li>
                    <li>Putting pure derivations in effects; compute during render instead.</li>
                    <li>Mutating state in a loop or without guards; prefer functional updaters where needed.</li>
                    <li>Using <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> unnecessarily, causing layout thrash or blocking paint.</li>
                </Styled.List>
                <Styled.Pre>
                    {`useEffect(() => {
  let cancelled = false;
  async function load() {
    const res = await fetch("/api/data");
    if (!cancelled) {
      // safe to update
    }
  }
  load();
  return () => { cancelled = true; };
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use effects for external systems (network, subscriptions, timers, DOM APIs).</li>
                    <li><b>Do</b> clean up listeners/timers/subscriptions in the cleanup function.</li>
                    <li><b>Do</b> include all reactive dependencies; split effects or memoize callbacks when needed.</li>
                    <li><b>Don’t</b> compute derived values in effects; compute during render or memoize.</li>
                    <li><b>Don’t</b> forget to handle request cancellation to avoid race conditions.</li>
                    <li><b>Don’t</b> overuse <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>; only for measurements or synchronous DOM writes that must block paint.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useEffect</Styled.InlineCode> synchronizes components with external systems.
                Keep effects focused, include the right dependencies, and clean up thoroughly.
                Measure layout with <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> only when needed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseEffectHook;
