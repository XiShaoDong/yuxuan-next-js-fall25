import React from 'react'
import Link from "next/link";

function NotFound() {
  return (
    <div className="p-4">
    <h2 className="text-danger">Page Not Found</h2>
    <p>
      The requested page could not be found. Please check the page URL or
      return to the Courses Home.
    </p>
    <Link href="/Courses/Home" className="btn btn-primary mt-3">
      Back to Courses Home
    </Link>
  </div>
  )
}

export default NotFound