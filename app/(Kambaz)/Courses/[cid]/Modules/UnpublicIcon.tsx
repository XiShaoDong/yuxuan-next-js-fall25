import React from 'react'
import { FaBan } from 'react-icons/fa6'

function UnpublicIcon() {
  return (
    <span className="me-1 position-relative">
        <FaBan  style={{ top: "2px"  }} className=" fs-5 " />
    </span>
  )
}

export default UnpublicIcon