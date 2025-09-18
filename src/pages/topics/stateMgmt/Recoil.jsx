import { Styled } from "./styled";

const Recoil = () => {
    return (
        <Styled.Page>
            <Styled.Title>Recoil (State Management)</Styled.Title>

            <Styled.Lead>
                <b>Recoil</b> is a lightweight state-management library for React. It models app state as
                small, composable units called <b>atoms</b> and computes derived values with <b>selectors</b>.
                It integrates with React via hooks and a top-level <Styled.InlineCode>&lt;RecoilRoot /&gt;</Styled.InlineCode>.
            </Styled.Lead>

            {/* 0) Why Recoil */}
            <Styled.Section>
                <Styled.H2>Why Recoil?</Styled.H2>
                <Styled.List>
                    <li><b>Simple mental model:</b> atoms are pieces of state; selectors are pure functions derived from atoms.</li>
                    <li><b>Granular updates:</b> only components that use a specific atom/selector re-render when it changes.</li>
                    <li><b>Async built-in:</b> selectors can be <i>async</i> and work with Suspense or loadables.</li>
                    <li><b>Co-located and scalable:</b> define atoms/selectors near features, grow as your app grows.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (Plain English)</Styled.H2>
                <Styled.List>
                    <li><b>Global state:</b> data shared by multiple components (e.g., auth user, theme, cart).</li>
                    <li><b>Local state:</b> data owned by one component via <Styled.InlineCode>useState</Styled.InlineCode>.</li>
                    <li><b>Atom:</b> a named, subscribable unit of state. Components read/write atoms.</li>
                    <li><b>Selector:</b> a pure function that derives state from atoms/selectors. Can be async.</li>
                    <li><b>RecoilRoot:</b> React provider that enables Recoil in your component tree.</li>
                    <li><b>Hooks:</b> <Styled.InlineCode>useRecoilState</Styled.InlineCode>, <Styled.InlineCode>useRecoilValue</Styled.InlineCode>, <Styled.InlineCode>useSetRecoilState</Styled.InlineCode>, <Styled.InlineCode>useResetRecoilState</Styled.InlineCode>, <Styled.InlineCode>useRecoilValueLoadable</Styled.InlineCode>.</li>
                    <li><b>Loadable:</b> an object wrapper for async selector state: <i>hasValue / loading / hasError</i>.</li>
                    <li><b>Families:</b> <Styled.InlineCode>atomFamily</Styled.InlineCode> / <Styled.InlineCode>selectorFamily</Styled.InlineCode> generate parameterized atoms/selectors (e.g., per id).</li>
                    <li><b>Atom effects:</b> lifecycle hooks for an atom (initialize, persist, react to changes).</li>
                    <li><b>Transaction:</b> an atomic read/write batch via <Styled.InlineCode>useRecoilCallback</Styled.InlineCode>.</li>
                    <li><b>Derived state:</b> data computed from other state (e.g., totals, filters).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Install & setup */}
            <Styled.Section>
                <Styled.H2>Install &amp; Setup</Styled.H2>
                <Styled.Pre>
                    {`# Install
npm i recoil

// index.jsx
import { RecoilRoot } from "recoil";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);`}
                </Styled.Pre>
                <Styled.Small>
                    All Recoil hooks must be used under <Styled.InlineCode>&lt;RecoilRoot/&gt;</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) First atom + selector */}
            <Styled.Section>
                <Styled.H2>Atoms &amp; Selectors (First Example)</Styled.H2>
                <Styled.Pre>
                    {`// state/counter.js
import { atom, selector } from "recoil";

export const counterState = atom({
  key: "counterState",       // unique key in the whole app
  default: 0,                // initial value
});

export const doubleCountState = selector({
  key: "doubleCountState",
  get: ({ get }) => get(counterState) * 2,  // derived state
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Counter.jsx
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { counterState, doubleCountState } from "./state/counter";

export default function Counter() {
  const [count, setCount] = useRecoilState(counterState);
  const double = useRecoilValue(doubleCountState);

  return (
    <div>
      <p>Count: {count} | Double: {double}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Atom</b> is the source of truth. <b>Selector</b> derives values. Only components using these nodes re-render when they change.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Reading vs writing */}
            <Styled.Section>
                <Styled.H2>Reading vs Writing Hooks</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>useRecoilValue(node)</Styled.InlineCode> → read only.</li>
                    <li><Styled.InlineCode>useSetRecoilState(atom)</Styled.InlineCode> → write only.</li>
                    <li><Styled.InlineCode>useRecoilState(atom)</Styled.InlineCode> → read + write tuple.</li>
                    <li><Styled.InlineCode>useResetRecoilState(atom)</Styled.InlineCode> → reset to default.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ReadWriteExample() {
  const value = useRecoilValue(counterState);
  const set = useSetRecoilState(counterState);
  const reset = useResetRecoilState(counterState);
  return (
    <>
      <p>Value: {value}</p>
      <button onClick={() => set(v => v + 10)}>+10</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Async selectors */}
            <Styled.Section>
                <Styled.H2>Async Selectors</Styled.H2>
                <Styled.List>
                    <li><b>What:</b> a selector whose <Styled.InlineCode>get</Styled.InlineCode> returns a Promise.</li>
                    <li><b>How it renders:</b> with Suspense → fallback UI during loading; or use a <b>Loadable</b> to avoid Suspense.</li>
                    <li><b>Cache-aware:</b> caches by dependencies; re-fetches when deps change or cache invalidates.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// state/user.js
import { atom, selector } from "recoil";

export const userIdState = atom({
  key: "userIdState",
  default: 1,
});

export const userQuery = selector({
  key: "userQuery",
  get: async ({ get }) => {
    const id = get(userIdState);
    const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
    if (!res.ok) throw new Error("Network error");
    return res.json();
  },
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Using Suspense
function UserCard() {
  const user = useRecoilValue(userQuery); // Suspends while loading
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

// App subtree
<Suspense fallback={<div>Loading user…</div>}>
  <UserCard />
</Suspense>`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Without Suspense: Loadable API
import { useRecoilValueLoadable } from "recoil";

function UserCardNoSuspense() {
  const loadable = useRecoilValueLoadable(userQuery);
  if (loadable.state === "loading") return <p>Loading…</p>;
  if (loadable.state === "hasError") return <p>Error: {String(loadable.contents)}</p>;
  return <pre>{JSON.stringify(loadable.contents, null, 2)}</pre>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Families */}
            <Styled.Section>
                <Styled.H2>Families (Parameterized State)</Styled.H2>
                <Styled.List>
                    <li><b>atomFamily:</b> creates a set of atoms keyed by a parameter (e.g., <i>todo by id</i>).</li>
                    <li><b>selectorFamily:</b> creates parameterized selectors that derive per-key values.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { atomFamily, selectorFamily, useRecoilState } from "recoil";

const todoState = atomFamily({
  key: "todoState",
  default: (id) => ({ id, title: "", done: false }),
});

const todoTitleLen = selectorFamily({
  key: "todoTitleLen",
  get: (id) => ({ get }) => get(todoState(id)).title.length,
});

function TodoItem({ id }) {
  const [todo, setTodo] = useRecoilState(todoState(id));
  return (
    <div>
      <input
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <span>Length: <b>{useRecoilValue(todoTitleLen(id))}</b></span>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Persistence with atom effects */}
            <Styled.Section>
                <Styled.H2>Persistence (localStorage) via Atom Effects</Styled.H2>
                <Styled.List>
                    <li><b>Atom effect:</b> a function to initialize and subscribe to an atom's lifecycle.</li>
                    <li><b>Common use:</b> hydrate from storage and persist on change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { atom } from "recoil";

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(key);
    if (saved != null) setSelf(JSON.parse(saved));
    onSet((newValue) => {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    });
  }
};

