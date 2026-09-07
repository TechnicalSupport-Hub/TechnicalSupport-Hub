import React from "react";
import { Button, Input } from "../components";

export default function Login() {
  return (
    <form className="space-y-4">
      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder=""
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />

      <Button type="button" fullWidth>
        Sign In
      </Button>
    </form>
  );
}