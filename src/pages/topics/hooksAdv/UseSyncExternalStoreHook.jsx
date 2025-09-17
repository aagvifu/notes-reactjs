import React from "react";
import { Styled } from "./styled";

const UseSyncExternalStoreHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useSyncExternalStore</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useSyncExternalStore</Styled.InlineCode> connects React to an <b>external store</b>
                (anything that lives outside React: singleton state, browser APIs, Redux/Zustand stores, WebSocket caches).
                It provides <b>concurrent-safe</b> subscriptions and snapshot reads to avoid tearing.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const value = useSyncExternalStore(
  subscribe,          // (listener) => unsubscribe
  getSnapshot,        // () => current value (client)
  getServerSnapshot?  // () => value for SSR hydration (optional)
);`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>subscribe(listener)</b>: registers a callback and returns an <em>unsubscribe</em> function.</li>
                    <li><b>getSnapshot()</b>: returns the store’s current value. React uses <Styled.InlineCode>Object.is</Styled.InlineCode> to decide re-renders.</li>
                    <li><b>getServerSnapshot()</b>: value used during SSR so hydration matches the client’s first snapshot.</li>
                    <li><b>Tearing</b>: different components rendering from different store versions; this hook prevents it.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal store (vanilla) */}
            <Styled.Section>
                <Styled.H2>Minimal external store (vanilla JS)</Styled.H2>
                <Styled.Pre>
                    {`// counterStore.js (outside React)
const listeners = new Set();
let state = { count: 0 };

export const counterStore = {
  getState: () => state,
  setState(patch) {
    state = { ...state, ...patch }; // immutable update
    listeners.forEach(l => l());
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  }
};

// Component using the store
import { useSyncExternalStore } from "react";
import { counterStore } from "./counterStore";

function CounterView() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    () => counterStore.getState().count, // return a primitive → stable equality checks
    () => 0 // SSR fallback
  );

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => counterStore.setState({ count: count + 1 })}>+1</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Equality note:</b> returning a <em>primitive</em> (number/boolean/string) or the <em>same object reference</em> when unchanged keeps renders efficient.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Avoiding re-renders: stable snapshots */}
            <Styled.Section>
                <Styled.H2>Stable snapshots (avoid unnecessary re-renders)</Styled.H2>
                <Styled.List>
                    <li>If <Styled.InlineCode>getSnapshot()</Styled.InlineCode> returns a <b>new object</b> every time, React will re-render on each store ping.</li>
                    <li>Return primitives or memoized objects; React compares with <Styled.InlineCode>Object.is</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Returns a new object → re-renders each change even if the slice is the same
() => ({ count: counterStore.getState().count })

// ✅ Return primitive/same object
() => counterStore.getState().count

