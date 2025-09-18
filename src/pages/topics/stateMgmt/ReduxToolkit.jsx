import { Styled } from "./styled";

const ReduxToolkit = () => {
    return (
        <Styled.Page>
            <Styled.Title>Redux Toolkit (RTK)</Styled.Title>

            <Styled.Lead>
                <b>Redux Toolkit (RTK)</b> is the official, batteries-included way to write Redux.
                It reduces boilerplate, uses <Styled.InlineCode>Immer</Styled.InlineCode> for immutable updates,
                configures sensible defaults (DevTools, Thunk), and encourages good patterns.
            </Styled.Lead>

            {/* 1) Why RTK */}
            <Styled.Section>
                <Styled.H2>Why Redux Toolkit?</Styled.H2>
                <Styled.List>
                    <li><b>Less code:</b> <Styled.InlineCode>createSlice</Styled.InlineCode> generates actions + reducer together.</li>
                    <li><b>Safe updates:</b> write "mutating" logic; Immer produces immutable state under the hood.</li>
                    <li><b>Good defaults:</b> DevTools, Thunk, serializable checks via <Styled.InlineCode>configureStore</Styled.InlineCode>.</li>
                    <li><b>Consistent structure:</b> slices for each domain; simple to scale.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core terms (precise definitions) */}
            <Styled.Section>
                <Styled.H2>Core Terms</Styled.H2>
                <Styled.List>
                    <li><b>Redux:</b> a predictable state container using a single state tree and pure reducers.</li>
                    <li><b>Store:</b> an object that holds app state and lets you <i>dispatch</i> actions.</li>
                    <li><b>State tree:</b> the current snapshot of your app's data inside the store.</li>
                    <li><b>Action:</b> a plain object that describes “what happened” (at minimum a <Styled.InlineCode>type</Styled.InlineCode>).</li>
                    <li><b>Reducer:</b> a function <Styled.InlineCode>(state, action) ⇒ newState</Styled.InlineCode> with no side-effects.</li>
                    <li><b>Slice:</b> a Redux Toolkit unit containing a reducer + its initial state + auto-generated actions.</li>
                    <li><b>Dispatch:</b> the way to send an action (or thunk) to the store to update state.</li>
                    <li><b>Selector:</b> a function that reads/derives data from the store (e.g., <Styled.InlineCode>state.todos.items</Styled.InlineCode>).</li>
                    <li><b>Middleware:</b> functions that sit between dispatch and reducer (logging, async, analytics).</li>
                    <li><b>Thunk:</b> a function returned by an action creator to run async logic, then dispatch real actions.</li>
                    <li><b>Immer:</b> a library that lets you write "mutating" code while producing immutable updates safely.</li>
                    <li><b>createSlice:</b> RTK helper to define a slice and generate action creators + reducer.</li>
                    <li><b>configureStore:</b> RTK helper to create the store with good defaults (DevTools + middleware).</li>
                    <li><b>createAsyncThunk:</b> RTK helper to model async flows with <i>pending/fulfilled/rejected</i> actions.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Quick start - counter slice */}
            <Styled.Section>
                <Styled.H2>Quick Start: A Counter Slice</Styled.H2>
                <Styled.Pre>
                    {`// src/store/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      // Allowed to "mutate" thanks to Immer
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    addBy(state, action) {
      state.value += action.payload;
    },
    reset() {
      return initialState; // returning a new state object is also fine
    },
  },
});

export const { increment, decrement, addBy, reset } = counterSlice.actions;
export default counterSlice.reducer;
`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  // middleware and devTools are on by default; customize if needed
});
`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/main.jsx - wire <Provider>
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// Example component usage
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, addBy, reset } from "../store/counterSlice";

export default function Counter() {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <p>Count: {value}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(addBy(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </>
  );
}
`}
                </Styled.Pre>

                <Styled.Small>
                    Note: <Styled.InlineCode>createSlice</Styled.InlineCode> auto-creates action creators with
                    types like <Styled.InlineCode>"counter/increment"</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Async basics - createAsyncThunk */}
            <Styled.Section>
                <Styled.H2>Async with <code>createAsyncThunk</code></Styled.H2>
                <Styled.List>
                    <li><b>What:</b> a helper to express async work; it emits <i>pending</i>, <i>fulfilled</i>, and <i>rejected</i> actions.</li>
                    <li><b>Why:</b> standardizes loading/error handling and reduces manual action types.</li>
                    <li><b>Where:</b> define thunks near the slice they affect for clarity.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// src/store/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk: fetch users
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch");
  return await res.json(); // becomes action.payload on fulfilled
});

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default usersSlice.reducer;
`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// Usage in a component
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/usersSlice";

export default function UsersList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.users);

  React.useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <ul>
      {items.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Tip:</b> avoid duplicating <i>loading</i> flags in many places-centralize in the slice.
                    For advanced caching/data fetching, use <Styled.InlineCode>RTK Query</Styled.InlineCode> (your next topic).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Selectors (derive data) */}
            <Styled.Section>
                <Styled.H2>Selectors</Styled.H2>
                <Styled.List>
                    <li><b>Selector:</b> reads/derives data from state. Keeps components simple and testable.</li>
                    <li><b>Memoized selectors:</b> with <Styled.InlineCode>reselect</Styled.InlineCode> to avoid expensive recalculation (optional for basics).</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Basic selector
const selectCount = (state) => state.counter.value;

// With "reselect" (optional)
import { createSelector } from "@reduxjs/toolkit";
const selectItems = (state) => state.users.items;
const selectQuery = (state) => state.search.q;

export const selectFiltered = createSelector(
  [selectItems, selectQuery],
  (items, q) => items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()))
);
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Middleware & DevTools */}
            <Styled.Section>
                <Styled.H2>Middleware & DevTools</Styled.H2>
                <Styled.List>
                    <li><b>Default middleware:</b> thunk + immutability & serializable checks.</li>
                    <li><b>DevTools:</b> enabled by default; time travel and inspect actions/state.</li>
                    <li><b>Customization:</b> extend or turn off checks for specific cases (e.g., non-serializable payloads like <Styled.InlineCode>File</Styled.InlineCode>).</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Customize middleware
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import users from "./usersSlice";
import counter from "./counterSlice";

export const store = configureStore({
  reducer: { users, counter },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["upload/started"],
        ignoredPaths: ["upload.file"],
      },
      // immutableCheck: false, // if you need to disable temporarily
    }),
  devTools: process.env.NODE_ENV !== "production",
});
`}
                </Styled.Pre>

                <Styled.Small>
                    Keep state serializable (plain objects/arrays/numbers/strings/booleans/null). Store non-serializable values (like DOM nodes, class instances) outside Redux or in refs.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Patterns & structure */}
            <Styled.Section>
                <Styled.H2>Patterns & Structure</Styled.H2>
                <Styled.List>
                    <li><b>One slice per domain:</b> e.g., <Styled.InlineCode>auth</Styled.InlineCode>, <Styled.InlineCode>todos</Styled.InlineCode>, <Styled.InlineCode>cart</Styled.InlineCode>.</li>
                    <li><b>Keep reducers pure:</b> no side-effects (network, timers) inside reducers-thunks/middleware handle those.</li>
                    <li><b>Use Immer correctly:</b> mutate fields on <Styled.InlineCode>state</Styled.InlineCode> or return a brand new object; don't do both.</li>
                    <li><b>Derive vs store:</b> compute values in selectors (e.g., totals), avoid duplicating them in state.</li>
                    <li><b>Project layout:</b> colocate slice, selectors, and thunks; export a minimal public API.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example file layout
