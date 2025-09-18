import { Styled } from "./styled";

const AnimationPerformance = () => {
    return (
        <Styled.Page>
            <Styled.Title>Animation Performance</Styled.Title>

            <Styled.Lead>
                Goal: keep animations <b>smooth (≈60 FPS)</b>, <b>responsive</b>, and <b>efficient</b>. You have
                ~<b>16.67ms</b> to produce each frame (1 second / 60 frames). Exceed the budget and users see
                <i> jank</i> (stutter).
            </Styled.Lead>

            {/* 1) Core goals */}
            <Styled.Section>
                <Styled.H2>Core Goals</Styled.H2>
                <Styled.List>
                    <li><b>Smoothness (FPS):</b> Frames Per Second; 60 FPS is a common target on most displays.</li>
                    <li><b>Frame budget:</b> Time available to compute a frame (~16.67ms at 60Hz).</li>
                    <li><b>Responsiveness:</b> The UI reacts quickly to input; avoid long main-thread blocks.</li>
                    <li><b>Efficiency:</b> Minimize CPU/GPU work and memory; save battery on mobile.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) How a frame is built */}
            <Styled.Section>
                <Styled.H2>How Browsers Build a Frame</Styled.H2>
                <Styled.List>
                    <li><b>Style/Recalc:</b> Apply CSS rules to elements and compute final styles.</li>
                    <li><b>Layout (reflow):</b> Calculate element sizes/positions. Expensive for large trees.</li>
                    <li><b>Paint:</b> Rasterize pixels for layers (colors, borders, text, shadows).</li>
                    <li><b>Composite:</b> GPU combines layers into the final image (transforms/opacity can be done here).</li>
                </Styled.List>
                <Styled.Small>
                    Performance rule of thumb: <b>Prefer work that can be done in the compositor</b> (transform/opacity), avoid
                    repeated layout/paint per frame.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Cheap vs Expensive properties */}
            <Styled.Section>
                <Styled.H2>Cheap vs. Expensive Properties</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Cheap (compositor-friendly):</b> <Styled.InlineCode>transform</Styled.InlineCode> (translate/scale/rotate)
                        and <Styled.InlineCode>opacity</Styled.InlineCode>. These can animate on the GPU without layout/paint.
                    </li>
                    <li>
                        <b>Expensive:</b> <Styled.InlineCode>top/left/right/bottom</Styled.InlineCode>, <Styled.InlineCode>width/height</Styled.InlineCode>,
                        <Styled.InlineCode>margin</Styled.InlineCode>, large <Styled.InlineCode>box-shadow</Styled.InlineCode>, filters, complex text wrapping.
                        These trigger layout and/or paint each frame.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* BAD: moves via 'left' -> triggers layout each frame */
.mover { position: absolute; left: 0; transition: left 300ms; }
.mover--on { left: 240px; }

/* GOOD: moves via 'transform' -> no layout/paint (usually) */
.mover { transform: translateX(0); transition: transform 300ms; }
.mover--on { transform: translateX(240px); }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) CSS vs JS animations */}
            <Styled.Section>
                <Styled.H2>CSS vs JavaScript Animations</Styled.H2>
                <Styled.List>
                    <li>
                        <b>CSS Transitions/Animations:</b> Declarative; when animating transform/opacity, browsers can run them on
                        the compositor thread → very smooth with low scripting overhead.
                    </li>
                    <li>
                        <b>JavaScript (requestAnimationFrame):</b> Imperative; full control (physics, interrupts), but runs on the
                        main thread; you must keep per-frame work minimal.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* CSS transition: likely compositor-only */
.box { transform: translateY(0); transition: transform 250ms ease; }
.box--enter { transform: translateY(-12px); }

