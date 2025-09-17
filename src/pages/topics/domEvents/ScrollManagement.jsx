import React from "react";
import { Styled } from "./styled";

const ScrollManagement = () => {
    return (
        <Styled.Page>
            <Styled.Title>Scroll Management</Styled.Title>

            <Styled.Lead>
                <b>Scroll management</b> is the practice of reading, controlling, and restoring scroll
                positions in a way that’s smooth, accessible, and predictable. It involves knowing the
                difference between the <b>document</b> scroll and an <b>element</b> scroll container,
                handling route changes, locking background scroll for modals, and optimizing listeners.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology &amp; Anatomy</Styled.H2>
                <Styled.List>
                    <li><b>Scroll container:</b> An element (or the document) whose content overflows and can be scrolled.</li>
                    <li><b>Scrollport / viewport:</b> The visible area of a scroll container.</li>
                    <li><b>Document scrolling element:</b> Usually <Styled.InlineCode>document.documentElement</Styled.InlineCode> (HTML); <Styled.InlineCode>window.scrollY</Styled.InlineCode> reads the same vertical offset.</li>
                    <li><b>Key metrics:</b> <Styled.InlineCode>scrollTop</Styled.InlineCode>, <Styled.InlineCode>scrollLeft</Styled.InlineCode>, <Styled.InlineCode>scrollHeight</Styled.InlineCode>, <Styled.InlineCode>clientHeight</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Window/document vs element scroll
const winY = window.scrollY; // or document.documentElement.scrollTop
const elY  = el.scrollTop;   // for a specific scrollable element`}
                </Styled.Pre>
            </Styled.Section>

            {/* 2) Reading positions */}
            <Styled.Section>
                <Styled.H2>Reading Scroll Positions</Styled.H2>
                <Styled.List>
                    <li><b>Window:</b> use <Styled.InlineCode>window.scrollY</Styled.InlineCode> / <Styled.InlineCode>scrollX</Styled.InlineCode>.</li>
                    <li><b>Element:</b> use <Styled.InlineCode>el.scrollTop</Styled.InlineCode> / <Styled.InlineCode>scrollLeft</Styled.InlineCode> and size metrics.</li>
                    <li><b>At bottom check:</b> <Styled.InlineCode>el.scrollTop + el.clientHeight &gt;= el.scrollHeight - tolerance</Styled.InlineCode>.</li>
                    <li><b>Progress:</b> compute percentage scrolled for reading-progress bars.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function getScrollProgress() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const max = scrollHeight - clientHeight;
  return max > 0 ? Math.min(1, scrollTop / max) : 0;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Programmatic scrolling */}
            <Styled.Section>
                <Styled.H2>Programmatic Scrolling</Styled.H2>
                <Styled.List>
                    <li><b>Smooth scroll (window):</b> <Styled.InlineCode>window.scrollTo({`{ top, left, behavior: "smooth" }`})</Styled.InlineCode>.</li>
                    <li><b>Element scroll:</b> <Styled.InlineCode>el.scrollTo()</Styled.InlineCode>, <Styled.InlineCode>el.scrollBy()</Styled.InlineCode>.</li>
                    <li><b>Into view:</b> <Styled.InlineCode>el.scrollIntoView({`{ block: "start", inline: "nearest", behavior: "smooth" }`})</Styled.InlineCode>.</li>
                    <li><b>Hash/anchors:</b> give targets an <Styled.InlineCode>id</Styled.InlineCode> and scroll to them on route change.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Scroll a container
function scrollContainerTo(el, y) {
  el?.scrollTo({ top: y, behavior: "smooth" });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Efficient listeners */}
            <Styled.Section>
                <Styled.H2>Efficient Scroll Listeners</Styled.H2>
                <Styled.List>
                    <li><b>Avoid heavy work on every event:</b> throttle via <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode> or a light throttle.</li>
                    <li><b>Passive listeners:</b> for native <Styled.InlineCode>addEventListener("scroll", ...)</Styled.InlineCode> on window/element, use <Styled.InlineCode>{`{ passive: true }`}</Styled.InlineCode> when you won’t call <Styled.InlineCode>preventDefault()</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// rAF-based scroll handler (window)
React.useEffect(() => {
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        // read scrollY and update state just once per frame
        // setProgress(getScrollProgress());
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Infinite scroll via IO */}
            <Styled.Section>
                <Styled.H2>Infinite Scroll with IntersectionObserver</Styled.H2>
                <Styled.List>
                    <li>Place a <b>sentinel</b> div at the end of the list; when it becomes visible, load more.</li>
                    <li>IO runs off the main thread and is more efficient than manual <i>at-bottom</i> checks.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function useInfiniteScroll(ref, onReachEnd) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) onReachEnd();
    }, { root: null, rootMargin: "0px", threshold: 0.1 });

    io.observe(el);
    return () => io.disconnect();
  }, [ref, onReachEnd]);
}

