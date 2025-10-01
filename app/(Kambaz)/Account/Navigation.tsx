'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { href } from "react-router-dom";
export default function AccountNavigation() {
      const pathname = usePathname();

      const links = [
            { href: "Signin", label: "Signin", color: "danger" },
            { href: "Signup", label: "Singup", color: "danger" },
            { href: "Profile", label: "Profile", color: "danger" },
      ]

      return (
            <div>
                        
                  {/* <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
                        <Link className="list-group-item active border-0"
                              href="Signin"> Signin </Link>
                        <Link className="list-group-item text-danger border-0"
                              href="Signup"> Signup </Link>
                        <Link className="list-group-item text-danger border-0"
                              href="Profile"> Profile </Link>
                  </div> */}
                  <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">

                        {
                              links.map(link => {
                                    const isActive = pathname.match(link.href);
                                    return (
                                          <Link className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
                                                href={link.href}
                                          >
                                                {link.label}
                                          </Link>
                                    );
                              })

                        }
                  </div>
            </div>


      );
}
