import styled from 'styled-components';

export const EditorContainer = styled.textarea`
    flex: 1;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    overflow-y: auto;
    height: 700px;
    min-height: 700px;
    max-height: 700px;
    padding: 24px;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-size: 17px;
    font-family: var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace);
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    resize: none;

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        background-color: ${props => props.theme.background};
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.scrollbarThumb};
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: ${props => props.theme.scrollbar};
    }

    @media (max-width: 1024px) and (min-width: 769px) {
        max-width: 720px;
        padding: 16px;
        border-radius: 8px;
        height: 600px;
        min-height: 600px;
        max-height: 600px;
    }

    @media (max-width: 768px) {
        max-width: 720px;
        padding: 16px;
        border-radius: 8px;
        height: 500px;
        min-height: 500px;
        max-height: 500px;
    }

    @media (min-width: 1200px) {
        height: 800px;
        min-height: 800px;
        max-height: 800px;
    }
`;


