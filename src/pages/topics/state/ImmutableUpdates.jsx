import React from "react";
import { Styled } from "./styled";

const ImmutableUpdates = () => {
    return (
        <Styled.Page>
            <Styled.Title>Immutable Updates</Styled.Title>
            <Styled.Lead>
                Treat React state as <b>immutable</b>: never modify existing objects/arrays in place.
                Always create a <b>new</b> object/array with the desired changes. React relies on
                <b> referential equality</b> to detect updates and re-render efficiently.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Mutation:</b> changing an existing object/array in place (same reference, different contents).</li>
                    <li><b>Immutability:</b> once created, a value is not changed; updates produce a new value.</li>
                    <li><b>Referential equality:</b> <Styled.InlineCode>a === b</Styled.InlineCode> checks if two references point to the same object.</li>
                    <li><b>Structural sharing:</b> a new object reuses unchanged parts of the old structure (e.g., spreading and changing one field).</li>
                    <li><b>Shallow copy:</b> copies only the top level (e.g., <Styled.InlineCode>{`{ ...obj }`}</Styled.InlineCode>, <Styled.InlineCode>[...arr]</Styled.InlineCode>).</li>
                    <li><b>Deep copy:</b> recursively copies nested data (use sparingly; often unnecessary and expensive).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why immutability matters in React */}
            <Styled.Section>
                <Styled.H2>Why immutability matters</Styled.H2>
                <Styled.List>
                    <li>React decides to re-render based on identity changes. Mutating in place keeps the same identity → React may not re-render.</li>
                    <li>Pure optimizations (<Styled.InlineCode>React.memo</Styled.InlineCode>, dependency arrays, <Styled.InlineCode>useMemo</Styled.InlineCode>) compare references; immutable updates keep these comparisons cheap.</li>
                    <li>Time-travel debugging, undo/redo, and predictable updates are simpler with immutable data.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Mutating in place (no new reference)
const [user, setUser] = React.useState({ name: "Ada", points: 0 });
function addPointBad() {
  user.points += 1;     // mutation
  setUser(user);        // same object reference → React may skip re-render
}

// ✅ Immutable update (new reference)
function addPointGood() {
  setUser(prev => ({ ...prev, points: prev.points + 1 }));
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Object update recipes */}
            <Styled.Section>
                <Styled.H2>Object update recipes</Styled.H2>
                <Styled.Pre>
                    {`// Replace a field
setUser(prev => ({ ...prev, name: "Grace" }));

// Add/remove a field
setUser(prev => {
  const { temp, ...rest } = prev;     // remove 'temp'
  return { ...rest, nick: "g.hopper" }; // add 'nick'
});

// Update nested object (one level)
setState(prev => ({
  ...prev,
  profile: { ...prev.profile, bio: "Debugger pioneer" }
}));

// Deeply nested (consider normalizing or a reducer)
setState(prev => ({
  ...prev,
  company: {
    ...prev.company,
    address: { ...prev.company.address, city: "London" }
  }
}));`}
                </Styled.Pre>
                <Styled.Small>
                    For deeply nested updates, consider <b>normalizing</b> shape (store by ID) or using a reducer/Immer for ergonomics.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Array update recipes */}
            <Styled.Section>
                <Styled.H2>Array update recipes</Styled.H2>
                <Styled.List>
                    <li><b>Mutation methods:</b> push, pop, shift, unshift, splice, sort, reverse.</li>
                    <li><b>Immutable alternatives:</b> concat, slice, map, filter, reduce, toSorted, toReversed, with.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const [todos, setTodos] = React.useState([
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Code", done: false },
]);

// Add
setTodos(prev => [...prev, { id: 3, text: "Sleep", done: false }]);
// or: prev.concat(newItem)

// Remove by id
setTodos(prev => prev.filter(t => t.id !== 2));

// Update by id
setTodos(prev => prev.map(t => t.id === 1 ? { ...t, done: true } : t));

// Insert at index
setTodos(prev => {
  const next = prev.slice();
  next.splice(1, 0, { id: 9, text: "Snack", done: false });
  return next;
});

// Sort without mutating the original
setTodos(prev => [...prev].sort((a, b) => a.text.localeCompare(b.text)));
// Modern (if available): prev.toSorted((a, b) => a.text.localeCompare(b.text));

// Reverse without mutation
setTodos(prev => [...prev].reverse());
// Modern: prev.toReversed();

// Replace a single index (ECMAScript 2023 'with')
setTodos(prev => prev.with(0, { ...prev[0], done: true }));`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Array.sort</b> and <b>Array.reverse</b> mutate in place. Copy first (or use <b>toSorted</b>/<b>toReversed</b> in modern runtimes).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Maps, Sets, Dates and other mutable types */}
            <Styled.Section>
                <Styled.H2>Maps, Sets, Dates (mutable types)</Styled.H2>
                <Styled.Pre>
                    {`// Map/Set: create a new container to change contents
