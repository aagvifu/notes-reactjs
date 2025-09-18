import { Styled } from "./styled";

const Zustand = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand (Global State Management)</Styled.Title>

            <Styled.Lead>
                <b>Zustand</b> (German for "state") is a tiny, unopinionated state-management library for React.
                It exposes a <b>store</b> (an object that holds your global state and actions) and a hook to
                read/select parts of that state. It avoids boilerplate and re-renders only the components that
                select changed data.
            </Styled.Lead>

            {/* 0) Why/When */}
            <Styled.Section>
                <Styled.H2>Why &amp; When to use Zustand</Styled.H2>
                <Styled.List>
                    <li><b>Simple API:</b> one <Styled.InlineCode>create</Styled.InlineCode> call defines state + actions.</li>
                    <li><b>Selective subscriptions:</b> components subscribe to <i>just</i> what they need via selectors.</li>
                    <li><b>No Provider needed:</b> you can import the store hook anywhere without wrapping trees.</li>
                    <li><b>Scales up:</b> add slices, middleware (devtools, persistence, immer) as your app grows.</li>
                    <li><b>Use it when</b> Context gets chatty/complex, or you want a lighter alternative to Redux.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Core concepts (Definitions) */}
            <Styled.Section>
                <Styled.H2>Core Concepts &amp; Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Store:</b> the source of truth created by Zustand; it holds state and actions.</li>
                    <li><b>Action:</b> a function in the store that updates state (usually calls <Styled.InlineCode>set</Styled.InlineCode>).</li>
                    <li><b>Selector:</b> a function that picks a <i>slice</i> of state to subscribe to, e.g. <Styled.InlineCode>(s) =&gt; s.count</Styled.InlineCode>.</li>
                    <li><b>Shallow compare:</b> an equality check that compares top-level fields of an object to reduce re-renders.</li>
                    <li><b>Middleware:</b> pluggable features (e.g., <Styled.InlineCode>persist</Styled.InlineCode>, <Styled.InlineCode>devtools</Styled.InlineCode>, <Styled.InlineCode>immer</Styled.InlineCode>, <Styled.InlineCode>subscribeWithSelector</Styled.InlineCode>).</li>
                    <li><b>Slice:</b> a modular piece of store state + actions; you can merge multiple slices.</li>
                    <li><b>Vanilla store:</b> a store that works outside React (useful for non-React code/tests); you can bind it to React later.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Install */}
            <Styled.Section>
                <Styled.H2>Installation</Styled.H2>
                <Styled.Pre>
                    {`# with npm
npm i zustand

# with pnpm / yarn
pnpm add zustand
yarn add zustand`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Smallest possible store */}
            <Styled.Section>
                <Styled.H2>Smallest Possible Store</Styled.H2>
                <Styled.Pre>
                    {`// store/counter.js
import { create } from "zustand";

export const useCounterStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  dec: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Component usage:
function Counter() {
  const count = useCounterStore((s) => s.count);        // selector
  const inc = useCounterStore((s) => s.inc);
  return <button onClick={inc}>Count: {count}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Only components that use <Styled.InlineCode>count</Styled.InlineCode> re-render when
                    <Styled.InlineCode>count</Styled.InlineCode> changes.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Selecting multiple fields (and shallow) */}
            <Styled.Section>
                <Styled.H2>Select Multiple Fields Efficiently</Styled.H2>
                <Styled.List>
                    <li>Selectors returning objects create a new object on each render; use <b>shallow</b> compare to avoid extra renders.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useCounterStore } from "./store/counter";
import { shallow } from "zustand/shallow";

function Stats() {
  const { count, hasMore } = useCounterStore(
    (s) => ({ count: s.count, hasMore: s.count < 10 }),
    shallow
  );
  return <div>{count} {hasMore ? "(room to grow)" : "(maxed)"}</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Async actions */}
            <Styled.Section>
                <Styled.H2>Async Actions (Fetching data)</Styled.H2>
                <Styled.Pre>
                    {`// store/todos.js
import { create } from "zustand";

export const useTodosStore = create((set, get) => ({
  todos: [],
  status: "idle", // "idle" | "loading" | "error" | "success"
  error: null,

  fetchTodos: async () => {
    set({ status: "loading", error: null });
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      set({ todos: data, status: "success" });
    } catch (err) {
      set({ error: String(err), status: "error" });
    }
  },
}));`}
                </Styled.Pre>
                <Styled.Small>
                    Actions can be synchronous or asynchronous. You can read current state via <Styled.InlineCode>get()</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Slices (modular store) */}
            <Styled.Section>
                <Styled.H2>Organizing with Slices</Styled.H2>
                <Styled.Pre>
                    {`// store/index.js
import { create } from "zustand";

// slice creators receive (set, get, api)
const createCounterSlice = (set, get) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
});

