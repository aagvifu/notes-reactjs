import React from "react";
import { Styled } from "./styled";

const UseTransitionHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useTransition</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useTransition</Styled.InlineCode> marks some state updates as <b>non-urgent</b>.
                Urgent updates (typing, clicks) render immediately, while transition updates may be deferred,
                interrupted, and resumed. This keeps the UI responsive during expensive renders.
            </Styled.Lead>

            {/* 1) Signature & terms */}
            <Styled.Section>
                <Styled.H2>Signature & terminology</Styled.H2>
                <Styled.Pre>
                    {`const [isPending, startTransition] = useTransition();
// Or outside components (event handlers, async code):
import { startTransition } from "react";`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>startTransition(fn)</b>: run state updates inside <em>fn</em> as low priority (non-blocking).</li>
                    <li><b>isPending</b>: <code>true</code> while a transition is ongoing; use it to show spinners or dim content.</li>
                    <li><b>Urgent vs non-urgent</b>: urgent updates reflect direct input; non-urgent updates can be deferred.</li>
                    <li><b>Interruption</b>: if a new urgent update arrives, React can pause/abandon an in-flight transition.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Classic pattern: typeahead search (split state) */}
            <Styled.Section>
                <Styled.H2>Pattern: split urgent vs non-urgent state</Styled.H2>
                <Styled.Pre>
                    {`import React, { useState, useTransition } from "react";

function SearchBox({ items }) {
  const [input, setInput] = useState("");   // urgent: mirrors the textbox
  const [query, setQuery] = useState("");   // non-urgent: drives heavy UI
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setInput(next);                          // urgent update (keeps typing snappy)
    startTransition(() => {
      setQuery(next);                        // non-urgent: can be deferred/interrupted
    });
  }

  const visible = React.useMemo(() => {
    const q = query.toLowerCase();
    // assume heavy work (filter + sort)
    return items.filter(x => x.name.toLowerCase().includes(q))
                .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, query]);

  return (
    <>
      <input value={input} onChange={onChange} placeholder="Search..." />
      {isPending && <Styled.Small>Updating…</Styled.Small>}
      <ul>{visible.map(x => <li key={x.id}>{x.name}</li>)}</ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the text input responsive while the results list updates under a transition. Show a lightweight pending hint with <code>isPending</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Tabs / route-like transitions */}
            <Styled.Section>
                <Styled.H2>Pattern: tab/content switch without jank</Styled.H2>
                <Styled.Pre>
                    {`function Tabs({ panes }) {
  const [active, setActive] = React.useState(panes[0].id);      // urgent: selected tab id
  const [shown, setShown]   = React.useState(panes[0].id);      // non-urgent: heavy pane being rendered
  const [isPending, startTransition] = React.useTransition();

  function select(id) {
    setActive(id);                                              // update tab UI instantly
    startTransition(() => setShown(id));                        // render heavy pane as non-urgent
  }

  const pane = panes.find(p => p.id === shown);
  return (
    <>
      <nav>
        {panes.map(p => (
          <button
            key={p.id}
            aria-pressed={active === p.id}
            onClick={() => select(p.id)}
            disabled={isPending && active === p.id}
          >{p.label}</button>
        ))}
      </nav>

      <div aria-busy={isPending ? "true" : "false"} style={{ opacity: isPending ? 0.7 : 1 }}>
        {pane.render()}
      </div>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The selection updates immediately; the expensive pane render runs as a transition. Use subtle dimming/aria-busy to signal work-in-progress.
                </Styled.Small>
            </Styled.Section>

            {/* 4) With Suspense (async rendering UX) */}
            <Styled.Section>
                <Styled.H2>With <code>Suspense</code> (async boundaries)</Styled.H2>
                <Styled.Pre>
                    {`import React, { Suspense, useTransition } from "react";

function ProductsPage() {
  const [filter, setFilter] = React.useState("all");
  const [resource, setResource] = React.useState(() => fetchProducts("all"));
  const [isPending, startTransition] = useTransition();

  function onFilterChange(next) {
    setFilter(next); // urgent: button active state, etc.
    startTransition(() => {
      setResource(fetchProducts(next)); // non-urgent: new async resource triggers Suspense
    });
  }

  return (
    <>
      <Filters value={filter} onChange={onFilterChange} pending={isPending} />
      <Suspense fallback={<p>Loading products…</p>}>
        <ProductsList resource={resource} />
      </Suspense>
    </>
  );
}
`}
                </Styled.Pre>
                <Styled.Small>
                    Suspense shows a fallback while the transition fetches. Urgent UI (controls) remains responsive; content reveals when ready.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Where to call startTransition */}
            <Styled.Section>
                <Styled.H2>Where to call <code>startTransition</code></Styled.H2>
                <Styled.List>
                    <li>Inside event handlers (e.g., <code>onChange</code>, <code>onClick</code>) to split immediate UI from heavy updates.</li>
                    <li>Inside async callbacks (after a promise resolves) to update expensive views without blocking urgent renders.</li>
                    <li>Top-level <code>startTransition</code> (imported from <code>react</code>) is useful outside components.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// outside a component
import { startTransition } from "react";
fetch("/api/data").then(data => {
  startTransition(() => {
    store.setData(data); // if connected to React via an external store binding
  });
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Heuristics: what to mark as a transition */}
            <Styled.Section>
                <Styled.H2>Heuristics: what to mark as transition</Styled.H2>
                <Styled.List>
                    <li>Expensive derived UI (large lists, heavy charts, complex layouts) that updates in reaction to user input.</li>
                    <li>Navigation between big screens/panes where content rendering is heavy or data is fetched via Suspense.</li>
                    <li>Bulk state changes that cause many components to re-render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Performance notes */}
            <Styled.Section>
                <Styled.H2>Performance notes</Styled.H2>
                <Styled.List>
                    <li>Transitions don’t make work cheaper; they <em>schedule</em> it so urgent interactions stay smooth.</li>
                    <li>Heavy computations should still be optimized (memoization, virtualization, splitting components).</li>
                    <li>Multiple transitions can overlap; <code>isPending</code> is <code>true</code> while any are in flight.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Putting <b>all</b> updates in a transition—then nothing feels immediate. Keep truly interactive updates urgent.</li>
                    <li>Assuming transitions guarantee completion—an in-flight transition can be interrupted by newer updates.</li>
                    <li>Mutating large data during render; transitions won’t fix logic issues or expensive un-memoized work.</li>
                    <li>Driving form input <em>value</em> from a transition state—keystrokes will feel laggy. Mirror input urgently; derive heavy UI in transition.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don’t */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> split state: urgent for immediate feedback, transition for heavy UI.</li>
                    <li><b>Do</b> show lightweight pending hints (spinners, dimming) bound to <code>isPending</code>.</li>
                    <li><b>Do</b> pair with memoization/virtualization for large lists.</li>
                    <li><b>Don’t</b> wrap simple, cheap updates in transitions needlessly.</li>
                    <li><b>Don’t</b> rely on transitions for correctness; they are a scheduling hint.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: use <b>useTransition</b> to keep interactions snappy while rendering heavy UI in the background.
                Update input/controls urgently, move expensive state changes into <b>startTransition</b>, and provide clear
                pending feedback. Optimize heavy work; transitions handle <em>when</em>, not <em>how much</em>.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseTransitionHook;
