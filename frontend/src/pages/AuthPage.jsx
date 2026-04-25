import { useState } from "react";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const endpoint = isLogin ? "login" : "register";

  const handleSubmit = async () => {
    const response = await fetch(
      `http://localhost:8080/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      }
    );

    const result = await response.text();
    setMessage(result);

    if (result === "Login successful") {
      localStorage.setItem("user", username);
      window.location.href = "/";
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "Login" : "Register"}</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p>{message}</p>

      <p
        style={{ cursor: "pointer", color: "#38bdf8" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "New user? Register"
          : "Already have account? Login"}
      </p>
    </div>
  );
}

export default AuthPage;