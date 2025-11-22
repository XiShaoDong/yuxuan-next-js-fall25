import React from 'react'
import GreenCheckmark from '../Modules/GreenCheckmark'
import { IoEllipsisVertical } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa6'
import { assignments } from '@/app/(Kambaz)/Database'

function QuizItemButton(
  { deleteQuiz, quizId }:
    {
      deleteQuiz: (assignmentId: string) => void,
      quizId: string,
    }
) {
  return (
    <div className="d-flex align-items-center">
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => {
            deleteQuiz(quizId)
        }} />
      <GreenCheckmark />
      <IoEllipsisVertical className='fs-4' />
    </div>
  )
}

export default QuizItemButton