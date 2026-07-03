"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Alert, Badge, Spinner, Accordion } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRobot, FaLightbulb, FaQuestionCircle } from "react-icons/fa";
import * as client from "../../../client";
import * as attemptClient from "../../client";

export default function QuizResults() {
    const { cid, qid, rid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [aiFeedback, setAiFeedback] = useState<any>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quizData, attemptData] = await Promise.all([
                    client.findQuizById(qid as string),
                    attemptClient.getAttemptById(rid as string)
                ]);
                setQuiz(quizData);
                setAttempt(attemptData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [qid, rid]);

    const getQuestion = (questionId: string) => {
        return quiz?.questions.find((q: any) => q._id === questionId);
    };

    const getAnswerDisplay = (question: any, answer: any) => {
        if (question.type === "multipleChoice") {
            const choice = question.choices.find((c: any) => c._id === answer.answer);
            return choice?.text || "No answer";
        } else if (question.type === "trueFalse") {
            return answer.answer === true ? "True" : answer.answer === false ? "False" : "No answer";
        } else if (question.type === "fillInBlank") {
            // Handle multiple blanks
            if (question.blanks && question.blanks.length > 0) {
                if (typeof answer.answer === 'object' && answer.answer !== null) {
                    return (
                        <div>
                            {question.blanks.map((blank: any) => (
                                <div key={blank.id} className="mb-1">
                                    <span className="badge bg-warning text-dark me-2">[{blank.id}]</span>
                                    <span>{answer.answer[blank.id] || "(empty)"}</span>
                                </div>
                            ))}
                        </div>
                    );
                }
                return "No answer";
            } else {
                // Old structure (backward compatibility)
                return answer.answer || "No answer";
            }
        }
        return "Unknown";
    };

    const getCorrectAnswerDisplay = (question: any) => {
        if (question.type === "multipleChoice") {
            const correctChoice = question.choices.find((c: any) => c.isCorrect);
            return correctChoice?.text || "Not set";
        } else if (question.type === "trueFalse") {
            return question.correctAnswer ? "True" : "False";
        } else if (question.type === "fillInBlank") {
            // Handle multiple blanks
            if (question.blanks && question.blanks.length > 0) {
                return (
                    <div>
                        {question.blanks.map((blank: any) => (
                            <div key={blank.id} className="mb-1">
                                <span className="badge bg-success text-white me-2">[{blank.id}]</span>
                                <span>{blank.possibleAnswers.join(", ")}</span>
                                {blank.caseSensitive && (
                                    <small className="text-muted ms-2">(case sensitive)</small>
                                )}
                            </div>
                        ))}
                    </div>
                );
            } else {
                // Old structure (backward compatibility)
                return question.possibleAnswers.join(", ");
            }
        }
        return "Unknown";
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleAITutor = async () => {
        setAiLoading(true);
        setAiError(null);
        try {
            const result = await attemptClient.getAITutorFeedback(rid as string);
            setAiFeedback(result);
        } catch (error: any) {
            setAiError(error?.response?.data?.error || "Failed to get AI feedback. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const hasWrongAnswers = attempt?.answers?.some((a: any) => !a.isCorrect);

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz || !attempt) return <div className="text-center my-5"><h4>Results not found</h4></div>;

    const percentage = Math.round((attempt.score / quiz.points) * 100);

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quiz Results</h2>
                <Button
                    variant="outline-secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Quiz
                </Button>
            </div>

            {/* Score Summary */}
            <Alert variant={percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "danger"}>
                <h3>
                    Score: {attempt.score} / {quiz.points} ({percentage}%)
                </h3>
                <div className="mt-2">
                    <strong>Attempt #{attempt.attemptNumber}</strong>
                    <span className="mx-2">|</span>
                    <span>Time Spent: {formatTime(attempt.timeSpent)}</span>
                    <span className="mx-2">|</span>
                    <span>Submitted: {new Date(attempt.submittedAt).toLocaleString()}</span>
                </div>
            </Alert>

            {/* Questions Review */}
            <h4 className="mb-3">Question Review</h4>
            {attempt.answers.map((answer: any, index: number) => {
                const question = getQuestion(answer.question);
                if (!question) return null;

                return (
                    <Card
                        key={answer.question}
                        className={`mb-4 ${answer.isCorrect ? 'border-success' : 'border-danger'}`}
                    >
                        <Card.Header className={answer.isCorrect ? 'bg-success-subtle' : 'bg-danger-subtle'}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Question {index + 1}</strong>
                                    <span className="mx-2">|</span>
                                    <span>{question.points} pts</span>
                                </div>
                                <div>
                                    {answer.isCorrect ? (
                                        <Badge bg="success">
                                            <FaCheckCircle className="me-1" />
                                            Correct ({answer.pointsEarned} pts)
                                        </Badge>
                                    ) : (
                                        <Badge bg="danger">
                                            <FaTimesCircle className="me-1" />
                                            Incorrect (0 pts)
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Question Text */}
                            <div
                                className="mb-3"
                                dangerouslySetInnerHTML={{ __html: question.question }}
                            />

                            {/* Your Answer */}
                            <div className="mb-2">
                                <strong>Your Answer:</strong>{" "}
                                <span className={answer.isCorrect ? "text-success" : "text-danger"}>
                                    {getAnswerDisplay(question, answer)}
                                </span>
                            </div>

                            {/* Correct Answer (if wrong) */}
                            {!answer.isCorrect && (
                                <div className="text-success">
                                    <strong>Correct Answer:</strong>
                                    <div className="mt-1">{getCorrectAnswerDisplay(question)}</div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                );
            })}

            {/* AI Tutor Section */}
            {hasWrongAnswers && (
                <div className="my-4">
                    {!aiFeedback && (
                        <div className="text-center">
                            <Button
                                variant="outline-primary"
                                size="lg"
                                onClick={handleAITutor}
                                disabled={aiLoading}
                            >
                                {aiLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Analyzing your answers...
                                    </>
                                ) : (
                                    <>
                                        <FaRobot className="me-2" />
                                        Get AI Tutor Feedback
                                    </>
                                )}
                            </Button>
                            <p className="text-muted mt-2">
                                Get personalized explanations for your wrong answers
                            </p>
                        </div>
                    )}

                    {aiError && (
                        <Alert variant="danger" dismissible onClose={() => setAiError(null)}>
                            {aiError}
                        </Alert>
                    )}

                    {aiFeedback && (
                        <Card className="border-primary">
                            <Card.Header className="bg-primary text-white d-flex align-items-center">
                                <FaRobot className="me-2" />
                                <strong>AI Tutor Feedback</strong>
                                <Badge bg="light" text="dark" className="ms-auto">
                                    {aiFeedback.provider === "gemini" ? "Powered by Gemini" : "Basic Feedback"}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                {aiFeedback.message && (
                                    <Alert variant="success">{aiFeedback.message}</Alert>
                                )}
                                <Accordion>
                                    {aiFeedback.feedback?.map((fb: any, index: number) => (
                                        <Accordion.Item eventKey={String(index)} key={fb.questionId}>
                                            <Accordion.Header>
                                                <span className="me-2">
                                                    <Badge bg="danger" className="me-2">Wrong</Badge>
                                                    {fb.questionTitle}
                                                </span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="mb-3">
                                                    <h6 className="text-danger">
                                                        <FaTimesCircle className="me-1" />
                                                        Why your answer is wrong
                                                    </h6>
                                                    <p>{fb.explanation}</p>
                                                </div>

                                                <div className="mb-3">
                                                    <h6 className="text-success">
                                                        <FaLightbulb className="me-1" />
                                                        Correct Reasoning
                                                    </h6>
                                                    <p>{fb.correctReasoning}</p>
                                                </div>

                                                {fb.similarQuestion && (
                                                    <div className="p-3 bg-light rounded">
                                                        <h6 className="text-primary">
                                                            <FaQuestionCircle className="me-1" />
                                                            Try a Similar Question
                                                        </h6>
                                                        <p className="mb-1"><strong>Q:</strong> {fb.similarQuestion.question}</p>
                                                        <details>
                                                            <summary className="text-muted" style={{ cursor: "pointer" }}>
                                                                Show Answer
                                                            </summary>
                                                            <p className="mt-1 text-success"><strong>A:</strong> {fb.similarQuestion.answer}</p>
                                                        </details>
                                                    </div>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            )}

            {/* Retake Button */}
            {quiz.multipleAttempts && attempt.attemptNumber < quiz.howManyAttempts && (
                <div className="text-center mb-5">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Attempt`)}
                    >
                        Retake Quiz (Attempt {attempt.attemptNumber + 1} of {quiz.howManyAttempts})
                    </Button>
                </div>
            )}
        </div>
    );
}