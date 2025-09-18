import React from "react";
import { Styled } from "./styled";

const ErrorBoundaries = () => {
    return (
        <Styled.Page>
            <Styled.Title>Error Boundaries</Styled.Title>

            <Styled.Lead>
                An <b>Error Boundary</b> is a special React component that <i>catches JavaScript errors</i>
                anywhere in its <b>child component tree</b> during <b>render</b>, in <b>lifecycle methods</b>,
                and in <b>constructors of child components</b>, then renders a <b>fallback UI</b> instead of
                crashing the whole app. It can also <b>log</b> the error for monitoring.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Error Boundary:</b> A class component implementing{" "}
                        <Styled.InlineCode>static getDerivedStateFromError</Styled.InlineCode> and/or{" "}
                        <Styled.InlineCode>componentDidCatch</Styled.InlineCode> to catch errors below it and
                        show a fallback.
                    </li>
                    <li>
                        <b>Fallback UI:</b> A safe, friendly screen (e.g., “Something went wrong.”) that
                        replaces the crashed subtree.
                    </li>
                    <li>
                        <b>Scope:</b> Boundaries only protect their <i>descendants</i>. Wrap risky islands
                        (charts, widgets, 3P components) so the rest of the page keeps working.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What they catch (and not) */}
            <Styled.Section>
                <Styled.H2>What Error Boundaries Catch (and Don't)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Catches:</b> Errors thrown while <i>rendering</i> a child, in a child's{" "}
                        <i>constructor</i>, or in a child's <i>lifecycle</i> (class) / render phase (function).
                    </li>
                    <li>
                        <b>Does NOT catch:</b> Errors in <i>event handlers</i>, <i>async</i> code (timers,
                        promises), <i>server-side rendering</i> errors, or <i>outside React</i> (e.g., global
                        script). Handle those with try/catch, promise <Styled.InlineCode>.catch</Styled.InlineCode>,
                        or server error middleware.
                    </li>
                </Styled.List>
                <Styled.Small>
                    <b>Terms:</b> <i>Render phase</i> = computing what to show; <i>Commit phase</i> =
                    applying to the DOM; <i>Event handler</i> = user-initiated callback (click, keydown,
                    etc.) which doesn't bubble to Error Boundaries.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Minimal boundary class */}
            <Styled.Section>
                <Styled.H2>Minimal Error Boundary (Drop-in)</Styled.H2>
                <Styled.Pre>
                    {`// A small, reusable boundary.
// Usage: <ErrorBoundary fallback={<Fallback />}> <Risky /> </ErrorBoundary>
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Switch to fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optional: send to monitoring service
    if (typeof this.props.onError === "function") {
      this.props.onError(error, errorInfo);
    }
    this.setState({ errorInfo });
    // errorInfo.componentStack includes a readable stack of component names
  }

  render() {
    if (this.state.hasError) {
      // Render provided fallback or a default
      return this.props.fallback ?? (
        <div role="alert">
          <h3>Something went wrong.</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`}
                </Styled.Pre>
                <Styled.Small>
                    <b>getDerivedStateFromError(error)</b> sets state to display the fallback.<br />
                    <b>componentDidCatch(error, info)</b> is for side effects (logging, telemetry).
                </Styled.Small>
            </Styled.Section>

            {/* 4) Basic usage */}
            <Styled.Section>
                <Styled.H2>Basic Usage</Styled.H2>
                <Styled.Pre>
                    {`function Fallback() {
  return (
    <div role="alert" style={{ padding: 16 }}>
      <h3>We hit a snag.</h3>
      <p>Try again or contact support if it persists.</p>
    </div>
  );
}

function ProblemChild() {
  // Simulate a render-time crash
  throw new Error("Render failed in ProblemChild");
  // return <div>OK</div>;
}

export default function Widget() {
  return (
    <ErrorBoundary fallback={<Fallback />}>
      <ProblemChild />
    </ErrorBoundary>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Granularity & placement */}
            <Styled.Section>
                <Styled.H2>Granularity & Placement</Styled.H2>
                <Styled.List>
                    <li>
                        Wrap <b>risky islands</b> (charts, maps, heavy widgets, 3rd-party) to contain failures.
                    </li>
                    <li>
                        Use <b>multiple boundaries</b> so one broken card doesn't take down the whole page.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Page() {
  return (
    <>
      <Header />
      <main>
        <ErrorBoundary fallback={<CardFallback />}>
          <ChartCard />
        </ErrorBoundary>

        <ErrorBoundary fallback={<CardFallback />}>
          <CommentsCard />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Resetting after an error */}
            <Styled.Section>
                <Styled.H2>Resetting the Boundary</Styled.H2>
                <Styled.List>
                    <li>
                        Boundaries don't auto-recover. To reset, change a <b>key</b> on the boundary or manage a
                        <b> reset token</b> in state (e.g., after “Try again”).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ReloadableWidget() {
  const [resetKey, setResetKey] = React.useState(0);
  return (
    <div>
      <button onClick={() => setResetKey(k => k + 1)}>Try again</button>
      <ErrorBoundary key={resetKey} fallback={<Fallback />}>
        <RiskyWidget />
      </ErrorBoundary>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Data errors -> escalate to boundary */}
            <Styled.Section>
                <Styled.H2>Escalating <i>Data Errors</i> to a Boundary</Styled.H2>
                <Styled.List>
                    <li>
                        Async fetch errors aren't caught automatically. Catch them and <b>throw during render</b>{" "}
                        to let the nearest boundary show its fallback.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function UserPanel({ id }) {
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let on = true;
    fetch("/api/users/" + id)
      .then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      .then(data => { if (on) setUser(data); })
      .catch(err => { if (on) setError(err); });
    return () => { on = false; };
  }, [id]);

  if (error) throw error;     // <-- escalates to nearest ErrorBoundary
  if (!user) return <Spinner />;
  return <ProfileCard user={user} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Pattern:</b> keep <Styled.InlineCode>error</Styled.InlineCode> in state; if present,
                    <Styled.InlineCode>throw error</Styled.InlineCode> during render. The boundary handles UI;
                    you keep logic local.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Event handler errors */}
            <Styled.Section>
                <Styled.H2>Event Handler Errors (Not Caught)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>try/catch</b> inside handlers, or set an error state and render a controlled
                        fallback.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function SaveButton() {
  const [error, setError] = React.useState(null);

  async function onClick() {
    try {
      await saveData();
      // toast.success("Saved");
    } catch (e) {
      setError(e);               // or toast.error(e.message)
    }
  }

  if (error) return <InlineError message={error.message} />;
  return <button onClick={onClick}>Save</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Logging & monitoring */}
            <Styled.Section>
                <Styled.H2>Logging & Monitoring</Styled.H2>
                <Styled.List>
                    <li>
                        Send <Styled.InlineCode>error</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>errorInfo.componentStack</Styled.InlineCode> to a service (Sentry,
                        LogRocket, Rollbar) inside <Styled.InlineCode>componentDidCatch</Styled.InlineCode>.
                    </li>
                    <li>
                        Include <b>user/session</b> context and <b>app version</b> to group issues and track
                        regressions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function reportError(error, info) {
  // Example stub: wire to your telemetry here
  console.log("[reportError]", error.message, info?.componentStack);
}

// <ErrorBoundary onError={reportError} fallback={<Fallback />}>...</ErrorBoundary>
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> place boundaries around risky, isolated UI islands.</li>
                    <li><b>Do</b> offer recovery (retry button) by resetting the boundary.</li>
                    <li><b>Do</b> log errors with component stacks for debugging.</li>
                    <li><b>Don't</b> expect boundaries to catch handler/async/server errors—handle those directly.</li>
                    <li><b>Don't</b> swallow errors silently; always surface a helpful message.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Fallback UI:</b> Replacement UI shown when a subtree errors.</li>
                    <li><b>Component stack:</b> Pretty-printed list of components involved when the error occurred.</li>
                    <li><b>Boundary scope:</b> The child subtree protected by the boundary.</li>
                    <li><b>Resetting:</b> Forcing the boundary to re-mount (e.g., by changing its key).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Error Boundaries protect users from blank screens, keep unaffected UI alive, and
                give you a place to log and recover. Use several small boundaries, provide a friendly
                fallback, and wire up monitoring.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ErrorBoundaries;
