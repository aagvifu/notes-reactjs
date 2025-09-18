import { Styled } from "./styled";

const DebouncedInputs = () => {
    return (
        <Styled.Page>
            <Styled.Title>Debounced Inputs</Styled.Title>

            <Styled.Lead>
                <b>Debouncing</b> waits for a “quiet period” after the user stops typing before running work
                (e.g., filtering, API calls). This reduces unnecessary renders and network requests while keeping the UI responsive.
            </Styled.Lead>

            {/* 1) Definition & Use-Cases */}
            <Styled.Section>
                <Styled.H2>Definition &amp; When to Use</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Debounce:</b> postpone running a function until <i>N ms</i> have passed without another call.
                        If a new call arrives within the window, the timer restarts.
                    </li>
                    <li>
                        <b>Use for:</b> live search, typeahead queries, client-side filtering, expensive validations, autosave.
                    </li>
                    <li>
                        <b>Don’t use for:</b> critical interactions needing immediate feedback (e.g., password fields,
                        stepper controls)—update immediately instead.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Debounce vs Throttle vs Delay */}
            <Styled.Section>
                <Styled.H2>Debounce vs Throttle vs Delay</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Debounce:</b> run after the user stops. Good for text inputs.
                    </li>
                    <li>
                        <b>Throttle:</b> run at most once every <i>N ms</i> during continuous activity. Good for scroll/resize.
                    </li>
                    <li>
                        <b>Delay:</b> a one-off timeout. Not reactive to continued typing like debounce.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Controlled Input (two-state pattern) */}
            <Styled.Section>
                <Styled.H2>Controlled Pattern: Immediate text + Debounced value</Styled.H2>
                <Styled.Pre>
                    {`function DebouncedSearch({ delay = 300 }) {
  const [text, setText] = React.useState("");       // immediate UI value
  const [query, setQuery] = React.useState("");     // debounced value

  React.useEffect(() => {
    const id = setTimeout(() => setQuery(text), delay);
    return () => clearTimeout(id);                  // cancel on change/unmount
  }, [text, delay]);

  // React to debounced query (fetch/filter)
  React.useEffect(() => {
    if (!query) return;
    let aborted = false;

    async function go() {
      try {
        const ctrl = new AbortController();
        const p = fetch("/api/search?q=" + encodeURIComponent(query), { signal: ctrl.signal })
          .then(r => r.json());
        // Optional: store ctrl to cancel if needed
        const data = await p;
        if (!aborted) {
          // setResults(data)
        }
      } catch (err) {
        // if aborted, ignore; else handle error
      }
    }
    go();
    return () => { aborted = true; };
  }, [query]);

  return (
    <>
      <label htmlFor="q">Search</label>
      <input
        id="q"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to search..."
        autoComplete="off"
      />
      <p><b>Debounced query:</b> {query || "—"}</p>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep UI snappy by updating <Styled.InlineCode>text</Styled.InlineCode> every keystroke,
                    but only “commit” work when <Styled.InlineCode>query</Styled.InlineCode> updates.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Debounced callback (no separate state) */}
            <Styled.Section>
                <Styled.H2>Debounced Callback Pattern</Styled.H2>
                <Styled.Pre>
                    {`function useDebouncedCallback(fn, delay = 300) {
  const fnRef = React.useRef(fn);
  React.useEffect(() => { fnRef.current = fn; }, [fn]);

  const timer = React.useRef(null);
  return React.useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
}

// Usage in an input:
function DebouncedInput({ onDebouncedChange, delay = 300 }) {
  const [value, setValue] = React.useState("");
  const debounced = useDebouncedCallback(onDebouncedChange, delay);

  function onChange(e) {
    const next = e.target.value;
    setValue(next);            // immediate UI
    debounced(next);           // delayed work
  }

  return <input value={value} onChange={onChange} placeholder="Debounced input" />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    This pattern is useful when you want to run a function <i>later</i> without introducing a second state.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Uncontrolled variant */}
            <Styled.Section>
                <Styled.H2>Uncontrolled Variant (ref + native input)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Uncontrolled:</b> the DOM owns the value; React reads it when needed.
                    </li>
                    <li>
                        Useful when you have very large lists or want to minimize React renders while typing.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function UncontrolledDebounced({ onDebounced, delay = 300 }) {
  const ref = React.useRef(null);
  const debounced = React.useRef(); // store timer id

  function onInput() {
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => {
      onDebounced(ref.current?.value ?? "");
    }, delay);
  }

  React.useEffect(() => () => clearTimeout(debounced.current), [delay]);

  return <input ref={ref} onInput={onInput} placeholder="Uncontrolled + debounced" />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Leading vs Trailing edge */}
            <Styled.Section>
                <Styled.H2>Leading vs Trailing Edge</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Trailing:</b> run <i>after</i> the user stops typing (default).
                    </li>
                    <li>
                        <b>Leading:</b> run once immediately on the first keystroke, then suppress until the gap.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function useDebouncedValue(value, delay = 300, { leading = false } = {}) {
  const [debounced, setDebounced] = React.useState(value);
  const firstCall = React.useRef(true);

  React.useEffect(() => {
    if (leading && firstCall.current) {
      firstCall.current = false;
      setDebounced(value);
      return;
    }
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay, leading]);

  return debounced;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) IME & accessibility */}
            <Styled.Section>
                <Styled.H2>IME, Accessibility &amp; UX</Styled.H2>
                <Styled.List>
                    <li>
                        <b>IME composition:</b> when users type with input method editors (e.g., Chinese, Japanese),
                        avoid triggering network calls mid-composition. Use{" "}
                        <Styled.InlineCode>onCompositionStart</Styled.InlineCode> /{" "}
                        <Styled.InlineCode>onCompositionEnd</Styled.InlineCode> to pause/resume.
                    </li>
                    <li>
                        <b>Feedback:</b> show a small “searching…” or spinner while requests are inflight.
                    </li>
                    <li>
                        <b>Keyboard:</b> support <Styled.InlineCode>Enter</Styled.InlineCode> to submit immediately.
                    </li>
                    <li>
                        <b>Don’t debounce</b> password fields or critical validation that must be instant.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function SearchWithIME() {
  const [text, setText] = React.useState("");
  const [composing, setComposing] = React.useState(false);
  const debounced = useDebouncedValue(text, 300);

  React.useEffect(() => {
    if (composing) return;     // skip while composing
    if (!debounced) return;
    // fetch with debounced query...
  }, [debounced, composing]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
      placeholder="Search..."
    />
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep instant UI feedback with a controlled <Styled.InlineCode>value</Styled.InlineCode>.</li>
                    <li><b>Do</b> debounce only the expensive work (fetch/filter), not the user’s typing.</li>
                    <li><b>Do</b> cancel stale requests (AbortController or a flag) when the query changes.</li>
                    <li><b>Don’t</b> forget to clear timers on unmount/prop changes.</li>
                    <li><b>Don’t</b> block IME users—respect composition events.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Debounce window:</b> the period of inactivity required before running the task.</li>
                    <li><b>Leading edge:</b> the first call fired immediately.</li>
                    <li><b>Trailing edge:</b> the last call fired after the window elapses.</li>
                    <li><b>Controlled input:</b> React state owns the value via <Styled.InlineCode>value</Styled.InlineCode> + <Styled.InlineCode>onChange</Styled.InlineCode>.</li>
                    <li><b>Uncontrolled input:</b> the DOM owns the value; React reads it on demand via refs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Debounce <i>work</i>, not typing. Keep inputs responsive with controlled values, run
                expensive actions after a quiet period, cancel stale requests, and respect IME composition.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DebouncedInputs;
