import React from "react";
import { Styled } from "./styled";

const AttrsSpread = () => {
    return (
        <Styled.Page>
            <Styled.Title>Attributes & Spread (JSX)</Styled.Title>
            <Styled.Lead>
                JSX attributes look like HTML, but they're really JavaScript props. The
                spread operator <Styled.InlineCode>{`{...obj}`}</Styled.InlineCode> copies properties from an
                object into attributes. Used well, this keeps components flexible; used
                carelessly, it leaks unwanted props into the DOM or causes overrides.
            </Styled.Lead>

            {/* 1. Attributes basics */}
            <Styled.Section>
                <Styled.H2>Attributes: quick rules</Styled.H2>
                <Styled.List>
                    <li>Use <b>camelCase</b> names for DOM props: <Styled.InlineCode>className</Styled.InlineCode>, <Styled.InlineCode>htmlFor</Styled.InlineCode>, <Styled.InlineCode>tabIndex</Styled.InlineCode>.</li>
                    <li>Attribute values are JS <b>expressions</b> inside {"{}"} or plain strings in quotes.</li>
                    <li>Event handlers expect a <b>function</b>: <Styled.InlineCode>{`onClick={() => ...}`}</Styled.InlineCode>.</li>
                    <li>Inline styles are a JS object with camelCased CSS: <Styled.InlineCode>{`style={{ backgroundColor: "teal" }}`}</Styled.InlineCode>.</li>
                    <li><b>Lowercase</b> tags → real DOM elements; <b>Capitalized</b> tags → React components.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<button
  className="primary"
  aria-label="Save"
  disabled={false}
  style={{ padding: "8px 12px" }}
  onClick={() => console.log("saved")}
>
  Save
</button>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 2. Spread basics */}
            <Styled.Section>
                <Styled.H2>Spread basics</Styled.H2>
                <p>
                    The spread operator copies all enumerable properties of an object onto
                    the element or component as attributes/props.
                </p>
                <Styled.Pre>
                    {`const common = { className: "btn", "aria-busy": false };
const events = { onClick: () => console.log("clicked") };

// Spread onto a DOM element
<button {...common} {...events}>Click</button>

// Spread onto a component
<MyButton {...common} {...events} variant="primary" />`}
                </Styled.Pre>
                <Styled.Small>
                    Think “prop pack”. Useful for forwarding things like <Styled.InlineCode>id</Styled.InlineCode>, <Styled.InlineCode>aria-*</Styled.InlineCode>, <Styled.InlineCode>data-*</Styled.InlineCode>, handlers, etc.
                </Styled.Small>
            </Styled.Section>

            {/* 3. Order & precedence */}
            <Styled.Section>
                <Styled.H2>Order matters (last one wins)</Styled.H2>
                <p>When attributes collide, the property defined later overrides earlier ones.</p>
                <Styled.Pre>
                    {`const a = { className: "btn A", disabled: true };
const b = { className: "btn B", disabled: false };

<button {...a} {...b} className="btn C" />;
// final: class="btn C", disabled=false`}
                </Styled.Pre>
                <Styled.List>
                    <li>Put spreads first, then explicit attributes you want to guarantee.</li>
                    <li>Prefer explicit attributes for critical values (<Styled.InlineCode>type="button"</Styled.InlineCode>, <Styled.InlineCode>rel</Styled.InlineCode> etc.).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4. DOM vs Component */}
            <Styled.Section>
                <Styled.H2>DOM element vs custom component</Styled.H2>
                <Styled.List>
                    <li>
                        Spreading onto a <b>DOM element</b> (<Styled.InlineCode>{"<button>"}</Styled.InlineCode>) sends props as HTML attributes. Unknown attributes become custom attributes (<Styled.InlineCode>data-*</Styled.InlineCode> works; unknown event names like <Styled.InlineCode>onclick</Styled.InlineCode> do nothing).
                    </li>
                    <li>
                        Spreading onto a <b>custom component</b> passes props to that component. It decides what to do with them (often forwards to an inner DOM node).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function MyButton(props) {
  // Forward all unknown props to the real <button>
  const { variant = "primary", ...rest } = props;
  return (
    <button
      type="button"               // explicit and safe
      data-variant={variant}
      {...rest}                   // aria-*, onClick, id, etc.
    />
  );
}`}</Styled.Pre>
                <Styled.Small>
                    This “rest props” pattern is standard for reusable components.
                </Styled.Small>
            </Styled.Section>

            {/* 5. Filtering before spreading */}
            <Styled.Section>
                <Styled.H2>Filter props before spreading (avoid leaking junk)</Styled.H2>
                <p>
                    Never dump <Styled.InlineCode>{`{...props}`}</Styled.InlineCode> onto a DOM element without removing
                    non-DOM fields (e.g., custom <Styled.InlineCode>variant</Styled.InlineCode>, <Styled.InlineCode>size</Styled.InlineCode>).
                    Filter first, then spread <Styled.InlineCode>rest</Styled.InlineCode>.
                </p>
                <Styled.Pre>
                    {`function Button({ variant, size, className, style, ...rest }) {
  const base = "btn";
  const cls = [base, variant && \`btn--\${variant}\`, className].filter(Boolean).join(" ");
  const baseStyle = { borderRadius: 12, padding: "8px 12px" };
  return (
    <button
      type="button"
      className={cls}
      style={{ ...baseStyle, ...style }}
      {...rest}               // aria-*, onClick, disabled, id, etc.
    />
  );
}

// Usage
<Button variant="ghost" onClick={...} aria-label="Save" data-id="x" />`}
                </Styled.Pre>
                <Styled.List>
                    <li>Good: <b>strip</b> design-only props; <b>forward</b> ARIA/data/handlers.</li>
                    <li>Bad: forwarding internal flags (<Styled.InlineCode>isOpen</Styled.InlineCode>, <Styled.InlineCode>renderAsPortal</Styled.InlineCode>) to the DOM.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6. className / style merging */}
            <Styled.Section>
                <Styled.H2>Merging <code>className</code> and <code>style</code></Styled.H2>
                <Styled.List>
                    <li>
                        Concatenate classes instead of letting user <em>replace</em> them unintentionally.
                    </li>
                    <li>
                        Merge styles with spread. Later properties override earlier ones.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const cls = ["badge", props.className].filter(Boolean).join(" ");
