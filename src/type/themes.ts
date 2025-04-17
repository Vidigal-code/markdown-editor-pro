import { createGlobalStyle } from 'styled-components';


declare module 'styled-components' {
    export interface DefaultTheme {
        codebackground: string;
        prebackground: string;
        background: string;
        text: string;
        primary: string;
        secondary: string;
        border: string;
        scrollbar: string;
        scrollbarThumb: string;
        scrollbarTrack: string;
        blockquote: string;
        codeBackground: string;
        codeText: string;
        linka: string;
    }
}

export const lightTheme = {
    codebackground: '#F0F1F2',
    prebackground: '#F6F8FA',
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff',
    secondary: '#d0d7de',
    border: '#ccc',
    scrollbar: '#dadada',
    scrollbarThumb: '#666',
    scrollbarTrack: '#f0f0f0',
    blockquote: '#262b32',
    codeBackground: '#f6f8fa',
    codeText: '#24292e',
    linka:'white',
};

export const darkTheme = {
    codebackground: '#1E242A',
    prebackground: '#151B23',
    background: '#0d1117',
    text: '#ffffff',
    primary: '#58a6ff',
    secondary: '#262b32',
    border: '#30363d',
    scrollbar: '#24292e',
    scrollbarThumb: '#8b949e',
    scrollbarTrack: '#444c56',
    blockquote: '#d0d7de',
    codeBackground: '#161b22',
    codeText: '#f6f8fa',
    linka:'white',
};


export const GlobalStyles = createGlobalStyle`
    body {
        background: ${props => props.theme.background};
        color: ${props => props.theme.text};
        transition: all 0.3s ease;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
        min-height: 100vh; 
        overflow-x: hidden;
    }

    @media (min-width: 1920px) {
        body {
            font-size: 1.2rem;
            padding: 20px; 
        }
    }

    @media (max-width: 768px) {
        body {
            font-size: 0.9rem; 
            padding: 10px;
        }
    }
`;