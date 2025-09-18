import React from "react";
import { Styled } from "./styled";

const ReactHookForm = () => {
    return (
        <Styled.Page>
            <Styled.Title>React Hook Form (RHF)</Styled.Title>

            <Styled.Lead>
                <b>React Hook Form</b> is a lightweight form library that favors <b>uncontrolled inputs</b>,
                minimizes re-renders, and gives you a simple API for validation, errors, and submission.
                It works great with native inputs and UI libraries via <Styled.InlineCode>Controller</Styled.InlineCode>.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Why RHF</Styled.H2>
                <Styled.List>
                    <li><b>Uncontrolled inputs:</b> the browser owns the input value; React reads it when needed. This reduces re-renders vs fully controlled forms.</li>
                    <li><b>Register pattern:</b> connect inputs with <Styled.InlineCode>register(name, rules)</Styled.InlineCode>.</li>
                    <li><b>Validation:</b> use built-in rules or plug-in a <em>resolver</em> (Zod/Yup) for schema validation.</li>
                    <li><b>Performance:</b> fewer renders, field-level updates, and cheap form state tracking.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core Concepts */}
            <Styled.Section>
                <Styled.H2>Core Concepts &amp; API</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>useForm({`defaultValues, mode`})</Styled.InlineCode> initializes the form.</li>
                    <li><Styled.InlineCode>register(name, rules)</Styled.InlineCode> wires an input.</li>
                    <li><Styled.InlineCode>handleSubmit(onValid, onInvalid)</Styled.InlineCode> handles submit flow.</li>
                    <li><Styled.InlineCode>formState</Styled.InlineCode> exposes <Styled.InlineCode>errors, isDirty, isValid, isSubmitting, touchedFields</Styled.InlineCode>, etc.</li>
                    <li><Styled.InlineCode>watch(names)</Styled.InlineCode> subscribe to field values; <Styled.InlineCode>reset, setValue, trigger</Styled.InlineCode> control form programmatically.</li>
                    <li><Styled.InlineCode>Controller</Styled.InlineCode> integrates <em>controlled</em> components (e.g., custom selects, date pickers).</li>
                    <li><Styled.InlineCode>useFieldArray</Styled.InlineCode> manages dynamic lists (addresses, phones, etc.).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Basic example */}
            <Styled.Section>
                <Styled.H2>Basic Form (required, patterns, numbers)</Styled.H2>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } =
    useForm({
      mode: "onTouched",                 // when to validate: onChange | onBlur | onTouched | onSubmit
      defaultValues: { name: "", email: "", age: "", terms: false }
    });

  async function onSubmit(data) {
    // simulate async submit
    await new Promise(r => setTimeout(r, 600));
    console.log("submitted", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Name
        <input
          type="text"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" }
          })}
          aria-invalid={!!errors.name}
        />
      </label>
      {errors.name && <span role="alert">{errors.name.message}</span>}

      <label>
        Email
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: "Enter a valid email" }
          })}
          aria-invalid={!!errors.email}
        />
      </label>
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <label>
        Age
        <input
          type="number"
          {...register("age", {
            valueAsNumber: true,
            min: { value: 13, message: "You must be at least 13" },
            max: { value: 120, message: "Enter a realistic age" }
          })}
          aria-invalid={!!errors.age}
        />
      </label>
      {errors.age && <span role="alert">{errors.age.message}</span>}

      <label>
        <input type="checkbox" {...register("terms", { required: "Please accept the terms" })} />
        I accept the terms
      </label>
      {errors.terms && <span role="alert">{errors.terms.message}</span>}

      <button type="submit" disabled={isSubmitting || !isValid}>Create account</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Notes: use <Styled.InlineCode>noValidate</Styled.InlineCode> to bypass native HTML popups and show custom messages.
                    <Styled.InlineCode>valueAsNumber</Styled.InlineCode> converts the input string to a number for you.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Schema validation with Zod */}
            <Styled.Section>
                <Styled.H2>Schema Validation (Zod via Resolver)</Styled.H2>
                <Styled.List>
                    <li>A <b>resolver</b> adapts your schema library to RHF. Popular choices: Zod, Yup.</li>
                    <li>Centralizes rules, gives typed data (if you use TypeScript), and consistent error messages.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Passwords must match",
  path: ["confirm"]
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", confirm: "" } });

  async function onSubmit(values) {
    // submit to server
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input placeholder="Email" {...register("email")} aria-invalid={!!errors.email} />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <input type="password" placeholder="Password" {...register("password")} aria-invalid={!!errors.password} />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <input type="password" placeholder="Confirm password" {...register("confirm")} aria-invalid={!!errors.confirm} />
      {errors.confirm && <span role="alert">{errors.confirm.message}</span>}

      <button disabled={isSubmitting}>Login</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Controlled components via Controller */}
            <Styled.Section>
                <Styled.H2>Using Controlled Components with <code>Controller</code></Styled.H2>
                <Styled.List>
                    <li>Use when a component manages its own value/changes (e.g., UI library Select, DatePicker, custom Toggle).</li>
                    <li><Styled.InlineCode>Controller</Styled.InlineCode> bridges RHF and your component by mapping <em>value</em> and <em>onChange</em>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useForm, Controller } from "react-hook-form";

