import React from "react";
import { Styled } from "./styled";

const Children = () => {
    return (
        <Styled.Page>
            <Styled.Title>Children</Styled.Title>
            <Styled.Lead>
                The <Styled.InlineCode>children</Styled.InlineCode> prop is whatever JSX appears between a
                component’s opening and closing tags. It enables composition: parents
                wrap structure; callers supply content.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology</Styled.H2>
                <Styled.List>
                    <li>
                        <b>children (prop):</b> implicit prop containing nested JSX/content inside{" "}
                        <Styled.InlineCode>{`<Component> ... </Component>`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Slot:</b> a place where content is inserted. In React, <em>default slot</em> is{" "}
                        <Styled.InlineCode>children</Styled.InlineCode>; <em>named slots</em> are explicit props like{" "}
                        <Styled.InlineCode>header</Styled.InlineCode>, <Styled.InlineCode>footer</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Render prop:</b> a prop whose value is a function that returns JSX, called by the child to render part of its UI.
                    </li>
                    <li>
                        <b>Function-as-children (FaC):</b> using <Styled.InlineCode>children</Styled.InlineCode> as a function (a specific render-prop style).
                    </li>
                    <li>
                        <b>Compound components:</b> a set of components that work together under one parent (e.g.,{" "}
                        <Styled.InlineCode>Tabs</Styled.InlineCode> with <Styled.InlineCode>Tabs.List</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Tabs.Panel</Styled.InlineCode>) often coordinated via context.
                    </li>
                    <li>
                        <b>Cloning children:</b> using <Styled.InlineCode>React.cloneElement</Styled.InlineCode> to inject props into direct children (use sparingly; prefer context).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basics */}
            <Styled.Section>
                <Styled.H2>Basics: receiving and rendering children</Styled.H2>
                <Styled.Pre>
                    {`function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

// Usage
<Card title="Hello">
  <p>Body text</p>
  <button>Action</button>
</Card>`}
                </Styled.Pre>
                <Styled.Small>
                    Children can be text, elements, arrays of elements, <Styled.InlineCode>null</Styled.InlineCode>, or{" "}
                    <Styled.InlineCode>false</Styled.InlineCode>. <em>Falsy</em> values (except 0) render nothing.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Named slots */}
            <Styled.Section>
                <Styled.H2>Named slots (multiple content areas)</Styled.H2>
                <p>Use explicit props for distinct regions (header/body/footer) instead of overloading one children block.</p>
                <Styled.Pre>
                    {`function Panel({ header, children, footer }) {
  return (
    <section className="panel">
      {header && <header>{header}</header>}
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

// Usage
<Panel
  header={<h4>Title</h4>}
  footer={<small>© Company</small>}
>
  <p>Body</p>
</Panel>`}
                </Styled.Pre>
                <Styled.Small>
                    Pick named slots when layout has fixed regions. Use default{" "}
                    <Styled.InlineCode>children</Styled.InlineCode> when only one free-form region is needed.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Render props & function-as-children */}
            <Styled.Section>
                <Styled.H2>Render props & function-as-children</Styled.H2>
                <p>
                    A render prop lets the parent supply a function to generate part of the UI, often using state exposed by the child.
                </p>
                <Styled.Pre>
                    {`// Render prop via named prop
function Toggle({ children, render }) {
  const [on, setOn] = React.useState(false);
  const api = { on, toggle: () => setOn(o => !o) };
  return <>{render ? render(api) : children?.(api)}</>;
}

// As 'render'
<Toggle render={({ on, toggle }) => (
  <button aria-pressed={on} onClick={toggle}>
    {on ? "On" : "Off"}
  </button>
)} />

// Function-as-children (FaC)
<Toggle>
  {({ on, toggle }) => (
    <label>
      <input type="checkbox" checked={on} onChange={toggle} />
      {on ? "Enabled" : "Disabled"}
    </label>
  )}
</Toggle>`}
                </Styled.Pre>
                <Styled.Small>
                    Render props give control to callers. Prefer them when the parent must decide <em>how</em> to render using data from the child.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Compound components (context-based) */}
            <Styled.Section>
                <Styled.H2>Compound components (coordinated via context)</Styled.H2>
                <p>Let callers compose pieces while the parent coordinates state via context.</p>
                <Styled.Pre>
                    {`const TabsContext = React.createContext(null);

function Tabs({ value, onChange, children }) {
  const ctx = React.useMemo(() => ({ value, onChange }), [value, onChange]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const ctx = React.useContext(TabsContext);
  const selected = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={selected}
      onClick={() => ctx.onChange?.(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div role="tabpanel">{children}</div>;
}

// Usage
<Tabs value={active} onChange={setActive}>
  <TabsList>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </TabsList>
  <TabPanel value="a">Panel A</TabPanel>
  <TabPanel value="b">Panel B</TabPanel>
</Tabs>`}
                </Styled.Pre>
                <Styled.Small>
                    This pattern avoids prop drilling and keeps a clean, declarative API.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Cloning children (use sparingly) */}
            <Styled.Section>
                <Styled.H2>Cloning children (advanced)</Styled.H2>
                <p>
                    <Styled.InlineCode>React.cloneElement</Styled.InlineCode> injects extra props into a direct child. Prefer context or explicit props first.
                </p>
                <Styled.Pre>
                    {`function Toolbar({ children, size = "md" }) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { "data-size": size });
  });
}

// Usage
<Toolbar size="lg">
  <button>Save</button>
  <button>Export</button>
</Toolbar>`}
                </Styled.Pre>
                <Styled.Small>
                    Cloning ties the parent to child element types; avoid deep magic. Never pass internal flags to the DOM accidentally.
                </Styled.Small>
            </Styled.Section>

            {/* 7) React.Children utilities */}
            <Styled.Section>
                <Styled.H2>React.Children utilities</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>Children.map(children, fn)</Styled.InlineCode> — safe map over possibly-single or array children.</li>
                    <li><Styled.InlineCode>Children.toArray(children)</Styled.InlineCode> — flattens and adds keys where needed.</li>
                    <li><Styled.InlineCode>Children.only(children)</Styled.InlineCode> — asserts exactly one child.</li>
                    <li><Styled.InlineCode>Children.count(children)</Styled.InlineCode> — counts children.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const items = React.Children.toArray(children);
