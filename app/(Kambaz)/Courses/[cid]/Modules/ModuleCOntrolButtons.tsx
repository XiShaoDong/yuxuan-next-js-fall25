import React from 'react'
import GreenCheckmark from './GreenCheckmark'
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from 'react-icons/fa6';



function ModuleCOntrolButtons() {
  return (
    <div className="float-end">
      <GreenCheckmark />
       <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
      <IoEllipsisVertical className="fs-4" />
    </div> 
  )
}

export default ModuleCOntrolButtons