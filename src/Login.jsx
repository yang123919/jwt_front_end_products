import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        axios
            .post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log(response.data);
                console.log(response.status);
                localStorage.setItem("token", response.data.token);
                navigate("/products");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
