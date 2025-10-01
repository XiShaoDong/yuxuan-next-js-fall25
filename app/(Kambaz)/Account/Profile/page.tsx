import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen" className="d-flex justify-content-center align-items-center ">
      <div className="card p-4 w-50">

        <h2>Profile</h2>
        <FormControl defaultValue="alice" placeholder="username"
          className="wd-username mb-2 " />
        <FormControl defaultValue="123" placeholder="password" type="password"
          className="wd-password  mb-2" />
        <FormControl defaultValue="Alice" placeholder="First Name" id="wd-firstname"
          className="wd-firstname mb-2" />
        <FormControl defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname"
          className="wd-lastname mb-2" />
        <FormControl defaultValue="2000-01-01" type="date" id="wd-dob"
          className="wd-date mb-2" />
        <FormControl defaultValue="alice@wonderland" type="email" id="wd-email"
          className="wd-email mb-2" />
        <select defaultValue="FACULTY" id="wd-role" className="wd-selector form-select mb-2">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </select>
        <Link href="Signin" className="btn btn-danger w-100 mb-2"> Sign out </Link>

      </div>
    </div>
  );
}
