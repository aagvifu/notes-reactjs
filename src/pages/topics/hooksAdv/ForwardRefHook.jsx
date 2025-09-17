import React from "react";
import { Styled } from "./styled";

const ForwardRefHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>forwardRef</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>React.forwardRef</Styled.InlineCode> lets a component
                <b> pass a ref it receives down to a child</b> (usually a DOM node). This enables
                parents to imperatively focus, measure, or scroll an inner element of a function component.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Ref object:</b> an object with <Styled.InlineCode>current</Styled.InlineCode> that persists across renders.</li>
                    <li><b>Forwarded ref:</b> a ref passed to a custom component that forwards it to its inner target.</li>
                    <li><b>Callback ref:</b> a function <Styled.InlineCode>(node) =&gt; void</Styled.InlineCode> called on mount/unmount.</li>
                    <li><b>Target:</b> the node or instance that actually receives the ref (e.g., <Styled.InlineCode>&lt;input&gt;</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic pattern */}
            <Styled.Section>
                <Styled.H2>Basic pattern (forward a ref to a DOM input)</Styled.H2>
                <Styled.Pre>
                    {`const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

function Form() {
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <TextInput ref={inputRef} placeholder="Your name" />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Without <Styled.InlineCode>forwardRef</Styled.InlineCode>, passing <Styled.InlineCode>ref</Styled.InlineCode> to <Styled.InlineCode>&lt;TextInput /&gt;</Styled.InlineCode> would
                    attach it to the <em>component</em> itself (not the inner input), which is not supported for function components.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Forward through a wrapper */}
            <Styled.Section>
                <Styled.H2>Forward through a wrapper (add styles but keep ref working)</Styled.H2>
                <Styled.Pre>
                    {`const FancyButton = React.forwardRef(function FancyButton({ className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={"btn " + className}
      {...props}
    />
  );
});

function Toolbar() {
  const btnRef = React.useRef(null);
  return (
    <>
      <FancyButton ref={btnRef} onClick={() => console.log("clicked")}>
        Save
      </FancyButton>
      <button onClick={() => btnRef.current?.focus()}>Focus Save</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Destructure known props, spread the rest, and pass <Styled.InlineCode>ref</Styled.InlineCode> to the
                    underlying element to keep the wrapper transparent.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Callback refs */}
            <Styled.Section>
                <Styled.H2>Callback refs (run logic on attach/detach)</Styled.H2>
                <Styled.Pre>
                    {`const Video = React.forwardRef(function Video(props, ref) {
  return <video ref={ref} {...props} />;
});

function Player() {
  const setRef = React.useCallback(node => {
    if (!node) return; // unmounted
    // node is the <video> element here
    node.volume = 0.5;
  }, []);
  return <Video ref={setRef} src="movie.mp4" controls />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Callback refs are useful when setup is needed immediately on mount (no separate effect).
                </Styled.Small>
            </Styled.Section>

            {/* 5) forwardRef + memo (composition) */}
            <Styled.Section>
                <Styled.H2>Composition: <code>memo(forwardRef(...))</code></Styled.H2>
                <Styled.Pre>
                    {`const ListItem = React.memo(
  React.forwardRef(function ListItem({ item }, ref) {
    return <li ref={ref}>{item.label}</li>;
  })
);
// Optionally set a displayName for better DevTools labels:
ListItem.displayName = "ListItem";`}
                </Styled.Pre>
                <Styled.Small>
                    Combine with <Styled.InlineCode>React.memo</Styled.InlineCode> to avoid re-rendering stable items while still exposing their DOM nodes via refs.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Polymorphic components (as=) */}
            <Styled.Section>
                <Styled.H2>Polymorphic components (<code>as</code> prop)</Styled.H2>
                <Styled.Pre>
                    {`const Box = React.forwardRef(function Box({ as: Comp = "div", ...props }, ref) {
  return <Comp ref={ref} {...props} />;
});

// Usage
<Box as="a" href="#top">Go top</Box>
<Box as="button" onClick={() => {}}>Click</Box>`}
                </Styled.Pre>
                <Styled.Small>
                    Forward the ref to whatever element is rendered. In TypeScript, prefer a typed polymorphic pattern.
                </Styled.Small>
            </Styled.Section>

            {/* 7) With useImperativeHandle (custom instance) */}
            <Styled.Section>
                <Styled.H2>Expose a minimal imperative API (with <code>useImperativeHandle</code>)</Styled.H2>
                <Styled.Pre>
                    {`const TextField = React.forwardRef(function TextField(props, ref) {
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    select: () => inputRef.current?.select()
  }));
  return <input ref={inputRef} {...props} />;
});

// Parent:
const tfRef = React.useRef(null);
// tfRef.current.focus() / select()`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>forwardRef</Styled.InlineCode> passes the ref; <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> customizes what the parent can call.
                    Full details are covered in the next page.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Filtering non-DOM props */}
            <Styled.Section>
                <Styled.H2>Filter non-DOM props (avoid React warnings)</Styled.H2>
                <Styled.Pre>
                    {`// Bad: forwards custom prop to DOM -> <button dataActive="true"> (unexpected)
function Bad({ dataActive, ...rest }) {
  return <button dataActive={dataActive} {...rest} />;
}

// Good: map or omit custom props before forwarding to DOM
const Btn = React.forwardRef(function Btn({ active, ...rest }, ref) {
  return <button ref={ref} aria-pressed={active ? "true" : "false"} {...rest} />;
});`}
                </Styled.Pre>
                <Styled.Small>
                    DOM elements accept only valid HTML attributes/ARIA props. Strip or map custom props before spreading.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Expecting <Styled.InlineCode>ref</Styled.InlineCode> to “pass through” automatically—custom components need <Styled.InlineCode>forwardRef</Styled.InlineCode>.</li>
                    <li>Forgetting to attach the forwarded ref to the correct inner element.</li>
                    <li>Forwarding the ref but also spreading it as a normal prop (naming collisions). The <em>special</em> prop is always <Styled.InlineCode>ref</Styled.InlineCode>.</li>
                    <li>Creating new wrapper objects/handlers every render around the forwarded element—can defeat memoization.</li>
                    <li>Using refs for data that should be state (UI won’t update when <Styled.InlineCode>ref.current</Styled.InlineCode> changes).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> forward refs for focus, measure, scroll, or library integration.</li>
                    <li><b>Do</b> keep the wrapper “transparent”: spread props, attach ref to the real target.</li>
                    <li><b>Do</b> combine with <Styled.InlineCode>memo</Styled.InlineCode> when rendering large lists.</li>
                    <li><b>Don’t</b> forward arbitrary custom props to DOM elements; sanitize or map them.</li>
                    <li><b>Don’t</b> replace state with refs when the UI must react to changes.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>forwardRef</Styled.InlineCode> lets a parent reach an inner node of a function component.
                Use it for imperative focus/measure/scroll, keep wrappers transparent, and pair with
                <Styled.InlineCode>useImperativeHandle</Styled.InlineCode> to expose a minimal, well-defined API.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ForwardRefHook;
