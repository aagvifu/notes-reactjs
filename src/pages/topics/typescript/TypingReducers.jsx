import { Styled } from "./styled";

const TypingReducers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Reducers (TypeScript)</Styled.Title>

            <Styled.Lead>
                A <b>reducer</b> is a <i>pure function</i> that takes the current <b>state</b> and an <b>action</b>, then returns the next state:
                <Styled.InlineCode>(state, action) → newState</Styled.InlineCode>. In React, you use it with <b>useReducer</b> to manage complex or
                multi-step state updates with a clear, testable flow. TypeScript gives you safety by typing <b>State</b>, <b>Action</b>,
                and <b>Dispatch</b> precisely.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms & Definitions</Styled.H2>
                <Styled.List>
                    <li><b>State:</b> The data your component manages (object/array/primitive) at a moment in time.</li>
                    <li><b>Action:</b> A plain object describing <i>what happened</i>. Typically has a <Styled.InlineCode>type</Styled.InlineCode> field and optional <i>payload</i>.</li>
                    <li><b>Reducer:</b> A pure function <Styled.InlineCode>(state, action) ⇒ newState</Styled.InlineCode>. “Pure” means: no side effects (no fetch, no timers), and same inputs → same output.</li>
                    <li><b>Dispatch:</b> A function you call to send an action to the reducer (<Styled.InlineCode>dispatch({`type: "add", payload: ... `})</Styled.InlineCode>).</li>
                    <li><b>Discriminated union:</b> A TypeScript union where each variant carries a common “discriminant” (like <Styled.InlineCode>type</Styled.InlineCode>) so TS can <i>narrow</i> the shape safely per case.</li>
                    <li><b>Exhaustiveness check:</b> Ensuring every possible action type is handled (TS will flag any missing case).</li>
                    <li><b>Immutability:</b> You return a <i>new</i> state value rather than mutating the existing one.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) useReducer typing approach */}
            <Styled.Section>
                <Styled.H2>Typing <code>useReducer</code> — Overview</Styled.H2>
                <Styled.List>
                    <li><b>State type:</b> describes your state shape.</li>
                    <li><b>Action type:</b> use a <i>discriminated union</i>—one variant per action <Styled.InlineCode>type</Styled.InlineCode>.</li>
                    <li><b>Reducer type:</b> <Styled.InlineCode>React.Reducer&lt;State, Action&gt;</Styled.InlineCode>.</li>
                    <li><b>Dispatch type:</b> <Styled.InlineCode>React.Dispatch&lt;Action&gt;</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// TypeScript examples below (TSX). You can paste in a .tsx file or a TS playground.
// Signature reminder:
// const [state, dispatch] = React.useReducer(reducer, initialArg, init?);

