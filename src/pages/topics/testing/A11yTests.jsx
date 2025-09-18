import React from "react";
import { Styled } from "./styled";

const A11yTests = () => {
    return (
        <Styled.Page>
            <Styled.Title>Accessibility (A11y) Tests</Styled.Title>

            <Styled.Lead>
                <b>Accessibility (A11y)</b> means your UI can be used by <i>everyone</i>, including people
                using assistive tech (screen readers, switch devices), keyboard-only navigation, or high-contrast modes.
                A11y tests verify <b>roles</b>, <b>names</b>, <b>states</b>, keyboard access, focus management,
                color/contrast (partly), and the presence of meaningful landmarks and labels.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What &amp; Why</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Role:</b> the semantic type of an element (e.g., <Styled.InlineCode>button</Styled.InlineCode>,
                        <Styled.InlineCode>checkbox</Styled.InlineCode>, <Styled.InlineCode>navigation</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Accessible name:</b> the label announced by assistive tech (from text content,{" "}
                        <Styled.InlineCode>aria-label</Styled.InlineCode>, associated <Styled.InlineCode>&lt;label&gt;</Styled.InlineCode>, or{" "}
                        <Styled.InlineCode>aria-labelledby</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>State/Property:</b> dynamic attributes like <Styled.InlineCode>aria-checked</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>aria-expanded</Styled.InlineCode>, <Styled.InlineCode>disabled</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Landmarks:</b> document regions like <Styled.InlineCode>header</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>nav</Styled.InlineCode>, <Styled.InlineCode>main</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>footer</Styled.InlineCode> that help navigation.
                    </li>
                    <li>
                        <b>Focus management:</b> how keyboard focus moves and what gets focused after actions (open/close modals, route changes).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Tooling Overview */}
            <Styled.Section>
                <Styled.H2>Recommended Tools (Unit/Component &amp; E2E)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>React Testing Library (RTL):</b> query the DOM <i>like a user</i>
                        (e.g., <Styled.InlineCode>getByRole</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>getByLabelText</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>@testing-library/jest-dom:</b> matchers such as{" "}
                        <Styled.InlineCode>toBeInTheDocument</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>toHaveAccessibleName</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>toHaveAccessibleDescription</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>toHaveFocus</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>jest-axe / axe-core:</b> automated a11y rules (WCAG) checks for common issues.
                    </li>
                    <li>
                        <b>user-event:</b> simulate real keyboard and mouse interactions.
                    </li>
                    <li>
                        <b>E2E (Cypress or Playwright) + axe:</b> run a11y checks and keyboard flows in a real browser.
                    </li>
                </Styled.List>
                <Styled.Small>
                    Note: Automated tools don't catch everything (e.g., focus order logic, meaningful labels). Combine with
                    RTL role/label queries and manual checks (contrast, zoom, screen reader smoke tests).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Semantics: Roles & Names */}
            <Styled.Section>
                <Styled.H2>Semantics: Roles &amp; Names</Styled.H2>
                <Styled.List>
                    <li>
                        Prefer <b>semantic HTML</b> (<Styled.InlineCode>&lt;button&gt;</Styled.InlineCode>,
                        <Styled.InlineCode>&lt;nav&gt;</Styled.InlineCode>,
                        <Styled.InlineCode>&lt;main&gt;</Styled.InlineCode>) so roles are automatic.
                    </li>
                    <li>
                        Query by <b>role + name</b> to mirror assistive tech behavior.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: Button with a clear accessible name
import { render, screen } from "@testing-library/react";

function CloseButton() {
  return (
    <button aria-label="Close dialog">
      <span aria-hidden>×</span>
    </button>
  );
}

test("has role=button and name 'Close dialog'", () => {
  render(<CloseButton />);
  const btn = screen.getByRole("button", { name: /close dialog/i });
  expect(btn).toBeInTheDocument();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Labels: getByLabelText */}
            <Styled.Section>
                <Styled.H2>Labels: <code>getByLabelText</code></Styled.H2>
                <Styled.List>
                    <li>
                        Associate labels via <Styled.InlineCode>&lt;label for&gt;</Styled.InlineCode> or wrapping,
                        or use <Styled.InlineCode>aria-labelledby</Styled.InlineCode>.
                    </li>
                    <li>
                        <Styled.InlineCode>getByLabelText</Styled.InlineCode> finds form fields by their visual/announced label.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Login() {
  return (
    <form>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" />
      <button>Submit</button>
    </form>
  );
}

test("email is labeled and usable by keyboard", async () => {
  render(<Login />);
  const email = screen.getByLabelText(/email address/i);
  await userEvent.type(email, "dev@example.com");
  expect(email).toHaveValue("dev@example.com");
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Keyboard Navigation & Focus */}
            <Styled.Section>
                <Styled.H2>Keyboard Navigation &amp; Focus</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Tab order:</b> pressing <kbd>Tab</kbd> moves focus through interactive elements in visual order.
                    </li>
                    <li>
                        <b>Focus trap:</b> keeps keyboard focus inside a modal/dialog until it's closed.
                    </li>
                    <li>
                        <b>Roving tabindex:</b> only one item in a composite widget has <Styled.InlineCode>tabIndex=0</Styled.InlineCode> at a time;
                        arrow keys move the active item.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Toolbar() {
  return (
    <div role="toolbar" aria-label="Text formatting">
      <button>Bold</button>
      <button>Italic</button>
      <button>Underline</button>
    </div>
  );
}

test("toolbar buttons are reachable via Tab and focus is visible", async () => {
  render(<Toolbar />);
  await userEvent.tab();
  expect(screen.getByRole("button", { name: /bold/i })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: /italic/i })).toHaveFocus();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) States & ARIA */}
            <Styled.Section>
                <Styled.H2>States &amp; ARIA</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>native elements</b> first; add ARIA only when needed. ARIA should <i>enhance</i>, not replace, semantics.
                    </li>
                    <li>
                        Test dynamic states like <Styled.InlineCode>aria-expanded</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>aria-checked</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>disabled</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Accordion() {
  const [open, setOpen] = React.useState(false);
  return (
    <section>
      <button
        aria-expanded={open}
        aria-controls="panel"
        onClick={() => setOpen(v => !v)}
      >
        Details
      </button>
      <div id="panel" hidden={!open}>
        Hidden content
      </div>
    </section>
  );
}

test("accordion toggles aria-expanded and visibility", async () => {
  render(<Accordion />);
  const btn = screen.getByRole("button", { name: /details/i });
  expect(btn).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(btn);
  expect(btn).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/hidden content/i)).toBeInTheDocument();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Landmarks & Structure */}
            <Styled.Section>
                <Styled.H2>Landmarks &amp; Structure</Styled.H2>
                <Styled.List>
                    <li>
                        Pages should have a single <Styled.InlineCode>main</Styled.InlineCode> region, optional{" "}
                        <Styled.InlineCode>header</Styled.InlineCode>/<Styled.InlineCode>footer</Styled.InlineCode>, and{" "}
                        <Styled.InlineCode>nav</Styled.InlineCode> areas.
                    </li>
                    <li>
                        Provide a <b>skip link</b> to jump to <Styled.InlineCode>main</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header>Header</header>
      <nav aria-label="Primary">...</nav>
      <main id="main">Article</main>
      <footer>Footer</footer>
    </>
  );
}

