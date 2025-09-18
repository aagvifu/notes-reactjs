import { Styled } from "./styled";

const TsxBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>TSX Basics (TypeScript + React)</Styled.Title>

            <Styled.Lead>
                <b>TSX</b> is “TypeScript flavored JSX.” You write React components in <b>.tsx</b> files and
                annotate values with types so the compiler can catch mistakes <i>before</i> runtime.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is TSX? Why use it?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>JSX:</b> a JavaScript syntax extension that looks like HTML but compiles to{" "}
                        <Styled.InlineCode>React.createElement</Styled.InlineCode> calls (or the automatic JSX transform).
                    </li>
                    <li>
                        <b>TS:</b> a typed superset of JavaScript that adds <i>static types</i> (checked at build time).
                    </li>
                    <li>
                        <b>TSX:</b> JSX syntax inside TypeScript files (<Styled.InlineCode>.tsx</Styled.InlineCode>) so
                        you can type props, state, refs, events, etc.
                    </li>
                    <li>
                        <b>Benefits:</b> autocomplete, safer refactors, API self-documentation, fewer runtime bugs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Setup (just the essentials) */}
            <Styled.Section>
                <Styled.H2>Project setup (at a glance)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>.tsx</b> for React components. Non-JSX TypeScript can live in <b>.ts</b>.
                    </li>
                    <li>
                        In <Styled.InlineCode>tsconfig.json</Styled.InlineCode>, ensure{" "}
                        <Styled.InlineCode>"jsx": "react-jsx"</Styled.InlineCode> (or <Styled.InlineCode>"react-jsxdev"</Styled.InlineCode>).
                    </li>
                    <li>
                        You can mix .js and .tsx in one project, but prefer consistent <b>.tsx</b> for components in TS sections.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// tsconfig.json (minimal bits)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "Bundler",
    "skipLibCheck": true
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Types you will see immediately */}
            <Styled.Section>
                <Styled.H2>Core React types you'll meet</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>React.ReactNode</Styled.InlineCode>: anything renderable (string, number, JSX, array,
                        fragments, portals, etc.).
                    </li>
                    <li>
                        <Styled.InlineCode>React.ElementType</Styled.InlineCode>: any component or intrinsic tag (like{" "}
                        <Styled.InlineCode>"button"</Styled.InlineCode>).
                    </li>
                    <li>
                        <Styled.InlineCode>React.ComponentProps&lt;"button"&gt;</Styled.InlineCode>: props for a native element or component.
                    </li>
                    <li>
                        <Styled.InlineCode>React.ChangeEvent&lt;HTMLInputElement&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>React.MouseEvent&lt;HTMLButtonElement&gt;</Styled.InlineCode>: typed events.
                    </li>
                    <li>
                        <Styled.InlineCode>React.RefObject&lt;T&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>React.MutableRefObject&lt;T&gt;</Styled.InlineCode>: refs and their current values.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) First component: typed props */}
            <Styled.Section>
                <Styled.H2>Typing props in a function component</Styled.H2>
                <Styled.Pre>
                    {`// Button.tsx
type ButtonProps = {
  /** Visible label on the button */
  label: string;
  /** Optional click handler; receives a typed MouseEvent */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visual style variant with a union type */
  variant?: "primary" | "secondary" | "ghost";
  /** Disabled state */
  disabled?: boolean;
};

export default function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  return (
    <button
      className={\`btn \${variant}\`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
}

// Usage (TSX)
<Button label="Save" onClick={(e) => console.log(e.currentTarget)} variant="secondary" />`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Union types</b> (e.g., "primary" | "secondary" | "ghost") give you intellisense for allowed values.
                </Styled.Small>
            </Styled.Section>

            {/* 5) State and refs */}
            <Styled.Section>
                <Styled.H2>Typing state and refs</Styled.H2>
                <Styled.Pre>
                    {`// Counter.tsx
import React from "react";

export default function Counter() {
  // Type argument makes intent explicit (number)
  const [count, setCount] = React.useState<number>(0);

  // A ref to a DOM node
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  function inc() { setCount((c) => c + 1); }
  function focusButton() { btnRef.current?.focus(); }

  return (
    <>
      <p>Count: {count}</p>
      <button ref={btnRef} onClick={inc}>Increment</button>
      <button onClick={focusButton}>Focus the increment button</button>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    If the initial state makes the type obvious (e.g., <Styled.InlineCode>useState(0)</Styled.InlineCode>), TS infers it;
                    for <i>null</i> or unions, pass a generic (e.g., <Styled.InlineCode>useState&lt;string | null&gt;(null)</Styled.InlineCode>).
                </Styled.Small>
            </Styled.Section>

            {/* 6) Controlled inputs & events */}
            <Styled.Section>
                <Styled.H2>Controlled inputs and event types</Styled.H2>
                <Styled.Pre>
                    {`// TextInput.tsx
type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value); // e is fully typed
  }
  return <input value={value} onChange={handleChange} placeholder={placeholder} />;
}
`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>React.ChangeEvent&lt;HTMLInputElement&gt;</Styled.InlineCode> for inputs,{" "}
                    <Styled.InlineCode>React.FormEvent&lt;HTMLFormElement&gt;</Styled.InlineCode> for forms,
                    <Styled.InlineCode>React.MouseEvent&lt;HTMLButtonElement&gt;</Styled.InlineCode> for buttons, etc.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Children + composition (preview) */}
            <Styled.Section>
                <Styled.H2>Children and composition (quick intro)</Styled.H2>
                <Styled.Pre>
                    {`// Card.tsx
