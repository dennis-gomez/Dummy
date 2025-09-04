import React, { useState } from "react";
import { login } from "../../routes/userService";

function AuthPage() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await login(user.email, user.password);
            localStorage.setItem("token", token);
            setError(null);
        } catch (error) {
            setError("Correo o contraseña incorrectos.");
        }
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Iniciar sesion</button>
                </form>
            </div>
        </>
    );
}

export default AuthPage;