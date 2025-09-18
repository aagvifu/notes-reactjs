import React, { Profiler as ReactProfiler } from "react";
import { Styled } from "./styled";


const ProfilerPage = () => {
    // Simple in-page logger (kept tiny to avoid adding overhead during profiling)
    const onRender = React.useCallback(
        (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
            // id            => string you give to <Profiler id="...">
            // phase         => "mount" | "update" (what kind of commit happened)
            // actualDuration=> time (ms) to render this subtree for this commit
            // baseDuration  => time (ms) to render the entire subtree without memoization
            // startTime     => when React started rendering this update
            // commitTime    => when React committed the DOM updates
            // interactions  => deprecated scheduling traces (React <18 Tracing); omitted by React DevTools
            // Keep this callback FAST-log and bail. Heavy work will skew the numbers.
            // eslint-disable-next-line no-console
            console.log(`[Profiler:${id}]`, { phase, actualDuration, baseDuration, startTime, commitTime });
        },
        []
    );

    return (
        <Styled.Page>
            <Styled.Title>Profiler</Styled.Title>

            <Styled.Lead>
                The React <b>&lt;Profiler&gt;</b> measures render performance for a part of your component tree.
                Wrap a subtree with it and React will call your <Styled.InlineCode>onRender</Styled.InlineCode> callback
                after each <em>commit</em> with precise timings. Use it to locate slow renders and validate
                optimizations (like memoization or list virtualization).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core definitions</Styled.H2>
                <Styled.List>
                    <li><b>Render phase:</b> React calculates what the UI <em>should</em> look like (reconciliation, diffing).</li>
                    <li><b>Commit phase:</b> React applies changes to the real DOM and runs layout effects.</li>
                    <li><b>Commit:</b> One batch of DOM updates applied as a result of rendering; Profiler reports per-commit.</li>
                    <li><b>Subtree:</b> The part of the component tree wrapped by <Styled.InlineCode>&lt;Profiler&gt;</Styled.InlineCode>.</li>
                    <li><b>actualDuration:</b> Time (ms) it took to render the wrapped subtree for <em>this</em> commit.</li>
                    <li><b>baseDuration:</b> Estimated time (ms) to render the entire subtree <em>without</em> memoization/short-circuits (a baseline to compare against).</li>
                    <li><b>phase:</b> <Styled.InlineCode>"mount"</Styled.InlineCode> for first paint, <Styled.InlineCode>"update"</Styled.InlineCode> for subsequent re-renders.</li>
                    <li><b>startTime / commitTime:</b> High-resolution timestamps (ms) for when rendering started and when the DOM changes were committed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic usage */}
            <Styled.Section>
                <Styled.H2>Basic usage</Styled.H2>
                <Styled.Pre>
                    {`import React, { Profiler as ReactProfiler } from "react";

function App() {
  const onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    console.log(\`[Profiler:\${id}] \${phase} took \${actualDuration.toFixed(2)}ms (base \${baseDuration.toFixed(2)}ms)\`);
  };

  return (
    <ReactProfiler id="SearchArea" onRender={onRender}>
      <SearchArea />
    </ReactProfiler>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Give each Profiler a unique <Styled.InlineCode>id</Styled.InlineCode>. Keep{" "}
                    <Styled.InlineCode>onRender</Styled.InlineCode> extremely small-log, then exit.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Example: measure a filter box (mount vs update) */}
            <Styled.Section>
                <Styled.H2>Example: measuring a filter box (mount vs update)</Styled.H2>
                <Styled.Pre>
                    {`function SlowList({ items, query }) {
  // Simulate heavy work: expensive filtering + formatting.
  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    // worst-case O(n)
    const out = items.filter(x => x.name.toLowerCase().includes(q));
    // pretend formatting work
    for (let i = 0; i < 20000; i++) {} // CPU spin to make slowness visible
    return out;
  }, [items, query]);

  return (
    <ul>{visible.map(it => <li key={it.id}>{it.name}</li>)}</ul>
  );
}

function SearchArea() {
  const [q, setQ] = React.useState("");
  const items = React.useMemo(() => Array.from({length: 2000}, (_, i) =>
    ({ id: i, name: "Item " + i })), []);

  return (
    <>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Type to filter…"
      />
      <SlowList items={items} query={q} />
    </>
  );
}

