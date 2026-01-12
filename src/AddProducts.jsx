import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, TextField, TextareaAutosize, Button, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddProduct() {
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

        if (!form.name || Number(form.price) <= 0) {
            setError("Name and Price are required, and Price must be greater than 0");
            return;
        }

        try {
            await axios.post(`${BASE_URL}/products/new`, { ...form, price: Number(form.price) }, { headers: { Authorization: `Bearer ${token}` } });

            alert("Product created successfully!");
            navigate("/products");
        } catch (err) {
            console.log(err.response?.data);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setError(err.response?.data?.error || "Failed to create product");
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "2rem auto", p: 2 }}>
            <Typography variant="h4" mb={2}>
                Add New Product
            </Typography>

            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField fullWidth name="name" label="Name" value={form.name} onChange={handleChange} required margin="normal" />

                <TextField fullWidth name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={3} margin="normal" />

                <TextField fullWidth type="number" name="price" label="Price" value={form.price} onChange={handleChange} required inputProps={{ min: 0, step: 0.01 }} margin="normal" />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select name="category" value={form.category} onChange={handleChange} required>
                        <MenuItem value="">
                            <em>Select Category</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel control={<Checkbox name="inStock" checked={form.inStock} onChange={handleChange} />} label="In Stock" />

                <TextField fullWidth name="imageUrl" label="Image URL" value={form.imageUrl} onChange={handleChange} margin="normal" />

                <Box mt={2}>
                    <Button type="submit" variant="contained">
                        Create Product
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => navigate("/products")} sx={{ ml: 2 }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
