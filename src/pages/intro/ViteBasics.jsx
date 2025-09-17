import React from "react";
import { Styled } from "./styled";

const ViteBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Vite Basics</Styled.Title>
            <Styled.Lead>
                Vite is a fast dev server + build tool. Dev uses native ES modules for
                instant startup and HMR; production build uses Rollup for optimized
                bundles.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Core ideas</Styled.H2>
                <Styled.List>
                    <li><b>Index-first:</b> <Styled.InlineCode>index.html</Styled.InlineCode> is the entry file (not a bundler config).</li>
                    <li><b>Native ESM in dev:</b> modules are served as files → fast startup.</li>
                    <li><b>Pre-bundle deps:</b> heavy deps are pre-bundled by esbuild (fast) for quick HMR.</li>
                    <li><b>Rollup build:</b> production bundles, code-split chunks, asset hashing.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- index.html -->
<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Dev commands</Styled.H2>
                <Styled.Pre>
                    {`npm run dev      # start dev server with HMR
npm run build    # create production build in /dist
npm run preview  # preview the /dist build locally`}
                </Styled.Pre>
                <Styled.Small>HMR is automatic; components refresh without losing state when possible.</Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Vite config essentials</Styled.H2>
                <Styled.Pre>
                    {`// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "/notes-reactjs/",  // repo name for GH Pages; "/" for Netlify/Vercel
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});`}
                </Styled.Pre>
                <Styled.List>
                    <li>
                        <b>base:</b> the public base path. Pairs with{" "}
                        <Styled.InlineCode>import.meta.env.BASE_URL</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>alias:</b> shorter imports (e.g.,{" "}
                        <Styled.InlineCode>import Btn from "@/components/Btn"</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Environment variables</Styled.H2>
                <Styled.List>
                    <li>Only variables prefixed with <b>VITE_</b> are exposed to the client.</li>
                    <li>Files: <Styled.InlineCode>.env</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.development</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.production</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// usage inside code
const api = import.meta.env.VITE_API_BASE;
const baseUrl = import.meta.env.BASE_URL;  // derived from vite.config.js -> base`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Assets — two ways</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Imported assets (recommended):</b> processed and hashed on build.
                    </li>
                    <li>
                        <b>Public folder:</b> files under <Styled.InlineCode>public/</Styled.InlineCode> are copied as-is and served at root.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// 1) Imported asset
import logo from "@/assets/logo.svg";
<img src={logo} alt="logo" />

// 2) Public asset (no import)
<img src={import.meta.env.BASE_URL + "logo.svg"} alt="logo" />`}
                </Styled.Pre>
                <Styled.Small>
                    Imported assets are safer with GH Pages/base paths. Public assets are convenient for favicons, robots.txt, etc.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Special asset queries</Styled.H2>
                <Styled.List>
                    <li><b>?url</b> → get the final URL as a string.</li>
                    <li><b>?raw</b> → import file contents as raw text.</li>
                    <li><b>?worker</b> → create web workers easily.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import txt from "./notes.md?raw";
import imgUrl from "./photo.png?url";
import WorkerURL from "./heavy-task.js?worker";  // new Worker(WorkerURL)`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>CSS handling</Styled.H2>
                <Styled.List>
                    <li>Regular CSS files are supported out of the box.</li>
                    <li>CSS Modules: name files like <Styled.InlineCode>Button.module.css</Styled.InlineCode>.</li>
                    <li>Preprocessors: install the preprocessor (e.g., <Styled.InlineCode>sass</Styled.InlineCode>) and import <Styled.InlineCode>.scss</Styled.InlineCode>.</li>
                    <li>PostCSS config works via <Styled.InlineCode>postcss.config.js</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// CSS Modules
import styles from "./Button.module.css";
<button className={styles.primary}>Click</button>

// SCSS (after: npm i -D sass)
import "./global.scss";`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Auto imports to know</Styled.H2>
                <Styled.List>
                    <li><b>JSON as modules:</b> <Styled.InlineCode>import data from "./data.json"</Styled.InlineCode>.</li>
                    <li><b>Glob imports:</b> eager/lazy import many files at once.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// import many modules at once
const pages = import.meta.glob("../pages/**/*.jsx");       // lazy (returns loader fns)
const mdFiles = import.meta.glob("../docs/**/*.md", { eager: true }); // eager (direct modules)`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Optimize deps (dev speed)</Styled.H2>
                <Styled.List>
                    <li>Vite pre-bundles dependencies with esbuild for faster page loads.</li>
                    <li>Control with <Styled.InlineCode>optimizeDeps.include/exclude</Styled.InlineCode> when needed.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// vite.config.js (snippet)
export default defineConfig({
  optimizeDeps: {
    include: ["lodash-es"],
    exclude: ["big-legacy-lib"]
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Build output</Styled.H2>
                <Styled.List>
                    <li><b>dist/</b> contains hashed JS/CSS and copied assets.</li>
                    <li>Code splitting is automatic for dynamic imports.</li>
                    <li>Analyze bundles with Rollup plugins or tools if needed.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Dynamic import example (also how React.lazy works under the hood)
const Editor = React.lazy(() => import("@/components/Editor"));`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Common gotchas</Styled.H2>
                <Styled.List>
                    <li>Use <Styled.InlineCode>import.meta.env</Styled.InlineCode>, not <Styled.InlineCode>process.env</Styled.InlineCode>.</li>
                    <li>When deploying under a subpath (e.g., GH Pages), set <Styled.InlineCode>base</Styled.InlineCode> and use <Styled.InlineCode>import.meta.env.BASE_URL</Styled.InlineCode> for links to root assets.</li>
                    <li>Absolute <Styled.InlineCode>/src/…</Styled.InlineCode> imports in HTML won’t resolve; use module imports in JS.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Vite uses native ESM + esbuild for instant dev and Rollup for production builds.
                Key practices: set the correct <Styled.InlineCode>base</Styled.InlineCode>, prefer imported assets,
                use <Styled.InlineCode>import.meta.env</Styled.InlineCode>, and leverage glob/dynamic imports for scale.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ViteBasics;
