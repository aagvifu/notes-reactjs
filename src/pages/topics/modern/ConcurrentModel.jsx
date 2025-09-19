import { Styled } from "./styled";

const ConcurrentModel = () => {
    return (
        <Styled.Page>
            <Styled.Title>Concurrent Model</Styled.Title>

            <Styled.Lead>
                The <b>Concurrent Model</b> in React 18+ lets React <i>pause, resume, abort, and prioritize</i> rendering work.
                It makes UIs feel smoother during heavy updates by doing work in small chunks and giving urgent interactions
                (like typing or clicks) priority over slower, non-urgent UI updates.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is the Concurrent Model?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Concurrent Rendering:</b> a rendering mode where React can <em>interrupt</em> an in-progress render,
                        switch to something more urgent, and come back later. It's still single-threaded JavaScript; React just
                        schedules work more intelligently.
                    </li>
                    <li>
                        <b>Scheduling:</b> React breaks rendering into small units of work and schedules them based on <em>priority</em>
                        (e.g., user input is higher priority than rendering a huge list).
                    </li>
                    <li>
                        <b>Non-blocking UI:</b> heavy updates no longer freeze the app; urgent interactions stay responsive.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What it is NOT */}
            <Styled.Section>
                <Styled.H2>What it is <i>not</i></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Not multithreading:</b> React does <em>not</em> use multiple JS threads. “Concurrent” means smarter
                        scheduling on a single thread.
                    </li>
                    <li>
                        <b>Not partial commits:</b> React still commits a consistent UI. It won't show half-finished trees; it renders
                        offscreen and then swaps in a complete, consistent result.
                    </li>
                    <li>
                        <b>Not automatic magic:</b> you still choose which updates are urgent vs. non-urgent (usually via
                        <Styled.InlineCode>startTransition</Styled.InlineCode> or <Styled.InlineCode>useTransition</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (plain English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Render Phase:</b> React calculates the next UI tree (pure, no DOM changes yet). This work can be paused or
                        discarded in the concurrent model.
                    </li>
                    <li>
                        <b>Commit Phase:</b> React applies the final changes to the DOM. This part is <em>always</em> synchronous and
                        cannot be interrupted (to keep the UI consistent).
                    </li>
                    <li>
                        <b>Urgent Update:</b> must feel instant to the user (typing, pressing a button). These run at high priority.
                    </li>
                    <li>
                        <b>Transition (Non-Urgent Update):</b> updates that can be a bit deferred (e.g., filtering a big list after
                        the user types). Marked with <Styled.InlineCode>startTransition</Styled.InlineCode> or driven by
                        <Styled.InlineCode>useTransition</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Interruptible Rendering:</b> React can stop work on a heavy render if a more urgent event happens.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Why it matters */}
            <Styled.Section>
                <Styled.H2>Why does it matter for real apps?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Smoother typing & interactions:</b> avoid UI “freezes” when filtering large lists or switching tabs.
                    </li>
                    <li>
                        <b>Better perceived performance:</b> React keeps the app interactive even when doing expensive work.
                    </li>
                    <li>
                        <b>Control over priorities:</b> you can clearly separate “show keystrokes immediately” from “recompute a huge UI.”
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Minimal example: urgent vs transition */}
            <Styled.Section>
                <Styled.H2>Minimal mental model: urgent vs. transition</Styled.H2>
                <Styled.Pre>
                    {`import React from "react";

function SearchPage({ items }) {
  const [query, setQuery] = React.useState("");
  const [list, setList] = React.useState(items);

  // Tell React: updating the big list is non-urgent
  const onChange = (e) => {
    const next = e.target.value;
    setQuery(next); // urgent: the input must update immediately

    // Mark expensive recompute as a transition (non-urgent)
    React.startTransition(() => {
      const lower = next.toLowerCase();
      const filtered = items.filter(it => it.name.toLowerCase().includes(lower));
      setList(filtered);
    });
  };

  return (
    <>
      <input value={query} onChange={onChange} placeholder="Type to filter..." />
      <BigList items={list} />
    </>
  );
}

function BigList({ items }) {
  // Imagine this component is heavy to render
  return items.map(it => <div key={it.id}>{it.name}</div>);
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Idea:</b> The input updates immediately (urgent). The heavy recompute is marked as a <i>transition</i>, so React can
                    keep the app responsive while it prepares the new list in the background.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Interrupts & consistency */}
            <Styled.Section>
                <Styled.H2>Interrupts without tearing</Styled.H2>
                <Styled.List>
                    <li>
                        React can pause a render if a new urgent event arrives, do the urgent work, then resume or restart the slow work.
                    </li>
                    <li>
                        You won't see mixed states like “old list with new input” mid-commit; React commits a consistent tree.
                    </li>
                    <li>
                        Side effects (e.g., DOM mutations in effects) only run after commit, so interrupted renders won't fire effects.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Common patterns that pair with concurrency */}
            <Styled.Section>
                <Styled.H2>Common patterns that pair well</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Transitions:</b> Mark non-urgent state updates. (See the dedicated <i>Transitions</i> page.)
                    </li>
                    <li>
                        <b>Suspense for Data:</b> Let parts of the tree “wait” for data and show fallbacks without blocking the whole page.
                    </li>
                    <li>
                        <b>Deferred Values:</b> With <Styled.InlineCode>useDeferredValue</Styled.InlineCode>, show fresh input now and
                        update heavy UI a moment later.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Beginner pitfalls & how to avoid them */}
            <Styled.Section>
                <Styled.H2>Beginner pitfalls & how to avoid them</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Doing work in render:</b> heavy calculations in the render phase may be restarted. Move expensive work to
                        <Styled.InlineCode>useMemo</Styled.InlineCode> or mark the resulting update as a transition.
                    </li>
                    <li>
                        <b>Relying on layout too early:</b> don't read layout during render. Read layout after commit (e.g., in{" "}
                        <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>) or via measurement patterns.
                    </li>
                    <li>
                        <b>Assuming effects run only once:</b> in Strict Mode (dev), React intentionally re-runs some logic to surface bugs.
                        Keep effects idempotent and avoid doing “once-only” work in render.
                    </li>
                    <li>
                        <b>Misusing transitions:</b> not every update should be a transition. Only mark work that can be delayed without
                        hurting the user experience.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Testing & mental checks */}
            <Styled.Section>
                <Styled.H2>Testing & mental checks</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Does typing feel instant?</b> If not, move the heavy part of the update into a transition.
                    </li>
                    <li>
                        <b>Is UI consistent during updates?</b> It should never flash half-states at commit.
                    </li>
                    <li>
                        <b>Are effects idempotent?</b> Effects should tolerate re-runs and mount/unmount during development.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Quick glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Concurrent Rendering:</b> interruptible rendering mode that prioritizes urgent work.</li>
                    <li><b>Transition:</b> a non-urgent update that can be deferred without breaking UX.</li>
                    <li><b>Urgent Update:</b> high-priority updates like typing, clicking, or focusing.</li>
                    <li><b>Render Phase:</b> React “thinks” about the next UI (can be paused/restarted).</li>
                    <li><b>Commit Phase:</b> React “applies” the final UI to the DOM (synchronous).</li>
                    <li><b>Suspense Boundary:</b> a component boundary that can show a fallback while data/UI is loading.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> The Concurrent Model keeps apps responsive by letting React prioritize urgent work and defer heavy
                updates. Learn to tag non-urgent updates as transitions and pair concurrency with Suspense and deferred values for
                smooth, beginner-friendly UX.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ConcurrentModel;
