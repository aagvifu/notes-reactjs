import { Styled } from "./styled";

const Retries = () => {
    return (
        <Styled.Page>
            <Styled.Title>Retries</Styled.Title>

            <Styled.Lead>
                <b>Retry</b> means trying an operation again after it failed. In UIs, we usually retry{" "}
                <i>network requests</i> to handle temporary problems (flaky internet, overloaded servers,
                transient 5xx). Good retry logic is <b>bounded</b> (max attempts), uses{" "}
                <b>backoff</b> (wait between attempts), adds <b>jitter</b> (randomness), and respects{" "}
                <b>idempotency</b> (safe to do again).
            </Styled.Lead>

            {/* 1) Why / When */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Retry:</b> Re-running a failed operation in hopes it succeeds on a later attempt.</li>
                    <li><b>Purpose:</b> Improve robustness against <i>transient</i> failures (e.g., 502/503/504, timeouts, DNS hiccups).</li>
                    <li><b>Scope:</b> Typically only for <i>reads</i> (GET) or <i>idempotent</i> writes, unless your backend supports idempotency keys.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (plain English)</Styled.H2>
                <Styled.List>
                    <li><b>Transient error:</b> Temporary problem likely to succeed if tried again (e.g., server busy).</li>
                    <li><b>Idempotent:</b> Doing the same request multiple times has the same effect as doing it once (e.g., GET is idempotent; POST usually is not).</li>
                    <li><b>Backoff:</b> Waiting before the next attempt (e.g., 300ms, then 600ms, then 1200ms...).</li>
                    <li><b>Exponential backoff:</b> Increase the wait time exponentially after each failure (x2, x3...).</li>
                    <li><b>Jitter:</b> Add randomness to backoff to avoid synchronized "thundering herd."</li>
                    <li><b>Max attempts:</b> Hard limit on how many times you'll try (e.g., 3 attempts total).</li>
                    <li><b>Retryable error:</b> An error you've classified as safe to retry (e.g., 502, 503, 504, 429, network failure).</li>
                    <li><b>Non-retryable error:</b> Should not be retried (e.g., 400, 401, 403, 404, invalid input).</li>
                    <li><b>Timeout:</b> Give up waiting after a duration (paired with <Styled.InlineCode>AbortController</Styled.InlineCode>).</li>
                    <li><b>Deduping:</b> Avoid sending the same in-flight request twice (cache or key-based guard).</li>
                    <li><b>Circuit breaker:</b> Temporarily stop calling a failing service to protect your app; try again later.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) When to retry vs. not */}
            <Styled.Section>
                <Styled.H2>When to Retry vs. When Not To</Styled.H2>
                <Styled.List>
                    <li><b>Retry</b> on: network errors, timeouts, HTTP <b>5xx</b>, <b>429</b> (Too Many Requests), sometimes <b>408</b> (Request Timeout).</li>
                    <li><b>Don't retry</b> on: <b>4xx</b> like 400 (bad input), 401/403 (auth), 404 (missing). Fix the cause instead.</li>
                    <li><b>Writes (POST/PUT/PATCH/DELETE):</b> retry only if <b>idempotent</b> (server supports idempotency keys) or you can safely detect duplicates.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Backoff recipes */}
            <Styled.Section>
                <Styled.H2>Backoff Strategies (with Jitter)</Styled.H2>
                <Styled.Pre>
                    {`// Exponential backoff with "full jitter":
// attempt: 1..N  | base: initial delay in ms (e.g., 300)
function backoffDelay(attempt, base = 300, factor = 2) {
  const exp = base * Math.pow(factor, attempt - 1);
  const jitter = Math.random() * exp;        // full jitter
  return jitter;                              // wait somewhere between 0..exp
}

// Optional: respect Retry-After (seconds) header from 429/503 responses
function retryAfterToMs(res) {
  const h = res.headers?.get?.("Retry-After");
  if (!h) return null;
  const n = Number(h);
  return Number.isFinite(n) ? n * 1000 : null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why jitter?</b> If all clients wait the same durations, they'll stampede the server again. Jitter spreads them out.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Practical: fetchWithRetry */}
            <Styled.Section>
                <Styled.H2>Practical: <code>fetchWithRetry</code></Styled.H2>
                <Styled.Pre>
                    {`// A minimal, safe default implementation for GET/other idempotent calls.
async function fetchWithRetry(url, options = {}, retryOpts = {}) {
  const {
    attempts = 3,               // total attempts (1 initial + 2 retries)
    base = 300,                 // base backoff (ms)
    factor = 2,                 // exponential factor
    classify,                   // (res, error) => "retry" | "fail" | "success"
    timeoutMs = 8000,           // per-attempt timeout
  } = retryOpts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });

        // Default classifier: retry on 429/5xx, success on 2xx/3xx, fail otherwise
        const decision = classify
          ? classify(res, null)
          : res.status >= 200 && res.status < 400
            ? "success"
            : [429, 500, 502, 503, 504].includes(res.status)
              ? "retry"
              : "fail";

        if (decision === "success") return res;
        if (decision === "fail" || attempt === attempts) throw res;

        // Wait before next attempt (Retry-After takes priority when present)
        const ra = retryAfterToMs(res);
        const delay = ra ?? backoffDelay(attempt, base, factor);
        await new Promise(r => setTimeout(r, delay));
        continue;
      } catch (err) {
        // Network/timeout errors are usually retryable
        const isAbort = (err?.name === "AbortError") || ("" + err).includes("timeout");
        const isNetwork = err instanceof TypeError; // fetch network failure
        const shouldRetry = isAbort || isNetwork;

        if (!shouldRetry || attempt === attempts) throw err;

        const delay = backoffDelay(attempt, base, factor);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  } finally {
    clearTimeout(timer);
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Timeouts &amp; cancellation:</b> Each attempt uses <Styled.InlineCode>AbortController</Styled.InlineCode>.
                    You can also pass your own <Styled.InlineCode>signal</Styled.InlineCode> via <Styled.InlineCode>options</Styled.InlineCode> for user-initiated cancel.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Usage examples */}
            <Styled.Section>
                <Styled.H2>Usage Examples</Styled.H2>
                <Styled.Pre>
                    {`// GET (safe by default)
const res = await fetchWithRetry("/api/products?limit=50");
const data = await res.json();

// Custom classification (treat 409 as retryable only if body says "try-later")
const res2 = await fetchWithRetry("/api/process", {}, {
  attempts: 4,
  timeoutMs: 10000,
  classify: async (res) => {
    if (res.ok) return "success";
    if ([502, 503, 504, 429].includes(res.status)) return "retry";
    if (res.status === 409) {
      const body = await res.clone().json().catch(() => ({}));
      return body?.temporary ? "retry" : "fail";
    }
    return "fail";
  }
});

// POST (only if idempotent!)
// Use server-supported idempotency keys to make POST safe to retry.
const idempotencyKey = crypto.randomUUID();
const res3 = await fetchWithRetry("/api/charge", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
  body: JSON.stringify({ amount: 4999, currency: "INR" })
}, { attempts: 3 });`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Idempotency key:</b> A unique key clients send so the server treats repeats as the
                    same operation (prevents double-charges). Your backend must implement it.
                </Styled.Small>
            </Styled.Section>

            {/* 7) UI patterns */}
            <Styled.Section>
                <Styled.H2>UI Patterns</Styled.H2>
                <Styled.List>
                    <li><b>Auto-retry + manual retry:</b> Try a few times automatically, then show a "Try again" button.</li>
                    <li><b>Disable while in-flight:</b> Prevent spam clicks; show a spinner and remaining attempts.</li>
                    <li><b>Progressive fallback:</b> Small skeleton → partial cached data → final data when ready.</li>
                    <li><b>Explain errors:</b> Show human text (e.g., "Server is busy, retrying…"). Include a short tech reason for dev tools.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Sketch: simple manual retry pattern (React)
function LoadUsers() {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  async function load() {
    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetchWithRetry("/api/users", {}, { attempts: 3 });
      const json = await res.json();
      setState({ status: "success", data: json, error: null });
    } catch (e) {
      setState({ status: "error", data: null, error: e });
    }
  }

  React.useEffect(() => { load(); }, []);

  if (state.status === "loading") return <p>Loading… (auto-retrying if needed)</p>;
  if (state.status === "error") return <button onClick={load}>Try again</button>;
  return <pre>{JSON.stringify(state.data, null, 2)}</pre>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> cap attempts and use exponential backoff with jitter.</li>
                    <li><b>Do</b> respect <Styled.InlineCode>Retry-After</Styled.InlineCode> headers when present.</li>
                    <li><b>Do</b> retry only <b>retryable</b> errors; fail fast for invalid inputs.</li>
                    <li><b>Do</b> make writes idempotent before retrying (idempotency keys or server-side safeguards).</li>
                    <li><b>Don't</b> retry blindly — you can amplify load during an outage.</li>
                    <li><b>Don't</b> forget timeouts and user cancellation (e.g., close modal / navigate away).</li>
                    <li><b>Don't</b> show cryptic errors; guide the user with a helpful message and a retry option.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Throttling:</b> Server intentionally limits your rate (HTTP 429). Back off and retry later.</li>
                    <li><b>Rate limiting:</b> Policy that caps how many requests you can make in a window.</li>
                    <li><b>Circuit breaker:</b> Pattern that "opens" after repeated failures to stop sending requests, then "half-opens" to test recovery.</li>
                    <li><b>Deduping:</b> Prevent duplicate in-flight requests by keying them and sharing the same promise.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Retry only when it's safe and likely to help. Use bounded attempts, exponential
                backoff with jitter, honor <i>Retry-After</i>, make writes idempotent, and always include a
                clear path for the user to try again.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Retries;
