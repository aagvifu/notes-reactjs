import { Styled } from "./styled";

const Html5Validation = () => {
    return (
        <Styled.Page>
            <Styled.Title>HTML5 Validation (Constraint Validation)</Styled.Title>

            <Styled.Lead>
                <b>HTML5 form validation</b> (a.k.a. <i>Constraint Validation</i>) is the browser’s built-in
                system that checks input values against constraints like <Styled.InlineCode>required</Styled.InlineCode>,
                <Styled.InlineCode>type</Styled.InlineCode>, <Styled.InlineCode>pattern</Styled.InlineCode>,
                <Styled.InlineCode>min</Styled.InlineCode>/<Styled.InlineCode>max</Styled.InlineCode>, etc. It shows native error UI,
                sets CSS states (<Styled.InlineCode>:invalid</Styled.InlineCode>, <Styled.InlineCode>:valid</Styled.InlineCode>), and exposes a JS API
                (<Styled.InlineCode>checkValidity()</Styled.InlineCode>, <Styled.InlineCode>reportValidity()</Styled.InlineCode>, <Styled.InlineCode>setCustomValidity()</Styled.InlineCode>).
                In React, you still rely on the browser engine—React just wires events to your handlers.
            </Styled.Lead>

            {/* 1) What is constraint validation? */}
            <Styled.Section>
                <Styled.H2>What is it & why use it?</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> A standard that lets the browser validate form controls based on declarative constraints.</li>
                    <li><b>Benefits:</b> Zero-JS for common checks, consistent keyboard and screen-reader behavior, instant feedback.</li>
                    <li><b>Limits:</b> Native messages & UI vary by browser/locale; complex rules often need custom logic or a library.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core attributes (constraints) */}
            <Styled.Section>
                <Styled.H2>Core Constraints (Attributes)</Styled.H2>
                <Styled.List>
                    <li><b>required</b> — value must be non-empty.</li>
                    <li><b>type</b> — built-in checks for <Styled.InlineCode>email</Styled.InlineCode>, <Styled.InlineCode>url</Styled.InlineCode>, <Styled.InlineCode>number</Styled.InlineCode>, <Styled.InlineCode>date</Styled.InlineCode>, etc.</li>
                    <li><b>min / max / step</b> — numeric/range/date limits (and step granularity).</li>
                    <li><b>minLength / maxLength</b> — string length bounds.</li>
                    <li><b>pattern</b> — regex that the value must match (anchors implied for the whole value).</li>
                    <li><b>multiple</b> — allows comma-separated emails/files to be multiple (where supported).</li>
                    <li><b>accept</b> (file) — hint for allowed MIME types/extensions (not strict validation).</li>
                    <li><b>autocomplete</b> — improves UX; not a validator but impacts native autofill.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Examples of declarative constraints
<input type="email" required />
<input type="number" min="1" max="10" step="2" />
<input type="text" minLength={3} maxLength={12} />
<input type="text" pattern="^[a-z][a-z0-9_-]{2,15}$" title="3–16 chars, start with a letter." />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Form-level flags */}
            <Styled.Section>
                <Styled.H2>Form-level Flags</Styled.H2>
                <Styled.List>
                    <li><b>noValidate</b> — disable native validation UI on submit (React prop: <Styled.InlineCode>noValidate</Styled.InlineCode>).</li>
                    <li><b>formNoValidate</b> — per-button opt-out (React prop on a submit button).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// React form that disables native validation popups
<form noValidate onSubmit={handleSubmit}>...</form>

// A submit button that skips validation just for that click
<button type="submit" formNoValidate>Save Draft</button>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) CSS states */}
            <Styled.Section>
                <Styled.H2>Styling with Pseudo-classes</Styled.H2>
                <Styled.List>
                    <li><b>:invalid / :valid</b> — overall validity.</li>
                    <li><b>:required / :optional</b> — presence of <Styled.InlineCode>required</Styled.InlineCode>.</li>
                    <li><b>:in-range / :out-of-range</b> — numbers/dates relative to <Styled.InlineCode>min</Styled.InlineCode>/<Styled.InlineCode>max</Styled.InlineCode>.</li>
                    <li><b>:placeholder-shown</b> — useful to avoid showing errors when nothing typed yet.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Example */
