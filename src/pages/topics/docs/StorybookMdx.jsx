// src/pages/topics/docs/StorybookMdx.jsx
import React from "react";
import { Styled } from "./styled";

const StorybookMdx = () => {
    return (
        <Styled.Page>
            <Styled.Title>Storybook MDX</Styled.Title>

            <Styled.Lead>
                <b>Storybook</b> is a development tool to build and preview UI components in isolation.
                <b> MDX</b> (Markdown + JSX) lets you write rich documentation pages
                alongside stories—mixing prose, code samples, and live components in a single file.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>What is Storybook? What is MDX?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Storybook:</b> a workbench for UI components. You load components, pass them props,
                        and view each state (“<em>story</em>”) without running the whole app.
                    </li>
                    <li>
                        <b>Story:</b> a named example of a component with specific props (e.g., “Button / Primary”).
                        Stories are small, focused scenarios for development, testing, and docs.
                    </li>
                    <li>
                        <b>CSF (Component Story Format):</b> the standard JavaScript/TS format for stories
                        (e.g., <code>Button.stories.jsx</code>). Great for interactive stories.
                    </li>
                    <li>
                        <b>MDX:</b> a file format that combines Markdown and JSX. In Storybook,
                        <b> MDX stories</b> let you write documentation with headings, lists, code blocks,
                        and also import and render React components inline.
                    </li>
                    <li>
                        <b>Docs mode:</b> Storybook's documentation view that renders MDX pages and auto-generated
                        controls/props tables for your components.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use MDX vs CSF */}
            <Styled.Section>
                <Styled.H2>MDX vs CSF: When to use which?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Use CSF</b> for day-to-day component states and playground stories (fast to create, code-first).
                    </li>
                    <li>
                        <b>Use MDX</b> when you need teaching-quality docs: introductions, guidelines, “Do &amp; Don't,”
                        accessibility notes, and multiple related components on one page.
                    </li>
                    <li>
                        You can <em>mix</em>: keep your CSF stories, then import and reference them inside MDX docs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal setup (conceptual) */}
            <Styled.Section>
                <Styled.H2>Getting Storybook (conceptual setup)</Styled.H2>
                <Styled.Small>
                    In a typical React + Vite project, you add Storybook with a CLI, which scaffolds a <code>.storybook/</code> config and example stories.
                    MDX works out of the box in modern Storybook versions. (Use official docs for the exact CLI command & versions.)
                </Styled.Small>
            </Styled.Section>

            {/* 4) Basic MDX anatomy */}
            <Styled.Section>
                <Styled.H2>Basic MDX Anatomy</Styled.H2>
                <Styled.Pre>
                    {`/* File: Button.stories.mdx */
import { Meta, Story, Canvas, ArgsTable } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Components/Button" of={Button} />

# Button
Use **Button** for primary actions. Keep labels short (1–3 words).

## Basic usage
<Canvas>
  <Story name="Primary">
    <Button variant="primary">Save</Button>
  </Story>
</Canvas>

## Props
<ArgsTable of={Button} />`}
                </Styled.Pre>
                <Styled.List>
                    <li>
                        <b>{`<Meta />`}</b>: declares metadata—<code>title</code> (sidebar name) and the component (<code>of</code>).
                    </li>
                    <li>
                        <b>{`<Canvas />`}</b>: renders live stories (an interactive preview surface).
                    </li>
                    <li>
                        <b>{`<Story />`}</b>: a single story example. Give it a <code>name</code>.
                    </li>
                    <li>
                        <b>{`<ArgsTable />`}</b>: auto-generates a props table from component metadata/controls.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Writing stories with args/controls */}
            <Styled.Section>
                <Styled.H2>Args & Controls (interactive props)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Args:</b> a story's inputs (props) expressed as plain data. Controls auto-build sliders, selects,
                        text fields in the Storybook UI so teammates can tweak props live.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Button.stories.mdx with args */
import { Meta, Canvas, Story, ArgsTable } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Components/Button" of={Button} />

## Playground
<Canvas>
  <Story
    name="Playground"
    args={{ variant: 'primary', disabled: false, children: 'Click Me' }}
  >
    {({ variant, disabled, children }) => (
      <Button variant={variant} disabled={disabled}>{children}</Button>
    )}
  </Story>
