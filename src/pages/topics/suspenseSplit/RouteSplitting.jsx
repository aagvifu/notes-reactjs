import React from "react";
import { Styled } from "./styled";

const RouteSplitting = () => {
    return (
        <Styled.Page>
            <Styled.Title>Route Splitting</Styled.Title>

            <Styled.Lead>
                <b>Route splitting</b> loads a page's code <i>only when its route is visited</i>. It uses
                <Styled.InlineCode>React.lazy()</Styled.InlineCode> + <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode>
                to cut your bundle into smaller <b>chunks</b>, speeding up the initial load.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Bundle:</b> the combined JavaScript your users download. Big bundles = slower first load.</li>
                    <li><b>Chunk:</b> a piece of the bundle created by your build tool for lazy loading.</li>
                    <li><b>Code splitting:</b> splitting the bundle into chunks, loading them on demand.</li>
                    <li><b>Dynamic import:</b> <Styled.InlineCode>import("...")</Styled.InlineCode> expression that returns a Promise for a module chunk.</li>
                    <li><b>React.lazy:</b> wraps a dynamic import so the result can be used as a component.</li>
                    <li><b>Suspense boundary:</b> a UI boundary that shows a <i>fallback</i> while some child is loading.</li>
                    <li><b>Route splitting:</b> applying code splitting at <i>route</i> level, so each page ships on demand.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why route-split */}
            <Styled.Section>
                <Styled.H2>Why Route Split?</Styled.H2>
                <Styled.List>
                    <li><b>Faster first paint:</b> users download only what they need for the first screen.</li>
                    <li><b>Lower memory/CPU:</b> less JS to parse/execute upfront.</li>
                    <li><b>Scales with app size:</b> new routes add new chunks without bloating the entry bundle.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Example (React Router)</Styled.H2>
                <Styled.Pre>
                    {`// routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Each route is a lazy chunk:
const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Settings = lazy(() => import("../pages/Settings"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="spinner" aria-live="polite">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </Suspense>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Each <Styled.InlineCode>lazy(() =&gt; import(...))</Styled.InlineCode> creates a separate chunk.
                    The Suspense <i>boundary</i> shows a fallback while the chunk downloads.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Nested layout + boundary placement */}
            <Styled.Section>
                <Styled.H2>Layout Routes &amp; Boundary Placement</Styled.H2>
                <Styled.List>
                    <li>Place a <b>Suspense boundary</b> where you can show a meaningful skeleton (e.g., around the outlet area).</li>
                    <li>Keep <i>layout</i> code (header/sidebar) outside the boundary so it appears immediately.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// App.jsx (layout outside, page content inside Suspense)
import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import Shell from "./Shell";

export default function App() {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet /> {/* nested lazy routes render here */}
      </Suspense>
    </Shell>
  );
}

// routes
// <Route element={<App />}>
//   <Route index element={<Home />} />
//   <Route path="reports" element={<Reports />} />
// </Route>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Preloading strategies */}
            <Styled.Section>
                <Styled.H2>Preloading (Warm Up the Next Route)</Styled.H2>
                <Styled.List>
                    <li><b>Eager prefetch:</b> preload critical next pages after first render.</li>
                    <li><b>On hover/focus:</b> preload when the user hints they'll click a link.</li>
                    <li><b>On viewport:</b> preload when a link scrolls into view (IntersectionObserver).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// 5a) Eager prefetch a likely next page
const preloadDashboard = () => import("../pages/Dashboard");
React.useEffect(() => { preloadDashboard(); }, []);

// 5b) Preload on hover/focus
function DashLink() {
  const onWarm = () => { preloadDashboard(); };
  return (
    <a href="/dashboard" onMouseEnter={onWarm} onFocus={onWarm}>
      Go to Dashboard
    </a>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Preloading triggers the dynamic import early; when the user navigates, the chunk is already cached.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Data + code: avoid waterfalls */}
            <Styled.Section>
                <Styled.H2>Data &amp; Code: Avoid Waterfalls</Styled.H2>
                <Styled.List>
                    <li><b>Waterfall:</b> sequential waits (load code → then fetch data). Prefer parallel: start data fetch ASAP.</li>
                    <li>Kick off fetches in a parent that's not gated by the child's code load, or use router loaders (if you're using data routers).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Parallel start: kick off data fetch outside the lazy page
function ReportsRoute() {
  const promise = React.useMemo(() => fetch("/api/reports").then(r => r.json()), []);
  const Reports = React.useMemo(() => lazy(() => import("../pages/Reports")), []);
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Reports initialPromise={promise} />
    </Suspense>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Granularity guidance */}
            <Styled.Section>
                <Styled.H2>Granularity: How Much to Split?</Styled.H2>
                <Styled.List>
                    <li><b>Split by route</b> by default. It's a natural, user-visible boundary.</li>
                    <li>Split big intra-route widgets (charts, editors) <i>within</i> a page if they're below the fold or rarely used.</li>
                    <li>Avoid over-splitting tiny components; more chunks = more requests and worse cache behavior.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Error handling with lazy */}
            <Styled.Section>
                <Styled.H2>Error Handling for Lazy Routes</Styled.H2>
                <Styled.List>
                    <li>Wrap boundaries with an <b>Error Boundary</b> to catch network/parse errors while loading chunks.</li>
                    <li>Offer a retry action (re-import the chunk) and offline messaging.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo: Suspense + ErrorBoundary
<ErrorBoundary fallback={<ReloadMessage />}>
  <Suspense fallback={<Skeleton />}>
    <Routes>/* lazy routes here */</Routes>
  </Suspense>
</ErrorBoundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep layouts outside Suspense, content inside.</li>
                    <li><b>Do</b> preload “next-click” routes on hover/focus for snappier UX.</li>
                    <li><b>Do</b> co-locate heavy widgets and lazy them inside a page if needed.</li>
                    <li><b>Don't</b> block navigation on non-essential requests; show skeletons.</li>
                    <li><b>Don't</b> split everything—measure and split where it helps.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Entry bundle:</b> the first script your app downloads.</li>
                    <li><b>Chunk name:</b> the build-generated filename for a lazy module.</li>
                    <li><b>Prefetch vs Preload:</b> prefetch = low-priority “likely soon”; preload = high-priority “needed now”.</li>
                    <li><b>Skeleton:</b> lightweight placeholder UI shown while content loads.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Route splitting uses <i>lazy + Suspense</i> to ship only the code a page needs when
                it's visited. Place boundaries around content areas, preload predicted routes, parallelize data
                fetching, and split only where it improves user-perceived speed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RouteSplitting;
