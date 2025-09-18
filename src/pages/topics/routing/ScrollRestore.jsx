import React from "react";
import { Styled } from "./styled";

const ScrollRestore = () => {
    return (
        <Styled.Page>
            <Styled.Title>Scroll Restore</Styled.Title>

            <Styled.Lead>
                <b>Scroll restoration</b> means putting the page (or a scrollable container) back to the
                expected scroll position after navigation. Users expect <i>new pages to start at the top</i>,
                and when they hit <b>Back/Forward</b> they expect to <i>return to where they left</i>.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Scroll position:</b> the current X/Y offset of a scrollable area (e.g., window or a div).</li>
                    <li><b>Scroll restoration:</b> restoring that offset after navigation so content is where the user expects.</li>
                    <li><b>Why it matters:</b> without restoration, users lose context—lists jump to top, long docs reset, etc.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key Terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (clearly defined)</Styled.H2>
                <Styled.List>
                    <li><b>Viewport:</b> the visible area of the page inside the browser window.</li>
                    <li><b>PUSH / REPLACE / POP:</b> navigation types. <i>PUSH</i> adds a new entry, <i>REPLACE</i> updates the current entry, <i>POP</i> is Back/Forward.</li>
                    <li><b>Hash / Anchor:</b> the <Styled.InlineCode>#id</Styled.InlineCode> part of a URL that targets an element by its <Styled.InlineCode>id</Styled.InlineCode>.</li>
                    <li><b>Layout shift:</b> content movement after render (e.g., images loading), which can offset scroll positions.</li>
                    <li><b>Scrollable container:</b> any element with overflow that scrolls (not just <Styled.InlineCode>window</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Quick Win */}
            <Styled.Section>
                <Styled.H2>Quick Win: Scroll to Top on Route Change</Styled.H2>
                <Styled.List>
                    <li>Use this when you want every <i>new</i> route to start at the top.</li>
                    <li>It should <b>not</b> run on Back/Forward if you plan to restore position (see next section).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ScrollToTop.jsx — keep it simple and SSR-safe
import React from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"

  React.useEffect(() => {
    // Only force-top on PUSH/REPLACE (new navigations), not on POP (back/forward)
    if (navType === "PUSH" || navType === "REPLACE") {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }
  }, [pathname, navType]);

  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Mount <Styled.InlineCode>&lt;ScrollToTop /&gt;</Styled.InlineCode> once inside your router layout.
                </Styled.Small>
            </Styled.Section>

            {/* 4) True Restoration on Back/Forward */}
            <Styled.Section>
                <Styled.H2>Restore on Back/Forward (remember positions)</Styled.H2>
                <Styled.List>
                    <li>Save the scroll position per <b>location.key</b> before leaving a page.</li>
                    <li>On <b>POP</b> (Back/Forward), restore that saved position.</li>
                    <li>On <b>PUSH/REPLACE</b>, usually start at the top (fresh page).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// ScrollRestorer.jsx — window-level restoration
import React from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Map of location.key -> { x, y }
const positions = new Map();

export default function ScrollRestorer() {
  const location = useLocation();
  const navType = useNavigationType();

  // Save current position before route changes (on unmount)
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        positions.set(location.key, { x: window.scrollX, y: window.scrollY });
      }
    };
  }, [location]);

  // Restore after navigation
  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if (navType === "POP") {
      // Back/Forward — try to restore
      const pos = positions.get(location.key);
      if (pos) {
        window.scrollTo({ left: pos.x, top: pos.y, behavior: "auto" });
        return;
      }
    }
    // New page — start at top
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location, navType]);

  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> to restore before paint, reducing flicker.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Restoring inside a Scrollable Container */}
            <Styled.Section>
                <Styled.H2>Restore a Scrollable Container (not the window)</Styled.H2>
                <Styled.List>
                    <li>Some layouts scroll a <Styled.InlineCode>&lt;div&gt;</Styled.InlineCode> instead of the window.</li>
                    <li>Store and restore <Styled.InlineCode>el.scrollTop</Styled.InlineCode>/<Styled.InlineCode>el.scrollLeft</Styled.InlineCode> for that element.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// useScrollMemory.js — per-element restoration hook
import React from "react";

