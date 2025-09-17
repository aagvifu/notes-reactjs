import React from "react";
import { Styled } from "./styled";

const CustomHooks = () => {
    return (
        <Styled.Page>
            <Styled.Title>Custom Hooks</Styled.Title>
            <Styled.Lead>
                Custom hooks encapsulate reusable stateful logic. They are plain functions that <b>start with “use”</b>,
                call other hooks, and return values/functions to consumers. They do not render UI.
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>Definition & purpose</Styled.H2>
                <Styled.List>
                    <li><b>Custom hook:</b> a function like <Styled.InlineCode>useSomething(...)</Styled.InlineCode> that composes built-in hooks to solve a repeatable problem.</li>
                    <li><b>Goal:</b> hide implementation details, keep components small, share logic across multiple places.</li>
                    <li><b>No UI:</b> custom hooks return data and callbacks; components decide how to render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Conventions */}
            <Styled.Section>
                <Styled.H2>Naming & API conventions</Styled.H2>
                <Styled.List>
                    <li>Prefix with <b>use</b> (required so lints can verify Rules of Hooks).</li>
                    <li><b>Inputs:</b> prefer a single <em>options object</em> when parameters may grow; use positional args for essential values.</li>
                    <li><b>Outputs:</b> return a tuple <Styled.InlineCode>[value, actions]</Styled.InlineCode> or an object with named fields. Keep shapes stable.</li>
                    <li><b>Stability:</b> memoize returned objects/functions that are intended to be stable across renders.</li>
                    <li>Document side effects, cleanup behavior, and when the hook re-runs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Rules of Hooks still apply */}
            <Styled.Section>
                <Styled.H2>Rules of Hooks (still apply)</Styled.H2>
                <Styled.List>
                    <li>Call hooks at the top level of the custom hook (no loops/conditions).</li>
                    <li>Keep the order of hooks consistent between renders.</li>
                    <li>Custom hooks can call other custom hooks freely.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: useToggle */}
            <Styled.Section>
                <Styled.H2>Example: <code>useToggle</code></Styled.H2>
                <Styled.Pre>
                    {`export function useToggle(initial = false) {
  const [on, setOn] = React.useState(!!initial);
  const toggle = React.useCallback(() => setOn(v => !v), []);
  const setTrue = React.useCallback(() => setOn(true), []);
  const setFalse = React.useCallback(() => setOn(false), []);
  return [on, { toggle, setTrue, setFalse }] as const;
}`}
                </Styled.Pre>
                <Styled.Small>Returns a boolean plus stable actions. Tuple form is ergonomic in components.</Styled.Small>
            </Styled.Section>

            {/* 5) Example: useCounter */}
            <Styled.Section>
                <Styled.H2>Example: <code>useCounter</code> (clamped, step)</Styled.H2>
                <Styled.Pre>
                    {`export function useCounter(opts = {}) {
  const { initial = 0, step = 1, min = -Infinity, max = Infinity } = opts;
  const [count, setCount] = React.useState(initial);
  const clamp = React.useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  const inc = React.useCallback(() => setCount(c => clamp(c + step)), [step, clamp]);
  const dec = React.useCallback(() => setCount(c => clamp(c - step)), [step, clamp]);
  const set = React.useCallback((n) => setCount(() => clamp(n)), [clamp]);
  const reset = React.useCallback(() => setCount(initial), [initial]);

  return { count, inc, dec, set, reset };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Example: useLocalStorage */}
            <Styled.Section>
                <Styled.H2>Example: <code>useLocalStorage</code> (SSR-safe)</Styled.H2>
                <Styled.Pre>
                    {`export function useLocalStorage(key, initialValue) {
  const isBrowser = typeof window !== "undefined";

  const [value, setValue] = React.useState(() => {
    if (!isBrowser) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Persist when key or value changes
  React.useEffect(() => {
    if (!isBrowser) return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* storage may be full/blocked */ }
  }, [key, value, isBrowser]);

  // Respond to key changes from other tabs
  React.useEffect(() => {
    if (!isBrowser) return;
    const onStorage = (e) => {
      if (e.key === key) {
        try { setValue(e.newValue != null ? JSON.parse(e.newValue) : initialValue); }
        catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue, isBrowser]);

  return [value, setValue];
}`}
                </Styled.Pre>
                <Styled.Small>Guards for SSR and cross-tab sync. Handles JSON parsing safely.</Styled.Small>
            </Styled.Section>

            {/* 7) Example: useEvent (stable callback to latest handler) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useEvent</code> (stable callback, no stale closure)</Styled.H2>
                <Styled.Pre>
                    {`export function useEvent(fn) {
  const ref = React.useRef(fn);
  React.useLayoutEffect(() => { ref.current = fn; });
  return React.useCallback((...args) => ref.current?.(...args), []);
}

// Usage:
// const onClick = useEvent((id) => { /* always latest logic */ });`}
                </Styled.Pre>
                <Styled.Small>Returns a stable function reference that calls the latest implementation.</Styled.Small>
            </Styled.Section>

            {/* 8) Example: useAsync (fetch helper with status) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useAsync</code> (status + cancellation)</Styled.H2>
                <Styled.Pre>
                    {`export function useAsync(asyncFn, deps = []) {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    asyncFn()
      .then((data) => !cancelled && setState({ status: "success", data, error: null }))
      .catch((error) => !cancelled && setState({ status: "error", data: null, error }));

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state; // { status, data, error }
}

// Usage:
// const { status, data, error } = useAsync(() => fetch('/api').then(r => r.json()), [url]);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Example: useOnClickOutside */}
            <Styled.Section>
                <Styled.H2>Example: <code>useOnClickOutside</code></Styled.H2>
                <Styled.Pre>
                    {`export function useOnClickOutside(ref, handler) {
  const latest = useEvent(handler);
  React.useEffect(() => {
    function onDown(e) {
      const el = ref?.current;
      if (!el || el.contains(e.target)) return;
      latest(e);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [ref, latest]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Example: useDebouncedValue */}
            <Styled.Section>
                <Styled.H2>Example: <code>useDebouncedValue</code></Styled.H2>
                <Styled.Pre>
                    {`export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Example: useElementSize (ResizeObserver) */}
            <Styled.Section>
                <Styled.H2>Example: <code>useElementSize</code> (ResizeObserver)</Styled.H2>
                <Styled.Pre>
                    {`export function useElementSize(ref) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const el = ref?.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size; // { width, height }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) Composition example */}
            <Styled.Section>
                <Styled.H2>Composing hooks</Styled.H2>
                <Styled.Pre>
                    {`function useSearch(items) {
  const [input, setInput] = React.useState("");
  const debounced = useDebouncedValue(input, 150);
  const result = React.useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter(it => it.name.toLowerCase().includes(q));
  }, [items, debounced]);
  return { input, setInput, result };
}`}
                </Styled.Pre>
                <Styled.Small>Custom hooks can call other custom hooks to layer behavior.</Styled.Small>
            </Styled.Section>

            {/* 13) Patterns: stability & deps */}
            <Styled.Section>
                <Styled.H2>Patterns: stability & dependencies</Styled.H2>
                <Styled.List>
                    <li>Return functions via <Styled.InlineCode>useCallback</Styled.InlineCode> so consumers and effects can depend on them safely.</li>
                    <li>Return objects via <Styled.InlineCode>useMemo</Styled.InlineCode> when identity stability matters.</li>
                    <li>Expose a minimal API; avoid leaking internal refs or DOM nodes unless intentional.</li>
                </Styled.List>
            </Styled.Section>

            {/* 14) Testing notes */}
            <Styled.Section>
                <Styled.H2>Testing custom hooks</Styled.H2>
                <Styled.List>
                    <li>Test as pure logic with <Styled.InlineCode>@testing-library/react</Styled.InlineCode>’s <Styled.InlineCode>renderHook</Styled.InlineCode> or by using a tiny test component.</li>
                    <li>Mock timers/network for hooks that debounce or fetch.</li>
                    <li>Assert <em>observable outputs</em> (returned values, called callbacks), not implementation details.</li>
                </Styled.List>
            </Styled.Section>

            {/* 15) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Calling hooks conditionally inside the custom hook (breaks Rules of Hooks).</li>
                    <li>Returning a new object every render when consumers depend on reference equality (memoize when needed).</li>
                    <li>Forgetting to clean up listeners/timers opened by the hook.</li>
                    <li>Encoding rendering/UI inside the hook; keep hooks UI-agnostic.</li>
                    <li>Hiding synchronous errors—bubble errors or return them explicitly (as in <Styled.InlineCode>useAsync</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 16) Index & exports */}
            <Styled.Section>
                <Styled.H2>Index & exports</Styled.H2>
                <Styled.Pre>
                    {`// src/hooks/index.js
export * from "./useToggle";
export * from "./useCounter";
export * from "./useLocalStorage";
export * from "./useEvent";
export * from "./useAsync";
export * from "./useOnClickOutside";
export * from "./useDebouncedValue";
export * from "./useElementSize";`}
                </Styled.Pre>
                <Styled.Small>Re-export for convenient imports and consistent APIs.</Styled.Small>
            </Styled.Section>

            <Styled.Callout>
                Summary: custom hooks package stateful logic with clean, stable APIs. Keep the Rules of Hooks,
                design predictable inputs/outputs, memoize where identity matters, and document effects and cleanup.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CustomHooks;
