import React from "react";
import { Styled } from "./styled";

const JsxBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>JSX Basics</Styled.Title>
            <Styled.Lead>
                JSX is a syntax extension for JavaScript that looks like HTML and
                describes UI. It compiles to <Styled.InlineCode>React.createElement</Styled.InlineCode> calls.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Why JSX is useful</Styled.H2>
                <Styled.List>
                    <li>UI structure and JavaScript logic live together (components).</li>
                    <li>Conditional blocks and loops become plain JavaScript expressions.</li>
                    <li>Static analysis and type checking work better than template strings.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Returning JSX from a component</Styled.H2>
                <Styled.Pre>
                    <code>{`function Welcome() {
  return <h2>Welcome to React</h2>;
}

// Usage: <Welcome />`}</code>
                </Styled.Pre>
                <Styled.Small>
                    Component names start with a capital letter (<Styled.InlineCode>Welcome</Styled.InlineCode>).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Embedding JavaScript with {"{}"}</Styled.H2>
                <p>
                    Curly braces evaluate a JavaScript <b>expression</b> (not statements)
                    and insert the result.
                </p>
                <Styled.Pre>
                    <code>{`const user = { first: "Ada", last: "Lovelace" };
const full = \`\${user.first} \${user.last}\`;

function Card() {
  const year = new Date().getFullYear();
  return (
    <div>
      <h3>{full}</h3>
      <p>Year: {year}</p>
      <p>Upper: {"hello".toUpperCase()}</p>
    </div>
  );
}`}</code>
                </Styled.Pre>
                <Styled.Small>
                    Valid: values, function calls, ternaries. Invalid: <em>statements</em> like <code>if</code>,{" "}
                    <code>for</code> (use expressions instead).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Attributes & differences from HTML</Styled.H2>
                <Styled.List>
                    <li>
                        Names are <b>camelCased</b>:{" "}
                        <Styled.InlineCode>className</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>htmlFor</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>tabIndex</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>autoFocus</Styled.InlineCode>.
                    </li>
                    <li>
                        Strings can be written as <Styled.InlineCode>"text"</Styled.InlineCode> or in braces:{" "}
                        <Styled.InlineCode>{`title={"Hello"}`}</Styled.InlineCode>.
                    </li>
                    <li>
                        Booleans: presence means <em>true</em>; use braces for false/expressions.
                    </li>
                    <li>
                        Inline styles use a JS object with camelCased CSS properties.
                    </li>
                    <li>
                        Event handlers use <Styled.InlineCode>onClick</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>onChange</Styled.InlineCode> and expect a <b>function</b>, not the result of calling one.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    <code>{`<button
  className="primary"
  disabled={false}
  style={{ backgroundColor: "teal", padding: "8px 12px" }}
  onClick={() => console.log("clicked")}
>
  Click
</button>`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>One parent element (root) per return</Styled.H2>
                <p>
                    JSX must return a single root node. Wrap siblings in a parent element
                    or a fragment (<Styled.InlineCode>&lt;&gt;...&lt;/&gt;</Styled.InlineCode>). A dedicated page covers fragments in detail.
                </p>
                <Styled.Pre>
                    <code>{`function Panel() {
  return (
    <>
      <h4>Title</h4>
      <p>Content</p>
    </>
  );
}`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Conditional snippets (quick taste)</Styled.H2>
                <p>
                    A full page covers conditional rendering, but the two most common patterns are:
                </p>
                <Styled.Pre>
                    <code>{`// 1) Ternary
{isLoading ? <Spinner /> : <List />}

// 2) Logical AND (renders right side when truthy)
{error && <p className="error">{error.message}</p>}`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Rendering lists (quick taste)</Styled.H2>
                <p>
                    A full page covers lists & keys. Keys must be stable and unique among siblings.
                </p>
                <Styled.Pre>
                    <code>{`const users = [{id: 1, name: "Ada"}, {id: 2, name: "Linus"}];

<ul>
  {users.map(u => <li key={u.id}>{u.name}</li>)}
</ul>`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Self-closing and nesting rules</Styled.H2>
                <Styled.List>
                    <li>Self-close tags with no children: <Styled.InlineCode>{`<img />`}</Styled.InlineCode>, <Styled.InlineCode>{`<input />`}</Styled.InlineCode>.</li>
                    <li>Use a closing tag for custom components: <Styled.InlineCode>{`<Card></Card>`}</Styled.InlineCode> or <Styled.InlineCode>{`<Card />`}</Styled.InlineCode>.</li>
                    <li>
                        Lowercase tag names are treated as DOM elements; Capitalized names refer to React components.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Using <Styled.InlineCode>class</Styled.InlineCode> instead of <Styled.InlineCode>className</Styled.InlineCode>.
                    </li>
                    <li>
                        Calling an event handler instead of passing a function:{" "}
                        <Styled.InlineCode>{`onClick={handle()}`}</Styled.InlineCode> ❌ →{" "}
                        <Styled.InlineCode>{`onClick={handle}`}</Styled.InlineCode> ✅
                    </li>
                    <li>
                        Mixing statements inside braces. Use expressions (e.g., ternary) or move logic above.
                    </li>
                    <li>
                        Rendering objects directly (shows <em>[object Object]</em>). Convert or stringify.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    <code>{`// Good: stringify or pick a field
<p>{JSON.stringify(user)}</p>
<p>{user.name}</p>`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                Summary: JSX is an expression-friendly way to describe UI with HTML-like
                syntax. Remember camelCased attributes, one root node, functions for
                events, and expressions inside {"{}"}.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default JsxBasics;
