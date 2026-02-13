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

export const CategoryTitle = styled.h3<ThemeProps>`
    color: ${(props) => props.theme.text};
    margin: 15px 0 8px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid ${(props) => props.theme.secondary};
    font-size: 1.1em;
`;

export const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0 0 20px 0;
`;

export const ListItem = styled.li<ThemeProps>`
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

export const SubListItem = styled(ListItem)`
    padding-left: 20px;
    font-size: 0.9em;

    &:hover {
        transform: translateX(3px);
    }
`;


