import React from "react";
import { Styled } from "./styled";

const SpaVsMpa = () => {
    return (
        <Styled.Page>
            <Styled.Title>SPA vs MPA</Styled.Title>
            <Styled.Lead>
                A quick, practical comparison between <b>SPAs</b> (Single-Page
                Applications) and <b>MPAs</b> (Multi-Page Applications).
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SPA:</b> The browser loads one HTML shell
                        (<Styled.InlineCode>index.html</Styled.InlineCode>); navigation is handled
                        on the client. Views switch without full page reloads.
                    </li>
                    <li>
                        <b>MPA:</b> Each page navigation requests a new HTML document from
                        the server. The browser performs a full reload, resetting in-memory UI state.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>How routing works</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SPA:</b> Client-side router (e.g., React Router) listens to URL
                        changes and renders components for matching routes.
                    </li>
                    <li>
                        <b>MPA:</b> Server maps each URL to a template/controller and returns HTML.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    <code>{`// SPA idea with React Router
import { Routes, Route, Link } from "react-router-dom";

<Link to="/profile">Profile</Link>
<Routes>
  <Route path="/profile" element={<Profile />} />
</Routes>`}</code>
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Key differences</Styled.H2>
                <Styled.List>
                    <li><b>Navigation:</b> SPA → instant view swaps; MPA → full reloads.</li>
                    <li><b>State:</b> SPA keeps in-memory state across views; MPA resets per page.</li>
                    <li><b>Initial load:</b> SPA often ships more JS upfront; MPA streams HTML quickly.</li>
                    <li><b>SEO:</b> SPA typically needs SSR/SSG for robust SEO; MPA is SEO-friendly by default.</li>
                    <li><b>Caching:</b> SPA leans on API/data caching; MPA benefits from HTTP/page caching.</li>
                    <li><b>Complexity:</b> SPA adds client routing/data fetching; MPA centralizes logic on the server.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>When to choose which</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SPA:</b> app-like experiences—dashboards, editors, chats, multi-step flows.
                    </li>
                    <li>
                        <b>MPA (or SSR/SSG frameworks):</b> content-heavy, SEO-first sites—docs, blogs, marketing.
                    </li>
                    <li>
                        Hybrid (SSR + SPA hydration) offers fast first paint with rich client interactivity.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: SPAs prioritize smooth in-app navigation and stateful UIs; MPAs
                prioritize simple server-rendered pages and default SEO. Pick per use case.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SpaVsMpa;
