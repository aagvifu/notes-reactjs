import React from "react";
import { Styled } from "./styled";

/**
 * Reusable Components — Accordion
 *
 * Goal: Give a crystal-clear mental model of what an Accordion is,
 * the moving parts (items, headers, panels), UX patterns (single vs multiple),
 * accessibility (roles, aria-*), state models (controlled vs uncontrolled),
 * and practical recipes you can reuse.
 */
const Accordion = () => {
    return (
        <Styled.Page>
            <Styled.Title>Accordion</Styled.Title>

            <Styled.Lead>
                An <b>Accordion</b> is a vertical stack of <i>items</i>. Each item has a
                <b> header (trigger) </b> you can click or focus + press a key to
                expand/collapse its <b> panel (content)</b>. Accordions help organize
                dense content into bite-sized sections without navigating away.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Item:</b> a pair of <i>header</i> (the clickable/focusable control) and
                        its <i>panel</i> (the content region that toggles visibility).
                    </li>
                    <li>
                        <b>Accordion:</b> a list of items where <i>only one</i> or <i>several</i> items
                        can be open at once.
                    </li>
                    <li>
                        <b>Use it when:</b> you have related sections (FAQ, settings groups,
                        documentation chapters) and want to keep the page compact.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key Terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (plain English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Header / Trigger:</b> the control (usually a button) users interact
                        with to show or hide a panel.
                    </li>
                    <li>
                        <b>Panel:</b> the content container tied to a header; it expands or
                        collapses.
                    </li>
                    <li>
                        <b>Single-expand:</b> at most one item is open at a time (like radio behavior).
                    </li>
                    <li>
                        <b>Multi-expand:</b> multiple items can be open (like checkboxes).
                    </li>
                    <li>
                        <b>Controlled:</b> the parent component holds the open state (via props like
                        <Styled.InlineCode>openId</Styled.InlineCode> or
                        <Styled.InlineCode>openIds</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Uncontrolled:</b> each item manages its own open/closed state internally.
                    </li>
                    <li>
                        <b>Disclosure:</b> a single header+panel pair (a "mini accordion item").
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy (What pieces you need)</Styled.H2>
                <Styled.List>
                    <li><b>Container</b> that lists items.</li>
                    <li><b>Header (button)</b> for each item with the label/icon.</li>
                    <li><b>Panel</b> region that shows content when the item is open.</li>
                    <li><b>State</b> that tracks which item(s) are open.</li>
                    <li><b>Accessibility bindings</b> so screen readers and keyboards work naturally.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Minimal Uncontrolled Example */}
            <Styled.Section>
                <Styled.H2>Example: Minimal Uncontrolled Accordion</Styled.H2>
                <Styled.Pre>
                    {`function UncontrolledAccordion() {
  const items = [
    { id: "a", title: "What is React?", content: "A library for building UIs." },
    { id: "b", title: "What is an Accordion?", content: "A stacked set of collapsible panels." },
    { id: "c", title: "When to use?", content: "When content can be grouped and revealed on demand." },
  ];

  // Local state per item (uncontrolled-ish per-mount). Each item stores open flag.
  const [openMap, setOpenMap] = React.useState(() => Object.create(null));

  function toggle(id) {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      {items.map(it => {
        const isOpen = !!openMap[it.id];
        return (
          <div key={it.id}>
            {/* Header: use a <button> for accessibility */}
            <button
              aria-expanded={isOpen}
              aria-controls={\`panel-\${it.id}\`}
              id={\`header-\${it.id}\`}
              onClick={() => toggle(it.id)}
            >
              {it.title}
            </button>

            {/* Panel: reference header with aria-labelledby */}
            <div
              id={\`panel-\${it.id}\`}
              role="region"
              aria-labelledby={\`header-\${it.id}\`}
              hidden={!isOpen}
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Uses native <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>, wires{" "}
                    <Styled.InlineCode>aria-expanded</Styled.InlineCode> and{" "}
                    <Styled.InlineCode>aria-controls</Styled.InlineCode> for headers and a{" "}
                    <Styled.InlineCode>role="region"</Styled.InlineCode> panel with{" "}
                    <Styled.InlineCode>aria-labelledby</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Controlled (Single-Expand) */}
            <Styled.Section>
                <Styled.H2>Example: Controlled (Single-Expand)</Styled.H2>
                <Styled.Pre>
                    {`function SingleExpandAccordion({ items }) {
  const [openId, setOpenId] = React.useState(null);

  function onToggle(id) {
    setOpenId(prev => (prev === id ? null : id)); // radio-like behavior
  }

  return (
    <div>
      {items.map(it => {
        const isOpen = openId === it.id;
        return (
          <div key={it.id}>
            <button
              id={\`hdr-\${it.id}\`}
              aria-expanded={isOpen}
              aria-controls={\`pan-\${it.id}\`}
              onClick={() => onToggle(it.id)}
            >
              {it.title}
            </button>

            <div
              id={\`pan-\${it.id}\`}
              role="region"
              aria-labelledby={\`hdr-\${it.id}\`}
              hidden={!isOpen}
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Parent owns state (<Styled.InlineCode>openId</Styled.InlineCode>) and passes behavior to headers. Only one open at a time.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Controlled (Multi-Expand) */}
            <Styled.Section>
                <Styled.H2>Example: Controlled (Multi-Expand)</Styled.H2>
                <Styled.Pre>
                    {`function MultiExpandAccordion({ items }) {
  const [openIds, setOpenIds] = React.useState(() => new Set());

  function toggle(id) {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      {items.map(it => {
        const isOpen = openIds.has(it.id);
        return (
          <div key={it.id}>
            <button
              id={\`h-\${it.id}\`}
              aria-expanded={isOpen}
              aria-controls={\`p-\${it.id}\`}
              onClick={() => toggle(it.id)}
            >
              {isOpen ? "▼" : "►"} {it.title}
            </button>
            <div
              id={\`p-\${it.id}\`}
              role="region"
              aria-labelledby={\`h-\${it.id}\`}
              hidden={!isOpen}
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Accessibility (Keyboard & ARIA) */}
            <Styled.Section>
                <Styled.H2>Accessibility (Keyboard &amp; ARIA)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Headers must be focusable:</b> use <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>State announce:</b> toggle <Styled.InlineCode>aria-expanded</Styled.InlineCode> on the header;
                        connect header ↔ panel with <Styled.InlineCode>aria-controls</Styled.InlineCode> (header) and{" "}
                        <Styled.InlineCode>aria-labelledby</Styled.InlineCode> (panel).
                    </li>
                    <li>
                        <b>Keyboard:</b> <kbd>Enter</kbd>/<kbd>Space</kbd> toggles; optional arrow keys to move focus
                        between headers for long lists.
                    </li>
                    <li>
                        <b>Structure:</b> it's fine to use plain divs; the critical part is correct labeling/relationships.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) UX Patterns, Do / Don't */}
            <Styled.Section>
                <Styled.H2>UX Patterns &amp; Do/Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep headers short and descriptive; reflect the panel's content.</li>
                    <li><b>Do</b> indicate state (chevron rotation, +/-, "Show/Hide").</li>
                    <li><b>Do</b> choose single vs multi-expand based on content relationship.</li>
                    <li><b>Don't</b> put critical content only inside a collapsed panel if users might miss it.</li>
                    <li><b>Don't</b> trap focus; allow tabbing from header into panel content and out.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Performance & Edge Cases */}
            <Styled.Section>
                <Styled.H2>Performance &amp; Edge Cases</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Mount vs unmount:</b> collapsing can be done by hiding via CSS or by unmounting. Unmount to save
                        memory; keep mounted for preserving form state inside panels.
                    </li>
                    <li>
                        <b>Long lists:</b> consider virtualization if there are dozens of heavy panels.
                    </li>
                    <li>
                        <b>Deep content:</b> if a panel contains interactive widgets (forms, tables), ensure focus order and
                        keyboard hints are obvious.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) API Design Checklist */}
            <Styled.Section>
                <Styled.H2>API Design Checklist (for a reusable component)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Value props:</b> <Styled.InlineCode>openId</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>openIds</Styled.InlineCode> for controlled modes;{" "}
                        <Styled.InlineCode>defaultOpenId(s)</Styled.InlineCode> for uncontrolled.
                    </li>
                    <li>
                        <b>Events:</b> <Styled.InlineCode>onChange(id)</Styled.InlineCode> (single) or{" "}
                        <Styled.InlineCode>onChange(nextIds)</Styled.InlineCode> (multi).
                    </li>
                    <li>
                        <b>Composition:</b> slots like <Styled.InlineCode>Accordion.Item</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Accordion.Header</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Accordion.Panel</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Accessibility:</b> wire <Styled.InlineCode>aria-*</Styled.InlineCode> attributes internally so
                        consumers get an accessible experience by default.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Disclosure:</b> a single header+panel toggle (one item of an accordion).</li>
                    <li><b>Controlled:</b> parent owns the state and passes props down.</li>
                    <li><b>Uncontrolled:</b> component manages its own internal state.</li>
                    <li><b>Single-expand:</b> one open at a time.</li>
                    <li><b>Multi-expand:</b> multiple open at once.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Build accordions with semantic buttons for headers, clearly labeled panels,
                and a conscious choice between single vs multi-expand and controlled vs uncontrolled
                state. Keep keyboard and screen-reader flows first-class.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Accordion;
