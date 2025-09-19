import React from "react";
import { Styled } from "./styled";

const Popover = () => {
    return (
        <Styled.Page>
            <Styled.Title>Popover</Styled.Title>

            <Styled.Lead>
                A <b>popover</b> is a small, contextual panel that appears on user action (click/press) and
                contains <i>interactive content</i>—buttons, links, inputs, or short forms. It is different from
                a <b>tooltip</b> (which is passive text, usually on hover/focus) and from a <b>dropdown menu</b>
                (which is a list of options/commands). Think “mini card with actions,” anchored to a trigger.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trigger:</b> the UI element that opens the popover (e.g., a button). It controls the
                        <i>open/close</i> state.
                    </li>
                    <li>
                        <b>Anchor:</b> the reference rectangle (usually the trigger) used to position the popover.
                    </li>
                    <li>
                        <b>Placement:</b> where the popover appears relative to the anchor (top, bottom, left, right, with
                        start/end alignment).
                    </li>
                    <li>
                        <b>Dismissal:</b> how the popover closes—pressing Escape, clicking outside, blurring focus, selecting
                        an action, or programmatically.
                    </li>
                    <li>
                        <b>Focus containment:</b> keeping keyboard focus inside the popover while it's open, then returning
                        focus to the trigger when it closes.
                    </li>
                    <li>
                        <b>ARIA attributes:</b> attributes that connect trigger ↔ panel and announce semantics to assistive tech,
                        e.g. <Styled.InlineCode>aria-haspopup="dialog"</Styled.InlineCode>, <Styled.InlineCode>aria-controls</Styled.InlineCode>,
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode>, and a labelled panel region.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use / when not to use */}
            <Styled.Section>
                <Styled.H2>When to Use / When Not to Use</Styled.H2>
                <Styled.List>
                    <li><b>Use</b> for short, contextual tasks (quick filters, tiny forms, confirmations, link lists).</li>
                    <li><b>Use</b> when the content needs interaction (buttons, inputs). If it's just explanatory text, use a tooltip.</li>
                    <li><b>Don't use</b> for long or critical flows (multi-step forms) — prefer a modal dialog or a dedicated page.</li>
                    <li><b>Don't use</b> if the panel risks being clipped by scrolling containers; consider layout changes or an inline modal pattern.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Basic anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy</Styled.H2>
                <Styled.Pre>
                    {`// Trigger (button) + Popover (panel)
// Notes: We avoid portals. Ensure the popover is NOT inside a container that clips overflow.
function ExamplePopover() {
  // state: open/close
  // handlers: onOpen, onClose, onToggle, onKeyDown (Escape), onClickOutside
  // positioning: compute top/left from trigger.getBoundingClientRect()
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep the popover next to the trigger in the DOM to simplify keyboard and focus management—
                    but watch out for clipping and stacking context.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trigger</b>: a <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>aria-haspopup="dialog"</Styled.InlineCode> (or <Styled.InlineCode>menu</Styled.InlineCode>),
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode> (true/false), and{" "}
                        <Styled.InlineCode>aria-controls</Styled.InlineCode> pointing to the panel id.
                    </li>
                    <li>
                        <b>Panel</b>: treat as a small dialog: give it a role (<Styled.InlineCode>role="dialog"</Styled.InlineCode>),
                        a label (<Styled.InlineCode>aria-label</Styled.InlineCode> or <Styled.InlineCode>aria-labelledby</Styled.InlineCode>),
                        and make it focusable (focus the first interactive element or panel itself on open).
                    </li>
                    <li>
                        <b>Focus return</b>: when closing, move focus back to the trigger to avoid focus loss.
                    </li>
                    <li>
                        <b>Escape to close</b> and <b>click outside to close</b> for predictable dismissal.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Patterns: state & API design */}
            <Styled.Section>
                <Styled.H2>Patterns: State & API Design</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Controlled vs Uncontrolled:</b> expose <i>open</i> and <i>onOpenChange</i> when reusing as a library
                        component; keep internal state for simple local use.
                    </li>
                    <li>
                        <b>Stable handlers:</b> memoize callbacks passed to deep children to avoid re-renders.
                    </li>
                    <li>
                        <b>Aria wiring:</b> keep <Styled.InlineCode>id</Styled.InlineCode> stable for <Styled.InlineCode>aria-controls</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Example: minimal skeleton (notes) */}
            <Styled.Section>
                <Styled.H2>Example: Minimal Popover Skeleton (Notes)</Styled.H2>
                <Styled.Pre>
                    {`function PopoverSkeleton() {
  // Imagine:
  // const [open, setOpen] = React.useState(false);
  // const triggerRef = React.useRef(null);
  // const panelRef = React.useRef(null);

  // Positioning idea:
  // const rect = triggerRef.current?.getBoundingClientRect();
  // const style = rect ? { position: "absolute", top: rect.bottom + 8, left: rect.left } : {};

  return (
    <div className="popover">
      <button
        // ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={false /* open */}
        aria-controls="pop-panel-1"
        onClick={() => {/* setOpen(v => !v) */}}
      >
        Open popover
      </button>

      {/* open && */ true && (
        <div
          id="pop-panel-1"
          role="dialog"
          aria-label="Quick actions"
          // ref={panelRef}
          // style={style}
          tabIndex={-1}
        >
          <div className="pop-header">Quick actions</div>
          <div className="pop-body">
            <button>Copy link</button>
            <button>Share…</button>
            <button>Settings</button>
          </div>
          <div className="pop-footer">
            <button /* onClick={() => setOpen(false)} */>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This snippet shows the essential structure and ARIA. In production, add focus management,
                    Escape handling, outside-click dismissal, and placement logic.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Positioning without portals */}
            <Styled.Section>
                <Styled.H2>Positioning (Without Portals)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Avoid clipping:</b> don't nest the popover inside containers with{" "}
                        <Styled.InlineCode>overflow: hidden/auto</Styled.InlineCode> unless you want it clipped.
                    </li>
                    <li>
                        <b>Layering:</b> use a dedicated stacking context (e.g., an app-level layout with{" "}
                        <Styled.InlineCode>position: relative</Styled.InlineCode>) and a high{" "}
                        <Styled.InlineCode>z-index</Styled.InlineCode> for the popover layer.
                    </li>
                    <li>
                        <b>Smart placement:</b> compute placement from{" "}
                        <Styled.InlineCode>getBoundingClientRect()</Styled.InlineCode> and flip when there's no space.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Sketch: computing a basic placement (no libs)
// const rect = triggerRef.current?.getBoundingClientRect();
// const vw = window.innerWidth, vh = window.innerHeight;
// let top = rect.bottom + 8, left = rect.left;
// if (top + panelHeight > vh) top = rect.top - 8 - panelHeight; // flip to top
// if (left + panelWidth > vw) left = vw - panelWidth - 8;       // shift into viewport`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Keyboard & focus behavior */}
            <Styled.Section>
                <Styled.H2>Keyboard & Focus Behavior</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Open</b>: focus the panel (or the first focusable) so screen readers announce it.
                    </li>
                    <li>
                        <b>Escape</b>: close and return focus to the trigger.
                    </li>
                    <li>
                        <b>Tab/Shift+Tab</b>: keep focus inside the panel (basic focus trap).
                    </li>
                    <li>
                        <b>Enter/Space on trigger</b>: open/close like a button.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// onKeyDown example (notes):
// if (e.key === "Escape") close();
// if (e.key === "Tab") trapFocus(e, panelRef);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use a real <Styled.InlineCode>&lt;button&gt;</Styled.InlineCode> as a trigger (keyboard + semantics).</li>
                    <li><b>Do</b> label the panel with <Styled.InlineCode>aria-label</Styled.InlineCode> or <Styled.InlineCode>aria-labelledby</Styled.InlineCode>.</li>
                    <li><b>Do</b> close on outside click and Escape by default; users expect it.</li>
                    <li><b>Don't</b> trap the user—always provide a clear close action.</li>
                    <li><b>Don't</b> rely on hover to open popovers that contain interactive controls (hover is fragile on touch).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Popover vs Tooltip vs Dropdown */}
            <Styled.Section>
                <Styled.H2>Popover vs Tooltip vs Dropdown</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Tooltip:</b> passive text on hover/focus; <i>no interactive content</i>; often delays;
                        <Styled.InlineCode>role="tooltip"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Dropdown menu:</b> list of commands/options; arrow-key navigation;{" "}
                        <Styled.InlineCode>role="menu"</Styled.InlineCode> / <Styled.InlineCode>menuitem</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Popover:</b> general purpose interactive panel (forms, actions);{" "}
                        <Styled.InlineCode>role="dialog"</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Stacking context:</b> how the browser calculates which element appears on top; impacted by position/transform/z-index.</li>
                    <li><b>Focus trap:</b> technique to loop focus within a modal-like surface until it closes.</li>
                    <li><b>Outside click:</b> click that happens outside the panel; commonly used to dismiss transient UI.</li>
                    <li><b>Flip/Shift:</b> reposition strategies used when the preferred placement has no space.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A popover is a compact, interactive panel anchored to a trigger. Build it with clear
                ARIA wiring, reliable dismissal (Escape/outside click), solid keyboard behavior, and careful
                placement. Avoid portals here by designing layout layers that prevent clipping.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Popover;
