import styled from 'styled-components';

const FooterContainer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    background: #000;
    color: white;
    font-family: Arial, sans-serif;
    z-index: 1000;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

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

const FooterText = styled.span`
    font-size: 14px;
    color: #ffffff;
    opacity: 0.9;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 1;
    }

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const FooterLink = styled.a`
    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        color: #f0f0f0;
        text-decoration: underline;
    }
`;

const FooterLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
`;

const FooterRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
`;


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterLeft>
                <FooterText>
                    © {currentYear} Markdown Editor Pro
                    <span style={{marginLeft: '5px', color: '#fff'}}>
                        By
                         <FooterLink style={{marginLeft: '5px', color: '#fff'}} href="https://github.com/Vidigal-code"
                                     target="_blank">
                         Vidigal-code
                    </FooterLink>
                </span>
                </FooterText>
            </FooterLeft>
            <FooterRight>
                <FooterText>
                    <FooterLink href="https://github.com/Vidigal-code/markdown-editor-pro" target="_blank">
                        Documentation
                    </FooterLink>
                </FooterText>
            </FooterRight>
        </FooterContainer>
    );

}