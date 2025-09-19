import React from "react";
import { Styled } from "./styled";

const ViteConfig = () => {
    return (
        <Styled.Page>
            <Styled.Title>Vite Config</Styled.Title>

            <Styled.Lead>
                <b>Vite</b> is a fast dev server + build tool. In dev it serves ES modules directly and
                transforms code with <b>esbuild</b>; for production it bundles with <b>Rollup</b>.
                Configuration lives in <Styled.InlineCode>vite.config.js</Styled.InlineCode> (or <em>.ts</em>)
                and is exported via <Styled.InlineCode>defineConfig</Styled.InlineCode>.
            </Styled.Lead>

            {/* 1) Core terms */}
            <Styled.Section>
                <Styled.H2>Core Terms (know these first)</Styled.H2>
                <Styled.List>
                    <li><b>Dev server:</b> Vite’s local HTTP server with instant <b>HMR</b> (hot module replacement) for fast feedback.</li>
                    <li><b>HMR:</b> updates modules in the browser without a full reload, preserving state when possible.</li>
                    <li><b>ESBuild:</b> extremely fast transformer used by Vite for TS/JS/JSX in dev and dependency pre-bundling.</li>
                    <li><b>Rollup:</b> bundler used by Vite to create optimized production builds (<Styled.InlineCode>vite build</Styled.InlineCode>).</li>
                    <li><b>Plugin:</b> a hookable extension (Vite/ Rollup compatible) that transforms code or injects behavior.</li>
                    <li><b>Mode:</b> a named environment (e.g., <Styled.InlineCode>development</Styled.InlineCode>, <Styled.InlineCode>production</Styled.InlineCode>) that loads matching <em>.env</em> files.</li>
                    <li><b>Env var:</b> configuration value exposed to the client only if it starts with <Styled.InlineCode>VITE_</Styled.InlineCode> and is read via <Styled.InlineCode>import.meta.env</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal config */}
            <Styled.Section>
                <Styled.H2>Minimal React Vite Config</Styled.H2>
                <Styled.Pre>
                    {`// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>@vitejs/plugin-react</b> adds JSX transform, Fast Refresh (React HMR), and useful dev
                    warnings. Use <Styled.InlineCode>defineConfig</Styled.InlineCode> for type hints and clean DX.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Base path */}
            <Styled.Section>
                <Styled.H2>Base Path (important for GitHub Pages)</Styled.H2>
                <Styled.List>
                    <li><b>base:</b> the public path your app is served from. For GH Pages project sites, it’s <Styled.InlineCode>"/&lt;repo&gt;/"</Styled.InlineCode>.</li>
                    <li>Your live URL is <Styled.InlineCode>https://a2rp.github.io/notes-reactjs/</Styled.InlineCode>, so use <Styled.InlineCode>base: "/notes-reactjs/"</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// vite.config.js
export default defineConfig({
  base: "/notes-reactjs/",
  plugins: [react()],
});`}
                </Styled.Pre>
                <Styled.Small>
                    If you forget <b>base</b>, asset URLs and code-split chunks may 404 on GH Pages.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Aliases */}
            <Styled.Section>
                <Styled.H2>Aliases (clean import paths)</Styled.H2>
                <Styled.List>
                    <li><b>Alias:</b> a shortcut so you can write <Styled.InlineCode>import Button from "@/components/Button"</Styled.InlineCode> instead of long relative paths.</li>
                    <li>Configure in <Styled.InlineCode>resolve.alias</Styled.InlineCode>. (You’ll cover full “Aliases” topic later.)</li>
                </Styled.List>
                <Styled.Pre>
                    {`import path from "node:path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@components": path.resolve(process.cwd(), "src/components"),
    },
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Dev server options */}
            <Styled.Section>
                <Styled.H2>Dev Server Options</Styled.H2>
                <Styled.List>
                    <li><b>server.port:</b> which port to run on.</li>
                    <li><b>server.open:</b> open the browser on start.</li>
                    <li><b>server.proxy:</b> proxy API calls in dev to avoid CORS issues.</li>
                </Styled.List>
                <Styled.Pre>
                    {`export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Proxy:</b> requests to <Styled.InlineCode>/api/*</Styled.InlineCode> during dev are forwarded to your backend.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Environment & mode */}
            <Styled.Section>
                <Styled.H2>Environment Variables & Modes</Styled.H2>
                <Styled.List>
                    <li><b>.env files:</b> Vite loads <Styled.InlineCode>.env</Styled.InlineCode>, <Styled.InlineCode>.env.development</Styled.InlineCode>, <Styled.InlineCode>.env.production</Styled.InlineCode> based on mode.</li>
                    <li><b>Client exposure:</b> variables must be prefixed with <Styled.InlineCode>VITE_</Styled.InlineCode> to be available in code.</li>
                    <li><b>Read:</b> <Styled.InlineCode>import.meta.env.VITE_API_URL</Styled.InlineCode>. Do <em>not</em> use <Styled.InlineCode>process.env</Styled.InlineCode> in the browser.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// .env
