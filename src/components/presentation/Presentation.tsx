import {useNavigate} from 'react-router-dom';
import {GlobalButton} from "../button/GlobalButton.tsx";
import example from '../../assets/example.gif';
import icon from '../../assets/icon.svg';
import {Container, Description, LargeImage, SmallIcon, StyledLink, Title} from "./styleds/presentation.styles.ts";

export const Presentation = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <SmallIcon src={icon} alt="Icon"/>
            <LargeImage src={example} alt="Example"/>
            <Title>Markdown Editor Pro</Title>
            <Description>
                Markdown Editor is a React project for editing Markdown, with emoji support, styling via Styled Components, and safe rendering using Rehype and Remark.
            </Description>
            <GlobalButton onClick={() => navigate('/render')}>Click here to get started</GlobalButton>
            <div style={{marginTop: '1rem'}}>
                <StyledLink href="https://github.com/Vidigal-code" target="_blank" rel="noopener noreferrer">
                    By Kauan Vidigal - GitHub
                </StyledLink>
            </div>
            <div style={{marginTop: '0.20rem'}}>
                <StyledLink href="https://github.com/Vidigal-code/markdown-editor-pro" target="_blank"
                            rel="noopener noreferrer">
                    Project Docs
                </StyledLink>
            </div>
        </Container>
    );
};
