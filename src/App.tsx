import {Routes, Route} from 'react-router-dom';
import {Presentation} from "./components/presentation/Presentation.tsx";
import Render from "./Render.tsx";


export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Presentation/>}/>
            <Route path="/render" element={<Render/>}/>
        </Routes>
    );
};