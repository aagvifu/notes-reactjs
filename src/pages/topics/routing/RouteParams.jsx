import { Styled } from "./styled";

const RouteParams = () => {
    return (
        <Styled.Page>
            <Styled.Title>Route Params</Styled.Title>

            <Styled.Lead>
                <b>Route params</b> are <em>dynamic segments</em> in a route path
                (e.g., <Styled.InlineCode>/users/:userId</Styled.InlineCode>) that
                capture values from the URL <b>pathname</b>. In React Router, matched
                values are read with <Styled.InlineCode>useParams()</Styled.InlineCode> as strings.
            </Styled.Lead>

            {/* 1) Key definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Pathname:</b> the path part of the URL (e.g., <Styled.InlineCode>/users/42</Styled.InlineCode>).</li>
                    <li><b>Segment:</b> a section of the path between slashes (e.g., <Styled.InlineCode>users</Styled.InlineCode>, <Styled.InlineCode>42</Styled.InlineCode>).</li>
                    <li><b>Route param:</b> a dynamic segment declared with a leading colon (e.g., <Styled.InlineCode>:userId</Styled.InlineCode>).</li>
                    <li><b>Query/search params:</b> the <Styled.InlineCode>?key=value</Styled.InlineCode> part of the URL. <b>Not</b> the same as route params; read via <Styled.InlineCode>useSearchParams()</Styled.InlineCode>.</li>
                    <li><b>Splat (<Styled.InlineCode>*</Styled.InlineCode>)</b>: a catch-all segment that matches “the rest” of the path (read from param named <Styled.InlineCode>"*"</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Declaring & reading params */}
            <Styled.Section>
                <Styled.H2>Declare &amp; Read Route Params</Styled.H2>
                <Styled.Pre>
                    {`// routes
<Route path="/users/:userId" element={<UserDetail />} />

// component
import { useParams } from "react-router-dom";

function UserDetail() {
  const { userId } = useParams();           // always a string
  const id = Number(userId);                // cast if you need a number

  // Fetch or render with the id...
  return <p>User ID: {id}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> <Styled.InlineCode>useParams()</Styled.InlineCode> returns URL-decoded strings.
                    Convert types yourself (<Styled.InlineCode>Number()</Styled.InlineCode>, <Styled.InlineCode>Boolean()</Styled.InlineCode>, JSON parse, etc.).
                </Styled.Small>
            </Styled.Section>

            {/* 3) Nested params */}
            <Styled.Section>
                <Styled.H2>Nested Routes &amp; Multiple Params</Styled.H2>
                <Styled.Pre>
                    {`// routes
<Route path="/orgs/:orgId" element={<OrgLayout />}>
  <Route path="projects/:projectId" element={<ProjectDetail />} />
</Route>

// child sees both params
import { useParams } from "react-router-dom";
function ProjectDetail() {
  const { orgId, projectId } = useParams();
  return <p>Org: {orgId} · Project: {projectId}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Params from parent routes are <b>merged</b> with child params when reading via <Styled.InlineCode>useParams()</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Links that include params */}
            <Styled.Section>
                <Styled.H2>Linking to Routes with Params</Styled.H2>
                <Styled.Pre>
                    {`import { Link, generatePath } from "react-router-dom";

function UserLink({ id }) {
  const to = generatePath("/users/:userId", { userId: String(id) });
  return <Link to={to}>Open User {id}</Link>;
}

// Or manually:
<Link to={"/users/" + encodeURIComponent(id)}>Open</Link>;`}
                </Styled.Pre>
                <Styled.Small>
                    <Styled.InlineCode>generatePath()</Styled.InlineCode> reduces typos and keeps paths in sync
                    with your route definitions.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Splat / catch-all */}
            <Styled.Section>
                <Styled.H2>Catch-All (Splat) Params</Styled.H2>
                <Styled.Pre>
                    {`// routes
<Route path="/files/*" element={<FileViewer />} />

// component
import { useParams } from "react-router-dom";
function FileViewer() {
  const { "*": path } = useParams();   // e.g., "docs/guide/intro.md"
  return <p>Path: {path}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The splat captures any remaining segments (including slashes) as a single string.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Validation & guards */}
            <Styled.Section>
                <Styled.H2>Validating Params</Styled.H2>
                <Styled.List>
                    <li>All params are strings—validate and coerce before using.</li>
                    <li>For numbers, check <Styled.InlineCode>Number.isFinite(Number(v))</Styled.InlineCode>.</li>
                    <li>For IDs with known shapes (e.g., UUID), validate with a regex and handle invalid cases (redirect or show 404).</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { useNavigate, useParams } from "react-router-dom";

function ProductPage() {
  const nav = useNavigate();
  const { productId } = useParams();
  if (!/^[a-z0-9-]+$/i.test(productId)) {
    nav("/not-found", { replace: true });
    return null;
  }
  // ...render valid product
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Search vs route params */}
            <Styled.Section>
                <Styled.H2>Route Params vs Search Params</Styled.H2>
                <Styled.List>
                    <li><b>Route params:</b> part of the <b>path</b>; define <Styled.InlineCode>:param</Styled.InlineCode> in the route.</li>
                    <li><b>Search params:</b> part of the <b>query string</b> after <Styled.InlineCode>?</Styled.InlineCode>; change independently without re-defining routes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Search params example:
import { useSearchParams } from "react-router-dom";

function Search() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSp({ q }); }}>
      <input value={q} onChange={(e) => setSp({ q: e.target.value })} />
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Assuming numbers:</b> params are strings; always coerce if you need numeric logic.</li>
                    <li><b>Optional segments:</b> React Router doesn’t support optional segments in the path string; define separate routes or restructure.</li>
                    <li><b>Encoding:</b> when building URLs manually, <Styled.InlineCode>encodeURIComponent()</Styled.InlineCode> values to avoid broken paths.</li>
                    <li><b>Ambiguous routes:</b> design routes to avoid collisions (e.g., <Styled.InlineCode>/users/new</Styled.InlineCode> vs <Styled.InlineCode>/users/:userId</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep param names descriptive (<Styled.InlineCode>:userId</Styled.InlineCode>, <Styled.InlineCode>:slug</Styled.InlineCode>).</li>
                    <li><b>Do</b> coerce and validate before using params in logic or network calls.</li>
                    <li><b>Do</b> use <Styled.InlineCode>generatePath()</Styled.InlineCode> or helper functions to create URLs.</li>
                    <li><b>Don’t</b> overload a single route with unrelated meanings—create clear routes.</li>
                    <li><b>Don’t</b> confuse route params (path) with search params (query string).</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>useParams():</b> hook to read matched route params as an object of strings.</li>
                    <li><b>generatePath():</b> helper that replaces <Styled.InlineCode>:param</Styled.InlineCode> placeholders with actual values to form a URL.</li>
                    <li><b>Splat:</b> a <Styled.InlineCode>*</Styled.InlineCode> catch-all segment that captures the rest of the path.</li>
                    <li><b>Path matching:</b> how React Router decides which route best matches the current pathname.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <b>route params</b> for entity identity (user, product, post). Read them with
                <Styled.InlineCode>useParams()</Styled.InlineCode>, validate/coerce types, and build links via
                <Styled.InlineCode>generatePath()</Styled.InlineCode>. Use <b>search params</b> for user-controlled
                options (filters, sort, pagination).
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RouteParams;
