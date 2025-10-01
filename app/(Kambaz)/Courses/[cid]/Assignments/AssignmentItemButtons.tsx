import React from 'react'
import GreenCheckmark from '../Modules/GreenCheckmark'
import { IoEllipsisVertical } from 'react-icons/io5'

function AssignmentItemButtons() {
  return (
    <div className="d-flex">
        <GreenCheckmark/>
        <IoEllipsisVertical className='fs-4'/>

    </div>
  )
}

export default AssignmentItemButtons