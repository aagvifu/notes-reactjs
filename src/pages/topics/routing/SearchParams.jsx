import React from "react";
import { Link, useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import { Styled } from "./styled";

const SearchParams = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <Styled.Page>
            <Styled.Title>Search Params (URL Query String)</Styled.Title>

            <Styled.Lead>
                <b>Search parameters</b> are the <Styled.InlineCode>?key=value</Styled.InlineCode> pairs in a URL.
                In React Router, use <Styled.InlineCode>useSearchParams()</Styled.InlineCode> to <b>read</b> and <b>update</b> them.
                This makes UI state shareable via the address bar (great for filters, pagination, tabs, and search).
            </Styled.Lead>

            {/* Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (clear definitions)</Styled.H2>
                <Styled.List>
                    <li><b>URL</b>: a web address (e.g., <Styled.InlineCode>https://site.com/products?page=2&amp;q=shoes</Styled.InlineCode>).</li>
                    <li><b>Path</b>: the route portion (e.g., <Styled.InlineCode>/products</Styled.InlineCode>).</li>
                    <li><b>Search string</b>: everything after <Styled.InlineCode>?</Styled.InlineCode> including the question mark (e.g., <Styled.InlineCode>?page=2&amp;q=shoes</Styled.InlineCode>).</li>
                    <li><b>Query string / Search params</b>: the key–value pairs inside the search string (e.g., <Styled.InlineCode>page=2</Styled.InlineCode>, <Styled.InlineCode>q=shoes</Styled.InlineCode>).</li>
                    <li><b>URLSearchParams</b>: a web API for reading/writing query pairs, used by React Router under the hood.</li>
                    <li><b>Encoding</b>: special characters are percent-encoded (space → <Styled.InlineCode>%20</Styled.InlineCode>), handled for you by React Router.</li>
                </Styled.List>
            </Styled.Section>

            {/* Reading */}
            <Styled.Section>
                <Styled.H2>Read search params</Styled.H2>
                <Styled.Pre>
                    {`// Inside a component:
const [searchParams] = useSearchParams();

const page = Number(searchParams.get("page") ?? 1); // -> number (default 1)
const q = searchParams.get("q") ?? "";              // -> string (default "")
const tags = searchParams.getAll("tag");            // -> ["ui", "react"] if ?tag=ui&tag=react

// Always remember: values come as strings; you must cast (Number, Boolean, JSON.parse) if needed.`}
                </Styled.Pre>
            </Styled.Section>

            {/* Updating basic */}
            <Styled.Section>
                <Styled.H2>Update search params (replace entire set)</Styled.H2>
                <Styled.List>
                    <li><Styled.InlineCode>setSearchParams(init, options?)</Styled.InlineCode> <b>replaces</b> the current params by default.</li>
                    <li>Pass an object or <Styled.InlineCode>URLSearchParams</Styled.InlineCode>.</li>
                    <li>Use <Styled.InlineCode>{`{ replace: true }`}</Styled.InlineCode> to avoid pushing a new history entry.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Replace current params with a new set
setSearchParams({ page: "2", q: "react" });                // pushes a new entry
setSearchParams({ page: "2", q: "react" }, { replace: true }); // replaces history (no back step)`}
                </Styled.Pre>
            </Styled.Section>

            {/* Merging */}
            <Styled.Section>
                <Styled.H2>Merge with existing params (safe pattern)</Styled.H2>
                <Styled.Small>By default, updating replaces the entire query. To "merge", read the current params first:</Styled.Small>
                <Styled.Pre>
                    {`// Merge pattern: read existing, write back updated
setSearchParams(prev => {
  const next = new URLSearchParams(prev);
  next.set("page", String(Number(prev.get("page") ?? 1) + 1));
  if (!next.get("q")) next.set("q", ""); // keep stable keys if you need them
  return next;
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* Linking with search */}
            <Styled.Section>
                <Styled.H2>Link to a page with search params</Styled.H2>
                <Styled.Pre>
                    {`// 1) Hard-code:
<Link to="/routing/search-params?page=2&q=react">Page 2 (React)</Link>

// 2) Build with createSearchParams:
<Link
  to={{
    pathname: "/routing/search-params",
    search: \`?\${createSearchParams({ page: "2", q: "react" })}\`,
  }}
>
  Page 2 (React)
</Link>`}
                </Styled.Pre>
            </Styled.Section>

            {/* Form sync recipe */}
            <Styled.Section>
                <Styled.H2>Recipe: Sync a simple search form to the URL</Styled.H2>
                <Styled.Pre>
                    {`function SearchFilters() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [page, setPage] = React.useState(Number(sp.get("page") ?? 1));

  // When user submits, write state -> URL
  function onSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(sp);
    next.set("q", q);
    next.set("page", String(page));
    setSp(next); // push new entry
  }

  // Optional: whenever URL changes (back/forward), update local inputs
  React.useEffect(() => {
    setQ(sp.get("q") ?? "");
    setPage(Number(sp.get("page") ?? 1));
  }, [sp]);

  return (
    <form onSubmit={onSubmit}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
      <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
      <span>Page {page}</span>
      <button type="button" onClick={() => setPage(p => p + 1)}>Next</button>
      <button type="submit">Apply</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Multi-value strategies */}
            <Styled.Section>
                <Styled.H2>Arrays & multi-select filters</Styled.H2>
                <Styled.List>
                    <li><b>Repeated keys</b>: <Styled.InlineCode>?tag=ui&amp;tag=react</Styled.InlineCode> → use <Styled.InlineCode>getAll("tag")</Styled.InlineCode>.</li>
                    <li><b>Comma-separated</b>: <Styled.InlineCode>?tags=ui,react</Styled.InlineCode> → split/join yourself. Simpler URL, but manual parsing.</li>
                    <li><b>JSON</b>: <Styled.InlineCode>?filters=%7B...%7D</Styled.InlineCode> → powerful but less readable; ensure try/catch on parse.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Repeated keys approach (recommended for filters):
const [sp, setSp] = useSearchParams();

// Read:
const selected = sp.getAll("tag"); // ["ui", "react"]

// Toggle a tag:
function toggle(tag) {
  const next = new URLSearchParams(sp);
  const list = new Set(next.getAll("tag"));
  if (list.has(tag)) list.delete(tag); else list.add(tag);
  next.delete("tag");
  for (const t of list) next.append("tag", t);
  setSp(next);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Replace vs push */}
            <Styled.Section>
                <Styled.H2>History behavior: push vs replace</Styled.H2>
                <Styled.List>
                    <li><b>Push (default)</b>: adds a new entry; Back returns to previous filters.</li>
                    <li><b>Replace</b>: overwrites current entry; Back skips intermediate changes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Replace when updating "live" as user types, to avoid polluting history:
setSearchParams({ q: "react" }, { replace: true });`}
                </Styled.Pre>
            </Styled.Section>

            {/* Validation & types */}
            <Styled.Section>
                <Styled.H2>Validation, defaults, and types</Styled.H2>
                <Styled.List>
                    <li>Query values are <b>strings</b>. Convert explicitly: <Styled.InlineCode>Number()</Styled.InlineCode>, <Styled.InlineCode>Boolean()</Styled.InlineCode>, custom parsers.</li>
                    <li>Apply <b>defaults</b> when a key is missing or invalid (e.g., page <Styled.InlineCode>&lt; 1</Styled.InlineCode>).</li>
                    <li>Strip <b>empty</b> or <b>unknown</b> keys when writing to keep URLs clean.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function getPage(sp) {
  const n = Number(sp.get("page"));
  return Number.isFinite(n) && n > 0 ? n : 1;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li><b>Nothing changes?</b> Ensure you call <Styled.InlineCode>setSearchParams</Styled.InlineCode> with a new object or a new <Styled.InlineCode>URLSearchParams</Styled.InlineCode> instance.</li>
                    <li><b>Weird characters?</b> They’re URL-encoded automatically. Log <Styled.InlineCode>searchParams.toString()</Styled.InlineCode> to inspect.</li>
                    <li><b>State out of sync?</b> Either derive directly from <Styled.InlineCode>searchParams</Styled.InlineCode> or mirror with an effect (see form recipe).</li>
                </Styled.List>
            </Styled.Section>

            {/* Mini live demo links (optional) */}
            <Styled.Section>
                <Styled.H2>Quick Links (demo navigation)</Styled.H2>
                <Styled.List>
                    <li>
                        <Link to={{ pathname: "/routing/search-params", search: `?${createSearchParams({ q: "react", page: "2" })}` }}>
                            Open: <Styled.InlineCode>?q=react&amp;page=2</Styled.InlineCode>
                        </Link>
                    </li>
                    <li>
                        <a
                            href={`?${createSearchParams({ tag: "ui", q: "buttons" })}`}
                            onClick={(e) => { e.preventDefault(); navigate({ search: `?${createSearchParams({ tag: "ui", q: "buttons" })}` }); }}
                            rel="noopener noreferrer"
                        >
                            Navigate with tag + q (via navigate)
                        </a>
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use search params for sharable UI state: filters, pagination, sorting, tabs.</li>
                    <li><b>Do</b> keep URLs tidy—remove empty keys; use repeated keys for arrays.</li>
                    <li><b>Don’t</b> store sensitive data in the URL (tokens, emails, PII).</li>
                    <li><b>Don’t</b> overuse JSON blobs if simple keys will do.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <b>Search params make state shareable</b>. Read with <Styled.InlineCode>useSearchParams()</Styled.InlineCode>,
                update with <Styled.InlineCode>setSearchParams()</Styled.InlineCode>, and choose <i>push</i> vs <i>replace</i> based on UX.
                Prefer repeated keys for arrays, validate inputs, and keep the URL clean.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SearchParams;
