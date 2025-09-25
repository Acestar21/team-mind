import { useState } from "react";
import { loginUser } from "../services/api";

type LoginProps = {
  onLoginSuccess: () => void;
  onShowRegister: () => void;
}
export default function Login({onLoginSuccess, onShowRegister}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = await loginUser(email, password);
    if (!data) {
      setError("Login failed");
      return;
    }

    // Save JWT
    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    onLoginSuccess();
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account?{' '}
        <button onClick={onShowRegister} style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
          Register
        </button>
      </p>
    </div>
  );
}
