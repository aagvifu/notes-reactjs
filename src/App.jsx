import ScrollToTop from './components/ScrollToTop'
import { Styled } from './App.styled'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import { MdMenuOpen } from 'react-icons/md'
import { Box, CircularProgress } from '@mui/material'
import Footer from './components/footer'
import NavList from './components/navList'

import ar_logo from "./assets/ar_logo.png";

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

const RouterBasics = lazy(() => import("./pages/topics/routing/RouterBasics"));
const NestedRoutes = lazy(() => import("./pages/topics/routing/NestedRoutes"));
const LayoutRoutes = lazy(() => import("./pages/topics/routing/LayoutRoutes"));
const RouteParams = lazy(() => import("./pages/topics/routing/RouteParams"));
const SearchParams = lazy(() => import("./pages/topics/routing/SearchParams"));
const LazyRoutes = lazy(() => import("./pages/topics/routing/LazyRoutes"));
const ProtectedRoutes = lazy(() => import("./pages/topics/routing/ProtectedRoutes"));
const ScrollRestore = lazy(() => import("./pages/topics/routing/ScrollRestore"));
const NotFoundRedirect = lazy(() => import("./pages/topics/routing/NotFoundRedirect"));

const ReactLazy = lazy(() => import("./pages/topics/suspenseSplit/ReactLazy"));
const SuspenseBoundary = lazy(() => import("./pages/topics/suspenseSplit/SuspenseBoundary"));
const RouteSplitting = lazy(() => import("./pages/topics/suspenseSplit/RouteSplitting"));
const Preloading = lazy(() => import("./pages/topics/suspenseSplit/Preloading"));

const FetchBasics = lazy(() => import("./pages/topics/data/FetchBasics"));
const AbortControllerPage = lazy(() => import("./pages/topics/data/AbortController"));
const LoadingErrorStates = lazy(() => import("./pages/topics/data/LoadingErrorStates"));
const SwrBasics = lazy(() => import("./pages/topics/data/SwrBasics"));
const TanstackQuery = lazy(() => import("./pages/topics/data/TanstackQuery"));
const CacheKeys = lazy(() => import("./pages/topics/data/CacheKeys"));
const Invalidation = lazy(() => import("./pages/topics/data/Invalidation"));
const InfiniteScroll = lazy(() => import("./pages/topics/data/InfiniteScroll"));
const OptimisticUpdates = lazy(() => import("./pages/topics/data/OptimisticUpdates"));
const WebSocketsSse = lazy(() => import("./pages/topics/data/WebSocketsSse"));

const ContextVsStore = lazy(() => import("./pages/topics/stateMgmt/ContextVsStore"));
const ReduxToolkit = lazy(() => import("./pages/topics/stateMgmt/ReduxToolkit"));
const RtkQuery = lazy(() => import("./pages/topics/stateMgmt/RtkQuery"));
const Zustand = lazy(() => import("./pages/topics/stateMgmt/Zustand"));
const Jotai = lazy(() => import("./pages/topics/stateMgmt/Jotai"));
const Recoil = lazy(() => import("./pages/topics/stateMgmt/Recoil"));
const XState = lazy(() => import("./pages/topics/stateMgmt/XState"));
const Persistence = lazy(() => import("./pages/topics/stateMgmt/Persistence"));

const RerenderTriggers = lazy(() => import("./pages/topics/perf/RerenderTriggers"));
const KeysStrategy = lazy(() => import("./pages/topics/perf/KeysStrategy"));
const Memoization = lazy(() => import("./pages/topics/perf/Memoization"));
const DeferWork = lazy(() => import("./pages/topics/perf/DeferWork"));
const WebWorkers = lazy(() => import("./pages/topics/perf/WebWorkers"));
const Virtualization = lazy(() => import("./pages/topics/perf/Virtualization"));
const ImageOptim = lazy(() => import("./pages/topics/perf/ImageOptim"));
const Profiler = lazy(() => import("./pages/topics/perf/Profiler"));

const ErrorBoundaries = lazy(() => import("./pages/topics/errors/ErrorBoundaries"));
const DataErrors = lazy(() => import("./pages/topics/errors/DataErrors"));
const FallbackUI = lazy(() => import("./pages/topics/errors/FallbackUI"));
const Retries = lazy(() => import("./pages/topics/errors/Retries"));
const LoggingMonitoring = lazy(() => import("./pages/topics/errors/LoggingMonitoring"));

