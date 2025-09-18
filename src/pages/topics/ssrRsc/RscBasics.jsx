// src/pages/topics/ssrRsc/RscBasics.jsx
import React from "react";
import { Styled } from "./styled";

const RscBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>RSC Basics (React Server Components)</Styled.Title>

            <Styled.Lead>
                <b>React Server Components (RSC)</b> let you render some components entirely on the server,
                send a compact payload to the browser, and hydrate only the parts that need interactivity.
                This reduces JavaScript shipped to the client and gives server-side data access by default.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What are Server Components?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Server Component:</b> a React component that runs only on the <em>server</em>,
                        never ships its code to the browser, and can directly access server resources
                        (DB, secrets, files). It can render other server or client components.
                    </li>
                    <li>
                        <b>Client Component:</b> a component that runs in the <em>browser</em> (can use state,
                        effects, event handlers). It must be marked with{" "}
                        <Styled.InlineCode>&quot;use client&quot;</Styled.InlineCode> at the top of its file.
                    </li>
                    <li>
                        <b>Boundary:</b> the point where a server component renders a client component
                        (or vice-versa). Props passed across this boundary must be <em>serializable</em>.
                    </li>
                    <li>
                        <b>Why RSC?</b> Ship less JS, render close to data, keep secrets server-side, and get
                        fast <em>Time-to-Interactive</em> by hydrating only interactive islands.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where RSC fits: SSR, SSG/ISR, Hydration, Streaming */}
            <Styled.Section>
                <Styled.H2>SSR, Hydration &amp; Streaming - where RSC fits</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SSR (Server-Side Rendering):</b> server outputs HTML for a request, then the browser{" "}
                        <em>hydrates</em> it (attaches React listeners/state). Great for first paint + SEO.
                    </li>
                    <li>
                        <b>SSG (Static Site Generation):</b> HTML is prebuilt at build time.
                    </li>
                    <li>
                        <b>ISR (Incremental Static Regeneration):</b> static pages are re-generated on a schedule
                        or on demand - a hybrid of SSG and dynamic data.
                    </li>
                    <li>
                        <b>Hydration:</b> process where React attaches event handlers to already rendered HTML.
                        With RSC, <em>non-interactive</em> parts don't need hydration at all.
                    </li>
                    <li>
                        <b>Streaming:</b> server sends HTML (and RSC payload) in chunks using{" "}
                        <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> boundaries, so users see content
                        progressively rather than waiting for everything.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Capabilities & constraints */}
            <Styled.Section>
                <Styled.H2>Capabilities &amp; Constraints</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Server Components can:</b> fetch data directly, read files, call server APIs,
                        and render other components.
                    </li>
                    <li>
                        <b>Server Components cannot:</b> use <Styled.InlineCode>useState</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>useEffect</Styled.InlineCode>, refs, or browser-only APIs
                        (DOM, <Styled.InlineCode>window</Styled.InlineCode>, etc.).
                    </li>
                    <li>
                        <b>Client Components can:</b> use state/effects/events, read DOM, and run in the browser -
                        but they cannot access server-only resources directly.
                    </li>
                    <li>
                        <b>Serialization:</b> props crossing the boundary must be serializable (no functions,
                        class instances, or circular structures). Pass IDs/POJOs, not live connections.
                    </li>
                    <li>
                        <b>Server Actions:</b> special server-side functions (marked with{" "}
                        <Styled.InlineCode>&quot;use server&quot;</Styled.InlineCode>) callable from forms or
                        client components to mutate data securely without REST boilerplate.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Minimal server vs client component */}
            <Styled.Section>
                <Styled.H2>Example: Server vs Client Component</Styled.H2>
                <Styled.Pre>
                    {`// Server component (no "use client", can run async and fetch safely)
export default async function ProductsList() {
  const res = await fetch("https://api.example.com/products", { cache: "no-store" });
  const products = await res.json();

  // You can render a client component for interactive parts:
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - $ {p.price}
            {/* Client component below handles clicks/state */}
            <AddToCartButton productId={p.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Client component (must be in its own file with "use client")
"use client";
import React from "react";

export function AddToCartButton({ productId }) {
  const [pending, setPending] = React.useState(false);
  async function onClick() {
    setPending(true);
    // call an API or a Server Action here
    await fetch("/api/cart", { method: "POST", body: JSON.stringify({ productId }) });
    setPending(false);
  }
  return <button onClick={onClick} disabled={pending}>{pending ? "Adding..." : "Add to cart"}</button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The server component renders data; the client component handles interaction and state.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Passing across the boundary */}
            <Styled.Section>
                <Styled.H2>Passing Data Across the Boundary</Styled.H2>
                <Styled.List>
                    <li>
                        Pass serializable props (strings, numbers, arrays, objects). Don't pass functions or
                        DOM nodes.
                    </li>
                    <li>
                        Need to <em>call back</em> to the server? Use an HTTP API or a{" "}
                        <b>Server Action</b>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Server component providing plain data to client:
export default async function Profile() {
  const user = await db.users.findById("123"); // server-only
  return <ProfileCard user={{ id: user.id, name: user.name, avatar: user.avatar }} />;
}

// Client component consumes serializable data:
"use client";
export function ProfileCard({ user }) {
  return (
    <article>
      <img alt={user.name} src={user.avatar} />
      <h3>{user.name}</h3>
    </article>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Streaming with Suspense */}
            <Styled.Section>
                <Styled.H2>Streaming with Suspense</Styled.H2>
                <Styled.Pre>
                    {`// Server component can await data inside and stream UI when ready
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        {/* UsersServer renders once data arrives; HTML streams progressively */}
        <UsersServer />
      </Suspense>
    </>
  );
}

