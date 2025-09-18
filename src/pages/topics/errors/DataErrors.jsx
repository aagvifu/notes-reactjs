import React from "react";
import { Styled } from "./styled";

const DataErrors = () => {
    return (
        <Styled.Page>
            <Styled.Title>Data Errors</Styled.Title>

            <Styled.Lead>
                <b>Data errors</b> are problems fetching, parsing, validating, or updating data
                (APIs, storage, caches). They are different from <i>render-time</i> errors (caught by
                Error Boundaries). Handle them by detecting failure, showing a clear UI state,
                and offering recovery (retry, edit, back).
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Data error:</b> Any failure while <em>communicating with</em> or <em>processing</em> data sources
                        (network down, 4xx/5xx, invalid JSON, schema mismatch, timeouts, conflicts).
                    </li>
                    <li>
                        <b>Runtime (render) error:</b> A bug that throws while rendering React components. These are caught by
                        <Styled.InlineCode>Error Boundaries</Styled.InlineCode> (separate topic).
                    </li>
                    <li>
                        <b>Empty state:</b> A valid result with no items (not an error). Needs a distinct UI (“No results”).
                    </li>
                    <li>
                        <b>Fallback UI:</b> A specific screen/section shown when a data error happens (message + actions).
                    </li>
                    <li>
                        <b>Retry:</b> Re-attempting a failed operation, often with <i>exponential backoff</i> and <i>jitter</i>.
                    </li>
                    <li>
                        <b>Idempotency:</b> Doing the same request multiple times yields the same effect (important when retrying writes).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Types of data errors */}
            <Styled.Section>
                <Styled.H2>Common Types of Data Errors</Styled.H2>
                <Styled.List>
                    <li><b>Network failures:</b> offline, DNS issues, TLS errors, connection reset.</li>
                    <li><b>HTTP errors:</b> <i>4xx</i> (client-side: 400, 401, 403, 404, 422) and <i>5xx</i> (server-side: 500, 502, 503, 504).</li>
                    <li><b>Protocol/format errors:</b> invalid JSON, unexpected content-type, deserialization failures.</li>
                    <li><b>Validation errors:</b> response shape doesn't match your expected schema; field-level server errors.</li>
                    <li><b>Timeouts:</b> request takes too long; cancellations via <Styled.InlineCode>AbortController</Styled.InlineCode>.</li>
                    <li><b>Concurrency/conflicts:</b> write conflicts (409), ETag/version mismatch.</li>
                    <li><b>Permission/auth:</b> unauthenticated (401) or unauthorized (403).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Detect & normalize */}
            <Styled.Section>
                <Styled.H2>Detecting & Normalizing Errors</Styled.H2>
                <Styled.Pre>
                    {`// A tiny helper that returns a normalized "result" instead of throwing
async function getJSON(url, { signal } = {}) {
  try {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    const contentType = res.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");
    const body = isJSON ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      return {
        ok: false,
        error: {
          kind: "http",
          status: res.status,
          message: (body && body.message) || res.statusText || "Request failed",
        },
      };
    }
    if (!isJSON || body == null) {
      return { ok: false, error: { kind: "format", message: "Invalid or empty JSON" } };
    }
    return { ok: true, data: body };
  } catch (e) {
    if (e.name === "AbortError") {
      return { ok: false, error: { kind: "timeout", message: "Request was aborted/timeout" } };
    }
    return { ok: false, error: { kind: "network", message: e.message || "Network error" } };
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Normalize errors into a consistent shape so the UI can render a clear message and actions.
                </Styled.Small>
            </Styled.Section>

            {/* 4) UI states */}
            <Styled.Section>
                <Styled.H2>UI States to Design</Styled.H2>
                <Styled.List>
                    <li><b>Loading:</b> skeletons/spinners; avoid layout shift.</li>
                    <li><b>Success:</b> show data.</li>
                    <li><b>Empty:</b> “No items” with a call-to-action.</li>
                    <li><b>Error:</b> friendly summary + actions (Retry, Edit input, Back, Contact support).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function UsersList() {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    const c = new AbortController();
    setState({ status: "loading", data: null, error: null });
    getJSON("/api/users", { signal: c.signal }).then((res) => {
      if (res.ok) setState({ status: "success", data: res.data, error: null });
      else setState({ status: "error", data: null, error: res.error });
    });
    return () => c.abort();
  }, []);

  if (state.status === "loading") return <div>Loading…</div>;
  if (state.status === "error") {
    return (
      <div role="alert">
        <p>Couldn't load users: {state.error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  if (state.data.length === 0) return <div>No users yet</div>;
  return <ul>{state.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Timeouts, aborts, retries */}
            <Styled.Section>
                <Styled.H2>Timeouts, Aborts & Retries</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Timeout:</b> wrap <Styled.InlineCode>AbortController</Styled.InlineCode>; if it fires, show a specific message (“Timed out”).
                    </li>
                    <li>
                        <b>Retry with backoff:</b> for transient errors (5xx, network). Use exponential backoff + jitter. Avoid retrying on 4xx (except 429).
                    </li>
                    <li>
                        <b>Idempotent writes:</b> safe to retry (e.g., PUT with an idempotency key); non-idempotent writes need care.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function withTimeout(ms, controller) {
  const id = setTimeout(() => controller.abort(), ms);
  return () => clearTimeout(id);
}

async function fetchWithRetry(url, { attempts = 3, baseDelay = 300 } = {}) {
  let n = 0;
  while (n < attempts) {
    const c = new AbortController();
    const clear = withTimeout(8000, c); // 8s timeout
    const res = await getJSON(url, { signal: c.signal });
    clear();

    if (res.ok) return res;
    const transient = res.error.kind === "network" || res.error.kind === "timeout" || (res.error.kind === "http" && res.error.status >= 500);
    if (!transient) return res;

    n++;
    const jitter = Math.random() * 100;
    const delay = Math.pow(2, n - 1) * baseDelay + jitter;
    await new Promise(r => setTimeout(r, delay));
  }
  return { ok: false, error: { kind: "retry", message: "Gave up after retries" } };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Validation & parsing */}
            <Styled.Section>
                <Styled.H2>Validation & Schema Checking</Styled.H2>
                <Styled.List>
                    <li><b>Schema validation:</b> ensure response has expected fields/types before using it.</li>
                    <li><b>Graceful degradation:</b> tolerate extra fields, but fail clearly if required fields are missing.</li>
                    <li><b>Field errors:</b> show errors near the fields; keep a page-level summary for screen readers.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function validateUserList(json) {
  if (!Array.isArray(json)) return { ok: false, message: "Expected an array" };
  for (const u of json) {
    if (typeof u.id !== "string" && typeof u.id !== "number") return { ok: false, message: "Invalid id" };
    if (typeof u.name !== "string") return { ok: false, message: "Invalid name" };
  }
  return { ok: true, data: json };
}

async function loadValidatedUsers() {
  const res = await getJSON("/api/users");
  if (!res.ok) return res;
  const v = validateUserList(res.data);
  return v.ok ? { ok: true, data: v.data } : { ok: false, error: { kind: "schema", message: v.message } };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Optimistic updates & rollback */}
            <Styled.Section>
                <Styled.H2>Optimistic Updates & Rollback</Styled.H2>
                <Styled.List>
                    <li><b>Optimistic update:</b> update UI first, then confirm with server; if it fails, roll back and show a message.</li>
                    <li><b>Conflict handling:</b> for 409/412, refetch latest and let the user resolve or re-apply their change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useOptimisticLike(initialLiked, id) {
  const [liked, setLiked] = React.useState(initialLiked);
  async function toggle() {
    const prev = liked;
    setLiked(!prev); // optimistic
    const res = await fetchWithRetry('/api/like/' + id, { attempts: 1 });
    if (!res.ok) {
      setLiked(prev); // rollback
      alert("Could not save your like. Please try again.");
    }
  }
  return { liked, toggle };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Accessibility & UX */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX Tips</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>role="status"</Styled.InlineCode> for loading and{" "}
                        <Styled.InlineCode>role="alert"</Styled.InlineCode> for errors so screen readers announce them.
                    </li>
                    <li>Keep error messages human, short, and actionable. Offer a clear next step.</li>
                    <li>Preserve user input on error; don't wipe forms.</li>
                    <li>Prefer inline errors near the cause; use toasts for transient notices only.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Logging & monitoring hooks */}
            <Styled.Section>
                <Styled.H2>Logging & Monitoring (overview)</Styled.H2>
                <Styled.List>
                    <li><b>Client logs:</b> capture error kind, status, URL, user action, correlation id.</li>
                    <li><b>Privacy:</b> avoid sending PII; redact sensitive fields.</li>
                    <li><b>Alerting:</b> aggregate and alert on spikes (e.g., 5xx rate, timeouts).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function logError(error, context = {}) {
  // Example: send to your logging endpoint or console in dev
  if (process.env.NODE_ENV !== "production") {
    console.error("[data-error]", { error, context });
  }
  // fetch('/logs', { method: 'POST', body: JSON.stringify({ error, context }) });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't & Checklist */}
            <Styled.Section>
                <Styled.H2>Do / Don't & Checklist</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> distinguish empty vs error states.</li>
                    <li><b>Do</b> show actionable fallback UI (Retry, Change filters, Back).</li>
                    <li><b>Do</b> retry transient failures with backoff; avoid retry loops for 4xx.</li>
                    <li><b>Do</b> time out requests and allow cancel.</li>
                    <li><b>Don't</b> swallow errors silently; log with context.</li>
                    <li><b>Don't</b> block the whole app for a single widget failure; scope errors.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Treat data errors as first-class states. Detect precisely, normalize errors,
                present clear fallback UI, and provide safe recovery paths (retry, edit, rollback, back).
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DataErrors;
