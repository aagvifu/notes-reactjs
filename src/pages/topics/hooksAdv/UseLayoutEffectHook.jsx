import React from "react";
import { Styled } from "./styled";

const UseLayoutEffectHook = () => {
    return (
        <Styled.Page>
            <Styled.Title>useLayoutEffect</Styled.Title>
            <Styled.Lead>
                <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> runs <b>synchronously after the DOM is updated</b> but
                <b> before the browser paints</b>. Use it for <b>measurement</b> and <b>synchronous DOM reads/writes</b> that must
                happen without visible flicker. Prefer <Styled.InlineCode>useEffect</Styled.InlineCode> for most side effects.
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li><b>Commit phase:</b> React has written DOM updates. Effects run after commit.</li>
                    <li><b>Paint:</b> the browser draws pixels on screen. <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> blocks paint until it finishes.</li>
                    <li><b>Layout/measurement:</b> reading sizes/positions from the DOM (getBoundingClientRect, scrollWidth, offsetHeight).</li>
                    <li><b>Flicker:</b> a visible jump when measuring then styling asynchronously. Layout effects avoid this.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use vs useEffect */}
            <Styled.Section>
                <Styled.H2>When to use (vs useEffect)</Styled.H2>
                <Styled.List>
                    <li><b>Use useLayoutEffect</b> to measure layout and synchronously adjust styles, classes, or scroll positions before paint.</li>
                    <li><b>Use useEffect</b> for network requests, subscriptions, logging, non-blocking updates, and anything where flicker does not matter.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Measure then style (no flicker) */}
            <Styled.Section>
                <Styled.H2>Measure, then style (no flicker)</Styled.H2>
                <Styled.Pre>
                    {`import { useLayoutEffect, useRef, useState } from "react";

function ClampToTwoLines() {
  const ref = useRef(null);
  const [needsClamp, setNeedsClamp] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tooTall = el.scrollHeight > el.clientHeight;
    if (tooTall) setNeedsClamp(true); // runs before paint → no visible jump
  });

  return (
    <p
      ref={ref}
      className={needsClamp ? "clamp-2" : ""}
      style={{ maxHeight: "3em", overflow: "hidden" }}
    >
      Long text that may need clamping depending on layout and font metrics.
    </p>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Reads layout then sets state; React will commit the style change before the first paint of this update.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Scroll/selection adjustments before paint */}
            <Styled.Section>
                <Styled.H2>Scroll and selection before paint</Styled.H2>
                <Styled.Pre>
                    {`import { useLayoutEffect, useRef } from "react";

function AutoScrollIntoView({ active }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (active) {
      // ensure the active item is visible immediately
      ref.current && ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [active]);

  return <li ref={ref} aria-current={active ? "true" : undefined}>Item</li>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Scrolling in a layout effect makes the list appear already scrolled at paint time.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Caret/cursor synchronization */}
            <Styled.Section>
                <Styled.H2>Cursor/caret synchronization</Styled.H2>
                <Styled.Pre>
                    {`import { useLayoutEffect, useRef, useState } from "react";

function NumberInput() {
  const [value, setValue] = useState("1000");
  const inputRef = useRef(null);

  // Format on change, then restore caret before paint
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const end = el.value.length;
    el.setSelectionRange(end, end); // keep caret at end after formatting
  }, [value]);

  function onChange(e) {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    // Add simple thousands separator
    const formatted = digits.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
    setValue(formatted);
  }

  return <input ref={inputRef} value={value} onChange={onChange} inputMode="numeric" />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Layout effect prevents caret jumps that would be visible with a normal effect.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Read → write order & batching */}
            <Styled.Section>
                <Styled.H2>Read → write order and batching</Styled.H2>
                <Styled.List>
                    <li>Group all layout reads first, then writes, to avoid layout thrashing.</li>
                    <li>Updates inside a layout effect are synchronous and block paint; keep the work minimal.</li>
                    <li>If heavy, schedule with <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode> or move to <Styled.InlineCode>useEffect</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`useLayoutEffect(() => {
  // read: bounds
  const r1 = box1.current.getBoundingClientRect();
  const r2 = box2.current.getBoundingClientRect();

  // write: position an overlay
  overlay.current.style.left = String(Math.min(r1.left, r2.left)) + "px";
  overlay.current.style.width = String(Math.abs(r2.right - r1.left)) + "px";
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) SSR considerations */}
            <Styled.Section>
                <Styled.H2>SSR considerations</Styled.H2>
                <Styled.List>
                    <li><b>On the server</b>, layout effects do not run and may show a warning in some setups.</li>
                    <li>Create an isomorphic hook that uses <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> in the browser and <Styled.InlineCode>useEffect</Styled.InlineCode> on the server.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useEffect, useLayoutEffect } from "react";
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;`}
                </Styled.Pre>
                <Styled.Small>
                    Use the isomorphic variant in libraries or SSR apps to avoid warnings and ensure safe behavior.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>Doing heavy work in <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> and blocking paint; only use it when flicker must be prevented.</li>
                    <li>Measuring in render or in <Styled.InlineCode>useEffect</Styled.InlineCode> and then styling → causes a visible jump.</li>
                    <li>Forgetting cleanups for observers/listeners added during layout effects.</li>
                    <li>Depending on mutable DOM that might be <em>null</em> initially; always null-check refs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> reserve <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> for measurements and synchronous DOM writes that must happen pre-paint.</li>
                    <li><b>Do</b> keep work minimal, and group reads before writes.</li>
                    <li><b>Do</b> use an isomorphic variant when targeting SSR.</li>
                    <li><b>Don’t</b> fetch or perform non-visual side effects here; use a normal effect.</li>
                    <li><b>Don’t</b> cause long blocks that delay first paint; move heavy logic elsewhere.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: reach for <Styled.InlineCode>useLayoutEffect</Styled.InlineCode> only when visual correctness depends on
                pre-paint measurement or synchronous writes. Keep work tiny, clean up properly, and use an isomorphic fallback for SSR.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default UseLayoutEffectHook;
