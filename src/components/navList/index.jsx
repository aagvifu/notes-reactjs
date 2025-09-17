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



        </Styled.Nav>
    );
};

export default NavListCore;
