import React from "react";
import { Styled } from "./styled";

const FeatureFolders = () => {
    return (
        <Styled.Page>
            <Styled.Title>Feature Folders</Styled.Title>

            <Styled.Lead>
                <b>Feature Folders</b> organize your app by <i>features</i> (vertical slices) rather than by file type.
                Each feature folder co-locates components, hooks, state, styles, tests, and assets that belong to that feature.
                This improves change locality, reduces cross-folder hopping, and scales better for teams.
            </Styled.Lead>

            {/* 1) Core Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Feature:</b> A business capability or user-facing slice (e.g., <Styled.InlineCode>auth</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>cart</Styled.InlineCode>, <Styled.InlineCode>profile</Styled.InlineCode>). Think “what the user does,” not “how we implement.”
                    </li>
                    <li>
                        <b>Feature Folder:</b> A directory that contains everything needed to implement the feature (UI, hooks, state management, services, tests, styles).
                    </li>
                    <li>
                        <b>Vertical Slice:</b> A unit that spans UI → state → data for one capability. Contrast with horizontal layers (components/, hooks/, utils/).
                    </li>
                    <li>
                        <b>Co-location:</b> Keep closely related files next to each other to improve discoverability and refactoring safety.
                    </li>
                    <li>
                        <b>Public API (barrel):</b> An <Styled.InlineCode>index.js</Styled.InlineCode>/<Styled.InlineCode>index.ts</Styled.InlineCode> that re-exports the feature's intended surface (components, hooks) while hiding internals.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why Feature Folders */}
            <Styled.Section>
                <Styled.H2>Why Feature Folders?</Styled.H2>
                <Styled.List>
                    <li><b>Change locality:</b> Most edits live inside one folder → faster dev loops, fewer regressions.</li>
                    <li><b>Ownership:</b> Teams can own features without stepping on each other's toes.</li>
                    <li><b>Scalability:</b> New features add new folders, not new global categories.</li>
                    <li><b>Refactor-friendly:</b> Rename, move, or split features with predictable blast radius.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Example Structures */}
            <Styled.Section>
                <Styled.H2>Example Structures</Styled.H2>
                <Styled.Small>Start simple; add depth only when needed.</Styled.Small>
                <Styled.Pre>
                    {`// Small app (2-5 features)
src/
  features/
    auth/
      LoginForm.jsx
      useLogin.js
      auth.api.js
      auth.types.js
      index.js            // public barrel (export what others may import)
    profile/
      ProfilePage.jsx
      useProfile.js
      profile.api.js
      index.js
  app/
    routes.jsx
    store.js
  ui/                     // truly shared primitives (buttons, modals)

// Medium app (more internal structure per feature)
src/
  features/
    cart/
      components/
        CartIcon.jsx
        CartSheet.jsx
      hooks/
        useCart.js
      state/
        cart.slice.js     // redux/zustand/xstate, etc.
        selectors.js
      services/
        cart.api.js
        cart.mappers.js
      tests/
        cart.spec.jsx
      index.js
    products/
      components/
      hooks/
      state/
      services/
      index.js
  ui/
  app/
    routes.jsx
    providers.jsx         // QueryClientProvider, ThemeProvider, etc.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Public API (Barrel) */}
            <Styled.Section>
                <Styled.H2>Public API (Barrel)</Styled.H2>
                <Styled.List>
                    <li><b>Purpose:</b> Control what the rest of the app can import from a feature. Hide internals to keep boundaries clean.</li>
                    <li><b>Benefit:</b> Allows internal refactors without breaking consumers.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// features/cart/index.js
export { default as CartIcon } from "./components/CartIcon";
export { default as CartSheet } from "./components/CartSheet";
export { useCart } from "./hooks/useCart";

// Avoid exporting internal helpers:
// export * from "./services/cart.mappers" // ❌ keep private if not needed outside`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Naming & Boundaries */}
            <Styled.Section>
                <Styled.H2>Naming & Boundaries</Styled.H2>
                <Styled.List>
                    <li><b>Feature folder names:</b> nouns (auth, cart, orders, profile). Keep them lowercase-kebab or lowercase.</li>
                    <li><b>Shared UI:</b> keep generic, reusable primitives under <Styled.InlineCode>src/ui</Styled.InlineCode> (buttons, inputs, modal), not inside features.</li>
                    <li><b>Cross-feature utilities:</b> keep under <Styled.InlineCode>src/lib</Styled.InlineCode> (date, number, fetch wrappers) or <Styled.InlineCode>src/shared</Styled.InlineCode>.</li>
                    <li><b>No leaks:</b> a feature should not reach into another feature's internals; import from its barrel.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Routing & Code-Splitting */}
            <Styled.Section>
                <Styled.H2>Routing & Code-Splitting</Styled.H2>
                <Styled.List>
                    <li><b>Route per feature:</b> Lazy-load feature screens to reduce initial bundle size.</li>
                    <li><b>Nested routes:</b> Keep routing files close to the feature pages/screens.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// app/routes.jsx (example)
import { lazy } from "react";
const ProfilePage = lazy(() => import("../features/profile/ProfilePage"));
const CartSheet   = lazy(() => import("../features/cart/components/CartSheet"));

<Route path="/profile" element={<ProfilePage />} />
<Route path="/cart" element={<CartSheet />} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) State Management within Feature */}
            <Styled.Section>
                <Styled.H2>State Management Inside a Feature</Styled.H2>
                <Styled.List>
                    <li><b>Local state first:</b> use <Styled.InlineCode>useState</Styled.InlineCode>/<Styled.InlineCode>useReducer</Styled.InlineCode> within components when scope is small.</li>
                    <li><b>Feature store:</b> if state spans multiple components, co-locate a slice (Redux/Zustand/XState) in <Styled.InlineCode>state/</Styled.InlineCode>.</li>
                    <li><b>Server state:</b> co-locate queries/mutations (React Query) under <Styled.InlineCode>services/</Styled.InlineCode> or <Styled.InlineCode>api/</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// features/cart/state/cart.slice.js (zustand example)
