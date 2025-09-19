import { Styled } from "./styled";

const CodeMetrics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Code Metrics</Styled.Title>

            <Styled.Lead>
                <b>Code metrics</b> are simple numbers that describe your code and its runtime behavior.
                They help you spot complexity, risky files, large bundles, slow pages, and unnecessary re-renders.
                Treat them as <i>signals</i> to guide refactors—not as strict rules.
            </Styled.Lead>

            {/* 1) Why metrics */}
            <Styled.Section>
                <Styled.H2>Why care about metrics?</Styled.H2>
                <Styled.List>
                    <li><b>Predictability:</b> lower complexity → easier reasoning and fewer bugs.</li>
                    <li><b>Performance:</b> smaller bundles + fewer re-renders → faster UI.</li>
                    <li><b>Focus:</b> metrics reveal <i>hotspots</i> where effort brings the biggest wins.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Source-level metrics */}
            <Styled.Section>
                <Styled.H2>Source-level metrics (static)</Styled.H2>

                <Styled.H3>Lines of Code (LOC / SLOC)</Styled.H3>
                <Styled.List>
                    <li><b>LOC:</b> total lines including blanks/comments. <b>SLOC:</b> only executable lines.</li>
                    <li><b>Use:</b> quick size sense. Large files often hide complexity.</li>
                </Styled.List>

                <Styled.H3>Cyclomatic Complexity (CC)</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> number of independent paths through code. More branches/early returns → higher CC.</li>
                    <li><b>Why it matters:</b> high CC is harder to test and reason about.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// CC grows with branching:
function validate(user) {
  if (!user) return false;             // +1 path
  if (!user.email) return false;       // +1 path
  if (user.age < 18) return false;     // +1 path
  return /@/.test(user.email);         // +1 path
}`}</Styled.Pre>
                <Styled.Small>Refactor by extracting helpers or using data-driven checks to reduce branching.</Styled.Small>

                <Styled.H3>Cognitive Complexity</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> measures how hard code is to understand for a human (nesting, flow breaks, deep conditions).</li>
                    <li><b>Tip:</b> flatten logic, early-return small cases, avoid deep nesting.</li>
                </Styled.List>

                <Styled.H3>Maintainability Index (MI)</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> combined score based on LOC, complexity, and Halstead metrics. Higher is better.</li>
                    <li><b>Use:</b> track trend over time; don't chase a “perfect” value.</li>
                </Styled.List>

                <Styled.H3>Duplication %</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> portion of code that's repeated.</li>
                    <li><b>Fix:</b> extract reusable utilities/components; prefer composition.</li>
                </Styled.List>

                <Styled.H3>Churn</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> how frequently a file changes (e.g., per week/month).</li>
                    <li><b>Signal:</b> high churn + high complexity ⇒ prime refactor candidate.</li>
                </Styled.List>

                <Styled.H3>Coupling</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> how many other files/modules something depends on (and vice-versa).</li>
                    <li><b>Goal:</b> keep components focused; avoid wide “reach” into many folders.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) React-specific metrics */}
            <Styled.Section>
                <Styled.H2>React-specific signals</Styled.H2>

                <Styled.H3>Re-render Rate</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> how often a component re-renders when state/props/context change.</li>
                    <li><b>How to see:</b> React DevTools → Profiler → record interactions.</li>
                </Styled.List>

                <Styled.H3>Wasted Renders</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> renders that don't produce visible DOM changes.</li>
                    <li><b>Reduce:</b> memoize expensive children, stabilize props, split components.</li>
                </Styled.List>

                <Styled.H3>Memo Hit Ratio</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> % of times <Styled.InlineCode>React.memo</Styled.InlineCode> or <Styled.InlineCode>useMemo</Styled.InlineCode> actually avoids work.</li>
                    <li><b>Tip:</b> memo only when inputs are stable and the child is expensive to render.</li>
                </Styled.List>

                <Styled.H3>Prop Drilling Depth</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> how many levels a prop travels down before use.</li>
                    <li><b>Fix:</b> lift state closer, use context (sparingly), or localize state.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Wasted renders: unstable inline objects/functions
function List({ items, onPick }) {
  return items.map(item => (
    <Row
      key={item.id}
      style={{ padding: 8 }}            // <- new object each render
      onClick={() => onPick(item.id)}   // <- new fn each render
    />
  ));
}

// Better: hoist stable values
const rowStyle = { padding: 8 };
function ListBetter({ items, onPick }) {
  const handlePick = React.useCallback((id) => onPick(id), [onPick]);
  return items.map(item => (
    <Row key={item.id} style={rowStyle} onClick={() => handlePick(item.id)} />
  ));
}`}</Styled.Pre>
                <Styled.Small>Stabilize props to help memoized children and reduce needless work.</Styled.Small>
            </Styled.Section>

            {/* 4) Bundle & runtime metrics */}
            <Styled.Section>
                <Styled.H2>Bundle & Runtime metrics</Styled.H2>

                <Styled.H3>Bundle Size</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> total KB shipped to the browser for a route.</li>
                    <li><b>Tooling:</b> Vite + <i>source-map-explorer</i> or <i>webpack-bundle-analyzer</i>.</li>
                </Styled.List>

                <Styled.H3>Tree Shaking</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> removing unused exports during build.</li>
                    <li><b>Tip:</b> prefer ESM imports; avoid wildcard <Styled.InlineCode>import *</Styled.InlineCode> from large libs.</li>
                </Styled.List>

                <Styled.H3>Web Vitals</Styled.H3>
                <Styled.List>
                    <li><b>LCP (Largest Contentful Paint):</b> time until main content is visible.</li>
                    <li><b>CLS (Cumulative Layout Shift):</b> visual stability; lower is better.</li>
                    <li><b>TBT (Total Blocking Time):</b> main-thread blocked during load; affects interactivity.</li>
                    <li><b>TTI (Time To Interactive):</b> when the page reliably responds to input.</li>
                    <li><b>FCP (First Contentful Paint):</b> first pixel of content painted.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example: dynamic import to cut initial bundle size