// Minimal template:
type State = { ... };
type Action =
  | { type: "..." }
  | { type: "..."; payload: ... };

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    // handle each action, return NEW state
    default:
      return state;
  }
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Example: Counter (small, focused) */}
            <Styled.Section>
                <Styled.H2>Example 1 — Counter (Discriminated Union)</Styled.H2>
                <Styled.Pre>
                    {`type CounterState = { count: number };

type CounterAction =
  | { type: "increment"; step?: number }
  | { type: "decrement"; step?: number }
  | { type: "reset" };

const counterReducer: React.Reducer<CounterState, CounterAction> = (state, action) => {
  switch (action.type) {
    case "increment": {
      const step = action.step ?? 1;
      return { count: state.count + step };
    }
    case "decrement": {
      const step = action.step ?? 1;
      return { count: state.count - step };
    }
    case "reset":
      return { count: 0 };
    default: {
      // Exhaustiveness (should never happen if Action covers all types):
      const _exhaustive: never = action;
      return state;
    }
  }
};

// Usage with React:
function Counter() {
  const [state, dispatch] = React.useReducer(counterReducer, { count: 0 });

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why a union?</b> It lets TypeScript <i>narrow</i> to the correct shape per case—no unsafe casting.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Example: Todo list with payloads */}
            <Styled.Section>
                <Styled.H2>Example 2 — Todos with Payloads</Styled.H2>
                <Styled.Pre>
                    {`type Todo = { id: string; text: string; done: boolean };
type TodosState = { items: Todo[] };

type TodosAction =
  | { type: "add"; payload: { text: string } }
  | { type: "toggle"; payload: { id: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "clearCompleted" };

const todosReducer: React.Reducer<TodosState, TodosAction> = (state, action) => {
  switch (action.type) {
    case "add": {
      const newTodo: Todo = { id: crypto.randomUUID(), text: action.payload.text, done: false };
      return { items: [newTodo, ...state.items] };
    }
    case "toggle": {
      return {
        items: state.items.map(t => t.id === action.payload.id ? { ...t, done: !t.done } : t)
      };
    }
    case "remove": {
      return { items: state.items.filter(t => t.id !== action.payload.id) };
    }
    case "clearCompleted": {
      return { items: state.items.filter(t => !t.done) };
    }
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
};`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Payload:</b> additional data needed to compute the next state. Typed per action variant for safety.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Typing Dispatch, Action Creators, and as const */}
            <Styled.Section>
                <Styled.H2>Dispatch, Action Creators &amp; <code>as const</code></Styled.H2>
                <Styled.List>
                    <li><b>Dispatch type:</b> <Styled.InlineCode>React.Dispatch&lt;Action&gt;</Styled.InlineCode>.</li>
                    <li><b>Action creator:</b> a small function that returns a correctly typed action object (removes string typos).</li>
                    <li><b><code>as const</code>:</b> makes the <Styled.InlineCode>type</Styled.InlineCode> literal immutable, improving discrimination.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Action creators:
const add    = (text: string) => ({ type: "add",    payload: { text } } as const);
const toggle = (id: string)    => ({ type: "toggle", payload: { id } } as const);

// In a component:
function TodosUI() {
  const [state, dispatch] = React.useReducer(todosReducer, { items: [] });
  const onAdd = (text: string) => dispatch(add(text));
  const onToggle = (id: string) => dispatch(toggle(id));
  // dispatch has type React.Dispatch<TodosAction>
  return null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Lazy init and initializer typing */}
            <Styled.Section>
                <Styled.H2>Lazy Initialization</Styled.H2>
                <Styled.List>
                    <li><b>Lazy init:</b> Use the third <Styled.InlineCode>init</Styled.InlineCode> function when initial state needs computation (e.g., read from localStorage).</li>
                    <li>TypeScript infers from your <Styled.InlineCode>reducer</Styled.InlineCode> + <Styled.InlineCode>init</Styled.InlineCode>. You can also annotate the reducer explicitly.</li>
                </Styled.List>
                <Styled.Pre>
                    {`type State = { value: number };
type Action = { type: "set"; payload: number };

const reducer: React.Reducer<State, Action> = (s, a) =>
  a.type === "set" ? { value: a.payload } : s;

function init(initialArg: number): State {
  // heavy compute or storage read here
  return { value: initialArg };
}

function Example() {
  const [state] = React.useReducer(reducer, /* initialArg */ 42, init);
  // state: { value: 42 }
  return <p>{state.value}</p>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Exhaustiveness & narrowing tips */}
            <Styled.Section>
                <Styled.H2>Exhaustive Checks & Narrowing</Styled.H2>
                <Styled.List>
                    <li>Use a <b>switch</b> on <Styled.InlineCode>action.type</Styled.InlineCode>. In the <i>default</i> branch, assign <Styled.InlineCode>action</Styled.InlineCode> to <Styled.InlineCode>never</Styled.InlineCode> to force completeness.</li>
                    <li>Avoid loose action shapes (e.g., <Styled.InlineCode>any</Styled.InlineCode> payloads). Make payloads specific and required only where needed.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function reducer(state: State, action: Action): State {
  switch (action.type) {
    // cases...
    default: {
      const _x: never = action; // TS error if a case is missing
      return state;
    }
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> model actions as a discriminated union with clear <Styled.InlineCode>type</Styled.InlineCode> strings.</li>
                    <li><b>Do</b> keep reducers <i>pure</i>; put side effects (fetch, timers, analytics) in <Styled.InlineCode>useEffect</Styled.InlineCode> or caller code.</li>
                    <li><b>Do</b> return <i>new</i> state objects (immutability) rather than mutating inputs.</li>
                    <li><b>Don't</b> overuse enums for action types—string literal unions work great and are ergonomic.</li>
                    <li><b>Don't</b> put React elements or DOM refs into reducer state unless you know why (keep state serializable when possible).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Narrowing:</b> TS technique to refine a union to a specific variant using checks (like <Styled.InlineCode>switch(action.type)</Styled.InlineCode>).</li>
                    <li><b>Literal type:</b> a type that represents exactly one value (e.g., <Styled.InlineCode>"add"</Styled.InlineCode>).</li>
                    <li><b>Readonly:</b> a modifier that prevents reassignment/mutation; useful to protect state shapes.</li>
                    <li><b>Never:</b> a type with no possible values; assigning to it enforces exhaustiveness.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Define a precise <b>State</b>, model <b>Action</b> as a discriminated union,
                type your <b>Reducer</b> and <b>Dispatch</b>, keep reducers pure and immutable, and use
                <i> exhaustive checks</i> to guarantee you handle every action safely.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingReducers;
