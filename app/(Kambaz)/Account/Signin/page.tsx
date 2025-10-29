"use client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {

  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = () => {
    // alert("sigin")
    const user = db.users.find(
      (u: any) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };

  return (

    <div id="wd-signin-screen" className="d-flex justify-content-center align-items-center mt-2">
      <div className="card p-4 w-50">
        <h2>Signin</h2>
        <FormControl id="wd-username"
          placeholder="username"
          defaultValue={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="mb-2" />
        <FormControl id="wd-password"
          placeholder="password" type="password"
          className="mb-2"
          defaultValue={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        {/* <Link id="wd-signin-btn"
          href="/Account/Profile"
          className="btn btn-primary w-100 mb-2">
          Sign in </Link> */}
        <Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>

        <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
      </div>
    </div>);
}
