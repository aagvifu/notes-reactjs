import { Styled } from "./styled";

const Preloading = () => {
    return (
        <Styled.Page>
            <Styled.Title>Preloading</Styled.Title>

            <Styled.Lead>
                <b>Preloading</b> means fetching code or data <i>early</i> so that when the user navigates,
                there's little or no wait. It complements <b>code splitting</b> (breaking the app into
                smaller chunks) and <b>lazy loading</b> (loading those chunks on demand) by fetching the
                likely-needed chunk <i>before</i> it's demanded.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Concepts &amp; Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Code splitting:</b> splitting your bundle into smaller files (chunks) that can be
                        loaded on demand (e.g., via <Styled.InlineCode>import()</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Lazy loading:</b> loading a chunk only when needed (e.g., a route component). React
                        exposes <Styled.InlineCode>React.lazy</Styled.InlineCode> for this.
                    </li>
                    <li>
                        <b>Preloading:</b> fetching a resource <i>ahead of use</i> so it's already in cache when
                        needed (e.g., calling <Styled.InlineCode>import()</Styled.InlineCode> on hover).
                    </li>
                    <li>
                        <b>Resource hints:</b> HTML <Styled.InlineCode>&lt;link&gt;</Styled.InlineCode> tags that
                        give the browser a heads-up:
                        <ul>
                            <li>
                                <b><Styled.InlineCode>rel="preload"</Styled.InlineCode></b> — high-priority fetch for
                                the <i>current</i> page; must be used soon. Requires{" "}
                                <Styled.InlineCode>as</Styled.InlineCode> (script, style, font, image).
                            </li>
                            <li>
                                <b><Styled.InlineCode>rel="prefetch"</Styled.InlineCode></b> — low-priority fetch for
                                a <i>future</i> page (idle time).
                            </li>
                            <li>
                                <b><Styled.InlineCode>rel="modulepreload"</Styled.InlineCode></b> — prefetch an ES
                                module <i>and</i> its static imports (great for ESM code chunks).
                            </li>
                            <li>
                                <b><Styled.InlineCode>rel="preconnect"</Styled.InlineCode></b> — warm up TCP+TLS to a
                                domain; faster first request later.
                            </li>
                            <li>
                                <b><Styled.InlineCode>rel="dns-prefetch"</Styled.InlineCode></b> — resolve a domain's
                                DNS early (small win).
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Suspense boundary:</b> a UI boundary that shows a fallback while lazy code/data is
                        loading; if you preload, the fallback often never shows.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Preloading lazy components (hover, focus, idle) */}
            <Styled.Section>
                <Styled.H2>Preload Lazy Components</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Why:</b> if you know a user is likely to click a link, call{" "}
                        <Styled.InlineCode>import()</Styled.InlineCode> early to warm the chunk.
                    </li>
                    <li>
                        <b>How:</b> use a small helper to attach a <em>preload</em> function to a lazy component.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// lazyWithPreload.ts/js — attach a .preload() helper
export function lazyWithPreload(factory) {
  const Component = React.lazy(factory);
  Component.preload = factory; // call this to start fetching the chunk early
  return Component;
}

// Usage: define a lazy route component with preload capability
const ProfilePage = lazyWithPreload(() => import("../routes/ProfilePage"));

// UI: preload on hover/focus/idle
function ProfileLink() {
  function onHover() { ProfilePage.preload(); }
  function onFocus() { ProfilePage.preload(); }
  React.useEffect(() => {
    // Warm during idle time too (optional)
    const id = window.requestIdleCallback?.(() => ProfilePage.preload());
    return () => id && window.cancelIdleCallback?.(id);
  }, []);
  return (
    <a href="/profile" onMouseEnter={onHover} onFocus={onFocus}>
      Go to Profile
    </a>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Result: when the user clicks, the chunk is already cached—navigation feels instant and the
                    Suspense fallback rarely appears.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Route-level preloading (intersection observer) */}
            <Styled.Section>
                <Styled.H2>Route Preloading with Visibility</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Idea:</b> preload the route component when its link <i>scrolls into view</i> using{" "}
                        <Styled.InlineCode>IntersectionObserver</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function PreloadOnVisible({ preload, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          preload();
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: "200px" }); // start early
    io.observe(el);
    return () => io.disconnect();
  }, [preload]);
  return <span ref={ref}>{children}</span>;
}

// Example: wrap a NavLink (or button) and pass the route .preload
<PreloadOnVisible preload={ProfilePage.preload}>
  <a href="/profile">Go to Profile</a>
