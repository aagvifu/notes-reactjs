import styled from "styled-components";

const mono =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const Styled = {
    Page: styled.article`
        max-width: 980px;
        margin: 0 auto;
        padding: 24px 18px 64px;
        line-height: 1.65;
        color: #e8e8e8;
    `,
    Title: styled.h1`
        font-size: clamp(22px, 2vw + 18px, 34px);
        margin: 0 0 12px;
    `,
    Lead: styled.p`
        font-size: 1.05rem;
        color: #cfcfcf;
        margin: 0 0 18px;
    `,
    Section: styled.section`
        margin: 28px 0 0;
        padding: 20px 18px;
        border: 1px solid hsl(0 0% 100% / 0.08);
        border-radius: 14px;
        background: hsl(220 15% 12% / 0.6);
    `,
    H2: styled.h2`
        margin: 0 0 10px;
        font-size: 1.2rem;
        color: #ffd2ba;
    `,
    List: styled.ul`
        margin: 8px 0 0 18px;
        padding: 0;
        li {
            margin: 6px 0;
        }
    `,
    Callout: styled.aside`
        margin: 16px 0;
        padding: 14px 16px;
        border-left: 4px solid coral;
        background: hsl(15 25% 20% / 0.35);
        border-radius: 10px;
    `,
    Pre: styled.pre`
        margin: 12px 0 0;
        padding: 14px 16px;
        background: hsl(220 15% 10%);
        border: 1px solid hsl(0 0% 100% / 0.08);
        border-radius: 12px;
        overflow: auto;
        font-family: ${mono};
        font-size: 0.95rem;
        code {
            font-family: inherit;
        }
    `,
    InlineCode: styled.code`
        font-family: ${mono};
        background: hsl(220 15% 16%);
        padding: 0 6px;
        border-radius: 6px;
        border: 1px solid hsl(0 0% 100% / 0.08);
    `,
    Small: styled.small`
        display: block;
        margin-top: 8px;
        color: #a9a9a9;
    `,
};
