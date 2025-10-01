"use client"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { href } from "react-router-dom";
export default function CourseNavigation() {
  const pathname = usePathname()
  const links = [
    { href: "/Courses/1234/Home", label: "Home", color: "danger" },
    { href: "/Courses/1234/Modules", label: "Modules", color: "danger" },
    { href: "/Courses/1234/Piazza", label: "Piazza", color: "danger" },
    { href: "/Courses/1234/Zoom", label: "Zoom", color: "danger" },
    { href: "/Courses/1234/Assignments", label: "Assignments", color: "danger" },
    { href: "/Courses/1234/Quizzes", label: "Quizzes", color: "danger" },
    { href: "/Courses/1234/People/Table", label: "People", color: "danger" },
  ]
  return (

    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">

      {
        links.map(link => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link href={link.href} className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
            >
              {link.label}
            </Link>
          )
        })
      }
      {/* <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
        <Link href="/Courses/1234/Home" id="wd-course-home-link"
          className="list-group-item active border-0"> Home </Link>
        <Link href="/Courses/1234/Modules" id="wd-course-modules-link"
          className="list-group-item text-danger border-0"> Modules </Link>
        <Link href="/Courses/1234/Piazza" id="wd-course-piazza-link"
          className="list-group-item text-danger border-0"> Piazza </Link>
        <Link href="/Courses/1234/Zoom" id="wd-course-zoom-link"
          className="list-group-item text-danger border-0"> Zoom </Link>
        <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link"
          className="list-group-item text-danger border-0"> Assignments </Link>
        <Link href="/Courses/1234/Quizzes" id="wd-course-quizzes-link"
          className="list-group-item text-danger border-0"> Quizzes </Link>
        <Link href="/Courses/1234/People/Table" id="wd-course-people-link"
          className="list-group-item text-danger border-0" > People </Link>
      </div> */}
    </div>

  );
}
