import { Styled } from "./styled";

const FormatJS = () => {
    return (
        <Styled.Page>
            <Styled.Title>FormatJS (react-intl)</Styled.Title>

            <Styled.Lead>
                <b>FormatJS</b> is a collection of internationalization libraries for JavaScript. In React,
                we typically use <b>react-intl</b> to format messages, numbers, dates, and relative time using
                the <b>ICU Message</b> syntax. It provides components like{" "}
                <Styled.InlineCode>IntlProvider</Styled.InlineCode>,{" "}
                <Styled.InlineCode>FormattedMessage</Styled.InlineCode>,{" "}
                <Styled.InlineCode>FormattedNumber</Styled.InlineCode>, etc., and the{" "}
                <Styled.InlineCode>useIntl()</Styled.InlineCode> hook.
            </Styled.Lead>

            {/* 1) Core terms */}
            <Styled.Section>
                <Styled.H2>Core Terms & Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>i18n (Internationalization):</b> Preparing your app to support multiple{" "}
                        <em>locales</em> (languages + region formats) without code changes.
                    </li>
                    <li>
                        <b>l10n (Localization):</b> Supplying the <em>content</em> per locale (translations,
                        date/number formats, plural rules, RTL layout).
                    </li>
                    <li>
                        <b>Locale:</b> A language/region tag like <Styled.InlineCode>en</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>en-GB</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>hi-IN</Styled.InlineCode> that determines formatting rules.
                    </li>
                    <li>
                        <b>ICU Message syntax:</b> A standard string format for variables, plurals, gender
                        selects, and rich text placeholders, e.g.{" "}
                        <Styled.InlineCode>{`"{count, plural, one {# item} other {# items}}"`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Message Descriptor:</b> An object describing a message:{" "}
                        <Styled.InlineCode>{`{ id, defaultMessage, description? }`}</Styled.InlineCode>. IDs must
                        be <em>stable</em>.
                    </li>
                    <li>
                        <b>Extraction:</b> Process of scanning source code to collect messages for translators
                        (e.g., with <Styled.InlineCode>@formatjs/cli</Styled.InlineCode> or Babel plugin).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Provider setup */}
            <Styled.Section>
                <Styled.H2>Setup: <code>IntlProvider</code></Styled.H2>
                <Styled.Pre>
                    {`// index.jsx (simplified)
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import App from "./App";
import en from "./locales/en.json";

createRoot(document.getElementById("root")).render(
  <IntlProvider locale="en" messages={en}>
    <App />
  </IntlProvider>
);`}
                </Styled.Pre>
                <Styled.Small>
                    <b>IntlProvider</b> supplies locale + messages to your React tree. Messages is a flat map
                    of <Styled.InlineCode>id → translation</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Message descriptor & usage */}
            <Styled.Section>
                <Styled.H2>Defining & Using Messages</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Message Descriptor:</b>{" "}
                        <Styled.InlineCode>{`{ id: "home.greeting", defaultMessage: "Hello, {name}!", description: "Greet user by name" }`}</Styled.InlineCode>
                    </li>
                    <li>
                        <b>Values:</b> Named placeholders supplied at render time,{" "}
                        <Styled.InlineCode>{`{ name: "Ashish" }`}</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { FormattedMessage, useIntl } from "react-intl";

// Component usage with <FormattedMessage />
function Greeting() {
  return (
    <p>
      <FormattedMessage
        id="home.greeting"
        defaultMessage="Hello, {name}!"
        values={{ name: "Ashish" }}
      />
    </p>
  );
}

// Or with useIntl()
function Greeting2({ name }) {
  const intl = useIntl();
  const text = intl.formatMessage(
    { id: "home.greeting", defaultMessage: "Hello, {name}!" },
    { name }
  );
  return <p>{text}</p>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) ICU variables, select, plural */}
            <Styled.Section>
                <Styled.H2>ICU Message Syntax: Variables, <code>select</code>, <code>plural</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Variable:</b> <Styled.InlineCode>{`"Hi, {name}"`}</Styled.InlineCode> →{" "}
                        <Styled.InlineCode>{`values={{ name: "Ashish" }}`}</Styled.InlineCode>
                    </li>
                    <li>
                        <b>select:</b> Choose a branch based on a token (e.g., gender/role).
                    </li>
                    <li>
                        <b>plural:</b> Language-aware pluralization. Use <Styled.InlineCode>#</Styled.InlineCode>{" "}
                        to insert the count.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// select (gender example)
<FormattedMessage
  id="profile.pronoun"
  defaultMessage="{gender, select, male {He} female {She} other {They}} updated the profile."
  values={{ gender: "male" }}
/>

// plural
<FormattedMessage
  id="cart.items"
  defaultMessage="{count, plural,
    =0 {No items}
    one {# item}
    other {# items}
  } in your cart."
  values={{ count: 3 }}
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Rich text messages */}
            <Styled.Section>
                <Styled.H2>Rich Text in Messages (Safe Markup)</Styled.H2>
                <Styled.List>
                    <li>
                        Define <b>element placeholders</b> and pass <b>functions</b> to render elements. Avoid
                        hard-coded HTML in translations.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Translator sees <bold>...</bold> and can move it as needed
