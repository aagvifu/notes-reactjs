import React from "react";
import { Styled } from "./styled";

const UseStateHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useState</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useState</Styled.InlineCode> adds local, reactive state to a function component.
                It returns a pair: the current value and a <b>setter</b> to schedule updates.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terms</Styled.H2>
                <Styled.Pre>
                    {`const [state, setState] = useState(initialState);
const [state, setState] = useState(() => initialState); // lazy init`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>State</b>: component-owned data that changes over time.</li>
                    <li><b>Setter</b>: schedules an update. The value changes on the next render.</li>
                    <li><b>Object.is</b> comparison: if the next value is Object.is-equal to the previous, React skips re-render.</li>
                    <li><b>Lazy initialization</b>: pass a function to run the initializer once at mount time.</li>
                    <li><b>Functional updater</b>: <Styled.InlineCode>setState(prev =&gt; next)</Styled.InlineCode> computes next from previous safely.</li>
                    <li><b>Rule of hooks</b>: call at the top level (not in loops/conditions); call in the same order every render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic counter */}
            <Styled.Section>
                <Styled.H2>Basic counter</Styled.H2>
                <Styled.Pre>
                    {`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} time(s)
    </button>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Reading the updated value immediately after calling the setter during the same event will still show the old value; the update appears on the next render.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Functional updater (correct for multiple updates and async) */}
            <Styled.Section>
                <Styled.H2>Functional updater (avoid stale values)</Styled.H2>
                <Styled.Pre>
                    {`function AddThree() {
  const [n, setN] = useState(0);
  function handle() {
    setN(v => v + 1);
    setN(v => v + 1);
    setN(v => v + 1); // n increases by 3 in one render
  }
  return <button onClick={handle}>n = {n}</button>;
}

// Safe inside timers/subscriptions as well:
React.useEffect(() => {
  const id = setInterval(() => setN(v => v + 1), 1000);
  return () => clearInterval(id);
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Lazy initialization */}
            <Styled.Section>
                <Styled.H2>Lazy initialization</Styled.H2>
                <Styled.Pre>
                    {`function Search() {
  const [index, setIndex] = useState(() => buildIndexOnce()); // runs once on mount
  // ...
  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use a function initializer for heavy work so it doesn’t run on every render.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Objects vs multiple state variables */}
            <Styled.Section>
                <Styled.H2>Objects vs multiple state variables</Styled.H2>
                <Styled.List>
                    <li>Using several <Styled.InlineCode>useState</Styled.InlineCode> calls keeps updates simple and localized.</li>
                    <li><Styled.InlineCode>useState</Styled.InlineCode> replaces the value; it does not merge objects like class <code>setState</code>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Separate pieces
const [first, setFirst] = useState("");
const [last, setLast] = useState("");

// Object (remember to copy)
const [user, setUser] = useState({ first: "", last: "" });
setUser(prev => ({ ...prev, first: "Ada" }));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Arrays & immutable updates */}
            <Styled.Section>
                <Styled.H2>Arrays & immutable updates</Styled.H2>
                <Styled.Pre>
                    {`const [todos, setTodos] = useState([]);

function add(todo) {
  setTodos(prev => [...prev, todo]);                 // add
}
function remove(id) {
  setTodos(prev => prev.filter(t => t.id !== id));   // remove
}
function update(id, patch) {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t)); // update
}`}
                </Styled.Pre>
                <Styled.Small>Return new arrays/objects. Avoid mutating helpers like <code>push</code>, <code>sort</code>, or <code>reverse</code> on state.</Styled.Small>
            </Styled.Section>

            {/* 7) Toggling & booleans */}
            <Styled.Section>
                <Styled.H2>Booleans & toggles</Styled.H2>
                <Styled.Pre>
                    {`const [open, setOpen] = useState(false);
const toggle = () => setOpen(v => !v);
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Resetting state */}
            <Styled.Section>
                <Styled.H2>Resetting state</Styled.H2>
                <Styled.List>
                    <li>Set back to the initial value with the setter.</li>
                    <li>To reset an entire subtree, change its <Styled.InlineCode>key</Styled.InlineCode> so React remounts it.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Local reset
setForm({ name: "", email: "" });

// Remount reset for a component subtree
<Form key={version} initial={defaults} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Dev Strict Mode note */}
            <Styled.Section>
                <Styled.H2>Development Strict Mode note</Styled.H2>
                <Styled.List>
                    <li>In development, React may invoke components and initializers twice to surface side-effect bugs. Production runs once.</li>
                    <li>Initializers should be pure (no network calls or subscriptions).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Expecting the state variable to change immediately after calling the setter in the same event.</li>
                    <li>Computing the next value from a possibly stale variable instead of using the functional updater.</li>
                    <li>Mutating arrays/objects in place and passing the same reference back to the setter.</li>
                    <li>Switching a field between controlled and uncontrolled (e.g., <Styled.InlineCode>value</Styled.InlineCode> sometimes <code>undefined</code>); keep the mode consistent.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use the functional updater when next depends on previous.</li>
                    <li><b>Do</b> use lazy initialization for heavy initial work.</li>
                    <li><b>Do</b> keep updates immutable (return new objects/arrays).</li>
                    <li><b>Don’t</b> expect immediate reads after <Styled.InlineCode>setState</Styled.InlineCode>; read on the next render.</li>
                    <li><b>Don’t</b> store derived values; compute during render or memoize if expensive.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useState</Styled.InlineCode> stores local data and triggers re-renders on changes.
                Prefer functional updaters for correctness, initialize lazily when needed, and keep updates immutable so React
                can detect changes efficiently.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseStateHook;
