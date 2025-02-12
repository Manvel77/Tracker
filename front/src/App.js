import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Tracker from "./pages/Tracker";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App(props) {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/tracker" element={<Tracker />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;