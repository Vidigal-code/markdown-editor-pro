import {ChangeEvent} from 'react';
import {EditorProps, TranslationData} from "../../type/Interface.ts";
import translations from "../../assets/lang/index.ts";
import {EditorContainer} from "./styleds/editor.styles.ts";

export default function Editor({markdown, onChange, customCss, onChangeCss, activeTab, language}: EditorProps) {
    const langData = translations[language] as TranslationData;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleCssChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChangeCss(e.target.value);
    };

    return (
        activeTab === 'markdown' ? (
            <EditorContainer
                value={markdown}
                onChange={handleChange}
                placeholder={langData.textAreaPlaceholderEditor}
            />
        ) : (
            <EditorContainer
                value={customCss}
                onChange={handleCssChange}
                placeholder={langData.textAreaPlaceholderCssEditor}
            />
        )
    );
}