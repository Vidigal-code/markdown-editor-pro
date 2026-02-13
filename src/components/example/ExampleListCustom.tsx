import React, {useState} from 'react';
import {Category, CustomExample, ExampleListCustomProps, TranslationData} from "../../type/Interface.ts";
import DOMPurify from 'dompurify';
import translations from "../../assets/lang/index.ts";
import {
    Button,
    ButtonContainer,
    CategoryTitle,
    DeleteButton,
    ErrorMessage,
    ExampleListContainer,
    FormContainer,
    FormTitle,
    InputField,
    List,
    SubListItem
} from "./styleds/exampleListCustom.styles.ts";

const ExampleListCustom: React.FC<ExampleListCustomProps> = ({
                                                                 examples: initialExamples,
                                                                 onSelect,
                                                                 markdown,
                                                                 language
                                                             }) => {

    const [examples, setExamples] = useState<Category[]>(() => {
        const cachedExamples = localStorage.getItem('customExamples');
        if (cachedExamples) {
            try {
                return JSON.parse(cachedExamples) as Category[];
            } catch {
                return initialExamples || [];
            }
        }
        return initialExamples || [];
    });
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddItem, setShowAddItem] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState({title: '', code: ''});
    const [searchCategory, setSearchCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const langData = translations[language] as TranslationData;

    const saveToCache = (updatedExamples: Category[]) => {
        localStorage.setItem('customExamples', JSON.stringify(updatedExamples));
        setExamples(updatedExamples);
    };

    const AllCacheExample = () => {
        localStorage.removeItem('customExamples');
        setExamples(initialExamples || []);
    };

    const Clean = () => {
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

    const handleRandom = () => {
        const categoryName = searchCategory.trim();
        if (!categoryName) return;

        const foundCategory = examples.find(
            (cat) =>
                cat.category.toLowerCase() === categoryName.toLowerCase()
        );

        if (!foundCategory) {
            setErrorMessage(langData?.textExamples.textCategoryNotFound);
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

    const [isEdit, setEdit] = React.useState(false);


    return (
        <ExampleListContainer>

            <ButtonContainer style={{marginBottom: '35px'}}>
                <Button
                    onClick={() => setEdit(!isEdit)}>{isEdit ? langData.textExamples.textSaveEdit : langData.textExamples.textEdit}</Button>


                {isEdit ? (<>
                    <Button onClick={() => setShowAddCategory(true)}>{langData?.textExamples.textAddCategory}</Button>
                </>) : (
                    <>
                        <Button onClick={AllCacheExample}>{langData?.textExamples.textAllExamples}</Button>
                        <Button onClick={Clean}>{langData?.textExamples.textClean}</Button>
                    </>
                )}
            </ButtonContainer>

            {showAddCategory && (
                <FormContainer>
                    <FormTitle>{langData?.textExamples.textAddNewCategory}</FormTitle>
                    <InputField
                        type="text"
                        placeholder={langData?.textExamples.textCategoryName}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    {isEdit && (<ButtonContainer>
                        <Button onClick={handleAddCategory}>{langData?.textExamples.textSave}</Button>
                        <Button onClick={() => setShowAddCategory(false)}>{langData?.textExamples.textCancel}</Button>
                    </ButtonContainer>)}
                </FormContainer>
            )}

            {examples.map((category) => (
                <div key={`category-${category.id}`}>
                    <CategoryTitle>
                        {category.category}
                        <div>
                            {isEdit && (<>  <Button
                                onClick={() => setShowAddItem(category.id)}>{langData?.textExamples.textAddItem}</Button>
                                <DeleteButton onClick={() => handleDeleteCategory(category.id)}>×</DeleteButton></>)}
                        </div>
                    </CategoryTitle>

                    {showAddItem === category.id && (
                        <FormContainer>
                            <FormTitle>{langData?.textExamples.textAddNewItem}</FormTitle>
                            <InputField
                                type="text"
                                placeholder={langData?.textExamples.textItemTitle}
                                value={newItem.title}
                                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            />
                            <ButtonContainer>
                                <Button onClick={() => handleAddItem(category.id)}>
                                    {langData?.textExamples.textSaveCurrentEditorContent}
                                </Button>
                                <Button
                                    onClick={() => setShowAddItem(null)}>{langData?.textExamples.textCancel}</Button>
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
                                {isEdit && (<DeleteButton
                                    onClick={() => handleDeleteItem(category.id, item.id)}>×</DeleteButton>)}
                            </SubListItem>
                        ))}
                    </List>
                </div>
            ))}
            <FormContainer>
                <InputField
                    type="text"
                    placeholder={langData?.textExamples.textCategoryName}
                    value={searchCategory}
                    onChange={(e) => {
                        setSearchCategory(e.target.value);
                        setErrorMessage('');
                    }}
                />
                <Button onClick={handleRandom}>{langData?.textExamples.textRandom}</Button>
            </FormContainer>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </ExampleListContainer>
    );
};

export default ExampleListCustom;