const I18nBasics = lazy(() => import("./pages/topics/i18n/I18nBasics"));
const ReactI18next = lazy(() => import("./pages/topics/i18n/ReactI18next"));
const FormatJS = lazy(() => import("./pages/topics/i18n/FormatJS"));
const PluralsDatesNumbers = lazy(() => import("./pages/topics/i18n/PluralsDatesNumbers"));
const RtlSupport = lazy(() => import("./pages/topics/i18n/RtlSupport"));

const CssTransitions = lazy(() => import("./pages/topics/animations/CssTransitions"));
const CssAnimations = lazy(() => import("./pages/topics/animations/CssAnimations"));
const FramerMotion = lazy(() => import("./pages/topics/animations/FramerMotion"));
const ScrollEffects = lazy(() => import("./pages/topics/animations/ScrollEffects"));
const AnimationPerformance = lazy(() => import("./pages/topics/animations/AnimationPerformance"));

const TsxBasics = lazy(() => import("./pages/topics/typescript/TsxBasics"));
const TypingProps = lazy(() => import("./pages/topics/typescript/TypingProps"));
const TypingChildren = lazy(() => import("./pages/topics/typescript/TypingChildren"));
const TypingRefs = lazy(() => import("./pages/topics/typescript/TypingRefs"));
const TypingHooks = lazy(() => import("./pages/topics/typescript/TypingHooks"));
const TypingContext = lazy(() => import("./pages/topics/typescript/TypingContext"));
const TypingReducers = lazy(() => import("./pages/topics/typescript/TypingReducers"));
const Generics = lazy(() => import("./pages/topics/typescript/Generics"));

const RtlBasics = lazy(() => import("./pages/topics/testing/RtlBasics"));
const JestBasics = lazy(() => import("./pages/topics/testing/JestBasics"));
const AsyncTests = lazy(() => import("./pages/topics/testing/AsyncTests"));
const HooksTests = lazy(() => import("./pages/topics/testing/HooksTests"));
const RouterTests = lazy(() => import("./pages/topics/testing/RouterTests"));
const Msw = lazy(() => import("./pages/topics/testing/Msw"));
const E2eCypress = lazy(() => import("./pages/topics/testing/E2eCypress"));
const E2ePlaywright = lazy(() => import("./pages/topics/testing/E2ePlaywright"));
const A11yTests = lazy(() => import("./pages/topics/testing/A11yTests"));
const Snapshots = lazy(() => import("./pages/topics/testing/Snapshots"));

const SsrVsSsgVsIsr = lazy(() => import("./pages/topics/ssrRsc/SsrVsSsgVsIsr"));
const Hydration = lazy(() => import("./pages/topics/ssrRsc/Hydration"));
const Streaming = lazy(() => import("./pages/topics/ssrRsc/Streaming"));
const RscBasics = lazy(() => import("./pages/topics/ssrRsc/RscBasics"));
const SeoMeta = lazy(() => import("./pages/topics/ssrRsc/SeoMeta"));

const ViteConfig = lazy(() => import("./pages/topics/buildDx/ViteConfig"));
const Aliases = lazy(() => import("./pages/topics/buildDx/Aliases"));
const EslintPrettier = lazy(() => import("./pages/topics/buildDx/EslintPrettier"));
const Storybook = lazy(() => import("./pages/topics/buildDx/Storybook"));
const BundleAnalyze = lazy(() => import("./pages/topics/buildDx/BundleAnalyze"));
const Monorepo = lazy(() => import("./pages/topics/buildDx/Monorepo"));

const Xss = lazy(() => import("./pages/topics/security/Xss"));
const SanitizeHtml = lazy(() => import("./pages/topics/security/SanitizeHtml"));
const TokensStorage = lazy(() => import("./pages/topics/security/TokensStorage"));
const CorsCookies = lazy(() => import("./pages/topics/security/CorsCookies"));
const AuthBasics = lazy(() => import("./pages/topics/security/AuthBasics"));
const SupplyChain = lazy(() => import("./pages/topics/security/SupplyChain"));

const RestPatterns = lazy(() => import("./pages/topics/networking/RestPatterns"));
const GraphqlClients = lazy(() => import("./pages/topics/networking/GraphqlClients"));
const WebSockets = lazy(() => import("./pages/topics/networking/WebSockets"));
const FileUploads = lazy(() => import("./pages/topics/networking/FileUploads"));
const OfflineSync = lazy(() => import("./pages/topics/networking/OfflineSync"));

