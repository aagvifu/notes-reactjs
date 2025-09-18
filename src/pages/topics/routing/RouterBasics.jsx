import React from "react";
import { Styled } from "./styled";

const RouterBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Router Basics</Styled.Title>

            <Styled.Lead>
                A <b>router</b> keeps the UI in sync with the URL. In React Router v6, you declare a
                <b> route tree</b> and use <Styled.InlineCode>&lt;Link/&gt;</Styled.InlineCode>,
                <Styled.InlineCode>&lt;NavLink/&gt;</Styled.InlineCode>, and hooks to navigate—without full
                page reloads.
            </Styled.Lead>

            {/* 1) Core ideas */}
            <Styled.Section>
                <Styled.H2>Core Ideas</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SPA (Single-Page App):</b> the browser loads one HTML document; navigation swaps views
                        on the client (no full reload).
                    </li>
                    <li>
                        <b>Router:</b> watches the URL and picks a matching <em>route element</em> to render.
                    </li>
                    <li>
                        <b>Route:</b> a path pattern (e.g. <Styled.InlineCode>"/about"</Styled.InlineCode>) with
                        an element to render.
                    </li>
                    <li>
                        <b>Segment:</b> a part of a path separated by slashes (e.g.{" "}
                        <Styled.InlineCode>"/users/42"</Styled.InlineCode> has segments{" "}
                        <Styled.InlineCode>"users"</Styled.InlineCode> and <Styled.InlineCode>"42"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Dynamic segment (param):</b> <Styled.InlineCode>":id"</Styled.InlineCode> captures a
                        value from the URL, e.g. <Styled.InlineCode>"/users/:id"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Location:</b> the current URL broken into <em>pathname</em>, <em>search</em> (query
                        string), and <em>hash</em>.
                    </li>
                    <li>
                        <b>History:</b> the browser’s session stack (back/forward). The router pushes/replace
                        entries instead of reloading pages.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal setup */}
            <Styled.Section>
                <Styled.H2>Minimal Setup</Styled.H2>
                <Styled.Small>
                    Use <Styled.InlineCode>BrowserRouter</Styled.InlineCode> for clean URLs. On GitHub Pages,
                    set <Styled.InlineCode>basename</Styled.InlineCode> (you already use{" "}
                    <Styled.InlineCode>"/notes-reactjs"</Styled.InlineCode>).
                </Styled.Small>
                <Styled.Pre>
                    {`// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/notes-reactjs">
    <App />
  </BrowserRouter>
);`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/App.jsx (skeleton)
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* more routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Linking vs navigating */}
            <Styled.Section>
                <Styled.H2>Linking vs Programmatic Navigation</Styled.H2>
                <Styled.List>
                    <li>
                        <b>&lt;Link&gt;</b>: renders an accessible anchor; updates URL without reload.
                    </li>
                    <li>
                        <b>&lt;NavLink&gt;</b>: like Link, but adds an <Styled.InlineCode>active</Styled.InlineCode>{" "}
                        class (or lets you compute one) when the link matches the current location.
                    </li>
                    <li>
                        <b>useNavigate()</b>: navigate from code (e.g., after submit).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`import { Link, NavLink, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  function onLogoClick() {
    navigate("/", { replace: false }); // push a new history entry
  }

  return (
    <nav>
      <button type="button" onClick={onLogoClick}>MySite</button>

      {/* Declarative links */}
      <Link to="/about">About</Link>

      {/* Active styling */}
      <NavLink
        to="/docs"
        className={({ isActive }) => (isActive ? "active" : undefined)}
        title="Docs"
      >
        Docs
      </NavLink>
    </nav>
  );
}`}
                </Styled.Pre>

                <Styled.Small>
                    Use <b>buttons</b> for actions and <b>links</b> for navigation. Avoid clickable{" "}
                    <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode>s.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Route params (basics) */}
            <Styled.Section>
                <Styled.H2>Route Params (Basics)</Styled.H2>
                <Styled.List>
                    <li>
                        Define params with <Styled.InlineCode>":id"</Styled.InlineCode>, then read them via{" "}
                        <Styled.InlineCode>useParams()</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// route: <Route path="/users/:id" element={<UserProfile />} />
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams(); // "42"
  return <p>User ID: {id}</p>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Relative vs absolute links */}
            <Styled.Section>
                <Styled.H2>Relative vs Absolute Links</Styled.H2>
                <Styled.List>
                    <li>
                        A path starting with <Styled.InlineCode>"/"</Styled.InlineCode> is <b>absolute</b>.
                    </li>
                    <li>
                        Otherwise, the link is <b>relative</b> to the current route. Use this inside nested
                        routes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// If you're currently at /settings
<Link to="profile">Profile</Link>   // -> /settings/profile  (relative)
<Link to="/profile">Profile</Link>  // -> /profile          (absolute)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Index, 404 */}
            <Styled.Section>
                <Styled.H2>Index Routes & 404</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Index route:</b> the default child UI for a parent path (no extra segment).
                    </li>
                    <li>
                        <b>Not Found:</b> a catch-all route <Styled.InlineCode>path="*"</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Nested example with an index route
<Route path="/docs" element={<DocsLayout />}>
  <Route index element={<DocsHome />} />       {/* renders at /docs */}
  <Route path="getting-started" element={<GettingStarted />} />
</Route>

// 404 (basic)
<Route path="*" element={<NotFound />} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) BrowserRouter vs HashRouter */}
            <Styled.Section>
                <Styled.H2>BrowserRouter vs HashRouter</Styled.H2>
                <Styled.List>
                    <li>
                        <b>BrowserRouter:</b> clean paths (e.g., <Styled.InlineCode>/users/42</Styled.InlineCode>
                        ). Needs server/host to serve <Styled.InlineCode>index.html</Styled.InlineCode> for any
                        unknown path (you handle this via GH Pages fallback).
                    </li>
                    <li>
                        <b>HashRouter:</b> URLs like <Styled.InlineCode>#/users/42</Styled.InlineCode>. Doesn’t
                        require server rewrite rules, but less pretty.
                    </li>
                    <li>
                        <b>basename:</b> prefix for all routes when app is not at domain root (e.g.,{" "}
                        <Styled.InlineCode>"/notes-reactjs"</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefer <Styled.InlineCode>&lt;Link/&gt;</Styled.InlineCode> over manual history calls.</li>
                    <li><b>Do</b> use <Styled.InlineCode>&lt;NavLink/&gt;</Styled.InlineCode> for active states.</li>
                    <li><b>Do</b> keep routes <em>kebab-case</em> and predictable.</li>
                    <li><b>Don’t</b> reload the page for internal navigation.</li>
                    <li><b>Don’t</b> make non-semantic elements clickable for navigation.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Path</b>: the pathname portion of the URL (no query/hash).</li>
                    <li><b>Param</b>: a dynamic portion of a path (<Styled.InlineCode>:id</Styled.InlineCode>).</li>
                    <li><b>Search params</b>: query string (e.g., <Styled.InlineCode>?q=react</Styled.InlineCode>).</li>
                    <li><b>Hash</b>: in-page fragment (e.g., <Styled.InlineCode>#section-2</Styled.InlineCode>).</li>
                    <li><b>Navigate</b>: programmatic route change via <Styled.InlineCode>useNavigate</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: declare routes, link with <i>Link/NavLink</i>, read params with <i>useParams</i>,
                and use <i>useNavigate</i> when you must redirect from code. Keep URLs clean and semantic.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RouterBasics;
