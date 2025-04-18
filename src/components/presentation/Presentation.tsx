import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {GlobalButton} from "../button/GlobalButton.tsx";
import example from '../../assets/example.gif';
import icon from '../../assets/icon.svg';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
`;

const LargeImage = styled.img`
    width: 80%;
    max-width: 800px;
    height: auto;
    object-fit: contain;
    margin-bottom: 20px;
    border: solid 2.5px black;
`;

const SmallIcon = styled.img`
    width: 100px;
    height: auto;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Description = styled.p`
    font-size: 1rem;
    color: #666;
    margin-bottom: 30px;
    max-width: 600px;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const StyledLink = styled.a`
    color: #007bff;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease-in-out;

    &:hover {
        color: #0056b3;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

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
