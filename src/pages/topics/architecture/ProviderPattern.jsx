import React from "react";
import { Styled } from "./styled";

const ProviderPattern = () => {
    return (
        <Styled.Page>
            <Styled.Title>Provider Pattern</Styled.Title>

            <Styled.Lead>
                The <b>Provider Pattern</b> shares state and functions with deeply nested components
                using React's <Styled.InlineCode>Context</Styled.InlineCode>. A top-level{" "}
                <Styled.InlineCode>&lt;Provider&gt;</Styled.InlineCode> makes a value available to{" "}
                any descendant, so you avoid <em>prop drilling</em> (passing props through
                many layers that don't use them).
            </Styled.Lead>

            {/* 1) Core Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Context:</b> A React mechanism for passing data through the component tree
                        without manually passing props at every level. Created with{" "}
                        <Styled.InlineCode>React.createContext(defaultValue)</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Provider:</b> A special component on a Context (
                        <Styled.InlineCode>MyContext.Provider</Styled.InlineCode>) that supplies a{" "}
                        <Styled.InlineCode>value</Styled.InlineCode> to all descendants.
                    </li>
                    <li>
                        <b>Consumer:</b> Any component that reads context via{" "}
                        <Styled.InlineCode>useContext(MyContext)</Styled.InlineCode> (or the legacy{" "}
                        <Styled.InlineCode>&lt;MyContext.Consumer&gt;</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Prop drilling:</b> Passing props through intermediate components that don't
                        directly need them, just to reach a deep child.
                    </li>
                    <li>
                        <b>Re-render:</b> When a component renders again because its props/state/context
                        changed. Context value changes propagate re-renders to all consumers.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal Example: ThemeProvider */}
            <Styled.Section>
                <Styled.H2>Minimal Example: Theme Provider</Styled.H2>
                <Styled.Pre>
                    {`// theme-context.js
import * as React from "react";

export const ThemeContext = React.createContext({ mode: "light", toggle: () => {} });

export function ThemeProvider({ children, initial = "light" }) {
  const [mode, setMode] = React.useState(initial);

  // Keep the object identity stable to avoid re-rendering all consumers unnecessarily
  const value = React.useMemo(() => ({
    mode,
    toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// useTheme.js
export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

// Any component:
function ThemeButton() {
  const { mode, toggle } = useTheme();
  return <button onClick={toggle}>Current: {mode} — Toggle</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The <Styled.InlineCode>value</Styled.InlineCode> is memoized so consumer components don't
                    re-render unless <Styled.InlineCode>mode</Styled.InlineCode> actually changes.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Realistic Example: AuthProvider (state + actions) */}
            <Styled.Section>
                <Styled.H2>Realistic Example: Auth Provider (state + actions)</Styled.H2>
                <Styled.Pre>
                    {`// auth-context.js
import * as React from "react";

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  const login = React.useCallback(async (credentials) => {
    // fake API
    const fakeUser = { id: 1, name: "Ashish" };
    setUser(fakeUser);
    return fakeUser;
  }, []);

  const logout = React.useCallback(() => setUser(null), []);

  const value = React.useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// usage
function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : <span>Guest</span>}
    </nav>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The provider exposes both <em>state</em> (<code>user</code>) and <em>actions</em>{" "}
                    (<code>login</code>, <code>logout</code>) as a stable, memoized value.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Design Choices & Patterns */}
            <Styled.Section>
                <Styled.H2>Design Choices & Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Split contexts by concern:</b> If one context value changes frequently (like
                        input text), separate it from rarely changing pieces to limit re-renders.
                    </li>
                    <li>
                        <b>Stable identity:</b> Wrap provider <Styled.InlineCode>value</Styled.InlineCode> in{" "}
                        <Styled.InlineCode>useMemo</Styled.InlineCode>; wrap actions in{" "}
                        <Styled.InlineCode>useCallback</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Selectors (advanced):</b> Instead of exposing a large object, expose small hooks
                        like <Styled.InlineCode>useAuthUser()</Styled.InlineCode> or use a selector pattern
                        so consumers only re-render for what they read.
                    </li>
                    <li>
                        <b>Provider Composer:</b> When multiple providers are needed (Theme, Auth, I18n),
                        compose them with a <em>Providers</em> wrapper for clean root code.
                    </li>
                    <li>
                        <b>Default values:</b> Give meaningful defaults for SSR/tests but still guard
                        with an invariant (throw if used outside the provider) to catch mistakes early.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Provider Composer Example */}
            <Styled.Section>
                <Styled.H2>Provider Composer (nesting made tidy)</Styled.H2>
                <Styled.Pre>
                    {`function Providers({ children }) {
  return (
    <ThemeProvider initial="dark">
      <AuthProvider>
        {/* add more providers here (I18nProvider, QueryClientProvider, etc.) */}
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

// Root:
// ReactDOM.createRoot(...).render(<Providers><App/></Providers>)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use the Provider Pattern to avoid prop drilling for truly shared state.</li>
                    <li><b>Do</b> memoize the provider value and callbacks to reduce consumer re-renders.</li>
                    <li><b>Do</b> split large contexts into multiple, smaller contexts by change frequency.</li>
                    <li><b>Don't</b> put every piece of state into context—prefer local state unless multiple distant components need it.</li>
                    <li><b>Don't</b> read context in hot, frequently re-rendering components if it causes performance issues—consider selectors or lifting logic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Common Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Unstable values:</b> Returning a new object each render causes all consumers to re-render.
                        Fix: wrap with <Styled.InlineCode>useMemo</Styled.InlineCode>/<Styled.InlineCode>useCallback</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Over-contextualization:</b> Context everywhere leads to unnecessary coupling and renders.
                        Start local; move to context when clearly needed.
                    </li>
                    <li>
                        <b>Using outside provider:</b> Accessing a context without the provider—guard with an explicit error.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Context value:</b> The object or primitive provided by the provider.</li>
                    <li><b>Consumer:</b> A component that calls <Styled.InlineCode>useContext</Styled.InlineCode> to read the context.</li>
                    <li><b>Memoization:</b> Caching a computed value by dependencies to keep reference stable.</li>
                    <li><b>Selector pattern:</b> A technique to read only a slice of context to reduce re-renders.</li>
                    <li><b>Prop drilling:</b> Passing props through components that don't directly need them.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use the Provider Pattern to share cross-cutting state and actions without
                prop drilling. Keep provider values stable, split contexts by change frequency,
                and compose providers cleanly at the root.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ProviderPattern;
