import React from "react";
import { Styled } from "./styled";

const Modal = () => {
    return (
        <Styled.Page>
            <Styled.Title>Modal (Reusable Component)</Styled.Title>

            <Styled.Lead>
                A <b>modal</b> is a UI surface that appears on top of the app and
                <i> requires </i> the user to interact with it before returning to the
                underlying content. In HTML semantics, a modal is a <b>dialog</b>.
                It must be <b>accessible</b>, trap focus while open, and return focus
                to the trigger when closed.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms (Clear Definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Dialog:</b> A surface for short, focused tasks or messages.
                        In ARIA, the dialog role is <Styled.InlineCode>role="dialog"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Modal:</b> A dialog that blocks interaction with the rest of the
                        page until it's dismissed (
                        <Styled.InlineCode>aria-modal="true"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Backdrop / Overlay:</b> The dimmed layer behind the dialog that
                        visually separates it and intercepts clicks.
                    </li>
                    <li>
                        <b>Focus Trap:</b> The requirement that keyboard focus stays inside
                        the dialog while it is open (Tab / Shift+Tab cycle).
                    </li>
                    <li>
                        <b>Labelling:</b> A programmatic title and description for assistive
                        tech via <Styled.InlineCode>aria-labelledby</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>aria-describedby</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Initial Focus:</b> The element that receives focus when the modal
                        opens (e.g., the dialog itself or the first interactive control).
                    </li>
                    <li>
                        <b>Focus Return:</b> When the modal closes, focus should return to
                        the button (trigger) that opened it.
                    </li>
                    <li>
                        <b>Scroll Lock:</b> Prevent the background page from scrolling while
                        the modal is open (commonly via{" "}
                        <Styled.InlineCode>document.body.style.overflow = "hidden"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Stacking Context:</b> A browser concept that affects layering and{" "}
                        <Styled.InlineCode>z-index</Styled.InlineCode>; ensure the modal sits
                        above other content.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal Anatomy */}
            <Styled.Section>
                <Styled.H2>Minimal Anatomy (Non-Portal Example)</Styled.H2>
                <Styled.Pre>
                    {`function ModalExample() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const titleId = "modal-title";
  const descId = "modal-desc";

  function openModal() {
    triggerRef.current = document.activeElement;
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    // Return focus to trigger
    triggerRef.current?.focus?.();
  }

  // Initial focus + basic focus trap (Tab / Shift+Tab)
  React.useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Initial focus
    const focusables = dialog.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    (focusables[0] || dialog).focus();

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const list = Array.from(focusables);
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // Scroll lock

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow; // Restore scroll
    };
  }, [open]);

  return (
    <div>
      <button onClick={openModal}>Open modal</button>

      {open && (
        <div
          aria-hidden="false"
          style={{
            position: "fixed", inset: 0, display: "grid",
            placeItems: "center", zIndex: 1000
          }}
        >
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.5)"
            }}
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            ref={dialogRef}
            style={{
              position: "relative",
              maxWidth: 520, width: "90%",
              background: "white",
              padding: "1rem",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
            }}
          >
            <h2 id={titleId}>Confirm action</h2>
            <p id={descId}>Are you sure you want to proceed?</p>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={() => { /* do action */ closeModal(); }}>
                Confirm
              </button>
            </div>

            {/* Close (X) button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    This is a teaching example: focuses on semantics + keyboard behavior
                    without any styling library. In your real component library, you'll tie
                    this to your design tokens and shared <Styled.InlineCode>Styled</Styled.InlineCode> primitives.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Accessibility checklist */}
            <Styled.Section>
                <Styled.H2>Accessibility Checklist</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Use</b> <Styled.InlineCode>role="dialog"</Styled.InlineCode>{" "}
                        + <Styled.InlineCode>aria-modal="true"</Styled.InlineCode>.
                    </li>
                    <li>
                        Provide a programmatic <b>label</b> and <b>description</b> via{" "}
                        <Styled.InlineCode>aria-labelledby</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>aria-describedby</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Trap focus</b> while open and <b>return focus</b> to the trigger when closed.
                    </li>
                    <li>
                        Support <b>Escape</b> to close and an obvious <b>Close</b> button.
                    </li>
                    <li>
                        <b>Scroll lock</b> the background and prevent content shifting (consider scrollbar compensation).
                    </li>
                    <li>
                        Keep reading order logical (title → content → actions).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Patterns & Variants */}
            <Styled.Section>
                <Styled.H2>Common Patterns & Variants</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Alert Dialog:</b> a modal that interrupts the app for critical decisions.
                        Ensure focused, clear copy and a safe default action.
                    </li>
                    <li>
                        <b>Form Dialog:</b> short forms with a clear primary action. Validate inline.
                    </li>
                    <li>
                        <b>Blocking vs Non-blocking:</b> true modals block the page; lightweight panels can be non-modal (see Drawer/Popover).
                    </li>
                    <li>
                        <b>Non-portal vs Portal:</b> you prefer non-portal. If stacking conflicts arise,
                        consider a single top-level modal root. Portals can simplify layering but require care
                        for focus management and CSS containment.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep content short and focused; long flows deserve a dedicated page.</li>
                    <li><b>Do</b> use descriptive button texts (e.g., “Delete file” instead of “OK”).</li>
                    <li><b>Do</b> prevent background scroll and ensure focus trap works on all browsers.</li>
                    <li><b>Don't</b> hide important information only inside the modal title; repeat key info in body text.</li>
                    <li><b>Don't</b> place destructive actions too close to dismiss; separate and emphasize safely.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) API design tips */}
            <Styled.Section>
                <Styled.H2>API Design Tips (for your component lib)</Styled.H2>
                <Styled.List>
                    <li>
                        Provide both <b>controlled</b> (<Styled.InlineCode>open</Styled.InlineCode>/{" "}
                        <Styled.InlineCode>onOpenChange</Styled.InlineCode>) and <b>uncontrolled</b> modes.
                    </li>
                    <li>
                        Accept <Styled.InlineCode>initialFocusRef</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>returnFocus</Styled.InlineCode>, and{" "}
                        <Styled.InlineCode>closeOnOverlayClick</Styled.InlineCode> props.
                    </li>
                    <li>
                        Compose with subcomponents:{" "}
                        <Styled.InlineCode>{`<Modal><Modal.Overlay/><Modal.Content/><Modal.Title/><Modal.Description/><Modal.Close/></Modal>`}</Styled.InlineCode>.
                    </li>
                    <li>
                        Provide sensible defaults that match your tokens (spacing, radius, shadows).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Testing Notes */}
            <Styled.Section>
                <Styled.H2>Testing Notes</Styled.H2>
                <Styled.List>
                    <li>Assert that focus moves inside on open and returns to trigger on close.</li>
                    <li>Pressing Escape calls the close handler and removes content from the DOM.</li>
                    <li>Overlay click closes the modal if your UX requires it (and it isn't an alert dialog).</li>
                    <li>Snapshot test the open/closed states and verify aria attributes.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A modal is more than a box with a backdrop. It's a <b>focus-managed,
                    accessible</b> dialog with keyboard support, clear labelling, scroll lock,
                and predictable close behavior. Get the fundamentals right and the rest is styling.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Modal;
