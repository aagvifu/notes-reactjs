import React from "react";
import { Styled } from "./styled";

const Streaming = () => {
    return (
        <Styled.Page>
            <Styled.Title>Streaming (SSR &amp; RSC)</Styled.Title>

            <Styled.Lead>
                <b>Streaming</b> sends HTML to the browser <i>in chunks</i> as soon as parts are ready,
                instead of waiting for the entire page to render on the server. This improves perceived
                speed by lowering <Styled.InlineCode>TTFB</Styled.InlineCode> and letting the browser start
                painting earlier—especially when parts of the page depend on slow data.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions (Beginner Friendly)</Styled.H2>
                <Styled.List>
                    <li><b>SSR (Server-Side Rendering):</b> HTML is rendered on the server and sent to the browser.</li>
                    <li><b>Hydration:</b> the process where React attaches event handlers to already-rendered HTML so it becomes interactive.</li>
                    <li><b>Streaming SSR:</b> send the page HTML in <i>chunks</i> (pieces) as different parts finish rendering on the server.</li>
                    <li><b>Suspense boundary:</b> a React component that declares “this part may wait.” With streaming, sections inside Suspense can arrive later.</li>
                    <li><b>TTFB (Time To First Byte):</b> how quickly the first bytes of the response reach the browser. Lower is better.</li>
                    <li><b>Progressive Hydration:</b> the browser hydrates parts of the page as they arrive/become ready, not all at once.</li>
                    <li><b>Backpressure:</b> when the network or client can't consume data as fast as the server produces it; streaming APIs handle this gracefully.</li>
                    <li><b>RSC (React Server Components):</b> components that run only on the server and can be streamed to the client with zero client JS for that part's rendering logic.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why streaming helps */}
            <Styled.Section>
                <Styled.H2>Why Streaming Helps</Styled.H2>
                <Styled.List>
                    <li><b>Faster first paint:</b> the browser can start parsing HTML/CSS earlier.</li>
                    <li><b>Don't block on slow bits:</b> expensive/slow data areas can appear later within a <code>&lt;Suspense&gt;</code> boundary.</li>
                    <li><b>Smoother hydration:</b> break the work into islands so the main thread isn't jammed by a huge hydrate step.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) How it looks: React 18 Node (pipeable) */}
            <Styled.Section>
                <Styled.H2>Example: React 18 Streaming SSR (Node, <code>renderToPipeableStream</code>)</Styled.H2>
                <Styled.Pre>
                    {`// server.js (Express-style, Node streams)
// npm: react-dom/server
import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.js";

const app = express();

app.get("*", (req, res) => {
  let didError = false;

  // Kick off streaming render
  const { pipe, abort } = renderToPipeableStream(
    <html>
      <head><title>Streaming Demo</title></head>
      <body>
        <div id="root">
          <App url={req.url} />
        </div>
        <script src="/client.js" defer></script>
      </body>
    </html>,
    {
      onShellReady() {
        // Shell = HTML up to the first Suspense boundaries is ready
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-Type", "text/html");
        pipe(res); // start streaming bytes to the client now
      },
      onShellError(err) {
        didError = true;
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html");
        res.end("<!doctype html><p>Something went wrong</p>");
      },
      onAllReady() {
        // Everything (including all Suspense content) is ready
        // Optional: if you prefer to wait and send at once, you could end here.
      },
      onError(err) {
        didError = true;
        console.error("SSR error:", err);
      },
    }
  );

  // Safety timeout: if data is too slow, abort streaming
  setTimeout(() => abort(), 10000);
});

app.listen(3000);`}
                </Styled.Pre>
                <Styled.Small>
                    The server sends an initial <b>shell</b> quickly, then progressively streams in the slow sections.
                    The client hydrates as chunks arrive, so parts become interactive sooner.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Suspense boundaries idea */}
            <Styled.Section>
                <Styled.H2>Suspense Boundaries &amp; Progressive Rendering</Styled.H2>
                <Styled.Pre>
                    {`// App.jsx (conceptual)
// Areas that fetch data can be wrapped in Suspense
import React, { Suspense } from "react";
import { ProductsGrid } from "./ProductsGrid"; // may suspend on data

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero /> {/* static, renders immediately */}
        <Suspense fallback={<SkeletonGrid />}>
          <ProductsGrid /> {/* streams in when ready */}
        </Suspense>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews /> {/* can stream later, independently */}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Each <code>&lt;Suspense&gt;</code> area can stream later without blocking the rest of the page.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Edge / Web Streams example */}
            <Styled.Section>
                <Styled.H2>Edge Environments (Web Streams, <code>renderToReadableStream</code>)</Styled.H2>
                <Styled.Pre>
                    {`// Edge-style handler (e.g., Cloudflare/Workers), Web Streams API
import { renderToReadableStream } from "react-dom/server";
import App from "./App.js";

export default async function handleRequest(request) {
  const stream = await renderToReadableStream(<App url={new URL(request.url).pathname} />);
  // Wait for shell to be ready before returning (optional)
  await stream.allReady;
  return new Response(stream, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}`}
                </Styled.Pre>
                <Styled.Small>
                    Many edge runtimes prefer Web Streams. The concept is the same—send chunks as they're ready.
                </Styled.Small>
            </Styled.Section>

            {/* 6) How SEO behaves */}
            <Styled.Section>
                <Styled.H2>SEO &amp; Streaming (Quick Note)</Styled.H2>
                <Styled.List>
                    <li><b>SSR + streaming</b> still emits HTML. Search bots can index content that is present in the streamed HTML.</li>
                    <li><b>Critical content</b> should be server-rendered so it exists in the initial HTML stream. Avoid hiding essential text behind client-only code.</li>
                    <li>Meta tags should be in the initial shell (title, description, OG tags).</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Streaming with RSC */}
            <Styled.Section>
                <Styled.H2>Streaming with RSC (React Server Components)</Styled.H2>
                <Styled.List>
                    <li><b>What it is:</b> RSC moves data-heavy rendering to the server and streams a lightweight “component payload” to the client.</li>
                    <li><b>Benefit:</b> zero client-side JS for server components, less bundle size, and faster interaction for heavy data UI.</li>
                    <li><b>How it streams:</b> frameworks (e.g., Next.js) use a protocol (often called “Flight”) to stream the RSC tree while the client hydrates client components.</li>
                </Styled.List>
                <Styled.Small>
                    You can mix: stream the SSR shell, stream RSC payloads, then progressively hydrate client components.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> wrap slow sections in <Styled.InlineCode>&lt;Suspense&gt;</Styled.InlineCode> with good skeleton fallbacks.</li>
                    <li><b>Do</b> send a fast shell (header, hero, layout) so users see useful UI quickly.</li>
                    <li><b>Do</b> keep critical meta tags in the shell for SEO and social previews.</li>
                    <li><b>Don't</b> block the whole page on a single slow query; split into multiple boundaries.</li>
                    <li><b>Don't</b> delay the first byte by doing all data first—stream what you can.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Single giant Suspense boundary:</b> if everything is inside one boundary, you lose granularity.</li>
                    <li><b>Client-only fallbacks that shift layout:</b> use skeletons with realistic dimensions to avoid CLS.</li>
                    <li><b>Forgetting error boundaries:</b> pair Suspense with error boundaries so failures don't blank the page.</li>
                    <li><b>Large hydrate burst:</b> too many client components can still cause a big main-thread spike; consider more server components (RSC) or reduce client work.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Shell:</b> initial HTML frame that can be streamed quickly (header, layout, placeholders).</li>
                    <li><b>Chunked transfer:</b> sending data in pieces over HTTP/1.1 or HTTP/2.</li>
                    <li><b>CLS (Cumulative Layout Shift):</b> visual movement while the page is loading; minimized with stable skeletons.</li>
                    <li><b>Island/partial hydration:</b> hydrating page regions independently as they arrive or become visible.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Streaming SSR lets users see and use parts of your app sooner. Combine Suspense
                boundaries, a fast shell, and thoughtful fallbacks. For even leaner bundles, blend streaming
                with React Server Components where appropriate.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Streaming;
