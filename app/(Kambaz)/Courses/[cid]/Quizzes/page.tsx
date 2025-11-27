"use client"
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { setQuizzes, deleteQuiz as deleteQuizAction, togglePublish } from "./reducer";
import * as client from "./client";
import * as attemptClient from "./[qid]/client";
import QuizControls from "./QuizControls";
import QuizContextMenu from "./QuizContextMenu";

export default function Quizzes() {
    const { cid } = useParams();
    const dispatch = useDispatch();

    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    // Store student scores for each quiz
    const [quizScores, setQuizScores] = useState<{ [key: string]: any }>({});

    // Fetch quizzes for this course
    const fetchQuizzes = async () => {
        try {
            const courseQuizzes = await client.findQuizzesForCourse(cid as string);
            dispatch(setQuizzes(courseQuizzes));

            // If student, fetch their scores for each quiz
            if (!isFaculty && currentUser) {
                fetchStudentScores(courseQuizzes);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    // Fetch student's latest attempt scores for all quizzes
    const fetchStudentScores = async (quizzesList: any[]) => {
        if (!currentUser) return;

        try {
            const scores: { [key: string]: any } = {};

            // Fetch latest attempt for each quiz
            for (const quiz of quizzesList) {
                try {
                    const latestAttempt = await attemptClient.getLatestAttempt(currentUser._id, quiz._id);
                    if (latestAttempt) {
                        scores[quiz._id] = latestAttempt;
                    }
                } catch (error) {
                    // No attempts yet for this quiz
                    console.log(`No attempts for quiz ${quiz._id}`);
                }
            }

            setQuizScores(scores);
        } catch (error) {
            console.error("Error fetching student scores:", error);
        }
    };

    // Delete quiz handler
    const handleDeleteQuiz = async (quizId: string) => {
        try {
            await client.deleteQuiz(quizId);
            dispatch(deleteQuizAction(quizId));
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    // Toggle publish handler
    const handleTogglePublish = async (quizId: string) => {
        try {
            await client.togglePublishQuiz(quizId);
            dispatch(togglePublish(quizId));
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [cid, currentUser]);

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return "No date set";
        const d = new Date(dateString);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate();
        const hour = d.getHours();
        const minute = String(d.getMinutes()).padStart(2, '0');
        const ampm = hour >= 12 ? 'pm' : 'am';
        const hour12 = hour % 12 || 12;
        return `${month} ${day} at ${hour12}:${minute}${ampm}`;
    };

    // Get availability status
    const getAvailabilityStatus = (quiz: any) => {
        const now = new Date();
        const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
        const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

        if (!availableDate) return "Not available";
        if (now < availableDate) return `Not available until ${formatDate(quiz.availableDate)}`;
        if (untilDate && now > untilDate) return "Closed";
        return "Available";
    };

    // Get score badge color
    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 70) return "success";
        if (percentage >= 50) return "warning";
        return "danger";
    };

    return (
        <div id="wd-quizzes">
            {isFaculty && <QuizControls />}

            {quizzes.length === 0 ? (
                <div className="text-center my-5">
                    <h4>No quizzes yet</h4>
                    {isFaculty && <p>Click the "+ Quiz" button to create your first quiz</p>}
                </div>
            ) : (
                <ListGroup className="rounded-0 mt-4" id="wd-quiz-list">
                    <ListGroupItem className="p-0 fs-5 border-gray">
                        <div className="p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                            <div>
                                <BsGripVertical className="me-2 fs-3" />
                                <strong>ASSIGNMENT QUIZZES</strong>
                            </div>
                        </div>
                    </ListGroupItem>

                    {quizzes.map((quiz: any) => {
                        const studentAttempt = quizScores[quiz._id];

                        return (
                            <ListGroupItem key={quiz._id} className="p-0">
                                <div className="p-3 d-flex justify-content-between align-items-center border-start border-4 border-success">
                                
                                    <div className="d-flex align-items-center flex-grow-1">
                                        <HiOutlineRocketLaunch color="green" className="me-2 fs-4 mt-1" />

                                        {/* Quiz Info */}
                                        <div className="flex-grow-1">
                                            <Link
                                                href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                <strong className="d-block">{quiz.title}</strong>
                                                <div className="text-muted small">
                                                    <span className="fw-bold">{getAvailabilityStatus(quiz)}</span>
                                                    {quiz.dueDate && (
                                                        <> | <strong>Due</strong> {formatDate(quiz.dueDate)}</>
                                                    )}
                                                    {" | "}{quiz.points} pts
                                                    {" | "}{quiz.questions?.length || 0} Questions

                                                    {/* Student Score */}
                                                    {!isFaculty && studentAttempt && (
                                                        <>
                                                            {" | "}
                                                            <Badge
                                                                bg={getScoreColor(studentAttempt.score, quiz.points)}
                                                                className="ms-1"
                                                            >
                                                                Score: {studentAttempt.score}/{quiz.points}
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                        {/* Publish Status Icon (Faculty only) */}
                                        {isFaculty && (
                                            <div className="me-3">
                                                {quiz.published ? (
                                                    <FaCheckCircle
                                                        className="text-success fs-5 cursor-pointer"
                                                        onClick={() => handleTogglePublish(quiz._id)}
                                                        title="Published - Click to unpublish"
                                                    />
                                                ) : (
                                                    <FaBan
                                                        className="text-danger fs-5 cursor-pointer"
                                                        onClick={() => handleTogglePublish(quiz._id)}
                                                        title="Unpublished - Click to publish"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Context Menu (Faculty only) */}
                                    {isFaculty && (
                                        <QuizContextMenu
                                            quizId={quiz._id}
                                            onDelete={handleDeleteQuiz}
                                        />
                                    )}
                                </div>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            )}
        </div>
    );
}