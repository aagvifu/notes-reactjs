import { Styled } from "./styled";

const ReactLazy = () => {
    return (
        <Styled.Page>
            <Styled.Title>React.lazy</Styled.Title>

            <Styled.Lead>
                <b>React.lazy</b> lets you load a component’s code <i>on demand</i> (a technique called
                <b> code splitting</b>). Instead of shipping everything in one big bundle, you split it into
                smaller chunks and load each chunk only when needed. Wrap lazy components in{" "}
                <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> to show a fallback while the chunk loads.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Code splitting:</b> Breaking your JavaScript into multiple bundles (chunks) so the browser
                        only downloads what’s needed for the current screen.
                    </li>
                    <li>
                        <b>Dynamic import:</b> The syntax <Styled.InlineCode>import("path/to/module")</Styled.InlineCode> which
                        returns a Promise and causes the bundler (Vite/Rollup) to create a separate chunk.
                    </li>
                    <li>
                        <b>React.lazy(factory):</b> A function that takes a <i>factory</i> returning a Promise for a module and
                        yields a <i>lazy component</i>. The module must have a <b>default export</b>.
                    </li>
                    <li>
                        <b>&lt;Suspense fallback&gt;:</b> A boundary that shows a temporary UI (spinner/skeleton) while lazy
                        children are loading. You can nest multiple boundaries for better UX.
                    </li>
                    <li>
                        <b>Chunk:</b> A generated JS file that contains the code for a lazily-loaded module.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic example */}
            <Styled.Section>
                <Styled.H2>Basic Usage</Styled.H2>
                <Styled.Pre>
                    {`// 1) Create a lazy component
import React, { Suspense, lazy } from "react";

// The module must default-export a React component:
const BigChart = lazy(() => import("../components/BigChart"));

export default function Dashboard() {
  return (
    <section>
      <h2>Dashboard</h2>

      {/* Suspense shows fallback while the BigChart chunk loads */}
      <Suspense fallback={<div>Loading chart…</div>}>
        <BigChart />
      </Suspense>
    </section>
  );
}
`}
                </Styled.Pre>
                <Styled.Small>
                    Result: The initial bundle is smaller. The <Styled.InlineCode>BigChart</Styled.InlineCode> code is loaded only
                    when this screen renders it.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Named export workaround */}
            <Styled.Section>
                <Styled.H2>Default Export Requirement (and Workaround)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>React.lazy</b> expects the module to have a <b>default export</b>.
                    </li>
                    <li>
                        If your module has <i>named exports</i> only, wrap the dynamic import and re-export default.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Module only has: export function Chart() { ... }
// Wrap and map named -> default:
const BigChart = lazy(() =>
  import("../components/Chart").then(mod => ({ default: mod.Chart }))
);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Route-level code splitting */}
            <Styled.Section>
                <Styled.H2>Route-level Code Splitting</Styled.H2>
                <Styled.Pre>
                    {`// Router file
import { lazy, Suspense } from "react";
const Settings = lazy(() => import("./pages/Settings"));

<Route
  path="/settings"
  element={
    <Suspense fallback={<div>Loading settings…</div>}>
      <Settings />
    </Suspense>
  }
/>`}
                </Styled.Pre>
                <Styled.Small>
                    Put the <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> near the split point. For a global spinner,
                    place a parent boundary around your <Styled.InlineCode>&lt;Routes&gt;</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Multiple boundaries & skeletons */}
            <Styled.Section>
                <Styled.H2>Nesting Suspense Boundaries</Styled.H2>
                <Styled.List>
                    <li>Use a <i>page-level</i> boundary and smaller <i>widget-level</i> boundaries for finer control.</li>
                    <li>Show <b>skeletons</b> that match the final layout to reduce layout shift.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Header />
      <main className="grid">
        <Suspense fallback={<CardSkeleton />}>
          <BigChart />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <ActivityFeed />
        </Suspense>
      </main>
    </Suspense>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Preloading patterns */}
            <Styled.Section>
                <Styled.H2>Preloading (Optional Optimization)</Styled.H2>
                <Styled.List>
                    <li><b>Preload on hover:</b> start fetching the chunk when the user shows intent.</li>
                    <li><b>Preload above-the-fold:</b> eagerly fetch chunks you know you’ll need right away.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Simple manual preload
const Settings = lazy(() => import("./pages/Settings"));
Settings.preload = () => import("./pages/Settings"); // vendor-agnostic hint

function NavLinkToSettings() {
  return (
    <a
      href="/settings"
      onMouseEnter={() => Settings.preload?.()} // kick off download early
    >
      Settings
    </a>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Error handling */}
            <Styled.Section>
                <Styled.H2>Error Handling</Styled.H2>
                <Styled.List>
                    <li>
                        If a chunk fails (offline, network error), the thrown promise/error should be caught by an{" "}
                        <b>Error Boundary</b>. Combine <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> with an error boundary
                        for resilient UX.
                    </li>
                    <li>Offer a “Retry” button to re-attempt loading (re-rendering the lazy component retries the import).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal error boundary
class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return <button onClick={() => this.setState({ error: null })}>Retry</button>;
    }
    return this.props.children;
  }
}

// Usage
<Boundary>
  <Suspense fallback={<div>Loading…</div>}>
    <LazyWidget />
  </Suspense>
</Boundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> lazy-load large, infrequently used screens or widgets.</li>
                    <li><b>Do</b> place <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> close to the split to show precise fallbacks.</li>
                    <li><b>Do</b> use skeletons instead of spinners where possible.</li>
                    <li><b>Don’t</b> over-split tiny components; each chunk has overhead.</li>
                    <li><b>Don’t</b> forget that <b>default export</b> is required (or map named → default).</li>
                    <li><b>Don’t</b> block the whole page with one giant boundary if only one card is loading.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) SSR / hosting notes */}
            <Styled.Section>
                <Styled.H2>SSR &amp; Hosting Notes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>CSR apps (like Vite + GH Pages):</b> React.lazy works out of the box—chunks are fetched at runtime.
                    </li>
                    <li>
                        <b>SSR frameworks:</b> need special handling (streaming + SSR-aware bundling). This notes app is CSR, so you’re good.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Suspense:</b> A React feature that lets components “wait” for something (like code or data) and show a fallback.</li>
                    <li><b>Fallback:</b> Temporary UI (spinner/skeleton) displayed by a Suspense boundary.</li>
                    <li><b>Lazy component:</b> A component returned by React.lazy that loads its code on demand.</li>
                    <li><b>Error boundary:</b> A component that catches errors in its children and renders a safe UI.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>React.lazy</b> to split your app into on-demand chunks. Always wrap lazy components
                in <b>&lt;Suspense&gt;</b>, use multiple boundaries for better UX, consider preloading for likely paths,
                and combine with error boundaries for resilience.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ReactLazy;
