import React from "react";
import { Styled } from "./styled";

const MeasureLayout = () => {
    return (
        <Styled.Page>
            <Styled.Title>Measure &amp; Layout</Styled.Title>

            <Styled.Lead>
                “Measuring” means reading an element’s <b>size</b> and <b>position</b> (e.g., via
                <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode>,
                <Styled.InlineCode>offsetWidth</Styled.InlineCode>). These reads can trigger browser
                <b> layout</b> work. Know when and how to measure to avoid jank, flicker, and layout thrashing.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Layout (reflow):</b> the step where the browser computes sizes/positions of elements.</li>
                    <li><b>Paint (repaint):</b> the step where pixels are drawn (colors, text, borders, shadows).</li>
                    <li><b>Compositing:</b> combining painted layers on the GPU.</li>
                    <li><b>Measuring:</b> reading layout-dependent values:
                        <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode>,
                        <Styled.InlineCode>offsetWidth/Height</Styled.InlineCode>,
                        <Styled.InlineCode>clientWidth/Height</Styled.InlineCode>,
                        <Styled.InlineCode>scrollWidth/Height</Styled.InlineCode>.
                    </li>
                    <li><b>Why it matters:</b> unnecessary or interleaved reads/writes cause <i>forced synchronous layouts</i> → jank.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to measure */}
            <Styled.Section>
                <Styled.H2>When should you measure?</Styled.H2>
                <Styled.List>
                    <li>After a component mounts and renders dynamic content (e.g., to size a popover/tooltip).</li>
                    <li>When the element’s size can change (content changes, container resizes, responsive breakpoints).</li>
                    <li>On viewport changes (window resize/zoom) or when visibility toggles (tabs, accordions).</li>
                    <li>After fonts load (text reflow), or images load (intrinsic size changes).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Core APIs */}
            <Styled.Section>
                <Styled.H2>Core APIs for measuring</Styled.H2>
                <Styled.List>
                    <li><b>ref + getBoundingClientRect()</b> — returns <i>position</i> &amp; <i>size</i> in viewport coordinates.</li>
                    <li><b>offsetWidth/offsetHeight</b> — round, includes borders; excludes margins.</li>
                    <li><b>clientWidth/clientHeight</b> — inner box (padding included, border excluded).</li>
                    <li><b>scrollWidth/scrollHeight</b> — content size including overflow area.</li>
                    <li><b>ResizeObserver</b> — async notifications when an element’s box size changes.</li>
                    <li><b>IntersectionObserver</b> — visibility/overlap of a target with a root (useful for lazy UI).</li>
                    <li><b>getComputedStyle(el)</b> — read resolved styles (expensive; avoid in hot paths).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: measure on mount without flicker */}
            <Styled.Section>
                <Styled.H2>Example: Measure on mount (no flicker)</Styled.H2>
                <Styled.Pre>
                    {`function Popover({ anchorRef, open, children }) {
  const popRef = React.useRef(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  // Measure in useLayoutEffect to read after DOM updates but before paint.
  React.useLayoutEffect(() => {
    if (!open) return;
    const a = anchorRef.current;
    const p = popRef.current;
    if (!a || !p) return;

    const rect = a.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;

    setPos({ top, left });
  }, [open, anchorRef]);

  return open ? (
    <div
      ref={popRef}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left
      }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  ) : null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <b>useLayoutEffect</b> for measuring to avoid a visible “jump” between first paint and positioned paint.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: track element size with ResizeObserver */}
            <Styled.Section>
                <Styled.H2>Example: Track size with <code>ResizeObserver</code></Styled.H2>
                <Styled.Pre>
                    {`function useElementSize(ref) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setSize({ width: cr.width, height: cr.height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function ResizablePanel() {
  const ref = React.useRef(null);
  const { width, height } = useElementSize(ref);
  return (
    <div ref={ref} className="panel">
      <p>Size: {Math.round(width)} × {Math.round(height)}</p>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>ResizeObserver</b> is async and avoids repeated forced layouts. Guard for SSR and old browsers if needed.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Pattern: batch reads & writes to avoid thrashing */}
            <Styled.Section>
                <Styled.H2>Pattern: Batch reads, then writes</Styled.H2>
                <Styled.List>
                    <li><b>Layout thrash:</b> alternating read → write → read forces multiple layouts.</li>
                    <li><b>Solution:</b> read all metrics first; then perform style writes, ideally inside <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function positionTooltip(el, anchor) {
  // READ phase
  const r = anchor.getBoundingClientRect();
  const top = r.bottom + window.scrollY;
  const left = r.left + window.scrollX;

  // WRITE phase (next frame)
  requestAnimationFrame(() => {
    el.style.transform = \`translate(\${left}px, \${top}px)\`;
  });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Example: visibility + measurement with IntersectionObserver */}
            <Styled.Section>
                <Styled.H2>Example: Measure only when visible</Styled.H2>
                <Styled.Pre>
                    {`function useVisibility(ref, options) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [ref, options]);

  return visible;
}

function Chart() {
  const ref = React.useRef(null);
  const visible = useVisibility(ref, { threshold: 0.25 });

  React.useLayoutEffect(() => {
    if (!visible || !ref.current) return;
    // safe to measure + render chart now
    const rect = ref.current.getBoundingClientRect();
    // drawChart({ width: rect.width, height: rect.height });
  }, [visible]);

  return <div ref={ref} style={{ minHeight: 240 }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Defer heavy measuring/painting until the element is likely visible → faster initial load.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Choosing useEffect vs useLayoutEffect */}
            <Styled.Section>
                <Styled.H2><code>useEffect</code> vs <code>useLayoutEffect</code></Styled.H2>
                <Styled.List>
                    <li><b>Measure in</b> <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> (runs after DOM updates, before paint) to avoid flicker.</li>
                    <li><b>Mutate styles</b> that depend on measurements either in the same <i>layout effect</i> or in a <i>requestAnimationFrame</i> callback.</li>
                    <li>Use <Styled.InlineCode>useEffect</Styled.InlineCode> for non-visual side effects (fetch, logs, subscriptions) where timing vs paint doesn’t matter.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep a stable <Styled.InlineCode>ref</Styled.InlineCode> and measure from it.</li>
                    <li><b>Do</b> batch all <i>reads</i> first, then <i>writes</i>; prefer <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode> for writes.</li>
                    <li><b>Do</b> use <Styled.InlineCode>ResizeObserver</Styled.InlineCode> for ongoing size tracking.</li>
                    <li><b>Don’t</b> interleave reads and writes in one tick; avoid repeated <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode> in loops.</li>
                    <li><b>Don’t</b> rely on layout measurements during SSR; guard for <Styled.InlineCode>window</Styled.InlineCode>/API availability.</li>
                    <li><b>Don’t</b> forget fonts/images can change layout after load—listen or re-measure if needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Forced synchronous layout:</b> the browser must recompute layout immediately to answer a read.</li>
                    <li><b>Layout thrashing:</b> alternating read/write that triggers multiple layouts in a frame.</li>
                    <li><b>BBox / BCR:</b> bounding client rect (position &amp; size in viewport coords).</li>
                    <li><b>CLS (Cumulative Layout Shift):</b> metric capturing unexpected layout movement; minimize flicker by measuring before paint.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: measure with refs, prefer <b>useLayoutEffect</b> for timing, batch reads and writes,
                and use observers (Resize/Intersection) to react to change without thrashing.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default MeasureLayout;
