import React from "react";
import { Styled } from "./styled";

const UseDeferredValueHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useDeferredValue</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useDeferredValue</Styled.InlineCode> creates a <b>lagging copy</b> of a value.
                When the original value changes, React may <b>delay</b> updating the deferred copy so urgent
                interactions stay responsive. The UI can keep showing content for the previous value while
                rendering the heavy update in the background.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const deferred = React.useDeferredValue(value); // returns a value that may "lag" behind`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>Deferred value:</b> a read-only value that trails the source during expensive renders, then catches up.</li>
                    <li><b>Urgent vs non-urgent:</b> urgent updates (typing/clicks) render immediately; work driven by the deferred value can be delayed.</li>
                    <li><b>Staleness flag:</b> compare <Styled.InlineCode>value !== deferred</Styled.InlineCode> to know if the UI is catching up.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core pattern: typeahead with heavy list */}
            <Styled.Section>
                <Styled.H2>Core pattern: typeahead with a heavy list</Styled.H2>
                <Styled.Pre>
                    {`function Search({ items }) {
  const [input, setInput] = React.useState("");
  const deferredQuery = React.useDeferredValue(input); // may lag during heavy renders
  const isStale = input !== deferredQuery;

  // heavy work depends on the deferred value, not the immediate input
  const visible = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    // assume expensive filter + sort for large data
    return items
      .filter(it => it.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, deferredQuery]);

  return (
    <>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Search…"
      />
      {isStale && <Styled.Small>Updating…</Styled.Small>}
      <ul aria-busy={isStale ? "true" : "false"} style={{ opacity: isStale ? 0.7 : 1 }}>
        {visible.map(it => <li key={it.id}>{it.name}</li>)}
      </ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The text input stays snappy (urgent). The list updates from <code>deferredQuery</code>, so heavy work can lag without blocking typing.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Split responsibilities: pass only deferred props to heavy children */}
            <Styled.Section>
                <Styled.H2>Split responsibilities: pass deferred props to heavy children</Styled.H2>
                <Styled.Pre>
                    {`const HeavyList = React.memo(function HeavyList({ query, items }) {
  const visible = React.useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(x => x.name.toLowerCase().includes(q));
  }, [items, query]);
  return <ul>{visible.map(x => <li key={x.id}>{x.name}</li>)}</ul>;
});

function SearchPage({ items }) {
  const [input, setInput] = React.useState("");
  const deferred = React.useDeferredValue(input);
  const isStale = input !== deferred;

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      {isStale && <Styled.Small>Updating…</Styled.Small>}
      <HeavyList items={items} query={deferred} /> {/* heavy child sees deferred value */}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the heavy child wrapped in <code>React.memo</code> and feed it the deferred value to avoid re-rendering on every keystroke.
                </Styled.Small>
            </Styled.Section>

            {/* 4) useDeferredValue vs useTransition */}
            <Styled.Section>
                <Styled.H2><code>useDeferredValue</code> vs <code>useTransition</code></Styled.H2>
                <Styled.List>
                    <li><b>useDeferredValue:</b> simplest when the entire heavy UI derives from <em>one value</em>. Replace that value with its deferred copy.</li>
                    <li><b>useTransition:</b> more control over <em>which</em> updates are low priority. Wrap setters in <Styled.InlineCode>startTransition</Styled.InlineCode> and use <Styled.InlineCode>isPending</Styled.InlineCode> for status.</li>
                    <li>Both can be combined, but usually pick the one that matches the mental model of the UI.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) With Suspense / data fetching */}
            <Styled.Section>
                <Styled.H2>With <code>Suspense</code> (data fetching)</Styled.H2>
                <Styled.Pre>
                    {`import React, { Suspense } from "react";

function ProductsPage() {
  const [filter, setFilter] = React.useState("all");
  const deferred = React.useDeferredValue(filter);
  const isStale = filter !== deferred;

  return (
    <>
      <Toolbar value={filter} onChange={setFilter} />
      {isStale && <Styled.Small>Loading…</Styled.Small>}
      <Suspense fallback={<p>Loading products…</p>}>
        <ProductsList resource={fetchProductsResource(deferred)} />
      </Suspense>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The previous list stays visible while a new resource for the deferred filter loads, reducing flashing.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Heuristics: when to reach for it */}
            <Styled.Section>
                <Styled.H2>Heuristics: when to use</Styled.H2>
                <Styled.List>
                    <li>Typing/search boxes that drive expensive lists, charts, or maps.</li>
                    <li>Tab/content switches where heavy content depends on a single selected value.</li>
                    <li>Any case where UI should remain interactive while a derived view catches up.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Not a debounce/throttle */}
            <Styled.Section>
                <Styled.H2>Not a debounce/throttle</Styled.H2>
                <Styled.List>
                    <li><b>Debounce/throttle</b> changes the <em>event timing</em> (setTimeout, rate limiting).</li>
                    <li><b>useDeferredValue</b> keeps every change but lets React schedule when the heavy render appears.</li>
                    <li>Can be paired with debouncing if network calls should be reduced; defer for render cost, debounce for API cost.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Accessibility & UX cues */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX cues</Styled.H2>
                <Styled.List>
                    <li>Use a subtle pending hint while <Styled.InlineCode>value !== deferred</Styled.InlineCode> (spinner/dimming, <Styled.InlineCode>aria-busy</Styled.InlineCode>).</li>
                    <li>Preserve keyboard focus and avoid blocking inputs; the main benefit is uninterrupted interaction.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Driving a <b>controlled input’s value</b> from the deferred copy → keystrokes feel laggy. Use the <em>immediate</em> value for inputs.</li>
                    <li>Mutating or depending on incidental side effects from the deferred value—treat it as a pure, read-only signal.</li>
                    <li>Assuming correctness depends on deferred timing; it is a scheduling hint, not logic.</li>
                    <li>Doing expensive work without memoization. Defer <em>and</em> memoize to reduce repeated computation.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> compute heavy UI from the deferred value so typing stays responsive.</li>
                    <li><b>Do</b> show lightweight pending feedback while catching up.</li>
                    <li><b>Do</b> pair with <Styled.InlineCode>React.memo</Styled.InlineCode>/<Styled.InlineCode>useMemo</Styled.InlineCode> for large data.</li>
                    <li><b>Don’t</b> bind inputs to the deferred value.</li>
                    <li><b>Don’t</b> rely on deferred timing for correctness or state synchronization.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useDeferredValue</Styled.InlineCode> keeps interactions smooth by letting heavy UI
                lag behind a changing value. Use it where one value drives expensive work, keep inputs urgent, memoize heavy
                computations, and add clear but subtle pending hints.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseDeferredValueHook;
