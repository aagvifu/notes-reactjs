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

        </Styled.Nav>
    );
};

export default NavListCore;