<FormattedMessage
  id="auth.confirm"
  defaultMessage="Please <bold>confirm</bold> your email."
  values={{
    bold: (chunks) => <strong>{chunks}</strong>
  }}
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Dates, numbers, relative time */}
            <Styled.Section>
                <Styled.H2>Formatting Dates, Numbers, Relative Time</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Numbers:</b>{" "}
                        <Styled.InlineCode>{`<FormattedNumber value={12345.678} />`}</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>style="currency"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>percent</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>unit</Styled.InlineCode> options.
                    </li>
                    <li>
                        <b>Dates/Times:</b>{" "}
                        <Styled.InlineCode>{`<FormattedDate />`}</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>{`<FormattedTime />`}</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>{`<FormattedDateTimeRange />`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Relative:</b>{" "}
                        <Styled.InlineCode>{`<FormattedRelativeTime value={-5} unit="minute" />`}</Styled.InlineCode>{" "}
                        → “5 minutes ago”.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import {
  FormattedNumber,
  FormattedDate,
  FormattedTime,
  FormattedRelativeTime
} from "react-intl";

function Examples() {
  return (
    <>
      <p>
        Price:{" "}
        <FormattedNumber value={1499.99} style="currency" currency="INR" currencyDisplay="symbol" />
      </p>

      <p>
        Launch: <FormattedDate value={new Date()} year="numeric" month="short" day="2-digit" />{" "}
        at <FormattedTime value={new Date()} hour="2-digit" minute="2-digit" />
      </p>

      <p>
        Updated: <FormattedRelativeTime value={-90} unit="second" />
      </p>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Loading locale messages (code-splitting) */}
            <Styled.Section>
                <Styled.H2>Loading Messages Per Locale (Code-Split)</Styled.H2>
                <Styled.List>
                    <li>
                        Dynamically import the <Styled.InlineCode>messages</Styled.InlineCode> bundle for the
                        current locale to keep initial JS small.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// pseudo: LocaleProvider.jsx
import React from "react";
import { IntlProvider } from "react-intl";

export function LocaleProvider({ locale, children }) {
  const [messages, setMessages] = React.useState({});

  React.useEffect(() => {
    let cancelled = false;
    import(\`../locales/\${locale}.json\`).then((mod) => {
      if (!cancelled) setMessages(mod.default || mod);
    });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} onError={(err) => {
      // Optionally silence missing translation warnings in dev or handle gracefully
      if (err.code === "MISSING_TRANSLATION") return;
      console.warn(err);
    }}>
      {children}
    </IntlProvider>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Extraction workflow */}
            <Styled.Section>
                <Styled.H2>Extraction & Translation Workflow</Styled.H2>
                <Styled.List>
                    <li>
                        Keep <b>IDs stable</b> across releases (don't auto-generate IDs that change often).
                    </li>
                    <li>
                        Add <b>description</b> to give translators context (who/where/intent).
                    </li>
                    <li>
                        Use an extractor (CLI/Babel) to collect all{" "}
                        <Styled.InlineCode>defaultMessage</Styled.InlineCode> + IDs into JSON for translation.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example CLI (conceptual)
// npx @formatjs/cli extract "src/**/*.{js,jsx,ts,tsx}" \\
   --out-file i18n/extracted/en.json --format simple

// Translators produce hi-IN.json, fr-FR.json, etc.
// At runtime, pick the user's locale and load that JSON.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Polyfills */}
            <Styled.Section>
                <Styled.H2>Polyfills (Older Browsers)</Styled.H2>
                <Styled.List>
                    <li>
                        If targeting older environments, include{" "}
                        <Styled.InlineCode>@formatjs/intl-*</Styled.InlineCode> polyfills (e.g.,{" "}
                        <Styled.InlineCode>pluralrules</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>relativetimeformat</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// At app entry (on demand)
if (!Intl.PluralRules) await import("@formatjs/intl-pluralrules/polyfill");
if (!Intl.RelativeTimeFormat) await import("@formatjs/intl-relativetimeformat/polyfill");`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use full, stable IDs (e.g., <Styled.InlineCode>home.greeting</Styled.InlineCode>).</li>
                    <li><b>Do</b> give translators context via <Styled.InlineCode>description</Styled.InlineCode>.</li>
                    <li><b>Do</b> use ICU plural/select; avoid manual <Styled.InlineCode>if/else</Styled.InlineCode> for language rules.</li>
                    <li><b>Do</b> use rich-text placeholders for bold/links; avoid embedding raw HTML.</li>
                    <li><b>Don't</b> concatenate strings like <Styled.InlineCode>{"'Hello ' + name"}</Styled.InlineCode>—always use variables in messages.</li>
                    <li><b>Don't</b> hide text inside images; translators can't change it.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Message:</b> A localizable string with placeholders and rules.</li>
                    <li><b>Descriptor:</b> The <Styled.InlineCode>{`{ id, defaultMessage, description }`}</Styled.InlineCode> for a message.</li>
                    <li><b>ICU:</b> Industry standard syntax for localization logic in strings.</li>
                    <li><b>Extraction:</b> Build-time step to collect messages for translators.</li>
                    <li><b>Fallback:</b> Using <Styled.InlineCode>defaultMessage</Styled.InlineCode> when a translation is missing.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>IntlProvider</b> to set locale/messages, author text with <b>ICU</b>, and
                render via <b>Formatted*</b> components or <b>useIntl()</b>. Keep IDs stable, give context,
                and load per-locale JSON to scale globally.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FormatJS;
