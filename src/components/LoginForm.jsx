import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post(
        "https://walletinterne-back.onrender.com/account/login",
        formData
      );
      const { username, role, pkey } = response.data; // Get username and role from the response

      // Save the user's name and role in sessionStorage or localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("pkey", pkey);

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "client") {
        router.push("/client");
      }
    } catch (error) {
      console.error(
        error.response ? error.response.data.message : error.message
      );
      alert(
        "Login failed: " +
          (error.response ? error.response.data.message : "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <br />
      <br />
      <button class="button" type="submit">
        Login
      </button>
    </form>
  );
}