const ProductChart = React.lazy(() => import("../charts/ProductChart"));

function Dashboard() {
  return (
    <React.Suspense fallback={<div>Loading chart...</div>}>
      <ProductChart />
    </React.Suspense>
  );
}`}</Styled.Pre>
                <Styled.Small>Code-split heavy widgets; keep the initial route light for better LCP/TTI.</Styled.Small>
            </Styled.Section>

            {/* 5) Test & quality metrics */}
            <Styled.Section>
                <Styled.H2>Test & Quality metrics</Styled.H2>

                <Styled.H3>Coverage</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> % of code executed by tests (lines/branches/functions).</li>
                    <li><b>Note:</b> 100% coverage doesn't guarantee quality—cover meaningful paths.</li>
                </Styled.List>

                <Styled.H3>Lint Rule Violations</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> number/severity of rule hits (e.g., complexity, no-unused-vars, hooks rules).</li>
                    <li><b>Goal:</b> keep violations near zero; track new ones in CI to avoid drift.</li>
                </Styled.List>

                <Styled.H3>Accessibility (a11y) findings</Styled.H3>
                <Styled.List>
                    <li><b>Definition:</b> issues like missing labels, poor contrast, wrong semantics.</li>
                    <li><b>Tooling:</b> eslint-plugin-jsx-a11y, Axe DevTools, Lighthouse a11y score.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) How to measure: tools */}
            <Styled.Section>
                <Styled.H2>How to measure (common tools)</Styled.H2>
                <Styled.List>
                    <li><b>ESLint:</b> enable <Styled.InlineCode>complexity</Styled.InlineCode>, <Styled.InlineCode>max-lines</Styled.InlineCode>, <Styled.InlineCode>max-depth</Styled.InlineCode>, and hooks rules.</li>
                    <li><b>SonarJS / SonarQube:</b> cognitive complexity, duplication, hotspots dashboard.</li>
                    <li><b>dependency-cruiser:</b> visualize imports; catch circular dependencies.</li>
                    <li><b>ts-prune / knip:</b> detect unused exports/dependencies.</li>
                    <li><b>Vite + source-map-explorer:</b> inspect bundle composition.</li>
                    <li><b>Lighthouse / WebPageTest / Web Vitals:</b> LCP/CLS/TBT/TTI/FCP.</li>
                    <li><b>React DevTools Profiler:</b> record interactions and re-render flamegraphs.</li>
                    <li><b>Vitest + c8 (Istanbul):</b> coverage reports in CI.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> baseline metrics early, then track trends (getting better or worse?).</li>
                    <li><b>Do</b> tackle <i>high-churn + high-complexity</i> files first.</li>
                    <li><b>Do</b> code-split heavy routes and memoize expensive children.</li>
                    <li><b>Don't</b> optimize blindly—measure first, then change.</li>
                    <li><b>Don't</b> chase perfect scores; ship incremental improvements.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Mini checklist */}
            <Styled.Section>
                <Styled.H2>Mini checklist (React app)</Styled.H2>
                <Styled.List>
                    <li>CC ≤ 10 per function where reasonable; extract helpers if higher.</li>
                    <li>Large components (&gt;200 SLOC) → split by concern (view, data, item).</li>
                    <li>Memoize expensive children; stabilize props to reduce wasted renders.</li>
                    <li>Keep initial route bundle lean; lazy-load charts/editors/modals.</li>
                    <li>Track Web Vitals in CI; investigate regressions immediately.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use metrics to find the 20% of code causing 80% of pain. Measure, refactor in small
                steps, and keep your React UI fast, predictable, and easy to change.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CodeMetrics;
