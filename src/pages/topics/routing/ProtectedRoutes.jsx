import React from "react";
import { Styled } from "./styled";

const ProtectedRoutes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Protected Routes</Styled.Title>

            <Styled.Lead>
                A <b>Protected Route</b> is a route users can access <i>only after</i> meeting a condition
                (usually being <b>authenticated</b>, sometimes with specific <b>roles/permissions</b>).
                In React Router, protection is implemented with a tiny <b>guard component</b> that decides
                whether to render the route content or <b>redirect</b> to another page (e.g., <i>Login</i>).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms</Styled.H2>
                <Styled.List>
                    <li><b>Authentication (AuthN):</b> verifying <em>who</em> a user is (login).</li>
                    <li><b>Authorization (AuthZ):</b> verifying <em>what</em> a user can do (roles/permissions).</li>
                    <li><b>Protected Route:</b> a route hidden behind a check (auth/role/feature flag).</li>
                    <li><b>Guard component:</b> a wrapper that runs the check and either renders children or redirects.</li>
                    <li><b>Redirect:</b> sending the user to another route (e.g., from <code>/dashboard</code> to <code>/login</code>).</li>
                    <li><b><code>&lt;Outlet /&gt;</code>:</b> placeholder that renders the matched child route inside a layout/guard.</li>
                    <li><b><code>useLocation()</code>:</b> hook to read the current route (useful to remember “where user was”).</li>
                    <li><b><code>&lt;Navigate /&gt;</code>:</b> element that performs the redirect in React Router.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal auth context shape */}
            <Styled.Section>
                <Styled.H2>Auth State (minimal example)</Styled.H2>
                <Styled.Pre>
                    {`// src/context/AuthContext.js (example shape)
import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role } or null
  const isAuthenticated = !!user;

  const login = (fakeUser) => setUser(fakeUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);`}
                </Styled.Pre>
                <Styled.Small>Any source of truth works (cookies, localStorage, server session). The guard only needs a reliable <code>isAuthenticated</code>.</Styled.Small>
            </Styled.Section>

            {/* 3) The guard: RequireAuth */}
            <Styled.Section>
                <Styled.H2>Guard Component: <code>RequireAuth</code></Styled.H2>
                <Styled.Pre>
                    {`// src/routes/guards/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and remember where we came from
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // read this in Login to go back after success
      />
    );
  }
  return <Outlet />; // Render the protected child route(s)
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why <code>replace</code>?</b> It prevents stacking “/login” in history if guards run multiple times.
                    <b>Why <code>state.from</code>?</b> So you can send users back to the page they originally wanted.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Router wiring (nested under guard) */}
            <Styled.Section>
                <Styled.H2>Router Wiring (Nested Protected Routes)</Styled.H2>
                <Styled.Pre>
                    {`// src/AppRoutes.jsx (illustrative)
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./routes/guards/RequireAuth";
import Dashboard from "./pages/app/Dashboard";
import Settings from "./pages/app/Settings";
import Login from "./pages/auth/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      {/* All routes below require auth */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Place <code>&lt;RequireAuth /&gt;</code> above routes you want to protect; children render via <code>&lt;Outlet /&gt;</code>.</Styled.Small>
            </Styled.Section>

            {/* 5) Redirect back after login */}
            <Styled.Section>
                <Styled.H2>Redirect Back After Login</Styled.H2>
                <Styled.Pre>
                    {`// src/pages/auth/Login.jsx (snippet)
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    // ...validate, call API, receive user...
    login({ id: "1", name: "Ashish", role: "user" });
    navigate(from, { replace: true }); // go back to intent
  }

  return <form onSubmit={handleSubmit}>/* fields */</form>;
}`}
                </Styled.Pre>
                <Styled.Small>Read <code>state.from</code> set by the guard and send the user back post-login.</Styled.Small>
            </Styled.Section>

            {/* 6) Role-based protection */}
            <Styled.Section>
                <Styled.H2>Role-Based Guards (<code>RequireRole</code>)</Styled.H2>
                <Styled.List>
                    <li><b>Role:</b> a label on the user (e.g., <code>"admin"</code>, <code>"manager"</code>, <code>"user"</code>) that controls access.</li>
                    <li><b>RBAC:</b> Role-Based Access Control—authorize by checking roles/permissions.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/routes/guards/RequireRole.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireRole({ allow = [] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const ok = allow.includes(user?.role);
  return ok ? <Outlet /> : <Navigate to="/403" replace />;
}

// Router usage:
// <Route element={<RequireRole allow={["admin"]} />}>
//   <Route path="/admin" element={<AdminPanel />} />
// </Route>`}
                </Styled.Pre>
                <Styled.Small>For more granular control, check explicit permission flags instead of a single <code>role</code> string.</Styled.Small>
            </Styled.Section>

            {/* 7) Guest-only routes */}
            <Styled.Section>
                <Styled.H2>Guest-Only Routes (<code>RequireGuest</code>)</Styled.H2>
                <Styled.List>
                    <li><b>Guest route:</b> a route accessible only when <em>not</em> authenticated (e.g., Login/Register).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/routes/guards/RequireGuest.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireGuest() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

// Usage:
// <Route element={<RequireGuest />}>
//   <Route path="/login" element={<Login />} />
//   <Route path="/register" element={<Register />} />
// </Route>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Persisted sessions & loading state */}
            <Styled.Section>
                <Styled.H2>Persisted Sessions & “Checking…” State</Styled.H2>
                <Styled.List>
                    <li>On refresh, you may need to <b>restore</b> the session (e.g., verify a token) before deciding access.</li>
                    <li>Wrap protected routes in a <b>PersistLogin</b> component that shows a spinner while checking.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/routes/guards/PersistLogin.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PersistLogin() {
  const { isAuthenticated } = useAuth();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    // e.g., call /refresh or read cookie/localStorage
    (async () => {
      // await restoreSession();
      setChecking(false);
    })();
  }, []);

  if (checking) return <div>Checking session…</div>;
  return <Outlet />;
}

// Router nesting:
// <Route element={<PersistLogin />}>
//   <Route element={<RequireAuth />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//   </Route>
// </Route>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep guards tiny and pure—just read auth state and return <code>&lt;Outlet /&gt;</code> or <code>&lt;Navigate /&gt;</code>.</li>
                    <li><b>Do</b> use <code>replace</code> on redirects to avoid history spam.</li>
                    <li><b>Do</b> preserve intent with <code>state.from</code> and redirect back after login.</li>
                    <li><b>Don’t</b> mutate the DOM or use <code>window.location</code> for navigation—use React Router APIs.</li>
                    <li><b>Don’t</b> fetch on every render inside guards. If needed, show a lightweight “checking session…” state.</li>
                    <li><b>Don’t</b> mix role checks and heavy data fetching inside the guard; keep responsibilities separate.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Build a small <b>RequireAuth</b> guard, nest protected routes under it, remember the
                user’s intent with <code>state.from</code>, and use additional guards (<b>RequireRole</b>, <b>RequireGuest</b>, <b>PersistLogin</b>)
                for a complete, predictable routing experience.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ProtectedRoutes;