</PreloadOnVisible>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Preloading data (warm caches) */}
            <Styled.Section>
                <Styled.H2>Preload Data (Warm the Cache)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Why:</b> even if the code is hot, data can still delay the screen. Kick off the fetch
                        early and cache the result.
                    </li>
                    <li>
                        <b>How:</b> use your data layer (SWR/React Query/your own cache) to{" "}
                        <i>prefetch</i> on hover or visibility.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal DIY cache example
const dataCache = new Map();

async function fetchUser(userId) {
  const res = await fetch(\`/api/users/\${userId}\`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

function preloadUser(userId) {
  if (!dataCache.has(userId)) {
    const promise = fetchUser(userId).then(data => {
      dataCache.set(userId, { status: "success", data });
    }).catch(error => {
      dataCache.set(userId, { status: "error", error });
    });
    dataCache.set(userId, { status: "loading", promise });
  }
}

function useUser(userId) {
  const cached = dataCache.get(userId);
  const [state, setState] = React.useState(cached ?? { status: "idle", data: null });
  React.useEffect(() => {
    if (!cached) {
      preloadUser(userId); // start now
    }
    const tick = setInterval(() => setState(dataCache.get(userId) ?? { status: "idle" }), 50);
    return () => clearInterval(tick);
  }, [userId]);
  return state; // {status,data,error}
}

// Trigger prefetch on hover
<button onMouseEnter={() => preloadUser("42")}>Open user 42</button>`}
                </Styled.Pre>
                <Styled.Small>
                    In real apps, prefer libraries with built-in <i>prefetch</i>/<i>preload</i> APIs (SWR,
                    React Query) for better caching and deduplication.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Preloading images & fonts */}
            <Styled.Section>
                <Styled.H2>Preload Images &amp; Fonts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Images (JS):</b> create and cache <Styled.InlineCode>Image()</Styled.InlineCode>{' '}
                        objects so they're decoded before use.
                    </li>
                    <li>
                        <b>Images (HTML hint):</b>{" "}
                        <Styled.InlineCode>{`<link rel="preload" as="image" href="/hero.webp">`}</Styled.InlineCode>
                    </li>
                    <li>
                        <b>Fonts:</b>{" "}
                        <Styled.InlineCode>{`<link rel="preload" as="font" href="/inter.woff2" crossorigin>`}</Styled.InlineCode>
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// JS image preloader
const imgCache = new Set();
export function preloadImage(src) {
  if (imgCache.has(src)) return;
  const img = new Image();
  img.src = src;
  img.decode?.().catch(() => {}); // ignore decode errors
  imgCache.add(src);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Resource hints overview */}
            <Styled.Section>
                <Styled.H2>Resource Hints Cheat-Sheet</Styled.H2>
                <Styled.Pre>
                    {`<!-- Current page, must use soon -->
<link rel="preload" as="script" href="/assets/chunk-profile.js" />

<!-- Future page, low priority -->
<link rel="prefetch" href="/assets/chunk-settings.js" />

<!-- ESM: fetch module + its static imports -->
<link rel="modulepreload" href="/assets/chunk-dashboard.js" />

<!-- Warm network to a third-party host -->
<link rel="preconnect" href="https://api.example.com" crossorigin />
<link rel="dns-prefetch" href="https://api.example.com">`}
                </Styled.Pre>
                <Styled.Small>
                    In many build tools, some hints are auto-injected for you. Only add manual hints when you
                    have a measured need.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Do / Don't / Pitfalls */}
            <Styled.Section>
                <Styled.H2>Do / Don't / Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> preload the <i>next most likely</i> route on hover, focus, visibility, or idle.</li>
                    <li><b>Do</b> keep Suspense boundaries around lazy routes so a fallback is available if needed.</li>
                    <li><b>Do</b> measure with real user timings; remove preloads that don't move the needle.</li>
                    <li><b>Don't</b> preload everything—excess preloads can <i>slow down</i> the current page.</li>
                    <li><b>Don't</b> use <Styled.InlineCode>rel="preload"</Styled.InlineCode> for resources you won't use immediately.</li>
                    <li><b>Pitfall:</b> wrong <Styled.InlineCode>as</Styled.InlineCode> value breaks the hint (e.g., fonts need <Styled.InlineCode>crossorigin</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Idle time:</b> moments when the browser has spare bandwidth/CPU to prefetch.</li>
                    <li><b>Decode (images):</b> step where the compressed image is converted to pixels in memory.</li>
                    <li><b>IntersectionObserver:</b> browser API to detect when an element enters the viewport.</li>
                    <li><b>Prefetch vs Preload:</b> prefetch = future, low priority; preload = now, high priority.</li>
                    <li><b>Modulepreload:</b> ESM-aware preload that also fetches static imports of the module.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pair code splitting with smart preloading triggers (hover, focus, visibility, idle)
                and small, well-placed resource hints. Keep Suspense boundaries, measure results, and avoid
                over-fetching.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Preloading;
