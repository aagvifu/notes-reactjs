import React from "react";
import { Styled } from "./styled";

const Transitions = () => {
    return (
        <Styled.Page>
            <Styled.Title>Transitions</Styled.Title>

            <Styled.Lead>
                A <b>transition</b> marks some state updates as <i>non-urgent</i> so React can keep the UI
                responsive. Urgent updates (like typing and button clicks) feel instant, while heavy work
                (like filtering a big list) runs as a transition that can be interrupted to avoid jank.
            </Styled.Lead>

            {/* 1) Why transitions? */}
            <Styled.Section>
                <Styled.H2>Why Transitions?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Problem:</b> Big renders (filter, sort, route change) can block the main thread and
                        make typing or clicking feel laggy.
                    </li>
                    <li>
                        <b>Idea:</b> Separate updates into <b>urgent</b> (must feel immediate) and{" "}
                        <b>non-urgent</b> (can be delayed/aborted) using transitions.
                    </li>
                    <li>
                        <b>Benefit:</b> React keeps the last interactive UI on screen while preparing the next
                        screen in the background. If a new input arrives, the background work is interrupted.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Urgent update:</b> Must reflect instantly (e.g., <Styled.InlineCode>input.value</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Transition (non-urgent update):</b> A state update that can be delayed or restarted
                        without harming UX (e.g., re-rendering a 10k-row list).
                    </li>
                    <li>
                        <b><Styled.InlineCode>startTransition(fn)</Styled.InlineCode>:</b> Marks updates inside{" "}
                        <Styled.InlineCode>fn</Styled.InlineCode> as non-urgent.
                    </li>
                    <li>
                        <b><Styled.InlineCode>useTransition()</Styled.InlineCode>:</b> Hook returning{" "}
                        <Styled.InlineCode>[isPending, startTransition]</Styled.InlineCode> for local pending UI.
                    </li>
                    <li>
                        <b>Interruptible rendering:</b> React can pause/throw away in-progress work when new
                        urgent input arrives.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Core pattern (beginner) */}
            <Styled.Section>
                <Styled.H2>Beginner Pattern: Input (urgent) → Filter (transition)</Styled.H2>
                <Styled.Pre>
                    {`import React, { useState, useTransition } from "react";

function Search({ items }) {
  const [text, setText] = useState("");
  const [results, setResults] = useState(items);
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setText(next); // urgent: the input must update immediately

    startTransition(() => {
      // non-urgent: heavy filtering can lag; mark it as a transition
      const lower = next.trim().toLowerCase();
      const filtered = items.filter(it => it.name.toLowerCase().includes(lower));
      setResults(filtered);
    });
  }

  return (
    <div>
      <input value={text} onChange={onChange} placeholder="Type to search..." />
      {isPending && <p>Updating results…</p>}
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Rule of thumb:</b> update the input state urgently; wrap the heavy derived work in a
                    transition.
                </Styled.Small>
            </Styled.Section>

            {/* 4) startTransition (API) */}
            <Styled.Section>
                <Styled.H2><code>startTransition</code> API</Styled.H2>
                <Styled.List>
                    <li>
                        Use the function from <Styled.InlineCode>useTransition()</Styled.InlineCode> for local
                        pending state, or <Styled.InlineCode>import &#123; startTransition &#125; from "react"</Styled.InlineCode>{" "}
                        for a global call (no <Styled.InlineCode>isPending</Styled.InlineCode> feedback).
                    </li>
                    <li>
                        Wrap only the <i>non-urgent</i> state updates. Don’t wrap the input’s own state.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { startTransition } from "react";

function onRouteChange(nextPath) {
  // keep current screen responsive; prepare next screen in background
  startTransition(() => {
    // e.g., setRoute, load data in effects, etc.
  });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) useTransition (API) */}
            <Styled.Section>
                <Styled.H2><code>useTransition</code> API</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Signature:</b>{" "}
                        <Styled.InlineCode>const [isPending, startTransition] = useTransition();</Styled.InlineCode>
                    </li>
                    <li>
                        <b>isPending:</b> <i>true</i> while the transition is outstanding. Great for spinners,
                        dimming, or “skeleton” states.
                    </li>
                    <li>
                        <b>startTransition:</b> wrapper that marks updates non-urgent.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const [isPending, startTransition] = useTransition();

function onSortChange(nextSort) {
  startTransition(() => {
    // setSort(nextSort) -> triggers expensive re-render in a transition
  });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Realistic example: tab switch */}
            <Styled.Section>
                <Styled.H2>Realistic Example: Tab Switch With Heavy Panel</Styled.H2>
                <Styled.Pre>
                    {`import React, { useState, useTransition } from "react";

function Tabs({ panels }) {
  const [active, setActive] = useState(0);
  const [isPending, startTransition] = useTransition();

  function select(i) {
    // the click is urgent; the heavy panel render is non-urgent
    startTransition(() => setActive(i));
  }

  return (
    <div>
      <div role="tablist">
        {panels.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => select(i)}
            disabled={isPending && i === active}
          >
            {p.title}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-busy={isPending}>
        {isPending ? <Skeleton /> : panels[active].content}
      </div>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The previous tab stays visible until the next tab’s heavy content is ready, preventing
                    flicker and keeping clicks snappy.
                </Styled.Small>
            </Styled.Section>

            {/* 7) When to use / not use */}
            <Styled.Section>
                <Styled.H2>When to Use / Not Use</Styled.H2>
                <Styled.List>
                    <li><b>Use for:</b> filtering, sorting, pagination, tab/route changes, large list renders, chart updates.</li>
                    <li><b>Avoid for:</b> form input echo, cursor position, button press feedback, “are we submitting?” flags — these are urgent.</li>
                    <li><b>Note:</b> Transitions don’t make work faster; they make it <i>interruptible</i>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Patterns & tips */}
            <Styled.Section>
                <Styled.H2>Patterns & Tips</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Split state:</b> urgent state for small, immediate UI; non-urgent derived state in
                        transitions.
                    </li>
                    <li>
                        <b>Show progress:</b> wire <Styled.InlineCode>isPending</Styled.InlineCode> to a small
                        hint (spinner/dim/skeleton).
                    </li>
                    <li>
                        <b>Combine with <Styled.InlineCode>useDeferredValue</Styled.InlineCode>:</b> defer a heavy
                        value derived from urgent input to keep typing smooth.
                    </li>
                    <li>
                        <b>Memoization helps:</b> if the heavy part mounts often, memo the expensive subtrees.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import React, { useDeferredValue } from "react";

function List({ query, items }) {
  const deferredQuery = useDeferredValue(query); // lags behind during typing
  const lower = deferredQuery.trim().toLowerCase();
  const filtered = items.filter(it => it.name.toLowerCase().includes(lower));
  return <BigList data={filtered} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Common mistakes */}
            <Styled.Section>
                <Styled.H2>Common Mistakes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Wrapping the input state in a transition.</b> Don’t. The input must update instantly.
                    </li>
                    <li>
                        <b>Expecting a speedup.</b> Work still takes time; it’s just scheduled better.
                    </li>
                    <li>
                        <b>Forgetting UX feedback.</b> No <Styled.InlineCode>isPending</Styled.InlineCode> hint
                        makes the app feel frozen even though it’s working.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Urgent update:</b> must render immediately (typing, click echo).</li>
                    <li><b>Non-urgent update:</b> can be prepared in background (filter, heavy rerender).</li>
                    <li><b>Transition:</b> a non-urgent update marked via <Styled.InlineCode>startTransition</Styled.InlineCode>.</li>
                    <li><b>isPending:</b> boolean flag while a transition is in progress.</li>
                    <li><b>Interruptible rendering:</b> React drops work when new urgent input arrives.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Keep interactions snappy by treating input as urgent and heavy UI changes as a
                transition. Use <code>useTransition</code> for local pending feedback, and combine with{" "}
                <code>useDeferredValue</code> when you need to lag heavy derived values behind fast input.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Transitions;
