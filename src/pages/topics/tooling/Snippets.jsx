import { Styled } from "./styled";

const Snippets = () => {
    return (
        <Styled.Page>
            <Styled.Title>Snippets (VS Code)</Styled.Title>

            <Styled.Lead>
                <b>Snippets</b> are short triggers (like <Styled.InlineCode>rfc</Styled.InlineCode>) that
                expand into larger code blocks (like a React component). They reduce typing, keep code
                consistent, and prevent copy-paste errors. In VS Code you can create your own snippets in
                JSON, scope them to specific languages, and share them per project.
            </Styled.Lead>

            {/* 1) What is a snippet? Why use it? */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Snippet:</b> a reusable code template expanded by a short <em>prefix</em>. In VS Code,
                        snippets live in JSON files and can be global or language-specific.
                    </li>
                    <li>
                        <b>Goals:</b> speed up repetitive code, enforce team conventions, and guide beginners
                        with pre-filled best practices.
                    </li>
                    <li>
                        <b>Scope:</b> make a snippet available in all files or limit it to languages (e.g.,
                        <Styled.InlineCode>javascriptreact</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>typescriptreact</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where snippets live & how to create them */}
            <Styled.Section>
                <Styled.H2>Creating Snippets in VS Code</Styled.H2>
                <Styled.List>
                    <li>
                        Open the <b>Command Palette</b> →{" "}
                        <Styled.InlineCode>Preferences: Configure User Snippets</Styled.InlineCode>.
                    </li>
                    <li>
                        Choose <b>New Global Snippets file</b> (applies everywhere) or a language like{" "}
                        <Styled.InlineCode>javascriptreact</Styled.InlineCode> (React JSX),{" "}
                        <Styled.InlineCode>typescriptreact</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        VS Code creates a <Styled.InlineCode>.code-snippets</Styled.InlineCode> JSON file where
                        you add entries.
                    </li>
                </Styled.List>

                {/* ESCAPED: has ${TM_FILENAME_BASE} and tabstops */}
                <Styled.Pre>
                    {`// Example: ~/.config/Code/User/snippets/react-snippets.code-snippets (path varies by OS)
{
  "React Function Component": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "rfc",
    "description": "React function component (named, with default export)",
    "body": [
      "import React from 'react';",
      "",
      "export default function \${TM_FILENAME_BASE/[^a-zA-Z0-9]+/ /g}() {",
      "  return (",
      "    <div>\${1:Component content}</div>",
      "  );",
      "}"
    ]
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>TM_FILENAME_BASE</b> is a VS Code variable that inserts the current file name without
                    extension. The regex cleans non-alphanumerics to spaces.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Anatomy of a snippet */}
            <Styled.Section>
                <Styled.H2>Snippet Anatomy (Terms You'll See)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>prefix</b>: the trigger you type (e.g., <Styled.InlineCode>rfc</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>body</b>: the array of lines to insert. Supports <em>tabstops</em>,{" "}
                        <em>placeholders</em>, <em>choices</em>, and <em>variables</em>.
                    </li>
                    <li>
                        <b>scope</b>: comma-separated language IDs (e.g.,{" "}
                        <Styled.InlineCode>javascriptreact</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>description</b>: shown in IntelliSense.
                    </li>
                </Styled.List>

                <Styled.H3>Tabstops &amp; Placeholders</Styled.H3>
                <Styled.List>
                    <li>
                        <b>Tabstop</b>: cursor stops you can jump through with Tab —{" "}
                        <Styled.InlineCode>$1</Styled.InlineCode>, <Styled.InlineCode>$2</Styled.InlineCode>, …
                        and <Styled.InlineCode>$0</Styled.InlineCode> (final position).
                    </li>
                    <li>
                        <b>Placeholder</b>: default text inside a tabstop —{" "}
                        <Styled.InlineCode>\${"{1:Button}"}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Choice</b>: limited options —{" "}
                        <Styled.InlineCode>\${"{1|primary,secondary,ghost|}"}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Variable</b>: editor data —{" "}
                        <Styled.InlineCode>\${"{TM_FILENAME_BASE}"}</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>\${"{CURRENT_YEAR}"}</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>\${"{CLIPBOARD}"}</Styled.InlineCode>.
                    </li>
                </Styled.List>

                {/* ESCAPED: has backticks and ${} */}
                <Styled.Pre>
                    {`{
  "Styled Component": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "stc",
    "description": "Create a styled-component block",
    "body": [
      "import styled from 'styled-components';",
      "",
      "export const \${1:Wrapper} = styled.\${2:div}\`",
      "  display: \${3:flex};",
      "  gap: \${4:12px};",
      "\`;",
      "",
      "\$0"
    ]
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) React-focused snippet set (practical) */}
            <Styled.Section>
                <Styled.H2>Practical React Snippets (You Can Copy)</Styled.H2>

                {/* ESCAPED: has ${TM_FILENAME_BASE}, ${} tabstops */}
                <Styled.H3>1) Component + Props + Prop Defaults</Styled.H3>
                <Styled.Pre>
                    {`{
  "React Component with Props": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "rcp",
    "description": "Component with props and sensible defaults",
    "body": [
      "import React from 'react';",
      "",
      "export default function \${1:\${TM_FILENAME_BASE}}({ \${2:title} = '\${3:Title}', \${4:items} = [] }) {",
      "  return (",
      "    <section>",
      "      <h2>{\${2:title}}</h2>",
      "      <ul>",
      "        {\${4:items}.map((it, i) => <li key={i}>{it}</li>)}",
      "      </ul>",
      "    </section>",
      "  );",
      "}"
    ]
  }
}`}
                </Styled.Pre>

                {/* ESCAPED: has ${1:/upcase} */}
                <Styled.H3>2) useState pattern (with setter)</Styled.H3>
                <Styled.Pre>
                    {`{
  "useState Boilerplate": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "us",
    "description": "State + setter with initial value",
    "body": [
      "const [\${1:value}, set\${1/(^.)/\${1:/upcase}/}] = React.useState(\${2:null});",
      "\$0"
    ]
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    The regex <Styled.InlineCode>{`/(^.)/`}</Styled.InlineCode> +{" "}
                    <Styled.InlineCode>\${"{1:/upcase}"}</Styled.InlineCode> uppercases the first letter for
                    the setter name (e.g., <i>value → setValue</i>).
                </Styled.Small>

                <Styled.H3>3) useEffect with cleanup</Styled.H3>
                <Styled.Pre>
                    {`{
  "useEffect with Cleanup": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "uec",
    "description": "Effect + cleanup + deps",
    "body": [
      "React.useEffect(() => {",
      "  \${1:// side-effect}",
      "  return () => {",
      "    \${2:// cleanup}",
      "  };",
      "}, [\${3:deps}]);",
      "\$0"
    ]
  }
}`}
                </Styled.Pre>

                <Styled.H3>4) Form handler + preventDefault</Styled.H3>
                <Styled.Pre>
                    {`{
  "Form Submit Handler": {
    "scope": "javascriptreact,typescriptreact",
    "prefix": "hfs",
    "description": "Handle form submit w/ preventDefault",
    "body": [
      "function \${1:onSubmit}(e) {",
      "  e.preventDefault();",
      "  \${2:// TODO: validate & submit}",
      "}",
      "\$0"
    ]
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Using snippets effectively */}
            <Styled.Section>
                <Styled.H2>How to Use (Step by Step)</Styled.H2>
                <Styled.List>
                    <li>
                        Type the <b>prefix</b> (e.g., <Styled.InlineCode>rfc</Styled.InlineCode>) and accept from
                        IntelliSense or press <b>Tab</b>.
                    </li>
                    <li>
                        Press <b>Tab</b> to jump through <b>tabstops</b> (
                        <Styled.InlineCode>$1</Styled.InlineCode>, <Styled.InlineCode>$2</Styled.InlineCode> …,
                        finish at <Styled.InlineCode>$0</Styled.InlineCode>).
                    </li>
                    <li>
                        For <b>choices</b>, use arrow keys or type to filter options.
                    </li>
                    <li>
                        For <b>placeholders</b>, simply type to replace the suggested value.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Team workflow & sharing */}
            <Styled.Section>
                <Styled.H2>Team Workflow &amp; Sharing</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Project snippets:</b> add{" "}
                        <Styled.InlineCode>.vscode/your-project.code-snippets</Styled.InlineCode> to the repo so
                        everyone shares the same triggers.
                    </li>
                    <li>
                        <b>Settings Sync:</b> VS Code can sync user snippets across machines.
                    </li>
                    <li>
                        <b>Avoid collisions:</b> pick unique prefixes (
                        <Styled.InlineCode>ar-rcp</Styled.InlineCode> instead of{" "}
                        <Styled.InlineCode>rcp</Styled.InlineCode>) to avoid overlap with extensions.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Popular extension (pros/cons) */}
            <Styled.Section>
                <Styled.H2>Popular Extension: ES7+ React/Redux Snippets</Styled.H2>
                <Styled.List>
                    <li>
                        <b>What it is:</b> an extension that ships many React/Redux prefixes (e.g.,{" "}
                        <Styled.InlineCode>rafce</Styled.InlineCode> → arrow function component with export).
                    </li>
                    <li>
                        <b>Pros:</b> quick start, well-known prefixes, broad coverage.
                    </li>
                    <li>
                        <b>Cons:</b> can conflict with your own style; you may prefer custom snippets matching
                        your architecture (e.g., styled-components, hooks-first).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> encode your best practices (semantics, accessibility, state patterns) into
                        snippets.
                    </li>
                    <li>
                        <b>Do</b> use <b>tabstops</b> and <b>placeholders</b> to guide the next actions (e.g.,
                        focus on props, deps arrays).
                    </li>
                    <li>
                        <b>Do</b> keep prefixes short but <em>unambiguous</em> (
                        <Styled.InlineCode>stc</Styled.InlineCode> for styled component).
                    </li>
                    <li>
                        <b>Don't</b> overfit: snippets should be starting points, not rigid templates.
                    </li>
                    <li>
                        <b>Don't</b> forget accessibility—bake ARIA/labels into UI snippets.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prefix:</b> the trigger text you type to expand a snippet.
                    </li>
                    <li>
                        <b>Tabstop:</b> numbered cursor positions you jump through with Tab (
                        <Styled.InlineCode>$1</Styled.InlineCode>, <Styled.InlineCode>$0</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Placeholder:</b> default content inside a tabstop (
                        <Styled.InlineCode>\${"{1:default}"}</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Choice:</b> placeholder with predefined options (
                        <Styled.InlineCode>\${"{1|red,green,blue|}"}</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Variable:</b> dynamic value from the editor (
                        <Styled.InlineCode>\${"{TM_FILENAME_BASE}"}</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>\${"{CURRENT_YEAR}"}</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> start with a few high-impact prefixes (<i>rfc</i>, <i>us</i>, <i>uec</i>,{" "}
                <i>stc</i>), share them via a project snippets file, and evolve them as your patterns
                mature. Snippets should feel like a friendly nudge toward good React code.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Snippets;
