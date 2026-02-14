import React, {useEffect, useRef, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import translations from './assets/lang/index.ts';
import Editor from './components/editor/Editor.tsx';
import Preview, {
    getScopedMarkdownCss,
    PREVIEW_SCOPE_CLASS,
    PREVIEW_STYLE_TAG_ATTR
} from './components/preview/Preview.tsx';
import Header from './components/header/Header.tsx';
import ExampleList from "./components/example/ExampleList.tsx";
import {GlobalStyles} from './type/themes.ts';
import Footer from "./components/footer/Footer.tsx";
import {
    ButtonRendererView,
    Container,
    Content,
    EditorPreviewContainer,
    Input,
    InputGroup,
    PrimaryButton,
    SecondaryButton,
    Section,
    SectionButtons,
    SectionTitle,
    SeparatorFooter,
    ToolbarContainer
} from './render.styles.ts';
import {
    Example,
    ExampleCategory,
    TranslationData,
    Language,
    View,
    previewView,
    bothView,
    editorView
} from "./type/Interface.ts";
import ExampleListCustom from "./components/example/ExampleListCustom.tsx";
import RandomExampleSelector from "./components/example/RandomExampleSelector.tsx";
import DOMPurify from 'dompurify';
import {API_GITHUB, API_GITHUB_FINAL_MASTER} from "./api/api.ts";
import {useGlobalAdvancedOptions} from "./type/context/GlobalUIAdvancedOptions.tsx";
import {
    getDefaultLanguage,
    getHideThemeSelector,
    getInitialLayoutId,
    getLayoutById,
    getSelectableLayoutsByMode,
    getThemeByLayoutId,
    resolveLayoutIdForModeSwitch
} from "./assets/layouts/index.ts";

const Render: React.FC = () => {

    const [selectedLayoutId, setSelectedLayoutId] = useState<string>(() =>
        getInitialLayoutId(localStorage.getItem('selectedLayoutId'))
    );
    const selectedLayout = getLayoutById(selectedLayoutId) ?? getLayoutById(getInitialLayoutId(null));
    const isDarkMode = selectedLayout?.mode === 'dark';
    const activeTheme = getThemeByLayoutId(selectedLayout?.id ?? selectedLayoutId);
    const hideThemeSelector = getHideThemeSelector();
    const layoutOptions = getSelectableLayoutsByMode(isDarkMode ? 'dark' : 'light')
        .map((layout) => ({id: layout.id, name: layout.name}));

    const handleLayoutChange = (layoutId: string): void => {
        setSelectedLayoutId(layoutId);
        localStorage.setItem('selectedLayoutId', layoutId);
    };

    const toggleisDarkMode = (): void => {
        const targetMode = isDarkMode ? 'light' : 'dark';
        const nextLayoutId = resolveLayoutIdForModeSwitch(selectedLayoutId, targetMode);
        handleLayoutChange(nextLayoutId);
    };

    const [filename, setFilename] = useState<string>('README.md');
    const [githubUsername, setGithubUsername] = useState<string>('');
    const [selectedView, setSelectedView] = useState<View>('both');

    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        const defaultLanguage = getDefaultLanguage();
        return savedLanguage && translations[savedLanguage] ? savedLanguage : defaultLanguage;
    });

    const getInitialMarkdown = (lang: Language): string => {
        const data = translations[lang] as TranslationData;
        const initialExample = data?.examples?.[0]?.items?.[0];
        const text = initialExample?.["example-text"];
        return typeof text === 'string' ? text : '';
    };

    const [markdown, setMarkdown] = useState<string>(() => getInitialMarkdown(language));
    const [history, setHistory] = useState<string[]>(() => {
        const initial = getInitialMarkdown(language);
        return initial ? [initial] : [];
    });
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(() =>
        getInitialMarkdown(language) ? 0 : -1
    );
    const historyRef = useRef<string[]>(history);
    const currentHistoryIndexRef = useRef<number>(currentHistoryIndex);
    const [messageError, setMessageError] = useState<string | null>(null);

    const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('isFocusMode');
        return saved ? JSON.parse(saved) : false;
    });

    const toggleFocusMode = (): void => {
        setIsFocusMode(prev => {
            const next = !prev;
            localStorage.setItem('isFocusMode', JSON.stringify(next));
            if (next) {
                setSelectedView(bothView);
            }
            return next;
        });
    };

    const handleLanguageChange = (lang: Language): void => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const langData = translations[language] as TranslationData;
    const examples: ExampleCategory[] = langData?.examples || [];


    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    useEffect(() => {
        currentHistoryIndexRef.current = currentHistoryIndex;
    }, [currentHistoryIndex]);

    const addToHistory = (content: string): void => {
        const MAX_HISTORY_ITEMS = 250;
        const prevHistory = historyRef.current;
        const prevIndex = currentHistoryIndexRef.current;

        if (content === prevHistory[prevIndex]) {
            return;
        }

        const sliced = prevHistory.slice(0, prevIndex + 1);
        sliced.push(content);

        const trimmedHistory = sliced.length > MAX_HISTORY_ITEMS
            ? sliced.slice(sliced.length - MAX_HISTORY_ITEMS)
            : sliced;

        const nextIndex = trimmedHistory.length - 1;
        historyRef.current = trimmedHistory;
        currentHistoryIndexRef.current = nextIndex;
        setHistory(trimmedHistory);
        setCurrentHistoryIndex(nextIndex);
    };

    const handleChange = (value: string): void => {
        setMarkdown(value);
        addToHistory(value);
    };


    const handleUndo = (): void => {
        if (currentHistoryIndex > 0) {
            setCurrentHistoryIndex(currentHistoryIndex - 1);
            setMarkdown(history[currentHistoryIndex - 1]);
        }
    };

    const handleRedo = (): void => {
        if (currentHistoryIndex < history.length - 1) {
            setCurrentHistoryIndex(currentHistoryIndex + 1);
            setMarkdown(history[currentHistoryIndex + 1]);
        }
    };

    const handleClean = (): void => {
        setMarkdown('');
        addToHistory('');
    };

    const handleDownload = (): void => {
        const element = document.createElement('a');
        const file = new Blob([markdown], {type: 'text/markdown'});
        element.href = URL.createObjectURL(file);
        element.download = filename || 'document.md';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const waitForElementById = (elementId: string, timeoutMs = 1500): Promise<HTMLElement | null> => {
        return new Promise((resolve) => {
            const startedAt = Date.now();

            const check = (): void => {
                const foundElement = document.getElementById(elementId);
                if (foundElement) {
                    resolve(foundElement);
                    return;
                }

                if (Date.now() - startedAt >= timeoutMs) {
                    resolve(null);
                    return;
                }

                window.requestAnimationFrame(check);
            };

            check();
        });
    };

    const buildExportDocumentHtml = (
        previewEl: HTMLElement,
        safeTitle: string,
        options?: {autoPrint?: boolean; autoCloseAfterPrint?: boolean; forPdf?: boolean}
    ): string => {
        const clone = document.createElement('div');
        clone.className = 'pdf-export';
        clone.innerHTML = previewEl.innerHTML;
        clone.querySelectorAll(`style[${PREVIEW_STYLE_TAG_ATTR}]`).forEach((previewStyle) => previewStyle.remove());

        const previewScopedCss = getScopedMarkdownCss(undefined, `.pdf-export .${PREVIEW_SCOPE_CLASS}`);
        const shouldAutoPrint = options?.autoPrint === true;
        const shouldAutoCloseAfterPrint = options?.autoCloseAfterPrint === true;
        const isPdfMode = options?.forPdf === true;
        const documentTitle = safeTitle;
        const pageMargin = '12mm';
        const exportPadding = '0';
        const exportMaxWidth = isPdfMode ? '100%' : '190mm';

        return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${documentTitle}</title>
  <style>
    @page { size: A4; margin: ${pageMargin}; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .pdf-export {
      box-sizing: border-box;
      width: 100%;
      max-width: ${exportMaxWidth};
      margin: 0 auto;
      padding: ${exportPadding};
      background: #ffffff;
    }
    ${previewScopedCss}
    .pdf-export h1, .pdf-export h2, .pdf-export h3, .pdf-export h4, .pdf-export h5, .pdf-export h6 {
      page-break-after: avoid;
      break-after: avoid-page;
      page-break-inside: avoid;
      break-inside: avoid-page;
    }
    .pdf-export li, .pdf-export pre, .pdf-export blockquote, .pdf-export table, .pdf-export img {
      page-break-inside: avoid;
      break-inside: avoid-page;
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
  <script>
    (function () {
      var shouldAutoPrint = ${shouldAutoPrint ? 'true' : 'false'};
      document.title = ${JSON.stringify(safeTitle)};
      if (!shouldAutoPrint) return;
      var imgs = Array.prototype.slice.call(document.images || []);
      var waitForImages = imgs.map(function (img) {
        return new Promise(function (resolve) {
          if (img.complete) {
            resolve();
            return;
          }
          var done = function () {
            img.removeEventListener('load', done);
            img.removeEventListener('error', done);
            resolve();
          };
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          setTimeout(done, 5000);
        });
      });
      Promise.all(waitForImages).finally(function () {
        window.focus();
        window.print();
      });
      if (${shouldAutoCloseAfterPrint ? 'true' : 'false'}) {
        window.addEventListener('afterprint', function () {
          window.close();
        }, { once: true });
      }
    })();
  <\/script>
</body>
</html>`;
    };

    const generatePdfFromPreview = async (): Promise<void> => {
        if (!isFocusMode && selectedView === editorView) {
            setSelectedView(bothView);
        }

        const previewEl = await waitForElementById('preview-to-print');
        if (!previewEl) {
            return;
        }

        const safeTitle = (filename || 'document')
            .replace(/\.md$/i, '')
            .replace(/[\\/:*?"<>|]+/g, '')
            .trim() || 'document';

        const printTab = window.open('about:blank', '_blank');
        if (!printTab) return;
        const printableHtml = buildExportDocumentHtml(previewEl, safeTitle, {
            autoPrint: true,
            autoCloseAfterPrint: false,
            forPdf: true
        });
        printTab.document.open();
        printTab.document.write(printableHtml);
        printTab.document.close();
    };

    const exportPreviewToHtml = async (): Promise<void> => {
        const previewEl = await waitForElementById('preview-to-print');
        if (!previewEl) {
            return;
        }

        const safeTitle = (filename || 'document')
            .replace(/\.(md|html)$/i, '')
            .replace(/[\\/:*?"<>|]+/g, '')
            .trim() || 'document';

        const htmlContent = buildExportDocumentHtml(previewEl, safeTitle, {autoPrint: false, forPdf: false});
        const htmlBlob = new Blob([htmlContent], {type: 'text/html;charset=utf-8'});
        const htmlUrl = URL.createObjectURL(htmlBlob);

        const link = document.createElement('a');
        link.href = htmlUrl;
        link.download = `${safeTitle}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.setTimeout(() => URL.revokeObjectURL(htmlUrl), 1000);
    };

    const viewPreviewPdf = (): void => {
        void generatePdfFromPreview();
    };

    const fetchGithubMarkdown = async (): Promise<void> => {
        if (!githubUsername) {
            setMessageError(langData.textErrorGitHubUserRequired);
            setTimeout(() => setMessageError(null), 2000);
            return;
        }

        const url: string = `${API_GITHUB}${githubUsername}/${githubUsername}/${API_GITHUB_FINAL_MASTER}`;

        fetch(url)
            .then(readmeResponse => {
                if (!readmeResponse.ok) {
                    return Promise.reject(new Error('README not found or repository does not exist'));
                }
                return readmeResponse.text();
            })
            .then(readmeContent => {
                const sanitizedContent: string = DOMPurify.sanitize(readmeContent) as string;
                setMarkdown(sanitizedContent);
                addToHistory(sanitizedContent);
            })
            .catch(() => {
                setMessageError(langData.textErrorReadmeNotFound);
                setTimeout(() => setMessageError(null), 2000);
            });
    };


    const handleExampleSelect = (example: Example): void => {
        if (example["example-text"]) {
            const sanitizedContent = DOMPurify.sanitize(example["example-text"]);
            setMarkdown(sanitizedContent);
            addToHistory(sanitizedContent);
        } else if (example["example-file"]) {
            fetch(example["example-file"])
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error("Failed to load file");
                })
                .then(content => {
                    const sanitizedContent = DOMPurify.sanitize(content);
                    setMarkdown(sanitizedContent);
                    addToHistory(sanitizedContent);
                })
                .catch(error => {
                    console.error("Failed to load example file:", error);
                });
        }
    };


    const togglePreview = (): void => {
        setSelectedView(previewView);
    };

    const toggleBoth = (): void => {
        setSelectedView(bothView);
    };

    const toggleEditor = (): void => {
        setSelectedView(editorView);
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }

        if (!file) return;

        if (!file.name.endsWith('.md')) {
            setMessageError(langData.textSelectMarkdownFile);
            setTimeout(() => setMessageError(null), 2000);
            return;
        }

        setMarkdown('');
        addToHistory('');

        readFileContent(file)
            .then(content => {
                const sanitizedContent: string = DOMPurify.sanitize(content) as string;
                setMarkdown(sanitizedContent);
                addToHistory(sanitizedContent);
            });
           // .catch(error => {
             //   console.error('Error reading file:', error);
           // });
    };


    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    const {isGlobalUiAdvancedOptions, setGlobalUiAdvancedOptions} = useGlobalAdvancedOptions();


    return (
        <ThemeProvider theme={activeTheme}>
            <GlobalStyles/>
            <Container $isFocusMode={isFocusMode}>
                <Header
                    language={language}
                    onChangeLanguage={handleLanguageChange}
                    selectedLayoutId={selectedLayoutId}
                    onChangeLayout={handleLayoutChange}
                    layoutOptions={layoutOptions}
                    hideThemeSelector={hideThemeSelector}
                    isDarkMode={isDarkMode}
                    onToggleisDarkMode={toggleisDarkMode}
                    isFocusMode={isFocusMode}
                    onToggleFocusMode={toggleFocusMode}
                />
                <Content $isFocusMode={isFocusMode}>
                    {!isFocusMode && messageError != null && (
                        <ToolbarContainer>
                            <Section style={{border: 'none', boxShadow: 'none', background:'#ec5353'}}>
                                <span style={{color: 'white'}}>{messageError}</span>
                            </Section>
                        </ToolbarContainer>)}
                    {!isFocusMode && <ToolbarContainer>
                        {!isGlobalUiAdvancedOptions ? (
                            <>
                                <Section>
                                    <SectionTitle>{langData.textFileManagement}</SectionTitle>
                                    <InputGroup>
                                        <Input
                                            placeholder={langData.textFilenamePlaceholder}
                                            value={filename}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setFilename(e.target.value)
                                            }
                                        />
                                        <PrimaryButton onClick={handleDownload}>
                                            {langData.textDownload}
                                        </PrimaryButton>
                                    </InputGroup>
                                </Section>
                                <Section>
                                    <SectionTitle>{langData.textGitHubIntegration}</SectionTitle>
                                    <InputGroup>
                                        <Input
                                            placeholder={langData.textGitHubUsername}
                                            value={githubUsername}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setGithubUsername(e.target.value)
                                            }
                                        />
                                        <PrimaryButton onClick={fetchGithubMarkdown}>
                                            {langData.textFetchREADME}
                                        </PrimaryButton>
                                    </InputGroup>
                                </Section>
                                <Section>
                                    <SectionTitle>{langData.textEditorActions}</SectionTitle>
                                    <InputGroup>
                                        <SecondaryButton onClick={handleUndo} disabled={currentHistoryIndex <= 0}>
                                            {langData.textUndo}
                                        </SecondaryButton>
                                        <SecondaryButton onClick={handleRedo}
                                                         disabled={currentHistoryIndex >= history.length - 1}>
                                            {langData.textRedo}
                                        </SecondaryButton>
                                        <SecondaryButton onClick={handleClean}>
                                            {langData.textClean}
                                        </SecondaryButton>
                                        <SecondaryButton onClick={() => inputFileRef.current?.click()}>
                                            {langData.textUpload}
                                        </SecondaryButton>
                                        <SecondaryButton
                                            onClick={viewPreviewPdf}
                                            disabled={!markdown || markdown.trim().length === 0}
                                        >
                                            {langData.textViewPDF}
                                        </SecondaryButton>
                                        <SecondaryButton
                                            onClick={() => void exportPreviewToHtml()}
                                            disabled={!markdown || markdown.trim().length === 0}
                                        >
                                            {langData.textExportHTML}
                                        </SecondaryButton>
                                        <Input
                                            type="file"
                                            accept=".md,text/markdown,text/x-markdown"
                                            style={{display: 'none'}}
                                            ref={inputFileRef}
                                            onChange={handleFileUpload}
                                        />
                                    </InputGroup>
                                </Section>
                            </>
                        ) : (
                            <>
                                <Section>
                                    <SectionTitle>{langData.textMessageCustomExampleList}</SectionTitle>
                                    <div style={{marginTop: '1rem'}}>
                                        <ExampleListCustom
                                            markdown={markdown}
                                            examples={examples}
                                            onSelect={handleExampleSelect}
                                            language={language}
                                        />
                                    </div>
                                </Section>
                                <Section>
                                    <SectionTitle>{langData.textMessageExampleList}</SectionTitle>
                                    <ExampleList
                                        language={language}
                                        examples={examples}
                                        onSelect={handleExampleSelect}
                                    />
                                    <div style={{marginTop: '1rem'}}>
                                        <RandomExampleSelector
                                            examples={examples}
                                            onSelect={handleExampleSelect}
                                            language={language}
                                        />
                                    </div>
                                </Section>
                            </>
                        )}
                    </ToolbarContainer>}
                    {!isFocusMode && <ToolbarContainer>
                        <Section>
                            <SectionTitle>{langData.textViewMode}</SectionTitle>
                            <SectionButtons>
                                <ButtonRendererView onClick={toggleBoth}>
                                    {langData.textBoth}
                                </ButtonRendererView>
                                <ButtonRendererView onClick={togglePreview}>
                                    {langData.textPreview}
                                </ButtonRendererView>
                                <ButtonRendererView onClick={toggleEditor}>
                                    {langData.textEditor}
                                </ButtonRendererView>
                                <ButtonRendererView
                                    onClick={() => setGlobalUiAdvancedOptions(!isGlobalUiAdvancedOptions)}
                                >
                                    {isGlobalUiAdvancedOptions ? langData.textNormalOptions
                                        : langData.textAdvancedOptions}
                                </ButtonRendererView>
                            </SectionButtons>
                        </Section>
                    </ToolbarContainer>}
                    <EditorPreviewContainer $isFocusMode={isFocusMode}>
                        {(isFocusMode || selectedView === 'editor' || selectedView === 'both') && (
                            <Editor
                                markdown={markdown}
                                onChange={handleChange}
                                isDarkMode={isDarkMode}
                                language={language}
                            />
                        )}

                        {(isFocusMode || selectedView === 'preview' || selectedView === 'both') && (
                            <Preview
                                markdown={markdown}
                                isDarkMode={isDarkMode}
                                containerId="preview-to-print"
                            />
                        )}
                    </EditorPreviewContainer>
                </Content>
            </Container>
            <SeparatorFooter>
                <Footer/>
            </SeparatorFooter>
        </ThemeProvider>
    );
};

export default Render;