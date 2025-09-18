import { Styled } from "./styled";

const Persistence = () => {
    return (
        <Styled.Page>
            <Styled.Title>Persistence (State Management)</Styled.Title>

            <Styled.Lead>
                <b>Persistence</b> means saving app state so it survives a page reload, tab close, or going offline,
                and then <i>restoring</i> it when the app starts again. You usually persist to browser storage
                (<Styled.InlineCode>localStorage</Styled.InlineCode>, <Styled.InlineCode>IndexedDB</Styled.InlineCode>, etc.)
                with safe <b>serialization</b> and a repeatable <b>hydration</b> process.
            </Styled.Lead>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (precise terms)</Styled.H2>
                <Styled.List>
                    <li><b>Storage driver:</b> the underlying place where bytes are kept (e.g., <Styled.InlineCode>localStorage</Styled.InlineCode>, <Styled.InlineCode>sessionStorage</Styled.InlineCode>, <Styled.InlineCode>IndexedDB</Styled.InlineCode>).</li>
                    <li><b>Serialization:</b> turning in-memory values into a storable string/bytes (often JSON). Functions, class instances, Symbols don't serialize cleanly.</li>
                    <li><b>Hydration / Rehydration:</b> loading saved bytes, parsing them, and applying the values to your state on startup.</li>
                    <li><b>Versioning:</b> tagging persisted data with a version so you can run <b>migrations</b> when your schema changes.</li>
                    <li><b>TTL (time-to-live):</b> an expiry window after which data is considered stale and removed/ignored.</li>
                    <li><b>Partial persistence:</b> persisting only safe subsets (e.g., user preferences) instead of the entire store.</li>
                    <li><b>Cross-tab sync:</b> keeping multiple tabs consistent using the <Styled.InlineCode>storage</Styled.InlineCode> event.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What to persist vs avoid */}
            <Styled.Section>
                <Styled.H2>What to Persist (and What to Avoid)</Styled.H2>
                <Styled.List>
                    <li><b>Good candidates:</b> theme, language, sidebar open/close, form drafts, filters/sorts, onboarding flags, cart (if size is small), last visited screen.</li>
                    <li><b>Use caution:</b> large lists, server caches, or anything that becomes stale quickly—prefer refetch or short TTL.</li>
                    <li><b>Do not persist:</b> secrets (access tokens), sensitive PII, passwords. Store tokens in <i>httpOnly cookies</i> via the server, not in JavaScript storage.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Storage options */}
            <Styled.Section>
                <Styled.H2>Storage Drivers</Styled.H2>
                <Styled.List>
                    <li><b>localStorage:</b> simple key-value strings, synchronous API, ~5MB per origin (varies). Great for small prefs. Blocks main thread on large reads/writes.</li>
                    <li><b>sessionStorage:</b> like localStorage but per-tab and cleared when the tab closes.</li>
                    <li><b>IndexedDB:</b> async, larger quotas, structured data. Use tiny helpers like <Styled.InlineCode>localForage</Styled.InlineCode> or <Styled.InlineCode>idb-keyval</Styled.InlineCode> for convenience.</li>
                    <li><b>Cookies:</b> for server reads only; keep size tiny; avoid storing sensitive data on the client. Prefer httpOnly server-set cookies for tokens.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Core pattern */}
            <Styled.Section>
                <Styled.H2>Core Pattern: Save → Load → Migrate → Expire</Styled.H2>
                <Styled.Pre>
                    {`// Pseudocode showing a safe persistence lifecycle
const KEY = "app:prefs";
const VERSION = 2; // bump when schema changes

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { v, data, savedAt } = JSON.parse(raw);
    if (v !== VERSION) return migrate(v, data);
    if (Date.now() - savedAt > 1000 * 60 * 60 * 24 * 7) return null; // TTL 7d
    return data;
  } catch { return null; }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, savedAt: Date.now(), data }));
  } catch { /* storage full or blocked */ }
}

function migrate(oldV, oldData) {
  // stepwise migrations
  let d = oldData;
  if (oldV < 2) {
    d.theme = d.theme || "system";
  }
  return d;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Cross-tab sync */}
            <Styled.Section>
                <Styled.H2>Cross-Tab Sync</Styled.H2>
                <Styled.Pre>
                    {`// Keep tabs consistent with the 'storage' event
React.useEffect(() => {
  function onStorage(e) {
    if (e.key === "app:prefs") {
      try {
        const next = JSON.parse(e.newValue);
        // apply to state...
      } catch {}
    }
  }
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Library recipes */}
            <Styled.Section>
                <Styled.H2>Library Recipes</Styled.H2>

                <Styled.H3>Redux Toolkit + <code>redux-persist</code></Styled.H3>
                <Styled.Pre>
                    {`import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // localStorage
import { persistReducer, persistStore } from "redux-persist";
import { api } from "./services/api"; // RTK Query api slice
import prefsReducer from "./features/prefsSlice";

const rootReducer = combineReducers({
  prefs: prefsReducer,
  [api.reducerPath]: api.reducer, // optional: persist cache sparingly
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["prefs"], // persist only prefs; avoid huge or sensitive slices
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (gdm) => gdm().concat(api.middleware),
});

// In app root, use <PersistGate> to delay UI until rehydration
// <Provider store={store}><PersistGate loading={...} persistor={persistStore(store)}><App/></PersistGate></Provider>`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> If you do persist RTK Query cache, use short TTL and rely on its refetch-on-focus/reconnect behavior.
                </Styled.Small>

                <Styled.H3>Zustand + <code>persist</code> middleware</Styled.H3>
                <Styled.Pre>
                    {`import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(persist(
  (set, get) => ({
    theme: "system",
    setTheme: (t) => set({ theme: t }),
    cart: [],
    addToCart: (item) => set({ cart: [...get().cart, item] }),
  }),
  {
    name: "app:store",
    version: 2,
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ theme: state.theme, cart: state.cart }), // only these keys
    migrate: (persistedState, version) => {
      if (version < 2) persistedState.theme = persistedState.theme || "system";
      return persistedState;
    },
  }
));`}
                </Styled.Pre>

                <Styled.H3>Jotai + <code>atomWithStorage</code></Styled.H3>
                <Styled.Pre>
                    {`import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage("app:theme", "system"); // localStorage by default
export const cartAtom = atomWithStorage("app:cart", []);

// Use like normal atoms in components.`}
                </Styled.Pre>

                <Styled.H3>Recoil (community persist)</Styled.H3>
                <Styled.Pre>
                    {`// Recoil doesn't ship a built-in persistence API.
// A common approach is 'recoil-persist' (community).
// Example (conceptual):
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist({ key: "app:recoil", storage: localStorage });

export const themeState = atom({ key: "theme", default: "system", effects_UNSTABLE: [persistAtom] });`}
                </Styled.Pre>
                <Styled.Small>
                    Community packages vary; ensure they support versioning, partial persistence, and SSR guards.
                </Styled.Small>

                <Styled.H3>XState (save machine context)</Styled.H3>
                <Styled.Pre>
                    {`// Persist machine 'context' or last known state snapshot yourself.
import { useInterpret } from "@xstate/react";
import { myMachine } from "./machine";

function App() {
  const service = useInterpret(myMachine, {
    snapshot: loadSnapshot(), // load from storage
  });

  React.useEffect(() => {
    const sub = service.subscribe((state) => {
      // Save the minimal, serializable data you need
      saveSnapshot({ value: state.value, context: state.context });
    });
    return () => sub.unsubscribe();
  }, [service]);

  return /* UI */;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Persist only serializable parts (machine <i>value</i> and <i>context</i>). Restore carefully during initialization.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Performance & safety */}
            <Styled.Section>
                <Styled.H2>Performance, Safety & SSR</Styled.H2>
                <Styled.List>
                    <li><b>Debounce writes:</b> batch frequent changes (e.g., form drafts) to avoid blocking the main thread.</li>
                    <li><b>Size limits:</b> keep payloads small. Prefer IndexedDB for large data.</li>
                    <li><b>SSR guard:</b> check <Styled.InlineCode>typeof window !== "undefined"</Styled.InlineCode> before touching browser storage.</li>
                    <li><b>Security:</b> nothing in web storage is truly private—assume attackers with XSS can read it.</li>
                    <li><b>Migrations:</b> always include a version and migration path to keep old users working.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> persist only what you must; keep it minimal and structured.</li>
                    <li><b>Do</b> add <i>version</i>, <i>migrate</i>, and optional <i>TTL</i>.</li>
                    <li><b>Do</b> test hydration paths and corrupted data handling.</li>
                    <li><b>Don't</b> persist secrets or huge, rapidly changing server data.</li>
                    <li><b>Don't</b> forget cross-tab sync if the UX needs it.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick a storage driver that matches your data size and volatility, serialize safely,
                hydrate deterministically, version & migrate data, and be selective about what you persist.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Persistence;
