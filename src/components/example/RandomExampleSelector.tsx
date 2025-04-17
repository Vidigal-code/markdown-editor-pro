import React, {useState} from 'react';
import styled from 'styled-components';
import {Example, RandomExampleSelectorProps, ThemeProps, TranslationData} from "../../type/Interface.ts";
import DOMPurify from "dompurify";
import translations from "../../assets/translations.json";

const SelectorContainer = styled.div<ThemeProps>`
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) => props.theme.background};
`;

const InputGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
`;

const Input = styled.input<ThemeProps>`
    flex: 1;
    padding: 8px 12px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};

    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: none;
        box-shadow: 0 0 0 2px rgb(99, 168, 241);
    }
`;

const Button = styled.button<ThemeProps>`
    padding: 8px 16px;
    background: ${(props) => props.theme.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: ${(props) =>  props.theme.primary};
        opacity: 0.9;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const Message = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isError'
})<ThemeProps & { isError?: boolean }>`
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
    background: ${({isError}) => isError ?  '#ffebee' : '#e8f5e9'};
    color: ${({isError}) => isError ?  '#c62828' :  '#2e7d32'};
    display: ${({children}) => children ? 'block' : 'none'};
`;

const SelectedExample = styled.div<ThemeProps>`
    margin-top: 15px;
    padding: 12px;
    border: 1px dashed ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) =>  props.theme.background};
`;

const Title = styled.h4<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 0 0 10px 0;
`;


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