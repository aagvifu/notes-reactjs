import React from "react";
import { Styled } from "./styled";

const GraphqlClients = () => {
    return (
        <Styled.Page>
            <Styled.Title>GraphQL Clients</Styled.Title>

            <Styled.Lead>
                A <b>GraphQL client</b> is a library that helps your React app send <i>operations</i> (queries,
                mutations, subscriptions) to a GraphQL <i>endpoint</i>, cache results, manage loading/errors,
                and keep your UI in sync. Popular choices: Apollo Client, Relay, URQL. You can also use
                a minimal “fetch + TanStack Query” approach.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core concepts & definitions</Styled.H2>
                <Styled.List>
                    <li><b>GraphQL</b>: a query language where the client asks for exactly the fields it needs.</li>
                    <li><b>Schema</b>: the contract of types and fields (written in SDL) that the server exposes.</li>
                    <li><b>Resolver</b>: server function that resolves a field's data for a query/mutation/subscription.</li>
                    <li><b>Operation</b>: a single query, mutation, or subscription document sent to the server.</li>
                    <li><b>Endpoint</b>: the HTTP/WS URL that accepts GraphQL operations (often <Styled.InlineCode>/graphql</Styled.InlineCode>).</li>
                    <li><b>Transport</b>: how operations travel—HTTP (POST/GET) for queries/mutations, WebSocket/SSE for subscriptions.</li>
                    <li><b>Cache</b>: client-side store of results to avoid refetching and keep UI reactive.</li>
                    <li><b>Fragment</b>: reusable field selection that can be composed across queries.</li>
                    <li><b>Normalization</b>: cache technique that stores entities by ID so multiple queries share the same data.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why a client */}
            <Styled.Section>
                <Styled.H2>Why use a GraphQL client?</Styled.H2>
                <Styled.List>
                    <li><b>Convenience</b>: hooks like <Styled.InlineCode>useQuery</Styled.InlineCode>, <Styled.InlineCode>useMutation</Styled.InlineCode>.</li>
                    <li><b>Caching</b>: normalized caches update the UI automatically when related data changes.</li>
                    <li><b>Pagination</b>: helper patterns for cursor/offset pagination.</li>
                    <li><b>Optimistic UI</b>: show instant results before the server responds.</li>
                    <li><b>Transport</b>: HTTP + WebSocket support for realtime subscriptions.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Apollo Client: setup */}
            <Styled.Section>
                <Styled.H2>Apollo Client — Quick Start</Styled.H2>
                <Styled.Small>Install: <Styled.InlineCode>npm i @apollo/client graphql</Styled.InlineCode></Styled.Small>
                <Styled.Pre>
                    {`// apollo.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({ uri: "/graphql", credentials: "include" }), // set your endpoint
  cache: new InMemoryCache(), // normalized by default
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// main.jsx
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";

<ApolloProvider client={client}>
  <App />
</ApolloProvider>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Apollo: query */}
            <Styled.Section>
                <Styled.H2>Query with <code>useQuery</code></Styled.H2>
                <Styled.Pre>
                    {`import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql\`
  query Posts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      edges { node { id title excerpt } cursor }
      pageInfo { endCursor hasNextPage }
    }
  }
\`;

export default function PostsList() {
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: 10 },
  });

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { edges, pageInfo } = data.posts;

  return (
    <>
      <ul>{edges.map(e => <li key={e.node.id}>{e.node.title}</li>)}</ul>
      {pageInfo.hasNextPage && (
        <button
          onClick={() =>
            fetchMore({ variables: { after: pageInfo.endCursor } })
          }
        >
          Load more
        </button>
      )}
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Cursor pagination</b>: use <Styled.InlineCode>endCursor</Styled.InlineCode> and{" "}
                    <Styled.InlineCode>hasNextPage</Styled.InlineCode> from <i>Relay-style</i> connections.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Apollo: mutation + optimistic */}
            <Styled.Section>
                <Styled.H2>Mutation with optimistic UI & cache update</Styled.H2>
                <Styled.Pre>
                    {`import { gql, useMutation } from "@apollo/client";

const ADD_POST = gql\`
  mutation AddPost($title: String!) {
    addPost(title: $title) { id title }
  }
\`;

export function AddPostForm() {
  const [title, setTitle] = React.useState("");
  const [addPost] = useMutation(ADD_POST, {
    optimisticResponse: {
      addPost: { __typename: "Post", id: "temp-id", title },
    },
    update(cache, { data }) {
      // optional: merge into list queries, e.g., cache.modify(...)
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addPost({ variables: { title } });
        setTitle("");
      }}
    >
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Optimistic response</b> instantly updates UI. Later, the real server result reconciles the cache.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Auth headers */}
            <Styled.Section>
                <Styled.H2>Authentication (headers)</Styled.H2>
                <Styled.Pre>
                    {`import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, authorization: token ? \`Bearer \${token}\` : "" },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: "/graphql" })),
  cache: new InMemoryCache(),
});`}
                </Styled.Pre>
                <Styled.Small>
                    Add <b>Authorization</b> or other headers per request. Prefer secure storage and HTTPS.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Subscriptions */}
            <Styled.Section>
                <Styled.H2>Realtime: Subscriptions</Styled.H2>
                <Styled.Small>Use WebSockets with <Styled.InlineCode>graphql-ws</Styled.InlineCode>.</Styled.Small>
                <Styled.Pre>
                    {`// npm i graphql-ws
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { split, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({ uri: "/graphql" });

const wsLink = new GraphQLWsLink(createClient({ url: "ws://localhost:4000/graphql" }));

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({ link, cache: new InMemoryCache() });`}
                </Styled.Pre>
                <Styled.Pre>
                    {`import { gql, useSubscription } from "@apollo/client";

const NEW_POST = gql\`subscription { postAdded { id title } }\`;

function LiveFeed() {
  const { data } = useSubscription(NEW_POST);
  return <div>New: {data?.postAdded?.title}</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) File uploads */}
            <Styled.Section>
                <Styled.H2>File uploads</Styled.H2>
                <Styled.Small>
                    Use the <b>GraphQL multipart request</b> spec (e.g., <Styled.InlineCode>apollo-upload-client</Styled.InlineCode>).
                </Styled.Small>
                <Styled.Pre>
                    {`// npm i apollo-upload-client
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: createUploadLink({ uri: "/graphql" }),
  cache: new InMemoryCache(),
});

