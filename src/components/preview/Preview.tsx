import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {PreviewProps} from "../../type/Interface.ts";
import DOMPurify from "dompurify";
import {PreviewContainer} from "./styleds/preview.styles.ts";

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
