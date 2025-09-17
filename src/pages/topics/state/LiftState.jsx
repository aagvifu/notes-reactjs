import React from "react";
import { Styled } from "./styled";

const LiftState = () => {
    return (
        <Styled.Page>
            <Styled.Title>Lift State</Styled.Title>
            <Styled.Lead>
                Lift state to the <b>nearest common parent</b> when multiple components
                need to read or update the same data. Keep a <b>single source of truth</b>
                and pass values down (props) with changes flowing up (callbacks).
            </Styled.Lead>

            {/* 1) Terminology */}
            <Styled.Section>
                <Styled.H2>Terminology (precise)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Source of truth:</b> the single place where a piece of state lives. Every rendered view derives from it.
                    </li>
                    <li>
                        <b>Lift state:</b> move state up to a parent so siblings (or deeper children) can share it.
                    </li>
                    <li>
                        <b>Nearest common parent:</b> the lowest ancestor that contains all components needing the state.
                    </li>
                    <li>
                        <b>Controlled child:</b> child renders from a <em>value</em> prop and notifies changes via an <em>onChange</em> callback.
                    </li>
                    <li>
                        <b>Prop drilling:</b> passing props through multiple layers that do not use them directly (consider context when deep).
                    </li>
                    <li>
                        <b>Derived state:</b> a computed value based on other state/props (do not duplicate; compute or memoize).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to lift */}
            <Styled.Section>
                <Styled.H2>When to lift state</Styled.H2>
                <Styled.List>
                    <li>Two or more components must stay in sync (search box ↔ filtered list, tabs ↔ panel).</li>
                    <li>A parent needs to decide how children behave based on shared data.</li>
                    <li>Multiple children update the same data (form sections editing one draft object).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Workflow */}
            <Styled.Section>
                <Styled.H2>Workflow (step-by-step)</Styled.H2>
                <Styled.List>
                    <li>Identify the minimal state you actually need (avoid duplicates).</li>
                    <li>Find the nearest common parent that needs or coordinates that state.</li>
                    <li>Create state in that parent with <Styled.InlineCode>useState</Styled.InlineCode>.</li>
                    <li>Pass the value down; pass callbacks down for updates.</li>
                    <li>Compute <em>derived</em> data from that state instead of storing copies.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: Search box controlling a list */}
            <Styled.Section>
                <Styled.H2>Example: Search box controlling a list</Styled.H2>
                <Styled.Pre>
                    {`const ALL = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Linus" },
  { id: "3", name: "Grace" },
];

function Products() {
  const [query, setQuery] = React.useState("");

  // Derived state: compute, do not store duplicates
  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return ALL.filter(p => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <List items={filtered} />
    </>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <input
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function List({ items }) {
  if (!items.length) return <p>No results</p>;
  return (
    <ul>
      {items.map(x => <li key={x.id}>{x.name}</li>)}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The parent owns <code>query</code>. <code>SearchBox</code> is a controlled child. <code>filtered</code> is <em>derived</em> (recomputed), not stored.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: two inputs that mirror each other (C ↔ F) */}
            <Styled.Section>
                <Styled.H2>Example: two fields mirroring each other (C ↔ F)</Styled.H2>
                <Styled.Pre>
                    {`function toCelsius(f) { return (f - 32) * 5 / 9; }
function toFahrenheit(c) { return (c * 9 / 5) + 32; }

function TemperatureConverter() {
  // Single source of truth: value + scale
  const [scale, setScale] = React.useState("C"); // "C" or "F"
  const [value, setValue] = React.useState("");

  const c = scale === "C" ? value : (value === "" ? "" : String(Math.round(toCelsius(Number(value)))));
  const f = scale === "F" ? value : (value === "" ? "" : String(Math.round(toFahrenheit(Number(value)))));

  return (
    <div>
      <TempInput
        label="Celsius"
        value={c}
        onChange={(v) => { setScale("C"); setValue(v); }}
      />
      <TempInput
        label="Fahrenheit"
        value={f}
        onChange={(v) => { setScale("F"); setValue(v); }}
      />
    </div>
  );
}

function TempInput({ label, value, onChange }) {
  return (
    <label>
      {label}:{" "}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
      />
    </label>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The parent holds <code>value</code> and <code>scale</code>. Each input is controlled by props and updates the shared state.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Lifting vs colocation */}
            <Styled.Section>
                <Styled.H2>Lifting vs colocation (balance)</Styled.H2>
                <Styled.List>
                    <li><b>Colocate</b> state where it is used if only one component cares about it.</li>
                    <li><b>Lift</b> only when multiple components must share or coordinate the value.</li>
                    <li>Over-lifting creates long prop chains and unnecessary renders; lift just enough.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Deep trees: avoid prop drilling with context */}
            <Styled.Section>
                <Styled.H2>Deep trees: avoid prop drilling with context</Styled.H2>
                <Styled.Pre>
                    {`const ThemeContext = React.createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("light");
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ThemeToggle() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const next = theme === "light" ? "dark" : "light";
  return <button onClick={() => setTheme(next)}>Theme: {theme}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Context is an alternative to lifting through many layers. Keep the <em>source of truth</em> single; share it via a provider.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Performance notes */}
            <Styled.Section>
                <Styled.H2>Performance notes</Styled.H2>
                <Styled.List>
                    <li>
                        Lifting state causes the parent to re-render; children re-render by default. Optimize only if it shows up as a hotspot.
                    </li>
                    <li>
                        Stabilize callbacks with <Styled.InlineCode>useCallback</Styled.InlineCode> when passing to memoized children (avoid unnecessary child renders).
                    </li>
                    <li>
                        For very broad sharing, use context selectors or split providers to avoid re-rendering large trees.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const onChange = React.useCallback((v) => setQuery(v), []); // stable ref for memoized SearchBox`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Duplicating state in multiple places (two sources of truth) → inconsistent UI. Keep one source and derive the rest.
                    </li>
                    <li>
                        Storing derived data (filtered arrays, totals) as state → can go stale. Compute during render or memoize.
                    </li>
                    <li>
                        Over-lifting when only one component uses the value → unnecessary prop chains; colocate instead.
                    </li>
                    <li>
                        Passing internal design flags down to DOM (leaks) when forwarding props; filter non-DOM props.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do / Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep a single source of truth for shared data.</li>
                    <li><b>Do</b> pass controlled props (value, onChange) to children that display/edit the data.</li>
                    <li><b>Do</b> derive values instead of duplicating state.</li>
                    <li><b>Do</b> consider context when prop chains get deep.</li>
                    <li><b>Don’t</b> lift state higher than necessary.</li>
                    <li><b>Don’t</b> keep independent copies of the same data in multiple siblings.</li>
                    <li><b>Don’t</b> store filtered/sorted versions as separate state unless there is a proven need.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: lift state to the nearest common parent to synchronize UIs, keep one source of truth, pass value
                and onChange down to controlled children, and compute derivatives instead of duplicating state. Use context
                to avoid long prop chains when sharing broadly.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LiftState;
