import React from "react";
import { Styled } from "./styled";

const Portals = () => {
    return (
        <Styled.Page>
            <Styled.Title>Portals</Styled.Title>

            <Styled.Lead>
                A <b>portal</b> lets you render a React subtree <i>somewhere else in the DOM</i> (e.g., under
                <Styled.InlineCode>document.body</Styled.InlineCode>) while keeping it in the same React tree:
                context still works, and Synthetic Events still bubble to React ancestors.
                <br />
                <b>Your project stance:</b> prefer <em>no portals</em> unless layout/stacking issues can’t be solved
                with regular layering; use fixed/absolute layers inside the app root when possible.
            </Styled.Lead>

            {/* 1) Definition & why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Portal:</b> render children to a different DOM container via{" "}
                        <Styled.InlineCode>createPortal(child, container)</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Why:</b> escape clipping (<Styled.InlineCode>overflow: hidden</Styled.InlineCode> /
                        transforms), complex stacking contexts, or parent z-index limits—common with modals, popovers, tooltips.
                    </li>
                    <li>
                        <b>React behavior:</b> events bubble through the <i>React</i> tree (not strictly the DOM tree).
                        Context (theme, router, i18n) is preserved across the portal boundary.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Example (educational)</Styled.H2>
                <Styled.Pre>
                    {`// PortalModal.jsx
import React from "react";
import { createPortal } from "react-dom";

export function PortalModal({ open, onClose, children }) {
  if (!open) return null;
  // Render into <body>. Create a #portal-root in index.html for stricter control.
  return createPortal(
    <div role="dialog" aria-modal="true" className="overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose} autoFocus>Close</button>
      </div>
    </div>,
    document.body
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Events inside the panel bubble to React parents even though the DOM node is under{" "}
                    <Styled.InlineCode>document.body</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Your preferred alternative (no portal) */}
            <Styled.Section>
                <Styled.H2>No-Portal Alternative (preferred in your projects)</Styled.H2>
                <Styled.List>
                    <li>
                        Append an overlay node as the <i>last child</i> of your React root and layer it with{" "}
                        <Styled.InlineCode>position: fixed</Styled.InlineCode> + high{" "}
                        <Styled.InlineCode>z-index</Styled.InlineCode>.
                    </li>
                    <li>
                        This avoids reparenting in the DOM and keeps styles/variables scoped as usual.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// App.jsx (outline idea)
// <div id="app-root">...app...</div>
// <div id="overlay-root" />  // sibling inside the same root container

function OverlayRoot({ children }) {
  // toggled via global state/context; still NOT a portal
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      {children}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use this when simple layering solves clipping/stacking. Reach for portals only if a parent’s
                    <Styled.InlineCode>overflow/transform</Styled.InlineCode> creates unavoidable clipping.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Event bubbling across portal */}
            <Styled.Section>
                <Styled.H2>Event Bubbling Across a Portal</Styled.H2>
                <Styled.Pre>
                    {`// Click inside the portal still reaches React parent handlers.
function Parent() {
  function onAnyClick() { console.log("Parent saw click"); }
  return (
    <div onClick={onAnyClick}>
      <PortalModal open>
        <button onClick={() => console.log("Button in portal clicked")}>
          Click me
        </button>
      </PortalModal>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Synthetic Events bubble to React ancestors even if the DOM ancestor is elsewhere.
                    Use <Styled.InlineCode>e.stopPropagation()</Styled.InlineCode> per normal rules.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Accessibility checklist */}
            <Styled.Section>
                <Styled.H2>Accessibility (Modals/Popovers)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Roles:</b> <Styled.InlineCode>role="dialog"</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>alertdialog</Styled.InlineCode> for critical interrupts.
                    </li>
                    <li>
                        <b>Labelling:</b> connect <Styled.InlineCode>aria-labelledby</Styled.InlineCode> /
                        <Styled.InlineCode>aria-describedby</Styled.InlineCode> to headings/body text.
                    </li>
                    <li>
                        <b>Focus:</b> move initial focus inside; trap Tab/Shift+Tab; restore focus to the trigger on close.
                    </li>
                    <li>
                        <b>Background inert:</b> set <Styled.InlineCode>inert</Styled.InlineCode> on siblings (modern) or{" "}
                        <Styled.InlineCode>aria-hidden="true"</Styled.InlineCode> fallback.
                    </li>
                    <li>
                        <b>Escape to close</b> and click-outside to dismiss (where appropriate).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Scroll locking */}
            <Styled.Section>
                <Styled.H2>Scroll Locking (avoid layout jump)</Styled.H2>
                <Styled.Pre>
                    {`// Basic idea: lock <body> without causing layout shift.
function lockBodyScroll(lock) {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (lock) {
    const barW = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    // compensate for scrollbar width
    body.style.paddingRight = barW ? barW + "px" : "";
  } else {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Guard for SSR. Always unlock on unmount to avoid “stuck” pages.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Styling & scoping notes */}
            <Styled.Section>
                <Styled.H2>Styling & Scoping Notes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>CSS variables:</b> if a variable is defined on an ancestor <i>not</i> in the portal’s DOM path,
                        it won’t inherit. Prefer variables on <Styled.InlineCode>:root</Styled.InlineCode> or pass values via React context.
                    </li>
                    <li>
                        <b>Stacking contexts:</b> transforms, filters, and position/opacity can create new contexts.
                        Portals sidestep parent contexts but you still need a sensible <Styled.InlineCode>z-index</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Theming:</b> React context (e.g., styled-components ThemeProvider) continues to work through portals.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) SSR & lifecycle gotchas */}
            <Styled.Section>
                <Styled.H2>SSR & Lifecycle Gotchas</Styled.H2>
                <Styled.List>
                    <li>
                        <b>DOM availability:</b> only create portals after mount
                        (<Styled.InlineCode>useEffect</Styled.InlineCode>) if you need access to{" "}
                        <Styled.InlineCode>document</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Cleanup:</b> if you create a dedicated container node, remove it on unmount.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don’t */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> try simple fixed/absolute layering first (your default approach).</li>
                    <li><b>Do</b> use portals when clipping/stacking can’t be solved any other way.</li>
                    <li><b>Do</b> implement a11y: role, labelling, focus trap, inert background, Escape.</li>
                    <li><b>Don’t</b> rely on implicit inheritance of CSS vars from non-ancestors.</li>
                    <li><b>Don’t</b> forget to unlock body scroll and restore focus.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Portals change <i>where</i> elements live in the DOM, not in React. Prefer same-root
                layering for overlays, and use a portal only when you must escape clipping or stacking traps.
                Keep accessibility and scroll-locking non-negotiable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Portals;
