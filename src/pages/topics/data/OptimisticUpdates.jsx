import { Styled } from "./styled";

const OptimisticUpdates = () => {
    return (
        <Styled.Page>
            <Styled.Title>Optimistic Updates</Styled.Title>

            <Styled.Lead>
                <b>Optimistic update</b> means we immediately update the UI as if a server change <i>already succeeded</i>,
                then send the request in the background. If the server later fails, we <b>rollback</b> the UI.
                This makes apps feel fast by hiding network latency ("<b>latency compensation</b>").
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Optimistic update:</b> apply the expected result to local state/cache before the server confirms.</li>
                    <li><b>Pessimistic update:</b> wait for the server response, then update the UI.</li>
                    <li><b>Latency compensation:</b> UX technique to mask delay using optimistic UI + spinners/toasts.</li>
                    <li><b>Rollback:</b> restore the previous state if the request fails or conflicts.</li>
                    <li><b>Source of truth:</b> the server remains authoritative; the cache is a prediction.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use */}
            <Styled.Section>
                <Styled.H2>When (and when not) to use</Styled.H2>
                <Styled.List>
                    <li><b>Great for:</b> low-risk actions like like/subscribe, rename, add/remove from list, toggle flags.</li>
                    <li><b>Be cautious for:</b> payments, destructive ops (delete all), multi-user conflicts, complex validation.</li>
                    <li><b>Rule of thumb:</b> if a failure is rare and easy to undo, optimistic is a win. Otherwise consider pessimistic updates.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) How it works */}
            <Styled.Section>
                <Styled.H2>How an Optimistic Update Works (Step-by-Step)</Styled.H2>
                <Styled.List>
                    <li><b>Snapshot:</b> save current cache/state you will modify.</li>
                    <li><b>Predict:</b> apply the predicted change locally (e.g., insert new item).</li>
                    <li><b>Send:</b> fire the network request in the background.</li>
                    <li><b>Finalize:</b> on success, reconcile with server data (IDs, versions). On error, rollback to the snapshot.</li>
                    <li><b>Revalidate:</b> refetch or invalidate to confirm final truth from the server.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Core terms */}
            <Styled.Section>
                <Styled.H2>Glossary (Technical Terms)</Styled.H2>
                <Styled.List>
                    <li><b>Cache:</b> client-side store of server data (e.g., TanStack Query, SWR, custom state).</li>
                    <li><b>Cache key:</b> identifier for a piece of cached data (e.g., <Styled.InlineCode>["todos", userId]</Styled.InlineCode>).</li>
                    <li><b>Invalidation:</b> marking cached data as stale so it refetches.</li>
                    <li><b>Revalidation:</b> fetching again to ensure the cache matches the server.</li>
                    <li><b>Mutation:</b> any write operation (POST/PUT/PATCH/DELETE).</li>
                    <li><b>Idempotent:</b> request that can be safely retried without changing the final result (useful for retries).</li>
                    <li><b>Race condition:</b> responses arrive out of order; always reconcile with the latest server truth.</li>
                    <li><b>Conflict resolution:</b> strategy to merge local prediction with server reality (versions/ETags, timestamps).</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Simple pattern (hand-rolled) */}
            <Styled.Section>
                <Styled.H2>Pattern: Hand-Rolled Optimistic Update (Basic)</Styled.H2>
                <Styled.Pre>
                    {`// Example: optimistic "rename" of a todo in local state (hand-rolled)
function renameTodoOptimistic(todos, setTodos, id, nextTitle) {
  // 1) Snapshot
  const prev = todos;

  // 2) Predict
  const predicted = todos.map(t => t.id === id ? { ...t, title: nextTitle } : t);
  setTodos(predicted);

  // 3) Send
  fetch(\`/api/todos/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: nextTitle })
  })
  .then(res => {
    if (!res.ok) throw new Error("Server rejected");
    return res.json();
  })
  .then(serverTodo => {
    // 4) Finalize (optional refine with server data)
    setTodos(ts => ts.map(t => t.id === id ? { ...t, ...serverTodo } : t));
  })
  .catch(() => {
    // Rollback on error
    setTodos(prev);
  });
}`}
                </Styled.Pre>
                <Styled.Small>Keep the snapshot small and focused on what you changed to make rollback simple.</Styled.Small>
            </Styled.Section>

            {/* 6) TanStack Query recipe */}
            <Styled.Section>
                <Styled.H2>Recipe: TanStack Query (Mutation with <code>onMutate</code>)</Styled.H2>
                <Styled.Pre>
                    {`// Pseudocode using @tanstack/react-query
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: ({ id, nextTitle }) =>
    fetch(\`/api/todos/\${id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nextTitle })
    }).then(r => {
      if (!r.ok) throw new Error("Server error");
      return r.json();
    }),

  // 1) Snapshot & optimistic update
  onMutate: async ({ id, nextTitle }) => {
    const key = ["todos"];
    await queryClient.cancelQueries({ queryKey: key });
    const prev = queryClient.getQueryData(key);

    queryClient.setQueryData(key, (old = []) =>
      old.map(t => t.id === id ? { ...t, title: nextTitle } : t)
    );

    return { prev, key }; // context passed to onError/onSettled
  },

  // 2) Rollback on error
  onError: (err, variables, ctx) => {
    if (ctx?.prev) queryClient.setQueryData(ctx.key, ctx.prev);
  },

  // 3) Finalize: refetch or refine
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }
});

// Usage
// mutation.mutate({ id, nextTitle })
`}
                </Styled.Pre>
                <Styled.Small>
                    <b>onMutate</b> runs before the request; return a context to rollback in <b>onError</b>.
                    Use <b>invalidateQueries</b> or <b>setQueryData</b> to finalize.
                </Styled.Small>
            </Styled.Section>

            {/* 7) SWR recipe */}
            <Styled.Section>
                <Styled.H2>Recipe: SWR (<code>mutate</code> with optimistic data)</Styled.H2>
                <Styled.Pre>
                    {`// Pseudocode using swr
import useSWR, { mutate } from "swr";

function useTodos() {
  const { data } = useSWR("/api/todos", fetcher);
  return data ?? [];
}

async function renameTodo(id, nextTitle) {
  // Optimistically update cache
  mutate("/api/todos",
    (prev = []) => prev.map(t => t.id === id ? { ...t, title: nextTitle } : t),
    { revalidate: false }
  );

  // Send request
  const res = await fetch(\`/api/todos/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: nextTitle })
  });

  if (!res.ok) {
    // Rollback by revalidating (or keep your own snapshot to hard-rollback)
    await mutate("/api/todos");
    throw new Error("Server rejected");
  }

  // Finalize: revalidate or merge exact server data
  await mutate("/api/todos");
}
`}
                </Styled.Pre>
                <Styled.Small>With SWR, you can pass a function to <b>mutate</b> to compute the optimistic cache.</Styled.Small>
            </Styled.Section>

            {/* 8) Create with temp IDs */}
            <Styled.Section>
                <Styled.H2>Create Flow: Temporary IDs & Reconciliation</Styled.H2>
                <Styled.List>
                    <li>Generate a <b>temp ID</b> (e.g., <Styled.InlineCode>"temp-123"</Styled.InlineCode>) for the new item.</li>
                    <li>Insert the item optimistically with the temp ID.</li>
                    <li>When the server returns the real ID, <b>replace</b> the temp ID and merge other fields.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: optimistic create with temp ID (hand-rolled)
