import React from "react";
import { Styled } from "./styled";

const RenderCycle = () => {
    return (
        <Styled.Page>
            <Styled.Title>Render Cycle</Styled.Title>
            <Styled.Lead>
                The render cycle is how React turns state and props into DOM updates. It
                has two main stages: <b>render</b> (compute the next UI) and <b>commit</b>
                (apply changes to the DOM). Effects run around the commit.
            </Styled.Lead>

            {/* 1. Big picture */}
            <Styled.Section>
                <Styled.H2>Big picture (timeline)</Styled.H2>
                <Styled.List>
                    <li><b>Render</b> — call components (pure functions) → produce JSX (a virtual tree).</li>
                    <li><b>Diff</b> — compare previous tree vs next (reconciliation).</li>
                    <li><b>Commit</b> — update DOM (mutations), then run layout effects, browser paints, then run passive effects.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// High-level order (per update)
render() -> diff -> commit(mutating DOM)
 -> run useLayoutEffect create
 -> browser paints
 -> run useEffect create
// On next update/unmount: cleanups run before re-running creates`}
                </Styled.Pre>
            </Styled.Section>

            {/* 2. What triggers renders */}
            <Styled.Section>
                <Styled.H2>What triggers a render</Styled.H2>
                <Styled.List>
                    <li>Local <b>state</b> updates: <Styled.InlineCode>setState</Styled.InlineCode>.</li>
                    <li>Parent <b>re-renders</b>: children re-render by default (even if their props didn’t change).</li>
                    <li><b>Context</b> value changes: re-renders all consumers.</li>
                    <li><b>Key</b> changes or element type changes: forces a <em>remount</em> (new instance).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3. Render vs Commit */}
            <Styled.Section>
                <Styled.H2>Render vs Commit</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Render phase</b>: no DOM reads/writes should happen here; components should be pure (same inputs → same JSX, no side effects).
                    </li>
                    <li>
                        <b>Commit phase</b>: React mutates the DOM, then runs effects. Visual changes become visible after paint.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Side effects in render (anti-pattern)
function Comp({ url }) {
  fetch(url); // causes duplicate requests and race conditions
  return <div/>;
}

// ✅ Side effects in effects (after commit)
function Comp({ url }) {
  React.useEffect(() => {
    const c = new AbortController();
    fetch(url, { signal: c.signal });
    return () => c.abort();
  }, [url]);
  return <div/>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4. Effect timing */}
            <Styled.Section>
                <Styled.H2>Effect timing</Styled.H2>
                <Styled.List>
                    <li>
                        <b>useLayoutEffect</b> — runs <em>after</em> DOM mutations but <em>before</em> the browser paints. Use for
                        measuring layout or synchronously adjusting layout. Blocks paint; keep it quick.
                    </li>
                    <li>
                        <b>useEffect</b> — runs <em>after</em> paint. Use for subscriptions, network requests, timers, logging.
                    </li>
                    <li>
                        Cleanups run before the next time the effect runs, and on unmount.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Measure size: layout effect (pre-paint)
function Box() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect(); // safe here
    // ...position a popover using rect
  });
  return <div ref={ref} />;
}

// Fetch data: passive effect (post-paint)
function Users() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    let alive = true;
    fetch("/api/users").then(r => r.json()).then(d => {
      if (alive) setRows(d);
    });
    return () => { alive = false };
  }, []);
  return <List items={rows} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5. Batching */}
            <Styled.Section>
                <Styled.H2>Batching (React 18+)</Styled.H2>
                <p>
                    Multiple state updates in the same tick are batched into one render/commit, even across promises and timeouts.
                </p>
                <Styled.Pre>
                    {`// One render, one commit
setCount(c => c + 1);
setFlag(f => !f);

// Also batched (async)
setTimeout(() => {
  setA(1);
  setB(2);
}, 0);`}
                </Styled.Pre>
                <Styled.Small>
                    To force a synchronous update (rare cases like reading updated layout immediately), use <Styled.InlineCode>flushSync</Styled.InlineCode>.
                </Styled.Small>
                <Styled.Pre>
                    {`import { flushSync } from "react-dom";
flushSync(() => setOpen(true));
// DOM now reflects open=true; safe to measure synchronously`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6. Concurrent rendering (high level) */}
            <Styled.Section>
                <Styled.H2>Concurrent rendering (high-level)</Styled.H2>
                <Styled.List>
                    <li>
                        React can <b>start, pause, abandon, and retry</b> rendering before commit. Nothing shows until commit.
                    </li>
                    <li>
                        Keep render functions pure and idempotent—no side effects—since they may run multiple times.
                    </li>
                    <li>
                        Mark non-urgent updates as <b>transitions</b> to keep the UI responsive.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// useTransition: mark non-urgent work
