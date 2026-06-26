"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
export default async function CoursesLayout(
  { children }: { children: ReactNode }) {

  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (!currentUser) return <p><Link href={`/Account/Signin`}>Please login</Link></p>;
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        <Breadcrumb course={course} />
         {/* {course?.name} */}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid?.toString()||""} />

        </div>
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div >

  );
}
