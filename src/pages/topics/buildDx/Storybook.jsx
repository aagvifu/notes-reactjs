import React from "react";
import { Styled } from "./styled";

const Storybook = () => {
    return (
        <Styled.Page>
            <Styled.Title>Storybook</Styled.Title>

            <Styled.Lead>
                <b>Storybook</b> is a “frontend workshop” that lets you build, test, and document UI
                components in isolation—outside your app—so you can develop faster and catch edge cases
                early. It integrates tightly with Vite and React for zero-config local DX.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Storybook:</b> a tool that runs a separate UI for <i>components in isolation</i> with live examples (“stories”).</li>
                    <li><b>Isolation:</b> render a component without your app's routing/data so you can focus on UI states.</li>
                    <li><b>DX (Developer Experience):</b> the overall feel/speed/clarity of dev workflows; Storybook boosts DX via fast previews, docs, and testing.</li>
                    <li><b>CDD (Component-Driven Development):</b> build UI bottom-up from small, tested components to screens.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key Terms */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Story:</b> a named example of a component in a specific state (e.g., “Button/Primary”).</li>
                    <li><b>CSF (Component Story Format):</b> the standard JS/TS module format where you <i>export</i> a default <Styled.InlineCode>meta</Styled.InlineCode> and named stories.</li>
                    <li><b>Args:</b> a serializable object that configures story props; connected to the UI controls panel.</li>
                    <li><b>Controls:</b> an addon panel that lets you change args (like props) visually at runtime.</li>
                    <li><b>Decorators:</b> wrapper functions that provide context to all stories (e.g., theme, layout).</li>
                    <li><b>Parameters:</b> per-story/per-project settings (docs, actions, a11y, layout, backgrounds, etc.).</li>
                    <li><b>Play function:</b> a snippet that runs <i>after</i> a story renders to simulate user interactions (click/type/hover) and make assertions.</li>
                    <li><b>Addons:</b> plug-ins (Essentials, Interactions, A11y, etc.) that add features to Storybook.</li>
                    <li><b>Framework & Builder:</b> for React+Vite you use <Styled.InlineCode>@storybook/react-vite</Styled.InlineCode> powered by the Vite builder.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Install & Run */}
            <Styled.Section>
                <Styled.H2>Install & Run (React + Vite)</Styled.H2>
                <Styled.Pre>
                    {`# From your project root
npx storybook@latest init

# Start Storybook on a dev server (defaults to http://localhost:6006)
npm run storybook

# Build a static Storybook (output: storybook-static/)
npm run build-storybook`}
                </Styled.Pre>
                <Styled.Small>
                    The initializer detects Vite and configures the <Styled.InlineCode>@storybook/react-vite</Styled.InlineCode> framework automatically.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Project files */}
            <Styled.Section>
                <Styled.H2>Files you'll see (.storybook/)</Styled.H2>
                <Styled.Pre>
                    {`.storybook/
  main.ts    // "main config": stories globs, framework, addons, vite tweaks
  preview.ts // global parameters + decorators (wrap all stories)
src/
  components/Button.jsx
  components/Button.stories.jsx // your first CSF file
`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// .storybook/main.ts (JS is fine too)
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",     // actions, controls, docs, backgrounds, viewport, etc.
    "@storybook/addon-interactions",    // play function panel + test helpers
    "@storybook/addon-a11y"             // accessibility checks
  ],
  // Optional: customize Vite for Storybook only
  viteFinal: async (config) => {
    // e.g., add aliases or plugins here, return config
    return config;
  },
};
export default config;`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// .storybook/preview.ts
import type { Preview } from "@storybook/react";
import React from "react";

export const decorators = [
  (Story) => (
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  ),
];

export const parameters: Preview["parameters"] = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true, matchers: { color: /color/i } },
  layout: "centered",
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) First story (CSF) */}
            <Styled.Section>
                <Styled.H2>Write Your First Story (CSF)</Styled.H2>
                <Styled.Pre>
                    {`// src/components/Button.jsx
