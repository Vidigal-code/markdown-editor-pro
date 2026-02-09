import React, {useState, useRef} from 'react';
import {ThemeProvider} from 'styled-components';
import translations from './assets/lang/index.ts';
import Editor from './components/editor/Editor.tsx';
import Preview from './components/preview/Preview.tsx';
import Header from './components/header/Header.tsx';
import ExampleList from "./components/example/ExampleList.tsx";
import {lightTheme, darkTheme, GlobalStyles} from './type/themes.ts';
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

const Render: React.FC = () => {

    const [isDarkMode, setisDarkMode] = useState<boolean>(() => {
        const savedisDarkMode = localStorage.getItem('isDarkMode');
        return savedisDarkMode ? JSON.parse(savedisDarkMode) : false;
    });


    const toggleisDarkMode = (): void => {
        setisDarkMode((prev) => {
            const newisDarkMode = !prev;
            localStorage.setItem('isDarkMode', JSON.stringify(newisDarkMode));
            return newisDarkMode;
        });
    };

    const [filename, setFilename] = useState<string>('README.md');
    const [githubUsername, setGithubUsername] = useState<string>('');
    const [selectedView, setSelectedView] = useState<View>('both');

    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        return savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
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


    const addToHistory = (content: string): void => {
        if (content !== history[currentHistoryIndex]) {
            const newHistory = history.slice(0, currentHistoryIndex + 1);
            newHistory.push(content);
            setHistory(newHistory);
            setCurrentHistoryIndex(newHistory.length - 1);
        }
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

    const generatePdfFromPreview = async (mode: 'download' | 'open'): Promise<void> => {
        if (!isFocusMode && selectedView === editorView) {
            setSelectedView(bothView);
            window.setTimeout(() => {
                void generatePdfFromPreview(mode);
            }, 150);
            return;
        }

        const previewEl = document.getElementById('preview-to-print');
        if (!previewEl) return;

        const safeTitle = (filename || 'document')
            .replace(/\.md$/i, '')
            .replace(/[\\/:*?"<>|]+/g, '')
            .trim() || 'document';

        // Open the tab immediately to avoid popup blockers.
        // Keep it blank (no intermediate "Generating..." page) and navigate to the PDF when ready.
        const pdfTab = mode === 'open' ? window.open('about:blank', '_blank') : null;
        if (mode === 'open' && !pdfTab) return;

        // Create a "print-friendly" clone so the PDF includes the full content
        // (the on-screen preview is scrollable with fixed height).
        const clone = document.createElement('div');
        clone.className = 'pdf-export';
        clone.innerHTML = previewEl.innerHTML;
        clone.style.background = '#ffffff';
        clone.style.color = '#111111';
        clone.style.padding = '24px';
        clone.style.maxWidth = '900px';
        clone.style.margin = '0 auto';
        clone.style.boxSizing = 'border-box';
        document.body.appendChild(clone);

        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-pdf-export', 'true');
        styleEl.textContent = `
          .pdf-export { font-family: Arial, sans-serif; color: #111; }
          .pdf-export h1, .pdf-export h2, .pdf-export h3, .pdf-export h4, .pdf-export h5, .pdf-export h6 {
            margin: 18px 0 10px;
            line-height: 1.25;
            page-break-after: avoid;
          }
          .pdf-export p { margin: 10px 0; line-height: 1.6; }
          .pdf-export ul, .pdf-export ol { margin: 10px 0 10px 20px; }
          .pdf-export pre {
            background: #f6f8fa;
            padding: 12px;
            border-radius: 6px;
            overflow: visible;
            white-space: pre-wrap;
            word-break: break-word;
            page-break-inside: avoid;
          }
          .pdf-export code {
            background: #f6f8fa;
            padding: 0.2em 0.35em;
            border-radius: 4px;
          }
          .pdf-export blockquote {
            margin: 16px 0;
            padding: 0 1em;
            border-left: 4px solid #ddd;
            color: #444;
            page-break-inside: avoid;
          }
          .pdf-export table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
          .pdf-export th, .pdf-export td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
          .pdf-export img { max-width: 100%; height: auto; page-break-inside: avoid; }
          .pdf-export a { color: #0969da; text-decoration: none; }
        `;
        document.head.appendChild(styleEl);

        try {
            const mod = await import('html2pdf.js');
            const html2pdf = mod.default;

            const worker = html2pdf()
                .set({
                    margin: 10,
                    filename: `${safeTitle}.pdf`,
                    image: {type: 'jpeg', quality: 0.98},
                    html2canvas: {scale: 2, useCORS: true, backgroundColor: '#ffffff'},
                    jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
                    pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
                })
                .from(clone);

            if (mode === 'download') {
                await worker.save();
            } else {
                const pdf = await worker.toPdf().get('pdf');
                const blob = pdf.output('blob');
                const blobUrl = URL.createObjectURL(blob);
                if (pdfTab) {
                    // Use replace to avoid keeping about:blank in history.
                    pdfTab.location.replace(blobUrl);
                }
            }
        } catch (err) {
            if (pdfTab) pdfTab.close();
            // Keep console visibility for debugging
            console.error('PDF generation failed:', err);
        } finally {
            document.body.removeChild(clone);
            document.head.removeChild(styleEl);
        }
    };

    const exportPreviewToPdf = (): void => {
        void generatePdfFromPreview('download');
    };

    const viewPreviewPdf = (): void => {
        void generatePdfFromPreview('open');
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
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyles/>
            <Container $isFocusMode={isFocusMode}>
                <Header
                    language={language}
                    onChangeLanguage={handleLanguageChange}
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
                                            onClick={exportPreviewToPdf}
                                            disabled={!markdown || markdown.trim().length === 0}
                                        >
                                            {langData.textExportPDF}
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
                <Footer isDarkMode={isDarkMode}/>
            </SeparatorFooter>
        </ThemeProvider>
    );
};

export default Render;