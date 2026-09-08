import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useApp } from "../context/useApp";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [role, setRole] = useState("user"); // 'user' | 'admin'
  const [email, setEmail] = useState("user@autoticket.com");
  const [password, setPassword] = useState("password123");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") {
      setEmail("admin@autoticket.com");
    } else {
      setEmail("user@autoticket.com");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Determine effective role: based on toggle or email hint
    const effectiveRole =
      role === "admin" || email.toLowerCase().includes("admin")
        ? "admin"
        : "user";

    login(effectiveRole, email);

    if (effectiveRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/faq");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Role Toggle Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Account Role
        </label>
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            className={`w-1/2 rounded-md py-1.5 text-xs font-medium transition-colors ${
              role === "user"
                ? "bg-[#0084ff] text-white shadow-sm ring-1 ring-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            User Portal
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`w-1/2 rounded-md py-1.5 text-xs font-medium transition-colors ${
              role === "admin"
                ? "bg-[#0084ff] text-white shadow-sm ring-1 ring-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Admin Portal
          </button>
        </div>
      </div>

      <Input
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
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

      <Button type="submit" fullWidth>
        Sign In as {role === "admin" ? "Admin" : "User"}
      </Button>
    </form>
  );
}