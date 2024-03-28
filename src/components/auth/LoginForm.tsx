"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInGoogle } from "@/lib/firebase/signin";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseClient";
import router from "next/router";

enum FormMode {
  Login,
  Register,
}

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formMode, setFormMode] = useState<FormMode>(FormMode.Login);

  const handleGoogleAuth = async () => {
    await signInGoogle();
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          toast.error("Incorrect email or password.");
          break;
        default:
          console.error(error);
          toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use.");
      } else {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the page from navigating on link click
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
                disabled={!email || !password}
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