import { useState, useTransition } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const q = e.target.value;
    setQuery(q); // urgent (keeps input snappy)
    startTransition(() => {
      // non-urgent: filter a big list, fetch suggestions, etc.
      filterResults(q);
    });
  }

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <Spinner />}
      <Results />
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7. Deferring derived values */}
            <Styled.Section>
                <Styled.H2>Deferring heavy derived work</Styled.H2>
                <p>
                    <b>useDeferredValue</b> lets the UI show the latest input while postponing heavy rendering that depends on it.
                </p>
                <Styled.Pre>
                    {`import { useState, useDeferredValue } from "react";

function Typeahead({ items }) {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text); // may lag slightly

  const filtered = React.useMemo(() => {
    // heavy filter
    return items.filter(x => x.includes(deferredText));
  }, [items, deferredText]);

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <List items={filtered} />
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8. Strict Mode behavior */}
            <Styled.Section>
                <Styled.H2>Strict Mode (development-only checks)</Styled.H2>
                <Styled.List>
                    <li>
                        In <b>development</b>, Strict Mode may intentionally double-invoke render and effect setup/cleanup to surface unsafe patterns.
                    </li>
                    <li>
                        This does <b>not</b> happen in production. Ensure effects are idempotent and have correct cleanups.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9. Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Side effects in render (e.g., fetching, subscriptions) → run in effects instead.
                    </li>
                    <li>
                        Blocking layout in <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> with heavy work → move to <Styled.InlineCode>useEffect</Styled.InlineCode> or defer.
                    </li>
                    <li>
                        Depending on stale values in effects → include proper deps or use functional updates.
                    </li>
                    <li>
                        Mutating state directly → React can’t detect changes; always create new objects/arrays.
                    </li>
                    <li>
                        Measuring layout in <Styled.InlineCode>useEffect</Styled.InlineCode> → runs after paint, measurements may flicker; measure in <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Stale closure fix: functional update
setCount(c => c + 1);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10. Performance checklist */}
            <Styled.Section>
                <Styled.H2>Performance checklist</Styled.H2>
                <Styled.List>
                    <li>Keep renders pure and fast; avoid heavy sync work in render.</li>
                    <li>Memoize expensive derived values with <Styled.InlineCode>useMemo</Styled.InlineCode> when inputs rarely change.</li>
                    <li>Use <Styled.InlineCode>React.memo</Styled.InlineCode> for pure child components to skip unchanged props.</li>
                    <li>Virtualize long lists; split code with <Styled.InlineCode>React.lazy</Styled.InlineCode> and Suspense.</li>
                    <li>Mark non-urgent updates with <Styled.InlineCode>useTransition</Styled.InlineCode>; use <Styled.InlineCode>useDeferredValue</Styled.InlineCode> for heavy derived work.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11. Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep side effects out of render; use effects.</li>
                    <li><b>Do</b> measure layout in <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>, not <Styled.InlineCode>useEffect</Styled.InlineCode>.</li>
                    <li><b>Do</b> rely on automatic batching; reach for <Styled.InlineCode>flushSync</Styled.InlineCode> only when necessary.</li>
                    <li><b>Don’t</b> assume one render per update; renders can be repeated or interrupted before commit.</li>
                    <li><b>Don’t</b> mutate state; always return new objects/arrays.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: render computes the next UI; commit applies it. Effects run around the commit, with
                <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> before paint and <Styled.InlineCode>useEffect</Styled.InlineCode> after. React batches updates and can
                restart rendering, so keep components pure and use transitions/deferrals to keep UIs responsive.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RenderCycle;
