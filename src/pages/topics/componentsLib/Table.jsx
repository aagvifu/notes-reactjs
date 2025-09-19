import React from "react";
import { Styled } from "./styled";

const Table = () => {
    return (
        <Styled.Page>
            <Styled.Title>Table (Data Table)</Styled.Title>

            <Styled.Lead>
                A <b>data table</b> displays structured, row-and-column information so users can scan,
                compare, and act on records. In React, build tables with <Styled.InlineCode>&lt;table&gt;</Styled.InlineCode> semantics
                for accessibility, then add behavior (sorting, pagination) through state and props.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Data table:</b> a grid with <em>columns</em> (fields) and <em>rows</em> (records) that supports
                        scanning, comparison, and bulk actions.
                    </li>
                    <li>
                        <b>Use when:</b> the data is structured, needs column labels, and benefits from features like sort, filter, selection, or pagination.
                    </li>
                    <li>
                        <b>Avoid when:</b> you only need a simple list, gallery, or timeline-use <Styled.InlineCode>&lt;ul&gt;</Styled.InlineCode>/<Styled.InlineCode>&lt;ol&gt;</Styled.InlineCode> or cards instead.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy (Semantic Structure)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>&lt;caption&gt;</b> - short description of the table's purpose.
                    </li>
                    <li>
                        <b>&lt;thead&gt;&lt;tr&gt;&lt;th&gt;</b> - column headers (use <Styled.InlineCode>scope="col"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;</b> - data rows and cells.
                    </li>
                    <li>
                        <b>&lt;tfoot&gt;</b> - summary or totals (optional).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function BasicTable({ rows }) {
  return (
    <table>
      <caption>Employees - active headcount (demo)</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Location</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{r.role}</td>
            <td>{r.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example rows:
// const rows = [
//   { id: 1, name: "Aarav", role: "Frontend Engineer", city: "Bengaluru" },
//   { id: 2, name: "Meera", role: "Designer", city: "Pune" },
// ];`}
                </Styled.Pre>
                <Styled.Small>Start semantic. Behavior comes next via React state.</Styled.Small>
            </Styled.Section>

            {/* 3) Accessibility Essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Use real table elements:</b> <Styled.InlineCode>&lt;table&gt;</Styled.InlineCode>, not divs. Screen readers rely on them.
                    </li>
                    <li>
                        <b>Header scope:</b> add <Styled.InlineCode>scope="col"</Styled.InlineCode> on column headers; <Styled.InlineCode>scope="row"</Styled.InlineCode> if you use row headers.
                    </li>
                    <li>
                        <b>Caption:</b> describe the table's purpose succinctly using <Styled.InlineCode>&lt;caption&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Sortable headers:</b> reflect state with <Styled.InlineCode>aria-sort="ascending|descending|none"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Keyboard:</b> ensure focus styles on interactive elements inside cells; don't trap focus.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: sortable header with aria-sort
function SortHeader({ label, sortState, onSort }) {
  // sortState: "none" | "ascending" | "descending"
  return (
    <button
      type="button"
      aria-sort={sortState}
      onClick={onSort}
      // Visually show sort icon via CSS; keep button focusable
    >
      {label}
    </button>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Sorting (controlled) */}
            <Styled.Section>
                <Styled.H2>Sorting (Controlled State)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled state:</b> keep <em>column</em> and <em>direction</em> in React state, derive a sorted array via <Styled.InlineCode>useMemo</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Stable sort:</b> when values tie, preserve original order for predictable UX.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function useSort(initial = { column: null, dir: "none" }) {
  const [sort, setSort] = React.useState(initial);
  const toggle = (col) =>
    setSort((s) => {
      const dir = s.column !== col ? "ascending"
                : s.dir === "ascending" ? "descending"
                : s.dir === "descending" ? "none"
                : "ascending";
      return { column: dir === "none" ? null : col, dir };
    });
  return { sort, toggle };
}

function SortedRows({ rows, sort }) {
  return React.useMemo(() => {
    if (!sort.column || sort.dir === "none") return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sort.column]; const bv = b[sort.column];
      if (av === bv) return 0;
      const asc = av > bv ? 1 : -1;
      return sort.dir === "ascending" ? asc : -asc;
    });
    return copy;
  }, [rows, sort]);
}`}
                </Styled.Pre>
                <Styled.Small>Expose sort state to header cells; compute derived rows with <code>useMemo</code>.</Styled.Small>
            </Styled.Section>

            {/* 5) Pagination (client-side) */}
            <Styled.Section>
                <Styled.H2>Pagination (Client-Side)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Why paginate:</b> reduce scroll fatigue and improve performance for medium-sized datasets.
                    </li>
                    <li>
                        <b>State:</b> keep <em>page</em> and <em>pageSize</em> in state; derive <em>pageCount</em> and <em>slice</em>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function usePagination(total, initial = { page: 1, pageSize: 10 }) {
  const [page, setPage] = React.useState(initial.page);
  const [pageSize, setPageSize] = React.useState(initial.pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { page, setPage, pageSize, setPageSize, pageCount, range: [start, end] };
}

function Pager({ page, setPage, pageCount }) {
  return (
    <nav aria-label="Table pagination">
      <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
      <span>{page} / {pageCount}</span>
      <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
      <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>Last</button>
    </nav>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Putting it together */}
            <Styled.Section>
                <Styled.H2>Putting It Together (Sort + Paginate)</Styled.H2>
                <Styled.Pre>
                    {`function DataTable({ rows }) {
  const { sort, toggle } = useSort();
  const sorted = SortedRows({ rows, sort });

  const { page, setPage, pageSize, setPageSize, pageCount, range } =
    usePagination(sorted.length, { page: 1, pageSize: 5 });

  const pageRows = sorted.slice(range[0], range[1]);

  return (
    <>
      <table>
        <caption>Employees</caption>
        <thead>
          <tr>
            <th scope="col">
              <button type="button" aria-sort={sort.column === "name" ? sort.dir : "none"} onClick={() => toggle("name")}>
                Name
              </button>
            </th>
            <th scope="col">
              <button type="button" aria-sort={sort.column === "role" ? sort.dir : "none"} onClick={() => toggle("role")}>
                Role
              </button>
            </th>
            <th scope="col">
              <button type="button" aria-sort={sort.column === "city" ? sort.dir : "none"} onClick={() => toggle("city")}>
                Location
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.role}</td>
              <td>{r.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
        <label>
          Rows per page{" "}
          <select value={pageSize} onChange={(e) => { const n = Number(e.target.value); setPage(1); setPageSize(n); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
        <Pager page={page} setPage={setPage} pageCount={pageCount} />
      </div>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    State is centralized in small hooks; the table remains semantic and accessible.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Selection (checkboxes) */}
            <Styled.Section>
                <Styled.H2>Row Selection (Checkboxes)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Indeterminate:</b> if some, but not all, rows are selected, reflect that on the header checkbox.
                    </li>
                    <li>
                        Keep a <em>Set</em> of selected row ids for O(1) checks.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function useSelection(ids = []) {
  const [sel, setSel] = React.useState(() => new Set());
  const allIds = React.useMemo(() => ids, [ids]);

  const toggle = (id) => setSel(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const clear = () => setSel(new Set());
  const isAll = sel.size > 0 && sel.size === allIds.length;
  const isNone = sel.size === 0;
  const isIndeterminate = !isNone && !isAll;

  const toggleAll = () => setSel(s => (s.size === allIds.length ? new Set() : new Set(allIds)));
  return { sel, toggle, toggleAll, isAll, isIndeterminate };
}`}
                </Styled.Pre>
                <Styled.Small>Expose just enough API for a table header and body checkboxes.</Styled.Small>
            </Styled.Section>

            {/* 8) Responsive Patterns */}
            <Styled.Section>
                <Styled.H2>Responsive Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Horizontal scroll:</b> allow <em>overflow-x</em> on small screens to preserve columns.
                    </li>
                    <li>
                        <b>Stacked cards:</b> at very small widths, you can present each row as a card where column labels become
                        field labels-only if your use case requires it.
                    </li>
                    <li>
                        <b>Column priority:</b> hide non-critical columns at narrow widths (if the table still makes sense).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Performance */}
            <Styled.Section>
                <Styled.H2>Performance</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Virtualization:</b> for thousands of rows, render only what's visible with a windowing library. Keep the <em>semantic</em> table if possible.
                    </li>
                    <li>
                        <b>Derived state:</b> compute sorted/filtered/paginated rows with <Styled.InlineCode>useMemo</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Server features:</b> for very large data, push sorting/filtering/pagination to the server and stream results.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use semantic table elements and captions for context.</li>
                    <li><b>Do</b> expose state (sort, page, selection) as props for reusability.</li>
                    <li><b>Do</b> reflect sorting in <Styled.InlineCode>aria-sort</Styled.InlineCode> and visual affordances.</li>
                    <li><b>Don't</b> nest interactive controls without keyboard focus order.</li>
                    <li><b>Don't</b> rebuild the world-compose tiny hooks like <Styled.InlineCode>useSort</Styled.InlineCode>, <Styled.InlineCode>usePagination</Styled.InlineCode>, <Styled.InlineCode>useSelection</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Row:</b> one record in the dataset.</li>
                    <li><b>Column:</b> a field shared by all records (e.g., name, role).</li>
                    <li><b>Header Cell (th):</b> labels a column or a row; announces scope to assistive tech.</li>
                    <li><b>aria-sort:</b> attribute that communicates the current sort state of a column.</li>
                    <li><b>Pagination:</b> dividing data into pages to reduce cognitive and rendering load.</li>
                    <li><b>Virtualization:</b> rendering only visible rows for performance on large lists.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: start with semantic HTML, layer controlled state for sort/paginate/select, and keep
                accessibility and performance in mind. A good table is predictable, keyboard-friendly, and fast.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Table;
