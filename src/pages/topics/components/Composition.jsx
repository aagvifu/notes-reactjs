import React from "react";
import { Styled } from "./styled";

const Composition = () => {
    return (
        <Styled.Page>
            <Styled.Title>Composition</Styled.Title>
            <Styled.Lead>
                Composition builds complex UIs by combining small components. Instead of
                inheritance, React favors composing behavior and layout through props,
                <Styled.InlineCode>children</Styled.InlineCode>, slots, and context.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Composition:</b> assembling components together so each focuses on one job and the combination delivers the feature.
                    </li>
                    <li>
                        <b>Containment:</b> a component that renders arbitrary content via <Styled.InlineCode>children</Styled.InlineCode> (e.g., a card or layout shell).
                    </li>
                    <li>
                        <b>Specialization:</b> a component that renders a more specific variant of another by passing props/children (no inheritance).
                    </li>
                    <li>
                        <b>Slot:</b> a placeholder region in a component. Default slot is <Styled.InlineCode>children</Styled.InlineCode>; named slots are explicit props like <Styled.InlineCode>header</Styled.InlineCode>, <Styled.InlineCode>footer</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Render prop:</b> a prop whose value is a function returning JSX; the child calls it to let the parent decide presentation.
                    </li>
                    <li>
                        <b>Compound components:</b> coordinated components under one parent (e.g., <Styled.InlineCode>Tabs</Styled.InlineCode>, <Styled.InlineCode>Tabs.List</Styled.InlineCode>, <Styled.InlineCode>Tabs.Panel</Styled.InlineCode>), usually wired via context.
                    </li>
                    <li>
                        <b>Headless component:</b> a component that provides behavior/state but no styling; callers compose the UI.
                    </li>
                    <li>
                        <b>Context provider:</b> supplies values to descendants to avoid prop drilling; consumers subscribe via <Styled.InlineCode>useContext</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Containment via children */}
            <Styled.Section>
                <Styled.H2>Containment with <code>children</code></Styled.H2>
                <p>Use a wrapper to provide structure; callers provide the inner content.</p>
                <Styled.Pre>
                    {`function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="card__body">{children}</div>
    </section>
  );
}

// Usage
<Card title="Profile">
  <Avatar />
  <p>Intro text...</p>
</Card>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Named slots */}
            <Styled.Section>
                <Styled.H2>Named slots (structured regions)</Styled.H2>
                <p>Expose distinct areas when layout has fixed regions.</p>
                <Styled.Pre>
                    {`function Panel({ header, children, footer }) {
  return (
    <section className="panel">
      {header && <header className="panel__hd">{header}</header>}
      <div className="panel__bd">{children}</div>
      {footer && <footer className="panel__ft">{footer}</footer>}
    </section>
  );
}

// Usage
<Panel
  header={<h4>Settings</h4>}
  footer={<button>Save</button>}
>
  <Form />
</Panel>`}
                </Styled.Pre>
                <Styled.Small>Prefer slots when the structure is known; prefer a single <code>children</code> for free-form content.</Styled.Small>
            </Styled.Section>

            {/* 4) Specialization (no inheritance) */}
            <Styled.Section>
                <Styled.H2>Specialization (without inheritance)</Styled.H2>
                <p>Create specialized variants by composing and pre-filling props.</p>
                <Styled.Pre>
                    {`function Button({ variant = "primary", ...rest }) {
  return <button className={\`btn btn--\${variant}\`} {...rest} />;
}

function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}
function DangerButton(props) {
  return <Button variant="danger" {...props} />;
}

// Usage
<PrimaryButton onClick={...}>Save</PrimaryButton>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Render props & FaC */}
            <Styled.Section>
                <Styled.H2>Render props & function-as-children</Styled.H2>
                <p>Expose state/behavior and delegate rendering to callers.</p>
                <Styled.Pre>
                    {`function Toggle({ children }) {
  const [on, setOn] = React.useState(false);
  const api = { on, toggle: () => setOn(o => !o) };
  return <>{typeof children === "function" ? children(api) : children}</>;
}

// Usage (FaC)
<Toggle>
  {({ on, toggle }) => (
    <button aria-pressed={on} onClick={toggle}>
      {on ? "On" : "Off"}
    </button>
  )}
</Toggle>`}
                </Styled.Pre>
                <Styled.Small>Use render props when callers must fully control markup; otherwise, favor simpler slot props.</Styled.Small>
            </Styled.Section>

            {/* 6) Compound components via context */}
            <Styled.Section>
                <Styled.H2>Compound components (context-powered)</Styled.H2>
                <p>Coordinate pieces with shared state via context for a clean, declarative API.</p>
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
    <button role="tab" aria-selected={selected} onClick={() => ctx.onChange?.(value)}>
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
                <Styled.Small>This avoids prop drilling and keeps markup expressive.</Styled.Small>
            </Styled.Section>

            {/* 7) Headless components */}
            <Styled.Section>
                <Styled.H2>Headless components (behavior only)</Styled.H2>
                <p>Provide logic/state with zero styling; callers render UI.</p>
                <Styled.Pre>
                    {`function ListFilter({ items, children }) {
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(
    () => items.filter(x => x.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  return children({ q, setQ, filtered });
}

// Usage
<ListFilter items={["Ada", "Linus", "Grace"]}>
  {({ q, setQ, filtered }) => (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" />
      <ul>{filtered.map(x => <li key={x}>{x}</li>)}</ul>
    </>
  )}
</ListFilter>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Provider composition (cross-cutting concerns) */}
            <Styled.Section>
                <Styled.H2>Provider composition (cross-cutting concerns)</Styled.H2>
                <p>Compose app-wide concerns (theme, router, auth) with provider trees.</p>
                <Styled.Pre>
                    {`function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router}>{children}</RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// index.jsx
<AppProviders>
  <App />
</AppProviders>`}
                </Styled.Pre>
                <Styled.Small>Order matters: inner providers can read values from outer ones.</Styled.Small>
            </Styled.Section>

            {/* 9) Polymorphic 'as' + ref forwarding */}
            <Styled.Section>
                <Styled.H2>Polymorphic components & refs</Styled.H2>
                <p>Let callers change the underlying tag while preserving behavior and refs.</p>
                <Styled.Pre>
                    {`const Box = React.forwardRef(function Box({ as: Comp = "div", className, ...rest }, ref) {
  return <Comp ref={ref} className={["box", className].filter(Boolean).join(" ")} {...rest} />;
});`}
                </Styled.Pre>
                <Styled.Small>Ensure semantics and a11y when switching roles (e.g., <code>a</code> vs <code>button</code>).</Styled.Small>
            </Styled.Section>

            {/* 10) Anti-patterns & pitfalls */}
            <Styled.Section>
                <Styled.H2>Anti-patterns & pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Inheritance:</b> React favors composition. Avoid class hierarchies; prefer wrapping and prop forwarding.
                    </li>
                    <li>
                        <b>Deep prop drilling:</b> passing props through many layers. Use context/compound patterns.
                    </li>
                    <li>
                        <b>Leaking internal flags to DOM:</b> filter non-DOM props (<Styled.InlineCode>variant</Styled.InlineCode>, <Styled.InlineCode>size</Styled.InlineCode>) before spreading.
                    </li>
                    <li>
                        <b>Over-cloning children:</b> <Styled.InlineCode>cloneElement</Styled.InlineCode> couples parent/child tightly; prefer context or explicit props.
                    </li>
                    <li>
                        <b>Rigid “God components”:</b> huge components that do everything. Extract smaller pieces; accept slots/children.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> compose via children/slots for flexible layouts.</li>
                    <li><b>Do</b> use context for shared state and compound components.</li>
                    <li><b>Do</b> favor headless components when callers must control markup.</li>
                    <li><b>Do</b> keep pieces small and focused; pass behavior via callbacks.</li>
                    <li><b>Don’t</b> inherit from other components; specialize by composing.</li>
                    <li><b>Don’t</b> drill props deeply; lift or use context instead.</li>
                    <li><b>Don’t</b> hardcode tags where flexibility is needed—offer an <Styled.InlineCode>as</Styled.InlineCode> prop carefully.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: composition is the core design tool in React. Prefer children/slots for structure, render props or
                headless components for customization, and context for shared state. Avoid inheritance, deep prop drilling,
                and tight coupling via cloning.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Composition;
