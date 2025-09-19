import { Styled } from "./styled";

const DevTools = () => {
    return (
        <Styled.Page>
            <Styled.Title>React DevTools</Styled.Title>

            <Styled.Lead>
                <b>React DevTools</b> is a browser extension that lets you inspect your React component tree,
                props, state, hooks, performance, and re-renders. It adds two main tabs to your browser DevTools:
                <b> Components</b> and <b>Profiler</b>.
            </Styled.Lead>

            {/* 1) What is it? */}
            <Styled.Section>
                <Styled.H2>What is React DevTools?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Browser extension:</b> Adds React-specific panels to Chrome/Edge/Firefox DevTools.
                        It detects a page running React and lets you inspect it like a native app.
                    </li>
                    <li>
                        <b>Components tab:</b> Explore the live <i>component tree</i>, read props/state, edit values,
                        and see where updates occur.
                    </li>
                    <li>
                        <b>Profiler tab:</b> Record how long each component render took and why it re-rendered.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (plain English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Component Tree:</b> The hierarchy of your React components (parents, children, siblings).
                    </li>
                    <li>
                        <b>Render:</b> When React calls your component function to produce UI (JSX → UI).
                    </li>
                    <li>
                        <b>Re-render:</b> A component renders again because its <b>props</b>, <b>state</b>, or some
                        <b>context</b> it uses changed.
                    </li>
                    <li>
                        <b>Commit phase:</b> The moment React applies computed UI updates to the real DOM.
                    </li>
                    <li>
                        <b>Memoization:</b> Remembering a previous value so React can skip re-doing work when inputs didn't change
                        (e.g., <Styled.InlineCode>React.memo</Styled.InlineCode>, <Styled.InlineCode>useMemo</Styled.InlineCode>,
                        <Styled.InlineCode>useCallback</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Strict Mode (dev only):</b> Helps find side-effects by intentionally double-invoking some lifecycles in development.
                        This can make “renders” appear twice in DevTools during local development—normal and expected.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Install & open */}
            <Styled.Section>
                <Styled.H2>Install &amp; Open</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Install:</b> Add the “React Developer Tools” extension from your browser's store (Chrome/Edge/Firefox).
                    </li>
                    <li>
                        <b>Open:</b> Right-click → <i>Inspect</i> → find the <b>Components</b> and <b>Profiler</b> tabs near “Elements/Console”.
                    </li>
                    <li>
                        <b>Vite dev server:</b> Run your app (<Styled.InlineCode>npm run dev</Styled.InlineCode>).
                        When the extension detects React, the tabs appear automatically.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Components tab */}
            <Styled.Section>
                <Styled.H2>Components Tab — Inspect Everything</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Left pane:</b> The component tree. Click a component to inspect it.
                    </li>
                    <li>
                        <b>Right pane:</b> Shows <b>Props</b>, <b>Hooks</b> (state, reducers, refs, memo), and <b>Context</b>.
                        You can edit props/state of selected components (where supported) to test UI quickly.
                    </li>
                    <li>
                        <b>Highlight updates:</b> Toggle the “Highlight updates when components render” option.
                        React will flash components on screen whenever they re-render.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example component to see in Components tab
function Counter({ initial = 0 }) {
  const [count, setCount] = React.useState(initial);

  // Try toggling this to observe memoization in action
  const doubled = React.useMemo(() => count * 2, [count]);

  return (
    <div>
      <p>Count: {count} (doubled: {doubled})</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
Counter.displayName = "CounterDemo"; // shows as this name in DevTools
`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Tip:</b> Set <Styled.InlineCode>displayName</Styled.InlineCode> on components (especially HOCs) so they're easier to
                    find in the tree.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Hooks view + useDebugValue */}
            <Styled.Section>
                <Styled.H2>Hooks Panel &amp; <code>useDebugValue</code> for Custom Hooks</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Hooks panel:</b> Shows each hook's current value. Great for peeking into{" "}
                        <Styled.InlineCode>useState</Styled.InlineCode>, <Styled.InlineCode>useReducer</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>useMemo</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        <b>useDebugValue:</b> Lets custom hooks label their current status/value so DevTools displays a friendly line.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Custom hook with useDebugValue to improve visibility in DevTools
function useToggle(initial = false) {
  const [on, setOn] = React.useState(!!initial);
  const toggle = React.useCallback(() => setOn(v => !v), []);
  React.useDebugValue(on ? "ON" : "OFF"); // shows beside the hook in DevTools
  return [on, toggle];
}

function Bulb() {
  const [on, toggle] = useToggle();
  return (
    <button onClick={toggle} aria-pressed={on}>
      Bulb: {on ? "💡" : "💤"}
    </button>
  );
}`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Good practice:</b> Add concise labels (like “IDLE/LOADING/SUCCESS/ERROR”) for async hooks using{" "}
                    <Styled.InlineCode>useDebugValue</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Profiler intro */}
            <Styled.Section>
                <Styled.H2>Profiler Tab — Measure Renders</Styled.H2>
                <Styled.List>
                    <li>
                        <b>What it does:</b> Records how long each component render took and <i>why</i> it happened
                        (prop change, state change, parent re-render, context update, etc.).
                    </li>
                    <li>
                        <b>How to use:</b> Open <b>Profiler</b> → click <b>Start profiling</b> → interact with your app →
                        click <b>Stop profiling</b>. Examine the flame chart and component timings.
                    </li>
                    <li>
                        <b>Goal:</b> Find “hot” components that re-render often/slowly, then reduce work (memoization, split components, move state down).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Optional: Wrap parts of your app with React.Profiler to log summary info in console
import { Profiler } from "react";

function onRenderProfiler(
  id,            // the "id" prop of the Profiler tree that has just committed
  phase,         // "mount" or "update"
  actualDuration // time spent rendering the committed update
) {
  console.log("[Profiler]", { id, phase, actualDuration });
}

function App() {
  return (
    <Profiler id="MainArea" onRender={onRenderProfiler}>
      {/* your routes/components here */}
    </Profiler>
  );
}
`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Note:</b> The Profiler tab in the extension is usually enough. The{" "}
                    <Styled.InlineCode>&lt;Profiler&gt;</Styled.InlineCode> API is optional and useful for
                    custom logging or CI experiments.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Typical workflow */}
            <Styled.Section>
                <Styled.H2>Typical Debugging Workflow</Styled.H2>
                <Styled.List>
                    <li><b>Step 1:</b> Reproduce the issue in development with your Vite server running.</li>
                    <li><b>Step 2:</b> Open <b>Components</b> → find the component → inspect props/state/hooks.</li>
                    <li><b>Step 3:</b> Toggle <b>Highlight updates</b> and interact to see what re-renders.</li>
                    <li><b>Step 4:</b> If it's a performance issue, switch to <b>Profiler</b> and record.</li>
                    <li><b>Step 5:</b> Apply a fix (state colocation, memoization). Re-profile to confirm improvement.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> name components (<Styled.InlineCode>displayName</Styled.InlineCode>) so they're easy to find.</li>
                    <li><b>Do</b> use <Styled.InlineCode>useDebugValue</Styled.InlineCode> for custom hooks that hold important state.</li>
                    <li><b>Do</b> profile before optimizing; measure first, then fix <i>specific</i> hot spots.</li>
                    <li><b>Don't</b> panic about dev-only double renders under Strict Mode—it's a feature, not a bug.</li>
                    <li><b>Don't</b> over-memoize everything. Memoization has a cost; apply where it reduces meaningful re-renders.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Tabs not showing?</b> Ensure the extension is installed and your app is running a React build (dev server). Reload the page.
                    </li>
                    <li>
                        <b>Too many renders in dev?</b> Check if Strict Mode is enabled. Double invocations happen only in development.
                    </li>
                    <li>
                        <b>Slow profile even after fixes?</b> Check large lists, expensive computations, or unnecessary context updates.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                React DevTools is your X-ray. Use the <b>Components</b> tab to understand data flow
                and the <b>Profiler</b> to measure real costs. Name components, label custom hooks,
                and optimize based on evidence—not guesses.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DevTools;
