import React from "react";
import { Styled } from "./styled";

const Pagination = () => {
    return (
        <Styled.Page>
            <Styled.Title>Pagination</Styled.Title>

            <Styled.Lead>
                <b>Pagination</b> is the technique of splitting a long list of items into smaller, numbered pages,
                with controls to navigate between them. It improves performance, reduces clutter, and gives
                users a sense of position and progress.
            </Styled.Lead>

            {/* 1) Key Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Page:</b> A numbered slice of the total results. Often 1-based for users (page 1, 2, 3...).</li>
                    <li><b>Page size (pageSize):</b> How many items to show per page (e.g., 10, 20, 50).</li>
                    <li><b>Current page (page):</b> Which page the user is viewing right now.</li>
                    <li><b>Total items (total):</b> How many items exist in the full list.</li>
                    <li><b>Total pages:</b> <Styled.InlineCode>Math.ceil(total / pageSize)</Styled.InlineCode>.</li>
                    <li><b>Offset pagination:</b> Use <Styled.InlineCode>offset = (page - 1) * pageSize</Styled.InlineCode> to fetch a slice (SQL <code>LIMIT</code>/<code>OFFSET</code> style).</li>
                    <li><b>Cursor pagination:</b> Use a <i>cursor</i> (e.g., last item ID) to fetch the next slice—stable for live/large data.</li>
                    <li><b>Client pagination:</b> Paginate in the browser after loading all data (simple, but memory-heavy).</li>
                    <li><b>Server pagination:</b> Ask the server for each page (scalable, common for real apps).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic math & state */}
            <Styled.Section>
                <Styled.H2>Basic Math & State</Styled.H2>
                <Styled.Pre>
                    {`// Given total, pageSize, page (1-based)
const totalPages = Math.max(1, Math.ceil(total / pageSize));
const canPrev = page > 1;
const canNext = page < totalPages;`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the page number <b>1-based</b> for users. Internally you can map to 0-based if needed, but be consistent.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Minimum viable pagination (client-side demo) */}
            <Styled.Section>
                <Styled.H2>Minimum Viable Pagination (Client-side)</Styled.H2>
                <Styled.Pre>
                    {`function usePagination({ total, pageSize = 10, initialPage = 1 } = {}) {
  const [page, setPage] = React.useState(initialPage);
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / pageSize));

  const next = React.useCallback(() => setPage(p => Math.min(p + 1, totalPages)), [totalPages]);
  const prev = React.useCallback(() => setPage(p => Math.max(p - 1, 1)), []);
  const goto = React.useCallback((n) => setPage(() => Math.min(Math.max(1, n), totalPages)), [totalPages]);

  return { page, pageSize, totalPages, next, prev, goto };
}

function PaginatedList({ items = [], pageSize = 5 }) {
  const total = items.length;
  const { page, totalPages, next, prev, goto } = usePagination({ total, pageSize, initialPage: 1 });

  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <>
      <ul>{pageItems.map((it) => <li key={it.id}>{it.name}</li>)}</ul>
      <nav aria-label="Pagination" className="pagination">
        <button onClick={prev} disabled={page === 1} aria-label="Previous page">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => goto(n)}
              aria-current={page === n ? "page" : undefined}
            >
              {n}
            </button>
          );
        })}
        <button onClick={next} disabled={page === totalPages} aria-label="Next page">Next</button>
      </nav>
      <p>Page {page} of {totalPages}</p>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is a client-side example. For real data, prefer server pagination to avoid loading everything at once.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Server pagination pattern */}
            <Styled.Section>
                <Styled.H2>Server Pagination Pattern</Styled.H2>
                <Styled.List>
                    <li>Send <b>page</b> and <b>pageSize</b> (or <b>cursor</b>) to the server.</li>
                    <li>Server returns items plus <b>total</b> (for offset) or a <b>nextCursor</b> (for cursor).</li>
                    <li>Render items; enable/disable controls based on <b>totalPages</b> or presence of <b>nextCursor</b>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Offset-based fetcher (simplified)
async function fetchPage({ page, pageSize }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  const res = await fetch(\`/api/items?\${params}\`);
  if (!res.ok) throw new Error("Failed");
  return res.json(); // { items, total }
}

function ServerPaginatedList({ pageSize = 10 }) {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState({ items: [], total: 0, loading: false, error: null });

  React.useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));
    fetchPage({ page, pageSize })
      .then((r) => !cancelled && setData({ items: r.items, total: r.total, loading: false, error: null }))
      .catch((e) => !cancelled && setData((d) => ({ ...d, loading: false, error: e })));
    return () => { cancelled = true; };
  }, [page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <>
      {data.loading && <p>Loading…</p>}
      {data.error && <p role="alert">Error: {String(data.error)}</p>}
      <ul>{data.items.map((it) => <li key={it.id}>{it.name}</li>)}</ul>
      <nav aria-label="Pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span aria-live="polite">Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </nav>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    For fast-moving data (feeds), use <b>cursor pagination</b> instead of offsets to avoid duplicates/missing rows.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Page size selector */}
            <Styled.Section>
                <Styled.H2>Page Size Selector</Styled.H2>
                <Styled.Pre>
                    {`function PageSizeSelect({ value, onChange, options = [5, 10, 20, 50] }) {
  return (
    <label>
      Page size:
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    When the page size changes, reset to page 1 (or recalc to keep the first item visible).
                </Styled.Small>
            </Styled.Section>

            {/* 6) URL sync (query params) */}
            <Styled.Section>
                <Styled.H2>Sync With URL (Query Params)</Styled.H2>
                <Styled.List>
                    <li>Keep <b>page</b> and <b>pageSize</b> in the URL so refresh/share preserves state.</li>
                    <li>Read on mount → write on change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useSearchParams } from "react-router-dom";

function usePageParams({ defaultPage = 1, defaultSize = 10 } = {}) {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || defaultPage);
  const pageSize = Number(params.get("size") || defaultSize);

  const setPage = (p) => setParams(prev => { prev.set("page", String(p)); prev.set("size", String(pageSize)); return prev; });
  const setPageSize = (s) => setParams(prev => { prev.set("page", String(1)); prev.set("size", String(s)); return prev; });

  return { page, pageSize, setPage, setPageSize };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Accessibility & UX */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX</Styled.H2>
                <Styled.List>
                    <li><b>Use a &lt;nav aria-label="Pagination"&gt;</b> wrapper for controls.</li>
                    <li><b>Use aria-current="page"</b> on the active page button/link.</li>
                    <li><b>Keyboard:</b> Ensure buttons are focusable; support Enter/Space on clickables.</li>
                    <li><b>Visible state:</b> Disable Prev on page 1 and Next on last page; provide live region updates for screen readers.</li>
                    <li><b>Hit targets:</b> Keep buttons large enough (at least ~40px tap area).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Patterns & Tips */}
            <Styled.Section>
                <Styled.H2>Patterns & Tips</Styled.H2>
                <Styled.List>
                    <li><b>Windowed pagination:</b> Show a few numbers around the current page (e.g., 1 … 8 9 <u>10</u> 11 12 … 42).</li>
                    <li><b>Persist user choice:</b> Save last selected <i>pageSize</i> in localStorage.</li>
                    <li><b>Empty states:</b> If total=0, hide controls and show a friendly “No results”.</li>
                    <li><b>Loading states:</b> Disable controls while loading to prevent double fetches.</li>
                    <li><b>Error states:</b> Keep the current page visible; allow retry.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function pageWindow({ page, totalPages, radius = 2 }) {
  const pages = [];
  const start = Math.max(1, page - radius);
  const end = Math.min(totalPages, page + radius);
  for (let n = start; n <= end; n++) pages.push(n);
  return pages;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep state in URL for shareability.</li>
                    <li><b>Do</b> reset page to 1 when filters or search change.</li>
                    <li><b>Do</b> prefer cursor pagination for endless feeds/real-time lists.</li>
                    <li><b>Don't</b> fetch all data just to paginate on the client for large datasets.</li>
                    <li><b>Don't</b> mix 0-based and 1-based indexing—pick one and stick to it.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Offset:</b> Number of items to skip before returning results.</li>
                    <li><b>Cursor:</b> Token/identifier pointing to a position in the dataset (stable across inserts/deletes).</li>
                    <li><b>Windowed page numbers:</b> Showing only a subset of pages around the current page.</li>
                    <li><b>Endless scrolling:</b> Load more on scroll; a cousin of pagination (often cursor-based under the hood).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: choose <b>client</b> pagination for tiny datasets and demos; choose <b>server</b> or <b>cursor</b> pagination for real apps.
                Keep state in the URL, handle loading/error/empty states, and make navigation accessible.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Pagination;
