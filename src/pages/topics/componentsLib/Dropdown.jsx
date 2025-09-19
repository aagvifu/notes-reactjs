import React from "react";
import { Styled } from "./styled";

const Dropdown = () => {
    return (
        <Styled.Page>
            <Styled.Title>Dropdown</Styled.Title>

            <Styled.Lead>
                A <b>Dropdown</b> is a floating panel that opens from a trigger (usually a{" "}
                <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>) to reveal actions or choices.
                It's not a native element; you design its structure, behavior, and accessibility.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Dropdown:</b> A generic popover opened by a trigger to show a small list of actions
                        or options. It can be a <em>menu</em> (actions) or a <em>listbox</em> (choose one).
                    </li>
                    <li>
                        <b>Select (native):</b> The HTML{" "}
                        <Styled.InlineCode>&lt;select&gt;</Styled.InlineCode> element. Good defaults, built-in
                        keyboard & mobile UI, but limited styling.
                    </li>
                    <li>
                        <b>Menu:</b> A list of <em>actions</em> (not selected state). Use{" "}
                        <Styled.InlineCode>role="menu"</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>role="menuitem"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Listbox:</b> A list of <em>options</em> where one (or more) is selected. Use{" "}
                        <Styled.InlineCode>role="listbox"</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>role="option"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Combobox:</b> An input + popup options you can type to filter. It's <em>not</em> a
                        menu; it's an interactive form control with{" "}
                        <Styled.InlineCode>role="combobox"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Trigger:</b> The element (usually a button) that opens/closes the dropdown. It should
                        have <Styled.InlineCode>aria-expanded</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Focus management:</b> Ensuring focus moves predictably (to the panel on open; back to
                        the trigger on close), enabling full keyboard usage.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use what */}
            <Styled.Section>
                <Styled.H2>When to use what?</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>native select</b> for simple form selection—best mobile support, minimal code.
                    </li>
                    <li>
                        Use a <b>menu dropdown</b> for performing actions (Edit, Duplicate, Delete).
                    </li>
                    <li>
                        Use a <b>listbox dropdown</b> for stylable, keyboardable option selection.
                    </li>
                    <li>
                        Use a <b>combobox</b> when typing to filter choices is important.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal patterns */}
            <Styled.Section>
                <Styled.H2>Pattern 1 — Native Select (fastest path)</Styled.H2>
                <Styled.Pre>
                    {`function NativeSelect() {
  const [value, setValue] = React.useState("apple");
  return (
    <label>
      Fruit:
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="apple">Apple</option>
        <option value="mango">Mango</option>
        <option value="banana">Banana</option>
      </select>
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Pros: accessibility & mobile UI handled by the browser. Cons: limited styling.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Pattern 2 — Menu Dropdown (actions)</Styled.H2>
                <Styled.List>
                    <li>
                        Structure: <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode> (trigger) +{" "}
                        <Styled.InlineCode>&lt;div role="menu"&gt;</Styled.InlineCode> (popup).
                    </li>
                    <li>
                        Keyboard: <Styled.InlineCode>Enter</Styled.InlineCode>/
                        <Styled.InlineCode>Space</Styled.InlineCode> opens; <Styled.InlineCode>Esc</Styled.InlineCode> closes;{" "}
                        arrow keys move between items; <Styled.InlineCode>Tab</Styled.InlineCode> usually closes.
                    </li>
                    <li>
                        Close rules: click outside, focus loss to outside, Escape, selecting a menu item.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function MenuDropdown() {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const menuId = "user-menu";

  React.useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const m = menuRef.current, b = btnRef.current;
      if (m && !m.contains(e.target) && b && !b.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (open && menuRef.current) {
      // Move focus into the menu on open
      const first = menuRef.current.querySelector('[role="menuitem"]');
      first?.focus();
    } else if (!open) {
      // Return focus to trigger on close
      btnRef.current?.focus();
    }
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        Open menu
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="User actions"
          style={{
            position: "absolute", insetInlineStart: 0, marginTop: 8,
            minWidth: 180, padding: 8, border: "1px solid #333", borderRadius: 8, background: "#111",
          }}
        >
          <button role="menuitem" onClick={() => { /* edit */ setOpen(false); }}>Edit</button>
          <button role="menuitem" onClick={() => { /* duplicate */ setOpen(false); }}>Duplicate</button>
          <button role="menuitem" onClick={() => { /* delete */ setOpen(false); }}>Delete</button>
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Semantics: <Styled.InlineCode>role="menu"</Styled.InlineCode> with{" "}
                    <Styled.InlineCode>role="menuitem"</Styled.InlineCode>. Manage focus and close behavior.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Pattern 3 — Listbox Dropdown (choose one)</Styled.H2>
                <Styled.List>
                    <li>
                        Structure: trigger button shows current value; popup is{" "}
                        <Styled.InlineCode>role="listbox"</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>role="option"</Styled.InlineCode>.
                    </li>
                    <li>
                        Keyboard: Up/Down navigate options; Enter/Space selects; Esc closes; type-to-select is a nice bonus.
                    </li>
                    <li>
                        Reflect selection with <Styled.InlineCode>aria-activedescendant</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>aria-selected</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ListboxDropdown({ options = ["Apple", "Mango", "Banana"] }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(options[0]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const listId = "fruit-listbox";

  function selectAt(i) {
    setValue(options[i]);
    setOpen(false);
  }

  function onListKeyDown(e) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") setActiveIndex(i => Math.min(i + 1, options.length - 1));
    if (e.key === "ArrowUp") setActiveIndex(i => Math.max(i - 1, 0));
    if (e.key === "Enter" || e.key === " ") selectAt(activeIndex);
  }

  React.useEffect(() => {
    if (open) {
      const el = listRef.current?.querySelector('[role="option"][data-index="' + activeIndex + '"]');
      el?.focus();
    } else {
      btnRef.current?.focus();
    }
  }, [open, activeIndex]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btnRef}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {value}
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          style={{
            position: "absolute", insetInlineStart: 0, marginTop: 8,
            minWidth: 180, padding: 4, border: "1px solid #333", borderRadius: 8, background: "#111",
          }}
        >
          {options.map((opt, i) => {
            const selected = opt === value;
            const active = i === activeIndex;
            return (
              <div
                key={opt}
                role="option"
                data-index={i}
                tabIndex={active ? 0 : -1}
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => selectAt(i)}
                style={{
                  padding: "6px 10px",
                  outline: "none",
                  borderRadius: 6,
                  background: active ? "#1b1b1b" : "transparent",
                  fontWeight: selected ? 600 : 400,
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    For complex behaviors (search, virtualization, multi-select), prefer a mature library or
                    your own well-tested component.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Positioning & layering */}
            <Styled.Section>
                <Styled.H2>Positioning, Layering, & Portals</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Positioning:</b> Place the panel relative to the trigger (below/above/start/end) and
                        flip when there's no space. A positioning lib (e.g., “floating UI”) simplifies edge cases.
                    </li>
                    <li>
                        <b>Layering:</b> Dropdowns should appear above content (z-index). In complex layouts,
                        rendering inside a <em>portal</em> can avoid clipping by overflow/transform parents.
                    </li>
                    <li>
                        <b>Scroll containers:</b> Ensure the panel repositions on scroll/resize; throttle if needed.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trigger:</b> a real <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode> +{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Roles:</b> Use <Styled.InlineCode>role="menu"</Styled.InlineCode> for actions,{" "}
                        <Styled.InlineCode>role="listbox"</Styled.InlineCode> for selection.
                    </li>
                    <li>
                        <b>Focus:</b> Move focus into the popup on open; restore to the trigger on close.
                    </li>
                    <li>
                        <b>Keyboard:</b> Handle Esc to close; Arrow keys to navigate items/options.
                    </li>
                    <li>
                        <b>Announcements:</b> Give the popup a label (aria-label or aria-labelledby).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefer native <Styled.InlineCode>&lt;select&gt;</Styled.InlineCode> for simple forms.</li>
                    <li><b>Do</b> use a real button for the trigger; not a div.</li>
                    <li><b>Do</b> close on outside click, Escape, and selection (unless multi-select).</li>
                    <li><b>Don't</b> trap focus inside a <em>menu</em>; it should close when tabbing away.</li>
                    <li><b>Don't</b> rely only on hover—support click and keyboard.</li>
                    <li><b>Don't</b> forget touch targets (at least ~40px) on mobile.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Using <em>role="menu"</em> for selection UIs (should be listbox).</li>
                    <li>Not restoring focus to the trigger after close.</li>
                    <li>Forgetting Escape/Outside click handling.</li>
                    <li>Anchoring inside an overflow-hidden parent without a portal (panel gets clipped).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Portal:</b> Rendering a subtree elsewhere in the DOM to control layering/clipping.</li>
                    <li><b>Disclosure:</b> A button that shows/hides related content region.</li>
                    <li><b>Activedescendant:</b> ARIA pattern where focus stays on container while indicating the active child via ID.</li>
                    <li><b>Typeahead:</b> Typing letters moves focus to matching options.</li>
                    <li><b>Focus ring:</b> The visible outline indicating the focused element.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick the right primitive (menu vs listbox vs native select), wire up focus +
                keyboard + closing rules, and position the panel robustly. Start simple; add features only
                when the UX truly needs them.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Dropdown;
