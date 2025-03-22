import {ChangeEvent} from 'react';
import styled from 'styled-components';
import {EditorProps} from "../../type/Interface.ts";

const EditorContainer = styled.textarea`
    flex: 1;
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    overflow-y: auto;
    height: 700px;
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

    @media (max-width: 768px) {
        height: 500px;
        min-height: 500px;
    }

    @media (min-width: 1200px) {
        height: 800px;
    }
`;


export default function Editor({markdown, onChange}: EditorProps) {

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <EditorContainer
            value={markdown}
            onChange={handleChange}
            placeholder="Enter your markdown here..."
        />
    );
}