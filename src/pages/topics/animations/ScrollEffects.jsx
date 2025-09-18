import { Styled } from "./styled";

const ScrollEffects = () => {
    return (
        <Styled.Page>
            <Styled.Title>Scroll Effects</Styled.Title>

            <Styled.Lead>
                <b>Scroll effects</b> are visual changes that depend on how far the user has scrolled
                (e.g., fade-in sections, parallax, sticky headers). Use them to guide attention without
                harming performance or accessibility.
            </Styled.Lead>

            {/* 1) Key Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Viewport:</b> the visible area of the page in the browser window.
                    </li>
                    <li>
                        <b>Scroll position (scrollY):</b> the number of pixels the document has been scrolled vertically.
                    </li>
                    <li>
                        <b>Threshold:</b> a scroll point (or ratio) at which an effect should start/stop.
                    </li>
                    <li>
                        <b>Parallax:</b> a depth illusion where background layers move slower than foreground content.
                    </li>
                    <li>
                        <b>IntersectionObserver (IO):</b> a browser API that tells you when an element enters/leaves the viewport.
                    </li>
                    <li>
                        <b>requestAnimationFrame (rAF):</b> schedules code to run right before the next browser paint for smooth animation.
                    </li>
                    <li>
                        <b>Passive listener:</b> a scroll/touch listener that never calls <Styled.InlineCode>preventDefault()</Styled.InlineCode>,
                        allowing the browser to keep scrolling fluid (<Styled.InlineCode>{`{ passive: true }`}</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Transform/Opacity properties:</b> GPU-friendly CSS properties (<Styled.InlineCode>transform</Styled.InlineCode>, <Styled.InlineCode>opacity</Styled.InlineCode>) that animate without forcing layout.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use scroll effects */}
            <Styled.Section>
                <Styled.H2>When to Use Scroll Effects</Styled.H2>
                <Styled.List>
                    <li>Progressive reveal: bring sections in as the user reaches them.</li>
                    <li>Context feedback: shrink or blur a header after scrolling past a hero section.</li>
                    <li>Storytelling: parallax or pinned panels for long-form articles.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) CSS-only building blocks */}
            <Styled.Section>
                <Styled.H2>CSS-Only Building Blocks</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Sticky header:</b> <Styled.InlineCode>position: sticky; top: 0;</Styled.InlineCode> keeps an element pinned within its container.
                    </li>
                    <li>
                        <b>Scroll snapping:</b> <Styled.InlineCode>scroll-snap-type</Styled.InlineCode> and <Styled.InlineCode>scroll-snap-align</Styled.InlineCode> align sections on scroll.
                    </li>
                    <li>
                        <b>Reduced motion:</b> honor <Styled.InlineCode>@media (prefers-reduced-motion: reduce)</Styled.InlineCode> to minimize motion for sensitive users.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Sticky header */
.header { position: sticky; top: 0; backdrop-filter: blur(6px); }

/* Scroll snapping sections */
.container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
.section { height: 100vh; scroll-snap-align: start; }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-in { transition: none; animation: none; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Reveal-on-scroll with IntersectionObserver */}
            <Styled.Section>
                <Styled.H2>Reveal on Scroll with IntersectionObserver</Styled.H2>
                <Styled.List>
                    <li><b>What:</b> IO notifies when an element enters the viewport, ideal for “fade-in as you see it.”</li>
                    <li><b>Why:</b> avoids running code every pixel of scroll; very efficient.</li>
                    <li><b>How:</b> toggle a class when visibility crosses a threshold (e.g., 0.2 = 20% visible).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// React example: toggle "in-view" class when a card enters the viewport
