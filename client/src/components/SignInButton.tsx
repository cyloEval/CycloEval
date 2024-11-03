import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const SignInButton: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toggleSignIn } = useAuth();

  const handleSignIn = async () => {
    toggleSignIn();
    // TODO: Implement sign-in logic
    // try {
    //   const response = await fetch("/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     // Handle successful login, e.g., save token, redirect, etc.
    //     console.log("Login successful:", data);
    //     toggleSignIn();
    //   } else {
    //     console.error("Login failed");
    //   }
    // } catch (error) {
    //   console.error("Error during sign-in:", error);
    // }
  };

  return (
    <form className="bg-purple-600 text-lg border border-purple-700 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        type="button"
        onClick={handleSignIn}
        className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInButton;
