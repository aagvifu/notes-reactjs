import { Styled } from "./styled";

const DeferWork = () => {
    return (
        <Styled.Page>
            <Styled.Title>Defer Work</Styled.Title>

            <Styled.Lead>
                <b>Defer work</b> means postponing non-urgent computations or rendering so the UI stays
                responsive. The goal is to keep typing, clicks, and basic interactions smooth while heavier
                work completes later (or in smaller chunks).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Main thread:</b> where JS runs and the browser lays out/paints your page. If JS blocks, the UI can't update.</li>
                    <li><b>Blocking:</b> a long task (loops, parsing, heavy renders) preventing the browser from handling input/paint.</li>
                    <li><b>Frame budget:</b> at 60 FPS you get ~<b>16.7ms</b> per frame. If work exceeds this, users see jank.</li>
                    <li><b>Urgent update:</b> must reflect immediately (e.g., input value on keypress).</li>
                    <li><b>Non-urgent update:</b> can lag a bit (e.g., filtering a huge list after typing).</li>
                    <li><b>Defer:</b> schedule non-urgent work later (low priority, next frame, idle time, or in chunks).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to defer */}
            <Styled.Section>
                <Styled.H2>When to Defer</Styled.H2>
                <Styled.List>
                    <li>Heavy computations triggered by <b>every keystroke</b> (filtering/sorting huge lists).</li>
                    <li>Rendering <b>large trees</b> after small inputs (search results, tables).</li>
                    <li>Loading <b>rarely used</b> components (charts, editors, modals) - use code-splitting.</li>
                    <li>Non-visual tasks (analytics, precomputations) that don't need to run immediately.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Technique: startTransition */}
            <Styled.Section>
                <Styled.H2>Technique 1: <code>startTransition</code> (mark updates as non-urgent)</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> <Styled.InlineCode>startTransition</Styled.InlineCode> tells React “this state update is low priority.” Urgent updates (typing) stay snappy; the deferred update can render later.</li>
                    <li><b>Use case:</b> typing in a search box (urgent) while rendering a big filtered list (non-urgent).</li>
                </Styled.List>
                <Styled.Pre>
                    {`import React, { startTransition, useState } from "react";

function SearchLargeList({ items }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(items);

  function onChange(e) {
    const next = e.target.value;
    setQuery(next); // urgent: keep input responsive

    // non-urgent: recompute heavy results
    startTransition(() => {
      const q = next.trim().toLowerCase();
      const filtered = items.filter(it => it.name.toLowerCase().includes(q));
      setResults(filtered);
    });
  }

  return (
    <>
      <input value={query} onChange={onChange} placeholder="Search..." />
      <ul>{results.map(it => <li key={it.id}>{it.name}</li>)}</ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    React may pause/continue the deferred render to keep the UI responsive. Don't wrap <i>every</i> update; only the non-urgent ones.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Technique: useDeferredValue */}
            <Styled.Section>
                <Styled.H2>Technique 2: <code>useDeferredValue</code> (lag a value, not the UI)</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> <Styled.InlineCode>useDeferredValue(value)</Styled.InlineCode> returns a “lagging” version of a value. The original updates immediately; the deferred value updates later when React is free.</li>
                    <li><b>Use case:</b> pass a deferred query to an expensive child so typing remains instant.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import React from "react";

function ExpensiveList({ query, items }) {
  // pretend this render is expensive when query changes
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(it => it.name.toLowerCase().includes(q));
  }, [items, query]);

  return <ul>{filtered.map(it => <li key={it.id}>{it.name}</li>)}</ul>;
}

export default function SearchWithDeferred({ items }) {
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query); // may lag behind "query"

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ExpensiveList query={deferredQuery} items={items} />
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Great for keeping a controlled input instant while heavy children lag slightly.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Technique: Code-splitting */}
            <Styled.Section>
                <Styled.H2>Technique 3: Code-Splitting with <code>lazy</code> + <code>Suspense</code></Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> load components on demand so initial render is light.</li>
                    <li><b>Use case:</b> defer heavy chart/editor until the user opens it.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import React, { lazy, Suspense, useState } from "react";
const Chart = lazy(() => import("./HeavyChart"));

export default function Report() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Show Chart</button>
      {open && (
        <Suspense fallback={<div>Loading chart…</div>}>
          <Chart />
        </Suspense>
      )}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Users who never open the chart never download it - instant win for performance.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Technique: break long tasks */}
            <Styled.Section>
                <Styled.H2>Technique 4: Break Long Tasks (idle time / next frame)</Styled.H2>
                <Styled.List>
                    <li><b>requestIdleCallback (rIC):</b> runs when the browser is idle; not supported everywhere and not time-guaranteed.</li>
                    <li><b>requestAnimationFrame (rAF):</b> runs before the next paint; good for visual step-by-step work.</li>
                    <li><b>Chunking:</b> slice large loops into smaller batches so the browser can breathe between them.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Chunk a large array in idle time, with a fallback
function processInChunks(items, each, done) {
  const CHUNK = 500;

  function work(deadline) {
    while ((deadline?.timeRemaining?.() ?? 0) > 0 && items.length) {
      for (let i = 0; i < CHUNK && items.length; i++) each(items.shift());
    }
    if (items.length) {
      schedule(); // more remains
    } else {
      done?.();
    }
  }

  function schedule() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(work);
    } else {
      // Fallback: schedule next macrotask
      setTimeout(() => work({ timeRemaining: () => 10 }), 0);
    }
  }

  schedule();
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use for background transformations, precomputations, or large JSON processing without freezing the UI.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Technique: effects & priorities */}
            <Styled.Section>
                <Styled.H2>Technique 5: Move Non-Visual Work to Effects</Styled.H2>
                <Styled.List>
                    <li>Don't compute heavy results during render. Compute inside <Styled.InlineCode>useEffect</Styled.InlineCode> after the paint, or mark as a transition.</li>
                    <li>Persist results (state/ref) and reuse with <Styled.InlineCode>useMemo</Styled.InlineCode> when inputs don't change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function HeavyCompute({ input }) {
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    // simulate heavy async compute
    Promise.resolve().then(() => {
      const r = expensiveFn(input);
      if (!cancelled) setResult(r);
    });
    return () => { cancelled = true; };
  }, [input]);

  return <div>{result ?? "Computing…"}</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Technique: offload to Web Workers */}
            <Styled.Section>
                <Styled.H2>Technique 6: Offload CPU to Web Workers</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> a Web Worker runs JS on a background thread. Main thread stays free for UI.</li>
                    <li><b>Use case:</b> heavy CPU (parsing, image transforms, crypto, ML inference).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// worker.js
self.onmessage = (e) => {
  const result = heavyCompute(e.data);
  self.postMessage(result);
};

// in component:
// const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
// worker.postMessage(data);
// worker.onmessage = (e) => setResult(e.data);`}
                </Styled.Pre>
                <Styled.Small>
                    You have a separate topic for <i>Web Workers</i> - this is just how it relates to deferring work.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Event rate control */}
            <Styled.Section>
                <Styled.H2>Debounce & Throttle (control event rate)</Styled.H2>
                <Styled.List>
                    <li><b>Debounce:</b> wait until events stop for N ms, then run once (good for search).</li>
                    <li><b>Throttle:</b> run at most once per N ms during a burst (good for scroll/resize handlers).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function debounce(fn, ms=200){let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
function throttle(fn, ms=200){let t=0;return (...a)=>{const n=Date.now();if(n-t>=ms){t=n;fn(...a);}}}`}
                </Styled.Pre>
                <Styled.Small>
                    Use with scroll/resize/input to reduce work frequency. Combine with transitions for best UX.
                </Styled.Small>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> identify urgent vs non-urgent updates and mark non-urgent with transitions.</li>
                    <li><b>Do</b> code-split rarely used components and routes.</li>
                    <li><b>Do</b> chunk big loops and consider Web Workers for CPU-heavy tasks.</li>
                    <li><b>Don't</b> run heavy computations during render; prefer effects or workers.</li>
                    <li><b>Don't</b> wrap everything in <Styled.InlineCode>startTransition</Styled.InlineCode>; it's for user-perceived priority, not correctness.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Transition:</b> a lower-priority state update that may be interrupted to keep the UI responsive.</li>
                    <li><b>Deferred value:</b> a value React allows to lag behind the source temporarily.</li>
                    <li><b>Code-splitting:</b> splitting bundles so code loads on demand.</li>
                    <li><b>Chunking:</b> slicing big work into smaller batches across time.</li>
                    <li><b>Idle time:</b> moments when the browser has spare time to run background work.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Keep interactions snappy by separating <i>urgent</i> and <i>non-urgent</i> work.
                Use <b>startTransition</b> / <b>useDeferredValue</b> for priority, <b>code-splitting</b> to
                shrink initial work, <b>chunking</b> and <b>Web Workers</b> to avoid blocking the main thread.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DeferWork;
