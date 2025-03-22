import styled from 'styled-components';
import {Language, NavbarProps} from "../../type/Interface.ts";
import {useNavigate} from "react-router-dom";

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #000;
    color: white;
    font-family: Arial, sans-serif;
    z-index: 1000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        border-radius: 0;
    }

    @media (max-width: 280px) {
        padding: 8px;
    }

    @media (min-width: 1800px) {
        padding: 15px 40px;
        max-width: 100%;
    }
`;

const Title = styled.h1`
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
        transform: scale(1.05);
        color: #f0f0f0;
    }

    @media (max-width: 768px) {
        font-size: 20px;
    }

    @media (max-width: 280px) {
        font-size: 18px;
    }

    @media (min-width: 1800px) {
        font-size: 32px;
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;

    @media (max-width: 480px) {
        gap: 10px;
    }
`;

const LanguageSelect = styled.select`
    padding: 8px 12px;
    border: 1px solid #ffffff;
    border-radius: 8px;
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23FFFFFF' viewBox='0 0 256 256'%3E%3Cpath d='M208.5 96l-80 80-80-80h160z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    padding-right: 30px;

    &:hover, &:focus {
        background-color: #1a1a1a;
        transform: scale(1.05);
    }

    option {
        background-color: #000000;
        color: #ffffff;
    }
`;

const Button = styled.button`
    padding: 8px 16px;
    border: 2px solid #ffffff;
    border-radius: 8px;
    background-color: transparent;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #ffffff;
        color: #000000;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    @media (max-width: 280px) {
        padding: 6px 12px;
        font-size: 12px;
    }
`;


export default function Header({language, onChangeLanguage, darkMode, onToggleDarkMode}: NavbarProps) {

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeLanguage(e.target.value as Language);
    };

    const navigate = useNavigate();

    return (
        <HeaderContainer>
            <Title>Markdown Editor Pro</Title>
            <nav>
                <ControlsContainer>
                    <LanguageSelect value={language} onChange={handleLanguageChange}>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="es">Español</option>
                    </LanguageSelect>
                    <Button onClick={onToggleDarkMode}>
                        {darkMode ? '☀️' : '🌙'}
                    </Button>
                    <Button onClick={() => navigate('/')}>Back</Button>
                </ControlsContainer>
            </nav>
        </HeaderContainer>
    );
}