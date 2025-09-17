import React from "react";
import { Styled } from "./styled";

const ProjectSetup = () => {
    return (
        <Styled.Page>
            <Styled.Title>Project Setup (React + Vite + styled-components)</Styled.Title>
            <Styled.Lead>
                End-to-end setup: tools, folder structure, routing, styling, linting/formatting,
                env handling, aliases, and a quick GH Pages note.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Prerequisites</Styled.H2>
                <Styled.List>
                    <li><b>Node.js</b> (LTS) + a package manager: npm / pnpm / yarn.</li>
                    <li><b>Git</b> for version control.</li>
                    <li><b>VS Code</b> + extensions: ESLint, Prettier, EditorConfig.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Create a Vite React project</Styled.H2>
                <p>Pick any one of these:</p>
                <Styled.Pre>
                    {`# npm
npm create vite@latest notes-reactjs -- --template react
cd notes-reactjs
npm install
npm run dev

# pnpm
pnpm create vite notes-reactjs --template react
cd notes-reactjs
pnpm install
pnpm dev

# yarn
yarn create vite notes-reactjs --template react
cd notes-reactjs
yarn
yarn dev`}
                </Styled.Pre>
                <Styled.Small>Template <code>react-swc</code> is also fine (faster dev transform).</Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Recommended folder structure</Styled.H2>
                <Styled.Pre>
                    {`notes-reactjs/
├─ index.html
├─ vite.config.js
├─ package.json
├─ .gitignore
├─ .editorconfig
├─ .eslintrc.cjs        # or .js/.json
├─ .prettierrc          # or package.json "prettier"
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ components/
   ├─ pages/
   │  ├─ home/
   │  │  ├─ index.jsx
   │  │  └─ styled.js
   │  └─ intro/
   │     ├─ styled.js
   │     ├─ WhatIsReact.jsx
   │     ├─ SpaVsMpa.jsx
   │     └─ ProjectSetup.jsx
   ├─ routes/            # optional: centralize route arrays
   ├─ styles/            # global styles/tokens if needed
   └─ assets/`}
                </Styled.Pre>
                <Styled.Small>Keep each page self-contained: <code>index.jsx</code> + <code>styled.js</code> when needed.</Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Install core libraries</Styled.H2>
                <Styled.Pre>
                    {`npm i react-router-dom styled-components`}
                </Styled.Pre>
                <p>Minimal router wiring:</p>
                <Styled.Pre>
                    {`// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
);`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why <code>basename={import.meta.env.BASE_URL}</code>?</b> In dev it’s <code>/</code>,
                    in GH Pages it becomes <code>/notes-reactjs/</code> automatically.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>App routes (skeleton)</Styled.H2>
                <Styled.Pre>
                    {`// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/notFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />

      {/* Intro topics */}
      {/* ...each topic gets its own route, see lazy import at bottom */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>styled-components quick start</Styled.H2>
                <Styled.Pre>
                    {`// src/styles/theme.js (optional)
export const theme = {
  colors: { bg: "#0f1115", text: "#e8e8e8", accent: "coral" },
  radius: "12px",
};

// src/styles/GlobalStyle.jsx (optional)
import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle\`
  :root { color-scheme: dark; }
  body { margin: 0; background: #0f1115; color: #e8e8e8; }
\`;

// src/main.jsx (wrap the app)
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";

<ThemeProvider theme={theme}>
  <GlobalStyle />
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
</ThemeProvider>`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>ESLint + Prettier + EditorConfig</Styled.H2>
                <Styled.Pre>
                    {`# install (pick your PM)
npm i -D eslint prettier eslint-plugin-react-hooks eslint-plugin-react \
  eslint-config-prettier eslint-plugin-prettier @vitejs/plugin-react
`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// .eslintrc.cjs
module.exports = {
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  rules: {
    "react/react-in-jsx-scope": "off"
  }
};`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}`}</Styled.Pre>
                <Styled.Pre>
                    {`# .editorconfig
root = true
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true`}
                </Styled.Pre>
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
  base: "/notes-reactjs/",            // set to repo name for GH Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
});`}
                </Styled.Pre>
                <Styled.Small>
                    Use aliases to avoid long relative imports. Example:
                    <code>{` import Button from "@components/Button"; `}</code>
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Environment variables (Vite)</Styled.H2>
                <Styled.List>
                    <li>Only variables prefixed with <b>VITE_</b> are exposed to the client.</li>
                    <li>Files: <code>.env</code>, <code>.env.development</code>, <code>.env.production</code>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# .env.development
VITE_API_BASE=/api-dev

# .env.production
VITE_API_BASE=https://api.example.com`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// usage
const base = import.meta.env.VITE_API_BASE;`}
                </Styled.Pre>
                <Styled.Small>
                    <code>import.meta.env.BASE_URL</code> is injected by Vite and matches <code>base</code> in
                    <code>vite.config.js</code>.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Package scripts (typical)</Styled.H2>
                <Styled.Pre>
                    {`// package.json (scripts)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx --max-warnings=0",
    "format": "prettier --write ."
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>GH Pages SPA fallback (optional)</Styled.H2>
                <p>For BrowserRouter on GH Pages, add a fallback <code>404.html</code>:</p>
                <Styled.Pre>
                    {`<!-- public/404.html (copy of index.html with a redirect) -->
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./" /></head>
  <body></body>
</html>`}
                </Styled.Pre>
                <Styled.Small>Ensures deep links like <code>/intro/what-is-react</code> reload correctly.</Styled.Small>
            </Styled.Section>

            <Styled.Callout>
                Summary: Vite bootstraps a fast React setup; React Router handles navigation with a
                basename tied to Vite’s <code>BASE_URL</code>; styled-components provides scoped styling;
                ESLint/Prettier/EditorConfig keep the codebase consistent; env files use the <code>VITE_</code> prefix;
                aliases clean up imports; GH Pages needs a small SPA fallback.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ProjectSetup;
