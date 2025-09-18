import { Styled } from "./styled";

const FallbackUI = () => {
    return (
        <Styled.Page>
            <Styled.Title>Fallback UI</Styled.Title>

            <Styled.Lead>
                A <b>Fallback UI</b> is what you show when the normal UI can't render:
                during <i>loading</i>, after an <i>error</i>, or when there's <i>nothing to show</i>.
                In React, you'll mainly use <Styled.InlineCode>&lt;Suspense fallback=&quot;...&quot; /&gt;</Styled.InlineCode> for loading states and
                <b> Error Boundaries</b> for render-time errors.
            </Styled.Lead>

            {/* 1) Why and when */}
            <Styled.Section>
                <Styled.H2>Why Fallback UI matters</Styled.H2>
                <Styled.List>
                    <li><b>Resilience:</b> keeps the app usable even if a part fails.</li>
                    <li><b>Clarity:</b> tells users what's happening (loading / error / empty).</li>
                    <li><b>Recovery:</b> provides <i>Retry</i> or <i>Reset</i> so users can continue.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Types of fallback UI */}
            <Styled.Section>
                <Styled.H2>Types of fallback UI</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Suspense fallback</b>: temporary UI while children are “not ready” (code-splitting, data fetching with Suspense).
                        Use <Styled.InlineCode>fallback</Styled.InlineCode> prop on <Styled.InlineCode>Suspense</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Error fallback</b>: UI rendered by an <b>Error Boundary</b> after a render-time error occurs.
                    </li>
                    <li>
                        <b>Empty state</b>: UI when the request succeeds but there's no data. Not an error.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Suspense fallback examples */}
            <Styled.Section>
                <Styled.H2>Suspense fallback (loading)</Styled.H2>
                <Styled.Pre>
                    {`import React, { Suspense, lazy } from "react";

const UserList = lazy(() => import("./UserList"));

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserList />
    </Suspense>
  );
}

function Spinner() {
  return <div aria-busy="true" aria-live="polite">Loading…</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <i>Suspense</i> shows a <i>fallback</i> until children finish loading. It's not for errors—pair it with an Error Boundary.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Error boundary fallback (class) */}
            <Styled.Section>
                <Styled.H2>Error Boundary (render-time errors)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Definition:</b> An <i>Error Boundary</i> is a component that catches <u>render</u> errors in its subtree
                        and shows a <i>fallback</i> instead of crashing the whole app.
                    </li>
                    <li>
                        <b>Scope:</b> Catches errors in <i>render</i>, <i>lifecycle</i>, and <i>constructor</i> of children.
                        It does <u>not</u> catch errors in event handlers or async code—handle those in your logic.
                    </li>
                    <li>
                        <b>Reset:</b> Change a <i>key</i> on the boundary (or internal state) to try rendering again.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal class-based Error Boundary (built-in React pattern)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // log to monitoring here (Sentry/LogRocket/etc.)
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }) {
  return (
    <div role="alert" aria-live="assertive">
      <h3>Something went wrong.</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error?.message}</pre>
      <button onClick={onReset}>Try again</button>
    </div>
  );
}

// Usage:
// <ErrorBoundary fallback={<ErrorFallback />}>
//   <Profile id={userId} />
// </ErrorBoundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Pairing Suspense + Error Boundary */}
            <Styled.Section>
                <Styled.H2>Compose Suspense + Error Boundary</Styled.H2>
                <Styled.Pre>
                    {`// Load code/data (suspense) AND handle render errors (boundary)
<ErrorBoundary fallback={<ErrorFallback />}>
  <React.Suspense fallback={<Spinner />}>
    <UserProfile id={id} />
  </React.Suspense>
</ErrorBoundary>`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Place boundaries around logical islands (widgets, panels), not the whole app,
                    so one faulty section doesn't blank out everything.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Data errors vs render errors */}
            <Styled.Section>
                <Styled.H2>Data errors ≠ Render errors</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Data error:</b> The fetch failed or returned an error. Handle in your data layer and render a
                        <i>data fallback</i> (message + retry).
                    </li>
                    <li>
                        <b>Render error:</b> Component threw while rendering. An <i>Error Boundary</i> must provide the fallback.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Data error fallback (inside your component)
function Products() {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });
    fetch("/api/products")
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Request failed")))
      .then(data => !cancelled && setState({ status: "success", data, error: null }))
      .catch(error => !cancelled && setState({ status: "error", data: null, error }));
    return () => { cancelled = true; };
  }, []);

  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") {
    return (
      <div role="alert">
        <p>Couldn't load products.</p>
        <button onClick={() => /* trigger refetch */ window.location.reload()}>Retry</button>
      </div>
    );
  }
  if (!state.data?.length) return <EmptyState />; // empty state (not an error)
  return <List items={state.data} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Reset & Retry patterns */}
            <Styled.Section>
                <Styled.H2>Reset &amp; Retry patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Retry:</b> Re-run the failing operation (refetch, re-mount). Provide a clear button or auto-retry with backoff.
                    </li>
                    <li>
                        <b>Reset:</b> Clear the boundary's error state so children can attempt to render. Common trick: change the
                        <Styled.InlineCode>key</Styled.InlineCode> on the boundary.
                    </li>
                    <li>
                        <b>Backoff:</b> Delay between retries (e.g., 1s → 2s → 4s) to avoid hammering the server.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Reset by changing a key to force a re-mount
function Panel() {
  const [nonce, setNonce] = React.useState(0);
  return (
    <ErrorBoundary key={nonce} fallback={<ErrorFallback onReset={() => setNonce(n => n + 1)} />}>
      <ProblemChild />
    </ErrorBoundary>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) UX guidance */}
            <Styled.Section>
                <Styled.H2>UX guidance: what good fallbacks look like</Styled.H2>
                <Styled.List>
                    <li><b>Be specific:</b> “Couldn't load orders. Check your connection and retry.”</li>
                    <li><b>Offer action:</b> Provide a <i>Retry</i> or <i>Reset</i> button when possible.</li>
                    <li><b>Be accessible:</b> use <Styled.InlineCode>role="status"</Styled.InlineCode> / <Styled.InlineCode>role="alert"</Styled.InlineCode> and <Styled.InlineCode>aria-live</Styled.InlineCode>.</li>
                    <li><b>Don't over-polish errors:</b> simple, calm UI beats flashy modals for systemic failures.</li>
                    <li><b>Keep loading tight:</b> prefer lightweight spinners or <i>skeletons</i>; avoid layout jumps.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> wrap risky islands with Error Boundaries (charts, third-party widgets, complex views).</li>
                    <li><b>Do</b> compose Suspense fallback (loading) inside an Error Boundary (errors).</li>
                    <li><b>Do</b> distinguish <i>empty</i> vs <i>error</i> vs <i>loading</i>—they need different UI.</li>
                    <li><b>Don't</b> swallow errors silently—log to console in dev and to monitoring in prod.</li>
                    <li><b>Don't</b> show raw stack traces to end users—show a friendly message and log details elsewhere.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Fallback UI:</b> The UI you show when normal rendering can't proceed.</li>
                    <li><b>Error Boundary:</b> React component that catches render-time errors in its subtree.</li>
                    <li><b>Suspense:</b> React mechanism to wait for code/data and show a fallback while waiting.</li>
                    <li><b>Empty State:</b> UI for successful requests that return no items.</li>
                    <li><b>Retry:</b> Re-attempting a failed operation.</li>
                    <li><b>Reset:</b> Clearing an error boundary's error so children can re-render.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>Suspense</b> fallbacks for loading, <b>Error Boundaries</b> for render errors, and a clear
                <b> empty state</b> when nothing is available. Provide <i>Retry</i>/<i>Reset</i>, keep messages helpful,
                and log errors for visibility.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FallbackUI;
