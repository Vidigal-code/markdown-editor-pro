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
    codebackground: '#f6f8fa',
    prebackground: '#f6f8fa',
    backgroundfooter: '#F5F5F5',
    backgroundheader: '#F5F5F5',
    background: '#ffffff',
    text: '#24292f',
    primary: '#0969da',
    secondary: '#eaeef2',
    border: '#d0d7de',
    scrollbar: '#e1e4e8',
    scrollbarThumb: '#c1c7cd',
    scrollbarTrack: '#f6f8fa',
    blockquote: '#57606a',
    codeBackground: '#f6f8fa',
    codeText: '#24292f',
    linka: '#0969da'
};


export const darkTheme = {
    codebackground: '#161b22',
    prebackground: '#0d1117',
    backgroundfooter: '#000',
    backgroundheader: '#000',
    background: '#0d1117',
    text: '#c9d1d9',
    primary: '#58a6ff',
    secondary: '#21262d',
    border: '#30363d',
    scrollbar: '#161b22',
    scrollbarThumb: '#484f58',
    scrollbarTrack: '#0d1117',
    blockquote: '#8b949e',
    codeBackground: '#161b22',
    codeText: '#c9d1d9',
    linka: '#58a6ff'
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