import React from "react";
import { Styled } from "./styled";

const PresentationalVsContainer = () => {
    return (
        <Styled.Page>
            <Styled.Title>Presentational vs Container</Styled.Title>
            <Styled.Lead>
                A classic way to separate concerns in React is to split components into
                <b> presentational</b> (render UI) and <b>container</b> (fetch data, hold state, orchestrate behavior).
                Modern React often replaces “container” classes with function components, custom hooks, and composition—but
                the mental model is still useful.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Presentational (UI) component:</b> focuses on markup, styles, semantics, and accessibility.
                        Accepts <b>props</b> (data + callbacks) and typically has little or no data-fetching logic.
                    </li>
                    <li>
                        <b>Container (stateful/controller) component:</b> owns state, performs data fetching, handles side effects,
                        derives view-model data, and passes props down to a presentational component.
                    </li>
                    <li>
                        <b>View model:</b> a computed, UI-ready shape of data derived from raw sources (API responses, state, params).
                    </li>
                    <li>
                        <b>Separation of concerns:</b> isolating “what to render” (view) from “how to get/update data” (logic).
                    </li>
                    <li>
                        <b>Headless component:</b> a behavior-only component (or hook) with no UI; callers supply the markup.
                    </li>
                    <li>
                        <b>Custom hook:</b> a function starting with <Styled.InlineCode>use*</Styled.InlineCode> that encapsulates reusable state/logic (fetching, caching, derived values).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why split? */}
            <Styled.Section>
                <Styled.H2>Why split UI and logic?</Styled.H2>
                <Styled.List>
                    <li><b>Reusability:</b> the same UI can be driven by different data sources.</li>
                    <li><b>Testability:</b> presentational components are easy to snapshot/unit-test; logic is tested via hooks or containers.</li>
                    <li><b>Replaceability:</b> swap the container (fetching logic) without touching the UI.</li>
                    <li><b>Clarity:</b> fewer reasons for a component to change → simpler reviews and maintenance.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Classic pattern (one container, one presentational) */}
            <Styled.Section>
                <Styled.H2>Classic pattern (container → presentational)</Styled.H2>
                <Styled.Pre>
                    {`// Presentational: pure UI, no fetching
function ProductListView({ items, loading, error, onRetry }) {
  if (loading)   return <p>Loading…</p>;
  if (error)     return <div role="alert">Failed. <button onClick={onRetry}>Retry</button></div>;
  if (!items.length) return <p>No products</p>;

  return (
    <ul>
      {items.map(p => (
        <li key={p.id}>
          <b>{p.name}</b> — $\${p.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}

// Container: fetches, owns state, passes props to view
function ProductListContainer() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  return (
    <ProductListView
      items={items}
      loading={loading}
      error={error}
      onRetry={load}
    />
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The presentational component can be reused in Storybook/tests by passing mock <code>items</code> and states,
                    while the container handles real data.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Modern approach: custom hooks + composition */}
            <Styled.Section>
                <Styled.H2>Modern approach: custom hooks + composition</Styled.H2>
                <p>
                    Extracting logic into a <b>custom hook</b> keeps the UI thin without creating a separate container component.
                    The page (or parent) composes the hook’s data into a view.
                </p>
                <Styled.Pre>
                    {`// Reusable logic
function useProducts() {
  const [items, setItems]   = React.useState([]);
  const [status, setStatus] = React.useState("loading"); // "loading" | "error" | "ready"
  const load = React.useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("HTTP " + res.status);
      setItems(await res.json());
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  return { items, status, reload: load };
}

// UI consumes the hook directly (no explicit "container" needed)
function ProductsSection() {
  const { items, status, reload } = useProducts();
  return (
    <ProductListView
      items={items}
      loading={status === "loading"}
      error={status === "error" ? new Error("…") : null}
      onRetry={reload}
    />
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Benefit: hooks are easy to share, test, and combine (fetching, caching, selection, pagination, etc.).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Headless + render-prop for maximum flexibility */}
            <Styled.Section>
                <Styled.H2>Headless pattern (behavior-only) with render prop</Styled.H2>
                <Styled.Pre>
                    {`function ProductsHeadless({ children }) {
  const api = useProducts(); // from the previous example
  return children(api);
}

// Caller controls the entire UI
<ProductsHeadless>
  {({ items, status, reload }) => (
    <>
      {status === "loading" && <Spinner />}
      {status === "error" && <Error retry={reload} />}
      {status === "ready" && <Grid products={items} />}
    </>
  )}
</ProductsHeadless>`}
                </Styled.Pre>
                <Styled.Small>
                    Use when consumers need full control over markup and states (design systems, libraries).
                </Styled.Small>
            </Styled.Section>

            {/* 6) What belongs where */}
            <Styled.Section>
                <Styled.H2>What belongs where?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Presentational</b>: markup, layout, styles, ARIA roles/labels, small UI state (open/closed), no fetch calls,
                        no global side effects. Receives <em>data</em> and <em>callbacks</em> as props.
                    </li>
                    <li>
                        <b>Container / Hook</b>: data fetching, caching, derived data (sorting/filtering), business rules, navigation,
                        analytics, cross-cutting concerns. Passes UI-ready data and event handlers down.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Alternatives & ecosystem */}
            <Styled.Section>
                <Styled.H2>Alternatives & ecosystem</Styled.H2>
                <Styled.List>
                    <li><b>Data libraries</b>: React Query / SWR manage cache, status, retries. Hooks become small coordinators.</li>
                    <li><b>Context</b>: share state across a subtree (e.g., auth, theme, feature flags) → avoid prop drilling.</li>
                    <li><b>Route loaders</b> (frameworks): fetch data at the route and render UI with ready props.</li>
                    <li><b>Server components</b> (frameworks): fetch on the server; presentational client components receive prepared props.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Over-splitting:</b> too many files/components for trivial views increases friction. Split only when it helps reuse/clarity.
                    </li>
                    <li>
                        <b>Leaky abstractions:</b> presentational components should not know about fetchers, query keys, or endpoints.
                    </li>
                    <li>
                        <b>Tight coupling via cloning:</b> prefer props/context instead of <Styled.InlineCode>cloneElement</Styled.InlineCode> tricks.
                    </li>
                    <li>
                        <b>Prop drilling:</b> if a “container” passes the same props through multiple levels, consider context/compound patterns.
                    </li>
                    <li>
                        <b>State ownership confusion:</b> decide who owns which state (form values, selection). Lift or localize intentionally.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Testing strategy */}
            <Styled.Section>
                <Styled.H2>Testing strategy</Styled.H2>
                <Styled.List>
                    <li>
                        Test <b>presentational</b> components with static props (snapshot/DOM queries). No network needed.
                    </li>
                    <li>
                        Test <b>hooks/containers</b> with mocked fetch/cache to verify transitions (loading → ready → error).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep UI and data concerns separate enough to reuse and test.</li>
                    <li><b>Do</b> extract logic into custom hooks; compose them in pages or containers.</li>
                    <li><b>Do</b> pass view-model props (already shaped for UI) to keep views simple.</li>
                    <li><b>Don’t</b> fetch data inside deeply presentational components.</li>
                    <li><b>Don’t</b> over-engineer tiny UIs—split only when it adds clarity.</li>
                    <li><b>Don’t</b> leak internal flags/endpoints into presentational layers.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: use the model that fits the scale. For small views, a single component + a small hook is fine.
                For larger features, separate a presentational UI from a container or custom hooks. Keep data logic testable
                and UI components reusable and accessible.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default PresentationalVsContainer;
