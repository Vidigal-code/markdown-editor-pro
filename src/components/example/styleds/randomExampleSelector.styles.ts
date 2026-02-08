import styled from 'styled-components';
import {ThemeProps} from "../../../type/Interface.ts";

export const SelectorContainer = styled.div<ThemeProps>`
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 4px;
    background: ${(props) => props.theme.background};
`;

export const InputGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
`;

export const Input = styled.input<ThemeProps>`
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

export const Button = styled.button<ThemeProps>`
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

export const Message = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isError'
})<ThemeProps & { isError?: boolean }>`
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
    background: ${({isError}) => isError ?  '#ffebee' : '#e8f5e9'};
    color: ${({isError}) => isError ?  '#c62828' :  '#2e7d32'};
    display: ${({children}) => children ? 'block' : 'none'};
`;

export const SelectedExample = styled.div<ThemeProps>`
    margin-top: 15px;
    padding: 12px;
    border: 1px dashed ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) =>  props.theme.background};
`;

export const Title = styled.h4<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 0 0 10px 0;
`;


