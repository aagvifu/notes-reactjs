import { Styled } from "./styled";

const OverContext = () => {
    return (
        <Styled.Page>
            <Styled.Title>Over-Context (Anti-Pattern)</Styled.Title>

            <Styled.Lead>
                <b>Over-Context</b> is the habit of pushing too much state into React Context—especially
                <i>fast-changing</i> or <i>local-only</i> state. Context is best for <b>globally relevant, stable</b> data
                (theme, auth session, i18n, feature flags). Using it as a global store for everything triggers extra
                re-renders and tight coupling.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>React Context:</b> a mechanism to pass values to many descendants without prop drilling. Created via{" "}
                        <Styled.InlineCode>React.createContext(defaultValue)</Styled.InlineCode>, read with{" "}
                        <Styled.InlineCode>useContext(MyContext)</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Provider:</b> the component that supplies a value to a Context tree:{" "}
                        <Styled.InlineCode>{"<MyContext.Provider value={...}>...</MyContext.Provider>"}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Consumer:</b> any descendant calling <Styled.InlineCode>useContext</Styled.InlineCode> to read the Provider's value.
                    </li>
                    <li>
                        <b>Re-render blast radius:</b> when a Context value changes, <i>all</i> components reading that context re-render.
                    </li>
                    <li>
                        <b>Ephemeral UI state:</b> short-lived, local component state (e.g., toggling a modal, input text, hover).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When Context is appropriate */}
            <Styled.Section>
                <Styled.H2>Use Context for the right things</Styled.H2>
                <Styled.List>
                    <li><b>Stable, app-wide</b> values: theme (light/dark), locale, date-format rules, feature flags.</li>
                    <li><b>Session-like</b> values: authenticated user profile, access token (read-mostly).</li>
                    <li><b>Cross-cutting</b> concerns: analytics client, error/reporting clients, config objects (rarely change).</li>
                </Styled.List>
                <Styled.Small>
                    If a value changes many times per second, or only a few components need it, Context may be the wrong fit.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Smells that you're over-using Context */}
            <Styled.Section>
                <Styled.H2>Smells &amp; Symptoms</Styled.H2>
                <Styled.List>
                    <li>Putting <b>every</b> piece of state into a single “GlobalContext”.</li>
                    <li>Storing <b>fast-changing</b> values (keystrokes, scroll position) in Context.</li>
                    <li>Context value is a <b>huge object</b> with dozens of fields and callbacks.</li>
                    <li>Unrelated UI re-renders whenever any part of the Context value changes.</li>
                    <li>Hard to test: components depend on a giant Provider even for trivial behavior.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Anti-example: one big context */}
            <Styled.Section>
                <Styled.H2>Anti-example: one giant context</Styled.H2>
                <Styled.Pre>
                    {`// ❌ One giant, fast-changing context
const AppContext = React.createContext(null);

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("");        // changes on every keystroke
  const [cart, setCart] = React.useState([]);          // changes frequently
  const [theme, setTheme] = React.useState("dark");    // rarely changes

  const value = { query, setQuery, cart, setCart, theme, setTheme };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Any consumer of ANY field re-renders whenever query/cart/theme changes:
function HeaderSearch() {
  const { query, setQuery } = React.useContext(AppContext);
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function FooterThemeToggle() {
  const { theme, setTheme } = React.useContext(AppContext);
  return <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
    Theme: {theme}
  </button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Problem:</b> Header and Footer are now coupled—typing in the header forces the footer to re-render.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Better: split contexts by stability & audience */}
            <Styled.Section>
                <Styled.H2>Refactor: split by stability &amp; audience</Styled.H2>
                <Styled.Pre>
                    {`// ✅ Separate stable and volatile concerns
const ThemeContext = React.createContext(null);   // stable-ish
const CartContext  = React.createContext(null);   // volatile but scoped
const SearchContext = React.createContext(null);  // very volatile; scope it narrowly

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("dark");
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]); // stable identity
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function CartProvider({ children }) {
  const [cart, setCart] = React.useState([]);
  const add = React.useCallback(item => setCart(c => [...c, item]), []);
  const value = React.useMemo(() => ({ cart, add }), [cart, add]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Narrow scope: only wrap the subtree that needs live search state
function SearchProvider({ children }) {
  const [query, setQuery] = React.useState("");
  const value = React.useMemo(() => ({ query, setQuery }), [query]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why it helps:</b> unrelated consumers stop re-rendering; Providers can be placed close to where state is
                    needed, reducing blast radius.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Avoid passing huge objects */}
            <Styled.Section>
                <Styled.H2>Avoid “god objects” as context values</Styled.H2>
                <Styled.List>
                    <li>Expose the <b>minimal shape</b> consumers need (e.g., only <Styled.InlineCode>theme</Styled.InlineCode> + setter).</li>
                    <li>Use <Styled.InlineCode>useMemo</Styled.InlineCode> to keep the provided object identity stable across renders.</li>
                    <li>Prefer <b>multiple small contexts</b> over one mega object.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Mega object (new identity every render)
<MyContext.Provider value={{ a, b, c, doX, doY, doZ }} />

// ✅ Memoized minimal object
const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Fast-changing state: keep it local or use stores */}
            <Styled.Section>
                <Styled.H2>Fast-changing state: keep local or use a store</Styled.H2>
                <Styled.List>
                    <li><b>Local first:</b> UI-only state (hover, input text) should live in the component via <Styled.InlineCode>useState</Styled.InlineCode>.</li>
                    <li><b>Shared but hot:</b> for values that update many times per second (e.g., cursor, scroll), consider a lightweight state library that supports <b>selectors</b> to update only interested components.</li>
                    <li><b>Derive when possible:</b> compute values from source state in the component with <Styled.InlineCode>useMemo</Styled.InlineCode> instead of storing them in Context.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Local UI-only state (good)
function SearchBox() {
  const [q, setQ] = React.useState("");
  return <input value={q} onChange={(e) => setQ(e.target.value)} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Selector pattern with context (advanced) */}
            <Styled.Section>
                <Styled.H2>Selector pattern (advanced)</Styled.H2>
                <Styled.Lead>
                    Context does not natively support selectors, but you can <i>manually</i> expose smaller contexts
                    or custom hooks that subscribe to slices. Keep it simple unless you truly need it.
                </Styled.Lead>
                <Styled.Pre>
                    {`// Split read paths using multiple contexts:
const CartItemsContext = React.createContext([]);
const CartActionsContext = React.createContext({ add: () => {} });

function CartProvider({ children }) {
  const [items, setItems] = React.useState([]);
  const add = React.useCallback((item) => setItems((xs) => [...xs, item]), []);
  return (
    <CartItemsContext.Provider value={items}>
      <CartActionsContext.Provider value={{ add }}>
        {children}
      </CartActionsContext.Provider>
    </CartItemsContext.Provider>
  );
}

function useCartItems() { return React.useContext(CartItemsContext); }
function useCartActions() { return React.useContext(CartActionsContext); }`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Benefit:</b> components that only need actions don't re-render when items change—and vice versa.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep ephemeral state local; lift it only when multiple siblings truly need it.</li>
                    <li><b>Do</b> split contexts by concern and stability; memoize provided objects.</li>
                    <li><b>Do</b> wrap the smallest subtree that needs the value; avoid app-wide providers for hot state.</li>
                    <li><b>Don't</b> store every keystroke / scroll offset in Context.</li>
                    <li><b>Don't</b> expose a giant, ever-changing object as the context value.</li>
                    <li><b>Don't</b> use Context as a substitute for thoughtful component design and state co-location.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Decision checklist */}
            <Styled.Section>
                <Styled.H2>Decision checklist</Styled.H2>
                <Styled.List>
                    <li>Is the value globally relevant and read across distant parts of the tree?</li>
                    <li>How frequently does it change? (Slow & stable → Context. Fast & hot → keep local/store.)</li>
                    <li>Can I split this into smaller, focused contexts?</li>
                    <li>Can consumers derive what they need instead of storing everything?</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Prop drilling:</b> passing props through many layers just so deep children can read them.</li>
                    <li><b>Co-location:</b> keeping state near the components that use it.</li>
                    <li><b>Selector:</b> a function that reads a slice of state to minimize re-renders.</li>
                    <li><b>Blast radius:</b> the number of components affected by a state change.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use Context <b>sparingly and purposefully</b>. Keep hot, local state out of global
                providers; split by concern, memoize values, and prefer co-location. Smaller contexts and stable
                shapes make your app faster and easier to reason about.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default OverContext;
