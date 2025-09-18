import { Styled } from "./styled";

const ReactI18next = () => {
    return (
        <Styled.Page>
            <Styled.Title>React i18next</Styled.Title>

            <Styled.Lead>
                <b>react-i18next</b> is the official React binding for <b>i18next</b> — a popular
                internationalization (i18n) library. It lets you translate UI text, handle plurals,
                interpolate variables, switch languages at runtime, and organize translations by locale
                and namespace.
            </Styled.Lead>

            {/* 0) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Terms (Clear Definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Internationalization (i18n):</b> Preparing your app to support multiple languages and formats without hard-coding one language.</li>
                    <li><b>Localization (l10n):</b> Supplying language-specific content (translations, date/number formats) for a specific audience or region.</li>
                    <li><b>Language code / Locale:</b> A BCP-47 tag like <Styled.InlineCode>en</Styled.InlineCode>, <Styled.InlineCode>en-US</Styled.InlineCode>, <Styled.InlineCode>hi-IN</Styled.InlineCode> describing language (and optionally region/script).</li>
                    <li><b>Resource bundle:</b> A JSON/object containing translation <i>keys</i> and <i>values</i> for a given locale and namespace.</li>
                    <li><b>Namespace:</b> A named group of keys (e.g., <Styled.InlineCode>"common"</Styled.InlineCode>, <Styled.InlineCode>"auth"</Styled.InlineCode>) to keep translations organized.</li>
                    <li><b>Interpolation:</b> Injecting dynamic values into translation strings (e.g., <Styled.InlineCode>"Hello, {`{ name }`}"</Styled.InlineCode>).</li>
                    <li><b>Pluralization:</b> Choosing the right grammatical form based on <Styled.InlineCode>count</Styled.InlineCode> (e.g., <i>1 item</i> vs <i>2 items</i>).</li>
                    <li><b>Fallback language:</b> The language used if a key is missing in the active language.</li>
                    <li><b>Detector:</b> A plugin that guesses the user's language (browser, path, cookie, etc.).</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Minimal setup */}
            <Styled.Section>
                <Styled.H2>Minimal Setup (Inline Resources)</Styled.H2>
                <Styled.Pre>
                    {`// i18n.js (example)
// Install: npm i i18next react-i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      greeting: "Hello, {{name}}!",
      cart: {
        items_one: "1 item in your cart",
        items_other: "{{count}} items in your cart"
      }
    }
  },
  hi: {
    common: {
      greeting: "नमस्ते, {{name}}!",
      cart: {
        items_one: "आपकी कार्ट में 1 आइटम",
        items_other: "आपकी कार्ट में {{count}} आइटम"
      }
    }
  }
};

i18n
  .use(initReactI18next) // connect i18next to React
  .init({
    resources,
    lng: "en",                 // initial language
    fallbackLng: "en",         // fallback if key missing
    ns: ["common"],            // namespaces available
    defaultNS: "common",
    interpolation: { escapeValue: false }, // React already escapes
  });

export default i18n;`}
                </Styled.Pre>
                <Styled.Small>
                    In real apps you'll usually load JSON files per language/namespace (HTTP or bundler).
                    This inline example keeps the setup easy to read.
                </Styled.Small>
            </Styled.Section>

            {/* 2) Wiring in React */}
            <Styled.Section>
                <Styled.H2>Using in React Components</Styled.H2>
                <Styled.Pre>
                    {`// main.jsx (example)
import "./i18n"; // import once before your app renders
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);

// AnyComponent.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

export default function AnyComponent() {
  const { t, i18n } = useTranslation("common"); // use the "common" namespace

  return (
    <>
      <p>{t("greeting", { name: "Ashish" })}</p>

      {/* Pluralization uses the 'count' option */}
      <p>{t("cart.items", { count: 1 })}</p>
      <p>{t("cart.items", { count: 3 })}</p>

      {/* Switch language at runtime */}
      <button onClick={() => i18n.changeLanguage("hi")}>Hindi</button>
      <button onClick={() => i18n.changeLanguage("en")}>English</button>

      {/* Rich text with <Trans> */}
      <p>
        <Trans i18nKey="rich">
          This is <strong>bold</strong> text from <em>translations</em>.
        </Trans>
      </p>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b><Styled.InlineCode>t(key, options)</Styled.InlineCode>:</b> returns a translated string.
                    <b> <Styled.InlineCode>Trans</Styled.InlineCode></b> lets you safely mix translated text with React elements.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Interpolation, plurals, context */}
            <Styled.Section>
                <Styled.H2>Interpolation, Plurals & Context</Styled.H2>
                <Styled.List>
                    <li><b>Interpolation:</b> Provide values via <Styled.InlineCode>{`{ name: "Ashish" }`}</Styled.InlineCode> → <i>Hello, Ashish!</i></li>
                    <li><b>Plurals:</b> Supply <Styled.InlineCode>count</Styled.InlineCode>. i18next picks the correct rule for the locale.</li>
                    <li><b>Context:</b> Use grammatical variants (e.g., gender) with <Styled.InlineCode>context</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// translations (en/common)
{
  "user": {
    "online_male": "He is online",
    "online_female": "She is online"
  }
}

// usage
t("user.online", { context: "male" })   // -> "He is online"
t("user.online", { context: "female" }) // -> "She is online"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Namespaces & organization */}
            <Styled.Section>
                <Styled.H2>Namespaces & Organization</Styled.H2>
                <Styled.List>
                    <li>Split translations into namespaces like <Styled.InlineCode>common</Styled.InlineCode>, <Styled.InlineCode>auth</Styled.InlineCode>, <Styled.InlineCode>dashboard</Styled.InlineCode> for clarity and performance.</li>
                    <li>Load namespaces per page or feature to avoid shipping everything up front.</li>
                    <li>Keep keys flat and descriptive (e.g., <Styled.InlineCode>nav.home</Styled.InlineCode>, <Styled.InlineCode>errors.required</Styled.InlineCode>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Using multiple namespaces
const { t } = useTranslation(["common", "auth"]);
t("common:greeting");
t("auth:signIn");`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Language detection & lazy loading */}
            <Styled.Section>
                <Styled.H2>Language Detection & Lazy Loading</Styled.H2>
                <Styled.List>
                    <li><b>Detection:</b> A detector plugin can read browser language, URL, or cookies to pick the initial language.</li>
                    <li><b>Lazy loading:</b> Load only the needed language/namespace at runtime (via HTTP backend or dynamic imports).</li>
                    <li><b>Suspense:</b> react-i18next can use React <Styled.InlineCode>Suspense</Styled.InlineCode> to wait for loaded translations.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Install: npm i i18next-browser-languagedetector i18next-http-backend
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)        // load /locales/{lng}/{ns}.json at runtime
  .use(LanguageDetector)   // detect initial language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["common", "auth"],
    interpolation: { escapeValue: false },
  });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Formatting dates & numbers (quick intro) */}
            <Styled.Section>
                <Styled.H2>Formatting Dates & Numbers (Quick Intro)</Styled.H2>
                <Styled.List>
                    <li>Use the built-in <Styled.InlineCode>Intl.DateTimeFormat</Styled.InlineCode> and <Styled.InlineCode>Intl.NumberFormat</Styled.InlineCode> to format according to the active locale.</li>
                    <li>You can create a small helper that reads the current <Styled.InlineCode>i18n.language</Styled.InlineCode> and formats values consistently.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// inside a component
