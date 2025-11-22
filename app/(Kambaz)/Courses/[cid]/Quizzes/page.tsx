"use client"
import React, { useEffect } from 'react'
import NotFound from '../../not-found'
import AssignmentControls from '../Assignments/AssignmentControls'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { BsGripVertical } from 'react-icons/bs'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import * as client from './client'
import { deleteQuiz, setQuizzes } from './reducer'
import { setAssignments } from '../Assignments/reducer'
import QuizzesControl from './QuizzesControl'
import QuizItemButton from './QuizItemButton'

function page() {

  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizReducer);
  const dispatch = useDispatch();
  console.log(quizzes);

  const fetchQuizzes = async () => {
    const quiz = await client.findMyQuizzes(cid as string);
    dispatch(setQuizzes(quiz));
  }

  const onRemoveQuiz = async( quizId: string) => {
    await client.deleteQuizzes(quizId);
    dispatch(deleteQuiz(quizId));
  }


  useEffect(()=>{
    fetchQuizzes();

  },[])
  

  
  return (

    <div>

      <QuizzesControl cid={cid} qid={"Temp"} ></QuizzesControl>
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroupItem className="wd-assignment-title p-0 mt-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Quizzes
          </div>
        </ListGroupItem>


        {quizzes.filter((quiz: any) => quiz.course === cid).map((quiz: any, idx: number) => (
          <ListGroupItem className="p-0" key={idx}>
            <div className=" p-3 px-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <div>
                  <Link href={`/Courses/${cid}/Assignments/${quiz._id}`} className="text-decoration-none text-body" >
                    <b className="mb-0">{quiz.title}</b>
                    <p className="mb-0 text-muted small">
                      <span className="text-danger">Multiple Modules</span>| | <b>Not Available until</b> {quiz.startDate} | <b>Due</b> {quiz.dueDate} | {quiz.points}pts
                    </p>
                  </Link>
                </div>
              </div>
              <QuizItemButton quizId={quiz._id} deleteQuiz={(quizId) => { onRemoveQuiz(quizId) }}></QuizItemButton>
            </div>
          </ListGroupItem>
        ))
        }

      </ListGroup>

    </div>
  )
}

export default page