function Page() {
  const onRender = (id, phase, actualDuration, baseDuration) => {
    console.log(\`[\${id}] \${phase} actual=\${actualDuration.toFixed(1)}ms base=\${baseDuration.toFixed(1)}ms\`);
  };

  return (
    <React.Profiler id="FilterProfiler" onRender={onRender}>
      <SearchArea />
    </React.Profiler>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Observe the console while typing: <b>mount</b> vs <b>update</b> timings differ. Optimizations (memoization, virtualization)
                    should reduce <em>actualDuration</em> while <em>baseDuration</em> remains a reference of raw work.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Aggregating results */}
            <Styled.Section>
                <Styled.H2>Aggregating results</Styled.H2>
                <Styled.Pre>
                    {`function useProfilerSummary() {
  const storeRef = React.useRef(new Map()); // id -> { commits, total, worst }

  const onRender = React.useCallback((id, phase, actualDuration) => {
    const s = storeRef.current.get(id) ?? { commits: 0, total: 0, worst: 0 };
    s.commits += 1;
    s.total += actualDuration;
    s.worst = Math.max(s.worst, actualDuration);
    storeRef.current.set(id, s);
  }, []);

  const summary = React.useMemo(() => {
    return Array.from(storeRef.current, ([id, s]) => ({
      id, commits: s.commits,
      avg: s.total / s.commits,
      worst: s.worst
    }));
  }, [storeRef.current.size]); // read on demand or expose a getter

  return { onRender, summary };
}

function ProfiledArea() {
  const { onRender, summary } = useProfilerSummary();
  return (
    <>
      <React.Profiler id="HeavyWidget" onRender={onRender}>
        <HeavyWidget />
      </React.Profiler>
      {/* You could render summary in a table, or send it to analytics */}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Aggregate per-id stats to spot hot components (highest <em>worst</em> or <em>avg</em>). Keep aggregation cheap.
                </Styled.Small>
            </Styled.Section>

            {/* 5) React DevTools Profiler */}
            <Styled.Section>
                <Styled.H2>React DevTools Profiler (GUI)</Styled.H2>
                <Styled.List>
                    <li>Open the <b>Profiler</b> tab in React DevTools.</li>
                    <li>Click <b>Start profiling</b>, interact with the app, then <b>Stop</b>.</li>
                    <li>Inspect the <b>Flamegraph</b> (time per component) or <b>Ranked</b> (slowest first).</li>
                    <li>Look at “<b>Why did this render?</b>” to see state/props causing re-renders.</li>
                    <li>Use <b>Commit</b> dropdown to analyze each commit. Aim to reduce the slowest commits first.</li>
                </Styled.List>
                <Styled.Small>
                    DevTools Profiler is best for visual analysis; the <Styled.InlineCode>&lt;Profiler&gt;</Styled.InlineCode> component is best for custom logging and CI experiments.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Patterns & best practices */}
            <Styled.Section>
                <Styled.H2>Patterns &amp; best practices</Styled.H2>
                <Styled.List>
                    <li><b>Wrap narrowly:</b> Target specific subtrees (lists, charts) rather than the whole app.</li>
                    <li><b>Keep onRender tiny:</b> Logging only. Heavy work will distort timings.</li>
                    <li><b>Compare actual vs base:</b> If <em>actual</em> ≈ <em>base</em>, memoization isn't helping; revisit keys, <Styled.InlineCode>React.memo</Styled.InlineCode>, or state placement.</li>
                    <li><b>Profile real scenarios:</b> Use production builds locally (<Styled.InlineCode>vite build && vite preview</Styled.InlineCode>)-development has extra checks.</li>
                    <li><b>Measure before/after:</b> Take a baseline, apply an optimization (memoization, virtualization), re-measure.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> profile user-critical paths (typing, scrolling, opening modals).</li>
                    <li><b>Do</b> use small, well-named <Styled.InlineCode>id</Styled.InlineCode>s to differentiate areas.</li>
                    <li><b>Don't</b> run expensive code inside <Styled.InlineCode>onRender</Styled.InlineCode>.</li>
                    <li><b>Don't</b> assume micro-benchmarks represent real UX-profile end-to-end interactions.</li>
                    <li><b>Don't</b> forget to remove test-only CPU spins or debug logs after investigation.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Profiler:</b> React component that measures render timings for a subtree.</li>
                    <li><b>Flamegraph:</b> Visualization in DevTools showing where time is spent per component.</li>
                    <li><b>Ranked view:</b> List of components sorted by time spent rendering.</li>
                    <li><b>Reconciliation:</b> Process of comparing previous and next virtual trees to compute changes.</li>
                    <li><b>Virtual DOM:</b> In-memory representation of UI used by React to compute updates.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: wrap performance-sensitive areas with <Styled.InlineCode>&lt;Profiler&gt;</Styled.InlineCode>,
                keep the callback lightweight, and use the numbers (and DevTools) to guide optimizations like
                memoization and list virtualization-measure, don't guess.
            </Styled.Callout>

            {/* Embedded demo area wrapped by a live Profiler (optional for this page itself) */}
            <Styled.Section>
                <Styled.H2>Inline demo (optional)</Styled.H2>
                <Styled.Small>
                    This page also wraps a small demo subtree to show <em>mount</em>/<em>update</em> timings in your console.
                </Styled.Small>

                <ReactProfiler id="ProfilerPageDemo" onRender={onRender}>
                    <Demo />
                </ReactProfiler>
            </Styled.Section>
        </Styled.Page>
    );
};

/* Tiny demo used by the inline Profiler on this page */
function Demo() {
    const [n, setN] = React.useState(0);
    const items = React.useMemo(() => Array.from({ length: 1000 }, (_, i) => i), []);
    const doubled = React.useMemo(() => items.map(x => x * 2 + n), [items, n]);

    return (
        <>
            <button onClick={() => setN(v => v + 1)}>Re-render demo ({n})</button>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4 }}>
                {doubled.slice(0, 100).map(v => <span key={v}>{v}</span>)}
            </div>
        </>
    );
}

export default ProfilerPage;