// useful when expecting multiple and need stable keys`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Passing components vs elements */}
            <Styled.Section>
                <Styled.H2>Passing components vs elements</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Element</b> (e.g., <Styled.InlineCode>{`<Icon />`}</Styled.InlineCode>): already created. The receiver renders it directly.
                    </li>
                    <li>
                        <b>Component type</b> (e.g., <Styled.InlineCode>Icon</Styled.InlineCode>): a function; the receiver can choose props and when to render.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Box({ icon: Icon, children }) {   // component type
  return <div className="box">{Icon && <Icon size={16} />}{children}</div>;
}

// <Box icon={StarIcon}>Starred</Box>`}
                </Styled.Pre>
                <Styled.Small>
                    Choose element when the caller controls the instance; choose component type when the receiver should control props/placement.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Accessibility notes */}
            <Styled.Section>
                <Styled.H2>Accessibility notes</Styled.H2>
                <Styled.List>
                    <li>Do not wrap required list/table semantics with generic elements; use fragments where wrappers would be invalid.</li>
                    <li>When conditionally revealing children, manage focus and announce updates (<Styled.InlineCode>aria-live</Styled.InlineCode>) where appropriate.</li>
                    <li>Named slots like <Styled.InlineCode>header</Styled.InlineCode>/<Styled.InlineCode>footer</Styled.InlineCode> should render semantic{" "}
                        <Styled.InlineCode>&lt;header&gt;</Styled.InlineCode>/<Styled.InlineCode>&lt;footer&gt;</Styled.InlineCode> when meaningful.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Assuming <Styled.InlineCode>children</Styled.InlineCode> is an array—single child is not an array. Use <Styled.InlineCode>Children</Styled.InlineCode> helpers.</li>
                    <li>Overusing cloning to force behavior—prefer context or explicit props.</li>
                    <li>Leaking internal flags to DOM elements when cloning/spreading.</li>
                    <li>Using functions as children everywhere—keep APIs simple unless customization is required.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <Styled.InlineCode>children</Styled.InlineCode> for free-form content areas.</li>
                    <li><b>Do</b> add named slots when layout has distinct regions.</li>
                    <li><b>Do</b> use render props/FaC when the caller must control rendering using state from the child.</li>
                    <li><b>Do</b> use context for compound components to avoid prop drilling.</li>
                    <li><b>Don’t</b> rely on cloning by default; prefer clearer data flow.</li>
                    <li><b>Don’t</b> assume <Styled.InlineCode>children</Styled.InlineCode> is always an array; handle singletons safely.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <Styled.InlineCode>children</Styled.InlineCode> powers composition. Use it for flexible content,
                add named slots for structure, reach for render props when customization is needed,
                and prefer context over cloning for compound patterns.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Children;
