import styled from 'styled-components';
import {NavbarProps} from "../../type/Interface.ts";
import {useNavigate} from "react-router-dom";
import translations from "../../assets/translations.json";
import React, {useEffect, useRef} from "react";
import { FaLightbulb } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa6";

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


const SelectContainer = styled.div<{ $isisDarkMode: boolean }>`
    position: relative;
    width: 100%;
    max-width: 300px;
    font-family: inherit;
    z-index: 40;

    @media screen and (max-width: 768px) {
        max-width: 100%;
    }
`;


const SelectButton = styled.div<{ $isisDarkMode: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.6s ease-in-out;


    background-color: transparent;
    color: #ffffff;
    border: 2px solid #ffffff;


    @media screen and (max-width: 280px) {
        padding: 6px 12px;
        font-size: 14px;
        height: 40px;
    }
`;

const SelectArrow = styled.div<{ $isisDarkMode: boolean; $isOpen: boolean }>`
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({$isisDarkMode}) => (!$isisDarkMode ? "#fff" : "#fff")};
    transform: ${({$isOpen}) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.3s ease;
    margin-left: 10px;

    ${SelectButton}:hover & {
        border-top-color: ${({theme}) => theme.white};
    }
`;

const DropdownList = styled.ul<{ $isisDarkMode: boolean; $isOpen: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
    border-radius: 8px;
    background-color: ${({$isisDarkMode}) => ($isisDarkMode ? "#000" : "#fff")};
    z-index: 50;
    display: ${({$isOpen}) => ($isOpen ? 'block' : 'none')};
    text-align: center;
    border: 2px solid ${({$isisDarkMode}) => (!$isisDarkMode ? "#fff" : "#000")};

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({$isisDarkMode}) => ($isisDarkMode ? "#333" : "#eee")};
    }

    &::-webkit-scrollbar-thumb {
        background: ${({$isisDarkMode}) => ($isisDarkMode ? "#666" : "#ccc")};
        border-radius: 4px;
    }
`;

const DropdownItem = styled.li<{ $isisDarkMode: boolean }>`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: ${({$isisDarkMode}) => ($isisDarkMode ? "#fff" : "#000")};
    background: ${({$isisDarkMode}) => ($isisDarkMode ? "#000" : "#fff")};
    list-style: none;

    position: relative;

    &:hover {
        background: ${({$isisDarkMode}) => ($isisDarkMode ? "#fff" : "#000")};
        color: ${({$isisDarkMode}) => ($isisDarkMode ? "#000" : "#fff")};
    }

    &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 2px solid ${({$isisDarkMode}) => ($isisDarkMode ? '#fff' : '#000')};
    }

    @media (max-width: 280px) {
        padding: 6px 12px;
        font-size: 12px;
    }
`;


export default function Header({language, onChangeLanguage, isDarkMode, onToggleisDarkMode}: NavbarProps) {


    const navigate = useNavigate();

    const pathLang = translations[language as keyof typeof translations];


    const [isOpenLang, setIsOpenLang] = React.useState(false);

    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpenLang(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <HeaderContainer>
            <Title>Markdown Editor Pro</Title>
            <nav>
                <ControlsContainer>
                    <SelectContainer $isisDarkMode={isDarkMode} ref={selectRef}>
                        <SelectButton
                            $isisDarkMode={isDarkMode}
                            onClick={() => setIsOpenLang(!isOpenLang)}
                        >
                            {pathLang.menu?.[language as keyof typeof translations]}
                            <SelectArrow $isisDarkMode={isDarkMode} $isOpen={isOpenLang}/>
                        </SelectButton>

                        <DropdownList $isisDarkMode={false} $isOpen={isOpenLang}>
                            {Object.entries(translations[language as keyof typeof translations].menu).map(([code, label]) => (
                                <DropdownItem
                                    key={code}
                                    $isisDarkMode={true}
                                    onClick={() => {
                                        onChangeLanguage(`${code}`);
                                        setIsOpenLang(false);
                                    }}
                                >
                                    {label}
                                </DropdownItem>
                            ))}
                        </DropdownList>
                    </SelectContainer>
                    <Button onClick={onToggleisDarkMode}>
                        {isDarkMode ?  <FaRegLightbulb/>
                            : <FaLightbulb />}
                    </Button>
                    <Button onClick={() => navigate('/')}>Back</Button>
                </ControlsContainer>
            </nav>
        </HeaderContainer>
    );
}