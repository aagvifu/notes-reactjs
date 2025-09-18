import { Styled } from "./styled";

const EventBubbling = () => {
    return (
        <Styled.Page>
            <Styled.Title>Event Bubbling & Capturing</Styled.Title>

            <Styled.Lead>
                <b>Event propagation</b> is how an event travels through the tree: first the{" "}
                <b>capturing phase</b> (ancestors → target), then at the <b>target</b>, then the{" "}
                <b>bubbling phase</b> (target → ancestors). React exposes both via{" "}
                <Styled.InlineCode>onXxxCapture</Styled.InlineCode> (capture) and{" "}
                <Styled.InlineCode>onXxx</Styled.InlineCode> (bubble).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Capturing phase:</b> the event descends from the document/root down to the target.
                        In React, use handlers like <Styled.InlineCode>onClickCapture</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Target phase:</b> the event is dispatched on the actual element where it originated.
                    </li>
                    <li>
                        <b>Bubbling phase:</b> the event ascends from the target up through ancestors. In React,
                        use handlers like <Styled.InlineCode>onClick</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Propagation:</b> the overall traversal of the event through capture → target → bubble.
                    </li>
                    <li>
                        <b>Default action:</b> the browser’s built-in behavior (e.g., link navigation, form submit).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Order demo */}
            <Styled.Section>
                <Styled.H2>Order of handlers (capture vs bubble)</Styled.H2>
                <Styled.Pre>
                    {`function Demo() {
  function log(label) {
    return () => console.log(label);
  }

  return (
    <div
      onClickCapture={log("capture: OUTER")}
      onClick={log("bubble: OUTER")}
      style={{ padding: 16, border: "1px solid" }}
    >
      <div
        onClickCapture={log("capture: INNER")}
        onClick={log("bubble: INNER")}
        style={{ padding: 16, border: "1px dashed" }}
      >
        <button
          onClickCapture={log("capture: BUTTON")}
          onClick={log("bubble: BUTTON")}
        >
          Click me
        </button>
      </div>
    </div>
  );
}
/*
Clicking the button logs:
capture: OUTER
capture: INNER
capture: BUTTON
bubble: BUTTON
bubble: INNER
bubble: OUTER
*/`}
                </Styled.Pre>
                <Styled.Small>
                    Capture handlers fire top→down before bubble handlers fire bottom→up.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Stop propagation vs prevent default */}
            <Styled.Section>
                <Styled.H2>Stopping propagation vs preventing default</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>e.stopPropagation()</Styled.InlineCode> stops the event from
                        continuing to the next listeners in the propagation path.
                    </li>
                    <li>
                        <Styled.InlineCode>e.preventDefault()</Styled.InlineCode> cancels the default browser
                        action but <em>does not</em> stop propagation.
                    </li>
                    <li>
                        <Styled.InlineCode>e.isPropagationStopped()</Styled.InlineCode> tells you if propagation
                        has been stopped (SyntheticEvent helper).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function LinkInsideCard() {
  function onCardClick() {
    console.log("card clicked");
  }
  function onLinkClick(e) {
    e.preventDefault();       // don't navigate
    e.stopPropagation();      // don't trigger card click
    console.log("link clicked only");
  }
  return (
    <div onClick={onCardClick} role="button">
      <a href="/somewhere" onClick={onLinkClick}>Open</a>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Preventing default doesn’t imply stopping propagation; call both if you need both.
                </Styled.Small>
            </Styled.Section>

            {/* 4) event.target vs event.currentTarget */}
            <Styled.Section>
                <Styled.H2><code>event.target</code> vs <code>event.currentTarget</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>target:</b> the actual element that originated the event (deepest node).
                    </li>
                    <li>
                        <b>currentTarget:</b> the element whose handler is currently running (where you attached
                        the listener). Prefer this when reading dataset/props associated with that handler.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Toolbar() {
  function onClick(e) {
    const btn = e.currentTarget;           // the <button> we bound to
    console.log("action:", btn.dataset.action);
  }
  return (
    <>
      <button data-action="save" onClick={onClick}>
        <span className="icon">💾</span> Save
      </button>
      <button data-action="delete" onClick={onClick}>
        <span className="icon">🗑️</span> Delete
      </button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Delegation pattern */}
            <Styled.Section>
                <Styled.H2>Delegation (one parent handles many children)</Styled.H2>
                <Styled.List>
                    <li>
                        Attach a single handler high in the tree, use{" "}
                        <Styled.InlineCode>e.target.closest(selector)</Styled.InlineCode> to discover which
                        child was activated. Useful for dynamic lists.
                    </li>
                    <li>
                        Keeps memory footprint low and avoids re-binding handlers during list updates.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Menu({ items }) {
  function onClick(e) {
    const el = e.target.closest("[data-key]");
    if (!el) return;
    const key = el.dataset.key;
    console.log("clicked:", key);
  }
  return (
    <div onClick={onClick}>
      {items.map(it => (
        <button key={it.key} data-key={it.key}>{it.label}</button>
      ))}
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Modals/overlays: close-on-outside-click */}
            <Styled.Section>
                <Styled.H2>Modals & overlays: outside vs inside clicks</Styled.H2>
                <Styled.List>
                    <li>
                        Close on overlay click by listening on the overlay; stop propagation inside the dialog
                        content to avoid accidental close.
                    </li>
                    <li>
                        Alternatively, inspect <Styled.InlineCode>e.target</Styled.InlineCode> and only close if
                        it equals the overlay element.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Modal({ onClose }) {
  function onOverlayClick(e) {
    if (e.target === e.currentTarget) onClose(); // clicked on overlay itself
  }
  function onDialogClick(e) {
    e.stopPropagation(); // prevent bubbling to overlay
  }
  return (
    <div className="overlay" onClick={onOverlayClick}>
      <div className="dialog" onClick={onDialogClick}>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) React-specific notes */}
            <Styled.Section>
                <Styled.H2>React-specific behavior</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Focus/blur:</b> in native DOM these don’t bubble; in React <em>they do</em> as{" "}
                        <Styled.InlineCode>onFocus</Styled.InlineCode>/<Styled.InlineCode>onBlur</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Scroll:</b> React’s <Styled.InlineCode>onScroll</Styled.InlineCode> bubbles up the React tree.
                    </li>
                    <li>
                        <b>Portals:</b> events from portal children bubble through the <em>React</em> parent tree,
                        even if the DOM ancestor is elsewhere.
                    </li>
                    <li>
                        <b>stopImmediatePropagation:</b> SyntheticEvent has{" "}
                        <Styled.InlineCode>stopPropagation()</Styled.InlineCode> but not{" "}
                        <Styled.InlineCode>stopImmediatePropagation()</Styled.InlineCode>. Avoid reaching for{" "}
                        <Styled.InlineCode>e.nativeEvent.stopImmediatePropagation()</Styled.InlineCode> unless you
                        truly need native cancellation semantics.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Accessibility & pitfalls */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t (A11y + Pitfalls)</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefer semantic controls (<Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>, <Styled.InlineCode>&lt;label&gt;</Styled.InlineCode>).</li>
                    <li><b>Do</b> keep handlers stable when passing deep to avoid needless re-renders.</li>
                    <li><b>Do</b> scope <Styled.InlineCode>stopPropagation()</Styled.InlineCode> to real conflicts—overuse can hide bugs.</li>
                    <li><b>Don’t</b> nest interactive elements (e.g., button inside link). It confuses focus/AT and complicates propagation.</li>
                    <li><b>Don’t</b> assume <Styled.InlineCode>preventDefault()</Styled.InlineCode> stops bubbling—it doesn’t.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Quick reference */}
            <Styled.Section>
                <Styled.H2>Quick Reference</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>onXxxCapture</Styled.InlineCode>: capture phase listener</li>
                    <li><Styled.InlineCode>onXxx</Styled.InlineCode>: bubble phase listener</li>
                    <li><Styled.InlineCode>e.stopPropagation()</Styled.InlineCode>: stop further propagation</li>
                    <li><Styled.InlineCode>e.preventDefault()</Styled.InlineCode>: cancel default action</li>
                    <li><Styled.InlineCode>e.target</Styled.InlineCode> vs <Styled.InlineCode>e.currentTarget</Styled.InlineCode>: origin vs bound element</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Understand the three phases, use capture for early interception, bubble for normal
                UI flows, and apply <i>stopPropagation</i> only when necessary. Favor semantic elements and
                delegation for scalable, accessible interactions.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default EventBubbling;
