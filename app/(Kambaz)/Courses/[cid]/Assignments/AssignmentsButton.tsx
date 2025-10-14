import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoEllipsisVertical } from 'react-icons/io5'

function AssignmentsButton() {
    return (
            <div className='float-end'>
                <span className='d-inline-block rounded-4 border border-dark border-1 p-1 fs-6 '> 40% of Total</span>
                <FaPlus className='position-relative me-2 ms-2' style={{ bottom: "1px" }} />
                <IoEllipsisVertical  className="fs-4" />
            </div>
    )
}

export default AssignmentsButton