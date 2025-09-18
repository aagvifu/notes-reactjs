import { Styled } from "./styled";

const WhatIsReact = () => {
    return (
        <Styled.Page>
            <Styled.Title>What is React?</Styled.Title>
            <Styled.Lead>
                React is a <b>JavaScript library for building user interfaces</b>.
                You describe what the UI should look like for a given state, and React
                updates the browser for you when that state changes.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Why React exists (the problem it solves)</Styled.H2>
                <Styled.List>
                    <li>
                        In plain JS or jQuery, you manually find elements and update them.
                        As apps grow, those manual updates become fragile and hard to
                        reason about.
                    </li>
                    <li>
                        React makes UI <b>declarative</b>: write <em>what</em> you want,
                        not <em>how</em> to change the DOM step by step.
                    </li>
                    <li>
                        React breaks UI into reusable <b>components</b> (small pieces like
                        Button, Card, Form) so large apps stay organized.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Core ideas (at a glance)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Component-based</b>: UI is built from small, reusable pieces.
                    </li>
                    <li>
                        <b>Declarative</b>: UI is a function of state (
                        <Styled.InlineCode>UI = f(state)</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>One-way data flow</b>: data moves down from parents to children
                        via <Styled.InlineCode>props</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>State</b>: each component can remember information and re-render
                        when that information changes.
                    </li>
                    <li>
                        <b>JSX</b>: a JavaScript syntax extension that lets you write HTML-like
                        markup inside JS.
                    </li>
                    <li>
                        <b>Efficient updates</b>: React calculates what changed and updates
                        only those parts in the DOM.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Your first tiny component</Styled.H2>
                <p>
                    A <b>component</b> is just a JavaScript function that returns JSX.
                    You can pass data to it using <Styled.InlineCode>props</Styled.InlineCode>.
                </p>

                <Styled.Pre>
                    <code>{`function Hello({ name }) {
  return <h3>Hello, {name}</h3>;
}

// Usage inside another component's JSX:
// <Hello name="Ashish" />  // renders: Hello, Ashish
`}</code>
                </Styled.Pre>

                <Styled.Small>
                    Tip: Component names must start with a capital letter
                    (e.g., <Styled.InlineCode>Hello</Styled.InlineCode>).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>State: making the UI interactive</Styled.H2>
                <p>
                    Use <Styled.InlineCode>useState</Styled.InlineCode> to remember
                    values over time. When you update state, React re-renders the
                    component and refreshes the UI.
                </p>

                <Styled.Pre>
                    <code>{`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);   // state with initial value 0

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}

// <Counter />  // each click updates state and the text on the button
`}</code>
                </Styled.Pre>

                <Styled.Callout>
                    <b>Why no manual DOM code?</b> Because React re-renders the component
                    when state changes, calculates the difference (what actually changed),
                    and updates only that part in the DOM. You focus on the data; React
                    handles the DOM.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Props vs State (quick check)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Props</b>: read-only inputs passed from a parent. Think “config”.
                    </li>
                    <li>
                        <b>State</b>: private data owned by a component that can change over
                        time (user input, counters, fetched data).
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Where does React run?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Web apps</b> (what you’re building now).
                    </li>
                    <li>
                        <b>Server-rendered</b> pages (with frameworks) for SEO/perf.
                    </li>
                    <li>
                        <b>Native apps</b> with React Native (same component mindset).
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>What React is not (by itself)</Styled.H2>
                <Styled.List>
                    <li>It’s not a router → use React Router.</li>
                    <li>It’s not a data layer → use fetch/React Query/SWR, etc.</li>
                    <li>It’s not a styling system → use CSS, CSS Modules, styled-components, etc.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> React helps you build UIs by composing components, passing
                data down via props, and reacting to state changes. Start thinking
                in components and “UI = f(state)”.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default WhatIsReact;
