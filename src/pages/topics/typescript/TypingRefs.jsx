import { Styled } from "./styled";

const TypingRefs = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Refs (TypeScript)</Styled.Title>

            <Styled.Lead>
                A <b>ref</b> is a React way to hold an <i>imperative handle</i> to something that lives
                outside React's declarative data flow—typically a <b>DOM element</b> (like an input) or a
                <b>mutable value</b> that shouldn't trigger re-renders. In TypeScript, we add precise types
                so our refs are safe and discoverable.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Ref</b>: A container that points at a value across renders. In React, refs are usually
                        created with <Styled.InlineCode>useRef</Styled.InlineCode> and read via{" "}
                        <Styled.InlineCode>ref.current</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>DOM ref</b>: A ref that points to a browser element (e.g.,{" "}
                        <Styled.InlineCode>HTMLInputElement</Styled.InlineCode>) so you can call imperative APIs
                        like <Styled.InlineCode>.focus()</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Mutable ref (value ref)</b>: A ref that stores any mutable value that persists across
                        renders but <i>does not</i> cause re-renders when it changes.
                    </li>
                    <li>
                        <b>Ref forwarding</b>: Passing a ref from a parent down to some deeply nested element via{" "}
                        <Styled.InlineCode>React.forwardRef</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Imperative handle</b>: A custom object you expose from a component via{" "}
                        <Styled.InlineCode>useImperativeHandle</Styled.InlineCode>, defining exactly what the
                        parent can call.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Type cheat-sheet */}
            <Styled.Section>
                <Styled.H2>Type cheat-sheet</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>React.RefObject&lt;T&gt;</Styled.InlineCode>: read-only{" "}
                        <Styled.InlineCode>{`{ current: T | null }`}</Styled.InlineCode> (what{" "}
                        <Styled.InlineCode>useRef</Styled.InlineCode> returns in TS).
                    </li>
                    <li>
                        <Styled.InlineCode>React.MutableRefObject&lt;T&gt;</Styled.InlineCode>: explicitly
                        mutable version (often inferred automatically).
                    </li>
                    <li>
                        <Styled.InlineCode>React.Ref&lt;T&gt;</Styled.InlineCode>: union of object ref, callback
                        ref, or <Styled.InlineCode>null</Styled.InlineCode>—useful for component prop typing.
                    </li>
                    <li>
                        <Styled.InlineCode>React.ForwardedRef&lt;T&gt;</Styled.InlineCode>: the param type your
                        <Styled.InlineCode>forwardRef</Styled.InlineCode> component receives.
                    </li>
                    <li>
                        <Styled.InlineCode>React.ElementRef&lt;"div"&gt;</Styled.InlineCode> → resolves to{" "}
                        <Styled.InlineCode>HTMLDivElement</Styled.InlineCode>; with a component type it resolves
                        to that component's underlying instance type.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Common DOM element types you'll use:
