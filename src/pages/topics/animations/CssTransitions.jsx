import { Styled } from "./styled";

const CssTransitions = () => {
    return (
        <Styled.Page>
            <Styled.Title>CSS Transitions</Styled.Title>

            <Styled.Lead>
                <b>CSS transitions</b> smoothly interpolate a property's value over time when it changes.
                You define <Styled.InlineCode>what</Styled.InlineCode> to transition, the
                <Styled.InlineCode>duration</Styled.InlineCode>, the <Styled.InlineCode>easing</Styled.InlineCode> (speed curve),
                and an optional <Styled.InlineCode>delay</Styled.InlineCode>. They're ideal for simple UI feedback like
                hover/focus states, expanding panels, and subtle fades.
            </Styled.Lead>

            {/* 1) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (clear definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Animatable property:</b> a CSS property whose intermediate values can be calculated
                        (e.g., <Styled.InlineCode>opacity</Styled.InlineCode>, <Styled.InlineCode>transform</Styled.InlineCode>,
                        <Styled.InlineCode>color</Styled.InlineCode>, <Styled.InlineCode>background-color</Styled.InlineCode>).
                        Not everything is animatable (e.g., <Styled.InlineCode>display</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Transition</b> = property change + time function. Built from:
                        <Styled.InlineCode>transition-property</Styled.InlineCode>,
                        <Styled.InlineCode>transition-duration</Styled.InlineCode>,
                        <Styled.InlineCode>transition-timing-function</Styled.InlineCode>,
                        <Styled.InlineCode>transition-delay</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Easing (timing function):</b> the speed curve over time (e.g.,
                        <Styled.InlineCode>ease</Styled.InlineCode>, <Styled.InlineCode>linear</Styled.InlineCode>,
                        <Styled.InlineCode>ease-in</Styled.InlineCode>, <Styled.InlineCode>ease-out</Styled.InlineCode>,
                        <Styled.InlineCode>cubic-bezier(x1, y1, x2, y2)</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Reflow (layout):</b> recalculating element positions/sizes. <b>Repaint (paint):</b> drawing pixels.
                        <b>Composite:</b> GPU combines layers without repainting. For best performance, prefer animating
                        <Styled.InlineCode>transform</Styled.InlineCode> and <Styled.InlineCode>opacity</Styled.InlineCode> (often only compositing).
                    </li>
                    <li>
                        <b>Transition trigger:</b> a state change that modifies a property—hover/focus, adding/removing a class,
                        toggling data attributes, or updating inline styles in JS/React.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Syntax */}
            <Styled.Section>
                <Styled.H2>Syntax: Shorthand & Longhand</Styled.H2>
                <Styled.Pre>
                    {`/* Shorthand: property | duration | timing-function | delay */
.box {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

/* Longhand (equivalent) */
.box {
  transition-property: transform, opacity;
  transition-duration: 200ms, 200ms;
  transition-timing-function: ease-out, ease-out;
  transition-delay: 0ms, 0ms;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Avoid <Styled.InlineCode>transition: all</Styled.InlineCode> for performance and predictability. List only the
                    properties you actually change.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Basic example */}
            <Styled.Section>
                <Styled.H2>Example 1: Hover Fade &amp; Move</Styled.H2>
                <Styled.Pre>
                    {`/* HTML */
<button class="btn">Hover me</button>

/* CSS */
.btn {
  transform: translateY(0);
  opacity: 1;
  transition: transform 180ms ease, opacity 180ms ease;
}
.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}`}
                </Styled.Pre>
                <Styled.Small>
                    We set the <i>initial</i> state on the base selector, then the :hover state changes properties—transition runs automatically.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Toggling with classes / React */}
            <Styled.Section>
                <Styled.H2>Example 2: Class Toggle (JS / React)</Styled.H2>
                <Styled.Pre>
                    {`/* CSS */
.panel {
  max-height: 0; overflow: hidden;
  opacity: 0;
  transition: max-height 300ms ease, opacity 200ms ease;
}
.panel.open {
  max-height: 320px; /* big enough for content */
  opacity: 1;
}

/* React (concept) */
function Panel() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}>
        {open ? "Close" : "Open"}
      </button>
      <div className={open ? "panel open" : "panel"}>Content...</div>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> CSS can't transition <Styled.InlineCode>height: auto</Styled.InlineCode> directly.
                    Use a fixed <Styled.InlineCode>max-height</Styled.InlineCode> or measure with JS then set an explicit height.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Easing details */}
            <Styled.Section>
                <Styled.H2>Easing: Built-ins &amp; Custom Curves</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Built-ins:</b> <Styled.InlineCode>ease</Styled.InlineCode> (standard),
                        <Styled.InlineCode>linear</Styled.InlineCode> (constant speed),
                        <Styled.InlineCode>ease-in</Styled.InlineCode> (accelerate),
                        <Styled.InlineCode>ease-out</Styled.InlineCode> (decelerate),
                        <Styled.InlineCode>ease-in-out</Styled.InlineCode> (accel then decel).
                    </li>
                    <li>
                        <b>cubic-bezier(x1, y1, x2, y2)</b> gives precise control (values 0-1 for x; y can go beyond 0-1 for overshoot).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Subtle snap: fast start, gentle end */
