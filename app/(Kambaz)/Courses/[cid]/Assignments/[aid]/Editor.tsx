
"use client"
import { useParams } from "next/navigation";
import { Form, Row, Col, Button } from "react-bootstrap";
import * as db from "../../../../Database"
import { updateAssignment, deleteAssignment, addAssignment } from "../reducer"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addAbortSignal } from "stream";
import Link from "next/link";
export default function AssignmentEditor() {
    const dispatch = useDispatch()
    const { cid, aid } = useParams()
    const { assignments } = useSelector((state: any) => state.assignmentReducer)
    const dummyText = `The assignment is available online Submit alink to the landing page of your Webapplication running on Netlify. The landingpage should includethe following: Your fullname and section Links to each of the labassignments Link to the Kanbas applicNtionLinks to all relevant source code repositories The Kanbas application should include a linkto navigate back to the landing page.`
    interface Assignment {
        _id: string;
        title: string;
        course: string;
    }
    const assignmentFromDb = assignments.filter((assignment: any) => assignment._id === aid)[0]

    const [assignment, setAssignment] = useState({
        title: "temp",
        description: "temp",
        startDate: "",
        dueDate: "",
        points: 100,
        courseId: cid,
    });

    useEffect(() => {

        if (assignmentFromDb) {
            // console.log("@AEditor", assignmentFromDb)
            const assignment = {
                title: assignmentFromDb.title,
                description: assignmentFromDb.description ? assignmentFromDb.description : dummyText,
                startDate: assignmentFromDb.startDate,
                dueDate: assignmentFromDb.dueDate,
                points: assignmentFromDb.points,
                courseId: cid,
            }
            setAssignment(assignment)
        }

    }, []);


    const onSave = (): void => {
        if (aid == "Temp") {
            dispatch(addAssignment(assignment));
        } else {
            dispatch(updateAssignment(assignment));
        }
    }
    return (
        <Form>
            <Form.Group className="mb-3" controlId="wd-title">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control type="text"
                    value={assignment.title}
                    onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                />

            </Form.Group>

            <Form.Group className="mb-3 w-100" controlId="wd-textarea">
                <Form.Label></Form.Label>
                <Form.Control as="textarea" rows={5} cols={10}
                    value={assignment.description}
                    onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                />

            </Form.Group>

            {/* Points */}
            <Form.Group as={Row} className="mb-3" controlId="wd-points">
                <Form.Label column sm={3} className="text-end">
                    Points
                </Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={assignment.points}
                        onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })} />
                </Col>
            </Form.Group>

            {/* Assignment Group */}
            <Form.Group as={Row} className="mb-3" controlId="wd-group">
                <Form.Label column sm={3} className="text-end">
                    Assignment Group
                </Form.Label>
                <Col sm={9}>
                    <Form.Select value="ASSIGNMENTS">
                        <option>ASSIGNMENTS</option>
                        <option>PROJECTS</option>
                        <option>QUIZ</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            {/* Display Grade As */}
            <Form.Group as={Row} className="mb-3" controlId="wd-display-grade-as">
                <Form.Label column sm={3} className="text-end">
                    Display Grade as
                </Form.Label>
                <Col sm={9}>
                    <Form.Select value="Percentage">
                        <option>Percentage</option>
                        <option>Points</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            {/* Submission Type */}
            <Form.Group as={Row} className="mb-3" controlId="wd-submission-type">
                <Form.Label column sm={3} className="text-end">
                    Submission Type
                </Form.Label>
                <Col sm={9}>
                    <div className="card p-2">
                        <Form.Select value="Online" className="mb-2">
                            <option>Online</option>
                            <option>In person</option>
                        </Form.Select>
                        <b>Online Entry Options</b>
                        <Form.Check className="mb-2" type="checkbox" id="wd-text-entry" label="Text Entry" />
                        <Form.Check className="mb-2" type="checkbox" id="wd-website-url" label="Website URL" defaultChecked />
                        <Form.Check className="mb-2" type="checkbox" id="wd-media-recordings" label="Media Recordings" />
                        <Form.Check className="mb-2" type="checkbox" id="wd-student-annotation" label="Student Annotation" />
                        <Form.Check className="mb-2" type="checkbox" id="wd-file-upload" label="File Uploads" />
                    </div>
                </Col>
            </Form.Group>

            {/* Assign / Due / Available */}
            <Form.Group as={Row} className="mb-3" controlId="wd-assign-to">
                <Form.Label column sm={3} className="text-end">
                    Assign
                </Form.Label>
                <Col sm={9}>
                    <div className="card p-2">
                        <Form.Group controlId="wd-assign-to" className="mb-2">
                            <Form.Label>Assign To</Form.Label>
                            <Form.Select value="Everyone">
                                <option>Everyone</option>
                                <option>Yuxuan Wang</option>
                            </Form.Select>
                        </Form.Group>
                        {/* <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                        <Form.Control id="wd-assign-to" defaultValue="Everyone" className="mb-2" /> */}

                        <Form.Label htmlFor="wd-due-date">Due</Form.Label>
                        <Form.Control
                            id="wd-due-date"
                            className="mb-2"
                            type="datetime-local"
                            value={assignment.dueDate}
                            onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                        />

                        <Row>
                            <Col>
                                <Form.Label htmlFor="wd-available-from">Available from</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    id="wd-available-from"
                                    value={assignment.startDate}
                                    onChange={(e) => setAssignment({ ...assignment, startDate: e.target.value })}
                                />
                            </Col>
                            <Col>
                                <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    id="wd-available-until"
                                    value={assignment.dueDate}
                                    onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />
                            </Col>
                        </Row>

                    </div>
                </Col>
            </Form.Group>

            <hr />
            <div className="text-end">
                <Link href={`/Courses/${cid}/Assignments`}>
                    <Button variant="secondary" className="me-2" >Cancel</Button>

                </Link>
                <Link href={`/Courses/${cid}/Assignments`}>
                    <Button variant="danger" onClick={() => { onSave() }}>Save</Button>

                </Link>
            </div>
        </Form>
    );
}