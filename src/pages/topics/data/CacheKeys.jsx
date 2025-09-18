import { Styled } from "./styled";

const CacheKeys = () => {
    return (
        <Styled.Page>
            <Styled.Title>Cache Keys</Styled.Title>

            <Styled.Lead>
                A <b>cache key</b> (also called a <i>query key</i>) is the unique label that identifies a
                piece of cached data. Good keys are <b>deterministic</b> (same inputs ⇒ same key),
                <b>stable</b> (don't change unexpectedly), and <b>descriptive</b> (encode resource + params + scope).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Cache:</b> a temporary storage layer that holds previously fetched data to avoid
                        refetching.
                    </li>
                    <li>
                        <b>Cache key / Query key:</b> a unique identifier used to store and retrieve a specific
                        cached result (e.g., <Styled.InlineCode>["users", {`page: 2, q: "a" `}]</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Deterministic:</b> given the same inputs, your key is exactly the same. No random or time-varying parts.
                    </li>
                    <li>
                        <b>Stable identity:</b> the “shape” and ordering of your key are consistent (e.g., parameters sorted).
                    </li>
                    <li>
                        <b>Scope / namespace:</b> context that affects data (user ID, tenant, locale, feature flag).
                    </li>
                    <li>
                        <b>Stale vs fresh:</b> “fresh” means data is considered up-to-date; “stale” means the
                        app may show cached data while triggering a background revalidation.
                    </li>
                    <li>
                        <b>TTL / gcTime / cacheTime:</b> how long cached data can live before it's garbage-collected
                        (naming varies by library; TanStack Query v5 uses <i>gcTime</i>).
                    </li>
                    <li>
                        <b>Invalidation:</b> marking cached data as outdated so it refetches on next use or immediately.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Anatomy of a good key */}
            <Styled.Section>
                <Styled.H2>Anatomy of a Good Key</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Resource:</b>{" "}
                        <Styled.InlineCode>"users"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"todos"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"product"</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        <b>Parameters:</b> filters, pagination, search, sorting - normalized (trimmed, lowercased, ordered).
                    </li>
                    <li>
                        <b>Scope:</b> user/tenant, locale, AB flag, route params (e.g., <Styled.InlineCode>userId</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example "shape" (array form keeps pieces separate and readable)
["users", { page: 2, q: "alice", sort: "name:asc" }, { userId: 42, locale: "en-IN" }]`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the shape predictable; avoid stuffing everything into one long string unless you
                    have a robust, stable serializer.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Manual cache with stable keys */}
            <Styled.Section>
                <Styled.H2>Manual Cache with Stable Keys</Styled.H2>
                <Styled.Pre>
                    {`// A tiny manual cache using Map + stable serialization
const cache = new Map();

function stableParams(obj) {
  // 1) sort keys   2) normalize values  3) stringify consistently
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== undefined)                 // ignore undefined
    .map(([k, v]) => [k, typeof v === "string" ? v.trim().toLowerCase() : v])
    .sort(([a],[b]) => a.localeCompare(b));            // sort keys

  return JSON.stringify(Object.fromEntries(entries));
}

function makeKey(resource, params = {}, scope = {}) {
  return JSON.stringify([resource, stableParams(params), stableParams(scope)]);
}

async function fetchUsers({ page = 1, q = "", userId }) {
  const key = makeKey("users", { page, q }, { userId });
  if (cache.has(key)) return cache.get(key);

  const url = new URL("/api/users", location.origin);
  url.searchParams.set("page", String(page));
  if (q) url.searchParams.set("q", q.trim().toLowerCase());

  const res = await fetch(url);
  const data = await res.json();
  cache.set(key, data);
  return data;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The important bit is <b>how you build the key</b>: normalize and sort parameters so
                    semantically equal inputs produce the same key.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cache keys in TanStack Query (React Query) */}
            <Styled.Section>
                <Styled.H2>Cache Keys in TanStack Query</Styled.H2>
                <Styled.List>
                    <li>
                        Query keys are typically <b>arrays</b> (e.g.,{" "}
                        <Styled.InlineCode>["users", {`page, q`}]</Styled.InlineCode>).
                    </li>
                    <li>
                        The library hashes keys; you can include objects - avoid functions/non-serializable values.
                    </li>
                    <li>
                        <b>staleTime</b>: how long data is considered fresh. <b>gcTime</b> (a.k.a. cacheTime in
                        older versions): how long unused data stays in memory.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example with @tanstack/react-query (v5 API shown conceptually)
import { useQuery, useQueryClient } from "@tanstack/react-query";

function useUsers({ page, q, userId }) {
  const queryKey = ["users", { page, q: q?.trim().toLowerCase() }, { userId }];

  return useQuery({
    queryKey,
    queryFn: () => fetch(\`/api/users?page=\${page}&q=\${encodeURIComponent(q || "")}\`).then(r => r.json()),
    staleTime: 30_000,  // 30s fresh window
    gcTime: 5 * 60_000, // 5m in memory after unused
  });
}

function RefreshUsersButton() {
  const qc = useQueryClient();
  return <button onClick={() => qc.invalidateQueries({ queryKey: ["users"] })}>Refresh</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Invalidating <Styled.InlineCode>["users"]</Styled.InlineCode> will refetch all user lists
                    regardless of page/search - that's the power of a <b>hierarchical key</b>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Cache keys in SWR */}
            <Styled.Section>
                <Styled.H2>Cache Keys in SWR</Styled.H2>
                <Styled.List>
                    <li>
                        Keys can be a string, array, or a function that returns the key (or <i>null</i> to skip).
                    </li>
                    <li>
                        Avoid embedding unstable values in the key; normalize params.
                    </li>
                    <li>
                        <b>dedupingInterval</b>: time window to dedupe requests; <b>revalidateOnFocus</b>: refetch on focus.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import useSWR, { mutate } from "swr";

const fetcher = (url) => fetch(url).then(r => r.json());

function useUsers({ page, q }) {
  const qn = q?.trim().toLowerCase() || "";
  const key = ["/api/users", page, qn];  // deterministic key
  return useSWR(key, () => fetcher(\`/api/users?page=\${page}&q=\${encodeURIComponent(qn)}\`), {
    dedupingInterval: 2000,
  });
}

function RefreshUsersButton() {
  return <button onClick={() => mutate((key) => Array.isArray(key) && key[0] === "/api/users")}>Refresh</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Using an <b>array key</b> keeps parameters separate and predictable, reducing accidental collisions.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Invalidation, fan-out & relations */}
            <Styled.Section>
                <Styled.H2>Invalidation Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Fan-out:</b> invalidate a broad key (e.g., <Styled.InlineCode>["todos"]</Styled.InlineCode>) after a mutation to refresh all related lists.
                    </li>
                    <li>
                        <b>Targeted:</b> invalidate a specific detail key (e.g.,{" "}
                        <Styled.InlineCode>["todo", {`id`}]</Styled.InlineCode>) after an update.
                    </li>
                    <li>
                        <b>Cross-entity:</b> when updating a comment, also invalidate its post list/detail keys.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// TanStack Query (concept)
qc.invalidateQueries({ queryKey: ["posts"] });       // refresh all posts lists
qc.invalidateQueries({ queryKey: ["post", { id }] }); // refresh one post detail

// SWR (concept)
mutate(["/api/posts"]);               // all post lists
mutate(["/api/post", id]);            // one post detail`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Infinite scroll & pagination */}
            <Styled.Section>
                <Styled.H2>Infinite Scroll & Pagination Keys</Styled.H2>
                <Styled.List>
                    <li>
                        Keep a <b>base key</b> for the collection (e.g., <Styled.InlineCode>["feed"]</Styled.InlineCode>).
                    </li>
                    <li>
                        Libraries track <b>pageParam</b> internally; your query key usually stays the same and the page cursor is passed via options.
                    </li>
                    <li>
                        For manual caches, include <b>cursor/page</b> in the key.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// TanStack useInfiniteQuery (concept)
useInfiniteQuery({
  queryKey: ["feed", { q }],
  queryFn: ({ pageParam }) => fetch(\`/api/feed?cursor=\${pageParam || ""}&q=\${q}\`).then(r => r.json()),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Optimistic updates & keys */}
            <Styled.Section>
                <Styled.H2>Optimistic Updates & Keys</Styled.H2>
                <Styled.List>
                    <li>
                        Update the <b>list</b> key and the <b>detail</b> key together so UI stays consistent.
                    </li>
                    <li>
                        Roll back on error using the snapshot returned by your library's mutation helpers.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// TanStack (concept)
await qc.cancelQueries({ queryKey: ["todos"] });
const prev = qc.getQueryData(["todos"]);
qc.setQueryData(["todos"], (old = []) => [{ id, title, optimistic: true }, ...old]);
try {
  await api.createTodo({ title });
  qc.invalidateQueries({ queryKey: ["todos"] });
} catch (e) {
  qc.setQueryData(["todos"], prev); // rollback
}

// SWR (concept)
mutate(["/api/todos"], async (curr = []) => {
  const optimistic = [{ id, title, optimistic: true }, ...curr];
  try {
    await api.createTodo({ title });
    return await fetcher("/api/todos"); // revalidate
  } catch (e) {
    return curr; // rollback
  }
}, { revalidate: false });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> normalize text params (trim, lowercase) before building the key.</li>
                    <li><b>Do</b> sort object keys before serializing to avoid key order issues.</li>
                    <li><b>Do</b> include scope (user/tenant/locale) when it affects the data.</li>
                    <li><b>Don't</b> put <i>functions</i>, <i>class instances</i>, or <i>DOM nodes</i> in keys.</li>
                    <li><b>Don't</b> include time-varying values (<i>Date.now()</i>, <i>Math.random()</i>) unless that's intentional.</li>
                    <li><b>Don't</b> forget to invalidate the right keys after mutations.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Key collision:</b> two different queries map to the same key - caused by poor key design.</li>
                    <li><b>Serialization:</b> turning params into a stable string form.</li>
                    <li><b>Revalidation:</b> refetch to ensure data is up-to-date (often in the background).</li>
                    <li><b>Hydration:</b> seeding the cache (e.g., from SSR) before the client renders.</li>
                    <li><b>Deduplication:</b> bundling identical in-flight requests to avoid duplicates.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Good cache keys are deterministic, stable, and descriptive. Encode resource, params,
                and scope; normalize inputs; and lean on your library's hierarchical matching to invalidate
                the right data after writes.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CacheKeys;
