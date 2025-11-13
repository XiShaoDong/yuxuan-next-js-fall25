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
  });
  const dispatch = useDispatch();
  const signup = async () => {
    // console.log(user)
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    redirect("/Account/Profile");
  };
  return (
    <div className="wd-signup-screen d-flex justify-content-center align-items-center mt-2">
      <div className="card p-4 w-50">
        <h2>Signup</h2>
        <FormControl value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="wd-username b-2" placeholder="username" />
        <FormControl value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="wd-password mb-2" placeholder="password" type="password" />
        <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </button><br />
        <Link href="/Account/Signin" className="wd-signin-link">Sign in</Link>

      </div>
    </div>
  );
}
