import React from "react";
import { Styled } from "./styled";

const FnComponents = () => {
    return (
        <Styled.Page>
            <Styled.Title>Function Components</Styled.Title>
            <Styled.Lead>
                A function component is a JavaScript <b>function</b> that takes <b>props</b> as input
                and returns <b>JSX</b> describing the UI. React calls the function to produce a tree,
                compares it to the previous tree (reconciliation), and applies minimal DOM changes.
            </Styled.Lead>

            {/* 1) Terminology (precise definitions) */}
            <Styled.Section>
                <Styled.H2>Terminology</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Component:</b> a reusable UI unit. In React, either a function (most common)
                        or a class (legacy). Components compose together to form the UI.
                    </li>
                    <li>
                        <b>Function Component:</b> a plain JS function whose name is <em>PascalCase</em>
                        and that returns JSX. Example: <Styled.InlineCode>{`function Card(props) { return <section/> }`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>JSX:</b> an HTML-like syntax inside JS that compiles to
                        <Styled.InlineCode>React.createElement</Styled.InlineCode>. JSX is just the <em>description</em> of the UI.
                    </li>
                    <li>
                        <b>React Element:</b> the JS object produced by JSX (e.g., <Styled.InlineCode>{`<div/>`}</Styled.InlineCode> → an element object).
                        Elements are <em>immutable descriptions</em>, not DOM nodes.
                    </li>
                    <li>
                        <b>Render:</b> calling components to produce a new tree of elements (no DOM mutations yet).
                    </li>
                    <li>
                        <b>Commit:</b> React applies changes to the real DOM and then runs effects.
                    </li>
                    <li>
                        <b>Mount / Unmount:</b> the first time a component appears in the DOM is a <em>mount</em>;
                        removal is an <em>unmount</em>.
                    </li>
                    <li>
                        <b>Re-render:</b> the component function runs again (same identity) because props/state/context changed.
                        Local state/refs are preserved.
                    </li>
                    <li>
                        <b>Remount:</b> React discards the old instance and creates a new one (identity changed: different type or <Styled.InlineCode>key</Styled.InlineCode>).
                        Local state/refs reset.
                    </li>
                    <li>
                        <b>Props:</b> read-only inputs passed from parent to child (strings, numbers, objects, functions, JSX, etc.).
                    </li>
                    <li>
                        <b>State:</b> internal, mutable data owned by a component (via hooks like <Styled.InlineCode>useState</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Side effect:</b> any interaction with the outside world (fetching, subscriptions, timers, DOM reads/writes).
                        Effects belong in <Styled.InlineCode>useEffect</Styled.InlineCode> / <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>, not in render.
                    </li>
                    <li>
                        <b>Children:</b> a special prop representing the JSX between opening/closing tags of a component.
                    </li>
                    <li>
                        <b>Identity:</b> determined by the element <em>type</em> (component/function or tag) and its <em>key</em> (for siblings).
                        Stable identity → re-render; changed identity → remount.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal function component</Styled.H2>
                <Styled.Pre>
                    {`function Welcome({ name }) {
  return <h2>Welcome, {name}</h2>;
}
// Usage: <Welcome name="Ada" />`}
                </Styled.Pre>
                <Styled.Small>
                    Component names must start with a capital letter so JSX treats them as components (not DOM tags).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Props (read-only) + destructuring & defaults */}
            <Styled.Section>
                <Styled.H2>Props are read-only (destructure & defaults)</Styled.H2>
                <Styled.List>
                    <li>Treat props as immutable—never modify them inside the child.</li>
                    <li>Destructure for clarity; provide defaults in the parameter list.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Avatar({ src = "/avatar.png", alt = "User avatar", size = 40 }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Return shape: one parent, fragments, null */}
            <Styled.Section>
                <Styled.H2>Return shape: one root, fragments, or <code>null</code></Styled.H2>
                <Styled.List>
                    <li>Return a single root element. Use a Fragment to group siblings without extra DOM.</li>
                    <li>Return <Styled.InlineCode>null</Styled.InlineCode> to render nothing while keeping the component logic.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Panel({ title, hidden }) {
  if (hidden) return null;        // no UI
  return (
    <>
      <h3>{title}</h3>
      <div className="panel-body">...</div>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Event handlers */}
            <Styled.Section>
                <Styled.H2>Event handlers (pass a function, not a call)</Styled.H2>
                <Styled.List>
                    <li>Handlers are functions invoked by React with a synthetic event.</li>
                    <li>Don’t call the function in place; pass a function reference or an arrow.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Save({ onSave }) {
  const handleClick = () => onSave?.();
  return <button onClick={handleClick}>Save</button>;
}
// or: <button onClick={() => onSave?.()}>Save</button>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) State & hooks (rules) */}
            <Styled.Section>
                <Styled.H2>State & hooks (rules)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Rule 1:</b> call hooks at the top level of the component (not in loops, conditions, or nested functions).
                    </li>
                    <li>
                        <b>Rule 2:</b> call hooks in the same order on every render (React relies on this).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);                  // state
  useEffect(() => { document.title = String(count); }, [count]); // side effect (post-commit)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Composition & children */}
            <Styled.Section>
                <Styled.H2>Composition & the <code>children</code> prop</Styled.H2>
                <p>Components compose by nesting; <Styled.InlineCode>children</Styled.InlineCode> renders nested content.</p>
                <Styled.Pre>
                    {`function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
// <Card title="Hello"><p>Body</p></Card>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Rest props & safe forwarding */}
            <Styled.Section>
                <Styled.H2>Rest props & safe forwarding</Styled.H2>
                <Styled.List>
                    <li>Accept design-only props (e.g., <Styled.InlineCode>variant</Styled.InlineCode>) but do not forward them to the DOM.</li>
                    <li>Forward valid DOM props (<Styled.InlineCode>id</Styled.InlineCode>, <Styled.InlineCode>aria-*</Styled.InlineCode>, <Styled.InlineCode>data-*</Styled.InlineCode>, handlers) after filtering.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Button({ variant = "primary", className, style, ...rest }) {
  const cls = ["btn", \`btn--\${variant}\`, className].filter(Boolean).join(" ");
  return <button type="button" className={cls} style={style} {...rest} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Refs & forwardRef */}
            <Styled.Section>
                <Styled.H2>Refs & <code>forwardRef</code></Styled.H2>
                <Styled.List>
                    <li><b>ref</b> attaches to a DOM node or a ref-exposing component.</li>
                    <li>
                        Use <Styled.InlineCode>React.forwardRef</Styled.InlineCode> when a parent needs a ref to a child’s inner node.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const Input = React.forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});
Input.displayName = "Input";`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Pure components & memo */}
            <Styled.Section>
                <Styled.H2>Pure components & <code>React.memo</code></Styled.H2>
                <Styled.List>
                    <li>
                        A component is <em>pure</em> if it returns the same JSX for the same props and has no render-time side effects.
                    </li>
                    <li>
                        Wrap with <Styled.InlineCode>React.memo</Styled.InlineCode> to skip re-renders when props are shallow-equal.
                        Use selectively for frequently re-rendered leaf components.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const Price = React.memo(function Price({ value, currency }) {
  return <span>{currency} {value.toFixed(2)}</span>;
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Identity: re-render vs remount */}
            <Styled.Section>
                <Styled.H2>Identity: re-render vs remount</Styled.H2>
                <Styled.List>
                    <li>
                        Same type and same <Styled.InlineCode>key</Styled.InlineCode> ⇒ <b>re-render</b> (state preserved).
                    </li>
                    <li>
                        Type change or <Styled.InlineCode>key</Styled.InlineCode> change ⇒ <b>remount</b> (state reset).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Force a remount to reset a form:
<Form key={version} initial={defaults} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) File & naming tips */}
            <Styled.Section>
                <Styled.H2>File & naming tips</Styled.H2>
                <Styled.List>
                    <li>One main component per file keeps imports clean.</li>
                    <li>Use PascalCase filenames: <Styled.InlineCode>Card.jsx</Styled.InlineCode>, <Styled.InlineCode>UserRow.jsx</Styled.InlineCode>.</li>
                    <li>Default export the main component; use named exports for helpers.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep components pure; put side effects in effects.</li>
                    <li><b>Do</b> destructure props with defaults; forward only valid DOM props.</li>
                    <li><b>Do</b> use fragments for grouping; return <Styled.InlineCode>null</Styled.InlineCode> when appropriate.</li>
                    <li><b>Do</b> follow hook rules strictly; they are required for correctness.</li>
                    <li><b>Don’t</b> mutate props or state; always return new objects/arrays for updates.</li>
                    <li><b>Don’t</b> put fetch/subscription/timers in render; use <Styled.InlineCode>useEffect</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> pass internal design flags straight to the DOM; filter them out.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: a function component is a pure function from inputs (props, state)
                to JSX. Keep identity stable, use hooks correctly, forward props safely,
                and rely on effects for side effects. This foundation makes composition and
                reuse straightforward.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FnComponents;
