import React from "react";
import { Styled } from "./styled";

const Combobox = () => {
    return (
        <Styled.Page>
            <Styled.Title>Combobox</Styled.Title>

            <Styled.Lead>
                A <b>combobox</b> lets users pick from a list of options <i>and/or</i> type to filter or enter a custom value.
                Think of it as a blend of an <b>input</b> (typing) and a <b>dropdown</b> (choices) with rich keyboard support and accessibility semantics.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions (plain & precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Combobox:</b> A single-line <i>text input</i> with a <i>popup</i> list of suggestions the user can navigate and choose from.
                        It may allow freeform values (not in the list), or restrict to the list only.
                    </li>
                    <li>
                        <b>Listbox:</b> The popup container that holds options. In ARIA, it uses <Styled.InlineCode>role="listbox"</Styled.InlineCode> and contains options with <Styled.InlineCode>role="option"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Option:</b> A single selectable item inside the listbox. ARIA: <Styled.InlineCode>role="option"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Autocomplete:</b> Typing filters the list or suggests completions. ARIA uses <Styled.InlineCode>aria-autocomplete</Styled.InlineCode> to describe behavior.
                    </li>
                    <li>
                        <b>Active descendant:</b> The “visually highlighted” option while navigating with keys. Conveyed via <Styled.InlineCode>aria-activedescendant</Styled.InlineCode> on the input.
                    </li>
                    <li>
                        <b>Controlled vs Uncontrolled:</b> Controlled means React owns the value in state (<Styled.InlineCode>value</Styled.InlineCode> + <Styled.InlineCode>onChange</Styled.InlineCode>).
                        Uncontrolled means the DOM holds it (<Styled.InlineCode>defaultValue</Styled.InlineCode> + refs).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) UX goals */}
            <Styled.Section>
                <Styled.H2>UX Goals</Styled.H2>
                <Styled.List>
                    <li>Fast: type a few letters and hit <b>Enter</b>.</li>
                    <li>Flexible: arrow keys to navigate options, <b>Escape</b> to close, <b>Tab</b> to move on.</li>
                    <li>Clear: the current value is obvious; highlighted option is obvious.</li>
                    <li>Accessible: works with screen readers and keyboards; uses proper roles/attributes.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Basic shape (controlled) */}
            <Styled.Section>
                <Styled.H2>Basic Shape (Controlled)</Styled.H2>
                <Styled.Pre>
                    {`function useCombobox(items = []) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const filtered = React.useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    return q ? items.filter(it => it.toLowerCase().includes(q)) : items;
  }, [items, inputValue]);

  const show = () => setOpen(true);
  const hide = () => { setOpen(false); setHighlightedIndex(-1); };
  const selectIndex = (i) => {
    const val = filtered[i];
    if (val != null) setInputValue(val);
    hide();
  };

  return {
    open, inputValue, setInputValue, highlightedIndex, setHighlightedIndex,
    filtered, show, hide, selectIndex
  };
}`}
                </Styled.Pre>
                <Styled.Small>
                    This hook captures the core state: <i>open/close</i>, <i>input value</i>, <i>highlighted index</i>, and <i>filtered options</i>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Keyboard interactions */}
            <Styled.Section>
                <Styled.H2>Keyboard Interactions (must-have)</Styled.H2>
                <Styled.List>
                    <li><b>ArrowDown / ArrowUp:</b> move the highlight through the list; open if closed and there are options.</li>
                    <li><b>Enter:</b> select the highlighted option (if any) or accept typed text (if freeform allowed).</li>
                    <li><b>Escape:</b> close the list (and optionally clear highlight or text).</li>
                    <li><b>Tab:</b> commit the current text and move focus away (normal form flow).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function onKeyDown(e, api) {
  const { open, filtered, highlightedIndex, setHighlightedIndex, show, selectIndex } = api;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!open) return filtered.length && show();
    setHighlightedIndex(i => (i + 1) % filtered.length);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!open) return filtered.length && show();
    setHighlightedIndex(i => (i - 1 + filtered.length) % filtered.length);
  } else if (e.key === "Enter") {
    if (open && highlightedIndex >= 0) {
      e.preventDefault();
      selectIndex(highlightedIndex);
    }
  } else if (e.key === "Escape") {
    api.hide();
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Accessibility (ARIA) */}
            <Styled.Section>
                <Styled.H2>Accessibility (ARIA 1.2 pattern)</Styled.H2>
                <Styled.List>
                    <li>
                        The input can have <Styled.InlineCode>role="combobox"</Styled.InlineCode> with these attributes:
                        <Styled.List>
                            <li><Styled.InlineCode>aria-expanded</Styled.InlineCode>: whether the popup is open.</li>
                            <li><Styled.InlineCode>aria-controls</Styled.InlineCode>: the <i>id</i> of the listbox popup.</li>
                            <li><Styled.InlineCode>aria-haspopup="listbox"</Styled.InlineCode>: announces a listbox popup.</li>
                            <li><Styled.InlineCode>aria-activedescendant</Styled.InlineCode>: id of the highlighted option (for screen readers).</li>
                        </Styled.List>
                    </li>
                    <li>
                        The popup list uses <Styled.InlineCode>role="listbox"</Styled.InlineCode>; each item uses <Styled.InlineCode>role="option"</Styled.InlineCode> and sets <Styled.InlineCode>aria-selected</Styled.InlineCode> when highlighted/selected.
                    </li>
                    <li>
                        The input should have an accessible <b>label</b> (via <Styled.InlineCode>&lt;label htmlFor&gt;</Styled.InlineCode>, <Styled.InlineCode>aria-label</Styled.InlineCode>, or <Styled.InlineCode>aria-labelledby</Styled.InlineCode>).
                    </li>
                    <li>
                        Keep focus on the input; use <Styled.InlineCode>aria-activedescendant</Styled.InlineCode> instead of moving focus to list items.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal wiring (IDs simplified):
