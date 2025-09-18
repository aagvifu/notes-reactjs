import React from "react";
import { Styled } from "./styled";

const Invalidation = () => {
    return (
        <Styled.Page>
            <Styled.Title>Invalidation</Styled.Title>

            <Styled.Lead>
                <b>Invalidation</b> marks cached data as <i>stale</i> so it can be re-fetched. You do this
                whenever the source of truth may have changed (after a mutation, time passing, focus regain,
                network reconnect, etc.). Invalidation doesn't have to delete data; it simply flags it as no
                longer trusted and triggers or allows a revalidation.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Cache:</b> An in-memory store that keeps results of previous requests to avoid refetching every render.</li>
                    <li><b>Cache key:</b> A unique identifier that describes <em>what</em> data a request represents (endpoint + params, e.g., <Styled.InlineCode>["todos", {`page: 1 `}]</Styled.InlineCode>).</li>
                    <li><b>Fresh vs Stale:</b> <i>Fresh</i> means “safe to show without refetch.” <i>Stale</i> means “may be outdated; should revalidate soon.”</li>
                    <li><b>Invalidation:</b> Marking cached data as <i>stale</i>. The next read can refetch in the background or immediately.</li>
                    <li><b>Revalidation:</b> The act of checking freshness (usually by refetching) and updating the cache/UI.</li>
                    <li><b>Refetch:</b> Performing a new network request for a given cache key.</li>
                    <li><b>TTL / staleTime:</b> Time-based freshness window. Before it elapses, data is treated as fresh; after, it's stale.</li>
                    <li><b>cacheTime / GC:</b> How long stale data stays in memory before garbage collection removes it.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why invalidate? */}
            <Styled.Section>
                <Styled.H2>Why Invalidate?</Styled.H2>
                <Styled.List>
                    <li><b>Consistency:</b> After creating/updating/deleting an item, previously fetched lists/details may be outdated.</li>
                    <li><b>Fair performance:</b> Invalidate only the affected keys instead of refetching everything.</li>
                    <li><b>User trust:</b> Keep UI reflect the source of truth quickly without forcing full-page reloads.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) When to invalidate */}
            <Styled.Section>
                <Styled.H2>When to Invalidate</Styled.H2>
                <Styled.List>
                    <li><b>After mutations:</b> On successful create/update/delete, invalidate the list and the affected detail.</li>
                    <li><b>Time-based:</b> When <Styled.InlineCode>staleTime</Styled.InlineCode> expires (or a custom TTL passes).</li>
                    <li><b>Focus regain:</b> When the tab regains focus (many libs refetch or revalidate then).</li>
                    <li><b>Network reconnect:</b> After coming back online.</li>
                    <li><b>Manual triggers:</b> Pull-to-refresh, refresh button, or specific “Refresh data” action.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Vanilla pattern */}
            <Styled.Section>
                <Styled.H2>Vanilla Pattern (Simple Cache + Invalidate)</Styled.H2>
                <Styled.Pre>
                    {`// Tiny cache with invalidation
const cache = new Map(); // key -> { data, ts }
const subscribers = new Set();

export function getKey(resource, params) {
  return JSON.stringify([resource, params || null]);
}

export async function fetchWithCache(resource, params, { ttl = 10_000 } = {}) {
  const key = getKey(resource, params);
  const hit = cache.get(key);
  const fresh = hit && (Date.now() - hit.ts < ttl);

  if (fresh) return hit.data;

  const url = new URL(resource, window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  const data = await res.json();
  cache.set(key, { data, ts: Date.now() });
  subscribers.forEach(fn => fn(key)); // notify
  return data;
}

export function invalidate(keyOrPredicate) {
  // Mark as stale by deleting timestamp (keep data for SWR-like UX)
  for (const [key, value] of cache.entries()) {
    const match = typeof keyOrPredicate === "function"
      ? keyOrPredicate(key)
      : key === keyOrPredicate;
    if (match) cache.set(key, { ...value, ts: 0 });
  }
  subscribers.forEach(fn => fn(null)); // notify general change
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}`}
                </Styled.Pre>
                <Styled.Small>
                    Here, <Styled.InlineCode>invalidate()</Styled.InlineCode> flips entries to <i>stale</i> by zeroing <code>ts</code>. Next read refetches;
                    UI can show stale-while-revalidate (old data immediately, then update).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example flow */}
            <Styled.Section>
                <Styled.H2>Example Flow: Create Todo → Invalidate List</Styled.H2>
                <Styled.Pre>
                    {`async function createTodo(payload) {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create");
  // Invalidate the list; details may also need invalidation
  invalidate((key) => key.includes('["/api/todos"'));
}`}
                </Styled.Pre>
                <Styled.Small>
                    After mutation success, invalidate the affected keys (list and, if applicable, specific detail keys).
                </Styled.Small>
            </Styled.Section>

            {/* 6) With SWR */}
            <Styled.Section>
                <Styled.H2>With SWR (stale-while-revalidate)</Styled.H2>
                <Styled.List>
                    <li><b><Styled.InlineCode>mutate(key)</Styled.InlineCode>:</b> invalidates and revalidates a key.</li>
                    <li><b><Styled.InlineCode>mutate(key, newData, &#123; revalidate: false &#125;)</Styled.InlineCode>:</b> optimistic/local update without immediate refetch.</li>
                    <li><b>Key matching:</b> <Styled.InlineCode>mutate((key) =&gt; key.startsWith("/api/todos"))</Styled.InlineCode> to invalidate multiple keys.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import useSWR, { useSWRConfig } from "swr";

function Todos() {
  const { mutate } = useSWRConfig();
  const { data } = useSWR("/api/todos", (url) => fetch(url).then(r => r.json()));

  async function onCreate(todo) {
    // optimistic add
    mutate("/api/todos", (current = []) => [...current, todo], { revalidate: false });
    try {
      await fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) });
      // revalidate list after success
      mutate("/api/todos");
    } catch {
      // rollback by revalidating from server
      mutate("/api/todos");
    }
  }
  return /* render todos */ null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) With TanStack Query */}
            <Styled.Section>
                <Styled.H2>With TanStack Query (React Query)</Styled.H2>
                <Styled.List>
                    <li><b><Styled.InlineCode>queryKey</Styled.InlineCode>:</b> stable identifier for a query (array recommended).</li>
                    <li><b><Styled.InlineCode>staleTime</Styled.InlineCode>:</b> ms before data becomes stale (no auto refetch while fresh).</li>
                    <li><b><Styled.InlineCode>cacheTime</Styled.InlineCode>:</b> ms a stale query stays in cache before garbage collection.</li>
                    <li><b><Styled.InlineCode>invalidateQueries</Styled.InlineCode>:</b> flag queries as stale so they refetch next time or immediately if mounted.</li>
                    <li><b><Styled.InlineCode>setQueryData</Styled.InlineCode>:</b> optimistic/local update of cached data.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then(r => r.json()),
    staleTime: 10_000, // 10s fresh window
    cacheTime: 5 * 60_000, // 5m in cache after becoming stale
    refetchOnWindowFocus: true,
  });
}

