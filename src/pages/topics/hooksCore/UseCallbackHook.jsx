import React from "react";
import { Styled } from "./styled";

const UseCallbackHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useCallback</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useCallback</Styled.InlineCode> memoizes a <b>function</b>.
                It returns the same function reference between renders while its dependency list stays equal.
                Useful for <b>referential stability</b> with <Styled.InlineCode>React.memo</Styled.InlineCode> children and effect dependencies.
            </Styled.Lead>

            {/* 1) Signature & terminology */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const memoizedFn = useCallback(fn, deps);
// Equivalent to: const memoizedFn = useMemo(() => fn, deps);`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>Memoized function:</b> the stable function returned by <Styled.InlineCode>useCallback</Styled.InlineCode>.</li>
                    <li><b>Dependencies:</b> reactive values that the function reads; when any changes, a <em>new</em> function is created.</li>
                    <li><b>Referential equality:</b> whether a function is the exact same reference as last render. Matters for <Styled.InlineCode>React.memo</Styled.InlineCode> and effect deps.</li>
                    <li><b>Stable handler:</b> a memoized function that does not change identity unless needed; prevents child re-renders and listener re-subscriptions.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When useCallback helps */}
            <Styled.Section>
                <Styled.H2>When <code>useCallback</code> helps</Styled.H2>
                <Styled.List>
                    <li>Passing callbacks to <Styled.InlineCode>React.memo</Styled.InlineCode> children (avoid re-render due to new function identity).</li>
                    <li>Supplying a function to an effect dependency array (avoid tearing down/setting up on every render).</li>
                    <li>Memoized computations that depend on a function prop (keep the function stable so the memoized value stays cached).</li>
                </Styled.List>
                <Styled.Small>
                    If no child/effect depends on function identity, <Styled.InlineCode>useCallback</Styled.InlineCode> usually isn’t needed.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Example: memo child + stable handler */}
            <Styled.Section>
                <Styled.H2>Example: memoized child + stable <code>onSelect</code></Styled.H2>
                <Styled.Pre>
                    {`const Item = React.memo(function Item({ item, onSelect }) {
  console.log("render:", item.id); // renders only if props change by reference
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }) {
  const [selected, setSelected] = React.useState(null);

  // Stable across renders (identity changes only if setSelected changes, which it doesn't)
  const handleSelect = React.useCallback((id) => {
    setSelected(id);
  }, []);

  return (
    <>
      <p>Selected: {String(selected)}</p>
      <ul>{items.map(it => <Item key={it.id} item={it} onSelect={handleSelect} />)}</ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Without <Styled.InlineCode>useCallback</Styled.InlineCode>, a new <code>onSelect</code> function each render would invalidate <code>Item</code>’s memoization.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Avoid stale state with functional updates */}
            <Styled.Section>
                <Styled.H2>Avoid stale state with functional updates</Styled.H2>
                <Styled.Pre>
                    {`function Counter() {
  const [count, setCount] = React.useState(0);

  // No 'count' in deps, yet remains correct by using the functional updater
  const increment = React.useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <button onClick={increment}>Count: {count}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    If the callback computes next value from previous, prefer the <b>functional updater</b> so the deps can stay minimal.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Effects that depend on a handler */}
            <Styled.Section>
                <Styled.H2>Effects depending on a handler</Styled.H2>
                <Styled.Pre>
                    {`function KeyListener({ onEscape }) {
  // Stable wrapper so the effect doesn't re-subscribe each render
  const handleKey = React.useCallback((e) => {
    if (e.key === "Escape") onEscape?.();
  }, [onEscape]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the effect’s dependency list accurate; stabilize the handler (or use a “latest ref” pattern) to avoid re-subscribing on every render.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Passing params without re-creating handlers */}
            <Styled.Section>
                <Styled.H2>Passing parameters without re-creating handlers</Styled.H2>
                <Styled.Pre>
                    {`function Shop({ products }) {
  const [cart, setCart] = React.useState(new Map());

  const add = React.useCallback((id, qty = 1) => {
    setCart(prev => {
      const next = new Map(prev);
      next.set(id, (next.get(id) ?? 0) + qty);
      return next;
    });
  }, []);

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>
          {p.name} — Rs {p.price}
          <button onClick={() => add(p.id, 1)}>Add</button>
        </li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The stable <code>add</code> function accepts parameters at call time, so the identity stays the same across renders.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Interplay with useMemo and object deps */}
            <Styled.Section>
                <Styled.H2>Interplay with <code>useMemo</code> & object deps</Styled.H2>
                <Styled.List>
                    <li>If the callback depends on an object/array built during render, memoize that input with <Styled.InlineCode>useMemo</Styled.InlineCode> first.</li>
                    <li>Otherwise the input changes identity each render → the callback rememoizes each time.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const options = React.useMemo(() => ({ min: 0, max: 10 }), []);
const compute = React.useCallback((x) => x >= options.min && x <= options.max, [options]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Performance model */}
            <Styled.Section>
                <Styled.H2>Performance model</Styled.H2>
                <Styled.List>
                    <li>Creating a new inline arrow each render is cheap. <b>Only</b> memoize when identity matters (memoized child/effect deps).</li>
                    <li><Styled.InlineCode>useCallback</Styled.InlineCode> itself has overhead (tracking deps). Measure before widespread use.</li>
                    <li>Prefer a simple render first; add <Styled.InlineCode>useCallback</Styled.InlineCode> where it prevents real work.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Empty deps (<Styled.InlineCode>[]</Styled.InlineCode>) while reading changing values inside → <b>stale closures</b>. Fix by including deps or using functional updaters/refs.</li>
                    <li>Omitting dependencies to silence lints → subtle bugs. Keep deps correct; restructure code if necessary.</li>
                    <li>Memoizing everything “just in case” → unnecessary complexity with minimal benefit.</li>
                    <li>Using <Styled.InlineCode>useCallback</Styled.InlineCode> to avoid <em>parent</em> re-renders—memoizing a function won’t stop the parent rendering.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Stale closure (reads old 'value')
const onSave = React.useCallback(() => console.log(value), []);

// ✅ Include deps OR use a ref/functional update
const onSaveOk = React.useCallback(() => console.log(value), [value]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> memoize handlers passed to <Styled.InlineCode>React.memo</Styled.InlineCode> children.</li>
                    <li><b>Do</b> use functional updaters to keep deps minimal when next value depends on previous state.</li>
                    <li><b>Do</b> stabilize inputs (with <Styled.InlineCode>useMemo</Styled.InlineCode>) before depending on them in <Styled.InlineCode>useCallback</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> overuse it for trivial handlers; identity only matters if something compares references.</li>
                    <li><b>Don’t</b> omit dependencies to keep a function “stable”—use the right patterns instead.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useCallback</Styled.InlineCode> keeps function references stable for memoized
                children and effects. Include the right dependencies, lean on functional updaters to avoid stale closures,
                and use it selectively where identity <em>actually</em> matters.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseCallbackHook;