function Card({ children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("in-view");
        else el.classList.remove("in-view");
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className="card animate-in">{children}</div>;
}

/* CSS: start hidden, fade & rise when .in-view is added */
.card.animate-in { transform: translateY(16px); opacity: 0; transition: transform .5s, opacity .5s; }
.card.animate-in.in-view { transform: translateY(0); opacity: 1; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Scroll-linked transforms with rAF */}
            <Styled.Section>
                <Styled.H2>Scroll-Linked Transforms with <code>requestAnimationFrame</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Pattern:</b> read <Styled.InlineCode>window.scrollY</Styled.InlineCode> (or section offset) and map it to a transform/opacity.
                    </li>
                    <li>
                        <b>Performance:</b> update using rAF; animate only <Styled.InlineCode>transform</Styled.InlineCode> or <Styled.InlineCode>opacity</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Passive scroll listener:</b> <Styled.InlineCode>{`window.addEventListener('scroll', onScroll, { passive: true })`}</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ParallaxHero() {
  const ref = React.useRef(null);
  const tickingRef = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const offset = y * 0.3; // slower than scroll = parallax
        el.style.transform = \`translateY(\${-offset}px)\`;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={ref} className="hero-layer">Parallax Layer</div>;
}

/* Hint: for smoother transforms you can hint the GPU */
.hero-layer { will-change: transform; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Using Framer Motion (optional) */}
            <Styled.Section>
                <Styled.H2>Using Framer Motion (Optional)</Styled.H2>
                <Styled.List>
                    <li><b>What:</b> a React animation library with hooks for scroll progress and easy springs.</li>
                    <li><b>Hook:</b> <Styled.InlineCode>useScroll()</Styled.InlineCode> returns <Styled.InlineCode>scrollYProgress</Styled.InlineCode> (0-1 based on a target).</li>
                    <li><b>Map:</b> <Styled.InlineCode>useTransform()</Styled.InlineCode> maps progress to style values.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// import { motion, useScroll, useTransform } from "framer-motion";
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div style={{ position: "fixed", top: 0, left: 0, height: 4, width, background: "#09f" }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    You can keep the library as a future enhancement; the core ideas work with vanilla IO and rAF, too.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Accessibility & UX */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; UX</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Reduced motion:</b> if <Styled.InlineCode>prefers-reduced-motion: reduce</Styled.InlineCode> is set, minimize or disable animations.
                    </li>
                    <li>
                        <b>Focus order:</b> ensure scroll effects don't trap focus or hide focused elements.
                    </li>
                    <li>
                        <b>Meaning:</b> effects should support content understanding, not distract.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Performance Tips */}
            <Styled.Section>
                <Styled.H2>Performance Tips</Styled.H2>
                <Styled.List>
                    <li>Animate <b>transform</b> and <b>opacity</b>; avoid layout-triggering properties (top/left/width/height).</li>
                    <li>Use <b>IntersectionObserver</b> for reveals; avoid heavy work on each scroll event.</li>
                    <li>Batch DOM writes inside <b>requestAnimationFrame</b>.</li>
                    <li>Add <Styled.InlineCode>will-change: transform</Styled.InlineCode> only to elements that truly animate.</li>
                    <li>Unobserve / remove listeners when components unmount.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start with CSS where possible (sticky, snap) before adding JS.</li>
                    <li><b>Do</b> gate animations behind IO thresholds for efficiency.</li>
                    <li><b>Don't</b> run expensive calculations on every scroll tick.</li>
                    <li><b>Don't</b> animate layout properties—use transforms instead.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Reflow/Layout:</b> browser recalculates element positions/sizes. Costly; avoid forcing it in scroll handlers.</li>
                    <li><b>Paint:</b> browser fills pixels after layout. Animating transforms often skips expensive layout.</li>
                    <li><b>Jank:</b> stutter caused by frames missing the 16.7ms budget (at 60fps).</li>
                    <li><b>Pinning:</b> keeping a section fixed (via sticky/positioning) while other content scrolls.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick the simplest tool that fits—CSS for structure (sticky/snap), IO for reveals,
                rAF for continuous transforms, and a library only if it adds real value. Animate transforms
                and opacity, respect reduced motion, and keep the main thread free of heavy work.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ScrollEffects;
