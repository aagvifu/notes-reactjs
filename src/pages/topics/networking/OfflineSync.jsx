import React from "react";
import { Styled } from "./styled";

const OfflineSync = () => {
    return (
        <Styled.Page>
            <Styled.Title>Offline Sync</Styled.Title>

            <Styled.Lead>
                <b>Offline Sync</b> means your app keeps working without internet and then
                <i> synchronizes</i> changes when the connection returns. The core idea is to read from a
                local cache while offline and queue writes for later, achieving <b>eventual consistency</b>.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Concepts &amp; Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Offline-first:</b> design so the app is usable without network from the start.</li>
                    <li><b>Local Cache:</b> data stored on device (e.g., <Styled.InlineCode>Cache Storage</Styled.InlineCode> or <Styled.InlineCode>IndexedDB</Styled.InlineCode>) used to render UI when offline.</li>
                    <li><b>Outbox / Write Queue:</b> a local list of pending writes (create/update/delete) to send when the app is online again.</li>
                    <li><b>Eventual Consistency:</b> the system converges to the correct state after syncing; short-term differences are expected.</li>
                    <li><b>Optimistic Update:</b> update UI immediately assuming the server will accept the change; roll back on failure.</li>
                    <li><b>Idempotency:</b> the same operation can be safely retried without unintended effects (e.g., by using <Styled.InlineCode>requestId</Styled.InlineCode>).</li>
                    <li><b>Conflict Resolution:</b> rules to merge client/server changes (e.g., “last-write-wins”, “server-wins”, or custom merge).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Building blocks */}
            <Styled.Section>
                <Styled.H2>Building Blocks</Styled.H2>
                <Styled.List>
                    <li><b>Service Worker (SW):</b> a background script that can intercept requests and serve cached responses.</li>
                    <li><b>Cache Storage:</b> key-value store for HTTP responses (great for GETs and static assets).</li>
                    <li><b>IndexedDB:</b> structured client DB for app data and queues; use a tiny wrapper in real apps.</li>
                    <li><b>Background Sync:</b> SW feature to retry when connectivity returns (limited support on some browsers).</li>
                    <li><b>Network Status:</b> <Styled.InlineCode>navigator.onLine</Styled.InlineCode> and <Styled.InlineCode>online/offline</Styled.InlineCode> events to react to connectivity changes.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal viable offline */}
            <Styled.Section>
                <Styled.H2>Minimal Viable Offline (MVO)</Styled.H2>
                <Styled.List>
                    <li><b>Read:</b> serve list/detail pages from Cache/IndexedDB when offline.</li>
                    <li><b>Write:</b> push user actions to an <b>outbox</b>; show optimistic UI; flush when back online.</li>
                    <li><b>Retry:</b> exponential backoff, deduplicate by <Styled.InlineCode>requestId</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Hook: network status */}
            <Styled.Section>
                <Styled.H2>Hook: Detect Network Status</Styled.H2>
                <Styled.Pre>
                    {`// useNetworkStatus: track online/offline
export function useNetworkStatus() {
  const [online, setOnline] = React.useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  React.useEffect(() => {
    function goOnline() { setOnline(true); }
    function goOffline() { setOnline(false); }
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online; // boolean
}`}
                </Styled.Pre>
                <Styled.Small>Use this to toggle UI states like “Syncing…/Offline mode”.</Styled.Small>
            </Styled.Section>

            {/* 5) Service worker fetch strategy */}
            <Styled.Section>
                <Styled.H2>Service Worker: Cache Strategy</Styled.H2>
                <Styled.List>
                    <li><b>Network-first with cache fallback:</b> try network; if it fails, return cache.</li>
                    <li><b>Stale-while-revalidate:</b> return cache immediately, refresh in background for next time.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// sw.js (conceptual example)
// Install: pre-cache core assets
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open("app-v1").then(cache => cache.addAll([
    "/", "/index.html", "/assets/app.css", "/assets/app.js"
  ])));
});

