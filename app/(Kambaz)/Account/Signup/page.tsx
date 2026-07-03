"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({
    username:"",
    password:"",
    email:"",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const signup = async () => {
    setError("");
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      redirect("/Account/Profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };
  return (
    <div className="wd-signup-screen d-flex justify-content-center align-items-center mt-2">
      <div className="card p-4 w-50">
        <h2>Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <FormControl value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="wd-username mb-2" placeholder="username" />
        <FormControl value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="wd-password mb-2" placeholder="password" type="password" />
        <FormControl value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="wd-email mb-2" placeholder="email (optional)" type="email" />
        <Button onClick={signup} className="wd-signup-btn btn btn-primary w-100 mb-2"> Sign up </Button>
        <Link href="/Account/Signin" className="wd-signin-link">Sign in</Link>

      </div>
    </div>
  );
}
