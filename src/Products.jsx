import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

const BASE_URL = import.meta.env.VITE_API_URL;

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(res.data);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    // ✅ NOW this is inside the component
    if (loading) {
        return <h2>Loading products...</h2>;
    }

    return (
        <>
            <div className="products-header">
                <h1>Products</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
                <button className="product-btn" onClick={() => navigate("/products/new")}>
                    Create Product
                </button>
            </div>

            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card sx={{ width: 345 }}>
                            {product.imageUrl && <CardMedia component="img" height="260" image={product.imageUrl} alt={product.name} />}

                            <CardContent>
                                <Typography gutterBottom variant="h6">
                                    {product.name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>

                                <Typography sx={{ mt: 1, fontWeight: "bold" }}>RM {Number(product.price).toFixed(2)}</Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Category: {product.category?.name || product.category}
                                </Typography>

                                <Chip label={product.inStock ? "In Stock" : "Out of Stock"} color={product.inStock ? "success" : "error"} size="small" sx={{ mt: 1 }} />
                            </CardContent>

                            <CardActions>
                                <Button size="small">Details</Button>
                                <Button size="small">Buy</Button>
                                <Button size="small" onClick={() => navigate(`/products/edit/${product._id}`)}>
                                    Edit
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Products;
