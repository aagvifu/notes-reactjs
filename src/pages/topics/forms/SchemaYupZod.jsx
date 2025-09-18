import React from "react";
import { Styled } from "./styled";

const SchemaYupZod = () => {
    return (
        <Styled.Page>
            <Styled.Title>Schema Validation (Yup &amp; Zod)</Styled.Title>

            <Styled.Lead>
                <b>Schema validation</b> describes the expected <i>shape</i> and <i>rules</i> of data
                (types, ranges, formats) in a single source of truth. In React forms, schemas validate
                user input before you submit, show useful errors, and keep logic centralized and testable.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Schema:</b> a declarative model of what valid data looks like (fields, types, constraints).</li>
                    <li><b>Validation:</b> checking input against the schema; returns success or a structured error list.</li>
                    <li><b>Refinement:</b> custom rule layered on top of a base type (e.g., “endDate &gt;= startDate”).</li>
                    <li><b>Transformation:</b> safely converting values (e.g., string to number, trimming whitespace) during parse.</li>
                    <li><b>Resolver (RHForm):</b> a bridge that lets <Styled.InlineCode>react-hook-form</Styled.InlineCode> call your schema on every validate step.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Choosing a library */}
            <Styled.Section>
                <Styled.H2>Yup vs Zod — When to Choose What</Styled.H2>
                <Styled.List>
                    <li><b>Yup:</b> mature, widely used with Formik; builder-style API (<Styled.InlineCode>yup.object({`...`})</Styled.InlineCode>). Great if your stack already uses Formik or Yup.</li>
                    <li><b>Zod:</b> modern, composable; powerful <i>refine</i>/<i>transform</i>, unions/discriminated unions, and first-class TypeScript inference.</li>
                    <li><b>Both</b> support sync/async checks, nested objects/arrays, custom messages, and integration with popular form libs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal examples */}
            <Styled.Section>
                <Styled.H2>Minimal Examples</Styled.H2>

                <Styled.H3>Yup — login schema</Styled.H3>
                <Styled.Pre>
                    {`import * as yup from "yup";

const loginYup = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Min 8 chars").required("Password is required"),
});`}
                </Styled.Pre>

                <Styled.H3>Zod — login schema</Styled.H3>
                <Styled.Pre>
                    {`import { z } from "zod";

const loginZod = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Using with react-hook-form */}
            <Styled.Section>
                <Styled.H2>Using with <code>react-hook-form</code></Styled.H2>

                <Styled.H3>Zod + RHF via resolver</Styled.H3>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = loginZod;

function LoginFormZod() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur", // validate on blur; change to "onChange" if needed
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log("ok", data))}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button>Login</button>
    </form>
  );
}`}
                </Styled.Pre>

                <Styled.H3>Yup + RHF via resolver</Styled.H3>
                <Styled.Pre>
                    {`import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = loginYup;

function LoginFormYup() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log("ok", data))}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button>Login</button>
    </form>
  );
}`}
                </Styled.Pre>

                <Styled.Small>
                    The resolver adapts schema errors to RHF’s <Styled.InlineCode>errors</Styled.InlineCode> object.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Using with Formik */}
            <Styled.Section>
                <Styled.H2>Using with Formik</Styled.H2>
                <Styled.Pre>
                    {`import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const profileYup = yup.object({
  name: yup.string().required("Name is required"),
  age: yup.number().min(18, "18+ only").required("Age is required"),
});

function ProfileFormik() {
  return (
    <Formik
      initialValues={{ name: "", age: "" }}
      validationSchema={profileYup}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Field name="name" placeholder="Full name" />
        <ErrorMessage name="name" component="span" />

        <Field name="age" type="number" placeholder="Age" />
        <ErrorMessage name="age" component="span" />

        <button>Save</button>
      </Form>
    </Formik>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Formik pairs most commonly with Yup.</Styled.Small>
            </Styled.Section>

            {/* 6) Refinements & cross-field rules */}
            <Styled.Section>
                <Styled.H2>Cross-Field Rules & Refinements</Styled.H2>

                <Styled.H3>Zod — confirm password & date range</Styled.H3>
                <Styled.Pre>
                    {`import { z } from "zod";

const account = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirm: z.string(),
  start: z.coerce.date(), // accept string, coerce to Date
  end: z.coerce.date(),
}).superRefine((val, ctx) => {
  if (val.password !== val.confirm) {
    ctx.addIssue({ path: ["confirm"], code: z.ZodIssueCode.custom, message: "Passwords must match" });
  }
  if (val.end < val.start) {
    ctx.addIssue({ path: ["end"], code: z.ZodIssueCode.custom, message: "End must be after start" });
  }
});`}
                </Styled.Pre>

                <Styled.H3>Yup — confirm password</Styled.H3>
                <Styled.Pre>
                    {`import * as yup from "yup";