export const themeState = atom({
  key: "themeState",
  default: "dark",
  effects: [localStorageEffect("themeState")],
});`}
                </Styled.Pre>
                <Styled.Small>
                    Effects run once on mount for each atom instance. Avoid side-effects inside selectors; use <b>atom effects</b> instead.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Transactions & batching */}
            <Styled.Section>
                <Styled.H2>Transactions (Advanced)</Styled.H2>
                <Styled.List>
                    <li><b>useRecoilCallback:</b> read/write multiple atoms/selectors in a single batched callback.</li>
                    <li><b>Why:</b> keep complex updates consistent and avoid intermediate renders.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useRecoilCallback } from "recoil";
import { counterState } from "./state/counter";

function BulkActions() {
  const addTen = useRecoilCallback(({ set, snapshot }) => async () => {
    const current = await snapshot.getPromise(counterState);
    set(counterState, current + 10);
  }, []);
  return <button onClick={addTen}>+10 (transaction)</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> give every atom/selector a globally unique <Styled.InlineCode>key</Styled.InlineCode> (prefix by feature).</li>
                    <li><b>Do</b> keep selectors <i>pure</i> (no side-effects). Use async <Styled.InlineCode>get</Styled.InlineCode> for fetching.</li>
                    <li><b>Do</b> colocate atoms/selectors with the feature using them (modular design).</li>
                    <li><b>Don't</b> mutate objects in place; create new objects (immutability helps predictable updates).</li>
                    <li><b>Don't</b> over-centralize—Recoil is great for <i>shared</i> state; use <Styled.InlineCode>useState</Styled.InlineCode> for truly local concerns.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li><b>“Invalid hook call / missing RecoilRoot”:</b> Wrap your tree with <Styled.InlineCode>&lt;RecoilRoot/&gt;</Styled.InlineCode>.</li>
                    <li><b>Duplicate key error:</b> Keys must be unique. Use clear feature-based prefixes (e.g., <i>cart/…</i>).</li>
                    <li><b>Infinite loops:</b> Avoid setting an atom within a selector computed from that atom.</li>
                    <li><b>Async stall:</b> Handle loading/errors via Suspense or <Styled.InlineCode>useRecoilValueLoadable</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Start with atoms for sources of truth, compute with selectors, initialize under
                <Styled.InlineCode> &nbsp;&lt;RecoilRoot/&gt; </Styled.InlineCode>, and persist with atom effects when needed.
                Prefer small, focused atoms and pure selectors for a clear and scalable model.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Recoil;