<input
  id="city"
  role="combobox"
  aria-expanded={open}
  aria-controls="city-listbox"
  aria-haspopup="listbox"
  aria-activedescendant={highlightedIndex >= 0 ? \`city-opt-\${highlightedIndex}\` : undefined}
/>

<ul id="city-listbox" role="listbox">
  {filtered.map((it, i) => (
    <li
      key={it}
      id={\`city-opt-\${i}\`}
      role="option"
      aria-selected={i === highlightedIndex}
    >
      {it}
    </li>
  ))}
</ul>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Variants & behavior */}
            <Styled.Section>
                <Styled.H2>Variants &amp; Behavior Choices</Styled.H2>
                <Styled.List>
                    <li><b>Freeform vs Restricted:</b> allow values outside the list (freeform) or only from options (restricted).</li>
                    <li><b>Autocomplete mode:</b> filter as you type, or show the full list until user navigates.</li>
                    <li><b>Debounced filtering:</b> for large lists, debounce inputs (150–300ms) before filtering or fetching.</li>
                    <li><b>Async suggestions:</b> fetch options as the user types; show loading state and empty results clearly.</li>
                    <li><b>Virtualized list:</b> for thousands of items, use windowing (e.g., react-window) inside the listbox.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Debounced input value (for async fetch or heavy filtering)
function useDebounced(value, delay = 200) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Selection model */}
            <Styled.Section>
                <Styled.H2>Selection Model</Styled.H2>
                <Styled.List>
                    <li><b>Single select:</b> pick one; commit to input value on select.</li>
                    <li><b>Multi-select:</b> show chips/tokens; <Styled.InlineCode>Backspace</Styled.InlineCode> removes the last token when input is empty.</li>
                    <li><b>Clear action:</b> a small “×” button to reset the value; always have an accessible label (e.g., <i>“Clear selection”</i>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Single-select commit
function onOptionClick(i, api) {
  api.selectIndex(i); // sets input to option and closes
}

// Multi-select pattern: keep an array of selected items and render as chips.
// Input stays editable to add more items.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep the input focused; manage highlight via <Styled.InlineCode>aria-activedescendant</Styled.InlineCode>.</li>
                    <li><b>Do</b> support keyboard from the start (Arrow keys, Enter, Escape, Tab).</li>
                    <li><b>Do</b> announce loading/empty states (visually and via accessible text).</li>
                    <li><b>Don't</b> trap focus inside the popup; users should be able to Tab away.</li>
                    <li><b>Don't</b> rely on mouse-only interactions; keyboard and screen reader users matter.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Moving focus into list items (breaks typing flow and SR expectations).</li>
                    <li>Forgetting unique ids for options (then <Styled.InlineCode>aria-activedescendant</Styled.InlineCode> can't point correctly).</li>
                    <li>Inconsistent controlled state (value vs filtered list vs highlight get out of sync).</li>
                    <li>Closing the popup too aggressively (e.g., on every blur—even when clicking an option).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Testing */}
            <Styled.Section>
                <Styled.H2>Testing (what to verify)</Styled.H2>
                <Styled.List>
                    <li>Typing updates value and filters options.</li>
                    <li>Arrow keys change the highlighted option; Enter selects it.</li>
                    <li>Escape closes the popup; Tab moves focus away without surprises.</li>
                    <li>ARIA attributes update correctly (<Styled.InlineCode>aria-expanded</Styled.InlineCode>, <Styled.InlineCode>aria-activedescendant</Styled.InlineCode>, <Styled.InlineCode>aria-selected</Styled.InlineCode>).</li>
                    <li>Clicking an option commits its value and closes the popup.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Example wiring (mini) */}
            <Styled.Section>
                <Styled.H2>Mini Wiring Example (bringing it together)</Styled.H2>
                <Styled.Pre>
                    {`function ComboboxExample({ items }) {
  const api = useCombobox(items);
  const { open, inputValue, setInputValue, filtered, highlightedIndex } = api;

  return (
    <div className="cb">
      <label htmlFor="cb-input">City</label>
      <input
        id="cb-input"
        role="combobox"
        aria-expanded={open}
        aria-controls="cb-listbox"
        aria-haspopup="listbox"
        aria-activedescendant={highlightedIndex >= 0 ? \`cb-opt-\${highlightedIndex}\` : undefined}
        value={inputValue}
        onChange={e => { setInputValue(e.target.value); api.show(); }}
        onKeyDown={e => onKeyDown(e, api)}
        onFocus={() => api.show()}
      />

      {open && filtered.length > 0 && (
        <ul id="cb-listbox" role="listbox">
          {filtered.map((it, i) => (
            <li
              key={it}
              id={\`cb-opt-\${i}\`}
              role="option"
              aria-selected={i === highlightedIndex}
              onMouseEnter={() => api.setHighlightedIndex(i)}
              onMouseDown={e => e.preventDefault()} // keep focus on input
              onClick={() => api.selectIndex(i)}
            >
              {it}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && (
        <div role="status" aria-live="polite">No results</div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is intentionally minimal. In a real component, add styling, positioning, virtualization for large lists,
                    and robust outside-click + scroll handling.
                </Styled.Small>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Popup:</b> The overlay that appears under the input (the listbox).</li>
                    <li><b>Highlight:</b> The visually focused option in the list; announced via <Styled.InlineCode>aria-activedescendant</Styled.InlineCode>.</li>
                    <li><b>Commit:</b> Confirming the current selection (Enter/click), syncing it into the input value.</li>
                    <li><b>Freeform:</b> User can type values not present in the options.</li>
                    <li><b>Restricted:</b> Only options can be chosen; arbitrary text is not allowed.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A good combobox prioritizes typing flow, keyboard navigation, and clear ARIA semantics.
                Keep focus on the input, highlight with aria-activedescendant, and treat the popup as a proper listbox.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Combobox;
