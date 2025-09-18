import { Styled } from "./styled";

const PluralsDatesNumbers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Plurals, Dates &amp; Numbers</Styled.Title>

            <Styled.Lead>
                Localizing <b>quantities</b>, <b>numbers</b>, <b>currencies</b>, and <b>dates/times</b> is
                essential for i18n. Use the browser's <Styled.InlineCode>Intl</Styled.InlineCode> APIs for
                correct rules per <b>locale</b>, not manual string math or concatenation.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Locale:</b> a language + region preference (e.g.,{" "}
                        <Styled.InlineCode>en-US</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>hi-IN</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>ar-EG</Styled.InlineCode>) that drives formatting rules.
                    </li>
                    <li>
                        <b>BCP 47 tag:</b> the standardized string for a locale (e.g.,{" "}
                        <Styled.InlineCode>pt-BR</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>zh-Hant-TW</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>CLDR:</b> Unicode's Common Locale Data Repository—reference data for plural rules,
                        calendars, number systems, names, etc.
                    </li>
                    <li>
                        <b>ICU MessageFormat:</b> a message syntax for variables, plurals, genders, and
                        select-cases, used by libraries like FormatJS and i18next.
                    </li>
                    <li>
                        <b>Plural categories:</b> language-dependent buckets like{" "}
                        <Styled.InlineCode>zero</Styled.InlineCode>, <Styled.InlineCode>one</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>two</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>few</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>many</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>other</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Numbering system:</b> set of digits used by a locale (e.g., Latin{" "}
                        <Styled.InlineCode>0-9</Styled.InlineCode> vs Eastern Arabic{" "}
                        <Styled.InlineCode>۰-۹</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Calendar:</b> civil calendar used to display date (e.g., Gregorian, Buddhist, Islamic).
                    </li>
                    <li>
                        <b>Time zone:</b> a geographical region's clock rules including DST (e.g.,
                        <Styled.InlineCode>Asia/Kolkata</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>America/New_York</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Plurals with Intl.PluralRules */}
            <Styled.Section>
                <Styled.H2>Pluralization with <code>Intl.PluralRules</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>What it does:</b> classifies a <em>number</em> into a locale's plural category.
                    </li>
                    <li>
                        <b>Why it matters:</b> English mostly uses <i>one/other</i>, but many languages have 3-6
                        categories with complex rules. Never hard-code English assumptions.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Classify counts for a given locale
const en = new Intl.PluralRules('en');      // English
en.select(0); // "other"
en.select(1); // "one"
en.select(2); // "other"

const ru = new Intl.PluralRules('ru');      // Russian
ru.select(1); // "one"
ru.select(2); // "few"
ru.select(5); // "many"
ru.select(11); // "many"
ru.select(22); // "few"

// Use the category to pick a message:
function formatItemCount(n, locale = 'en') {
  const pr = new Intl.PluralRules(locale);
  const cat = pr.select(n);
  const messages = {
    one:   \`\${n} item\`,
    few:   \`\${n} items\`,   // used in some locales
    many:  \`\${n} items\`,
    other: \`\${n} items\`
  };
  return messages[cat] ?? messages.other;
}
// formatItemCount(1, 'en') -> "1 item"
// formatItemCount(2, 'ru') -> "2 items" (category "few")`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Tip:</b> Libraries (i18next, FormatJS) hide this mapping—just supply the count and the
                    library selects the correct plural form per locale.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Numbers, currency, percent, units */}
            <Styled.Section>
                <Styled.H2>Numbers, Currency, Percent &amp; Units</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>Intl.NumberFormat</Styled.InlineCode> for locale-aware digits,
                        separators, currency symbols, and rounding.
                    </li>
                    <li>
                        <b>Key options:</b>{" "}
                        <Styled.InlineCode>style</Styled.InlineCode> (<i>decimal | currency | percent | unit</i>),{" "}
                        <Styled.InlineCode>currency</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>unit</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>notation</Styled.InlineCode> (<i>standard | compact</i>),{" "}
                        <Styled.InlineCode>maximumFractionDigits</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>signDisplay</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Basic decimal
new Intl.NumberFormat('en-IN').format(1234567.89)   // "12,34,567.89" (Indian grouping)

// Currency (INR) — never build currency strings manually
new Intl.NumberFormat('hi-IN', { style: 'currency', currency: 'INR' })
  .format(2599.5)                                   // "₹ 2,599.50" (Hindi, India)

// Percent
new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })
  .format(0.1234)                                   // "12.3%"

// Units (requires a sanctioned unit identifier, e.g., 'kilometer', 'byte', 'celsius')
new Intl.NumberFormat('en-GB', { style: 'unit', unit: 'kilometer' })
  .format(5)                                        // "5 km"

// Compact notation (K, M)
new Intl.NumberFormat('en', { notation: 'compact' }).format(12500) // "13K"

// Control digits
new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  .format(9)                                        // "9.00"

