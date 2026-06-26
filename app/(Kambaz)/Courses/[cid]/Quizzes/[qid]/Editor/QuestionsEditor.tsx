"use client"
import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import QuestionEditor from "./QuestionEditor";
import { useParams } from "next/navigation";
import * as client from "../../client";

interface QuestionsEditorProps {
    quiz: any;
    setQuiz: (quiz: any) => void;
}

export default function QuestionsEditor({ quiz, setQuiz }: QuestionsEditorProps) {
    const { qid } = useParams();
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const handleAddQuestion = () => {
        const newQuestion = {
            type: "multipleChoice",
            title: "New Question",
            points: 10,
            question: "",
            choices: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false }
            ]
        };
        setEditingQuestion(newQuestion);
        setIsCreatingNew(true);
    };

    const handleEditQuestion = (question: any) => {
        setEditingQuestion(question);
        setIsCreatingNew(false);
    };

    const handleSaveQuestion = async (question: any) => {
        try {
            if (isCreatingNew) {
                // Add new question
                const newQuestion = await client.addQuestion(qid as string, question);
                setQuiz({
                    ...quiz,
                    questions: [...quiz.questions, newQuestion],
                    points: quiz.points + question.points
                });
            } else {
                // Update existing question
                await client.updateQuestion(qid as string, question._id, question);
                setQuiz({
                    ...quiz,
                    questions: quiz.questions.map((q: any) =>
                        q._id === question._id ? question : q
                    )
                });
            }
            setEditingQuestion(null);
            setIsCreatingNew(false);
        } catch (error) {
            console.error("Error saving question:", error);
            alert("Failed to save question");
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        
        try {
            await client.deleteQuestion(qid as string, questionId);
            const updatedQuestions = quiz.questions.filter((q: any) => q._id !== questionId);
            const newPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
            setQuiz({
                ...quiz,
                questions: updatedQuestions,
                points: newPoints
            });
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete question");
        }
    };

    const handleCancelEdit = () => {
        setEditingQuestion(null);
        setIsCreatingNew(false);
    };

    const getQuestionTypeLabel = (type: string) => {
        switch (type) {
            case "multipleChoice": return "Multiple Choice";
            case "trueFalse": return "True/False";
            case "fillInBlank": return "Fill in the Blank";
            default: return type;
        }
    };

    return (
        <div id="wd-questions-editor">
            {/* Header with Points Total */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Questions</h5>
                <div>
                    <strong>Total Points: {quiz.points}</strong>
                </div>
            </div>

            {/* Add New Question Button */}
            <Button 
                variant="danger" 
                className="mb-3"
                onClick={handleAddQuestion}
            >
                <FaPlus className="me-2" />
                New Question
            </Button>

            {/* Question Editor (if editing) */}
            {editingQuestion && (
                <div className="mb-4">
                    <QuestionEditor
                        question={editingQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                        isNew={isCreatingNew}
                    />
                </div>
            )}

            {/* Questions List */}
            {quiz.questions && quiz.questions.length > 0 ? (
                <ListGroup>
                    {quiz.questions.map((question: any, index: number) => (
                        <ListGroupItem key={question._id} className="d-flex justify-content-between align-items-center">
                            <div className="flex-grow-1">
                                <strong>Question {index + 1}</strong>
                                <div className="text-muted small">
                                    {getQuestionTypeLabel(question.type)} | {question.points} pts
                                </div>
                                <div className="mt-1">{question.title}</div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question._id)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            ) : (
                <div className="text-center text-muted my-5">
                    <p>No questions yet. Click "New Question" to add one.</p>
                </div>
            )}
        </div>
    );
}