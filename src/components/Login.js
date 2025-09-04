import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/login";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { username, password });
      localStorage.setItem("token", res.data.token);
      setError("");
      onLogin();
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form className="space-y-4 bg-white p-6 rounded shadow max-w-sm mx-auto mt-10" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
      <input
        className="border p-2 w-full rounded"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="bg-blue-500 text-white px-3 py-2 rounded w-full" type="submit">Login</button>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </form>
  );
};

export default Login;
