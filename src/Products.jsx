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

            if (!token || token.trim() === "") {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get("http://localhost:3000/product", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProducts(res.data);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    console.error("Error fetching products:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

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
            </div>

            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card sx={{ maxWidth: 345 }}>
                            {product.imageUrl && <CardMedia component="img" height="160" image={product.imageUrl} alt={product.name} />}

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
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
        // <div className="products-page">
        //     <div className="products-header">
        //         <h1>Products</h1>
        //         <button className="logout-btn" onClick={handleLogout}>
        //             Logout
        //         </button>
        //     </div>

        //     <div className="products-grid">
        //         {products.length === 0 ? (
        //             <p>No products found</p>
        //         ) : (
        //             products.map((product) => (
        //                 <div className="product-card" key={product._id}>
        //                     {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="product-image" />}

        //                     <h3>{product.name}</h3>
        //                     <p>{product.description}</p>

        //                     <p className="price">RM {Number(product.price).toFixed(2)}</p>

        //                     <p className="category">Category: {product.category?.name || product.category}</p>

        //                     <p className={`stock ${product.inStock ? "in-stock" : "out-stock"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</p>
        //                 </div>
        //             ))
        //         )}
        //     </div>
        // </div>
    );
}

export default Products;