// ✅ Memoize a slice (simple cache)
function selectCountSnapshot() {
  let prevState, prevSel;
  return () => {
    const s = counterStore.getState();
    if (s === prevState) return prevSel;
    prevState = s;
    prevSel = s.count; // if selecting object, memoize shallow-equal result
    return prevSel;
  };
}
const getCount = selectCountSnapshot();
useSyncExternalStore(counterStore.subscribe, getCount);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Browser APIs as stores */}
            <Styled.Section>
                <Styled.H2>Browser APIs as “stores”</Styled.H2>
                <Styled.Pre>
                    {`// Online/offline status
function useOnline() {
  const subscribe = React.useCallback((notify) => {
    window.addEventListener("online", notify);
    window.addEventListener("offline", notify);
    return () => {
      window.removeEventListener("online", notify);
      window.removeEventListener("offline", notify);
    };
  }, []);

  const getSnapshot = React.useCallback(
    () => navigator.onLine, // boolean primitive
    []
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, () => true);
}

// Media query
function useMediaQuery(query) {
  const subscribe = React.useCallback((notify) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", notify);
    return () => mql.removeEventListener("change", notify);
  }, [query]);

  const getSnapshot = React.useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}`}
                </Styled.Pre>
                <Styled.Small>
                    Return booleans for stable equality; server fallbacks ensure hydration safety.
                </Styled.Small>
            </Styled.Section>

            {/* 5) With selectors (utility) */}
            <Styled.Section>
                <Styled.H2>Selector utility (read a slice)</Styled.H2>
                <Styled.Pre>
                    {`// Generic selector hook
function useStoreSelector(store, selector, getServerSnapshot) {
  // Cache selected value; return previous reference if equal
  let lastSnap, lastSel;
  const getSnapshot = () => {
    const snap = store.getState();
    if (snap === lastSnap) return lastSel;
    const nextSel = selector(snap);
    lastSnap = snap;
    // If equal to previous (Object.is), return old ref to keep memoized children stable
    if (lastSel !== undefined && Object.is(nextSel, lastSel)) return lastSel;
    lastSel = nextSel;
    return nextSel;
  };
  return React.useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getServerSnapshot ? () => selector(getServerSnapshot()) : undefined
  );
}

// Usage
const count = useStoreSelector(counterStore, s => s.count);`}
                </Styled.Pre>
                <Styled.Small>
                    For full-featured selector semantics (with custom equality), consider a dedicated state library. This simple cache illustrates the idea.
                </Styled.Small>
            </Styled.Section>

            {/* 6) SSR & hydration */}
            <Styled.Section>
                <Styled.H2>SSR & hydration</Styled.H2>
                <Styled.List>
                    <li>Provide <Styled.InlineCode>getServerSnapshot</Styled.InlineCode> so the server’s value matches the client’s first value.</li>
                    <li>For time-based or environment values (e.g., <em>online</em>, <em>viewport</em>), choose a safe default and revalidate on mount.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: theme store with SSR
const themeStore = {
  _theme: "light",
  listeners: new Set(),
  getState() { return this._theme; },
  setState(t) { this._theme = t; this.listeners.forEach(l => l()); },
  subscribe(l) { this.listeners.add(l); return () => this.listeners.delete(l); }
};

function useThemeSSR(initial) {
  return React.useSyncExternalStore(
    (l) => themeStore.subscribe(l),
    () => themeStore.getState(),
    () => initial // server value injected from request
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Integrating with libraries */}
            <Styled.Section>
                <Styled.H2>Integrating with state libraries</Styled.H2>
                <Styled.List>
                    <li>Modern Redux, Zustand, Jotai, etc. expose bindings that internally use <Styled.InlineCode>useSyncExternalStore</Styled.InlineCode>.</li>
                    <li>Prefer the library’s hook if available; only write custom wiring for bespoke stores.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Returning fresh objects from <Styled.InlineCode>getSnapshot</Styled.InlineCode> → unnecessary re-renders; return primitives or memoized objects.</li>
                    <li>Mutating store state in place; React won’t detect changes if the same reference is returned.</li>
                    <li>Forgetting to unsubscribe in <Styled.InlineCode>subscribe</Styled.InlineCode>; always return a cleanup function.</li>
                    <li>Using <Styled.InlineCode>useEffect</Styled.InlineCode> to read store values; it can tear under concurrency—use this hook instead.</li>
                    <li>Mismatched SSR/client snapshots causing hydration warnings; supply <Styled.InlineCode>getServerSnapshot</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep store updates immutable and notify listeners on change.</li>
                    <li><b>Do</b> return primitives or previously memoized objects from <Styled.InlineCode>getSnapshot</Styled.InlineCode>.</li>
                    <li><b>Do</b> provide <Styled.InlineCode>getServerSnapshot</Styled.InlineCode> for SSR.</li>
                    <li><b>Don’t</b> compute heavy derived data in <Styled.InlineCode>getSnapshot</Styled.InlineCode> every time; memoize inside the store or with selectors.</li>
                    <li><b>Don’t</b> rely on effects for subscription; this hook is designed for concurrent-safe reads.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useSyncExternalStore</Styled.InlineCode> is the <em>correct</em> way to read from and
                subscribe to data sources outside React. Expose <code>subscribe/getState</code> on the store, return stable snapshots,
                and provide SSR fallbacks to keep hydration consistent.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseSyncExternalStoreHook;
