import React from "react";
import { Styled } from "./styled";

const AttrsSpread = () => {
    return (
        <Styled.Page>
            <Styled.Title>Attributes & Spread</Styled.Title>
            <Styled.Lead>
                Pass props via attributes; spread merges an object of props into a JSX element.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Basic attributes</Styled.H2>
                <Styled.Pre>
                    {`<button disabled>Save</button>
<input type="text" defaultValue="hello" />
<div tabIndex={0} aria-label="card" />`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Spread props</Styled.H2>
                <Styled.List>
                    <li>Later props override earlier ones.</li>
                    <li>Use spread for “pass-through” props; avoid leaking unknown props to DOM.</li>
                </Styled.List>
                <Styled.Pre>
                    {`const base = { role: "button", tabIndex: 0 };
const danger = { className: "btn danger", disabled: true };

<button {...base} {...danger} onClick={onClick}>Delete</button>
// result has role="button" tabIndex=0 class="btn danger" disabled`}
                </Styled.Pre>
                <Styled.Small>
                    Spread after explicit props will override them; place spread earlier to let explicit props win.
                </Styled.Small>
            </Styled.Section>

            <Styled.Callout>
                Prefer explicit props for critical behavior. Use spread for style/ARIA pass-through on wrapper components.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AttrsSpread;
