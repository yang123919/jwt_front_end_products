import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Products from "./Products.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
