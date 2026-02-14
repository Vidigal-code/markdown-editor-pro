import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {PreviewProps} from "../../type/Interface.ts";
import DOMPurify from "dompurify";
import {PreviewContainer} from "./styleds/preview.styles.ts";

export const PREVIEW_SCOPE_CLASS = 'markdown-preview-scope';
export const PREVIEW_STYLE_TAG_ATTR = 'data-preview-custom-css';

export const DEFAULT_MARKDOWN_CSS = `
.markdown-preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
}
.markdown-preview-content h1, .markdown-preview-content h2, .markdown-preview-content h3, .markdown-preview-content h4, .markdown-preview-content h5, .markdown-preview-content h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  line-height: 1.25;
}
.markdown-preview-content p { margin: 16px 0; }
.markdown-preview-content pre {
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.markdown-preview-content code {
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
.markdown-preview-content table {
  width: 100%;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
}
.markdown-preview-content th, .markdown-preview-content td {
  border: 1px solid #d0d7de;
  padding: 12px 16px;
}
.markdown-preview-content img {
  max-width: 100%;
  height: auto;
}
`;

const scopeCssToSelector = (css: string, scopeSelector: string): string => {
    const selectorBlockRegex = /(^|})\s*([^@{}][^{}]*)\s*\{/g;

    return css.replace(selectorBlockRegex, (fullMatch, prefix, selectorGroup) => {
        const scopedSelectorGroup = String(selectorGroup)
            .split(',')
            .map((selector) => selector.trim())
            .filter(Boolean)
            .map((selector) => {
                if (/^(from|to|\d+%)$/i.test(selector)) {
                    return selector;
                }
                if (selector.startsWith(scopeSelector)) {
                    return selector;
                }
                if (selector === ':root') {
                    return `${scopeSelector} :is(.markdown-preview-content)`;
                }
                return `${scopeSelector} :is(${selector})`;
            })
            .join(', ');

        if (!scopedSelectorGroup) {
            return fullMatch;
        }

        return `${prefix}\n${scopedSelectorGroup} {`;
    });
};

export const getScopedMarkdownCss = (customCss: string | undefined, scopeSelector: string): string => {
    const cssToUse = customCss && customCss.trim().length > 0 ? customCss : DEFAULT_MARKDOWN_CSS;
    return scopeCssToSelector(cssToUse, scopeSelector);
};

export default function Preview({markdown, containerId, customCss}: PreviewProps) {
    const sanitizedMarkdown = DOMPurify.sanitize(markdown);
    const scopedCss = getScopedMarkdownCss(customCss, `.${PREVIEW_SCOPE_CLASS}`);

    return (
        <PreviewContainer id={containerId}>
            <style data-preview-custom-css="true">{scopedCss}</style>
            <div className={PREVIEW_SCOPE_CLASS}>
                <div className="markdown-preview-content">
                    <ReactMarkdown
                        rehypePlugins={[remarkGfm, rehypeRaw]}
                    >
                        {sanitizedMarkdown}
                    </ReactMarkdown>
                </div>
            </div>
        </PreviewContainer>
    );
}
