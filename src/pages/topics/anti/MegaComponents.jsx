import { Styled } from "./styled";

const MegaComponents = () => {
    return (
        <Styled.Page>
            <Styled.Title>Anti-Pattern: Mega Components</Styled.Title>

            <Styled.Lead>
                A <b>mega component</b> is a single React component that tries to do “everything” —
                too many responsibilities, too many states, and too much markup. It becomes hard to read,
                test, reuse, and change without breaking things.
            </Styled.Lead>

            {/* 1) Definition & why it's a problem */}
            <Styled.Section>
                <Styled.H2>What is a Mega Component?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Definition:</b> A component that <em>combines multiple responsibilities</em> (data
                        fetching, business logic, state machines, layout, and rendering) into one large file.
                    </li>
                    <li>
                        <b>Why it's a problem:</b> It increases <i>cognitive load</i> (hard to understand),
                        introduces <i>change risk</i> (one change breaks another), and blocks <i>reuse</i> and{" "}
                        <i>testing</i>.
                    </li>
                    <li>
                        <b>Single Responsibility Principle (SRP):</b> Each component should have one clear reason
                        to change. If a file changes for many reasons, it's a smell.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Smell checklist */}
            <Styled.Section>
                <Styled.H2>Smell Checklist (quick self-check)</Styled.H2>
                <Styled.List>
                    <li>File length &gt; 300-400 lines; nested JSX is hard to fit on screen.</li>
                    <li>Too many <Styled.InlineCode>useState</Styled.InlineCode> / <Styled.InlineCode>useEffect</Styled.InlineCode> hooks managing unrelated concerns.</li>
                    <li>Component both <b>fetches data</b> and <b>renders complex UI</b> and <b>handles global app state</b>.</li>
                    <li>Prop list keeps growing; you pass the same props deep down many layers.</li>
                    <li>Small changes require editing multiple distant parts of the same file.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Example: the anti-pattern */}
            <Styled.Section>
                <Styled.H2>Example: A Mega Dashboard Component (Anti-Pattern)</Styled.H2>
                <Styled.Pre>
                    {`function Dashboard() {
  // 1) Fetching, error, loading
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [stats, setStats] = React.useState(null);

  // 2) Local UI state
  const [filter, setFilter] = React.useState("");
  const [tab, setTab] = React.useState("overview");
  const [modalOpen, setModalOpen] = React.useState(false);

  // 3) Effects for fetching + subscriptions
  React.useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => { if (!cancel) { setStats(data); setLoading(false); }})
      .catch(err => { if (!cancel) { setError(err); setLoading(false); }});
    // pretend we also attach window listeners here...
    return () => { cancel = true; /* remove listeners */ };
  }, []);

  // 4) Huge render tree
  if (loading) return <Spinner/>;
  if (error) return <div role="alert">Failed to load</div>;

  return (
    <div className="dashboard">
      <header>
        <input
          placeholder="Filter…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <nav>
          <button onClick={() => setTab("overview")}>Overview</button>
          <button onClick={() => setTab("reports")}>Reports</button>
          <button onClick={() => setTab("settings")}>Settings</button>
        </nav>
        <button onClick={() => setModalOpen(true)}>New report</button>
      </header>

      {tab === "overview" && (
        <section className="cards">
          {/* 100+ lines of cards, charts, tables… */}
        </section>
      )}
      {tab === "reports" && (
        <section className="reports">
          {/* 100+ lines of reports list, pagination, actions… */}
        </section>
      )}
      {tab === "settings" && (
        <section className="settings">
          {/* 100+ lines of forms, toggles, validation… */}
        </section>
      )}

      {modalOpen && (
        <div className="modal">
          {/* 100+ lines of complex form… */}
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    One file is doing fetching, global layout, filter logic, tab system, modal, and large render
                    trees. Hard to test and reuse.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Refactor strategy */}
            <Styled.Section>
                <Styled.H2>Refactor Strategy (step by step)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Extract UI pieces</b> into small presentational components (pure props in, JSX out).
                    </li>
                    <li>
                        <b>Extract stateful logic</b> into <Styled.InlineCode>custom hooks</Styled.InlineCode>{" "}
                        (<i>data fetching</i>, <i>filters</i>, <i>tabs</i>, <i>modal</i>).
                    </li>
                    <li>
                        <b>Introduce composition</b>: the parent orchestrates; children render.
                    </li>
                    <li>
                        <b>Add boundaries</b>: separate data layer (hooks) from view layer (components).
                    </li>
                    <li>
                        <b>Co-locate</b> state with the component that truly owns it; lift only when required.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Example: broken down version */}
            <Styled.Section>
                <Styled.H2>Example: Split into Hooks + Components</Styled.H2>
                <Styled.Pre>
                    {`// 1) Logic hooks (reusable, testable)
function useStats() {
  const [state, set] = React.useState({ status: "loading", data: null, error: null });
  React.useEffect(() => {
    let cancel = false;
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => !cancel && set({ status: "success", data, error: null }))
      .catch(error => !cancel && set({ status: "error", data: null, error }));
    return () => { cancel = true; };
  }, []);
  return state; // {status, data, error}
}

function useTabs(initial = "overview") {
  const [tab, setTab] = React.useState(initial);
  return { tab, setTab };
}

function useModal(initial = false) {
  const [open, setOpen] = React.useState(initial);
  return { open, openModal: () => setOpen(true), closeModal: () => setOpen(false) };
}

// 2) Presentational pieces (small, focused)
function Header({ filter, onFilter, tab, setTab, onNew }) {
  return (
    <header>
      <input placeholder="Filter…" value={filter} onChange={e => onFilter(e.target.value)} />
      <nav>
        <button onClick={() => setTab("overview")} aria-pressed={tab==="overview"}>Overview</button>
        <button onClick={() => setTab("reports")} aria-pressed={tab==="reports"}>Reports</button>
        <button onClick={() => setTab("settings")} aria-pressed={tab==="settings"}>Settings</button>
      </nav>
      <button onClick={onNew}>New report</button>
    </header>
  );
}

function Overview({ stats, filter }) { /* small chunks here */ return <section>…</section>; }
function Reports({ filter }) { return <section>…</section>; }
function Settings() { return <section>…</section>; }

// 3) Orchestrator (thin)
function Dashboard() {
  const stats = useStats();
  const { tab, setTab } = useTabs();
  const modal = useModal();
  const [filter, setFilter] = React.useState("");

  if (stats.status === "loading") return <Spinner/>;
  if (stats.status === "error") return <div role="alert">Failed to load</div>;

  return (
    <div className="dashboard">
      <Header
        filter={filter}
        onFilter={setFilter}
        tab={tab}
        setTab={setTab}
        onNew={modal.openModal}
      />

      {tab === "overview" && <Overview stats={stats.data} filter={filter} />}
      {tab === "reports" && <Reports filter={filter} />}
      {tab === "settings" && <Settings />}

      {modal.open && (
        <Modal onClose={modal.closeModal}>
          {/* small, scoped form component */}
          <NewReportForm onSuccess={modal.closeModal} />
        </Modal>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Notice how logic moved to hooks (<code>useStats</code>, <code>useTabs</code>,{" "}
                    <code>useModal</code>) and rendering is split into small components. Each piece now has one
                    job.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Anti-pattern vs good patterns */}
            <Styled.Section>
                <Styled.H2>Good Patterns to Prefer</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Container / Presentational</b>: a container orchestrates data; presentational
                        components focus on markup.
                    </li>
                    <li>
                        <b>Custom Hooks</b>: package stateful logic, side effects, and APIs (<i>fetching, tabs, modal</i>).
                    </li>
                    <li>
                        <b>Compound Components</b>: build a small “API surface” of subcomponents that work together.
                    </li>
                    <li>
                        <b>Context (scoped)</b>: pass shared state where needed, but keep contexts <i>narrow</i> to avoid re-renders.
                    </li>
                    <li>
                        <b>Feature folders</b>: group related files (<i>hooks, UI, tests</i>) per feature to keep boundaries clear.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> split by responsibility: data, state, view.</li>
                    <li><b>Do</b> move reusable logic into hooks; move reusable UI into small components.</li>
                    <li><b>Do</b> keep components short and named clearly (one purpose).</li>
                    <li><b>Don't</b> keep adding “just one more” concern to the same file.</li>
                    <li><b>Don't</b> export a grab-bag of unrelated callbacks and states from a single component.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Single Responsibility Principle (SRP):</b> A unit should have one reason to change.
                    </li>
                    <li>
                        <b>Presentational Component:</b> Focuses on UI; receives data via props; usually stateless
                        or with minimal local state.
                    </li>
                    <li>
                        <b>Container Component:</b> Orchestrates data fetching, state, and wiring; renders
                        presentational components.
                    </li>
                    <li>
                        <b>Custom Hook:</b> A function beginning with <Styled.InlineCode>use</Styled.InlineCode> that encapsulates reusable stateful logic.
                    </li>
                    <li>
                        <b>Composition:</b> Building complex UIs by combining small, focused parts.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Takeaway:</b> When a component grows beyond a single responsibility, split logic into
                custom hooks, move UI into smaller components, and keep the orchestrator thin. Future you
                (and your teammates) will thank you.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default MegaComponents;
