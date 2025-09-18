import { Styled } from "./styled";

const LayoutRoutes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Layout Routes</Styled.Title>

            <Styled.Lead>
                A <b>layout route</b> is a parent route that renders shared UI (header, sidebar, footer,
                wrappers) plus an <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> where child routes
                appear. Use it to keep persistent chrome while switching inner pages.
            </Styled.Lead>

            {/* 1) Key definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Route:</b> a mapping from a URL <i>path</i> to a React <i>element</i> (component).
                    </li>
                    <li>
                        <b>Nested route:</b> a child route defined inside a parent route; it renders inside the
                        parent's layout via <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Layout route:</b> a parent route whose element provides shared UI and renders{" "}
                        <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> for children.
                    </li>
                    <li>
                        <b>&lt;Outlet /&gt;:</b> a placeholder in the parent layout where the matched child
                        route's element is inserted.
                    </li>
                    <li>
                        <b>Index route:</b> the default child route for a parent; in v6 you write{" "}
                        <Styled.InlineCode>&lt;Route index element=&#123;...&#125; /&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Pathless route:</b> a parent route with <i>no</i> <Styled.InlineCode>path</Styled.InlineCode>;
                        used to apply a layout/guard/grouping without affecting the URL.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Layout Route</Styled.H2>
                <Styled.Pre>
                    {`import { Routes, Route, Outlet, NavLink } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/dashboard/reports">Reports</NavLink>
        </nav>
      </header>

      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>

      <footer>© 2025</footer>
    </>
  );
}

function DashboardHome() { return <h2>Dashboard Home</h2>; }
function Reports() { return <h2>Reports</h2>; }

export default function AppRoutes() {
  return (
    <Routes>
      {/* Parent provides the layout */}
      <Route path="/dashboard" element={<AppLayout />}>
        {/* Default (index) child at /dashboard */}
        <Route index element={<DashboardHome />} />
        {/* Nested child at /dashboard/reports */}
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Other top-level routes... */}
    </Routes>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The layout route is <Styled.InlineCode>path="/dashboard"</Styled.InlineCode>. Its children
                    mount into <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Pathless layout for grouping */}
            <Styled.Section>
                <Styled.H2>Pathless Layout (Grouping Without URL Segment)</Styled.H2>
                <Styled.Lead>Use a pathless parent to share layout/logic without changing the URL.</Styled.Lead>
                <Styled.Pre>
                    {`function SectionLayout() {
  return (
    <div className="section">
      <h1>Settings</h1>
      <Outlet />
    </div>
  );
}

<Routes>
  {/* No "path" prop here → pathless */}
  <Route element={<SectionLayout />}>
    <Route path="/profile" element={<Profile />} />
    <Route path="/security" element={<Security />} />
  </Route>
</Routes>`}
                </Styled.Pre>
                <Styled.Small>
                    The <i>URL</i> stays <Styled.InlineCode>/profile</Styled.InlineCode> or{" "}
                    <Styled.InlineCode>/security</Styled.InlineCode>, but both share the same layout.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Multi-level layouts */}
            <Styled.Section>
                <Styled.H2>Multiple Layout Levels</Styled.H2>
                <Styled.Pre>
                    {`function RootLayout() { return (<div><TopBar /><Outlet /></div>); }
function AdminLayout() { return (<div className="admin"><SideNav /><Outlet /></div>); }

<Routes>
  <Route element={<RootLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/pricing" element={<Pricing />} />

    {/* Nested layout under /admin */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<Users />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Route>
</Routes>`}
                </Styled.Pre>
                <Styled.Small>
                    <b>RootLayout</b> wraps the whole app; <b>AdminLayout</b> wraps only the <i>/admin</i>{" "}
                    branch. Each layout renders its own <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Index vs. child routes */}
            <Styled.Section>
                <Styled.H2>Index Route vs. Child Path</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Index route</b> renders at the parent's path exactly (e.g., <i>/admin</i>).
                    </li>
                    <li>
                        <b>Child path</b> renders at a subpath (e.g., <i>/admin/users</i>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminOverview />} />       {/* /admin */}
  <Route path="users" element={<Users />} />        {/* /admin/users */}
</Route>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Common patterns */}
            <Styled.Section>
                <Styled.H2>Common Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Persistent chrome:</b> header/sidebar goes in the layout; inner pages in{" "}
                        <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Guards at the layout level:</b> put auth/role checks in the layout so all children
                        are protected; redirect if unauthorized.
                    </li>
                    <li>
                        <b>Pathless route for shared wrappers:</b> apply a wrapper (e.g., container, theme,
                        analytics) to multiple unrelated paths without changing their URLs.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ProtectedLayout() {
  const isAuthed = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}

<Routes>
  <Route element={<ProtectedLayout />}>
    <Route path="/billing" element={<Billing />} />
    <Route path="/orders" element={<Orders />} />
  </Route>
</Routes>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> render exactly one <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> in a layout
                        where children should appear.
                    </li>
                    <li>
                        <b>Do</b> use <Styled.InlineCode>index</Styled.InlineCode> for a default page under a layout.
                    </li>
                    <li>
                        <b>Do</b> keep <i>layout</i> components focused on structure and orchestration (not page logic).
                    </li>
                    <li>
                        <b>Don’t</b> nest <Styled.InlineCode>&lt;BrowserRouter&gt;</Styled.InlineCode> inside layouts; the app
                        should have a single router at the root.
                    </li>
                    <li>
                        <b>Don’t</b> forget <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode>—without it, children will never render.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Element:</b> the React component associated with a route (
                        <Styled.InlineCode>element=&#123;&lt;Component /&gt;&#125;</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Relative path:</b> a child route’s path appended to the parent’s path (e.g.,
                        <i> "users"</i> under <i>"/admin"</i> becomes <i>"/admin/users"</i>).
                    </li>
                    <li>
                        <b>Navigate:</b> a component that performs imperative redirects in React Router.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Use layout routes to share persistent chrome and structure. Place{" "}
                <Styled.InlineCode>&lt;Outlet /&gt;</Styled.InlineCode> where children should mount, use{" "}
                <Styled.InlineCode>index</Styled.InlineCode> for a default page, and apply guards/wrappers
                at the layout level for entire sections.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LayoutRoutes;
