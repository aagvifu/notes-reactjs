import React from "react";
import { Styled } from "./styled";

const UseMemoHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useMemo</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useMemo</Styled.InlineCode> memoizes the <b>result of a computation</b>.
                It returns a cached value while the dependency list stays equal, and recomputes when dependencies change.
                It is a <b>performance hint</b>—never required for correctness.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>Memoized value:</b> the cached result returned by <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Dependencies:</b> reactive inputs for the computation; when any changes, React recomputes.</li>
                    <li><b>Referential equality:</b> children using <Styled.InlineCode>React.memo</Styled.InlineCode> or effect dependencies often need a <b>stable reference</b> (same object/array) — <Styled.InlineCode>useMemo</Styled.InlineCode> helps.</li>
                    <li><b>Pure computation:</b> the callback must be side-effect free and deterministic for the given inputs.</li>
                    <li><b>Hint, not guarantee:</b> React may discard caches; do not rely on memo for correctness.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Expensive computation example */}
            <Styled.Section>
                <Styled.H2>Use for expensive computations</Styled.H2>
                <Styled.Pre>
                    {`function HeavyList({ items, query }) {
  const q = query.trim().toLowerCase();

  // Assume this filter + sort is heavy for large lists
  const visible = React.useMemo(() => {
    const filtered = items.filter(it => it.name.toLowerCase().includes(q));
    // heavy sort (localeCompare over many items)
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [items, q]);

  return <ul>{visible.map(it => <li key={it.id}>{it.name}</li>)}</ul>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Without <Styled.InlineCode>useMemo</Styled.InlineCode>, sorting runs every render. With it, sorting runs only when <Styled.InlineCode>items</Styled.InlineCode> or <Styled.InlineCode>q</Styled.InlineCode> changes.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Stable props for memoized children */}
            <Styled.Section>
                <Styled.H2>Provide stable props to memoized children</Styled.H2>
                <Styled.Pre>
                    {`const Table = React.memo(function Table({ columns, rows }) {
  // re-renders only if columns/rows references change
  return (
    <table>
      <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r.id}>{columns.map(c => <td key={c.key}>{r[c.key]}</td>)}</tr>)}</tbody>
    </table>
  );
});

function ProductsTable({ products }) {
  // Stable columns: without useMemo this array would be recreated every render
  const columns = React.useMemo(() => ([
    { key: "name",  label: "Name"  },
    { key: "price", label: "Price" },
  ]), []); // no deps → same reference forever

  return <Table columns={columns} rows={products} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>When to memoize arrays/objects:</b> when they are passed to <Styled.InlineCode>React.memo</Styled.InlineCode> children or used as effect dependencies and should remain stable.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Derived value vs stored state */}
            <Styled.Section>
                <Styled.H2>Derive values; don’t store duplicates</Styled.H2>
                <Styled.Pre>
                    {`// ❌ Anti-pattern: storing derived copies in state
// const [total, setTotal] = useState(0); // goes stale

// ✅ Derive and memoize only if expensive or for stable reference
function Cart({ items }) {
  const total = React.useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );
  return <p>Total: {total}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Compute during render; add <Styled.InlineCode>useMemo</Styled.InlineCode> only when the work is heavy or the result must be referentially stable.
                </Styled.Small>
            </Styled.Section>

            {/* 5) useMemo vs useCallback */}
            <Styled.Section>
                <Styled.H2>useMemo vs useCallback</Styled.H2>
                <Styled.List>
                    <li><b>useMemo</b> memoizes a <em>value</em> (object/array/number/string).</li>
                    <li><b>useCallback</b> memoizes a <em>function</em>—equivalent to <Styled.InlineCode>useMemo(() =&gt; fn, deps)</Styled.InlineCode>.</li>
                    <li>If a child needs a stable <em>function</em> prop, use <Styled.InlineCode>useCallback</Styled.InlineCode>; for stable data props, use <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Dependency rules */}
            <Styled.Section>
                <Styled.H2>Dependency rules</Styled.H2>
                <Styled.List>
                    <li>Include <b>all</b> reactive inputs used inside the compute callback (props, state, context).</li>
                    <li>Do not depend on values that change every render (unless intended). If needed, restructure or memoize inputs.</li>
                    <li>It is safe to omit <Styled.InlineCode>setState</Styled.InlineCode> functions (they’re stable).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good: include all inputs
const filtered = React.useMemo(() => {
  return items.filter(it => it.type === filter.type);
}, [items, filter.type]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Don’t put side effects in useMemo */}
            <Styled.Section>
                <Styled.H2>No side effects inside useMemo</Styled.H2>
                <Styled.Pre>
                    {`// ❌ Bad: side effects during render
const value = React.useMemo(() => {
  console.log("fetching...");      // side effect
  // fetch(...);                    // do not fetch here
  return compute();
}, [deps]);

// ✅ Do effects in useEffect
React.useEffect(() => {
  // fetch / subscribe / timers here
}, [deps]);`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>useMemo</Styled.InlineCode> runs during render. Keep it pure and synchronous.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Micro-optimizations & costs */}
            <Styled.Section>
                <Styled.H2>Cost model: when <em>not</em> to use useMemo</Styled.H2>
                <Styled.List>
                    <li>Memo has overhead (tracking deps, extra function call). If the computation is cheap, memoization can be slower.</li>
                    <li>Start without <Styled.InlineCode>useMemo</Styled.InlineCode>. Add it for demonstrable hotspots or to stabilize references that matter.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Patterns & recipes */}
            <Styled.Section>
                <Styled.H2>Patterns & recipes</Styled.H2>
                <Styled.Pre>
                    {`// 1) Stable style/props object to avoid re-render of memoized child
const style = React.useMemo(() => ({ padding: 8, borderRadius: 12 }), []);

// 2) Sorting + slicing large data
const top10 = React.useMemo(() => {
  return [...items].sort((a, b) => b.score - a.score).slice(0, 10);
}, [items]);

// 3) Normalization cache (Map by id)
const byId = React.useMemo(() => {
  const map = new Map();
  for (const it of items) map.set(it.id, it);
  return map;
}, [items]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Missing dependencies → stale results. Always include every input used inside.</li>
                    <li>Using <Styled.InlineCode>useMemo</Styled.InlineCode> to “prevent re-renders” globally—memoizing values does not stop parent renders.</li>
                    <li>Placing side effects (fetch, DOM writes) inside <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li>Memoizing everything by default—adds complexity with little gain.</li>
                    <li>Relying on memo for correctness—React may drop caches; logic must still be correct without memo.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> memoize expensive computations.</li>
                    <li><b>Do</b> memoize arrays/objects passed to memoized children or used in effect deps.</li>
                    <li><b>Do</b> keep the compute function pure and include all dependencies.</li>
                    <li><b>Don’t</b> perform side effects in <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> overuse it for trivial work; measure first.</li>
                    <li><b>Don’t</b> treat memo as a guarantee of caching—it’s a hint.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useMemo</Styled.InlineCode> caches <b>values</b> to avoid repeated heavy work and
                to keep references stable for children and effects. Use it selectively for real hotspots and stable props,
                keep computations pure, and include all dependencies.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseMemoHook;
