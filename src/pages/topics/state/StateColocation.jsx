import React from "react";
import { Styled } from "./styled";

const StateColocation = () => {
    return (
        <Styled.Page>
            <Styled.Title>State Colocation</Styled.Title>
            <Styled.Lead>
                State colocation means putting state <b>as close as possible</b> to the components
                that read and update it. Start local, then lift only when multiple components must share it.
                Less surface area → fewer renders, fewer props, fewer bugs.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Colocation:</b> storing a piece of state in the smallest component that needs it.</li>
                    <li><b>Owner:</b> the component that holds a state value and decides how it changes.</li>
                    <li><b>Scope:</b> the subtree that can “see” a piece of state (owner + descendants via props/context).</li>
                    <li><b>Shared state:</b> a value needed by more than one component → lift to their nearest common parent.</li>
                    <li><b>Derived state:</b> a computed value from other state/props. Don’t store duplicates; compute or memoize.</li>
                    <li><b>Global/app state:</b> cross-cutting concerns (auth, theme, feature flags). Use context or state libs, sparingly.</li>
                    <li><b>URL/route state:</b> state encoded in the address bar (page, tab, filters) so it’s linkable and restorable.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Heuristics */}
            <Styled.Section>
                <Styled.H2>Heuristics: where should this state live?</Styled.H2>
                <Styled.List>
                    <li><b>Who reads it?</b> Put state where the <em>closest common</em> reader lives.</li>
                    <li><b>Who writes it?</b> Place state where updates originate; lift when multiple writers exist.</li>
                    <li><b>Is it navigational?</b> If it should persist in the URL (shareable/back-button), store it in route params/query.</li>
                    <li><b>Is it expensive to propagate?</b> High-frequency updates (typing, drag) should be colocated to avoid re-rendering large trees.</li>
                    <li><b>Is it derived?</b> Don’t store—compute during render; memoize if costly or if stable reference is required.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Example: Modal open/close */}
            <Styled.Section>
                <Styled.H2>Example: Modal open/close</Styled.H2>
                <Styled.Pre>
                    {`// ✅ Colocate: only Button+Modal care about 'open'
function DeleteDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete</button>
      {open && (
        <div role="dialog" aria-modal="true">
          <p>Confirm delete?</p>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => { /* delete */ setOpen(false); }}>Confirm</button>
        </div>
      )}
    </>
  );
}

// ❌ Anti-pattern: lifting to App when no one else needs it → prop drilling & extra renders`}
                </Styled.Pre>
                <Styled.Small>Lift only if multiple siblings need to coordinate the same dialog state.</Styled.Small>
            </Styled.Section>

            {/* 4) Example: Search + List (local vs shared) */}
            <Styled.Section>
                <Styled.H2>Example: Search + List</Styled.H2>
                <Styled.Pre>
                    {`// Case A — local: Search owns query, filters its own list (simple component)
function SearchList({ items }) {
  const [q, setQ] = React.useState("");
  const visible = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(it => it.name.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <>
      <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
      <ul>{visible.map(it => <li key={it.id}>{it.name}</li>)}</ul>
    </>
  );
}

// Case B — shared: search affects multiple components (list + stats + pager)
function ProductsPage({ items }) {
  const [q, setQ] = React.useState(""); // lifted to the nearest common parent
  const visible = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(it => it.name.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <>
      <SearchBox value={q} onChange={setQ} />
      <Stats count={visible.length} />
      <ProductList items={visible} />
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Start with A. Move to B only when multiple components need the same query.</Styled.Small>
            </Styled.Section>

            {/* 5) Example: Form editing */}
            <Styled.Section>
                <Styled.H2>Example: Form editing</Styled.H2>
                <Styled.Pre>
                    {`// ✅ Colocate: field state near the inputs; submit passes data upward
function ProfileForm({ onSubmit }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  function submit(e) {
    e.preventDefault();
    onSubmit({ name, email }); // parent owns server mutation, not each keystroke
  }
  return (
    <form onSubmit={submit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}

// Lift only if siblings must validate/preview the same draft simultaneously.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) URL state (React Router) */}
            <Styled.Section>
                <Styled.H2>Route/URL as state (shareable & restorable)</Styled.H2>
                <Styled.Pre>
                    {`// keep tab in the URL so refresh/back-button works
import { useSearchParams } from "react-router-dom";

function TabsWithUrl() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("tab") || "info";

  function select(next) {
    const nextSp = new URLSearchParams(sp);
    nextSp.set("tab", next);
    setSp(nextSp, { replace: true });
  }

  return (
    <>
      <nav>
        <button aria-pressed={tab === "info"} onClick={() => select("info")}>Info</button>
        <button aria-pressed={tab === "reviews"} onClick={() => select("reviews")}>Reviews</button>
      </nav>
      {tab === "info" ? <Info /> : <Reviews />}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Use URL for navigational state (tab, page, filters) that users expect to share and revisit.</Styled.Small>
            </Styled.Section>

            {/* 7) Performance & render boundaries */}
            <Styled.Section>
                <Styled.H2>Performance & render boundaries</Styled.H2>
                <Styled.List>
                    <li>High-frequency updates (typing, drag) should be colocated to avoid re-rendering distant parents.</li>
                    <li>Split large components; pass only the data children need. Consider <b>React.memo</b> for pure leaves.</li>
                    <li>Memoize derived arrays/objects you pass down so memoized children keep referential equality.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Split & memoize to reduce re-renders
const List = React.memo(function List({ items }) {
  return <ul>{items.map(it => <li key={it.id}>{it.name}</li>)}</ul>;
});

function Parent({ items }) {
  const visible = React.useMemo(() => items.slice(0, 100), [items]);
  return <List items={visible} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Anti-patterns & pitfalls */}
            <Styled.Section>
                <Styled.H2>Anti-patterns & pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Over-lifting:</b> pushing state to the top “just in case” → prop drilling, extra renders.</li>
                    <li><b>Premature global state:</b> using context/store for local concerns; keep things local unless truly shared.</li>
                    <li><b>Duplicated state:</b> storing raw and derived copies (e.g., items and filteredItems) → drift; derive instead.</li>
                    <li><b>Module-level mutable singletons:</b> storing mutable runtime data outside components prevents reactive updates.</li>
                    <li><b>Leaking internal flags:</b> forwarding non-DOM props to DOM elements; filter them out.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Checklist */}
            <Styled.Section>
                <Styled.H2>Checklist</Styled.H2>
                <Styled.List>
                    <li>Can another component see this state? If not → colocate.</li>
                    <li>Do multiple siblings need it? Lift to the nearest common parent.</li>
                    <li>Is it purely derived? Don’t store; compute (memoize if heavy).</li>
                    <li>Should it survive refresh/share? Put it in the URL.</li>
                    <li>Are renders too broad? Split components, memoize boundaries.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep state close to where it’s used; lift only when sharing is necessary.
                Use URL for navigational state, compute derived values, and avoid premature global state.
                Smaller scopes mean simpler props, fewer re-renders, and clearer code.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default StateColocation;
