import React from "react";
import { Styled } from "./styled";

const Reconciliation = () => {
    return (
        <Styled.Page>
            <Styled.Title>Reconciliation</Styled.Title>
            <Styled.Lead>
                Reconciliation is React's process of comparing the previous UI tree with
                the next one and applying the minimal DOM changes. Keys and element
                identity determine whether parts of the tree are <b>updated</b> or
                <b> remounted</b>.
            </Styled.Lead>

            {/* 1. Definition */}
            <Styled.Section>
                <Styled.H2>Definition</Styled.H2>
                <Styled.List>
                    <li>
                        React keeps a previous “virtual” tree. On state/prop changes, a new tree is produced.
                    </li>
                    <li>
                        React diffs both trees to decide: update a node in place, move it, insert a new one, or remove it.
                    </li>
                    <li>
                        Decisions are local and fast (heuristics) → performance is generally <b>O(n)</b> per list of siblings.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2. Matching rules */}
            <Styled.Section>
                <Styled.H2>How nodes are matched</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Same type → update</b>: For DOM elements (e.g., <Styled.InlineCode>&lt;div/&gt;</Styled.InlineCode>),
                        React updates attributes and keeps the underlying node. For components (e.g., <Styled.InlineCode>&lt;Card/&gt;</Styled.InlineCode>), React calls the function again with new props.
                    </li>
                    <li>
                        <b>Different type → remount</b>: Changing <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode> to <Styled.InlineCode>&lt;span&gt;</Styled.InlineCode>, or <Styled.InlineCode>&lt;Card/&gt;</Styled.InlineCode> to <Styled.InlineCode>&lt;Profile/&gt;</Styled.InlineCode>,
                        unmounts the old subtree and mounts a new one (local state lost).
                    </li>
                    <li>
                        <b>Text nodes</b> update when the string changes; they remount if replaced by a different element type.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Same type: patch in place
<div title="A" />   // prev
<div title="B" />   // next → updates title only

// Different type: remount subtree
<div />             // prev
<span />            // next → <div> removed, <span> created`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3. Keys & sibling identity */}
            <Styled.Section>
                <Styled.H2>Keys control identity among siblings</Styled.H2>
                <Styled.List>
                    <li>
                        Keys are compared only among <b>siblings</b>. They tell React which item is which across renders.
                    </li>
                    <li>
                        With correct keys, React can <b>move</b> nodes instead of destroying and recreating them.
                    </li>
                    <li>
                        Missing/unstable keys (e.g., array index) cause mismatches: state jumps rows, focus is lost, inputs reset.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good: stable IDs
const rows = data.map(item => <Row key={item.id} item={item} />);

// Bad: index as key (reorder/filter/insert will break identity)
const rows = data.map((item, i) => <Row key={i} item={item} />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4. Re-render vs remount */}
            <Styled.Section>
                <Styled.H2>Re-render vs Remount</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Re-render:</b> the component function runs again to produce new JSX; local state and refs are preserved as long as identity (type + key) is the same.
                    </li>
                    <li>
                        <b>Remount:</b> the old instance unmounts and a new one mounts; local state, DOM state, and refs are reset.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Same identity → re-render (state preserved)
<Card key={user.id} user={user} />

// Different identity → remount (state reset)
<Card key={user.id} />  →  <Profile key={user.id} />    // type changed
<Card key={v1} />       →  <Card key={v2} />            // key changed`}
                </Styled.Pre>
                <Styled.Small>
                    Changing <Styled.InlineCode>key</Styled.InlineCode> is the standard way to intentionally force a remount.
                </Styled.Small>
            </Styled.Section>

            {/* 5. Common tree-shape pitfalls */}
            <Styled.Section>
                <Styled.H2>Tree-shape pitfalls (accidental remounts)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Wrapper type changes:</b> toggling between <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode> and <Styled.InlineCode>&lt;section&gt;</Styled.InlineCode> remounts children.
                    </li>
                    <li>
                        <b>Moving nodes across parents:</b> if an item's parent changes, React may recreate it unless keys and structure allow a move.
                    </li>
                    <li>
                        <b>Conditional wrappers:</b> adding/removing an extra wrapper element changes type/position → remount and state loss.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Wrapper type toggles cause remounts
{asSection ? <section><List /></section> : <div><List /></div>}

// ✅ Keep type stable; toggle role/class instead
<section aria-label={label} className={cls}>
  <List />
</section>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6. Lists: preserving state on reorder */}
            <Styled.Section>
                <Styled.H2>Lists: preserving state during insert/remove/reorder</Styled.H2>
                <Styled.List>
                    <li>
                        Use a stable, unique key per item (DB id, slug). Avoid index keys when items can move.
                    </li>
                    <li>
                        Keep item-local state <b>inside</b> the keyed component so identity sticks with the data.
                    </li>
                    <li>
                        When transforming arrays (filter, sort, splice), return new arrays (immutable updates).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Row({ item }) {
  const [text, setText] = React.useState(item.name); // preserved when key is stable
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

{items.map(item => <Row key={item.id} item={item} />)}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7. Controlled vs uncontrolled and remounts */}
            <Styled.Section>
                <Styled.H2>Inputs: controlled vs uncontrolled and remounts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled</b> inputs store value in React state; remount resets state unless lifted.
                    </li>
                    <li>
                        <b>Uncontrolled</b> inputs hold value in the DOM; remount clears DOM value.
                    </li>
                    <li>
                        Preserve identity where input state must survive; remount only when a reset is intended.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8. Parent re-render and child updates */}
            <Styled.Section>
                <Styled.H2>When children update</Styled.H2>
                <Styled.List>
                    <li>
                        A parent re-render normally re-renders children (render ≠ DOM change). Use <Styled.InlineCode>React.memo</Styled.InlineCode> for pure children that can skip renders when props are equal.
                    </li>
                    <li>
                        Context updates re-render all consumers below the provider.
                    </li>
                    <li>
                        Re-rendering is cheap; avoid premature micro-optimizations—optimize hotspots found via Profiler.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const Row = React.memo(function Row({ item }) {
  // renders only when 'item' prop changes by shallow compare
  return <li>{item.name}</li>;
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9. Forcing remount intentionally */}
            <Styled.Section>
                <Styled.H2>Forcing a remount (when needed)</Styled.H2>
                <Styled.List>
                    <li>
                        Change the <Styled.InlineCode>key</Styled.InlineCode> to reset component state (e.g., reset a form after submit).
                    </li>
                    <li>
                        Use sparingly—most resets can be handled by updating state.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Reset form by bumping key
<Form key={formVersion} initial={defaults} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10. Performance notes */}
            <Styled.Section>
                <Styled.H2>Performance notes</Styled.H2>
                <Styled.List>
                    <li>Keep component types stable across states; prefer toggling props/classes to swapping tags.</li>
                    <li>Use stable keys for lists to avoid unnecessary remounts and state loss.</li>
                    <li>Extract heavy computations outside render; memoize derived values when they're expensive.</li>
                    <li>For very long lists, use virtualization; reconciliation then operates on a small visible window.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11. Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep element types stable across conditional branches when possible.</li>
                    <li><b>Do</b> use stable keys (IDs) for lists; place the key on the element returned by <Styled.InlineCode>map</Styled.InlineCode>.</li>
                    <li><b>Do</b> localize state inside the keyed component so identity travels with the data item.</li>
                    <li><b>Don't</b> use array index as a key for dynamic lists (reorder/insert/remove).</li>
                    <li><b>Don't</b> switch wrapper types casually; it triggers remounts and loses state/focus.</li>
                    <li><b>Don't</b> over-optimize renders without profiling—optimize the hotspots first.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: reconciliation preserves nodes when type and key are stable, and remounts when identity changes.
                Stable keys and consistent tree shapes keep state and focus where they belong, while enabling React to
                update only what changed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Reconciliation;
