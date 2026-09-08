import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useApp } from "../context/useApp";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp(email.trim(), password, name.trim(), role);

      if (res.error) {
        setError(res.error.message || "Failed to create Supabase account.");
        return;
      }

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/faq");
      }
    } catch (err) {
      setError(err.message || "An error occurred during account creation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Role Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Account Role
        </label>
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`w-1/2 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              role === "user"
                ? "bg-[#0084ff] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`w-1/2 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              role === "admin"
                ? "bg-[#0084ff] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Support Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

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
        label="Email Address"
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

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create {role === "admin" ? "Admin" : "Customer"} Account
      </Button>
    </form>
  );
}