function PreferencesForm() {
  const { control, handleSubmit } = useForm({ defaultValues: { theme: "dark", notifications: true } });

  function onSubmit(v) { console.log(v); }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Custom Select example */}
      <Controller
        name="theme"
        control={control}
        rules={{ required: "Pick a theme" }}
        render={({ field, fieldState }) => (
          <>
            <MySelect
              value={field.value}
              onChange={field.onChange}
              options={["light", "dark", "system"]}
            />
            {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
          </>
        )}
      />

      {/* Custom Toggle example */}
      <Controller
        name="notifications"
        control={control}
        render={({ field }) => <MyToggle checked={field.value} onChange={field.onChange} />}
      />

      <button>Save</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: pass <Styled.InlineCode>rules</Styled.InlineCode> to <Styled.InlineCode>Controller</Styled.InlineCode> for validation.
                    Read errors via <Styled.InlineCode>fieldState.error</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Field Arrays */}
            <Styled.Section>
                <Styled.H2>Dynamic Fields with <code>useFieldArray</code></Styled.H2>
                <Styled.Pre>
                    {`import { useForm, useFieldArray } from "react-hook-form";

function SkillsForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: { skills: [{ name: "" }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  function onSubmit(values) { console.log(values); }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((f, i) => (
        <div key={f.id}>
          <input placeholder="Skill" {...register(\`skills.\${i}.name\`, { required: "Required" })} />
          <button type="button" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "" })}>Add skill</button>
      <button type="submit">Save</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Form State, watch, reset, server errors */}
            <Styled.Section>
                <Styled.H2>Form State, Watch, Reset &amp; Server Errors</Styled.H2>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";

function ProfileForm() {
  const { register, handleSubmit, formState, watch, reset, setError, clearErrors } =
    useForm({ defaultValues: { username: "" }, mode: "onChange" });

  const liveUser = watch("username"); // live value

  async function onSubmit(v) {
    const ok = await fakeCheckAvailability(v.username);
    if (!ok) {
      setError("username", { type: "server", message: "Username already taken" });
      return;
    }
    clearErrors("username");
    // ...save...
    reset({ username: "" }); // clear after save
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username", { required: "Enter a username" })} />
      {formState.errors.username && <span role="alert">{formState.errors.username.message}</span>}
      <div>Preview: {liveUser}</div>
      <button disabled={formState.isSubmitting || !formState.isValid}>Save</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) File input */}
            <Styled.Section>
                <Styled.H2>File Upload (Basics)</Styled.H2>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";

function AvatarForm() {
  const { register, handleSubmit, watch } = useForm();
  const fileList = watch("avatar"); // FileList or undefined
  const file = fileList?.[0];

  function onSubmit(data) {
    const fd = new FormData();
    if (file) fd.append("avatar", file);
    // fetch("/upload", { method: "POST", body: fd })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" accept="image/*" {...register("avatar", { required: "Pick an image" })} />
      {file && <p>Selected: {file.name} ({Math.round(file.size / 1024)} KB)</p>}
      <button>Upload</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> set <Styled.InlineCode>defaultValues</Styled.InlineCode> for stable initial state.</li>
                    <li><b>Do</b> use <Styled.InlineCode>mode</Styled.InlineCode> intentionally (<Styled.InlineCode>onChange</Styled.InlineCode> for live feedback, <Styled.InlineCode>onTouched</Styled.InlineCode> for gentler UX).</li>
                    <li><b>Do</b> mark errors accessibly: <Styled.InlineCode>aria-invalid</Styled.InlineCode> on inputs and <Styled.InlineCode>role="alert"</Styled.InlineCode> for messages.</li>
                    <li><b>Don’t</b> mix controlled and uncontrolled patterns on the same input (e.g., changing <Styled.InlineCode>value</Styled.InlineCode> from undefined to string).</li>
                    <li><b>Don’t</b> forget to pass <Styled.InlineCode>name</Styled.InlineCode> and register each field—RHF needs it to track values.</li>
                    <li><b>Don’t</b> rely only on client-side validation; re-validate on the server and display server errors via <Styled.InlineCode>setError</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Uncontrolled input:</b> the DOM holds the value; React reads it (via refs/events) when needed.</li>
                    <li><b>Controlled input:</b> value lives in React state; every change triggers a re-render.</li>
                    <li><b>Resolver:</b> adapter that lets RHF validate using a schema library like Zod/Yup.</li>
                    <li><b>Controller:</b> wrapper that binds a controlled component to RHF’s <em>value/onChange</em>.</li>
                    <li><b>Field array:</b> a repeatable set of fields managed with <Styled.InlineCode>useFieldArray</Styled.InlineCode>.</li>
                    <li><b>Mode:</b> when validation runs (<Styled.InlineCode>onSubmit</Styled.InlineCode>, <Styled.InlineCode>onBlur</Styled.InlineCode>, <Styled.InlineCode>onChange</Styled.InlineCode>, <Styled.InlineCode>onTouched</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Prefer uncontrolled inputs + <b>register</b> for performance, reach for <b>Controller</b> when a
                component <i>must</i> be controlled, use a schema <b>resolver</b> for robust validation, and present
                accessible error messages. Keep server validation in the loop.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ReactHookForm;
