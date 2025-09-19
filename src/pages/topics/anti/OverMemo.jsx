import { Styled } from "./styled";

const OverMemo = () => {
    return (
        <Styled.Page>
            <Styled.Title>Anti-Pattern: Over-Memoization (OverMemo)</Styled.Title>

            <Styled.Lead>
                <b>Over-memoization</b> is the habit of sprinkling <Styled.InlineCode>useMemo</Styled.InlineCode>,{" "}
                <Styled.InlineCode>useCallback</Styled.InlineCode>, and <Styled.InlineCode>React.memo</Styled.InlineCode> everywhere "just in case".
                Memoization is a tool to avoid expensive recalculations or rerenders—<i>not</i> a default setting.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Memoization:</b> Caching the result of a computation so that when the same inputs occur again,
                        we reuse the cached result instead of recomputing. In React, common tools are{" "}
                        <Styled.InlineCode>useMemo</Styled.InlineCode> (cache a value),{" "}
                        <Styled.InlineCode>useCallback</Styled.InlineCode> (cache a function identity), and{" "}
                        <Styled.InlineCode>React.memo</Styled.InlineCode> (skip re-render if props are shallow-equal).
                    </li>
                    <li>
                        <b>Re-render:</b> When a component function runs again to produce UI. Renders are cheap by design;
                        React reconciles actual DOM changes efficiently.
                    </li>
                    <li>
                        <b>Shallow equality:</b> A quick check comparing object references and primitive values at one level
                        (not deep compare). Used by <Styled.InlineCode>React.memo</Styled.InlineCode> to decide if props "changed".
                    </li>
                    <li>
                        <b>Referential equality:</b> Two references point to the exact same object/function in memory
                        (<Styled.InlineCode>a === b</Styled.InlineCode>). Many memo strategies depend on this.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why over-memo is a problem */}
            <Styled.Section>
                <Styled.H2>Why "OverMemo" Hurts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Extra work:</b> Memoization itself costs CPU (dependency comparison + cache maintenance).
                        If the computation is cheap, the memo layer can cost more than recomputing.
                    </li>
                    <li>
                        <b>Complexity:</b> It spreads dependency arrays and identity rules all over your code,
                        increasing cognitive load and bug surface (e.g., stale values).
                    </li>
                    <li>
                        <b>Illusion of speed:</b> It can feel "optimized" while making the app harder to change and sometimes slower.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) When to memo (the good cases) */}
            <Styled.Section>
                <Styled.H2>When Memoization <i>Does</i> Help</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Expensive computations:</b> Sorting/formatting large lists, heavy data transforms, complex layout math.
                    </li>
                    <li>
                        <b>Stable identities for Pure children:</b> If a child is wrapped in <Styled.InlineCode>React.memo</Styled.InlineCode>{" "}
                        or uses referential equality in effects, pass memoized objects/functions to prevent unnecessary updates.
                    </li>
                    <li>
                        <b>Event handlers passed deep:</b> Memoize with <Styled.InlineCode>useCallback</Styled.InlineCode> when a stable identity avoids avoidable renders.
                    </li>
                </Styled.List>
                <Styled.Small>Rule of thumb: Do it because you measured a bottleneck or a child truly benefits—not by default.</Styled.Small>
            </Styled.Section>

            {/* 4) Bad example: gratuitous useMemo/useCallback */}
            <Styled.Section>
                <Styled.H2>Anti-Example: Gratuitous Memoization</Styled.H2>
                <Styled.Pre>
                    {`function PriceTag({ price }) {
  // ❌ Unnecessary: formatting is trivial
  const formatted = React.useMemo(() => Intl.NumberFormat().format(price), [price]);

  // ❌ Unnecessary: local inline callback won't be passed to memoized child
  const onClick = React.useCallback(() => {
    console.log("clicked");
  }, []);

  return <button onClick={onClick}>₹{formatted}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Here, both memoizations add cost and noise with no measurable benefit. Just compute directly and inline the handler.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Good example: real work + React.memo child */}
            <Styled.Section>
                <Styled.H2>Good Example: Real Work &amp; Stable Props</Styled.H2>
                <Styled.Pre>
                    {`const List = React.memo(function List({ rows }) {
  // Re-renders only if rows reference changes (shallow).
  return rows.map(r => <div key={r.id}>{r.label}</div>);
});

function Dashboard({ data }) {
  // ✅ Heavy transform: worth memoizing
  const rows = React.useMemo(() => {
    // simulate expensive work
    const out = [];
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      out.push({ id: d.id, label: d.name.toUpperCase() });
    }
    return out;
  }, [data]);

  return <List rows={rows} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    We memoize a <i>heavy</i> transform to keep <Styled.InlineCode>rows</Styled.InlineCode> stable for a memoized child.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Stale values & dependency pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Stale values:</b> A memoized value/handler may capture old state/props if dependencies are incomplete.
                        Always include everything the callback/value uses in the dependency array.
                    </li>
                    <li>
                        <b>Unstable dependencies:</b> If a dependency changes every render (e.g., inline object), your memo never hits.
                        Stabilize the dependency itself or restructure the code.
                    </li>
                    <li>
                        <b>Memo "pinball":</b> Adding <Styled.InlineCode>useMemo</Styled.InlineCode> causes you to add{" "}
                        <Styled.InlineCode>useCallback</Styled.InlineCode>, then{" "}
                        <Styled.InlineCode>React.memo</Styled.InlineCode>, and so on, to "make it work."
                        Step back—measure first.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Filters({ onChange }) {
  // ❌ New object each render -> breaks memo downstream
  const query = { limit: 20, sort: "date" };

  // ✅ Stabilize with useMemo if identity matters
  // const query = React.useMemo(() => ({ limit: 20, sort: "date" }), []);

  React.useEffect(() => {
    onChange(query); // dependency should include query if used
  }, [onChange, query]);

  return null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) useCallback: identity vs behavior */}
            <Styled.Section>
                <Styled.H2><code>useCallback</code>: Identity vs Behavior</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Identity stability:</b> The main reason to use <Styled.InlineCode>useCallback</Styled.InlineCode> is to keep the
                        function reference the same across renders (for memoized children or dependency arrays).
                    </li>
                    <li>
                        <b>Behavior freshness:</b> The callback must still "see" the latest state/props.
                        Ensure all referenced values are in the dependency list, or use an approach like <Styled.InlineCode>useEvent</Styled.InlineCode> (stable identity that calls the latest handler).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Counter() {
  const [n, setN] = React.useState(0);

  // ✅ Correct: includes setN (stable) and n (changes), so identity changes with n.
  const inc = React.useCallback(() => setN(n + 1), [n]);

  return <button onClick={inc}>Count: {n}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Measure first: how to verify */}
            <Styled.Section>
                <Styled.H2>Measure Before Optimizing</Styled.H2>
                <Styled.List>
                    <li>
                        <b>React DevTools Profiler:</b> Record interactions and see which components re-render and why.
                    </li>
                    <li>
                        <b>Console timings:</b> Wrap expensive sections with <Styled.InlineCode>performance.now()</Styled.InlineCode>{" "}
                        or <Styled.InlineCode>console.time</Styled.InlineCode>/<Styled.InlineCode>timeEnd</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Realistic data:</b> Test with production-like list sizes and real interaction patterns.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// quick micro-measure
const t0 = performance.now();
const result = heavyTransform(data);
const t1 = performance.now();
console.log("heavyTransform took", (t1 - t0).toFixed(2), "ms");`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start simple; optimize only identified hotspots.</li>
                    <li><b>Do</b> memoize heavy computations or props passed to memoized children.</li>
                    <li><b>Do</b> keep dependency arrays complete to avoid stale values.</li>
                    <li><b>Don't</b> memoize trivial computations (formatting a single number, small maps).</li>
                    <li><b>Don't</b> force <Styled.InlineCode>React.memo</Styled.InlineCode> everywhere—props often change legitimately.</li>
                    <li><b>Don't</b> chase referential equality at the cost of clarity and correctness.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Quick Checklist</Styled.H2>
                <Styled.List>
                    <li>Is the computation expensive or the list large?</li>
                    <li>Is a child <Styled.InlineCode>React.memo</Styled.InlineCode> component re-rendering pointlessly?</li>
                    <li>Did profiling show a real bottleneck?</li>
                    <li>Are dependency arrays complete and stable?</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Memoization is powerful when targeted at real costs (heavy work, stable props for memoized children).
                Used everywhere, it adds overhead and complexity. Profile first, optimize where it matters, and keep code clear.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default OverMemo;
