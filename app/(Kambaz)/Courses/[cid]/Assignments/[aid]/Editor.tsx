"use client"
import { useParams } from "next/navigation";
import { Form, Row, Col, Button } from "react-bootstrap";
import * as db from "../../../../Database"
import { updateAssignment, deleteAssignment, addAssignment, setAssignments } from "../reducer"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as client from "../client"

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

    const assignmentFromDb = assignments.filter((assignment: Assignment) => assignment._id === aid)[0]

    const [assignment, setAssignment] = useState({
        title: "temp",
        description: "temp",
        startDate: "",
        dueDate: "",
        points: 100,
        course: cid,
        _id: aid,
    });

    const fetchAssignments = async () => {
        const ass = await client.findMyAssignments(cid as string);
        dispatch(setAssignments(ass));
    };
    useEffect(() => {
        if (assignmentFromDb) {
            setAssignment({
                title: assignmentFromDb.title,
                description: assignmentFromDb.description || dummyText,
                startDate: assignmentFromDb.startDate,
                dueDate: assignmentFromDb.dueDate,
                points: assignmentFromDb.points,
                course: cid,
                _id: aid,
            })
        }
        // fetchAssignments()
    }, [assignmentFromDb]);

    const onCreateAssignment = async (assignment: any) => {
        if (!cid) return;
        const newAssignment = { title: assignment.title, course: cid };
        const ass = await client.createAssignment(cid as string, newAssignment);
        dispatch(addAssignment(ass));
    };

    const onUpdateAssignment = async (assignment: any) => {
        const updated = await client.updateAssignment(assignment);
        dispatch(updateAssignment(updated));
    };

    const onSave = (): void => {
        if (!assignment._id || assignment._id === "Temp") {
            onCreateAssignment(assignment);
            console.log("@Create editorPage",assignment)

        } else {
            onUpdateAssignment(assignment);
            console.log("@update editorPage",assignment)

        }
    }

    return (
        <Form>
            {/* Assignment Title */}
            <Form.Group className="mb-3" controlId="wd-title">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control
                    type="text"
                    value={assignment.title}
                    onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3" controlId="wd-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={5}
                    value={assignment.description}
                    onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                />
            </Form.Group>

            {/* Points */}
            <Form.Group as={Row} className="mb-3" controlId="wd-points">
                <Form.Label column sm={3} className="text-end">Points</Form.Label>
                <Col sm={9}>
                    <Form.Control
                        type="number"
                        value={assignment.points}
                        onChange={(e) => {
                            const val = parseInt(e.target.value)
                            setAssignment({ ...assignment, points: isNaN(val) ? 0 : val })
                        }}
                    />
                </Col>
            </Form.Group>

            {/* Assignment Group */}
            <Form.Group as={Row} className="mb-3" controlId="wd-group">
                <Form.Label column sm={3} className="text-end">Assignment Group</Form.Label>
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
                <Form.Label column sm={3} className="text-end">Display Grade as</Form.Label>
                <Col sm={9}>
                    <Form.Select value="Percentage">
                        <option>Percentage</option>
                        <option>Points</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            {/* Submission Type */}
            <Form.Group as={Row} className="mb-3" controlId="wd-submission-type">
                <Form.Label column sm={3} className="text-end">Submission Type</Form.Label>
                <Col sm={9}>
                    <div className="card p-2">
                        <Form.Select value="Online" className="mb-2">
                            <option>Online</option>
                            <option>In person</option>
                        </Form.Select>
                        <b>Online Entry Options</b>
                        <Form.Check className="mb-2" type="checkbox" label="Text Entry" />
                        <Form.Check className="mb-2" type="checkbox" label="Website URL" defaultChecked />
                        <Form.Check className="mb-2" type="checkbox" label="Media Recordings" />
                        <Form.Check className="mb-2" type="checkbox" label="Student Annotation" />
                        <Form.Check className="mb-2" type="checkbox" label="File Uploads" />
                    </div>
                </Col>
            </Form.Group>

            {/* Assign / Due / Available */}
            <Form.Group as={Row} className="mb-3" controlId="wd-dates">
                <Form.Label column sm={3} className="text-end">Assign / Due / Available</Form.Label>
                <Col sm={9}>
                    <div className="card p-2">
                        <Form.Group className="mb-2" controlId="wd-assign-to">
                            <Form.Label>Assign To</Form.Label>
                            <Form.Select value="Everyone">
                                <option>Everyone</option>
                                <option>Yuxuan Wang</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="wd-due-date">
                            <Form.Label>Due</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={assignment.dueDate}
                                onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group controlId="wd-available-from">
                                    <Form.Label>Available From</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={assignment.startDate}
                                        onChange={(e) => setAssignment({ ...assignment, startDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="wd-available-until">
                                    <Form.Label>Until</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={assignment.dueDate}
                                        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Form.Group>

            <hr />
            <div className="text-end">
                <Link href={`/Courses/${cid}/Assignments`}>
                    <Button variant="secondary" className="me-2">Cancel</Button>
                </Link>
                <Link href={`/Courses/${cid}/Assignments`}>
                    <Button variant="danger" onClick={onSave}>Save</Button>
                </Link>
            </div>
        </Form>
    );
}