</Canvas>

<ArgsTable of={Button} />`}
                </Styled.Pre>
                <Styled.Small>
                    In MDX, you can write a function child inside <code>&lt;Story&gt;</code> to map args to JSX.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Reusing existing CSF stories */}
            <Styled.Section>
                <Styled.H2>Reusing Existing CSF Stories in MDX</Styled.H2>
                <Styled.Pre>
                    {`/* Import CSF stories and show them in docs */
import * as ButtonStories from './Button.stories'; // CSF file (e.g., default export + named stories)
import { Meta, Canvas, Story, ArgsTable } from '@storybook/blocks';

<Meta of={ButtonStories} />

# Button (Docs)
<Canvas>
  <Story of={ButtonStories.Primary} />
  <Story of={ButtonStories.Secondary} />
</Canvas>

<ArgsTable of={ButtonStories} />`}
                </Styled.Pre>
                <Styled.Small>
                    This pattern keeps one source of truth for stories (CSF) and composes docs with MDX.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Content structure guidelines */}
            <Styled.Section>
                <Styled.H2>How to Structure a Good MDX Doc</Styled.H2>
                <Styled.List>
                    <li>
                        Start with a short <b>purpose statement</b>: When to use the component, when not to.
                    </li>
                    <li>
                        Follow with <b>usage examples</b> covering key variants and states.
                    </li>
                    <li>
                        Include <b>Accessibility</b> (focus order, keyboard interactions, ARIA where applicable).
                    </li>
                    <li>
                        Add <b>Do &amp; Don't</b> to communicate conventions quickly.
                    </li>
                    <li>
                        End with an <b>API/Props</b> table and links to design tokens if relevant.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep stories focused: one clear scenario per story.</li>
                    <li><b>Do</b> show edge cases: long labels, loading, disabled, error.</li>
                    <li><b>Do</b> document accessibility expectations (keyboard, screen readers).</li>
                    <li><b>Don't</b> hide critical behavior behind complex setups—prefer minimal, readable examples.</li>
                    <li><b>Don't</b> duplicate stories across MDX and CSF; import CSF into MDX when possible.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls & How to Avoid Them</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Out-of-sync props:</b> When refactoring a component, update MDX docs and CSF stories together.
                    </li>
                    <li>
                        <b>Too many knobs:</b> Overloaded controls confuse readers. Keep args limited to meaningful props.
                    </li>
                    <li>
                        <b>Missing context:</b> If a component requires providers (Theme, Router), add decorators so stories work in isolation.
                    </li>
                    <li>
                        <b>Monolithic pages:</b> Break large docs into sections. Use headings and short paragraphs.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Decorators & theming (concept) */}
            <Styled.Section>
                <Styled.H2>Decorators & Theming (Concept)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Decorator:</b> a wrapper that adds context to all stories (e.g., ThemeProvider, BrowserRouter).
                    </li>
                    <li>
                        <b>Global decorator:</b> applied via <code>.storybook/preview</code>.
                    </li>
                    <li>
                        <b>Per-story decorator:</b> applied to a single story or docs page for specific needs.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Conceptual example: .storybook/preview (JS/TS)
// export const decorators = [
//   (Story) => (
//     <ThemeProvider theme={theme}>
//       <Story />
//     </ThemeProvider>
//   ),
// ];`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Story:</b> a named, interactive example of a component.</li>
                    <li><b>CSF:</b> JavaScript/TypeScript module that exports a component's stories.</li>
                    <li><b>MDX:</b> Markdown with JSX. In Storybook, used for docs pages that can also render stories.</li>
                    <li><b>Args:</b> props expressed as a serializable object that controls a story.</li>
                    <li><b>Controls:</b> auto-generated UI to tweak args live.</li>
                    <li><b>Decorators:</b> wrappers to provide shared context to stories.</li>
                    <li><b>Docs mode:</b> Storybook's documentation view that renders MDX pages and auto-docs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use MDX when you want narrative documentation with live examples.
                Keep stories focused, wire up controls for key props, and import CSF stories to avoid duplication.
                Treat docs as part of the component—update them with the code.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default StorybookMdx;