const createUserSlice = (set, get) => ({
  user: null,
  setUser: (u) => set({ user: u }),
});

export const useStore = create((...args) => ({
  ...createCounterSlice(...args),
  ...createUserSlice(...args),
}));`}
                </Styled.Pre>
                <Styled.Small>
                    Slices keep logic focused and scalable. Add more slices as features grow.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Middleware: devtools, persist, immer */}
            <Styled.Section>
                <Styled.H2>Middleware: Devtools, Persistence, Immer</Styled.H2>
                <Styled.Pre>
                    {`// store/app.js
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer"; // optional

export const useAppStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        theme: "dark",
        user: null,
        setTheme: (t) => set({ theme: t }),
        updateUserName: (name) =>
          set((s) => { s.user ??= {}; s.user.name = name; }), // with immer you can "mutate"
      })),
      {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage),
        // partialize: (s) => ({ theme: s.theme }), // persist only some fields
      }
    )
  )
);`}
                </Styled.Pre>
                <Styled.Small>
                    <b>devtools:</b> inspect actions/state in Redux DevTools. <b>persist:</b> save to storage.
                    <b>immer:</b> write immutable updates using "mutating" syntax.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Vanilla store (outside React) */}
            <Styled.Section>
                <Styled.H2>Vanilla Store (Outside React)</Styled.H2>
                <Styled.Pre>
                    {`// store/vanilla.js
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export const counterStore = createStore((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

// Bind vanilla store to a React hook:
export const useCounter = useStore(counterStore);`}
                </Styled.Pre>
                <Styled.Small>Useful for tests, non-React code, or integrating with other frameworks.</Styled.Small>
            </Styled.Section>

            {/* 9) Patterns & Best Practices */}
            <Styled.Section>
                <Styled.H2>Patterns &amp; Best Practices</Styled.H2>
                <Styled.List>
                    <li><b>Keep actions in the store:</b> define update logic once; reuse everywhere.</li>
                    <li><b>Use fine-grained selectors:</b> subscribe to the smallest slice you need to minimize re-renders.</li>
                    <li><b>Memoize derived values in selectors:</b> compute simple derived data inline, but for heavy work, memoize in the store or components.</li>
                    <li><b>Shallow compare object selections:</b> use <Styled.InlineCode>shallow</Styled.InlineCode> when selecting multiple fields.</li>
                    <li><b>Persist intentionally:</b> whitelist fields via <Styled.InlineCode>partialize</Styled.InlineCode>; handle migrations when schema changes.</li>
                    <li><b>Testing:</b> import the store, call <Styled.InlineCode>setState</Styled.InlineCode>/<Styled.InlineCode>getState</Styled.InlineCode>, and assert outputs. For React behavior, render a small component using the hook.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls (and fixes)</Styled.H2>
                <Styled.List>
                    <li><b>Selecting the whole state:</b> causes frequent re-renders. <i>Fix:</i> select only needed fields.</li>
                    <li><b>Returning new objects each render:</b> use <Styled.InlineCode>shallow</Styled.InlineCode> or split into multiple selectors.</li>
                    <li><b>Persisting everything by default:</b> can bloat storage. <i>Fix:</i> persist only what you need.</li>
                    <li><b>SSR hydration mismatch:</b> when using persistence. <i>Fix:</i> gate rendering until hydration finishes or load initial state carefully.</li>
                    <li><b>Overusing global state:</b> keep local UI state in components; lift to global only when shared or cross-page.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Context vs Zustand vs Redux Toolkit (one-liners) */}
            <Styled.Section>
                <Styled.H2>Context vs Zustand vs Redux Toolkit (Quick View)</Styled.H2>
                <Styled.List>
                    <li><b>Context:</b> great for static-ish values; not optimized for high-frequency updates.</li>
                    <li><b>Zustand:</b> minimal API, selective subscriptions, easy to scale with middleware/slices.</li>
                    <li><b>Redux Toolkit:</b> batteries-included patterns, strong tooling, more structure/boilerplate than Zustand.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>set:</b> Zustand’s function to update state; can take an object or recipe function (<Styled.InlineCode>(s) =&gt; ({`...`}))</Styled.InlineCode>.</li>
                    <li><b>get:</b> reads current state inside actions (<Styled.InlineCode>get().user</Styled.InlineCode>).</li>
                    <li><b>subscribe:</b> low-level API to listen for state changes (useful outside components).</li>
                    <li><b>derived state:</b> values computed from existing state, not stored independently.</li>
                    <li><b>optimistic update:</b> update UI first, reconcile with server response later.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Zustand is a lightweight, pragmatic way to manage global state. Start small
                (single store + actions), select narrowly for performance, and add middleware (devtools,
                persist, immer) as needed. Use slices to scale and keep domain logic clean.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Zustand;
