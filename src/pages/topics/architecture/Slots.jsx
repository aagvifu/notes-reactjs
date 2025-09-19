import React from "react";
import { Styled } from "./styled";

const Slots = () => {
    return (
        <Styled.Page>
            <Styled.Title>Slots (Composition with Named Areas)</Styled.Title>

            <Styled.Lead>
                A <b>slot</b> is a placeholder area inside a component that callers can
                fill with their own UI. Slots let you customize parts of a component
                without forking or tightly coupling to its internals.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Slot:</b> a named placeholder inside a component (e.g.,{" "}
                        <Styled.InlineCode>header</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>actions</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>footer</Styled.InlineCode>) that the consumer
                        can supply.
                    </li>
                    <li>
                        <b>Default slot:</b> the unnamed/primary area for general content,
                        usually passed as <Styled.InlineCode>children</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Named slot:</b> a specific area exposed via a prop like{" "}
                        <Styled.InlineCode>header</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>footer</Styled.InlineCode> that accepts a React
                        node or a render function.
                    </li>
                    <li>
                        <b>Render prop:</b> a function prop (e.g.,{" "}
                        <Styled.InlineCode>{`(ctx) => ReactNode`}</Styled.InlineCode>) that
                        the component calls to render a slot with access to internal state
                        or helpers.
                    </li>
                    <li>
                        <b>Headless component:</b> a component that provides logic/state but
                        no fixed visuals; visuals are provided via slots/render props.
                    </li>
                    <li>
                        <b>Compound components:</b> a related pattern where you provide
                        subcomponents like <Styled.InlineCode>{`<Card.Header />`}</Styled.InlineCode>; slots
                        often feel similar but are passed via props instead of child types.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why slots */}
            <Styled.Section>
                <Styled.H2>Why Use Slots?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Flexibility:</b> callers can inject any UI (buttons, menus,
                        badges) where the component expects it.
                    </li>
                    <li>
                        <b>Separation of concerns:</b> parent owns structure, behavior, and
                        accessibility; consumers own visuals for specific areas.
                    </li>
                    <li>
                        <b>Reusability:</b> one component adapts to many use cases via its
                        slots.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Example: basic named slots as nodes */}
            <Styled.Section>
                <Styled.H2>Example 1 — Named Slots as Nodes</Styled.H2>
                <Styled.Pre>
                    {`// Card exposes three slots: header, children (default), footer
function Card({ header, children, footer }) {
  return (
    <section className="card">
      {header && <header className="card__header">{header}</header>}
      <div className="card__body">{children}</div>
      {footer && <footer className="card__footer">{footer}</footer>}
    </section>
  );
}

// Usage
<Card
  header={<h3>User Profile</h3>}
  footer={<small>Last updated 2m ago</small>}
>
  <p>Content goes here...</p>
</Card>`}
                </Styled.Pre>
                <Styled.Small>
                    Here <Styled.InlineCode>children</Styled.InlineCode> is the default
                    slot; <Styled.InlineCode>header</Styled.InlineCode> and{" "}
                    <Styled.InlineCode>footer</Styled.InlineCode> are named slots.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Example: slots as render props (access internal state) */}
            <Styled.Section>
                <Styled.H2>Example 2 — Slots as Render Props</Styled.H2>
                <Styled.List>
                    <li>
                        Use a render prop when the slot needs <b>access to internal state</b>{" "}
                        or actions (e.g., open/close, selection).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Disclosure({ header, children, footer }) {
  const [open, setOpen] = React.useState(false);
  const ctx = {
    open,
    toggle: () => setOpen(o => !o),
    close: () => setOpen(false),
    openFn: () => setOpen(true),
  };

  const render = (slot) =>
    typeof slot === "function" ? slot(ctx) : slot ?? null;

  return (
    <section className="disclosure">
      <header>{render(header)}</header>
      {open && <div className="disclosure__panel">{render(children)}</div>}
      <footer>{render(footer)}</footer>
    </section>
  );
}

// Usage with render props
<Disclosure
  header={({ open, toggle }) => (
    <button onClick={toggle}>
      {open ? "Hide details" : "Show details"}
    </button>
  )}
  footer={({ open }) => (open ? <small>Open</small> : <small>Closed</small>)}
>
  {() => <p>Secret content...</p>}
</Disclosure>`}
                </Styled.Pre>
                <Styled.Small>
                    The consumer provides functions that receive{" "}
                    <Styled.InlineCode>ctx</Styled.InlineCode> to render dynamic UI.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: mixing default/compound styles */}
            <Styled.Section>
                <Styled.H2>Example 3 — Mixing Slots & Compound Components</Styled.H2>
                <Styled.List>
                    <li>
                        Some teams use <b>slots for quick injection</b> and{" "}
                        <b>compound components</b> for larger structures.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Panel({ title, actions, children }) {
  return (
    <section className="panel">
      <div className="panel__bar">
        <h4 className="panel__title">{title}</h4>
        <div className="panel__actions">{actions}</div>
      </div>
      <div className="panel__content">{children}</div>
    </section>
  );
}

// Usage
<Panel
  title="Settings"
  actions={<><button>Save</button><button>Reset</button></>}
>
  <form>{/* fields */}</form>
</Panel>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Accessibility considerations */}
            <Styled.Section>
                <Styled.H2>Accessibility (A11y) with Slots</Styled.H2>
                <Styled.List>
                    <li>
                        Parent should own the <b>semantic structure</b> (landmarks, headings,
                        roles, aria attributes).
                    </li>
                    <li>
                        If a slot is meant for an <b>interactive control</b> (e.g., actions),
                        document the expectation so consumers pass focusable elements.
                    </li>
                    <li>
                        For collapsible/expandable sections, manage{" "}
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode>, and keyboard
                        interactions at the parent level.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) API design tips */}
            <Styled.Section>
                <Styled.H2>API Design Tips</Styled.H2>
                <Styled.List>
                    <li>
                        Prefer <b>node slots</b> (simple React nodes) when state access is
                        not required.
                    </li>
                    <li>
                        Use <b>render props</b> for slots that need access to internal state
                        or helpers.
                    </li>
                    <li>
                        Keep slot names <b>descriptive</b> (e.g.,{" "}
                        <Styled.InlineCode>header</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>actions</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>footer</Styled.InlineCode>).
                    </li>
                    <li>
                        Support a <b>default slot</b> via{" "}
                        <Styled.InlineCode>children</Styled.InlineCode>.
                    </li>
                    <li>
                        If slots must be optional, document defaults and null handling.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> keep the parent responsible for layout, behavior, and
                        accessibility; let slots focus on visuals/content.
                    </li>
                    <li>
                        <b>Do</b> memoize heavy slot content or pass stable handlers when
                        rendering large lists.
                    </li>
                    <li>
                        <b>Don't</b> leak internal DOM structure; avoid requiring consumers
                        to target inner selectors.
                    </li>
                    <li>
                        <b>Don't</b> overuse render props when a simple node slot works just
                        fine (simpler is better).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Children:</b> the default slot content between opening/closing
                        tags of a component.
                    </li>
                    <li>
                        <b>Node slot:</b> slot prop that accepts any React node (element,
                        string, fragment).
                    </li>
                    <li>
                        <b>Render prop slot:</b> slot prop that is a function called with
                        context to produce UI.
                    </li>
                    <li>
                        <b>Context:</b> a React mechanism to share values with descendants;
                        sometimes used with headless/slot patterns.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Slots let components expose flexible, named areas that
                consumers can fill with custom UI. Start with node slots for simple
                customization; upgrade to render-prop slots when consumers need access
                to internal state or actions.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Slots;
