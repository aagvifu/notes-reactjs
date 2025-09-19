import React from "react";
import { Styled } from "./styled";

const ApiDesign = () => {
    return (
        <Styled.Page>
            <Styled.Title>API Design (Components, Hooks & Utilities)</Styled.Title>

            <Styled.Lead>
                In React apps, “API design” means shaping the way other code <b>uses</b> your components,
                hooks, and utility functions: the names, props/parameters, return values, events, and
                guarantees you provide. Good APIs are <b>consistent, predictable, explicit, minimal,</b> and <b>composable</b>.
            </Styled.Lead>

            {/* 0) Scope & definitions */}
            <Styled.Section>
                <Styled.H2>Scope & Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>API surface:</b> The public things consumers can import or use (component props, hook parameters/returns, function signatures).</li>
                    <li><b>DX (Developer Experience):</b> How easy it is to understand, discover, and use your API correctly.</li>
                    <li><b>Breaking change:</b> A change that forces consumers to modify their code (e.g., rename a prop or change a return shape).</li>
                    <li><b>Backward compatibility:</b> New versions continue to work with old consumer code (no breaks).</li>
                    <li><b>Affordance:</b> A name/shape that hints at correct usage (e.g., <Styled.InlineCode>onSelect</Styled.InlineCode> clearly expects a selection action).</li>
                    <li><b>Composability:</b> The ability to combine small APIs like Lego blocks to build larger behavior.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) First principles */}
            <Styled.Section>
                <Styled.H2>First Principles</Styled.H2>
                <Styled.List>
                    <li><b>Consistency:</b> Use the same names and shapes across your codebase (e.g., always return <Styled.InlineCode>{`{ status, data, error }`}</Styled.InlineCode> from async hooks).</li>
                    <li><b>Predictability:</b> Avoid “sometimes returns X, sometimes Y.” Keep inputs/outputs stable.</li>
                    <li><b>Explicitness:</b> Prefer clear options over hidden behavior. Document defaults.</li>
                    <li><b>Minimal surface:</b> Start small. Add props/params only when proven necessary.</li>
                    <li><b>Composability:</b> Prefer small building blocks vs one giant “god component” with 20 props.</li>
                    <li><b>Progressive disclosure:</b> Offer sensible defaults; allow advanced customization when needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Component API design */}
            <Styled.Section>
                <Styled.H2>Component API Design</Styled.H2>
                <Styled.List>
                    <li><b>Props naming:</b> Use verbs for actions (<Styled.InlineCode>onSubmit</Styled.InlineCode>), nouns for values (<Styled.InlineCode>value</Styled.InlineCode>), and adjectives for booleans (<Styled.InlineCode>disabled</Styled.InlineCode>).</li>
                    <li><b>Booleans vs enums:</b> Replace many booleans with a single <Styled.InlineCode>variant</Styled.InlineCode> enum when states are mutually exclusive.</li>
                    <li><b>Controlled vs uncontrolled:</b>
                        <ul>
                            <li><b>Controlled:</b> Parent owns state via <Styled.InlineCode>value</Styled.InlineCode> + <Styled.InlineCode>onChange</Styled.InlineCode>.</li>
                            <li><b>Uncontrolled:</b> Component manages internal state via <Styled.InlineCode>defaultValue</Styled.InlineCode>.</li>
                            <li>Support both when practical: <Styled.InlineCode>value? onChange? defaultValue?</Styled.InlineCode></li>
                        </ul>
                    </li>
                    <li><b>Event signatures:</b> Prefer <Styled.InlineCode>onChange(nextValue, event)</Styled.InlineCode> (value first, event second) for ergonomics.</li>
                    <li><b>Children & slots:</b> Use <Styled.InlineCode>children</Styled.InlineCode> for simple content; use <b>compound components</b> or a <b>slots</b> prop for structured content.</li>
                    <li><b>Pass-through props:</b> Spread unrecognized props to the root element to aid accessibility (<Styled.InlineCode>{`<div {...rest} />`}</Styled.InlineCode>) when safe.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example: Button with consistent, small API
