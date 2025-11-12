'use client'
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });

    const [module, setModule] = useState({
        id: 1, name: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
            <div className=" p-1 ">
                <a id="wd-update-assignment-title"
                    className="btn btn-primary float-end"
                    href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                    Update Title </a>
                <FormControl className="w-50" id="wd-assignment-title"
                    value={assignment.title} onChange={(e) =>
                        setAssignment({ ...assignment, title: e.target.value })} />

            </div>
            <div className="p-1">
                <a id="wd-update-assignment-title"
                    className="btn btn-primary float-end"
                    href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                    Update score </a>
                <FormControl className="w-50" id="wd-assignment-title"
                    value={assignment.score} onChange={(e) =>
                        setAssignment({ ...assignment, score: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
            </div>

            <div className="p-1">
                <input
                    type="checkbox"
                    id="wd-assignment-completed"
                    checked={assignment.completed}
                    onChange={(e) =>

                        setAssignment({ ...assignment, completed: e.target.checked })
                    }
                />
                <label htmlFor="wd-assignment-completed" className="ms-2">
                    Completed
                </label>
                <a
                    id="wd-update-assignment-completed"
                    className="btn btn-primary float-end"
                    href={`${ASSIGNMENT_API_URL}/complete/${assignment.completed}`}
                >
                    Update Completed
                </a>

            </div>
            <hr />

            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment`}>
                Get Assignment
            </a><hr />
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment/title`}>
                Get Title
            </a><hr />
            <h3>Working with Module</h3>
            <h4>Retrieving Module Objects</h4>
            <a id="wd-retrieve-modules" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/module`}>
                Get Module
            </a>
            <h4>Retrieving Module Properties</h4>
            <a id="wd-retrieve-modules-name" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/module/name`}>
                Get Module Name
            </a>

            <div className="mt-1">
                <a id="wd-update-modules-description"
                    className="btn btn-primary float-end"
                    href={`${MODULE_API_URL}/description/${module.description}`}>
                    Update Descripotion </a>
                <FormControl as={"textarea"} rows={3} className="w-50" id="wd-assignment-title"
                    value={module.description} onChange={(e) =>
                        setModule({ ...module, description: e.target.value })} />
            </div>
            <hr />
        </div>
    );
}
