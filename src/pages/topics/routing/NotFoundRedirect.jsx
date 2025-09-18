import { Styled } from "./styled";

const NotFoundRedirect = () => {
    return (
        <Styled.Page>
            <Styled.Title>NotFound &amp; Redirect</Styled.Title>

            <Styled.Lead>
                In routing, a <b>Not Found (404)</b> page appears when no route matches the URL.
                A <b>redirect</b> programmatically sends users from one URL to another.
                In React Router, we implement these with a catch-all <Styled.InlineCode>Route path="*"</Styled.InlineCode>,
                the <Styled.InlineCode>&lt;Navigate /&gt;</Styled.InlineCode> component, and the
                <Styled.InlineCode>useNavigate()</Styled.InlineCode> hook.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>404 (Not Found):</b> The requested path doesn’t match any route. In SPAs we show a friendly
                        page instead of the browser’s default error page.
                    </li>
                    <li>
                        <b>Redirect:</b> Sending users to another path. In SPAs this is a <em>client-side</em> navigation
                        (no full page reload).
                    </li>
                    <li>
                        <b>&lt;Navigate to ... /&gt;:</b> A declarative component that immediately navigates to{" "}
                        <Styled.InlineCode>to</Styled.InlineCode>. Use <Styled.InlineCode>replace</Styled.InlineCode> to avoid
                        pushing a new history entry.
                    </li>
                    <li>
                        <b>useNavigate():</b> An imperative hook to navigate from event handlers or effects. Accepts options like{" "}
                        <Styled.InlineCode>{`{ replace: true, state: { ... } }`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>replace vs push:</b> <i>replace</i> swaps the current history entry (no back button to previous URL);
                        <i>push</i> adds a new entry (default).
                    </li>
                    <li>
                        <b>state:</b> An optional object you can pass during navigation (e.g.,{" "}
                        <Styled.InlineCode>navigate("/login", {`state: {from: "/settings" } `})</Styled.InlineCode>). Read it with{" "}
                        <Styled.InlineCode>useLocation().state</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic 404 page */}
            <Styled.Section>
                <Styled.H2>Pattern 1 — A friendly 404 page (no auto-redirect)</Styled.H2>
                <Styled.List>
                    <li>Use a catch-all route (<Styled.InlineCode>path="*"</Styled.InlineCode>).</li>
                    <li>Show the unknown path, helpful links, and a button to go Home.</li>
                    <li>Do <em>not</em> auto-redirect if users might be trying a deep link or a typo—they should decide.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/pages/system/NotFound.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  return (
    <div role="region" aria-labelledby="nf-title">
      <h1 id="nf-title">Page not found</h1>
      <p>We couldn't find: <code>{location.pathname}</code></p>
      <ul>
        <li><Link to="/home">Go to Home</Link></li>
        <li><Link to="/routing/router-basics">Read Router Basics</Link></li>
      </ul>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Add a route: <Styled.InlineCode>{`<Route path="*" element={<NotFound />} />`}</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Delayed redirect */}
            <Styled.Section>
                <Styled.H2>Pattern 2 — 404 with delayed redirect</Styled.H2>
                <Styled.List>
                    <li>Useful when you want to inform the user but still guide them away after a few seconds.</li>
                    <li>Pass <Styled.InlineCode>replace: true</Styled.InlineCode> to avoid cluttering history.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/pages/system/NotFoundRedirect.jsx
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function NotFoundRedirect({ to = "/home", seconds = 5 }) {
  const nav = useNavigate();
  const loc = useLocation();

  React.useEffect(() => {
    const id = setTimeout(() => {
      nav(to, { replace: true, state: { from: loc.pathname } });
    }, seconds * 1000);
    return () => clearTimeout(id);
  }, [to, seconds, nav, loc.pathname]);

  return (
    <div role="region" aria-labelledby="nf-redirect-title">
      <h1 id="nf-redirect-title">Page not found</h1>
      <p>
        Redirecting to <code>{to}</code> in {seconds} seconds…
        {" "}
        <Link to={to} replace>Go now</Link>
      </p>
      <p><small>Tried: <code>{loc.pathname}</code></small></p>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Route: <Styled.InlineCode>{`<Route path="*" element={<NotFoundRedirect to="/home" seconds={3} />} />`}</Styled.InlineCode>
                </Styled.Small>
            </Styled.Section>

            {/* 4) Immediate redirect for legacy URLs */}
            <Styled.Section>
                <Styled.H2>Pattern 3 — Immediate redirect (legacy → new URL)</Styled.H2>
                <Styled.List>
                    <li>Use <Styled.InlineCode>&lt;Navigate /&gt;</Styled.InlineCode> when an old path should instantly map to a new one.</li>
                    <li>Keep <Styled.InlineCode>replace</Styled.InlineCode> to avoid leaving dead entries in history.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: /docs/* moved to /guide/*
import { Navigate } from "react-router-dom";
<Route path="/docs/*" element={<Navigate to="/guide" replace />} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Nested catch-alls */}
            <Styled.Section>
                <Styled.H2>Nested routes: local 404s</Styled.H2>
                <Styled.List>
                    <li>Inside a nested segment, use <Styled.InlineCode>path="*"</Styled.InlineCode> to show a <em>section-specific</em> 404.</li>
                    <li>This avoids sending users away from a section if only the sub-page is wrong.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// In the /guide parent route:
<Route path="/guide" element={<GuideLayout />}>
  <Route index element={<Intro />} />
  <Route path="getting-started" element={<GettingStarted />} />
  <Route path="*" element={<GuideNotFound />} />  {/* local 404 */}
</Route>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) GH Pages / hosting note */}
            <Styled.Section>
                <Styled.H2>Hosting note: 404 on static hosts</Styled.H2>
                <Styled.List>
                    <li>
                        Static hosts (e.g., GitHub Pages) may serve a static 404 page when the user refreshes a deep link
                        (<i>server doesn’t know your SPA routes</i>).
                    </li>
                    <li>
                        Fix: add a <b>SPA fallback</b> 404 that rewrites to <Styled.InlineCode>index.html</Styled.InlineCode>, or use
                        <Styled.InlineCode>HashRouter</Styled.InlineCode>. With GitHub Pages + BrowserRouter, ship a{" "}
                        <Styled.InlineCode>public/404.html</Styled.InlineCode> that client-redirects to your app (keeps path).
                    </li>
                    <li>
                        Also set <Styled.InlineCode>basename</Styled.InlineCode> (you’ve done this) so links resolve under{" "}
                        <Styled.InlineCode>/notes-reactjs</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do/Don't + glossary */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use a friendly 404 page with helpful links.</li>
                    <li><b>Do</b> use <Styled.InlineCode>replace</Styled.InlineCode> for redirects that shouldn’t remain in history.</li>
                    <li><b>Do</b> keep <i>nested</i> 404s local to a section when appropriate.</li>
                    <li><b>Don’t</b> auto-redirect users so fast they can’t read the message (2–5s is reasonable).</li>
                    <li><b>Don’t</b> create redirect loops—double-check source and target paths.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Catch-all route:</b> a route with <Styled.InlineCode>path="*"</Styled.InlineCode> that matches any unmatched URL.</li>
                    <li><b>Navigate:</b> React Router component to redirect declaratively.</li>
                    <li><b>useNavigate:</b> Hook to navigate imperatively in event handlers/effects.</li>
                    <li><b>replace:</b> Navigation option to overwrite current history entry.</li>
                    <li><b>state:</b> Arbitrary data carried along with navigation, read via <Styled.InlineCode>useLocation()</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use a catch-all route for unknown paths, decide between a friendly 404 page,
                a delayed redirect, or an immediate redirect for legacy URLs. Prefer <i>replace</i> for cleanup,
                keep nested 404s local, and configure your host to support SPA deep links.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default NotFoundRedirect;
