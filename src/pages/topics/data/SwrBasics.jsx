import { Styled } from "./styled";

const SwrBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>SWR Basics (Stale-While-Revalidate)</Styled.Title>

            <Styled.Lead>
                <b>SWR</b> is a tiny React data fetching library (by Vercel) implementing the{" "}
                <b>stale-while-revalidate</b> strategy: first show <i>stale</i> cached data instantly,
                then <i>revalidate</i> in the background and update the UI with fresh data.
            </Styled.Lead>

            {/* What is SWR */}
            <Styled.Section>
                <Styled.H2>What is SWR?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Stale-While-Revalidate (SWR):</b> a caching strategy where the app uses cached data immediately
                        and simultaneously kicks off a re-fetch to refresh the cache. Once fresh data arrives, the UI updates.
                    </li>
                    <li>
                        <b>SWR (library):</b> a React hook set—<Styled.InlineCode>useSWR</Styled.InlineCode> and helpers—
                        that gives you caching, revalidation on focus/reconnect/interval, request deduping, and mutation APIs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Glossary */}
            <Styled.Section>
                <Styled.H2>Core Terms (Glossary)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Cache:</b> in-memory store that holds previously fetched responses. SWR keeps a global cache
                        (by default a Map) so the same data can be reused across components.
                    </li>
                    <li>
                        <b>Cache Key:</b> a unique, stable identifier for a resource. In SWR it's the first argument to
                        <Styled.InlineCode>useSWR(key, fetcher)</Styled.InlineCode>. Keys can be strings or arrays (e.g.,
                        <Styled.InlineCode>["/api/user", userId]</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Stale:</b> data that may be out of date but is safe to show immediately for instant UI.
                    </li>
                    <li>
                        <b>Revalidate:</b> refetch the resource to refresh the cache and update the UI with the latest data.
                        Triggers include focus, reconnect, interval polling, manual <Styled.InlineCode>mutate</Styled.InlineCode>,
                        and key changes.
                    </li>
                    <li>
                        <b>Deduping:</b> SWR merges identical in-flight requests (same key) within a time window so the network
                        is not spammed.
                    </li>
                    <li>
                        <b>Mutate:</b> programmatically update the cache. Useful for <i>optimistic updates</i>, invalidation,
                        and prefetching.
                    </li>
                    <li>
                        <b>Fallback data:</b> initial value for a key so UI has something to render before the first fetch resolves.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Install */}
            <Styled.Section>
                <Styled.H2>Installation</Styled.H2>
                <Styled.Pre>
                    {`# npm
npm i swr

# pnpm
pnpm add swr

# yarn
yarn add swr`}
                </Styled.Pre>
                <Styled.Small>
                    You can set a global config once using <Styled.InlineCode>{`<SWRConfig value={{ ... }}>`}</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* Basic usage */}
            <Styled.Section>
                <Styled.H2>Basic Usage</Styled.H2>
                <Styled.Pre>
                    {`import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Network error");
  return r.json();
});

function Profile({ id }) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR(id ? \`/api/users/\${id}\` : null, fetcher); // null => skip/conditional

  if (error) return <p>Failed: {error.message}</p>;
  if (isLoading) return <p>Loading…</p>;

  return (
    <>
      <p>Name: {data.name}</p>
      <button onClick={() => mutate()}>Refresh</button>
      {isValidating && <small>Updating…</small>}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.List>
                    <li>
                        <b>Conditional fetch:</b> pass <Styled.InlineCode>null</Styled.InlineCode> as key to skip (e.g., when{" "}
                        <Styled.InlineCode>id</Styled.InlineCode> is not ready).
                    </li>
                    <li>
                        <b>State flags:</b> <Styled.InlineCode>isLoading</Styled.InlineCode> (first load),{" "}
                        <Styled.InlineCode>isValidating</Styled.InlineCode> (revalidating after cache shows).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Global config */}
            <Styled.Section>
                <Styled.H2>Global Configuration</Styled.H2>
                <Styled.Pre>
                    {`import { SWRConfig } from "swr";

export function AppProviders({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((r) => r.json()),
        dedupingInterval: 2000,     // merge same-key fetches within 2s
        revalidateOnFocus: true,    // refetch when window/tab regains focus
        revalidateOnReconnect: true,
        refreshInterval: 0,         // polling ms (0 = off)
        keepPreviousData: true,     // keep last data during key change
        shouldRetryOnError: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Keys best practices */}
            <Styled.Section>
                <Styled.H2>Cache Keys: Best Practices</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>stable strings/arrays</b>. Include all parameters that affect the response:
                        <Styled.InlineCode>["/api/search", q, page, sort]</Styled.InlineCode>.
                    </li>
                    <li>
                        Avoid objects/functions as keys. Use arrays of primitives instead to ensure stable equality.
                    </li>
                    <li>
                        Changing the key <b>invalidates</b> the old data and triggers a new fetch for the new resource.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good
const key = ["/api/products", categoryId, page, sort];

// Bad (unstable)
const key = { url: "/api/products", params: { categoryId, page, sort } };`}
                </Styled.Pre>
            </Styled.Section>

            {/* Revalidation triggers */}
            <Styled.Section>
                <Styled.H2>Revalidation Triggers</Styled.H2>
                <Styled.List>
                    <li><b>Focus:</b> returning to the tab triggers revalidation (configurable).</li>
                    <li><b>Reconnect:</b> when network reconnects after offline.</li>
                    <li><b>Interval:</b> set <Styled.InlineCode>refreshInterval</Styled.InlineCode> for polling.</li>
                    <li><b>Key change:</b> new key ⇒ new request.</li>
                    <li><b>Manual:</b> call <Styled.InlineCode>mutate(key)</Styled.InlineCode> or the hook's <Styled.InlineCode>mutate()</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Poll every 10s, but pause when the page is hidden:
const { data } = useSWR("/api/news", fetcher, {
  refreshInterval: 10000,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* Optimistic updates */}
            <Styled.Section>
                <Styled.H2>Optimistic Updates</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Optimistic update:</b> update the UI immediately, assume success, then confirm with the server.
                        If it fails, <i>rollback</i>.
                    </li>
                    <li>
                        Use <Styled.InlineCode>mutate(key, updater, options)</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>optimisticData</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>rollbackOnError</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import useSWR, { useSWRConfig } from "swr";

function Todo({ id }) {
  const { data } = useSWR(\`/api/todos/\${id}\`, fetcher);
  const { mutate } = useSWRConfig();

  async function toggle() {
    await mutate(
      \`/api/todos/\${id}\`,
      async (current) => {
        const optimistic = { ...current, done: !current.done };
        // send patch to server
        const saved = await fetch(\`/api/todos/\${id}\`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: optimistic.done }),
        }).then(r => r.json());
        return saved; // becomes the new cache value
      },
      {
        optimisticData: (current) => ({ ...current, done: !current.done }),
        rollbackOnError: true,
        revalidate: false, // we already returned the server value
        populateCache: true,
      }
    );
  }

  if (!data) return null;
  return <button onClick={toggle}>{data.done ? "✅" : "⬜"} {data.title}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Prefetch & fallback */}
            <Styled.Section>
                <Styled.H2>Prefetching & Fallback Data</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prefetch:</b> warm the cache before a screen shows. Great for hover/intent or router preloads.
                    </li>
                    <li>
                        <b>Fallback:</b> provide a starting value while the first fetch runs.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useSWRConfig, SWRConfig } from "swr";

// Prefetch somewhere (e.g., on hover)
const { mutate } = useSWRConfig();
async function prefetchUser(id) {
  await mutate(\`/api/users/\${id}\`, fetch(\`/api/users/\${id}\`).then(r => r.json()));
}

// Fallback for initial render
<SWRConfig value={{ fallback: { "/api/users/1": { id: 1, name: "Guest" } } }}>
  <Profile id={1} />
</SWRConfig>`}
                </Styled.Pre>
            </Styled.Section>

            {/* Errors & retries */}
            <Styled.Section>
                <Styled.H2>Error Handling & Retries</Styled.H2>
                <Styled.List>
                    <li>
                        Throw errors in your <Styled.InlineCode>fetcher</Styled.InlineCode> for non-2xx responses. SWR exposes{" "}
                        <Styled.InlineCode>error</Styled.InlineCode> and can auto-retry with backoff.
                    </li>
                    <li>
                        Customize retry count/delay via <Styled.InlineCode>onErrorRetry</Styled.InlineCode> in config.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const fetcher = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
  return r.json();
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> design <b>stable keys</b>—they are the identity of your data.</li>
                    <li><b>Do</b> keep your fetcher tiny and consistent (same errors, same JSON parsing).</li>
                    <li><b>Do</b> use <Styled.InlineCode>mutate</Styled.InlineCode> for optimistic UX and invalidation.</li>
                    <li><b>Don't</b> put non-deterministic values (like new Date()) in keys; it will destroy caching.</li>
                    <li><b>Don't</b> over-poll; prefer focus/reconnect revalidation for most dashboards.</li>
                </Styled.List>
            </Styled.Section>

            {/* Differences vs TanStack Query */}
            <Styled.Section>
                <Styled.H2>SWR vs TanStack Query (Quick Note)</Styled.H2>
                <Styled.List>
                    <li>
                        Both provide caching, revalidation, mutations, and invalidation. <b>TanStack Query</b> adds rich devtools,
                        more mutation helpers, and advanced features (e.g., <i>queryClient</i>)—you'll cover it in the{" "}
                        <i>TanStack Query</i> topic.
                    </li>
                    <li>
                        <b>SWR</b> stays minimal: a tiny API with a global cache and flexible hooks. Pick either per project,
                        not both.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Using objects/functions as keys (unstable identity) → cache misses and unnecessary refetches.
                    </li>
                    <li>
                        Forgetting to throw on HTTP errors in the fetcher → silent failures and confusing UI states.
                    </li>
                    <li>
                        Mutating the server without updating the cache → UI appears stale; use <Styled.InlineCode>mutate</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: SWR gives you instant UI from cache and seamless background updates. Master keys, revalidation
                triggers, and <i>mutate</i> for a responsive, optimistic experience.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SwrBasics;
