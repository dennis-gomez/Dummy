import React, { useState } from "react";
import { login } from "../../routes/userService";

function AuthPage() {
    const [user, setUser] = useState({ user_email: "", user_password: "" });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(user.user_email, user.user_password);
            localStorage.setItem("token", data.token);
            setError(null);
        } catch (error) {
            setError(error.message);
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
                        name="user_email"
                        placeholder="Email"
                        value={user.user_email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="user_password"
                        placeholder="Password"
                        value={user.user_password}
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