input:invalid { outline: 2px solid red; }
input:valid { outline: 2px solid green; }
input:required:placeholder-shown { outline-color: transparent; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Constraint Validation API */}
            <Styled.Section>
                <Styled.H2>Constraint Validation API</Styled.H2>
                <Styled.List>
                    <li><b>checkValidity()</b> — returns <Styled.InlineCode>true/false</Styled.InlineCode> without showing messages.</li>
                    <li><b>reportValidity()</b> — like <Styled.InlineCode>checkValidity()</Styled.InlineCode> but shows native messages.</li>
                    <li><b>setCustomValidity(msg)</b> — set/clear (<i>empty string clears</i>) a custom error on a control.</li>
                    <li><b>validity</b> — a <i>ValidityState</i> object: <Styled.InlineCode>valueMissing</Styled.InlineCode>, <Styled.InlineCode>typeMismatch</Styled.InlineCode>, <Styled.InlineCode>tooShort</Styled.InlineCode>, <Styled.InlineCode>tooLong</Styled.InlineCode>, <Styled.InlineCode>patternMismatch</Styled.InlineCode>, <Styled.InlineCode>rangeUnderflow</Styled.InlineCode>, <Styled.InlineCode>rangeOverflow</Styled.InlineCode>, <Styled.InlineCode>stepMismatch</Styled.InlineCode>, <Styled.InlineCode>badInput</Styled.InlineCode>, <Styled.InlineCode>customError</Styled.InlineCode>, <Styled.InlineCode>valid</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Checking a single control
const ok = inputRef.current.checkValidity();

// Showing messages for the whole form
formRef.current.reportValidity();

