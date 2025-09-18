import { Styled } from "./styled";

const NestedRoutes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Nested Routes</Styled.Title>

            <Styled.Lead>
                <b>Nested routes</b> let your URL structure mirror your UI hierarchy. A parent route renders shared
                UI (nav, chrome, sidebars) and a placeholder called an <b>Outlet</b>; child routes render inside that
                outlet. This keeps layouts DRY and URLs predictable.
            </Styled.Lead>

            {/* 1) Core ideas */}
            <Styled.Section>
                <Styled.H2>What &amp; Why</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Route tree:</b> a hierarchy of routes where children render within their parent’s UI. It
                        models “pages within pages” (e.g., <code>/dashboard/reports</code> lives under <code>/dashboard</code>).
                    </li>
                    <li>
                        <b>Layout route:</b> a route whose element provides shared structure (header/sidebar) and renders{" "}
                        <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> where children appear.
                    </li>
                    <li>
                        <b>Outlet:</b> a placeholder component from React Router; the matching child route renders here.
                    </li>
                    <li>
                        <b>Index route:</b> a child with no <code>path</code> that renders when the parent path matches
                        exactly (e.g., <code>/dashboard</code> shows “Overview”).
                    </li>
                    <li>
                        <b>Relative paths/links:</b> child <code>path</code> values (no leading slash) and{" "}
                        <Styled.InlineCode>&lt;Link to="child"&gt;</Styled.InlineCode> resolve relative to the parent.
                    </li>
                    <li>
                        <b>Dynamic segment:</b> a path token like <Styled.InlineCode>:reportId</Styled.InlineCode> that
                        captures a piece of the URL (use <Styled.InlineCode>useParams()</Styled.InlineCode> to read it).
                    </li>
                    <li>
                        <b>Pathless route:</b> a parent without a <code>path</code> used to share layout/guards across a group.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Example</Styled.H2>
                <Styled.Pre>
                    {`import { Routes, Route, Outlet, NavLink } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <NavLink to="" end>Overview</NavLink>
        <NavLink to="reports">Reports</NavLink>
      </aside>

      <main className="content">
        {/* Children render here */}
        <Outlet />
      </main>
    </div>
  );
}

function Overview() { return <h2>Overview</h2>; }
function ReportsList() { return <h2>Reports list</h2>; }

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Index child renders at /dashboard */}
        <Route index element={<Overview />} />
        {/* Child renders at /dashboard/reports */}
        <Route path="reports" element={<ReportsList />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h2>Not Found</h2>} />
    </Routes>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> the <Styled.InlineCode>index</Styled.InlineCode> child has no <code>path</code>; it’s the
                    default content for its parent.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Dynamic segment + detail page */}
            <Styled.Section>
                <Styled.H2>Dynamic Segments &amp; Detail Pages</Styled.H2>
                <Styled.Pre>
                    {`import { useParams } from "react-router-dom";

function ReportsList() {
  const data = [{ id: "r-101", name: "Q1" }, { id: "r-102", name: "Q2" }];
  return (
    <ul>
      {data.map(r => (
        <li key={r.id}>
          {/* Relative link: resolves to /dashboard/reports/:id */}
          <NavLink to={r.id}>{r.name}</NavLink>
        </li>
      ))}
    </ul>
  );
}

function ReportDetail() {
  const { reportId } = useParams(); // "r-101"
  return <h3>Report: {reportId}</h3>;
}

// Route tree (excerpt)
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="reports" element={<ReportsLayout />}>
    <Route index element={<ReportsList />} />
    <Route path=":reportId" element={<ReportDetail />} />
  </Route>
</Route>

// Layout for nested "reports" section
function ReportsLayout() {
  return (
    <>
      <h2>Reports</h2>
      <Outlet />
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Relative links:</b> <Styled.InlineCode>&lt;NavLink to={"{r.id}"} /&gt;</Styled.InlineCode> keeps URLs tidy and
                    avoids hard-coding <code>/dashboard/reports/...</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Index vs. child path */}
            <Styled.Section>
                <Styled.H2>Index vs. Child Path</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Index route</b> = the default child for <b>exact</b> parent match (no <code>path</code>).
                    </li>
                    <li>
                        <b>Child path</b> = renders when URL continues past the parent (e.g.,{" "}
                        <Styled.InlineCode>/dashboard/reports</Styled.InlineCode>).
                    </li>
                    <li>
                        Use <b>one</b> index route per parent; it should be the “landing” content of that section.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Relative navigation patterns */}
            <Styled.Section>
                <Styled.H2>Navigation Patterns (Relative)</Styled.H2>
                <Styled.Pre>
                    {`import { useNavigate } from "react-router-dom";

function ReportsToolbar() {
  const navigate = useNavigate();

  function openFirst() {
    // Push a child route relative to the current parent
    navigate("r-101");
  }

  function backToList() {
    // ".." goes up one level (from /dashboard/reports/r-101 -> /dashboard/reports)
    navigate("..");
  }

  return (
    <div>
      <button onClick={openFirst}>Open first</button>
      <button onClick={backToList}>Back</button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer relative <Styled.InlineCode>to</Styled.InlineCode>/<Styled.InlineCode>navigate()</Styled.InlineCode> to
                    keep routes portable when parents move.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Sharing data with children */}
            <Styled.Section>
                <Styled.H2>Sharing Data with Children (<code>useOutletContext</code>)</Styled.H2>
                <Styled.Pre>
                    {`import { Outlet, useOutletContext } from "react-router-dom";

function DashboardLayout() {
  const user = { name: "Ashish", role: "admin" };
  return (
    <div className="layout">
      {/* Provide context to descendants rendered by <Outlet /> */}
      <Outlet context={{ user }} />
    </div>
  );
}

function Overview() {
  const { user } = useOutletContext(); // { name, role }
  return <h2>Welcome, {user.name}</h2>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>useOutletContext</Styled.InlineCode> avoids prop drilling from a layout to its nested
                    children in the same route branch.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Pathless parents & guards */}
            <Styled.Section>
                <Styled.H2>Pathless Parents &amp; Guards</Styled.H2>
                <Styled.Pre>
                    {`function RequireAuth() {
  const isAuthed = true; // replace with real auth check
  return isAuthed ? <Outlet /> : <p>Please sign in</p>;
}

<Routes>
  {/* Pathless parent groups protected routes without adding a segment */}
  <Route element={<RequireAuth />}>
    <Route path="/settings" element={<SettingsLayout />}>
      <Route index element={<Profile />} />
      <Route path="billing" element={<Billing />} />
    </Route>
  </Route>
</Routes>`}
                </Styled.Pre>
                <Styled.Small>
                    A <b>pathless route</b> wraps children with layout/guards but doesn’t change the URL.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep URLs parallel to your UI hierarchy (predictable paths).</li>
                    <li><b>Do</b> use an <Styled.InlineCode>index</Styled.InlineCode> for default content at each section.</li>
                    <li><b>Do</b> prefer relative <Styled.InlineCode>to</Styled.InlineCode> and child <code>path</code> (no leading slash).</li>
                    <li><b>Don’t</b> sprinkle duplicate nav/header across pages—use a layout route + <Styled.InlineCode>Outlet</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> mix absolute and relative child paths arbitrarily; it’s a common source of 404s.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Adding a leading slash to a child <code>path</code> (<b>absolute</b>), which breaks nesting (it no longer renders inside the parent).
                    </li>
                    <li>
                        Forgetting <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> in the layout, so children never appear.
                    </li>
                    <li>
                        Omitting a good <b>index route</b>, leaving the parent path blank/awkward.
                    </li>
                    <li>
                        Hard-coding full URLs in links; use <b>relative</b> links so sections are portable.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Layout route:</b> shared UI wrapper for a branch that renders an <Styled.InlineCode>Outlet</Styled.InlineCode>.</li>
                    <li><b>Outlet:</b> placeholder where the matched child route renders.</li>
                    <li><b>Index route:</b> default child for the exact parent match.</li>
                    <li><b>Dynamic segment:</b> a <Styled.InlineCode>:param</Styled.InlineCode> token in a path.</li>
                    <li><b>Pathless route:</b> parent with no <code>path</code> used to group/guard children.</li>
                    <li><b>Relative link:</b> a link or navigate call that resolves against the current route.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: build a clean route tree, put shared UI in a layout route, render children via
                <Styled.InlineCode> &lt;Outlet /&gt;</Styled.InlineCode>, and use index routes + relative links to keep things
                portable and predictable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default NestedRoutes;
