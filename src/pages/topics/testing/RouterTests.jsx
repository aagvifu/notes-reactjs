import { Styled } from "./styled";

const RouterTests = () => {
    return (
        <Styled.Page>
            <Styled.Title>Router Tests</Styled.Title>

            <Styled.Lead>
                <b>Goal:</b> Verify that your UI renders the <i>right screens</i> for a URL,
                <i>navigates</i> on user actions, and <i>guards</i> private pages. We'll use{" "}
                <Styled.InlineCode>@testing-library/react</Styled.InlineCode> with a{" "}
                <Styled.InlineCode>MemoryRouter</Styled.InlineCode>.
            </Styled.Lead>

            {/* 0) Glossary */}
            <Styled.Section>
                <Styled.H2>Key Terms (Router Testing)</Styled.H2>
                <Styled.List>
                    <li><b>Router:</b> The system that matches the current URL to a component tree.</li>
                    <li><b>Route:</b> A URL pattern (e.g., <Styled.InlineCode>"/users/:id"</Styled.InlineCode>) mapped to a UI element.</li>
                    <li><b>MemoryRouter:</b> A router that keeps history in memory (ideal for tests). Configure start URLs using <Styled.InlineCode>initialEntries</Styled.InlineCode>.</li>
                    <li><b>initialEntries:</b> An array of starting locations for <Styled.InlineCode>MemoryRouter</Styled.InlineCode> (e.g., <Styled.InlineCode>["/login"]</Styled.InlineCode>).</li>
                    <li><b>Navigate:</b> A component that redirects (e.g., to <Styled.InlineCode>"/login"</Styled.InlineCode>).</li>
                    <li><b>Outlet:</b> Placeholder where <em>child route</em> elements render inside a layout route.</li>
                    <li><b>useParams:</b> Hook to read dynamic segments like <Styled.InlineCode>:id</Styled.InlineCode>.</li>
                    <li><b>useSearchParams:</b> Hook to read/write query string (e.g., <Styled.InlineCode>?q=react</Styled.InlineCode>).</li>
                    <li><b>Location state:</b> Arbitrary state passed via navigation (e.g., <Styled.InlineCode>{`<Link to="/details" state={{ from: "home" }}/>`}</Styled.InlineCode>).</li>
                    <li><b>Screen queries:</b> Testing Library functions (e.g., <Styled.InlineCode>screen.getByRole</Styled.InlineCode>) to assert what the user sees.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Minimal setup */}
            <Styled.Section>
                <Styled.H2>Minimal Setup for Router Tests</Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/minimal.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link to="/about">About</Link>
    </main>
  );
}
function About() { return <h1>About</h1>; }

test("renders Home on '/' and navigates to About", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );

  // Assert initial route
  expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();

  // Navigate by clicking the link
  await screen.findByRole("link", { name: /about/i }).then((link) => link.click());

  // Now the About page should be visible
  expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why MemoryRouter?</b> It lets you simulate URLs without affecting the browser.
                    <b>Why role-based queries?</b> They mirror how assistive tech identifies elements.
                </Styled.Small>
            </Styled.Section>

            {/* 2) Params */}
            <Styled.Section>
                <Styled.H2>Testing Route Params with <code>useParams</code></Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/params.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";

function User() {
  const { id } = useParams();        // read ":id"
  return <h1>User #{id}</h1>;
}

