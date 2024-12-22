"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null); // Clear error on input change
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError(null); // Clear error on input change
  };

  const handleShowPasswordChange = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeepMeSignedInChange = () => {
    setKeepMeSignedIn((prev) => !prev);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true); // Start loading
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      // Validate input fields
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }
    
      setIsLoading(true); // Start loading
    
      try {
        const response = await axios.post("/api/login", { email, password });
    
        if (response.status === 201) {
          // Save token (or other auth data) locally
          const { token } = response.data;
          localStorage.setItem("authToken", token); // Example using local storage
          
          // Ensure the state is refreshed
          router.push("/admindb"); // Redirect to admin dashboard
          router.refresh(); // Force revalidate and refresh
        } else {
          setError(response.data.msg || "Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Login failed", err);
        setError("Invalid email or password. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    
    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.status === 201) {
        router.push("/admindb"); // Redirect to admin page on success
      } else {
        setError(response.data.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="grid place-items-center h-screen animate-fadeIn">
      <div className="shadow-lg border-b-[2px] rounded-lg p-10 transition-all duration-500 hover:shadow-2xl">
        <div className="flex justify-center">
          <img
            src="/pics/qc_logo.png"
            alt="Quezon City logo"
            width="150"
            height="150"
            className="transition-transform transform hover:scale-110"
          />
        </div>
        <span className="border-b-[2px] border-qc-blue w-full flex mt-4"></span>
        <h1 className="text-xl font-semibold my-4 text-center transition-all duration-300 hover:text-gray-300">
          Sign In
        </h1>

        {/* Display error message */}
        {error && <div className="text-red-500 text-sm my-2">{error}</div>}

        {/* Show loading or login form */}
        {isLoading ?
          <div className="text-center my-4">Loading...</div>
        : <form
            className="flex flex-col gap-3 animate-slideIn"
            onSubmit={onSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-qc-blue w-[400px] border-gray-200 bg-zinc-100/40 transition-all duration-300 focus:border-qc-blue"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-qc-blue w-[400px] border-gray-200 bg-zinc-100/40 transition-all duration-300 focus:border-qc-blue"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition-all duration-300 hover:scale-110"
                id="show-password"
                checked={showPassword}
                onChange={handleShowPasswordChange}
              />
              <label
                htmlFor="show-password"
                className="ml-2 text-gray-700 text-sm font-semibold"
              >
                Show password
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-qc-blue transition-all duration-300 hover:scale-110"
                id="keep-me-signed-in"
                checked={keepMeSignedIn}
                onChange={handleKeepMeSignedInChange}
              />
              <label
                htmlFor="keep-me-signed-in"
                className="ml-2 text-gray-700 text-sm font-semibold"
              >
                Keep me signed in
              </label>
            </div>
            <button className="bg-qc-blue text-white cursor-pointer px-6 py-2 text-center mt-4 transition-all duration-300 hover:bg-blue-700 hover:scale-105">
              Login
            </button>
          </form>
        }

        <div className="w-full flex flex-col mt-4">
          <Link
            href={"/register"}
            className="bg-qc-blue text-white cursor-pointer px-6 py-2 text-center mt-2 transition-all duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Create An Account
          </Link>
          <Link
            href={"/forgotpass"}
            className="text-sm text-end underline text-blue-500 mt-2 transition-all duration-300 hover:text-blue-700"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
