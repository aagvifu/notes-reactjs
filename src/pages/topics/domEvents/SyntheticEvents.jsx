import React from "react";
import { Styled } from "./styled";

const SyntheticEvents = () => {
    return (
        <Styled.Page>
            <Styled.Title>Synthetic Events</Styled.Title>

            <Styled.Lead>
                React wraps native browser events in a cross-browser <b>SyntheticEvent</b> object so your
                handlers behave consistently. You write <Styled.InlineCode>onClick</Styled.InlineCode>,
                <Styled.InlineCode>onChange</Styled.InlineCode>, etc., and React delivers a normalized event
                with the same API across browsers.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>SyntheticEvent:</b> a lightweight wrapper around the browser’s native event (<Styled.InlineCode>event.nativeEvent</Styled.InlineCode>).</li>
                    <li><b>Goal:</b> consistent event properties, names, and propagation behavior across browsers.</li>
                    <li><b>Removed pooling:</b> Since React 17+, events are <em>not pooled</em>; you can access them asynchronously without calling <Styled.InlineCode>event.persist()</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Handler basics */}
            <Styled.Section>
                <Styled.H2>Attaching Handlers</Styled.H2>
                <Styled.Pre>
                    {`function Button() {
  function handleClick(e) {
    // e is a SyntheticEvent
    e.preventDefault();           // stop default action (e.g., <a> navigation)
    e.stopPropagation();          // stop bubbling to ancestors
    console.log(e.type, e.target, e.currentTarget);
  }

  return (
    <a href="https://example.com" onClick={handleClick}>
      Click me
    </a>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Handlers receive <Styled.InlineCode>e</Styled.InlineCode> (SyntheticEvent). Use{" "}
                    <Styled.InlineCode>e.nativeEvent</Styled.InlineCode> only when you specifically need the
                    underlying browser event.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Target vs currentTarget */}
            <Styled.Section>
                <Styled.H2><code>event.target</code> vs <code>event.currentTarget</code></Styled.H2>
                <Styled.List>
                    <li><b>target:</b> the deepest element that actually triggered the event (where it originated).</li>
                    <li><b>currentTarget:</b> the element on which the handler is currently running (the one you attached the handler to).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function List({ items }) {
  function onItemClick(e) {
    // data-id is on the button (currentTarget), not necessarily the inner icon (target)
    const id = e.currentTarget.dataset.id;
    console.log("Clicked item id:", id);
  }

  return items.map((it) => (
    <button key={it.id} data-id={it.id} onClick={onItemClick}>
      <span className="icon">★</span> {it.label}
    </button>
  ));
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Propagation & phases */}
            <Styled.Section>
                <Styled.H2>Propagation: Bubbling & Capturing</Styled.H2>
                <Styled.List>
                    <li>React supports both phases via <Styled.InlineCode>onClick</Styled.InlineCode> (bubble) and <Styled.InlineCode>onClickCapture</Styled.InlineCode> (capture).</li>
                    <li><Styled.InlineCode>e.stopPropagation()</Styled.InlineCode> stops the event from continuing to bubble/capture.</li>
                    <li>Use capture to intercept early (e.g., global shortcuts, dismiss overlays).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Cards() {
  function onContainerClick() { console.log("bubble: container"); }
  function onContainerClickCapture() { console.log("capture: container"); }
  function onCardClick(e) {
    console.log("bubble: card");
    // e.stopPropagation(); // uncomment to keep container from seeing it
  }

  return (
    <div onClick={onContainerClick} onClickCapture={onContainerClickCapture}>
      <div className="card" onClick={onCardClick}>Card A</div>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Preventing default */}
            <Styled.Section>
                <Styled.H2>Preventing Default</Styled.H2>
                <Styled.List>
                    <li>Call <Styled.InlineCode>e.preventDefault()</Styled.InlineCode> to cancel default behavior (navigation, text selection, form submit, etc.).</li>
                    <li>Prefer semantic elements (<Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>) over overriding defaults on non-semantic tags.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Form() {
  function onSubmit(e) {
    e.preventDefault();
    // do async submit...
  }
  return <form onSubmit={onSubmit}>/* fields */</form>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Event names & differences */}
            <Styled.Section>
                <Styled.H2>Common Events & React Differences</Styled.H2>
                <Styled.List>
                    <li><b>onChange (inputs):</b> fires on every keystroke in React (similar to native <code>input</code>), not just on blur.</li>
                    <li><b>onFocus / onBlur:</b> in React, these <em>bubble</em>. Natively, focus/blur don’t bubble.</li>
                    <li><b>onScroll:</b> in React, scroll events bubble up the React tree; natively they do not.</li>
                    <li><b>Pointer events:</b> prefer <Styled.InlineCode>onPointerDown/Move/Up</Styled.InlineCode> for unified mouse/touch/pen handling.</li>
                    <li><b>Keyboard events:</b> use <Styled.InlineCode>onKeyDown</Styled.InlineCode> for accessibility and shortcuts.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function SearchBox() {
  const [q, setQ] = React.useState("");
  function onChange(e) { setQ(e.target.value); }
  function onKeyDown(e) {
    if (e.key === "Enter") { /* submit */ }
  }
  return <input value={q} onChange={onChange} onKeyDown={onKeyDown} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Performance & patterns */}
            <Styled.Section>
                <Styled.H2>Patterns & Performance</Styled.H2>
                <Styled.List>
                    <li><b>Delegate high-level handlers:</b> attach one handler on a parent and read <Styled.InlineCode>e.target</Styled.InlineCode>/<Styled.InlineCode>closest()</Styled.InlineCode> when many children are dynamic.</li>
                    <li><b>Stable handlers:</b> prefer memoized callbacks when passing to deep children to avoid unnecessary re-renders.</li>
                    <li><b>Passive listeners:</b> if you truly need <em>passive</em> listeners (e.g., wheel/scroll perf), use native <Styled.InlineCode>addEventListener</Styled.InlineCode> on <Styled.InlineCode>window</Styled.InlineCode> with <Styled.InlineCode>{`{ passive: true }`}</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: single delegated handler on a parent
function Menu({ items }) {
  function onClick(e) {
    const button = e.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    // handle action...
  }
  return (
    <div onClick={onClick}>
      {items.map(it => (
        <button key={it.id} data-action={it.action}>{it.label}</button>
      ))}
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use semantic elements and the closest appropriate event (click, change, submit).</li>
                    <li><b>Do</b> prefer pointer/keyboard events for inclusive interactions.</li>
                    <li><b>Do</b> stop propagation sparingly; prefer structural fixes if parents shouldn’t react.</li>
                    <li><b>Don’t</b> rely on <Styled.InlineCode>event.persist()</Styled.InlineCode> (no longer needed).</li>
                    <li><b>Don’t</b> mutate the DOM in handlers; update state instead and let React re-render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Default action:</b> the browser’s built-in behavior for an event (e.g., link navigation).</li>
                    <li><b>Bubbling:</b> event travels from the target up to ancestors.</li>
                    <li><b>Capturing:</b> event travels from ancestors down to the target (use <code>onXxxCapture</code>).</li>
                    <li><b>Delegation:</b> one high-level handler manages many child interactions.</li>
                    <li><b>Pointer events:</b> unified input model for mouse, touch, pen.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: React’s Synthetic Events give you a consistent API, predictable propagation,
                and convenience across browsers. Understand <i>target</i> vs <i>currentTarget</i>, when to
                prevent default, and prefer pointer/keyboard events for robust, accessible UI.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SyntheticEvents;
