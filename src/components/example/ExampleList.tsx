import React from 'react';
import styled from 'styled-components';
import {Example, ExampleListProps, ThemeProps, TranslationData} from "../../type/Interface.ts";
import DOMPurify from 'dompurify';
import translations from "../../assets/translations.json";

const ExampleListContainer = styled.div<ThemeProps>`
    border-radius: 4px;
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
    background: ${(props) => props.theme.background};
    text-align: center;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.scrollbarThumb} ${(props) => props.theme.scrollbarTrack}; /* para Firefox */

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background-color: ${(props) => props.theme.scrollbarTrack};
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.scrollbarThumb};
    }
`;

const CategoryTitle = styled.h3<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 15px 0 8px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid ${(props) => props.theme.secondary};
    font-size: 1.1em;
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0 0 20px 0;
`;

const ListItem = styled.li<ThemeProps>`
    padding: 8px 12px;
    margin: 4px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    color: ${(props) => props.theme.text};

    &:hover {
        background-color: ${(props) => props.theme.secondary};
        transform: translateX(5px);
    }
`;

const SubListItem = styled(ListItem)`
    padding-left: 20px;
    font-size: 0.9em;

    &:hover {
        transform: translateX(3px);
    }
`;


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