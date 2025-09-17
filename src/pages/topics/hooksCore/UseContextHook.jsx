import React from "react";
import { Styled } from "./styled";

const UseContextHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useContext</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useContext</Styled.InlineCode> reads a value from the nearest matching{" "}
                <b>Context.Provider</b> above the component. Use context to share data across a subtree
                without prop drilling (theme, auth, i18n, config, form group state, etc.).
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Context object:</b> the value from <Styled.InlineCode>React.createContext(defaultValue)</Styled.InlineCode>.</li>
                    <li><b>Provider:</b> <Styled.InlineCode>{`<MyContext.Provider value={...}>`}</Styled.InlineCode> making a value available to descendants.</li>
                    <li><b>Consumer:</b> any component calling <Styled.InlineCode>useContext(MyContext)</Styled.InlineCode>.</li>
                    <li><b>Prop drilling:</b> passing props through many intermediate components that do not use them.</li>
                    <li><b>Value identity:</b> reference of the object/array passed to <Styled.InlineCode>value</Styled.InlineCode>. A new identity re-renders all consumers.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic pattern */}
            <Styled.Section>
                <Styled.H2>Basic pattern</Styled.H2>
                <Styled.Pre>
                    {`// context.js
import React from "react";
export const ThemeContext = React.createContext("light"); // default used if no Provider

// App.jsx
import { ThemeContext } from "./context";
function App() {
  const [theme, setTheme] = React.useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

// Toolbar.jsx (consumer)
import { ThemeContext } from "./context";
function Toolbar() {
  const theme = React.useContext(ThemeContext);
  return <div className={theme === "dark" ? "dark" : "light"}>Toolbar</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Consumers re-render whenever the provider’s <em>value</em> changes (by <b>identity</b>).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Safer custom hook + required provider */}
            <Styled.Section>
                <Styled.H2>Safer custom hook (enforce provider)</Styled.H2>
                <Styled.Pre>
                    {`// Strict context pattern
const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const value = React.useMemo(() => ({ user, setUser }), [user]); // memoize identity
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

// Consumer
function Profile() {
  const { user } = useAuth();
  return <p>{user ? "Signed in" : "Guest"}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Throwing when missing helps catch misconfiguration early in development.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Memoize provider value (performance) */}
            <Styled.Section>
                <Styled.H2>Memoize the provider <code>value</code></Styled.H2>
                <Styled.List>
                    <li>Passing <Styled.InlineCode>{`{ user, setUser }`}</Styled.InlineCode> inline creates a new object every render → all consumers re-render.</li>
                    <li>Wrap in <Styled.InlineCode>useMemo</Styled.InlineCode> so the identity changes only when dependencies change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good: value is stable until 'user' changes
const value = React.useMemo(() => ({ user, setUser }), [user]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Split state and dispatch contexts */}
            <Styled.Section>
                <Styled.H2>Split contexts: state vs dispatch</Styled.H2>
                <Styled.Pre>
                    {`const CountStateContext = React.createContext(0);
const CountDispatchContext = React.createContext(null);

function CountProvider({ children }) {
  const [count, setCount] = React.useState(0);
  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={setCount}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

function useCount() { return React.useContext(CountStateContext); }
function useSetCount() { return React.useContext(CountDispatchContext); }

// Consumers only re-render for the part they read.
function Increment() {
  const setCount = useSetCount();
  return <button onClick={() => setCount(c => c + 1)}>+</button>;
}
function Display() {
  const count = useCount();
  return <p>{count}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Splitting avoids re-rendering components that only need the dispatcher when state changes.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Selector-like pattern (without extra libs) */}
            <Styled.Section>
                <Styled.H2>Selector-like pattern</Styled.H2>
                <Styled.Pre>
                    {`// Provide a single object but memoize slices before passing to children
const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [state, setState] = React.useState({ items: [], filter: "" });
  const api = React.useMemo(() => ({ state, setState }), [state]);
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

// Custom hook selects a slice; memoize derived value to keep reference stable
function useStoreSelector(selector) {
  const { state } = React.useContext(StoreContext);
  return React.useMemo(() => selector(state), [state, selector]);
}

// Consumer
function CountLabel() {
  const count = useStoreSelector(s => s.items.length);
  return <span>Count: {count}</span>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    This keeps the selected value referentially stable for children relying on memo/effect deps, though all consumers still re-render when the provider’s value identity changes. For very large apps, consider context-selector libraries or state stores.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Context vs props vs global store */}
            <Styled.Section>
                <Styled.H2>Context vs props vs global store</Styled.H2>
                <Styled.List>
                    <li><b>Props</b>: best for local, one-direction data flow; simplest and most explicit.</li>
                    <li><b>Context</b>: cross-cutting concerns shared by many components (theme, locale, auth, form group, feature flags).</li>
                    <li><b>State libraries</b>: complex/global state with fine-grained subscriptions or DevTools (when context granularity is insufficient).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Dynamic/scoped providers */}
            <Styled.Section>
                <Styled.H2>Dynamic / scoped providers</Styled.H2>
                <Styled.Pre>
                    {`// Each subtree can have its own "scope"
function Section({ accent, children }) {
  return (
    <ThemeColor.Provider value={accent}>
      {children}
    </ThemeColor.Provider>
  );
}
function Button() {
  const color = React.useContext(ThemeColor);
  return <button style={{ background: color }}>Click</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Nested providers override parent values—useful for theming and localized overrides.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Creating a new <Styled.InlineCode>value</Styled.InlineCode> object every render → re-renders all consumers. Memoize it.</li>
                    <li>Overusing context for values only needed by a couple of siblings—prefer lifting state or props.</li>
                    <li>Putting side effects in render based on context; use effects instead.</li>
                    <li>Storing frequently changing, high-frequency values in a top-level context (e.g., keystrokes) → many re-renders. Colocate or split providers.</li>
                    <li>Forgetting default/required provider checks; use a strict custom hook to throw when missing.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use context to remove painful prop drilling for shared concerns.</li>
                    <li><b>Do</b> memoize provider values and consider splitting state/dispatch.</li>
                    <li><b>Do</b> pair context with custom hooks for clean APIs.</li>
                    <li><b>Don’t</b> use context as a default for all state; start with props/local state.</li>
                    <li><b>Don’t</b> pass huge, frequently changing objects as context values at the app root.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useContext</Styled.InlineCode> is ideal for sharing state/config across a subtree.
                Memoize provider values, split concerns when useful (state vs dispatch), and reach for props or local state when
                sharing is not required. Keep updates scoped to avoid unnecessary re-renders.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseContextHook;
