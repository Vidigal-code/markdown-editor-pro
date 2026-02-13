import React from 'react';
import {Button} from "./styleds/globalButton.styles.ts";

export const GlobalButton = ({onClick, children}: { onClick: () => void; children: React.ReactNode }) => {
    return <Button onClick={onClick}>{children}</Button>;
};