// Usage:
// const endRef = React.useRef(null);
// useInfiniteScroll(endRef, () => fetchMore());`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Locking background scroll */}
            <Styled.Section>
                <Styled.H2>Locking Background Scroll (Modals/Drawers)</Styled.H2>
                <Styled.List>
                    <li>When a modal opens, prevent page scroll and <b>preserve layout</b> (avoid content shift due to scrollbar removal).</li>
                    <li>Save the current scroll position; restore it when unlocking.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function lockBodyScroll() {
  const { body, documentElement: html } = document;
  const scrollBarWidth = window.innerWidth - html.clientWidth;
  const top = -window.scrollY;
  body.style.position = "fixed";
  body.style.top = \`\${top}px\`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.overflow = "hidden";
  if (scrollBarWidth > 0) body.style.paddingRight = \`\${scrollBarWidth}px\`;
  return () => {
    const y = Math.abs(parseInt(body.style.top || "0", 10));
    body.removeAttribute("style");
    window.scrollTo({ top: y, behavior: "auto" });
  };
}`}
                </Styled.Pre>
                <Styled.Small>Alternative: apply <Styled.InlineCode>overflow: hidden</Styled.InlineCode> to <i>html</i> and <i>body</i>, adding right padding equal to scrollbar width.</Styled.Small>
            </Styled.Section>

            {/* 7) Restoring scroll on route change */}
            <Styled.Section>
                <Styled.H2>Restoring Scroll on Route Change</Styled.H2>
                <Styled.List>
                    <li>On <b>forward nav</b>, <i>scroll to top</i> (content-first reading).</li>
                    <li>On <b>back/forward</b> (history navigation), <i>restore the previous position</i>.</li>
                    <li>Store positions per pathname (and optional hash) in a map.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo-hook for scroll restoration (React Router v6)
import { useLocation, useNavigationType } from "react-router-dom";

function useScrollRestoration() {
  const positions = React.useRef(new Map());
  const { pathname, hash } = useLocation();
  const navType = useNavigationType(); // POP = back/forward

  // Save position before unmount
  React.useEffect(() => {
    return () => {
      positions.current.set(pathname + hash, window.scrollY);
    };
  }, [pathname, hash]);

  // Restore or reset after nav
  React.useEffect(() => {
    const key = pathname + hash;
    const y = navType === "POP" ? positions.current.get(key) ?? 0 : 0;

    if (hash) {
      // If there's a hash, try to scroll to the target id
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    window.scrollTo({ top: y, behavior: "auto" });
  }, [pathname, hash, navType]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) CSS helpers */}
            <Styled.Section>
                <Styled.H2>CSS Helpers: Sticky, Snap, Overscroll</Styled.H2>
                <Styled.List>
                    <li><b>Sticky headers:</b> <Styled.InlineCode>position: sticky; top: 0;</Styled.InlineCode> keeps bars visible while scrolling.</li>
                    <li><b>Scroll snap:</b> create carousels/timelines with <Styled.InlineCode>scroll-snap-type</Styled.InlineCode> + <Styled.InlineCode>scroll-snap-align</Styled.InlineCode>.</li>
                    <li><b>Overscroll:</b> control boundary effects with <Styled.InlineCode>overscroll-behavior</Styled.InlineCode> (e.g., prevent scroll chaining).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Sticky header */
.header { position: sticky; top: 0; }

/* Horizontal snap carousel */
.scroller { overflow-x: auto; scroll-snap-type: x mandatory; }
.slide   { scroll-snap-align: start; }

/* Prevent parent scroll chaining (useful for modals/sheets) */
.modal { overscroll-behavior: contain; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; UX</Styled.H2>
                <Styled.List>
                    <li><b>Prefer focus-first:</b> when navigating to a new page/section, move focus to the main heading and then(optional) scroll.</li>
                    <li><b>Skip links:</b> provide <Styled.InlineCode>&lt;a href="#main"&gt;Skip to content&lt;/a&gt;</Styled.InlineCode> and ensure <Styled.InlineCode>#main</Styled.InlineCode> exists.</li>
                    <li><b>Respect reduced motion:</b> turn off smooth animations for users with <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode>.</li>
                    <li><b>Announce dynamic loads:</b> when infinite-loading, provide live region updates (e.g., “Loaded 20 more items”).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Turn off smooth scroll for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> throttle or rAF-wrap scroll handlers.</li>
                    <li><b>Do</b> use IntersectionObserver for infinite lists when possible.</li>
                    <li><b>Do</b> restore scroll on history navigation and jump to anchors on hash.</li>
                    <li><b>Don’t</b> attach many per-item listeners—delegate when feasible.</li>
                    <li><b>Don’t</b> block scroll without restoring the original position on unlock.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Treat scrolling as state—read it efficiently, change it deliberately, restore it
                on navigation, and keep it accessible. Prefer sticky/snap/overscroll CSS where possible and
                IO for performant infinite loading.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ScrollManagement;
