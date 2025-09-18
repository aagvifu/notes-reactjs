import { Styled } from "./styled";

const AbortController = () => {
    return (
        <Styled.Page>
            <Styled.Title>AbortController</Styled.Title>

            <Styled.Lead>
                <b>AbortController</b> is a Web API that lets you <b>cancel in-flight async work</b> like{" "}
                <Styled.InlineCode>fetch()</Styled.InlineCode> or{" "}
                <Styled.InlineCode>addEventListener()</Styled.InlineCode>. It exposes an{" "}
                <Styled.InlineCode>AbortSignal</Styled.InlineCode> you pass to an API; call{" "}
                <Styled.InlineCode>controller.abort(reason?)</Styled.InlineCode> to stop that work <i>early</i>.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>AbortController:</b> an object you create with{" "}
                        <Styled.InlineCode>new AbortController()</Styled.InlineCode>. It has{" "}
                        <Styled.InlineCode>signal</Styled.InlineCode> and an{" "}
                        <Styled.InlineCode>abort()</Styled.InlineCode> method.
                    </li>
                    <li>
                        <b>AbortSignal:</b> read-only object found at{" "}
                        <Styled.InlineCode>controller.signal</Styled.InlineCode>; you pass it into APIs like{" "}
                        <Styled.InlineCode>fetch(url, {`{ "{" }} signal {{ "}" }`})</Styled.InlineCode>. When aborted, the API
                        should stop and reject/clean up.
                    </li>
                    <li>
                        <b>AbortError:</b> a <i>DOMException</i> name used by many APIs (e.g.,{" "}
                        <Styled.InlineCode>fetch</Styled.InlineCode>) to indicate the operation ended because it was aborted—not
                        because it truly failed.
                    </li>
                    <li>
                        <b>In-flight request:</b> a network request currently running (not yet resolved/rejected).
                    </li>
                    <li>
                        <b>Cancellation:</b> intentionally terminating an async operation before completion.
                    </li>
                    <li>
                        <b>Idempotent action:</b> safe to run multiple times without changing the outcome; good target for retries.
                    </li>
                    <li>
                        <b>Race condition:</b> when the order of async completions changes the result (e.g., slow response overwrites
                        a newer one). Aborting previous requests helps prevent this.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic fetch + abort */}
            <Styled.Section>
                <Styled.H2>Basic usage with <code>fetch()</code></Styled.H2>
                <Styled.Pre>
                    {`const controller = new AbortController();
const { signal } = controller;

fetch("/api/data", { signal })
  .then(r => r.json())
  .then(data => console.log("data:", data))
  .catch(err => {
    if (err.name === "AbortError") {
      // expected: we aborted on purpose
      return;
    }
    // real error handling
    console.error(err);
  });

// somewhere later...
controller.abort("user navigated away"); // optional reason (string, Error, etc.)`}
                </Styled.Pre>
                <Styled.Small>
                    If the signal is already aborted when calling <Styled.InlineCode>fetch</Styled.InlineCode>, it rejects
                    immediately with <Styled.InlineCode>AbortError</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) React pattern: cancel on unmount / change */}
            <Styled.Section>
                <Styled.H2>React pattern: cancel on unmount or dependency change</Styled.H2>
                <Styled.Pre>
                    {`function useUser(userId) {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    setState({ status: "loading", data: null, error: null });

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setState({ status: "success", data, error: null }))
      .catch(err => {
        if (err.name === "AbortError") return; // ignore controlled cancellation
        setState({ status: "error", data: null, error: err });
      });

    // Cleanup aborts any in-flight request when userId changes or component unmounts
    return () => controller.abort("effect cleanup");
  }, [userId]);

  return state; // { status, data, error }
}`}
                </Styled.Pre>
                <Styled.Small>
                    This prevents <i>stale</i> responses from older <Styled.InlineCode>userId</Styled.InlineCode> overwriting newer
                    state and avoids work after unmount (memory leaks).
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cancel previous when starting a new request */}
            <Styled.Section>
                <Styled.H2>Typeahead pattern: cancel previous request when starting a new one</Styled.H2>
                <Styled.Pre>
                    {`function useCancelableSearch() {
  const ctrlRef = React.useRef(null);
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  async function search(q) {
    // Abort any previous in-flight request
    ctrlRef.current?.abort("new search");
    const controller = new AbortController();
    ctrlRef.current = controller;

    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetch(\`/api/search?q=\${encodeURIComponent(q)}\`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setState({ status: "success", data, error: null });
    } catch (err) {
      if (err.name === "AbortError") return;
      setState({ status: "error", data: null, error: err });
    } finally {
      // clear only if this was the active controller
      if (ctrlRef.current === controller) ctrlRef.current = null;
    }
  }

  return { ...state, search };
}`}
                </Styled.Pre>
                <Styled.Small>
                    Each new query cancels the previous one, eliminating race conditions where older responses arrive last.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Timeouts */}
            <Styled.Section>
                <Styled.H2>Timeouts with AbortController</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Modern API:</b> <Styled.InlineCode>AbortSignal.timeout(ms)</Styled.InlineCode> makes a signal that aborts
                        after a given time.
                    </li>
                    <li>
                        <b>Fallback:</b> create a controller and call <Styled.InlineCode>abort()</Styled.InlineCode> via{" "}
                        <Styled.InlineCode>setTimeout</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Modern (where supported)
