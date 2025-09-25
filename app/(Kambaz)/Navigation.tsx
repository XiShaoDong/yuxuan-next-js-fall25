'use client'

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function KambazNavigation() {

  const pathname = usePathname();

  const links = [
    { href: "/Account", icon: <FaRegCircleUser className="fs-1" />, label: "Account", color: "white" },
    { href: "/Dashboard", icon: <AiOutlineDashboard className="fs-1" />, label: "Dashboard", color: "danger" },
    { href: "/Courses/123", icon: <LiaBookSolid className="fs-1" />, label: "Courses", color: "danger" },
    { href: "/Calendar", icon: <IoCalendarOutline className="fs-1" />, label: "Calendar", color: "danger" },
    { href: "/Inbox", icon: <FaInbox className="fs-1" />, label: "Inbox", color: "danger" },
    { href: "/Labs", icon: <LiaCogSolid className="fs-1" />, label: "Labs", color: "danger" },
  ];
  return (
    <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 120 }}>
      <ListGroupItem className="bg-black border-0 text-center" as="a"
        target="_blank" href="https://www.northeastern.edu/">
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      {links.map(link => {
        const isActive = pathname.startsWith(link.href);
        return (
          <ListGroupItem
            key={link.href}
            className={`border-0 text-center ${isActive ? "bg-white text-white" : "bg-black text-white"}`}
          >
            <Link
              href={link.href}
              className={`text-decoration-none d-flex flex-column align-items-center ${isActive ? "text-danger" : `text-${link.color}`}`}
            >
              {link.icon}
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );

 return (
   <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 120 }}
              id="wd-kambaz-navigation">
     <ListGroupItem className="bg-black border-0 text-center" as="a"
              target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
       <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
     </ListGroupItem>
     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
         <FaRegCircleUser className="fs-1 text-white" />
         
         Account
       </Link>
     </ListGroupItem>
     <ListGroupItem className="border-0 bg-white text-center">
       <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
         <AiOutlineDashboard className="fs-1 text-danger" />
         
         Dashboard
       </Link>
     </ListGroupItem>

     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Courses/123" id="wd-dashboard-link" className="text-danger text-decoration-none">
         <LiaBookSolid className="fs-1 text-danger" />
         
         Courses
       </Link>
     </ListGroupItem>

     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Calendar" id="wd-dashboard-link" className="text-danger text-decoration-none">
         <IoCalendarOutline className="fs-1 text-danger" />
         
         Calendar
       </Link>
     </ListGroupItem>

     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Inbox" id="wd-dashboard-link" className="text-danger text-decoration-none d-flex flex-column align-items-center">

         <FaInbox className="fs-1 text-danger"/>
         
         Inbox
       </Link>
     </ListGroupItem>

     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Labs" id="wd-dashboard-link" className="text-danger text-decoration-none d-flex flex-column align-items-center">
         <LiaCogSolid className="fs-1 text-danger" />
         Labs
       </Link>
     </ListGroupItem>
   </ListGroup>
);}
