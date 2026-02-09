import {Language, NavbarProps} from "../../type/Interface.ts";
import {useNavigate} from "react-router-dom";
import translations from "../../assets/lang/index.ts";
import React, {useEffect, useRef} from "react";
import {FaLightbulb} from "react-icons/fa6";
import {FaRegLightbulb} from "react-icons/fa6";
import {useGlobalAdvancedOptions} from "../../type/context/GlobalUIAdvancedOptions.tsx";
import {darkTheme, lightTheme} from "../../type/themes.ts";
import {
    ControlsContainer,
    DropdownItem,
    DropdownList,
    HeaderContainer,
    SelectArrow,
    SelectButton,
    SelectContainer,
    Title
} from "./styleds/header.styles.ts";

export default function Header({
                                  language,
                                  onChangeLanguage,
                                  isDarkMode,
                                  onToggleisDarkMode,
                                  isFocusMode,
                                  onToggleFocusMode
                              }: NavbarProps) {


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
                                onClick={() => {
                                    onToggleFocusMode();
                                    setIsOptions(false);
                                }}
                            >
                                {isFocusMode ? (langData.textShowTools ?? 'Show tools') : (langData.textFocusMode ?? 'Focus mode')}
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