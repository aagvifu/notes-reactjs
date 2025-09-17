import React from "react";
import { Styled } from "./styled";

const UseReducerHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useReducer</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useReducer</Styled.InlineCode> centralizes complex state updates in a
                <b> pure reducer function</b>. It is ideal when updates are multi-step, the state is nested,
                or many events lead to the same transitions.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const [state, dispatch] = useReducer(reducer, initialArg, init?);

// reducer: (state, action) => nextState   // must be pure & immutable
// action:  { type: string, ...payload }   // a plain object describing "what happened"
// init:    (initialArg) => initialState   // optional lazy initializer, runs once on mount`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>State:</b> the current value managed by the reducer.</li>
                    <li><b>Action:</b> a plain object describing the event that occurred.</li>
                    <li><b>Dispatch:</b> a stable function used to send actions to the reducer.</li>
                    <li><b>Pure reducer:</b> no side effects, no mutations, same inputs → same output.</li>
                    <li><b>Lazy init:</b> costly initial state can be computed once with <Styled.InlineCode>init</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to prefer useReducer over useState */}
            <Styled.Section>
                <Styled.H2>When to use</Styled.H2>
                <Styled.List>
                    <li>Multiple updates must stay in sync or follow rules (state machine vibe).</li>
                    <li>Many different events change the same state in related ways.</li>
                    <li>Nested/complex state where switch cases are clearer than many <Styled.InlineCode>setState</Styled.InlineCode> calls.</li>
                    <li>Prop drilling of handlers becomes messy; sharing <Styled.InlineCode>dispatch</Styled.InlineCode> is simpler.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Example: todos reducer */}
            <Styled.Section>
                <Styled.H2>Example: Todos reducer</Styled.H2>
                <Styled.Pre>
                    {`function todosReducer(state, action) {
  switch (action.type) {
    case "added": {
      const { id, text } = action;
      return [...state, { id, text, done: false }];
    }
    case "toggled": {
      const { id } = action;
      return state.map(t => t.id === id ? { ...t, done: !t.done } : t);
    }
    case "removed": {
      const { id } = action;
      return state.filter(t => t.id !== id);
    }
    case "renamed": {
      const { id, text } = action;
      return state.map(t => t.id === id ? { ...t, text } : t);
    }
    default:
      return state; // unknown actions return current state
  }
}

function TodosApp() {
  const [text, setText] = React.useState("");
  const [todos, dispatch] = React.useReducer(todosReducer, []);

  function add() {
    if (!text.trim()) return;
    dispatch({ type: "added", id: Date.now(), text });
    setText("");
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: "toggled", id: t.id })}
              />
              {t.text}
            </label>
            <button onClick={() => dispatch({ type: "removed", id: t.id })}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    All updates flow through the reducer, keeping the rules in one place and updates immutable.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Lazy initialization (restore once) */}
            <Styled.Section>
                <Styled.H2>Lazy initialization</Styled.H2>
                <Styled.Pre>
                    {`function init(savedJson) {
  try {
    const parsed = JSON.parse(savedJson || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, dispatch] = React.useReducer(todosReducer, localStorage.getItem("todos"), init);

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ...
  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>init</Styled.InlineCode> runs only on mount. Use it to parse, normalize, or hydrate initial state once.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Action shape & action creators */}
            <Styled.Section>
                <Styled.H2>Action shape (naming & creators)</Styled.H2>
                <Styled.List>
                    <li>Use past-tense or event-like names: <Styled.InlineCode>"added"</Styled.InlineCode>, <Styled.InlineCode>"removed"</Styled.InlineCode>, <Styled.InlineCode>"toggled"</Styled.InlineCode>.</li>
                    <li>Prefer a single <Styled.InlineCode>type</Styled.InlineCode> string and a small payload; avoid deeply nested payloads.</li>
                    <li>Optional helpers keep call sites clean.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const addTodo    = (id, text) => ({ type: "added", id, text });
const toggleTodo = (id)       => ({ type: "toggled", id });
const removeTodo = (id)       => ({ type: "removed", id });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Side effects with useReducer */}
            <Styled.Section>
                <Styled.H2>Side effects with reducers</Styled.H2>
                <Styled.List>
                    <li>Reducers must be pure: no fetch, no timers, no DOM mutations inside.</li>
                    <li>Handle effects in event handlers or <Styled.InlineCode>useEffect</Styled.InlineCode> responding to state changes.</li>
                    <li>Async flows: dispatch a sequence such as <Styled.InlineCode>"fetch-started"</Styled.InlineCode> → <Styled.InlineCode>"fetch-succeeded"</Styled.InlineCode> or <Styled.InlineCode>"fetch-failed"</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function reducer(state, action) {
  switch (action.type) {
    case "load-start":   return { ...state, status: "loading" };
    case "load-success": return { ...state, status: "ready", data: action.data };
    case "load-error":   return { ...state, status: "error", error: action.error };
    default:             return state;
  }
}

function Products() {
  const [state, dispatch] = React.useReducer(reducer, { status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancelled = false;
    dispatch({ type: "load-start" });
    fetch("/api/products")
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(data => { if (!cancelled) dispatch({ type: "load-success", data }); })
      .catch(err => { if (!cancelled) dispatch({ type: "load-error", error: String(err) }); });
    return () => { cancelled = true; };
  }, []);

  // render based on state.status...
  return null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Organizing large reducers */}
            <Styled.Section>
                <Styled.H2>Organizing large reducers</Styled.H2>
                <Styled.List>
                    <li><b>Split</b> by feature and combine at a higher level (multiple <Styled.InlineCode>useReducer</Styled.InlineCode> calls).</li>
                    <li><b>Compose</b> reducers: a parent reducer delegates part of the state to child reducers.</li>
                    <li>For deeply nested updates, consider normalizing state or using a reducer helper like Immer for ergonomics.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function childA(state, action) { /* ... */ return state; }
function childB(state, action) { /* ... */ return state; }

function root(state, action) {
  return {
    a: childA(state.a, action),
    b: childB(state.b, action)
  };
}

const [state, dispatch] = React.useReducer(root, { a: {}, b: {} });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) useReducer + context (simple store) */}
            <Styled.Section>
                <Styled.H2>useReducer + context (simple app store)</Styled.H2>
                <Styled.Pre>
                    {`const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(() => ({ state, dispatch }), [state]); // memoize identity
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Consumers read <Styled.InlineCode>state</Styled.InlineCode> and call <Styled.InlineCode>dispatch</Styled.InlineCode>. Split contexts for state vs dispatch if needed for performance.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Performance notes */}
            <Styled.Section>
                <Styled.H2>Performance notes</Styled.H2>
                <Styled.List>
                    <li><b>dispatch is stable</b>; its identity does not change between renders.</li>
                    <li>Large top-level state causes many consumers to re-render on each change. Split state or providers when necessary.</li>
                    <li>Keep reducers fast and pure; derive values in render or with <Styled.InlineCode>useMemo</Styled.InlineCode> if heavy.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Mutating state inside the reducer; always return new objects/arrays.</li>
                    <li>Embedding side effects in reducers; move them to effects or handlers.</li>
                    <li>Saving derived state in the reducer; compute during render or memoize.</li>
                    <li>Very broad context with frequently changing state causing app-wide renders; scope the provider.</li>
                    <li>Forgetting a default case that returns the current state.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <Styled.InlineCode>useReducer</Styled.InlineCode> for complex or related updates.</li>
                    <li><b>Do</b> keep reducers pure and immutable; test them as pure functions.</li>
                    <li><b>Do</b> use lazy initialization for expensive initial state.</li>
                    <li><b>Don’t</b> perform side effects in reducers.</li>
                    <li><b>Don’t</b> duplicate derived data in state; derive it.</li>
                    <li><b>Don’t</b> let a single massive reducer handle unrelated concerns—split or compose.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useReducer</Styled.InlineCode> shines when updates are coordinated and rules-driven.
                Keep reducers pure, use actions to describe changes, derive computed values, and combine with context to share
                state cleanly across a subtree.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseReducerHook;
