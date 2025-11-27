"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Form, Alert, ProgressBar } from "react-bootstrap";
import * as client from "../../client";
import * as attemptClient from "../client"; // Uses the attempt functions we added

export default function QuizAttempt() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const fetchQuizAndAttempts = async () => {
            try {
                const quizData = await client.findQuizById(qid as string);
                setQuiz(quizData);

                // Get previous attempts
                const attempts = await attemptClient.getStudentAttempts(currentUser._id, qid as string);
                setAttemptCount(attempts.length);

                // Set timer if time limit exists
                if (quizData.timeLimit) {
                    setTimeLeft(quizData.timeLimit * 60); // Convert to seconds
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchQuizAndAttempts();
        }
    }, [qid, currentUser]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async () => {
        if (!quiz || !currentUser) return;

        setSubmitting(true);

        try {
            // Calculate time spent
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);

            // Prepare answers
            const formattedAnswers = quiz.questions.map((q: any) => ({
                question: q._id,
                answer: answers[q._id] ?? null
            }));

            // Submit attempt
            const attempt = await attemptClient.submitQuizAttempt(qid as string, {
                studentId: currentUser._id,
                answers: formattedAnswers,
                timeSpent
            });

            // Navigate to results
            router.push(`/Courses/${cid}/Quizzes/${qid}/Results/${attempt._id}`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isAnswered = (questionId: string) => {
        const answer = answers[questionId];

        if (typeof answer === 'boolean') {
            return true;
        }
        
        if (typeof answer === 'string') {
            return answer.trim() !== "";
        }

        return answer !== undefined && answer !== null;
    };

    const answeredCount = quiz?.questions?.filter((q: any) => isAnswered(q._id)).length || 0;
    const totalQuestions = quiz?.questions?.length || 0;

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
    const hasAttemptsLeft = attemptCount < maxAttempts;

    // Check if attempts exceeded
    if (!hasAttemptsLeft) {
        return (
            <div className="container mt-4">
                <Alert variant="warning">
                    <h4>No More Attempts</h4>
                    <p>
                        You have used all {maxAttempts} attempt{maxAttempts > 1 ? 's' : ''} for this quiz.
                    </p>
                    <p className="mb-0">
                        <strong>Your attempts:</strong> {attemptCount} / {maxAttempts}
                    </p>
                    <Button 
                        variant="primary" 
                        className="mt-3"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        View Quiz Details
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="mb-4">
                <h2>{quiz.title}</h2>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Attempt {attemptCount + 1}</strong>
                        {" of "}{maxAttempts}
                    </div>
                    {timeLeft !== null && (
                        <Alert variant={timeLeft < 60 ? "danger" : "info"} className="mb-0 py-2">
                            <strong>Time Left: {formatTime(timeLeft)}</strong>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <span>Progress: {answeredCount} / {totalQuestions}</span>
                    <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
                </div>
                <ProgressBar
                    now={(answeredCount / totalQuestions) * 100}
                    variant={answeredCount === totalQuestions ? "success" : "primary"}
                />
            </div>

            {/* Access Code Check */}
            {quiz.accessCode && (
                <Alert variant="info">
                    This quiz requires an access code. Please make sure you have entered it correctly.
                </Alert>
            )}

            {/* Questions */}
            {quiz.questions?.map((question: any, index: number) => (
                <Card key={question._id} className="mb-4">
                    <Card.Header className={isAnswered(question._id) ? "bg-success-subtle" : ""}>
                        <strong>Question {index + 1}</strong> ({question.points} pts)
                        {isAnswered(question._id) && <span className="badge bg-success ms-2">Answered</span>}
                    </Card.Header>
                    <Card.Body>
                        {/* Question Text */}
                        <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{ __html: question.question }}
                        />

                        {/* Multiple Choice */}
                        {question.type === "multipleChoice" && (
                            <div>
                                {question.choices.map((choice: any) => (
                                    <Form.Check
                                        key={choice._id}
                                        type="radio"
                                        name={`question-${question._id}`}
                                        label={choice.text}
                                        value={choice._id}
                                        checked={answers[question._id] === choice._id}
                                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* True/False */}
                        {question.type === "trueFalse" && (
                            <div>
                                <Form.Check
                                    type="radio"
                                    name={`question-${question._id}`}
                                    label="True"
                                    checked={answers[question._id] === true}
                                    onChange={() => handleAnswerChange(question._id, true)}
                                />
                                <Form.Check
                                    type="radio"
                                    name={`question-${question._id}`}
                                    label="False"
                                    checked={answers[question._id] === false}
                                    onChange={() => handleAnswerChange(question._id, false)}
                                />
                            </div>
                        )}

                        {/* Fill in Blank */}
                        {question.type === "fillInBlank" && (
                            <Form.Control
                                type="text"
                                value={answers[question._id] || ""}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                placeholder="Type your answer here"
                            />
                        )}
                    </Card.Body>
                </Card>
            ))}

            {/* Submit Button */}
            <div className="text-center mb-5">
                <Button
                    variant="danger"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={submitting || answeredCount === 0}
                >
                    {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
                {answeredCount < totalQuestions && (
                    <div className="text-warning mt-2">
                        <small>Warning: You have {totalQuestions - answeredCount} unanswered question(s)</small>
                    </div>
                )}
            </div>
        </div>
    );
}