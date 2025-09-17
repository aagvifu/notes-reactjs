import ScrollToTop from './components/ScrollToTop'
import { Styled } from './App.styled'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import { MdMenuOpen } from 'react-icons/md'
import { CircularProgress } from '@mui/material'
import Footer from './components/footer'
import NavList from './components/navList'

// ✅ Toasts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Pages */
const Home = lazy(() => import('./pages/home'));
const NotFound = lazy(() => import('./pages/notFound'));
const WhatIsReact = lazy(() => import('./pages/intro/WhatIsReact'));
const SPAVsMPA = lazy(() => import('./pages/intro/SpaVsMpa'));
const ProjectSetup = lazy(() => import("./pages/intro/ProjectSetup"));
const ViteBasics = lazy(() => import("./pages/intro/ViteBasics"));
const EnvFiles = lazy(() => import("./pages/intro/EnvFiles"));
const PkgScripts = lazy(() => import("./pages/intro/PkgScripts"));
const Debugging = lazy(() => import("./pages/intro/Debugging"));

const JsxBasics = lazy(() => import("./pages/jsx/JSXBasics"));


const App = () => {
    const [displayNav, setDisplayNav] = useState(true);
    const handleDisplayNav = () => setDisplayNav(prev => !prev);

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.NavLinkWrapper onClick={handleDisplayNav}>
                    <MdMenuOpen size={20} />
                </Styled.NavLinkWrapper>
                <Styled.Heading><NavLink to="/">a2rp: an Ashish Ranjan presentation</NavLink></Styled.Heading>
            </Styled.Header>

            <Styled.Main>
                <Styled.NavWrapper className={`${displayNav ? "active" : ""}`}>
                    <div className="navInner">
                        <NavList />
                    </div>
                </Styled.NavWrapper>

                <Styled.ContentWrapper id="scroll-root" data-scroll-root>
                    <Styled.RoutesWrapper>
                        <Suspense fallback={<CircularProgress />}>
                            <Routes>
                                {/* Basics */}
                                <Route path="/" element={<Navigate to="/home" />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/intro/what-is-react" element={<WhatIsReact />} />
                                <Route path="/intro/spa-vs-mpa" element={<SPAVsMPA />} />
                                <Route path="/intro/project-setup" element={<ProjectSetup />} />
                                <Route path="/intro/vite-basics" element={<ViteBasics />} />
                                <Route path="/intro/env-files" element={<EnvFiles />} />
                                <Route path="/intro/pkg-scripts" element={<PkgScripts />} />
                                <Route path="/intro/debugging" element={<Debugging />} />
                                <Route path="/jsx/jsx-basics" element={<JsxBasics />} />

                                {/* 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Styled.RoutesWrapper>

                    <Styled.Footer>
                        <Footer />
                    </Styled.Footer>
                </Styled.ContentWrapper>
            </Styled.Main>

            <ScrollToTop />

            {/* ✅ Toasts live here (rendered once for the whole app) */}
            <ToastContainer position="bottom-center" autoClose={4000} newestOnTop />
        </Styled.Wrapper>
    )
}

export default App
