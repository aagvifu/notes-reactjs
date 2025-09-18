import { Styled } from "./styled";

const TypingProps = () => {
    return (
        <Styled.Page>
            <Styled.Title>Typing Props (TypeScript)</Styled.Title>

            <Styled.Lead>
                In TypeScript, <b>props</b> are typed so that components receive the
                <i> right shape of data</i> at compile time. You typically define a{" "}
                <b>Props</b> type (or interface) and annotate the component with it.
                This catches mistakes early and makes usage self-documenting.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prop:</b> A value passed from a parent component to a child
                        component. Props are <i>read-only</i> inside the child.
                    </li>
                    <li>
                        <b>Type alias:</b> A named type using{" "}
                        <Styled.InlineCode>type</Styled.InlineCode>. Great for unions,
                        intersections, and mapped types.
                    </li>
                    <li>
                        <b>Interface:</b> A named structural contract using{" "}
                        <Styled.InlineCode>interface</Styled.InlineCode>. Can be extended
                        and merged (declaration merging).
                    </li>
                    <li>
                        <b>Optional property:</b> Marked with{" "}
                        <Styled.InlineCode>?</Styled.InlineCode>; may be omitted or{" "}
                        <Styled.InlineCode>undefined</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Union type:</b> A value that can be one of several types (e.g.
                        <Styled.InlineCode>"primary" | "ghost"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Intersection type:</b> Combine multiple object types into one
                        with <Styled.InlineCode>&amp;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Discriminated union:</b> A union of objects that share a common
                        discriminator field (e.g. <Styled.InlineCode>kind</Styled.InlineCode>), enabling safe
                        switches.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic props */}
            <Styled.Section>
                <Styled.H2>Basic Props: Required vs Optional</Styled.H2>
                <Styled.Pre>
                    {`// interface or type — both are fine
interface BadgeProps {
  label: string;           // required
  count?: number;          // optional
  showDot?: boolean;       // optional boolean
}

// Recommended: annotate the function parameter
function Badge({ label, count = 0, showDot = false }: BadgeProps) {
  return (
    <div className="badge">
      {label} {count > 0 ? \`(\${count})\` : null} {showDot && "•"}
    </div>
  );
}

// Usage (TS checks shape and types)
<Badge label="Notifications" count={3} />
<Badge label="Inbox" showDot />
// Error examples:
// <Badge />                  // Property 'label' is missing
// <Badge label={42} />       // 'number' not assignable to 'string'`}
                </Styled.Pre>
                <Styled.Small>
                    Use default values in the <i>destructuring</i> to avoid{" "}
                    <Styled.InlineCode>defaultProps</Styled.InlineCode> (not recommended
                    for function components).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Literal unions for variants */}
            <Styled.Section>
                <Styled.H2>Variants with Literal Unions</Styled.H2>
                <Styled.List>
                    <li>
                        Constrain strings to a small set of allowed values (e.g.{" "}
                        <Styled.InlineCode>"primary" | "secondary"</Styled.InlineCode>).
                    </li>
                    <li>
                        This improves autocomplete and prevents typos like{" "}
                        <Styled.InlineCode>"primray"</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button({ variant = "primary", size = "md", ...rest }: ButtonProps) {
  return <button data-variant={variant} data-size={size} {...rest} />;
}

<Button variant="ghost" size="sm" />;
<Button variant="primary" onClick={(e) => console.log(e.currentTarget)} />;
// <Button variant="big" />            // Error: not assignable to 'ButtonSize'`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Function props & event types */}
            <Styled.Section>
                <Styled.H2>Function Props &amp; Event Types</Styled.H2>
                <Styled.List>
                    <li>
                        Use React's event types:{" "}
                        <Styled.InlineCode>React.MouseEvent&lt;HTMLButtonElement&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>React.ChangeEvent&lt;HTMLInputElement&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>React.FormEvent&lt;HTMLFormElement&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        For callbacks without DOM events, write plain function types, e.g.{" "}
                        <Styled.InlineCode>(value: string) =&gt; void</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

function Search({ value, onChange, onSubmit }: SearchProps) {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)} // ChangeEvent<HTMLInputElement>
      />
      <button type="submit">Go</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Extending native element props */}
            <Styled.Section>
                <Styled.H2>Extending Native Element Props (Polymorphism-lite)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>React.ComponentProps</Styled.InlineCode> (or{" "}
                        <Styled.InlineCode>ComponentPropsWithoutRef</Styled.InlineCode>) to
                        inherit props from an intrinsic element (e.g.,{" "}
                        <Styled.InlineCode>"button"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"a"</Styled.InlineCode>).
                    </li>
                    <li>
                        Omit conflicting fields with{" "}
                        <Styled.InlineCode>Omit&lt;...,&nbsp;"propName"&gt;</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type NativeButtonProps = React.ComponentPropsWithoutRef<"button">;

