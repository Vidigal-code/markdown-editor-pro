import React, { createContext, useContext, useEffect, useState } from 'react';

interface GlobalUIContextType {
    isGlobalUiAdvancedOptions: boolean;
    setGlobalUiAdvancedOptions: (value: boolean) => void;
}

const GlobalUIAdvancedOptions = createContext<GlobalUIContextType | undefined>(undefined);

const STORAGE_KEY = 'isGlobalUiAdvancedOptions';

export const GlobalUIProviderAdvancedOptions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isGlobalUiAdvancedOptions, setIsGlobalUiAdvancedOptions] = useState<boolean>(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        return storedValue !== null ? JSON.parse(storedValue) : false;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isGlobalUiAdvancedOptions));
    }, [isGlobalUiAdvancedOptions]);

    return (
        <GlobalUIAdvancedOptions.Provider
            value={{
                isGlobalUiAdvancedOptions,
                setGlobalUiAdvancedOptions: setIsGlobalUiAdvancedOptions
            }}
        >
            {children}
        </GlobalUIAdvancedOptions.Provider>
    );
};

export const useGlobalAdvancedOptions = (): GlobalUIContextType => {
    const context = useContext(GlobalUIAdvancedOptions);
    if (!context) {
        throw new Error('useGlobalUI must be used within a GlobalUIProvider');
    }
    return context;
};
