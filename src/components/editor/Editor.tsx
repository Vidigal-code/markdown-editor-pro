import {ChangeEvent} from 'react';
import {EditorProps, TranslationData} from "../../type/Interface.ts";
import translations from "../../assets/lang/index.ts";
import {EditorContainer} from "./styleds/editor.styles.ts";

export default function Editor({markdown, onChange, language}: EditorProps) {
    const langData = translations[language] as TranslationData;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <EditorContainer
            value={markdown}
            onChange={handleChange}
            placeholder={langData.textAreaPlaceholderEditor}
        />
    );
}