type IconButtonProps = Omit<NativeButtonProps, "children"> & {
  label: string;                     // accessible name
  icon: React.ReactNode;             // renderable icon
};

function IconButton({ label, icon, ...rest }: IconButtonProps) {
  return (
    <button aria-label={label} {...rest}>
      {icon}
    </button>
  );
}

// Now IconButton accepts 'onClick', 'disabled', 'type', etc., with correct types.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Discriminated unions (XOR-style) */}
            <Styled.Section>
                <Styled.H2>Exclusive Props with Discriminated Unions</Styled.H2>
                <Styled.List>
                    <li>
                        Create “either/or” APIs (e.g., a Button that behaves like a link
                        <i>or</i> a button) using a shared discriminator.
                    </li>
                    <li>
                        Consumers get compile-time errors if they pass incompatible
                        combinations.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`type LinkLike = { kind: "link"; href: string; target?: "_blank" | "_self" };
type ButtonLike = { kind: "button"; onClick?: () => void; type?: "button" | "submit" };

type SmartButtonProps = (LinkLike | ButtonLike) & {
  children: React.ReactNode;
};

function SmartButton(props: SmartButtonProps) {
  if (props.kind === "link") {
    return <a href={props.href} target={props.target}>{props.children}</a>;
  }
  return <button type={props.type ?? "button"} onClick={props.onClick}>{props.children}</button>;
}

// Usage:
// <SmartButton kind="link" href="/docs">Docs</SmartButton>
// <SmartButton kind="button" onClick={() => ...}>Click</SmartButton>
// <SmartButton kind="link" onClick={() => ...} />
//    ^ Error: 'onClick' doesn't exist on 'LinkLike'`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Patterns & best practices */}
            <Styled.Section>
                <Styled.H2>Patterns &amp; Best Practices</Styled.H2>
                <Styled.List>
                    <li>
                        Prefer <Styled.InlineCode>type Props = &#123;...&#125;</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>interface Props &#123;...&#125;</Styled.InlineCode>{" "}
                        on function components. Avoid <Styled.InlineCode>React.FC</Styled.InlineCode> in
                        libraries because it implicitly adds <Styled.InlineCode>children</Styled.InlineCode> and
                        can hide errors.
                    </li>
                    <li>
                        Use <b>literal unions</b> for variants (e.g., color, size) to improve autocomplete and
                        avoid typos.
                    </li>
                    <li>
                        Use <Styled.InlineCode>Omit</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>Pick</Styled.InlineCode> when extending native element props.
                    </li>
                    <li>
                        Prefer <b>explicit</b> function prop types over <Styled.InlineCode>any</Styled.InlineCode>.
                        If unsure, use <Styled.InlineCode>unknown</Styled.InlineCode> and narrow inside.
                    </li>
                    <li>
                        Keep props minimal and cohesive. If a prop drives multiple behaviors, consider
                        <b> splitting</b> it or using a discriminated union.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Using <Styled.InlineCode>any</Styled.InlineCode> for props: lose type safety and
                        IntelliSense. Type confidently, even if broad.
                    </li>
                    <li>
                        Relying on <Styled.InlineCode>defaultProps</Styled.InlineCode> for function components:
                        prefer default values in parameter destructuring.
                    </li>
                    <li>
                        Making everything optional: this weakens the API. Decide what's truly required.
                    </li>
                    <li>
                        Overusing boolean flags: prefer enums/unions (e.g.,{" "}
                        <Styled.InlineCode>variant</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Structural typing:</b> TypeScript checks that the <i>shape</i> matches, not the name.
                    </li>
                    <li>
                        <b>PropsWithChildren&lt;T&gt;:</b> Utility that adds{" "}
                        <Styled.InlineCode>children?: React.ReactNode</Styled.InlineCode> to a props type (we
                        cover children in a separate topic).
                    </li>
                    <li>
                        <b>ComponentProps&lt;"tag"&gt;:</b> Gets the props type of an intrinsic element like{" "}
                        <Styled.InlineCode>"button"</Styled.InlineCode> or <Styled.InlineCode>"a"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Declaration merging:</b> Interfaces with the same name can merge shapes (advanced
                        pattern—use sparingly).
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Define a clear <b>Props</b> type, mark optional fields with{" "}
                <Styled.InlineCode>?</Styled.InlineCode>, use literal unions for variants, and lean on{" "}
                <Styled.InlineCode>ComponentProps</Styled.InlineCode> to extend native attributes. Prefer
                explicit callback/event types and keep the API minimal and predictable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TypingProps;
