import { Styled } from "./styled";

const TypingContext = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Context (TypeScript)</Styled.Title>

            <Styled.Lead>
                <b>React Context</b> lets you share values (state, settings, services) with any
                descendant without prop drilling. With <b>TypeScript</b>, we give that context a
                precise type so consumers get autocompletion and compile-time safety.
            </Styled.Lead>

            {/* 1) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms — clear definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Context:</b> a React mechanism created via{" "}
                        <Styled.InlineCode>createContext</Styled.InlineCode> to pass a <em>value</em> through
                        the component tree.
                    </li>
                    <li>
                        <b>Provider:</b> the component that makes the context value available to its descendants:{" "}
                        <Styled.InlineCode>{`<MyContext.Provider value={...}>`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Consumer:</b> any descendant that reads the context via{" "}
                        <Styled.InlineCode>useContext(MyContext)</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Value type:</b> the exact shape of the data placed into the context (e.g.,{" "}
                        <Styled.InlineCode>{`{ user: User | null, login(): Promise<void> }`}</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Union type:</b> a type that can be one of several options (e.g.,{" "}
                        <Styled.InlineCode>string | null</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Generic:</b> a type parameter that lets us write reusable, type-safe helpers (e.g.,
                        <Styled.InlineCode>createStrictContext&lt;T&gt;()</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Reducer / Dispatch:</b> state update pattern via{" "}
                        <Styled.InlineCode>useReducer</Styled.InlineCode>;{" "}
                        <Styled.InlineCode>Dispatch&lt;Action&gt;</Styled.InlineCode> is a function that sends an{" "}
                        <Styled.InlineCode>Action</Styled.InlineCode> to the reducer.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal typed context */}
            <Styled.Section>
                <Styled.H2>Minimal Typed Context</Styled.H2>
                <Styled.List>
                    <li>
                        Start by defining a <b>Value type</b>. Then type{" "}
                        <Styled.InlineCode>createContext&lt;ValueType | undefined&gt;(undefined)</Styled.InlineCode>{" "}
                        to force consumers to handle missing providers in dev.
                    </li>
                    <li>
                        Provide a <b>custom hook</b> to read the context and throw a clear error if used outside
                        a provider.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Value shape for the theme feature
type Theme = "light" | "dark";
interface ThemeCtx {
  theme: Theme;
  setTheme(next: Theme): void;
}

// Context is either the value or undefined before a Provider is mounted
const ThemeContext = React.createContext<ThemeCtx | undefined>(undefined);

// Safe consumer hook
export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

// Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  // Memoize the value object to keep reference stable and reduce re-renders
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Using <Styled.InlineCode>undefined</Styled.InlineCode> as the default and guarding inside{" "}
                    <Styled.InlineCode>useTheme</Styled.InlineCode> prevents silent fallbacks.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Split value and dispatch contexts */}
            <Styled.Section>
                <Styled.H2>Pattern: Split Value &amp; Dispatch</Styled.H2>
                <Styled.List>
                    <li>
                        For <b>reducer-based state</b>, split into two contexts: one for <em>state</em> and one
                        for <em>dispatch</em>. Consumers that only dispatch do not re-render when state changes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`interface CounterState { count: number }
type CounterAction = { type: "inc" } | { type: "dec" } | { type: "set"; payload: number };

const CounterStateContext = React.createContext<CounterState | undefined>(undefined);
const CounterDispatchContext = React.createContext<React.Dispatch<CounterAction> | undefined>(undefined);

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "dec": return { count: state.count - 1 };
    case "set": return { count: action.payload };
    default: return state;
  }
}

export function CounterProvider({ children }) {
  const [state, dispatch] = React.useReducer(counterReducer, { count: 0 });
  return (
    <CounterStateContext.Provider value={state}>
      <CounterDispatchContext.Provider value={dispatch}>
        {children}
      </CounterDispatchContext.Provider>
    </CounterStateContext.Provider>
  );
}

// Consumer hooks (with helpful errors)
export function useCounterState() {
  const v = React.useContext(CounterStateContext);
  if (!v) throw new Error("useCounterState must be used within <CounterProvider>");
  return v;
}
export function useCounterDispatch() {
  const d = React.useContext(CounterDispatchContext);
  if (!d) throw new Error("useCounterDispatch must be used within <CounterProvider>");
  return d;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Generic helper: createStrictContext */}
            <Styled.Section>
                <Styled.H2>Generic Helper: <code>createStrictContext&lt;T&gt;</code></Styled.H2>
                <Styled.List>
                    <li>
                        Avoid repeating boilerplate by creating a helper that returns a typed hook and Provider.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Reusable helper
function createStrictContext<T>(name: string) {
  const Ctx = React.createContext<T | undefined>(undefined);
  function useCtx() {
    const v = React.useContext(Ctx);
    if (v === undefined) throw new Error(\`\${name} must be used within its Provider\`);
    return v;
  }
  return [useCtx, Ctx.Provider] as const;
}

// Usage
type AuthCtx = { user: { id: string } | null; login(): Promise<void>; logout(): void };
const [useAuth, AuthProvider] = createStrictContext<AuthCtx>("useAuth");

function AppProviders({ children }) {
  const [user, setUser] = React.useState<{ id: string } | null>(null);
  const login = async () => { /* ... */ setUser({ id: "u1" }); };
  const logout = () => setUser(null);
  const value = React.useMemo(() => ({ user, login, logout }), [user]);
  return <AuthProvider value={value}>{children}</AuthProvider>;
}

// Later in any component
function ProfileButton() {
  const { user, logout } = useAuth();
  return user ? <button onClick={logout}>Logout</button> : null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Typing children & provider props */}
            <Styled.Section>
                <Styled.H2>Typing Provider Props &amp; Children</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Children:</b> use <Styled.InlineCode>React.ReactNode</Styled.InlineCode> (or{" "}
                        <Styled.InlineCode>PropsWithChildren</Styled.InlineCode>) to type the{" "}
                        <Styled.InlineCode>children</Styled.InlineCode> prop.
                    </li>
                    <li>
                        <b>Provider value:</b> its type must match the context value type exactly (no extra keys,
                        no missing keys).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import type { PropsWithChildren } from "react";

type Settings = { locale: string; setLocale(l: string): void };
const SettingsContext = React.createContext<Settings | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = React.useState("en");
  const value = React.useMemo<Settings>(() => ({ locale, setLocale }), [locale]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Handling async/optional values */}
            <Styled.Section>
                <Styled.H2>Handling Async or Optional Values</Styled.H2>
                <Styled.List>
                    <li>
                        Use a <b>Maybe</b> union for values that may not exist yet (e.g., before fetching):{" "}
                        <Styled.InlineCode>type Maybe&lt;T&gt; = T | null</Styled.InlineCode>.
                    </li>
                    <li>
                        Prefer explicit states (<em>idle</em>, <em>loading</em>, <em>ready</em>, <em>error</em>)
                        for clarity.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type Maybe<T> = T | null;
type Profile = { id: string; name: string };

type ProfileCtx = {
  status: "idle" | "loading" | "ready" | "error";
  data: Maybe<Profile>;
  refetch(): Promise<void>;
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> type your context with exact shapes (no <Styled.InlineCode>any</Styled.InlineCode>).</li>
                    <li><b>Do</b> use a <b>custom hook</b> that errors if the provider is missing.</li>
                    <li><b>Do</b> <b>memoize</b> provider values (objects/functions) to reduce re-renders.</li>
                    <li><b>Do</b> split value/dispatch for reducer contexts when perf matters.</li>
                    <li><b>Don't</b> provide a real default value unless you truly want consumers to work without a Provider.</li>
                    <li><b>Don't</b> put rapidly changing values in a single giant context—split into smaller contexts.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary (recap) */}
            <Styled.Section>
                <Styled.H2>Glossary (recap)</Styled.H2>
                <Styled.List>
                    <li><b>Context</b>: Tree-wide value channel created by <Styled.InlineCode>createContext</Styled.InlineCode>.</li>
                    <li><b>Provider</b>: Component that supplies the value to descendants.</li>
                    <li><b>Consumer</b>: Code calling <Styled.InlineCode>useContext</Styled.InlineCode> to read the value.</li>
                    <li><b>Union</b>: A type composed of alternatives (e.g., <Styled.InlineCode>T | null</Styled.InlineCode>).</li>
                    <li><b>Generic</b>: Parametric type used to build reusable, strongly-typed helpers.</li>
                    <li><b>Dispatch</b>: Function returned by <Styled.InlineCode>useReducer</Styled.InlineCode> to send actions.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Define a precise value type, create a strict context (
                <Styled.InlineCode>T | undefined</Styled.InlineCode>), expose a safe hook that throws
                when unprovided, memoize values, and split contexts for performance. Your consumers get
                perfect IntelliSense and early error detection.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingContext;
