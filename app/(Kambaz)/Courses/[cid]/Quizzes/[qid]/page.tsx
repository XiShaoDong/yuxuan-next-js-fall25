"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Alert, ListGroup, Badge } from "react-bootstrap";
import { FaPencilAlt, FaPlay, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as client from "./client";
import * as quizClient from "../client";
import { togglePublish } from "../reducer";

export default function QuizDetails() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [attempts, setAttempts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quizData = await quizClient.findQuizById(qid as string);
                setQuiz(quizData);

                // If student, fetch their attempts
                if (!isFaculty && currentUser) {
                    const attemptsData = await client.getStudentAttempts(currentUser._id, qid as string);
                    setAttempts(attemptsData);
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [qid, currentUser, isFaculty]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "Not set";
        const d = new Date(dateString);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${month}/${day}`;
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "Not set";
        const d = new Date(dateString);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleEdit = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`);
    };

    const handlePreview = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`);
    };

    const handleTakeQuiz = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Attempt`);
    };

    const handleViewResult = (attemptId: string) => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Results/${attemptId}`);
    };

    const handleTogglePublish = async () => {
        try {
            const updatedQuiz = await quizClient.togglePublishQuiz(qid as string);
            setQuiz(updatedQuiz);
            dispatch(togglePublish(qid as string));
        } catch (error) {
            console.error("Error toggling publish:", error);
            alert("Failed to update publish status");
        }
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 70) return "success";
        if (percentage >= 50) return "warning";
        return "danger";
    };

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    const canTakeQuiz = !quiz.multipleAttempts || attempts.length < quiz.howManyAttempts;
    const attemptsLeft = quiz.multipleAttempts ? quiz.howManyAttempts - attempts.length : 0;

    return (
        <div id="wd-quiz-details" className="container-fluid mt-4">
            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mb-3">
                {isFaculty ? (
                    <>
                        <Button
                            variant={quiz?.published ? "success" : "secondary"}
                            onClick={handleTogglePublish}
                        >
                            {quiz?.published ? "Published" : "Unpublished"}
                        </Button>
                        <Button variant="outline-secondary" onClick={handlePreview}>
                            <FaPlay className="me-2" />
                            Preview
                        </Button>
                        <Button variant="outline-secondary" onClick={handleEdit}>
                            <FaPencilAlt className="me-2" />
                            Edit
                        </Button>
                    </>
                ) : (
                    <>
                        {canTakeQuiz ? (
                            <Button variant="danger" size="lg" onClick={handleTakeQuiz}>
                                {attempts.length === 0 ? "Take Quiz" : `Retake Quiz (${attemptsLeft} left)`}
                            </Button>
                        ) : (
                            <Alert variant="warning" className="mb-0">
                                No attempts remaining
                            </Alert>
                        )}
                    </>
                )}
            </div>

            {/* Quiz Title */}
            <div className="border-bottom pb-3 mb-4">
                <h2>{quiz.title}</h2>
            </div>

            {/* Student Attempts History */}
            {!isFaculty && attempts.length > 0 && (
                <div className="mb-4">
                    <h4 className="mb-3">Your Attempts</h4>
                    <ListGroup>
                        {attempts.map((attempt: any, index: number) => (
                            <ListGroup.Item
                                key={attempt._id}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>Attempt {attempt.attemptNumber}</strong>
                                    <div className="text-muted small">
                                        Submitted: {formatDateTime(attempt.submittedAt)}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <Badge bg={getScoreColor(attempt.score, quiz.points)} className="fs-6">
                                        {attempt.score} / {quiz.points} ({Math.round((attempt.score / quiz.points) * 100)}%)
                                    </Badge>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleViewResult(attempt._id)}
                                    >
                                        View Results
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}

            {/* Quiz Details - Compact Layout */}
            <div className="mb-4">
                <h4 className="mb-3">Quiz Details</h4>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Quiz Type
                    </Col>
                    <Col>
                        {quiz.quizType || "Graded Quiz"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Points
                    </Col>
                    <Col>
                        {quiz.points}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Assignment Group
                    </Col>
                    <Col>
                        {quiz.assignmentGroup || "Quizzes"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Shuffle Answers
                    </Col>
                    <Col>
                        {quiz.shuffleAnswers ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Time Limit
                    </Col>
                    <Col>
                        {quiz.timeLimit} Minutes
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Multiple Attempts
                    </Col>
                    <Col>
                        {quiz.multipleAttempts ? "Yes" : "No"}
                    </Col>
                </Row>

                {quiz.multipleAttempts && (
                    <Row className="mb-2 align-items-center">
                        <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                            How Many Attempts
                        </Col>
                        <Col>
                            {quiz.howManyAttempts}
                        </Col>
                    </Row>
                )}

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Show Correct Answers
                    </Col>
                    <Col>
                        {quiz.showCorrectAnswers || "Not specified"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Access Code
                    </Col>
                    <Col>
                        {quiz.accessCode || "None"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        One Question at a Time
                    </Col>
                    <Col>
                        {quiz.oneQuestionAtTime ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Webcam Required
                    </Col>
                    <Col>
                        {quiz.webcamRequired ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-2 align-items-center">
                    <Col xs="auto" className="fw-bold text-end" style={{ minWidth: "180px" }}>
                        Lock Questions After Answering
                    </Col>
                    <Col>
                        {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
                    </Col>
                </Row>
            </div>

            {/* Due Dates - Two Row Layout */}
            <div className="mt-4">
                <h5 className="border-bottom pb-2 mb-3">Due Dates</h5>

                <table className="table table-borderless" style={{ maxWidth: "600px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "25%" }}>Due</th>
                            <th style={{ width: "25%" }}>For</th>
                            <th style={{ width: "25%" }}>Available from</th>
                            <th style={{ width: "25%" }}>Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{formatDate(quiz.dueDate)}</td>
                            <td>Everyone</td>
                            <td>{formatDate(quiz.availableDate)}</td>
                            <td>{formatDate(quiz.untilDate)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Questions Summary */}
            <div className="mt-4">
                <table className="table">
                    <tbody>
                        <tr>
                            <td className="fw-bold border-0">Number of Questions</td>
                            <td className="border-0">{quiz.questions?.length || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}