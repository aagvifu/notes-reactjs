import styled from "styled-components";

export const Styled = {
    Nav: styled.div`
        font-family: "Poppins", sans-serif;

        .home,
        a {
            color: #aaa;
            text-decoration: none;
            display: flex;
            &:hover {
                text-decoration: underline;
                color: #fff;
            }
            &.active {
                color: coral;
            }
        }

        .title {
            margin-top: 15px;
        }
    `,
};
