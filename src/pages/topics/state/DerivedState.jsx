import React from "react";
import { Styled } from "./styled";

const DerivedState = () => {
    return (
        <Styled.Page>
            <Styled.Title>Derived State</Styled.Title>
            <Styled.Lead>
                Derived state is any value that can be <b>computed</b> from existing
                state/props/context instead of being stored separately. Prefer <b>compute</b>
                (and optionally memoize) over duplicating data.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Source state:</b> the minimal, authoritative state that is actually stored (e.g., <Styled.InlineCode>items</Styled.InlineCode>, <Styled.InlineCode>query</Styled.InlineCode>).</li>
                    <li><b>Derived state:</b> a value computed from source state/props (e.g., <em>filtered items</em>, <em>total price</em>).</li>
                    <li><b>Memoization:</b> caching the result of a computation while inputs are the same; in React, use <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Referential equality:</b> whether two references point to the exact same object/array/function in memory. Important for <Styled.InlineCode>React.memo</Styled.InlineCode> and dependency arrays.</li>
                    <li><b>Selector:</b> a pure function that takes state and returns a derived value (e.g., <Styled.InlineCode>selectVisible(items, query)</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Rule of thumb */}
            <Styled.Section>
                <Styled.H2>Rule of thumb: store the minimum, derive the rest</Styled.H2>
                <Styled.List>
                    <li>Store <b>only</b> what users or the system can change directly.</li>
                    <li>Do <b>not</b> store duplicates like <em>sorted</em> or <em>filtered</em> arrays—compute them from the source.</li>
                    <li>Store IDs and raw records; derive views (counts, sums, selections) at render time.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Compute during render */}
            <Styled.Section>
                <Styled.H2>Compute during render (most cases)</Styled.H2>
                <Styled.Pre>
                    {`function Products({ items, query }) {
  const q = query.trim().toLowerCase();
  const visible = items.filter(p => p.name.toLowerCase().includes(q)); // derived
  const total = visible.reduce((sum, p) => sum + p.price, 0);          // derived
  return (
    <>
      <p>Showing {visible.length} items. Total: ₹{total}</p>
      <ul>{visible.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Correctness does <b>not</b> require memoization. Compute inline unless it’s expensive or the reference must be stable.
                </Styled.Small>
            </Styled.Section>

            {/* 4) When to use useMemo */}
            <Styled.Section>
                <Styled.H2>When to use <code>useMemo</code></Styled.H2>
                <Styled.List>
                    <li>The computation is <b>expensive</b> (e.g., large sorts, heavy transforms).</li>
                    <li>A <b>stable reference</b> is needed to avoid re-rendering a memoized child or to keep effect deps steady.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ProductsMemo({ items, query }) {
  const q = query.trim().toLowerCase();
  const visible = React.useMemo(() => {
    // heavy filter + sort
    const list = items.filter(p => p.name.toLowerCase().includes(q));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [items, q]); // include all inputs

  return <List items={visible} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Important:</b> <Styled.InlineCode>useMemo</Styled.InlineCode> is a performance hint, not a guarantee. It may
                    recompute; never rely on it for correctness.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Avoid duplicated state (anti-pattern) */}
            <Styled.Section>
                <Styled.H2>Anti-pattern: duplicated state</Styled.H2>
                <Styled.Pre>
                    {`// ❌ Wrong: stores both 'items' and 'visible', which can go out of sync
const [items, setItems] = React.useState([]);
const [visible, setVisible] = React.useState([]);

function onQueryChange(q) {
  setVisible(items.filter(p => p.name.includes(q))); // risks desync when items later change
}

// ✅ Right: store minimal state and derive
const [items, setItems] = React.useState([]);
const [query, setQuery] = React.useState("");
const visible = React.useMemo(
  () => items.filter(p => p.name.includes(query)),
  [items, query]
);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Derived from props vs local copies */}
            <Styled.Section>
                <Styled.H2>Derived from props vs local copies</Styled.H2>
                <Styled.List>
                    <li>Prefer computing directly from props each render.</li>
                    <li>Avoid copying props to state just to render them (stale data risk).</li>
                    <li>If initialization from a prop is needed for an editable local copy, initialize once or sync intentionally.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Stale copy
function Price({ value }) {
  const [v] = React.useState(value); // won't update if 'value' changes
  return <span>₹{v}</span>;
}

// ✅ Compute directly
function Price({ value }) {
  return <span>₹{value}</span>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Referential stability for children/effects */}
            <Styled.Section>
                <Styled.H2>Referential stability (children & effects)</Styled.H2>
                <Styled.List>
                    <li>Passing a <b>new array/object</b> each render can re-render memoized children.</li>
                    <li>Wrap derived arrays/objects in <Styled.InlineCode>useMemo</Styled.InlineCode> when they are props to <Styled.InlineCode>React.memo</Styled.InlineCode> children or used in effect deps.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const cols = React.useMemo(
  () => [{ key: "name" }, { key: "price" }],
  []
);
// Safe to pass to memoized <Table columns={cols} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Selectors & normalization */}
            <Styled.Section>
                <Styled.H2>Selectors & data normalization</Styled.H2>
                <Styled.List>
                    <li>Create small <b>selector</b> functions for reusable derivations (e.g., <Styled.InlineCode>selectVisible</Styled.InlineCode>).</li>
                    <li>Normalize data for fast lookups (maps by ID), and derive views (arrays, counts) when rendering.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const byId = React.useMemo(() => {
  const map = new Map();
  for (const p of items) map.set(p.id, p);
  return map;
}, [items]);

function selectVisible(items, q) {
  const s = q.trim().toLowerCase();
  return items.filter(p => p.name.toLowerCase().includes(s));
}
const visible = React.useMemo(() => selectVisible(items, query), [items, query]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Effects & dependencies */}
            <Styled.Section>
                <Styled.H2>Effects & dependencies (avoid stale or infinite loops)</Styled.H2>
                <Styled.List>
                    <li>Effects depend on the <b>inputs</b>, not on the memoization wrapper.</li>
                    <li>Do not place derived <em>results</em> into state to satisfy deps; derive inside the effect or memoize and depend on inputs.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useTotals(items) {
  const total = React.useMemo(
    () => items.reduce((s, p) => s + p.price, 0),
    [items]
  );
  React.useEffect(() => {
    // side effect when total changes
    console.log("Total changed:", total);
  }, [total]);
  return total;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) UI booleans, classes, and labels */}
            <Styled.Section>
                <Styled.H2>UI booleans, classes, labels (derive tiny facts)</Styled.H2>
                <Styled.Pre>
                    {`const isEmpty = items.length === 0;          // boolean derived
const label   = isEmpty ? "No items" : "Items";
const cls     = ["btn", disabled && "btn--muted"].filter(Boolean).join(" ");`}
                </Styled.Pre>
                <Styled.Small>Small derived values rarely need memoization; compute inline.</Styled.Small>
            </Styled.Section>

            {/* 11) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Storing filtered/sorted data in state → gets out of sync; derive instead.</li>
                    <li>Using <Styled.InlineCode>useMemo</Styled.InlineCode> to “prevent re-renders” universally—memo is not a magic shield; measure first.</li>
                    <li>Missing dependencies in <Styled.InlineCode>useMemo</Styled.InlineCode>/<Styled.InlineCode>useEffect</Styled.InlineCode> → stale results. Include all inputs.</li>
                    <li>Creating new arrays/objects every render and passing them to memoized children → avoid with <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li>Keeping both <em>raw</em> and <em>derived</em> copies in state → bugs during updates.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> store minimal state; derive the rest each render.</li>
                    <li><b>Do</b> memoize expensive computations or props needing stable references.</li>
                    <li><b>Do</b> write small selector functions for reuse and tests.</li>
                    <li><b>Don’t</b> copy props to state just to render them.</li>
                    <li><b>Don’t</b> misuse <Styled.InlineCode>useMemo</Styled.InlineCode> as a correctness tool; it’s for performance.</li>
                    <li><b>Don’t</b> forget dependencies; stale derivations cause subtle bugs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep a single, minimal source of truth. Derive everything else during render, and use <b>useMemo</b>
                only for expensive work or stable references. Fewer stored copies → fewer sync bugs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DerivedState;
