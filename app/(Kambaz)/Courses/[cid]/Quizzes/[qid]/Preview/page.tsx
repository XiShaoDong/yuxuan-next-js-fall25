"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import * as client from "../../client";

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shuffledChoices, setShuffledChoices] = useState<{[key: string]: any[]}>({});

    const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await client.findQuizById(qid as string);
                setQuiz(data);

                if (data.shuffleAnswers) {
                    const shuffled: {[key: string]: any[]} = {};
                    data.questions.forEach((question: any) => {
                        if (question.type === "multipleChoice" && question.choices) {
                            shuffled[question._id] = shuffleArray(question.choices);
                        }
                    });
                    setShuffledChoices(shuffled);
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [qid]);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = () => {
        if (!quiz) return;

        let totalScore = 0;
        quiz.questions.forEach((question: any) => {
            const studentAnswer = answers[question._id];
            let isCorrect = false;

            if (question.type === "multipleChoice") {
                const correctChoice = question.choices.find((c: any) => c.isCorrect);
                isCorrect = studentAnswer === correctChoice?._id;
            } else if (question.type === "trueFalse") {
                isCorrect = studentAnswer === question.correctAnswer;
            } else if (question.type === "fillInBlank") {
                const answer = question.caseSensitive ? studentAnswer : studentAnswer?.toLowerCase();
                const possibleAnswers = question.caseSensitive
                    ? question.possibleAnswers
                    : question.possibleAnswers.map((a: string) => a.toLowerCase());
                isCorrect = possibleAnswers.includes(answer);
            }

            if (isCorrect) {
                totalScore += question.points;
            }
        });

        setScore(totalScore);
        setShowResults(true);
    };

    const getQuestionResult = (question: any) => {
        const studentAnswer = answers[question._id];
        let isCorrect = false;

        if (question.type === "multipleChoice") {
            const correctChoice = question.choices.find((c: any) => c.isCorrect);
            isCorrect = studentAnswer === correctChoice?._id;
        } else if (question.type === "trueFalse") {
            isCorrect = studentAnswer === question.correctAnswer;
        } else if (question.type === "fillInBlank") {
            const answer = question.caseSensitive ? studentAnswer : studentAnswer?.toLowerCase();
            const possibleAnswers = question.caseSensitive
                ? question.possibleAnswers
                : question.possibleAnswers.map((a: string) => a.toLowerCase());
            isCorrect = possibleAnswers.includes(answer);
        }

        return isCorrect;
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
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getChoicesForQuestion = (question: any) => {
        if (quiz.shuffleAnswers && shuffledChoices[question._id]) {
            return shuffledChoices[question._id];
        }
        return question.choices || [];
    };

    const isAnswered = (questionId: string) => {
        const answer = answers[questionId];
        if (typeof answer === 'boolean') return true;
        return answer !== undefined && answer !== null && answer !== "";
    };

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    const currentQuestion = quiz.questions?.[currentQuestionIndex];
    const totalQuestions = quiz.questions?.length || 0;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Preview: {quiz.title}</h2>
                <Button 
                    variant="outline-secondary" 
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Editor
                </Button>
            </div>

            <Alert variant="info">
                This is a preview. Your answers will not be saved.
                {quiz.shuffleAnswers && <div className="mt-2"><strong>Note:</strong> Answer choices are shuffled.</div>}
                {quiz.oneQuestionAtTime && <div className="mt-2"><strong>Note:</strong> One question at a time mode is enabled.</div>}
            </Alert>

            {showResults && (
                <Alert variant="success">
                    <strong>Preview Score: {score} / {quiz.points}</strong>
                </Alert>
            )}

            {/* Question Navigation */}
            {quiz.oneQuestionAtTime && (
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2">
                        {quiz.questions.map((q: any, idx: number) => (
                            <Button
                                key={q._id}
                                variant={idx === currentQuestionIndex ? "primary" : 
                                        showResults ? (getQuestionResult(q) ? "success" : "danger") :
                                        isAnswered(q._id) ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => goToQuestion(idx)}
                                style={{ minWidth: "45px" }}
                                disabled={showResults}
                            >
                                {idx + 1}
                                {!showResults && isAnswered(q._id) && idx !== currentQuestionIndex && " ✓"}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Questions Display */}
            {quiz.oneQuestionAtTime ? (
                currentQuestion && (
                    <Card className={`mb-4 ${showResults ? (getQuestionResult(currentQuestion) ? 'border-success' : 'border-danger') : ''}`}>
                        <Card.Header className={showResults ? (getQuestionResult(currentQuestion) ? 'bg-success-subtle' : 'bg-danger-subtle') : ''}>
                            <strong>Question {currentQuestionIndex + 1} of {totalQuestions}</strong> ({currentQuestion.points} pts)
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

                            {currentQuestion.type === "multipleChoice" && (
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
                                            disabled={showResults}
                                            className={showResults && choice.isCorrect ? 'text-success fw-bold' : ''}
                                        />
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === "trueFalse" && (
                                <div>
                                    <Form.Check
                                        type="radio"
                                        name={`question-${currentQuestion._id}`}
                                        label="True"
                                        checked={answers[currentQuestion._id] === true}
                                        onChange={() => handleAnswerChange(currentQuestion._id, true)}
                                        disabled={showResults}
                                        className={showResults && currentQuestion.correctAnswer === true ? 'text-success fw-bold' : ''}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name={`question-${currentQuestion._id}`}
                                        label="False"
                                        checked={answers[currentQuestion._id] === false}
                                        onChange={() => handleAnswerChange(currentQuestion._id, false)}
                                        disabled={showResults}
                                        className={showResults && currentQuestion.correctAnswer === false ? 'text-success fw-bold' : ''}
                                    />
                                </div>
                            )}

                            {currentQuestion.type === "fillInBlank" && (
                                <div>
                                    <Form.Control
                                        type="text"
                                        value={answers[currentQuestion._id] || ""}
                                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                        disabled={showResults}
                                        placeholder="Your answer"
                                    />
                                    {showResults && (
                                        <div className="text-success mt-2">
                                            <small><strong>Correct answers:</strong> {currentQuestion.possibleAnswers.join(", ")}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )
            ) : (
                quiz.questions?.map((question: any, index: number) => (
                    <Card 
                        key={question._id} 
                        className={`mb-4 ${showResults ? (getQuestionResult(question) ? 'border-success' : 'border-danger') : ''}`}
                    >
                        <Card.Header className={showResults ? (getQuestionResult(question) ? 'bg-success-subtle' : 'bg-danger-subtle') : ''}>
                            <strong>Question {index + 1}</strong> ({question.points} pts)
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />

                            {question.type === "multipleChoice" && (
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
                                            disabled={showResults}
                                            className={showResults && choice.isCorrect ? 'text-success fw-bold' : ''}
                                        />
                                    ))}
                                </div>
                            )}

                            {question.type === "trueFalse" && (
                                <div>
                                    <Form.Check
                                        type="radio"
                                        name={`question-${question._id}`}
                                        label="True"
                                        checked={answers[question._id] === true}
                                        onChange={() => handleAnswerChange(question._id, true)}
                                        disabled={showResults}
                                        className={showResults && question.correctAnswer === true ? 'text-success fw-bold' : ''}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name={`question-${question._id}`}
                                        label="False"
                                        checked={answers[question._id] === false}
                                        onChange={() => handleAnswerChange(question._id, false)}
                                        disabled={showResults}
                                        className={showResults && question.correctAnswer === false ? 'text-success fw-bold' : ''}
                                    />
                                </div>
                            )}

                            {question.type === "fillInBlank" && (
                                <div>
                                    <Form.Control
                                        type="text"
                                        value={answers[question._id] || ""}
                                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                        disabled={showResults}
                                        placeholder="Your answer"
                                    />
                                    {showResults && (
                                        <div className="text-success mt-2">
                                            <small><strong>Correct answers:</strong> {question.possibleAnswers.join(", ")}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Navigation Buttons */}
            {quiz.oneQuestionAtTime && !showResults && (
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

            {/* Submit/Try Again Buttons */}
            <div className="text-center mb-5">
                {!showResults ? (
                    <Button variant="primary" size="lg" onClick={handleSubmit}>
                        Submit Preview
                    </Button>
                ) : (
                    <Button 
                        variant="secondary" 
                        onClick={() => {
                            setAnswers({});
                            setShowResults(false);
                            setCurrentQuestionIndex(0);
                        }}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
}