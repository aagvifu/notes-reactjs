import { Styled } from "./styled";

const RefsAsState = () => {
    return (
        <Styled.Page>
            <Styled.Title>Anti-Pattern: Refs as State</Styled.Title>

            <Styled.Lead>
                <b>TL;DR:</b> <Styled.InlineCode>useRef</Styled.InlineCode> holds a mutable value that{" "}
                <i>does not</i> trigger re-renders. If the UI should update when a value changes, that
                value belongs in <Styled.InlineCode>state</Styled.InlineCode>, not in a ref. Storing
                “render-relevant” data in a ref is the <b>Refs-as-State anti-pattern</b>.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions (Clear & Precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>State:</b> Data that influences rendering. Changing state with{" "}
                        <Styled.InlineCode>setState</Styled.InlineCode> schedules a re-render so the UI shows
                        the new value.
                    </li>
                    <li>
                        <b>Ref:</b> A persistent, mutable container (<Styled.InlineCode>{`{ current: T }`}</Styled.InlineCode>) that
                        survives re-renders but <i>does not cause</i> a re-render when changed. Refs are often
                        used to reference DOM nodes or store <i>non-visual</i> mutable values (like a timeout id).
                    </li>
                    <li>
                        <b>Render-relevant data:</b> Any data that, if changed, should be visible in the UI
                        (text, counts, toggles, lists, derived labels, etc.).
                    </li>
                    <li>
                        <b>Anti-pattern (Refs as State):</b> Putting render-relevant data in a ref and manually
                        poking the DOM or otherwise hoping React will notice. It won't.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Smell: when code is wrong */}
            <Styled.Section>
                <Styled.H2>How to Recognize the Smell</Styled.H2>
                <Styled.List>
                    <li>
                        You update <Styled.InlineCode>ref.current</Styled.InlineCode> and expect the UI to
                        change—but nothing happens until some unrelated state update occurs.
                    </li>
                    <li>
                        You start calling DOM APIs (like <Styled.InlineCode>innerText</Styled.InlineCode>) to
                        “force” the screen to match <Styled.InlineCode>ref.current</Styled.InlineCode>.
                    </li>
                    <li>
                        You feel tempted to use hacky workarounds like a dummy state (“<code>forceUpdate</code>”)
                        just to refresh the UI after changing a ref.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Bad example */}
            <Styled.Section>
                <Styled.H2>Bad Example: Counter stored in a ref</Styled.H2>
                <Styled.Pre>
                    {`function BadCounter() {
  const countRef = React.useRef(0);

  function increment() {
    countRef.current += 1;       // ❌ Changes a ref only
    // UI won't re-render, so the screen won't show the new value
  }

  return (
    <div>
      <p>Count: {countRef.current}</p>  {/* ❌ stale on screen */}
      <button onClick={increment}>+1</button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Problem: The paragraph won't update, because changing a ref doesn't trigger a re-render.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Good example */}
            <Styled.Section>
                <Styled.H2>Good Example: Counter stored in state</Styled.H2>
                <Styled.Pre>
                    {`function GoodCounter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Count: {count}</p>      {/* ✅ always in sync with UI */}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Fix: Store render-relevant data in state so React re-renders when it changes.
                </Styled.Small>
            </Styled.Section>

            {/* 5) When refs are actually correct */}
            <Styled.Section>
                <Styled.H2>When Refs are the Right Tool</Styled.H2>
                <Styled.List>
                    <li>
                        <b>DOM access:</b> Focus a field, measure size/position, scroll into view.
                        (<Styled.InlineCode>ref</Styled.InlineCode> holds an element).
                    </li>
                    <li>
                        <b>Instance variables:</b> Store values that must persist across renders but don't
                        belong in the UI (e.g., a timeout id, an AbortController, a previous value snapshot).
                    </li>
                    <li>
                        <b>Performance:</b> Cache non-visual mutable info to avoid re-renders (e.g., throttling
                        flags) while the visible UI is driven by state.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function SearchBox() {
  const inputRef = React.useRef(null);       // ✅ DOM node reference
  React.useEffect(() => { inputRef.current?.focus(); }, []);
  return <input ref={inputRef} placeholder="Type to search..." />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Mixed case: both state and ref */}
            <Styled.Section>
                <Styled.H2>Mixed Case: State + Ref (each for its job)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>state</b> for the value rendered on screen (e.g., text shown in the input).
                    </li>
                    <li>
                        Use a <b>ref</b> for imperative helpers (e.g., focus control, caret tracking, transient
                        flags) that don't need to render.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ChatBox() {
  const [message, setMessage] = React.useState("");
  const inputRef = React.useRef(null);
  const lastTypedAtRef = React.useRef(0);   // ⏱️ not shown in UI

  function onChange(e) {
    setMessage(e.target.value);             // ✅ state drives UI
    lastTypedAtRef.current = Date.now();    // ✅ ref stores non-visual info
  }

  function focusInput() {
    inputRef.current?.focus();              // ✅ imperative DOM op
  }

  return (
    <>
      <input ref={inputRef} value={message} onChange={onChange} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Common misuse scenarios and fixes */}
            <Styled.Section>
                <Styled.H2>Common Misuse → Correct Fix</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Misuse:</b> Keep a list in a ref and push/pop items, expecting the UI list to update.
                        <br />
                        <b>Fix:</b> Store the list in state and update immutably (create a new array).
                    </li>
                    <li>
                        <b>Misuse:</b> Put a toggle (<Styled.InlineCode>isOpen</Styled.InlineCode>) in a ref and
                        manually change class names via the DOM.
                        <br />
                        <b>Fix:</b> Put the toggle in state; let JSX conditionally render classes or elements.
                    </li>
                    <li>
                        <b>Misuse:</b> Use a ref to “remember” a number that should redraw the chart.
                        <br />
                        <b>Fix:</b> Keep the number in state; pass it as a prop to the chart component.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Misuse: list in a ref, UI never updates
function BadTodos() {
  const listRef = React.useRef(["Read"]);
  const add = () => { listRef.current.push("Write"); }; // no re-render
  return (
    <div>
      <button onClick={add}>Add</button>
      <ul>{listRef.current.map((t, i) => <li key={i}>{t}</li>)}</ul> {/* stale */}
    </div>
  );
}

// ✅ Fix: list in state
function GoodTodos() {
  const [list, setList] = React.useState(["Read"]);
  const add = () => setList(prev => [...prev, "Write"]);
  return (
    <div>
      <button onClick={add}>Add</button>
      <ul>{list.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Subtle trap: using ref to dodge re-renders */}
            <Styled.Section>
                <Styled.H2>Subtle Trap: Using Refs to “Avoid Re-renders”</Styled.H2>
                <Styled.List>
                    <li>
                        Refs are not a performance silver bullet. If the UI depends on a value, that value must
                        be state so React can render it correctly.
                    </li>
                    <li>
                        Prematurely stuffing things into refs can create <b>invisible bugs</b> and make the UI
                        drift from the data.
                    </li>
                    <li>
                        For performance, prefer <Styled.InlineCode>useMemo</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>useCallback</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>React.memo</Styled.InlineCode> before resorting to non-reactive refs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Decision guide */}
            <Styled.Section>
                <Styled.H2>Decision Guide</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Does changing this value need to update the UI?</b> Yes → <b>State</b>. No → maybe{" "}
                        <b>Ref</b>.
                    </li>
                    <li>
                        <b>Do I need to imperatively access a DOM node?</b> Yes → <b>Ref</b> (to the element).
                    </li>
                    <li>
                        <b>Is this a derived value from other state/props?</b> Compute with{" "}
                        <Styled.InlineCode>useMemo</Styled.InlineCode> or inside render, not a ref.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Re-render:</b> The process where React calls your component function again to produce
                        updated UI from the latest state/props.
                    </li>
                    <li>
                        <b>Mutable:</b> A value you can change in place (like{" "}
                        <Styled.InlineCode>ref.current</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Immutable update:</b> Creating a new object/array when changing state so React can
                        detect changes by reference.
                    </li>
                    <li>
                        <b>Derived value:</b> A value computed from existing state/props (e.g.,{" "}
                        <Styled.InlineCode>{`fullName = first + " " + last`}</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> keep render-relevant data in state.
                    </li>
                    <li>
                        <b>Do</b> use refs for DOM nodes and non-visual mutable values (timers, controllers,
                        flags).
                    </li>
                    <li>
                        <b>Don't</b> mutate the DOM to “sync” with ref values—let React render from state.
                    </li>
                    <li>
                        <b>Don't</b> hide important UI values inside refs to “optimize.” It breaks correctness.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> If the screen must change, store the value in <i>state</i>. Use{" "}
                <i>refs</i> for DOM handles and non-visual, persistent data. Avoid the Refs-as-State
                anti-pattern to keep your UI predictable, testable, and easy to reason about.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RefsAsState;
