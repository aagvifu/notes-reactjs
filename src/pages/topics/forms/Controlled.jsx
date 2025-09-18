import { Styled } from "./styled";

const Controlled = () => {
    return (
        <Styled.Page>
            <Styled.Title>Controlled Inputs</Styled.Title>

            <Styled.Lead>
                <b>Controlled inputs</b> are form elements whose value is driven by React state via a{" "}
                <Styled.InlineCode>value</Styled.InlineCode> (or <Styled.InlineCode>checked</Styled.InlineCode>) prop and an{" "}
                <Styled.InlineCode>onChange</Styled.InlineCode> handler. The UI becomes a pure function of state, enabling
                validation, formatting, and predictable behavior.
            </Styled.Lead>

            {/* 1) Definition & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled input:</b> React state is the <i>source of truth</i>. Render with{" "}
                        <Styled.InlineCode>value</Styled.InlineCode>/<Styled.InlineCode>checked</Styled.InlineCode>, update with{" "}
                        <Styled.InlineCode>onChange</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Uncontrolled input:</b> the DOM keeps the value internally; you read it via{" "}
                        <Styled.InlineCode>ref</Styled.InlineCode> (covered later).
                    </li>
                    <li>
                        <b>Why controlled?</b> Real-time validation, masking/formatting, single source of truth, easy reset,
                        deterministic UI, testability.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core Pattern */}
            <Styled.Section>
                <Styled.H2>Core Pattern</Styled.H2>
                <Styled.Pre>
                    {`function NameField() {
  const [name, setName] = React.useState(""); // keep text in React state
  return (
    <label>
      Name
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The input renders <Styled.InlineCode>value</Styled.InlineCode> from state; typing triggers{" "}
                    <Styled.InlineCode>onChange</Styled.InlineCode>, which updates state—and React re-renders.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Text: numbers, formatting, and empty string */}
            <Styled.Section>
                <Styled.H2>Text &amp; Number Inputs (strings, parsing, formatting)</Styled.H2>
                <Styled.List>
                    <li>
                        Inputs are <b>string-based</b>. For numeric fields, store the raw string to keep editing natural (allowing{" "}
                        <Styled.InlineCode>""</Styled.InlineCode>, leading zeros, etc.) and parse on submit.
                    </li>
                    <li>
                        Keep <b>empty string</b> (<Styled.InlineCode>""</Styled.InlineCode>) as the controlled “no value” state to
                        avoid controlled/uncontrolled warnings.
                    </li>
                    <li>
                        Do lightweight <b>formatting</b> (e.g., uppercase) in <Styled.InlineCode>onChange</Styled.InlineCode>; heavy
                        formatting can cause caret jumps—prefer formatting on blur or on submit.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function AgeField() {
  const [age, setAge] = React.useState(""); // keep as string
  function onChange(e) {
    const v = e.target.value;
    // accept only digits or empty string
    if (v === "" || /^\\d+$/.test(v)) setAge(v);
  }
  function onSubmit(e) {
    e.preventDefault();
    const ageNum = age === "" ? null : Number(age); // parse when needed
    console.log({ ageNum });
  }
  return (
    <form onSubmit={onSubmit}>
      <label>
        Age
        <input inputMode="numeric" value={age} onChange={onChange} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Checkboxes (single & group) */}
            <Styled.Section>
                <Styled.H2>Checkboxes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Single checkbox:</b> use <Styled.InlineCode>checked</Styled.InlineCode> +{" "}
                        <Styled.InlineCode>onChange(e =&gt; setChecked(e.target.checked))</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Group:</b> store an array of selected values and toggle membership.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function TermsCheckbox() {
  const [agree, setAgree] = React.useState(false);
  return (
    <label>
      <input
        type="checkbox"
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
      />
      I agree to the terms
    </label>
  );
}

function ToppingsGroup() {
  const [toppings, setToppings] = React.useState(["cheese"]);
  const all = ["cheese", "pepperoni", "mushroom"];
  const toggle = (v) =>
    setToppings((xs) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]));
  return (
    <fieldset>
      <legend>Toppings</legend>
      {all.map((v) => (
        <label key={v}>
          <input
            type="checkbox"
            checked={toppings.includes(v)}
            onChange={() => toggle(v)}
          />
          {v}
        </label>
      ))}
      <pre>{JSON.stringify(toppings)}</pre>
    </fieldset>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Radio group */}
            <Styled.Section>
                <Styled.H2>Radio Group</Styled.H2>
                <Styled.List>
                    <li>
                        Store the selected value; all radios share the same <Styled.InlineCode>name</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function SizeRadios() {
  const [size, setSize] = React.useState("m");
  const sizes = ["s", "m", "l"];
  return (
    <fieldset>
      <legend>Size</legend>
      {sizes.map((s) => (
        <label key={s}>
          <input
            type="radio"
            name="size"
            value={s}
            checked={size === s}
            onChange={(e) => setSize(e.target.value)}
          />
          {s.toUpperCase()}
        </label>
      ))}
    </fieldset>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Select (single & multiple) */}
            <Styled.Section>
                <Styled.H2>Select (single &amp; multiple)</Styled.H2>
                <Styled.Pre>
                    {`function CountrySelect() {
  const [country, setCountry] = React.useState("in");
  return (
    <label>
      Country
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="in">India</option>
        <option value="us">USA</option>
        <option value="de">Germany</option>
      </select>
    </label>
  );
}

function LanguagesMulti() {
  const [langs, setLangs] = React.useState(["js"]);
  const onChange = (e) =>
    setLangs(Array.from(e.target.selectedOptions, (o) => o.value));
  return (
    <label>
      Languages (multi)
      <select multiple value={langs} onChange={onChange}>
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="py">Python</option>
      </select>
    </label>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Textarea */}
            <Styled.Section>
                <Styled.H2>Textarea</Styled.H2>
                <Styled.Pre>
                    {`function BioTextarea() {
  const [bio, setBio] = React.useState("");
  return (
    <label>
      Bio
      <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
    </label>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Putting it together */}
            <Styled.Section>
                <Styled.H2>Putting It Together (submit, validate, reset)</Styled.H2>
                <Styled.Pre>
                    {`function ProfileForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) e.email = "Email is invalid";
    if (!agree) e.agree = "Please accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    // submit data { name, email, agree }
    console.log({ name, email, agree });
    // reset
    setName(""); setEmail(""); setAgree(false); setErrors({});
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)}
               aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
        {errors.name && <div id="err-name" role="alert">{errors.name}</div>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)}
               aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} />
        {errors.email && <div id="err-email" role="alert">{errors.email}</div>}
      </div>

      <label>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        I agree to the terms
      </label>
      {errors.agree && <div role="alert">{errors.agree}</div>}

      <button type="submit">Create profile</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>&lt;label htmlFor&gt;</Styled.InlineCode> with matching{" "}
                        <Styled.InlineCode>id</Styled.InlineCode>. Screen readers announce labels.
                    </li>
                    <li>
                        For groups, wrap in <Styled.InlineCode>&lt;fieldset&gt;</Styled.InlineCode> with a{" "}
                        <Styled.InlineCode>&lt;legend&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        Mark invalid fields with <Styled.InlineCode>aria-invalid</Styled.InlineCode> and link errors via{" "}
                        <Styled.InlineCode>aria-describedby</Styled.InlineCode>.
                    </li>
                    <li>
                        Keep the <Styled.InlineCode>name</Styled.InlineCode> attribute for native form submit and autofill.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Switching controlled ↔ uncontrolled:</b> Don’t render an input with{" "}
                        <Styled.InlineCode>undefined</Styled.InlineCode> and later with a string. Initialize with{" "}
                        <Styled.InlineCode>""</Styled.InlineCode> (text) or <Styled.InlineCode>false</Styled.InlineCode> (checkbox).
                    </li>
                    <li>
                        <b>Number inputs:</b> the value is still a string. Parse on submit; allow empty string while typing.
                    </li>
                    <li>
                        <b>File inputs:</b> the <Styled.InlineCode>value</Styled.InlineCode> is read-only for security. Treat file
                        uploads as <i>uncontrolled</i> (cover later).
                    </li>
                    <li>
                        <b>Caret jump:</b> aggressive formatting in <Styled.InlineCode>onChange</Styled.InlineCode> can move the
                        cursor. Prefer formatting on blur or use careful algorithms.
                    </li>
                    <li>
                        <b>Performance:</b> every keystroke re-renders. Keep handlers light; expensive logic should be debounced
                        (covered in Debounced Inputs).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep a single source of truth in state for controlled fields.</li>
                    <li><b>Do</b> validate early and show clear errors linked to inputs.</li>
                    <li><b>Do</b> parse/normalize on submit; be gentle while typing.</li>
                    <li><b>Don’t</b> mix <Styled.InlineCode>value</Styled.InlineCode> with <Styled.InlineCode>defaultValue</Styled.InlineCode> on the same input.</li>
                    <li><b>Don’t</b> block typing with heavy logic inside <Styled.InlineCode>onChange</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: With controlled inputs, state drives the UI. Use{" "}
                <Styled.InlineCode>value/checked</Styled.InlineCode> + <Styled.InlineCode>onChange</Styled.InlineCode>, keep text
                fields as strings, parse on submit, mind accessibility, and avoid switching between controlled and uncontrolled.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Controlled;