const [ids, setIds] = React.useState(() => new Set([1, 2]));

function addId(id) {
  setIds(prev => {
    const next = new Set(prev); // copy
    next.add(id);               // mutate the copy
    return next;                // new reference
  });
}

// Date: store timestamp (number) instead of mutating a Date object
setState(prev => ({ ...prev, lastSeen: Date.now() }));`}
                </Styled.Pre>
                <Styled.Small>
                    Avoid mutating objects created once and reused across renders. Store primitives or new copies to preserve identity.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Avoid deep cloning by default */}
            <Styled.Section>
                <Styled.H2>Avoid deep cloning by default</Styled.H2>
                <Styled.List>
                    <li>Deep clones are slow and unnecessary for most updates—only the changed paths need new objects.</li>
                    <li><Styled.InlineCode>JSON.parse(JSON.stringify(...))</Styled.InlineCode> drops functions, <Styled.InlineCode>undefined</Styled.InlineCode>, Dates, Maps/Sets.</li>
                    <li>Prefer <b>structural sharing</b> (spread on each level being changed).</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Using reducers or Immer (optional) */}
            <Styled.Section>
                <Styled.H2>Reducers or Immer (optional ergonomics)</Styled.H2>
                <Styled.Pre>
                    {`// useReducer centralizes updates
function reducer(state, action) {
  switch (action.type) {
    case "toggle":
      return {
        ...state,
        items: state.items.map(x => x.id === action.id ? { ...x, done: !x.done } : x)
      };
    default:
      return state;
  }
}
const [state, dispatch] = React.useReducer(reducer, { items: [] });

// Immer (if installed): write "mutations", produce immutably
// import { produce } from "immer";
// setState(prev => produce(prev, draft => { draft.count += 1; }));`}
                </Styled.Pre>
                <Styled.Small>
                    Immer handles structural sharing automatically; use it for complex nested updates or reducers.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Effects, memo, and referential equality */}
            <Styled.Section>
                <Styled.H2>Effects, memo, and referential equality</Styled.H2>
                <Styled.List>
                    <li>Passing <b>new</b> objects/arrays every render makes memoized children re-render. Memoize derived props with <Styled.InlineCode>useMemo</Styled.InlineCode> when needed.</li>
                    <li>Dependency arrays compare references; ensure stable references for values that should not retrigger effects.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const columns = React.useMemo(() => [{ key: "name" }, { key: "done" }], []); // stable
// <Table columns={columns} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Debugging mutations */}
            <Styled.Section>
                <Styled.H2>Debugging accidental mutations</Styled.H2>
                <Styled.List>
                    <li>Watch for state updates that do nothing—often due to mutating then setting the same reference.</li>
                    <li>Freeze development data (<Styled.InlineCode>Object.freeze</Styled.InlineCode>) to catch mutations early (dev-only).</li>
                    <li>Check array helpers that mutate (<Styled.InlineCode>sort</Styled.InlineCode>, <Styled.InlineCode>reverse</Styled.InlineCode>, <Styled.InlineCode>splice</Styled.InlineCode>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Dev helper to catch mutations (throwing early)
const dev = process.env.NODE_ENV !== "production";
const initial = dev ? Object.freeze({ name: "Ada" }) : { name: "Ada" };`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Calling <Styled.InlineCode>push</Styled.InlineCode>/<Styled.InlineCode>sort</Styled.InlineCode>/<Styled.InlineCode>reverse</Styled.InlineCode> directly on state arrays.</li>
                    <li>Mutating nested objects without creating new parents, leading to missed re-renders.</li>
                    <li>Storing both raw and derived copies in state (drift). Derive instead.</li>
                    <li>Deep cloning everything for “safety” (slow); prefer targeted shallow copies on changed paths.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> create new objects/arrays for updates; use spread or helpers.</li>
                    <li><b>Do</b> copy only the levels you change (structural sharing).</li>
                    <li><b>Do</b> memoize derived props passed to memoized children.</li>
                    <li><b>Don’t</b> mutate in place and then call the setter with the same reference.</li>
                    <li><b>Don’t</b> sort/reverse arrays without copying first.</li>
                    <li><b>Don’t</b> deep clone by default; it’s slow and often unnecessary.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: immutable updates keep React predictable and performant. Update by returning new objects/arrays,
                copy only what’s changed, avoid mutating helpers, and rely on structural sharing and memoization when needed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ImmutableUpdates;
