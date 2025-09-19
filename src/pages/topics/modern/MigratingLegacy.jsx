import { Styled } from "./styled";

const MigratingLegacy = () => {
    return (
        <Styled.Page>
            <Styled.Title>Migrating Legacy React → Modern React</Styled.Title>

            <Styled.Lead>
                "Legacy React" usually means class components, old lifecycles, legacy context,
                manual side-effect wiring, and assumptions from ReactDOM.render. "Modern React"
                centers on <b>function components + hooks</b>, <b>strict mode</b>, <b>concurrent
                    features</b> (automatic batching, transitions), and <b>Suspense-first data</b>.
                This guide gives clear steps, definitions, and examples so you can migrate with confidence.
            </Styled.Lead>

            {/* 0) Vocabulary */}
            <Styled.Section>
                <Styled.H2>Glossary (Quick Definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Class component:</b> An older React component defined with <Styled.InlineCode>class X extends React.Component</Styled.InlineCode> using lifecycle methods and <Styled.InlineCode>this.state</Styled.InlineCode>.</li>
                    <li><b>Function component:</b> A component defined as a function. With <Styled.InlineCode>hooks</Styled.InlineCode> it manages state, effects, refs, etc.</li>
                    <li><b>Hooks:</b> Functions like <Styled.InlineCode>useState</Styled.InlineCode>, <Styled.InlineCode>useEffect</Styled.InlineCode>, <Styled.InlineCode>useMemo</Styled.InlineCode>, etc., that add React features to function components.</li>
                    <li><b>Strict Mode:</b> A development-only wrapper that highlights unsafe patterns and surfaces side-effect bugs earlier.</li>
                    <li><b>Concurrent Features:</b> Capabilities introduced around React 18 that improve responsiveness (e.g., <Styled.InlineCode>startTransition</Styled.InlineCode>, automatic batching).</li>
                    <li><b>Automatic Batching:</b> React 18 batches multiple state updates within the same tick across async boundaries to reduce re-renders.</li>
                    <li><b>Transition:</b> An update marked as non-urgent (like filtering a big list) so urgent updates (typing/clicking) stay snappy.</li>
                    <li><b>Suspense for Data:</b> A pattern where components <i>suspend</i> while data loads, allowing React to orchestrate loading states and streaming.</li>
                    <li><b>Legacy Context:</b> The old context API (<Styled.InlineCode>childContextTypes</Styled.InlineCode>, <Styled.InlineCode>contextTypes</Styled.InlineCode>), replaced by <Styled.InlineCode>createContext()</Styled.InlineCode>.</li>
                    <li><b>UNSAFE_ lifecycles:</b> Deprecated methods like <Styled.InlineCode>UNSAFE_componentWillMount</Styled.InlineCode> that should be removed or refactored.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Migration map */}
            <Styled.Section>
                <Styled.H2>Migration Map (Bird's-eye View)</Styled.H2>
                <Styled.List>
                    <li><b>Step 1:</b> Upgrade to React 18+ and switch from <Styled.InlineCode>ReactDOM.render</Styled.InlineCode> to <Styled.InlineCode>createRoot</Styled.InlineCode>.</li>
                    <li><b>Step 2:</b> Turn on <Styled.InlineCode>&lt;React.StrictMode&gt;</Styled.InlineCode> in development.</li>
                    <li><b>Step 3:</b> Convert class components to function components with hooks (state, effects, refs).</li>
                    <li><b>Step 4:</b> Replace legacy context with <Styled.InlineCode>createContext()</Styled.InlineCode> and <Styled.InlineCode>useContext</Styled.InlineCode>.</li>
                    <li><b>Step 5:</b> Remove deprecated/UNSAFE lifecycles and <Styled.InlineCode>findDOMNode</Styled.InlineCode>.</li>
                    <li><b>Step 6:</b> Adopt concurrent-aware patterns: automatic batching, <Styled.InlineCode>startTransition</Styled.InlineCode>, and <Styled.InlineCode>useDeferredValue</Styled.InlineCode> where appropriate.</li>
                    <li><b>Step 7:</b> Plan for Suspense-friendly data (gradual; not required on day one).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Bootstrapping changes */}
            <Styled.Section>
                <Styled.H2>Step 1 - Root Bootstrap: <code>createRoot</code></Styled.H2>
                <Styled.Pre>
                    {`// BEFORE (legacy)
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));`}</Styled.Pre>
                <Styled.Pre>
                    {`// AFTER (modern)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`}</Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> <Styled.InlineCode>createRoot</Styled.InlineCode> enables React 18 features (automatic batching,
                    transitions, new SSR). <b>StrictMode</b> only runs in dev and helps you catch side-effect issues early.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Class → Function mapping */}
            <Styled.Section>
                <Styled.H2>Step 2 - Class → Function with Hooks</Styled.H2>
                <Styled.Pre>
                    {`// BEFORE: Class component with state + lifecycle
class Counter extends React.Component {
  state = { value: 0 };

  componentDidMount() {
    document.title = "Count: " + this.state.value;
  }

  componentDidUpdate() {
    document.title = "Count: " + this.state.value;
  }

  increment = () => this.setState(({ value }) => ({ value: value + 1 }));

  render() {
    return <button onClick={this.increment}>Count: {this.state.value}</button>;
  }
}`}        </Styled.Pre>
                <Styled.Pre>
                    {`// AFTER: Function component with hooks
function Counter() {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    document.title = "Count: " + value; // runs after mount + on value changes
  }, [value]);

  const increment = React.useCallback(() => {
    setValue(v => v + 1);
  }, []);

  return <button onClick={increment}>Count: {value}</button>;
}`}        </Styled.Pre>
                <Styled.Small>
                    <b>Rule of Hooks:</b> Call hooks at the top level of the component (not inside loops/conditions).
                    Migrate lifecycle work to <Styled.InlineCode>useEffect</Styled.InlineCode> (side effects),
                    <Styled.InlineCode>useMemo</Styled.InlineCode> (expensive computations), and
                    <Styled.InlineCode>useRef</Styled.InlineCode> (instance-like mutable values).
                </Styled.Small>
            </Styled.Section>

            {/* 4) Legacy lifecycles */}
            <Styled.Section>
                <Styled.H2>Step 3 - Replace Legacy Lifecycles</Styled.H2>
                <Styled.List>
                    <li><b><code>componentWillMount</code></b> / <b><code>UNSAFE_componentWillMount</code></b>: Move logic into the component body (for pure setup) or <Styled.InlineCode>useEffect</Styled.InlineCode> (for side effects).</li>
                    <li><b><code>componentWillReceiveProps</code></b> / <b><code>UNSAFE_…</code></b>: Usually becomes a derived value via <Styled.InlineCode>useMemo</Styled.InlineCode> or explicit effect reacting to a prop.</li>
                    <li><b><code>componentWillUpdate</code></b> / <b><code>UNSAFE_…</code></b>: Use <Styled.InlineCode>useEffect</Styled.InlineCode>/<Styled.InlineCode>useLayoutEffect</Styled.InlineCode> as needed.</li>
                    <li><b><code>getSnapshotBeforeUpdate</code></b>: Typically <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> with refs to read layout before paint.</li>
                    <li><b><code>componentDidCatch</code></b>: Use an <b>error boundary</b> (still a class today) or a thin class wrapper around your app until function-based error boundaries are standard.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: reacting to a prop (old willReceiveProps)
function Price({ amount, currency }) {
  const label = React.useMemo(() => {
    // compute derived label when inputs change
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  }, [amount, currency]);
  return <span>{label}</span>;
}`}        </Styled.Pre>
            </Styled.Section>

            {/* 5) Legacy context */}
            <Styled.Section>
                <Styled.H2>Step 4 - Legacy Context → <code>createContext</code></Styled.H2>
                <Styled.Pre>
                    {`// BEFORE: legacy context (childContextTypes/contextTypes) - avoid
// AFTER: modern context
const ThemeContext = React.createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("light");
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function UseThemeButton() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;
}`}        </Styled.Pre>
                <Styled.Small>
                    Modern context is explicit and type-safe. Combine with <Styled.InlineCode>useMemo</Styled.InlineCode> to keep
                    the provided value stable and avoid extra renders.
                </Styled.Small>
            </Styled.Section>

            {/* 6) findDOMNode and refs */}
            <Styled.Section>
                <Styled.H2>Step 5 - Remove <code>findDOMNode</code>, Prefer Refs + <code>forwardRef</code></Styled.H2>
                <Styled.Pre>
                    {`// BEFORE