HTMLInputElement, HTMLTextAreaElement, HTMLDivElement, HTMLButtonElement, HTMLCanvasElement
SVGSVGElement, HTMLAnchorElement, etc.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) DOM refs with useRef */}
            <Styled.Section>
                <Styled.H2>Typing DOM refs with <code>useRef</code></Styled.H2>
                <Styled.Pre>
                    {`import * as React from "react";

export function FocusInput() {
  // Type the ref with the exact DOM element type + null (initially null).
  const inputRef = React.useRef<HTMLInputElement>(null);

  function focus() {
    inputRef.current?.focus(); // safe: current may be null before mount
  }

  React.useEffect(() => {
    inputRef.current?.focus(); // autofocus after mount
  }, []);

  return (
    <>
      <input ref={inputRef} placeholder="Type here..." />
      <button onClick={focus}>Focus</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Always include <Styled.InlineCode>| null</Styled.InlineCode> in the ref type, because{" "}
                    <Styled.InlineCode>current</Styled.InlineCode> is <i>null</i> before mount and after
                    unmount.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Callback refs */}
            <Styled.Section>
                <Styled.H2>Callback refs (precise control)</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>callback ref</b> is a function React calls with the node instance on mount and{" "}
                        <Styled.InlineCode>null</Styled.InlineCode> on unmount.
                    </li>
                    <li>
                        Useful when you need to subscribe/unsubscribe imperatively or when measuring synchronously.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function MeasureBox() {
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  const boxRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return; // unmount
    const rect = node.getBoundingClientRect();
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
  }, []);

  return (
    <>
      <div ref={boxRef} style={{ width: 240, padding: 16, border: "1px solid #ccc" }}>
        Resize me (try changing content)
      </div>
      <p>Size: {size.w} × {size.h}px</p>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Forwarding refs to child components */}
            <Styled.Section>
                <Styled.H2>Forwarding refs to components</Styled.H2>
                <Styled.List>
                    <li>
                        Function components <b>don't accept refs</b> by default. Wrap them with{" "}
                        <Styled.InlineCode>React.forwardRef</Styled.InlineCode> and type the inner ref target.
                    </li>
                    <li>
                        Use <Styled.InlineCode>ComponentPropsWithoutRef&lt;"input"&gt;</Styled.InlineCode> so you
                        inherit all native input props.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
};

const FancyInput = React.forwardRef<HTMLInputElement, InputProps>(
  function FancyInput({ label, ...props }, ref) {
    return (
      <label style={{ display: "grid", gap: 4 }}>
        {label && <span>{label}</span>}
        <input ref={ref} {...props} />
      </label>
    );
  }
);

// Usage:
function Screen() {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <FancyInput ref={ref} label="Name" placeholder="Jane Doe" />
      <button onClick={() => ref.current?.focus()}>Focus Name</button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Exposing an imperative handle */}
            <Styled.Section>
                <Styled.H2>Exposing a custom imperative handle</Styled.H2>
                <Styled.List>
                    <li>
                        Sometimes you don't want to expose the raw DOM node, but a <b>restricted API</b> (e.g.,
                        <Styled.InlineCode>reset()</Styled.InlineCode>, <Styled.InlineCode>validate()</Styled.InlineCode>).
                    </li>
                    <li>
                        Use <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> to define what the parent
                        can call.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type CounterHandle = { reset(): void; get(): number };

const Counter = React.forwardRef<CounterHandle, {}>(function Counter(_, ref) {
  const [n, setN] = React.useState(0);

  React.useImperativeHandle(ref, () => ({
    reset: () => setN(0),
    get: () => n,
  }), [n]);

  return (
    <div>
      <p>Count: {n}</p>
      <button onClick={() => setN(n + 1)}>+</button>
    </div>
  );
});

// Parent:
function Demo() {
  const counterRef = React.useRef<CounterHandle>(null);
  return (
    <>
      <Counter ref={counterRef} />
      <button onClick={() => counterRef.current?.reset()}>Reset from parent</button>
      <button onClick={() => alert(counterRef.current?.get())}>Read value</button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Value refs (non-DOM) */}
            <Styled.Section>
                <Styled.H2>Value refs (non-DOM, no re-renders)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Value refs</b> store any mutable value that must survive renders without causing a re-render
                        (e.g., IDs, timers, previous values).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Timer() {
  const id = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    if (id.current) return; // already running
    id.current = setTimeout(() => {
      console.log("tick");
      id.current = null;
    }, 1000);
  }
  function stop() {
    if (id.current) clearTimeout(id.current);
    id.current = null;
  }

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Updating <Styled.InlineCode>id.current</Styled.InlineCode> does <i>not</i> re-render; use
                    state when you need to update UI.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Measuring layout safely */}
            <Styled.Section>
                <Styled.H2>Measuring layout safely</Styled.H2>
                <Styled.List>
                    <li>
                        Reading layout (e.g., <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode>) is
                        best done in <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> to avoid flicker.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function MeasureOnLayout() {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    setW(Math.round(el.getBoundingClientRect().width));
  }, []);

  return <div ref={boxRef}>Width: {w}px</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Pitfalls & best practices */}
            <Styled.Section>
                <Styled.H2>Pitfalls &amp; best practices</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Always include <Styled.InlineCode>| null</Styled.InlineCode> for DOM refs.</b> Avoid{" "}
                        <Styled.InlineCode>! (non-null assertion)</Styled.InlineCode> unless you truly guarantee presence.
                    </li>
                    <li>
                        <b>Don't read/write DOM in render.</b> Use effects (<Styled.InlineCode>useEffect</Styled.InlineCode>{" "}
                        or <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Don't pass refs through props</b> like normal values; instead, use{" "}
                        <Styled.InlineCode>forwardRef</Styled.InlineCode> to expose a ref properly.
                    </li>
                    <li>
                        <b>Ref changes don't trigger re-renders.</b> Use state for anything that affects UI.
                    </li>
                    <li>
                        <b>Function components can't receive refs</b> unless wrapped in{" "}
                        <Styled.InlineCode>forwardRef</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Ref object</b>: <Styled.InlineCode>{`{ current: T | null }`}</Styled.InlineCode> container returned by{" "}
                        <Styled.InlineCode>useRef</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Callback ref</b>: <Styled.InlineCode>(node: T | null) =&gt; void</Styled.InlineCode> invoked on mount/unmount.
                    </li>
                    <li>
                        <b>Forwarded ref</b>: A ref passed into a component and attached internally via{" "}
                        <Styled.InlineCode>forwardRef</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Imperative handle</b>: A custom object you expose with{" "}
                        <Styled.InlineCode>useImperativeHandle</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Type refs precisely (always include <i>| null</i>), forward them when exposing inner
                elements, and prefer an <b>imperative handle</b> when you want to control what parents can do.
                Use refs for imperative tasks and persistent mutable values—use state to update UI.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingRefs;
