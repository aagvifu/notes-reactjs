import { Styled } from "./styled";

const TypingHooks = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Hooks (TypeScript)</Styled.Title>

            <Styled.Lead>
                “Typing hooks” means adding <b>TypeScript types</b> so React hooks are safe and
                autocomplete-friendly. Lean on <b>type inference</b> first; add <b>annotations</b> when
                state can't be inferred (e.g., <i>null</i> initial values) or when you want stricter APIs.
            </Styled.Lead>

            {/* 0) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (Quick Definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Type inference:</b> TypeScript figures out a type from the value (no annotation needed).</li>
                    <li><b>Annotation:</b> Writing the type explicitly, e.g., <Styled.InlineCode>useState&lt;number&gt;(0)</Styled.InlineCode>.</li>
                    <li><b>Generic:</b> A reusable type/function with a type parameter, e.g., <Styled.InlineCode>function wrap&lt;T&gt;(x: T): T</Styled.InlineCode>.</li>
                    <li><b>Union type:</b> A value can be one of several types, e.g., <Styled.InlineCode>string | null</Styled.InlineCode>.</li>
                    <li><b>Narrowing:</b> Refining a broad type to a more specific one via checks, e.g., <Styled.InlineCode>if (value !== null)</Styled.InlineCode>.</li>
                    <li><b>Dispatch/SetStateAction:</b> React's setter types: <Styled.InlineCode>React.Dispatch&lt;React.SetStateAction&lt;T&gt;&gt;</Styled.InlineCode>.</li>
                    <li><b>MutableRefObject&lt;T&gt;:</b> The type of <Styled.InlineCode>useRef</Styled.InlineCode>'s object (<Styled.InlineCode>{`{ current: T }`}</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) useState */}
            <Styled.Section>
                <Styled.H2>Typing <code>useState</code></Styled.H2>
                <Styled.List>
                    <li><b>Prefer inference:</b> if you pass a <i>non-null</i> initial value, TS infers the state type.</li>
                    <li><b>Annotate unions:</b> if initial value is <i>null</i> or ambiguous, provide a generic like <Styled.InlineCode>&lt;T | null&gt;</Styled.InlineCode>.</li>
                    <li><b>Setter type:</b> <Styled.InlineCode>React.Dispatch&lt;React.SetStateAction&lt;T&gt;&gt;</Styled.InlineCode> accepts a value <i>or</i> a function that receives previous state.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ✅ Inference from initial value
const [count, setCount] = React.useState(0);             // number
const [title, setTitle] = React.useState("Hello");       // string
const [flags, setFlags] = React.useState([true, false]); // boolean[]

// ✅ Union when null is valid (common for async data)
type User = { id: string; name: string };
const [user, setUser] = React.useState<User | null>(null);

// ✅ Functional update is typed automatically
setCount(c => c + 1);

// ✅ Lazy initialization keeps type
const [expensive, setExpensive] = React.useState<number>(() => computeHeavy());

// ⚠️ If you omit the generic with null, TS infers 'null' and you'll fight types later
// const [bad, setBad] = React.useState(null); // type: null (too narrow)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 2) useRef */}
            <Styled.Section>
                <Styled.H2>Typing <code>useRef</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>DOM refs:</b> use <Styled.InlineCode>HTMLElement</Styled.InlineCode> subtypes and allow <i>null</i> at start.
                        Example: <Styled.InlineCode>useRef&lt;HTMLDivElement | null&gt;(null)</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Mutable boxes:</b> store mutable values across renders without causing re-renders:
                        <Styled.InlineCode>useRef&lt;T&gt;(initial)</Styled.InlineCode> ⇒ <Styled.InlineCode>MutableRefObject&lt;T&gt;</Styled.InlineCode>.
                    </li>
                    <li><b>Remember:</b> changing <Styled.InlineCode>ref.current</Styled.InlineCode> does <i>not</i> trigger a render.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// DOM node ref
const divRef = React.useRef<HTMLDivElement | null>(null);

// Timer id ref (Node, Browser)
const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

// Mutable box (e.g., latest value or a flag)
const isDraggingRef = React.useRef(false);

