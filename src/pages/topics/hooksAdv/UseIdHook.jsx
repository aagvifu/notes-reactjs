import React from "react";
import { Styled } from "./styled";

const UseIdHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useId</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useId()</Styled.InlineCode> returns a <b>stable, unique ID string per component instance</b>,
                consistent across server and client. Use it to wire up accessible relationships (<em>label ↔ input</em>,
                <em>aria-describedby</em>, <em>aria-labelledby</em>, SVG defs, etc.). Not for list keys or persistence.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const id = useId(); // -> string like ":r1:", stable for this instance`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>Stable per instance:</b> the value stays the same for the lifetime of the component.</li>
                    <li><b>SSR-safe:</b> React ensures the same ID on server and client to avoid hydration mismatches.</li>
                    <li><b>Derived IDs:</b> create multiple related IDs from one base (e.g., <Styled.InlineCode>\`\${`id`}-label\`</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic accessibility: label ↔ input */}
            <Styled.Section>
                <Styled.H2>Form labels (accessible association)</Styled.H2>
                <Styled.Pre>
                    {`import { useId } from "react";

function EmailField() {
  const id = useId();                    // base
  const inputId = id + "-input";         // derived
  const helpId  = id + "-help";          // derived

  return (
    <div>
      <label htmlFor={inputId}>Email</label>
      <input id={inputId} type="email" aria-describedby={helpId} />
      <small id={helpId}>We'll never share your email.</small>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    One call to <code>useId</code> can safely drive multiple IDs for related elements.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Multiple IDs from a single base */}
            <Styled.Section>
                <Styled.H2>Multiple related IDs (memoize the bundle)</Styled.H2>
                <Styled.Pre>
                    {`function PriceInput() {
  const base = React.useId();
  const ids = React.useMemo(() => ({
    label: base + "-label",
    input: base + "-input",
    hint:  base + "-hint",
  }), [base]);

  return (
    <div>
      <label id={ids.label} htmlFor={ids.input}>Price</label>
      <input id={ids.input} aria-labelledby={ids.label} aria-describedby={ids.hint} inputMode="decimal" />
      <small id={ids.hint}>Numbers only, no currency symbol.</small>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) useId in lists (each item has its own component instance) */}
            <Styled.Section>
                <Styled.H2>Using <code>useId</code> in lists</Styled.H2>
                <Styled.Pre>
                    {`function TodoItem({ todo }) {
  const id = React.useId();
  const checkboxId = id + "-chk";
  return (
    <li>
      <input id={checkboxId} type="checkbox" defaultChecked={todo.done} />
      <label htmlFor={checkboxId}>{todo.text}</label>
    </li>
  );
}

function TodoList({ items }) {
  return <ul>{items.map(t => <TodoItem key={t.id} todo={t} />)}</ul>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Safe to call inside each item component. <b>Do not</b> use <code>useId</code> for React <code>key</code>s; use stable data keys (e.g., database IDs).
                </Styled.Small>
            </Styled.Section>

            {/* 5) SVG defs / gradients (avoid collisions) */}
            <Styled.Section>
                <Styled.H2>SVG <code>&lt;defs&gt;</code> IDs (no collisions)</Styled.H2>
                <Styled.Pre>
                    {`function Avatar({ src }) {
  const id = React.useId();
  const clipId = id + "-clip";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" role="img" aria-label="Avatar">
      <defs>
        <clipPath id={clipId}>
          <circle cx="24" cy="24" r="22" />
        </clipPath>
      </defs>
      <image href={src} width="48" height="48" clipPath={"url(#" + clipId + ")"} />
    </svg>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Each instance gets unique IDs, preventing clashes when multiple avatars render on the same page.</Styled.Small>
            </Styled.Section>

            {/* 6) SSR/hydration notes */}
            <Styled.Section>
                <Styled.H2>SSR & hydration notes</Styled.H2>
                <Styled.List>
                    <li><b>Consistent IDs:</b> <code>useId</code> avoids mismatches between server-rendered markup and client hydration.</li>
                    <li>Ensure hooks are called in the same order on server and client; conditional hooks can break stability.</li>
                    <li>Do not serialize <code>useId</code> values to store in databases or URLs; they are instance-local, not durable.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Patterns & recipes */}
            <Styled.Section>
                <Styled.H2>Patterns & recipes</Styled.H2>
                <Styled.Pre>
                    {`// 1) Fieldset with described-by and error id
function Field({ label, error, children }) {
  const id = React.useId();
  const inputId = id + "-input";
  const errId   = id + "-error";
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      {React.cloneElement(children, { id: inputId, "aria-describedby": error ? errId : undefined })}
      {error && <div id={errId} role="alert">{error}</div>}
    </div>
  );
}

// 2) Tabs (aria-controls, aria-labelledby)
function Tab({ idBase, isActive, onSelect, children }) {
  const tabId = idBase + "-tab";
  const panelId = idBase + "-panel";
  return (
    <>
      <button id={tabId} aria-controls={panelId} aria-selected={isActive} onClick={onSelect}>
        {children}
      </button>
      {isActive && <div id={panelId} role="tabpanel" aria-labelledby={tabId}>Panel</div>}
    </>
  );
}
function Tabs() {
  const base = React.useId();
  // pass base down to derive related ids in a stable way
  return <Tab idBase={base} isActive onSelect={() => {}}>First</Tab>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Using <code>useId</code> for <b>React keys</b> — keys must come from data, not generated per render.</li>
                    <li>Expecting <code>useId</code> to be stable across sessions or page loads — it is not a persistent identifier.</li>
                    <li>Calling hooks conditionally and changing the order → breaks stability (and violates the Rules of Hooks).</li>
                    <li>Generating a new object for <code>value</code> on every render when passing IDs via context; memoize bundles if needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <code>useId</code> to connect form controls and ARIA relationships.</li>
                    <li><b>Do</b> derive multiple related IDs from a single base and memoize if bundling.</li>
                    <li><b>Do</b> use it for SSR-safe uniqueness (forms, SVG defs, aria attributes).</li>
                    <li><b>Don’t</b> use it for list keys, database IDs, or anything that must persist outside the component.</li>
                    <li><b>Don’t</b> call it conditionally; keep hook order consistent.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useId</Styled.InlineCode> provides SSR-safe unique IDs for accessibility and DOM
                associations. Derive related IDs from one base, avoid using it for keys or persistence, and keep hook order consistent.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseIdHook;
