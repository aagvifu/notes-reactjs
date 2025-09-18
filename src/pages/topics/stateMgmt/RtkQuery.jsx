import { Styled } from "./styled";

const RtkQuery = () => {
    return (
        <Styled.Page>
            <Styled.Title>RTK Query</Styled.Title>

            <Styled.Lead>
                <b>RTK Query</b> is a data fetching and caching tool built into{" "}
                <Styled.InlineCode>@reduxjs/toolkit</Styled.InlineCode>. It lets you
                declare <i>endpoints</i> (queries/mutations), auto-generate React hooks,
                cache server responses, and invalidate/refetch data with minimal code.
            </Styled.Lead>

            {/* 1) Core Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Endpoint:</b> a named API operation you define inside{" "}
                        <Styled.InlineCode>createApi</Styled.InlineCode>. Endpoints are either{" "}
                        <b>queries</b> (read data) or <b>mutations</b> (create/update/delete).
                    </li>
                    <li>
                        <b>Query:</b> a read-only endpoint that fetches data and caches the result
                        by a <em>cache key</em> derived from its arguments.
                    </li>
                    <li>
                        <b>Mutation:</b> a write endpoint that sends changes to the server and usually{" "}
                        <b>invalidates</b> related caches to trigger refetch.
                    </li>
                    <li>
                        <b>Base Query:</b> the low-level request function used by all endpoints
                        (e.g., <Styled.InlineCode>fetchBaseQuery</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Cache / Cache Key:</b> responses are stored in an in-memory cache keyed by
                        the endpoint name + serialized args. Identical args ⇒ same cache entry.
                    </li>
                    <li>
                        <b>Tags &amp; Invalidation:</b> a labeling system (<Styled.InlineCode>tagTypes</Styled.InlineCode>,
                        <Styled.InlineCode>providesTags</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>invalidatesTags</Styled.InlineCode>) that links responses and
                        mutations so RTK Query knows what to refetch.
                    </li>
                    <li>
                        <b>Keep Unused Data:</b>{" "}
                        <Styled.InlineCode>keepUnusedDataFor</Styled.InlineCode> determines how long a
                        cache entry stays after the last component unsubscribes.
                    </li>
                    <li>
                        <b>Auto-generated Hooks:</b> for each endpoint, RTK Query gives you a React hook:
                        <Styled.InlineCode>useGetSomethingQuery</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>useUpdateSomethingMutation</Styled.InlineCode>, etc.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal Setup */}
            <Styled.Section>
                <Styled.H2>Minimal Setup</Styled.H2>
                <Styled.Pre>
                    {`// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',                       // where RTKQ stores cache in Redux state
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post', 'User'],               // declare all tags up-front
  endpoints: (builder) => ({
    // Query: GET /posts
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result) =>
        // result might be undefined initially
        result
          ? [
              ...result.map((p) => ({ type: 'Post', id: p.id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    // Query: GET /posts/:id
    getPost: builder.query({
      query: (id) => \`/posts/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Mutation: POST /posts
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
} = api;`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { api } from './features/api/apiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // ...your other slices
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/main.jsx (wrap the app with Provider)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Using Query & Mutation Hooks */}
            <Styled.Section>
                <Styled.H2>Using the Hooks</Styled.H2>
                <Styled.Pre>
                    {`// Query example
function PostsList() {
  const { data: posts, isLoading, isError, error, refetch } = useGetPostsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p>Error: {error?.status || 'unknown'}</p>;

  return (
    <>
      <button onClick={() => refetch()}>Refetch</button>
      <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </>
  );
}

// Mutation example
function AddPostForm() {
  const [addPost, { isLoading, isSuccess, error }] = useAddPostMutation();

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { title: form.get('title') };
    await addPost(payload); // invalidates 'Post/LIST' → getPosts will refetch
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="title" placeholder="New title" />
      <button disabled={isLoading}>Create</button>
      {isSuccess && <small>Created!</small>}
      {error && <small>Failed.</small>}
    </form>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Caching, Lifetimes, Refetching */}
            <Styled.Section>
                <Styled.H2>Caching, Lifetimes &amp; Refetching</Styled.H2>
                <Styled.List>
                    <li>
                        <b>keepUnusedDataFor:</b> seconds to keep cached data after last subscriber unmounts.
                    </li>
                    <li>
                        <b>refetchOnMountOrArgChange:</b> true/number/'always' — refetch when component mounts
                        or when args change (or if cache is older than N seconds).
                    </li>
                    <li>
                        <b>refetchOnFocus</b> &amp; <b>refetchOnReconnect:</b> auto refetch when window refocuses
                        or network reconnects.
                    </li>
                    <li>
                        <b>pollingInterval:</b> continuously refetch every N ms while the component is mounted.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Per-endpoint options
getPosts: builder.query({
  query: () => '/posts',
  keepUnusedDataFor: 60,            // cache stays 60s after last use
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,    // stale after 30s → refetch on mount
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Tags & Invalidation Patterns */}
            <Styled.Section>
                <Styled.H2>Tags &amp; Invalidation Patterns</Styled.H2>
                <Styled.List>
                    <li>
                        Return a <b>LIST</b> tag for collection queries and individual <b>{`{id}`}</b> tags
                        for per-item queries.
                    </li>
                    <li>
                        Mutations should <b>invalidatesTags</b> for the affected items and/or the LIST to
                        ensure correct refetch.
                    </li>
                    <li>
                        When deleting, invalidate the item's tag and the LIST.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Delete pattern
deletePost: builder.mutation({
  query: (id) => ({ url: \`/posts/\${id}\`, method: 'DELETE' }),
  invalidatesTags: (result, error, id) => [
    { type: 'Post', id },
    { type: 'Post', id: 'LIST' },
  ],
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Selecting Efficiently */}
            <Styled.Section>
                <Styled.H2>Selecting Efficiently (avoid re-renders)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>selectFromResult</Styled.InlineCode> to pluck a small slice from a query result,
                        memoized by RTK Query to avoid unnecessary updates.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pick just a single post by id from the posts list
function PostTitle({ id }) {
  const { data: title } = useGetPostsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find(p => p.id === id)?.title
    }),
  });
  return <span>{title ?? '...'}</span>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Conditional, Lazy & Prefetch */}
            <Styled.Section>
                <Styled.H2>Conditional, Lazy &amp; Prefetch</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Conditional:</b> pass <Styled.InlineCode>skipToken</Styled.InlineCode> to skip until you have the input.
                    </li>
                    <li>
                        <b>Lazy queries:</b>{" "}
                        <Styled.InlineCode>const [trigger, result] = useLazyGetPostQuery()</Styled.InlineCode>{" "}
                        lets you fetch on demand (e.g., button click).
                    </li>
                    <li>
                        <b>Prefetch:</b> use <Styled.InlineCode>api.util.prefetch</Styled.InlineCode> to warm the cache.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { skipToken } from '@reduxjs/toolkit/query';

function UserProfile({ userId }) {
  const queryArg = userId ?? skipToken; // don't fetch until userId exists
  const { data } = useGetPostQuery(queryArg);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// Lazy
function Lookup() {
  const [trigger, { data, isFetching }] = useLazyGetPostQuery();
  return (
    <>
      <button onClick={() => trigger(42)}>Fetch #42</button>
      {isFetching ? 'Loading...' : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Optimistic Updates */}
            <Styled.Section>
                <Styled.H2>Optimistic Updates (updateQueryData)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>onQueryStarted</Styled.InlineCode> to optimistically update cached data and roll back on error.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Inside createApi endpoints
toggleLike: builder.mutation({
  query: (id) => ({ url: \`/posts/\${id}/like\`, method: 'POST' }),
  async onQueryStarted(id, { dispatch, queryFulfilled }) {
    // patch cached list
    const patch = dispatch(
      api.util.updateQueryData('getPosts', undefined, (draft) => {
        const post = draft?.find(p => p.id === id);
        if (post) post.liked = !post.liked;
      })
    );
    try {
      await queryFulfilled;           // commit
    } catch {
      patch.undo();                   // rollback on error
    }
  },
  invalidatesTags: (r, e, id) => [{ type: 'Post', id }],
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Auth, Headers & Errors */}
            <Styled.Section>
                <Styled.H2>Auth, Headers &amp; Error Handling</Styled.H2>
                <Styled.List>
                    <li>
                        Add tokens via <Styled.InlineCode>prepareHeaders</Styled.InlineCode> in{" "}
                        <Styled.InlineCode>fetchBaseQuery</Styled.InlineCode>.
                    </li>
                    <li>
                        Read <Styled.InlineCode>error</Styled.InlineCode> object from hooks for status codes and messages.
                    </li>
                    <li>
                        You can wrap <Styled.InlineCode>baseQuery</Styled.InlineCode> to handle refresh tokens globally.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', \`Bearer \${token}\`);
    return headers;
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> model reads as queries and writes as mutations.</li>
                    <li><b>Do</b> use tags to keep data fresh after writes.</li>
                    <li><b>Do</b> use <Styled.InlineCode>selectFromResult</Styled.InlineCode> to minimize re-renders.</li>
                    <li><b>Don't</b> manually store fetched data in your own slices unless you have a special reason.</li>
                    <li><b>Don't</b> refetch everything; invalidate only what changed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>RTK:</b> Redux Toolkit, the official batteries-included Redux package.</li>
                    <li><b>RTK Query:</b> RTK's data fetching and caching layer.</li>
                    <li><b>Endpoint:</b> a named API operation (query/mutation) defined in <Styled.InlineCode>createApi</Styled.InlineCode>.</li>
                    <li><b>Tag:</b> a label you attach to cached data, used to decide what to refetch.</li>
                    <li><b>Cache key:</b> endpoint + serialized args that identifies a cache entry.</li>
                    <li><b>Optimistic update:</b> update the UI immediately while the request is in flight, roll back on error.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Define endpoints with <i>createApi</i>, use the generated hooks, and let RTK Query
                handle caching and invalidation. Start simple (queries + mutations), then add tags,
                conditional/lazy fetching, and optimistic updates as needed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RtkQuery;
