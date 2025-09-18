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

const UseStateHook = lazy(() => import("./pages/topics/hooksCore/UseStateHook"));
const UseEffectHook = lazy(() => import("./pages/topics/hooksCore/UseEffectHook"));
const UseRefHook = lazy(() => import("./pages/topics/hooksCore/UseRefHook"));
const UseMemoHook = lazy(() => import("./pages/topics/hooksCore/UseMemoHook"));
const UseCallbackHook = lazy(() => import("./pages/topics/hooksCore/UseCallbackHook"));
const UseContextHook = lazy(() => import("./pages/topics/hooksCore/UseContextHook"));

const UseReducerHook = lazy(() => import("./pages/topics/hooksAdv/UseReducerHook"));
const UseLayoutEffectHook = lazy(() => import("./pages/topics/hooksAdv/UseLayoutEffectHook"));
const ForwardRefHook = lazy(() => import("./pages/topics/hooksAdv/ForwardRefHook"));
const UseImperativeHandleHook = lazy(() => import("./pages/topics/hooksAdv/UseImperativeHandleHook"));
const UseIdHook = lazy(() => import("./pages/topics/hooksAdv/UseIdHook"));
const UseSyncExternalStoreHook = lazy(() => import("./pages/topics/hooksAdv/UseSyncExternalStoreHook"));
const UseTransitionHook = lazy(() => import("./pages/topics/hooksAdv/UseTransitionHook"));
const UseDeferredValueHook = lazy(() => import("./pages/topics/hooksAdv/UseDeferredValueHook"));
const CustomHooks = lazy(() => import("./pages/topics/hooksAdv/CustomHooks"));

const SyntheticEvents = lazy(() => import("./pages/topics/domEvents/SyntheticEvents"));
const EventBubbling = lazy(() => import("./pages/topics/domEvents/EventBubbling"));
const FocusManagement = lazy(() => import("./pages/topics/domEvents/FocusManagement"));
const ScrollManagement = lazy(() => import("./pages/topics/domEvents/ScrollManagement"));
const Portals = lazy(() => import("./pages/topics/domEvents/Portals"));
const MeasureLayout = lazy(() => import("./pages/topics/domEvents/MeasureLayout"));

const Controlled = lazy(() => import("./pages/topics/forms/Controlled"));
const Uncontrolled = lazy(() => import("./pages/topics/forms/Uncontrolled"));
const DebouncedInputs = lazy(() => import("./pages/topics/forms/DebouncedInputs"));
const Html5Validation = lazy(() => import("./pages/topics/forms/Html5Validation"));
const CustomValidation = lazy(() => import("./pages/topics/forms/CustomValidation"));
const ReactHookForm = lazy(() => import("./pages/topics/forms/ReactHookForm"));
const Formik = lazy(() => import("./pages/topics/forms/Formik"));
const SchemaYupZod = lazy(() => import("./pages/topics/forms/SchemaYupZod"));
const FileUpload = lazy(() => import("./pages/topics/forms/FileUpload"));
const DragDrop = lazy(() => import("./pages/topics/forms/DragDrop"));
const FormsA11y = lazy(() => import("./pages/topics/forms/FormsA11y"));