const ServiceWorker = lazy(() => import("./pages/topics/pwa/ServiceWorker"));
const CachingStrategies = lazy(() => import("./pages/topics/pwa/CachingStrategies"));
const AppManifest = lazy(() => import("./pages/topics/pwa/AppManifest.jsx"));
const OfflineFallback = lazy(() => import("./pages/topics/pwa/OfflineFallback"));
const PushNotifs = lazy(() => import("./pages/topics/pwa/PushNotifs"));

const CompoundComponents = lazy(() => import("./pages/topics/architecture/CompoundComponents"));
const RenderProps = lazy(() => import("./pages/topics/architecture/RenderProps"));
const ProviderPattern = lazy(() => import("./pages/topics/architecture/ProviderPattern"));
const StateReducer = lazy(() => import("./pages/topics/architecture/StateReducer"));
const HeadlessComponents = lazy(() => import("./pages/topics/architecture/HeadlessComponents"));
const Slots = lazy(() => import("./pages/topics/architecture/Slots"));
const FeatureFolders = lazy(() => import("./pages/topics/architecture/FeatureFolders"));
const ApiDesign = lazy(() => import("./pages/topics/architecture/ApiDesign"));

const Modal = lazy(() => import("./pages/topics/componentsLib/Modal"));
const Drawer = lazy(() => import("./pages/topics/componentsLib/Drawer"));
const Tooltip = lazy(() => import("./pages/topics/componentsLib/Tooltip"));
const Popover = lazy(() => import("./pages/topics/componentsLib/Popover"));
const Menu = lazy(() => import("./pages/topics/componentsLib/Menu"));
const Dropdown = lazy(() => import("./pages/topics/componentsLib/Dropdown"));
const Combobox = lazy(() => import("./pages/topics/componentsLib/Combobox"));
const Tabs = lazy(() => import("./pages/topics/componentsLib/Tabs"));
const Accordion = lazy(() => import("./pages/topics/componentsLib/Accordion"));
const Table = lazy(() => import("./pages/topics/componentsLib/Table"));
const List = lazy(() => import("./pages/topics/componentsLib/List"));
const Toast = lazy(() => import("./pages/topics/componentsLib/Toast"));
const Pagination = lazy(() => import("./pages/topics/componentsLib/Pagination"));

const Charts = lazy(() => import("./pages/topics/integrations/Charts"));
const Maps = lazy(() => import("./pages/topics/integrations/Maps"));
const Payments = lazy(() => import("./pages/topics/integrations/Payments"));
const AuthProviders = lazy(() => import("./pages/topics/integrations/AuthProviders"));
const MediaAudioVideo = lazy(() => import("./pages/topics/integrations/MediaAudioVideo"));
const CanvasWebGL = lazy(() => import("./pages/topics/integrations/CanvasWebGL"));
const Workers = lazy(() => import("./pages/topics/integrations/Workers"));

const DevTools = lazy(() => import("./pages/topics/tooling/DevTools"));
const VSCodeSetup = lazy(() => import("./pages/topics/tooling/VSCodeSetup"));
const Snippets = lazy(() => import("./pages/topics/tooling/Snippets"));
const LintRules = lazy(() => import("./pages/topics/tooling/LintRules"));
const CodeMetrics = lazy(() => import("./pages/topics/tooling/CodeMetrics"));

const GhPages = lazy(() => import("./pages/topics/deploy/GhPages"));
const Vercel = lazy(() => import("./pages/topics/deploy/Vercel"));
const Netlify = lazy(() => import("./pages/topics/deploy/Netlify"));
const CfPages = lazy(() => import("./pages/topics/deploy/CfPages"));
const EnvPerEnv = lazy(() => import("./pages/topics/deploy/EnvPerEnv"));
const CacheControl = lazy(() => import("./pages/topics/deploy/CacheControl"));
const ProdMonitoring = lazy(() => import("./pages/topics/deploy/ProdMonitoring"));

const ConcurrentModel = lazy(() => import("./pages/topics/modern/ConcurrentModel"));
const Transitions = lazy(() => import("./pages/topics/modern/Transitions"));
const SuspenseForData = lazy(() => import("./pages/topics/modern/SuspenseForData"));
const MigratingLegacy = lazy(() => import("./pages/topics/modern/MigratingLegacy"));
const Deprecations = lazy(() => import("./pages/topics/modern/Deprecations"));

