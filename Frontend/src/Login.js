import React, { useState } from "react";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.role) {
      if (remember) {
        localStorage.setItem("user", JSON.stringify(data));
      }
      setUser(data);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>EFZO TASK MANAGER</h1>
        <h2>Login</h2>

        {/* Username */}
        <div className="input-group">
          <i className="fa fa-user"></i>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Remember / Forgot */}
        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />{" "}
            Remember me
          </label>

          <span className="forgot">Forgot password?</span>
        </div>
        

        <button className="login-button" onClick={login}>
          Login
        </button>
        <h4>Don't have an account ? <a href="/register">Sign Up</a></h4>
      </div>
    </div>
  );
}

export default Login;
