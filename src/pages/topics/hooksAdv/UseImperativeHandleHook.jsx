import React from "react";
import { Styled } from "./styled";

const UseImperativeHandleHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useImperativeHandle</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> customizes the value a parent
                receives when it attaches a <b>ref</b> to a child built with <Styled.InlineCode>forwardRef</Styled.InlineCode>.
                Expose a small, well-defined imperative API (e.g., <em>focus</em>, <em>open</em>, <em>reset</em>) while keeping internals private.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Forwarded ref:</b> a ref passed from parent to child via <Styled.InlineCode>React.forwardRef</Styled.InlineCode>.</li>
                    <li><b>Imperative handle:</b> the object returned by <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> (methods/fields exposed to parent).</li>
                    <li><b>Surface area:</b> the public methods intentionally exposed (keep it minimal).</li>
                    <li><b>Dependencies:</b> third arg to <Styled.InlineCode>useImperativeHandle</Styled.InlineCode>; when they change, the handle is refreshed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Signature & basic pattern */}
            <Styled.Section>
                <Styled.H2>Signature &amp; basic pattern</Styled.H2>
                <Styled.Pre>
                    {`// Parent holds a ref to the child
const ref = React.useRef(null);

// Child: forward the ref and define the public methods
const Child = React.forwardRef(function Child(props, ref) {
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    select: () => inputRef.current?.select(),
    clear:  () => { if (inputRef.current) inputRef.current.value = ""; }
  }), []); // handle stays stable

  return <input ref={inputRef} {...props} />;
});

// Parent can call:
ref.current?.focus();
ref.current?.clear();`}
                </Styled.Pre>
                <Styled.Small>
                    The parent sees only the exposed methods, not the child’s internal refs/state.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Why use it (encapsulation) */}
            <Styled.Section>
                <Styled.H2>Why use it?</Styled.H2>
                <Styled.List>
                    <li><b>Encapsulation:</b> hide internal DOM/structure; expose only safe operations.</li>
                    <li><b>Ergonomics:</b> allow parents to focus/scroll/open without reaching through DOM trees.</li>
                    <li><b>Stability:</b> methods remain stable and independent from internal ref nodes or markup changes.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: Modal exposing open/close */}
            <Styled.Section>
                <Styled.H2>Example: Modal exposing <code>open</code>/<code>close</code></Styled.H2>
                <Styled.Pre>
                    {`const Modal = React.forwardRef(function Modal({ children }, ref) {
  const [open, setOpen] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    open:  () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(o => !o)
  }), []);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="modal">
      <button onClick={() => setOpen(false)} aria-label="Close">×</button>
      {children}
    </div>
  );
});

function Page() {
  const modalRef = React.useRef(null);
  return (
    <>
      <button onClick={() => modalRef.current?.open()}>Open modal</button>
      <Modal ref={modalRef}><p>Hello</p></Modal>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The parent triggers behavior without controlling internal state directly; UI details stay inside <code>Modal</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Avoid stale closures in methods */}
            <Styled.Section>
                <Styled.H2>Avoid stale closures</Styled.H2>
                <Styled.Pre>
                    {`function Player() {
  const videoRef = React.useRef(null);
  const volumeRef = React.useRef(0.5); // mutable latest value

  React.useImperativeHandle(videoRef, () => ({
    setVolume: (v) => { volumeRef.current = v; },
    getVolume: () => volumeRef.current
  }), []);

  // UI updates could sync from volumeRef.current when necessary
  return null;
}

// Or include reactive values in deps to refresh the handle:
React.useImperativeHandle(ref, () => ({ doSomething: () => console.log(state) }), [state]);`}
                </Styled.Pre>
                <Styled.Small>
                    Methods capture values from render. Use a “latest” ref for mutables or add dependencies so the handle updates when inputs change.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Expose minimal API (safety guidelines) */}
            <Styled.Section>
                <Styled.H2>Design a minimal, safe API</Styled.H2>
                <Styled.List>
                    <li>Expose verbs (actions), not internals (DOM nodes or raw state).</li>
                    <li>Avoid returning transient nodes; prefer methods like <Styled.InlineCode>focus()</Styled.InlineCode> instead of exposing <Styled.InlineCode>inputRef</Styled.InlineCode>.</li>
                    <li>Keep operations idempotent and predictable; avoid coupling to internal class names or structure.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Callback refs vs useImperativeHandle */}
            <Styled.Section>
                <Styled.H2>Callback ref vs imperative handle</Styled.H2>
                <Styled.List>
                    <li><b>Callback ref</b>: direct access to a node on mount/unmount; great for quick setup (<Styled.InlineCode>(node) =&gt; { /* ... */}</Styled.InlineCode>).</li>
                    <li><b>useImperativeHandle</b>: define a stable, high-level API that stays valid even if internals change.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Integrating third-party widgets */}
            <Styled.Section>
                <Styled.H2>Integrate third-party widgets</Styled.H2>
                <Styled.Pre>
                    {`const Chart = React.forwardRef(function Chart({ data }, ref) {
  const hostRef = React.useRef(null);
  const instanceRef = React.useRef(null);

  React.useEffect(() => {
    // pseudo create
    instanceRef.current = createChart(hostRef.current, { data });
    return () => instanceRef.current?.destroy();
  }, []);

  React.useEffect(() => {
    instanceRef.current?.setData(data);
  }, [data]);

  React.useImperativeHandle(ref, () => ({
    exportPng: () => instanceRef.current?.export("png"),
    resetZoom: () => instanceRef.current?.resetZoom()
  }), []);

  return <div ref={hostRef} />;
});`}
                </Styled.Pre>
                <Styled.Small>
                    Store the library instance in a ref; expose only needed methods to the parent.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Using it for data flow that should be props/state—keep imperative handles for <em>actions</em>, not state sharing.</li>
                    <li>Exposing internal DOM nodes, causing tight coupling; expose verbs instead.</li>
                    <li>Stale closures in exposed methods; use refs for “latest” values or include deps.</li>
                    <li>Forgetting <Styled.InlineCode>forwardRef</Styled.InlineCode>; <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> must be used inside a forwarded component.</li>
                    <li>Recreating the handle every render unnecessarily; pass <b>deps</b> to keep it stable.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> pair with <Styled.InlineCode>forwardRef</Styled.InlineCode> and expose a minimal API (focus/open/reset).</li>
                    <li><b>Do</b> keep methods stable and free from stale values (deps or “latest” refs).</li>
                    <li><b>Do</b> use for imperative integration with DOM or third-party widgets.</li>
                    <li><b>Don’t</b> leak internal nodes/state; avoid overexposing.</li>
                    <li><b>Don’t</b> replace declarative props with imperative calls when props suffice.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> provides a clean, minimal imperative API
                for parents while preserving encapsulation. Combine with <Styled.InlineCode>forwardRef</Styled.InlineCode>,
                avoid stale closures, and expose only safe actions—not internals.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseImperativeHandleHook;
