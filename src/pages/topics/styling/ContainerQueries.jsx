import { Styled } from "./styled";

const ContainerQueries = () => {
    return (
        <Styled.Page>
            <Styled.Title>Container Queries</Styled.Title>

            <Styled.Lead>
                <b>Container Queries</b> let components style themselves based on the <i>size of their nearest
                    container</i> instead of the <i>viewport</i>. This makes UI pieces truly reusable across sidebars,
                cards, modals, and dashboards without brittle viewport breakpoints.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>container</b> is an element that establishes a query context using{" "}
                        <Styled.InlineCode>container-type</Styled.InlineCode> (or shorthand{" "}
                        <Styled.InlineCode>container</Styled.InlineCode>).
                    </li>
                    <li>
                        An <b>@container query</b> applies styles when the container meets conditions like{" "}
                        <Styled.InlineCode>(min-width: 480px)</Styled.InlineCode>.
                    </li>
                    <li>
                        Use when a component should adapt to its <i>allocated space</i> (e.g., a Card that lays out
                        media and text differently when wider).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Enabling a container */}
            <Styled.Section>
                <Styled.H2>Enable a Container</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Inline-size</b> is the most common: queries respond to the element’s inline axis (width in
                        LTR/RTL languages).
                    </li>
                    <li>
                        <b>Size</b> tracks both inline and block axes (width & height). Slightly heavier; use when
                        height matters.
                    </li>
                    <li>
                        You can also give the container a <b>name</b> to target it explicitly.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Plain CSS */
.card { 
  container-type: inline-size;      /* or: size */
  container-name: card;
  /* shorthand: container: card / inline-size; */
}

/* styled-components */
const Card = styled.div\`
  container: card / inline-size;
  padding: 16px;
\`;`}
                </Styled.Pre>
                <Styled.Small>
                    Without <Styled.InlineCode>container-type</Styled.InlineCode>, @container rules won’t match.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Writing a container query */}
            <Styled.Section>
                <Styled.H2>Write an @container Query</Styled.H2>
                <Styled.List>
                    <li>
                        Syntax mirrors media queries, but it targets the <i>nearest ancestor container</i>.
                    </li>
                    <li>
                        You can query by <Styled.InlineCode>width</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>inline-size</Styled.InlineCode>, and when using{" "}
                        <Styled.InlineCode>container-name</Styled.InlineCode>, you can scope with the name.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Target any nearest container */
@container (min-width: 380px) {
  .card__title { font-size: 1.125rem; }
}

