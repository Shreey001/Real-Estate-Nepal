import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [error, setError] = useState(null);
  const { updateUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      // On successful login, update user in context
      if (res.data && res.data.user) {
        // Store token in localStorage if provided in response body
        if (res.data.token) {
          localStorage.setItem("authToken", res.data.token);
        }

        updateUser(res.data.user);
        navigate("/");
      } else {
        setError({ message: "Invalid response from server" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data || { message: "Login failed. Please try again." }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            required
            minLength={8}
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && <span className="error">{error.message}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
