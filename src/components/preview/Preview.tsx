import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import {PreviewProps} from "../../type/Interface.ts";
import DOMPurify from "dompurify";

const PreviewContainer = styled.div`
    flex: 1;
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    overflow-y: auto;
    min-height: 400px;
    padding: 24px;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    position: relative;
    transition: all 0.2s ease;
    scrollbar-color: ${props => props.theme.scrollbarThumb} ${props => props.theme.scrollbarTrack};
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        width: 12px;
    }

    &::-webkit-scrollbar-track {
        background: ${props => props.theme.scrollbarTrack};
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${props => props.theme.scrollbarThumb};
        border-radius: 10px;
        border: 3px solid ${props => props.theme.scrollbarTrack};
    }

    @media (max-width: 768px) {
        padding: 16px;
        font-size: 16px;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        color: ${props => props.theme.text};
        font-weight: 600;
        line-height: 1.25;
        border-bottom: 1px solid ${props => props.theme.border};
        padding-bottom: 0.3em;
    }

    h1 {
        font-size: 2.25em;
    }

    h2 {
        font-size: 1.75em;
    }

    h3 {
        font-size: 1.5em;
    }

    h4 {
        font-size: 1.25em;
    }

    h5 {
        font-size: 1.1em;
    }

    p {
        margin: 16px 0;
        line-height: 1.6;
    }

    a {
        color: ${props => props.theme.primary};
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;

        &:hover {
            color: ${props => props.theme.linka};
        }
    }

    pre {
        background-color: ${props => props.theme.prebackground};
        padding: 16px;
        overflow: auto;
        font-size: 14px;
        line-height: 1.45;
        border-radius: 6px;
        color: ${props => props.theme.codeText};
        margin: 24px 0;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    code {
        background-color: ${props => props.theme.codeBackground};
        padding: 0.2em 0.4em;
        margin: 0 2px;
        font-size: 90%;
        color: ${props => props.theme.codeText};
        border-radius: 4px;
        font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    }

    blockquote {
        margin: 24px 0;
        padding: 0 1em;
        color: ${props => props.theme.blockquote};
        border-left: 0.25em solid ${props => props.theme.border};
        font-style: italic;
        opacity: 0.8;
    }

    img {
        max-width: 100%;
        height: auto;
        margin: 24px 0;
    }

    table {
        width: 100%;
        margin: 24px 0;
        border-collapse: collapse;
        border-spacing: 0;
        display: block;
        overflow-x: auto;
    }

    table th, table td {
        padding: 12px 16px;
        border: 1px solid ${props => props.theme.border};
        text-align: left;
        vertical-align: top;
    }

    table th {
        background-color: ${props => props.theme.secondary};
        color: ${props => props.theme.text};
        font-weight: 600;
        position: sticky;
        top: 0;
    }

    table tr {
        transition: all 0.15s ease;

        &:hover {
            background-color: ${props => props.theme.secondary};
        }

        &:nth-child(2n) {
            background-color: ${props => props.theme.secondary};
        }
    }

    @media (max-width: 1200px) {
        font-size: 16px;
    }

    @media (max-width: 768px) {
        min-height: 300px;

        pre {
            font-size: 13px;
        }
    }
`;

export default function Preview({markdown}: PreviewProps) {
    const sanitizedMarkdown = DOMPurify.sanitize(markdown);

    return (
        <PreviewContainer>
            <ReactMarkdown
                rehypePlugins={[remarkGfm, rehypeRaw]}
            >
                {sanitizedMarkdown}
            </ReactMarkdown>
        </PreviewContainer>
    );
}
