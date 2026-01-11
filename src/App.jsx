import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Products from "./Products.jsx";
import AddProduct from "./AddProducts.jsx";
import EditProduct from "./EditProducts.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
        </Routes>
    );
}

export default App;