const tempId = "temp-" + crypto.randomUUID();
setTodos(ts => [{ id: tempId, title: input, done: false }, ...ts]);

const res = await fetch("/api/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: input })
});

if (!res.ok) {
  // rollback remove temp
  setTodos(ts => ts.filter(t => t.id !== tempId));
  // show error toast
} else {
  const serverTodo = await res.json();
  // replace temp with server ID/data
  setTodos(ts => ts.map(t => t.id === tempId ? serverTodo : t));
}
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Optimistic delete */}
            <Styled.Section>
                <Styled.H2>Delete Flow: Optimistic Remove + Restore on Error</Styled.H2>
                <Styled.Pre>
                    {`// Remove from list immediately, then call DELETE
const prev = todos;
setTodos(ts => ts.filter(t => t.id !== id));

const res = await fetch(\`/api/todos/\${id}\`, { method: "DELETE" });
if (!res.ok) {
  // restore
  setTodos(prev);
}
`}
                </Styled.Pre>
                <Styled.Small>For destructive ops, confirm with the user and keep rollback simple.</Styled.Small>
            </Styled.Section>

            {/* 10) Infinite lists & pagination */}
            <Styled.Section>
                <Styled.H2>Infinite Lists & Pagination</Styled.H2>
                <Styled.List>
                    <li>Apply optimistic changes to the correct <b>page</b> in the cache (mind your <b>cache keys</b>).</li>
                    <li>For new items, prepend to page 1; for deletes/edits, locate the page containing the item.</li>
                    <li>After success, <b>invalidate</b> each affected page key to revalidate.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) UX & accessibility */}
            <Styled.Section>
                <Styled.H2>UX & Accessibility Tips</Styled.H2>
                <Styled.List>
                    <li>Give immediate feedback (button state, subtle shimmer) to signal the change happened.</li>
                    <li>Announce errors and rollbacks (ARIA live region or toast).</li>
                    <li>Disable duplicated actions while a mutation is in flight if idempotency is unclear.</li>
                    <li>For multi-user apps, reconcile via version/updatedAt to avoid overwriting fresh server data.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Forgetting rollback:</b> always keep a snapshot/context for failure paths.</li>
                    <li><b>Duplicates:</b> not replacing temp IDs with real ones after create.</li>
                    <li><b>Stale merges:</b> ignoring newer server updates that arrived concurrently.</li>
                    <li><b>Over-optimism:</b> optimistic delete of critical data without confirmation/undo.</li>
                    <li><b>Cache key mistakes:</b> writing to the wrong key can orphan or duplicate data.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Optimistic updates make apps feel instant. Snapshot ➜ predict ➜ send ➜ finalize/rollback.
                Use libraries (TanStack Query/SWR) for safe defaults, manage temp IDs, and always revalidate to keep
                the client in sync with the server.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default OptimisticUpdates;
