import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useApp } from "../context/useApp";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);

      if (res.error) {
        setError(res.error.message || "Invalid credentials. Please try again.");
        return;
      }

      // Navigate based on user's role from Supabase
      if (res.role === "admin" || email.toLowerCase().includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/faq");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <Input
        id="login-email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        required
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign In with Supabase
      </Button>
    </form>
  );
}