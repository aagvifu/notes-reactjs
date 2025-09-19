import React from "react";
import { Styled } from "./styled";

const StateReducer = () => {
    return (
        <Styled.Page>
            <Styled.Title>State Reducer Pattern</Styled.Title>

            <Styled.Lead>
                The <b>State Reducer</b> pattern lets a component keep its <i>own</i> state while allowing
                consumers to <b>intercept</b> and <b>shape</b> state transitions by providing a custom
                <Styled.InlineCode>stateReducer</Styled.InlineCode> function. It's like giving users a hook
                into the component's decision-making, without exposing its internals.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms (clear definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>State:</b> The data a component remembers between renders (e.g., <code>on</code> for a toggle).
                    </li>
                    <li>
                        <b>Action:</b> A plain object describing <i>what happened</i> (e.g., <code>{`{ type: "toggle" }`}</code>).
                    </li>
                    <li>
                        <b>Reducer:</b> A pure function <code>(state, action) ⇒ nextState</code> that computes the next state.
                    </li>
                    <li>
                        <b>Default reducer:</b> The component's built-in reducer that defines its normal behavior.
                    </li>
                    <li>
                        <b>State reducer (prop):</b> A consumer-supplied reducer that can <i>override</i> or
                        <i>augment</i> the default reducer's result.
                    </li>
                    <li>
                        <b>Controlled vs Uncontrolled:</b> Controlled means the parent owns the state (via props like
                        <code>value</code> + <code>onChange</code>). Uncontrolled means the component manages its own state.
                    </li>
                    <li>
                        <b>Transition:</b> The move from current state → next state caused by an action.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why this pattern */}
            <Styled.Section>
                <Styled.H2>Why use a State Reducer?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Extensibility:</b> Consumers can enforce rules (e.g., “toggle can only turn on once per minute”)
                        without changing your component code.
                    </li>
                    <li>
                        <b>Predictability:</b> All state changes flow through a single reducer pipeline.
                    </li>
                    <li>
                        <b>Testability:</b> You can test behavior by asserting reducer outputs for given inputs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy of the Pattern</Styled.H2>
                <Styled.Pre>
                    {`// Inside your reusable component:
const defaultReducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      return { ...state, on: !state.on };
    case "set":
      return { ...state, on: !!action.payload };
    default:
      return state;
  }
};

// Merge default + user reducer. The user reducer gets the "proposed" nextState to modify.
function getFinalState(userReducer, state, action) {
  const proposed = defaultReducer(state, action);
  return typeof userReducer === "function" ? userReducer(state, action, proposed) : proposed;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The consumer's <code>stateReducer(state, action, proposed)</code> can accept or alter the{" "}
                    <i>proposed</i> next state. Returning <code>state</code> blocks the change; returning
                    <code>proposed</code> accepts it; or return a custom object to reshape it.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Example: Toggle with stateReducer prop */}
            <Styled.Section>
                <Styled.H2>Example: Toggle (Uncontrolled with a State Reducer)</Styled.H2>
                <Styled.Pre>
                    {`function Toggle({ initialOn = false, stateReducer, onChange }) {
  const [state, setState] = React.useState({ on: !!initialOn });

  function dispatch(action) {
    setState((prev) => {
      const next = getFinalState(stateReducer, prev, action);
      if (next !== prev) onChange?.(next, action); // notify consumer
      return next;
    });
  }

  return (
    <button
      aria-pressed={state.on}
      onClick={() => dispatch({ type: "toggle" })}
    >
      {state.on ? "ON" : "OFF"}
    </button>
  );
}

// Usage: block turning OFF (force sticky ON)
function stickyOnReducer(state, action, proposed) {
  if (action.type === "toggle" && state.on && !proposed.on) {
    return state; // reject the OFF transition
  }
  return proposed; // accept all others
}

// <Toggle stateReducer={stickyOnReducer} onChange={(s,a) => console.log(s,a)} />
`}
                </Styled.Pre>
                <Styled.Small>
                    The parent <b>shapes behavior</b> without rewriting the Toggle. Great for business rules, quotas, or logging.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: Hybrid (supports controlled value) */}
            <Styled.Section>
                <Styled.H2>Hybrid: Allow Controlled Usage</Styled.H2>
                <Styled.Pre>
                    {`function ToggleHybrid({ value, defaultValue = false, onChange, stateReducer }) {
  const isControlled = value != null;
  const [internal, setInternal] = React.useState({ on: !!defaultValue });
  const state = { on: isControlled ? !!value : internal.on };

  function setState(next, action) {
    if (!isControlled) setInternal(next);
    onChange?.(next, action); // always notify
  }

  function dispatch(action) {
    const next = getFinalState(stateReducer, state, action);
    if (next !== state) setState(next, action);
  }

  return (
    <button aria-pressed={state.on} onClick={() => dispatch({ type: "toggle" })}>
      {state.on ? "ON" : "OFF"}
    </button>
  );
}

// Usage (controlled):
// <ToggleHybrid value={on} onChange={(next) => setOn(next.on)} />
`}
                </Styled.Pre>
                <Styled.Small>
                    Support both uncontrolled and controlled patterns. In controlled mode, the parent is the
                    source of truth; we still run the reducer pipeline and emit <code>onChange</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Advanced: limiting transitions with reasons */}
            <Styled.Section>
                <Styled.H2>Advanced: Enforce Rules &amp; Return Reasons</Styled.H2>
                <Styled.Pre>
                    {`// action: { type: "toggle", meta?: any }
function businessRulesReducer(state, action, proposed) {
  const now = Date.now();
  // Example rule: only allow one OFF per 5 seconds
  if (state.on && !proposed.on && now - (state._lastOffAt ?? 0) < 5000) {
    return { ...state, _reason: "Too soon to turn OFF" }; // reject + annotate
  }
  if (!state.on && proposed.on) {
    return { ...proposed, _lastOnAt: now, _reason: undefined };
  }
  if (state.on && !proposed.on) {
    return { ...proposed, _lastOffAt: now, _reason: undefined };
  }
  return proposed;
}`}
                </Styled.Pre>
                <Styled.Small>
                    A custom reducer can annotate state with metadata (timestamps, reason codes) to inform the UI.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Best practices */}
            <Styled.Section>
                <Styled.H2>Best Practices</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Document actions:</b> List the <code>type</code> strings and expected payload shapes.
                    </li>
                    <li>
                        <b>Keep reducers pure:</b> No side effects; compute next state only. Do effects in handlers after state updates.
                    </li>
                    <li>
                        <b>Always call consumer reducer last:</b> Compute a <i>proposed</i> next state first, then hand it to the user reducer.
                    </li>
                    <li>
                        <b>Notify changes consistently:</b> Call <code>onChange(next, action)</code> when the final state actually changes.
                    </li>
                    <li>
                        <b>Support controlled usage:</b> Allow <code>value/onChange</code> when it makes sense.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep the action surface small and well-named (e.g., <code>toggle</code>, <code>open</code>, <code>close</code>).</li>
                    <li><b>Do</b> pass <code>(state, action, proposed)</code> to the user reducer for full context.</li>
                    <li><b>Don't</b> mutate state objects; always return new objects for changes.</li>
                    <li><b>Don't</b> hide side effects in reducers; perform side effects outside (e.g., in <code>useEffect</code> or handlers).</li>
                    <li><b>Don't</b> couple the reducer to DOM specifics; keep it UI-agnostic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Pure function:</b> Same inputs → same output, no external side effects.</li>
                    <li><b>Idempotent:</b> Reapplying the same action yields the same state (useful for safety).</li>
                    <li><b>Invariant:</b> A rule that must always hold true for state (e.g., <code>count ≥ 0</code>).</li>
                    <li><b>Metadata:</b> Extra state fields (timestamps, reasons) that inform UI decisions.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: The State Reducer pattern exposes a predictable state transition pipeline. Components
                define the default behavior; consumers can accept, block, or transform transitions via a
                custom reducer—without forking your component.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default StateReducer;
