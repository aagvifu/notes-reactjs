import React from "react";
import { Styled } from "./styled";

const UseRefHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useRef</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useRef</Styled.InlineCode> creates a <b>mutable ref object</b> that
                persists across renders: <Styled.InlineCode>{`{ current: ... }`}</Styled.InlineCode>.
                Updating <Styled.InlineCode>ref.current</Styled.InlineCode> does <b>not</b> trigger a re-render.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Ref object:</b> an object with a <Styled.InlineCode>current</Styled.InlineCode> property.</li>
                    <li><b>DOM ref:</b> a ref pointing to a DOM node (e.g., input element) for imperative access.</li>
                    <li><b>Mutable ref:</b> any ref used to hold values between renders (IDs, previous values, instances).</li>
                    <li><b>Callback ref:</b> a function ref <Styled.InlineCode>(node) =&gt; void</Styled.InlineCode> that runs when a node mounts/unmounts.</li>
                    <li><b>forwardRef:</b> lets a component expose an inner ref to its parent.</li>
                    <li><b>useImperativeHandle:</b> customizes the instance a parent receives via ref (expose specific methods).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) DOM access: focus, measure, scroll */}
            <Styled.Section>
                <Styled.H2>DOM access: focus, measure, scroll</Styled.H2>
                <Styled.Pre>
                    {`import { useEffect, useRef } from "react";

function FocusOnMount() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused" />;
}

function Measure() {
  const boxRef = useRef(null);
  useEffect(() => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) console.log("Height:", rect.height);
  }, []);
  return <div ref={boxRef} style={{ padding: 16 }}>Measure me</div>;
}`}
                </Styled.Pre>
                <Styled.Small>Access the DOM in an effect (after commit) to avoid reading a stale layout.</Styled.Small>
            </Styled.Section>

            {/* 3) Mutable values between renders (no re-render) */}
            <Styled.Section>
                <Styled.H2>Store values across renders (no re-render)</Styled.H2>
                <Styled.Pre>
                    {`function Stopwatch() {
  const [running, setRunning] = React.useState(false);
  const startMsRef = React.useRef(0); // mutable
  const idRef = React.useRef(null);   // interval id

  function start() {
    if (running) return;
    setRunning(true);
    startMsRef.current = Date.now();
    idRef.current = setInterval(() => {
      // render updates could be scheduled here if showing elapsed time
    }, 1000);
  }
  function stop() {
    setRunning(false);
    clearInterval(idRef.current);
  }
  return (
    <>
      <button onClick={start} disabled={running}>Start</button>
      <button onClick={stop} disabled={!running}>Stop</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Refs are perfect for IDs, previous values, or any mutable instance that should not cause re-renders.</Styled.Small>
            </Styled.Section>

            {/* 4) Avoid stale closures with a "latest" ref */}
            <Styled.Section>
                <Styled.H2>Avoid stale closures with a “latest” ref</Styled.H2>
                <Styled.Pre>
                    {`function useInterval(callback, delay) {
  const latest = React.useRef(callback);
  React.useEffect(() => { latest.current = callback; }, [callback]);

  React.useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => latest.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
`}
                </Styled.Pre>
                <Styled.Small>Keep mutable refs in sync with the latest callback/props to prevent timers using old values.</Styled.Small>
            </Styled.Section>

            {/* 5) Previous value with ref */}
            <Styled.Section>
                <Styled.H2>Track previous value</Styled.H2>
                <Styled.Pre>
                    {`function usePrevious(value) {
  const prevRef = React.useRef();
  React.useEffect(() => { prevRef.current = value; }, [value]);
  return prevRef.current;
}

function Field({ value }) {
  const prev = usePrevious(value);
  return <p>Prev: {String(prev)} — Now: {String(value)}</p>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) forwardRef + useImperativeHandle (imperative API) */}
            <Styled.Section>
                <Styled.H2>Expose an imperative API (forwardRef + useImperativeHandle)</Styled.H2>
                <Styled.Pre>
                    {`const TextInput = React.forwardRef(function TextInput(props, ref) {
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    select: () => inputRef.current?.select()
  }));

  return <input ref={inputRef} {...props} />;
});

function Demo() {
  const ref = React.useRef(null);
  return (
    <>
      <TextInput ref={ref} />
      <button onClick={() => ref.current?.focus()}>Focus</button>
      <button onClick={() => ref.current?.select()}>Select</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Expose only the minimal surface (focus/select). Avoid leaking internal DOM details.</Styled.Small>
            </Styled.Section>

            {/* 7) Callback refs */}
            <Styled.Section>
                <Styled.H2>Callback refs</Styled.H2>
                <Styled.Pre>
                    {`function CallbackRefExample() {
  const [width, setWidth] = React.useState(0);

  const setNode = React.useCallback(node => {
    if (!node) return; // unmount
    const rect = node.getBoundingClientRect();
    setWidth(rect.width);
  }, []);

  return <div ref={setNode}>Width: {width}</div>;
}`}
                </Styled.Pre>
                <Styled.Small>Callback refs run on mount/unmount; useful when a calculation is needed at attach time.</Styled.Small>
            </Styled.Section>

            {/* 8) Third-party libraries (store instance in ref) */}
            <Styled.Section>
                <Styled.H2>Integrate third-party libraries</Styled.H2>
                <Styled.Pre>
                    {`function ChartWrapper({ data }) {
  const hostRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    // pseudo create
    chartRef.current = createChart(hostRef.current, { data });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    chartRef.current?.setData(data); // imperative update
  }, [data]);

  return <div ref={hostRef} />;
}`}
                </Styled.Pre>
                <Styled.Small>Keep the library instance in a ref, initialize once, clean up on unmount, and update imperatively.</Styled.Small>
            </Styled.Section>

            {/* 9) Refs vs state */}
            <Styled.Section>
                <Styled.H2>Refs vs state (choose correctly)</Styled.H2>
                <Styled.List>
                    <li><b>Use state</b> for values that should trigger a re-render when they change (UI output).</li>
                    <li><b>Use ref</b> for values that are only used imperatively or to persist across renders without causing re-renders (IDs, instances, previous value, latest callback).</li>
                    <li>Do not read/write layout in render; use refs inside effects.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Expecting UI to update when changing <Styled.InlineCode>ref.current</Styled.InlineCode>—refs do not trigger re-renders.</li>
                    <li>Reading a ref before mount (it is <Styled.InlineCode>null</Styled.InlineCode> initially). Access it in effects or after conditional rendering.</li>
                    <li>Conditional refs (different nodes based on branches) without handling unmount; prefer stable ref usage.</li>
                    <li>Using refs to store derived state; compute during render or with memo instead.</li>
                    <li>Forgetting to clean up observers/listeners created with a DOM ref.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use refs for DOM access, instance storage, and “latest” values in async code.</li>
                    <li><b>Do</b> expose a minimal imperative API with <Styled.InlineCode>forwardRef</Styled.InlineCode> and <Styled.InlineCode>useImperativeHandle</Styled.InlineCode>.</li>
                    <li><b>Do</b> manage DOM work in effects and clean up.</li>
                    <li><b>Don’t</b> replace state with refs when the UI must update.</li>
                    <li><b>Don’t</b> mutate DOM directly in render; use effects.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useRef</Styled.InlineCode> holds mutable values and DOM nodes across renders
                without re-rendering. Use it for imperative DOM access, third-party instances, previous values, and
                avoiding stale closures. Reach for state when the UI should react to changes.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseRefHook;