const { i18n } = useTranslation();
const price = new Intl.NumberFormat(i18n.language, { style: "currency", currency: "INR" }).format(1299.5);
const date  = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(new Date());
// result looks right for each locale (e.g., en-US vs hi-IN)`}
                </Styled.Pre>
                <Styled.Small>
                    For ICU-style message formatting or advanced rules, add an i18next ICU plugin; otherwise
                    the native <Styled.InlineCode>Intl</Styled.InlineCode> APIs cover most needs.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep English (or your base language) in <i>keys</i>, not inlined UI; translate via <Styled.InlineCode>t()</Styled.InlineCode>.</li>
                    <li><b>Do</b> organize keys by namespace and feature; keep names descriptive and stable.</li>
                    <li><b>Do</b> test plurals and variables for each language (especially non-English rules).</li>
                    <li><b>Don't</b> concatenate strings to build sentences; let translators reorder segments via full sentence keys.</li>
                    <li><b>Don't</b> bake punctuation/emoji into many keys; prefer a single translated sentence.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>BCP-47:</b> Standard for language tags (e.g., <Styled.InlineCode>fr-CA</Styled.InlineCode>).</li>
                    <li><b>CLDR:</b> Locale data repository that powers pluralization rules in many libs.</li>
                    <li><b>ICU MessageFormat:</b> A syntax for complex messages (select, plural, ordinal).</li>
                    <li><b>Namespace:</b> A logical group of translation keys (easier loading and maintenance).</li>
                    <li><b>Detector:</b> Plugin that auto-detects the user's preferred language.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: With react-i18next you call <b>t()</b> to translate strings, use <b>count</b> for plurals,
                <b> Trans</b> for rich content, organize strings by <b>namespaces</b>, and switch languages at runtime.
                Start simple with inline resources, then scale out to JSON files and lazy loading.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ReactI18next;
