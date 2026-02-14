
export type View = 'editor' | 'preview' | 'both';

export const editorView: View = 'editor';
export const previewView: View = 'preview';
export const bothView: View = 'both';

export type Language = 'en' | 'pt' | 'es'; // add lang here

export interface TranslationData {
    textMessageExampleList: string;
    textMessageCustomExampleList: string;
    textErrorGitHubUserRequired: string;
    textErrorReadmeNotFound: string;
    textSelectMarkdownFile: string;
    textAdvancedOptions: string;
    textNormalOptions: string;
    textOptions: string;
    textFocusMode: string;
    textShowTools: string;
    textAreaPlaceholderEditor: string;
    textAreaPlaceholderCssEditor: string;
    textMarkdownTab: string;
    textCssTab: string;
    textBack: string;
    textGitHubUsername: string;
    textFilenamePlaceholder: string;
    textFileManagement: string;
    textDownload: string;
    textGitHubIntegration: string;
    textFetchREADME: string;
    textEditorActions: string;
    textUndo: string;
    textRedo: string;
    textClean: string;
    textUpload: string;
    textExportPDF: string;
    textViewPDF: string;
    textExportHTML: string;
    textViewMode: string;
    textPreview: string;
    textBoth: string;
    textEditor: string;
    textExamples: TextExamples;
    examples: ExampleCategory[];
}

export interface TextExamples {
    textEdit: string;
    textSaveEdit: string;
    textSelected: string;
    textCategory: string;
    textSave: string;
    textCancel: string;
    textRandom: string;
    textCategoryName: string;
    textRandomExampleSelectedFrom: string;
    textNoexamplesInCategory : string;
    textNoexamplesAvailable: string;
    textCategoryNotFound: string;
    textAddNewCategory: string;
    textAddCategory: string;
    textAllExamples: string;
    textAddItem: string;
    textItemTitle: string;
    textAddNewItem: string;
    textSaveCurrentEditorContent: string;
    textClean: string;
}


export interface Example {
    id: number;
    title: string;
    "example-text": string;
    "example-file": string;
}

export interface ExampleCategory {
    id: number;
    category: string;
    items: Example[];
}

export interface ExampleListProps {
    language: Language;
    examples: ExampleCategory[];
    onSelect: (example: Example) => void;
}

export interface PreviewProps {
    markdown: string;
    isDarkMode?: boolean;
    containerId?: string;
    customCss?: string;
}

export type EditorTab = 'markdown' | 'css';

export interface EditorProps {
    language: Language;
    markdown: string;
    onChange: (value: string) => void;
    customCss: string;
    onChangeCss: (value: string) => void;
    activeTab: EditorTab;
    isDarkMode?: boolean;
}

export interface NavbarProps {
    language: Language;
    onChangeLanguage: (lang: Language) => void;
    selectedLayoutId: string;
    onChangeLayout: (layoutId: string) => void;
    layoutOptions: Array<{
        id: string;
        name: string;
    }>;
    hideThemeSelector: boolean;
    isDarkMode: boolean;
    onToggleisDarkMode: () => void;
    isFocusMode: boolean;
    onToggleFocusMode: () => void;
}

export interface ExampleListCustomProps extends ExampleListProps {
    markdown: string;
    language: Language;
}

export interface ThemeProps {
    theme: {
        border: string;
        secondary: string;
        text: string;
        background: string;
        primary: string;
    };
}

export interface CustomExample extends Example {
    id: number;
    title: string;
    "example-text": string;
    "example-file": string;
}

export interface Category {
    id: number;
    category: string;
    items: CustomExample[];
}

export interface RandomExampleSelectorProps {
    language: Language;
    examples: Array<{
        id: number;
        category: string;
        items: Example[];
    }>;
    onSelect: (example: Example) => void;
}