.card {
  transition: transform 220ms cubic-bezier(.2, .8, .2, 1);
}
.card:hover {
  transform: translateY(-3px);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Transform & opacity best-practice */}
            <Styled.Section>
                <Styled.H2>Best Practice: Transform &amp; Opacity</Styled.H2>
                <Styled.List>
                    <li>Prefer <Styled.InlineCode>transform</Styled.InlineCode> (translate/scale/rotate) and <Styled.InlineCode>opacity</Styled.InlineCode> for smooth, GPU-composited transitions.</li>
                    <li>Avoid animating layout/paint-heavy properties like <Styled.InlineCode>top/left</Styled.InlineCode>, <Styled.InlineCode>width/height</Styled.InlineCode>, <Styled.InlineCode>box-shadow</Styled.InlineCode> (can be janky).</li>
                    <li>
                        <Styled.InlineCode>will-change</Styled.InlineCode> can hint upcoming animation, but use sparingly to avoid memory cost.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Good */
.tile { transform: translateZ(0); transition: transform 160ms ease; }
.tile:hover { transform: translateY(-2px) scale(1.01); }

/* Risky (layout every frame) */
.bad { position: relative; transition: top 160ms ease; }
.bad:hover { top: -4px; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Visibility & interaction */}
            <Styled.Section>
                <Styled.H2>Visibility &amp; Interaction (Click-through)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Don't</b> transition <Styled.InlineCode>display</Styled.InlineCode> (it jumps, no interpolation).
                    </li>
                    <li>
                        Use <Styled.InlineCode>opacity</Styled.InlineCode> + <Styled.InlineCode>visibility</Styled.InlineCode> and optionally
                        <Styled.InlineCode>pointer-events</Styled.InlineCode> to manage clickability during fades.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`.fade {
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity 200ms ease, visibility 0s linear 200ms;
}
.fade.show {
  opacity: 1; visibility: visible; pointer-events: auto;
  transition: opacity 200ms ease, visibility 0s;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Here, <i>visibility</i> is delayed to switch after the fade finishes—so it's hidden when fully transparent.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Transition events */}
            <Styled.Section>
                <Styled.H2>Transition Events</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>transitionend</Styled.InlineCode> fires when a property finishes transitioning (per property).
                    </li>
                    <li>
                        In React, use <Styled.InlineCode>onTransitionEnd</Styled.InlineCode> on the element.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Toast({ open, onClose }) {
  return (
    <div
      className={open ? "toast open" : "toast"}
      onTransitionEnd={(e) => {
        if (e.propertyName === "opacity" && !open) onClose?.();
      }}
    >
      Saved!
    </div>
  );
}

/* CSS */
.toast { opacity: 0; transition: opacity 180ms ease; }
.toast.open { opacity: 1; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility: Motion Sensitivity</Styled.H2>
                <Styled.List>
                    <li>Respect users who prefer reduced motion; keep transitions subtle or disable large movements.</li>
                </Styled.List>
                <Styled.Pre>
                    {`@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> define initial styles on the base selector (so the browser knows where to start).</li>
                    <li><b>Do</b> list explicit properties instead of <Styled.InlineCode>all</Styled.InlineCode>.</li>
                    <li><b>Do</b> prefer <Styled.InlineCode>transform</Styled.InlineCode> &amp; <Styled.InlineCode>opacity</Styled.InlineCode> for performance.</li>
                    <li><b>Don't</b> transition <Styled.InlineCode>display</Styled.InlineCode> or rely on <Styled.InlineCode>height: auto</Styled.InlineCode> without a workaround.</li>
                    <li><b>Don't</b> make transitions slow—UI should feel snappy (150-250ms typical for micro-interactions).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: CSS transitions are the simplest way to add polish. Transition specific properties,
                choose good easing, and prefer transform/opacity for smooth, accessible motion.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CssTransitions;
