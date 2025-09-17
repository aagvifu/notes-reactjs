import React from "react";
import { Styled } from "./styled";

const Conditional = () => {
    return (
        <Styled.Page>
            <Styled.Title>Conditional Rendering</Styled.Title>
            <Styled.Lead>
                Conditional rendering shows or hides parts of the UI based on state.
                In JSX, conditions must be written as <b>expressions</b>, not statements.
            </Styled.Lead>

            {/* Definition */}
            <Styled.Section>
                <Styled.H2>Definition & rules</Styled.H2>
                <Styled.List>
                    <li>JSX curly braces expect an <b>expression</b> that returns a node (or <Styled.InlineCode>null</Styled.InlineCode>).</li>
                    <li>
                        Statements like <Styled.InlineCode>if</Styled.InlineCode>, <Styled.InlineCode>for</Styled.InlineCode> cannot appear directly
                        inside JSX—move logic above, or use an expression (ternary, <Styled.InlineCode>&&</Styled.InlineCode>).
                    </li>
                    <li>Returning <Styled.InlineCode>null</Styled.InlineCode> or <Styled.InlineCode>false</Styled.InlineCode> renders nothing.</li>
                </Styled.List>
            </Styled.Section>

            {/* Pattern 1: Ternary */}
            <Styled.Section>
                <Styled.H2>Pattern 1 — Ternary (if/else)</Styled.H2>
                <p>Best choice when there is a clear “then/else”.</p>
                <Styled.Pre>
                    {`{isLoading ? <Spinner /> : <List items={data} />}

// Multi-branch with a precomputed tag
const statusView =
  status === "error"   ? <ErrorBanner /> :
  status === "empty"   ? <Empty /> :
  status === "loading" ? <Spinner /> :
                         <List items={data} />;

return <section>{statusView}</section>;`}
                </Styled.Pre>
            </Styled.Section>

            {/* Pattern 2: Logical AND */}
            <Styled.Section>
                <Styled.H2>Pattern 2 — Logical AND (guarded render)</Styled.H2>
                <p>Render a piece only when a condition is truthy.</p>
                <Styled.Pre>
                    {`{/* show error only when error exists */}
{error && <p className="error">{error.message}</p>}

{/* show badge only when count > 0 */}
{count > 0 && <span className="badge">{count}</span>}`}
                </Styled.Pre>
                <Styled.Small>
                    Use a boolean expression (e.g., <Styled.InlineCode>count &gt; 0</Styled.InlineCode>). If the left side can be
                    <Styled.InlineCode>0</Styled.InlineCode>, writing <Styled.InlineCode>{`{count && <Badge />}`}</Styled.InlineCode> would render the number <em>0</em>.
                </Styled.Small>
            </Styled.Section>

            {/* Pattern 3: Early returns */}
            <Styled.Section>
                <Styled.H2>Pattern 3 — Early returns (before JSX)</Styled.H2>
                <p>Keep JSX flat by returning early for special cases.</p>
                <Styled.Pre>
                    {`function Products({ data, error, loading }) {
  if (loading) return <Spinner />;
  if (error)   return <ErrorBanner error={error} />;
  if (!data?.length) return <Empty />;

  return <Grid items={data} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Pattern 4: Guard components */}
            <Styled.Section>
                <Styled.H2>Pattern 4 — Guard components (wrapper)</Styled.H2>
                <p>Encapsulate a common gate (auth, feature flag, permission) once.</p>
                <Styled.Pre>
                    {`function If({ when, children, otherwise = null }) {
  return when ? children : otherwise;
}

// usage
<If when={user}>
  <Dashboard />
</If>

// with 'otherwise'
<If when={canEdit} otherwise={<ReadOnly />}>
  <Editor />
</If>`}
                </Styled.Pre>
            </Styled.Section>

            {/* Pattern 5: Switch map */}
            <Styled.Section>
                <Styled.H2>Pattern 5 — Switch map (object map)</Styled.H2>
                <p>Prefer a lookup map over nested ternaries for multiple states.</p>
                <Styled.Pre>
                    {`const views = {
  loading: <Spinner />,
  error:   <ErrorBanner />,
  empty:   <Empty />,
  ready:   <List items={data} />
};

return views[status] ?? <UnknownState />;`}
                </Styled.Pre>
            </Styled.Section>

            {/* Pattern 6: Dynamic component */}
            <Styled.Section>
                <Styled.H2>Pattern 6 — Dynamic component choice</Styled.H2>
                <p>Select a component type by condition, then render it.</p>
                <Styled.Pre>
                    {`const Field = readOnly ? ReadOnlyField : EditableField;
return <Field value={value} onChange={setValue} />;`}
                </Styled.Pre>
            </Styled.Section>

            {/* Hide vs unmount */}
            <Styled.Section>
                <Styled.H2>Hide with CSS vs Unmount</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Unmount (conditional render false)</b>: component is removed; state/effects are cleaned up.
                    </li>
                    <li>
                        <b>Hide with CSS</b> (<Styled.InlineCode>hidden</Styled.InlineCode> or <Styled.InlineCode>display:none</Styled.InlineCode>): node stays mounted; state is preserved.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Unmount (state resets on next mount)
{open && <Dialog />}

// Hide (state preserved)
<Dialog hidden={!open} />`}
                </Styled.Pre>
                <Styled.Small>
                    Pick deliberately: unmount to free resources; hide to keep state (e.g., tabs).
                </Styled.Small>
            </Styled.Section>

            {/* Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility notes</Styled.H2>
                <Styled.List>
                    <li>Announce async results/errors in an <Styled.InlineCode>aria-live="polite"</Styled.InlineCode> region.</li>
                    <li>Do not hide focusable content without managing focus; move focus to the newly revealed region when appropriate.</li>
                    <li>For dialogs/menus, use proper roles and focus traps; conditionally render the overlay and content together.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<p aria-live="polite">{statusMsg}</p>`}
                </Styled.Pre>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Conditional hooks (❌):</b> hooks must run in the same order on every render.
                        Never call hooks inside a branch that might be skipped.
                    </li>
                    <li>
                        <b>Nested ternaries:</b> quickly become unreadable. Extract variables, use maps, or early returns.
                    </li>
                    <li>
                        <b>&& with non-boolean values:</b> <Styled.InlineCode>{`{count && <Badge />}`}</Styled.InlineCode> shows <em>0</em> when <Styled.InlineCode>count</Styled.InlineCode> is 0. Use <Styled.InlineCode>count &gt; 0</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Expensive conditions in JSX:</b> compute once above and reuse the result in JSX.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// ❌ Wrong: conditional hook
function Comp({ show }) {
  if (show) { const [x] = useState(0); } // don't do this
  return null;
}

// ✅ Right
function Comp({ show }) {
  const [x] = useState(0); // always called
  return show ? <Pane x={x} /> : null;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use a ternary for clear if/else.</li>
                    <li><b>Do</b> use <Styled.InlineCode>&&</Styled.InlineCode> for simple “render if truthy” cases.</li>
                    <li><b>Do</b> return early to keep JSX shallow.</li>
                    <li><b>Do</b> use a map/object for multiple states.</li>
                    <li><b>Don’t</b> call hooks conditionally.</li>
                    <li><b>Don’t</b> rely on <Styled.InlineCode>&&</Styled.InlineCode> with values like <Styled.InlineCode>0</Styled.InlineCode>—coerce to boolean or compare.</li>
                    <li><b>Don’t</b> overuse nested ternaries—extract helpers.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep conditions as expressions, prefer ternary for if/else,
                <Styled.InlineCode>&&</Styled.InlineCode> for guards, early returns for clarity, and maps for multiple states.
                Never call hooks conditionally; choose unmount vs hide intentionally.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Conditional;
