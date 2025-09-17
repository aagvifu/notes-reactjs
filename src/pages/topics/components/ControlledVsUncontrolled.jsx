import React from "react";
import { Styled } from "./styled";

const ControlledVsUncontrolled = () => {
    return (
        <Styled.Page>
            <Styled.Title>Controlled vs Uncontrolled</Styled.Title>
            <Styled.Lead>
                Form inputs can be handled in two ways: <b>controlled</b> (React state is
                the source of truth) or <b>uncontrolled</b> (the DOM input keeps its own value
                and React reads it when needed). Pick deliberately based on validation,
                UX, and performance needs.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled input:</b> an input whose displayed value comes from React state via{" "}
                        <Styled.InlineCode>value</Styled.InlineCode>/<Styled.InlineCode>checked</Styled.InlineCode>. Changes are handled by{" "}
                        <Styled.InlineCode>onChange</Styled.InlineCode> which updates state. React state is the <em>source of truth</em>.
                    </li>
                    <li>
                        <b>Uncontrolled input:</b> an input that manages its own value internally. Initial value is set with{" "}
                        <Styled.InlineCode>defaultValue</Styled.InlineCode>/<Styled.InlineCode>defaultChecked</Styled.InlineCode>. Read the value via the DOM (refs) or form submission.
                    </li>
                    <li>
                        <b>Source of truth:</b> where the canonical value lives—React state for controlled, the DOM for uncontrolled.
                    </li>
                    <li>
                        <b>Ref:</b> an object with <Styled.InlineCode>.current</Styled.InlineCode> used to imperatively access a DOM node or component instance.
                    </li>
                    <li>
                        <b>Validation:</b> checking user input rules (required, pattern, min/max) either with native HTML attributes or custom logic.
                    </li>
                    <li>
                        <b>Hydration mismatch (SSR):</b> when server-rendered markup/values differ from the first client render, React warns. Consistent controlled/uncontrolled choice avoids this.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Controlled basic */}
            <Styled.Section>
                <Styled.H2>Controlled inputs (basic)</Styled.H2>
                <Styled.Pre>
                    {`import { useState } from "react";

function SignupControlled() {
  const [name, setName] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    console.log({ name, newsletter }); // values from React state
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />

      <label>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
        />
        Subscribe
      </label>

      <button type="submit">Create</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Benefits: real-time validation, conditional UI, masking/formatting, single place (state) to read/modify values.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Uncontrolled basic */}
            <Styled.Section>
                <Styled.H2>Uncontrolled inputs (basic)</Styled.H2>
                <Styled.Pre>
                    {`import { useRef } from "react";

function SignupUncontrolled() {
  const nameRef = useRef(null);
  const newsRef = useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,           // read from DOM
      newsletter: newsRef.current.checked    // read from DOM
    };
    console.log(payload);
    e.target.reset(); // native reset clears uncontrolled inputs
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" defaultValue="" ref={nameRef} autoComplete="name" />
      <label>
        <input type="checkbox" defaultChecked={false} ref={newsRef} />
        Subscribe
      </label>
      <button type="submit">Create</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Benefits: minimal state wiring, good for large/rarely-validated forms or simple “read on submit” flows. Native
                    browser features (autofill, undo) work naturally.
                </Styled.Small>
            </Styled.Section>

            {/* 4) When to choose which */}
            <Styled.Section>
                <Styled.H2>When to choose which</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Choose controlled</b> when UI reacts to every keystroke: live validation, formatting (masks), conditional enable/disable, character counters, instant previews, search-as-you-type, multi-field dependencies.
                    </li>
                    <li>
                        <b>Choose uncontrolled</b> when reading values only on submit, for large forms with simple rules, performance-sensitive inputs that don’t need per-keystroke logic, or special inputs like file pickers.
                    </li>
                    <li>
                        <b>Hybrid</b>: uncontrolled for keystrokes, but sync to state on <Styled.InlineCode>onBlur</Styled.InlineCode> or submit. Another hybrid is controlled value plus debounced side effects.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Edge cases & patterns */}
            <Styled.Section>
                <Styled.H2>Edge cases & practical patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Number inputs:</b> input values are strings; convert safely (allow empty). Use <Styled.InlineCode>inputMode="numeric"</Styled.InlineCode> and/or <Styled.InlineCode>pattern</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Checkbox/Radio:</b> controlled via <Styled.InlineCode>checked</Styled.InlineCode> (not <Styled.InlineCode>value</Styled.InlineCode>), read <Styled.InlineCode>e.target.checked</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Select:</b> controlled via <Styled.InlineCode>value</Styled.InlineCode>; multiple select uses an <Styled.InlineCode>array</Styled.InlineCode> of selected values.
                    </li>
                    <li>
                        <b>File inputs:</b> keep <em>uncontrolled</em>. Access files via <Styled.InlineCode>e.target.files</Styled.InlineCode> or a ref. Browsers restrict programmatic setting for security.
                    </li>
                    <li>
                        <b>IME/composition</b> (e.g., Chinese/Japanese): avoid blocking updates; let the browser complete composition before formatting text.
                    </li>
                    <li>
                        <b>Debouncing:</b> keep input controlled but debounce expensive effects (search/filter) rather than keystroke updates themselves.
                    </li>
                    <li>
                        <b>Focus management:</b> use refs to focus/scroll to invalid fields on submit.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Number input: allow empty string; parse only when non-empty
const [age, setAge] = React.useState("");
function onAgeChange(e) {
  const v = e.target.value;         // string
  if (v === "" || /^[0-9]+$/.test(v)) setAge(v);
}
const ageNum = age === "" ? undefined : Number(age);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Avoid switching modes */}
            <Styled.Section>
                <Styled.H2>Avoid switching controlled ↔ uncontrolled</Styled.H2>
                <Styled.List>
                    <li>
                        React warns if an input changes from uncontrolled to controlled (or back). Keep the mode consistent.
                    </li>
                    <li>
                        <b>Controlled rule:</b> always pass <Styled.InlineCode>value</Styled.InlineCode>/<Styled.InlineCode>checked</Styled.InlineCode>. Use <Styled.InlineCode>""</Styled.InlineCode> (empty string) rather than <Styled.InlineCode>undefined</Styled.InlineCode> for text inputs.
                    </li>
                    <li>
                        <b>Uncontrolled rule:</b> don’t pass <Styled.InlineCode>value</Styled.InlineCode>; set only <Styled.InlineCode>defaultValue</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Bad: sometimes undefined, sometimes string → switches mode
