import { Styled } from "./styled";

const Uncontrolled = () => {
    return (
        <Styled.Page>
            <Styled.Title>Uncontrolled Inputs</Styled.Title>

            <Styled.Lead>
                <b>Uncontrolled inputs</b> let the browser manage the input’s current value, while React
                reads that value only when needed (e.g., on submit). You don’t pass a{" "}
                <Styled.InlineCode>value</Styled.InlineCode> prop; instead you use{" "}
                <Styled.InlineCode>defaultValue</Styled.InlineCode> /{" "}
                <Styled.InlineCode>defaultChecked</Styled.InlineCode> for initial state and read the value
                via a <Styled.InlineCode>ref</Styled.InlineCode>, the event target, or{" "}
                <Styled.InlineCode>FormData</Styled.InlineCode>.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled input:</b> React holds the source of truth in state and sets{" "}
                        <Styled.InlineCode>value</Styled.InlineCode> each render; user edits call{" "}
                        <Styled.InlineCode>setState</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Uncontrolled input:</b> the browser holds the current value; React only{" "}
                        <em>reads</em> it when necessary (submit, validation, etc.).
                    </li>
                    <li>
                        <b>Initial value:</b> use <Styled.InlineCode>defaultValue</Styled.InlineCode> (text-like)
                        and <Styled.InlineCode>defaultChecked</Styled.InlineCode> (checkbox/radio) to set the
                        starting value for uncontrolled fields.
                    </li>
                    <li>
                        <b>Ref:</b> a handle to a DOM node created with{" "}
                        <Styled.InlineCode>React.useRef()</Styled.InlineCode> or a callback ref; lets you access{" "}
                        <Styled.InlineCode>input.value</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>files</Styled.InlineCode>, call{" "}
                        <Styled.InlineCode>focus()</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>form.reset()</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        <b>FormData:</b> browser API that collects values from a{" "}
                        <Styled.InlineCode>&lt;form&gt;</Styled.InlineCode> using each field’s{" "}
                        <Styled.InlineCode>name</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic example with refs */}
            <Styled.Section>
                <Styled.H2>Basic Example (ref + defaultValue)</Styled.H2>
                <Styled.Pre>
                    {`function SignupForm() {
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    console.log({ name, email }); // send to API
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" defaultValue="Ash" ref={nameRef} />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" ref={emailRef} />

      <button type="submit">Create account</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The browser keeps the current value. React only reads it on submit via{" "}
                    <Styled.InlineCode>ref.current.value</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Using FormData */}
            <Styled.Section>
                <Styled.H2>Reading Values with <code>FormData</code></Styled.H2>
                <Styled.Pre>
                    {`function ContactForm() {
  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget); // e.currentTarget is the <form>
    const data = Object.fromEntries(fd.entries());
    // data: { name: "...", email: "...", message: "..." }
    console.log(data);
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Full name" />
      <input name="email" type="email" placeholder="Email" />
      <textarea name="message" placeholder="Message" />
      <button>Send</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Works great for many fields. Ensure every field has a unique{" "}
                    <Styled.InlineCode>name</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Checkbox & radio (defaultChecked) */}
            <Styled.Section>
                <Styled.H2>Checkboxes &amp; Radios (Uncontrolled)</Styled.H2>
                <Styled.Pre>
                    {`function Options() {
  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log(fd.get("newsletter"));  // "on" if checked, otherwise null
    console.log(fd.get("plan"));        // "pro" | "basic" from the selected radio
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        <input type="checkbox" name="newsletter" defaultChecked />
        Subscribe to newsletter
      </label>

      <fieldset>
        <legend>Plan</legend>
        <label><input type="radio" name="plan" value="basic" defaultChecked /> Basic</label>
        <label><input type="radio" name="plan" value="pro" /> Pro</label>
      </fieldset>

      <button>Save</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>defaultChecked</Styled.InlineCode> for the initial checked state.
                </Styled.Small>
            </Styled.Section>

            {/* 5) File input */}
            <Styled.Section>
                <Styled.H2>File Inputs</Styled.H2>
                <Styled.List>
                    <li>
                        File inputs are <em>best</em> kept uncontrolled; read files via{" "}
                        <Styled.InlineCode>inputRef.current.files</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>FormData</Styled.InlineCode>.
                    </li>
                    <li>
                        For multiple files use <Styled.InlineCode>multiple</Styled.InlineCode> and iterate over{" "}
                        <Styled.InlineCode>FileList</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function AvatarUpload() {
  const fileRef = React.useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    // fetch("/upload", { method: "POST", body: fd })
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="avatar" accept="image/*" ref={fileRef} />
      <button>Upload</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Resetting */}
            <Styled.Section>
                <Styled.H2>Resetting Uncontrolled Forms</Styled.H2>
                <Styled.List>
                    <li>
                        Call <Styled.InlineCode>formRef.current.reset()</Styled.InlineCode> to revert fields to
                        their initial <Styled.InlineCode>default*</Styled.InlineCode> values.
                    </li>
                    <li>
                        Alternatively, change a <Styled.InlineCode>key</Styled.InlineCode> on the form to force a
                        remount (re-applies defaults).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ResettableForm() {
  const formRef = React.useRef(null);

  function onResetClick() {
    formRef.current?.reset(); // back to defaults
  }

  return (
    <form ref={formRef}>
      <input name="title" defaultValue="Hello" />
      <textarea name="body" defaultValue="Write something..." />
      <button type="button" onClick={onResetClick}>Reset</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) When to use uncontrolled */}
            <Styled.Section>
                <Styled.H2>When to Use Uncontrolled Inputs</Styled.H2>
                <Styled.List>
                    <li>Simple forms submitted as whole units (read values only on submit).</li>
                    <li>Performance-sensitive UIs where per-keystroke React updates are unnecessary.</li>
                    <li>File inputs and large text areas not needing live validation.</li>
                    <li>Integrations with non-React code (vanilla widgets) where DOM owns the value.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Pitfalls & gotchas */}
            <Styled.Section>
                <Styled.H2>Pitfalls &amp; Gotchas</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Mixing modes:</b> Don’t switch an input from uncontrolled to controlled (or vice
                        versa). If you set a <Styled.InlineCode>value</Styled.InlineCode> prop after initial
                        render, React warns. Pick one approach.
                    </li>
                    <li>
                        <b>Wrong prop:</b> For uncontrolled, use{" "}
                        <Styled.InlineCode>defaultValue</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>defaultChecked</Styled.InlineCode>, not{" "}
                        <Styled.InlineCode>value</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>checked</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Validation timing:</b> Without React state, you can’t show real-time “as-you-type”
                        errors easily. Use native HTML5 validation or validate on submit/blur.
                    </li>
                    <li>
                        <b>Parsing:</b> <Styled.InlineCode>type="number"</Styled.InlineCode> still yields{" "}
                        <em>strings</em> from <Styled.InlineCode>value</Styled.InlineCode>. Cast as needed.
                    </li>
                    <li>
                        <b>Names required:</b> <Styled.InlineCode>FormData</Styled.InlineCode> only includes
                        elements with a <Styled.InlineCode>name</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Patterns */}
            <Styled.Section>
                <Styled.H2>Helpful Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Hybrid read-only:</b> Keep input uncontrolled but read{" "}
                        <Styled.InlineCode>onBlur</Styled.InlineCode> to sync into React state if/when needed.
                    </li>
                    <li>
                        <b>Native validation:</b> Use <Styled.InlineCode>required</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>minLength</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>pattern</Styled.InlineCode> and read{" "}
                        <Styled.InlineCode>form.checkValidity()</Styled.InlineCode> or rely on browser UI.
                    </li>
                    <li>
                        <b>Accessibility:</b> Always pair inputs with <Styled.InlineCode>&lt;label&gt;</Styled.InlineCode>, use{" "}
                        <Styled.InlineCode>id</Styled.InlineCode> + <Styled.InlineCode>htmlFor</Styled.InlineCode>, group radios in{" "}
                        <Styled.InlineCode>&lt;fieldset&gt;</Styled.InlineCode>/<Styled.InlineCode>&lt;legend&gt;</Styled.InlineCode>, and set{" "}
                        <Styled.InlineCode>aria-invalid</Styled.InlineCode> on errors.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>defaultValue/defaultChecked:</b> initial value for uncontrolled inputs, applied on
                        mount.
                    </li>
                    <li>
                        <b>ref (DOM ref):</b> handle to a DOM element; access value, files, call methods.
                    </li>
                    <li>
                        <b>FormData:</b> API that reads values from named controls in a form.
                    </li>
                    <li>
                        <b>reset():</b> resets a form’s controls to their default values.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use uncontrolled inputs when you don’t need per-keystroke React state. Initialize
                with <i>default*</i> props, read values via refs or FormData, lean on native validation, and
                avoid switching between controlled and uncontrolled modes.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Uncontrolled;
