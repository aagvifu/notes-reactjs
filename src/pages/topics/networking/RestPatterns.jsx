import React from "react";
import { Styled } from "./styled";

const RestPatterns = () => {
    return (
        <Styled.Page>
            <Styled.Title>REST Patterns</Styled.Title>

            <Styled.Lead>
                <b>REST (Representational State Transfer)</b> is an architectural style for building
                stateless client-server APIs over HTTP. In REST, your API exposes <b>resources</b> (things)
                via URLs, and clients transfer <b>representations</b> (usually JSON) of those resources
                using standard HTTP methods (GET, POST, PUT, PATCH, DELETE).
            </Styled.Lead>

            {/* 1) Core terms */}
            <Styled.Section>
                <Styled.H2>Core Terms (precise definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Resource:</b> A business entity or collection (e.g., <Styled.InlineCode>/users</Styled.InlineCode>, <Styled.InlineCode>/orders/42</Styled.InlineCode>).</li>
                    <li><b>Representation:</b> The serialized form sent on the wire (JSON by default), identified by a <b>media type</b> (e.g., <Styled.InlineCode>application/json</Styled.InlineCode>).</li>
                    <li><b>Endpoint (URL):</b> The address for a resource (nouns, plural, hierarchical).</li>
                    <li><b>HTTP Method (Verb):</b> Action semantics (GET read, POST create, PUT replace, PATCH partial update, DELETE remove).</li>
                    <li><b>Safe method:</b> Method that doesn't change state (e.g., GET, HEAD).</li>
                    <li><b>Idempotent method:</b> Repeating the same request has the same effect (PUT, DELETE, GET are idempotent; POST is typically not).</li>
                    <li><b>Status code:</b> 3-digit number describing the result (2xx success, 4xx client error, 5xx server error).</li>
                    <li><b>Header:</b> Key-value metadata (e.g., <Styled.InlineCode>Content-Type</Styled.InlineCode>, <Styled.InlineCode>Authorization</Styled.InlineCode>).</li>
                    <li><b>Content negotiation:</b> Client asks for a representation via <Styled.InlineCode>Accept</Styled.InlineCode> (e.g., JSON).</li>
                    <li><b>Statelessness:</b> Server does not keep client session between requests; all context comes in each request.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Resource modeling & URL design */}
            <Styled.Section>
                <Styled.H2>Resource Modeling & URL Design</Styled.H2>
                <Styled.List>
                    <li>Use <b>nouns</b>, plural for collections: <Styled.InlineCode>/books</Styled.InlineCode>, <Styled.InlineCode>/books/123</Styled.InlineCode>.</li>
                    <li>Model hierarchy/relations: <Styled.InlineCode>/orders/42/items</Styled.InlineCode>.</li>
                    <li><b>Avoid verbs</b> in paths; use HTTP methods for actions (don't do <Styled.InlineCode>/createUser</Styled.InlineCode>).</li>
                    <li>Consistent <b>kebab-case</b> for paths; avoid trailing slashes variance.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Good
GET   /v1/users
GET   /v1/users/42
POST  /v1/users
GET   /v1/orders/42/items

# Avoid
POST  /v1/createUser
GET   /v1/getAllUsers`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Methods & semantics */}
            <Styled.Section>
                <Styled.H2>HTTP Methods & Semantics</Styled.H2>
                <Styled.List>
                    <li><b>GET</b> (safe, idempotent): read resources. May be cached.</li>
                    <li><b>POST</b> (not idempotent): create or perform non-idempotent actions. Returns 201 with <Styled.InlineCode>Location</Styled.InlineCode> header when creating.</li>
                    <li><b>PUT</b> (idempotent): full replace of a resource at the URL.</li>
                    <li><b>PATCH</b> (partial update): send only changed fields (e.g., JSON Merge Patch).</li>
                    <li><b>DELETE</b> (idempotent): remove the resource.</li>
                    <li><b>HEAD</b>: like GET without body. <b>OPTIONS</b>: capability discovery (CORS preflight).</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Create
POST /v1/todos
Content-Type: application/json

{ "title": "Read a book" }

# Response
201 Created
Location: /v1/todos/af3c2
Content-Type: application/json

{ "id": "af3c2", "title": "Read a book", "done": false }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Status codes */}
            <Styled.Section>
                <Styled.H2>Useful Status Codes (when to use)</Styled.H2>
                <Styled.List>
                    <li><b>200 OK</b>: success with body. <b>204 No Content</b>: success without body.</li>
                    <li><b>201 Created</b>: resource created; include <Styled.InlineCode>Location</Styled.InlineCode>.</li>
                    <li><b>202 Accepted</b>: accepted for async processing (use webhook/polling later).</li>
                    <li><b>304 Not Modified</b>: client's cached copy is still valid.</li>
                    <li><b>400 Bad Request</b>: malformed input. <b>401</b> auth required. <b>403</b> forbidden. <b>404</b> not found.</li>
                    <li><b>409 Conflict</b>: version/concurrency conflict. <b>422 Unprocessable Entity</b>: validation failed.</li>
                    <li><b>429 Too Many Requests</b>: rate limit hit. <b>500/503</b>: server issues.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Query patterns */}
            <Styled.Section>
                <Styled.H2>Pagination, Filtering, Sorting, Projection</Styled.H2>
                <Styled.List>
                    <li><b>Offset pagination:</b> <Styled.InlineCode>?page=2&amp;limit=20</Styled.InlineCode> (simple, can be slow on huge pages).</li>
                    <li><b>Cursor pagination:</b> <Styled.InlineCode>?limit=20&amp;cursor=eyJpZCI6IjQyIn0</Styled.InlineCode> (stable for large data/changes).</li>
                    <li><b>Filtering:</b> <Styled.InlineCode>?status=active&amp;tag=react</Styled.InlineCode></li>
                    <li><b>Sorting:</b> <Styled.InlineCode>?sort=-createdAt,title</Styled.InlineCode> (minus for desc).</li>
                    <li><b>Projection (sparse fields):</b> <Styled.InlineCode>?fields=id,title</Styled.InlineCode></li>
                </Styled.List>
                <Styled.Pre>
                    {`# Cursor example
GET /v1/todos?limit=3&cursor=eyJpZCI6ImFmM2MyIn0
Link: <https://api.example.com/v1/todos?limit=3&cursor=NEXT123>; rel="next"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Caching */}
            <Styled.Section>
                <Styled.H2>Caching (ETag, Last-Modified, Cache-Control)</Styled.H2>
                <Styled.List>
                    <li><b>Cache-Control:</b> <Styled.InlineCode>max-age</Styled.InlineCode> (seconds), <Styled.InlineCode>public/private</Styled.InlineCode>, <Styled.InlineCode>s-maxage</Styled.InlineCode> for CDNs.</li>
                    <li><b>ETag:</b> server version fingerprint; client sends <Styled.InlineCode>If-None-Match</Styled.InlineCode> to validate.</li>
                    <li><b>Last-Modified:</b> alternative validator; client sends <Styled.InlineCode>If-Modified-Since</Styled.InlineCode>.</li>
                    <li>On a match, server returns <b>304</b> without body to save bandwidth.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Client validating a cached response
GET /v1/todos/af3c2
If-None-Match: "v7"

# Server
304 Not Modified`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Concurrency & idempotency */}
            <Styled.Section>
                <Styled.H2>Concurrency Control & Idempotency</Styled.H2>
                <Styled.List>
                    <li><b>Optimistic concurrency:</b> send <Styled.InlineCode>If-Match: "etag"</Styled.InlineCode> with PUT/PATCH; server returns <b>409</b> if versions differ.</li>
                    <li><b>Idempotency key (POST):</b> client sends a unique key (e.g., <Styled.InlineCode>Idempotency-Key</Styled.InlineCode>) so retries don't duplicate work (payments, orders).</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Conditional update
PATCH /v1/todos/af3c2
If-Match: "v7"
Content-Type: application/merge-patch+json

{ "done": true }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Versioning */}
            <Styled.Section>
                <Styled.H2>Versioning Strategies</Styled.H2>
                <Styled.List>
                    <li><b>URI versioning:</b> <Styled.InlineCode>/v1/</Styled.InlineCode>, <Styled.InlineCode>/v2/</Styled.InlineCode> (simplest, explicit).</li>
                    <li><b>Header/media type:</b> <Styled.InlineCode>Accept: application/vnd.example.v2+json</Styled.InlineCode>.</li>
                    <li><b>Design for evolution:</b> be additive (new fields), don't rename/remove without a deprecation path.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Errors */}
            <Styled.Section>
                <Styled.H2>Errors (consistent structure)</Styled.H2>
                <Styled.List>
                    <li>Use JSON errors with stable shape, ideally <b>Problem Details</b> (<Styled.InlineCode>application/problem+json</Styled.InlineCode>).</li>
                    <li>Include <Styled.InlineCode>type</Styled.InlineCode>, <Styled.InlineCode>title</Styled.InlineCode>, <Styled.InlineCode>status</Styled.InlineCode>, <Styled.InlineCode>detail</Styled.InlineCode>, optional <Styled.InlineCode>errors[]</Styled.InlineCode> for field issues.</li>
                </Styled.List>
                <Styled.Pre>
                    {`HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type": "https://example.com/problems/validation-error",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "errors": [
    { "field": "title", "message": "Title is required." }
  ]
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Security */}
            <Styled.Section>
                <Styled.H2>Security (must know)</Styled.H2>
                <Styled.List>
                    <li><b>HTTPS only.</b> Never send tokens over HTTP.</li>
                    <li><b>AuthN/AuthZ:</b> API keys (simple), Basic (avoid), Bearer tokens (JWT), OAuth 2.0 (delegated access).</li>
                    <li><b>CORS:</b> configure allowed origins/headers/methods; preflights via <Styled.InlineCode>OPTIONS</Styled.InlineCode>.</li>
                    <li><b>Least privilege:</b> scope tokens; rotate; store securely. Avoid secrets in URLs.</li>
                    <li><b>Rate limiting:</b> protect with limits and return headers (<Styled.InlineCode>X-RateLimit-*</Styled.InlineCode>).</li>
                    <li><b>Input validation:</b> validate & sanitize every input; never trust the client.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Reliability patterns */}
            <Styled.Section>
                <Styled.H2>Reliability Patterns</Styled.H2>
                <Styled.List>
                    <li><b>Timeouts & retries:</b> retry on <b>transient</b> errors (5xx, timeouts) with <b>exponential backoff + jitter</b>.</li>
                    <li><b>Circuit breaker:</b> temporarily stop calls to an unhealthy dependency to recover.</li>
                    <li><b>Async work:</b> return <b>202 Accepted</b> + <Styled.InlineCode>status</Styled.InlineCode> URL, or send <b>webhooks</b> on completion; make webhooks idempotent.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Content types */}
            <Styled.Section>
                <Styled.H2>Media Types & Partial Updates</Styled.H2>
                <Styled.List>
                    <li>Default to <Styled.InlineCode>application/json</Styled.InlineCode> for bodies.</li>
                    <li>For PATCH, consider <Styled.InlineCode>application/merge-patch+json</Styled.InlineCode> (simple) or <Styled.InlineCode>application/json-patch+json</Styled.InlineCode> (RFC 6902 operations).</li>
                    <li>For uploads, use <Styled.InlineCode>multipart/form-data</Styled.InlineCode> (see <i>File Uploads</i> topic).</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) End-to-end flow */}
            <Styled.Section>
                <Styled.H2>Mini Flow (Create → Fetch → Update)</Styled.H2>
                <Styled.Pre>
                    {`# Create a todo
POST /v1/todos
Content-Type: application/json

{ "title": "Ship REST notes" }

# Server
201 Created
Location: /v1/todos/af3c2
ETag: "v1"

# Fetch it (client caches)
GET /v1/todos/af3c2
If-None-Match: "v1"

# Update it safely (conditional)
PATCH /v1/todos/af3c2
If-Match: "v1"
Content-Type: application/merge-patch+json

{ "done": true }

# Server
200 OK
ETag: "v2"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 14) Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> design with nouns + proper HTTP semantics.</li>
                    <li><b>Do</b> provide pagination, filtering, sorting, projection for lists.</li>
                    <li><b>Do</b> cache GETs with ETags; support conditional requests.</li>
                    <li><b>Do</b> return consistent JSON error shapes; include helpful messages.</li>
                    <li><b>Don't</b> break idempotency of PUT/DELETE; don't overload GET to change state.</li>
                    <li><b>Don't</b> expose internal errors or stack traces to clients.</li>
                </Styled.List>
            </Styled.Section>

            {/* 15) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>HATEOAS:</b> Including links in responses to guide the client (optional in many practical APIs).</li>
                    <li><b>Cursor:</b> An opaque token that points to a position in a dataset for pagination.</li>
                    <li><b>ETag:</b> Identifier for a specific version of a resource representation.</li>
                    <li><b>Idempotency key:</b> Client-generated unique key to deduplicate POST requests on retries.</li>
                    <li><b>Problem Details:</b> A standard JSON format for API errors (<Styled.InlineCode>application/problem+json</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Design resource-oriented URLs, use correct HTTP methods, return meaningful status
                codes, standardize errors, support pagination/filtering, and build in caching, versioning,
                security, and reliability from day one. These patterns make REST APIs predictable, fast, and easy to use.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RestPatterns;