export function useScrollMemory(ref, key) {
  const store = React.useRef(new Map()); // key -> { left, top }

  // Save on unmount
  React.useEffect(() => {
    return () => {
      const el = ref.current;
      if (el) {
        store.current.set(key, { left: el.scrollLeft, top: el.scrollTop });
      }
    };
  }, [key, ref]);

  // Restore on mount
  React.useLayoutEffect(() => {
    const el = ref.current;
    const pos = store.current.get(key);
    if (el && pos) {
      el.scrollTo({ left: pos.left, top: pos.top, behavior: "auto" });
    }
  }, [key, ref]);
}`}
                </Styled.Pre>
                <Styled.Small>
                    Call <Styled.InlineCode>useScrollMemory</Styled.InlineCode> in the component that owns the scroll container.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Hash / Anchor Navigation */}
            <Styled.Section>
                <Styled.H2>Hash / Anchor Scroll (e.g., <code>/guide#install</code>)</Styled.H2>
                <Styled.List>
                    <li>When the URL has a <b>hash</b>, scroll to the element with that <Styled.InlineCode>id</Styled.InlineCode>.</li>
                    <li>Use <Styled.InlineCode>useEffect</Styled.InlineCode> on <b>location.hash</b>. Handle missing targets gracefully.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// HashScroll.jsx — smooth scroll to anchors
import React from "react";
import { useLocation } from "react-router-dom";

export default function HashScroll() {
  const { hash } = useLocation();

  React.useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [hash]);

  return null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Browser API */}
            <Styled.Section>
                <Styled.H2>Browser API: <code>history.scrollRestoration</code></Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>window.history.scrollRestoration</Styled.InlineCode> is a hint to the browser:
                        <Styled.InlineCode>"auto"</Styled.InlineCode> (default) lets the browser try restoring on Back/Forward;
                        <Styled.InlineCode>"manual"</Styled.InlineCode> tells it you’ll handle it.
                    </li>
                    <li>In SPA routing, manual control is common for predictable behavior.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Usually set once at app start
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) React Router Data APIs */}
            <Styled.Section>
                <Styled.H2>React Router <code>&lt;ScrollRestoration /&gt;</code> (Data Router)</Styled.H2>
                <Styled.List>
                    <li>
                        If you use <b>Data Router</b> (e.g., <Styled.InlineCode>createBrowserRouter</Styled.InlineCode>),
                        React Router offers a built-in <Styled.InlineCode>&lt;ScrollRestoration /&gt;</Styled.InlineCode>.
                    </li>
                    <li>It saves positions on navigation and restores on Back/Forward automatically.</li>
                    <li>If your app uses classic <Styled.InlineCode>&lt;BrowserRouter&gt;</Styled.InlineCode>, use the custom patterns above.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example (Data Router only)
import { ScrollRestoration } from "react-router-dom";

function RootLayout() {
  return (
    <>
      {/* ...header / outlet... */}
      <ScrollRestoration />
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Patterns, Gotchas, Testing */}
            <Styled.Section>
                <Styled.H2>Patterns, Gotchas & Testing</Styled.H2>
                <Styled.List>
                    <li><b>Images causing layout shift:</b> reserve space with width/height or aspect-ratio to avoid jumpy restores.</li>
                    <li><b>Virtualized lists:</b> ensure the same item heights on re-render or the restored position will feel off.</li>
                    <li><b>Modal routes:</b> if overlaying content, avoid auto-scrolling the page beneath.</li>
                    <li><b>Testing:</b> simulate navigation types; assert <Styled.InlineCode>window.scrollY</Styled.InlineCode> or container <Styled.InlineCode>scrollTop</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> restore on Back/Forward; <b>Do</b> start at top on fresh navigations.</li>
                    <li><b>Do</b> prefer <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> for restoration to reduce flicker.</li>
                    <li><b>Don’t</b> fight the browser: set <Styled.InlineCode>history.scrollRestoration = "manual"</Styled.InlineCode> only if you manage it yourself.</li>
                    <li><b>Don’t</b> forget inner scroll containers—restore them too if your layout uses them.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>POP navigation:</b> user presses Back/Forward (history stack moves).</li>
                    <li><b>PUSH navigation:</b> app navigates to a new URL (history length increases).</li>
                    <li><b>REPLACE navigation:</b> app replaces the current URL (history length same).</li>
                    <li><b>Anchor link:</b> URL with <Styled.InlineCode>#section-id</Styled.InlineCode> that targets an element by id.</li>
                    <li><b>Flicker:</b> visible jump when scrolling happens after paint; minimized with <Styled.InlineCode>useLayoutEffect</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Start new pages at the top, restore positions on Back/Forward, handle hash anchors,
                and include inner scroll containers when needed. Choose manual patterns or the built-in
                <i> ScrollRestoration </i> (if you use Data Router).
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ScrollRestore;
