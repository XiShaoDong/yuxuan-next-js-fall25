"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Form, Alert, ProgressBar } from "react-bootstrap";
import * as client from "../client";
import * as quizClient from "../../client";
import { shuffleArray } from "./utils";
import type { RootState } from "../../../../../store";

export default function QuizAttempt() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);

    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [startTime] = useState(Date.now());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shuffledChoices, setShuffledChoices] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchQuizAndAttempts = async () => {
            try {
                const quizData = await quizClient.findQuizById(qid as string);
                setQuiz(quizData);

                // Shuffle choices if needed
                if (quizData.shuffleAnswers) {
                    const shuffled: { [key: string]: any[] } = {};
                    quizData.questions.forEach((question: any) => {
                        if (question.type === "multipleChoice" && question.choices) {
                            shuffled[question._id] = shuffleArray(question.choices);
                        }
                    });
                    setShuffledChoices(shuffled);
                }

                if (!currentUser) {
                    return;
                }

                const attempts = await client.getStudentAttempts(currentUser._id, qid as string);
                setAttemptCount(attempts.length);

                if (quizData.timeLimit) {
                    setTimeLeft(quizData.timeLimit * 60);
                }

                // Initialize fillInBlank answers with blank structure
                const initialAnswers: any = {};
                quizData.questions.forEach((question: any) => {
                    if (question.type === "fillInBlank" && question.blanks) {
                        // Initialize with empty object for each blank
                        initialAnswers[question._id] = {};
                        question.blanks.forEach((blank: any) => {
                            initialAnswers[question._id][blank.id] = "";
                        });
                    }
                });
                setAnswers(initialAnswers);

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

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    handleSubmit();
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

    // NEW: Handle fillInBlank with multiple blanks
    const handleBlankAnswerChange = (questionId: string, blankId: string, value: string) => {
        setAnswers({
            ...answers,
            [questionId]: {
                ...(answers[questionId] || {}),
                [blankId]: value
            }
        });
    };

    const handleSubmit = async () => {
        if (!quiz || !currentUser) return;
        setSubmitting(true);

        try {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const formattedAnswers = quiz.questions.map((q: any) => ({
                question: q._id,
                answer: answers[q._id] ?? null
            }));

            const attempt = await client.submitQuizAttempt(qid as string, {
                studentId: currentUser._id,
                answers: formattedAnswers,
                timeSpent
            });

            router.push(`/Courses/${cid}/Quizzes/${qid}/Results/${attempt._id}`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isAnswered = (questionId: string) => {
        const answer = answers[questionId];
        if (typeof answer === 'boolean') return true;

        // For fillInBlank with multiple blanks
        if (typeof answer === 'object' && answer !== null && !Array.isArray(answer)) {
            // Check if at least one blank is filled
            return Object.values(answer).some((val: any) => val && val.trim() !== "");
        }

        return answer !== undefined && answer !== null && answer !== "";
    };

    const answeredCount = useMemo(() => {
        if (!quiz?.questions) return 0;
        return quiz.questions.filter((q: any) => isAnswered(q._id)).length;
    }, [quiz?.questions, answers]);

    const totalQuestions = quiz?.questions?.length || 0;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getChoicesForQuestion = (question: any) => {
        if (quiz.shuffleAnswers && shuffledChoices[question._id]) {
            return shuffledChoices[question._id];
        }
        return question.choices || [];
    };


    const renderQuestionWithBlanks = (question: any) => {
        if (!question.blanks || question.blanks.length === 0) {
            return <div dangerouslySetInnerHTML={{ __html: question.question }} />;
        }

        // Parse the question HTML and split by blanks
        let parts: any[] = [];
        let remainingHtml = question.question;

        question.blanks.forEach((blank: any, index: number) => {
            const regex = new RegExp(`\\[${blank.id}\\]`);
            const match = remainingHtml.match(regex);

            if (match) {
                const splitIndex = match.index!;
                // Add the text before the blank
                parts.push({
                    type: 'html',
                    content: remainingHtml.substring(0, splitIndex)
                });
                // Add the input for the blank
                parts.push({
                    type: 'input',
                    blankId: blank.id
                });
                // Continue with remaining text
                remainingHtml = remainingHtml.substring(splitIndex + match[0].length);
            }
        });

        // Add any remaining HTML
        if (remainingHtml) {
            parts.push({
                type: 'html',
                content: remainingHtml
            });
        }

        return (
            <div>
                {parts.map((part, index) => {
                    if (part.type === 'html') {
                        return <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
                    } else {
                        return (
                            <input
                                key={index}
                                type="text"
                                className="form-control d-inline-block mx-1"
                                style={{ width: "150px" }}
                                value={answers[question._id]?.[part.blankId] || ""}
                                onChange={(e) => handleBlankAnswerChange(question._id, part.blankId, e.target.value)}
                                placeholder="Type answer"
                            />
                        );
                    }
                })}
            </div>
        );
    };

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
    const hasAttemptsLeft = attemptCount < maxAttempts;

    if (!hasAttemptsLeft) {
        return (
            <div className="container mt-4">
                <Alert variant="warning">
                    <h4>No More Attempts</h4>
                    <p>You have used all {maxAttempts} attempt{maxAttempts > 1 ? 's' : ''} for this quiz.</p>
                    <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
                        View Quiz Details
                    </Button>
                </Alert>
            </div>
        );
    }

    const currentQuestion = quiz.questions?.[currentQuestionIndex];

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="mb-4">
                <h2>{quiz.title}</h2>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Attempt {attemptCount + 1}</strong>
                        {quiz.multipleAttempts && ` of ${quiz.howManyAttempts}`}
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
                    <span>{totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%</span>
                </div>
                <ProgressBar
                    now={totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}
                    variant={answeredCount === totalQuestions ? "success" : "primary"}
                />
            </div>

            {/* Question Navigation */}
            {quiz.oneQuestionAtTime && (
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2">
                        {quiz.questions.map((q: any, idx: number) => (
                            <Button
                                key={q._id}
                                variant={idx === currentQuestionIndex ? "primary" : isAnswered(q._id) ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => goToQuestion(idx)}
                                style={{ minWidth: "45px" }}
                            >
                                {idx + 1}
                                {isAnswered(q._id) && idx !== currentQuestionIndex && " ✓"}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Questions Display */}
            {quiz.oneQuestionAtTime ? (
                // One Question at a Time Mode
                currentQuestion && (
                    <Card className="mb-4">
                        <Card.Header className={isAnswered(currentQuestion._id) ? "bg-success-subtle" : ""}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>Question {currentQuestionIndex + 1} of {totalQuestions}</strong>
                                    <span className="mx-2">|</span>
                                    <span>{currentQuestion.points} pts</span>
                                </div>
                                {isAnswered(currentQuestion._id) && (
                                    <span className="badge bg-success">Answered</span>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Multiple Choice */}
                            {currentQuestion.type === "multipleChoice" && (
                                <>
                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                                    <div>
                                        {getChoicesForQuestion(currentQuestion).map((choice: any) => (
                                            <Form.Check
                                                key={choice._id}
                                                type="radio"
                                                name={`question-${currentQuestion._id}`}
                                                label={choice.text}
                                                value={choice._id}
                                                checked={answers[currentQuestion._id] === choice._id}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* True/False */}
                            {currentQuestion.type === "trueFalse" && (
                                <>
                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            name={`question-${currentQuestion._id}`}
                                            label="True"
                                            checked={answers[currentQuestion._id] === true}
                                            onChange={() => handleAnswerChange(currentQuestion._id, true)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name={`question-${currentQuestion._id}`}
                                            label="False"
                                            checked={answers[currentQuestion._id] === false}
                                            onChange={() => handleAnswerChange(currentQuestion._id, false)}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Fill in Blank - NEW: Support multiple blanks */}
                            {currentQuestion.type === "fillInBlank" && (
                                <div>
                                    {currentQuestion.blanks && currentQuestion.blanks.length > 0 ? (
                                        renderQuestionWithBlanks(currentQuestion)
                                    ) : (
                                        <>
                                            <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                                            <Form.Control
                                                type="text"
                                                value={answers[currentQuestion._id] || ""}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                                placeholder="Type your answer here"
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )
            ) : (
                // All Questions Mode
                quiz.questions?.map((question: any, index: number) => (
                    <Card key={question._id} className="mb-4">
                        <Card.Header className={isAnswered(question._id) ? "bg-success-subtle" : ""}>
                            <strong>Question {index + 1}</strong> ({question.points} pts)
                            {isAnswered(question._id) && <span className="badge bg-success ms-2">Answered</span>}
                        </Card.Header>
                        <Card.Body>
                            {question.type === "multipleChoice" && (
                                <>
                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />
                                    <div>
                                        {getChoicesForQuestion(question).map((choice: any) => (
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
                                </>
                            )}

                            {question.type === "trueFalse" && (
                                <>
                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />
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
                                </>
                            )}

                            {question.type === "fillInBlank" && (
                                <div>
                                    {question.blanks && question.blanks.length > 0 ? (
                                        renderQuestionWithBlanks(question)
                                    ) : (
                                        <>
                                            <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />
                                            <Form.Control
                                                type="text"
                                                value={answers[question._id] || ""}
                                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                                placeholder="Type your answer here"
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Navigation Buttons (One Question at a Time) */}
            {quiz.oneQuestionAtTime && (
                <div className="d-flex justify-content-between mb-4">
                    <Button
                        variant="secondary"
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={goToNext}
                        disabled={currentQuestionIndex === totalQuestions - 1}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Submit Button */}
            <div className="text-center mb-5">
                <Button
                    variant="danger"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={submitting}
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
