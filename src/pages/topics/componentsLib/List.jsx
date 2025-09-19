import React from "react";
import { Styled } from "./styled";

const List = () => {
    return (
        <Styled.Page>
            <Styled.Title>List (Reusable Component)</Styled.Title>

            <Styled.Lead>
                A <b>List</b> is a reusable UI primitive that displays a collection of items with a
                consistent layout, states (loading/empty/error), selection behavior, and keyboard navigation.
                It should be <i>data-agnostic</i> (works for any item shape) and <i>render-agnostic</i>
                (caller decides how an item looks).
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>List</b>: a component that renders a one-dimensional collection (vertical by default).
                    </li>
                    <li>
                        <b>Item</b>: a single entry in the collection (e.g., a user, a file).
                    </li>
                    <li>
                        <b>Render prop</b>: a function prop (e.g., <Styled.InlineCode>renderItem</Styled.InlineCode>) that returns JSX for each item, keeping the List generic.
                    </li>
                    <li>
                        <b>Key extractor</b>: a function that returns a stable unique key per item (e.g., an id). Prevents remounts and preserves focus/state.
                    </li>
                    <li>
                        <b>Selection</b>: which item(s) are chosen. Can be <i>single</i> (one item), <i>multiple</i> (many), or <i>none</i>.
                    </li>
                    <li>
                        <b>Controlled vs Uncontrolled</b>: in a <i>controlled</i> List, the parent owns the selection value; in an <i>uncontrolled</i> List, internal state owns it.
                    </li>
                    <li>
                        <b>Virtualization (windowing)</b>: render only visible rows to improve performance for large lists. (Use libraries like <i>react-window</i> when needed.)
                    </li>
                    <li>
                        <b>ARIA roles</b>: <Styled.InlineCode>role="list"</Styled.InlineCode> for static lists; <Styled.InlineCode>role="listbox"</Styled.InlineCode> with <Styled.InlineCode>role="option"</Styled.InlineCode> for selectable lists.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal Example */}
            <Styled.Section>
                <Styled.H2>Minimal Example (static list)</Styled.H2>
                <Styled.Pre>
                    {`function UsersStatic() {
  const users = [
    { id: "u1", name: "Aarav" },
    { id: "u2", name: "Isha" },
  ];
  return (
    <ul role="list" aria-label="Team members">
      {users.map(u => (
        <li key={u.id}>
          {u.name}
        </li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is not reusable yet, but it highlights the semantics: <Styled.InlineCode>ul[role="list"]</Styled.InlineCode> with <Styled.InlineCode>li</Styled.InlineCode> children.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Reusable List Primitive */}
            <Styled.Section>
                <Styled.H2>Reusable List Primitive (data- & render-agnostic)</Styled.H2>
                <Styled.Pre>
                    {`/**
 * Props:
 * - items: any[] — the data
 * - renderItem: (item, state) => JSX — how to render each item
 * - keyExtractor?: (item, index) => string | number — unique key
 * - empty?: JSX — UI when no items
 * - loading?: boolean — show loading state
 */
export function ListPrimitive({
  items,
  renderItem,
  keyExtractor = (it, i) => i,
  empty = <div className="muted">No items</div>,
  loading = false,
}) {
  if (loading) return <div role="status" aria-live="polite">Loading…</div>;
  if (!items || items.length === 0) return empty;

  return (
    <ul role="list" className="list-root">
      {items.map((it, i) => (
        <li key={keyExtractor(it, i)} className="list-row">
          {renderItem(it, { index: i })}
        </li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The parent controls <Styled.InlineCode>renderItem</Styled.InlineCode> and data. The List remains generic and simple to test.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Selectable List (single-select, controlled) */}
            <Styled.Section>
                <Styled.H2>Selectable List (Single-Select, Controlled)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>role="listbox"</Styled.InlineCode> and mark rows with <Styled.InlineCode>role="option"</Styled.InlineCode>.
                    </li>
                    <li>
                        Track the selected key in parent state and pass a handler to update it.
                    </li>
                    <li>
                        Support keyboard navigation: <Styled.InlineCode>ArrowUp</Styled.InlineCode>, <Styled.InlineCode>ArrowDown</Styled.InlineCode>, <Styled.InlineCode>Home</Styled.InlineCode>, <Styled.InlineCode>End</Styled.InlineCode>, <Styled.InlineCode>Enter</Styled.InlineCode>/<Styled.InlineCode>Space</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`export function Listbox({
  items,
  keyExtractor = it => it.id,
  selectedKey,
  onSelectedKeyChange,
  renderItem,
  label = "Items",
}) {
  const refs = React.useRef(new Map()); // store row refs for focus

  // Focus management helper
  const focusByIndex = (idx) => {
    const it = items[idx];
    if (!it) return;
    const el = refs.current.get(keyExtractor(it, idx));
    el?.focus();
  };

  const onKeyDown = (e) => {
    const idx = items.findIndex(it => keyExtractor(it) === selectedKey);
    if (e.key === "ArrowDown") {
      const next = Math.min(items.length - 1, (idx < 0 ? 0 : idx + 1));
      onSelectedKeyChange(keyExtractor(items[next]));
      e.preventDefault();
      focusByIndex(next);
    } else if (e.key === "ArrowUp") {
      const prev = Math.max(0, (idx < 0 ? 0 : idx - 1));
      onSelectedKeyChange(keyExtractor(items[prev]));
      e.preventDefault();
      focusByIndex(prev);
    } else if (e.key === "Home") {
      onSelectedKeyChange(keyExtractor(items[0]));
      e.preventDefault();
      focusByIndex(0);
    } else if (e.key === "End") {
      const last = items.length - 1;
      onSelectedKeyChange(keyExtractor(items[last]));
      e.preventDefault();
      focusByIndex(last);
    } else if (e.key === "Enter" || e.key === " ") {
      // "activate" current selection (up to the parent)
      e.preventDefault();
    }
  };

  return (
    <ul
      role="listbox"
      aria-label={label}
      tabIndex={0}
      className="listbox-root"
      onKeyDown={onKeyDown}
    >
      {items.map((it, i) => {
        const key = keyExtractor(it, i);
        const selected = key === selectedKey;
        return (
          <li
            key={key}
            role="option"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            ref={el => refs.current.set(key, el)}
            className={selected ? "row selected" : "row"}
            onClick={() => onSelectedKeyChange(key)}
          >
            {renderItem(it, { index: i, selected })}
          </li>
        );
      })}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is <i>controlled</i>: the parent owns <Styled.InlineCode>selectedKey</Styled.InlineCode>.
                    Use it for deterministic behavior (e.g., syncing selection with URL or other UI).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Multiple Select (checkbox pattern) */}
            <Styled.Section>
                <Styled.H2>Multiple Select (Checkbox Pattern)</Styled.H2>
                <Styled.Pre>
                    {`export function ListboxMulti({
  items,
  keyExtractor = it => it.id,
  selectedKeys,
  onSelectedKeysChange,
  renderItem,
  label = "Items",
}) {
  const set = new Set(selectedKeys);

  const toggle = (key) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    onSelectedKeysChange([...next]);
  };

  return (
    <ul role="listbox" aria-multiselectable aria-label={label} className="listbox-root">
      {items.map((it, i) => {
        const key = keyExtractor(it, i);
        const selected = set.has(key);
        return (
          <li
            key={key}
            role="option"
            aria-selected={selected}
            className={selected ? "row selected" : "row"}
            onClick={() => toggle(key)}
          >
            <input
              type="checkbox"
              tabIndex={-1}
              checked={selected}
              onChange={() => toggle(key)}
              aria-hidden
            />
            {renderItem(it, { index: i, selected })}
          </li>
        );
      })}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    For very large collections, consider <i>virtualization</i> to keep the DOM light and scrolling smooth.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Empty, Loading, Error States */}
            <Styled.Section>
                <Styled.H2>Empty, Loading &amp; Error States</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Loading</b>: Show a polite live region (<Styled.InlineCode>role="status"</Styled.InlineCode>) so screen readers are informed.
                    </li>
                    <li>
                        <b>Empty</b>: Offer a short explanation and a primary action (“Add item”, “Invite someone”).
                    </li>
                    <li>
                        <b>Error</b>: Explain the problem and provide a retry action.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example usage
function ProjectsList({ projects, busy, error }) {
  if (busy) return <div role="status" aria-live="polite">Loading projects…</div>;
  if (error) return <div role="alert">Failed to load. <button onClick={/* retry */}>Retry</button></div>;
  return (
    <ListPrimitive
      items={projects}
      keyExtractor={(p) => p.id}
      empty={<div className="muted">No projects yet. <button>Create project</button></div>}
      renderItem={(p) => <div className="row">{p.name}</div>}
    />
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep the List generic; push visuals and data formatting to <Styled.InlineCode>renderItem</Styled.InlineCode>.</li>
                    <li><b>Do</b> provide stable keys; avoid using the array index if items reorder.</li>
                    <li><b>Do</b> add keyboard support for selectable lists; test with a keyboard only.</li>
                    <li><b>Don't</b> mix selection and navigation on the same click without clear intent (e.g., use a dedicated “Open” affordance).</li>
                    <li><b>Don't</b> render thousands of rows at once—use virtualization for big data.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Accessibility Essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        Non-interactive lists: <Styled.InlineCode>role="list"</Styled.InlineCode> with children as plain <Styled.InlineCode>li</Styled.InlineCode>.
                    </li>
                    <li>
                        Selectable lists: <Styled.InlineCode>role="listbox"</Styled.InlineCode>, items as <Styled.InlineCode>role="option"</Styled.InlineCode>, manage <Styled.InlineCode>aria-selected</Styled.InlineCode>.
                    </li>
                    <li>
                        Make the container focusable (<Styled.InlineCode>tabIndex=0</Styled.InlineCode>) to receive keyboard events; manage roving focus to the selected row.
                    </li>
                    <li>
                        Announce counts and selection when helpful (e.g., “5 results”).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Render prop</b>: function prop that returns UI; enables composition without coupling visuals to the List.</li>
                    <li><b>Key extractor</b>: function that returns a stable, unique key for each item (e.g., item.id).</li>
                    <li><b>Roving focus</b>: keyboard focus “moves” among items, usually aligning to selection.</li>
                    <li><b>Virtualization</b>: technique to render only visible rows; boosts performance for large data sets.</li>
                    <li><b>Listbox</b>: ARIA pattern for keyboard-selectable lists (<Styled.InlineCode>role="listbox"</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Treat <b>List</b> as a small, stable primitive. Keep data &amp; visuals separate via a
                render prop, support keyboard selection when needed, and scale performance with virtualization.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default List;
