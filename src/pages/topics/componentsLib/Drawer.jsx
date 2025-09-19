import React from "react";
import { Styled } from "./styled";

const Drawer = () => {
    return (
        <Styled.Page>
            <Styled.Title>Drawer (Slide-in Panel)</Styled.Title>

            <Styled.Lead>
                A <b>Drawer</b> is a panel that <i>slides in</i> from an edge and can be dismissed.
                It should be <b>controlled</b> with state (<Styled.InlineCode>isOpen</Styled.InlineCode>) and be
                <b> accessible</b> with focus management, keyboard support, and proper ARIA attributes.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Drawer:</b> A temporary panel that enters from an edge to show secondary content
                        without navigating away.
                    </li>
                    <li>
                        <b>Overlay (scrim):</b> A semi-transparent layer behind the panel that visually separates
                        the drawer from the page and captures outside clicks.
                    </li>
                    <li>
                        <b>Controlled component:</b> The open/close state is owned by React state and passed in as
                        props (<Styled.InlineCode>isOpen</Styled.InlineCode>, <Styled.InlineCode>onOpenChange</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Focus trap:</b> Keeps keyboard focus inside the drawer while it is open, so tabbing does not
                        escape to the page behind.
                    </li>
                    <li>
                        <b>ARIA labeling:</b> Use <Styled.InlineCode>role="dialog"</Styled.InlineCode>, plus either{" "}
                        <Styled.InlineCode>aria-label</Styled.InlineCode> or <Styled.InlineCode>aria-labelledby</Styled.InlineCode>{" "}
                        (and optionally <Styled.InlineCode>aria-describedby</Styled.InlineCode>) to describe the drawer to
                        assistive tech.
                    </li>
                    <li>
                        <b>Scroll locking:</b> Prevent body scroll while the drawer is open to avoid background content shifting.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy</Styled.H2>
                <Styled.List>
                    <li><b>Trigger:</b> Button or icon to open the drawer.</li>
                    <li><b>Root container:</b> An app-level container that renders overlay + panel.</li>
                    <li><b>Overlay:</b> Click to dismiss; covers the viewport.</li>
                    <li><b>Panel:</b> The sliding content area; contains header, content, and close control.</li>
                    <li><b>Close affordances:</b> an explicit "Close" button, Esc key, and overlay click.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Controlled pattern */}
            <Styled.Section>
                <Styled.H2>Controlled Pattern (recommended)</Styled.H2>
                <Styled.Pre>
                    {`function useDrawer(initial = false) {
  const [isOpen, setOpen] = React.useState(initial);
  const open = React.useCallback(() => setOpen(true), []);
  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen(o => !o), []);
  return { isOpen, open, close, toggle, setOpen };
}

function DrawerExample() {
  const { isOpen, open, close } = useDrawer();
  return (
    <>
      <button onClick={open} aria-haspopup="dialog" aria-expanded={isOpen}>
        Open Filters
      </button>
      <DrawerRoot isOpen={isOpen} onOpenChange={set => set ? open() : close()}>
        <DrawerOverlay onClick={close} />
        <DrawerPanel
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-title"
          aria-describedby="filters-desc"
        >
          <header>
            <h2 id="filters-title">Filters</h2>
            <p id="filters-desc">Refine the product list by category and price.</p>
            <button onClick={close} aria-label="Close">✕</button>
          </header>
          {/* content */}
        </DrawerPanel>
      </DrawerRoot>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The component is controlled by <Styled.InlineCode>isOpen</Styled.InlineCode>. The root renders overlay and panel.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Non-portal approach (your preference) */}
            <Styled.Section>
                <Styled.H2>Non-Portal Rendering (fits your preference)</Styled.H2>
                <Styled.List>
                    <li>
                        You prefer not to use portals. Render the drawer at the end of the app tree and ensure it
                        visually overlays content using <Styled.InlineCode>position: fixed</Styled.InlineCode> and a high{" "}
                        <Styled.InlineCode>z-index</Styled.InlineCode>.
                    </li>
                    <li>
                        Make sure background content becomes inert for screen readers. A practical approach is adding{" "}
                        <Styled.InlineCode>aria-hidden="true"</Styled.InlineCode> to the app container when the drawer is open
                        (except the drawer subtree). Keep the DOM order logical for tabbing and reading order.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudocode styling idea (not the actual styled.js):
const DrawerRootStyle = {
  position: "fixed", inset: 0, display: "grid",
  gridTemplateAreas: "'overlay' 'panel'",
  zIndex: 50, // above app content
};

const DrawerOverlayStyle = {
  position: "fixed", inset: 0, background: "hsl(0 0% 0% / 0.5)"
};

const DrawerPanelStyle = {
  position: "fixed", top: 0, bottom: 0, right: 0, width: "min(420px, 90vw)",
  transform: "translateX(0)", transition: "transform 200ms ease",
  background: "var(--panel-bg)", outline: 0
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Role & labeling:</b> Use <Styled.InlineCode>role="dialog"</Styled.InlineCode> and label it with{" "}
                        <Styled.InlineCode>aria-label</Styled.InlineCode> or <Styled.InlineCode>aria-labelledby</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Initial focus:</b> Move focus into the drawer on open (e.g., to the first interactive element or the
                        drawer header).
                    </li>
                    <li>
                        <b>Focus trap:</b> Keep focus within the drawer. On close, return focus to the trigger that opened it.
                    </li>
                    <li>
                        <b>Keyboard support:</b> Esc closes; Tab cycles within; Shift+Tab reverses.
                    </li>
                    <li>
                        <b>Announcements:</b> Dynamic changes (like filters applied) may need live region updates if not obvious.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Initial focus & Esc handling (sketch)
function useDrawerA11y({ isOpen, onClose, panelRef, triggerRef }) {
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    const panel = panelRef.current;
    panel?.focus();

    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // restore focus
      if (triggerRef.current) triggerRef.current.focus();
      else if (prev instanceof HTMLElement) prev.focus();
    };
  }, [isOpen, onClose, panelRef, triggerRef]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Scroll locking */}
            <Styled.Section>
                <Styled.H2>Scroll Locking</Styled.H2>
                <Styled.List>
                    <li>
                        Prevent background scroll while open to avoid layout shifts. A simple approach is toggling{" "}
                        <Styled.InlineCode>document.body.style.overflow = "hidden"</Styled.InlineCode> on open and restoring it on close.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function useScrollLock(active) {
  React.useEffect(() => {
    const { overflow } = document.body.style;
    if (active) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [active]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Placement & sizing */}
            <Styled.Section>
                <Styled.H2>Placement & Sizing</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Placement:</b> right/left for navigation and filters; bottom for mobile actions; top for global banners.
                    </li>
                    <li>
                        <b>Sizing:</b> fixed width (e.g., 360–480px) or responsive (e.g., <Styled.InlineCode>min(420px, 90vw)</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Motion:</b> slide in/out with <Styled.InlineCode>transform</Styled.InlineCode> transitions; avoid animating{" "}
                        <Styled.InlineCode>width</Styled.InlineCode> for performance.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Example: Simple controlled drawer (non-portal) */}
            <Styled.Section>
                <Styled.H2>Example: Simple Controlled Drawer (Non-Portal)</Styled.H2>
                <Styled.Pre>
                    {`function SimpleDrawer() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const panelRef = React.useRef(null);

  // a11y & scroll lock helpers
  useScrollLock(open);
  useDrawerA11y({ isOpen: open, onClose: () => setOpen(false), panelRef, triggerRef });

  return (
    <div data-app-root aria-hidden={open ? "true" : undefined}>
      <button ref={triggerRef} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        Open Drawer
      </button>

      {open && (
        <>
          <div
            role="presentation"
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "hsl(0 0% 0% / 0.5)" }}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sample drawer"
            tabIndex={-1}
            style={{
              position: "fixed", top: 0, bottom: 0, right: 0,
              width: "min(420px, 90vw)", background: "var(--panel-bg, #111)",
              transform: "translateX(0)", transition: "transform 200ms ease",
              outline: "none", padding: "16px", boxShadow: "0 0 0 1px hsl(0 0% 100% / 0.08)"
            }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </header>

            <div style={{ marginTop: 12 }}>
              {/* Drawer content */}
              <label>
                Category
                <select><option>All</option><option>Books</option><option>Electronics</option></select>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This sketch demonstrates the core behavior. In your codebase, you'd style via{" "}
                    <Styled.InlineCode>styled-components</Styled.InlineCode> and reuse tokens.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Common interactions */}
            <Styled.Section>
                <Styled.H2>Common Interactions</Styled.H2>
                <Styled.List>
                    <li><b>Open via click/keyboard:</b> Trigger should be reachable by Tab and Enter/Space.</li>
                    <li><b>Close:</b> via Esc, overlay click, or dedicated "Close" button.</li>
                    <li><b>Route change:</b> auto-close on navigation so UI state matches the new page.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Close on route change (example idea)
import { useLocation } from "react-router-dom";
function useCloseOnRouteChange(isOpen, close) {
  const location = useLocation();
  React.useEffect(() => { if (isOpen) close(); /* when pathname changes */ }, [location.pathname]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> manage it as a controlled component with a single source of truth.</li>
                    <li><b>Do</b> provide keyboard/ARIA support (Esc, focus trap, labeled dialog).</li>
                    <li><b>Do</b> lock background scroll while open.</li>
                    <li><b>Don't</b> trap users by removing all visible ways to close.</li>
                    <li><b>Don't</b> place essential, primary flows in drawers—keep them for secondary tasks.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Dialog:</b> An interactive UI layer that requires user attention; drawers are a type of dialog.</li>
                    <li><b>Modal:</b> Blocks interaction with the rest of the app until dismissed.</li>
                    <li><b>Non-modal:</b> Allows interacting with other parts of the UI while open (drawers are usually modal).</li>
                    <li><b>Inert:</b> Background content that is temporarily made uninteractable and hidden to AT while a modal is open.</li>
                    <li><b>Portal:</b> Rendering children into a DOM node outside the parent hierarchy. Useful for stacking; you prefer avoiding it, so the examples stay non-portal.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A Drawer is a controlled, accessible, dismissible panel. Prioritize keyboard support,
                ARIA labeling, focus management, and scroll locking. Keep it secondary in your UX hierarchy.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Drawer;