// Sign display
new Intl.NumberFormat('en', { signDisplay: 'exceptZero' }).format(5) // "+5"
new Intl.NumberFormat('en', { signDisplay: 'exceptZero' }).format(0) // "0"`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Rounding:</b> prefer <i>fraction digits</i> (currency) or <i>significant digits</i> (scientific
                    values) instead of manual rounding and string concatenation.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Dates & times */}
            <Styled.Section>
                <Styled.H2>Dates &amp; Times</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>Intl.DateTimeFormat</Styled.InlineCode> with a <b>time zone</b> for
                        predictable output across users.
                    </li>
                    <li>
                        <b>dateStyle/timeStyle:</b> high-level presets (<i>short | medium | long | full</i>).
                    </li>
                    <li>
                        <b>hourCycle:</b> 12-hour vs 24-hour (<Styled.InlineCode>h12</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>h23</Styled.InlineCode>).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`const d = new Date('2025-09-18T17:30:00Z'); // UTC time

// India time (IST)
new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
}).format(d) // e.g., "Sep 18, 2025, 11:00 PM"

// U.S. East
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full', timeStyle: 'short', timeZone: 'America/New_York', hourCycle: 'h12'
}).format(d) // e.g., "Thursday, September 18, 2025 at 1:30 PM"

// Custom fields
new Intl.DateTimeFormat('en-GB', {
  year: 'numeric', month: 'long', day: '2-digit', weekday: 'short'
}).format(d) // e.g., "Thu, 18 September 2025"`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Tip:</b> Always decide the <i>source</i> of truth (UTC? server time?) and specify{" "}
                    <Styled.InlineCode>timeZone</Styled.InlineCode> for display. Don't assume the viewer's local
                    time is acceptable.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Relative time */}
            <Styled.Section>
                <Styled.H2>Relative Time (e.g., "in 3 days")</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>Intl.RelativeTimeFormat</Styled.InlineCode> for phrases like{" "}
                        "yesterday", "in 5 minutes", "3 days ago".
                    </li>
                    <li>
                        <b>Unit:</b> <Styled.InlineCode>'second'|'minute'|'hour'|'day'|'week'|'month'|'year'</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
rtf.format(-1, 'day'); // "yesterday"
rtf.format(3, 'day');  // "in 3 days"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Numbering systems & calendars */}
            <Styled.Section>
                <Styled.H2>Numbering Systems &amp; Calendars</Styled.H2>
                <Styled.List>
                    <li>
                        You can request digits/calendars via <b>Unicode extensions</b> in the locale tag or via
                        options. Example: <Styled.InlineCode>ar-EG-u-nu-arab</Styled.InlineCode> (Arabic digits).
                    </li>
                    <li>
                        <b>Calendar:</b> choose with <Styled.InlineCode>calendar</Styled.InlineCode> option or
                        locale extension (e.g., <Styled.InlineCode>u-ca-buddhist</Styled.InlineCode>).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Eastern Arabic digits
new Intl.NumberFormat('ar-EG-u-nu-arab').format(2025) // "٢٠٢٥"

// Buddhist calendar
new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' })
  .format(new Date('2025-09-18')) // year differs from Gregorian`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Library quick recipes (FYI) */}
            <Styled.Section>
                <Styled.H2>Libraries: Quick Recipes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>FormatJS (react-intl):</b> declarative components & helpers for ICU messages.
                    </li>
                    <li>
                        <b>i18next:</b> translation keys with pluralization—pass <Styled.InlineCode>count</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// react-intl (FormatJS) examples
// <FormattedNumber value={2599.5} style="currency" currency="INR" />
// <FormattedDate value={new Date()} dateStyle="medium" timeStyle="short" timeZone="Asia/Kolkata" />
// <FormattedMessage id="cart.items" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count }} />

// i18next pluralization
// en/translation.json
// { "cart": { "item_one": "{{count}} item", "item_other": "{{count}} items" } }
// t('cart.item', { count: 1 }) -> "1 item"
// t('cart.item', { count: 3 }) -> "3 items"`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Note:</b> Libraries pick plural forms per locale automatically; you maintain only the
                    translations for each form.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <Styled.InlineCode>Intl.NumberFormat</Styled.InlineCode> for currency/percent—never build strings manually.</li>
                    <li><b>Do</b> pass an explicit <Styled.InlineCode>timeZone</Styled.InlineCode> when rendering cross-region times.</li>
                    <li><b>Do</b> use plural APIs/libraries; avoid <i>if (n === 1)</i> logic in app code.</li>
                    <li><b>Don't</b> concatenate raw numbers and symbols (e.g., "₹" + 1000) — formatting varies by locale.</li>
                    <li><b>Don't</b> assume 12-hour or 24-hour clocks; respect locale or set <Styled.InlineCode>hourCycle</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Notation:</b> number shortening style (<Styled.InlineCode>standard</Styled.InlineCode> vs <Styled.InlineCode>compact</Styled.InlineCode>).</li>
                    <li><b>Sign display:</b> how to show plus/minus (e.g., <Styled.InlineCode>always</Styled.InlineCode>, <Styled.InlineCode>exceptZero</Styled.InlineCode>).</li>
                    <li><b>Hour cycle:</b> 12 vs 24-hour clock (<Styled.InlineCode>h12</Styled.InlineCode>, <Styled.InlineCode>h23</Styled.InlineCode>).</li>
                    <li><b>Numeric/Auto (RelativeTime):</b> show words like "yesterday" (<i>auto</i>) vs "in 1 day" (<i>numeric</i>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use the <i>Intl</i> APIs (PluralRules, NumberFormat, DateTimeFormat, RelativeTimeFormat)
                to express locale-correct plurals, numbers, money, and times. Specify locales and time zones,
                let libraries handle ICU messages, and avoid manual formatting.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default PluralsDatesNumbers;