function CreateTodo() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (todo) => fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) }),
    onMutate: async (newTodo) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const prev = qc.getQueryData(["todos"]);
      qc.setQueryData(["todos"], (old = []) => [...old, newTodo]); // optimistic
      return { prev };
    },
    onError: (_err, _newTodo, ctx) => {
      if (ctx?.prev) qc.setQueryData(["todos"], ctx.prev); // rollback
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["todos"] }); // invalidate -> refetch
    },
  });
  return /* form that calls mutation.mutate */ null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) What to invalidate (scoping) */}
            <Styled.Section>
                <Styled.H2>What to Invalidate (Scoping)</Styled.H2>
                <Styled.List>
                    <li><b>Minimal blast radius:</b> Invalidate only keys that could be affected.</li>
                    <li><b>Lists + details:</b> If an item changes, invalidate the item detail key and any lists that include it.</li>
                    <li><b>Parameterized keys:</b> If your list is paginated or filtered, invalidate by predicate (e.g., keys starting with <Styled.InlineCode>["todos"]</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Patterns & tips */}
            <Styled.Section>
                <Styled.H2>Patterns & Tips</Styled.H2>
                <Styled.List>
                    <li><b>Stale-While-Revalidate (SWR UX):</b> Show cached data instantly, fetch in background, then update.</li>
                    <li><b>Refetch on focus/reconnect:</b> Great for dashboards where data changes in the background.</li>
                    <li><b>Avoid thundering herds:</b> Debounce manual refresh and use library deduping features.</li>
                    <li><b>Stable keys:</b> Always use stable arrays/strings; don't inline new object references every render.</li>
                    <li><b>Error handling:</b> On failure after optimistic updates, rollback via server revalidation or saved snapshot.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep <Styled.InlineCode>queryKey</Styled.InlineCode>/<Styled.InlineCode>key</Styled.InlineCode> shapes consistent across the app.</li>
                    <li><b>Do</b> invalidate immediately after successful mutations.</li>
                    <li><b>Do</b> prefer predicates to invalidate groups of related keys safely.</li>
                    <li><b>Don't</b> invalidate everything unless you must; it wastes bandwidth and can jank the UI.</li>
                    <li><b>Don't</b> rely only on time-based TTL for highly dynamic data; add event-based invalidation.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Predicate invalidation:</b> Matching many keys by a function (e.g., prefix).</li>
                    <li><b>Optimistic update:</b> Update UI first, then confirm with server; rollback on error.</li>
                    <li><b>Deduping:</b> Preventing concurrent duplicate requests for the same key.</li>
                    <li><b>Garbage collection (GC):</b> Removing stale, unused entries from the cache after <i>cacheTime</i>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Takeaway:</b> Invalidation keeps cached UI honest. Use precise keys, invalidate on mutation,
                leverage library helpers (<i>mutate</i>, <i>invalidateQueries</i>), and combine time-based and
                event-based strategies for a fast, correct experience.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Invalidation;