function Button({ variant = "primary", disabled = false, onClick, children, ...rest }) {
  // variant: "primary" | "secondary" | "ghost"
  return (
    <button
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

// Usage
<Button onClick={() => alert("Saved!")} variant="secondary">Save</Button>`}
                </Styled.Pre>

                <Styled.Small>
                    Keep <em>value</em>/<em>defaultValue</em> semantics clear; document whether the component is controlled, uncontrolled, or supports both.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Hook API design */}
            <Styled.Section>
                <Styled.H2>Hook API Design</Styled.H2>
                <Styled.List>
                    <li><b>Naming:</b> Hooks start with <Styled.InlineCode>use</Styled.InlineCode> and describe <em>what</em>, not <em>how</em> (e.g., <Styled.InlineCode>useDisclosure</Styled.InlineCode>, not <Styled.InlineCode>useBooleanToggle</Styled.InlineCode>).</li>
                    <li><b>Inputs:</b> Prefer a single <b>options object</b> for flexibility and defaults.</li>
                    <li><b>Outputs:</b> Return either a tuple (<Styled.InlineCode>[value, actions]</Styled.InlineCode>) or an object (named fields). Keep identity stability with <Styled.InlineCode>useCallback</Styled.InlineCode>/<Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Async hooks:</b> Return <Styled.InlineCode>{`{ status, data, error }`}</Styled.InlineCode> + actions (e.g., <Styled.InlineCode>refetch</Styled.InlineCode>). Support cancellation when possible.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example: useDisclosure (show/hide pattern)
export function useDisclosure(initial = false) {
  const [open, setOpen] = React.useState(!!initial);
  const openPanel = React.useCallback(() => setOpen(true), []);
  const closePanel = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen(v => !v), []);
  return { open, openPanel, closePanel, toggle };
}

// Example: useRequest with AbortController
export function useRequest(options) {
  const { url, init, auto = true } = options;
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  const run = React.useCallback(async () => {
    const ctrl = new AbortController();
    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      const data = await res.json();
      setState({ status: "success", data, error: null });
      return data;
    } catch (err) {
      if (err.name !== "AbortError") setState({ status: "error", data: null, error: err });
      throw err;
    }
  }, [url, init]);

  React.useEffect(() => { if (auto) run(); }, [auto, run]);

  return { ...state, run };
}`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Cancellation:</b> The ability to stop an in-flight async operation (e.g., via <Styled.InlineCode>AbortController</Styled.InlineCode>) to avoid race conditions and memory leaks.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Utility function API design */}
            <Styled.Section>
                <Styled.H2>Utility Function API Design</Styled.H2>
                <Styled.List>
                    <li><b>Purity:</b> Prefer pure functions (no side effects) for predictability and testability.</li>
                    <li><b>Parameter order:</b> Put the <em>data</em> first, <em>options</em> last. For many optional params, use an options object.</li>
                    <li><b>Return values:</b> Return data, not booleans that force extra lookups, unless the function's goal <em>is</em> a boolean check.</li>
                    <li><b>Errors:</b> Throw on truly exceptional cases; return <Styled.InlineCode>null</Styled.InlineCode>/<Styled.InlineCode>undefined</Styled.InlineCode> for “not found” when it's a valid state.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example: clamp utility (pure, deterministic)
export function clamp(n, { min = -Infinity, max = Infinity } = {}) {
  return Math.min(max, Math.max(min, n));
}

// Example: parseQuery (returns data or null)
export function parseQuery(qs) {
  try {
    const params = new URLSearchParams(qs);
    return Object.fromEntries(params.entries());
  } catch {
    return null;
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Provider & context APIs */}
            <Styled.Section>
                <Styled.H2>Provider & Context APIs</Styled.H2>
                <Styled.List>
                    <li><b>Provider pattern:</b> Place shared state in a context provider; expose a <Styled.InlineCode>useXxx()</Styled.InlineCode> hook that throws if used outside the provider (clear failure mode).</li>
                    <li><b>Shape stability:</b> Keep the context value stable with <Styled.InlineCode>useMemo</Styled.InlineCode> to avoid unnecessary re-renders.</li>
                    <li><b>Granularity:</b> Split contexts (e.g., state vs actions) when consumers need different subsets.</li>
                </Styled.List>

                <Styled.Pre>
                    {`const ThemeContext = React.createContext(null);

export function ThemeProvider({ children, initial = "dark" }) {
  const [theme, setTheme] = React.useState(initial);
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Versioning & evolution */}
            <Styled.Section>
                <Styled.H2>Versioning & Evolution</Styled.H2>
                <Styled.List>
                    <li><b>Semantic Versioning (SemVer):</b> <em>MAJOR.MINOR.PATCH</em>
                        <ul>
                            <li><b>PATCH:</b> bug fixes only (no API changes).</li>
                            <li><b>MINOR:</b> add features in backward-compatible ways.</li>
                            <li><b>MAJOR:</b> breaking changes; provide a migration guide.</li>
                        </ul>
                    </li>
                    <li><b>Deprecation path:</b> Introduce new APIs, warn on old ones, then remove in the next major release.</li>
                    <li><b>Changelogs:</b> Document what changed, why, and how to migrate.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> provide sensible defaults; allow overrides via an options object.</li>
                    <li><b>Do</b> keep names short and precise (<Styled.InlineCode>onChange</Styled.InlineCode>, <Styled.InlineCode>variant</Styled.InlineCode>, <Styled.InlineCode>size</Styled.InlineCode>).</li>
                    <li><b>Do</b> document return shapes and event signatures.</li>
                    <li><b>Don't</b> return different types for the same function depending on inputs.</li>
                    <li><b>Don't</b> overload with many booleans (<Styled.InlineCode>primary</Styled.InlineCode>, <Styled.InlineCode>danger</Styled.InlineCode>, <Styled.InlineCode>ghost</Styled.InlineCode>); prefer a <Styled.InlineCode>variant</Styled.InlineCode>.</li>
                    <li><b>Don't</b> hide side effects; make them explicit (e.g., “persists to localStorage”).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Checklist */}
            <Styled.Section>
                <Styled.H2>API Review Checklist</Styled.H2>
                <Styled.List>
                    <li>Is the name clear and consistent with similar APIs?</li>
                    <li>Are inputs/outputs minimal and stable? Defaults documented?</li>
                    <li>Is it composable with existing pieces?</li>
                    <li>Are error states and async/cancellation covered?</li>
                    <li>Any breaking changes? If yes, migration notes prepared?</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Options object:</b> A single parameter that holds named fields (<Styled.InlineCode>{`fn(data, { min, max })`}</Styled.InlineCode>) for flexibility and defaults.</li>
                    <li><b>Return shape:</b> The structure and types of the value a function/hook returns.</li>
                    <li><b>Identity stability:</b> A value or function keeps the same reference across renders (via <Styled.InlineCode>useMemo</Styled.InlineCode>/<Styled.InlineCode>useCallback</Styled.InlineCode>), enabling memoization.</li>
                    <li><b>Cancellation:</b> Stopping an in-flight async task to avoid stale updates (e.g., <Styled.InlineCode>AbortController</Styled.InlineCode>).</li>
                    <li><b>Compound components:</b> A pattern where related components share context (e.g., <Styled.InlineCode>Tabs</Styled.InlineCode>, <Styled.InlineCode>Tabs.List</Styled.InlineCode>, <Styled.InlineCode>Tabs.Panel</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Design APIs for clarity and stability. Prefer options objects, stable return shapes,
                consistent event signatures, and explicit defaults. Start minimal, evolve carefully, and document changes.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ApiDesign;