const signal = AbortSignal.timeout(3000);
const res = await fetch("/api/slow", { signal });

// Fallback
const controller = new AbortController();
const id = setTimeout(() => controller.abort(new Error("timeout")), 3000);
try {
  const res = await fetch("/api/slow", { signal: controller.signal });
  // ...
} finally {
  clearTimeout(id);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Aborting multiple things with one signal */}
            <Styled.Section>
                <Styled.H2>Abort multiple tasks together</Styled.H2>
                <Styled.Pre>
                    {`const controller = new AbortController();
const { signal } = controller;

const p1 = fetch("/api/a", { signal });
const p2 = fetch("/api/b", { signal });
const p3 = fetch("/api/c", { signal });

controller.abort("navigate away"); // cancels all three`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Auto-removing event listeners */}
            <Styled.Section>
                <Styled.H2>Auto-remove event listeners with a signal</Styled.H2>
                <Styled.Pre>
                    {`const controller = new AbortController();
const { signal } = controller;

function onMove(e) { /* ... */ }

window.addEventListener("pointermove", onMove, { signal });
// later:
controller.abort(); // removes the listener automatically`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>addEventListener</Styled.InlineCode> supports a{" "}
                    <Styled.InlineCode>signal</Styled.InlineCode> option; when aborted, the listener is removed. This prevents
                    leaks.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Handling errors correctly */}
            <Styled.Section>
                <Styled.H2>Error handling: distinguish abort from failures</Styled.H2>
                <Styled.List>
                    <li>
                        Check <Styled.InlineCode>err.name === "AbortError"</Styled.InlineCode> to silently ignore controlled
                        cancellations.
                    </li>
                    <li>
                        Treat network/HTTP problems as real errors; surface them to users or retry if appropriate (idempotent GET).
                    </li>
                    <li>
                        Once aborted, a controller <b>can't be reused</b>; create a new one for the next request.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> create a fresh controller per request or per logical batch of work.</li>
                    <li><b>Do</b> abort in <Styled.InlineCode>useEffect</Styled.InlineCode> cleanup to stop stale work.</li>
                    <li><b>Do</b> use it to avoid race conditions in typeahead, tab switches, or route changes.</li>
                    <li><b>Don't</b> swallow all errors—only ignore <Styled.InlineCode>AbortError</Styled.InlineCode>.</li>
                    <li><b>Don't</b> mutate UI after abort; the request result is no longer relevant.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (quick reference)</Styled.H2>
                <Styled.List>
                    <li><b>Abort:</b> to stop an async operation early.</li>
                    <li><b>Signal:</b> an object that represents “should we stop?” state, passed into APIs.</li>
                    <li><b>Reason:</b> optional value passed to <Styled.InlineCode>abort()</Styled.InlineCode> for context.</li>
                    <li><b>AbortError:</b> a special error name to indicate controlled cancellation.</li>
                    <li><b>Cleanup:</b> code that runs to remove listeners/stop timers/cancel requests.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>AbortController</b> to cancel work you no longer need—on route changes, tab switches, or new
                queries. Always pass the signal, abort in cleanup, and treat AbortError as a normal control-flow event.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AbortController;
