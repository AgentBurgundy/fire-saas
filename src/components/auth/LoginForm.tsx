"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInGoogle, signInOrCreateAccount } from "@/lib/firebase/signin";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleAuth = async () => {
    await signInGoogle();
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Please enter an email and password");
      return;
    }

    const { result, error } = await signInOrCreateAccount(email, password);
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="email"
              className="input input-bordered"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          <div className="form-control mt-6">
            <button onClick={handleEmailAuth} className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="divider">OR</div>
          <div className="form-control">
            <button className="btn btn-outline" onClick={handleGoogleAuth}>
              <FontAwesomeIcon icon={faGoogle} className="text-lg mr-2" /> Sign
              in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
