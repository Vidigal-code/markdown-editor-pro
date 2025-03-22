import { HashRouter, Routes, Route } from 'react-router-dom';
import { Presentation } from "./components/presentation/Presentation.tsx";
import Render from "./Render.tsx";

export const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Presentation />} />
                <Route path="/render" element={<Render />} />
            </Routes>
        </HashRouter>
    );
};
