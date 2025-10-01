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
            <Link key={link.href} href={link.href} className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
            >
              {link.label}
            </Link>
          )
        })
      }
      
    </div>

  );
}
