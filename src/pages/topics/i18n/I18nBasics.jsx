import React from "react";
import { Styled } from "./styled";

const I18nBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Internationalization (i18n) — Basics</Styled.Title>

            <Styled.Lead>
                <b>Internationalization (i18n)</b> is preparing your app so it can be <i>localized</i> into
                different languages and regions without code changes. You externalize UI text, format
                dates/numbers correctly, handle plural forms, and respect direction (LTR/RTL).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Internationalization (i18n):</b> Engineering work that makes an app ready for multiple locales (extract strings, use proper formatters, no hard-coded culture).</li>
                    <li><b>Localization (l10n):</b> Adapting content for a specific <em>locale</em> (translations, formats, images, examples).</li>
                    <li><b>Locale:</b> A language+region identifier such as <Styled.InlineCode>en-US</Styled.InlineCode> or <Styled.InlineCode>hi-IN</Styled.InlineCode> (BCP 47 tag). It influences text, number, date/time formats, etc.</li>
                    <li><b>Translation key:</b> A stable ID like <Styled.InlineCode>"home.title"</Styled.InlineCode> that maps to a localized message string.</li>
                    <li><b>ICU MessageFormat:</b> A syntax for messages with variables, plural/gender rules (<Styled.InlineCode>{`{count, plural, one {...} other {...}}`}</Styled.InlineCode>).</li>
                    <li><b>CLDR:</b> A community-maintained dataset of locale rules used by modern formatters (the <Styled.InlineCode>Intl</Styled.InlineCode> APIs rely on it).</li>
                    <li><b>Right-to-Left (RTL):</b> Scripts like Arabic/Hebrew. UI must support <Styled.InlineCode>dir="rtl"</Styled.InlineCode> and logical CSS properties.</li>
                    <li><b>Pseudo-localization:</b> Fake translations that lengthen and accent characters to reveal truncation/missing i18n.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why it matters */}
            <Styled.Section>
                <Styled.H2>Why i18n?</Styled.H2>
                <Styled.List>
                    <li>Reach users in their language and conventions.</li>
                    <li>Prevent bugs from hard-coded formats (e.g., month/day order, decimal separators).</li>
                    <li>Scale: add new locales without touching component logic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal dictionary approach */}
            <Styled.Section>
                <Styled.H2>Minimal “Dictionary” Approach (No Library)</Styled.H2>
                <Styled.Pre>
                    {`// messages.js
export const MESSAGES = {
  "en": {
    "hello.name": "Hello, {name}!",
    "cart.zero": "Your cart is empty",
    "cart.one": "1 item in cart",
    "cart.other": "{count} items in cart",
    "date.example": "Today is {date}",
    "price.example": "Price: {price}"
  },
  "hi": {
    "hello.name": "नमस्ते, {name}!",
    "cart.zero": "आपकी कार्ट खाली है",
    "cart.one": "कार्ट में 1 वस्तु",
    "cart.other": "कार्ट में {count} वस्तुएँ",
    "date.example": "आज {date} है",
    "price.example": "कीमत: {price}"
  }
};`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// i18n-lite.js
import { MESSAGES } from "./messages";

export function formatMessage(locale, key, vars = {}, fallbackLocale = "en") {
  const table = MESSAGES[locale] || {};
  const fallback = MESSAGES[fallbackLocale] || {};
  const template = table[key] ?? fallback[key] ?? key;
  return template.replace(/\\{(\\w+)\\}/g, (_, k) => String(vars[k] ?? ""));
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is the simplest possible approach: keys + string templates. Real projects use libraries
                    to handle plurals, ICU syntax, async loading, and interpolation safely.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Plurals the right way */}
            <Styled.Section>
                <Styled.H2>Plural Rules</Styled.H2>
                <Styled.List>
                    <li><b>Plural forms:</b> Languages don't share the same plural logic (some have 2, others 3+). Don't concatenate strings; select the right message per rule.</li>
                    <li><b>Intl.PluralRules:</b> Picks a category (<Styled.InlineCode>zero/one/two/few/many/other</Styled.InlineCode>) for a number in a locale.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// plural-lite.js
export function pluralize(locale, count) {
  const pr = new Intl.PluralRules(locale);
  return pr.select(count); // e.g. "one" | "other" (en), could be "few"/"many" for other locales
}

export function formatCartCount(locale, count) {
  const category = pluralize(locale, count);
  const key =
    category === "one" ? "cart.one" :
    category === "zero" ? "cart.zero" :
    "cart.other";
  return formatMessage(locale, key, { count });
}`}
                </Styled.Pre>
                <Styled.Small>ICU MessageFormat (covered later) solves this more elegantly in one string.</Styled.Small>
            </Styled.Section>

            {/* 5) Dates & numbers via Intl */}
            <Styled.Section>
                <Styled.H2>Formatting Dates &amp; Numbers (Intl APIs)</Styled.H2>
                <Styled.List>
                    <li><b>Intl.DateTimeFormat:</b> Localized date/time output.</li>
                    <li><b>Intl.NumberFormat:</b> Thousands separators, decimals, currency, percent.</li>
                    <li><b>Locale vs Time zone:</b> The locale chooses formatting conventions; time zone chooses the clock.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const locale = "hi-IN";

// Date
const today = new Date();
const dateText = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(today);

// Currency
const priceText = new Intl.NumberFormat(locale, { style: "currency", currency: "INR" })
  .format(1234567.89);

// Compose into a message (with our lite formatter)
const out1 = formatMessage(locale, "date.example", { date: dateText });
const out2 = formatMessage(locale, "price.example", { price: priceText });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Locales & BCP 47 */}
            <Styled.Section>
                <Styled.H2>Locales &amp; BCP 47 Language Tags</Styled.H2>
                <Styled.List>
                    <li><b>Structure:</b> <Styled.InlineCode>language[-Script][-REGION]</Styled.InlineCode> (e.g., <Styled.InlineCode>zh-Hant-TW</Styled.InlineCode>).</li>
                    <li><b>Examples:</b> <Styled.InlineCode>en-GB</Styled.InlineCode> (English, UK), <Styled.InlineCode>hi-IN</Styled.InlineCode> (Hindi, India), <Styled.InlineCode>ar-EG</Styled.InlineCode> (Arabic, Egypt).</li>
                    <li><b>Fallbacks:</b> If <Styled.InlineCode>pt-BR</Styled.InlineCode> is missing, fall back to <Styled.InlineCode>pt</Styled.InlineCode>, then default (e.g., <Styled.InlineCode>en</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) RTL & layout */}
            <Styled.Section>
                <Styled.H2>Right-to-Left (RTL) Support</Styled.H2>
                <Styled.List>
                    <li>Set <Styled.InlineCode>{`<html dir="rtl" lang="ar">`}</Styled.InlineCode> or on a container.</li>
                    <li>Use <b>logical CSS</b> (e.g., <Styled.InlineCode>margin-inline-start</Styled.InlineCode> instead of <Styled.InlineCode>margin-left</Styled.InlineCode>).</li>
                    <li>Avoid directional icons hard-coded for LTR; flip chevrons when <Styled.InlineCode>[dir="rtl"]</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Example: logical properties */
.card {
  padding-inline: 16px;
  margin-inline-start: 12px; /* flips automatically in RTL-capable engines */
}

/* Example: icon flip */
[dir="rtl"] .chevron { transform: scaleX(-1); }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Pseudo-localization */}
            <Styled.Section>
                <Styled.H2>Pseudo-localization (Testing Trick)</Styled.H2>
                <Styled.List>
                    <li>Expand and accent characters to reveal truncation and missing keys.</li>
                    <li>Helps check if UI breaks with longer translations.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function pseudo(text) {
  const map = { a:"á", e:"é", i:"í", o:"ó", u:"ú", A:"Â", E:"Ê", I:"Î", O:"Ô", U:"Û" };
  return "［" + text.replace(/[aeiouAEIOU]/g, c => map[c] || c) + "］";
}
// pseudo("Your cart is empty") -> ［Yóúr cárt ís émpty］`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do/Don't checklist */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> externalize every user-visible string to keys (no hard-coded English in components).</li>
                    <li><b>Do</b> use <Styled.InlineCode>Intl</Styled.InlineCode> for dates/numbers; don't hand-roll separators.</li>
                    <li><b>Do</b> design for text expansion (≈30-50%) and line wrapping.</li>
                    <li><b>Don't</b> concatenate sentence fragments (grammar differs across languages).</li>
                    <li><b>Don't</b> embed HTML in translations unless your tooling sanitizes safely.</li>
                    <li><b>Don't</b> assume plural means just “add an s”; use plural rules.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>BCP 47:</b> Standard for locale tags (<Styled.InlineCode>en-US</Styled.InlineCode>).</li>
                    <li><b>ICU:</b> International Components for Unicode—libraries and MessageFormat spec.</li>
                    <li><b>Message catalog:</b> A file (JSON, PO, etc.) with key→translation entries.</li>
                    <li><b>Fallback locale:</b> The locale used if a translation is missing.</li>
                    <li><b>Translatable string:</b> Any user-visible text extracted for translators.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: prepare your UI by extracting strings, using proper formatters, supporting plurals,
                and respecting locale/RTL. In the next topics, we'll use libraries like <i>react-i18next</i>
                and <i>FormatJS</i> to scale this.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default I18nBasics;
