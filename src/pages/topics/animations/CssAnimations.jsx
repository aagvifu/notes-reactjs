import React from "react";
import { Styled } from "./styled";

const CssAnimations = () => {
    return (
        <Styled.Page>
            <Styled.Title>CSS Animations</Styled.Title>

            <Styled.Lead>
                <b>CSS Animations</b> let you animate properties over time using named <b>@keyframes</b>.
                Unlike transitions (which react to a change), animations can <i>run by themselves</i>,
                <i>loop</i>, and <i>sequence</i> multiple stages.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>@keyframes:</b> a timeline that defines how properties change at specific percentages (from 0% to 100%).</li>
                    <li><b>Animation:</b> applying a keyframes timeline to an element with control over <Styled.InlineCode>duration</Styled.InlineCode>, <Styled.InlineCode>timing-function</Styled.InlineCode>, <Styled.InlineCode>delay</Styled.InlineCode>, <Styled.InlineCode>iteration-count</Styled.InlineCode>, <Styled.InlineCode>direction</Styled.InlineCode>, <Styled.InlineCode>fill-mode</Styled.InlineCode>, and <Styled.InlineCode>play-state</Styled.InlineCode>.</li>
                    <li><b>When to use:</b> looping effects, attention cues, complex multi-stage changes, or when no JS is needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Animations vs Transitions */}
            <Styled.Section>
                <Styled.H2>Animations vs. Transitions</Styled.H2>
                <Styled.List>
                    <li><b>Transition:</b> runs <i>only when a property changes</i> (e.g., on hover). No inherent loop or multi-step timeline.</li>
                    <li><b>Animation:</b> runs <i>automatically</i> (optionally loops), supports multi-step timelines via <Styled.InlineCode>@keyframes</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Example</Styled.H2>
                <Styled.Pre>
                    {`/* 1) Define keyframes */
@keyframes pop {
  0%   { transform: scale(1);   opacity: 0.6; }
  50%  { transform: scale(1.15); opacity: 1;   }
  100% { transform: scale(1);   opacity: 0.9; }
}

/* 2) Apply animation */
.badge {
  animation-name: pop;
  animation-duration: 600ms;
  animation-timing-function: ease-out;
  animation-iteration-count: 1;
  animation-fill-mode: both; /* keep end-state briefly visible */
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>@keyframes</b> defines stages; the element uses <b>animation-*</b> properties to run them.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Core properties */}
            <Styled.Section>
                <Styled.H2>Core Properties (Glossary)</Styled.H2>
                <Styled.List>
                    <li><b>animation-name:</b> which <Styled.InlineCode>@keyframes</Styled.InlineCode> to use.</li>
                    <li><b>animation-duration:</b> total time for one cycle (e.g., <Styled.InlineCode>500ms</Styled.InlineCode>, <Styled.InlineCode>2s</Styled.InlineCode>).</li>
                    <li><b>animation-timing-function:</b> speed curve over time (<Styled.InlineCode>ease</Styled.InlineCode>, <Styled.InlineCode>linear</Styled.InlineCode>, <Styled.InlineCode>ease-in</Styled.InlineCode>, <Styled.InlineCode>ease-out</Styled.InlineCode>, <Styled.InlineCode>ease-in-out</Styled.InlineCode>, <Styled.InlineCode>cubic-bezier()</Styled.InlineCode>, <Styled.InlineCode>steps()</Styled.InlineCode>).</li>
                    <li><b>animation-delay:</b> wait time before the first cycle starts.</li>
                    <li><b>animation-iteration-count:</b> number of repeats or <Styled.InlineCode>infinite</Styled.InlineCode>.</li>
                    <li><b>animation-direction:</b> <Styled.InlineCode>normal</Styled.InlineCode>, <Styled.InlineCode>reverse</Styled.InlineCode>, <Styled.InlineCode>alternate</Styled.InlineCode>, <Styled.InlineCode>alternate-reverse</Styled.InlineCode>.</li>
                    <li><b>animation-fill-mode:</b> how styles apply <i>before</i>/<i>after</i> the run (<Styled.InlineCode>none</Styled.InlineCode>, <Styled.InlineCode>forwards</Styled.InlineCode>, <Styled.InlineCode>backwards</Styled.InlineCode>, <Styled.InlineCode>both</Styled.InlineCode>).</li>
                    <li><b>animation-play-state:</b> <Styled.InlineCode>running</Styled.InlineCode> or <Styled.InlineCode>paused</Styled.InlineCode>.</li>
                    <li><b>animation (shorthand):</b> combines the above. <u>Tip:</u> the <i>first</i> time value is duration, the <i>second</i> time value is delay; the rest can be in any order.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Shorthand & multiple animations */}
            <Styled.Section>
                <Styled.H2>Shorthand & Multiple Animations</Styled.H2>
                <Styled.Pre>
                    {`@keyframes float   { from { transform: translateY(0) } to { transform: translateY(-10px) } }
@keyframes shimmer { 0% { opacity: 0.5 } 50% { opacity: 1 } 100% { opacity: 0.5 } }

/* Shorthand: duration timing delay count direction fill timing can be mixed
   (only rule: first time = duration, second time = delay) */
.card {
  animation: float 2s ease-in-out infinite alternate,
             shimmer 1.5s linear 0.25s infinite both;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) steps(), keyframe staging */}
            <Styled.Section>
                <Styled.H2>Keyframe Staging & <code>steps()</code></Styled.H2>
                <Styled.List>
                    <li><b>Keyframe staging:</b> use percentages (e.g., 0%, 30%, 60%, 100%) or <Styled.InlineCode>from</Styled.InlineCode>/<Styled.InlineCode>to</Styled.InlineCode> (aliases for 0%/100%).</li>
                    <li><b>steps(n, jump-*)</b>: creates discrete steps (useful for sprite sheets/typewriter effects).</li>
                </Styled.List>
                <Styled.Pre>
                    {`@keyframes type {
  from { width: 0ch; }
  to   { width: 24ch; }
}
.typing {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  animation: type 3s steps(24, end) 0s 1 both;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) React usage tips */}
            <Styled.Section>
                <Styled.H2>Using CSS Animations in React</Styled.H2>
                <Styled.List>
                    <li><b>Toggle with class:</b> add/remove a class to start/stop an animation.</li>
                    <li><b>Restart an animation:</b> remove the class, force reflow (read <Styled.InlineCode>offsetWidth</Styled.InlineCode>), then re-add class; or change a unique <Styled.InlineCode>key</Styled.InlineCode>.</li>
                    <li><b>Listen to events:</b> React exposes <Styled.InlineCode>onAnimationStart</Styled.InlineCode>, <Styled.InlineCode>onAnimationIteration</Styled.InlineCode>, <Styled.InlineCode>onAnimationEnd</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function SaveButton() {
  const [run, setRun] = React.useState(false);
  return (
    <button
      className={run ? "pulse" : ""}
      onClick={() => setRun(r => !r)}
      onAnimationEnd={() => setRun(false)}
    >
      Save
    </button>
  );
}

// CSS
@keyframes pulse { from { transform: scale(1) } 50% { transform: scale(1.06) } to { transform: scale(1) } }
.pulse { animation: pulse 400ms ease-out 1 both; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Performance basics */}
            <Styled.Section>
                <Styled.H2>Performance Basics</Styled.H2>
                <Styled.List>
                    <li><b>Animate transforms & opacity:</b> these can be GPU-accelerated and avoid layout thrash.</li>
                    <li><b>Avoid layout properties:</b> animating <Styled.InlineCode>width/height/top/left</Styled.InlineCode> forces layout and paint → jank.</li>
                    <li><b>Use</b> <Styled.InlineCode>will-change: transform, opacity;</Styled.InlineCode> sparingly to hint the browser (remove it when idle).</li>
                    <li><b>Keep durations short:</b> 150-400ms for micro-interactions; longer only for meaningful transitions.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility: prefers-reduced-motion</Styled.H2>
                <Styled.Pre>
                    {`/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Provide alternatives or soften animations for motion-sensitive users.
                </Styled.Small>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> animate <Styled.InlineCode>transform</Styled.InlineCode> and <Styled.InlineCode>opacity</Styled.InlineCode> for smoothness.</li>
                    <li><b>Do</b> name keyframes clearly and keep timelines simple.</li>
                    <li><b>Do</b> listen for <Styled.InlineCode>onAnimationEnd</Styled.InlineCode> when chaining UI state changes.</li>
                    <li><b>Don't</b> animate layout properties unless necessary.</li>
                    <li><b>Don't</b> ignore users' <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode> setting.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Quick reference */}
            <Styled.Section>
                <Styled.H2>Quick Reference</Styled.H2>
                <Styled.Pre>
                    {`/* Keyframes */
@keyframes name { 0% { /* ... */ } 100% { /* ... */ } }

/* Apply (longhand) */
.el {
  animation-name: name;
  animation-duration: 500ms;              /* first time value in shorthand */
  animation-delay: 0s;                    /* second time value in shorthand */
  animation-timing-function: ease-out;
  animation-iteration-count: 1;           /* or 'infinite' */
  animation-direction: normal;            /* reverse | alternate | alternate-reverse */
  animation-fill-mode: none;              /* forwards | backwards | both */
  animation-play-state: running;          /* or 'paused' */
}

/* Apply (shorthand, multiple) */
.el { animation: name 500ms ease-out 0s 1 normal both; }   /* +, another  ... */`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                Summary: Define motion with <b>@keyframes</b>, apply via <b>animation</b> properties,
                animate <b>transform/opacity</b> for performance, respect <b>reduced motion</b>, and prefer
                concise, purpose-driven effects that serve UX.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CssAnimations;
