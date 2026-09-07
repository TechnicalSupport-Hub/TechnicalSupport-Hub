import React from "react";
import { Button, Input } from "../components";

export default function SignupForm() {
  return (
    <form className="space-y-4">
      <Input
        id="signup-name"
        label="Full Name"
        type="text"
        placeholder=""
      />

      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder=""
      />

      <Input
        id="signup-password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />

      <Input
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
      />

      <Button type="button" fullWidth>
        Create Account
      </Button>
    </form>
  );
}