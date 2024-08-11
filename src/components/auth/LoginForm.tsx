"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { signIn, SignInMethod } from "@/lib/firebase/signin";
import signUp from "@/lib/firebase/signup";

enum FormMode {
  Login,
  Register,
}

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formMode, setFormMode] = useState<FormMode>(FormMode.Login);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const { user, error } = await signIn(SignInMethod.Google, {
        signupCallback: async (userCredential) => {
          // When a new user signs up, call the signup endpoint
          const response = await fetch("/api/users/signup", {
            method: "POST",
            body: JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            }),
          });
        },
      });
      if (user) {
        router.push("/app/dashboard");
      } else if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("An unexpected error occurred during Google sign-in");
    }
  };

  const handleLogin = async () => {
    try {
      const { user, error } = await signIn(SignInMethod.EmailPassword, {
        credentials: {
          email,
          password,
        },
        signupCallback: async (userCredential) => {
          // When a new user signs up, call the signup endpoint
          const response = await fetch("/api/users/signup", {
            method: "POST",
            body: JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            }),
          });
        },
      });
      if (user) {
        router.push("/app/dashboard");
      } else if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { user, error } = await signUp(email, password);
      if (user) {
        router.push("/app/dashboard");
      } else if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred during registration");
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-start pt-20 h-screen">
      <div className="card w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            {formMode === FormMode.Login ? "Login" : "Register"}
          </h2>
          {error && <div className="text-error">{error}</div>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {formMode === FormMode.Register && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          {formMode === FormMode.Login && (
            <label className="label">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="label-text-alt link link-hover"
              >
                Forgot password?
              </a>
            </label>
          )}
          <div className="form-control mt-6">
            {formMode === FormMode.Login ? (
              <button
                disabled={!email || !password || error !== null}
                onClick={handleLogin}
                className="btn btn-primary"
              >
                Login
              </button>
            ) : (
              <button
                disabled={!email || !password || !confirmPassword}
                onClick={handleRegister}
                className="btn btn-primary"
              >
                Register
              </button>
            )}
          </div>
          <div className="divider">OR</div>
          <div className="form-control">
            <button className="btn btn-outline" onClick={handleGoogleAuth}>
              <FontAwesomeIcon icon={faGoogle} className="text-lg mr-2" /> Sign
              in with Google
            </button>
          </div>
          <div className="form-control mt-2">
            <button
              className="btn btn-outline btn-neutral"
              onClick={() =>
                setFormMode(
                  formMode === FormMode.Login
                    ? FormMode.Register
                    : FormMode.Login
                )
              }
            >
              {formMode === FormMode.Login
                ? "Need an account? Register"
                : "Have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
