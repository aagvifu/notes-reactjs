import React from "react";
import { Styled } from "./styled";

const Batching = () => {
    return (
        <Styled.Page>
            <Styled.Title>Batching</Styled.Title>
            <Styled.Lead>
                Batching means React groups multiple state updates that happen in the
                <b> same event loop turn</b> and applies them in a single render/commit. This
                reduces work and avoids flicker. React 18 enables <b>automatic batching</b> for
                updates from events, timeouts, promises, and more.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Batch:</b> a set of state updates collected together and applied in
                        one render/commit.
                    </li>
                    <li>
                        <b>Tick / Turn:</b> a single run of the JS event loop (e.g., one click
                        handler, one timeout callback, one promise microtask chain).
                    </li>
                    <li>
                        <b>Automatic batching:</b> in React 18+, updates queued during the same tick are batched
                        even if they originate from <em>promises, timeouts, or async/await</em>.
                    </li>
                    <li>
                        <b>flushSync:</b> an escape hatch that forces React to flush updates
                        <em>immediately</em> (separate commit) so the DOM reflects the change right away.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic batching in handlers */}
            <Styled.Section>
                <Styled.H2>Handlers: multiple sets → one render/commit</Styled.H2>
                <Styled.Pre>
                    {`import { useState } from "react";

function Counter() {
  const [n, setN] = useState(0);

  function add3() {
    setN(v => v + 1);
    setN(v => v + 1);
    setN(v => v + 1);
  }

  return <button onClick={add3}>n = {n}</button>;
}
// Clicking once results in a single render where n increases by 3.`}
                </Styled.Pre>
                <Styled.Small>
                    Note the <em>functional updater</em> ensures correctness if multiple updates are queued.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Async: promises, timeouts, async/await */}
            <Styled.Section>
                <Styled.H2>Async sources are batched (React 18+)</Styled.H2>
                <Styled.Pre>
                    {`function AsyncDemo() {
  const [step, setStep] = React.useState(0);
  const [msg, setMsg] = React.useState("");

  async function run() {
    setMsg("Working...");
    await new Promise(r => setTimeout(r, 50));   // simulate async
    setStep(s => s + 1);
    setMsg("Done");
  }

  return <button onClick={run}>{msg || "Start"} (step: {step})</button>;
}
// The two updates after 'await' are batched together into one render/commit.`}
                </Styled.Pre>
                <Styled.Small>
                    Updates inside <code>Promise.then</code>, <code>setTimeout</code>, and <code>async/await</code> callbacks
                    are batched by default.
                </Styled.Small>
            </Styled.Section>

            {/* 4) When batching does NOT happen */}
            <Styled.Section>
                <Styled.H2>When updates won’t batch</Styled.H2>
                <Styled.List>
                    <li>
                        Updates separated by different event loop turns (e.g., two different timeouts firing at different times).
                    </li>
                    <li>
                        Updates inside a <Styled.InlineCode>flushSync</Styled.InlineCode> boundary (forced immediate flush).
                    </li>
                    <li>
                        Updates from unrelated browser tasks like separate user events—each event forms its own batch.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { flushSync } from "react-dom";

function MeasureOnOpen() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  function openAndMeasure() {
    // Ensure the dialog is committed before measuring:
    flushSync(() => setOpen(true));
    const rect = ref.current?.getBoundingClientRect();
    console.log("Height after open:", rect?.height);
  }

  return (
    <>
      <button onClick={openAndMeasure}>Open</button>
      {open && <div ref={ref} role="dialog">Dialog content</div>}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <code>flushSync</code> sparingly—only when the DOM must reflect a change
                    <em>before</em> the next line runs (measurements, imperative APIs).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Reading state inside the same tick */}
            <Styled.Section>
                <Styled.H2>Reading state in the same tick</Styled.H2>
                <p>
                    State variables do not update immediately after calling the setter during the same render. Read the latest value:
                </p>
                <Styled.List>
                    <li>On the next render (normal pattern),</li>
                    <li>Or via the functional updater argument (<Styled.InlineCode>prev</Styled.InlineCode>),</li>
                    <li>Or by scheduling work in an effect that runs after commit.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Clicks() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount(c => {
      const next = c + 1;
      console.log("Next value that will be rendered:", next);
      return next;
    });
  }

  React.useEffect(() => {
    console.log("Rendered with:", count); // confirmed after commit
  }, [count]);

  return <button onClick={handleClick}>{count}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Batching + priorities (transition note) */}
            <Styled.Section>
                <Styled.H2>Batching and priorities (quick note)</Styled.H2>
                <Styled.List>
                    <li>
                        React can batch updates of different priorities. For example, an urgent input update and a non-urgent
                        list filter inside a <Styled.InlineCode>startTransition</Styled.InlineCode> can be scheduled together,
                        but the UI remains responsive because the heavy work is lower priority.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useState, useTransition } from "react";

function Search({ items }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const q = e.target.value;
    setText(q); // urgent (keeps input fast)
    startTransition(() => {
      // non-urgent: expensive filtering work
      // setFiltered(...)
    });
  }

  return (
    <>
      <input value={text} onChange={onChange} />
      {isPending && <span>Filtering…</span>}
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Assuming each <Styled.InlineCode>setState</Styled.InlineCode> causes an immediate render—React batches in the same tick.
                    </li>
                    <li>
                        Computing the next value from a possibly stale variable—use the functional updater.
                    </li>
                    <li>
                        Measuring layout right after <Styled.InlineCode>setState</Styled.InlineCode> without waiting for commit—use{" "}
                        <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> or <Styled.InlineCode>flushSync</Styled.InlineCode> when truly needed.
                    </li>
                    <li>
                        Confusing dev <b>Strict Mode</b> double-invocations (development only) with multiple commits; production will not double-invoke.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> rely on batching to reduce renders; group related updates in one handler.</li>
                    <li><b>Do</b> use functional updaters when next value depends on previous.</li>
                    <li><b>Do</b> use <Styled.InlineCode>flushSync</Styled.InlineCode> only for immediate DOM reads/measurements.</li>
                    <li><b>Don’t</b> assume state reads change instantly after <Styled.InlineCode>setState</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> sprinkle <Styled.InlineCode>flushSync</Styled.InlineCode> everywhere—it can hurt performance.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: in React 18, updates queued in the same tick are automatically batched—
                across events, timeouts, and promises. Use functional updaters for correctness,
                and reach for <code>flushSync</code> only when immediate DOM reads are required.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Batching;