test("reads :id from the URL", () => {
  render(
    <MemoryRouter initialEntries={["/users/42"]}>
      <Routes>
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /user #42/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <Styled.InlineCode>useParams()</Styled.InlineCode> returns an object
                    mapping route tokens (e.g., <Styled.InlineCode>:id</Styled.InlineCode>) to strings.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Search params */}
            <Styled.Section>
                <Styled.H2>Testing Search Params with <code>useSearchParams</code></Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/search-params.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useSearchParams } from "react-router-dom";

function Search() {
  const [params] = useSearchParams();         // read query string
  const q = params.get("q") ?? "";
  return <h1>Results for "{q}"</h1>;
}

test("reads ?q= from the URL", () => {
  render(
    <MemoryRouter initialEntries={["/search?q=react"]}>
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /results for "react"/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <Styled.InlineCode>useSearchParams()</Styled.InlineCode> is URLSearchParams backed by the router.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Redirects */}
            <Styled.Section>
                <Styled.H2>Testing Redirects with <code>&lt;Navigate /&gt;</code></Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/redirects.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

function Protected({ isAuthed }) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <h1>Dashboard</h1>;
}
function Login() { return <h1>Login</h1>; }

test("redirects unauthenticated users to /login", () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Protected isAuthed={false} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <Styled.InlineCode>Navigate</Styled.InlineCode> imperatively changes the
                    current location (a redirect). <Styled.InlineCode>replace</Styled.InlineCode> avoids adding
                    an extra history entry.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Protected route (Context) */}
            <Styled.Section>
                <Styled.H2>Testing Protected Routes with Context</Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/protected-context.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

const AuthCtx = React.createContext({ isAuthed: false });

function RequireAuth({ children }) {
  const { isAuthed } = React.useContext(AuthCtx);
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function Dashboard() { return <h1>Dashboard</h1>; }
function Login() { return <h1>Login</h1>; }

function withAuth(ui, value) {
  return <AuthCtx.Provider value={value}>{ui}</AuthCtx.Provider>;
}

test("shows Dashboard when authed, else Login", () => {
  // Unauthed -> Login
  const unauth = withAuth(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>,
    { isAuthed: false }
  );
  render(unauth);
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

  // Authed -> Dashboard
  const authed = withAuth(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>,
    { isAuthed: true }
  );
  render(authed);
  expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why Context?</b> It mirrors your app's real auth provider so tests stay realistic.
                </Styled.Small>
            </Styled.Section>

            {/* 6) 404 Not Found */}
            <Styled.Section>
                <Styled.H2>Testing 404 (Catch-all Route)</Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/not-found.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

function NotFound() { return <h1>404 - Not Found</h1>; }

test("unknown paths render NotFound", () => {
  render(
    <MemoryRouter initialEntries={["/does-not-exist"]}>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /404 - not found/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> The <Styled.InlineCode>"*"</Styled.InlineCode> path matches anything not
                    handled by earlier routes.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Location state */}
            <Styled.Section>
                <Styled.H2>Testing Location State</Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/location-state.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link, useLocation } from "react-router-dom";

function Home() {
  return (
    <Link to="/details" state={{ from: "home" }}>
      Go to details
    </Link>
  );
}
function Details() {
  const { state } = useLocation();   // { from: "home" }
  return <h1>Details from: {state?.from}</h1>;
}

test("passes location state via Link", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </MemoryRouter>
  );

  screen.getByRole("link", { name: /go to details/i }).click();
  expect(screen.getByRole("heading", { name: /details from: home/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <Styled.InlineCode>useLocation()</Styled.InlineCode> exposes{" "}
                    <Styled.InlineCode>location.state</Styled.InlineCode> set by navigation.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Nested routes & Outlet */}
            <Styled.Section>
                <Styled.H2>Nested Routes &amp; <code>&lt;Outlet /&gt;</code></Styled.H2>
                <Styled.Pre>
                    {`// __tests__/router/nested-outlet.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav><Link to="/app/profile">Profile</Link></nav>
      <Outlet />
    </div>
  );
}
function Dashboard() { return <h1>Dashboard</h1>; }
function Profile() { return <h1>Profile</h1>; }

test("renders child route inside Outlet", () => {
  render(
    <MemoryRouter initialEntries={["/app"]}>
      <Routes>
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  // Index route at /app
  expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();

  // Navigate to child route
  screen.getByRole("link", { name: /profile/i }).click();
  expect(screen.getByRole("heading", { name: /profile/i })).toBeInTheDocument();
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <Styled.InlineCode>Outlet</Styled.InlineCode> renders the matched child route's element inside a layout.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use <Styled.InlineCode>MemoryRouter</Styled.InlineCode> with <Styled.InlineCode>initialEntries</Styled.InlineCode> to control the starting URL.</li>
                    <li><b>Do</b> assert by <b>visible UI</b> (headings, links, buttons) - not internals.</li>
                    <li><b>Do</b> test both happy paths (authed) and edge paths (redirects, 404).</li>
                    <li><b>Don't</b> mock router hooks unless necessary - prefer real routing via <Styled.InlineCode>MemoryRouter</Styled.InlineCode>.</li>
                    <li><b>Don't</b> tie tests to implementation details (e.g., specific component names).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Treat the router as the user does - by URL and clicks. Use MemoryRouter to start at
                any path, assert the rendered screen, and verify redirects, params, search params, 404s, and
                nested layouts. That's reliable, maintainable router testing.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RouterTests;
