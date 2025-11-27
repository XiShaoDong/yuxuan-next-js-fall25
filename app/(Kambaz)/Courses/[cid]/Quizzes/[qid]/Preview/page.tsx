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

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await client.findQuizById(qid as string);
                setQuiz(data);
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

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    return (
        <div className="container mt-4">
            {/* Header */}
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
            </Alert>

            {/* Results */}
            {showResults && (
                <Alert variant="success">
                    <strong>Preview Score: {score} / {quiz.points}</strong>
                </Alert>
            )}

            {/* Questions */}
            {quiz.questions?.map((question: any, index: number) => (
                <Card
                    key={question._id}
                    className={`mb-4 ${showResults ? (getQuestionResult(question) ? 'border-success' : 'border-danger') : ''}`}
                >
                    <Card.Header className={showResults ? (getQuestionResult(question) ? 'bg-success-subtle' : 'bg-danger-subtle') : ''}>
                        <strong>Question {index + 1}</strong> ({question.points} pts)
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
                                        disabled={showResults}
                                        className={showResults && choice.isCorrect ? 'text-success fw-bold' : ''}
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
                                    value="true"
                                    checked={answers[question._id] === true}
                                    onChange={() => handleAnswerChange(question._id, true)}
                                    disabled={showResults}
                                    className={showResults && question.correctAnswer === true ? 'text-success fw-bold' : ''}
                                />
                                <Form.Check
                                    type="radio"
                                    name={`question-${question._id}`}
                                    label="False"
                                    value="false"
                                    checked={answers[question._id] === false}
                                    onChange={() => handleAnswerChange(question._id, false)}
                                    disabled={showResults}
                                    className={showResults && question.correctAnswer === false ? 'text-success fw-bold' : ''}
                                />
                            </div>
                        )}

                        {/* Fill in Blank */}
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
                                        <small>
                                            <strong>Correct answers:</strong> {question.possibleAnswers.join(", ")}
                                        </small>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ))}

            {/* Submit Button */}
            {!showResults && (
                <div className="text-center mb-5">
                    <Button variant="primary" size="lg" onClick={handleSubmit}>
                        Submit Preview
                    </Button>
                </div>
            )}

            {showResults && (
                <div className="text-center mb-5">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setAnswers({});
                            setShowResults(false);
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
}