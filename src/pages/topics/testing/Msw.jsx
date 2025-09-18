import React from "react";
import { Styled } from "./styled";

const Msw = () => {
    return (
        <Styled.Page>
            <Styled.Title>MSW (Mock Service Worker)</Styled.Title>

            <Styled.Lead>
                <b>Mock Service Worker (MSW)</b> lets you intercept network requests and return
                <em> realistic </em> mocked responses — in the <b>browser</b> (via a Service Worker) and
                in <b>Node test environments</b>. You can build UI before a backend exists, reproduce edge
                cases, and write stable integration tests that don't hit real servers.
            </Styled.Lead>

            {/* 1) What is API mocking? */}
            <Styled.Section>
                <Styled.H2>Definition: API Mocking</Styled.H2>
                <Styled.List>
                    <li>
                        <b>API mocking</b> means your app still "fetches" data, but a mock layer
                        intercepts the request and returns a crafted response instead of calling the real API.
                    </li>
                    <li>
                        <b>Goal:</b> deterministic, fast, offline-friendly development & testing, with responses that
                        look like production ("fixtures").
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core terms */}
            <Styled.Section>
                <Styled.H2>Key Terms</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Service Worker:</b> a background script in the browser that can intercept network calls.
                        MSW uses it to catch <Styled.InlineCode>fetch</Styled.InlineCode>/<Styled.InlineCode>XHR</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Handler:</b> a matcher + resolver for a route (e.g., GET <Styled.InlineCode>/api/user/:id</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Resolver:</b> the function that builds a response:
                        <Styled.InlineCode>(req, res, ctx) =&gt; res(ctx.status(200), ctx.json(...))</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>REST / GraphQL:</b> MSW has{' '}
                        <Styled.InlineCode>rest.get/post/put/patch/delete</Styled.InlineCode> and{' '}
                        <Styled.InlineCode>graphql.query/mutation</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Node vs Browser:</b> In tests, MSW runs in Node with{' '}
                        <Styled.InlineCode>setupServer</Styled.InlineCode>; in the browser it runs a Service Worker with{' '}
                        <Styled.InlineCode>setupWorker</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Fixture:</b> a realistic sample payload used as mock data.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Install */}
            <Styled.Section>
                <Styled.H2>Install (Dev & Tests)</Styled.H2>
                <Styled.Pre>
                    {`# Add MSW
npm i -D msw

# (Browser only, one-time) Generate the worker file into /public
npx msw init public/ --save`}
                </Styled.Pre>
                <Styled.Small>
                    The init command creates <Styled.InlineCode>public/mockServiceWorker.js</Styled.InlineCode>, which the browser
                    registers to intercept requests in dev.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Handlers (REST + GraphQL) */}
            <Styled.Section>
                <Styled.H2>Define Handlers (REST & GraphQL)</Styled.H2>
                <Styled.Pre>
                    {`// src/mocks/handlers.js
import { rest, graphql } from "msw";

export const handlers = [
  // REST: GET /api/user/:id
  rest.get("/api/user/:id", (req, res, ctx) => {
    const { id } = req.params;
    const user = { id, name: id === "42" ? "Ada Lovelace" : "Linus Torvalds" };
    return res(
      ctx.status(200),
      ctx.delay(200),              // artificial latency
      ctx.json(user)
    );
  }),

  // REST: POST /api/login
  rest.post("/api/login", async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (email === "a@b.com" && password === "secret") {
      return res(ctx.status(200), ctx.json({ token: "jwt-123" }));
    }
    return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
  }),

  // GraphQL: Query user
  graphql.query("GetUser", (req, res, ctx) => {
    const { id } = req.variables;
    return res(ctx.data({ user: { id, name: "Grace Hopper" } }));
  }),
];`}
                </Styled.Pre>
                <Styled.Small>
                    <b>ctx</b> helpers: <Styled.InlineCode>ctx.status</Styled.InlineCode>,{' '}
                    <Styled.InlineCode>ctx.json</Styled.InlineCode>, <Styled.InlineCode>ctx.delay</Styled.InlineCode>,{' '}
                    <Styled.InlineCode>ctx.cookie</Styled.InlineCode>, <Styled.InlineCode>ctx.set</Styled.InlineCode>, etc.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Browser setup */}
            <Styled.Section>
                <Styled.H2>Browser Setup (Dev)</Styled.H2>
                <Styled.Pre>
                    {`// src/mocks/browser.js
import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// src/main.jsx (start worker only in dev)
if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>onUnhandledRequest</b>: <i>"bypass"</i> lets unknown requests hit the real network; use
                    <i>"warn"</i> during debugging to see unexpected calls.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Node (Jest/Vitest) setup */}
            <Styled.Section>
                <Styled.H2>Node Test Setup (Jest/Vitest)</Styled.H2>
                <Styled.Pre>
                    {`// src/mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);

// setupTests.(js|ts) - auto-loaded by Jest/Vitest
import { server } from "./src/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`}
                </Styled.Pre>
                <Styled.Small>
                    <b>resetHandlers()</b> removes per-test overrides so each test starts clean.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Example component + test */}
            <Styled.Section>
                <Styled.H2>Example: Component + Test using MSW</Styled.H2>
                <Styled.Pre>
                    {`// src/components/UserCard.jsx
import React from "react";

export default function UserCard({ id }) {
  const [state, setState] = React.useState({ status: "idle", user: null, error: null });

  React.useEffect(() => {
    let alive = true;
    setState({ status: "loading", user: null, error: null });

    fetch(\`/api/user/\${id}\`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      .then(data => alive && setState({ status: "success", user: data, error: null }))
      .catch(err => alive && setState({ status: "error", user: null, error: err.message }));

    return () => { alive = false; };
  }, [id]);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error")   return <p role="alert">Error: {state.error}</p>;
  return <p data-testid="name">{state.user.name}</p>;
}`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/components/__tests__/UserCard.test.jsx
import { render, screen } from "@testing-library/react";
import UserCard from "../UserCard";
import { server } from "../../mocks/server";
import { rest } from "msw";

test("renders the mocked user", async () => {
  render(<UserCard id="42" />);
  expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
});

test("can override a handler for one test", async () => {
  server.use(
    rest.get("/api/user/:id", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: "Boom" }));
    })
  );
  render(<UserCard id="42" />);
  expect(await screen.findByRole("alert")).toHaveTextContent("HTTP 500");
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>server.use(...)</b> overrides a handler for the current test. Use <b>res.once(...)</b> to apply only once.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Advanced: one-time, delays, cookies */}
            <Styled.Section>
                <Styled.H2>Advanced Patterns</Styled.H2>
                <Styled.Pre>
                    {`// One-time failure, then success
server.use(
  rest.get("/api/ping", (req, res, ctx) => res.once(ctx.status(503))),
  rest.get("/api/ping", (req, res, ctx) => res(ctx.status(200), ctx.text("ok")))
);

// Set a cookie and header
rest.post("/api/login", async (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.cookie("token", "jwt-123", { httpOnly: true }),
    ctx.set("x-request-id", "abc")
  );
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep fixtures realistic and cover success, empty, and error states.</li>
                    <li><b>Do</b> colocate handlers with the API surface (one file per feature) for discoverability.</li>
                    <li><b>Do</b> use <Styled.InlineCode>onUnhandledRequest: "error"</Styled.InlineCode> in CI to catch accidental real calls.</li>
                    <li><b>Don't</b> mock <em>inside</em> components; keep mocks at the edge (MSW). Components should not know about mocking.</li>
                    <li><b>Don't</b> overfit handlers to a specific test; prefer general handlers and override per test when needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li>If nothing is intercepted in the browser, ensure the worker script exists in <Styled.InlineCode>/public</Styled.InlineCode> and the worker is <b>started</b> in dev.</li>
                    <li>Paths must match exactly. Prefer relative app routes (<Styled.InlineCode>"/api/..."</Styled.InlineCode>) over absolute domains to simplify dev.</li>
                    <li>In tests, make sure <Styled.InlineCode>setupTests</Styled.InlineCode> runs (Jest config) and you're importing from the same <Styled.InlineCode>server</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: MSW intercepts requests in browser and tests, returning realistic responses. Define
                <i> handlers</i> for routes, craft responses with <i>ctx</i>, and run the worker in dev or
                the Node server in tests. Keep mocks realistic and centralised for reliable, maintainable UI.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Msw;
