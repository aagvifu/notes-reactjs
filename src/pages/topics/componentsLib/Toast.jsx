import React from "react";
import { Styled } from "./styled";

const Toast = () => {
    return (
        <Styled.Page>
            <Styled.Title>Toast (Non-blocking Notifications)</Styled.Title>

            <Styled.Lead>
                A <b>toast</b> is a small, transient message that appears on top of the UI to confirm an action,
                surface a status, or provide lightweight feedback-without interrupting the user's current task.
                Toasters are <i>non-modal</i> (no blocking), disappear automatically, and can stack as a queue.
            </Styled.Lead>

            {/* 1) Clear definitions */}
            <Styled.Section>
                <Styled.H2>What is a Toast? (Definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Toast / Snackbar:</b> A brief, dismissible notification. It <em>does not</em> block interaction.
                        (Some design systems use “snackbar” for bottom-placed toasts.)
                    </li>
                    <li>
                        <b>Non-modal:</b> The UI remains interactive; unlike a <em>modal dialog</em>, toasts don't capture focus.
                    </li>
                    <li>
                        <b>Duration (timeout):</b> The time before auto-dismiss (e.g., 3-6s). Usually pauses on hover.
                    </li>
                    <li>
                        <b>Placement:</b> Where toasts appear (top-right, bottom-center, etc.).
                    </li>
                    <li>
                        <b>Variant:</b> Visual/semantic style - <Styled.InlineCode>success</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>error</Styled.InlineCode>, <Styled.InlineCode>info</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>warn</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Queue / Stack:</b> Multiple toasts can be shown together; new ones are added to a queue respecting max visible.
                    </li>
                    <li>
                        <b>ARIA live region:</b> A screen-reader area that announces toast text automatically (polite vs assertive).
                    </li>
                    <li>
                        <b>Idempotency / Deduplication:</b> Prevent the same message from showing repeatedly for the same action.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use */}
            <Styled.Section>
                <Styled.H2>When to Use a Toast</Styled.H2>
                <Styled.List>
                    <li>Confirming quick actions: “Saved”, “Copied”, “Settings updated”.</li>
                    <li>Non-critical errors or warnings that don't require immediate decisions.</li>
                    <li>Background task updates: “Export started…”, “Export complete”.</li>
                </Styled.List>
                <Styled.Small>
                    If a decision is required (Yes/No), prefer a dialog. If the message must be read immediately,
                    consider an inline alert or an assertive live region.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Anatomy */}
            <Styled.Section>
                <Styled.H2>Anatomy</Styled.H2>
                <Styled.List>
                    <li><b>Container (Toaster):</b> fixed positioned area that holds a stack of toasts.</li>
                    <li><b>Toast Card:</b> icon (optional), title, message, close button, progress bar (optional).</li>
                    <li><b>Motion:</b> enter/exit animations (slide/fade) - fast and unobtrusive.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Minimal API design */}
            <Styled.Section>
                <Styled.H2>A Minimal API Design (Concept)</Styled.H2>
                <Styled.Pre>
                    {`// Shape idea: a Provider + hook + imperative helpers
// <ToastProvider placement="top-right" maxVisible={3} duration={4000} />

toast.success("Saved!");
toast.error("Failed to save");
toast.info("Connecting...");
toast.loading("Uploading...", { id: "upload-1" });   // can update by id
toast.update("upload-1", { type: "success", message: "Upload complete" });
toast.dismiss("upload-1");                            // or dismiss by id`}
                </Styled.Pre>
                <Styled.Small>
                    You're already using <i>react-toastify</i> elsewhere. These notes explain the concepts; you can keep
                    using the library or build a custom one if needed.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: user flows */}
            <Styled.Section>
                <Styled.H2>Examples (Common User Flows)</Styled.H2>
                <Styled.Pre>
                    {`// 1) Success after form submit
function onProfileSave() {
  // await api.saveProfile(data)
  // toast.success("Profile updated");
}

// 2) Error pattern with details
function onCheckout() {
  // try { await api.checkout() }
  // catch (err) { toast.error(err.message || "Payment failed"); }
}

// 3) Async task with update
async function exportCsv() {
  // toast.loading("Exporting...", { id: "exp" });
  // const file = await api.exportCsv();
  // toast.update("exp", { type: "success", message: "Export ready" });
}

// 4) Copy to clipboard
async function copyInvite() {
  // await navigator.clipboard.writeText(inviteUrl);
  // toast.info("Link copied");
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Accessibility essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility (A11y) Essentials</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Live Region:</b> Render toast messages in an <Styled.InlineCode>aria-live</Styled.InlineCode> container.
                        Use <Styled.InlineCode>polite</Styled.InlineCode> for non-urgent updates;{" "}
                        <Styled.InlineCode>assertive</Styled.InlineCode> only for critical alerts.
                    </li>
                    <li>
                        <b>Focus:</b> Do <em>not</em> steal focus for basic toasts. Keep focus where the user is working.
                    </li>
                    <li>
                        <b>Contrast & Duration:</b> Ensure readable contrast; allow enough time for reading or provide a manual close.
                    </li>
                    <li>
                        <b>Close button:</b> Always provide a visible dismiss control with an accessible name (e.g., “Close notification”).
                    </li>
                    <li>
                        <b>Reduced motion:</b> Respect <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode> (disable or simplify animations).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: polite live region container (concept)
<div aria-live="polite" aria-atomic="true" role="status">
  {/* Toast items */}
</div>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Patterns & options */}
            <Styled.Section>
                <Styled.H2>Patterns & Options</Styled.H2>
                <Styled.List>
                    <li><b>Placement:</b> top-right is common for desktop; bottom-center often works for mobile.</li>
                    <li><b>Pause on hover:</b> Suspend countdown while the user reads or interacts.</li>
                    <li><b>Deduplicate:</b> Collapse identical consecutive messages to avoid noise.</li>
                    <li><b>Max visible:</b> Show at most 3-4 at a time; queue the rest.</li>
                    <li><b>Persistent types:</b> Use “sticky” (no auto-dismiss) for critical errors.</li>
                    <li><b>Action button:</b> Optional “Undo” or “View” actions - keep secondary and short.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Variants (visual semantics) */}
            <Styled.Section>
                <Styled.H2>Variants</Styled.H2>
                <Styled.Pre>
                    {`// Suggested variants and semantics:
- success:  Operation completed (green, check icon)
- error:    Operation failed (red, cross icon)
- info:     Neutral information (blue)
- warn:     Cautionary info (amber)
- loading:  In progress (spinner), transitions to success/error`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep messages short and specific (“Profile saved”).</li>
                    <li><b>Do</b> use one toast per action; batch related info.</li>
                    <li><b>Do</b> ensure toasts don't cover critical controls (adjust placement on small screens).</li>
                    <li><b>Don't</b> use toasts for decisions - use dialogs.</li>
                    <li><b>Don't</b> spam toasts on every keystroke or repeated clicks (debounce/dedupe).</li>
                    <li><b>Don't</b> hide errors instantly; give users time to read and act.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Missing live region → screen readers don't announce the message.</li>
                    <li>Too short duration → users miss the message (especially on slow pages).</li>
                    <li>Stealing focus → breaks keyboard flow and frustrates users.</li>
                    <li>Overlapping navbars/footers → wrong z-index or placement.</li>
                    <li>Infinite queue → performance jitter; enforce a maximum.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Testing */}
            <Styled.Section>
                <Styled.H2>Testing Strategy</Styled.H2>
                <Styled.List>
                    <li>Unit test the <i>API surface</i> (e.g., calling <Styled.InlineCode>toast.success</Styled.InlineCode> adds an item).</li>
                    <li>Verify <i>duration</i> and <i>pause on hover</i> with fake timers.</li>
                    <li>Check <i>announcements</i> by asserting live region text updates.</li>
                    <li>Ensure <i>reducer/store</i> logic handles add/update/dismiss and max-visible correctly.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Toasts deliver fast, non-blocking feedback. Keep them short, accessible, respectful of motion
                preferences, and limited in number. For critical paths, prefer dialogs or inline alerts instead.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Toast;
