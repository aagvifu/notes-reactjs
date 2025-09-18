import { Styled } from "./styled";

const Hydration = () => {
    return (
        <Styled.Page>
            <Styled.Title>Hydration</Styled.Title>

            <Styled.Lead>
                <b>Hydration</b> is the process where React attaches event handlers and
                reactivates a server-rendered HTML tree on the client, turning static
                markup into an interactive app—without re-rendering everything from
                scratch.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Server-rendered HTML:</b> HTML produced on the server (via SSR or
                        SSG/ISR) and sent to the browser so users see content fast.
                    </li>
                    <li>
                        <b>Hydration:</b> React walks the existing DOM, matches it to your
                        component tree, wires up events, and "takes over" UI updates on the
                        client.
                    </li>
                    <li>
                        <b>Goal:</b> Faster <em>first paint</em> (HTML arrives ready) +
                        React interactivity once JS loads.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Glossary (clear terms)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SSR (Server-Side Rendering):</b> HTML is rendered per request on
                        the server, then hydrated on the client.
                    </li>
                    <li>
                        <b>SSG (Static Site Generation):</b> HTML is prebuilt at build time,
                        served as static files, then hydrated.
                    </li>
                    <li>
                        <b>ISR (Incremental Static Regeneration):</b> static pages that can
                        be refreshed on the server in the background and then hydrated.
                    </li>
                    <li>
                        <b>Hydration mismatch:</b> when server HTML doesn't match what React
                        expects on the client, causing warnings or re-rendering.
                    </li>
                    <li>
                        <b>Selective hydration:</b> React 18 can prioritize hydrating parts
                        of the tree that the user interacts with first.
                    </li>
                    <li>
                        <b>Streaming SSR:</b> server sends HTML in chunks with{" "}
                        <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> fallbacks so
                        the browser can start painting early; hydration continues as code
                        loads.
                    </li>
                    <li>
                        <b>RSC (React Server Components):</b> components that render on the
                        server and never run on the client. They reduce JS sent to the
                        browser. <i>Only Client Components hydrate</i>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) How hydration works (high level) */}
            <Styled.Section>
                <Styled.H2>How Hydration Works (High Level)</Styled.H2>
                <Styled.Pre>
                    {`// 1) Server renders HTML (SSR/SSG) and sends it to the browser.
// 2) Browser paints HTML quickly (no JS needed for this step).
// 3) Client JS loads; React matches existing DOM to the component tree.
// 4) React attaches event listeners and prepares for state updates.
// 5) UI becomes interactive without re-creating DOM nodes from scratch.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Entry points: hydrateRoot vs createRoot */}
            <Styled.Section>
                <Styled.H2>hydrateRoot vs createRoot</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>hydrateRoot</Styled.InlineCode> when the DOM
                        already contains server-rendered HTML to be hydrated.
                    </li>
                    <li>
                        Use <Styled.InlineCode>createRoot</Styled.InlineCode> for pure
                        client-only apps (no server HTML to re-use).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// client.js (entry for an SSR/SSG app)
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(
  document.getElementById("root"),
  <App />,
  {
    onRecoverableError(err) {
      // optional: log hydration recoveries for diagnostics
      console.warn("Recoverable hydration error:", err);
    },
  }
);`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Recoverable errors</b> are cases where React can fix a small
                    mismatch without crashing (e.g., whitespace). Log them during QA.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Avoiding hydration mismatches */}
            <Styled.Section>
                <Styled.H2>Avoiding Hydration Mismatches</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Render the same output</b> on server and client for the initial
                        pass. Avoid using{" "}
                        <Styled.InlineCode>Date.now()</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Math.random()</Styled.InlineCode>, or browser-only
                        APIs during render.
                    </li>
                    <li>
                        <b>Pass initial data</b> from server to client and reuse it. Don't
                        refetch immediately in a way that changes initial content.
                    </li>
                    <li>
                        <b>Gate client-only logic</b> behind effects (
                        <Styled.InlineCode>useEffect</Styled.InlineCode>) or environment
                        checks (e.g., <Styled.InlineCode>typeof window</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: serializing initial data into HTML and reusing it on the client
// server.html template (simplified)
<script id="__DATA__" type="application/json">
  {"user":{"name":"Ashish"}}
</script>

// client.js
const raw = document.getElementById("__DATA__")?.textContent || "{}";
const initialData = JSON.parse(raw);

hydrateRoot(document.getElementById("root"), <App initialData={initialData} />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls &amp; How to Fix</Styled.H2>
                <Styled.List>
                    <li>
                        <b>"Text content does not match server-rendered HTML":</b> ensure
                        deterministic content on both sides; move non-deterministic bits to{" "}
                        <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Using browser-only APIs during render:</b> do them in an effect,
                        not during server/client render.
                    </li>
                    <li>
                        <b>useLayoutEffect on the server:</b> it's a no-op on the server and
                        may warn. If you truly need layout work, create a small
                        <Styled.InlineCode>useIsomorphicLayoutEffect</Styled.InlineCode>{" "}
                        that falls back to <Styled.InlineCode>useEffect</Styled.InlineCode>{" "}
                        on the server.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// A common pattern to avoid SSR warnings
import React from "react";
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Streaming SSR & Suspense (quick view) */}
            <Styled.Section>
                <Styled.H2>Streaming SSR &amp; Suspense (Quick View)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Streaming:</b> server sends HTML in chunks so the browser can
                        start painting sooner; JS continues loading; React hydrates parts as
                        they arrive ("selective hydration").
                    </li>
                    <li>
                        <b>Suspense boundary:</b> a wrapper that shows a{" "}
                        <Styled.InlineCode>fallback</Styled.InlineCode> until children are
                        ready; helps both streaming SSR and client transitions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// In App.jsx (rendered on server and hydrated on client)
import React, { Suspense } from "react";
const ProductList = React.lazy(() => import("./ProductList"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading products…</div>}>
      <ProductList />
    </Suspense>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    With streaming SSR, the server flushes the fallback immediately; the
                    list hydrates when its chunk loads.
                </Styled.Small>
            </Styled.Section>

            {/* 8) RSC relation (what hydrates) */}
            <Styled.Section>
                <Styled.H2>RSC Relation: What Actually Hydrates?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Server Components</b> render on the server and ship zero client
                        JS; they do <i>not</i> hydrate.
                    </li>
                    <li>
                        <b>Client Components</b> (those using state/effects or the{" "}
                        <Styled.InlineCode>"use client"</Styled.InlineCode> directive) do
                        hydrate.
                    </li>
                    <li>
                        Mixing them lets you keep heavy logic/server data fetching on the
                        server and hydrate only what's interactive.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> ensure server and client render the same initial output.
                    </li>
                    <li>
                        <b>Do</b> serialize initial data and reuse it to avoid flashes and
                        mismatches.
                    </li>
                    <li>
                        <b>Do</b> push browser-only work into{" "}
                        <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Don't</b> rely on random values or current time during render.
                    </li>
                    <li>
                        <b>Don't</b> manipulate the DOM directly before hydration completes.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Hydration reuses server HTML and wires up interactivity.
                Keep initial renders deterministic, pass initial data, use effects for
                client-only behavior, and leverage Suspense/streaming for faster first
                paint with progressive interactivity.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Hydration;
