import React, {useState} from 'react';
import styled from 'styled-components';
import {Example, RandomExampleSelectorProps, ThemeProps} from "../../type/Interface.ts";

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
    background: ${(props) => props.theme.inputBackground || props.theme.background};
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
        background: ${(props) => props.theme.primaryDark || props.theme.primary};
        opacity: 0.9;
    }

    &:disabled {
        background: ${(props) => props.theme.disabled || '#ccc'};
        cursor: not-allowed;
    }
`;

const Message = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isError'
})<ThemeProps & { isError?: boolean }>`
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
    background: ${({isError, theme}) => isError ? theme.error || '#ffebee' : theme.success || '#e8f5e9'};
    color: ${({isError, theme}) => isError ? theme.errorText || '#c62828' : theme.successText || '#2e7d32'};
    display: ${({children}) => children ? 'block' : 'none'};
`;

const SelectedExample = styled.div<ThemeProps>`
    margin-top: 15px;
    padding: 12px;
    border: 1px dashed ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) => props.theme.backgroundLight || props.theme.background};
`;

const Title = styled.h4<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 0 0 10px 0;
`;


const RandomExampleSelector: React.FC<RandomExampleSelectorProps> = ({examples, onSelect}) => {

    const [categoryInput, setCategoryInput] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedExample, setSelectedExample] = useState<Example | null>(null);

    const handleRandomSelect = () => {
        if (!examples || !Array.isArray(examples)) {
            setMessage('No examples available');
            setIsError(true);
            return;
        }

        const searchTerm = categoryInput.trim().toLowerCase();
        const matchingCategories = examples.filter(
            category => category.category.toLowerCase().includes(searchTerm)
        );

        if (matchingCategories.length === 0) {
            setMessage(`Category not found: "${categoryInput}"`);
            setIsError(true);
            setSelectedExample(null);
            return;
        }

        const randomCategoryIndex = Math.floor(Math.random() * matchingCategories.length);
        const selectedCategory = matchingCategories[randomCategoryIndex];

        if (selectedCategory.items.length === 0) {
            setMessage(`No examples in category: "${selectedCategory.category}"`);
            setIsError(true);
            setSelectedExample(null);
            return;
        }

        const randomExampleIndex = Math.floor(Math.random() * selectedCategory.items.length);
        const randomExample = selectedCategory.items[randomExampleIndex];

        setSelectedExample(randomExample);

        const exampleToLoad = {
            ...randomExample,
            "example-file": randomExample["example-file"] || randomExample["example-text"]
        };

        onSelect(exampleToLoad);

        setMessage(`Random example selected from "${selectedCategory.category}"`);
        setIsError(false);
    };

    return (
        <SelectorContainer>
            <InputGroup>
                <Input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                />
            </InputGroup>
            <Button
                onClick={handleRandomSelect}
                disabled={!examples || examples.length === 0}
            >
                Random
            </Button>

            {message && (
                <Message isError={isError}>
                    {message}
                </Message>
            )}


            {selectedExample && (
                <SelectedExample>
                    <Title>Selected: {selectedExample.title}</Title>
                    <div>Category: {examples.find(cat =>
                        cat.items.some(item => item.id === selectedExample.id)
                    )?.category}</div>
                    <div>ID: {selectedExample.id}</div>
                </SelectedExample>
            )}
        </SelectorContainer>
    );
};

export default RandomExampleSelector;