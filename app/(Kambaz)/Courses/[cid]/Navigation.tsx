"use client"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
export default function CourseNavigation({cid}:{cid:string}) {
  const pathname = usePathname()
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (

    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">

      {
        links.map(link => {
          const href = link === "People"
          ? `/Courses/${cid}/People/Table`
          : `/Courses/${cid}/${link}`;
          const isActive = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
            >
              {link}
            </Link>
          )
        })
      }
      
    </div>

  );
}
