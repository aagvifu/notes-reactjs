import { Styled } from "./styled";

const FramerMotion = () => {
    return (
        <Styled.Page>
            <Styled.Title>Framer Motion</Styled.Title>

            <Styled.Lead>
                <b>Framer Motion</b> is a React animation library that provides <b>motion components</b>,
                declarative <b>props</b> for animation (<Styled.InlineCode>initial</Styled.InlineCode>, <Styled.InlineCode>animate</Styled.InlineCode>, <Styled.InlineCode>exit</Styled.InlineCode>),
                reusable <b>variants</b>, physics-based <b>springs</b>, timeline-style <b>tweens</b>, and utilities for
                <b> gestures</b>, <b>layout animations</b>, and <b>scroll-linked effects</b>.
            </Styled.Lead>

            {/* 1) Core concepts */}
            <Styled.Section>
                <Styled.H2>Core Concepts (Definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Motion component:</b> a wrapped HTML/SVG element (e.g., <Styled.InlineCode>motion.div</Styled.InlineCode>) with animation props.</li>
                    <li><b>initial:</b> the starting visual state before the first render animation begins.</li>
                    <li><b>animate:</b> the target visual state to animate to. Can be an object, variant name, or keyframes.</li>
                    <li><b>exit:</b> the state to animate to when the component leaves the tree (requires <Styled.InlineCode>AnimatePresence</Styled.InlineCode>).</li>
                    <li><b>transition:</b> how the animation runs (type, duration, easing or spring parameters).</li>
                    <li><b>variants:</b> a named map of states (e.g., <Styled.InlineCode>hidden</Styled.InlineCode>, <Styled.InlineCode>show</Styled.InlineCode>) that parent/children can share and coordinate.</li>
                    <li><b>gesture props:</b> transient states like <Styled.InlineCode>whileHover</Styled.InlineCode>, <Styled.InlineCode>whileTap</Styled.InlineCode>, <Styled.InlineCode>drag</Styled.InlineCode>.</li>
                    <li><b>layout / layoutId:</b> automatic layout-aware animations and shared-element transitions.</li>
                    <li><b>useScroll / useTransform:</b> hooks for scroll progress and mapping motion values.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) The smallest possible example */}
            <Styled.Section>
                <Styled.H2>Quick Start Example</Styled.H2>
                <Styled.Pre>
                    {`import { motion } from "framer-motion";

export default function Hello() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      Hello, Motion!
    </motion.div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Prefer animating <Styled.InlineCode>transform</Styled.InlineCode> and <Styled.InlineCode>opacity</Styled.InlineCode> for smoother, GPU-accelerated results.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Variants (coordinated animations) */}
            <Styled.Section>
                <Styled.H2>Variants (Coordinated Animations)</Styled.H2>
                <Styled.List>
                    <li><b>Why:</b> cleanly reuse states, coordinate parent/child timing (<Styled.InlineCode>staggerChildren</Styled.InlineCode>, <Styled.InlineCode>delayChildren</Styled.InlineCode>).</li>
                    <li><b>How:</b> put named states in an object; on parent set <Styled.InlineCode>initial</Styled.InlineCode>/<Styled.InlineCode>animate</Styled.InlineCode> to variant names; children reference the same keys.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { motion } from "framer-motion";

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0 }
};

function StaggeredList({ items }) {
  return (
    <motion.ul variants={list} initial="hidden" animate="show">
      {items.map((txt) => (
        <motion.li key={txt} variants={item}>{txt}</motion.li>
      ))}
    </motion.ul>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Gestures: hover, tap, drag */}
            <Styled.Section>
                <Styled.H2>Gestures: Hover, Tap, Drag</Styled.H2>
                <Styled.List>
                    <li><b>whileHover / whileTap:</b> temporary states while hovering/pressing.</li>
                    <li><b>drag:</b> make elements draggable; constrain with <Styled.InlineCode>dragConstraints</Styled.InlineCode>.</li>
                    <li><b>Elasticity:</b> control feel with <Styled.InlineCode>dragElastic</Styled.InlineCode> (0–1).</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { motion } from "framer-motion";

function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -80, right: 80, top: -40, bottom: 40 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ width: 160, height: 100, borderRadius: 12 }}
    />
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) AnimatePresence (entry/exit) */}
            <Styled.Section>
                <Styled.H2>AnimatePresence (Mount/Unmount Animations)</Styled.H2>
                <Styled.List>
                    <li><b>What:</b> a wrapper enabling <b>exit</b> animations when components are removed.</li>
                    <li><b>When:</b> modals, toasts, dropdowns, route transitions, conditional UI.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { AnimatePresence, motion } from "framer-motion";

function Modal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="backdrop"
          onClick={onClose}
        >
          <motion.section
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            Modal content
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> Exit animations run only inside <Styled.InlineCode>&lt;AnimatePresence /&gt;</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Layout animations */}
            <Styled.Section>
                <Styled.H2>Layout Animations</Styled.H2>
                <Styled.List>
                    <li><b>layout:</b> smoothly animates between size/position changes caused by React layout updates.</li>
                    <li><b>layoutId:</b> creates shared-element transitions between two components with the same id.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { motion } from "framer-motion";

function Expandable({ open }) {
  return (
    <motion.div layout style={{ borderRadius: 12 }}>
      {open && <motion.div layout style={{ height: 120 }} />}
    </motion.div>
  );
}

// Shared element example:
// <motion.img layoutId="avatar" .../>  // on page A
// <motion.img layoutId="avatar" .../>  // on page B
// Transition between A↔B animates the shared element.
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Scroll-linked effects */}
            <Styled.Section>
                <Styled.H2>Scroll-Linked Effects</Styled.H2>
                <Styled.List>
                    <li><b>useScroll:</b> returns a <b>motion value</b> that tracks page or element scroll progress (0 → 1).</li>
                    <li><b>useTransform:</b> maps one motion value into another range (e.g., progress → scale/opacity).</li>
                    <li><b>whileInView / viewport:</b> trigger animations as elements enter the viewport.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { motion, useScroll, useTransform } from "framer-motion";

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div style={{ position: "fixed", top: 0, left: 0, height: 4, width }} />;
}

function FadeInSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      Content
    </motion.div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Transitions: tween & spring */}
            <Styled.Section>
                <Styled.H2>Transitions: Tween & Spring (Definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Tween:</b> time-based animation. Key options: <Styled.InlineCode>duration</Styled.InlineCode>,
                        <Styled.InlineCode>delay</Styled.InlineCode>, <Styled.InlineCode>repeat</Styled.InlineCode>, <Styled.InlineCode>ease</Styled.InlineCode> (e.g., <Styled.InlineCode>"easeInOut"</Styled.InlineCode> or cubic-bezier).</li>
                    <li><b>Spring:</b> physics-based animation. Key options: <Styled.InlineCode>stiffness</Styled.InlineCode> (restoring force),
                        <Styled.InlineCode>damping</Styled.InlineCode> (friction), <Styled.InlineCode>mass</Styled.InlineCode> (inertia),
                        <Styled.InlineCode>bounce</Styled.InlineCode> (overshoot), <Styled.InlineCode>velocity</Styled.InlineCode> (initial speed).</li>
                    <li><b>Keyframes:</b> set an array of values in <Styled.InlineCode>animate</Styled.InlineCode> to play a sequence.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<motion.div
  animate={{ x: [0, 20, -10, 0] }}
  transition={{ duration: 0.6, times: [0, 0.5, 0.8, 1], ease: "easeInOut" }}
/>

<motion.div
  animate={{ scale: 1 }}
  initial={{ scale: 0.8 }}
  transition={{ type: "spring", stiffness: 300, damping: 22 }}
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility & performance */}
            <Styled.Section>
                <Styled.H2>Accessibility & Performance</Styled.H2>
                <Styled.List>
                    <li><b>Reduced motion:</b> respect user preference. Avoid large parallax/auto-moving effects when <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode> is set.</li>
                    <li><b>Properties:</b> animate <Styled.InlineCode>transform</Styled.InlineCode> and <Styled.InlineCode>opacity</Styled.InlineCode> for best performance; avoid <Styled.InlineCode>width/height/top/left</Styled.InlineCode> where possible.</li>
                    <li><b>Conflicts:</b> do not animate the same property with CSS transitions and Framer Motion simultaneously.</li>
                    <li><b>Mount cost:</b> keep <Styled.InlineCode>AnimatePresence</Styled.InlineCode> groups small; unmount what you don't need.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> centralize timings/variants for consistency across your app.</li>
                    <li><b>Do</b> use <Styled.InlineCode>whileInView</Styled.InlineCode> for one-off reveal animations on long pages.</li>
                    <li><b>Do</b> prefer <Styled.InlineCode>layout</Styled.InlineCode> for size/position changes from state updates.</li>
                    <li><b>Don't</b> over-animate; keep motion purposeful and subtle.</li>
                    <li><b>Don't</b> forget exit states—UI should feel complete when elements leave.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Motion value:</b> a reactive, subscribable value used by Framer Motion (e.g., <Styled.InlineCode>scrollYProgress</Styled.InlineCode>).</li>
                    <li><b>Easing:</b> the curve that maps time → progress (linear, easeInOut, cubic-bezier).</li>
                    <li><b>Stagger:</b> offsetting child animations over time for a cascade effect.</li>
                    <li><b>Shared element:</b> a visual element that appears to move seamlessly between screens (via <Styled.InlineCode>layoutId</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Start with <Styled.InlineCode>motion.div</Styled.InlineCode>, use <i>variants</i> for coordinated groups,
                add <i>AnimatePresence</i> for exit states, leverage <i>layout</i> for automatic size/position transitions,
                and use <i>useScroll</i> &amp; <i>useTransform</i> for scroll-linked motion.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FramerMotion;
