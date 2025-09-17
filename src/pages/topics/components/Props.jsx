import React from "react";
import { Styled } from "./styled";

const Props = () => {
    return (
        <Styled.Page>
            <Styled.Title>Props</Styled.Title>
            <Styled.Lead>
                Props (properties) are the <b>inputs</b> to a component. They flow one-way
                from parent to child, are <b>read-only</b> inside the child, and can be any
                serializable JS value (strings, numbers, booleans, arrays, objects, functions,
                even JSX).
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prop:</b> a single named input (e.g., <Styled.InlineCode>title</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Props object:</b> the object passed to a component function
                        (e.g., <Styled.InlineCode>function Card(props) &#123; ... &#125;</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Children prop:</b> the special prop containing whatever appears between a
                        component’s opening and closing tags (handled in depth on the “Children” page).
                    </li>
                    <li>
                        <b>Prop drilling:</b> passing props through many layers just to reach a deep child.
                        Often a signal to use context or lift/shared state.
                    </li>
                    <li>
                        <b>Default prop value:</b> a fallback used when the caller omits that prop.
                    </li>
                    <li>
                        <b>Prop type:</b> the expected type/shape/contract for a prop (documented via PropTypes or TypeScript).
                    </li>
                    <li>
                        <b>Special props:</b> <Styled.InlineCode>key</Styled.InlineCode> and <Styled.InlineCode>ref</Styled.InlineCode> are handled by React; they are not regular props.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basics */}
            <Styled.Section>
                <Styled.H2>Basics: pass and read props</Styled.H2>
                <Styled.Pre>
                    {`function Welcome(props) {
  return <h2>Welcome, {props.name}</h2>;
}

// Passing a prop
<Welcome name="Ada" />`}
                </Styled.Pre>
                <Styled.Small>
                    Component functions receive a single argument (<Styled.InlineCode>props</Styled.InlineCode>) and return JSX.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Destructuring & defaults */}
            <Styled.Section>
                <Styled.H2>Destructuring & default values</Styled.H2>
                <Styled.List>
                    <li>Destructure for clarity; set defaults in the parameter list.</li>
                    <li>Defaults run at call time and only when the prop is <em>undefined</em>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Avatar({ src = "/avatar.png", alt = "User avatar", size = 40 }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}

// <Avatar />  // uses all defaults
// <Avatar size={64} />  // overrides size only`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Passing functions (callbacks) */}
            <Styled.Section>
                <Styled.H2>Passing functions (callbacks)</Styled.H2>
                <Styled.List>
                    <li>Parents pass behavior down by providing callbacks.</li>
                    <li>In JSX, pass a <b>function</b>, not the result of calling one.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function SaveButton({ onSave }) {
  return <button onClick={() => onSave?.()}>Save</button>;
}

// Parent:
// <SaveButton onSave={() => fetch("/api/save", { method: "POST" })} />`}
                </Styled.Pre>
                <Styled.Small>
                    Callbacks can receive arguments: <Styled.InlineCode>onSelect(item)</Styled.InlineCode>. Use inline arrows or wrap named handlers.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Props vs State */}
            <Styled.Section>
                <Styled.H2>Props vs State</Styled.H2>
                <Styled.List>
                    <li><b>Props</b> are inputs from the parent; they are read-only inside the child.</li>
                    <li><b>State</b> is internal component data; update it with <Styled.InlineCode>setState</Styled.InlineCode> hooks.</li>
                    <li>Parent changes → child re-renders with new props. Child changes state → child re-renders itself.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Children (pointer) */}
            <Styled.Section>
                <Styled.H2><code>children</code> (overview)</Styled.H2>
                <p>
                    The <Styled.InlineCode>children</Styled.InlineCode> prop represents nested content. It enables composition without
                    creating a dedicated prop for every slot. A full page covers patterns and render-props.
                </p>
                <Styled.Pre>
                    {`function Card({ title, children }) {
  return (
   <section className="card">
     <h3>{title}</h3>
     {children}
   </section>
  );
}

// <Card title="Hello"><p>Body</p></Card>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Rest props & forwarding (filtered) */}
            <Styled.Section>
                <Styled.H2>Rest props & safe forwarding</Styled.H2>
                <Styled.List>
                    <li>Accept design-only props (e.g., <Styled.InlineCode>variant</Styled.InlineCode>) but do not leak them to the DOM.</li>
                    <li>Forward valid DOM props (<Styled.InlineCode>id</Styled.InlineCode>, <Styled.InlineCode>aria-*</Styled.InlineCode>, <Styled.InlineCode>data-*</Styled.InlineCode>, event handlers).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Button({ variant = "primary", className, style, ...rest }) {
  const cls = ["btn", \`btn--\${variant}\`, className].filter(Boolean).join(" ");
  return <button type="button" className={cls} style={style} {...rest} />;
}

// <Button aria-label="Save" onClick={...} data-test="x" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Polymorphic `as` prop */}
            <Styled.Section>
                <Styled.H2>Polymorphic components with <code>as</code></Styled.H2>
                <Styled.List>
                    <li>Let callers swap the underlying tag (<Styled.InlineCode>button</Styled.InlineCode> → <Styled.InlineCode>a</Styled.InlineCode>, <Styled.InlineCode>div</Styled.InlineCode> → <Styled.InlineCode>section</Styled.InlineCode>).</li>
                    <li>Preserve accessibility: correct roles/attributes when switching semantics.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Text({ as: Comp = "p", ...rest }) {
  return <Comp {...rest} />;
}

// <Text>para</Text>
// <Text as="h2">heading</Text>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Special props: key & ref */}
            <Styled.Section>
                <Styled.H2>Special props: <code>key</code> & <code>ref</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>key</b> gives identity among siblings for reconciliation. It is <em>not</em> available as <Styled.InlineCode>props.key</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>ref</b> holds a reference to a DOM node or to a child component that forwards a ref. Use <Styled.InlineCode>forwardRef</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const Input = React.forwardRef((props, ref) => <input ref={ref} {...props} />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Derived state from props (caution) */}
            <Styled.Section>
                <Styled.H2>Avoid “derived state from props” unless necessary</Styled.H2>
                <Styled.List>
                    <li>Do not copy props into state just to render them; this creates stale data.</li>
                    <li>Compute derived values during render or memoize if expensive.</li>
                    <li>If the UI must reset on a prop change, key the subtree or sync intentionally in an effect.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Anti-pattern: local copy becomes stale if 'value' changes
function Editor({ value }) {
  const [text, setText] = React.useState(value);
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

// ✅ Intentional re-initialize when 'version' changes
function Editor({ value, version }) {
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value, version]);
  return <input value={text} onChange={e => setText(e.target.value)} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Validation: PropTypes (JS) / TypeScript */}
            <Styled.Section>
                <Styled.H2>Validation & documentation</Styled.H2>
                <Styled.List>
                    <li>
                        <b>PropTypes</b> (JS): runtime dev-time validation & docs.
                    </li>
                    <li>
                        <b>TypeScript</b>: static, compile-time checking and editor hints.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// PropTypes (optional)
import PropTypes from "prop-types";
function Badge({ color = "gray", children }) { /* ... */ }
Badge.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) Accessibility & security */}
            <Styled.Section>
                <Styled.H2>Accessibility & security</Styled.H2>
                <Styled.List>
                    <li>Forward <Styled.InlineCode>aria-*</Styled.InlineCode> and <Styled.InlineCode>data-*</Styled.InlineCode> props to DOM elements.</li>
                    <li>For links with <Styled.InlineCode>target="_blank"</Styled.InlineCode>, add <Styled.InlineCode>rel="noopener noreferrer"</Styled.InlineCode>.</li>
                    <li>Avoid passing untrusted HTML into <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep props read-only; compute values instead of copying props to state.</li>
                    <li><b>Do</b> destructure with defaults; document expectations (PropTypes/TS).</li>
                    <li><b>Do</b> pass callbacks for actions; keep signatures simple.</li>
                    <li><b>Do</b> forward filtered rest props to the underlying DOM element.</li>
                    <li><b>Don’t</b> mutate props or rely on <Styled.InlineCode>props.key</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> spread unfiltered props into DOM; avoid leaking internal flags.</li>
                    <li><b>Don’t</b> derive local state from props without an explicit sync/reset strategy.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: props are the component inputs. Keep them immutable, define clear
                defaults and types, pass behavior via callbacks, forward only valid DOM props,
                and avoid stale copies by deriving values during render.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Props;
