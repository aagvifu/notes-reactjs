import { Styled } from "./styled";

const TanstackQuery = () => {
    return (
        <Styled.Page>
            <Styled.Title>TanStack Query (React Query)</Styled.Title>

            <Styled.Lead>
                <b>TanStack Query</b> is a data fetching & caching library for React. It gives you
                declarative hooks (<code>useQuery</code>, <code>useMutation</code>) to load, cache,
                update, and sync server state with minimal boilerplate.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What &amp; Why</Styled.H2>
                <Styled.List>
                    <li><b>Server state:</b> Data that lives on a server (APIs, DB) and must be fetched over the network. It can be stale, can change without your app, and needs caching & syncing.</li>
                    <li><b>Query:</b> A cached read for some data. Identified by a <b>query key</b> and loaded by a <b>query function</b>.</li>
                    <li><b>Mutation:</b> A write operation (POST/PUT/PATCH/DELETE) that can update cache and/or refetch affected queries.</li>
                    <li><b>Query Client:</b> The object that manages the cache, configuration, and utilities (invalidate, prefetch, setQueryData, etc.).</li>
                    <li><b>Query Key:</b> An <i>array</i> that uniquely identifies data (e.g., <code>["todos", userId]</code>). Keys must be JSON-serializable and stable. </li>
                    <li><b>Fresh vs Stale:</b> After fetching, data is <i>fresh</i> for <code>staleTime</code>; then it becomes <i>stale</i> and may refetch on events (focus, reconnect, etc.). Default <code>staleTime</code> is <code>0</code>.</li>
                    <li><b>Cache lifetime:</b> Unused queries are garbage-collected after <code>gcTime</code> (default ~5 minutes). </li>
                </Styled.List>
                <Styled.Small>
                    Keys must be arrays; defaults like <code>staleTime</code> and <code>gcTime</code> control freshness and garbage collection.
                </Styled.Small>
            </Styled.Section>

            {/* 2) Install & Setup (examples only) */}
            <Styled.Section>
                <Styled.H2>Install &amp; Setup</Styled.H2>
                <Styled.Pre>
                    {`# install (examples)
npm i @tanstack/react-query
# devtools (optional, recommended)
npm i @tanstack/react-query-devtools`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// main.jsx (example)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);`}
                </Styled.Pre>
                <Styled.Small>
                    Wrap your app once with <code>QueryClientProvider</code>. Use the Devtools to inspect
                    queries, mutations, and cache state visually.
                </Styled.Small>
            </Styled.Section>

            {/* 3) useQuery: Basics */}
            <Styled.Section>
                <Styled.H2><code>useQuery</code> - Basics</Styled.H2>
                <Styled.List>
                    <li><b>queryKey:</b> array that identifies the data. Include every variable used by your <code>queryFn</code>.</li>
                    <li><b>queryFn:</b> async function that returns data (or throws on error).</li>
                    <li><b>State flags:</b> <code>isPending</code>, <code>isError</code>, <code>isSuccess</code>, <code>isFetching</code>, plus <code>data</code>/<code>error</code>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useQuery } from "@tanstack/react-query";

function Todos({ userId }) {
  const {
    data, error,
    isPending,     // initial load
    isFetching,    // background refetches
    isError, isSuccess,
  } = useQuery({
    queryKey: ["todos", { userId }],
    queryFn: async () => {
      const res = await fetch(\`/api/users/\${userId}/todos\`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // keep data fresh for 2 min
    select: (rows) => rows.sort((a, b) => a.done - b.done), // shape/refine data
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>Failed: {String(error)}</p>;
  return <ul>{data.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Use <code>select</code> to derive UI-ready data without extra renders.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Dependent / Conditional queries */}
            <Styled.Section>
                <Styled.H2>Dependent queries (<code>enabled</code>)</Styled.H2>
                <Styled.Pre>
                    {`// Only run when userId is known
useQuery({
  queryKey: ["profile", userId],
  queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  enabled: !!userId,
});`}
                </Styled.Pre>
                <Styled.Small>
                    <code>enabled</code> prevents running until prerequisites are ready (auth, params, feature flags).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Cache Keys (correctness) */}
            <Styled.Section>
                <Styled.H2>Cache Keys - correctness rules</Styled.H2>
                <Styled.List>
                    <li><b>Always array:</b> e.g., <code>["posts", page, {`tag`}]</code>. Don't put functions in keys.</li>
                    <li><b>Include variables used in the query:</b> any variable referenced inside <code>queryFn</code> must appear in the key so caching & refetching stay correct.</li>
                    <li><b>Stable shapes:</b> prefer objects with stable property ordering for options (e.g., <code>{`{ tag, sort }`}</code>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good
useQuery({ queryKey: ["posts", page, { tag }], queryFn: () => api.listPosts({ page, tag }) });

// Bad: key doesn't include "tag" dependency → wrong cache / missed refetch
useQuery({ queryKey: ["posts", page], queryFn: () => api.listPosts({ page, tag }) });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Refetching & Freshness */}
            <Styled.Section>
                <Styled.H2>Freshness, Stale Time & Refetching</Styled.H2>
                <Styled.List>
                    <li><b>staleTime:</b> time until data becomes stale. Fresh data is read from cache only.</li>
                    <li><b>Refetch triggers for stale queries:</b> window focus, reconnect, mount (configurable).</li>
                    <li><b>gcTime:</b> how long inactive data stays in cache before it's garbage-collected.</li>
                </Styled.List>
                <Styled.Pre>
                    {`useQuery({
  queryKey: ["feed"],
  queryFn: () => fetch("/api/feed").then(r => r.json()),
  staleTime: 60_000,            // stay fresh for 1 min
  refetchOnWindowFocus: true,   // default behavior for stale queries
  refetchOnReconnect: true,
  refetchOnMount: true,
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Mutations */}
            <Styled.Section>
                <Styled.H2><code>useMutation</code> - writes & invalidation</Styled.H2>
                <Styled.List>
                    <li><b>Mutation:</b> perform a write, then <b>invalidate</b> affected queries to refetch fresh data.</li>
                    <li><b>Optimistic update:</b> temporarily update the UI before the server responds; rollback on error.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddTodo() {
  const qc = useQueryClient();
  const createTodo = useMutation({
    mutationFn: (payload) => fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(r => {
      if (!r.ok) throw new Error("Create failed");
      return r.json();
    }),
    // Optimistic UI
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const prev = qc.getQueryData(["todos"]);
      qc.setQueryData(["todos"], (old = []) => [{ id: "temp", ...variables }, ...old]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Rollback
      if (ctx?.prev) qc.setQueryData(["todos"], ctx.prev);
    },
    onSettled: () => {
      // Ensure server truth
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return <button onClick={() => createTodo.mutate({ title: "New" })}>Add</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Prefetch & Initial Data */}
            <Styled.Section>
                <Styled.H2>Prefetching & Initial Data</Styled.H2>
                <Styled.List>
                    <li><b>Prefetch:</b> warm the cache before navigation for instant screens.</li>
                    <li><b>Placeholder / Initial:</b> show temp data immediately; replaced when the real fetch resolves.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Prefetch (e.g., on hover)
await queryClient.prefetchQuery({
  queryKey: ["profile", id],
  queryFn: () => api.profile(id),
});

// Placeholder vs Initial
useQuery({
  queryKey: ["profile", id],
  queryFn: () => api.profile(id),
  placeholderData: { name: "Loading…" }, // replaced after fetch
  // initialData: someCachedValue,     // treated as loaded data at t0
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Devtools */}
            <Styled.Section>
                <Styled.H2>Devtools</Styled.H2>
                <Styled.List>
                    <li>Install <code>@tanstack/react-query-devtools</code> and render <code>&lt;ReactQueryDevtools /&gt;</code> inside the provider to inspect queries, mutations, and cache.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use an <b>array</b> query key and include every variable the query depends on.</li>
                    <li><b>Do</b> set <code>staleTime</code> thoughtfully to avoid “refetch spam” and waterfall requests.</li>
                    <li><b>Do</b> use <code>invalidateQueries</code> after writes or <code>setQueryData</code> for local corrections.</li>
                    <li><b>Don't</b> fetch in effects for screen data - prefer <code>useQuery</code> instead.</li>
                    <li><b>Don't</b> create new key object identities on every render (memoize or keep them primitive/stable).</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Query Key:</b> array ID for a query (e.g., <code>["users", page]</code>).</li>
                    <li><b>Query Function:</b> async function that returns the data for a query key.</li>
                    <li><b>Fresh:</b> within <code>staleTime</code>; no refetch triggers.</li>
                    <li><b>Stale:</b> past <code>staleTime</code>; may refetch on focus/reconnect/mount.</li>
                    <li><b>gcTime:</b> duration an inactive query remains in cache before being removed.</li>
                    <li><b>Invalidate:</b> mark a query stale so the next render/focus refetches it.</li>
                    <li><b>Prefetch:</b> fetch data into cache ahead of navigation.</li>
                    <li><b>Optimistic Update:</b> temporary UI update before server confirmation; rollback on error.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Model each API read as a <i>query</i> with a clear array key, tune freshness with
                <code> staleTime</code>, and keep cache truthful via invalidation or optimistic writes.
                Use Devtools to see what's happening under the hood.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TanstackQuery;
