"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";


export default function Breadcrumb({ course }: { course: { name: string } | undefined; }) {
 const pathname = usePathname();
 const {cid} =useParams();
 const segments = pathname.split("/").filter(Boolean);
 const last = segments.pop();
 const sec =  segments.pop() ;
 const secLast = sec !== cid ? `${sec} >` :""
 return (
   <span>
    {course?.name} &gt;{`${secLast}`} {last} 
   </span>
 );
}
