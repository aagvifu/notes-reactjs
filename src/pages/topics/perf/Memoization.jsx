import { Styled } from "./styled";

const Memoization = () => {
    return (
        <Styled.Page>
            <Styled.Title>Memoization</Styled.Title>

            <Styled.Lead>
                <b>Memoization</b> means <i>remembering the result</i> of a computation for a given set of
                inputs so we can reuse it later instead of recomputing. In React, we memoize <b>values</b>,
                <b>functions</b>, and sometimes <b>components</b> to reduce unnecessary work and re-renders.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Render:</b> React calling your component to compute its UI for given props/state.</li>
                    <li><b>Re-render:</b> The component renders again because its <i>props</i> or <i>state</i> (or a parent) changed.</li>
                    <li><b>Commit:</b> React applies the final render result to the DOM.</li>
                    <li><b>Referential equality (identity):</b> Two references point to the exact same object/function in memory (e.g., <Styled.InlineCode>prevObj === nextObj</Styled.InlineCode>).</li>
                    <li><b>Pure component:</b> A component that renders the same output for the same props; useful with <Styled.InlineCode>React.memo</Styled.InlineCode>.</li>
                    <li><b>Expensive computation:</b> Work that is slow (large loops, heavy transforms, formatting, filtering, crypto, etc.). Memoize it if inputs are the same across renders.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) React tools */}
            <Styled.Section>
                <Styled.H2>React Tools for Memoization</Styled.H2>
                <Styled.List>
                    <li>
                        <b>useMemo(fn, deps)</b> → returns a <i>memoized value</i>. React recomputes the value only
                        when dependencies change.
                    </li>
                    <li>
                        <b>useCallback(fn, deps)</b> → returns a <i>memoized function</i> (stable reference). Use it
                        when a child depends on the handler's identity (e.g., wrapped in <Styled.InlineCode>React.memo</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>React.memo(Component, [areEqual])</b> → memoizes a component. It skips re-render if
                        shallow comparison of props says "no change." Optionally provide a custom comparator.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) useMemo - memoize derived values */}
            <Styled.Section>
                <Styled.H2>Memoize Derived Values with <code>useMemo</code></Styled.H2>
                <Styled.Pre>
                    {`function ProductList({ products, query }) {
  // Expensive: filtering + sorting large arrays each render
  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q))
    );
    // Assume sorting is heavy
    return filtered.sort((a, b) => a.price - b.price);
  }, [products, query]);

  return (
    <ul>
      {visible.map(p => <li key={p.id}>{p.name} - ₹{p.price}</li>)}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> Avoids recomputing when <i>products</i> and <i>query</i> didn't change. Keep the dependency array complete to prevent stale results.
                </Styled.Small>
            </Styled.Section>

            {/* 4) useCallback - stable handlers for memoized children */}
            <Styled.Section>
                <Styled.H2>Stable Handlers with <code>useCallback</code></Styled.H2>
                <Styled.Pre>
                    {`const Row = React.memo(function Row({ item, onSelect }) {
  // React.memo: re-render only if props (item, onSelect) change by shallow compare
  return <button onClick={() => onSelect(item.id)}>{item.label}</button>;
});

function List({ items, onPick }) {
  // Without useCallback, onSelect would be a new function on every render,
  // causing every <Row /> to re-render even when "items" didn't change.
  const onSelect = React.useCallback((id) => onPick(id), [onPick]);

  return items.map(it => <Row key={it.id} item={it} onSelect={onSelect} />);
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> Keeps <code>onSelect</code> identity stable so <code>Row</code> can skip re-renders.
                </Styled.Small>
            </Styled.Section>

            {/* 5) React.memo - skip re-renders when props are equal */}
            <Styled.Section>
                <Styled.H2>Skip Re-renders with <code>React.memo</code></Styled.H2>
                <Styled.Pre>
                    {`const PriceTag = React.memo(function PriceTag({ amount, currency }) {
  // Renders only when "amount" or "currency" changes
  return <span>{currency} {amount.toFixed(2)}</span>;
});

// Optional custom comparator
const EqualById = React.memo(
  function EqualById({ user }) {
    return <div>{user.name}</div>;
  },
  (prev, next) => prev.user.id === next.user.id // treat same id as "equal"
);`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> Overusing <code>React.memo</code> can add comparison overhead. Use it for components
                    that are frequently re-rendered with identical props.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Referential equality pitfalls */}
            <Styled.Section>
                <Styled.H2>Referential Equality: Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>New objects/arrays every render:</b> <Styled.InlineCode>{`{}`}</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>[]</Styled.InlineCode> literals create new identities. Memoize stable
                        objects if children rely on referential equality.
                    </li>
                    <li>
                        <b>Incomplete dependency arrays:</b> Missing a dependency in <code>useMemo</code>/<code>useCallback</code> can
                        cause stale values or handlers.
                    </li>
                    <li>
                        <b>Premature memoization:</b> Memoization itself costs memory and comparisons. Start with clean data flow; memoize after profiling.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Toolbar({ theme }) {
  // BAD: new object each render -> memoized children still re-render
  // const style = { color: theme.fg, background: theme.bg };

  // GOOD: memoize style object based on theme
  const style = React.useMemo(
    () => ({ color: theme.fg, background: theme.bg }),
    [theme.fg, theme.bg]
  );
  return <div style={style}>Tools</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) When to memoize (decision guide) */}
            <Styled.Section>
                <Styled.H2>When Should You Memoize?</Styled.H2>
                <Styled.List>
                    <li><b>Yes</b> - heavy derived data (filter/sort/format large lists), repeated on many renders.</li>
                    <li><b>Yes</b> - stable callbacks passed deep into memoized children.</li>
                    <li><b>Maybe</b> - leaf components that often receive identical props (use <code>React.memo</code>).</li>
                    <li><b>No</b> - trivial computations or components that rarely re-render.</li>
                    <li><b>Always profile first</b> to confirm the bottleneck before adding complexity.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Shallow compare:</b> Compares top-level fields (primitives by value, objects by reference).</li>
                    <li><b>Stable reference:</b> The same function/object identity across renders (e.g., via <code>useMemo</code>/<code>useCallback</code>).</li>
                    <li><b>Stale value/closure:</b> Using an old value inside a memo/handler because the dependency list was incomplete.</li>
                    <li><b>Memo hit/miss:</b> "Hit" = use cached result; "miss" = recompute.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't checklist */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start with clean state/prop design; memorize only proven bottlenecks.</li>
                    <li><b>Do</b> keep dependency arrays complete to avoid stale bugs.</li>
                    <li><b>Do</b> memoize handlers passed to memoized children.</li>
                    <li><b>Don't</b> wrap everything in <code>useMemo</code>/<code>useCallback</code> "just in case."</li>
                    <li><b>Don't</b> rely on deep compares in <code>React.memo</code>; it's often slower than re-rendering.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Memoization saves work by reusing results for the same inputs.
                In React, use <b>useMemo</b> for values, <b>useCallback</b> for functions, and
                <b> React.memo</b> for components-<i>but only where it truly reduces re-renders or expensive work</i>.
                Measure with the Profiler before and after to validate the win.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Memoization;
