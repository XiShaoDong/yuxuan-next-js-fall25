import Link from "next/link";
export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input placeholder="username" defaultValue={"dummy"} type="text" className="wd-username" /><br/>
      <input placeholder="password" defaultValue={"1234"} type="password" className="wd-password" /><br/>
      <input placeholder="verify password" defaultValue={"1234"}
             type="password" className="wd-password-verify" /><br/>
      <Link id="wd-signin-btn" href="Signin"> Sign in </Link> <br />
      <Link  href="Profile" > Sign up </Link><br />
    </div>
);}