// Safe usage with narrowing
if (divRef.current) {
  const rect = divRef.current.getBoundingClientRect();
  console.log(rect.width);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) useEffect */}
            <Styled.Section>
                <Styled.H2>Typing <code>useEffect</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Effect function:</b> type is inferred. The returned <b>cleanup</b> must be <Styled.InlineCode>() =&gt; void</Styled.InlineCode> (or nothing).
                    </li>
                    <li>
                        <b>Subscribing to native events:</b> when using <Styled.InlineCode>addEventListener</Styled.InlineCode>, type the handler using DOM event types
                        like <Styled.InlineCode>KeyboardEvent</Styled.InlineCode> / <Styled.InlineCode>MouseEvent</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`React.useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      // ...
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) useMemo */}
            <Styled.Section>
                <Styled.H2>Typing <code>useMemo</code></Styled.H2>
                <Styled.List>
                    <li><b>Inference first:</b> return value determines the memo's type.</li>
                    <li><b>Annotate when needed:</b> use a generic if the return type can't be inferred cleanly.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Inference from return value
const total = React.useMemo(() => prices.reduce((a, b) => a + b, 0), [prices]); // number

// Explicit annotation (rarely needed)
const ids = React.useMemo<string[]>(
  () => users.map(u => u.id),
  [users]
);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) useCallback */}
            <Styled.Section>
                <Styled.H2>Typing <code>useCallback</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Inference:</b> TS infers parameters/return from the function you pass.
                        If you want a stricter signature, add a function type.
                    </li>
                    <li>
                        <b>Event handlers:</b> You can use React's event handler types like
                        <Styled.InlineCode> React.MouseEventHandler&lt;HTMLButtonElement&gt;</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Inferred
const onSelect = React.useCallback((id: string) => {
  // ...
}, []);

// Explicit function type (alternative)
type SelectHandler = (id: string) => void;
const onSelect2: SelectHandler = React.useCallback((id) => { /* ... */ }, []);

// React event handler type
const onBtnClick: React.MouseEventHandler<HTMLButtonElement> =
  React.useCallback((e) => {
    console.log(e.currentTarget.name);
  }, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Short note on useReducer */}
            <Styled.Section>
                <Styled.H2>Quick Note: <code>useReducer</code> Types</Styled.H2>
                <Styled.Small>
                    You'll deep-dive this in “Typing Reducers”. Here's the shape:
                </Styled.Small>
                <Styled.Pre>
                    {`type State = { count: number };
type Action =
  | { type: "inc"; step?: number }
  | { type: "dec"; step?: number }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc": return { count: state.count + (action.step ?? 1) };
    case "dec": return { count: state.count - (action.step ?? 1) };
    case "reset": return { count: 0 };
  }
}

const [state, dispatch] = React.useReducer(reducer, { count: 0 });
// dispatch is React.Dispatch<Action>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Typing custom hooks with generics */}
            <Styled.Section>
                <Styled.H2>Typing Custom Hooks with Generics</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Why generics?</b> Let consumers decide the data type, keeping the hook reusable.
                    </li>
                    <li>
                        <b>Return shapes:</b> Prefer an object for named fields or a tuple marked <Styled.InlineCode>as const</Styled.InlineCode> for stable positions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Generic data fetcher (demo style)
type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: unknown };

export function useFetch<T>(url: string): AsyncState<T> {
  const [state, setState] = React.useState<AsyncState<T>>({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancel = false;
    setState({ status: "loading", data: null, error: null });

    fetch(url)
      .then(r => r.json() as Promise<T>)
      .then(data => !cancel && setState({ status: "success", data, error: null }))
      .catch(err => !cancel && setState({ status: "error", data: null, error: err }));

    return () => { cancel = true; };
  }, [url]);

  return state;
}

// Usage:
type User = { id: string; name: string };
const usersState = useFetch<User[]>("/api/users");`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Patterns, Do/Don't */}
            <Styled.Section>
                <Styled.H2>Patterns · Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> rely on inference; annotate only when inference isn't enough.</li>
                    <li><b>Do</b> model “not yet loaded” with unions (<Styled.InlineCode>T | null</Styled.InlineCode> or status enums).</li>
                    <li><b>Do</b> type DOM refs as <Styled.InlineCode>Element | null</Styled.InlineCode> and narrow before use.</li>
                    <li><b>Don't</b> use <Styled.InlineCode>any</Styled.InlineCode>—prefer generics and proper unions.</li>
                    <li><b>Don't</b> store reactive state in refs (they don't trigger renders).</li>
                    <li><b>Don't</b> over-annotate simple cases; it adds noise without benefits.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Mini Glossary (Hooks) */}
            <Styled.Section>
                <Styled.H2>Mini Glossary (Hooks Context)</Styled.H2>
                <Styled.List>
                    <li><b>Cleanup:</b> a function returned from an effect to undo subscriptions/timers.</li>
                    <li><b>Dependency array:</b> list of values a hook depends on; changes re-run the hook work.</li>
                    <li><b>Stale closure:</b> a function closes over old values; fix by listing deps or using refs.</li>
                    <li><b>Tuple:</b> a fixed-length array with positional meaning, e.g., <Styled.InlineCode>[state, setState]</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: start with inference, add precise annotations for unions and refs, use generics for
                reusable custom hooks, and keep reducers/actions strongly typed for safety and autocomplete.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingHooks;
