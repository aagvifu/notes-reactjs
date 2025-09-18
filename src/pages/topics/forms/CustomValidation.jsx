// src/pages/topics/forms/CustomValidation.jsx
import React from "react";
import { Styled } from "./styled";

const CustomValidation = () => {
    return (
        <Styled.Page>
            <Styled.Title>Custom Validation</Styled.Title>

            <Styled.Lead>
                <b>Custom validation</b> means implementing your own rules and messages (in addition to or
                instead of the browser’s built-in HTML5 validation). You decide <i>what</i> is valid, <i>when</i> to
                validate (change/blur/submit), and <i>how</i> to show errors—while keeping the server as the final authority.
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Constraint validation API:</b> native browser checks (e.g., <Styled.InlineCode>required</Styled.InlineCode>, <Styled.InlineCode>minLength</Styled.InlineCode>, <Styled.InlineCode>type="email"</Styled.InlineCode>).</li>
                    <li><b>Custom validation:</b> app-defined rules (sync/async) that go beyond HTML5 (e.g., password strength, business rules, reserved names).</li>
                    <li><b>Client vs server:</b> client improves UX; the server must re-validate for security/integrity.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Strategies */}
            <Styled.Section>
                <Styled.H2>Strategies</Styled.H2>
                <Styled.List>
                    <li><b>Controlled</b> (state driven): inputs mirror React state; run validators on change/blur/submit and render errors from state.</li>
                    <li><b>Uncontrolled</b> (ref driven): read values from the DOM; use native validity or <Styled.InlineCode>setCustomValidity</Styled.InlineCode>.</li>
                    <li><b>Hybrid:</b> use native constraints for simple cases; layer custom checks for complex rules.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) A tiny validator library */}
            <Styled.Section>
                <Styled.H2>Example: Small Validator Library (sync)</Styled.H2>
                <Styled.Pre>
                    {`// validators.js (concept)
export const required = (msg = "This field is required") => (v) =>
  (v ?? "").toString().trim() ? null : msg;

export const minLen = (n, msg) => (v) =>
  (v ?? "").length >= n ? null : (msg || \`Must be at least \${n} characters\`);

export const pattern = (re, msg = "Invalid format") => (v) =>
  re.test((v ?? "").toString()) ? null : msg;

export const compose = (...rules) => (value) => {
  for (const rule of rules) {
    const err = rule(value);
    if (err) return err; // return the first error
  }
  return null;
};

// Usage:
// const usernameRules = compose(required(), pattern(/^[a-z0-9_-]{3,16}$/i, "3-16 letters, digits, _ or -"));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Controlled form with custom rules */}
            <Styled.Section>
                <Styled.H2>Controlled Form with Custom Rules</Styled.H2>
                <Styled.Pre>
                    {`import React from "react";
import { required, minLen, pattern, compose } from "./validators";

const usernameRules = compose(
  required(),
  pattern(/^[a-z0-9_-]{3,16}$/i, "3-16 letters, digits, _ or -")
);

const passwordRules = compose(
  required(),
  minLen(8),
  pattern(/[A-Z]/, "Must include an uppercase letter"),
  pattern(/[0-9]/, "Must include a number"),
  pattern(/[^\\w\\s]/, "Must include a symbol")
);

export default function ExampleControlled() {
  const [values, setValues] = React.useState({ username: "", password: "" });
  const [touched, setTouched] = React.useState({ username: false, password: false });
  const [errors, setErrors] = React.useState({ username: null, password: null });

  function validateField(name, value) {
    const rule = name === "username" ? usernameRules : passwordRules;
    return rule(value);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
    if (touched[name]) {
      setErrors((s) => ({ ...s, [name]: validateField(name, value) }));
    }
  }

  function onBlur(e) {
    const { name, value } = e.target;
    setTouched((s) => ({ ...s, [name]: true }));
    setErrors((s) => ({ ...s, [name]: validateField(name, value) }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const nextErrors = {
      username: validateField("username", values.username),
      password: validateField("password", values.password),
    };
    setErrors(nextErrors);

    const firstInvalid = Object.entries(nextErrors).find(([, err]) => err);
    if (firstInvalid) {
      const [name] = firstInvalid;
      const el = e.currentTarget.querySelector(\`[name="\${name}"]\`);
      el?.focus();
      return;
    }

    // safe to submit to server now
    console.log("submit", values);
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="custom-title">
      <h4 id="custom-title">Create account</h4>

      <label>
        Username
        <input
          name="username"
          value={values.username}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "err-username" : undefined}
          autoComplete="username"
        />
      </label>
      {errors.username && (
        <div id="err-username" role="alert" aria-live="polite">{errors.username}</div>
      )}

      <label>
        Password
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "err-password" : undefined}
          autoComplete="new-password"
        />
      </label>
      {errors.password && (
        <div id="err-password" role="alert" aria-live="polite">{errors.password}</div>
      )}

      <button type="submit">Sign up</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Key ideas:</b> show errors after <i>blur</i> (touched) or on submit; focus the first invalid; render messages with <Styled.InlineCode>role="alert"</Styled.InlineCode> and <Styled.InlineCode>aria-invalid</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Uncontrolled with native API */}
            <Styled.Section>
                <Styled.H2>Uncontrolled Inputs with Native <code>setCustomValidity</code></Styled.H2>
                <Styled.Pre>
                    {`function ExampleUncontrolled() {
  const ref = React.useRef(null);

  function check(e) {
    const el = e.currentTarget;
    const value = el.value.trim();

    // Your custom rule
    if (value.includes("admin")) {
      el.setCustomValidity("“admin” is reserved");
    } else {
      el.setCustomValidity("");
    }
  }

  function onSubmit(e) {
    if (!ref.current?.checkValidity()) {
      e.preventDefault();
      // browser will show tooltip/outline unless form has noValidate
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input ref={ref} name="username" required onInput={check} />
      <button>Submit</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> <Styled.InlineCode>onInvalid</Styled.InlineCode> runs when a field fails validity—use it to customize messages or styling. Use <Styled.InlineCode>noValidate</Styled.InlineCode> on the form to fully control UX yourself.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Async checks (concept) */}
            <Styled.Section>
                <Styled.H2>Async Checks (Concept)</Styled.H2>
                <Styled.List>
                    <li><b>When:</b> username/email availability, coupon validity, OTP verification.</li>
                    <li><b>How:</b> debounce the request, show <i>pending</i> state, cancel stale calls, and surface server error messages.</li>
                    <li><b>Fallback:</b> always re-validate on the server after submit.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// pseudo: async validator (debounced elsewhere)
export const isAvailable = async (value) => {
  const res = await fetch(\`/api/check-username?u=\${encodeURIComponent(value)}\`);
  const json = await res.json();
  return json.ok ? null : "Username is taken";
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) UX & a11y */}
            <Styled.Section>
                <Styled.H2>UX & Accessibility</Styled.H2>
                <Styled.List>
                    <li>Validate on <b>blur</b> for first reveal, and on <b>change</b> thereafter for quick feedback.</li>
                    <li>Keep messages clear and actionable (“Include at least one number”), not generic (“Invalid”).</li>
                    <li>Link messages via <Styled.InlineCode>aria-describedby</Styled.InlineCode>; mark fields with <Styled.InlineCode>aria-invalid</Styled.InlineCode> when errors exist.</li>
                    <li>On submit, <b>focus the first invalid field</b> and optionally show a summary (<Styled.InlineCode>role="alert"</Styled.InlineCode>, <Styled.InlineCode>aria-live="assertive"</Styled.InlineCode>).</li>
                    <li>Do not block typing with aggressive rules; <b>validate, don’t police</b> (except for hard constraints like maxLength).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> centralize rules and reuse them across fields/pages.</li>
                    <li><b>Do</b> keep client and server rules aligned (same shape/messages where possible).</li>
                    <li><b>Do</b> handle i18n for messages early if you plan to localize.</li>
                    <li><b>Don’t</b> depend solely on client validation; the server must re-validate.</li>
                    <li><b>Don’t</b> show errors <i>while typing</i> before first blur—this feels hostile.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Touched:</b> a field that has received and then lost focus at least once.</li>
                    <li><b>Dirty:</b> a field whose value changed from its initial value.</li>
                    <li><b>Validity state:</b> the native flags like <Styled.InlineCode>valueMissing</Styled.InlineCode>, <Styled.InlineCode>typeMismatch</Styled.InlineCode>, <Styled.InlineCode>tooShort</Styled.InlineCode>, etc.</li>
                    <li><b>Custom error:</b> an error you set with <Styled.InlineCode>setCustomValidity</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: pair small, reusable validators with thoughtful UX. Validate on blur, update on
                change, focus the first invalid on submit, keep messages helpful, and always re-check on the server.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CustomValidation;
