import React from "react";
import { Styled } from "./styled";

const Fragments = () => {
    return (
        <Styled.Page>
            <Styled.Title>Fragments</Styled.Title>
            <Styled.Lead>
                A fragment lets multiple children be returned without adding an extra
                DOM element. Use it to satisfy React’s “one parent” rule without
                introducing wrappers that break layout or semantics.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Definition</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>Fragment</b> is a wrapper that renders <em>zero</em> DOM nodes.
                        In JSX it appears as <Styled.InlineCode>{`<>...</>`}</Styled.InlineCode> (shorthand)
                        or <Styled.InlineCode>{`<React.Fragment>...</React.Fragment>`}</Styled.InlineCode>.
                    </li>
                    <li>
                        Purpose: group siblings so a component can return a single parent
                        without creating an extra <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode>/<Styled.InlineCode>&lt;span&gt;</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Toolbar() {
  return (
    <>
      <button>Back</button>
      <button>Next</button>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Why not a &lt;div&gt; wrapper?</Styled.H2>
                <Styled.List>
                    <li><b>Layout:</b> extra wrappers can break CSS grid/flex gaps or inflow.</li>
                    <li><b>Semantics:</b> invalid HTML like <Styled.InlineCode>{`<ul><div>...</div></ul>`}</Styled.InlineCode>.</li>
                    <li><b>A11y:</b> screen readers may announce extra landmarks/regions unnecessarily.</li>
                    <li><b>Performance:</b> fewer DOM nodes = less work for layout/paint (small but real).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Shorthand vs explicit fragment</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Shorthand:</b> <Styled.InlineCode>{`<>...</>`}</Styled.InlineCode> is concise, no import needed.
                    </li>
                    <li>
                        <b>Explicit:</b> <Styled.InlineCode>{`<React.Fragment>...</React.Fragment>`}</Styled.InlineCode> (or <Styled.InlineCode>{`<Fragment>`}</Styled.InlineCode> if imported) is required when a <b>key</b> is needed.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Needs a key? Use explicit form:
items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
));`}
                </Styled.Pre>
                <Styled.Small>Shorthand fragments <b>cannot</b> take keys or attributes.</Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Table pattern (no illegal wrappers)</Styled.H2>
                <p>
                    When rendering rows/cells, a wrapper <code>div</code> is invalid inside
                    <code>table</code>. Fragments solve it cleanly.
                </p>
                <Styled.Pre>
                    {`function Cells({ product }) {
  return (
    <>
      <td>{product.name}</td>
      <td>{product.price}</td>
      <td>{product.stock}</td>
    </>
  );
}

function Table({ products }) {
  return (
    <table>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <Cells product={p} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Returning multiple siblings from a component</Styled.H2>
                <p>
                    React components must return one parent. Fragments are the lightest
                    way to return siblings.
                </p>
                <Styled.Pre>
                    {`function ProfileHeader({ user }) {
  return (
    <>
      <h2>{user.name}</h2>
      <p>{user.title}</p>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Conditional rendering with fragments</Styled.H2>
                <Styled.Pre>
                    {`// Group multiple elements in a branch without a wrapper node
{isError ? (
  <>
    <h4>Error</h4>
    <p>{error.message}</p>
  </>
) : (
  <>
    <h4>Loaded</h4>
    <List items={data} />
  </>
)}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Fragments vs arrays</Styled.H2>
                <Styled.List>
                    <li>
                        Returning an <b>array</b> of elements is valid but requires commas and
                        keys on each element—less readable than fragments for most cases.
                    </li>
                    <li>
                        Fragments read like normal JSX; use explicit fragments for keyed
                        groups inside a <Styled.InlineCode>map</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Array form (valid, but noisy)
return [
  <h4 key="t">Title</h4>,
  <p key="p">Content</p>
];`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>What fragments can’t do</Styled.H2>
                <Styled.List>
                    <li>
                        No <b>attributes</b> (except <Styled.InlineCode>key</Styled.InlineCode> on explicit fragments).
                        You cannot set <Styled.InlineCode>className</Styled.InlineCode>, <Styled.InlineCode>style</Styled.InlineCode>, or event handlers on a fragment.
                    </li>
                    <li>
                        No <b>ref</b> target—there’s no DOM node. If a ref or class is needed, use a real element.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use fragments to avoid extra DOM wrappers.</li>
                    <li><b>Do</b> use <Styled.InlineCode>{`<React.Fragment key={...}>`}</Styled.InlineCode> for keyed groups in lists.</li>
                    <li><b>Do</b> use fragments inside tables where <code>div</code> would be invalid.</li>
                    <li><b>Don’t</b> try to style a fragment; use a semantic wrapper if styles or roles are needed.</li>
                    <li><b>Don’t</b> use shorthand <Styled.InlineCode>{`<>`}</Styled.InlineCode> when a key is required—switch to explicit form.</li>
                    <li><b>Don’t</b> wrap list items for <code>ul/ol</code>—children must be <code>li</code>; fragments are for grouping siblings, not replacing required semantics.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Fragments group siblings without extra DOM. Use shorthand for
                simple grouping; switch to explicit fragments when a key is required
                (maps, definition lists, table cells). Prefer fragments over wrapper
                divs to preserve layout and semantics.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Fragments;
