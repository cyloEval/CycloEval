import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../../lib/api";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const { setUserEmail, toggleSignIn } = useAuth();

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    console.log("Creating account...");
    console.log(JSON.stringify({ email, password }));

    if (!email || !password || !repeatPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(` ${api}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful account creation, e.g., save token, redirect, etc.
        console.log("Account creation successful:", data);
        toggleSignIn();
      } else {
        console.error("Account creation failed");
        setError("Account creation failed");
      }
    } catch (error) {
      console.error("Error during account creation:", error);
      setError("Error during account creation");
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login, e.g., save token, redirect, etc.
        console.log("Login successful:", data);
        toggleSignIn();
        setUserEmail(email);
      } else {
        console.error("Login failed");
        setError("Login failed");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("Error during sign-in");
    }
  };

  return (
    <form className="bg-purple-600 text-lg border border-purple-700 p-6 rounded-lg shadow-lg text-black">
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
      <div className="mb-4">
        {isCreatingAccount ? (
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : null}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={handleCreateAccount}
          className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
