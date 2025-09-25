import { useState } from "react";
import { registerUser } from "../services/api";

type RegisterProps = {
    onShowLogin: () => void;
};

export default function Register({onShowLogin}: RegisterProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async ( e : React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const data = await registerUser(username, email, password);
        if (!data){
            setError("Registration failed");
            return;
        }
        if (data) {
            setSuccess("Registration successful! You can now log in.");
        }
    };

    return (
        <div style = {{ padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
            <h2>Register</h2>
            <form onSubmit = {handleRegister} >
                <input
                    type = "text"
                    placeholder = "Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br /><br />
                <input
                    type = "email" 
                    placeholder = "Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input 
                    type = "password"
                    placeholder = "Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type = "submit">Register</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <p>
                Already have an account?{' '}
                <button onClick={onShowLogin}>Login here</button>
            </p>
        </div>
    );
}
