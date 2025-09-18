import { Styled } from "./styled";

const FetchBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Fetch Basics</Styled.Title>

            <Styled.Lead>
                The <b>Fetch API</b> is the browser's built-in, promise-based way to request data over HTTP.
                You call <Styled.InlineCode>fetch(url, options?)</Styled.InlineCode> to get a{" "}
                <Styled.InlineCode>Response</Styled.InlineCode>, then parse it with{" "}
                <Styled.InlineCode>response.json()</Styled.InlineCode>,{" "}
                <Styled.InlineCode>response.text()</Styled.InlineCode>, etc. Fetch works with
                standard web concepts: <i>URL</i>, <i>method</i>, <i>headers</i>, <i>body</i>, and
                <i>status codes</i>.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is "fetch"? Why use it?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Fetch API:</b> a browser API for making network requests that returns a{" "}
                        <Styled.InlineCode>Promise</Styled.InlineCode> resolving to a{" "}
                        <Styled.InlineCode>Response</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>HTTP request:</b> a message you send to a server with a{" "}
                        <Styled.InlineCode>method</Styled.InlineCode> (GET/POST/PUT/DELETE…),{" "}
                        <Styled.InlineCode>URL</Styled.InlineCode>, optional{" "}
                        <Styled.InlineCode>headers</Styled.InlineCode> and a{" "}
                        <Styled.InlineCode>body</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>HTTP response:</b> server's reply containing a{" "}
                        <Styled.InlineCode>status</Styled.InlineCode> (200, 404, 500…),{" "}
                        <Styled.InlineCode>headers</Styled.InlineCode>, and a{" "}
                        <Styled.InlineCode>body</Styled.InlineCode> (often JSON).
                    </li>
                    <li>
                        <b>When to use:</b> load or send data to REST/GraphQL APIs, upload files, download
                        assets, and call your own backend routes.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal GET */}
            <Styled.Section>
                <Styled.H2>Minimal GET request</Styled.H2>
                <Styled.Pre>
                    {`async function loadUsers() {
  const res = await fetch("https://api.example.com/users?limit=10");
  if (!res.ok) {
    // res.ok is true for 2xx status codes
    throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
  }
  const data = await res.json(); // parse body as JSON
  return data;                   // array of users, for example
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Key idea:</b> <Styled.InlineCode>fetch</Styled.InlineCode> only rejects the promise on
                    <i>network failures</i>. HTTP errors (e.g., 404/500) still resolve — check{" "}
                    <Styled.InlineCode>res.ok</Styled.InlineCode>/<Styled.InlineCode>res.status</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Parsing: json/text/blob/arrayBuffer */}
            <Styled.Section>
                <Styled.H2>Parsing the response body</Styled.H2>
                <Styled.List>
                    <li>
                        <b><Styled.InlineCode>response.json()</Styled.InlineCode>:</b> parse JSON payload into a JS value.
                    </li>
                    <li>
                        <b><Styled.InlineCode>response.text()</Styled.InlineCode>:</b> get raw text (HTML, CSV, plain text).
                    </li>
                    <li>
                        <b><Styled.InlineCode>response.blob()</Styled.InlineCode>:</b> binary data (images/files) as a{" "}
                        <Styled.InlineCode>Blob</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><Styled.InlineCode>response.arrayBuffer()</Styled.InlineCode>:</b> low-level binary buffer for custom parsing.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: download an image as a Blob
const res = await fetch("/avatar.png");
const blob = await res.blob();
const url = URL.createObjectURL(blob);
document.querySelector("img").src = url;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) POST JSON */}
            <Styled.Section>
                <Styled.H2>POST with JSON</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Content-Type:</b> tells the server how to interpret the body. For JSON use{" "}
                        <Styled.InlineCode>application/json</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Accept:</b> what response types you can handle (often{" "}
                        <Styled.InlineCode>application/json</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`async function createUser(user) {
  const res = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json(); // new user
}

// Usage:
// const newUser = await createUser({ name: "Ashish", email: "a@b.com" });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Error handling patterns */}
            <Styled.Section>
                <Styled.H2>Error handling</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Network error:</b> DNS down, offline, CORS blocked → the promise <i>rejects</i> and you
                        catch in <Styled.InlineCode>try/catch</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>HTTP error:</b> server returned 4xx/5xx → the promise <i>resolves</i> but{" "}
                        <Styled.InlineCode>res.ok</Styled.InlineCode> is <i>false</i>. Throw manually after checking status.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // server responded with an error status
      const problem = await res.text();
      throw new Error(\`HTTP \${res.status}: \${problem}\`);
    }
    return await res.json();
  } catch (err) {
    // network/CORS/parse errors end up here
    console.error("Request failed:", err);
    throw err;
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Request options overview */}
            <Styled.Section>
                <Styled.H2>Useful request options</Styled.H2>
                <Styled.List>
                    <li>
                        <b><Styled.InlineCode>method</Styled.InlineCode>:</b> HTTP verb (<i>GET, POST, PUT, PATCH, DELETE</i>).
                    </li>
                    <li>
                        <b><Styled.InlineCode>headers</Styled.InlineCode>:</b> metadata like{" "}
                        <Styled.InlineCode>Authorization</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Content-Type</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>Accept</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><Styled.InlineCode>body</Styled.InlineCode>:</b> request payload (string, FormData, Blob, etc.).
                    </li>
                    <li>
                        <b><Styled.InlineCode>credentials</Styled.InlineCode>:</b>{" "}
                        <Styled.InlineCode>"omit"</Styled.InlineCode> (default),{" "}
                        <Styled.InlineCode>"same-origin"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"include"</Styled.InlineCode> to send cookies/auth.
                    </li>
                    <li>
                        <b><Styled.InlineCode>mode</Styled.InlineCode>:</b>{" "}
                        <Styled.InlineCode>"cors"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"no-cors"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"same-origin"</Styled.InlineCode> (controls cross-origin behavior).
                    </li>
                    <li>
                        <b><Styled.InlineCode>cache</Styled.InlineCode>:</b>{" "}
                        <Styled.InlineCode>"default"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"no-store"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"reload"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"no-cache"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"force-cache"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"only-if-cached"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><Styled.InlineCode>redirect</Styled.InlineCode>:</b>{" "}
                        <Styled.InlineCode>"follow"</Styled.InlineCode> (default),{" "}
                        <Styled.InlineCode>"error"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"manual"</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><Styled.InlineCode>signal</Styled.InlineCode>:</b> cancel with{" "}
                        <Styled.InlineCode>AbortController</Styled.InlineCode> (covered in the next topic).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: authenticated GET bypassing cache
const res = await fetch("/api/profile", {
  headers: { Authorization: "Bearer <token>" },
  cache: "no-store"
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) CORS (high level) */}
            <Styled.Section>
                <Styled.H2>CORS (Cross-Origin Resource Sharing) — the 1-minute version</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Same-origin policy:</b> the browser restricts scripts from reading responses from a different
                        <i>origin</i> (scheme + host + port) unless the server explicitly allows it.
                    </li>
                    <li>
                        <b>CORS:</b> a server opt-in via headers like{" "}
                        <Styled.InlineCode>Access-Control-Allow-Origin</Styled.InlineCode> that permit cross-origin reads.
                    </li>
                    <li>
                        <b>Preflight:</b> for non-simple requests (custom headers, JSON POST, etc.) the browser sends an{" "}
                        <Styled.InlineCode>OPTIONS</Styled.InlineCode> check first.
                    </li>
                </Styled.List>
                <Styled.Small>
                    If you see CORS errors in DevTools, fix them <i>on the server</i> (configure allowed origins/headers/methods).
                </Styled.Small>
            </Styled.Section>

            {/* 8) Basic caching concepts */}
            <Styled.Section>
                <Styled.H2>Basic caching concepts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>HTTP cache:</b> the browser can store successful GET responses and reuse them based on
                        <Styled.InlineCode>Cache-Control</Styled.InlineCode>, <Styled.InlineCode>ETag</Styled.InlineCode>, and{" "}
                        <Styled.InlineCode>Last-Modified</Styled.InlineCode> headers from the server.
                    </li>
                    <li>
                        <b>Client overrides:</b> request <Styled.InlineCode>cache</Styled.InlineCode> option can bypass or prefer cache
                        (<Styled.InlineCode>"no-store"</Styled.InlineCode> to skip completely).
                    </li>
                    <li>
                        <b>App-level caching:</b> libraries like SWR or TanStack Query add deduping, caching, invalidation,
                        and background revalidation (covered later in this section).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Force a fresh fetch, ignoring the HTTP cache:
await fetch("/api/items", { cache: "no-store" });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Performance & UX tips */}
            <Styled.Section>
                <Styled.H2>Performance & UX tips</Styled.H2>
                <Styled.List>
                    <li><b>Don't refetch on every render:</b> put side-effect fetches inside <Styled.InlineCode>useEffect</Styled.InlineCode>.</li>
                    <li><b>Debounce search inputs:</b> wait a bit before querying as the user types.</li>
                    <li><b>Batch concurrent requests:</b> use <Styled.InlineCode>Promise.all</Styled.InlineCode> when possible.</li>
                    <li><b>Show clear states:</b> <i>loading</i>, <i>error</i>, <i>empty</i>, <i>success</i> (details in "Loading & Error States").</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> check <Styled.InlineCode>res.ok</Styled.InlineCode> and parse with the right method.</li>
                    <li><b>Do</b> send the correct <Styled.InlineCode>Content-Type</Styled.InlineCode> and <Styled.InlineCode>Accept</Styled.InlineCode>.</li>
                    <li><b>Do</b> handle both network and HTTP errors.</li>
                    <li><b>Don't</b> log tokens or secrets; keep them in headers/env.</li>
                    <li><b>Don't</b> rely on defaults you don't control; be explicit.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>URL:</b> address of a resource (scheme, host, path, query, hash).</li>
                    <li><b>Method:</b> action to perform (GET = read, POST = create, PUT/PATCH = update, DELETE = remove).</li>
                    <li><b>Status code:</b> numeric result of the request (2xx success, 3xx redirect, 4xx client error, 5xx server error).</li>
                    <li><b>Headers:</b> key–value metadata sent with a request/response.</li>
                    <li><b>Body:</b> payload of a request/response (JSON, text, form-data, binary).</li>
                    <li><b>CORS:</b> server-controlled mechanism to allow cross-origin access.</li>
                    <li><b>Cache:</b> storage of responses to speed up subsequent requests.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <Styled.InlineCode>fetch</Styled.InlineCode> to request data, check{" "}
                <Styled.InlineCode>res.ok</Styled.InlineCode>, parse with the correct method, handle both HTTP and
                network errors, and be explicit with headers and options. We'll cover cancellation next with{" "}
                <i>AbortController</i>, and then robust loading/error states and caching libraries.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FetchBasics;