// Mutation example (server must accept Upload scalar):
// mutation($file: Upload!) { uploadFile(file: $file) { id url } }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Errors */}
            <Styled.Section>
                <Styled.H2>Error handling</Styled.H2>
                <Styled.List>
                    <li><b>GraphQL errors</b>: returned in <Styled.InlineCode>errors[]</Styled.InlineCode> with HTTP 200 (query resolved but had field-level errors).</li>
                    <li><b>Network errors</b>: transport failures (4xx/5xx, CORS, offline) surfaced as thrown errors.</li>
                    <li>Check both <Styled.InlineCode>error.graphQLErrors</Styled.InlineCode> and <Styled.InlineCode>error.networkError</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Alternatives overview */}
            <Styled.Section>
                <Styled.H2>Alternatives & when to choose them</Styled.H2>
                <Styled.List>
                    <li><b>Relay</b>: powerful normalized cache, <i>fragment colocation</i>, compile step, best for large graphs with strict conventions.</li>
                    <li><b>URQL</b>: lightweight with pluggable <i>exchanges</i>, good balance of features and simplicity.</li>
                    <li><b>TanStack Query + fetch</b>: not a GraphQL client, but great for data fetching/caching; pair with a tiny <i>fetchGraphQL</i> helper.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// URQL example
import { createClient, Provider, useQuery } from "urql";
const client = createClient({ url: "/graphql" });

function Users() {
  const [res] = useQuery({ query: \`{ users { id name } }\` });
  if (res.fetching) return "Loading";
  if (res.error) return res.error.message;
  return res.data.users.map(u => <div key={u.id}>{u.name}</div>);
}

// TanStack Query + fetchGraphQL
async function fetchGraphQL(query, variables) {
  const res = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> model your schema for <i>cursor pagination</i> and stable IDs; clients rely on IDs for normalization.</li>
                    <li><b>Do</b> colocate queries with components or use fragments to keep data needs clear.</li>
                    <li><b>Do</b> handle <i>both</i> GraphQL and network errors in the UI.</li>
                    <li><b>Don't</b> overfetch—ask only for fields you render; keep documents small and focused.</li>
                    <li><b>Don't</b> block the UI while refetching; show loading states or use background updates.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>SDL</b>: Schema Definition Language (<Styled.InlineCode>type Query {`... `}</Styled.InlineCode>).</li>
                    <li><b>Document</b>: text that contains queries/mutations/subscriptions and fragments.</li>
                    <li><b>Normalization</b>: storing entities by ID (<Styled.InlineCode>{"{Post: {1: {...}}}"}</Styled.InlineCode>) so multiple queries share references.</li>
                    <li><b>Optimistic UI</b>: temporary client-side result applied before the server responds.</li>
                    <li><b>Exchange/Link</b>: URQL/Apollo plugin stages that modify/route operations.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: pick a client that fits your app scale. Apollo balances features and ease; Relay excels at
                large graphs with strict patterns; URQL is lean and flexible. Learn queries, mutations, subscriptions,
                caching, pagination, and error handling, and you'll be productive with any GraphQL stack.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default GraphqlClients;
