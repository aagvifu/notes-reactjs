import { Styled } from "./styled";

const EffectForFetching = () => {
    return (
        <Styled.Page>
            <Styled.Title>Anti-Pattern: Effect for Fetching</Styled.Title>

            <Styled.Lead>
                <b>Effect for Fetching</b> refers to the habit of performing network requests inside{" "}
                <Styled.InlineCode>useEffect</Styled.InlineCode> during component mount. While it works,
                it frequently creates <i>race conditions</i>, duplicate requests under <i>Strict Mode</i>,
                tangled <i>loading/error state</i> handling, and no <i>caching</i>. Prefer dedicated data
                fetching patterns.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Effect (useEffect):</b> A hook for synchronizing a component with an external system
                        (DOM, subscriptions, timers, network). Effects run <i>after</i> render.
                    </li>
                    <li>
                        <b>Race condition:</b> Multiple async operations complete in an unexpected order, so a
                        newer result can be overwritten by an older one.
                    </li>
                    <li>
                        <b>React Strict Mode (dev):</b> React intentionally mounts, unmounts, and re-mounts components
                        to help surface side-effect bugs. This can trigger <i>duplicate</i> fetches when done in effects.
                    </li>
                    <li>
                        <b>Idempotent:</b> An operation that can be performed multiple times with the same result and without unintended side effects.
                    </li>
                    <li>
                        <b>Cancellation:</b> Stopping an ongoing async operation (e.g., via <Styled.InlineCode>AbortController</Styled.InlineCode>) so stale results don't update state after unmount.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why it's an anti-pattern (pain points) */}
            <Styled.Section>
                <Styled.H2>Why Using Effects for Fetching Causes Pain</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Duplicate requests:</b> Strict Mode double-invokes effects in development, often hitting your API twice.
                    </li>
                    <li>
                        <b>Races & stale data:</b> Switching params quickly can let an older request finish last and overwrite newer data.
                    </li>
                    <li>
                        <b>Manual state machine:</b> You build <i>loading</i>, <i>error</i>, <i>retry</i>, and <i>cache</i> logic by hand.
                    </li>
                    <li>
                        <b>Tight coupling:</b> Networking logic ends up mixed with rendering code; testing gets harder.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) The "usual" effect approach (and problems) */}
            <Styled.Section>
                <Styled.H2>The Common Approach (and Its Problems)</Styled.H2>
                <Styled.Pre>
                    {`function Users({ orgId }) {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancelled = false;                  // manual cancellation guard
    setState({ status: "loading", data: null, error: null });

    fetch(\`/api/orgs/\${orgId}/users\`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      .then(data => { if (!cancelled) setState({ status: "success", data, error: null }); })
      .catch(error => { if (!cancelled) setState({ status: "error", data: null, error }); });

    return () => { cancelled = true; };     // avoid setState after unmount
  }, [orgId]);

  // ...render based on state.status
}`}
                </Styled.Pre>
                <Styled.Small>
                    This works but you're hand-rolling a fragile state machine, with potential double fetches under Strict Mode,
                    no cache, and a DIY retry strategy.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Better patterns */}
            <Styled.Section>
                <Styled.H2>Better Patterns (Use These Instead)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Event-driven fetching:</b> Fetch in response to a user interaction (e.g., button click or form submit),
                        not automatically on mount.
                    </li>
                    <li>
                        <b>Route loaders (React Router):</b> Fetch data <i>outside</i> the component in the router layer,
                        pass results as props. You get co-located data and URL, fewer effect footguns.
                    </li>
                    <li>
                        <b>Data libraries:</b> Use a library (e.g., TanStack Query/SWR) for cache, retries, dedupe, and status handling.
                    </li>
                    <li>
                        <b>Suspense data APIs:</b> Where available in your setup, use data APIs designed for Suspense to keep UI declarative.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// 4a) Event-driven: explicit fetch on user intent
function SearchUsers() {
  const [q, setQ] = React.useState("");
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  async function onSubmit(e) {
    e.preventDefault();                       // user-driven, not auto on mount
    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetch(\`/api/users?q=\${encodeURIComponent(q)}\`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setState({ status: "success", data, error: null });
    } catch (error) {
      setState({ status: "error", data: null, error });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users..." />
      <button type="submit">Search</button>
      {/* render state */}
    </form>
  );
}
`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// 4b) React Router loader (conceptual example)
/*
export async function usersLoader({ params }) {
  const res = await fetch(\`/api/orgs/\${params.orgId}/users\`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json(); // returned value becomes route data
}
*/
`}
                </Styled.Pre>
                <Styled.Small>
                    With loaders, components read data directly from the router context; there's no effect to write or maintain.
                </Styled.Small>
            </Styled.Section>

            {/* 5) If you *must* fetch in an effect */}
            <Styled.Section>
                <Styled.H2>If You Must Use an Effect, Do It Defensively</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Abort on unmount:</b> Use <Styled.InlineCode>AbortController</Styled.InlineCode> to cancel in-flight requests.
                    </li>
                    <li>
                        <b>Guard against races:</b> Track the latest request; ignore results from older requests.
                    </li>
                    <li>
                        <b>Stable dependencies:</b> Keep the dependency array minimal and inputs stable to avoid accidental refires.
                    </li>
                    <li>
                        <b>Idempotence:</b> Make effect logic safe to run more than once (anticipate Strict Mode).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Products({ category }) {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    const ctrl = new AbortController();
    let reqId = Math.random();                   // track "this" request
    setState({ status: "loading", data: null, error: null });

    (async () => {
      try {
        const res = await fetch(\`/api/products?cat=\${category}\`, { signal: ctrl.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        // simple "is latest" guard by closure:
        if (!ctrl.signal.aborted) {
          setState({ status: "success", data, error: null });
        }
      } catch (error) {
        if (!ctrl.signal.aborted) {
          setState({ status: "error", data: null, error });
        }
      }
    })();

    return () => ctrl.abort();                    // cancel on unmount/param change
  }, [category]);

  // render...
}
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefer user-intent (submit/click) or router loaders for fetching.</li>
                    <li><b>Do</b> use data libraries to get caching, retries, and dedupe out of the box.</li>
                    <li><b>Do</b> cancel in-flight requests and guard against races if you use effects.</li>
                    <li><b>Don't</b> mix rendering with networking; keep responsibilities separate.</li>
                    <li><b>Don't</b> rebuild a data cache manually in component state if a library can do it better.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) FAQ / Glossary */}
            <Styled.Section>
                <Styled.H2>FAQ &amp; Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>“Is fetching in an effect always wrong?”</b> No. It's acceptable for small demos or when
                        other infrastructure isn't available. It becomes a problem as complexity grows.
                    </li>
                    <li>
                        <b>“Why does my effect fetch twice in dev?”</b> Strict Mode double-mounts to reveal unsafe side effects.
                    </li>
                    <li>
                        <b>“What is a stale closure?”</b> A function capturing old state/props, so it reads outdated values when it runs later.
                    </li>
                    <li>
                        <b>“What is deduplication?”</b> Automatically preventing the same request from running multiple times simultaneously.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Takeaway: Fetching in effects scales poorly. Reach for event-driven flows, route loaders,
                or a data library for robust apps. If you remain in effects, design for cancellation,
                idempotence, and race safety.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default EffectForFetching;