const App = () => {
    const [displayNav, setDisplayNav] = useState(true);
    const handleDisplayNav = () => setDisplayNav(prev => !prev);

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.LogoLinkWrapper>
                    <Styled.NavLinkWrapper onClick={handleDisplayNav}>
                        <MdMenuOpen size={20} />
                    </Styled.NavLinkWrapper>
                    <NavLink to="/" title="ReactJS Notes">ReactJS Notes</NavLink>
                </Styled.LogoLinkWrapper>
                <Styled.Heading>
                    <a
                        href="https://www.ashishranjan.net"
                        target="_blank"
                        title="Ashish Ranjan"
                    >
                        <img src={ar_logo} alt="ar_logo" />
                    </a>
                </Styled.Heading>
            </Styled.Header>

            <Styled.Main>
                <Styled.NavWrapper className={`${displayNav ? "active" : ""}`}>
                    <div className="navInner">
                        <NavList />
                    </div>
                </Styled.NavWrapper>

                <Styled.ContentWrapper id="scroll-root" data-scroll-root>
                    <Styled.RoutesWrapper>
                        <Suspense
                            fallback={<Box
                                sx={{
                                    // border: "1px solid #f00",
                                    width: "100vw", height: "100vh",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}
                            ><CircularProgress /></Box>}>
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

                                <>
                                    <Route path="/routing/router-basics" element={<RouterBasics />} />
                                    <Route path="/routing/nested-routes" element={<NestedRoutes />} />
                                    <Route path="/routing/layout-routes" element={<LayoutRoutes />} />
                                    <Route path="/routing/route-params" element={<RouteParams />} />
                                    <Route path="/routing/search-params" element={<SearchParams />} />
                                    <Route path="/routing/lazy-routes" element={<LazyRoutes />} />
                                    <Route path="/routing/protected-routes" element={<ProtectedRoutes />} />
                                    <Route path="/routing/scroll-restore" element={<ScrollRestore />} />
                                    <Route path="/routing/not-found-redirect" element={<NotFoundRedirect />} />
                                </>

                                <>
                                    <Route path="/suspense-split/react-lazy" element={<ReactLazy />} />
                                    <Route path="/suspense-split/suspense-boundary" element={<SuspenseBoundary />} />
                                    <Route path="/suspense-split/route-splitting" element={<RouteSplitting />} />
                                    <Route path="/suspense-split/preloading" element={<Preloading />} />
                                </>

                                <>
                                    <Route path="/data/fetch-basics" element={<FetchBasics />} />
                                    <Route path="/data/abort-controller" element={<AbortControllerPage />} />
                                    <Route path="/data/loading-error-states" element={<LoadingErrorStates />} />
                                    <Route path="/data/swr-basics" element={<SwrBasics />} />
                                    <Route path="/data/tanstack-query" element={<TanstackQuery />} />
                                    <Route path="/data/cache-keys" element={<CacheKeys />} />
                                    <Route path="/data/invalidation" element={<Invalidation />} />
                                    <Route path="/data/infinite-scroll" element={<InfiniteScroll />} />
                                    <Route path="/data/optimistic-updates" element={<OptimisticUpdates />} />
                                    <Route path="/data/websockets-sse" element={<WebSocketsSse />} />
                                </>

                                <>
                                    <Route path="/state-mgmt/context-vs-store" element={<ContextVsStore />} />
                                    <Route path="/state-mgmt/redux-toolkit" element={<ReduxToolkit />} />
                                    <Route path="/state-mgmt/rtk-query" element={<RtkQuery />} />
                                    <Route path="/state-mgmt/zustand" element={<Zustand />} />
                                    <Route path="/state-mgmt/jotai" element={<Jotai />} />
                                    <Route path="/state-mgmt/recoil" element={<Recoil />} />
                                    <Route path="/state-mgmt/xstate" element={<XState />} />
                                    <Route path="/state-mgmt/persistence" element={<Persistence />} />
                                </>

                                <>
                                    <Route path="/perf/rerender-triggers" element={<RerenderTriggers />} />
                                    <Route path="/perf/keys-strategy" element={<KeysStrategy />} />
                                    <Route path="/perf/memoization" element={<Memoization />} />
                                    <Route path="/perf/defer-work" element={<DeferWork />} />
                                    <Route path="/perf/web-workers" element={<WebWorkers />} />
                                    <Route path="/perf/virtualization" element={<Virtualization />} />
                                    <Route path="/perf/image-optim" element={<ImageOptim />} />
                                    <Route path="/perf/profiler" element={<Profiler />} />
                                </>

                                <>
                                    <Route path="/errors/error-boundaries" element={<ErrorBoundaries />} />
                                    <Route path="/errors/data-errors" element={<DataErrors />} />
                                    <Route path="/errors/fallback-ui" element={<FallbackUI />} />
                                    <Route path="/errors/retries" element={<Retries />} />
                                    <Route path="/errors/logging-monitoring" element={<LoggingMonitoring />} />
                                </>

                                <>
                                    <Route path="/i18n/i18n-basics" element={<I18nBasics />} />
                                    <Route path="/i18n/react-i18next" element={<ReactI18next />} />
                                    <Route path="/i18n/formatjs" element={<FormatJS />} />
                                    <Route path="/i18n/plurals-dates-numbers" element={<PluralsDatesNumbers />} />
                                    <Route path="/i18n/rtl-support" element={<RtlSupport />} />
                                </>

                                <>
                                    <Route path="/animations/css-transitions" element={<CssTransitions />} />
                                    <Route path="/animations/css-animations" element={<CssAnimations />} />
                                    <Route path="/animations/framer-motion" element={<FramerMotion />} />
                                    <Route path="/animations/scroll-effects" element={<ScrollEffects />} />
                                    <Route path="/animations/anim-perf" element={<AnimationPerformance />} />
                                </>

                                <>
                                    <Route path="/typescript/tsx-basics" element={<TsxBasics />} />
                                    <Route path="/typescript/typing-props" element={<TypingProps />} />
                                    <Route path="/typescript/typing-children" element={<TypingChildren />} />
                                    <Route path="/typescript/typing-refs" element={<TypingRefs />} />
                                    <Route path="/typescript/typing-hooks" element={<TypingHooks />} />
                                    <Route path="/typescript/typing-context" element={<TypingContext />} />
                                    <Route path="/typescript/typing-reducers" element={<TypingReducers />} />
                                    <Route path="/typescript/generics" element={<Generics />} />
                                </>

                                <>
                                    <Route path="/testing/rtl-basics" element={<RtlBasics />} />
                                    <Route path="/testing/jest-basics" element={<JestBasics />} />
                                    <Route path="/testing/async-tests" element={<AsyncTests />} />
                                    <Route path="/testing/hooks-tests" element={<HooksTests />} />
                                    <Route path="/testing/router-tests" element={<RouterTests />} />
                                    <Route path="/testing/msw" element={<Msw />} />
                                    <Route path="/testing/e2e-cypress" element={<E2eCypress />} />
                                    <Route path="/testing/e2e-playwright" element={<E2ePlaywright />} />
                                    <Route path="/testing/a11y-tests" element={<A11yTests />} />
                                    <Route path="/testing/snapshots" element={<Snapshots />} />
                                </>

                                <>
                                    <Route path="/ssr-rsc/ssr-vs-ssg-vs-isr" element={<SsrVsSsgVsIsr />} />
                                    <Route path="/ssr-rsc/hydration" element={<Hydration />} />
                                    <Route path="/ssr-rsc/streaming" element={<Streaming />} />
                                    <Route path="/ssr-rsc/rsc-basics" element={<RscBasics />} />
                                    <Route path="/ssr-rsc/seo-meta" element={<SeoMeta />} />
                                </>

                                <>
                                    <Route path="/build-dx/vite-config" element={<ViteConfig />} />
                                    <Route path="/build-dx/aliases" element={<Aliases />} />
                                    <Route path="/build-dx/eslint-prettier" element={<EslintPrettier />} />
                                    <Route path="/build-dx/storybook" element={<Storybook />} />
                                    <Route path="/build-dx/bundle-analyze" element={<BundleAnalyze />} />
                                    <Route path="/build-dx/monorepo" element={<Monorepo />} />
                                </>

                                <>
                                    <Route path="/security/xss" element={<Xss />} />
                                    <Route path="/security/sanitize-html" element={<SanitizeHtml />} />
                                    <Route path="/security/tokens-storage" element={<TokensStorage />} />
                                    <Route path="/security/cors-cookies" element={<CorsCookies />} />
                                    <Route path="/security/auth-basics" element={<AuthBasics />} />
                                    <Route path="/security/supply-chain" element={<SupplyChain />} />
                                </>

                                <>
                                    <Route path="/networking/rest-patterns" element={<RestPatterns />} />
                                    <Route path="/networking/graphql-clients" element={<GraphqlClients />} />
                                    <Route path="/networking/websockets" element={<WebSockets />} />
                                    <Route path="/networking/file-uploads" element={<FileUploads />} />
                                    <Route path="/networking/offline-sync" element={<OfflineSync />} />
                                </>

                                <>
                                    <Route path="/pwa/service-worker" element={<ServiceWorker />} />
                                    <Route path="/pwa/caching-strategies" element={<CachingStrategies />} />
                                    <Route path="/pwa/app-manifest" element={<AppManifest />} />
                                    <Route path="/pwa/offline-fallback" element={<OfflineFallback />} />
                                    <Route path="/pwa/push-notifs" element={<PushNotifs />} />
                                </>

                                <>
                                    <Route path="/architecture/compound-components" element={<CompoundComponents />} />
                                    <Route path="/architecture/render-props" element={<RenderProps />} />
                                    <Route path="/architecture/provider-pattern" element={<ProviderPattern />} />
                                    <Route path="/architecture/state-reducer" element={<StateReducer />} />
                                    <Route path="/architecture/headless-components" element={<HeadlessComponents />} />
                                    <Route path="/architecture/slots" element={<Slots />} />
                                    <Route path="/architecture/feature-folders" element={<FeatureFolders />} />
                                    <Route path="/architecture/api-design" element={<ApiDesign />} />
                                </>

                                <>
                                    <Route path="/components-lib/modal" element={<Modal />} />
                                    <Route path="/components-lib/drawer" element={<Drawer />} />
                                    <Route path="/components-lib/tooltip" element={<Tooltip />} />
                                    <Route path="/components-lib/popover" element={<Popover />} />
                                    <Route path="/components-lib/menu" element={<Menu />} />
                                    <Route path="/components-lib/dropdown" element={<Dropdown />} />
                                    <Route path="/components-lib/combobox" element={<Combobox />} />
                                    <Route path="/components-lib/tabs" element={<Tabs />} />
                                    <Route path="/components-lib/accordion" element={<Accordion />} />
                                    <Route path="/components-lib/table" element={<Table />} />
                                    <Route path="/components-lib/list" element={<List />} />
                                    <Route path="/components-lib/toast" element={<Toast />} />
                                    <Route path="/components-lib/pagination" element={<Pagination />} />
                                </>

                                <>
                                    {/* External Integrations */}
                                    <Route path="/integrations/charts" element={<Charts />} />
                                    <Route path="/integrations/maps" element={<Maps />} />
                                    <Route path="/integrations/payments" element={<Payments />} />
                                    <Route path="/integrations/auth-providers" element={<AuthProviders />} />
                                    <Route path="/integrations/media-audio-video" element={<MediaAudioVideo />} />
                                    <Route path="/integrations/canvas-webgl" element={<CanvasWebGL />} />
                                    <Route path="/integrations/workers" element={<Workers />} />
                                </>

                                <>
                                    <Route path="/tooling/devtools" element={<DevTools />} />
                                    <Route path="/tooling/vscode-setup" element={<VSCodeSetup />} />
                                    <Route path="/tooling/snippets" element={<Snippets />} />
                                    <Route path="/tooling/lint-rules" element={<LintRules />} />
                                    <Route path="/tooling/code-metrics" element={<CodeMetrics />} />
                                </>

                                <>
                                    <Route path="/deploy/gh-pages" element={<GhPages />} />
                                    <Route path="/deploy/vercel" element={<Vercel />} />
                                    <Route path="/deploy/netlify" element={<Netlify />} />
                                    <Route path="/deploy/cf-pages" element={<CfPages />} />
                                    <Route path="/deploy/env-per-env" element={<EnvPerEnv />} />
                                    <Route path="/deploy/cache-control" element={<CacheControl />} />
                                    <Route path="/deploy/prod-monitoring" element={<ProdMonitoring />} />
                                </>

                                <>
                                    <Route path="/modern/concurrent-model" element={<ConcurrentModel />} />
                                    <Route path="/modern/transitions" element={<Transitions />} />
                                    <Route path="/modern/suspense-for-data" element={<SuspenseForData />} />
                                    <Route path="/modern/migrating-legacy" element={<MigratingLegacy />} />
                                    <Route path="/modern/deprecations" element={<Deprecations />} />
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