src/
  store/
    index.js
    counterSlice.js
    usersSlice.js
  features/
    counter/
      Counter.jsx
    users/
      UsersList.jsx
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start with RTK - it's the recommended way to write Redux today.</li>
                    <li><b>Do</b> keep state minimal and serializable; derive computed data in selectors.</li>
                    <li><b>Do</b> model async with <Styled.InlineCode>createAsyncThunk</Styled.InlineCode> or adopt RTK Query later.</li>
                    <li><b>Don't</b> mutate function arguments or rely on dates/Math.random inside reducers-keep reducers pure.</li>
                    <li><b>Don't</b> overuse Redux; local UI state can stay in component <Styled.InlineCode>useState</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Serializable:</b> data that can be converted to JSON without loss (no functions, classes, DOM nodes).</li>
                    <li><b>Pure function:</b> output depends only on input; no side-effects, no mutation of external state.</li>
                    <li><b>Domain slice:</b> a slice focused on one feature area (auth, cart, users, etc.).</li>
                    <li><b>Action creator:</b> a function that returns an action; with RTK, generated for you.</li>
                    <li><b>Extra reducers:</b> field in <Styled.InlineCode>createSlice</Styled.InlineCode> to respond to actions not defined in the slice (e.g., thunks).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: RTK streamlines Redux with slices, Immer, good defaults, and standardized async.
                Start with <i>createSlice</i>, wire the store via <i>configureStore</i>, and use thunks/selectors for async and derived data.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ReduxToolkit;
