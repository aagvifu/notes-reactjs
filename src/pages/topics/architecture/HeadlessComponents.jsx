import React from "react";
import { Styled } from "./styled";

const HeadlessComponents = () => {
    return (
        <Styled.Page>
            <Styled.Title>Headless Components</Styled.Title>

            <Styled.Lead>
                <b>Headless components</b> encapsulate behavior without dictating UI. They expose
                state, actions, and ARIA helpers so you can compose any design while reusing solid logic.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Headless component:</b> a component or hook that manages behavior/state but renders
                        <em> no opinionated UI</em>. You control the markup and styling.
                    </li>
                    <li>
                        <b>Goal:</b> reuse complex logic (keyboard interactions, selection, async state)
                        across many “skins” (Tailwind, styled-components, MUI, design systems).
                    </li>
                    <li>
                        <b>Contrast:</b> a “headed”/visual component ships both logic and fixed markup/CSS.
                        Headless separates concerns: logic ↔ presentation.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key Terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (beginner-friendly)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>API surface:</b> the set of props, returned values, and callbacks consumers use.
                    </li>
                    <li>
                        <b>Controlled vs uncontrolled:</b> <em>controlled</em> means parent holds state and passes
                        it via props; <em>uncontrolled</em> means the component holds its own internal state.
                    </li>
                    <li>
                        <b>Render prop:</b> passing a function as <code>children</code> so the headless component
                        can “hand back” state/actions: <code>{`children(props) => UI`}</code>.
                    </li>
                    <li>
                        <b>Compound components:</b> related subcomponents (<code>Select.List</code>,
                        <code>Select.Option</code>) communicate via context without hardcoding styles.
                    </li>
                    <li>
                        <b>State reducer:</b> advanced control point where parents can alter how state updates apply.
                    </li>
                    <li>
                        <b>ARIA helpers:</b> attributes/ids/roles to make custom UI accessible (e.g., listbox).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal headless toggle (hook + render any UI) */}
            <Styled.Section>
                <Styled.H2>Example 1 — Headless Toggle (Hook)</Styled.H2>
                <Styled.Small>
                    Logic in a custom hook; UI composed by consumer. Both controlled and uncontrolled supported.
                </Styled.Small>
                <Styled.Pre>
                    {`// Logic-only hook (headless)
function useToggle({ value, defaultValue = false, onChange } = {}) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const on = isControlled ? value : uncontrolled;

  const set = React.useCallback((next) => {
    const resolved = typeof next === "function" ? next(on) : next;
    if (!isControlled) setUncontrolled(resolved);
    onChange?.(resolved);
  }, [isControlled, on, onChange]);

  const toggle = React.useCallback(() => set(v => !v), [set]);
  const setTrue = React.useCallback(() => set(true), [set]);
  const setFalse = React.useCallback(() => set(false), [set]);

  return { on, toggle, setTrue, setFalse, set };
}

// Consumer decides UI:
function ToggleButton() {
  const { on, toggle } = useToggle();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
    >
      {on ? "ON" : "OFF"}
    </button>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why headless?</b> The same <code>useToggle</code> logic can power a switch, a checkbox,
                    a segmented control, or a custom icon button—your choice.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Headless with render-prop + ARIA (Listbox) */}
            <Styled.Section>
                <Styled.H2>Example 2 — Headless Listbox (Render Prop + ARIA)</Styled.H2>
                <Styled.Small>
                    The component controls selection & keyboard; you render any list UI while keeping accessibility.
                </Styled.Small>
                <Styled.Pre>
                    {`function useListbox({ items, defaultIndex = 0, onChange } = {}) {
  const [index, setIndex] = React.useState(defaultIndex);
  const id = React.useId();

  const select = React.useCallback((i) => {
    setIndex(i);
    onChange?.(items[i], i);
  }, [items, onChange]);

  const onKeyDown = React.useCallback((e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); select(Math.min(items.length - 1, index + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); select(Math.max(0, index - 1)); }
    if (e.key === "Home")      { e.preventDefault(); select(0); }
    if (e.key === "End")       { e.preventDefault(); select(items.length - 1); }
  }, [index, items.length, select]);

  // ARIA plumbing
  const listboxProps = {
    role: "listbox",
    "aria-activedescendant": \`\${id}-option-\${index}\`,
    tabIndex: 0,
    onKeyDown,
  };

  const getOptionProps = (i) => ({
    id: \`\${id}-option-\${i}\`,
    role: "option",
    "aria-selected": i === index,
    onMouseDown: (e) => e.preventDefault(), // avoid focus loss
    onClick: () => select(i),
  });

  return { index, select, listboxProps, getOptionProps };
}

// Headless component with render prop
function Listbox({ items, children, ...opts }) {
  const api = useListbox({ items, ...opts });
  return children(api); // render-prop: children(api) => UI
}

// Consumer UI (any design system)
function ColorPicker() {
  const colors = ["Red", "Green", "Blue"];
  return (
    <Listbox items={colors}>
      {({ index, listboxProps, getOptionProps }) => (
        <div {...listboxProps} style={{ border: "1px solid #555", padding: 8, width: 220 }}>
          {colors.map((c, i) => (
            <div
              key={c}
              {...getOptionProps(i)}
              style={{
                padding: "6px 8px",
                background: i === index ? "rgba(255,255,255,0.08)" : "transparent",
                cursor: "pointer",
              }}
            >
              {c}
            </div>
          ))}
          <div style={{ marginTop: 8, opacity: 0.8 }}>Selected: {colors[index]}</div>
        </div>
      )}
    </Listbox>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> <code>role="listbox"</code>, <code>role="option"</code>, and{" "}
                    <code>aria-activedescendant</code> help screen readers understand the widget.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Compound + Context version */}
            <Styled.Section>
                <Styled.H2>Example 3 — Compound Components + Context</Styled.H2>
                <Styled.Small>
                    Subcomponents read shared state via context. Still headless—no fixed styles.
                </Styled.Small>
                <Styled.Pre>
                    {`const SelectContext = React.createContext(null);

function SelectRoot({ value, defaultValue, onChange, children }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;

  const set = React.useCallback((next) => {
    const v = typeof next === "function" ? next(val) : next;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }, [isControlled, val, onChange]);

  const api = React.useMemo(() => ({ value: val, set }), [val, set]);
  return <SelectContext.Provider value={api}>{children}</SelectContext.Provider>;
}

function SelectButton({ children, ...rest }) {
  const { value } = React.useContext(SelectContext);
  return <button type="button" {...rest}>{children ?? String(value)}</button>;
}

function SelectOption({ value, children, ...rest }) {
  const select = React.useContext(SelectContext);
  const selected = select.value === value;
  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={() => select.set(value)}
      {...rest}
    >
      {children ?? String(value)}
    </div>
  );
}

// Usage (any markup/styles)
function SizeChooser() {
  return (
    <SelectRoot defaultValue="M">
      <SelectButton className="btn">Current size</SelectButton>
      <div className="list">
        <SelectOption value="S" className="item">Small</SelectOption>
        <SelectOption value="M" className="item">Medium</SelectOption>
        <SelectOption value="L" className="item">Large</SelectOption>
      </div>
    </SelectRoot>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Compound components</b> give a natural API: <code>{`<SelectRoot>`}</code>,
                    <code>{`<SelectButton>`}</code>, <code>{`<SelectOption>`}</code> without imposing visuals.
                </Styled.Small>
            </Styled.Section>

            {/* 6) State Reducer control (advanced) */}
            <Styled.Section>
                <Styled.H2>Advanced: State Reducer</Styled.H2>
                <Styled.Small>
                    A <b>state reducer</b> lets the parent intercept internal updates. Useful for logging,
                    custom rules, or integrating with external stores.
                </Styled.Small>
                <Styled.Pre>
                    {`function useHeadlessCounter({ initial = 0, stateReducer } = {}) {
  const [state, setState] = React.useState({ count: initial });

  const apply = React.useCallback((changes, actionType) => {
    const next = typeof stateReducer === "function"
      ? stateReducer(state, changes, actionType)
      : { ...state, ...changes };
    setState(next);
  }, [state, stateReducer]);

  const inc = () => apply({ count: state.count + 1 }, "increment");
  const dec = () => apply({ count: state.count - 1 }, "decrement");

  return { count: state.count, inc, dec };
}

// Parent can customize:
const reducer = (state, changes, type) => {
  if (type === "increment" && state.count >= 10) return state; // clamp
  return { ...state, ...changes };
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> document the API surface clearly (props, returned values, events).</li>
                    <li><b>Do</b> support both controlled and uncontrolled usage when practical.</li>
                    <li><b>Do</b> provide accessibility helpers (roles/ids/keyboard behavior) for interactive widgets.</li>
                    <li><b>Don't</b> ship hardcoded markup/CSS—keep visuals to the consumer.</li>
                    <li><b>Don't</b> leak internal DOM refs unless intentional; expose safe callbacks and props getters.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Testing */}
            <Styled.Section>
                <Styled.H2>Testing Headless Components</Styled.H2>
                <Styled.List>
                    <li>
                        Test <em>observable behavior</em>: state changes, invoked callbacks, and ARIA attributes—
                        not internal implementation details.
                    </li>
                    <li>
                        For render-prop components, mount with simple test UIs and assert keyboard/mouse flows.
                    </li>
                    <li>
                        Validate both controlled and uncontrolled modes and any state-reducer logic.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Headless:</b> logic-only; no fixed UI.</li>
                    <li><b>Render prop:</b> children-as-function to render custom UI from provided API.</li>
                    <li><b>Compound components:</b> coordinated subcomponents communicating via context.</li>
                    <li><b>Controlled:</b> parent owns state via props; <b>Uncontrolled:</b> internal state managed by component.</li>
                    <li><b>State reducer:</b> parent-injected function that modifies how internal updates apply.</li>
                    <li><b>ARIA:</b> accessibility attributes that describe custom widgets to assistive tech.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: headless components let you reuse robust behavior while keeping visual freedom.
                Start with a logic-only hook or a render-prop/compound architecture, expose a clean API,
                support controlled/uncontrolled, and ship ARIA helpers for accessible, flexible UIs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default HeadlessComponents;
