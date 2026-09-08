import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useApp } from "../context/useApp";

export default function SignupForm() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login("user", email || "user@autoticket.com");
    navigate("/faq");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <Input
        id="signup-name"
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder="jane@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        id="signup-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" fullWidth>
        Create Account
      </Button>
    </form>
  );
}