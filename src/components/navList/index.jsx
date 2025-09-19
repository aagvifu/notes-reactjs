import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Styled } from "./styled";
import { MdClear } from "react-icons/md";

const STORAGE_KEY = "navSearch";

const NavListCore = () => {
    const navRef = useRef(null);
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);
    const { pathname } = useLocation();

    // Restore persisted search
    const [search, setSearch] = useState(() => {
        try {
            return sessionStorage.getItem(STORAGE_KEY) ?? "";
        } catch {
            return "";
        }
    });

    const [matchCount, setMatchCount] = useState(0);

    // Keep the active NavLink centered/visible in the sidebar
    useEffect(() => {
        const el = navRef.current?.querySelector("a.active");
        if (!el) return;
        const id = requestAnimationFrame(() => {
            try {
                el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
            } catch {
                el.scrollIntoView();
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    // Keyboard shortcuts: Cmd/Ctrl+K focus, Esc clear, Enter open first result
    useEffect(() => {
        function onKey(e) {
            const isMetaK = (e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K");
            if (isMetaK) {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
                return;
            }
            if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
                setSearch("");
                return;
            }
            if (e.key === "Enter" && document.activeElement === searchInputRef.current) {
                const first = wrapperRef.current?.querySelector('a:not([data-hidden="true"])');
                if (first) {
                    first.click(); // navigate
                }
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Apply filter to links + section headers whenever search changes
    useEffect(() => {
        // persist search
        try {
            sessionStorage.setItem(STORAGE_KEY, search);
        } catch { }

        const root = wrapperRef.current;
        if (!root) return;

        const q = search.trim().toLowerCase();
        const tokens = q.length ? q.split(/\s+/).filter(Boolean) : [];

        const links = Array.from(root.querySelectorAll("a[href]"));
        let visibleCount = 0;

        // Filter links
        links.forEach((a) => {
            const label = (a.textContent || "").toLowerCase();
            const title = (a.getAttribute("title") || "").toLowerCase();
            const hay = `${label} ${title}`;

            const isMatch =
                tokens.length === 0 ||
                tokens.every((t) => hay.includes(t));

            a.setAttribute("data-hidden", isMatch ? "false" : "true");
            if (isMatch) visibleCount += 1;
        });

        // Hide/show section headings that have zero visible links until next h3
        const headers = Array.from(root.querySelectorAll("h3.title"));
        headers.forEach((h) => {
            let hasVisible = false;
            let node = h.nextElementSibling;
            while (node && node.tagName !== "H3") {
                if (node.tagName === "A" && node.getAttribute("data-hidden") === "false") {
                    hasVisible = true;
                    break;
                }
                node = node.nextElementSibling;
            }
            h.setAttribute("data-hidden", hasVisible ? "false" : "true");
        });

        setMatchCount(visibleCount);
    }, [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const clearSearch = () => setSearch("");

    useEffect(() => {
        searchInputRef.current.focus();
    }, []);

    return (
        <Styled.Nav ref={navRef} aria-label="JavaScript Core navigation">
            <div className="searchWraper">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search topics (Ctrl + K)"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search topics"
                    aria-controls="navlinksWrapper"
                />
                {search.trim().length > 0 && (
                    <div className="clearIconWrapper" onClick={clearSearch} role="button" aria-label="Clear search" title="Clear">
                        <MdClear size={20} />
                    </div>
                )}
            </div>

            <div className="navlinksWrapper" id="navlinksWrapper" ref={wrapperRef}>
                <NavLink to="/home" title="Home" className={"home"}>Home</NavLink>

                <h3 className="title">Intro</h3>
                <NavLink to="/intro/what-is-react" title="What Is React ???">What Is React ???</NavLink>
                <NavLink to="/intro/spa-vs-mpa" title="SPA vs MPA">SPA vs MPA</NavLink>
                <NavLink to="/intro/project-setup" title="Project Setup">Project Setup</NavLink>
                <NavLink to="/intro/vite-basics" title="Vite Basics">Vite Basics</NavLink>
                <NavLink to="/intro/env-files" title=".env Files">.env Files</NavLink>
                <NavLink to="/intro/pkg-scripts" title="PKG Scripts">PKG Scripts</NavLink>
                <NavLink to="/intro/debugging" title="Debugging">Debugging</NavLink>

                {/* JSX & Rendering */}
                <h3 className="title">JSX &amp; Rendering</h3>
                <NavLink to="/jsx/jsx-basics" title="JSX Basics">JSX Basics</NavLink>
                <NavLink to="/jsx/attrs-spread" title="Attributes & Spread">Attributes &amp; Spread</NavLink>
                <NavLink to="/jsx/fragments" title="Fragments">Fragments</NavLink>
                <NavLink to="/jsx/conditional" title="Conditional Rendering">Conditional Rendering</NavLink>
                <NavLink to="/jsx/lists-keys" title="Lists & Keys">Lists &amp; Keys</NavLink>
                <NavLink to="/jsx/reconciliation" title="Reconciliation">Reconciliation</NavLink>
                <NavLink to="/jsx/render-cycle" title="Render Cycle">Render Cycle</NavLink>

                {/* Components */}
                <h3 className="title">Components</h3>
                <NavLink to="/components/fn-components" title="Function Components">Function Components</NavLink>
                <NavLink to="/components/props" title="Props">Props</NavLink>
                <NavLink to="/components/children" title="Children">Children</NavLink>
                <NavLink to="/components/composition" title="Composition">Composition</NavLink>
                <NavLink to="/components/controlled-vs-uncontrolled" title="Controlled vs Uncontrolled">Controlled vs Uncontrolled</NavLink>
                <NavLink to="/components/presentational-vs-container" title="Presentational vs Container">Presentational vs Container</NavLink>

                {/* State & Data Flow */}
                <h3 className="title">State &amp; Data Flow</h3>
                <NavLink to="/state/useState-basics" title="useState Basics">useState Basics</NavLink>
                <NavLink to="/state/batching" title="Batching">Batching</NavLink>
                <NavLink to="/state/lift-state" title="Lift State">Lift State</NavLink>
                <NavLink to="/state/derived-state" title="Derived State">Derived State</NavLink>
                <NavLink to="/state/state-colocation" title="State Colocation">State Colocation</NavLink>
                <NavLink to="/state/immutable-updates" title="Immutable Updates">Immutable Updates</NavLink>

                {/* Core Hooks */}
                <h3 className="title">Core Hooks</h3>
                <NavLink to="/hooks-core/useState" title="useState">useState</NavLink>
                <NavLink to="/hooks-core/useEffect" title="useEffect">useEffect</NavLink>
                <NavLink to="/hooks-core/useRef" title="useRef">useRef</NavLink>
                <NavLink to="/hooks-core/useMemo" title="useMemo">useMemo</NavLink>
                <NavLink to="/hooks-core/useCallback" title="useCallback">useCallback</NavLink>
                <NavLink to="/hooks-core/useContext" title="useContext">useContext</NavLink>

                {/* Advanced Hooks */}
                <h3 className="title">Advanced Hooks</h3>
                <NavLink to="/hooks-adv/useReducer" title="useReducer">useReducer</NavLink>
                <NavLink to="/hooks-adv/useLayoutEffect" title="useLayoutEffect">useLayoutEffect</NavLink>
                <NavLink to="/hooks-adv/forwardRef" title="forwardRef">forwardRef</NavLink>
                <NavLink to="/hooks-adv/useImperativeHandle" title="useImperativeHandle">useImperativeHandle</NavLink>
                <NavLink to="/hooks-adv/useId" title="useId">useId</NavLink>
                <NavLink to="/hooks-adv/useSyncExternalStore" title="useSyncExternalStore">useSyncExternalStore</NavLink>
                <NavLink to="/hooks-adv/useTransition" title="useTransition">useTransition</NavLink>
                <NavLink to="/hooks-adv/useDeferredValue" title="useDeferredValue">useDeferredValue</NavLink>
                <NavLink to="/hooks-adv/custom-hooks" title="Custom Hooks">Custom Hooks</NavLink>

                {/* DOM & Events */}
                <h3 className="title">DOM &amp; Events</h3>
                <NavLink to="/dom-events/synthetic-events" title="Synthetic Events">Synthetic Events</NavLink>
                <NavLink to="/dom-events/event-bubbling" title="Event Bubbling & Capturing">Event Bubbling</NavLink>
                <NavLink to="/dom-events/focus-management" title="Focus Management">Focus Management</NavLink>
                <NavLink to="/dom-events/scroll-management" title="Scroll Management">Scroll Management</NavLink>
                <NavLink to="/dom-events/portals" title="Portals">Portals</NavLink>
                <NavLink to="/dom-events/measure-layout" title="Measure &amp; Layout">Measure &amp; Layout</NavLink>

                {/* Forms & Validation */}
                <h3 className="title">Forms &amp; Validation</h3>
                <NavLink to="/forms/controlled" title="Controlled Inputs">Controlled Inputs</NavLink>
                <NavLink to="/forms/uncontrolled" title="Uncontrolled Inputs">Uncontrolled Inputs</NavLink>
                <NavLink to="/forms/debounced-inputs" title="Debounced Inputs">Debounced Inputs</NavLink>
                <NavLink to="/forms/html5-validation" title="HTML5 Validation">HTML5 Validation</NavLink>
                <NavLink to="/forms/custom-validation" title="Custom Validation">Custom Validation</NavLink>
                <NavLink to="/forms/react-hook-form" title="React Hook Form">React Hook Form</NavLink>
                <NavLink to="/forms/formik" title="Formik">Formik</NavLink>
                <NavLink to="/forms/schema-yup-zod" title="Schema Validation (Yup/Zod)">Schema (Yup/Zod)</NavLink>
                <NavLink to="/forms/file-upload" title="File Upload">File Upload</NavLink>
                <NavLink to="/forms/drag-drop" title="Drag &amp; Drop">Drag &amp; Drop</NavLink>
                <NavLink to="/forms/forms-a11y" title="Forms Accessibility (a11y)">Forms Accessibility</NavLink>

                {/* Styling */}
                <h3 className="title">Styling</h3>
                <NavLink to="/styling/global-css" title="Global CSS">Global CSS</NavLink>
                <NavLink to="/styling/css-modules" title="CSS Modules">CSS Modules</NavLink>
                <NavLink to="/styling/styled-components" title="styled-components">styled-components</NavLink>
                <NavLink to="/styling/themes" title="Themes">Themes</NavLink>
                <NavLink to="/styling/tokens" title="Design Tokens">Design Tokens</NavLink>
                <NavLink to="/styling/css-variables" title="CSS Variables">CSS Variables</NavLink>
                <NavLink to="/styling/responsive" title="Responsive Design">Responsive Design</NavLink>
                <NavLink to="/styling/container-queries" title="Container Queries">Container Queries</NavLink>
                <NavLink to="/styling/icons" title="Icons">Icons</NavLink>

                {/* Routing */}
                <h3 className="title">Routing</h3>
                <NavLink to="/routing/router-basics" title="Router Basics">Router Basics</NavLink>
                <NavLink to="/routing/nested-routes" title="Nested Routes">Nested Routes</NavLink>
                <NavLink to="/routing/layout-routes" title="Layout Routes">Layout Routes</NavLink>
                <NavLink to="/routing/route-params" title="Route Params">Route Params</NavLink>
                <NavLink to="/routing/search-params" title="Search Params">Search Params</NavLink>
                <NavLink to="/routing/lazy-routes" title="Lazy Routes">Lazy Routes</NavLink>
                <NavLink to="/routing/protected-routes" title="Protected Routes">Protected Routes</NavLink>
                <NavLink to="/routing/scroll-restore" title="Scroll Restore">Scroll Restore</NavLink>
                <NavLink to="/routing/not-found-redirect" title="Not Found & Redirect">Not Found &amp; Redirect</NavLink>

                {/* Suspense & Code Split */}
                <h3 className="title">Suspense &amp; Code Split</h3>
                <NavLink to="/suspense-split/react-lazy" title="React.lazy">React.lazy</NavLink>
                <NavLink to="/suspense-split/suspense-boundary" title="Suspense Boundary">&lt;Suspense&gt; Boundary</NavLink>
                <NavLink to="/suspense-split/route-splitting" title="Route Splitting">Route Splitting</NavLink>
                <NavLink to="/suspense-split/preloading" title="Preloading">Preloading</NavLink>

                {/* Data Fetching & Caching */}
                <h3 className="title">Data Fetching &amp; Caching</h3>
                <NavLink to="/data/fetch-basics" title="Fetch Basics">Fetch Basics</NavLink>
                <NavLink to="/data/abort-controller" title="AbortController">AbortController</NavLink>
                <NavLink to="/data/loading-error-states" title="Loading & Error States">Loading &amp; Error States</NavLink>
                <NavLink to="/data/swr-basics" title="SWR Basics">SWR Basics</NavLink>
                <NavLink to="/data/tanstack-query" title="TanStack Query">TanStack Query</NavLink>
                <NavLink to="/data/cache-keys" title="Cache Keys">Cache Keys</NavLink>
                <NavLink to="/data/invalidation" title="Invalidation">Invalidation</NavLink>
                <NavLink to="/data/infinite-scroll" title="Infinite Scroll">Infinite Scroll</NavLink>
                <NavLink to="/data/optimistic-updates" title="Optimistic Updates">Optimistic Updates</NavLink>
                <NavLink to="/data/websockets-sse" title="WebSockets & SSE">WebSockets &amp; SSE</NavLink>

                {/* State Management */}
                <h3 className="title">State Management</h3>
                <NavLink to="/state-mgmt/context-vs-store" title="Context vs Store">Context vs Store</NavLink>
                <NavLink to="/state-mgmt/redux-toolkit" title="Redux Toolkit">Redux Toolkit</NavLink>
                <NavLink to="/state-mgmt/rtk-query" title="RTK Query">RTK Query</NavLink>
                <NavLink to="/state-mgmt/zustand" title="Zustand">Zustand</NavLink>
                <NavLink to="/state-mgmt/jotai" title="Jotai">Jotai</NavLink>
                <NavLink to="/state-mgmt/recoil" title="Recoil">Recoil</NavLink>
                <NavLink to="/state-mgmt/xstate" title="XState">XState</NavLink>
                <NavLink to="/state-mgmt/persistence" title="Persistence">Persistence</NavLink>

                {/* Performance */}
                <h3 className="title">Performance</h3>
                <NavLink to="/perf/rerender-triggers" title="Re-render Triggers">Re-render Triggers</NavLink>
                <NavLink to="/perf/keys-strategy" title="Keys Strategy">Keys Strategy</NavLink>
                <NavLink to="/perf/memoization" title="Memoization">Memoization</NavLink>
                <NavLink to="/perf/defer-work" title="Defer Work">Defer Work</NavLink>
                <NavLink to="/perf/web-workers" title="Web Workers">Web Workers</NavLink>
                <NavLink to="/perf/virtualization" title="List Virtualization">Virtualization</NavLink>
                <NavLink to="/perf/image-optim" title="Image Optimization">Image Optimization</NavLink>
                <NavLink to="/perf/profiler" title="React Profiler">Profiler</NavLink>

                {/* Errors */}
                <h3 className="title">Errors</h3>
                <NavLink to="/errors/error-boundaries" title="Error Boundaries">Error Boundaries</NavLink>
                <NavLink to="/errors/data-errors" title="Data Errors">Data Errors</NavLink>
                <NavLink to="/errors/fallback-ui" title="Fallback UI">Fallback UI</NavLink>
                <NavLink to="/errors/retries" title="Retries & Backoff">Retries</NavLink>
                <NavLink to="/errors/logging-monitoring" title="Logging & Monitoring">Logging & Monitoring</NavLink>

                {/* Internationalization (i18n) */}
                <h3 className="title">Internationalization (i18n)</h3>
                <NavLink to="/i18n/i18n-basics" title="i18n Basics">i18n Basics</NavLink>
                <NavLink to="/i18n/react-i18next" title="react-i18next">react-i18next</NavLink>
                <NavLink to="/i18n/formatjs" title="FormatJS">FormatJS</NavLink>
                <NavLink to="/i18n/plurals-dates-numbers" title="Plurals, Dates & Numbers">Plurals, Dates &amp; Numbers</NavLink>
                <NavLink to="/i18n/rtl-support" title="RTL Support">RTL Support</NavLink>

                {/* Animations */}
                <h3 className="title">Animations</h3>
                <NavLink to="/animations/css-transitions" title="CSS Transitions">CSS Transitions</NavLink>
                <NavLink to="/animations/css-animations" title="CSS Keyframe Animations">CSS Animations</NavLink>
                <NavLink to="/animations/framer-motion" title="Framer Motion">Framer Motion</NavLink>
                <NavLink to="/animations/scroll-effects" title="Scroll-based Effects">Scroll Effects</NavLink>
                <NavLink to="/animations/anim-perf" title="Animation Performance">Animation Performance</NavLink>

                {/* TypeScript */}
                <h3 className="title">TypeScript</h3>
                <NavLink to="/typescript/tsx-basics" title="TSX Basics">TSX Basics</NavLink>
                <NavLink to="/typescript/typing-props" title="Typing Props">Typing Props</NavLink>
                <NavLink to="/typescript/typing-children" title="Typing Children">Typing Children</NavLink>
                <NavLink to="/typescript/typing-refs" title="Typing Refs">Typing Refs</NavLink>
                <NavLink to="/typescript/typing-hooks" title="Typing Hooks">Typing Hooks</NavLink>
                <NavLink to="/typescript/typing-context" title="Typing Context">Typing Context</NavLink>
                <NavLink to="/typescript/typing-reducers" title="Typing Reducers">Typing Reducers</NavLink>
                <NavLink to="/typescript/generics" title="Generics">Generics</NavLink>

                {/* Testing */}
                <h3 className="title">Testing</h3>
                <NavLink to="/testing/rtl-basics" title="RTL Basics">RTL Basics</NavLink>
                <NavLink to="/testing/jest-basics" title="Jest Basics">Jest Basics</NavLink>
                <NavLink to="/testing/async-tests" title="Async Tests">Async Tests</NavLink>
                <NavLink to="/testing/hooks-tests" title="Hooks Tests">Hooks Tests</NavLink>
                <NavLink to="/testing/router-tests" title="Router Tests">Router Tests</NavLink>
                <NavLink to="/testing/msw" title="MSW (Mock Service Worker)">MSW</NavLink>
                <NavLink to="/testing/e2e-cypress" title="E2E — Cypress">E2E — Cypress</NavLink>
                <NavLink to="/testing/e2e-playwright" title="E2E — Playwright">E2E — Playwright</NavLink>
                <NavLink to="/testing/a11y-tests" title="Accessibility (a11y) Tests">a11y Tests</NavLink>
                <NavLink to="/testing/snapshots" title="Snapshots">Snapshots</NavLink>

                {/* SSR & RSC */}
                <h3 className="title">SSR &amp; RSC</h3>
                <NavLink to="/ssr-rsc/ssr-vs-ssg-vs-isr" title="SSR vs SSG vs ISR">SSR vs SSG vs ISR</NavLink>
                <NavLink to="/ssr-rsc/hydration" title="Hydration">Hydration</NavLink>
                <NavLink to="/ssr-rsc/streaming" title="Streaming">Streaming</NavLink>
                <NavLink to="/ssr-rsc/rsc-basics" title="React Server Components (RSC) Basics">RSC Basics</NavLink>
                <NavLink to="/ssr-rsc/seo-meta" title="SEO & Meta">SEO &amp; Meta</NavLink>

                {/* Build & DX */}
                <h3 className="title">Build &amp; DX</h3>
                <NavLink to="/build-dx/vite-config" title="Vite Config">Vite Config</NavLink>
                <NavLink to="/build-dx/aliases" title="Aliases">Aliases</NavLink>
                <NavLink to="/build-dx/eslint-prettier" title="ESLint & Prettier">ESLint &amp; Prettier</NavLink>
                <NavLink to="/build-dx/storybook" title="Storybook">Storybook</NavLink>
                <NavLink to="/build-dx/bundle-analyze" title="Bundle Analyze">Bundle Analyze</NavLink>
                <NavLink to="/build-dx/monorepo" title="Monorepo">Monorepo</NavLink>

                {/* Security */}
                <h3 className="title">Security</h3>
                <NavLink to="/security/xss" title="XSS (Cross-Site Scripting)">XSS</NavLink>
                <NavLink to="/security/sanitize-html" title="Sanitize HTML">Sanitize HTML</NavLink>
                <NavLink to="/security/tokens-storage" title="Tokens Storage">Tokens Storage</NavLink>
                <NavLink to="/security/cors-cookies" title="CORS & Cookies">CORS & Cookies</NavLink>
                <NavLink to="/security/auth-basics" title="Auth Basics">Auth Basics</NavLink>
                <NavLink to="/security/supply-chain" title="Supply Chain Security">Supply Chain</NavLink>

                {/* Networking */}
                <h3 className="title">Networking</h3>
                <NavLink to="/networking/rest-patterns" title="REST Patterns">REST Patterns</NavLink>
                <NavLink to="/networking/graphql-clients" title="GraphQL Clients">GraphQL Clients</NavLink>
                <NavLink to="/networking/websockets" title="WebSockets">WebSockets</NavLink>
                <NavLink to="/networking/file-uploads" title="File Uploads">File Uploads</NavLink>
                <NavLink to="/networking/offline-sync" title="Offline Sync">Offline Sync</NavLink>

                {/* PWA */}
                <h3 className="title">PWA</h3>
                <NavLink to="/pwa/service-worker" title="Service Worker">Service Worker</NavLink>
                <NavLink to="/pwa/caching-strategies" title="Caching Strategies">Caching Strategies</NavLink>
                <NavLink to="/pwa/app-manifest" title="App Manifest">App Manifest</NavLink>
                <NavLink to="/pwa/offline-fallback" title="Offline Fallback">Offline Fallback</NavLink>
                <NavLink to="/pwa/push-notifs" title="Push Notifications">Push Notifications</NavLink>

                {/* Architecture & Patterns */}
                <h3 className="title">Architecture &amp; Patterns</h3>
                <NavLink to="/architecture/compound-components" title="Compound Components">Compound Components</NavLink>
                <NavLink to="/architecture/render-props" title="Render Props">Render Props</NavLink>
                <NavLink to="/architecture/provider-pattern" title="Provider Pattern">Provider Pattern</NavLink>
                <NavLink to="/architecture/state-reducer" title="State Reducer">State Reducer</NavLink>
                <NavLink to="/architecture/headless-components" title="Headless Components">Headless Components</NavLink>
                <NavLink to="/architecture/slots" title="Slots">Slots</NavLink>
                <NavLink to="/architecture/feature-folders" title="Feature Folders">Feature Folders</NavLink>
                <NavLink to="/architecture/api-design" title="API Design">API Design</NavLink>

                {/* Reusable Components */}
                <h3 className="title">Reusable Components</h3>
                <NavLink to="/components-lib/modal" title="Modal">Modal</NavLink>
                <NavLink to="/components-lib/drawer" title="Drawer">Drawer</NavLink>
                <NavLink to="/components-lib/tooltip" title="Tooltip">Tooltip</NavLink>
                <NavLink to="/components-lib/popover" title="Popover">Popover</NavLink>
                <NavLink to="/components-lib/menu" title="Menu">Menu</NavLink>
                <NavLink to="/components-lib/dropdown" title="Dropdown">Dropdown</NavLink>
                <NavLink to="/components-lib/combobox" title="Combobox">Combobox</NavLink>
                <NavLink to="/components-lib/tabs" title="Tabs">Tabs</NavLink>
                <NavLink to="/components-lib/accordion" title="Accordion">Accordion</NavLink>
                <NavLink to="/components-lib/table" title="Table">Table</NavLink>
                <NavLink to="/components-lib/list" title="List">List</NavLink>
                <NavLink to="/components-lib/toast" title="Toast">Toast</NavLink>
                <NavLink to="/components-lib/pagination" title="Pagination">Pagination</NavLink>

                {/* External Integrations */}
                <h3 className="title">External Integrations</h3>
                <NavLink to="/integrations/charts" title="Charts">Charts</NavLink>
                <NavLink to="/integrations/maps" title="Maps">Maps</NavLink>
                <NavLink to="/integrations/payments" title="Payments">Payments</NavLink>
                <NavLink to="/integrations/auth-providers" title="Auth Providers">Auth Providers</NavLink>
                <NavLink to="/integrations/media-audio-video" title="Media · Audio/Video">Media · Audio/Video</NavLink>
                <NavLink to="/integrations/canvas-webgl" title="Canvas & WebGL">Canvas &amp; WebGL</NavLink>
                <NavLink to="/integrations/workers" title="Workers (Web/Service)">Workers</NavLink>

                {/* Tooling Around React */}
                <h3 className="title">Tooling Around React</h3>
                <NavLink to="/tooling/devtools" title="DevTools">DevTools</NavLink>
                <NavLink to="/tooling/vscode-setup" title="VS Code Setup">VS Code Setup</NavLink>
                <NavLink to="/tooling/snippets" title="Snippets">Snippets</NavLink>
                <NavLink to="/tooling/lint-rules" title="Lint Rules">Lint Rules</NavLink>
                <NavLink to="/tooling/code-metrics" title="Code Metrics">Code Metrics</NavLink>

                {/* Deployment */}
                <h3 className="title">Deployment</h3>
                <NavLink to="/deploy/gh-pages" title="GitHub Pages">GitHub Pages</NavLink>
                <NavLink to="/deploy/vercel" title="Vercel">Vercel</NavLink>
                <NavLink to="/deploy/netlify" title="Netlify">Netlify</NavLink>
                <NavLink to="/deploy/cf-pages" title="Cloudflare Pages">Cloudflare Pages</NavLink>
                <NavLink to="/deploy/env-per-env" title="Env per Environment">Env per Environment</NavLink>
                <NavLink to="/deploy/cache-control" title="Cache-Control">Cache-Control</NavLink>
                <NavLink to="/deploy/prod-monitoring" title="Production Monitoring">Production Monitoring</NavLink>

                {/* Modern React */}
                <h3 className="title">Modern React</h3>
                <NavLink to="/modern/concurrent-model" title="Concurrent Model">Concurrent Model</NavLink>
                <NavLink to="/modern/transitions" title="Transitions">Transitions</NavLink>
                <NavLink to="/modern/suspense-for-data" title="Suspense for Data">Suspense for Data</NavLink>
                <NavLink to="/modern/migrating-legacy" title="Migrating Legacy Apps">Migrating Legacy</NavLink>
                <NavLink to="/modern/deprecations" title="Deprecations">Deprecations</NavLink>

            </div>

            {/* Minimal CSS hook: hide elements with data-hidden="true" if your Styled.Nav doesn't already */}
            <style>{`
        [data-hidden="true"] { display: none !important; }
      `}</style>
        </Styled.Nav>
    );
};

export default NavListCore;
