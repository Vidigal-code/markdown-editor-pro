import {darkTheme, lightTheme} from "../../type/themes.ts";
import {FooterContainer, FooterLeft, FooterLink, FooterRight, FooterText} from "./styleds/footer.styles.ts";

interface FooterProps {
    isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const currentTheme = !isDarkMode ? darkTheme : lightTheme;

    return (
        <FooterContainer $theme={currentTheme}>
            <FooterLeft>
                <FooterText $theme={currentTheme}>
                    © {currentYear} Markdown Editor Pro
                    <span style={{marginLeft: '5px', color: isDarkMode ? 'black' : 'white'}}>
                        By
                         <FooterLink $theme={currentTheme} style={{marginLeft: '5px', color: isDarkMode ? 'black' : 'white'}} href="https://github.com/Vidigal-code"
                                     target="_blank">
                         Vidigal-code
                    </FooterLink>
                </span>
                </FooterText>
            </FooterLeft>
            <FooterRight>
                <FooterText $theme={currentTheme}>
                    <FooterLink style={{marginLeft: '5px', color: isDarkMode ? 'black' : 'white'}} $theme={currentTheme} href="https://github.com/Vidigal-code/markdown-editor-pro" target="_blank">
                        Documentation
                    </FooterLink>
                </FooterText>
            </FooterRight>
        </FooterContainer>
    );

}