/* JS: requestAnimationFrame loop (keep work tiny) */
function animate(el) {
  let x = 0;
  function tick() {
    x += 2;              // update state
    el.style.transform = \`translateX(\${x}px)\`; // mutate with transform
    if (x < 200) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Layers, GPU & will-change */}
            <Styled.Section>
                <Styled.H2>Compositor Layers, GPU & <code>will-change</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Compositor layer:</b> A separate surface the GPU can move/merge without repainting.
                        Elements animating transform/opacity are often promoted to their own layer.
                    </li>
                    <li>
                        <b>GPU acceleration:</b> The graphics processor applies transforms/opacity faster than CPU-based repaint.
                    </li>
                    <li>
                        <b><Styled.InlineCode>will-change</Styled.InlineCode>:</b> A hint that an element will animate certain
                        properties; the browser may pre-promote to a layer. <b>Use sparingly</b> (layers consume memory).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Hint the browser, then remove when not needed */
.card:hover {
  will-change: transform; /* or opacity */
  transform: translateZ(0); /* optional nudge; don't overuse */
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Layout thrash & forced synchronous layout */}
            <Styled.Section>
                <Styled.H2>Layout Thrashing & Forced Synchronous Layout</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Layout thrashing:</b> Rapidly interleaving <i>reads</i> (measure) and <i>writes</i> (mutate) that force
                        the browser to recalc layout repeatedly within a frame.
                    </li>
                    <li>
                        <b>Forced synchronous layout:</b> Reading layout (e.g., <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode>)
                        immediately after writes forces the browser to flush pending changes → jank.
                    </li>
                    <li>
                        <b>Pattern:</b> <u>Measure, then mutate</u>. Batch reads together, then batch writes (e.g., inside one
                        <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// BAD: read after write repeatedly
el.style.width = "200px";
const r = el.getBoundingClientRect(); // forces layout NOW
el.style.height = r.width + "px";

// GOOD: separate read & write phases
const r = el.getBoundingClientRect();         // read
requestAnimationFrame(() => {                 // write later
  el.style.transform = \`translateX(\${r.width}px)\`;
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) FLIP technique */}
            <Styled.Section>
                <Styled.H2>The FLIP Technique</Styled.H2>
                <Styled.List>
                    <li><b>FLIP:</b> <i>First</i> (measure start), <i>Last</i> (measure end), <i>Invert</i> (apply inverse transform), <i>Play</i> (animate to identity).</li>
                    <li>Animates via <b>transform</b> instead of layout, avoiding reflow on every frame.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo: FLIP a tile moving to a new grid slot
const first = tile.getBoundingClientRect();   // First
// ... DOM changes that move the tile ...
const last = tile.getBoundingClientRect();    // Last
const dx = first.left - last.left;
const dy = first.top  - last.top;

tile.style.transform = \`translate(\${dx}px, \${dy}px)\`; // Invert
tile.style.transition = "transform 250ms";                // Play
requestAnimationFrame(() => { tile.style.transform = "translate(0,0)"; });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Scroll-linked effects */}
            <Styled.Section>
                <Styled.H2>Scroll-Linked Effects (Safely)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Scroll-linked animation:</b> Visuals tied to scroll position (parallax, sticky headers).
                        Keep handlers light; avoid per-pixel layout/paint.
                    </li>
                    <li>
                        Use <b>CSS</b> where possible (<Styled.InlineCode>position: sticky</Styled.InlineCode>,
                        <Styled.InlineCode>scroll-snap</Styled.InlineCode>). For JS, throttle work and prefer
                        <Styled.InlineCode>transform</Styled.InlineCode>/<Styled.InlineCode>opacity</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Passive listeners:</b> <Styled.InlineCode>{`addEventListener('scroll', fn, { passive: true })`}</Styled.InlineCode> prevents blocking scrolling.
                    </li>
                    <li>
                        <b>IntersectionObserver:</b> Trigger animations when elements enter the viewport—no scroll polling.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// IntersectionObserver: reveal-on-scroll (no scroll handler)
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("reveal");
  }
});
document.querySelectorAll(".revealable").forEach(el => io.observe(el));

/* CSS */
.revealable { opacity: 0; transform: translateY(12px); transition: transform .3s, opacity .3s; }
.revealable.reveal { opacity: 1; transform: none; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Framer Motion tips */}
            <Styled.Section>
                <Styled.H2>Framer Motion: Performance Tips</Styled.H2>
                <Styled.List>
                    <li><b>Prefer transform/opacity</b> for animated props; avoid animating layout-affecting CSS.</li>
                    <li>Limit simultaneous <Styled.InlineCode>layout</Styled.InlineCode> animations; they may trigger reflow.</li>
                    <li>Use <Styled.InlineCode>LazyMotion</Styled.InlineCode> to code-split animation features.</li>
                    <li>Batch exiting/entering elements (AnimatePresence) and keep trees shallow when possible.</li>
                    <li>Respect <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode> for accessibility.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: transforms only
<motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.98 }}
  transition={{ duration: 0.2 }}
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Debugging & tooling */}
            <Styled.Section>
                <Styled.H2>Debugging & Tooling</Styled.H2>
                <Styled.List>
                    <li><b>Performance panel:</b> Record, then inspect <i>scripting</i>, <i>rendering</i>, <i>painting</i> timelines and long tasks (&gt;50ms).</li>
                    <li><b>Layers panel:</b> Ensure frequently animated elements are on their own layer (but not too many).</li>
                    <li><b>FPS meter:</b> Watch for dips below 60; identify spikes when animations start.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> animate <Styled.InlineCode>transform</Styled.InlineCode> and <Styled.InlineCode>opacity</Styled.InlineCode>.</li>
                    <li><b>Do</b> batch reads/writes and use <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode> for JS animations.</li>
                    <li><b>Do</b> use <Styled.InlineCode>will-change</Styled.InlineCode> tactically; remove when idle.</li>
                    <li><b>Don't</b> animate layout-affecting properties if you can avoid it.</li>
                    <li><b>Don't</b> interleave layout reads and writes (avoid forced sync layout).</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>FPS:</b> Frames per second—how many images are shown each second.</li>
                    <li><b>Main thread:</b> The browser thread that runs JS, layout, and much of rendering work.</li>
                    <li><b>Compositor thread:</b> Combines pre-painted layers with transforms/opacity to produce frames.</li>
                    <li><b>Layout/Reflow:</b> Computing element sizes/positions after DOM/style changes.</li>
                    <li><b>Paint:</b> Rasterizing pixels (colors, text, borders) into layers.</li>
                    <li><b>Composite:</b> GPU step that merges layers into the final frame.</li>
                    <li><b>Compositor layer:</b> A GPU-managed surface that can move independently without repaint.</li>
                    <li><b>Jank:</b> Visible stutter caused by missed frame deadlines.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Animate <b>transform/opacity</b>, avoid layout/paint per frame, use <b>FLIP</b> and
                <b> requestAnimationFrame</b> wisely, and profile with DevTools. Promote to layers <i>only</i>
                when needed and respect users with reduced-motion preferences.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AnimationPerformance;
