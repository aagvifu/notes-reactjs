import React from "react";
import { Styled } from "./styled";

const Menu = () => {
    return (
        <Styled.Page>
            <Styled.Title>Menu (Components Library)</Styled.Title>

            <Styled.Lead>
                A <b>Menu</b> is a temporary list of actions or navigation choices that opens on demand,
                usually from a <b>Menu Button</b> (the trigger). It should be keyboard-friendly,
                screen-reader friendly, and keep focus behavior predictable.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Menu:</b> A popover list of selectable <em>items</em> (actions/links). In ARIA terms,
                        the container typically has <Styled.InlineCode>role="menu"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Menu Button / Trigger:</b> The control that toggles the menu. It references the menu by
                        ID and reflects open state via{" "}
                        <Styled.InlineCode>aria-haspopup="menu"</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Menu Item:</b> An actionable option inside the menu. Usually{" "}
                        <Styled.InlineCode>role="menuitem"</Styled.InlineCode> (or{" "}
                        <Styled.InlineCode>menuitemcheckbox</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>menuitemradio</Styled.InlineCode> for toggles).
                    </li>
                    <li>
                        <b>Separator:</b> A visual divider between related groups of items.{" "}
                        <Styled.InlineCode>role="separator"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Submenu:</b> A nested menu that opens from a parent item. Parent gets{" "}
                        <Styled.InlineCode>aria-haspopup="menu"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Roving Tabindex:</b> A keyboard pattern where only one item is{" "}
                        <Styled.InlineCode>tabIndex=0</Styled.InlineCode> (focusable) at a time and others are{" "}
                        <Styled.InlineCode>-1</Styled.InlineCode>. Arrow keys move the focus.
                    </li>
                    <li>
                        <b>Typeahead:</b> Typing letters quickly focuses the next matching item label.
                    </li>
                    <li>
                        <b>Dismissal:</b> The rules that close the menu: selecting an item, pressing{" "}
                        <Styled.InlineCode>Escape</Styled.InlineCode>, clicking outside, or blurring the trigger
                        (depending on UX).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) UX rules */}
            <Styled.Section>
                <Styled.H2>Essential UX Rules</Styled.H2>
                <Styled.List>
                    <li>
                        The menu should <b>anchor</b> to the trigger (below/near it) and not jump on scroll.
                    </li>
                    <li>
                        <b>Open on click</b> (or Enter/Space on the trigger), not on hover alone. Hover may preview,
                        but click confirms.
                    </li>
                    <li>
                        <b>One tab stop:</b> Tab moves into the first item (or stays on trigger); arrow keys handle
                        intra-menu navigation.
                    </li>
                    <li>
                        Close on selection (unless it's a checkbox/radio group that supports multi-actions).
                    </li>
                    <li>
                        Always keep a <b>visible focus ring</b> on the current item.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Keyboard map */}
            <Styled.Section>
                <Styled.H2>Keyboard Map (WAI-ARIA Pattern)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trigger:</b> <Styled.InlineCode>Enter</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>Space</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>ArrowDown</Styled.InlineCode> opens the menu.{" "}
                        <Styled.InlineCode>ArrowUp</Styled.InlineCode> may open to last item.
                    </li>
                    <li>
                        <b>Inside menu:</b> <Styled.InlineCode>ArrowDown</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>ArrowUp</Styled.InlineCode> moves focus;{" "}
                        <Styled.InlineCode>Home</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>End</Styled.InlineCode> jumps to first/last; typing letters triggers{" "}
                        <b>typeahead</b>.
                    </li>
                    <li>
                        <b>Select:</b> <Styled.InlineCode>Enter</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>Space</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Dismiss:</b> <Styled.InlineCode>Escape</Styled.InlineCode> or click outside returns focus
                        to the trigger.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Minimal conceptual example */}
            <Styled.Section>
                <Styled.H2>Minimal Example (Concept)</Styled.H2>
                <Styled.Pre>
                    {`function MenuExample() {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  const listRef = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const items = ["New File", "Open...", "Save As...", "Export"];

  function openMenu() {
    setOpen(true);
    // Defer focus into the list
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector('[role="menuitem"][tabindex="0"]');
      el?.focus();
    });
  }

  function closeMenu() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onTriggerKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(e) {
    if (e.key === "Escape") return closeMenu();
    if (e.key === "ArrowDown") setActive(i => (i + 1) % items.length);
    if (e.key === "ArrowUp") setActive(i => (i - 1 + items.length) % items.length);
    if (e.key === "Home") setActive(0);
    if (e.key === "End") setActive(items.length - 1);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // perform action for items[active]
      closeMenu();
    }
  }

  React.useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (!listRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        closeMenu();
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div>
      <button
        ref={buttonRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="file-menu"
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        File ▾
      </button>

      {open && (
        <ul
          id="file-menu"
          ref={listRef}
          role="menu"
          aria-label="File"
          onKeyDown={onListKeyDown}
          style={{ marginTop: 8, position: "absolute", minWidth: 160, padding: 6, border: "1px solid #ccc" }}
        >
          {items.map((label, i) => (
            <li key={label} role="presentation">
              <button
                role="menuitem"
                tabIndex={i === active ? 0 : -1}           // roving tabindex
                data-index={i}
                onMouseEnter={() => setActive(i)}         // hover sync
                onClick={() => { /* do action */ closeMenu(); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 8px" }}
              >
                {label}
              </button>
            </li>
          ))}
          <li role="separator" style={{ margin: "6px 0", borderTop: "1px solid #e5e5e5" }} />
          <li role="presentation">
            <button role="menuitem" tabIndex={-1} onClick={() => { /* settings */ closeMenu(); }}>
              Settings…
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This illustrates <b>trigger</b>, <b>menu</b>, <b>menu items</b>, <b>roving tabindex</b>,{" "}
                    <b>dismissal</b>, and <b>keyboard controls</b>. In your real component lib, wrap these
                    behaviors into reusable primitives.
                </Styled.Small>
            </Styled.Section>

            {/* 5) API shape (consumer-facing) */}
            <Styled.Section>
                <Styled.H2>Typical API Shape (Consumer-Facing)</Styled.H2>
                <Styled.Pre>
                    {`// Pseudocode API you might expose:
<Menu>
  <Menu.Trigger>File</Menu.Trigger>
  <Menu.Content align="start" side="bottom">
    <Menu.Item onSelect={...}>New File</Menu.Item>
    <Menu.Item onSelect={...}>Open…</Menu.Item>
    <Menu.Item disabled>Save As…</Menu.Item>
    <Menu.Separator />
    <Menu.Sub>
      <Menu.SubTrigger>Share</Menu.SubTrigger>
      <Menu.SubContent>
        <Menu.Item onSelect={...}>Email</Menu.Item>
        <Menu.Item onSelect={...}>Copy Link</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
  </Menu.Content>
</Menu>`}
                </Styled.Pre>
                <Styled.Small>
                    This composition keeps the consumer API declarative while the library handles focus,
                    keyboard, and positioning under the hood.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Accessibility checklist */}
            <Styled.Section>
                <Styled.H2>Accessibility Checklist</Styled.H2>
                <Styled.List>
                    <li>
                        Trigger has <Styled.InlineCode>aria-haspopup="menu"</Styled.InlineCode> and toggles{" "}
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode>.
                    </li>
                    <li>
                        Menu container uses <Styled.InlineCode>role="menu"</Styled.InlineCode> with an{" "}
                        <Styled.InlineCode>aria-label</Styled.InlineCode> or is referenced by the trigger's{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode>.
                    </li>
                    <li>
                        Items use <Styled.InlineCode>role="menuitem"</Styled.InlineCode> and follow{" "}
                        <b>roving tabindex</b> with arrow-key navigation.
                    </li>
                    <li>
                        <Styled.InlineCode>Escape</Styled.InlineCode> and outside click close and restore focus to the trigger.
                    </li>
                    <li>
                        Ensure visible focus indicators on trigger and items; preserve high contrast.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Positioning & portals */}
            <Styled.Section>
                <Styled.H2>Positioning Notes</Styled.H2>
                <Styled.List>
                    <li>
                        Position relative to the trigger (compute bounding box + offsets). For simplicity, anchor below/left and flip when near viewport edges.
                    </li>
                    <li>
                        If the menu risks being clipped by parent overflow, consider rendering at the document root. (In your projects you prefer avoiding portals; you can still compute positions within the same stacking context and manage overflow on parents.)
                    </li>
                    <li>
                        Keep width auto; prefer min-width matching the trigger for balanced layouts.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep one tab stop; use arrows for internal navigation.</li>
                    <li><b>Do</b> close on selection and <Styled.InlineCode>Escape</Styled.InlineCode>; return focus to trigger.</li>
                    <li><b>Do</b> use separators to group related actions; keep labels short and verbs first.</li>
                    <li><b>Don't</b> open menus on hover alone; users may pass through unintentionally.</li>
                    <li><b>Don't</b> trap focus permanently; menus are transient.</li>
                    <li><b>Don't</b> disable typeahead; it's a big usability win for long lists.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Anchor</b>: The element (trigger) the menu is positioned relative to.</li>
                    <li><b>Roving Tabindex</b>: Only the focused item is tabbable; arrows move focus.</li>
                    <li><b>Typeahead</b>: Pressing characters jumps focus to the next matching item.</li>
                    <li><b>Dismissal</b>: Rules that close the menu (select, Escape, outside click).</li>
                    <li><b>Submenu</b>: A nested menu that opens from a parent item.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A great Menu respects platform conventions—one tab stop, arrow navigation,
                typeahead, clear focus, and predictable dismissal—while staying flexible enough to host
                actions, separators, and submenus without surprises.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Menu;
