import styled from 'styled-components';

export const Button = styled.button`
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

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

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 16px;
    }
`;


