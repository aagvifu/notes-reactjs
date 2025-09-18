import { Styled } from "./styled";

const KeysStrategy = () => {
    return (
        <Styled.Page>
            <Styled.Title>Keys Strategy</Styled.Title>

            <Styled.Lead>
                <b>Keys</b> give a stable <b>identity</b> to list items so React can match “old children" to
                “new children" during <b>reconciliation</b>. The right keys preserve component state and avoid
                unnecessary unmounts/remounts; the wrong keys (like array indexes) can cause visual glitches
                and state mix-ups when items are inserted, removed, or reordered.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Key:</b> a string/number you attach to each child in a list (<Styled.InlineCode>key</Styled.InlineCode> prop) that uniquely identifies it among its siblings.</li>
                    <li><b>Identity:</b> the conceptual “same item across renders." Keys tell React which item is which, even if its index changes.</li>
                    <li><b>Reconciliation:</b> React's process of diffing previous children with next children to decide what to update, keep, or remove.</li>
                    <li><b>Preserving state:</b> when React recognizes an item as the same (same element type + same key), it keeps the child component's state.</li>
                    <li><b>Remount:</b> if React can't match a child by key+type, it unmounts the old and mounts a new one, resetting local state and effects.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why keys matter */}
            <Styled.Section>
                <Styled.H2>Why Keys Matter</Styled.H2>
                <Styled.List>
                    <li><b>Correctness:</b> Prevents state from jumping to the wrong row after insert/remove/reorder.</li>
                    <li><b>Performance:</b> Enables minimal DOM changes (only moved/updated nodes change).</li>
                    <li><b>Predictability:</b> Stable keys make UI updates easier to reason about and debug.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Good keys vs bad keys */}
            <Styled.Section>
                <Styled.H2>Good Keys vs. Bad Keys</Styled.H2>
                <Styled.List>
                    <li><b>Good:</b> stable IDs from your data (e.g., database id, slug, UUID generated at creation time and stored in data).</li>
                    <li><b>Sometimes OK:</b> a <em>composite key</em> like <Styled.InlineCode>{'`${user.id}:${todo.id}`'}</Styled.InlineCode> if a single stable id doesn't exist.</li>
                    <li><b>Bad:</b> <b>array index</b> as key when the list can change order or length; state may stick to the wrong item.</li>
                    <li><b>Bad:</b> <b>random keys on each render</b> (e.g., <Styled.InlineCode>Math.random()</Styled.InlineCode>)-forces remount every time.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Basic example with stable keys */}
            <Styled.Section>
                <Styled.H2>Example: Stable Keys from Data</Styled.H2>
                <Styled.Pre>
                    {`const users = [
  { id: "u1", name: "Aarav" },
  { id: "u2", name: "Diya" },
  { id: "u3", name: "Kabir" },
];

export default function UserList() {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li> // ✅ stable key
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keys must be <i>unique among siblings</i>, not globally unique. Siblings refer to children
                    of the same parent in that render.
                </Styled.Small>
            </Styled.Section>

            {/* 5) The index-key pitfall (insertion) */}
            <Styled.Section>
                <Styled.H2>Index Key Pitfall: Inserting in the Middle</Styled.H2>
                <Styled.List>
                    <li>
                        When you use <b>index as key</b>, inserting an item shifts indexes and React incorrectly
                        “reuses" DOM/state for the wrong items.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function TodoList({ todos, onToggle }) {
  // ❌ index as key (fragile if you insert/remove/reorder)
  return todos.map((todo, i) => (
    <label key={i}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </label>
  ));
}

/* Insert a todo at position 0 -> all subsequent items get different indexes,
   so their inputs may keep the wrong "checked" state or cursor position. */`}
                </Styled.Pre>
                <Styled.Pre>
                    {`function TodoList({ todos, onToggle }) {
  // ✅ stable key from data
  return todos.map((todo) => (
    <label key={todo.id}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </label>
  ));
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Reordering example */}
            <Styled.Section>
                <Styled.H2>Reordering Example (Drag &amp; Drop)</Styled.H2>
                <Styled.List>
                    <li>Reordering changes positions but not identities. With stable keys, React just moves nodes.</li>
                    <li>With index keys, React can mismatch items; local state (like input text) follows the index, not the item.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ✅ Stable keys: items carry state correctly when reordered
function DraggableList({ items }) {
  return items.map((item) => (
    <div key={item.id} className="row">
      <input defaultValue={item.label} />
    </div>
  ));
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Controlled inputs & preserving state */}
            <Styled.Section>
                <Styled.H2>Controlled Inputs & Preserving State</Styled.H2>
                <Styled.List>
                    <li>
                        Controlled inputs (<Styled.InlineCode>value</Styled.InlineCode> + <Styled.InlineCode>onChange</Styled.InlineCode>) rely on keys to keep their identity.
                    </li>
                    <li>If a component should reset on some change, you can intentionally <b>change its key</b> to force a remount.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ✅ Force remount (reset) when "mode" changes by changing key
function Editor({ mode }) {
  return <TextArea key={mode} mode={mode} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Filtering/sorting and keys */}
            <Styled.Section>
                <Styled.H2>Filtering / Sorting</Styled.H2>
                <Styled.List>
                    <li>Filtering or sorting doesn't change an item's identity-keep the same <b>data ID</b> key.</li>
                    <li>Do not derive keys from the current index after sort/filter; use the underlying stable id.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Sorted({ items }) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return sorted.map((it) => <div key={it.id}>{it.name}</div>); // ✅
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Fragments, unique scope, and where keys live */}
            <Styled.Section>
                <Styled.H2>Where Keys Live (and Fragments)</Styled.H2>
                <Styled.List>
                    <li>Keys are read on the <b>direct children</b> you return from a map. Put keys on the element you return in the loop.</li>
                    <li>You can key a <Styled.InlineCode>{'<React.Fragment>'}</Styled.InlineCode> when you don't want extra DOM.</li>
                    <li>Uniqueness is required <i>per list</i>. The same key can appear in a different sibling group.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ✅ Keyed fragment when you don't want an extra wrapper div
items.map((it) => (
  <React.Fragment key={it.id}>
    <dt>{it.term}</dt>
    <dd>{it.desc}</dd>
  </React.Fragment>
));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) When index as key is acceptable */}
            <Styled.Section>
                <Styled.H2>When Can I Use Index as Key?</Styled.H2>
                <Styled.List>
                    <li>The list is <b>truly static</b> (no insert/remove/reorder),</li>
                    <li>and items have <b>no local state</b> (no inputs, no animations tied to identity),</li>
                    <li>and you're rendering a <b>one-off</b> list (e.g., mapping an enum to static labels).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// 😌 Okay: static, no state, never reorders
const days = ["Mon","Tue","Wed","Thu","Fri"];
days.map((d, i) => <li key={i}>{d}</li>);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Debugging keys */}
            <Styled.Section>
                <Styled.H2>Debugging Keys</Styled.H2>
                <Styled.List>
                    <li>React warns: <i>“Each child in a list should have a unique 'key' prop."</i></li>
                    <li>Check for <b>duplicates</b> or <b>missing</b> keys, and ensure the key comes from stable data.</li>
                    <li>In dev, log keys while mapping to verify stability.</li>
                </Styled.List>
                <Styled.Pre>
                    {`items.map((it) => {
  console.log("key", it.id);
  return <Row key={it.id} {...it} />;
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Stable identifier:</b> a value that uniquely and consistently represents the same data item across renders.</li>
                    <li><b>Remount:</b> unmount old component and mount a new one (state/effects reset).</li>
                    <li><b>Reorder:</b> change item positions while keeping the same items (identities).</li>
                    <li><b>Composite key:</b> a key formed by combining stable properties (e.g., <Styled.InlineCode>{'`${rowId}:${colId}`'}</Styled.InlineCode>).</li>
                    <li><b>Sibling group:</b> the set of children under the same parent in a single render.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Rule of thumb:</b> Use a stable ID from your data as the key. Avoid array indexes unless the list
                is static and stateless. Stable keys preserve state correctly and help React update only what changed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default KeysStrategy;
