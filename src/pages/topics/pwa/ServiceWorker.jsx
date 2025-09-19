import React from "react";
import { Styled } from "./styled";

const ServiceWorker = () => {
    return (
        <Styled.Page>
            <Styled.Title>Service Worker (PWA)</Styled.Title>

            <Styled.Lead>
                A <b>Service Worker</b> is a background script that sits between your app and the network.
                It can intercept requests, cache files, work offline, and enable advanced features like
                background sync and push notifications. It runs on a <b>separate thread</b>, has no DOM
                access, and requires <b>HTTPS</b> (or <b>localhost</b>).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms & Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Service Worker (SW):</b> A programmable network proxy running in the browser that can intercept fetches and serve cached responses.</li>
                    <li><b>Scope:</b> The URL path range the SW controls. It's set by the SW file's location and the <Styled.InlineCode>scope</Styled.InlineCode> option during registration.</li>
                    <li><b>Lifecycle:</b> Distinct phases: <i>install</i> → <i>activate</i> → <i>idle</i>. Updates download a new SW that becomes <i>waiting</i> until the old one releases.</li>
                    <li><b>Install Event:</b> First run; typically pre-cache your “app shell”.</li>
                    <li><b>Activate Event:</b> Cleanup old caches, take control of pages (optionally via <Styled.InlineCode>clients.claim()</Styled.InlineCode>).</li>
                    <li><b>Fetch Event:</b> Intercept network requests and apply a caching strategy to respond.</li>
                    <li><b>Cache Storage:</b> The persistent store (separate from HTTP cache) exposed via the <Styled.InlineCode>caches</Styled.InlineCode> API.</li>
                    <li><b>Precache vs Runtime cache:</b> Precache known assets at install; runtime cache things encountered later (API responses, images, etc.).</li>
                    <li><b>HTTPS only:</b> SWs are restricted to secure contexts to protect users.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where to put files (Vite + GH Pages note) */}
            <Styled.Section>
                <Styled.H2>Project Setup (Vite)</Styled.H2>
                <Styled.List>
                    <li>Place your SW script at <Styled.InlineCode>public/sw.js</Styled.InlineCode>. Vite copies it to the build output unchanged.</li>
                    <li>When deployed under a subpath (e.g., GitHub Pages: <Styled.InlineCode>/notes-reactjs/</Styled.InlineCode>), register the SW using a URL relative to <Styled.InlineCode>import.meta.env.BASE_URL</Styled.InlineCode> so scope matches your app.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/pwa/registerSW.js (example helper)
export async function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  // Ensure correct URL when app is served from a base path (e.g., /notes-reactjs/)
  const swUrl = new URL("sw.js", import.meta.env.BASE_URL).toString();

  try {
    const reg = await navigator.serviceWorker.register(swUrl /*, { scope: import.meta.env.BASE_URL }*/);

    // Optional: listen for updates
    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      newWorker?.addEventListener("statechange", () => {
        // states: installing -> installed (waiting) -> activating -> activated -> redundant
        // you can surface a toast when newWorker.state === "installed"
      });
    });

    // Optional: react when a waiting SW takes control (page reload, etc.)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // A new SW has taken control. You might prompt "App updated — reload?"
    });
  } catch (err) {
    console.error("SW registration failed:", err);
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: import and call <Styled.InlineCode>registerSW()</Styled.InlineCode> from your <Styled.InlineCode>main.jsx</Styled.InlineCode> or a boot file after the app mounts.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Minimal sw.js */}
            <Styled.Section>
                <Styled.H2>Minimal <code>sw.js</code>: Install → Activate → Fetch</Styled.H2>
                <Styled.Pre>
                    {`// public/sw.js
const CACHE_NAME = "app-cache-v1";
const ASSETS = [
  // "Precache" your app shell (paths relative to the SW scope)
  // e.g., "/", "/index.html", "/assets/index-xxxxx.js", "/assets/index-xxxxx.css"
];

// Install: open cache and add pre-known assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // Activate new SW immediately (optional — see update strategy below)
  self.skipWaiting();
});

// Activate: delete old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

// Fetch: basic "cache-first, then network" for same-origin GET
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      }).catch(() => {
        // Optional: offline fallback for navigations (see Offline Fallback topic)
      });
    })
  );
});`}
                </Styled.Pre>
                <Styled.Small>
                    This is a starter for learning. For production, prefer a well-defined strategy per route/asset and consider Workbox.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Update flow & user prompts */}
            <Styled.Section>
                <Styled.H2>Updates: Waiting vs Immediate</Styled.H2>
                <Styled.List>
                    <li><b>Default behavior:</b> a new SW becomes <i>waiting</i> until all old pages close; then it activates.</li>
                    <li><b>Immediate activation:</b> call <Styled.InlineCode>self.skipWaiting()</Styled.InlineCode> (in SW) and <Styled.InlineCode>clients.claim()</Styled.InlineCode> to take over. Safer with a user prompt to reload.</li>
                    <li><b>Recommended UX:</b> show “New version available — Update” button that posts a message to the SW to <i>skip waiting</i>, then reload the page.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// page code (e.g., registerSW helper): trigger refresh when an update is ready
