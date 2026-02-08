import styled from 'styled-components';

export const FooterContainer = styled.footer<{ $theme: any }>`
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    background: ${({$theme}) => $theme.backgroundfooter};
    color: ${({ $theme }) => $theme.text};
    font-family: Arial, sans-serif;
    z-index: 1000;
    //box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
    //border-top-left-radius: 10px;
    //border-top-right-radius: 10px;

    @media (max-width: 768px) {
        padding: 10px;
        border-radius: 0;
        flex-direction: column;
        gap: 8px;
    }

    @media (max-width: 280px) {
        padding: 6px;
    }

    @media (min-width: 1800px) {
        padding: 15px 40px;
    }
`;

export const FooterText = styled.span<{ $theme: any }>`
    font-size: 14px;
    color: ${({ $theme }) => $theme.text};
    opacity: 0.9;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 1;
    }

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export const FooterLink = styled.a<{ $theme: any }>`
    color: ${({ $theme }) => $theme.linka};
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        color: ${({ $theme }) => $theme.text};
        text-decoration: underline;
    }
`;

export const FooterLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
`;

export const FooterRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
`;


