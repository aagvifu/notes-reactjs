import React from "react";
import { Styled } from "./styled";

const UseStateBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>useState Basics</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useState</Styled.InlineCode> lets a function component hold local state.
                Call it to get a <b>state value</b> and a <b>setter function</b>. Updating state queues a re-render.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>State:</b> component-owned data that can change over time (count, form fields, UI flags).</li>
                    <li><b>Setter:</b> the function returned by <Styled.InlineCode>useState</Styled.InlineCode> that schedules a state update.</li>
                    <li><b>Render:</b> React calls the component to produce JSX (no DOM changes yet).</li>
                    <li><b>Re-render:</b> the component runs again because props/state/context changed.</li>
                    <li><b>Mount / Update:</b> the first render is a mount; subsequent renders are updates.</li>
                    <li><b>Functional updater:</b> <Styled.InlineCode>setX(prev =&gt; next)</Styled.InlineCode> form that receives the <em>previous</em> value safely.</li>
                    <li><b>Initial state function:</b> <Styled.InlineCode>useState(() =&gt; compute())</Styled.InlineCode> runs once on mount to avoid doing heavy work on every render.</li>
                    <li><b>Stale closure:</b> using an <em>old</em> state value captured by a function; fixed by the functional updater.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic usage */}
            <Styled.Section>
                <Styled.H2>Basic usage</Styled.H2>
                <Styled.Pre>
                    {`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // initial state = 0

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} time(s)
    </button>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The setter <em>schedules</em> an update. The new value appears on the next render.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Reading state after set */}
            <Styled.Section>
                <Styled.H2>Reading state right after <code>setState</code></Styled.H2>
                <p>
                    Setting state doesn’t change the variable immediately in the same render. Read the updated value on the
                    next render or use the functional updater when the next value depends on the previous one.
                </p>
                <Styled.Pre>
                    {`function Demo() {
  const [n, setN] = useState(0);

  function handle() {
    setN(n + 1);
    console.log("Still old value in this tick:", n); // prints previous n
  }

  return <button onClick={handle}>n = {n}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Functional updater (avoid stale closures) */}
            <Styled.Section>
                <Styled.H2>Functional updater (safe when based on previous)</Styled.H2>
                <Styled.Pre>
                    {`function Counter() {
  const [count, setCount] = useState(0);

  // Safe for multiple updates in one tick
  function add3() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  // Safe inside timers/subscriptions (stale closure protection)
  React.useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <button onClick={add3}>Count: {count}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer the updater form whenever the new value depends on the previous value.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Initial state and lazy init */}
            <Styled.Section>
                <Styled.H2>Initial state &amp; lazy initialization</Styled.H2>
                <Styled.Pre>
                    {`// Heavy compute? Use a function so it runs only on mount
function Search() {
  const [index, setIndex] = useState(() => buildIndexOnce()); // lazy init
  ...
}`}
                </Styled.Pre>
                <Styled.Small>
                    Passing <Styled.InlineCode>(() =&gt; initial)</Styled.InlineCode> avoids doing work on every render.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Multiple states vs one object */}
            <Styled.Section>
                <Styled.H2>Multiple states vs a single object</Styled.H2>
                <Styled.List>
                    <li>Using several <Styled.InlineCode>useState</Styled.InlineCode> calls keeps updates localized and simple.</li>
                    <li>
                        <Styled.InlineCode>useState</Styled.InlineCode> <b>replaces</b> the value; it does <em>not</em> merge objects. When storing objects, create a new object.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Separate pieces (simple)
const [first, setFirst] = useState("");
const [last, setLast] = useState("");

// Single object (remember to copy!)
const [user, setUser] = useState({ first: "", last: "" });
setUser(prev => ({ ...prev, first: "Ada" })); // merge manually`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Arrays and immutable updates */}
            <Styled.Section>
                <Styled.H2>Arrays: always return a new array</Styled.H2>
                <Styled.Pre>
                    {`const [todos, setTodos] = useState([]);

function add(todo) {
  setTodos(prev => [...prev, todo]);      // add
}
function remove(id) {
  setTodos(prev => prev.filter(t => t.id !== id)); // remove
}
function update(id, patch) {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
}`}
                </Styled.Pre>
                <Styled.Small>
                    Mutating in place (e.g., <code>push</code>, <code>splice</code> on the existing array) won’t notify React reliably. Return new arrays/objects.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Initial value from props (avoid stale copies) */}
            <Styled.Section>
                <Styled.H2>Initializing from props (avoid stale copies)</Styled.H2>
                <p>
                    If a field should start from a prop and then be edited locally, initialize once. To intentionally reset on a change,
                    use a key or sync in an effect.
                </p>
                <Styled.Pre>
                    {`// Initialize once, then own it locally
function Editor({ initial }) {
  const [text] = React.useState(initial);
  // ... user edits 'text' locally
}

// Reset when 'version' changes (intentional)
function Editor({ value, version }) {
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value, version]);
  return <textarea value={text} onChange={e => setText(e.target.value)} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Batching pointer */}
            <Styled.Section>
                <Styled.H2>Batching (pointer)</Styled.H2>
                <p>
                    React groups multiple state updates in the same tick into a single render/commit for performance. Details and
                    edge cases are covered in the next page <b>Batching</b>.
                </p>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Expecting <Styled.InlineCode>setState</Styled.InlineCode> to change the variable immediately in the same render—read the new value on the next render.</li>
                    <li>Updating based on an old value without the functional updater (e.g., inside timers or multiple sets in one handler).</li>
                    <li>Mutating arrays/objects in place—always return new copies.</li>
                    <li>Switching between different shapes or types for the same state, causing conditional logic bugs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use the functional updater when the next value depends on the previous one.</li>
                    <li><b>Do</b> use lazy initialization for heavy initial computations.</li>
                    <li><b>Do</b> keep related pieces of state together; otherwise prefer separate <Styled.InlineCode>useState</Styled.InlineCode> calls.</li>
                    <li><b>Don’t</b> mutate arrays/objects; return new ones.</li>
                    <li><b>Don’t</b> expect immediate reads after <Styled.InlineCode>setState</Styled.InlineCode>; rely on the next render.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useState</Styled.InlineCode> stores local, reactive data. Use the functional updater for
                correctness, initialize lazily when needed, and keep updates immutable so React can detect and render changes efficiently.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseStateBasics;