import { create } from "zustand";
export const useCartStore = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
}));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Testing Strategy */}
            <Styled.Section>
                <Styled.H2>Testing Strategy</Styled.H2>
                <Styled.List>
                    <li><b>Unit tests:</b> co-locate near code (<Styled.InlineCode>*.spec.jsx</Styled.InlineCode>).</li>
                    <li><b>Integration tests:</b> test feature flows (render UI + store + api mocks).</li>
                    <li><b>Contract tests:</b> validate the feature's public API (barrel exports).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> co-locate everything a feature needs (UI, state, tests, styles, assets).</li>
                    <li><b>Do</b> expose a clear public API via <Styled.InlineCode>index.js</Styled.InlineCode>.</li>
                    <li><b>Do</b> keep shared primitives in <Styled.InlineCode>src/ui</Styled.InlineCode> to avoid duplication.</li>
                    <li><b>Don't</b> create mega “shared/utils” dumping grounds—organize by domain.</li>
                    <li><b>Don't</b> let features import each other's deep internals—use barrels.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Migration Plan */}
            <Styled.Section>
                <Styled.H2>Migration: From Layered to Feature Folders</Styled.H2>
                <Styled.List>
                    <li><b>Step 1:</b> Identify top 3 features (auth, products, cart). Create folders under <Styled.InlineCode>src/features</Styled.InlineCode>.</li>
                    <li><b>Step 2:</b> Move feature pages/components + nearby hooks into each feature. Add a barrel that re-exports official surface.</li>
                    <li><b>Step 3:</b> Move services/api/state into the feature; update imports throughout the app to use the barrel.</li>
                    <li><b>Step 4:</b> Wire lazy routes to each feature page for code-splitting.</li>
                    <li><b>Step 5:</b> Delete dead paths in old layered folders; keep <Styled.InlineCode>src/ui</Styled.InlineCode> truly generic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Barrel (index file):</b> Re-exports selected modules to form a public API for the folder.</li>
                    <li><b>Domain/Feature:</b> A business concept (orders, billing) with its own data and UI.</li>
                    <li><b>Co-location:</b> Storing related files together to minimize context switching.</li>
                    <li><b>Vertical Slice:</b> A feature's end-to-end implementation across layers (UI → state → data).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Feature Folders scale by <b>co-locating</b> everything a feature needs, exposing a small
                <b> public API</b>, and keeping boundaries clean. Start small, slice by business capability, and let your structure
                evolve as features grow.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FeatureFolders;
