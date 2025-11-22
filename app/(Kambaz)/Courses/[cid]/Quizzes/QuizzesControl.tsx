import React from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import { FaPlus } from 'react-icons/fa6'
import Link from 'next/link'
import { ParamValue } from 'next/dist/server/request/params';
import { IoEllipsisVertical } from 'react-icons/io5'

function QuizzesControl({ cid, qid }: { cid: ParamValue, qid: string }) {

    return (
        <div className="d-flex align-items-center justify-content-between  ">
            <div className="w-2 me-4 position-relative roundeed-2">
                <InputGroup className='position-relative'>

                    <BiSearch style={{ width: "30px", position: "absolute", left: "10px", top: "50%", zIndex: 10, transform: "translateY(-50%)" }} />
                    <Form.Control key="inpu-1" type="search" placeholder="Search..." className='ps-5 rounded-3' />
                </InputGroup>
            </div>
            <div className="me-2">

                <Link href={`/Courses/${cid}/Quizzes/${qid}`}>
                    <Button variant="danger" className='me-1 flout-end' id='wd-add-assignment-btn' >
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                        Quiz
                    </Button>

                </Link>
                <Button variant="secondary" className='me-1 flout-end' id='wd-add-assignment-btn'>
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    <IoEllipsisVertical  className="fs-4" /> 
                </Button>

            </div>

        </div>
    )
}

export default QuizzesControl