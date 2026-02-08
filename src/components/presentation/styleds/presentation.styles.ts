import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
`;

export const LargeImage = styled.img`
    width: 80%;
    max-width: 800px;
    height: auto;
    object-fit: contain;
    margin-bottom: 20px;
    border: solid 2.5px black;
`;

export const SmallIcon = styled.img`
    width: 100px;
    height: auto;
    margin-bottom: 20px;
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

export const Description = styled.p`
    font-size: 1rem;
    color: #666;
    margin-bottom: 30px;
    max-width: 600px;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

export const StyledLink = styled.a`
    color: #007bff;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease-in-out;

    &:hover {
        color: #0056b3;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;