navigator.serviceWorker.getRegistration().then((reg) => {
  if (!reg?.waiting) return;
  // Tell the waiting SW to activate NOW
  reg.waiting.postMessage({ type: "SKIP_WAITING" });
});

// sw.js: listen for that message
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Common caching strategies (preview) */}
            <Styled.Section>
                <Styled.H2>Common Caching Strategies (Preview)</Styled.H2>
                <Styled.List>
                    <li><b>Cache-First:</b> Serve from cache if available; else fetch & cache. Great for app shell / static assets.</li>
                    <li><b>Network-First:</b> Try network; fall back to cache when offline. Good for HTML pages / dynamic content.</li>
                    <li><b>Stale-While-Revalidate:</b> Serve cache instantly, update it in the background. Great UX for CSS/JSON that can refresh quietly.</li>
                    <li><b>Cache-Only / Network-Only:</b> Special cases, usually for analytics or sensitive endpoints.</li>
                </Styled.List>
                <Styled.Small>
                    Detailed code per strategy will be covered in <b>Caching Strategies</b>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Messaging & background tasks */}
            <Styled.Section>
                <Styled.H2>Messaging, Background Sync, Push (Overview)</Styled.H2>
                <Styled.List>
                    <li><b>postMessage API:</b> Two-way communication between page and SW for update prompts or custom commands.</li>
                    <li><b>Background Sync:</b> Queue requests while offline and retry later. Useful for “send later”.</li>
                    <li><b>Push Notifications:</b> Receive server-sent pushes (requires user permission + a push service + VAPID keys). Covered in the Push topic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Debugging & safety */}
            <Styled.Section>
                <Styled.H2>Debugging & Safety</Styled.H2>
                <Styled.List>
                    <li><b>DevTools:</b> Application → Service Workers (inspect, unregister, “Update on reload”).</li>
                    <li><b>Unregister:</b> If you break caching during development, unregister and clear storage.</li>
                    <li><b>Version caches:</b> Change <Styled.InlineCode>CACHE_NAME</Styled.InlineCode> on releases to avoid stale assets.</li>
                    <li><b>Don't cache POST/credentials data</b> unless you fully understand the risks.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Unregister (run once in console or a debug button)
navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach(r => r.unregister()));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep your SW small and deterministic; prefer clear strategies per route/asset type.</li>
                    <li><b>Do</b> serve SW over HTTPS and verify scope matches your deployed base path.</li>
                    <li><b>Do</b> provide an offline UX and a friendly update prompt.</li>
                    <li><b>Don't</b> cache sensitive API responses or authenticated endpoints by default.</li>
                    <li><b>Don't</b> mutate the DOM from the SW (it can't). Communicate via messages.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>App Shell:</b> The minimal HTML/CSS/JS needed to render your UI frame offline.</li>
                    <li><b>Clients:</b> The open tabs/windows your SW controls (<Styled.InlineCode>self.clients</Styled.InlineCode>).</li>
                    <li><b>Navigation Request:</b> A request where <Styled.InlineCode>mode</Styled.InlineCode> is <i>navigate</i> (page loads / SPA route changes).</li>
                    <li><b>Workbox:</b> A library that generates precaches and applies strategies declaratively.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: A Service Worker gives your app offline power and control over network requests.
                Start simple—precache your shell, pick clear strategies for assets/APIs, and design a friendly update flow.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ServiceWorker;
