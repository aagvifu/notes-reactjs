import { Styled } from "./styled";

const LazyRoutes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Lazy Routes</Styled.Title>

            <Styled.Lead>
                <b>Lazy routing</b> loads route components <i>on demand</i> using dynamic imports so your
                initial bundle stays small. It relies on <Styled.InlineCode>React.lazy()</Styled.InlineCode> for
                <b> code-splitting</b> and <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> to show a
                temporary <b>fallback</b> UI while the chunk downloads.
            </Styled.Lead>

            {/* 0) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (read first)</Styled.H2>
                <Styled.List>
                    <li><b>Code-splitting:</b> breaking your JavaScript into smaller files (chunks) that load when needed.</li>
                    <li><b>Dynamic import:</b> <Styled.InlineCode>import("...")</Styled.InlineCode> returns a Promise for that module; bundlers emit a separate chunk.</li>
                    <li><b>React.lazy:</b> wraps a dynamic import so React can render the module’s <b>default export</b> as a component.</li>
                    <li><b>Suspense:</b> a React component that shows a <b>fallback</b> while a lazy child is loading.</li>
                    <li><b>Chunk:</b> the output file produced by the bundler (Vite/Rollup) for a lazy module.</li>
                    <li><b>Preload / Prefetch:</b> proactively fetching a chunk earlier (e.g., on hover or when a link is visible).</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Why & when */}
            <Styled.Section>
                <Styled.H2>Why lazy routes?</Styled.H2>
                <Styled.List>
                    <li><b>Faster first paint:</b> ship only what the initial screen needs.</li>
                    <li><b>Scales with content:</b> as topics grow, loading stays snappy.</li>
                    <li><b>Natural boundaries:</b> routes are a perfect place to split code.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic pattern */}
            <Styled.Section>
                <Styled.H2>Basic Pattern (React.lazy + Suspense)</Styled.H2>
                <Styled.Pre>
                    {`// routes file (excerpt)
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// 1) Lazy import the page component (must have a default export)
const UserProfilePage = lazy(() => import("./pages/users/UserProfilePage"));

export default function AppRoutes() {
  return (
    // 2) A Suspense boundary shows a fallback while any child is loading
    <Suspense fallback={<div className="spinner" aria-label="Loading">Loading…</div>}>
      <Routes>
        <Route path="/users/:id" element={<UserProfilePage />} />
      </Routes>
    </Suspense>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> You likely already wrap your entire <Styled.InlineCode>&lt;Routes&gt;</Styled.InlineCode> in one
                    Suspense. You can also add <i>nested</i> Suspense boundaries for more granular fallbacks.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Local (route-level) Suspense */}
            <Styled.Section>
                <Styled.H2>Route-level Suspense (granular fallback)</Styled.H2>
                <Styled.Pre>
                    {`// If the app has a global Suspense but you want a specific fallback for this route:
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));

<Route
  path="/reports"
  element={
    <Suspense fallback={<div>Loading reports…</div>}>
      <ReportsPage />
    </Suspense>
  }
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Grouping by section */}
            <Styled.Section>
                <Styled.H2>Split by Section (group related routes)</Styled.H2>
                <Styled.List>
                    <li>Place section pages under a folder (e.g., <i>routing/</i>, <i>hooksAdv/</i>).</li>
                    <li>Lazy-load each page or a section wrapper that nests child routes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: a section wrapper that includes nested routes (each can be lazy)
const RoutingSection = lazy(() => import("./pages/topics/routing/RoutingSection"));

<Route path="/routing/*" element={<RoutingSection />} />`}
                </Styled.Pre>
                <Styled.Small>
                    The wrapper renders an <i>Outlet</i> and its own sidebar/header. Child topic pages can be lazy too.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Preloading (hover / in-view) */}
            <Styled.Section>
                <Styled.H2>Preloading (hover or when link is visible)</Styled.H2>
                <Styled.List>
                    <li><b>Why:</b> fetching the chunk right before navigation removes the loading spinner.</li>
                    <li><b>How:</b> call the same dynamic import early. React will reuse the loaded module when navigating.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Preload on hover
const preloadUser = () => import("./pages/users/UserProfilePage"); // same path as React.lazy

<Link to="/users/42" onMouseEnter={preloadUser} onFocus={preloadUser}>
  View Profile
</Link>

// Preload when link scrolls into view
function PrefetchOnVisible({ to, importFn, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        importFn(); // fire once
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [importFn]);
  return <a ref={ref} href={to}>{children}</a>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    In Vite, dynamic imports are cached; calling <Styled.InlineCode>import()</Styled.InlineCode> early “warms” the chunk.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Error handling */}
            <Styled.Section>
                <Styled.H2>Error Handling for Lazy Routes</Styled.H2>
                <Styled.List>
                    <li>Wrap routes with an <b>Error Boundary</b> to catch load/render errors.</li>
                    <li>Show a helpful retry UI when a chunk fails (offline, cache issues).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal error boundary
class RouteErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div>Something went wrong. <button onClick={() => location.reload()}>Retry</button></div>;
    return this.props.children;
  }
}

// Usage:
// <RouteErrorBoundary>
//   <Suspense fallback={<Spinner />}>
//     <Routes>…</Routes>
//   </Suspense>
// </RouteErrorBoundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> lazy-load routes and other heavy screens (charts, editors, markdown renderers).</li>
                    <li><b>Do</b> keep a global Suspense + occasional route-level Suspense for tailored fallbacks.</li>
                    <li><b>Do</b> preload chunks on hover/visible links for smoother UX.</li>
                    <li><b>Don’t</b> lazy-load tiny components that are reused everywhere (hurts perf).</li>
                    <li><b>Don’t</b> forget that <Styled.InlineCode>React.lazy</Styled.InlineCode> requires a <b>default export</b>.</li>
                    <li><b>Don’t</b> mutate the DOM to “insert” chunks—navigation should trigger the render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) FAQ / Notes */}
            <Styled.Section>
                <Styled.H2>FAQ & Notes</Styled.H2>
                <Styled.List>
                    <li><b>Named chunks?</b> In Vite, chunk names are derived from file paths. Prefer clear file/folder names.</li>
                    <li><b>SSR?</b> For pure client apps (like this project), React.lazy works out of the box. SSR requires different handling.</li>
                    <li><b>Where to put Suspense?</b> Put one near <Styled.InlineCode>&lt;Routes&gt;</Styled.InlineCode>; add nested ones where UX needs different fallbacks.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: use <i>React.lazy</i> + <i>Suspense</i> to code-split by route, add targeted
                fallbacks where it matters, and preload chunks on intent (hover/visible) for instant page
                transitions.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LazyRoutes;
