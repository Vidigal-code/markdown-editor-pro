
export type View = 'editor' | 'preview' | 'both';


export interface TranslationData {
    examples: ExampleCategory[];
}


export type Language = 'en' | 'pt' | 'es'; // add lang here

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
    examples: ExampleCategory[];
    onSelect: (example: Example) => void;
}

export interface PreviewProps {
    markdown: string;
    isDarkMode?: boolean;
}


export interface EditorProps {
    markdown: string;
    onChange: (value: string) => void;
    isDarkMode?: boolean;
}

export interface NavbarProps {
    language: 'en' | 'pt' | 'es';
    onChangeLanguage: (lang: Language) => void;
    isDarkMode: boolean;
    onToggleisDarkMode: () => void;
}

export interface ExampleListCustomProps extends ExampleListProps {
    markdown: string;
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
    examples: Array<{
        id: number;
        category: string;
        items: Example[];
    }>;
    onSelect: (example: Example) => void;
}