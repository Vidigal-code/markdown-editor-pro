import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Category, CustomExample, ExampleListCustomProps, ThemeProps} from "../../type/Interface.ts";
import DOMPurify from 'dompurify';

const ExampleListContainer = styled.div<ThemeProps>`
    border: 1px solid ${(props) => props.theme.border};
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
    margin: 15px auto 8px auto;
    padding-bottom: 5px;
    border-bottom: 1px solid ${(props) => props.theme.secondary};
    font-size: 1.1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0 auto 20px auto;
    width: 90%;
`;

const ListItem = styled.li<ThemeProps>`
    padding: 8px 12px;
    margin: 4px auto;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    color: ${(props) => props.theme.text};
    display: flex;
    justify-content: space-between;
    align-items: center;

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

const Button = styled.button<ThemeProps>`
    background-color: ${(props) => props.theme.primary};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.8em;
    margin-left: 5px;
    text-align: center;

    &:hover {
        opacity: 0.9;
    }
`;

const DeleteButton = styled(Button)`
    background-color: #dc3545;
    padding: 2px 5px;
    font-size: 0.7em;
`;

const InputField = styled.input<ThemeProps>`
    padding: 2px;
    margin: 5px auto;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    width: 90%;
    display: block;
    text-align: center;
    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: none;
        box-shadow: 0 0 0 2px rgb(99, 168, 241);
    }
`;

const FormContainer = styled.div`
    margin: 15px auto;
    padding: 10px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    width: 90%;
    text-align: center;
`;

const FormTitle = styled.h4<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 0 0 10px 0;
    text-align: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
`;

const ErrorMessage = styled.div`
    color: red;
    margin: 10px 0;
`;


const ExampleListCustom: React.FC<ExampleListCustomProps> = ({examples: initialExamples, onSelect, markdown}) => {

    const [examples, setExamples] = useState<Category[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddItem, setShowAddItem] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState({title: '', code: ''});
    const [searchCategory, setSearchCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const saveToCache = (updatedExamples: Category[]) => {
        localStorage.setItem('customExamples', JSON.stringify(updatedExamples));
        setExamples(updatedExamples);
    };

    const AllCacheExample = () => {
        localStorage.removeItem('customExamples');
        setExamples(initialExamples || []);
    };

    const Clear = () => {
        localStorage.removeItem('customExamples');
        setExamples([]);
    };

    const handleSelect = (item: CustomExample) => {
        const exampleToLoad = {
            ...item,
            "example-file": item["example-file"] || item["example-text"]
        };
        onSelect(exampleToLoad);
    };

    const handleAddCategory = () => {
        const sanitizedCategory = DOMPurify.sanitize(newCategory.trim());
        if (!sanitizedCategory) return;

        const newCategoryObj: Category = {
            id: examples.length > 0 ? Math.max(...examples.map(c => c.id)) + 1 : 0,
            category: sanitizedCategory,
            items: []
        };

        const updatedExamples = [...examples, newCategoryObj];
        saveToCache(updatedExamples);
        setNewCategory('');
        setShowAddCategory(false);
    };

    const handleAddItem = (categoryId: number) => {
        const sanitizedTitle = DOMPurify.sanitize(newItem.title.trim());
        const sanitizedCode = DOMPurify.sanitize(newItem.code || markdown);

        if (!sanitizedTitle) return;

        const updatedExamples = examples.map(category => {
            if (category.id === categoryId) {
                const newItemObj: CustomExample = {
                    id: category.items.length > 0 ? Math.max(...category.items.map(i => i.id)) + 1 : 0,
                    title: sanitizedTitle,
                    "example-text": sanitizedCode,
                    "example-file": ""
                };
                return {
                    ...category,
                    items: [...category.items, newItemObj]
                };
            }
            return category;
        });

        saveToCache(updatedExamples);
        setNewItem({title: '', code: ''});
        setShowAddItem(null);
    };

    const handleDeleteCategory = (categoryId: number) => {
        const updatedExamples = examples.filter(category => category.id !== categoryId);
        saveToCache(updatedExamples);
    };

    const handleDeleteItem = (categoryId: number, itemId: number) => {
        const updatedExamples = examples.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    items: category.items.filter(item => item.id !== itemId)
                };
            }
            return category;
        });

        saveToCache(updatedExamples);
    };

    useEffect(() => {
        const cachedExamples = localStorage.getItem('customExamples');
        if (cachedExamples) {
            setExamples(JSON.parse(cachedExamples));
        } else {
            setExamples(initialExamples || []);
        }
    }, [initialExamples]);

    const handleRandom = () => {
        const categoryName = searchCategory.trim();
        if (!categoryName) return;

        const foundCategory = examples.find(
            (cat) =>
                cat.category.toLowerCase() === categoryName.toLowerCase()
        );

        if (!foundCategory) {
            setErrorMessage('Category not found');
            return;
        }

        if (foundCategory.items.length === 0) {
            setErrorMessage('');
            return;
        }

        const randomItem =
            foundCategory.items[Math.floor(Math.random() * foundCategory.items.length)];
        onSelect(randomItem);
        setErrorMessage('');
    };


    return (
        <ExampleListContainer>
            <ButtonContainer>
                <Button onClick={() => setShowAddCategory(true)}>Add Category</Button>
                <Button onClick={AllCacheExample}>All Examples</Button>
                <Button onClick={Clear}>Clear</Button>
            </ButtonContainer>

            {showAddCategory && (
                <FormContainer>
                    <FormTitle>Add New Category</FormTitle>
                    <InputField
                        type="text"
                        placeholder="Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <ButtonContainer>
                        <Button onClick={handleAddCategory}>Save</Button>
                        <Button onClick={() => setShowAddCategory(false)}>Cancel</Button>
                    </ButtonContainer>
                </FormContainer>
            )}

            {examples.map((category) => (
                <div key={`category-${category.id}`}>
                    <CategoryTitle>
                        {category.category}
                        <div>
                            <Button onClick={() => setShowAddItem(category.id)}>Add Item</Button>
                            <DeleteButton onClick={() => handleDeleteCategory(category.id)}>×</DeleteButton>
                        </div>
                    </CategoryTitle>

                    {showAddItem === category.id && (
                        <FormContainer>
                            <FormTitle>Add New Item</FormTitle>
                            <InputField
                                type="text"
                                placeholder="Item Title"
                                value={newItem.title}
                                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            />
                            <ButtonContainer>
                                <Button onClick={() => handleAddItem(category.id)}>
                                    Save Current Editor Content
                                </Button>
                                <Button onClick={() => setShowAddItem(null)}>Cancel</Button>
                            </ButtonContainer>
                        </FormContainer>
                    )}

                    <List>
                        {category.items.map((item: CustomExample) => (
                            <SubListItem
                                key={`example-${item.id}`}
                                onClick={() => handleSelect(item)}
                            >
                                <span>{item.title}</span>
                                <DeleteButton onClick={() => handleDeleteItem(category.id, item.id)}>×</DeleteButton>
                            </SubListItem>
                        ))}
                    </List>
                </div>
            ))}
            <FormContainer>
                <InputField
                    type="text"
                    placeholder="Enter category name"
                    value={searchCategory}
                    onChange={(e) => {
                        setSearchCategory(e.target.value);
                        setErrorMessage('');
                    }}
                />
                <Button onClick={handleRandom}>Random</Button>
            </FormContainer>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </ExampleListContainer>
    );
};

export default ExampleListCustom;