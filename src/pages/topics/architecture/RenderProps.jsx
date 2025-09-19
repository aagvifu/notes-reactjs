import React from "react";
import { Styled } from "./styled";

/**
 * Render Props — Architecture & Patterns
 *
 * A "render prop" is a component API where the component receives a function
 * and INVOKES that function to decide WHAT to render. The parent (consumer)
 * controls the UI; the render-prop component supplies the data/behaviors.
 */

const RenderProps = () => {
    return (
        <Styled.Page>
            <Styled.Title>Render Props</Styled.Title>

            <Styled.Lead>
                <b>Render props</b> is a pattern where a component accepts a{" "}
                <b>function</b> (often via the <Styled.InlineCode>children</Styled.InlineCode> prop or a prop
                named <Styled.InlineCode>render</Styled.InlineCode>) and <em>calls</em> it to render UI.
                This lets you <b>share stateful logic</b> while letting consumers decide the markup.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Render prop:</b> a prop whose value is a function that the component calls to render UI,
                        e.g. <Styled.InlineCode>{`children={(api) => <UI ... />}`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Function-as-children (FaCC):</b> a specific form of render props that uses{" "}
                        <Styled.InlineCode>props.children</Styled.InlineCode> as a function instead of JSX nodes.
                    </li>
                    <li>
                        <b>Provider vs Render Props:</b> a <i>Provider</i> broadcasts values via context to any
                        descendant; a <i>Render Prop</i> explicitly renders using a passed function.
                    </li>
                    <li>
                        <b>Headless component:</b> a component that contains logic but no visual styling of its own.
                        Render props are a common way to build headless components.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why use it */}
            <Styled.Section>
                <Styled.H2>Why Render Props?</Styled.H2>
                <Styled.List>
                    <li>Share logic (state, effects, event handling) without dictating UI structure.</li>
                    <li>Compose different UIs on top of the same behavior (flexibility).</li>
                    <li>Keep components small and focused (logic separate from presentation).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Example</Styled.H2>
                <Styled.Pre>
                    {`// A headless Toggle component that exposes state + actions via a render prop.
function Toggle({ children, initial = false }) {
  const [on, setOn] = React.useState(!!initial);
  const toggle = React.useCallback(() => setOn(v => !v), []);
  const setTrue = React.useCallback(() => setOn(true), []);
  const setFalse = React.useCallback(() => setOn(false), []);

  // Call the render function with an "API object"
  return children({ on, toggle, setTrue, setFalse });
}

// Consumer chooses the UI freely
function Example() {
  return (
    <Toggle initial>
      {({ on, toggle }) => (
        <button onClick={toggle} aria-pressed={on}>
          {on ? "ON" : "OFF"}
        </button>
      )}
    </Toggle>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The <Styled.InlineCode>Toggle</Styled.InlineCode> has the logic; the consumer decides the
                    markup. This is the essence of render props.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Children vs render prop names */}
            <Styled.Section>
                <Styled.H2>API Styles: <code>children</code> vs <code>render</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Children as function (FaCC):</b> idiomatic and concise; common in the React ecosystem.
                    </li>
                    <li>
                        <b>Named prop (render):</b> explicit and self-documenting; useful when you also accept
                        normal children.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// 1) Function-as-children
<DataFetcher url="/api/user">
  {(state) => <UserCard {...state} />}
</DataFetcher>

// 2) Named render prop
<DataFetcher url="/api/user" render={(state) => <UserCard {...state} />} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Realistic example: DataFetcher */}
            <Styled.Section>
                <Styled.H2>Realistic Example: <code>DataFetcher</code></Styled.H2>
                <Styled.Pre>
                    {`function DataFetcher({ url, children }) {
  const [state, setState] = React.useState({ status: "idle", data: null, error: null });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
      .then(data => { if (!cancelled) setState({ status: "success", data, error: null }); })
      .catch(error => { if (!cancelled) setState({ status: "error", data: null, error }); });

    return () => { cancelled = true; };
  }, [url]);

  // Let consumers render loading/error/success however they want
  return children(state);
}

// Consumer
function Profile() {
  return (
    <DataFetcher url="/api/user">
      {({ status, data, error }) => {
        if (status === "loading") return <p>Loading…</p>;
        if (status === "error") return <p role="alert">Failed: {String(error)}</p>;
        return <div>{data.name}</div>;
      }}
    </DataFetcher>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Event & state helpers (prop getters) */}
            <Styled.Section>
                <Styled.H2>Prop Getters (Ergonomics)</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>prop getter</b> is a function that returns a set of props (handlers/aria/ids)
                        for wiring UI elements. It standardizes accessibility and behavior.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function Toggle({ children }) {
  const [on, setOn] = React.useState(false);
  const toggle = React.useCallback(() => setOn(v => !v), []);
  const getButtonProps = React.useCallback(
    (props = {}) => ({
      "aria-pressed": on,
      onClick: (e) => {
        props.onClick?.(e);
        toggle();
      },
      ...props,
    }),
    [on, toggle]
  );

  return children({ on, getButtonProps });
}

// Consumer ensures a11y with minimal effort
<Toggle>
  {({ on, getButtonProps }) => (
    <button {...getButtonProps({ className: "btn" })}>
      {on ? "ON" : "OFF"}
    </button>
  )}
</Toggle>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) When to use vs Hooks/Context */}
            <Styled.Section>
                <Styled.H2>When to Use (vs Hooks & Context)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prefer Hooks</b> for sharing logic in modern React—hooks are simpler and avoid extra
                        component layers. Render props remain useful when you need to <b>control rendering</b>
                        from the parent or combine with <b>headless components</b>.
                    </li>
                    <li>
                        <b>Use Context/Provider</b> for app-wide or shared values across distant components.
                        Render props are more local and explicit.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Performance & pitfalls */}
            <Styled.Section>
                <Styled.H2>Performance & Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Re-renders:</b> a new render function identity each render can cause downstream
                        updates. Mitigate with memoization at consumer boundaries if needed.
                    </li>
                    <li>
                        <b>Deep trees:</b> render-prop components add to the tree. Excessive nesting can reduce
                        readability—consider hooks or composition.
                    </li>
                    <li>
                        <b>Accessibility:</b> expose prop getters that include required ARIA/keyboard handlers.
                    </li>
                    <li>
                        <b>SSR:</b> safe by default; ensure any browser APIs are guarded in the logic layer.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don’t */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep the API tiny: return a well-named object with state + actions.</li>
                    <li><b>Do</b> document whether children or <Styled.InlineCode>render</Styled.InlineCode> is used.</li>
                    <li><b>Don’t</b> hard-code markup in the logic component—stay headless.</li>
                    <li><b>Don’t</b> overuse when a simple custom hook is enough.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Render prop:</b> function prop used to decide what to render.</li>
                    <li><b>Function-as-children (FaCC):</b> using <code>children</code> as a function.</li>
                    <li><b>Headless component:</b> logic-only, no visual styling.</li>
                    <li><b>Prop getter:</b> helper that returns standardized props for UI elements.</li>
                    <li><b>Provider pattern:</b> using React Context to distribute shared values.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Render props separate <i>logic</i> from <i>presentation</i> by letting consumers
                render anything using the API you expose. Prefer hooks for most logic-sharing, but reach for
                render props when consumers must fully control the UI.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RenderProps;
