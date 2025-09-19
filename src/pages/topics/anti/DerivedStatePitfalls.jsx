import { Styled } from "./styled";

const DerivedStatePitfalls = () => {
    return (
        <Styled.Page>
            <Styled.Title>Derived State Pitfalls</Styled.Title>

            <Styled.Lead>
                <b>Derived state</b> is any piece of state you store that can be calculated from
                <i> something you already have</i> (props, other state). Keeping both the computed value
                and its inputs often creates <b>drift</b> (they fall out of sync), <b>bugs</b>, and
                <b>unnecessary re-renders</b>. Prefer <b>compute on the fly</b> or memoize instead of storing.
            </Styled.Lead>

            {/* Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Derived state:</b> a stored value that can be calculated from existing data
                        (e.g., <Styled.InlineCode>fullName = first + " " + last</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Source of truth:</b> the single, authoritative place a piece of data lives
                        (a prop, a state variable, a store). Everything else should derive from it.
                    </li>
                    <li>
                        <b>Drift:</b> when two representations of the same data stop matching
                        (e.g., cached total doesn't reflect updated items).
                    </li>
                    <li>
                        <b>Memoization:</b> caching the <i>result</i> of a calculation
                        (using <Styled.InlineCode>useMemo</Styled.InlineCode>) so it recomputes only when inputs change.
                    </li>
                    <li>
                        <b>Controlled vs Uncontrolled (forms):</b> controlled inputs mirror state and update on every change;
                        uncontrolled inputs let the DOM keep the value and you read it when needed (via refs/defaultValue).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Anti-pattern: copying props into state */}
            <Styled.Section>
                <Styled.H2>1) Anti-pattern: Copying props into state</Styled.H2>
                <Styled.Small>
                    If a value comes from props, don't mirror it into local state just to read it.
                    You'll have two sources that can disagree.
                </Styled.Small>
                <Styled.Pre>
                    {`// ❌ Anti-pattern: local state duplicates a prop
function PriceTag({ price }) {
  const [displayPrice, setDisplayPrice] = React.useState(price); // duplicated

  // Parent updates price → displayPrice may not update correctly
  // unless we add synchronization logic... which is fragile.

  return <span>{displayPrice.toFixed(2)}</span>;
}

// ✅ Prefer deriving directly from props (no extra state)
function PriceTagFixed({ price }) {
  const formatted = price.toFixed(2);
  return <span>{formatted}</span>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Storing <i>displayPrice</i> adds drift risk. Compute the formatted number each render.
                </Styled.Small>
            </Styled.Section>

            {/* 2) Anti-pattern: storing filtered/derived collections */}
            <Styled.Section>
                <Styled.H2>2) Anti-pattern: Storing filtered or computed collections</Styled.H2>
                <Styled.List>
                    <li>Don't store <i>filteredItems</i>, <i>sortedItems</i>, <i>total</i> if you can compute them.</li>
                    <li>Use <Styled.InlineCode>useMemo</Styled.InlineCode> if the computation is heavy.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Anti-pattern: keep a filtered copy in state
function List({ items, query }) {
  const [filtered, setFiltered] = React.useState([]);

  React.useEffect(() => {
    setFiltered(items.filter(i => i.name.includes(query)));
  }, [items, query]);

  return filtered.map(i => <div key={i.id}>{i.name}</div>);
}

// ✅ Compute on the fly (memoize if needed)
function ListFixed({ items, query }) {
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q));
  }, [items, query]);

  return filtered.map(i => <div key={i.id}>{i.name}</div>);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Forms: when you DO need a local copy (draft) */}
            <Styled.Section>
                <Styled.H2>3) Forms: The valid exception — “local draft”</Styled.H2>
                <Styled.List>
                    <li>
                        You often need a <b>draft</b> copy of incoming data for editing.
                        This is okay because the user is intentionally diverging from the source until they save.
                    </li>
                    <li>
                        Initialize once when the <b>entity identity</b> changes (e.g., <Styled.InlineCode>user.id</Styled.InlineCode>).
                        Avoid re-initializing on every prop change.
                    </li>
                    <li>
                        The draft becomes the new source of truth after save; or you discard it on cancel.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ✅ Pattern: reset draft when the entity (user.id) changes
function ProfileEditor({ user }) {
  const [draft, setDraft] = React.useState(user);

  // Reset only when switching to a different user
  React.useEffect(() => {
    setDraft(user);
  }, [user.id]); // key: depend on identity, not the entire object

  function onChange(e) {
    const { name, value } = e.target;
    setDraft(d => ({ ...d, [name]: value }));
  }

  return (
    <form>
      <input name="name" value={draft.name} onChange={onChange} />
      <input name="email" value={draft.email} onChange={onChange} />
      {/* Save/Cancel buttons */}
    </form>
  );
}

// 🔁 Alternative: key the subtree to force a full re-mount when the id changes
// <ProfileEditorInner key={user.id} user={user} />`}
                </Styled.Pre>
                <Styled.Small>
                    Depend on <b>identity</b> (like <i>user.id</i>), not the entire object, to avoid ping-pong resets.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Totals and counters */}
            <Styled.Section>
                <Styled.H2>4) Totals/Counters: compute, don't store</Styled.H2>
                <Styled.Pre>
                    {`// ❌ Anti-pattern: storing total invites drift
function Cart({ items }) {
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    setTotal(items.reduce((sum, it) => sum + it.price * it.qty, 0));
  }, [items]);
  // Any missed dependency or manual updates can desync total.
  return <div>Total: {total.toFixed(2)}</div>;
}

// ✅ Derive when rendering (memo if expensive)
function CartFixed({ items }) {
  const total = React.useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );
  return <div>Total: {total.toFixed(2)}</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) "Syncing" with effects: handle with care */}
            <Styled.Section>
                <Styled.H2>5) “Syncing” with <code>useEffect</code>: handle with care</Styled.H2>
                <Styled.List>
                    <li>
                        If you're writing an effect just to keep a duplicated value in sync, that's a smell.
                        Remove the duplication instead.
                    </li>
                    <li>
                        Use effects for <b>side effects</b> (network calls, subscriptions, DOM APIs), not for mirroring data.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Smell: effect used to keep duplicate in sync
function Badge({ count }) {
  const [shown, setShown] = React.useState(count);
  React.useEffect(() => setShown(count), [count]); // why duplicate at all?
  return <span>{shown}</span>;
}

// ✅ Just render from the prop
function BadgeFixed({ count }) {
  return <span>{count}</span>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) When storing derived state is acceptable */}
            <Styled.Section>
                <Styled.H2>6) When is storing derived state acceptable?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Snapshots:</b> you must freeze a value at a moment in time (e.g., log the price user saw
                        when they clicked “Buy”). Use a <Styled.InlineCode>ref</Styled.InlineCode> or store once.
                    </li>
                    <li>
                        <b>Heavy computation with external triggers only:</b> usually solved with
                        <Styled.InlineCode>useMemo</Styled.InlineCode>. If you truly need to <i>manually</i> recompute on
                        specific triggers, store and update <i>deliberately</i> with clear invariants.
                    </li>
                    <li>
                        <b>Bridging controlled ↔ uncontrolled:</b> temporarily hold a draft for form UX, as shown above.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: snapshot with ref (doesn't cause re-render)
function Checkout({ currentPrice }) {
  const clickedPriceRef = React.useRef(null);

  function onBuy() {
    if (clickedPriceRef.current == null) {
      clickedPriceRef.current = currentPrice; // snapshot once
    }
    // send clickedPriceRef.current to server...
  }

  return <button onClick={onBuy}>Buy</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Checklist */}
            <Styled.Section>
                <Styled.H2>Checklist</Styled.H2>
                <Styled.List>
                    <li>Can this value be computed from existing data? → <b>Don't store it.</b></li>
                    <li>Is there one clear source of truth? → <b>Keep it single.</b></li>
                    <li>Is the value expensive to compute? → Use <b>useMemo</b>.</li>
                    <li>Do you need a user-editable draft? → Store a <b>draft</b>, reset by <b>identity</b>.</li>
                    <li>Are you writing effects only to sync duplicates? → Remove the duplicate.</li>
                </Styled.List>
            </Styled.Section>

            {/* Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> compute display-only values at render time.</li>
                    <li><b>Do</b> memoize heavy calculations with <Styled.InlineCode>useMemo</Styled.InlineCode>.</li>
                    <li><b>Do</b> keep drafts for editing flows; reset by ID or component key.</li>
                    <li><b>Don't</b> copy props to state “just in case.”</li>
                    <li><b>Don't</b> maintain totals/counters separately—derive them.</li>
                </Styled.List>
            </Styled.Section>

            {/* Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Derived state:</b> stored duplicate of computable data (avoid).</li>
                    <li><b>Source of truth:</b> the authoritative holder of a value.</li>
                    <li><b>Drift:</b> mismatch between duplicates over time.</li>
                    <li><b>Memoization:</b> caching a computation result until its inputs change.</li>
                    <li><b>Identity:</b> stable attribute that uniquely identifies an entity (e.g., <i>user.id</i>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Rule of thumb: If you can <i>calculate</i> it, don't <i>store</i> it. Keep state minimal,
                avoid duplicates, and your UI will be simpler, faster, and less buggy.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DerivedStatePitfalls;
