import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Checkbox, FormControlLabel, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        inStock: true,
        imageUrl: "",
    });

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setForm({
                    name: res.data.name || "",
                    description: res.data.description || "",
                    price: res.data.price || "",
                    category: res.data.category?.name || res.data.category || "",
                    inStock: res.data.inStock ?? true,
                    imageUrl: res.data.imageUrl || "",
                });
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    setError("Product not found");
                }
            } 
        };

        fetchProduct();
    }, [id, token, navigate]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await axios.get(`${BASE_URL}/products/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
        };
        fetchCategory();
    }, [token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.patch(`${BASE_URL}/products/edit/${id}`, { ...form, price: Number(form.price) }, { headers: { Authorization: `Bearer ${token}` } });

            alert("Product updated successfully");
            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update product");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`${BASE_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Product deleted");
            navigate("/products");
        } catch (err) {
            setError("Failed to delete product");
        }
    };


    return (
        <Box sx={{ maxWidth: 500, margin: "2rem auto", p: 2 }}>
            <Typography variant="h4" mb={2}>
                Edit Product
            </Typography>

            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField fullWidth name="name" label="Name" value={form.name} onChange={handleChange} required margin="normal" />

                <TextField fullWidth name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={3} margin="normal" />

                <TextField fullWidth type="number" name="price" label="Price" value={form.price} onChange={handleChange} inputProps={{ min: 0, step: 0.01 }} margin="normal" />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select name="category" value={form.category} onChange={handleChange}>
                        <MenuItem value="">
                            <em>Select Category</em>
                        </MenuItem>
                        {categories.map((c) => (
                            <MenuItem key={c} value={c}>
                                {c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel control={<Checkbox name="inStock" checked={form.inStock} onChange={handleChange} />} label="In Stock" />

                <TextField fullWidth name="imageUrl" label="Image URL" value={form.imageUrl} onChange={handleChange} margin="normal" />

                <Box mt={2}>
                    <Button type="submit" variant="contained">
                        Update Product
                    </Button>
                    <Button type="button" variant="outlined" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                        Delete
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
