import styled from 'styled-components';


export const Container = styled.div<{ $isFocusMode?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${({$isFocusMode}) => ($isFocusMode ? 'stretch' : 'center')};
    justify-content: ${({$isFocusMode}) => ($isFocusMode ? 'flex-start' : 'center')};
    width: 100%;
    max-width: 100%;
    padding: 20px;
    font-family: Arial, sans-serif;
    min-height: 100vh;
    box-sizing: border-box;
`;

export const SeparatorFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-family: Arial, sans-serif;
    min-height: 1vh;
    box-sizing: border-box;
`;

export const Content = styled.div<{ $isFocusMode?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-self: stretch;
    width: 100%;
    max-width: ${({$isFocusMode}) => ($isFocusMode ? '100%' : '1200px')};
    margin: 88px auto 20px auto;
    gap: 20px;

    @media (max-width: 1200px) {
        margin-top: 20px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

export const EditorPreviewContainer = styled.div<{ $isFocusMode?: boolean }>`
    display: flex;
    flex: 1;
    width: 100%;
    gap: 20px;
    justify-content: ${({$isFocusMode}) => ($isFocusMode ? 'space-between' : 'center')};
    align-items: stretch;
    align-self: stretch;
    min-width: 0;
    flex-wrap: nowrap;

    @media (max-width: 1024px) {
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }
`;

const mediaQueries = {
    phone: "(max-width: 640px)",
    tablet: "(max-width: 1024px)",
    fold: "(max-width: 360px) and (max-height: 640px)",
    landscape: "(orientation: landscape) and (max-height: 640px)",
};


export const ToolbarContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    align-items: center;
    width: 100%;

    @media ${mediaQueries.tablet} {
        gap: 12px;
    }

    @media ${mediaQueries.fold} {
        gap: 6px;
        flex-direction: column;
    }
`;

export const Section = styled.div`
    flex: 1 1 300px;
    min-width: 280px;
    background: ${({theme}) => theme.background};
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({theme}) => theme.border};
    text-align: center;
    transition: transform 0.2s;

    @media ${mediaQueries.tablet} {
        min-width: 240px;
        padding: 16px;
    }

    @media ${mediaQueries.phone} {
        flex: 1 1 100%;
        min-width: 0;
        padding: 12px;
        border-radius: 8px;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;

export const SectionTitle = styled.h3`
    font-size: 16px;
    color: ${({theme}) => theme.text};
    margin-bottom: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media ${mediaQueries.tablet} {
        font-size: 14px;
        margin-bottom: 12px;
    }

    @media ${mediaQueries.phone} {
        font-size: 13px;
        margin-bottom: 8px;
    }

    @media ${mediaQueries.fold} {
        font-size: 12px;
    }
`;

export const InputGroup = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    @media ${mediaQueries.tablet} {
        gap: 12px;
    }

    @media ${mediaQueries.phone} {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    @media ${mediaQueries.fold} {
        gap: 6px;
    }
`;

export const Input = styled.input`
    flex: 1;
    padding: 14px;
    border: 2px solid ${({theme}) => theme.border};
    border-radius: 6px;
    font-size: 14px;
    transition: border 0.2s;
    max-width: 300px;
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};

    @media ${mediaQueries.tablet} {
        max-width: 250px;
        font-size: 14px;
    }

    @media ${mediaQueries.phone} {
        max-width: 100%;
        padding: 12px;
        font-size: 13px;
    }

    @media ${mediaQueries.fold} {
        padding: 10px;
        font-size: 12px;
    }

    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: none;
        box-shadow: 0 0 0 2px rgb(99, 168, 241);
    }
`;

export const PrimaryButton = styled.button`
    padding: 14px 24px;
    background: ${({theme}) => theme.primary};
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
    white-space: nowrap;
    width: 100%;
    min-height: 48px;

    @media ${mediaQueries.tablet} {
        padding: 12px 20px;
        font-size: 14px;
        min-height: 44px;
    }

    @media ${mediaQueries.phone} {
        padding: 10px 16px;
        font-size: 13px;
        min-height: 40px;
    }

    @media ${mediaQueries.fold} {
        padding: 8px 12px;
        font-size: 12px;
        min-height: 36px;
    }


    &:hover {
        background: #0238f7;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: ${({theme}) => theme.secondary};
    }

`;

export const SecondaryButton = styled(PrimaryButton)`
    background: ${({theme}) => theme.secondary};
    color: ${({theme}) => theme.codeText};

    &:hover {
        color: black;
        background: #cbd5e1;
    }
`;


export const ButtonRendererView = styled(PrimaryButton)`
    flex: 1 1 calc(25% - 9px); 
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;

    @media ${mediaQueries.tablet} {
        flex: 1 1 calc(50% - 6px); 
        padding: 10px;
    }

    @media ${mediaQueries.phone} {
        flex: 1 1 100%; 
        padding: 10px;
        width: 100%;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;

export const SectionButtons = styled.div`
    flex: 1 1 300px;
    min-width: 280px;
    background: ${({theme}) => theme.background};
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    transition: transform 0.2s;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;

    @media ${mediaQueries.tablet} {
        min-width: 240px;
        padding: 16px;
    }

    @media ${mediaQueries.phone} {
        flex: 1 1 100%;
        min-width: 0;
        padding: 12px;
        border-radius: 8px;
        justify-content: center;
    }

    @media ${mediaQueries.fold} {
        padding: 8px;
        border-radius: 6px;
    }
`;