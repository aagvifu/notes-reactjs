import React from "react";
import { Styled } from "./styled";

const ListsKeys = () => {
    return (
        <Styled.Page>
            <Styled.Title>Lists &amp; Keys</Styled.Title>
            <Styled.Lead>
                Rendering arrays is straightforward with <Styled.InlineCode>Array.map</Styled.InlineCode>.
                The important part is choosing the right <b>key</b> so React can keep item identity
                stable across renders.
            </Styled.Lead>

            {/* Definition */}
            <Styled.Section>
                <Styled.H2>Definition</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>key</b> is a stable identifier for a list item among its siblings.
                        React uses keys to match previous items to next items during updates.
                    </li>
                    <li>
                        Keys are not visible to children as props; they are only used by React’s
                        reconciliation. If the child needs an ID, pass one explicitly (e.g., <Styled.InlineCode>itemId</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Basic mapping */}
            <Styled.Section>
                <Styled.H2>Mapping arrays (basic)</Styled.H2>
                <Styled.Pre>
                    {`const users = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Linus" },
];

<ul>
  {users.map(u => (
    <li key={u.id}>{u.name}</li>  // use a stable, unique key per sibling
  ))}
</ul>`}
                </Styled.Pre>
                <Styled.Small>
                    Keys must be <b>unique among siblings</b>, not globally unique in the entire app.
                </Styled.Small>
            </Styled.Section>

            {/* Why keys matter */}
            <Styled.Section>
                <Styled.H2>Why keys matter (identity, not order)</Styled.H2>
                <p>
                    With correct keys, React updates only what changed. With bad keys (or index keys),
                    React may <em>remount</em> items unnecessarily—losing focus, resetting local state,
                    or mixing user input across rows.
                </p>
            </Styled.Section>

            {/* Index as key */}
            <Styled.Section>
                <Styled.H2>Should array index be a key?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Avoid</b> index as key when the list can reorder, filter, insert in the middle,
                        or delete—index changes will rename identities.
                    </li>
                    <li>
                        <b>Acceptable</b> when the list is truly static (never reorders, never filters),
                        or when items are append-only and purely presentational.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Using index: edits can jump rows after sorting/removal
items.map((item, i) => <Row key={i} item={item} />);

// ✅ Use a domain ID (DB id, slug, stable hash)
items.map((item) => <Row key={item.id} item={item} />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* Reordering pitfall demo */}
            <Styled.Section>
                <Styled.H2>Reordering pitfall (why index breaks state)</Styled.H2>
                <Styled.Pre>
                    {`// Each Row has local input state
function Row({ item }) {
  const [text, setText] = React.useState(item.name);
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

// If keys are indexes, and you sort the list,
// React reuses DOM nodes for new positions → text moves to wrong rows.
// Use a stable key like item.id to keep each Row instance paired to the right item.`}
                </Styled.Pre>
            </Styled.Section>

            {/* Key location & nested lists */}
            <Styled.Section>
                <Styled.H2>Where to place the key</Styled.H2>
                <Styled.List>
                    <li>Put the key on the <b>immediate child</b> of the array you’re returning.</li>
                    <li>For nested maps, each level needs its own keys for its siblings.</li>
                    <li>Fragments can carry keys when returning multiple siblings from <Styled.InlineCode>map</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Correct: key at the element returned by 'map'
rows.map(row => (
  <tr key={row.id}>
    {row.cells.map(cell => (
      <td key={cell.id}>{cell.value}</td>
    ))}
  </tr>
));

// Grouped siblings with a keyed Fragment
list.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.desc}</dd>
  </React.Fragment>
));`}
                </Styled.Pre>
            </Styled.Section>

            {/* Choosing a key */}
            <Styled.Section>
                <Styled.H2>Choosing a good key</Styled.H2>
                <Styled.List>
                    <li><b>Best:</b> a stable domain identifier (DB id, slug, UUID from server).</li>
                    <li>
                        <b>Generated once and stored with data</b> is OK (e.g., assign an <em>id</em> when creating items client-side).
                    </li>
                    <li>
                        <b>Avoid:</b> transient values like <Styled.InlineCode>Math.random()</Styled.InlineCode> on every render—this forces remounts.
                    </li>
                    <li>
                        <b>Don’t</b> use <Styled.InlineCode>useId</Styled.InlineCode> as a list key—<em>useId</em> is for stable accessibility IDs per component, not for identifying external list items.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Immutable updates */}
            <Styled.Section>
                <Styled.H2>Updating list state (immutable)</Styled.H2>
                <p>Keep arrays immutable so React sees a new reference and can reconcile efficiently.</p>
                <Styled.Pre>
                    {`// Add
setItems(prev => [...prev, newItem]);

// Remove
setItems(prev => prev.filter(x => x.id !== removeId));

// Update
setItems(prev => prev.map(x => x.id === edit.id ? { ...x, ...edit } : x));

// Reorder (drag & drop)
setItems(prev => reorder(prev, startIndex, endIndex));`}
                </Styled.Pre>
                <Styled.Small>
                    Mutating in place (e.g., <code>splice</code> on the existing array) can cause subtle bugs;
                    create a new array instead.
                </Styled.Small>
            </Styled.Section>

            {/* Keys & performance / virtualization */}
            <Styled.Section>
                <Styled.H2>Performance notes</Styled.H2>
                <Styled.List>
                    <li>
                        For very long lists, consider virtualization (<em>react-window</em>, <em>react-virtual</em>).
                        Keys still matter—use stable IDs for rows.
                    </li>
                    <li>
                        Avoid heavy computations inside <Styled.InlineCode>map</Styled.InlineCode>; compute derived data once above.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use stable domain IDs as keys.</li>
                    <li><b>Do</b> put keys on the element returned by the <Styled.InlineCode>map</Styled.InlineCode>.</li>
                    <li><b>Do</b> use keyed fragments for multi-sibling groups in a loop.</li>
                    <li><b>Don’t</b> use array index if the list can reorder, filter, insert, or delete.</li>
                    <li><b>Don’t</b> generate random keys per render—this defeats reconciliation.</li>
                    <li><b>Don’t</b> expect <Styled.InlineCode>props.key</Styled.InlineCode> in children—pass a real prop if the child needs an ID.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: mapping is easy; choosing keys is the real work. Prefer stable IDs, avoid index keys for dynamic lists,
                place keys at the correct level, and keep updates immutable so React can preserve each item’s identity.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ListsKeys;