type CardProps = {
  title: string;
  children: React.ReactNode; // anything renderable
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="content">{children}</div>
    </section>
  );
}

// Usage
<Card title="Profile"><strong>Ashish</strong> — MERN Developer</Card>`}
                </Styled.Pre>
                <Styled.Small>
                    We'll go deeper in <b>Typing Children</b>, but for now know that{" "}
                    <Styled.InlineCode>React.ReactNode</Styled.InlineCode> is the usual type for <i>anything</i> you render.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Forwarding props (intrinsic & polymorphic preview) */}
            <Styled.Section>
                <Styled.H2>Forwarding native props (preview)</Styled.H2>
                <Styled.Pre>
                    {`// IconButton.tsx — combine your props with native <button> props
type IconButtonProps = {
  icon: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ icon, children, ...buttonProps }: IconButtonProps) {
  return (
    <button {...buttonProps}>
      <span aria-hidden>{icon}</span>
      {children}
    </button>
  );
}

// Usage gets full button props autocomplete:
<IconButton icon={<svg />} onClick={() => {}} disabled>Save</IconButton>`}
                </Styled.Pre>
                <Styled.Small>
                    Using <Styled.InlineCode>&amp; React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt;</Styled.InlineCode> merges your API
                    with all valid button attributes (accessible, flexible).
                </Styled.Small>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> enable <Styled.InlineCode>"strict": true</Styled.InlineCode> in tsconfig.</li>
                    <li><b>Do</b> prefer explicit unions for finite options (e.g., variants, sizes).</li>
                    <li><b>Do</b> type events precisely (<Styled.InlineCode>ChangeEvent&lt;HTMLInputElement&gt;</Styled.InlineCode>, etc.).</li>
                    <li><b>Don't</b> use <Styled.InlineCode>any</Styled.InlineCode> by default—reach for <Styled.InlineCode>unknown</Styled.InlineCode> or proper generics later.</li>
                    <li><b>Don't</b> overuse <Styled.InlineCode>React.FC</Styled.InlineCode>; a plain typed function is usually clearer and avoids implicit <Styled.InlineCode>children</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (quick definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Type annotation:</b> a declared type for a variable, parameter, or return value.</li>
                    <li><b>Interface vs type alias:</b> both name shapes of objects; interfaces are extendable via declaration merging; type aliases can use unions/intersections.</li>
                    <li><b>Union type:</b> a value that can be <i>one of several</i> types (e.g., <Styled.InlineCode>"sm" | "md" | "lg"</Styled.InlineCode>).</li>
                    <li><b>Generic:</b> a reusable type parameter (e.g., <Styled.InlineCode>Array&lt;T&gt;</Styled.InlineCode>)—covered in the “Generics” topic.</li>
                    <li><b>Intrinsic element:</b> a built-in HTML tag like <Styled.InlineCode>"div"</Styled.InlineCode> or <Styled.InlineCode>"button"</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: TSX lets you write React with types—start by typing props, state, refs, and events.
                Prefer strict mode, precise event types, and small, composable components.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TsxBasics;
