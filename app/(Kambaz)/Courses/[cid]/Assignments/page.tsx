import Link from "next/link";
import AssignmentControls from "./AssignmentControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentsButton from "./AssignmentsButton";
import AssignmentItemButtons from "./AssignmentItemButtons";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";

export default function Assignments() {
    return (
        <div id="wd-assignments">
            <AssignmentControls></AssignmentControls>
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroupItem className="wd-assignment-title p-0 mt-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <AssignmentsButton />
                    </div>
                </ListGroupItem>

                <ListGroup className="wd-assignment fs-7 rounded-0">
                    <ListGroupItem className="p-0">
                        
                            {/* @Check old way to implement it */}
                            {/* <div >
                                <BsGripVertical className="me-2 fs-3" />
                                <div className="d-flex flex-column">
                                    <div>
                                    A1 - ENV + HTML
                                    </div>
                                    <div>
                                    Multiplee MOdules | <b>Not Available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100pts
                                    </div>
                                </div>
                            </div>
                            <AssignmentItemButtons></AssignmentItemButtons> */}
                            <div className=" p-3 ps-2 d-flex justify-content-between align-items-center ">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <div>
                                        <Link href={"/Courses/1234/Assignments/123"} className="text-decoration-none text-body" >
                                        <b className="mb-0">A1 - ENV + HTML</b>
                                        <p className="mb-0 text-muted small">
                                        <span className="text-danger">Multiplee Modules</span>| | <b>Not Available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100pts
                                        </p>
                                        </Link>
                                    </div>
                                </div>
                                <AssignmentItemButtons></AssignmentItemButtons>
                            </div>
                    </ListGroupItem>
                    <ListGroupItem className="p-0">
                            <div className="  p-3 ps-2 d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <div>
                                        <Link href={"/Courses/1234/Assignments/123"} className="text-decoration-none text-body">
                                        <b className="mb-0">A2 - CSS + BOOTSTRAP</b>
                                        <p className="mb-0 text-muted small">
                                        <span className="text-danger">Multiplee Modules</span>| | <b>Not Available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | 100pts
                                        </p>
                                        </Link>
                                    </div>
                                </div>
                                <AssignmentItemButtons></AssignmentItemButtons>
                            </div>
                    </ListGroupItem>

                    <ListGroupItem className="p-0">
                            <div className=" p-3 ps-2  d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <div>
                                        <Link href={"/Courses/1234/Assignments/123"} className="text-decoration-none text-body">
                                        <b className="mb-0">A3 - JAVASCRIPt + REACT</b>
                                        <p className="mb-0 text-muted small">
                                        <span className="text-danger">Multiplee Modules</span>| | <b>Not Available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | 100pts                                        </p>
                                        </Link>
                                    </div>
                                </div>
                                <AssignmentItemButtons></AssignmentItemButtons>
                            </div>
                    </ListGroupItem>
                </ListGroup>

            </ListGroup>

        </div>

    );
}
