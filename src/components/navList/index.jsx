import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Styled } from "./styled";

const NavListCore = () => {
    const navRef = useRef(null);
    const { pathname } = useLocation();

    // Keep the active NavLink centered/visible in the sidebar
    useEffect(() => {
        const el = navRef.current?.querySelector("a.active");
        if (!el) return;

        // small delay so NavLink receives the .active class after route update
        const id = requestAnimationFrame(() => {
            try {
                el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
            } catch {
                // older browsers fallback
                el.scrollIntoView();
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return (
        <Styled.Nav ref={navRef} aria-label="JavaScript Core navigation">

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

        </Styled.Nav>
    );
};

export default NavListCore;
