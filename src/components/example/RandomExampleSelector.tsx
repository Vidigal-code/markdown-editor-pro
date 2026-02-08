import React, {useState} from 'react';
import {Example, RandomExampleSelectorProps, TranslationData} from "../../type/Interface.ts";
import DOMPurify from "dompurify";
import translations from "../../assets/translations.json";
import {Button, Input, InputGroup, Message, SelectorContainer, SelectedExample, Title} from "./styleds/randomExampleSelector.styles.ts";

const RandomExampleSelector: React.FC<RandomExampleSelectorProps> = ({examples, onSelect, language}) => {

    const [categoryInput, setCategoryInput] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedExample, setSelectedExample] = useState<Example | null>(null);

    const langData = translations[language] as TranslationData;

    const handleRandomSelect = () => {
        if (!examples || !Array.isArray(examples)) {
            setMessage(langData?.textExamples.textNoexamplesAvailable);
            setIsError(true);
            return;
        }

        const sanitizedInput = DOMPurify.sanitize(categoryInput.trim().toLowerCase());

        const matchingCategories = examples.filter((category) =>
            category.category.toLowerCase().includes(sanitizedInput)
        );

        if (matchingCategories.length === 0) {
            setMessage(`${langData?.textExamples.textCategoryNotFound}: ${String(sanitizedInput)}`);
            setIsError(true);
            setSelectedExample(null);
            return;
        }

        const randomCategoryIndex = Math.floor(Math.random() * matchingCategories.length);
        const selectedCategory = matchingCategories[randomCategoryIndex];

        if (!selectedCategory.items || selectedCategory.items.length === 0) {
            setMessage(`${langData?.textExamples.textNoexamplesInCategory}: ${selectedCategory.category}`);
            setIsError(true);
            setSelectedExample(null);
            return;
        }

        const randomExampleIndex = Math.floor(Math.random() * selectedCategory.items.length);
        const randomExample = selectedCategory.items[randomExampleIndex];

        const sanitizedExampleToLoad = {
            ...randomExample,
            "example-file": DOMPurify.sanitize(randomExample["example-file"] || randomExample["example-text"]),
        };

        setSelectedExample(sanitizedExampleToLoad);
        onSelect(sanitizedExampleToLoad);

        setMessage(`${langData?.textExamples.textRandomExampleSelectedFrom} ${selectedCategory.category}`);
        setIsError(false);
    };

    return (
        <SelectorContainer>
            <InputGroup>
                <Input
                    type="text"
                    placeholder={langData?.textExamples.textCategoryName}
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                />
            </InputGroup>
            <Button
                onClick={handleRandomSelect}
                disabled={!examples || examples.length === 0}
            >
                {langData?.textExamples.textRandom}
            </Button>

            {message && (
                <Message isError={isError}>
                    {message}
                </Message>
            )}


            {selectedExample && (
                <SelectedExample>
                    <Title>{langData?.textExamples.textSelected} : {selectedExample.title}</Title>
                    <div>{langData?.textExamples.textCategory} : {examples.find(cat =>
                        cat.items.some(item => item.id === selectedExample.id)
                    )?.category}</div>
                    <div>ID: {selectedExample.id}</div>
                </SelectedExample>
            )}
        </SelectorContainer>
    );
};

export default RandomExampleSelector;