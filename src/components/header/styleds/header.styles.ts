import styled from 'styled-components';
import {darkTheme} from "../../../type/themes.ts";

export const HeaderContainer = styled.header<{ $theme: any }>`
    position: relative;
    width: 100%;
    box-sizing: border-box;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: ${({$theme}) => $theme.backgroundheader};
    color: ${({$theme}) => $theme.text};
    font-family: Arial, sans-serif;
    z-index: 1000;
    //box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    //border-bottom-left-radius: 10px;
    //border-bottom-right-radius: 10px;

    nav {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    @media (min-width: 1201px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 24px;

        nav {
            width: auto;
        }
    }

    @media (max-width: 280px) {
        padding: 8px;
    }

    @media (min-width: 1800px) {
        padding: 15px 48px;
        max-width: 100%;
    }
`;

export const Title = styled.h1<{ $theme: any }>`
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

export const ControlsContainer = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 380px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

    @media (min-width: 1201px) {
        width: auto;
        max-width: none;
        margin: 0;
        flex-direction: row;
        gap: 15px;
        flex-wrap: wrap;
    }

    @media (max-width: 480px) {
        gap: 10px;
    }
`;

export const SelectContainer = styled.div<{ $theme: any }>`
    position: relative;
    width: 100%;
    max-width: 360px;
    flex: 1 1 100%;
    font-family: inherit;

    @media (min-width: 1201px) {
        width: clamp(160px, 12vw, 200px);
        max-width: none;
        flex: 0 0 clamp(160px, 12vw, 200px);
    }
`;

export const SelectButton = styled.div<{ $theme: any }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    min-height: 42px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.6s ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    background-color: transparent;
    color: ${({$theme}) => $theme.text};
    border: 2px solid ${({$theme}) => $theme.text};

    @media screen and (max-width: 280px) {
        padding: 6px 12px;
        font-size: 14px;
        height: 40px;
    }
`;

export const SelectArrow = styled.div<{ $theme: any; $isOpen: boolean }>`
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

export const DropdownList = styled.ul<{ $theme: any; $isOpen: boolean }>`
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
    z-index: 1200;
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

export const DropdownItem = styled.li<{ $theme: any }>`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
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


