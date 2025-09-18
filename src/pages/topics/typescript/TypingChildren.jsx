import { Styled } from "./styled";

const TypingChildren = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Children (TypeScript)</Styled.Title>

            <Styled.Lead>
                In React, <b>children</b> are the nested contents between a component's opening and closing
                tags. In TypeScript, we explicitly type them for clarity, safety, and good DX. Most of the
                time you'll use <Styled.InlineCode>ReactNode</Styled.InlineCode>, but there are important
                cases for <Styled.InlineCode>ReactElement</Styled.InlineCode>, render-prop functions, and
                even restricting children to specific component types.
            </Styled.Lead>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (precise definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Child / Children:</b> Anything nested inside a component: text, numbers, elements, fragments, portals, <i>false</i>, <i>null</i>, etc.</li>
                    <li><b>ReactNode:</b> A union type that represents anything React can render:
                        elements, strings, numbers, fragments, portals, booleans, <i>null/undefined</i>.</li>
                    <li><b>ReactElement:</b> A concrete element object created by JSX (e.g. <Styled.InlineCode>&lt;div /&gt;</Styled.InlineCode>). Usually you'll use
                        <Styled.InlineCode>ReactElement&lt;Props, Type&gt;</Styled.InlineCode> or the simpler <Styled.InlineCode>JSX.Element</Styled.InlineCode>.</li>
                    <li><b>JSX.Element:</b> Alias for a React element produced by JSX. Think "a single element instance."</li>
                    <li><b>PropsWithChildren&lt;P&gt;:</b> TS utility that adds <Styled.InlineCode>children?: ReactNode</Styled.InlineCode> to your props.</li>
                    <li><b>Render prop:</b> A pattern where <Styled.InlineCode>children</Styled.InlineCode> is a <i>function</i> that returns ReactNode, letting parents control rendering.</li>
                    <li><b>Slot / asChild:</b> A pattern where a component expects exactly one element child and injects props into it (via <Styled.InlineCode>cloneElement</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use which type */}
            <Styled.Section>
                <Styled.H2>When to use ReactNode vs ReactElement</Styled.H2>
                <Styled.List>
                    <li><b>Use ReactNode</b> for general "anything renderable" content (text, elements, fragments...). This is the default for layout components like Card, Stack, ModalBody.</li>
                    <li><b>Use ReactElement</b> when you require an actual element instance (e.g., you need to <i>cloneElement</i> it or enforce a certain element/component type).</li>
                    <li><b>Use JSX.Element</b> interchangeably with ReactElement for "a single element result."</li>
                    <li><b>Use a function type</b> like <Styled.InlineCode>(args) =&gt; ReactNode</Styled.InlineCode> for render-prop children.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Optional vs required children */}
            <Styled.Section>
                <Styled.H2>Optional vs Required Children</Styled.H2>
                <Styled.List>
                    <li><b>PropsWithChildren</b> makes children <i>optional</i> by default: <Styled.InlineCode>children?: ReactNode</Styled.InlineCode>.</li>
                    <li>If your component <b>requires</b> children, declare <Styled.InlineCode>children: ReactNode</Styled.InlineCode> yourself instead of using PropsWithChildren.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// ✅ Optional children (common)
type BoxProps = React.PropsWithChildren<{ padding?: number }>;

function Box({ padding = 8, children }: BoxProps) {
  return <div style={{ padding }}>{children}</div>;
}

// ✅ Required children (declare explicitly)
type CardProps = { title: string; children: React.ReactNode };

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) ReactNode examples */}
            <Styled.Section>
                <Styled.H2>General Case: children as ReactNode</Styled.H2>
                <Styled.Pre>
                    {`type StackProps = {
  direction?: "row" | "column";
  gap?: number;
  children?: React.ReactNode;     // optional
};

function Stack({ direction = "column", gap = 8, children }: StackProps) {
  const style = {
    display: "flex",
    flexDirection: direction,
    gap,
  } as const;
  return <div style={style}>{children}</div>;
}

// Usage:
// <Stack gap={12}><Button/>Hello <strong>World</strong></Stack>`}
                </Styled.Pre>
                <Styled.Small>
                    <b>ReactNode</b> lets callers pass text, elements, or fragments—great for flexible layouts.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Restricting children to specific element/component */}
            <Styled.Section>
                <Styled.H2>Restricting Children to a Specific Type</Styled.H2>
                <Styled.List>
                    <li>Sometimes a component should only accept certain children (e.g., only <Styled.InlineCode>&lt;MenuItem/&gt;</Styled.InlineCode> inside <Styled.InlineCode>&lt;Menu/&gt;</Styled.InlineCode>).</li>
                    <li>Use <Styled.InlineCode>ReactElement&lt;typeof Component&gt;</Styled.InlineCode> (and arrays) to enforce this at type level.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function MenuItem(props: { value: string; children: React.ReactNode }) {
  return <button role="menuitem" data-value={props.value}>{props.children}</button>;
}

