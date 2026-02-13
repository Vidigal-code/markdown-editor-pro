import layoutsConfigData from './layoutsConfig.json';
import type {Language} from '../../type/Interface.ts';
import {darkTheme, lightTheme, type AppTheme} from '../../type/themes.ts';

type LayoutMode = 'light' | 'dark';

interface LayoutTemplate {
    id: string;
    mode: LayoutMode;
    colors: {
        background: string;
        primary: string;
        secondary: string;
        text: string;
        textSecondary: string;
        cardBackground: string;
        cardBorder: string;
    };
    components?: {
        header?: { backgroundColor?: string };
        footer?: { backgroundColor?: string };
    };
}

export interface LayoutConfigItem {
    id: string;
    name: string;
    author: string;
    file: string;
    preview: string;
    supportsLightAndDarkModes: boolean;
    supportsLightAndDarkModesReference?: string;
    mode: LayoutMode;
}

interface LayoutsConfig {
    HideThemeSelector: boolean;
    LangDefault: Language;
    ThemeDefault: string;
    layouts: LayoutConfigItem[];
}

const layoutsConfig = layoutsConfigData as LayoutsConfig;
const templateModules = import.meta.glob('./templates/*.json', {eager: true, import: 'default'}) as Record<string, LayoutTemplate>;

const templatesByFile = Object.entries(templateModules).reduce<Record<string, LayoutTemplate>>((acc, [path, template]) => {
    const fileName = path.split('/').pop();
    if (fileName) {
        acc[`templates/${fileName}`] = template;
    }
    return acc;
}, {});

const sanitizeReference = (reference: string | undefined): string | null => {
    if (!reference) return null;
    return reference.replace(/-(dark|light)$/i, '').toLowerCase();
};

const getLayoutReferenceKey = (layout: LayoutConfigItem): string => {
    const fromReference = sanitizeReference(layout.supportsLightAndDarkModesReference);
    if (fromReference) return fromReference;
    return sanitizeReference(layout.id) ?? layout.id.toLowerCase();
};

export const getHideThemeSelector = (): boolean => layoutsConfig.HideThemeSelector;

export const getDefaultLanguage = (): Language => layoutsConfig.LangDefault;

export const getAllLayouts = (): LayoutConfigItem[] => layoutsConfig.layouts;

export const getLayoutById = (layoutId: string): LayoutConfigItem | undefined =>
    layoutsConfig.layouts.find((layout) => layout.id === layoutId);

export const getDefaultLayout = (): LayoutConfigItem =>
    getLayoutById(layoutsConfig.ThemeDefault) ?? layoutsConfig.layouts[0];

export const getInitialLayoutId = (savedLayoutId: string | null): string => {
    if (savedLayoutId && getLayoutById(savedLayoutId)) {
        return savedLayoutId;
    }
    return getDefaultLayout().id;
};

export const getLayoutForModeByReference = (layoutId: string, targetMode: LayoutMode): LayoutConfigItem | undefined => {
    const currentLayout = getLayoutById(layoutId);
    if (!currentLayout) return undefined;

    const reference = getLayoutReferenceKey(currentLayout);
    return layoutsConfig.layouts.find((layout) => (
        getLayoutReferenceKey(layout) === reference && layout.mode === targetMode
    ));
};

export const getSelectableLayoutsByMode = (mode: LayoutMode): LayoutConfigItem[] => {
    const grouped = new Map<string, LayoutConfigItem[]>();

    layoutsConfig.layouts.forEach((layout) => {
        const key = getLayoutReferenceKey(layout);
        const current = grouped.get(key) ?? [];
        current.push(layout);
        grouped.set(key, current);
    });

    return Array.from(grouped.values()).map((group) => {
        const preferred = group.find((layout) => layout.mode === mode);
        return preferred ?? group[0];
    });
};

export const resolveLayoutIdForModeSwitch = (layoutId: string, targetMode: LayoutMode): string => {
    const pairedLayout = getLayoutForModeByReference(layoutId, targetMode);
    if (pairedLayout) return pairedLayout.id;

    const modeMatch = getSelectableLayoutsByMode(targetMode)[0];
    return modeMatch?.id ?? getDefaultLayout().id;
};

const fallbackThemeByMode: Record<LayoutMode, AppTheme> = {
    dark: darkTheme,
    light: lightTheme,
};

const mapTemplateToTheme = (template: LayoutTemplate): AppTheme => {
    const colors = template.colors;
    const headerBackground = template.components?.header?.backgroundColor ?? colors.background;
    const footerBackground = template.components?.footer?.backgroundColor ?? colors.background;

    return {
        codebackground: colors.cardBackground,
        prebackground: colors.cardBackground,
        backgroundfooter: footerBackground,
        backgroundheader: headerBackground,
        background: colors.background,
        text: colors.text,
        primary: colors.primary,
        secondary: colors.secondary,
        border: colors.cardBorder,
        scrollbar: colors.primary,
        scrollbarThumb: colors.cardBorder,
        scrollbarTrack: colors.background,
        blockquote: colors.textSecondary,
        codeBackground: colors.cardBackground,
        codeText: colors.text,
        linka: colors.primary,
    };
};

export const getThemeByLayoutId = (layoutId: string): AppTheme => {
    const layout = getLayoutById(layoutId) ?? getDefaultLayout();
    const template = templatesByFile[layout.file];

    if (!template) {
        return fallbackThemeByMode[layout.mode];
    }

    return mapTemplateToTheme(template);
};

