"use client"
import Link from "next/link";
import AssignmentControls from "./AssignmentControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentsButton from "./AssignmentsButton";
import AssignmentItemButtons from "./AssignmentItemButtons";
import * as db from "../../../Database"
import { useParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { setAssignments, deleteAssignment } from "./reducer";
import { useEffect } from "react";
import { DiSafari } from "react-icons/di";
import * as client from "./client"

export default function Assignments() {
    const { cid } = useParams()

    const { assignments } = useSelector((state: any) => state.assignmentReducer);
    const dispatch = useDispatch();
    console.log(assignments)

    const fetchAssignments = async () => {
        const ass = await client.findMyAssignments(cid as string);
        dispatch(setAssignments(ass));
    };
    const onRemoveAssignment = async (assignmentId: string) => {
        await client.deleteAssignment(assignmentId);
        dispatch(setAssignments(assignments.filter((a: any) => a._id !== assignmentId)));
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const formatForDisplay = (dateString: string) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    return (
        <div id="wd-assignments">
            <AssignmentControls cid={cid} aid={"Temp"} ></AssignmentControls>
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroupItem className="wd-assignment-title p-0 mt-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <AssignmentsButton />
                    </div>
                </ListGroupItem>


                {assignments.filter((assignment: any) => assignment.course === cid).map((assignment: any, idx: number) => (
                    <ListGroupItem className="p-0" key={idx}>
                        <div className=" p-3 px-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <BsGripVertical className="me-2 fs-3" />
                                <div>
                                    <Link href={`/Courses/${cid}/Assignments/${assignment._id}`} className="text-decoration-none text-body" >
                                        <b className="mb-0">{assignment.title}</b>
                                        <p className="mb-0 text-muted small">
                                            {/* <span className="text-danger">Multiple Modules</span>|  */}
                                            <b>Not Available until</b> {formatForDisplay(assignment.startDate)} | <b>Due</b> {formatForDisplay(assignment.dueDate)} | {assignment.points}pts
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            <AssignmentItemButtons assignmentId={assignment._id} deleteAssignment={(assignmentId) => { onRemoveAssignment(assignmentId) }}></AssignmentItemButtons>
                        </div>
                    </ListGroupItem>
                ))
                }

            </ListGroup>

        </div>

    );
}