const accountYup = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirm: yup.string().oneOf([yup.ref("password")], "Passwords must match").required(),
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Transformations */}
            <Styled.Section>
                <Styled.H2>Transformations & Coercion</Styled.H2>
                <Styled.List>
                    <li><b>Zod:</b> <Styled.InlineCode>z.coerce.number()</Styled.InlineCode> or <Styled.InlineCode>z.string().transform(...)</Styled.InlineCode> to coerce/clean.</li>
                    <li><b>Yup:</b> <Styled.InlineCode>transform()</Styled.InlineCode> to massage values before validation.</li>
                </Styled.List>

                <Styled.H3>Zod transform</Styled.H3>
                <Styled.Pre>
                    {`const amount = z.string()
  .transform((s) => s.trim())
  .refine((s) => /^\\d+(\\.\\d{1,2})?$/.test(s), "Money format 0.00")
  .transform((s) => Number(s)); // final type: number`}
                </Styled.Pre>

                <Styled.H3>Yup transform</Styled.H3>
                <Styled.Pre>
                    {`const amountYup = yup
  .string()
  .transform((s) => (typeof s === "string" ? s.trim() : s))
  .test("money", "Money format 0.00", (s) => /^\\d+(\\.\\d{1,2})?$/.test(String(s)));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Files & custom validators */}
            <Styled.Section>
                <Styled.H2>Validating Files</Styled.H2>

                <Styled.H3>Zod — file type/size</Styled.H3>
                <Styled.Pre>
                    {`const fileZod = z.object({
  avatar: z.instanceof(File, { message: "Please select a file" })
    .refine((f) => f.size <= 2 * 1024 * 1024, "Max 2MB")
    .refine((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type), "JPG/PNG/WEBP only"),
});`}
                </Styled.Pre>

                <Styled.H3>Yup — file type/size</Styled.H3>
                <Styled.Pre>
                    {`const fileYup = yup.object({
  avatar: yup
    .mixed()
    .required("Please select a file")
    .test("size", "Max 2MB", (f) => f && f.size <= 2 * 1024 * 1024)
    .test("type", "JPG/PNG/WEBP only", (f) => f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)),
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Manual parse without a form lib */}
            <Styled.Section>
                <Styled.H2>Manual Validation (no form library)</Styled.H2>
                <Styled.H3>Zod — safeParse</Styled.H3>
                <Styled.Pre>
                    {`const res = account.safeParse(formValues);
if (!res.success) {
  // res.error.format() -> field-level messages
  console.log(res.error.flatten());
} else {
  // res.data is typed (TS) and transformed
  console.log(res.data);
}`}
                </Styled.Pre>

                <Styled.H3>Yup — validate / try/catch</Styled.H3>
                <Styled.Pre>
                    {`try {
  const ok = await accountYup.validate(formValues, { abortEarly: false });
  console.log(ok);
} catch (err) {
  // err is a Yup ValidationError: err.inner has per-field errors
  console.log(err.errors);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep one schema per form (or per step) as the single source of truth.</li>
                    <li><b>Do</b> use cross-field rules for dates, password confirm, totals, etc.</li>
                    <li><b>Do</b> normalize inputs (trim/coerce) inside the schema where sensible.</li>
                    <li><b>Don’t</b> duplicate rules in both UI and schema; UI can hint, but schema must be authoritative.</li>
                    <li><b>Don’t</b> hide errors; show clear field-level messages and disable submit while invalid/processing.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>abortEarly:</b> stop at first error (default in some libs). Prefer collecting all errors (<i>abortEarly: false</i>).</li>
                    <li><b>coercion:</b> convert raw inputs into intended types (string → number/Date).</li>
                    <li><b>discriminated union (Zod):</b> variant object shapes selected by a literal tag field.</li>
                    <li><b>resolver:</b> plugin adapter that connects a schema to a form library.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: pick a schema library (Yup or Zod), define all rules in one place,
                connect it via a resolver (RHF/Formik), and prefer cross-field refinements for real-world rules.
                Normalize early, surface clear errors, and keep UI logic thin.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SchemaYupZod;
