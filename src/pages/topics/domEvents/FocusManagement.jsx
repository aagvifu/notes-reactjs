import { Styled } from "./styled";

const FocusManagement = () => {
    return (
        <Styled.Page>
            <Styled.Title>Focus Management</Styled.Title>

            <Styled.Lead>
                <b>Focus management</b> is about making keyboard navigation predictable: where focus starts,
                where it moves, how it’s announced by screen readers, and how it’s restored. In React, you’ll
                mostly manage focus with <Styled.InlineCode>ref</Styled.InlineCode>, effects, and ARIA practices.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Focus:</b> The element that receives keyboard input. The browser exposes it as{" "}
                        <Styled.InlineCode>document.activeElement</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Tab order:</b> The sequence focus follows with <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd>, based on DOM order and{" "}
                        <Styled.InlineCode>tabIndex</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Focusable:</b> Elements that can gain focus (links, buttons, form fields, anything with{" "}
                        <Styled.InlineCode>tabIndex &gt;= 0</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Roving tabIndex:</b> A pattern where only one item in a composite widget has{" "}
                        <Styled.InlineCode>tabIndex=0</Styled.InlineCode> and the rest are <Styled.InlineCode>-1</Styled.InlineCode>,
                        with arrow keys moving focus.
                    </li>
                    <li>
                        <b>Focus trap:</b> Modal/dialog behavior that keeps focus inside until the dialog closes.
                    </li>
                    <li>
                        <b>:focus-visible:</b> CSS pseudo-class that shows focus only for keyboard focus (not mouse).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Base rules */}
            <Styled.Section>
                <Styled.H2>Core Principles</Styled.H2>
                <Styled.List>
                    <li>Every interactive element must be reachable with the keyboard.</li>
                    <li>Focus must be <b>visible</b> (don’t remove outlines; use <Styled.InlineCode>:focus-visible</Styled.InlineCode>).</li>
                    <li>When UI context changes (route, dialog open), move focus to the most relevant element.</li>
                    <li>When closing transient UI (modal, popover), <b>restore</b> focus to the triggering control.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Programmatic focus */}
            <Styled.Section>
                <Styled.H2>Programmatic Focus (refs &amp; effects)</Styled.H2>
                <Styled.Pre>
                    {`function NameField() {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    // Focus on mount without scrolling the page:
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <label>
      Name
      <input ref={inputRef} type="text" />
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>focus({"{ preventScroll: true }"})</Styled.InlineCode> to avoid layout jumps.
                    Prefer focusing the first error field after validation.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Manage focus on route/page changes */}
            <Styled.Section>
                <Styled.H2>Route/Page Changes: Move Focus to Main</Styled.H2>
                <Styled.List>
                    <li>Place <Styled.InlineCode>tabIndex="-1"</Styled.InlineCode> on your page heading or main region.</li>
                    <li>On route change, focus it so screen readers announce the new context.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function PageTitle({ children }) {
  const h1Ref = React.useRef(null);
  React.useEffect(() => { h1Ref.current?.focus(); }, []);
  return (
    <h1 ref={h1Ref} tabIndex={-1}>
      {children}
    </h1>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Add a “Skip to content” link that targets <Styled.InlineCode>#main</Styled.InlineCode> to bypass nav.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Focus trap (modal/dialog) */}
            <Styled.Section>
                <Styled.H2>Focus Trap (Modal/Dialog)</Styled.H2>
                <Styled.List>
                    <li>When a modal opens: focus the first meaningful control inside.</li>
                    <li>Trap <kbd>Tab</kbd> within the dialog; restore focus to the trigger on close.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useFocusTrap(containerRef, isOpen) {
  React.useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const FOCUSABLE = [
      "a[href]", "button:not([disabled])", "input:not([disabled])",
      "select:not([disabled])", "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    const nodes = () => Array.from(container.querySelectorAll(FOCUSABLE));
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const list = nodes();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    // Initial focus
    (nodes()[0] || container).focus({ preventScroll: true });

    return () => container.removeEventListener("keydown", onKeyDown);
  }, [containerRef, isOpen]);
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is a minimal trap. For production, also handle focus return to the opening button.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Roving tabIndex for menus/toolbar */}
            <Styled.Section>
                <Styled.H2>Roving tabIndex (Menus, Toolbars, Grids)</Styled.H2>
                <Styled.List>
                    <li>Only the “active” item has <Styled.InlineCode>tabIndex=0</Styled.InlineCode>; the rest are <Styled.InlineCode>-1</Styled.InlineCode>.</li>
                    <li>Arrow keys move focus without leaving the widget.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function RovingList({ items }) {
  const [index, setIndex] = React.useState(0);
  const refs = React.useRef([]);

  React.useEffect(() => {
    refs.current[index]?.focus();
  }, [index]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex(i => (i + 1) % items.length); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setIndex(i => (i - 1 + items.length) % items.length); }
  };

  return (
    <ul role="listbox" aria-activedescendant={\`item-\${index}\`} onKeyDown={onKeyDown}>
      {items.map((it, i) => (
        <li key={it.id}>
          <button
            id={\`item-\${i}\`}
            ref={el => (refs.current[i] = el)}
            tabIndex={i === index ? 0 : -1}
            aria-selected={i === index}
            onClick={() => setIndex(i)}
          >
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Focus styles */}
            <Styled.Section>
                <Styled.H2>Focus Styles &amp; :focus-visible</Styled.H2>
                <Styled.List>
                    <li>Don’t remove outlines globally. If you restyle, do it with <Styled.InlineCode>:focus-visible</Styled.InlineCode>.</li>
                    <li>Use clear, high-contrast rings; avoid relying on color alone.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Example (in your global CSS) */
:focus {
  outline: none; /* avoid removing unless you replace with :focus-visible */
}
:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) React focus events */}
            <Styled.Section>
                <Styled.H2>React Focus Events</Styled.H2>
                <Styled.List>
                    <li>
                        <b>onFocus / onBlur bubble in React</b> (unlike native). Use{" "}
                        <Styled.InlineCode>onFocusCapture</Styled.InlineCode>/<Styled.InlineCode>onBlurCapture</Styled.InlineCode> to intercept early.
                    </li>
                    <li>
                        Read <Styled.InlineCode>e.relatedTarget</Styled.InlineCode> on blur/focus to know where focus is going/coming from.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function FieldGroup() {
  function onBlur(e) {
    // When leaving the group entirely:
    if (!e.currentTarget.contains(e.relatedTarget)) {
      // commit validation, etc.
    }
  }
  return (
    <div onBlur={onBlur}>
      <input placeholder="First" />
      <input placeholder="Last" />
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> move focus intentionally after route/dialog changes.</li>
                    <li><b>Do</b> restore focus to the trigger when closing modals/popovers.</li>
                    <li><b>Do</b> use semantic elements (<Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>, <Styled.InlineCode>&lt;a&gt;</Styled.InlineCode>).</li>
                    <li><b>Don’t</b> remove focus outlines without an accessible replacement.</li>
                    <li><b>Don’t</b> trap focus accidentally (hidden off-screen elements with <Styled.InlineCode>tabIndex=0</Styled.InlineCode>).</li>
                    <li><b>Don’t</b> rely on mouse-only interactions; ensure full keyboard flow.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Active element:</b> the focused element in the document.</li>
                    <li><b>Focus ring:</b> the visual outline indicating focus.</li>
                    <li><b>Skip link:</b> a link at the top of the page that jumps to main content.</li>
                    <li><b>Composite widget:</b> a grouped control (menu, listbox, toolbar) managed with roving tabIndex.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Ensure logical tab order, visible focus, and programmatic focus moves only when
                context changes. Use roving tabIndex inside composite widgets, trap &amp; restore focus in
                modals, and rely on <i>:focus-visible</i> for friendly, accessible styling.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FocusManagement;
