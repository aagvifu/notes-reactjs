import { Styled } from "./styled";

const RerenderTriggers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Rerender Triggers</Styled.Title>

            <Styled.Lead>
                A <b>render</b> is when React calls your component function to compute UI.
                A <b>re-render</b> happens when React calls it again because something changed.
                Understanding <i>what</i> triggers re-renders helps you keep the app fast and predictable.
            </Styled.Lead>

            {/* 0) Mental model */}
            <Styled.Section>
                <Styled.H2>Rendering Mental Model</Styled.H2>
                <Styled.List>
                    <li><b>Render phase:</b> React calls your component to create elements (a description of UI).</li>
                    <li><b>Commit phase:</b> React applies minimal DOM changes based on the render result (<i>reconciliation</i> diff).</li>
                    <li><b>Re-render:</b> React calls your component again when inputs change (state/props/context/key/etc.).</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Triggers overview */}
            <Styled.Section>
                <Styled.H2>What Triggers a Re-render?</Styled.H2>
                <Styled.List>
                    <li><b>State change:</b> calling <Styled.InlineCode>setState</Styled.InlineCode> / <Styled.InlineCode>dispatch</Styled.InlineCode> with a <i>different</i> value (compares via <Styled.InlineCode>Object.is</Styled.InlineCode>).</li>
                    <li><b>Parent re-render:</b> when a parent renders, each child renders too (unless memoized and props are shallow-equal).</li>
                    <li><b>Context value change:</b> any consumer re-renders when its Provider's <Styled.InlineCode>value</Styled.InlineCode> changes.</li>
                    <li><b>Key change:</b> changing a component's <Styled.InlineCode>key</Styled.InlineCode> remounts it (unmount → mount).</li>
                    <li><b>External store updates:</b> via <Styled.InlineCode>useSyncExternalStore</Styled.InlineCode> or libraries (e.g., Redux, Zustand).</li>
                    <li><b>Suspense boundaries:</b> resolving/rejecting data can cause re-renders as fallbacks switch.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) State change */}
            <Styled.Section>
                <Styled.H2>1) State Changes</Styled.H2>
                <Styled.List>
                    <li>Calling <Styled.InlineCode>setX(next)</Styled.InlineCode> re-renders <i>if</i> <Styled.InlineCode>next</Styled.InlineCode> is not <Styled.InlineCode>Object.is</Styled.InlineCode>-equal to the current state.</li>
                    <li>Setting the <i>same</i> value is a no-op (no re-render).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Counter() {
  const [n, setN] = React.useState(0);

  function inc() { setN(v => v + 1); }          // triggers re-render
  function same() { setN(n); }                   // no re-render (same value)
  function swapObj() {
    // For objects, identity matters:
    setN({ ...n }); // if n was an object, new identity triggers re-render
  }

  return (
    <div>
      <p>{n}</p>
      <button onClick={inc}>+1</button>
      <button onClick={same}>set same</button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: For objects/arrays, avoid recreating new identities unless the contents actually changed.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Parent re-render */}
            <Styled.Section>
                <Styled.H2>2) Parent Re-render</Styled.H2>
                <Styled.List>
                    <li>When a parent renders, all children render by default.</li>
                    <li>Use <Styled.InlineCode>React.memo(Child)</Styled.InlineCode> to skip rendering if props are shallow-equal.</li>
                    <li>Be careful with inline objects/functions—new identity ≠ shallow-equal.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const Child = React.memo(function Child({ label, onClick }) {
  console.log("Child render:", label);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = React.useState(0);

  // BAD: new function identity each render breaks memo
  // const handle = () => setCount(c => c + 1);

  // GOOD: stable identity
  const handle = React.useCallback(() => setCount(c => c + 1), []);

  return <Child label={"Count: " + count} onClick={handle} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Shallow equality:</b> compares primitive values and object references; it doesn't deep-compare.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Context change */}
            <Styled.Section>
                <Styled.H2>3) Context Value Changes</Styled.H2>
                <Styled.List>
                    <li>Any consumer re-renders when Provider's <Styled.InlineCode>value</Styled.InlineCode> changes identity.</li>
                    <li>Memoize object values to avoid accidental changes every render.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [mode, setMode] = React.useState("dark");

  // BAD: new object each render causes all consumers to re-render
  // const value = { mode, toggle: () => setMode(m => m === "dark" ? "light" : "dark") };

  // GOOD: stable object reference
  const toggle = React.useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const value = React.useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Key change */}
            <Styled.Section>
                <Styled.H2>4) Key Changes (Remount)</Styled.H2>
                <Styled.List>
                    <li>Changing <Styled.InlineCode>key</Styled.InlineCode> forces React to treat it as a new component (throw away state, run effects again).</li>
                    <li>Useful to reset internal state; risky if accidental.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Editor({ id }) {
  // When key changes, component resets (fresh state)
  return <TextArea key={id} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) External stores */}
            <Styled.Section>
                <Styled.H2>5) External Store Updates</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>useSyncExternalStore</Styled.InlineCode> (or libs) subscribe to external data; store changes trigger re-renders of subscribers.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo-example:
