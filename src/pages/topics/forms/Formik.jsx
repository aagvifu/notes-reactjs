import React from "react";
import { Styled } from "./styled";

const Formik = () => {
    return (
        <Styled.Page>
            <Styled.Title>Formik</Styled.Title>

            <Styled.Lead>
                <b>Formik</b> is a small library that helps you manage <i>form state</i>, <i>validation</i>, and
                <i> submission</i> in React. It centralizes values, errors, and touched state, and gives you helpers
                to build robust forms without hand-rolling the same boilerplate over and over.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Form state:</b> central source of truth for input values (<Styled.InlineCode>values</Styled.InlineCode>).</li>
                    <li><b>Validation:</b> either with a function (<Styled.InlineCode>validate</Styled.InlineCode>) or a schema (<Styled.InlineCode>validationSchema</Styled.InlineCode>, typically Yup/Zod).</li>
                    <li><b>Submission:</b> standardized <Styled.InlineCode>onSubmit(values, helpers)</Styled.InlineCode> with helpers like <Styled.InlineCode>setSubmitting</Styled.InlineCode>, <Styled.InlineCode>resetForm</Styled.InlineCode>.</li>
                    <li><b>Events & flags:</b> <Styled.InlineCode>touched</Styled.InlineCode>, <Styled.InlineCode>errors</Styled.InlineCode>, <Styled.InlineCode>dirty</Styled.InlineCode>, <Styled.InlineCode>isValid</Styled.InlineCode>, <Styled.InlineCode>isSubmitting</Styled.InlineCode> for UI control.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core concepts & terms */}
            <Styled.Section>
                <Styled.H2>Core Concepts & Terms</Styled.H2>
                <Styled.List>
                    <li><b>initialValues:</b> the starting object for your form (keys must match each input’s <Styled.InlineCode>name</Styled.InlineCode>).</li>
                    <li><b>handleChange / handleBlur:</b> event handlers Formik gives you to wire inputs.</li>
                    <li><b>touched:</b> fields the user has interacted with (used to decide when to show errors).</li>
                    <li><b>errors:</b> an object mirroring <Styled.InlineCode>values</Styled.InlineCode> with validation messages.</li>
                    <li><b>validate:</b> function returning an <Styled.InlineCode>errors</Styled.InlineCode> object.</li>
                    <li><b>validationSchema:</b> a schema (Yup/Zod) that describes valid <Styled.InlineCode>values</Styled.InlineCode>.</li>
                    <li><b>Field / Form / ErrorMessage:</b> Formik components that reduce boilerplate for wiring inputs, form tag, and errors.</li>
                    <li><b>useFormik / useField / useFormikContext:</b> hooks for full control or field-level wiring.</li>
                    <li><b>FieldArray:</b> helpers for dynamic lists (add/remove items).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Quick Start – Component API */}
            <Styled.Section>
                <Styled.H2>Quick Start: Component API (<code>&lt;Formik /&gt;</code>)</Styled.H2>
                <Styled.Pre>
                    {`import { Formik, Form, Field, ErrorMessage } from "formik";

function Signup() {
  return (
    <Formik
      initialValues={{ name: "", email: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.name.trim()) errors.name = "Name is required";
        if (!values.email) errors.email = "Email is required";
        else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) errors.email = "Invalid email";
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          // await api(values);
          console.log("Submitting", values);
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form noValidate>
          <label>
            Name
            <Field name="name" type="text" />
          </label>
          <ErrorMessage name="name" component="div" className="error" />

          <label>
            Email
            <Field name="email" type="email" />
          </label>
          <ErrorMessage name="email" component="div" className="error" />

          <button type="submit" disabled={isSubmitting || !dirty || !isValid}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The render-prop gives you flags like <Styled.InlineCode>isSubmitting</Styled.InlineCode>,{" "}
                    <Styled.InlineCode>isValid</Styled.InlineCode>, and <Styled.InlineCode>dirty</Styled.InlineCode> to control the UI.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Hook API – useFormik */}
            <Styled.Section>
                <Styled.H2>Hook API: <code>useFormik</code></Styled.H2>
                <Styled.Pre>
                    {`import { useFormik } from "formik";

function Login() {
  const formik = useFormik({
    initialValues: { email: "", password: "", remember: false },
    validate(values) {
      const errors = {};
      if (!values.email) errors.email = "Email is required";
      if (!values.password) errors.password = "Password is required";
      return errors;
    },
    onSubmit(values, helpers) {
      console.log(values);
      helpers.setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={!!(formik.touched.email && formik.errors.email) || undefined}
        />
      </label>
      {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}

      <label>
        Password
        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>
      {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}

      <label>
        <input
          name="remember"
          type="checkbox"
          checked={formik.values.remember}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        Remember me
      </label>

      <button type="submit" disabled={formik.isSubmitting}>Login</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Schema validation (Yup) */}
            <Styled.Section>
                <Styled.H2>Schema Validation with Yup</Styled.H2>
                <Styled.Pre>
                    {`import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Min 8 characters").required("Required"),
});

function SchemaExample() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => { console.log(values); setSubmitting(false); }}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <label>Email <Field name="email" type="email" /></label>
          <ErrorMessage name="email" component="div" className="error" />

          <label>Password <Field name="password" type="password" /></label>
          <ErrorMessage name="password" component="div" className="error" />

          <button type="submit" disabled={isSubmitting}>Submit</button>
        </Form>
      )}
    </Formik>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Yup</b> is the most common pairing. For <b>Zod</b>, use an adapter to convert a Zod schema to a Formik-compatible
                    validation function or schema-like wrapper.
                </Styled.Small>
            </Styled.Section>

            {/* 6) useField & custom inputs */}
            <Styled.Section>
                <Styled.H2>Custom Inputs with <code>useField</code></Styled.H2>
                <Styled.Pre>
                    {`import { useField } from "formik";

function TextInput({ label, ...props }) {
  const [field, meta] = useField(props); // name, type, etc. in props
  return (
    <label>
      {label}
      <input {...field} {...props} aria-invalid={meta.touched && meta.error ? true : undefined} />
      {meta.touched && meta.error ? <span className="error">{meta.error}</span> : null}
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>useField</Styled.InlineCode> wires value/checked/change/blur automatically for the given{" "}
                    <Styled.InlineCode>name</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Arrays & dynamic fields */}
            <Styled.Section>
                <Styled.H2>Dynamic Lists with <code>FieldArray</code></Styled.H2>
                <Styled.Pre>
                    {`import { FieldArray, Formik, Form, Field } from "formik";

function Todos() {
  return (
    <Formik
      initialValues={{ todos: [""] }}
      onSubmit={(v) => console.log(v)}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="todos">
            {({ push, remove }) => (
              <>
                {values.todos.map((_, i) => (
                  <div key={i}>
                    <Field name={\`todos.\${i}\`} placeholder={\`Todo \${i+1}\`} />
                    <button type="button" onClick={() => remove(i)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => push("")}>Add Todo</button>
              </>
            )}
          </FieldArray>
          <button type="submit">Save</button>
        </Form>
      )}
    </Formik>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use dotted paths (e.g., <Styled.InlineCode>todos.0</Styled.InlineCode>) for arrays and nested objects.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Files & special inputs */}
            <Styled.Section>
                <Styled.H2>Files & Special Inputs</Styled.H2>
                <Styled.List>
                    <li><b>Files:</b> set via <Styled.InlineCode>setFieldValue(name, file)</Styled.InlineCode>—don’t rely on default change.</li>
                    <li><b>Checkbox groups:</b> manage arrays with <Styled.InlineCode>FieldArray</Styled.InlineCode> or custom logic.</li>
                    <li><b>Selects:</b> make sure the <Styled.InlineCode>value</Styled.InlineCode> matches an option; for multi-select use arrays.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// File input example with setFieldValue
import { useFormik } from "formik";

function AvatarForm() {
  const formik = useFormik({
    initialValues: { avatar: null },
    onSubmit: (v) => console.log(v),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => formik.setFieldValue("avatar", e.currentTarget.files?.[0] ?? null)}
      />
      <button type="submit">Upload</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Configuration knobs */}
            <Styled.Section>
                <Styled.H2>Configuration Knobs</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>validateOnChange</Styled.InlineCode> / <Styled.InlineCode>validateOnBlur</Styled.InlineCode>: control when validation runs.</li>
                    <li><Styled.InlineCode>validateOnMount</Styled.InlineCode>: run validation immediately on first render.</li>
                    <li><Styled.InlineCode>enableReinitialize</Styled.InlineCode>: allow <Styled.InlineCode>initialValues</Styled.InlineCode> to update from props (resets dirty state).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don’t */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep <Styled.InlineCode>initialValues</Styled.InlineCode> stable (memoize if derived) to avoid unwanted resets.</li>
                    <li><b>Do</b> align each input’s <Styled.InlineCode>name</Styled.InlineCode> with a key in <Styled.InlineCode>values</Styled.InlineCode> (including dotted paths).</li>
                    <li><b>Do</b> show errors when a field is both <i>touched</i> and has an <i>error</i>.</li>
                    <li><b>Don’t</b> mix uncontrolled patterns (<Styled.InlineCode>defaultValue</Styled.InlineCode>) with Formik-controlled inputs.</li>
                    <li><b>Don’t</b> mutate <Styled.InlineCode>values</Styled.InlineCode> directly—use Formik helpers (<Styled.InlineCode>setFieldValue</Styled.InlineCode>, <Styled.InlineCode>setValues</Styled.InlineCode>).</li>
                    <li><b>Don’t</b> block the main thread in <Styled.InlineCode>onSubmit</Styled.InlineCode>; mark async work and use <Styled.InlineCode>setSubmitting(false)</Styled.InlineCode> in <i>finally</i>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Accessibility notes */}
            <Styled.Section>
                <Styled.H2>Accessibility Notes</Styled.H2>
                <Styled.List>
                    <li>Always bind <Styled.InlineCode>&lt;label htmlFor="id"&gt;</Styled.InlineCode> to the input’s <Styled.InlineCode>id</Styled.InlineCode>.</li>
                    <li>Set <Styled.InlineCode>aria-invalid</Styled.InlineCode> when a field has an error and was touched.</li>
                    <li>Announce errors near inputs (e.g., with <Styled.InlineCode>aria-live="polite"</Styled.InlineCode> on the error container).</li>
                    <li>Use the native <Styled.InlineCode>button type="submit"</Styled.InlineCode> and keyboard-friendly controls.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>dirty:</b> <Styled.InlineCode>true</Styled.InlineCode> if values differ from <Styled.InlineCode>initialValues</Styled.InlineCode>.</li>
                    <li><b>isValid:</b> no validation errors currently present.</li>
                    <li><b>isSubmitting:</b> <Styled.InlineCode>true</Styled.InlineCode> while <Styled.InlineCode>onSubmit</Styled.InlineCode> is running.</li>
                    <li><b>setFieldValue(name, value):</b> programmatically set a field.</li>
                    <li><b>setTouched / setErrors:</b> programmatically mark touch states or errors.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Formik centralizes form state, validation, and submission. Use component or hook APIs,
                pair with Yup/Zod for schemas, keep names aligned with values, and surface errors only after touch.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Formik;
