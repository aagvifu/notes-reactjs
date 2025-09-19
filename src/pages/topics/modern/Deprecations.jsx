// src/pages/topics/modern/Deprecations.jsx
import React from "react";
import { Styled } from "./styled";

/**
 * Modern React — Deprecations
 * A beginner-friendly guide to React APIs you should avoid today,
 * what they mean, why they’re problematic, and how to migrate.
 */
const Deprecations = () => {
    return (
        <Styled.Page>
            <Styled.Title>Deprecations (Modern React)</Styled.Title>

            <Styled.Lead>
                As React evolved (17 → 18+), several <b>legacy patterns and APIs</b> became discouraged or
                deprecated. This page explains each one in plain language, shows the modern
                replacement, and gives practical migration steps.
            </Styled.Lead>

            {/* 0) What does "deprecated" mean? */}
            <Styled.Section>
                <Styled.H2>What does “deprecated” mean?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Deprecated:</b> The API still exists for now, but you should avoid using it. It may be removed in a future major version.
                    </li>
                    <li>
                        <b>Legacy:</b> Not technically removed, but considered old style; there is a recommended modern alternative.
                    </li>
                    <li>
                        <b>Breaking change:</b> An API removed/changed in a major version update. Deprecation is the warning phase before this.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Legacy lifecycles */}
            <Styled.Section>
                <Styled.H2>Legacy Class Lifecycles</Styled.H2>
                <Styled.P>
                    The following lifecycle methods are considered <b>legacy</b> and unsafe for async rendering:
                    <Styled.InlineCode>componentWillMount</Styled.InlineCode>,{" "}
                    <Styled.InlineCode>componentWillReceiveProps</Styled.InlineCode>,{" "}
                    <Styled.InlineCode>componentWillUpdate</Styled.InlineCode>. You may see “UNSAFE_” prefixed versions in older code.
                </Styled.P>
                <Styled.List>
                    <li>
                        <b>Why deprecated?</b> They run at times that make logic fragile under concurrent rendering and can cause bugs on re-renders.
                    </li>
                    <li>
                        <b>Modern replacements:</b> move side effects to{" "}
                        <Styled.InlineCode>componentDidMount</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>componentDidUpdate</Styled.InlineCode> or, in function components, to{" "}
                        <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.H3>Before (legacy):</Styled.H3>
                <Styled.Pre>
                    {`class Profile extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.load(nextProps.userId);
    }
  }
  // ...
}`}
                </Styled.Pre>

                <Styled.H3>After (modern):</Styled.H3>
                <Styled.Pre>
                    {`function Profile({ userId }) {
  React.useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
      if (active) {/* set state with data */ }
    })();
    return () => { active = false; };
  }, [userId]);

  return /* UI */;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Note: prefer function components and hooks for new code. If you keep classes, use
                    <Styled.InlineCode>componentDidMount/DidUpdate</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 2) String refs */}
            <Styled.Section>
                <Styled.H2>String Refs (deprecated)</Styled.H2>
                <Styled.P>
                    Old code sometimes uses <Styled.InlineCode>ref="name"</Styled.InlineCode>. This is deprecated.
                    Use <Styled.InlineCode>createRef</Styled.InlineCode> (class) or{" "}
                    <Styled.InlineCode>useRef</Styled.InlineCode> (function) instead.
                </Styled.P>

                <Styled.H3>Before:</Styled.H3>
                <Styled.Pre>
                    {`class Form extends React.Component {
  handleSubmit = () => {
    // ❌ deprecated string ref
    console.log(this.refs.email.value);
  };
  render() {
    return <input ref="email" />;
  }
}`}
                </Styled.Pre>

                <Styled.H3>After (class with createRef):</Styled.H3>
                <Styled.Pre>
                    {`class Form extends React.Component {
  emailRef = React.createRef();
  handleSubmit = () => console.log(this.emailRef.current.value);
  render() { return <input ref={this.emailRef} />; }
}`}
                </Styled.Pre>

                <Styled.H3>After (function with useRef):</Styled.H3>
                <Styled.Pre>
                    {`function Form() {
  const emailRef = React.useRef(null);
  const handleSubmit = () => console.log(emailRef.current?.value);
  return <input ref={emailRef} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) findDOMNode */}
            <Styled.Section>
                <Styled.H2><code>findDOMNode</code> (deprecated)</Styled.H2>
                <Styled.P>
                    <Styled.InlineCode>ReactDOM.findDOMNode(component)</Styled.InlineCode> is deprecated because it breaks encapsulation and doesn’t work with some future renderers.
                    Instead, attach a <b>ref directly</b> to the DOM node.
                </Styled.P>

                <Styled.H3>Before:</Styled.H3>
                <Styled.Pre>
                    {`class Box extends React.Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this); // ❌
    el.focus();
  }
  render() { return <div tabIndex={-1}>Hi</div>; }
}`}
                </Styled.Pre>

                <Styled.H3>After:</Styled.H3>
                <Styled.Pre>
                    {`function Box() {
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current?.focus(); }, []);
  return <div tabIndex={-1} ref={ref}>Hi</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Legacy Context API */}
            <Styled.Section>
                <Styled.H2>Legacy Context API (contextTypes) </Styled.H2>
                <Styled.P>
                    The pre-16.3 context used <Styled.InlineCode>childContextTypes</Styled.InlineCode> /
                    <Styled.InlineCode>contextTypes</Styled.InlineCode>. It’s considered legacy. Use{" "}
                    <Styled.InlineCode>createContext</Styled.InlineCode> instead.
                </Styled.P>

                <Styled.H3>Modern Context (recommended):</Styled.H3>
                <Styled.Pre>
                    {`const ThemeContext = React.createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = React.useContext(ThemeContext);
  return <button data-theme={theme}>Click</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) ReactDOM.render / hydrate (legacy) */}
            <Styled.Section>
                <Styled.H2>Legacy Root APIs</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Deprecated usage:</b> <Styled.InlineCode>ReactDOM.render</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>ReactDOM.hydrate</Styled.InlineCode> (legacy).
                    </li>
                    <li>
                        <b>Modern API (React 18+):</b>{" "}
                        <Styled.InlineCode>createRoot</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>hydrateRoot</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.H3>Before:</Styled.H3>
                <Styled.Pre>
                    {`import ReactDOM from "react-dom";
ReactDOM.render(<App />, document.getElementById("root")); // ❌ legacy`}
                </Styled.Pre>

                <Styled.H3>After:</Styled.H3>
                <Styled.Pre>
                    {`import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(<App />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Default props on function components (avoid) */}
            <Styled.Section>
                <Styled.H2>Default props on Function Components (avoid)</Styled.H2>
                <Styled.P>
                    Historically you could set <Styled.InlineCode>Component.defaultProps</Styled.InlineCode> on function components. The modern style is to
                    use default values in parameter destructuring, which is clearer and plays nicely with TypeScript and autocomplete.
                </Styled.P>

                <Styled.H3>Before:</Styled.H3>
                <Styled.Pre>
                    {`function Button({ label }) { return <button>{label}</button>; }
Button.defaultProps = { label: "Click" }; // 😐 avoid`}
                </Styled.Pre>

                <Styled.H3>After (recommended):</Styled.H3>
                <Styled.Pre>
                    {`function Button({ label = "Click" }) {
  return <button>{label}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Event pooling (historical note) */}
            <Styled.Section>
                <Styled.H2>Event Pooling (historical)</Styled.H2>
                <Styled.P>
                    Older React versions “pooled” events, requiring <Styled.InlineCode>event.persist()</Styled.InlineCode> for async access. Modern React no longer pools events—just
                    use the event normally.
                </Styled.P>
            </Styled.Section>

            {/* 8) Misc patterns to avoid */}
            <Styled.Section>
                <Styled.H2>Other Patterns to Avoid</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Mutating props:</b> Props are read-only. Derive new values in state or compute during render.
                    </li>
                    <li>
                        <b>Heavy work in render:</b> Move expensive computations into <Styled.InlineCode>useMemo</Styled.InlineCode> or background (web worker) if needed.
                    </li>
                    <li>
                        <b>Global DOM side effects in render:</b> Do side effects in <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Migration checklist */}
            <Styled.Section>
                <Styled.H2>Migration Checklist</Styled.H2>
                <Styled.List>
                    <li>
                        Replace <Styled.InlineCode>ReactDOM.render</Styled.InlineCode> →{" "}
                        <Styled.InlineCode>createRoot</Styled.InlineCode>.
                    </li>
                    <li>
                        Remove string refs → use <Styled.InlineCode>useRef</Styled.InlineCode>/<Styled.InlineCode>createRef</Styled.InlineCode>.
                    </li>
                    <li>
                        Replace <Styled.InlineCode>findDOMNode</Styled.InlineCode> → direct DOM refs.
                    </li>
                    <li>
                        Migrate legacy lifecycles → <Styled.InlineCode>useEffect</Styled.InlineCode> or modern class lifecycles.
                    </li>
                    <li>
                        Switch legacy context → <Styled.InlineCode>createContext</Styled.InlineCode>.
                    </li>
                    <li>
                        Prefer param defaults over <Styled.InlineCode>defaultProps</Styled.InlineCode> on function components.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Ref:</b> A mutable object whose <Styled.InlineCode>.current</Styled.InlineCode> holds a DOM node or value across renders.</li>
                    <li><b>Effect:</b> Code that runs after render for syncing with the outside world (events, timers, network, DOM).</li>
                    <li><b>Hydration:</b> Attaching React listeners to server-rendered HTML.</li>
                    <li><b>Concurrent rendering:</b> React may prepare multiple versions of UI and interrupt work to keep the app responsive.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: audit your codebase for legacy lifecycles, string refs, <i>findDOMNode</i>, legacy context,
                and old root APIs. Adopt hooks, direct refs, modern context, and the new root API for a clean, future-proof codebase.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Deprecations;
