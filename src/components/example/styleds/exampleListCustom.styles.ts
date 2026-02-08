import styled from 'styled-components';
import {ThemeProps} from "../../../type/Interface.ts";

export const ExampleListContainer = styled.div<ThemeProps>`
    border-radius: 4px;
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
    background: ${(props) => props.theme.background};
    text-align: center;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.scrollbarThumb} ${(props) => props.theme.scrollbarTrack};

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

export const CategoryTitle = styled.h3<ThemeProps>`
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

export const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0 auto 20px auto;
    width: 90%;
`;

export const ListItem = styled.li<ThemeProps>`
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

export const SubListItem = styled(ListItem)`
    padding-left: 20px;
    font-size: 0.9em;

    &:hover {
        transform: translateX(3px);
    }
`;

export const Button = styled.button<ThemeProps>`
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

export const DeleteButton = styled(Button)`
    background-color: #dc3545;
    padding: 2px 5px;
    font-size: 0.7em;
`;

export const InputField = styled.input<ThemeProps>`
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

export const FormContainer = styled.div`
    margin: 15px auto;
    padding: 10px;
    border-radius: 4px;
    width: 90%;
    text-align: center;
`;

export const FormTitle = styled.h4<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 0 0 10px 0;
    text-align: center;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
`;

export const ErrorMessage = styled.div`
    color: red;
    margin: 10px 0;
`;


