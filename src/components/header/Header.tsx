import styled from 'styled-components';
import {Language, NavbarProps} from "../../type/Interface.ts";
import {useNavigate} from "react-router-dom";
import translations from "../../assets/translations.json";
import React, {useEffect, useRef} from "react";
import {FaLightbulb} from "react-icons/fa6";
import {FaRegLightbulb} from "react-icons/fa6";
import {useGlobalAdvancedOptions} from "../../type/context/GlobalUIAdvancedOptions.tsx";
import {darkTheme, lightTheme} from "../../type/themes.ts";


const HeaderContainer = styled.header<{ $theme: any }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: ${({$theme}) => $theme.backgroundheader};
    color: ${({$theme}) => $theme.text};
    font-family: Arial, sans-serif;
    z-index: 1000;
    //box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    //border-bottom-left-radius: 10px;
    //border-bottom-right-radius: 10px;

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

const Title = styled.h1<{ $theme: any }>`
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: ${({$theme}) => $theme.text};
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
        transform: scale(1.05);
        color: ${({$theme}) => ($theme === darkTheme ? "#f0f0f0" : $theme.primary)};
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

const SelectContainer = styled.div<{ $theme: any }>`
    position: relative;
    width: 100%;
    max-width: 300px;
    font-family: inherit;
    z-index: 40;

    @media screen and (max-width: 768px) {
        max-width: 100%;
    }
`;

const SelectButton = styled.div<{ $theme: any }>`
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
    color: ${({$theme}) => $theme.text};
    border: 2px solid ${({$theme}) => $theme.text};

    @media screen and (max-width: 280px) {
        padding: 6px 12px;
        font-size: 14px;
        height: 40px;
    }
`;

const SelectArrow = styled.div<{ $theme: any; $isOpen: boolean }>`
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({$theme}) => $theme.text};
    transform: ${({$isOpen}) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.3s ease;
    margin-left: 10px;

    ${SelectButton}:hover & {
        border-top-color: ${({$theme}) => $theme.primary};
    }
`;

const DropdownList = styled.ul<{ $theme: any; $isOpen: boolean }>`
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
    background-color: ${({$theme}) => $theme.secondary};
    z-index: 50;
    display: ${({$isOpen}) => ($isOpen ? 'block' : 'none')};
    text-align: center;
    border: 2px solid ${({$theme}) => $theme.border};

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({$theme}) => $theme.scrollbarTrack};
    }

    &::-webkit-scrollbar-thumb {
        background: ${({$theme}) => $theme.scrollbarThumb};
        border-radius: 4px;
    }
`;

const DropdownItem = styled.li<{ $theme: any }>`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: ${({$theme}) => $theme.text};
    background: ${({$theme}) => $theme.secondary};
    list-style: none;

    position: relative;

    &:hover {
        background: ${({$theme}) => $theme.primary};
        color: ${({$theme}) => $theme.background};
    }

    &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 2px solid ${({$theme}) => $theme.border};
    }

    @media (max-width: 280px) {
        padding: 6px 12px;
        font-size: 12px;
    }
`;


export default function Header({language, onChangeLanguage, isDarkMode, onToggleisDarkMode}: NavbarProps) {


    const navigate = useNavigate();

    const langData = translations[language as keyof typeof translations];


    const [isOpenLang, setIsOpenLang] = React.useState(false);
    const [isOptions, setIsOptions] = React.useState(false);

    const selectRefLang = useRef<HTMLDivElement>(null);
    const selectRefOptions = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (selectRefLang.current && !selectRefLang.current.contains(target)) {
                setIsOpenLang(false);
            }

            if (selectRefOptions.current && !selectRefOptions.current.contains(target)) {
                setIsOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const {isGlobalUiAdvancedOptions, setGlobalUiAdvancedOptions} = useGlobalAdvancedOptions();

    const currentTheme = !isDarkMode ? darkTheme : lightTheme;


    return (
        <HeaderContainer $theme={currentTheme}>
            <Title $theme={currentTheme}>Markdown Editor Pro</Title>
            <nav>
                <ControlsContainer>
                    <SelectContainer $theme={currentTheme} ref={selectRefLang}>
                        <SelectButton
                            $theme={currentTheme}
                            onClick={() => setIsOpenLang(!isOpenLang)}
                        >
                            {langData.menu?.[language as keyof typeof translations]}
                            <SelectArrow $theme={currentTheme} $isOpen={isOpenLang}/>
                        </SelectButton>

                        <DropdownList $theme={currentTheme} $isOpen={isOpenLang}>
                            {Object.entries(translations[language as keyof typeof translations].menu).map(([code, label]) => (
                                <DropdownItem
                                    $theme={currentTheme}
                                    key={code}
                                    onClick={() => {
                                        onChangeLanguage(code as Language);
                                        setIsOpenLang(false);
                                    }}
                                >
                                    {label}
                                </DropdownItem>
                            ))}
                        </DropdownList>
                    </SelectContainer>
                    <SelectContainer $theme={currentTheme} ref={selectRefOptions}>
                        <SelectButton
                            $theme={currentTheme}
                            onClick={() => setIsOptions(!isOptions)}
                        >
                            {langData.textOptions}
                            <SelectArrow $theme={currentTheme} $isOpen={isOptions}/>
                        </SelectButton>

                        <DropdownList $theme={currentTheme} $isOpen={isOptions}>
                            <DropdownItem
                                $theme={currentTheme}
                                onClick={onToggleisDarkMode}
                            >
                                {isDarkMode ? <FaRegLightbulb/>
                                    : <FaLightbulb/>}
                            </DropdownItem>
                            <DropdownItem
                                $theme={currentTheme}
                                onClick={() => setGlobalUiAdvancedOptions(!isGlobalUiAdvancedOptions)}
                            >
                                {isGlobalUiAdvancedOptions ? langData.textNormalOptions
                                    : langData.textAdvancedOptions}
                            </DropdownItem>
                            <DropdownItem
                                $theme={currentTheme}
                                onClick={() => {
                                    navigate('/');
                                }}
                            >
                                {langData.textBack}
                            </DropdownItem>
                        </DropdownList>
                    </SelectContainer>
                </ControlsContainer>
            </nav>
        </HeaderContainer>
    );
}