/* Target a specific named container */
@container card (min-width: 520px) {
  .card__grid { grid-template-columns: 1fr 2fr; gap: 16px; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Component example: Card that adapts */}
            <Styled.Section>
                <Styled.H2>Example: Adaptive Card</Styled.H2>
                <Styled.Pre>
                    {`/* CSS/SCSS */
.card { 
  container: card / inline-size; 
  display: grid; 
  gap: 12px; 
}

.card__media { aspect-ratio: 16/9; background: var(--surface-2); }
.card__title { font-size: 1rem; font-weight: 600; }
.card__meta { color: var(--text-2); }

@container card (min-width: 420px) {
  .card { grid-template-columns: 160px 1fr; align-items: center; }
  .card__title { font-size: 1.125rem; }
}

@container card (min-width: 640px) {
  .card__title { font-size: 1.25rem; }
  .card__meta { display: grid; grid-auto-flow: column; gap: 12px; }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Drop the same <Styled.InlineCode>.card</Styled.InlineCode> into narrow sidebars or wide content
                    areas—styles adapt to its container width automatically.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Container query units */}
            <Styled.Section>
                <Styled.H2>Container Query Units</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>cqw / cqh</Styled.InlineCode>: 1% of container width/height.
                    </li>
                    <li>
                        <Styled.InlineCode>cqi / cqb</Styled.InlineCode>: 1% of container inline/block size (writing-mode aware).
                    </li>
                    <li>
                        <Styled.InlineCode>cqmin / cqmax</Styled.InlineCode>: min/max of inline/block sizes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Make the badge always ~20% of the container's inline-size */
.card__badge { width: 20cqi; height: 20cqi; border-radius: 50%; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Named containers & nesting */}
            <Styled.Section>
                <Styled.H2>Named Containers & Nesting</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>container-name</Styled.InlineCode> to avoid accidentally matching a
                        higher ancestor container.
                    </li>
                    <li>
                        Nested components can each establish their own containers; queries always resolve against the
                        <i> nearest matching</i> container.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Two levels: a Section and inner Card containers */
.section { container: section / inline-size; padding: 24px; }
.card { container: card / inline-size; }

/* This query targets the nearest 'card' container only */
@container card (min-width: 560px) {
  .card__actions { justify-content: flex-end; }
}

/* A broader layout change for the section container */
@container section (min-width: 900px) {
  .section__grid { grid-template-columns: 2fr 1fr; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Patterns vs media queries */}
            <Styled.Section>
                <Styled.H2>Patterns: Container vs Media Queries</Styled.H2>
                <Styled.List>
                    <li>
                        Keep <b>global layout</b> (header/sidebar presence, app shell) with <b>media queries</b>.
                    </li>
                    <li>
                        Use <b>container queries</b> inside components (cards, tiles, toolbars, list items) to adapt
                        per-slot.
                    </li>
                    <li>
                        This separation prevents “one-size-fits-all” viewport breakpoints from breaking isolated
                        components.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Media for global shells */
@media (min-width: 1024px) {
  .app { grid-template-columns: 280px 1fr; }
}

/* Container for components */
.widget { container: widget / inline-size; }
@container widget (min-width: 480px) { .widget__row { display: grid; grid-template-columns: 1fr 1fr; } }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Style queries (optional advanced) */}
            <Styled.Section>
                <Styled.H2>Style Queries (Advanced)</Styled.H2>
                <Styled.List>
                    <li>
                        Style queries test a <i>custom property</i> on the container, enabling mode/variant-based
                        styling without extra classes.
                    </li>
                    <li>Guard usage based on your target browsers and progressive enhancement needs.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Container with a custom property that toggles variant */
.card { 
  container: card / inline-size; 
  --variant: "compact"; 
}

/* Apply styles when the container exposes a matching custom property value */
@container style(--variant: "compact") {
  .card__meta { display: none; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Performance & gotchas */}
            <Styled.Section>
                <Styled.H2>Performance & Gotchas</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Be selective</b>: making every element a container increases evaluation work. Choose key
                        wrappers (cards, widgets, sections).
                    </li>
                    <li>
                        <b>Min-content size</b>: set <Styled.InlineCode>min-width: 0</Styled.InlineCode> on grid/flex
                        children to allow shrinking, or queries may not trigger as expected.
                    </li>
                    <li>
                        <b>Overflow and borders</b> affect measured size; account for padding/border when designing
                        thresholds.
                    </li>
                    <li>
                        <b>Nesting</b>: queries resolve to the nearest matching container—name them to avoid
                        surprises.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> establish containers on reusable components (cards, widgets, panels).</li>
                    <li><b>Do</b> use <Styled.InlineCode>inline-size</Styled.InlineCode> for most cases; switch to{" "}
                        <Styled.InlineCode>size</Styled.InlineCode> only when height is relevant.</li>
                    <li><b>Do</b> keep breakpoint values semantic (e.g., 28rem, 40rem) aligned with design tokens.</li>
                    <li><b>Don’t</b> replace every media query; split responsibilities: layout (media) vs component (container).</li>
                    <li><b>Don’t</b> forget <Styled.InlineCode>min-width: 0</Styled.InlineCode> in flex/grid items to
                        allow shrinking.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: define <i>containers</i> on components, then write <i>@container</i> rules to adapt
                layout and type as space changes. Use container query units for fluid sizing, keep performance in
                mind, and reserve global media queries for the app shell.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ContainerQueries;
