import React from "react";
import { Styled } from "./styled";

const BundleAnalyze = () => {
    return (
        <Styled.Page>
            <Styled.Title>Bundle Analyze</Styled.Title>

            <Styled.Lead>
                <b>Bundle analysis</b> helps you see what's inside your production JavaScript/CSS bundles,
                how big each dependency is, and where you can trim size. In Vite (which uses Rollup for builds),
                we typically use a visualizer to inspect <i>modules</i>, <i>chunks</i>, and <i>assets</i>.
            </Styled.Lead>

            {/* 1) Why analyze? */}
            <Styled.Section>
                <Styled.H2>Why bundle analysis matters</Styled.H2>
                <Styled.List>
                    <li><b>Performance:</b> Smaller bundles ship faster over the network and execute quicker.</li>
                    <li><b>Clarity:</b> See <em>which</em> libraries dominate size and whether tree-shaking worked.</li>
                    <li><b>Priorities:</b> Decide where to split code (lazy routes), or replace heavy deps with lighter ones.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key definitions */}
            <Styled.Section>
                <Styled.H2>Key terms (plain English)</Styled.H2>
                <Styled.List>
                    <li><b>Module:</b> A single source file that your app imports (e.g., <Styled.InlineCode>src/App.jsx</Styled.InlineCode> or <Styled.InlineCode>node_modules/react/index.js</Styled.InlineCode>).</li>
                    <li><b>Bundle:</b> The final optimized files produced for production (<Styled.InlineCode>dist/assets/*.js</Styled.InlineCode>, <Styled.InlineCode>*.css</Styled.InlineCode>).</li>
                    <li><b>Chunk:</b> A piece of a bundle produced by code-splitting. Each dynamic import often becomes its own chunk (e.g., <Styled.InlineCode>index-XYZ.js</Styled.InlineCode>).</li>
                    <li><b>Asset:</b> Non-JS/CSS files copied/processed to <Styled.InlineCode>dist</Styled.InlineCode> (images, fonts, etc.).</li>
                    <li><b>Tree-shaking:</b> Removing exported code that isn't used by your app.</li>
                    <li><b>Code-splitting:</b> Breaking your app into multiple chunks so the browser downloads only what's needed for the current page.</li>
                    <li><b>Parsed size:</b> Size of the file before compression; affects CPU parse/execute time.</li>
                    <li><b>Gzip/Brotli size:</b> Compressed sizes over the network; what users actually download.</li>
                    <li><b>Vendor chunk:</b> A chunk that contains third-party deps (from <Styled.InlineCode>node_modules</Styled.InlineCode>).</li>
                    <li><b>Sourcemap:</b> A file that maps minified code back to original code for debugging/analysis.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Tools you can use */}
            <Styled.Section>
                <Styled.H2>Tools for Vite builds</Styled.H2>
                <Styled.List>
                    <li><b>rollup-plugin-visualizer:</b> Generates a treemap HTML report of your chunks/modules.</li>
                    <li><b>vite-bundle-visualizer:</b> Convenience wrapper for the same purpose.</li>
                    <li><b>source-map-explorer:</b> CLI to analyze a single built file using its sourcemap.</li>
                    <li><b>webpack-bundle-analyzer:</b> Popular for Webpack (mention only; not used with Vite builds).</li>
                </Styled.List>
                <Styled.Small>Below are example setups you can copy into your project when you're ready.</Styled.Small>
            </Styled.Section>

            {/* 4) Setup: rollup-plugin-visualizer */}
            <Styled.Section>
                <Styled.H2>Setup: rollup-plugin-visualizer (recommended)</Styled.H2>
                <Styled.Pre>
                    {`# 1) Install the plugin (dev dependency)
npm i -D rollup-plugin-visualizer
# or
pnpm add -D rollup-plugin-visualizer
yarn add -D rollup-plugin-visualizer

// 2) vite.config.js — add Visualizer to Rollup plugins (build only)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // required for accurate module analysis
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "dist/stats.html",   // where to write the report
          template: "treemap",           // "treemap", "sunburst", or "network"
          gzipSize: true,                // show gzip sizes
          brotliSize: true,              // show brotli sizes
          open: true                     // open the HTML report automatically after build
        })
      ]
    }
  }
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`# 3) Build the project
npm run build
# Then open dist/stats.html (auto-opens if open: true)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Setup: source-map-explorer */}
            <Styled.Section>
                <Styled.H2>Alternative: source-map-explorer (per-file view)</Styled.H2>
                <Styled.Pre>
                    {`# 1) Install
npm i -D source-map-explorer

# 2) Ensure sourcemaps are on in vite.config.js (build.sourcemap = true)

# 3) Run against a built file (adjust name)
npx source-map-explorer "dist/assets/*.js" --html dist/sme-report.html`}
                </Styled.Pre>
                <Styled.Small>Generates an HTML report per file to see which modules contribute to its size.</Styled.Small>
            </Styled.Section>

            {/* 6) Read the report */}
            <Styled.Section>
                <Styled.H2>How to read the report</Styled.H2>
                <Styled.List>
                    <li><b>Big rectangles = big modules:</b> The larger the block, the more bytes it contributes.</li>
                    <li><b>Vendor chunk:</b> Expect a large vendor chunk containing React, router, and UI libs.</li>
                    <li><b>Multiple chunks:</b> Route-level lazy imports appear as separate chunks—this is good for first-load time.</li>
                    <li><b>Gzip/Brotli:</b> Compare parsed vs compressed sizes; network cost may be far smaller than raw size.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Examples: reduce bundle size */}
            <Styled.Section>
                <Styled.H2>Examples: shrinking the bundle</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Code-split routes:</b> Use <Styled.InlineCode>React.lazy</Styled.InlineCode> and dynamic imports so large pages load on demand.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: route-level code splitting
import { lazy, Suspense } from "react";
const HeavyPage = lazy(() => import("./pages/HeavyPage"));

<Route
  path="/heavy"
  element={
    <Suspense fallback={<Spinner/>}>
      <HeavyPage />
    </Suspense>
  }
/>`}
                </Styled.Pre>
                <Styled.List>
                    <li>
                        <b>Manual vendor split (optional):</b> Control what goes into vendor vs app chunks.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// vite.config.js — manual chunks (advanced)
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes("node_modules")) {
          if (id.includes("react") || id.includes("react-router")) return "vendor-react";
          if (id.includes("styled-components")) return "vendor-styled";
          return "vendor";
        }
      }
    }
  }
}`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>Use lighter libs:</b> e.g., prefer <Styled.InlineCode>date-fns</Styled.InlineCode> over heavy, locale-bundled date libraries.</li>
                    <li><b>Import only what you use:</b> From utility libs, import specific functions (tree-shakable ESM builds like <Styled.InlineCode>lodash-es</Styled.InlineCode>).</li>
                    <li><b>Trim icons/fonts:</b> Avoid importing large icon packs wholesale; pick individual icons.</li>
                    <li><b>Avoid duplicate deps:</b> Ensure a single version of each library in <Styled.InlineCode>node_modules</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> enable <Styled.InlineCode>build.sourcemap</Styled.InlineCode> for accurate analysis.</li>
                    <li><b>Do</b> analyze a <em>production</em> build; dev server uses ES modules and is not optimized.</li>
                    <li><b>Do</b> lazy-load rarely used pages, editors, charts, and admin screens.</li>
                    <li><b>Don't</b> micro-optimize tiny files; prioritize the top 2-3 offenders in the report.</li>
                    <li><b>Don't</b> block critical route JS with huge optional dependencies—split them out.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Checklist */}
            <Styled.Section>
                <Styled.H2>Quick checklist</Styled.H2>
                <Styled.List>
                    <li>✅ Add visualizer; build with sourcemaps; open the report.</li>
                    <li>✅ Identify the largest modules and why they're needed.</li>
                    <li>✅ Replace/trim heavy deps; prefer ESM and named imports.</li>
                    <li>✅ Add route-level <Styled.InlineCode>React.lazy</Styled.InlineCode> and split heavy widgets.</li>
                    <li>✅ Rebuild and compare results; keep iterating until first-load is lean.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Minification:</b> Removing whitespace/renaming variables to reduce size.</li>
                    <li><b>Dead code:</b> Code that's never executed; should be removed by tree-shaking.</li>
                    <li><b>Hydration:</b> Attaching event listeners to server-rendered HTML (relevant for SSR apps).</li>
                    <li><b>Long-term caching:</b> Strategy where filenames include content hashes so browsers can cache aggressively.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Analyze your bundles regularly. Focus on the biggest modules first, split routes,
                import only what you use, and prefer lighter dependencies. Measure → change → measure again.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default BundleAnalyze;
