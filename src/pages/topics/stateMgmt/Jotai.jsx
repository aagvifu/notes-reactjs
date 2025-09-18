import { Styled } from "./styled";

const Jotai = () => {
    return (
        <Styled.Page>
            <Styled.Title>Jotai (Atom-based State Management)</Styled.Title>

            <Styled.Lead>
                <b>Jotai</b> is a minimal state management library for React built around small, composable
                units of state called <b>atoms</b>. Components subscribe to only the atoms they use,
                enabling fine-grained updates without re-rendering whole subtrees.
            </Styled.Lead>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (precise definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Atom:</b> the smallest unit of state in Jotai. An atom can be <em>primitive</em>
                        (holds a value) or <em>derived</em> (computes from other atoms).
                    </li>
                    <li>
                        <b>Primitive atom:</b> an atom with an initial value (e.g., <Styled.InlineCode>atom(0)</Styled.InlineCode>).
                        You read/write it directly.
                    </li>
                    <li>
                        <b>Derived atom (read-only):</b> an atom defined by a function of other atoms (via <Styled.InlineCode>get</Styled.InlineCode>).
                        It has no independent storage.
                    </li>
                    <li>
                        <b>Writable derived atom:</b> a derived atom that also defines a <em>write</em> function
                        (via <Styled.InlineCode>(get, set)</Styled.InlineCode>) to update source atoms.
                    </li>
                    <li>
                        <b>Provider:</b> React context provider that creates an isolated Jotai <em>store</em>.
                        Components inside read/write atoms from that store.
                    </li>
                    <li>
                        <b>Store:</b> the internal registry of atom states for a Provider. You can create multiple
                        stores to isolate state between parts of your app or tests.
                    </li>
                    <li>
                        <b>Subscription:</b> when a component reads an atom via a hook, it subscribes to it and
                        re-renders only when that atom (or what it depends on) changes.
                    </li>
                    <li>
                        <b>Selector:</b> a read view of an atom's value (e.g., via <Styled.InlineCode>selectAtom</Styled.InlineCode>)
                        to limit re-renders to the selected slice.
                    </li>
                    <li>
                        <b>Persistence:</b> saving atom state to storage (e.g., localStorage) via helpers like
                        <Styled.InlineCode>atomWithStorage</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Atom family:</b> a function that returns atoms keyed by a parameter
                        (useful for lists or per-id state).
                    </li>
                    <li>
                        <b>Split atom:</b> turn an array atom into individual item atoms, enabling granular updates.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Quick Start */}
            <Styled.Section>
                <Styled.H2>Quick start: primitive, derived, and writable derived atoms</Styled.H2>
                <Styled.Pre>
                    {`// atoms.ts / atoms.js
import { atom } from "jotai";

// 1) Primitive atom (holds its own value)
export const countAtom = atom(0);

// 2) Derived read-only atom (computes from others)
export const doubleAtom = atom((get) => get(countAtom) * 2);

// 3) Writable derived atom (computes + updates source atoms)
export const incAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1));
export const decAtom = atom(null, (get, set) => set(countAtom, get(countAtom) - 1));`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// Counter.jsx
import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { countAtom, doubleAtom, incAtom, decAtom } from "./atoms";

export default function Counter() {
  const [count, setCount] = useAtom(countAtom);   // subscribe to countAtom
  const [double] = useAtom(doubleAtom);           // derived, read-only
  const inc = useSetAtom(incAtom);                // stable write-only hooks
  const dec = useSetAtom(decAtom);

  return (
    <div>
      <p>count: {count} | double: {double}</p>
      <button onClick={dec}>-</button>
      <button onClick={inc}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Key idea:</b> components re-render only when the atoms they read change (fine-grained updates).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Provider & multiple stores */}
            <Styled.Section>
                <Styled.H2>Provider & store isolation</Styled.H2>
                <Styled.List>
                    <li>
                        Wrap your app (or a subtree) with <Styled.InlineCode>&lt;Provider&gt;</Styled.InlineCode>{" "}
                        to create an isolated store. Each Provider has its own atom values.
                    </li>
                    <li>
                        Use multiple Providers to render independent copies (e.g., side-by-side sandboxes or tests).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import React from "react";
import { Provider } from "jotai";
import Counter from "./Counter";

export default function App() {
  return (
    <>
      <Provider><Counter /></Provider>
      <Provider><Counter /></Provider>
      {/* These two counters do NOT share state */}
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Async atoms & Suspense */}
            <Styled.Section>
                <Styled.H2>Async atoms &amp; Suspense</Styled.H2>
                <Styled.List>
                    <li>
                        If a derived atom's read function returns a <em>Promise</em>, React can suspend
                        while it resolves (use a <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> fallback).
                    </li>
                    <li>
                        For explicit status handling (idle/loading/error), use <Styled.InlineCode>loadable</Styled.InlineCode> helper.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// asyncAtoms.js
import { atom } from "jotai";

// Suspense-friendly async derived atom
export const userAtom = atom(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
});`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// UserCard.jsx
import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { userAtom } from "./asyncAtoms";

export default function UserCard() {
  const [user] = useAtom(userAtom); // will suspend while loading
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

// usage
// <Suspense fallback={<div>Loading…</div>}><UserCard /></Suspense>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Selectors (subscribing to a slice) */}
            <Styled.Section>
                <Styled.H2>Selectors: subscribe to just a slice</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>selectAtom(baseAtom, selector)</Styled.InlineCode> to derive a view
                        that only re-renders when the selected slice changes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export const cartAtom = atom([{ id: 1, price: 100 }, { id: 2, price: 250 }]);

export const totalAtom = selectAtom(cartAtom, (items) =>
  items.reduce((sum, it) => sum + it.price, 0)
);`}
                </Styled.Pre>

                <Styled.Pre>
                    {`import { useAtom } from "jotai";
import { totalAtom } from "./cart";

function CartTotal() {
  const [total] = useAtom(totalAtom); // re-renders only when total changes
  return <b>Total: ₹{total}</b>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Persistence */}
            <Styled.Section>
                <Styled.H2>Persistence (localStorage)</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>atomWithStorage(key, initial)</Styled.InlineCode> syncs an atom to
                        <em>localStorage</em> by default.
                    </li>
                    <li>
                        It's JSON-serialized. Guard for SSR (no <Styled.InlineCode>window</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage("theme", "dark");

// Usage:
import { useAtom } from "jotai";
import { themeAtom } from "./theme";

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Theme: {theme}
    </button>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Atom family & splitAtom */}
            <Styled.Section>
                <Styled.H2>Atom family &amp; splitAtom</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Atom family:</b> generate atoms on demand keyed by a parameter (e.g., item id).
                    </li>
                    <li>
                        <b>splitAtom:</b> produce one atom per item from an array atom to isolate re-renders.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { atom } from "jotai";
import { atomFamily, splitAtom } from "jotai/utils";

// Family: per-id counter
export const counterFamily = atomFamily((id) => atom(0));

// Split: array -> item atoms
export const todosAtom = atom([
  { id: 1, text: "Learn Jotai", done: false },
  { id: 2, text: "Build something", done: true },
]);

export const todoAtomsAtom = splitAtom(todosAtom); // returns atom of atoms`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Patterns, Do & Don't */}
            <Styled.Section>
                <Styled.H2>Patterns, Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep atoms small and focused (one responsibility).</li>
                    <li><b>Do</b> prefer derived atoms for computed values instead of recalculating in components.</li>
                    <li><b>Do</b> colocate atoms near features; export them via an index for discoverability.</li>
                    <li><b>Don't</b> mutate objects in place; update immutably so Jotai can detect changes.</li>
                    <li><b>Don't</b> overuse a single “global” atom; many small atoms scale better.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Jotai vs Context, Redux Toolkit, Zustand, Recoil (quick compare) */}
            <Styled.Section>
                <Styled.H2>Jotai vs others (when to choose)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Context:</b> simple but coarse; any change triggers re-renders below the Provider.
                        Jotai re-renders only subscribers to changed atoms.
                    </li>
                    <li>
                        <b>Redux Toolkit:</b> batteries-included global store with actions/reducers/devtools/middleware.
                        Choose when you need strict flows, time-travel, or enterprise patterns. Jotai is lighter.
                    </li>
                    <li>
                        <b>Zustand:</b> minimal store with selectors and immer-friendly updates; great for centralized stores.
                        Jotai encourages many small atoms and composition.
                    </li>
                    <li>
                        <b>Recoil:</b> also atom/selector-based; Jotai's core API is smaller and closer to React hooks ergonomics.
                    </li>
                    <li>
                        <b>XState:</b> statecharts for complex flows; choose when you need explicit finite states and transitions.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Testing tips */}
            <Styled.Section>
                <Styled.H2>Testing</Styled.H2>
                <Styled.List>
                    <li>Wrap components under test with a Jotai <Styled.InlineCode>Provider</Styled.InlineCode>.</li>
                    <li>Create separate stores per test for isolation; initialize atom values as needed.</li>
                    <li>Test behavior via rendered output rather than internal atom details.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Jotai manages state via small atoms and fine-grained subscriptions.
                Start with primitive atoms, derive computed state declaratively, persist when needed,
                and keep atoms focused. Reach for Jotai when you want lightweight, composable state
                without reducers or boilerplate.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Jotai;
