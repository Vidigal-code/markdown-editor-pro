import {FooterContainer, FooterLeft, FooterLink, FooterRight, FooterText} from "./styleds/footer.styles.ts";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterLeft>
                <FooterText>
                    © {currentYear} Markdown Editor Pro
                    <span style={{marginLeft: '5px'}}>
                        By
                         <FooterLink style={{marginLeft: '5px'}} href="https://github.com/Vidigal-code"
                                     target="_blank">
                         Vidigal-code
                    </FooterLink>
                </span>
                </FooterText>
            </FooterLeft>
            <FooterRight>
                <FooterText>
                    <FooterLink style={{marginLeft: '5px'}} href="https://github.com/Vidigal-code/markdown-editor-pro" target="_blank">
                        Documentation
                    </FooterLink>
                </FooterText>
            </FooterRight>
        </FooterContainer>
    );

}