// Custom message
if (emailRef.current.validity.typeMismatch) {
  emailRef.current.setCustomValidity("Please enter a valid email like name@example.com");
  emailRef.current.reportValidity();
} else {
  emailRef.current.setCustomValidity(""); // clear
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) React patterns */}
            <Styled.Section>
                <Styled.H2>React Patterns & Events</Styled.H2>
                <Styled.List>
                    <li><b>onInvalid</b> — fires when a control becomes invalid (bubble); great place to set custom messages.</li>
                    <li><b>onInput / onChange</b> — clear custom errors as the user types (<Styled.InlineCode>setCustomValidity("")</Styled.InlineCode>).</li>
                    <li><b>Controlled vs. Uncontrolled:</b> Either approach works with native validation. Don’t fight the browser—use the attributes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function EmailField() {
  const ref = React.useRef(null);

  function handleInvalid(e) {
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity("Email is required");
    } else if (e.target.validity.typeMismatch) {
      e.target.setCustomValidity("That doesn't look like an email");
    }
  }

  function handleInput(e) {
    // Clear any previous custom message once the user changes the value
    e.target.setCustomValidity("");
  }

  return (
    <label>
      Email
      <input
        ref={ref}
        type="email"
        required
        onInvalid={handleInvalid}
        onInput={handleInput}
        aria-describedby="email-help"
      />
      <small id="email-help">We’ll never share your email.</small>
    </label>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) End-to-end examples */}
            <Styled.Section>
                <Styled.H2>Examples</Styled.H2>

                <Styled.H3>Basic: required + email + minLength</Styled.H3>
                <Styled.Pre>
                    {`function BasicForm() {
  function onSubmit(e) {
    // Let the browser validate first; if invalid, it will block submit
    if (!e.currentTarget.checkValidity()) {
      e.preventDefault();
      e.currentTarget.reportValidity();
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email
        <input type="email" required minLength={5} placeholder="name@example.com" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}`}
                </Styled.Pre>

                <Styled.H3>Username with pattern + custom message</Styled.H3>
                <Styled.Pre>
                    {`function Username() {
  function onInvalid(e) {
    if (e.target.validity.patternMismatch) {
      e.target.setCustomValidity("3–16 chars, letters first, letters/numbers/_/- allowed.");
    } else if (e.target.validity.valueMissing) {
      e.target.setCustomValidity("Please choose a username.");
    }
  }
  function onInput(e){ e.target.setCustomValidity(""); }

  return (
    <label>
      Username
      <input
        type="text"
        required
        pattern="^[a-zA-Z][a-zA-Z0-9_-]{2,15}$"
        onInvalid={onInvalid}
        onInput={onInput}
        aria-describedby="uhelp"
      />
      <small id="uhelp">Allowed: letters, numbers, _ and - (3–16 chars).</small>
    </label>
  );
}`}
                </Styled.Pre>

                <Styled.H3>Opting out of native UI (custom flow)</Styled.H3>
                <Styled.Pre>
                    {`function CustomValidationForm() {
  const [errors, setErrors] = React.useState({});

  function validate(form) {
    const errs = {};
    const name = form.elements.name;
    if (!name.value.trim()) errs.name = "Name is required";
    const age = form.elements.age;
    const n = Number(age.value);
    if (!Number.isFinite(n) || n < 18) errs.age = "Age must be 18+";
    return errs;
  }

  function onSubmit(e) {
    e.preventDefault(); // opt-out
    const form = e.currentTarget;
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // proceed (send to server)
    }
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" aria-invalid={!!errors.name} aria-describedby="name-err" />
      </label>
      {errors.name && <div id="name-err" role="alert">{errors.name}</div>}

      <label>
        Age
        <input name="age" inputMode="numeric" aria-invalid={!!errors.age} aria-describedby="age-err" />
      </label>
      {errors.age && <div id="age-err" role="alert">{errors.age}</div>}

      <button type="submit">Save</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Accessibility & UX */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX</Styled.H2>
                <Styled.List>
                    <li><b>Always pair</b> <Styled.InlineCode>&lt;label htmlFor&gt;</Styled.InlineCode> with <Styled.InlineCode>id</Styled.InlineCode> (or wrap input inside label).</li>
                    <li><b>Describe errors</b> near the field; connect with <Styled.InlineCode>aria-describedby</Styled.InlineCode> and mark invalid with <Styled.InlineCode>aria-invalid</Styled.InlineCode>.</li>
                    <li><b>Don’t rely on color alone</b>. Include text or icons with <Styled.InlineCode>role="alert"</Styled.InlineCode> for screen readers.</li>
                    <li><b>Don’t block submit preemptively</b>. Let users attempt submit and then show errors (better flow).</li>
                    <li><b>Localize</b> custom messages; native messages are auto-localized by the browser.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start with native attributes; add JS only when necessary.</li>
                    <li><b>Do</b> use <Styled.InlineCode>onInvalid</Styled.InlineCode>/<Styled.InlineCode>onInput</Styled.InlineCode> to manage custom messages.</li>
                    <li><b>Do</b> consider <Styled.InlineCode>noValidate</Styled.InlineCode> if using a custom validator/library.</li>
                    <li><b>Don’t</b> use <Styled.InlineCode>pattern</Styled.InlineCode> when <Styled.InlineCode>type</Styled.InlineCode> already covers the case (e.g., emails).</li>
                    <li><b>Don’t</b> hide errors off-screen or only in toasts; associate errors with fields.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Constraint:</b> a rule the value must satisfy (required, pattern, min/max, etc.).</li>
                    <li><b>ValidityState:</b> the object describing which constraint failed.</li>
                    <li><b>Native UI:</b> the browser’s built-in error popup/tooltip and focus behavior.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use HTML5’s constraints for fast, accessible validation. Style with pseudo-classes,
                customize messages with <i>Constraint Validation API</i>, and opt out (<Styled.InlineCode>noValidate</Styled.InlineCode>)
                when rolling your own or using libraries (React Hook Form, Formik, Yup/Zod).
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Html5Validation;
