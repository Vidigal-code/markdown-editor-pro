import React from 'react';
import {Example, ExampleListProps, TranslationData} from "../../type/Interface.ts";
import DOMPurify from 'dompurify';
import translations from "../../assets/translations.json";
import {CategoryTitle, ExampleListContainer, List, SubListItem} from "./styleds/exampleList.styles.ts";


const ExampleList: React.FC<ExampleListProps> = ({examples, onSelect, language}) => {

    const langData = translations[language] as TranslationData;

    if (!examples || !Array.isArray(examples)) {
        return <ExampleListContainer>
            <div>{langData.textExamples.textNoexamplesAvailable}</div>
        </ExampleListContainer>;
    }

    const handleSelect = (item: Example) => {
        const sanitizedExampleToLoad = {
            ...item,
            "example-file": DOMPurify.sanitize(item["example-file"] || item["example-text"])
        };

        onSelect(sanitizedExampleToLoad);
    };

    return (
        <ExampleListContainer>
            {examples.map((category) => (
                <div key={`category-${category.id}`}>
                    <CategoryTitle>{category.category}</CategoryTitle>
                    <List>
                        {category.items.map((item) => (
                            <SubListItem
                                key={`example-${item.id}`}
                                onClick={() => handleSelect(item)}
                            >
                                {item.title}
                            </SubListItem>
                        ))}
                    </List>
                </div>
            ))}
        </ExampleListContainer>
    );
};

export default ExampleList;