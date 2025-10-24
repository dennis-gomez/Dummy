import { useState } from "react";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";

function AuthPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        user_email: "",
        user_password: ""
    });

    const [error, setError] = useState(null);

    const handle_submit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(user);
            localStorage.setItem("token", data.token);
            setError(null);
            navigate("/start_page");
        } catch (error) {
            setError(error.message);
        }
    }

    const handle_change = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div>
                <form onSubmit={handle_submit}>
                    <input
                        type="email"
                        name="user_email"
                        placeholder="Email"
                        value={user.user_email}
                        onChange={handle_change}
                    />
                    <input
                        type="password"
                        name="user_password"
                        placeholder="Password"
                        value={user.user_password}
                        onChange={handle_change}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Iniciar sesion</button>
                </form>
            </div>
        </>
    );
}
export default AuthPage;