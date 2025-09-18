import { Styled } from "./styled";

const LoadingErrorStates = () => {
    return (
        <Styled.Page>
            <Styled.Title>Loading &amp; Error States</Styled.Title>

            <Styled.Lead>
                Almost every frontend fetches data. A great UX depends on handling the full lifecycle:
                <b> idle → loading → success → empty → error → retry</b>. This page explains the terms,
                anti-patterns, and battle-tested patterns for beginners.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Idle:</b> No request has started yet.</li>
                    <li><b>Loading (pending):</b> A request is in flight.</li>
                    <li><b>Success:</b> Data arrived and is usable.</li>
                    <li><b>Empty state:</b> Success, but the data set is empty (e.g., 200 OK, items=[]).</li>
                    <li><b>Error:</b> The request failed (network error, timeout) or the response is not acceptable (4xx/5xx, parse error).</li>
                    <li><b>Retry:</b> A subsequent attempt after a failure, sometimes with backoff (wait a bit before trying again).</li>
                    <li><b>Cancellation:</b> Intentionally stop a request that's no longer needed (e.g., user navigated away). In the browser, use <code>AbortController</code>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) State model */}
            <Styled.Section>
                <Styled.H2>Minimal State Model</Styled.H2>
                <Styled.Pre>
                    {`// A simple "remote data" shape you can keep in component state
type RemoteData<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; error: Error };

`}
                </Styled.Pre>
                <Styled.Small>
                    Keep remote status inside one object. Avoid multiple booleans that conflict (e.g., <i>isLoading</i> and <i>hasError</i> both true).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Example: basic fetch with all branches */}
            <Styled.Section>
                <Styled.H2>Example: Basic Fetch with All Branches</Styled.H2>
                <Styled.Pre>
                    {`function Users() {
  const [remote, setRemote] = React.useState({ status: "idle" });

  React.useEffect(() => {
    let ignore = false;               // defensive guard against stale sets
    setRemote({ status: "loading" });

    fetch("/api/users")
      .then(async (r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        const data = await r.json();
        if (ignore) return;
        if (Array.isArray(data) && data.length === 0) {
          setRemote({ status: "empty" });
        } else {
          setRemote({ status: "success", data });
        }
      })
      .catch((err) => {
        if (!ignore) setRemote({ status: "error", error: err });
      });

    return () => { ignore = true; };  // prevent state update after unmount
  }, []);

  if (remote.status === "loading") return <Spinner />;
  if (remote.status === "error") return <ErrorBox error={remote.error} />;
  if (remote.status === "empty") return <EmptyState message="No users yet" />;
  if (remote.status === "success") {
    return <ul>{remote.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
  }
  return <button onClick={() => /* trigger */ null}>Load users</button>; // idle
}`}
                </Styled.Pre>
                <Styled.Small>
                    Branch your UI by <b>status</b>. Provide a dedicated empty state, not just a blank screen.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cancellation with AbortController */}
            <Styled.Section>
                <Styled.H2>Cancellation with <code>AbortController</code></Styled.H2>
                <Styled.List>
                    <li><b>Why:</b> Stop wasted work and avoid racing responses when the user navigates or changes filters quickly.</li>
                    <li><b>How:</b> Create a controller per request; pass <code>signal</code> to <code>fetch</code>; call <code>controller.abort()</code> in cleanup.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function SearchUsers({ query }) {
  const [remote, setRemote] = React.useState({ status: "idle" });

  React.useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setRemote({ status: "loading" });

    fetch(\`/api/users?q=\${encodeURIComponent(query)}\`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        const data = await r.json();
        setRemote(Array.isArray(data) && data.length === 0
          ? { status: "empty" }
          : { status: "success", data });
      })
      .catch((err) => {
        // If aborted, err.name === "AbortError" — treat as non-error UI-wise
        if (err.name === "AbortError") return;
        setRemote({ status: "error", error: err });
      });

    return () => controller.abort();
  }, [query]);

  /* render remote... */
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Errors: types & messages */}
            <Styled.Section>
                <Styled.H2>Error Types &amp; Messages</Styled.H2>
                <Styled.List>
                    <li><b>Network error:</b> No response (offline, DNS, CORS). Message like “You appear to be offline.”</li>
                    <li><b>HTTP error:</b> Response with non-2xx status. Show user-safe text; log status code for diagnostics.</li>
                    <li><b>Parse error:</b> Response body isn't valid JSON. Offer “Try again” and log.</li>
                    <li><b>App error:</b> Server returned {`{ ok:false, message }`}. Show <i>message</i> if safe.</li>
                    <li><b>Validation error (422):</b> Highlight specific fields and helper texts.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ErrorBox({ error }) {
  const msg = error?.userMessage || error?.message || "Something went wrong.";
  return <div role="alert" aria-live="polite" className="error">{msg}</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Always provide an accessible <b>role="alert"</b> container so screen readers announce errors.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Retry & backoff */}
            <Styled.Section>
                <Styled.H2>Retry &amp; Backoff (When Appropriate)</Styled.H2>
                <Styled.List>
                    <li><b>Automatic retry</b> is useful for flaky networks, but do not retry on user errors (e.g., 401/403/422).</li>
                    <li><b>Exponential backoff:</b> wait progressively longer between attempts (e.g., 300ms, 600ms, 1200ms…).</li>
                    <li><b>Give control:</b> show a “Retry” button for manual attempts.</li>
                </Styled.List>
                <Styled.Pre>
                    {`async function fetchWithRetry(url, { attempts = 3, base = 300, ...opts } = {}) {
  let n = 0;
  while (true) {
    try {
      const r = await fetch(url, opts);
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
      return await r.json();
    } catch (err) {
      n++;
      const retriable = !(err.status >= 400 && err.status < 500); // don't retry 4xx (usually)
      if (n >= attempts || !retriable) throw err;
      const delay = base * 2 ** (n - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Skeletons, spinners & placeholders */}
            <Styled.Section>
                <Styled.H2>Skeletons, Spinners &amp; Placeholders</Styled.H2>
                <Styled.List>
                    <li><b>Skeletons:</b> Show the structure of upcoming content; best for lists/cards.</li>
                    <li><b>Spinner:</b> Simple “busy” indicator; fine for short waits &lt; 500ms.</li>
                    <li><b>Progress:</b> If you know progress (upload), show determinate progress bars.</li>
                    <li><b>Placeholders:</b> For images, reserve space to prevent layout shift.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ListSkeleton({ rows = 5 }) {
  return (
    <ul aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="skeleton-row" />
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Race conditions & in-flight dedupe */}
            <Styled.Section>
                <Styled.H2>Race Conditions &amp; In-Flight Deduplication</Styled.H2>
                <Styled.List>
                    <li><b>Race condition:</b> A slower old request overwrites state after a faster new request resolves.</li>
                    <li><b>Fix:</b> cancel the old request, or gate state updates to the “latest request id”.</li>
                    <li><b>In-flight dedupe:</b> If the same URL is requested again immediately, reuse the existing promise.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Gate updates to the latest request
let reqId = 0;
function useLatestGuardedFetch(url) {
  const [remote, setRemote] = React.useState({ status: "idle" });

  React.useEffect(() => {
    const id = ++reqId;
    setRemote({ status: "loading" });
    fetch(url).then(async (r) => {
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
      const data = await r.json();
      if (id === reqId) setRemote(
        Array.isArray(data) && data.length === 0 ? { status: "empty" } : { status: "success", data }
      );
    }).catch((e) => { if (id === reqId) setRemote({ status: "error", error: e }); });
  }, [url]);

  return remote;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility & UX checklist */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; UX Checklist</Styled.H2>
                <Styled.List>
                    <li>Announce loading with <code>aria-busy="true"</code> on regions that are updating.</li>
                    <li>Use <code>role="status"</code> or <code>role="alert"</code> to announce success/errors.</li>
                    <li>Keep focus: after errors, focus the error heading/button so keyboard users aren't lost.</li>
                    <li>Provide a visible retry button; keyboard and screen reader accessible.</li>
                    <li>Use timeouts carefully; don't auto-dismiss critical errors without user acknowledgement.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> model state with a single <i>status</i> field; render per-branch UI.</li>
                    <li><b>Do</b> show <i>empty</i> separately from <i>error</i>.</li>
                    <li><b>Do</b> cancel or gate outdated requests.</li>
                    <li><b>Don't</b> hide errors behind generic “Something went wrong” if you can show a helpful message.</li>
                    <li><b>Don't</b> block the entire screen for partial loads; prefer skeletons and progressively reveal content.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Backoff:</b> Increasing wait times between retries.</li>
                    <li><b>Dedupe:</b> Coalescing identical in-flight requests to one network call.</li>
                    <li><b>Fallback UI:</b> A temporary UI shown while content is unavailable.</li>
                    <li><b>Optimistic UI:</b> Temporarily show the expected outcome before the server confirms it.</li>
                    <li><b>Toast:</b> Small transient alert for success/error that doesn't steal focus.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Represent loading clearly, handle empty vs error distinctly, cancel outdated requests,
                offer retries with sensible backoff, and announce changes accessibly. Users should always know
                what's happening and what they can do next.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LoadingErrorStates;