// Fetch: network-first for JSON APIs, cache-first for static
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/")) {
    // Network-first for data
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open("api-v1");
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        return new Response(JSON.stringify({ ok:false, offline:true }), { status: 503 });
      }
    })());
    return;
  }

  // Static assets: cache-first
  e.respondWith((async () => {
    const cached = await caches.match(req);
    return cached || fetch(req);
  })());
});`}
                </Styled.Pre>
                <Styled.Small>
                    Register the SW in your app entry once. Real apps use Workbox or a bundler plugin to manage revisions.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Outbox: queue writes when offline */}
            <Styled.Section>
                <Styled.H2>Outbox Pattern: Queue Writes</Styled.H2>
                <Styled.List>
                    <li>Store pending operations in IndexedDB: <i>{`{ id, url, method, body, headers, attempt }`}</i>.</li>
                    <li>When online, flush the queue with <b>backoff</b> and <b>idempotency</b> (send a unique <Styled.InlineCode>X-Request-Id</Styled.InlineCode>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// useOutbox (conceptual)
// replace idb access with your preferred tiny wrapper
export function useOutbox() {
  const online = useNetworkStatus();

  // enqueue: optimistic update first, then persist to outbox
  async function enqueue(op) {
    // optimistic UI (e.g., setState)
    // await idb.add("outbox", { ...op, id: crypto.randomUUID(), attempt: 0 });
  }

  // flush: try sending all pending ops
  const flush = React.useCallback(async () => {
    if (!online) return;
    // const ops = await idb.getAll("outbox");
    // for (const op of ops) {
    //   try {
    //     const res = await fetch(op.url, {
    //       method: op.method,
    //       headers: { "Content-Type": "application/json", "X-Request-Id": op.id, ...op.headers },
    //       body: op.body ? JSON.stringify(op.body) : undefined,
    //     });
    //     if (!res.ok) throw new Error("server-error");
    //     // await idb.delete("outbox", op.id); // success
    //   } catch (err) {
    //     // await idb.update("outbox", op.id, { attempt: op.attempt + 1 });
    //     // apply exponential backoff, stop at a max attempt
    //   }
    // }
  }, [online]);

  React.useEffect(() => {
    if (online) { flush(); }
  }, [online, flush]);

  return { enqueue, flush, online };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Optimistic UI example */}
            <Styled.Section>
                <Styled.H2>Optimistic UI Example</Styled.H2>
                <Styled.Pre>
                    {`// Example: adding a todo while offline
function Todos() {
  const [todos, setTodos] = React.useState([]);
  const { enqueue, online } = useOutbox();

  async function addTodo(title) {
    // 1) optimistic: update UI immediately
    const tempId = crypto.randomUUID();
    setTodos(prev => [{ id: tempId, title, optimistic: true }, ...prev]);

    // 2) enqueue write for server
    await enqueue({
      url: "/api/todos",
      method: "POST",
      body: { title, clientId: tempId }
    });
  }

  return (
    <>
      <button onClick={() => addTodo("Read a book")}>
        Add Todo {online ? "" : "(queued)"}
      </button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.title} {t.optimistic ? <em>(syncing)</em> : null}
          </li>
        ))}
      </ul>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Mark optimistic items so users see that sync is pending.</Styled.Small>
            </Styled.Section>

            {/* 8) Conflict resolution */}
            <Styled.Section>
                <Styled.H2>Conflict Resolution</Styled.H2>
                <Styled.List>
                    <li><b>Server-wins:</b> server state overwrites client (simple, but can lose local edits).</li>
                    <li><b>Last-write-wins (LWW):</b> compare timestamps or versions; newest change wins.</li>
                    <li><b>Merge:</b> field-level or CRDTs for collaborative editing; more complex, fewer conflicts.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: LWW merge
function resolve(clientDoc, serverDoc) {
  return (serverDoc.updatedAt >= clientDoc.updatedAt) ? serverDoc : clientDoc;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Patterns & best practices */}
            <Styled.Section>
                <Styled.H2>Patterns &amp; Best Practices</Styled.H2>
                <Styled.List>
                    <li><b>SWR (stale-while-revalidate):</b> read cached data instantly, then fetch to refresh.</li>
                    <li><b>Versioning:</b> include <Styled.InlineCode>etag</Styled.InlineCode> or <Styled.InlineCode>version</Styled.InlineCode> to detect stale writes.</li>
                    <li><b>Backoff &amp; jitter:</b> retry after 1s, 2s, 4s… with randomness to avoid thundering herds.</li>
                    <li><b>Deduplication:</b> use <Styled.InlineCode>X-Request-Id</Styled.InlineCode> so repeated POSTs don't create duplicates.</li>
                    <li><b>Partial sync:</b> batch small ops; resume from last checkpoint with cursors or timestamps.</li>
                    <li><b>Security:</b> protect tokens in SW fetches; handle auth expiry while offline (graceful errors).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Testing & tooling */}
            <Styled.Section>
                <Styled.H2>Testing &amp; Tooling</Styled.H2>
                <Styled.List>
                    <li>Use DevTools “Offline” checkbox to simulate no-network.</li>
                    <li>Throttle to “Slow 3G” to test flaky networks and retries.</li>
                    <li>Clear specific caches in Application → Storage to verify cache logic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> show clear offline indicators and queued actions.</li>
                    <li><b>Do</b> keep writes idempotent and retriable.</li>
                    <li><b>Don't</b> store large JSON in localStorage (use IndexedDB for MBs of data).</li>
                    <li><b>Don't</b> block UI if sync fails; keep queueing and retrying in background.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Service Worker (SW):</b> background script that can intercept and respond to network requests.</li>
                    <li><b>Cache Storage:</b> browser storage for HTTP responses; accessed from SW or window.</li>
                    <li><b>IndexedDB:</b> low-level key-value DB for structured data; suitable for queues and datasets.</li>
                    <li><b>Background Sync:</b> SW API to retry after connectivity is restored (limited browser support).</li>
                    <li><b>Backoff:</b> increasing delay between retries to reduce server load and collisions.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: implement <b>cache for reads</b> and an <b>outbox for writes</b>, detect network status,
                retry with idempotency and backoff, and resolve conflicts predictably. That's a robust Offline Sync foundation.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default OfflineSync;
