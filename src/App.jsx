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
const WhatIsReact = lazy(() => import('./pages/topics/intro/WhatIsReact'));
const SPAVsMPA = lazy(() => import('./pages/topics/intro/SpaVsMpa'));
const ProjectSetup = lazy(() => import("./pages/topics/intro/ProjectSetup"));
const ViteBasics = lazy(() => import("./pages/topics/intro/ViteBasics"));
const EnvFiles = lazy(() => import("./pages/topics/intro/EnvFiles"));
const PkgScripts = lazy(() => import("./pages/topics/intro/PkgScripts"));
const Debugging = lazy(() => import("./pages/topics/intro/Debugging"));

const JsxBasics = lazy(() => import("./pages/topics/jsx/JSXBasics"));
const AttrsSpread = lazy(() => import("./pages/topics/jsx/AttrsSpread"));
const Fragments = lazy(() => import("./pages/topics/jsx/Fragments"));
const Conditional = lazy(() => import("./pages/topics/jsx/Conditional"));
const ListsKeys = lazy(() => import("./pages/topics/jsx/ListsKeys"));
const Reconciliation = lazy(() => import("./pages/topics/jsx/Reconciliation"));
const RenderCycle = lazy(() => import("./pages/topics/jsx/RenderCycle"));

const FnComponents = lazy(() => import("./pages/topics/components/FnComponents"));
const Props = lazy(() => import("./pages/topics/components/Props"));
const Children = lazy(() => import("./pages/topics/components/Children"));
const Composition = lazy(() => import("./pages/topics/components/Composition"));
const ControlledVsUncontrolled = lazy(() => import("./pages/topics/components/ControlledVsUncontrolled"));
const PresentationalVsContainer = lazy(() => import("./pages/topics/components/PresentationalVsContainer"));

const UseStateBasics = lazy(() => import("./pages/topics/state/UseStateBasics"));
const Batching = lazy(() => import("./pages/topics/state/Batching"));
const LiftState = lazy(() => import("./pages/topics/state/LiftState"));
const DerivedState = lazy(() => import("./pages/topics/state/DerivedState"));
const StateColocation = lazy(() => import("./pages/topics/state/StateColocation"));
const ImmutableUpdates = lazy(() => import("./pages/topics/state/ImmutableUpdates"));



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

                                <Route path="/jsx/attrs-spread" element={<AttrsSpread />} />
                                <Route path="/jsx/fragments" element={<Fragments />} />
                                <Route path="/jsx/conditional" element={<Conditional />} />
                                <Route path="/jsx/lists-keys" element={<ListsKeys />} />
                                <Route path="/jsx/reconciliation" element={<Reconciliation />} />
                                <Route path="/jsx/render-cycle" element={<RenderCycle />} />

                                <Route path="/components/fn-components" element={<FnComponents />} />
                                <Route path="/components/props" element={<Props />} />
                                <Route path="/components/children" element={<Children />} />
                                <Route path="/components/composition" element={<Composition />} />
                                <Route path="/components/controlled-vs-uncontrolled" element={<ControlledVsUncontrolled />} />
                                <Route path="/components/presentational-vs-container" element={<PresentationalVsContainer />} />

                                <Route path="/state/useState-basics" element={<UseStateBasics />} />
                                <Route path="/state/batching" element={<Batching />} />
                                <Route path="/state/lift-state" element={<LiftState />} />
                                <Route path="/state/derived-state" element={<DerivedState />} />
                                <Route path="/state/state-colocation" element={<StateColocation />} />
                                <Route path="/state/immutable-updates" element={<ImmutableUpdates />} />


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
