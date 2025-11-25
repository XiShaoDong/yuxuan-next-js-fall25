"use client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";

import Link from "next/link";
import { Button, FormControl } from "react-bootstrap";

import * as client from "../client";
export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const fetchProfile = () => {
    if (!currentUser) return redirect("/Account/Signin");
    setProfile(currentUser);
  };
  const signout = async() => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div id="wd-profile-screen" className="d-flex justify-content-center align-items-center">
      <div className="card p-4 w-50">

        <h2>Profile</h2>
        {profile && (
          <div>
            <FormControl id="wd-username" className="mb-2"
              defaultValue={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <FormControl id="wd-password" className="mb-2"
              defaultValue={profile.password}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            />
            <FormControl id="wd-firstname" className="mb-2"
              defaultValue={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <FormControl id="wd-lastname" className="mb-2"
              defaultValue={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            <FormControl id="wd-dob" className="mb-2" type="date"
              defaultValue={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
            <FormControl id="wd-email" className="mb-2"
              defaultValue={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <select className="form-control mb-2" id="wd-role" value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </select>
            <div>
              <Button onClick={updateProfile} className="btn btn-success w-100 mb-2"> Update </Button>
              <Button onClick={signout} className="w-100 mb-2 btn-warning" id="wd-signout-btn">
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
