import { Styled } from "./styled";

const ContextVsStore = () => {
    return (
        <Styled.Page>
            <Styled.Title>Context vs Store (State Management)</Styled.Title>

            <Styled.Lead>
                <b>Context</b> fixes <i>prop drilling</i> by letting you read a value anywhere in the tree.
                A <b>store</b> (Redux Toolkit, Zustand, Jotai, Recoil, XState) manages <i>application state</i>
                with tools for updates, derivations, performance, and debugging. Use Context for <em>sharing</em>;
                use a Store for <em>managing</em> complex, frequently-changing state.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>State:</b> data that changes over time and drives UI rendering.</li>
                    <li><b>Prop drilling:</b> passing props through many intermediate components that don't use them.</li>
                    <li><b>Context:</b> a React feature to make a value available to any descendant without passing props.</li>
                    <li><b>Provider:</b> the component that supplies a context <em>value</em> to its subtree.</li>
                    <li><b>Consumer / <Styled.InlineCode>useContext</Styled.InlineCode>:</b> code that reads the current context value.</li>
                    <li><b>Store:</b> a centralized state container with APIs to read, update, and derive state efficiently.</li>
                    <li><b>Action:</b> a description of a change (e.g., <Styled.InlineCode>{`{ type: "cart/add", payload: item }`}</Styled.InlineCode>).</li>
                    <li><b>Reducer:</b> a pure function computing next state from current state + action.</li>
                    <li><b>Selector:</b> a function that reads/derives a <em>slice</em> of state (helps performance).</li>
                    <li><b>Immutability:</b> update by creating new objects/arrays instead of mutating (enables change detection).</li>
                    <li><b>Derivation:</b> computed values from base state (totals, filtered lists).</li>
                    <li><b>Effects/Middleware:</b> logic that runs on updates (logging, persistence, async, devtools).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What Context solves */}
            <Styled.Section>
                <Styled.H2>What Context Solves (and What It Doesn't)</Styled.H2>
                <Styled.List>
                    <li><b>Solves:</b> sharing stable values across the tree: theme, locale, current user, feature flags, router.</li>
                    <li><b>Doesn't solve:</b> performance for fast-changing, large state; debugging; time-travel; middleware; caching.</li>
                    <li><b>Re-render note:</b> when a Provider's <em>value</em> changes, <u>all</u> descendants that read the context re-render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) When to choose a store */}
            <Styled.Section>
                <Styled.H2>When to Choose a Store</Styled.H2>
                <Styled.List>
                    <li>Frequent updates (typing, drag, live filters) or large trees reading small slices.</li>
                    <li>Need selectors, devtools, middleware, persistence, SSR hydration, undo/redo.</li>
                    <li>Caching server data (see RTK Query) or graph-like dependencies (Recoil/Jotai atoms).</li>
                    <li>Complex workflows needing explicit <em>states</em> and <em>events</em> (XState finite state machines).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: Context for simple, stable values */}
            <Styled.Section>
                <Styled.H2>Example: Context for Theme (stable value)</Styled.H2>
                <Styled.Pre>
                    {`import React from "react";

const ThemeContext = React.createContext("light"); // default

export function ThemeProvider({ initial = "light", children }) {
  const [mode, setMode] = React.useState(initial);
  const value = React.useMemo(() => ({ mode, setMode }), [mode]); // stable identity
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Usage:
// const { mode, setMode } = useTheme(); setMode(prev => (prev === "light" ? "dark" : "light"));
`}
                </Styled.Pre>
                <Styled.Small>
                    Context shines when the value is <i>read often</i> but <i>changes infrequently</i>, and the
                    entire subtree should react to changes (theme, locale).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: Context with reducer, split providers */}
            <Styled.Section>
                <Styled.H2>Example: Context + Reducer (split state/dispatch)</Styled.H2>
                <Styled.Pre>
                    {`import React from "react";

const StateCtx = React.createContext(null);
const DispatchCtx = React.createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "remove":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, { items: [] });
  // stable references so consumers don't rerender unnecessarily
  const stateValue = React.useMemo(() => state, [state]);
  return (
    <StateCtx.Provider value={stateValue}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useCart() {
  const s = React.useContext(StateCtx);
  if (s === null) throw new Error("useCart must be inside CartProvider");
  return s;
}
export function useCartDispatch() {
  const d = React.useContext(DispatchCtx);
  if (!d) throw new Error("useCartDispatch must be inside CartProvider");
  return d;
}

// Usage:
// const { items } = useCart();
// const dispatch = useCartDispatch();
// dispatch({ type: "add", item });
`}
                </Styled.Pre>
                <Styled.Small>
                    Splitting <b>state</b> and <b>dispatch</b> contexts reduces re-renders: components that only
                    dispatch won't re-render when state changes.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Pitfalls with Context */}
            <Styled.Section>
                <Styled.H2>Context Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Putting large, fast-changing objects in a single context → causes widespread re-renders.</li>
                    <li>Computing heavy <em>derived values</em> inside the Provider value → recalculates for every change.</li>
                    <li>Using one “mega context” for everything → hard to maintain; split by concern.</li>
                    <li>Needing granular subscriptions/selectors → plain Context can't subscribe to <em>parts</em> of a value.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) What a Store adds (by library) */}
            <Styled.Section>
                <Styled.H2>What a Store Adds (Quick Tour)</Styled.H2>
                <Styled.List>
                    <li><b>Redux Toolkit (RTK):</b> opinionated Redux with <i>slices</i>, immutable updates, middleware, DevTools, and RTK Query for server cache.</li>
                    <li><b>Zustand:</b> tiny store with <i>selectors</i>, <i>shallow</i> comparison, minimal boilerplate, and easy persistence.</li>
                    <li><b>Jotai:</b> state as small <i>atoms</i>; components subscribe to only the atoms they use (fine-grained updates).</li>
                    <li><b>Recoil:</b> atoms + selectors with a dependency graph; good for complex derivations across branches.</li>
                    <li><b>XState:</b> finite state machines/statecharts; explicit <i>states</i>, <i>events</i>, and <i>transitions</i> for complex flows.</li>
                    <li><b>RTK Query:</b> data fetching/cache layer; auto deduping, invalidation, retries (pairs well with RTK stores).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Context vs Store: Decision Guide */}
            <Styled.Section>
                <Styled.H2>Decision Guide</Styled.H2>
                <Styled.List>
                    <li><b>Use Context</b> for theme, locale, user, feature flags, router objects, and other low-frequency shared values.</li>
                    <li><b>Use a Store</b> when many components read small slices, updates are frequent, or you need selectors/devtools/middleware.</li>
                    <li><b>Mix</b>: Context can provide the <i>store instance</i> (e.g., RTK store) while components subscribe via library hooks.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> memoize Provider values with <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Do</b> split contexts by concern or split state/dispatch to reduce re-renders.</li>
                    <li><b>Do</b> compute heavy derivations in consumers or memoize them.</li>
                    <li><b>Don't</b> use Context as a <i>global event bus</i> or for extremely dynamic state.</li>
                    <li><b>Don't</b> create a single app-wide “god context.”</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Mini examples: Store tastes */}
            <Styled.Section>
                <Styled.H2>Mini Peeks (Store Flavors)</Styled.H2>
                <Styled.Pre>
                    {`// Redux Toolkit (slice)
import { createSlice, configureStore } from "@reduxjs/toolkit";
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    add: (s, a) => { s.items.push(a.payload); }, // Immer lets us "mutate" immutably
    remove: (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); },
  },
});
export const { add, remove } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// Zustand (selector-based)
import { create } from "zustand";
export const useCartStore = create(set => ({
  items: [],
  add: (item) => set(s => ({ items: [...s.items, item] })),
  remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
}));
// const items = useCartStore(s => s.items);

// Jotai (atoms)
import { atom, useAtom } from "jotai";
export const itemsAtom = atom([]);
export function useItems() {
  const [items, setItems] = useAtom(itemsAtom);
  return { items, add: (it) => setItems(a => [...a, it]) };
}
`}
                </Styled.Pre>
                <Styled.Small>
                    These libraries minimize re-renders by subscribing to slices (selectors/atoms) instead of a whole context value.
                </Styled.Small>
            </Styled.Section>

            <Styled.Callout>
                Summary: Context is for <b>sharing</b> values across the tree; stores are for <b>managing</b> complex,
                frequently-changing state with performance and tooling. Start with Context for simple needs; move to a
                store as complexity and update frequency grow.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ContextVsStore;
