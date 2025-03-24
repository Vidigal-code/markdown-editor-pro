import React, {useState, useEffect, useRef} from 'react';
import translations from './assets/translations.json';
import Editor from './components/editor/Editor.tsx';
import Preview from './components/preview/Preview.tsx';
import Header from './components/header/Header.tsx';
import ExampleList from "./components/example/ExampleList.tsx";
import styled, {ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme, GlobalStyles} from './type/themes.ts';
import Footer from "./components/footer/Footer.tsx";
import {Example, ExampleCategory, TranslationData, Language, View} from "./type/Interface.ts";
import ExampleListCustom from "./components/example/ExampleListCustom.tsx";
import RandomExampleSelector from "./components/example/RandomExampleSelector.tsx";
import DOMPurify from 'dompurify';
import {API_GITHUB, API_GITHUB_FINAL_MASTER} from "./api/api.ts";

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

const ContainerFooter = styled.div`
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
    margin-top: 20px;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
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

const SidePanel = styled.div`
    width: 250px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
    }
`;


const mediaQueries = {
    phone: "(max-width: 640px)",
    tablet: "(max-width: 1024px)",
    fold: "(max-width: 360px) and (max-height: 640px)",
    landscape: "(orientation: landscape) and (max-height: 640px)",
};

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    max-width: 1280px;
    margin-top: 25px;
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};

    @media ${mediaQueries.tablet} {
        margin-top: 45px;
        gap: 16px;
        padding: 16px;
    }

    @media ${mediaQueries.phone} {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 12px;
    }

    @media ${mediaQueries.fold} {
        gap: 8px;
        padding: 8px;
    }

    @media ${mediaQueries.landscape} {
        flex-direction: row;
        justify-content: space-around;
    }
`;

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
    color: ${({theme}) => theme.text};

    &:hover {
        background: #cbd5e1;
    }
`;

const IconButton = styled(PrimaryButton)`
    padding: 12px;
    width: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media ${mediaQueries.phone} {
        padding: 10px;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;


const Render: React.FC = () => {

    const [language, setLanguage] = useState<Language>('en');
    const [markdown, setMarkdown] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [filename, setFilename] = useState<string>('README.md');
    const [githubUsername, setGithubUsername] = useState<string>('');
    const [selectedView, setSelectedView] = useState<View>('both');
    const [examples, setExamples] = useState<ExampleCategory[]>([]);


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

    const handleLanguageChange = (lang: Language): void => {
        setLanguage(lang);
        const langData = translations[lang] as TranslationData;
        const initialExample = langData?.examples[0]?.items[0];
        const initialMarkdown = initialExample?.["example-text"] || '';

        setMarkdown(initialMarkdown);
        addToHistory(initialMarkdown);
        setExamples(langData?.examples || []);
    };

    const toggleDarkMode = (): void => {
        setDarkMode((prev) => !prev);
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

    const handleClear = (): void => {
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
        if (!githubUsername) return;

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
            .catch(error => {
                alert(`Error: ${(error as Error).message}`);
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


    const toggleView = (): void => {
        if (selectedView === 'editor') {
            setSelectedView('preview');
        } else if (selectedView === 'preview') {
            setSelectedView('both');
        } else {
            setSelectedView('editor');
        }
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }

        if (!file) return;

        if (!file.name.endsWith('.md')) {
            alert('Please select a Markdown (.md) file.');
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
        const langData = translations[language] as TranslationData;
        const initialExample = langData?.examples[0]?.items[0];
        const initialMarkdown = initialExample?.["example-text"] || '';

        setMarkdown(initialMarkdown);
        addToHistory(initialMarkdown);
        setExamples(langData?.examples || []);

    }, [language]);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyles/>
            <Container>
                <Header
                    language={language}
                    onChangeLanguage={handleLanguageChange}
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                />
                <Content>
                    <Wrapper>
                        <ToolbarContainer>
                            <Section>
                                <SectionTitle>File Management</SectionTitle>
                                <InputGroup>
                                    <Input
                                        placeholder="Filename"
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                    />
                                    <PrimaryButton onClick={handleDownload}>Download</PrimaryButton>
                                </InputGroup>
                            </Section>

                            <Section>
                                <SectionTitle>GitHub Integration</SectionTitle>
                                <InputGroup>
                                    <Input
                                        placeholder="GitHub Username"
                                        value={githubUsername}
                                        onChange={(e) => setGithubUsername(e.target.value)}
                                    />
                                    <PrimaryButton onClick={fetchGithubMarkdown}>Fetch README</PrimaryButton>
                                </InputGroup>
                            </Section>

                            <Section>
                                <SectionTitle>Editor Actions</SectionTitle>
                                <InputGroup>
                                    <SecondaryButton onClick={handleUndo} disabled={currentHistoryIndex <= 0}>
                                        Undo
                                    </SecondaryButton>
                                    <SecondaryButton onClick={handleRedo}
                                                     disabled={currentHistoryIndex >= history.length - 1}>
                                        Redo
                                    </SecondaryButton>
                                    <SecondaryButton onClick={handleClear}>Clear</SecondaryButton>
                                    <SecondaryButton onClick={() => inputFileRef.current?.click()}>
                                        Upload
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

                            <Section>
                                <SectionTitle>View Mode</SectionTitle>
                                <IconButton onClick={toggleView}>
                                    {selectedView === 'editor' ? 'Preview'
                                        : selectedView === 'preview' ? 'Both'
                                            : 'Editor'}
                                </IconButton>
                            </Section>
                        </ToolbarContainer>
                    </Wrapper>
                    <SidePanel>
                        <ExampleList examples={examples} onSelect={handleExampleSelect}/>
                        <div style={{marginTop: '1rem'}}>
                            <RandomExampleSelector
                                examples={examples}
                                onSelect={handleExampleSelect}
                            />
                        </div>
                        <div style={{marginTop: '1rem'}}>
                            <ExampleListCustom markdown={markdown} examples={examples} onSelect={handleExampleSelect}/>
                        </div>
                    </SidePanel>

                    <EditorPreviewContainer>
                        {(selectedView === 'editor' || selectedView === 'both') && (
                            <Editor
                                markdown={markdown}
                                onChange={handleChange}
                                darkMode={darkMode}
                            />
                        )}

                        {(selectedView === 'preview' || selectedView === 'both') && (
                            <Preview
                                markdown={markdown}
                                darkMode={darkMode}
                            />
                        )}
                    </EditorPreviewContainer>
                </Content>
            </Container>
            <ContainerFooter>
                <Footer/>
            </ContainerFooter>
        </ThemeProvider>
    );
};

export default Render;