import React from "react";
import { Styled } from "./styled";

/**
 * Compound Components — Architecture & Patterns
 *
 * Definition (plain English):
 * A "compound component" is a group of components that work together to form a single UI widget.
 * They share state/behavior via a parent component (or a shared context) instead of prop-drilling.
 *
 * Why it’s useful:
 * - Flexible API: consumers compose pieces in JSX (Tabs.Tab, Tabs.List, Tabs.Panel) instead of passing many props.
 * - Separation of concerns: parent owns state; children declare structure.
 * - Scales nicely: you can add/remove subcomponents without changing a giant props object.
 */

const CompoundComponents = () => {
    return (
        <Styled.Page>
            <Styled.Title>Compound Components</Styled.Title>

            <Styled.Lead>
                <b>Compound Components</b> are multiple components that collaborate as one unit (e.g., Tabs).
                Instead of a single “god” component with tons of props, users compose parts like{" "}
                <Styled.InlineCode>{`<Tabs>`}</Styled.InlineCode>,{" "}
                <Styled.InlineCode>{`<Tabs.List>`}</Styled.InlineCode>,{" "}
                <Styled.InlineCode>{`<Tabs.Tab>`}</Styled.InlineCode>, and{" "}
                <Styled.InlineCode>{`<Tabs.Panel>`}</Styled.InlineCode>. Shared state/behavior flows from a parent or React Context.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms & Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Compound Component:</b> A set of components designed to be used together under a parent that coordinates their state.
                    </li>
                    <li>
                        <b>Parent Coordinator:</b> The top-level component that owns state (e.g., active tab) and exposes child parts.
                    </li>
                    <li>
                        <b>Context:</b> React’s mechanism to share data (state/actions) to nested children without prop drilling.
                    </li>
                    <li>
                        <b>Uncontrolled vs Controlled:</b> Uncontrolled = parent manages its own state; Controlled = parent accepts state via props and notifies via callbacks.
                    </li>
                    <li>
                        <b>Slots:</b> Named places where consumers insert content (e.g., <Styled.InlineCode>&lt;Tabs.List&gt;</Styled.InlineCode> acts like a “slot” for tab triggers).
                    </li>
                    <li>
                        <b>Accessibility (A11y):</b> Using roles, states, and keyboard support so assistive technologies can operate the widget.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal example — Tabs (Uncontrolled, Context-based) */}
            <Styled.Section>
                <Styled.H2>Example: Tabs (Uncontrolled, Context)</Styled.H2>
                <Styled.Small>
                    The parent <Styled.InlineCode>Tabs</Styled.InlineCode> holds active index. Subcomponents read/write via context. Consumers compose parts declaratively.
                </Styled.Small>
                <Styled.Pre>
                    {`// tabs.js (example for learning)
// NOTE: This is an educational sketch for the pattern, not a final prod component.
const TabsContext = React.createContext(null);

export function Tabs({ defaultIndex = 0, children }) {
  const [index, setIndex] = React.useState(defaultIndex);
  const value = React.useMemo(() => ({ index, setIndex }), [index]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

function useTabsCtx() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used within <Tabs>");
  return ctx;
}

export function List({ children, ...rest }) {
  return (
    <div role="tablist" {...rest}>
      {children}
    </div>
  );
}

export function Tab({ tabIndex, children, ...rest }) {
  const { index, setIndex } = useTabsCtx();
  const selected = index === tabIndex;
  return (
    <button
      role="tab"
      aria-selected={selected}
      aria-controls={\`panel-\${tabIndex}\`}
      id={\`tab-\${tabIndex}\`}
      onClick={() => setIndex(tabIndex)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Panels({ children, ...rest }) {
  return <div {...rest}>{children}</div>;
}

export function Panel({ tabIndex, children, ...rest }) {
  const { index } = useTabsCtx();
  const hidden = index !== tabIndex;
  return (
    <div
      role="tabpanel"
      id={\`panel-\${tabIndex}\`}
      aria-labelledby={\`tab-\${tabIndex}\`}
      hidden={hidden}
      {...rest}
    >
      {children}
    </div>
  );
}

// Usage
// <Tabs defaultIndex={0}>
//   <Tabs.List>
//     <Tabs.Tab tabIndex={0}>General</Tabs.Tab>
//     <Tabs.Tab tabIndex={1}>Billing</Tabs.Tab>
//   </Tabs.List>
//   <Tabs.Panels>
//     <Tabs.Panel tabIndex={0}>General content</Tabs.Panel>
//     <Tabs.Panel tabIndex={1}>Billing content</Tabs.Panel>
//   </Tabs.Panels>
// </Tabs>

// Attach as statics for ergonomic API:
Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panels = Panels;
Tabs.Panel = Panel;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Controlled version (prop + onChange) */}
            <Styled.Section>
                <Styled.H2>Controlled Variant</Styled.H2>
                <Styled.Small>
                    In a controlled compound component, the <Styled.InlineCode>value</Styled.InlineCode> (active tab) comes from props; the parent notifies changes via <Styled.InlineCode>onChange</Styled.InlineCode>.
                </Styled.Small>
                <Styled.Pre>
                    {`export function TabsControlled({ value, onChange, children }) {
  const ctx = React.useMemo(() => ({ index: value, setIndex: onChange }), [value, onChange]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

// Usage
// const [tab, setTab] = React.useState(0);
// <TabsControlled value={tab} onChange={setTab}> ... </TabsControlled>
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Alternatives to context — React.Children / cloneElement */}
            <Styled.Section>
                <Styled.H2>Alternatives: <code>React.Children</code> &amp; <code>cloneElement</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>React.Children.map</b>: Iterate children to inject props (e.g., assign <Styled.InlineCode>tabIndex</Styled.InlineCode> automatically).
                    </li>
                    <li>
                        <b>React.cloneElement</b>: Clone a child and add props. Useful but can become brittle if you overuse it.
                    </li>
                    <li>
                        <b>Recommendation:</b> Prefer context for state sharing; use cloning sparingly for minor prop injection.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function TabsLegacy({ children }) {
  const [index, setIndex] = React.useState(0);
  return React.Children.map(children, (child) => {
    if (child.type.displayName === "Tab") {
      const tabIndex = child.props.tabIndex;
      return React.cloneElement(child, {
        selected: index === tabIndex,
        onClick: () => setIndex(tabIndex),
      });
    }
    return child;
  });
}
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Accessibility checklist */}
            <Styled.Section>
                <Styled.H2>Accessibility (A11y) Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Roles:</b> <Styled.InlineCode>role="tablist"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>role="tab"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>role="tabpanel"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Relationships:</b> Tabs have <Styled.InlineCode>aria-controls</Styled.InlineCode> pointing to panel IDs; panels have <Styled.InlineCode>aria-labelledby</Styled.InlineCode> back to tabs.
                    </li>
                    <li>
                        <b>Keyboard:</b> Left/Right to switch tabs, Home/End to jump, Space/Enter to activate.
                    </li>
                    <li>
                        <b>Focus management:</b> keep focus on the active tab; don’t trap it in panels.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Do / Don’t */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> expose a small, composable API (List, Tab, Panels, Panel).</li>
                    <li><b>Do</b> prefer context to avoid prop drilling.</li>
                    <li><b>Do</b> support both uncontrolled and controlled usage when feasible.</li>
                    <li><b>Don’t</b> bury rendering logic inside “logic” components—keep subcomponents UI-focused, state in the coordinator.</li>
                    <li><b>Don’t</b> overuse <Styled.InlineCode>cloneElement</Styled.InlineCode>; it couples implementation to element types.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Related patterns & when to use */}
            <Styled.Section>
                <Styled.H2>Related Patterns & When to Use</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Render Props:</b> Great when you need to pass functions to render UI, but composition with compounds is often cleaner for widgets.
                    </li>
                    <li>
                        <b>Provider Pattern:</b> Compound components typically rely on a Context Provider internally.
                    </li>
                    <li>
                        <b>Headless Components:</b> Logic-only components that expose state via render props or context—pair well with compounds.
                    </li>
                    <li>
                        <b>State Reducer:</b> For advanced control, let consumers intercept state changes (see Downshift pattern).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Coordinator:</b> The parent that owns/coordinates shared state.</li>
                    <li><b>Slot:</b> A named place where consumers insert content (a subcomponent acts as a slot).</li>
                    <li><b>Controlled:</b> State comes from props; parent notifies via callbacks.</li>
                    <li><b>Uncontrolled:</b> Component manages its own internal state.</li>
                    <li><b>Context:</b> React API for passing data deeply without prop drilling.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Compound Components let users compose a widget from parts while the parent (or context)
                coordinates state. Start with an uncontrolled version, add a controlled variant when needed,
                keep APIs small, and ship solid accessibility.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CompoundComponents;