type MenuProps = {
  // one or many MenuItem elements
  children:
    | React.ReactElement<typeof MenuItem>
    | React.ReactElement<typeof MenuItem>[];
};

function Menu({ children }: MenuProps) {
  return <div role="menu">{children}</div>;
}

// ✅ OK
// <Menu>
//   <MenuItem value="new">New</MenuItem>
//   <MenuItem value="open">Open…</MenuItem>
// </Menu>

// ❌ Type error: <div/> is not a MenuItem
// <Menu><div>Oops</div></Menu>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Exactly one child + inject props (slot/asChild) */}
            <Styled.Section>
                <Styled.H2>Slot / asChild Pattern (Injecting Props)</Styled.H2>
                <Styled.List>
                    <li>Expect exactly one element child, then inject props (e.g., <Styled.InlineCode>className</Styled.InlineCode>, <Styled.InlineCode>onClick</Styled.InlineCode>) using <Styled.InlineCode>cloneElement</Styled.InlineCode>.</li>
                    <li>Type children as <Styled.InlineCode>ReactElement</Styled.InlineCode>; optionally guard with <Styled.InlineCode>isValidElement</Styled.InlineCode> at runtime.</li>
                </Styled.List>
                <Styled.Pre>
                    {`type SlotProps = {
  children: React.ReactElement; // exactly one element
  onPress?: () => void;
};

function Slot({ children, onPress }: SlotProps) {
  if (!React.isValidElement(children)) {
    // Runtime guard (TypeScript already restricts this at compile time).
    throw new Error("Slot expects a single React element child.");
  }
  return React.cloneElement(children, {
    onClick: onPress,
    // merge className, aria, etc. as needed
  });
}

// Usage:
// <Slot onPress={() => console.log("pressed")}>
//   <button>Click me</button>
// </Slot>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Render-prop children */}
            <Styled.Section>
                <Styled.H2>Render-Prop Children (Function as Child)</Styled.H2>
                <Styled.List>
                    <li>Define <Styled.InlineCode>children</Styled.InlineCode> as a function that returns <Styled.InlineCode>ReactNode</Styled.InlineCode>.</li>
                    <li>Great for "data → UI" patterns, where parent controls the render.</li>
                </Styled.List>
                <Styled.Pre>
                    {`type CounterProps = {
  initial?: number;
  children: (args: { count: number; inc: () => void; dec: () => void }) => React.ReactNode;
};

function Counter({ initial = 0, children }: CounterProps) {
  const [count, set] = React.useState(initial);
  const inc = () => set((c) => c + 1);
  const dec = () => set((c) => c - 1);
  return <>{children({ count, inc, dec })}</>;
}

// Usage:
// <Counter initial={5}>
//   {({ count, inc, dec }) => (
//     <div>
//       <button onClick={dec}>-</button>
//       <span>{count}</span>
//       <button onClick={inc}>+</button>
//     </div>
//   )}
// </Counter>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Runtime helpers & guards */}
            <Styled.Section>
                <Styled.H2>Runtime Helpers &amp; Guards</Styled.H2>
                <Styled.List>
                    <li><b>React.isValidElement(x)</b>: true if <Styled.InlineCode>x</Styled.InlineCode> is a valid React element.</li>
                    <li><b>React.Children.only(children)</b>: asserts exactly one child; throws otherwise.</li>
                    <li><b>React.Children.map / toArray</b>: iterate/normalize children lists safely.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function OnlyChild({ children }: { children: React.ReactElement }) {
  // Extra safety at runtime:
  const only = React.Children.only(children);
  return <div className="only-child">{only}</div>;
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul>
      {React.Children.map(children, (child, i) => (
        <li key={i}>{child}</li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <Styled.InlineCode>ReactNode</Styled.InlineCode> for flexible, general children.</li>
                    <li><b>Do</b> use <Styled.InlineCode>ReactElement</Styled.InlineCode> when you must clone or enforce element type.</li>
                    <li><b>Do</b> type render-prop children as functions returning <Styled.InlineCode>ReactNode</Styled.InlineCode>.</li>
                    <li><b>Don't</b> assume children are always elements—text and <i>null</i> are valid.</li>
                    <li><b>Don't</b> accept <Styled.InlineCode>any</Styled.InlineCode> for children; it defeats type safety.</li>
                    <li><b>Don't</b> forget runtime guards when you rely on "exactly one element" semantics.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Default to <b>ReactNode</b>. Use <b>ReactElement</b> when you need an actual element
                instance (cloning or type-restricting). For render-prop patterns, type children as a function
                returning <b>ReactNode</b>. Make children required only when it's semantically necessary.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingChildren;
