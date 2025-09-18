import { Styled } from "./styled";

const FormsA11y = () => {
    return (
        <Styled.Page>
            <Styled.Title>Forms Accessibility (A11y)</Styled.Title>

            <Styled.Lead>
                Accessible forms ensure that <b>everyone</b> (including keyboard and screen-reader users) can
                find fields, understand purpose, fix errors, and submit successfully. The core ideas:
                <b>label every control</b>, <b>group related controls</b>, <b>announce errors</b>, and
                <b>manage focus</b> thoughtfully.
            </Styled.Lead>

            {/* 1) Foundations */}
            <Styled.Section>
                <Styled.H2>Foundations: Name, Role, Value</Styled.H2>
                <Styled.List>
                    <li><b>Accessible name</b>: how AT (screen readers) refer to a control (usually via <Styled.InlineCode>&lt;label htmlFor&gt;</Styled.InlineCode>).</li>
                    <li><b>Role</b>: the control type (textbox, button, combobox). Native HTML gives this for free.</li>
                    <li><b>Value</b>: the current state (text entered, option selected, checked/unchecked).</li>
                </Styled.List>
                <Styled.Small>Prefer <b>native HTML controls</b> with proper attributes; add ARIA only when necessary.</Styled.Small>
            </Styled.Section>

            {/* 2) Label every control */}
            <Styled.Section>
                <Styled.H2>Label Every Control</Styled.H2>
                <Styled.List>
                    <li>Use an explicit label: <Styled.InlineCode>&lt;label htmlFor="email"&gt;</Styled.InlineCode> + <Styled.InlineCode>id="email"</Styled.InlineCode>.</li>
                    <li>If you must hide the label visually, keep it in the DOM (visually hidden), not removed.</li>
                    <li>Don’t rely on placeholders as labels; they disappear and are not consistently announced.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function EmailField() {
  return (
    <div>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Help text & descriptions */}
            <Styled.Section>
                <Styled.H2>Help Text & Descriptions</Styled.H2>
                <Styled.List>
                    <li>Use <Styled.InlineCode>aria-describedby</Styled.InlineCode> to point to helper text or error text elements.</li>
                    <li>Keep help text visible or discoverable; don’t rely on hover only.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function PasswordField() {
  const helpId = "pwd-help";
  return (
    <div>
      <label htmlFor="pwd">Password</label>
      <input id="pwd" name="password" type="password" aria-describedby={helpId} required />
      <div id={helpId}>At least 8 characters, include a number.</div>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Errors: announce clearly */}
            <Styled.Section>
                <Styled.H2>Errors: Announce Clearly</Styled.H2>
                <Styled.List>
                    <li>Mark invalid fields with <Styled.InlineCode>aria-invalid="true"</Styled.InlineCode> when they fail validation.</li>
                    <li>Associate the error with the input via <Styled.InlineCode>aria-describedby</Styled.InlineCode>.</li>
                    <li>Use an <Styled.InlineCode>aria-live</Styled.InlineCode> region (or <Styled.InlineCode>role="alert"</Styled.InlineCode>) to announce new errors.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function EmailWithError({ error }) {
  const errId = "email-error";
  const isInvalid = Boolean(error);
  return (
    <div>
      <label htmlFor="email2">Email address</label>
      <input
        id="email2"
        name="email"
        type="email"
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? errId : undefined}
        required
      />
      {isInvalid && (
        <div id={errId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer <b>clear text</b> over color alone. If you use an asterisk for required, keep the
                    actual <Styled.InlineCode>required</Styled.InlineCode> attribute on the field.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Group related controls */}
            <Styled.Section>
                <Styled.H2>Group Related Controls</Styled.H2>
                <Styled.List>
                    <li>Wrap radio/checkbox groups in <Styled.InlineCode>&lt;fieldset&gt;</Styled.InlineCode> with a meaningful <Styled.InlineCode>&lt;legend&gt;</Styled.InlineCode>.</li>
                    <li>Each control still needs its own label.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ContactPref() {
  return (
    <fieldset>
      <legend>Preferred contact method</legend>
      <div>
        <input type="radio" id="c-email" name="contact" value="email" />
        <label htmlFor="c-email">Email</label>
      </div>
      <div>
        <input type="radio" id="c-sms" name="contact" value="sms" />
        <label htmlFor="c-sms">SMS</label>
      </div>
    </fieldset>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Keyboard first */}
            <Styled.Section>
                <Styled.H2>Keyboard First</Styled.H2>
                <Styled.List>
                    <li>Tab order follows DOM order—structure your markup logically.</li>
                    <li>Use <Styled.InlineCode>&lt;button type="submit"&gt;</Styled.InlineCode> for submits; avoid clickable <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode>s.</li>
                    <li>Avoid <Styled.InlineCode>tabIndex &gt; 0</Styled.InlineCode>; it breaks natural flow. Use <Styled.InlineCode>tabIndex=0</Styled.InlineCode> only for custom interactive elements.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function SubmitBar() {
  return (
    <div>
      <button type="submit">Save</button>
      <button type="button">Cancel</button>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Managing focus on submit */}
            <Styled.Section>
                <Styled.H2>Managing Focus on Submit</Styled.H2>
                <Styled.List>
                    <li>After validation, move focus to the <b>first invalid field</b> so users can fix it quickly.</li>
                    <li>Use refs or query for <Styled.InlineCode>[aria-invalid="true"]</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function onSubmitFocusFirstInvalid(e) {
  e.preventDefault();
  // ... run validation; mark fields aria-invalid="true" and set error text ...
  const firstInvalid = e.currentTarget.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) File upload & drag–drop */}
            <Styled.Section>
                <Styled.H2>File Upload &amp; Drag–Drop (A11y Pattern)</Styled.H2>
                <Styled.List>
                    <li>Keep the native file input for accessibility; trigger it from a custom button if needed.</li>
                    <li>For drop zones, provide a keyboard path (Enter/Space) and announce selection results.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function FilePicker() {
  const inputRef = React.useRef(null);
  const [fileName, setFileName] = React.useState("");
  const liveId = "file-live";

  function openPicker() { inputRef.current?.click(); }
  function onChange(e) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  }
  function onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    setFileName(file ? file.name : "");
  }
  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") openPicker();
  }

  return (
    <div>
      <label>Resume (PDF)</label>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        onChange={onChange}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        aria-describedby={liveId}
      >
        Click to choose or drag & drop a PDF
      </div>
      <div id={liveId} aria-live="polite">
        {fileName ? \`Selected: \${fileName}\` : "No file selected"}
      </div>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Autocomplete & input types */}
            <Styled.Section>
                <Styled.H2>Autocomplete &amp; Input Types</Styled.H2>
                <Styled.List>
                    <li>Use semantic types: <Styled.InlineCode>email</Styled.InlineCode>, <Styled.InlineCode>tel</Styled.InlineCode>, <Styled.InlineCode>url</Styled.InlineCode>, <Styled.InlineCode>number</Styled.InlineCode>, <Styled.InlineCode>date</Styled.InlineCode>.</li>
                    <li>Add <Styled.InlineCode>autoComplete</Styled.InlineCode> with real tokens: <Styled.InlineCode>name</Styled.InlineCode>, <Styled.InlineCode>email</Styled.InlineCode>, <Styled.InlineCode>username</Styled.InlineCode>, <Styled.InlineCode>new-password</Styled.InlineCode>, <Styled.InlineCode>one-time-code</Styled.InlineCode>, etc.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<input type="text" name="fullName" autoComplete="name" />
<input type="email" name="email" autoComplete="email" />
<input type="password" name="newPassword" autoComplete="new-password" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use labels, fieldset/legend, and clear help/error text.</li>
                    <li><b>Do</b> move focus to the first error after submit.</li>
                    <li><b>Do</b> ensure color contrast and don’t use color alone to convey meaning.</li>
                    <li><b>Don’t</b> remove labels or rely on placeholders.</li>
                    <li><b>Don’t</b> trap focus in modals without a proper focus trap.</li>
                    <li><b>Don’t</b> disable focus outlines; style them to match your theme.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Accessible name</b>: text AT uses to refer to a control.</li>
                    <li><b>aria-describedby</b>: links a control to additional descriptive/help/error text.</li>
                    <li><b>aria-invalid</b>: marks a control as failing validation.</li>
                    <li><b>Live region</b>: area announced automatically when its content changes (<Styled.InlineCode>aria-live</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: label everything, group related inputs, announce errors, and guide focus. Start with
                semantic HTML and add ARIA only to fill gaps.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FormsA11y;