VITE_APP_NAME="Notes ReactJS"
VITE_API_URL="https://api.example.com"

// in code
console.log(import.meta.env.MODE);           // "development" | "production"
console.log(import.meta.env.VITE_APP_NAME);  // "Notes ReactJS"`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Mode:</b> Use <Styled.InlineCode>vite build --mode staging</Styled.InlineCode> to load <Styled.InlineCode>.env.staging</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Define (compile-time constants) */}
            <Styled.Section>
                <Styled.H2><code>define</code> (compile-time constants)</Styled.H2>
                <Styled.List>
                    <li><b>define:</b> replaces identifiers at build time—great for feature flags and version strings.</li>
                    <li>Unlike env vars, <b>define</b> inlines values during build and doesn’t read from files automatically.</li>
                </Styled.List>
                <Styled.Pre>
                    {`export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify("1.2.3"),
    __ENABLE_EXPERIMENT__: "true",
  },
});

// usage in app:
if (__ENABLE_EXPERIMENT__) {
  console.log("Running v", __APP_VERSION__);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Build options */}
            <Styled.Section>
                <Styled.H2>Production Build Options</Styled.H2>
                <Styled.List>
                    <li><b>target:</b> JavaScript output target (e.g., <Styled.InlineCode>"es2019"</Styled.InlineCode>).</li>
                    <li><b>outDir:</b> output directory (defaults to <Styled.InlineCode>dist</Styled.InlineCode>).</li>
                    <li><b>sourcemap:</b> generate source maps for debugging.</li>
                    <li><b>minify:</b> <Styled.InlineCode>"esbuild"</Styled.InlineCode> (default) or <Styled.InlineCode>"terser"</Styled.InlineCode>.</li>
                    <li><b>rollupOptions:</b> fine-grained bundling control (manual chunks, asset naming, etc.).</li>
                </Styled.List>
                <Styled.Pre>
                    {`export default defineConfig({
  build: {
    target: "es2019",
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>manualChunks:</b> split big deps so browsers cache them separately; improves long-term page speed.
                </Styled.Small>
            </Styled.Section>

            {/* 9) OptimizeDeps */}
            <Styled.Section>
                <Styled.H2>Optimize Deps (pre-bundle for faster dev)</Styled.H2>
                <Styled.List>
                    <li><b>optimizeDeps:</b> pre-bundles slow/complex packages at dev start for snappier HMR.</li>
                    <li>Use <Styled.InlineCode>include</Styled.InlineCode> to force pre-bundling; <Styled.InlineCode>exclude</Styled.InlineCode> to skip.</li>
                </Styled.List>
                <Styled.Pre>
                    {`export default defineConfig({
  optimizeDeps: {
    include: ["lodash-es"],
    exclude: ["some-heavy-lib"],
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Preview server */}
            <Styled.Section>
                <Styled.H2>Preview Server</Styled.H2>
                <Styled.List>
                    <li><b>vite preview:</b> serves the built <Styled.InlineCode>dist</Styled.InlineCode> locally—useful to test prod behavior.</li>
                </Styled.List>
                <Styled.Pre>
                    {`export default defineConfig({
  preview: {
    port: 5050,
    open: true,
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> set <Styled.InlineCode>base</Styled.InlineCode> for GH Pages project sites (<Styled.InlineCode>"/notes-reactjs/"</Styled.InlineCode>).</li>
                    <li><b>Do</b> prefix client env vars with <Styled.InlineCode>VITE_</Styled.InlineCode> and read via <Styled.InlineCode>import.meta.env</Styled.InlineCode>.</li>
                    <li><b>Do</b> use aliases for clean imports and <Styled.InlineCode>manualChunks</Styled.InlineCode> for better long-term caching.</li>
                    <li><b>Don’t</b> use <Styled.InlineCode>process.env</Styled.InlineCode> in browser code (use <Styled.InlineCode>import.meta.env</Styled.InlineCode>).</li>
                    <li><b>Don’t</b> hardcode absolute URLs; prefer env-driven config.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Quick reference */}
            <Styled.Section>
                <Styled.H2>Quick Reference</Styled.H2>
                <Styled.Pre>
                    {`// vite.config.js (React + GH Pages + aliases + proxy + build)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: "/notes-reactjs/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:4000", changeOrigin: true } },
  },
  define: { __APP_VERSION__: JSON.stringify("1.0.0") },
  build: {
    target: "es2019",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom"], vendor: ["react-router-dom"] },
      },
    },
  },
});`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                Summary: Vite’s config is small but powerful—set the correct <b>base</b>, organize imports
                with <b>aliases</b>, use <b>env vars</b> via <b>import.meta.env</b>, optimize builds with
                <b> rollupOptions</b>, and lean on <b>@vitejs/plugin-react</b> for React DX.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ViteConfig;