async function UsersServer() {
  const res = await fetch("https://api.example.com/users");
  const users = await res.json();
  return <UserTable users={users} />;
}

function Skeleton() {
  return <p>Loading users…</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    With streaming, users see parts of the page immediately; slower sections fill in later.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Server Actions (concept) */}
            <Styled.Section>
                <Styled.H2>Server Actions (Concept)</Styled.H2>
                <Styled.List>
                    <li>
                        Mark a function with <Styled.InlineCode>&quot;use server&quot;</Styled.InlineCode> to run
                        it on the server. A client component can invoke it via a form action or a direct call
                        (framework-specific).
                    </li>
                    <li>
                        Great for mutations: create/update/delete without exposing credentials to the client.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo-example (frameworks differ slightly)
"use server";
export async function saveNote(formData) {
  const text = formData.get("text");
  await db.notes.insert({ text });
}

// Client file
"use client";
import { saveNote } from "./actions";

export default function NewNoteForm() {
  return (
    <form action={saveNote}>
      <textarea name="text" required />
      <button type="submit">Save</button>
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep data-heavy, non-interactive UI in Server Components.</li>
                    <li><b>Do</b> isolate interactivity in small Client Components with <Styled.InlineCode>&quot;use client&quot;</Styled.InlineCode>.</li>
                    <li><b>Do</b> pass only serializable props across the boundary.</li>
                    <li><b>Don't</b> try to use state/effects in Server Components.</li>
                    <li><b>Don't</b> leak secrets to Client Components; call server via actions/APIs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>RSC (React Server Components):</b> React feature to render components on the server without sending their JS to the client.</li>
                    <li><b>Client Component:</b> runs in the browser, can use hooks/effects/events; must start with <Styled.InlineCode>&quot;use client&quot;</Styled.InlineCode>.</li>
                    <li><b>Server Action:</b> server-side function (marked with <Styled.InlineCode>&quot;use server&quot;</Styled.InlineCode>) callable from the client or forms.</li>
                    <li><b>SSR:</b> render HTML per request on the server; good for SEO and fast first paint.</li>
                    <li><b>SSG:</b> pre-render at build time; fastest delivery for content that rarely changes.</li>
                    <li><b>ISR:</b> re-generate static pages incrementally on demand or schedule.</li>
                    <li><b>Hydration:</b> attaching event listeners/state to server-rendered HTML on the client.</li>
                    <li><b>Streaming:</b> sending HTML/RSC chunks progressively using <Styled.InlineCode>Suspense</Styled.InlineCode>.</li>
                    <li><b>Serialization:</b> converting data to a transferable format for crossing the server↔client boundary.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>Server Components</b> for data-heavy, non-interactive UI and{" "}
                <b>Client Components</b> for interactivity. Combine with <b>SSR/SSG/ISR</b>,{" "}
                <b>hydration</b>, and <b>streaming</b> to balance performance, DX, and SEO.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RscBasics;
