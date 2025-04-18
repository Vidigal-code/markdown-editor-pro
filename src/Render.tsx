import React, {useState, useEffect, useRef} from 'react';
import translations from './assets/translations.json';
import Editor from './components/editor/Editor.tsx';
import Preview from './components/preview/Preview.tsx';
import Header from './components/header/Header.tsx';
import ExampleList from "./components/example/ExampleList.tsx";
import styled, {ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme, GlobalStyles} from './type/themes.ts';
import Footer from "./components/footer/Footer.tsx";
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: Arial, sans-serif;
    min-height: 100vh;
    box-sizing: border-box;
`;

const SeparatorFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-family: Arial, sans-serif;
    min-height: 1vh;
    box-sizing: border-box;
`;

const Content = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin-top: 62px;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        margin-top: 80px;
        flex-direction: column;
    }
`;

const EditorPreviewContainer = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    gap: 20px;
    justify-content: center;
    align-items: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const mediaQueries = {
    phone: "(max-width: 640px)",
    tablet: "(max-width: 1024px)",
    fold: "(max-width: 360px) and (max-height: 640px)",
    landscape: "(orientation: landscape) and (max-height: 640px)",
};


const ToolbarContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    align-items: center;
    width: 100%;

    @media ${mediaQueries.tablet} {
        gap: 12px;
    }

    @media ${mediaQueries.fold} {
        gap: 6px;
        flex-direction: column;
    }
`;

const Section = styled.div`
    flex: 1 1 300px;
    min-width: 280px;
    background: ${({theme}) => theme.background};
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({theme}) => theme.border};
    text-align: center;
    transition: transform 0.2s;

    @media ${mediaQueries.tablet} {
        min-width: 240px;
        padding: 16px;
    }

    @media ${mediaQueries.phone} {
        flex: 1 1 100%;
        min-width: 0;
        padding: 12px;
        border-radius: 8px;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    color: ${({theme}) => theme.text};
    margin-bottom: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media ${mediaQueries.tablet} {
        font-size: 14px;
        margin-bottom: 12px;
    }

    @media ${mediaQueries.phone} {
        font-size: 13px;
        margin-bottom: 8px;
    }

    @media ${mediaQueries.fold} {
        font-size: 12px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    @media ${mediaQueries.tablet} {
        gap: 12px;
    }

    @media ${mediaQueries.phone} {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    @media ${mediaQueries.fold} {
        gap: 6px;
    }
`;

const Input = styled.input`
    flex: 1;
    padding: 14px;
    border: 2px solid ${({theme}) => theme.border};
    border-radius: 6px;
    font-size: 14px;
    transition: border 0.2s;
    max-width: 300px;
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};

    @media ${mediaQueries.tablet} {
        max-width: 250px;
        font-size: 14px;
    }

    @media ${mediaQueries.phone} {
        max-width: 100%;
        padding: 12px;
        font-size: 13px;
    }

    @media ${mediaQueries.fold} {
        padding: 10px;
        font-size: 12px;
    }

    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: none;
        box-shadow: 0 0 0 2px rgb(99, 168, 241);
    }
`;

const PrimaryButton = styled.button`
    padding: 14px 24px;
    background: ${({theme}) => theme.primary};
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
    white-space: nowrap;
    width: 100%;
    min-height: 48px;

    @media ${mediaQueries.tablet} {
        padding: 12px 20px;
        font-size: 14px;
        min-height: 44px;
    }

    @media ${mediaQueries.phone} {
        padding: 10px 16px;
        font-size: 13px;
        min-height: 40px;
    }

    @media ${mediaQueries.fold} {
        padding: 8px 12px;
        font-size: 12px;
        min-height: 36px;
    }


    &:hover {
        background: #0238f7;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: ${({theme}) => theme.secondary};
    }

`;

const SecondaryButton = styled(PrimaryButton)`
    background: ${({theme}) => theme.secondary};
    color: ${({theme}) => theme.codeText};

    &:hover {
        color: black;
        background: #cbd5e1;
    }
`;


const SectionButtons = styled.div`
    flex: 1 1 300px;
    min-width: 280px;
    background: ${({theme}) => theme.background};
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    transition: transform 0.2s;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;

    @media ${mediaQueries.tablet} {
        min-width: 240px;
        padding: 16px;
    }

    @media ${mediaQueries.phone} {
        flex: 1 1 100%;
        min-width: 0;
        padding: 12px;
        border-radius: 8px;
        justify-content: center;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;


const ButtonRendererView = styled(PrimaryButton)`
    padding: 12px;
    width: calc(33.33% - 8px);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media ${mediaQueries.phone} {
        padding: 10px;
        width: 100%;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;


const Render: React.FC = () => {

    const [markdown, setMarkdown] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
    const [messageError, setMessageError] = useState<string | null>(null);


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
    const [examples, setExamples] = useState<ExampleCategory[]>([]);


    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        return savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
    });

    const handleLanguageChange = (lang: Language): void => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const langData = translations[language] as TranslationData;


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
            })
            .catch(error => {
                console.error('Error reading file:', error);
            });
    };


    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    useEffect(() => {
        setExamples(langData?.examples || []);
    }, [langData.examples]);

    const {isGlobalUiAdvancedOptions} = useGlobalAdvancedOptions();


    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyles/>
            <Container>
                <Header
                    language={language}
                    onChangeLanguage={handleLanguageChange}
                    isDarkMode={isDarkMode}
                    onToggleisDarkMode={toggleisDarkMode}
                />
                <Content>
                    <ToolbarContainer>
                        {!isGlobalUiAdvancedOptions ? (
                            <>
                                <Section>
                                    <SectionTitle>{langData.textFileManagement}</SectionTitle>
                                    <InputGroup>
                                        <Input
                                            placeholder={langData.textFilenamePlaceholder}
                                            value={filename}
                                            onChange={(e) => setFilename(e.target.value)}
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
                                            onChange={(e) => setGithubUsername(e.target.value)}
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
                                <Section>
                                    <div style={{marginTop: '1rem'}}>
                                        <ExampleListCustom
                                            markdown={markdown}
                                            examples={examples}
                                            onSelect={handleExampleSelect}
                                            language={language}
                                        />
                                    </div>
                                </Section>
                            </>
                        )}
                    </ToolbarContainer>
                    {messageError != null && (
                        <ToolbarContainer>
                            <Section style={{border: 'none', backgroundColor: 'none'}}>
                                <span style={{color: 'red'}}>{messageError}</span>
                            </Section>
                        </ToolbarContainer>)}
                    <ToolbarContainer>
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
                            </SectionButtons>
                        </Section>
                    </ToolbarContainer>
                    <EditorPreviewContainer>
                        {(selectedView === 'editor' || selectedView === 'both') && (
                            <Editor
                                markdown={markdown}
                                onChange={handleChange}
                                isDarkMode={isDarkMode}
                                language={language}
                            />
                        )}

                        {(selectedView === 'preview' || selectedView === 'both') && (
                            <Preview
                                markdown={markdown}
                                isDarkMode={isDarkMode}
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