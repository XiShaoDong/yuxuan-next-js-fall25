import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signup-screen" className="d-flex justify-content-center align-items-center mt-2">

      <div className=" card p-4 w-50">
        <h2>Signup</h2>
        <FormControl id="wd-username"
          placeholder="username" className="mb-2" defaultValue={"alice"}/>
        <FormControl id="wd-password"
          placeholder="password" type="password" className="mb-2" defaultValue={"alice"}/>
        <FormControl id="wd-verify-password" placeholder="verify password"
          type="password" className="mb-2" defaultValue={"alice"}/>
        <Link id="wd-signup-link" href="/Account/Profile" className="btn btn-primary mb-2">Sign up</Link>
        <Link id="wd-signin-btn" href="/Dashboard"> Sign in </Link> 
      </div>
    </div>
  );
}

