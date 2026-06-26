import React from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa6'
import { BiSearch } from 'react-icons/bi';
import { ParamValue } from 'next/dist/server/request/params';
import Link from "next/link";

function AssignmentControls(
    { cid, aid }: { cid: ParamValue, aid: string }
) {
    return (
        <div className="d-flex align-items-center justify-content-between  ">
            <div className="w-2 me-4 position-relative roundeed-2">
                <InputGroup className='position-relative'>

                    <BiSearch style={{ width: "30px", position: "absolute", left: "10px", top: "50%", zIndex: 10, transform: "translateY(-50%)" }} />
                    <Form.Control key="inpu-1" type="search" placeholder="Search..." className='ps-5 rounded-3' />
                </InputGroup>
            </div>
            <div className="me-2">
                <Button variant="secondary" className='me-1 flout-end' id='wd-add-assignment-btn'>
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    Group
                </Button>
                <Link href={`/Courses/${cid}/Assignments/${aid}`}>
                    <Button variant="danger" className='me-1 flout-end' id='wd-add-assignment-btn' >
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                        Assignment
                    </Button>

                </Link>

            </div>

        </div>
    )
}

export default AssignmentControls