test("landmarks exist and skip link works", async () => {
  render(<Layout />);
  expect(screen.getByRole("banner")).toBeInTheDocument();       // header
  expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();

  const skip = screen.getByRole("link", { name: /skip to content/i });
  await userEvent.click(skip);
  // In many apps, clicking the skip link moves focus to <main> or first heading inside it.
  // Here, assert that main exists; in real code you'd also manage focus.
  expect(screen.getByRole("main")).toBeInTheDocument();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Live Regions & Announcements */}
            <Styled.Section>
                <Styled.H2>Live Regions &amp; Announcements</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Live region:</b> an area that announces changes automatically to screen readers
                        (e.g., <Styled.InlineCode>aria-live="polite"</Styled.InlineCode> for toasts/status).
                    </li>
                    <li>
                        Use for async status (“Saved”), validation summaries, or dynamic counts.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";

function Status({ message }) {
  return <div role="status" aria-live="polite">{message}</div>;
}

test("status region is present and readable", () => {
  render(<Status message="Saved successfully" />);
  expect(screen.getByRole("status")).toHaveTextContent(/saved successfully/i);
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Automated Checks (axe) */}
            <Styled.Section>
                <Styled.H2>Automated Checks (axe)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>axe-core / jest-axe:</b> runs WCAG rules to catch common issues (missing labels,
                        invalid ARIA, contrast hints).
                    </li>
                    <li>
                        Automated checks are a <i>safety net</i>, not a replacement for semantic queries and keyboard tests.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example (Jest):
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

test("component has no obvious a11y violations", async () => {
  const { container } = render(<Layout />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`}
                </Styled.Pre>
                <Styled.Small>
                    In E2E, use <Styled.InlineCode>cypress-axe</Styled.InlineCode> or{" "}
                    <Styled.InlineCode>@axe-core/playwright</Styled.InlineCode> to scan real pages.
                </Styled.Small>
            </Styled.Section>

            {/* 10) Images & Media */}
            <Styled.Section>
                <Styled.H2>Images &amp; Media</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Meaningful image:</b> must have <Styled.InlineCode>alt</Styled.InlineCode> text that describes the purpose.
                    </li>
                    <li>
                        <b>Decorative image:</b> empty alt (<Styled.InlineCode>alt=""</Styled.InlineCode>) so screen readers skip it.
                    </li>
                    <li>
                        Prefer <b>captions</b> and transcripts for audio/video.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { render, screen } from "@testing-library/react";

function Avatar() {
  return <img src="/me.png" alt="Ashish Ranjan" />;
}

test("image has accessible name via alt", () => {
  render(<Avatar />);
  const img = screen.getByRole("img", { name: /ashish ranjan/i });
  expect(img).toBeInTheDocument();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use semantic HTML and query by role/label in tests.</li>
                    <li><b>Do</b> ensure all interactions are keyboard accessible and focus is visible.</li>
                    <li><b>Do</b> manage focus on dialogs, route changes, and after async actions.</li>
                    <li><b>Don't</b> rely only on snapshots—use behavior-focused assertions.</li>
                    <li><b>Don't</b> overuse ARIA; prefer native controls.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (Terms Used Here)</Styled.H2>
                <Styled.List>
                    <li><b>WCAG:</b> Web Content Accessibility Guidelines—industry standards for web accessibility.</li>
                    <li><b>Assistive technology (AT):</b> software/hardware that helps people interact with UIs (e.g., screen readers).</li>
                    <li><b>Accessible name:</b> the label announced by AT; derived from visible text, labels, or ARIA.</li>
                    <li><b>Role:</b> semantic type of an element (button, link, main, navigation, dialog).</li>
                    <li><b>State/Property:</b> dynamic attributes like checked/expanded/disabled that AT reads.</li>
                    <li><b>Landmark:</b> structural region (header, nav, main, footer) used for quick navigation.</li>
                    <li><b>Focus trap:</b> keeps keyboard focus inside a component (e.g., a modal).</li>
                    <li><b>Roving tabindex:</b> technique for composite widgets where only one item is tabbable at a time.</li>
                    <li><b>Live region:</b> area that announces updates automatically (role=status, aria-live).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Write tests that mirror how people use your app—by role, name, and keyboard.
                Combine RTL queries, <i>user-event</i>, and <i>axe</i> checks. Prefer semantic elements, manage focus,
                label every control, and verify landmarks and status messages.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default A11yTests;
