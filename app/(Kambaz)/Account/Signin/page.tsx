import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signin() {
  return (

    <div id="wd-signin-screen" className="d-flex justify-content-center align-items-center mt-2">
      <div className="card p-4 w-50">
        <h2>Signin</h2>
        <FormControl id="wd-username"
          placeholder="username"
          defaultValue={"alice"}
          className="mb-2" />
        <FormControl id="wd-password"
          placeholder="password" type="password"
          className="mb-2" 
          defaultValue={"alice"}
          />
        <Link id="wd-signin-btn"
          href="/Account/Profile"
          className="btn btn-primary w-100 mb-2">
          Sign in </Link>
        <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
      </div>
    </div>);
}
