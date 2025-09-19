import React from "react";
import { Styled } from "./styled";

const Tabs = () => {
    return (
        <Styled.Page>
            <Styled.Title>Tabs (Reusable Component)</Styled.Title>

            <Styled.Lead>
                <b>Tabs</b> display multiple <i>panels</i> of content in the same space and let the user
                switch between them without navigating away. They are ideal when the content is related
                and should be compared or switched quickly.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Tab</b>: the clickable control (the “button”) that selects a panel. In ARIA terms it
                        uses role <Styled.InlineCode>tab</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Tablist</b>: the container that groups the tabs. In ARIA terms{" "}
                        <Styled.InlineCode>role="tablist"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Tab panel</b>: the content region shown for the active tab. In ARIA terms{" "}
                        <Styled.InlineCode>role="tabpanel"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Activation</b>: how a tab becomes active. <i>Manual</i> activation changes focus but
                        not the panel until Enter/Space or click; <i>Automatic</i> activation changes panel as
                        focus moves.
                    </li>
                    <li>
                        <b>Roving tabindex</b>: an a11y technique where only the focused tab has{" "}
                        <Styled.InlineCode>tabIndex=0</Styled.InlineCode> and other tabs have{" "}
                        <Styled.InlineCode>-1</Styled.InlineCode>, so arrow keys move focus within the set.
                    </li>
                    <li>
                        <b>Controlled vs Uncontrolled</b>: in a <i>controlled</i> Tabs, the parent holds the
                        active index/state. In <i>uncontrolled</i>, Tabs manages its own internal state.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use / not use */}
            <Styled.Section>
                <Styled.H2>When to Use / When Not to Use</Styled.H2>
                <Styled.List>
                    <li><b>Use</b> tabs for sibling content at the same hierarchy level (e.g., “Profile / Billing / Security”).</li>
                    <li><b>Use</b> when users need quick switch/compare without page navigation.</li>
                    <li><b>Don't use</b> tabs if each section is long or requires separate URLs → prefer routes.</li>
                    <li><b>Don't use</b> tabs for nested navigation inside accordions or modals unless necessary (can harm discoverability).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>role="tablist"</Styled.InlineCode> on the container of the tabs.</li>
                    <li>
                        Each tab: <Styled.InlineCode>role="tab"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>aria-selected</Styled.InlineCode> (true/false),{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode> pointing to its panel id, and roving{" "}
                        <Styled.InlineCode>tabIndex</Styled.InlineCode> (0 for focused tab, -1 for others).
                    </li>
                    <li>
                        Each panel: <Styled.InlineCode>role="tabpanel"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>id</Styled.InlineCode> referenced by a tab's{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode>, and{" "}
                        <Styled.InlineCode>aria-labelledby</Styled.InlineCode> referencing the active tab id.
                    </li>
                    <li>
                        Keyboard: Left/Right (or Up/Down for vertical) move focus between tabs; Home/End jump to
                        first/last; Enter/Space activates in manual mode.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Data model */}
            <Styled.Section>
                <Styled.H2>Data Model</Styled.H2>
                <Styled.Pre>
                    {`// Suggested shape for tabs data
const items = [
  { id: "tab-overview",  label: "Overview",  panelId: "panel-overview"  },
  { id: "tab-details",   label: "Details",   panelId: "panel-details"   },
  { id: "tab-settings",  label: "Settings",  panelId: "panel-settings"  },
];`}
                </Styled.Pre>
                <Styled.Small>
                    Keep stable ids for <Styled.InlineCode>aria-controls</Styled.InlineCode> links and easier
                    testing.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Uncontrolled example */}
            <Styled.Section>
                <Styled.H2>Example: Uncontrolled Tabs (automatic activation)</Styled.H2>
                <Styled.Pre>
                    {`function UncontrolledTabs({ items, defaultIndex = 0 }) {
  const [active, setActive] = React.useState(defaultIndex);
  const tabRefs = React.useRef([]);

  function onKeyDown(e) {
    const count = items.length;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % count;
    else if (e.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);                    // automatic activation: change panel immediately
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Sample tabs" onKeyDown={onKeyDown}>
        {items.map((it, i) => {
          const selected = i === active;
          return (
            <button
              key={it.id}
              id={it.id}
              role="tab"
              aria-selected={selected}
              aria-controls={it.panelId}
              tabIndex={selected ? 0 : -1}         // roving tabindex
              ref={el => (tabRefs.current[i] = el)}
              onClick={() => setActive(i)}
            >
              {it.label}
            </button>
          );
        })}
      </div>

      {items.map((it, i) => {
        const selected = i === active;
        return (
          <div
            key={it.panelId}
            role="tabpanel"
            id={it.panelId}
            aria-labelledby={it.id}
            hidden={!selected}          // hide inactive panels from layout
          >
            {/* panel content for: it.label */}
          </div>
        );
      })}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    “Automatic” here means moving focus with arrows also updates the active panel instantly.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Controlled example (manual activation) */}
            <Styled.Section>
                <Styled.H2>Example: Controlled Tabs (manual activation)</Styled.H2>
                <Styled.Pre>
                    {`function ControlledTabs({ items, index, onIndexChange }) {
  const [focusIndex, setFocusIndex] = React.useState(index); // focus can move without activation
  const tabRefs = React.useRef([]);

  function onKeyDown(e) {
    const count = items.length;
    let next = focusIndex;
    if (e.key === "ArrowRight") next = (focusIndex + 1) % count;
    else if (e.key === "ArrowLeft") next = (focusIndex - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else if (e.key === "Enter" || e.key === " ") {
      onIndexChange(focusIndex);       // manual activation on Enter/Space
      return;
    } else return;
    e.preventDefault();
    setFocusIndex(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Manual tabs" onKeyDown={onKeyDown}>
        {items.map((it, i) => {
          const selected = i === index;
          return (
            <button
              key={it.id}
              id={it.id}
              role="tab"
              aria-selected={selected}
              aria-controls={it.panelId}
              tabIndex={i === focusIndex ? 0 : -1}
              ref={el => (tabRefs.current[i] = el)}
              onClick={() => onIndexChange(i)}
            >
              {it.label}
            </button>
          );
        })}
      </div>

      {items.map((it, i) => {
        const selected = i === index;
        return (
          <div
            key={it.panelId}
            role="tabpanel"
            id={it.panelId}
            aria-labelledby={it.id}
            hidden={!selected}
          >
            {/* panel content */}
          </div>
        );
      })}
    </div>
  );
}

// Usage:
// const [idx, setIdx] = React.useState(0);
// <ControlledTabs items={items} index={idx} onIndexChange={setIdx} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Sync with URL (hash) */}
            <Styled.Section>
                <Styled.H2>Sync with URL (hash-based)</Styled.H2>
                <Styled.Pre>
                    {`function useHashTab(defaultKey) {
  const [key, setKey] = React.useState(() => window.location.hash.slice(1) || defaultKey);

  React.useEffect(() => {
    function onHash() {
      setKey(window.location.hash.slice(1) || defaultKey);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [defaultKey]);

  const set = React.useCallback((k) => {
    if (!k) return;
    history.replaceState(null, "", "#" + k); // no scroll jump
    setKey(k);
  }, []);

  return [key, set];
}

// Example: map tab.key -> hash value
// const [activeKey, setActiveKey] = useHashTab("overview");`}
                </Styled.Pre>
                <Styled.Small>
                    Use routing for deep links if tabs represent major app sections; hashes are fine for
                    minor intra-page switches.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Rendering strategy */}
            <Styled.Section>
                <Styled.H2>Rendering Strategy</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Keep mounted</b>: keep all panels in the DOM (just hide inactive). Pros: preserves
                        internal state (inputs). Cons: larger DOM.
                    </li>
                    <li>
                        <b>Unmount on hide</b>: render only the active panel. Pros: smaller DOM. Cons: panel
                        state resets on switch.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Styling pointers */}
            <Styled.Section>
                <Styled.H2>Styling Pointers</Styled.H2>
                <Styled.List>
                    <li>Use a clear selected style (underline/indicator) and focus ring for keyboard users.</li>
                    <li>Make the tablist scrollable horizontally for many items; show an overflow hint.</li>
                    <li>Consider an animated indicator that moves between tabs for delightful feedback.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> give each tab a short, clear label; avoid wrapping to 2+ lines.</li>
                    <li><b>Do</b> support arrow keys, Home/End, and Enter/Space.</li>
                    <li><b>Do</b> preserve panel state when users type into forms (keep mounted when needed).</li>
                    <li><b>Don't</b> mix tabs with long scroll-heavy content; consider routes/sections instead.</li>
                    <li><b>Don't</b> trap keyboard focus; let users tab in/out of the tablist and panel.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>ARIA</b>: Accessible Rich Internet Applications—attributes/roles to convey semantics to AT.</li>
                    <li><b>AT</b>: Assistive Technologies (screen readers, etc.).</li>
                    <li><b>Manual vs Automatic activation</b>: whether focusing a tab also switches its panel.</li>
                    <li><b>Roving tabindex</b>: a technique to keep one focusable item in a set at a time.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Tabs are a compact way to switch related content. Build with proper roles, keyboard
                support, and either automatic or manual activation depending on your UX. Choose rendering and
                URL strategy based on the complexity and importance of the content.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Tabs;
