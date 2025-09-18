import { Styled } from "./styled";

const InfiniteScroll = () => {
    return (
        <Styled.Page>
            <Styled.Title>Infinite Scroll</Styled.Title>

            <Styled.Lead>
                <b>Infinite scroll</b> is a pattern where new items are fetched and appended as the user
                nears the end of a list—no manual pagination UI. It reduces clicks and keeps users "in flow,"
                but requires careful <i>fetching, caching, performance</i>, and <i>accessibility</i>.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions (Read First)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Pagination</b>: Loading lists in parts (pages) instead of everything at once.
                    </li>
                    <li>
                        <b>Offset pagination</b>: The server takes <Styled.InlineCode>?page=3&amp;limit=20</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>?offset=60</Styled.InlineCode>. Simple but can miss or duplicate items if new data arrives between requests.
                    </li>
                    <li>
                        <b>Cursor pagination</b>: The server returns a <i>cursor</i> (e.g.,{" "}
                        <Styled.InlineCode>nextCursor</Styled.InlineCode>) to fetch the next slice. More reliable for real-time feeds.
                    </li>
                    <li>
                        <b>Sentinel</b>: A tiny, invisible element at the list's end that, when visible in the viewport, triggers fetching more items.
                    </li>
                    <li>
                        <b>IntersectionObserver (IO)</b>: Browser API that tells you when an element enters/leaves the viewport—great for sentinels. Doesn't run every scroll tick (efficient).
                    </li>
                    <li>
                        <b>Virtualization / Windowing</b>: Rendering only the visible rows (e.g., via <i>react-window</i>) to keep the DOM small and fast.
                    </li>
                    <li>
                        <b>Backpressure</b>: Preventing overlapping or too-frequent loads (don't fetch page 4 while page 3 is still loading).
                    </li>
                    <li>
                        <b>Dedupe</b>: Avoid adding the same item twice across pages (use stable <Styled.InlineCode>id</Styled.InlineCode> keys).
                    </li>
                    <li>
                        <b>Cache key</b>: The string/tuple that identifies a request in a cache layer (e.g., <Styled.InlineCode>["posts", page]</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Pattern A: IntersectionObserver (preferred) */}
            <Styled.Section>
                <Styled.H2>Pattern A — IntersectionObserver (Preferred)</Styled.H2>
                <Styled.List>
                    <li>Attach an IO to a bottom <b>sentinel</b>.</li>
                    <li>When the sentinel intersects and you have <b>more</b> data, fetch the next page.</li>
                    <li>Use <b>AbortController</b> to cancel stale requests when triggers overlap.</li>
                    <li>Guard against multiple triggers while a page is loading (<b>backpressure</b>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useInfiniteList({ pageSize = 20 } = {}) {
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(0);          // 0-based page index
  const [hasMore, setHasMore] = React.useState(true); // becomes false on last page
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const abortRef = React.useRef(null);

  const fetchPage = React.useCallback(async (nextPage) => {
    if (loading || !hasMore) return;          // backpressure
    setLoading(true); setError(null);

    // cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(
        \`/api/posts?page=\${nextPage}&limit=\${pageSize}\`,
        { signal: ac.signal }
      );
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const data = await res.json();          // { items: [], total: 123 } or { items: [], hasMore: true }
      
      // Basic last-page detection:
      const newItems = data.items ?? [];
      setItems(prev => {
        // optional dedupe by id:
        const map = new Map(prev.map(x => [x.id, x]));
        newItems.forEach(x => map.set(x.id, x));
        return Array.from(map.values());
      });

      setPage(nextPage);
      const reachedEnd = newItems.length < pageSize || data.hasMore === false;
      setHasMore(!reachedEnd);
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, loading, hasMore]);

  React.useEffect(() => {
    // initial load
    if (items.length === 0) fetchPage(0);
    return () => abortRef.current?.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, page, hasMore, loading, error, fetchNext: () => fetchPage(page + 1) };
}

function Feed() {
  const { items, hasMore, loading, error, fetchNext } = useInfiniteList({ pageSize: 20 });
  const sentinelRef = React.useRef(null);

  React.useEffect(() => {
    if (!hasMore || loading) return;
    if (!("IntersectionObserver" in window)) return; // let fallback handle it

    const node = sentinelRef.current;
    if (!node) return;

    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) fetchNext();
    }, { root: null, rootMargin: "300px 0px", threshold: 0 }); // prefetch ~300px early

    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, loading, fetchNext]);

  return (
    <div>
      <ul>
        {items.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>

      {/* Load status / retry */}
      {error && <p role="alert">Failed to load. <button onClick={fetchNext}>Retry</button></p>}
      {loading && <p aria-live="polite">Loading…</p>}

      {/* Sentinel: only render when more to load */}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Use a generous <Styled.InlineCode>rootMargin</Styled.InlineCode> (e.g.,{" "}
                    <Styled.InlineCode>"300px"</Styled.InlineCode>) to prefetch before the user hits the end.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Pattern B: Window scroll fallback */}
            <Styled.Section>
                <Styled.H2>Pattern B — Window Scroll Fallback</Styled.H2>
                <Styled.List>
                    <li>
                        Works when <Styled.InlineCode>IntersectionObserver</Styled.InlineCode> isn't available.
                    </li>
                    <li>Throttle to ~200ms to avoid running on every pixel of scroll.</li>
                    <li>Check "distance to bottom ≤ threshold" to trigger <i>fetchNext</i>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useNearBottom(threshold = 300) {
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const distFromBottom = scrollHeight - (scrollTop + clientHeight);
        setNear(distFromBottom <= threshold);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return near;
}

function FeedFallback() {
  const { items, hasMore, loading, error, fetchNext } = useInfiniteList({ pageSize: 20 });
  const nearBottom = useNearBottom(300);

  React.useEffect(() => {
    if (nearBottom && hasMore && !loading) fetchNext();
  }, [nearBottom, hasMore, loading, fetchNext]);

  return /* ...same list as above... */;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> The IO pattern is more efficient and accurate; use the scroll fallback only when needed.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cursor-based example */}
            <Styled.Section>
                <Styled.H2>Cursor-Based Pagination (Recommended for Feeds)</Styled.H2>
                <Styled.List>
                    <li>
                        Server returns <Styled.InlineCode>{`{ items, nextCursor }`}</Styled.InlineCode>. If{" "}
                        <Styled.InlineCode>nextCursor</Styled.InlineCode> is <i>null</i>, you're at the end.
                    </li>
                    <li>More robust than offsets when new items are inserted on the server between requests.</li>
                </Styled.List>
                <Styled.Pre>
                    {`async function fetchByCursor(cursor) {
  const url = cursor ? \`/api/posts?cursor=\${cursor}\` : "/api/posts";
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json(); // { items: [...], nextCursor: "abc" | null }
}

function useCursorFeed() {
  const [state, setState] = React.useState({ items: [], cursor: null, done: false, loading: false, error: null });

  const loadMore = React.useCallback(async () => {
    if (state.loading || state.done) return;
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchByCursor(state.cursor);
      setState(s => ({
        items: [...s.items, ...data.items],
        cursor: data.nextCursor,
        done: data.nextCursor == null,
        loading: false,
        error: null
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e }));
    }
  }, [state.cursor, state.loading, state.done]);

  React.useEffect(() => { if (state.items.length === 0) loadMore(); }, []); // initial
  return { ...state, loadMore };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) UX & a11y */}
            <Styled.Section>
                <Styled.H2>UX & Accessibility</Styled.H2>
                <Styled.List>
                    <li>
                        Show <b>skeletons/spinners</b> for the new page, not the entire list.
                    </li>
                    <li>
                        Use <Styled.InlineCode>aria-live="polite"</Styled.InlineCode> near the list to announce "Loading…" and "Loaded N items".
                    </li>
                    <li>
                        Keep focus stable. Don't steal focus when new items mount; use anchors or a "Back to top" button.
                    </li>
                    <li>
                        Provide an alternate <b>"Load more"</b> button for keyboard/screen-reader users (or when autoscan fails).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Performance */}
            <Styled.Section>
                <Styled.H2>Performance</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Virtualize</b> long lists (e.g., react-window) to render only visible rows.
                    </li>
                    <li>
                        Avoid heavy per-item components; memoize row components by <Styled.InlineCode>id</Styled.InlineCode>.
                    </li>
                    <li>
                        Batch state updates (React already batches in events). Keep <i>items</i> immutable.
                    </li>
                    <li>
                        Use <b>rootMargin</b> to prefetch early; keep <b>threshold</b> at 0 for simple triggers.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Pitfalls & fixes */}
            <Styled.Section>
                <Styled.H2>Pitfalls & How to Avoid Them</Styled.H2>
                <Styled.List>
                    <li><b>Duplicate items</b>: dedupe by <Styled.InlineCode>id</Styled.InlineCode> when merging pages.</li>
                    <li><b>Endless refetch loop</b>: don't call <i>fetchNext</i> while <i>loading</i> or when <i>hasMore</i> is false.</li>
                    <li><b>Races & cancelled pages</b>: use <b>AbortController</b> and ignore <b>AbortError</b>.</li>
                    <li><b>Scroll jump on refresh</b>: preserve scroll position or use virtualization with stable item heights.</li>
                    <li><b>SEO</b>: infinite scroll is JS-driven; provide paginated routes or server rendering for crawlable archives.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Optional: with TanStack Query (peek) */}
            <Styled.Section>
                <Styled.H2>Peek: Infinite Scroll with TanStack Query</Styled.H2>
                <Styled.Small>
                    You'll cover this deeply in <i>tanstack-query</i>, but here's the shape:
                </Styled.Small>
                <Styled.Pre>
                    {`// queryFn returns { items, nextCursor }
function usePostsInfinite() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchByCursor(pageParam),
    initialPageParam: null, // start cursor
    getNextPageParam: (lastPage) => lastPage.nextCursor, // null => done
  });
}

// In component:
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsInfinite();
// const items = data?.pages.flatMap(p => p.items) ?? [];`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Prefer IntersectionObserver with a sentinel, use cursor pagination if possible,
                guard against overlapping loads, and virtualize long lists. Add accessible status messages and a
                fallback "Load more" button for a resilient UX.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default InfiniteScroll;