const style = { ...baseStyle, ...props.style };
return <span className={cls} style={style} {...rest} />;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7. Security & a11y notes */}
            <Styled.Section>
                <Styled.H2>Security & accessibility notes</Styled.H2>
                <Styled.List>
                    <li>
                        When forwarding links, enforce safety for <Styled.InlineCode>target="_blank"</Styled.InlineCode>:
                        add <Styled.InlineCode>rel="noopener noreferrer"</Styled.InlineCode>.
                    </li>
                    <li>
                        Don't forward <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode> from untrusted sources.
                    </li>
                    <li>
                        Keep <Styled.InlineCode>aria-*</Styled.InlineCode> and <Styled.InlineCode>data-*</Styled.InlineCode> props flowing—these are valid on DOM nodes.
                    </li>
                    <li>
                        Set an explicit <Styled.InlineCode>type="button"</Styled.InlineCode> on custom buttons to avoid unintended form submits.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function LinkLike({ href, target, rel, ...rest }) {
  const safeRel = target === "_blank"
    ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
    : rel;
  return <a href={href} target={target} rel={safeRel} {...rest} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8. Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b>: spread <em>filtered</em> rest props onto a DOM element for flexibility.</li>
                    <li><b>Do</b>: put spreads first, then explicit attributes to lock critical values.</li>
                    <li><b>Do</b>: merge <Styled.InlineCode>className</Styled.InlineCode> and <Styled.InlineCode>style</Styled.InlineCode> instead of replacing them.</li>
                    <li><b>Don't</b>: spread <Styled.InlineCode>{`{...props}`}</Styled.InlineCode> blindly onto DOM; strip internal props.</li>
                    <li><b>Don't</b>: rely on spread order accidentally—make intent obvious.</li>
                    <li><b>Don't</b>: forward unsafe props (e.g., user-provided <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: attributes are just props; spread packs are powerful but must be
                filtered. Control precedence by order, keep critical attributes explicit,
                and forward only what the DOM (or child component) should actually see.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AttrsSpread;
