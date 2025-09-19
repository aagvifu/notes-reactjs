import React, { Suspense } from "react";
import { Styled } from "./styled";

/**
 * Suspense for Data — Modern React
 * Beginner-friendly notes page using only existing Styled tokens.
 */

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

/* A tiny "resource" helper for teaching. */
function createResource(asyncFn) {
    let status = "pending";
    let result;

    const p = asyncFn()
        .then((data) => { status = "success"; result = data; })
        .catch((err) => { status = "error"; result = err; });

    return {
        read() {
            if (status === "pending") throw p;    // tells React to suspend
            if (status === "error") throw result; // pair with Error Boundary in real apps
            return result;
        }
    };
}

/* Demo: fake fetch that resolves after ~1.2s */
function fetchUser() {
    return sleep(1200).then(() => ({
        id: "u_42",
        name: "Ada Lovelace",
        role: "Mathematician / Programmer",
    }));
}

const userResource = createResource(fetchUser);

/* Child that SUSPENDS while data is loading */
function UserCard() {
    const user = userResource.read(); // returns data OR throws a Promise
    return (
        <div role="region" aria-label="User profile" style={{
            border: "1px solid hsl(0 0% 100% / 0.14)",
            borderRadius: 12,
            padding: 12,
            marginTop: 8
        }}>
            <h4 style={{ margin: 0 }}>{user.name}</h4>
            <p style={{ margin: "4px 0 0", opacity: 0.9 }}>{user.role}</p>
            <Styled.Small>ID: {user.id}</Styled.Small>
        </div>
    );
}

const SuspenseForData = () => {
    return (
        <Styled.Page>
            <Styled.Title>Suspense for Data</Styled.Title>

            <Styled.Lead>
                <b>Suspense</b> lets components “wait” for something (like data) before they render.
                While a component is waiting, React shows a <em>fallback</em>. When the data arrives,
                the real UI appears automatically—no manual loading state plumbing.
            </Styled.Lead>

            {/* 1) Why Suspense exists */}
            <Styled.Section>
                <Styled.H2>Why does Suspense exist?</Styled.H2>
                <Styled.List>
                    <li><b>Loading UI without boilerplate:</b> Components can declare “I’m not ready yet”, and React will show a fallback automatically.</li>
                    <li><b>Smoother UX:</b> Boundaries prevent the whole screen from flashing; only the parts that wait will show a placeholder.</li>
                    <li><b>Composability:</b> Parent and child components can each suspend independently. You can nest boundaries for fine-grained control.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Key terms (plain English)</Styled.H2>
                <Styled.List>
                    <li><b>Suspense boundary:</b> a wrapper (<Styled.InlineCode>{`<Suspense fallback={...}>`}</Styled.InlineCode>) that shows a fallback while any child “suspends”.</li>
                    <li><b>Suspending:</b> when a component throws a <Styled.InlineCode>Promise</Styled.InlineCode> during render to say “wait for this”.</li>
                    <li><b>Fallback:</b> the temporary UI shown while waiting (e.g., spinner, skeleton, shimmer).</li>
                    <li><b>Concurrent rendering:</b> React can prepare a new UI in the background and switch when it’s ready. Suspense builds on this.</li>
                    <li><b>Transition:</b> a non-urgent update wrapped in <Styled.InlineCode>startTransition</Styled.InlineCode> to keep the UI responsive while loading.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal example (learning pattern)</Styled.H2>
                <Styled.Pre>
                    {`// 1) Create a resource that "throws" a Promise while loading
const userResource = createResource(fetchUser);

// 2) Child reads from the resource. If not ready, it suspends.
function UserCard() {
  const user = userResource.read(); // returns OR throws a Promise
  return <div>{user.name}</div>;
}

// 3) Wrap the child in a Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <UserCard />
    </Suspense>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The trick: <b>throwing a Promise inside render</b> is how React knows to show the fallback.
                    In real apps, a data library handles this for you.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Teaching block */}
            <Styled.Section>
                <Styled.H2>Teaching block: see it in action</Styled.H2>
                <Styled.Pre>
                    {`<Suspense fallback={<div>Loading profile…</div>}>
  <UserCard />
</Suspense>`}
                </Styled.Pre>
                <Styled.Small>
                    Below is the same code running on this page. It deliberately waits ~1.2s so you see
                    the fallback first, then the real user data.
                </Styled.Small>

                <Styled.Section aria-live="polite" style={{ marginTop: 12 }}>
                    <Suspense fallback={<div>Loading profile…</div>}>
                        <UserCard />
                    </Suspense>
                </Styled.Section>
            </Styled.Section>

            {/* 5) Where to put boundaries */}
            <Styled.Section>
                <Styled.H2>Where do I put boundaries?</Styled.H2>
                <Styled.List>
                    <li><b>Around units of content:</b> e.g., a product panel, comments list, side card.</li>
                    <li><b>At natural page splits:</b> main content vs. sidebar; list vs. detail.</li>
                    <li><b>Nested boundaries:</b> small inner boundaries give faster, progressive reveal.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<Suspense fallback={<PageSkeleton />}>
  <MainLayout>
    <Sidebar />
    <Suspense fallback={<PanelSkeleton />}>
      <ProductPanel />
    </Suspense>
  </MainLayout>
</Suspense>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Transitions + Suspense */}
            <Styled.Section>
                <Styled.H2>Transitions + Suspense (keep typing responsive)</Styled.H2>
                <Styled.List>
                    <li><b>Urgent vs. non-urgent:</b> typing into an input is urgent; filtering a big list can be non-urgent.</li>
                    <li><b>startTransition:</b> marks a state update as non-urgent so React can keep the old UI responsive until the new result is ready.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { startTransition, useState } from "react";

function Search({ items }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(items);

  function onChange(e) {
    const q = e.target.value;
    setQuery(q); // urgent (keystrokes feel instant)
    startTransition(() => {
      const filtered = expensiveFilter(items, q);
      setResult(filtered);
    });
  }

  return (
    <>
      <input value={query} onChange={onChange} placeholder="Search…" />
      <Suspense fallback={<div>Updating…</div>}>
        <ResultList data={result} />
      </Suspense>
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Rule of thumb: urgent updates shouldn’t lag because data is loading. Use transitions to protect them.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Error handling */}
            <Styled.Section>
                <Styled.H2>Error handling</Styled.H2>
                <Styled.List>
                    <li>Pair Suspense with an <b>Error Boundary</b> to catch thrown errors. Suspense handles the “waiting” case; Error Boundaries handle the “failed” case.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Sketch
<ErrorBoundary fallback={<RetryPanel />}>
  <Suspense fallback={<div>Loading…</div>}>
    <Comments />
  </Suspense>
</ErrorBoundary>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> place small, meaningful boundaries to progressively reveal content.</li>
                    <li><b>Do</b> use a data library that supports Suspense (or a framework with loaders/streaming) in real apps.</li>
                    <li><b>Do</b> keep urgent interactions responsive; wrap heavy updates in <Styled.InlineCode>startTransition</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> suspend the entire app for tiny pieces of data; prefer nested boundaries.</li>
                    <li><b>Don’t</b> forget an Error Boundary for network failures/timeouts.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Wrap parts of the UI in <code>&lt;Suspense&gt;</code> to handle loading states
                automatically. Use <i>small, well-placed</i> boundaries, pair with Error Boundaries, and
                protect urgent interactions with <code>startTransition</code>.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SuspenseForData;
