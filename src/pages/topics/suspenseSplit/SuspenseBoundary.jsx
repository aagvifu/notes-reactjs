import { Styled } from "./styled";

const SuspenseBoundary = () => {
    return (
        <Styled.Page>
            <Styled.Title>Suspense Boundary</Styled.Title>

            <Styled.Lead>
                A <b>Suspense boundary</b> is a part of your UI wrapped in{" "}
                <Styled.InlineCode>&lt;Suspense fallback=…&gt;</Styled.InlineCode>.
                If any child inside it is "<i>waiting</i>" (e.g., a lazily-loaded component's code chunk
                hasn't arrived yet), React will temporarily show the <b>fallback UI</b> instead of
                rendering that part. Once the child is ready, React swaps in the real UI.
            </Styled.Lead>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (clear definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Code splitting:</b> breaking your bundle into smaller <i>chunks</i> that load on demand,
                        e.g., only when a route/page is visited.
                    </li>
                    <li>
                        <b>Lazy component:</b> a component loaded via{" "}
                        <Styled.InlineCode>React.lazy(() =&gt; import("./X"))</Styled.InlineCode>. It suspends while
                        the chunk is downloading.
                    </li>
                    <li>
                        <b>Suspense boundary:</b> a wrapper (<Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode>)
                        that shows a <b>fallback</b> whenever a child is not ready.
                    </li>
                    <li>
                        <b>Fallback UI:</b> temporary placeholder (spinner, skeleton, message) shown while loading.
                    </li>
                    <li>
                        <b>Suspending:</b> the state when a child signals "I'm not ready yet"—with code splitting,
                        this happens while the chunk is fetching.
                    </li>
                    <li>
                        <b>Preloading:</b> requesting a chunk <i>before</i> the user actually needs it (e.g., on hover or idle)
                        to reduce or avoid fallbacks.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) The minimal pattern */}
            <Styled.Section>
                <Styled.H2>Basic Pattern: lazy + Suspense</Styled.H2>
                <Styled.Pre>
                    {`// Lazy-load a component (code-splitting)
const UserPanel = React.lazy(() => import("./UserPanel"));

export default function Page() {
  return (
    <Suspense fallback={<div aria-busy="true">Loading user panel…</div>}>
      <UserPanel />
    </Suspense>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    If <Styled.InlineCode>UserPanel</Styled.InlineCode> is not yet downloaded, the boundary
                    shows the fallback. When its code arrives, React renders the real panel.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Where to place boundaries */}
            <Styled.Section>
                <Styled.H2>Where Should the Boundary Live?</Styled.H2>
                <Styled.List>
                    <li>
                        Wrap the <i>smallest meaningful</i> area that might load separately
                        (card list, side panel, tab content), not the entire page—this avoids "spinner everything."
                    </li>
                    <li>
                        Use a <b>page-level</b> boundary around routes for first-visit loads, plus
                        <b>smaller nested boundaries</b> for slower fragments inside the page.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Page-level boundary + a nested boundary
const ProductGallery = React.lazy(() => import("./ProductGallery"));
const Reviews = React.lazy(() => import("./Reviews"));

export function ProductPage() {
  return (
    <Suspense fallback={<div>Loading page…</div>}>
      <main>
        <h1>Product</h1>

        {/* Nested: show skeleton just for the gallery */}
        <Suspense fallback={<div className="skeleton">Loading images…</div>}>
          <ProductGallery />
        </Suspense>

        {/* Nested: reviews may be slower */}
        <Suspense fallback={<div>Loading reviews…</div>}>
          <Reviews />
        </Suspense>
      </main>
    </Suspense>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Route-level splitting */}
            <Styled.Section>
                <Styled.H2>Route-Level Code Splitting</Styled.H2>
                <Styled.List>
                    <li>
                        Wrap your <Styled.InlineCode>&lt;Routes /&gt;</Styled.InlineCode> (or each route element)
                        in a Suspense boundary so new routes can lazy-load smoothly.
                    </li>
                    <li>
                        Keep a small, consistent <b>route fallback</b> (e.g., top skeleton/loader) for better UX.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// routes.jsx
import { Routes, Route } from "react-router-dom";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Reports = React.lazy(() => import("./pages/Reports"));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="route-fallback">Loading…</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Preloading to reduce fallback time */}
            <Styled.Section>
                <Styled.H2>Preloading (reduce or avoid spinners)</Styled.H2>
                <Styled.List>
                    <li>
                        Trigger <Styled.InlineCode>import()</Styled.InlineCode> early (hover, onVisible, idle)
                        so chunks are cached by the time the user navigates.
                    </li>
                    <li>
                        Keep the logic simple—call the same dynamic import used by{" "}
                        <Styled.InlineCode>React.lazy</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// user-panel.js (module file)
export default function UserPanel(){ /* ... */ }

// preload helper (same module)
export function preloadUserPanel() {
  return import("./user-panel");
}

// usage (e.g., in a menu or Link wrapper)
function MenuLink() {
  return (
    <a
      href="/user"
      onMouseEnter={() => { preloadUserPanel(); }}
    >
      User
    </a>
  );
}

// lazy usage elsewhere
const UserPanel = React.lazy(() => import("./user-panel"));`}
                </Styled.Pre>
                <Styled.Small>
                    You can also preload on intersection (when a link becomes visible) or on{" "}
                    <Styled.InlineCode>requestIdleCallback</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Fallback design tips */}
            <Styled.Section>
                <Styled.H2>Designing Good Fallbacks</Styled.H2>
                <Styled.List>
                    <li><b>Skeletons over spinners</b>—hint at layout; reduce perceived wait.</li>
                    <li>Keep fallbacks <b>stable in size</b> to avoid layout shift.</li>
                    <li>Group related UI under one boundary so a single fallback covers all of it coherently.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Error vs Suspense */}
            <Styled.Section>
                <Styled.H2>Suspense vs Error Boundaries</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Suspense</b> handles <i>waiting</i> states (e.g., chunk loading).
                    </li>
                    <li>
                        <b>ErrorBoundary</b> handles <i>failures</i> (runtime errors). Use both.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal error boundary (concept)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error(error, info); }
  render() { return this.state.hasError ? <div>Something went wrong.</div> : this.props.children; }
}

// Combine with Suspense
<ErrorBoundary>
  <Suspense fallback={<div>Loading…</div>}>
    <LazyWidget />
  </Suspense>
</ErrorBoundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> place boundaries near slow code (routes, big widgets, image galleries).</li>
                    <li><b>Do</b> prefer skeleton fallbacks sized like final content.</li>
                    <li><b>Do</b> preload on hover/idle for popular paths.</li>
                    <li><b>Don't</b> wrap your entire app in a single boundary—one spinner for everything hurts UX.</li>
                    <li><b>Don't</b> block critical UI (e.g., nav/header) inside a loading boundary.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) FAQ */}
            <Styled.Section>
                <Styled.H2>FAQ</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Does Suspense work for data?</b> In client-only React, Suspense is officially for
                        code-splitting. Frameworks (Next.js/React Server Components) extend it to data.
                    </li>
                    <li>
                        <b>Will fallback flicker?</b> Preload and choose skeletons. You can also keep the fallback
                        visible for a minimum duration with small CSS tricks if needed.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Wrap uncertain, slow-to-load UI in a <b>Suspense boundary</b> with a well-designed
                fallback. Use <b>lazy</b> for code splitting, <b>nest boundaries</b> to isolate slow areas,
                and <b>preload</b> likely chunks to make loading feel instant.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SuspenseBoundary;