export default function Button({ label = "Click", variant = "solid", ...props }) {
  const styles = {
    solid:  { padding: "8px 14px", border: "none", background: "#4f46e5", color: "white", borderRadius: 8 },
    outline:{ padding: "8px 14px", border: "2px solid #4f46e5", background: "white", color: "#4f46e5", borderRadius: 8 },
    ghost:  { padding: "8px 14px", border: "none", background: "transparent", color: "#4f46e5", borderRadius: 8 },
  };
  return <button style={styles[variant]} {...props}>{label}</button>;
}`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/components/Button.stories.jsx (CSF 3)
import Button from "./Button";
import { userEvent, within, expect } from "@storybook/test";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],                 // enables auto-generated Docs
  args: { label: "Click me", variant: "solid" },
  argTypes: {
    variant: { control: { type: "radio" }, options: ["solid", "outline", "ghost"] },
    onClick: { action: "clicked" },  // Actions addon: logs events
  },
  parameters: {
    docs: {
      description: {
        component: "A simple button with solid/outline/ghost variants.",
      },
    },
  },
};
export default meta;

// Minimal stories (args-only)
export const Primary = {};
export const Outline = { args: { variant: "outline" } };
export const Ghost = { args: { variant: "ghost" } };

// Interaction test using the play function
export const Clickable = {
  args: { label: "Press" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.findByRole("button", { name: /press/i });
    await userEvent.click(btn);
    await expect(btn).toBeInTheDocument();
  },
};`}
                </Styled.Pre>

                <Styled.Small>
                    <b>CSF:</b> export a default <Styled.InlineCode>meta</Styled.InlineCode> and named stories. <b>Args</b> feed both the component and the Controls panel. The <b>play function</b> runs after render to simulate interactions and assert outcomes.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Args & Controls */}
            <Styled.Section>
                <Styled.H2>Args &amp; Controls</Styled.H2>
                <Styled.List>
                    <li><b>Args:</b> serializable props for stories; change them live from the Controls panel.</li>
                    <li><b>ArgTypes:</b> metadata that defines how Controls render (e.g., radio vs select), plus descriptions.</li>
                    <li><b>Actions:</b> auto-detect handlers like <Styled.InlineCode>onClick</Styled.InlineCode> or declare them in <Styled.InlineCode>argTypes</Styled.InlineCode> to log events.</li>
                </Styled.List>
                <Styled.Pre>
                    {`argTypes: {
  variant: {
    control: { type: "radio" },
    options: ["solid", "outline", "ghost"],
    description: "Visual style of the button"
  },
  onClick: { action: "clicked", description: "Click handler (Actions panel)" },
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Decorators & Parameters */}
            <Styled.Section>
                <Styled.H2>Decorators &amp; Parameters</Styled.H2>
                <Styled.List>
                    <li><b>Decorators:</b> wrap all or some stories with providers/layout (theme, i18n, router mocks).</li>
                    <li><b>Parameters:</b> control docs rendering, backgrounds, a11y options, layout, viewports, and more.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Global decorator (preview.ts) provides padding
export const decorators = [(Story) => <div style={{ padding: 24 }}><Story /></div>];

// Per-story parameters
export const Primary = {
  parameters: {
    backgrounds: { default: "light" },
    layout: "centered",
  },
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Docs (MDX & Autodocs) */}
            <Styled.Section>
                <Styled.H2>Docs: MDX &amp; Autodocs</Styled.H2>
                <Styled.List>
                    <li><b>Autodocs:</b> generate docs from CSF automatically when you add <Styled.InlineCode>tags: ["autodocs"]</Styled.InlineCode>.</li>
                    <li><b>MDX:</b> hand-crafted docs pages combining markdown + JSX-like blocks (<Styled.InlineCode>&lt;Story/&gt;</Styled.InlineCode>, <Styled.InlineCode>&lt;Controls/&gt;</Styled.InlineCode>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/components/Button.mdx (optional)
import { Meta, Story, Controls } from "@storybook/blocks";
import * as ButtonStories from "./Button.stories";

<Meta of={ButtonStories} />
# Button
<Story name="Primary">{ButtonStories.Primary}</Story>
<Controls />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility & QA */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; QA</Styled.H2>
                <Styled.List>
                    <li><b>A11y addon:</b> runs checks (ARIA roles, contrast, labels) in the <i>Accessibility</i> panel.</li>
                    <li><b>Interactions panel:</b> step through your <Styled.InlineCode>play</Styled.InlineCode> interactions visually and debug failures.</li>
                    <li><b>Static build:</b> publish docs/UI states to share with teammates or recruiters.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Vite notes */}
            <Styled.Section>
                <Styled.H2>Vite Builder Notes</Styled.H2>
                <Styled.List>
                    <li>Storybook reuses your <Styled.InlineCode>vite.config</Styled.InlineCode>; project-specific overrides can live in <Styled.InlineCode>viteFinal</Styled.InlineCode> inside <Styled.InlineCode>.storybook/main.ts</Styled.InlineCode>.</li>
                    <li>Prefer setting aliases/tsconfig paths in your main Vite config so both app and Storybook share them.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> create stories for <i>all</i> important states: loading, error, empty, long text, RTL.</li>
                    <li><b>Do</b> write small <Styled.InlineCode>play</Styled.InlineCode> tests for core interactions (click, type, focus).</li>
                    <li><b>Do</b> wrap stories with the same theme/provider the app uses (via decorators).</li>
                    <li><b>Don't</b> couple stories to live APIs; use mock data and pure props.</li>
                    <li><b>Don't</b> skip accessibility—enable the a11y addon and fix warnings early.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Storybook accelerates development with isolated rendering, live controls, docs,
                and interaction tests. Use CSF stories with args/controls, add decorators for context,
                and write small <i>play</i> tests to lock in behavior.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Storybook;
