
"use client"
import { useParams } from "next/navigation";
// import { Form, Button, } from "react-bootstrap";
import { Form, Row, Col, Button } from "react-bootstrap";
import * as db from "../../../../Database"
export default function AssignmentEditor() {
    const { cid, aid } = useParams()
    const { assignments } = db
    interface Assignment {
        _id: string;
        title: string;
        course: string;
      }
    return (

        <Form>
            {assignments.filter((assignment: Assignment) => assignment._id === aid).map((assignment,index) => (
                <Form.Group className="mb-3" controlId="wd-title" key={index}>
                    <Form.Label>Assignment Name</Form.Label>
                    <Form.Control type="text" defaultValue={assignment.title}></Form.Control>
                </Form.Group>
            ))}


            <Form.Group className="mb-3 w-100" controlId="wd-textarea">
                <Form.Label></Form.Label>
                <Form.Control as="textarea" rows={5} cols={10} defaultValue={`The assignment is available online Submit alink to the landing page of your Webapplication running on Netlify. The landingpage should includethe following: Your fullname and section Links to each of the labassignments Link to the Kanbas applicNtionLinks to all relevant source code repositories The Kanbas application should include a linkto navigate back to the landing page.`}></Form.Control>
            </Form.Group>

            {/* Points */}
            <Form.Group as={Row} className="mb-3" controlId="wd-points">
                <Form.Label column sm={3} className="text-end">
                    Points
                </Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" defaultValue="100" />
                </Col>
            </Form.Group>

            {/* Assignment Group */}
            <Form.Group as={Row} className="mb-3" controlId="wd-group">
                <Form.Label column sm={3} className="text-end">
                    Assignment Group
                </Form.Label>
                <Col sm={9}>
                    <Form.Select defaultValue="ASSIGNMENTS">
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
                    <Form.Select defaultValue="Percentage">
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
                        <Form.Select defaultValue="Online" className="mb-2">
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
                            <Form.Select defaultValue="Everyone">
                                <option>Everyone</option>
                                <option>Yuxuan Wang</option>
                            </Form.Select>
                        </Form.Group>
                        {/* <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                        <Form.Control id="wd-assign-to" defaultValue="Everyone" className="mb-2" /> */}

                        <Form.Label htmlFor="wd-due-date">Due</Form.Label>
                        <Form.Control id="wd-due-date" type="datetime-local" defaultValue="2025-09-12T12:00" className="mb-2" />

                        <Row>
                            <Col>
                                <Form.Label htmlFor="wd-available-from">Available from</Form.Label>
                                <Form.Control type="datetime-local" id="wd-available-from" defaultValue="2025-09-11T12:00" />
                            </Col>
                            <Col>
                                <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                <Form.Control type="datetime-local" id="wd-available-until" defaultValue="2025-09-12T12:00" />
                            </Col>
                        </Row>

                    </div>
                </Col>
            </Form.Group>

            <hr />
            <div className="text-end">
                <Button variant="secondary" className="me-2" href={`/Courses/${cid}/Assignments`}>Cancel</Button>
                <Button variant="danger" href={`/Courses/${cid}/Assignments`}>Save</Button>
            </div>
        </Form>
    );
}