const GlobalCss = lazy(() => import("./pages/topics/styling/GlobalCss"));
const CssModules = lazy(() => import("./pages/topics/styling/CssModules"));
const StyledComponents = lazy(() => import("./pages/topics/styling/StyledComponents"));
const Themes = lazy(() => import("./pages/topics/styling/Themes"));
const Tokens = lazy(() => import("./pages/topics/styling/Tokens"));
const CssVariables = lazy(() => import("./pages/topics/styling/CssVariables"));
const Responsive = lazy(() => import("./pages/topics/styling/Responsive"));
const ContainerQueries = lazy(() => import("./pages/topics/styling/ContainerQueries"));
const Icons = lazy(() => import("./pages/topics/styling/Icons"));


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

                                <>
                                    <Route path="/intro/what-is-react" element={<WhatIsReact />} />
                                    <Route path="/intro/spa-vs-mpa" element={<SPAVsMPA />} />
                                    <Route path="/intro/project-setup" element={<ProjectSetup />} />
                                    <Route path="/intro/vite-basics" element={<ViteBasics />} />
                                    <Route path="/intro/env-files" element={<EnvFiles />} />
                                    <Route path="/intro/pkg-scripts" element={<PkgScripts />} />
                                    <Route path="/intro/debugging" element={<Debugging />} />
                                    <Route path="/jsx/jsx-basics" element={<JsxBasics />} />
                                </>

                                <>
                                    <Route path="/jsx/attrs-spread" element={<AttrsSpread />} />
                                    <Route path="/jsx/fragments" element={<Fragments />} />
                                    <Route path="/jsx/conditional" element={<Conditional />} />
                                    <Route path="/jsx/lists-keys" element={<ListsKeys />} />
                                    <Route path="/jsx/reconciliation" element={<Reconciliation />} />
                                    <Route path="/jsx/render-cycle" element={<RenderCycle />} />
                                </>

                                <>
                                    <Route path="/components/fn-components" element={<FnComponents />} />
                                    <Route path="/components/props" element={<Props />} />
                                    <Route path="/components/children" element={<Children />} />
                                    <Route path="/components/composition" element={<Composition />} />
                                    <Route path="/components/controlled-vs-uncontrolled" element={<ControlledVsUncontrolled />} />
                                    <Route path="/components/presentational-vs-container" element={<PresentationalVsContainer />} />
                                </>

                                <>
                                    <Route path="/state/useState-basics" element={<UseStateBasics />} />
                                    <Route path="/state/batching" element={<Batching />} />
                                    <Route path="/state/lift-state" element={<LiftState />} />
                                    <Route path="/state/derived-state" element={<DerivedState />} />
                                    <Route path="/state/state-colocation" element={<StateColocation />} />
                                    <Route path="/state/immutable-updates" element={<ImmutableUpdates />} />
                                </>

                                <>
                                    <Route path="/hooks-core/useState" element={<UseStateHook />} />
                                    <Route path="/hooks-core/useEffect" element={<UseEffectHook />} />
                                    <Route path="/hooks-core/useRef" element={<UseRefHook />} />
                                    <Route path="/hooks-core/useMemo" element={<UseMemoHook />} />
                                    <Route path="/hooks-core/useCallback" element={<UseCallbackHook />} />
                                    <Route path="/hooks-core/useContext" element={<UseContextHook />} />
                                </>

                                <>
                                    <Route path="/hooks-adv/useReducer" element={<UseReducerHook />} />
                                    <Route path="/hooks-adv/useLayoutEffect" element={<UseLayoutEffectHook />} />
                                    <Route path="/hooks-adv/forwardRef" element={<ForwardRefHook />} />
                                    <Route path="/hooks-adv/useImperativeHandle" element={<UseImperativeHandleHook />} />
                                    <Route path="/hooks-adv/useId" element={<UseIdHook />} />
                                    <Route path="/hooks-adv/useSyncExternalStore" element={<UseSyncExternalStoreHook />} />
                                    <Route path="/hooks-adv/useTransition" element={<UseTransitionHook />} />
                                    <Route path="/hooks-adv/useDeferredValue" element={<UseDeferredValueHook />} />
                                    <Route path="/hooks-adv/custom-hooks" element={<CustomHooks />} />
                                </>

                                <>
                                    <Route path="/dom-events/synthetic-events" element={<SyntheticEvents />} />
                                    <Route path="/dom-events/event-bubbling" element={<EventBubbling />} />
                                    <Route path="/dom-events/focus-management" element={<FocusManagement />} />
                                    <Route path="/dom-events/scroll-management" element={<ScrollManagement />} />
                                    <Route path="/dom-events/portals" element={<Portals />} />
                                    <Route path="/dom-events/measure-layout" element={<MeasureLayout />} />
                                </>

                                <>
                                    <Route path="/forms/controlled" element={<Controlled />} />
                                    <Route path="/forms/uncontrolled" element={<Uncontrolled />} />
                                    <Route path="/forms/debounced-inputs" element={<DebouncedInputs />} />
                                    <Route path="/forms/html5-validation" element={<Html5Validation />} />
                                    <Route path="/forms/custom-validation" element={<CustomValidation />} />
                                    <Route path="/forms/react-hook-form" element={<ReactHookForm />} />
                                    <Route path="/forms/formik" element={<Formik />} />
                                    <Route path="/forms/schema-yup-zod" element={<SchemaYupZod />} />
                                    <Route path="/forms/file-upload" element={<FileUpload />} />
                                    <Route path="/forms/drag-drop" element={<DragDrop />} />
                                    <Route path="/forms/forms-a11y" element={<FormsA11y />} />
                                </>

                                <>
                                    <Route path="/styling/global-css" element={<GlobalCss />} />
                                    <Route path="/styling/css-modules" element={<CssModules />} />
                                    <Route path="/styling/styled-components" element={<StyledComponents />} />
                                    <Route path="/styling/themes" element={<Themes />} />
                                    <Route path="/styling/tokens" element={<Tokens />} />
                                    <Route path="/styling/css-variables" element={<CssVariables />} />
                                    <Route path="/styling/responsive" element={<Responsive />} />
                                    <Route path="/styling/container-queries" element={<ContainerQueries />} />
                                    <Route path="/styling/icons" element={<Icons />} />
                                </>

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