const value = useSyncExternalStore(store.subscribe, store.getSnapshot);
// Whenever store snapshot changes, this component re-renders.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Inline identity pitfalls */}
            <Styled.Section>
                <Styled.H2>Identity Pitfalls (Objects & Functions)</Styled.H2>
                <Styled.List>
                    <li>Every render creates new object/function literals unless you memoize them.</li>
                    <li>Memoized children (<Styled.InlineCode>React.memo</Styled.InlineCode>) will still re-render if a prop's identity changes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function List({ items }) {
  // BAD: new filter every render
  // const filter = { active: true };

  // GOOD: stable identity
  const filter = React.useMemo(() => ({ active: true }), []);

  return <ItemsView items={items} filter={filter} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) React.memo, useMemo, useCallback */}
            <Styled.Section>
                <Styled.H2>Tools to Control Re-renders</Styled.H2>
                <Styled.List>
                    <li><b>React.memo(Component)</b>: skips re-render if props are shallow-equal.</li>
                    <li><b>useMemo(fn, deps)</b>: memoize an expensive computation's <i>result</i> between renders.</li>
                    <li><b>useCallback(fn, deps)</b>: memoize a <i>function identity</i> between renders.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const Expensive = React.memo(function Expensive({ data }) {
  const total = React.useMemo(() => heavySum(data), [data]); // compute once per data change
  return <div>Total: {total}</div>;
});`}
                </Styled.Pre>
                <Styled.Small>
                    Measure first; memoization adds complexity. Prefer clear code, then optimize hot paths.
                </Styled.Small>
            </Styled.Section>

            {/* 9) StrictMode note */}
            <Styled.Section>
                <Styled.H2>Note: Strict Mode (Dev Only)</Styled.H2>
                <Styled.List>
                    <li><b>StrictMode</b> intentionally invokes certain functions twice in development to surface unsafe patterns.</li>
                    <li>This looks like “extra” renders only in dev; production renders once.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> lift state thoughtfully; colocate where it's used to avoid cascading parent re-renders.</li>
                    <li><b>Do</b> memoize context <Styled.InlineCode>value</Styled.InlineCode> objects and event handlers passed deep.</li>
                    <li><b>Do</b> use <Styled.InlineCode>React.memo</Styled.InlineCode> for pure presentational children that receive stable props.</li>
                    <li><b>Don't</b> store derived data in state—derive with <Styled.InlineCode>useMemo</Styled.InlineCode> instead.</li>
                    <li><b>Don't</b> over-memoize blindly; profile first.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Reconciliation:</b> React's diffing of previous vs next tree to compute minimal DOM updates.</li>
                    <li><b>Shallow equality:</b> compares primitives by value and objects by reference (no deep compare).</li>
                    <li><b>Identity:</b> whether two references point to the exact same object/function in memory.</li>
                    <li><b>Remount:</b> unmount + mount cycle, often caused by a <Styled.InlineCode>key</Styled.InlineCode> change.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Quick Checklist</Styled.H2>
                <Styled.List>
                    <li>Did state actually change? Avoid setting the same value.</li>
                    <li>Are you passing new object/function props every render? Memoize if needed.</li>
                    <li>Does your context <Styled.InlineCode>value</Styled.InlineCode> change identity unnecessarily?</li>
                    <li>Are keys stable? Avoid accidental remounts.</li>
                    <li>Measure with the React Profiler before and after changes.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Re-renders are normal and healthy. Optimize the <i>triggers</i> you control
                (state, props identity, context value, keys) and measure with the Profiler to make sure
                your changes actually help.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RerenderTriggers;
