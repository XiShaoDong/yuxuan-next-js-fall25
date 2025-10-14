"use client"
import Link from "next/link";
import AssignmentControls from "./AssignmentControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentsButton from "./AssignmentsButton";
import AssignmentItemButtons from "./AssignmentItemButtons";
import * as db from "../../../Database"
import { useParams } from "next/navigation";

export default function Assignments() {
    const {cid} = useParams()
    const { assignments } = db
    return (
        <div id="wd-assignments">
            <AssignmentControls></AssignmentControls>
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroupItem className="wd-assignment-title p-0 mt-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <AssignmentsButton />
                    </div>
                </ListGroupItem>


                {
                    assignments.filter((assignment: any) => assignment.course === cid).map((assignment: any) => (
                        <ListGroupItem className="p-0">
                            <div className=" p-3 px-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <div>
                                        <Link href={`/Courses/${cid}/Assignments/${assignment._id}`} className="text-decoration-none text-body" >
                                            <b className="mb-0">{assignment.title}</b>
                                            <p className="mb-0 text-muted small">
                                                <span className="text-danger">Multiplee Modules</span>| | <b>Not Available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100pts
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                                <AssignmentItemButtons></AssignmentItemButtons>
                            </div>
                        </ListGroupItem>
                    ))
                }

            </ListGroup>

        </div>

    );
}