<input value={maybeUndefined} onChange={...} />

// ✅ Good controlled: always a string ("" for empty)
<input value={text} onChange={e => setText(e.target.value)} />

// ✅ Good uncontrolled: use defaultValue once; read via ref
<input defaultValue="initial" ref={ref} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Validation patterns */}
            <Styled.Section>
                <Styled.H2>Validation patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Native:</b> use <Styled.InlineCode>required</Styled.InlineCode>, <Styled.InlineCode>minLength</Styled.InlineCode>, <Styled.InlineCode>pattern</Styled.InlineCode>. Read{" "}
                        <Styled.InlineCode>input.validity</Styled.InlineCode> for details and show messages in an{" "}
                        <Styled.InlineCode>aria-live="polite"</Styled.InlineCode> region.
                    </li>
                    <li>
                        <b>Controlled custom:</b> validate on change/blur and set <Styled.InlineCode>aria-invalid</Styled.InlineCode>, link help text with{" "}
                        <Styled.InlineCode>aria-describedby</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Forms at scale:</b> consider form libraries (react-hook-form, Formik, React Aria components, etc.) that handle touched, errors, and performance.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Field({ value, onChange, label, id, error }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + "-err" : undefined}
      />
      {error && <small id={id + "-err"} aria-live="polite">{error}</small>}
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Hybrid patterns */}
            <Styled.Section>
                <Styled.H2>Hybrid patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Blur commit:</b> uncontrolled during typing, commit to state on <Styled.InlineCode>onBlur</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Keyed reset:</b> uncontrolled field where resetting is done by changing a <Styled.InlineCode>key</Styled.InlineCode> on the input.
                    </li>
                    <li>
                        <b>Debounced effects:</b> controlled value but side effects (API calls) are debounced/throttled.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Blur commit example
function BlurCommit() {
  const ref = React.useRef(null);
  const [committed, setCommitted] = React.useState("");
  return (
    <>
      <input defaultValue="" ref={ref} onBlur={() => setCommitted(ref.current.value)} />
      <p>Committed: {committed}</p>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) SSR/Hydration notes */}
            <Styled.Section>
                <Styled.H2>SSR & hydration notes</Styled.H2>
                <Styled.List>
                    <li>Keep the mode and initial value consistent on server and client.</li>
                    <li>For controlled text inputs, ensure the client’s initial state matches the HTML or React will warn.</li>
                    <li>For uncontrolled, prefer <Styled.InlineCode>defaultValue</Styled.InlineCode> so the DOM owns the initial value on both sides.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> pick one mode per field and stick to it.</li>
                    <li><b>Do</b> use controlled for live validation/formatting and complex interactions.</li>
                    <li><b>Do</b> keep controlled values as strings (parse later); for checkboxes use <Styled.InlineCode>checked</Styled.InlineCode>.</li>
                    <li><b>Do</b> keep file inputs uncontrolled and read via <Styled.InlineCode>files</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> switch controlled ↔ uncontrolled mid-lifecycle.</li>
                    <li><b>Don’t</b> use <Styled.InlineCode>value</Styled.InlineCode> without an <Styled.InlineCode>onChange</Styled.InlineCode> handler (field becomes read-only).</li>
                    <li><b>Don’t</b> eagerly coerce to numbers; allow empty strings to avoid jitter and cursor bugs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: controlled inputs give full, immediate control and visibility; uncontrolled inputs are simple and
                performant when values are only needed at specific times. Choose based on UX, validation, and scale, and keep
                the mode consistent to avoid warnings and subtle bugs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ControlledVsUncontrolled;