class Legacy extends React.Component {
  componentDidMount() {
    // Anti-pattern; findDOMNode is deprecated for strict/concurrent react
    const el = ReactDOM.findDOMNode(this);
    // ...
  }
  render() { return <div />; }
}

// AFTER
const Modern = React.forwardRef(function Modern(props, ref) {
  return <div ref={ref} {...props} />;
});

// Usage:
const ref = React.useRef(null);
// <Modern ref={ref} />`}        </Styled.Pre>
                <Styled.Small>
                    <b>Why:</b> <Styled.InlineCode>findDOMNode</Styled.InlineCode> breaks with portals/strict mode and
                    isn't future-proof. Use <Styled.InlineCode>ref</Styled.InlineCode> + <Styled.InlineCode>forwardRef</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Automatic batching + transitions */}
            <Styled.Section>
                <Styled.H2>Step 6 - Embrace Automatic Batching & Transitions</Styled.H2>
                <Styled.List>
                    <li><b>Automatic batching:</b> Multiple state updates in time-close handlers/effects are applied in one render.</li>
                    <li><b>Transitions:</b> Mark non-urgent updates so typing/hovering remains immediate.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { startTransition } from "react";

function Search({ allItems }) {
  const [text, setText] = React.useState("");
  const [results, setResults] = React.useState(allItems);

  function onChange(e) {
    const q = e.target.value;
    setText(q); // urgent (reflect input immediately)
    startTransition(() => {
      // non-urgent (filter a large list)
      const next = allItems.filter(x => x.name.toLowerCase().includes(q.toLowerCase()));
      setResults(next);
    });
  }

  return (
    <>
      <input value={text} onChange={onChange} placeholder="Type to search..." />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}`}        </Styled.Pre>
                <Styled.Small>
                    If you can't restructure immediately, start by using transitions around heavy computations
                    (filtering, sorting, large list virtualization).
                </Styled.Small>
            </Styled.Section>

            {/* 8) Suspense mindset */}
            <Styled.Section>
                <Styled.H2>Step 7 - Think "Suspense-Friendly" (Gradual)</Styled.H2>
                <Styled.List>
                    <li><b>Suspense:</b> A mechanism where components can "pause" rendering while data loads.</li>
                    <li><b>Benefit:</b> Cleaner loading states, less prop-drilling of "isLoading", and better streaming SSR.</li>
                    <li><b>Migration approach:</b> Start at feature boundaries; wrap slow trees in <Styled.InlineCode>&lt;Suspense fallback=&quot;…&quot;/&gt;</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Sketch (client)
import { Suspense } from "react";

function ProductPage() {
  return (
    <Suspense fallback={<div>Loading product…</div>}>
      <ProductDetails /> {/* reads product via a data layer that supports suspense */}
    </Suspense>
  );
}`}        </Styled.Pre>
                <Styled.Small>
                    You don't have to go all-in on day one. Design new features to be compatible with Suspense to avoid future rewrites.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Default props & other nits */}
            <Styled.Section>
                <Styled.H2>Step 8 - Small but Important Modernizations</Styled.H2>
                <Styled.List>
                    <li><b>Function defaults:</b> Prefer parameter defaults over <Styled.InlineCode>Component.defaultProps</Styled.InlineCode> for function components.</li>
                    <li><b>PropTypes (optional):</b> Keep for runtime checking if useful; otherwise rely on TypeScript or JSDoc.</li>
                    <li><b>Keys & lists:</b> Ensure stable <Styled.InlineCode>key</Styled.InlineCode>s (don't use indexes for re-orderable lists).</li>
                    <li><b>Effects hygiene:</b> Keep side effects inside <Styled.InlineCode>useEffect</Styled.InlineCode> and return cleanups.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Default props - modern way
function Avatar({ size = 40, src, alt = "avatar" }) {
  return <img width={size} height={size} src={src} alt={alt} />;
}`}        </Styled.Pre>
            </Styled.Section>

            {/* 10) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls & How to Avoid Them</Styled.H2>
                <Styled.List>
                    <li><b>Effect over-firing:</b> In StrictMode dev, React mounts/effects twice to catch bugs. Ensure effects are idempotent and clean up properly.</li>
                    <li><b>Stale closures:</b> When using async callbacks, depend on the right values or use patterns like a ref + <Styled.InlineCode>useEvent</Styled.InlineCode> (stable callback to latest implementation).</li>
                    <li><b>Derived state anti-pattern:</b> Don't mirror props in state unless you have a real reason; compute with <Styled.InlineCode>useMemo</Styled.InlineCode> instead.</li>
                    <li><b>Uncontrolled → controlled jumps:</b> Initialize inputs correctly to avoid warnings. Use explicit <Styled.InlineCode>value</Styled.InlineCode> or <Styled.InlineCode>defaultValue</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Upgrade checklist */}
            <Styled.Section>
                <Styled.H2>Practical Checklist</Styled.H2>
                <Styled.List>
                    <li>✅ Replace <Styled.InlineCode>ReactDOM.render</Styled.InlineCode> with <Styled.InlineCode>createRoot</Styled.InlineCode>.</li>
                    <li>✅ Enable <Styled.InlineCode>&lt;StrictMode&gt;</Styled.InlineCode> in dev.</li>
                    <li>✅ Convert classes to functions + hooks (start with leaf components).</li>
                    <li>✅ Replace legacy context with <Styled.InlineCode>createContext</Styled.InlineCode>.</li>
                    <li>✅ Remove <Styled.InlineCode>findDOMNode</Styled.InlineCode> and UNSAFE lifecycles.</li>
                    <li>✅ Consider <Styled.InlineCode>startTransition</Styled.InlineCode> or <Styled.InlineCode>useDeferredValue</Styled.InlineCode> for heavy updates.</li>
                    <li>✅ Plan a path toward Suspense-first data (new features use it by design).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Mindset shift:</b> Think in terms of dataflow + effects + composition. Favor small function components,
                clean effects, and context where needed. Adopt concurrent-friendly patterns so performance scales with features.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default MigratingLegacy;
