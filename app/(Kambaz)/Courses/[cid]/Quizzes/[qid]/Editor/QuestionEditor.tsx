"use client"
import { useState, useRef, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

interface QuestionEditorProps {
    question: any;
    onSave: (question: any) => void;
    onCancel: () => void;
    isNew: boolean;
}

export default function QuestionEditor({ question, onSave, onCancel, isNew }: QuestionEditorProps) {
    const [editedQuestion, setEditedQuestion] = useState(question);
    const editorRef = useRef<HTMLDivElement>(null);

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = editedQuestion.question || "";
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setEditedQuestion({ ...editedQuestion, [field]: value });
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            setEditedQuestion({ ...editedQuestion, question: editorRef.current.innerHTML });
        }
    };

    // Text formatting functions
    const formatText = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleEditorChange();
    };

    const handleChoiceChange = (index: number, field: string, value: any) => {
        const newChoices = [...editedQuestion.choices];
        newChoices[index] = { ...newChoices[index], [field]: value };
        setEditedQuestion({ ...editedQuestion, choices: newChoices });
    };

    const handleAddChoice = () => {
        const newChoices = [...(editedQuestion.choices || []), { text: "", isCorrect: false }];
        setEditedQuestion({ ...editedQuestion, choices: newChoices });
    };

    const handleRemoveChoice = (index: number) => {
        const newChoices = editedQuestion.choices.filter((_: any, i: number) => i !== index);
        setEditedQuestion({ ...editedQuestion, choices: newChoices });
    };

    const handleAddPossibleAnswer = () => {
        const newAnswers = [...(editedQuestion.possibleAnswers || []), ""];
        setEditedQuestion({ ...editedQuestion, possibleAnswers: newAnswers });
    };

    const handleRemovePossibleAnswer = (index: number) => {
        const newAnswers = editedQuestion.possibleAnswers.filter((_: any, i: number) => i !== index);
        setEditedQuestion({ ...editedQuestion, possibleAnswers: newAnswers });
    };

    const handlePossibleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...editedQuestion.possibleAnswers];
        newAnswers[index] = value;
        setEditedQuestion({ ...editedQuestion, possibleAnswers: newAnswers });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Capture final editor content before saving
        if (editorRef.current) {
            editedQuestion.question = editorRef.current.innerHTML;
        }
        onSave(editedQuestion);
    };

    return (
        <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">{isNew ? "New Question" : "Edit Question"}</h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Question Type */}
                    <Form.Group className="mb-3">
                        <Form.Label>Question Type</Form.Label>
                        <Form.Select
                            value={editedQuestion.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="trueFalse">True/False</option>
                            <option value="fillInBlank">Fill in the Blank</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedQuestion.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Points */}
                    <Form.Group className="mb-3">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                            type="number"
                            value={editedQuestion.points}
                            onChange={(e) => handleChange("points", parseInt(e.target.value))}
                            min="0"
                            required
                        />
                    </Form.Group>

                    {/* Question Text - WYSIWYG Editor */}
                    <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>
                        
                        {/* WYSIWYG Toolbar */}
                        <div className="border rounded-top p-2 bg-light d-flex gap-2 flex-wrap">
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('bold')}
                                type="button"
                            >
                                <strong>B</strong>
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('italic')}
                                type="button"
                            >
                                <em>I</em>
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('underline')}
                                type="button"
                            >
                                <u>U</u>
                            </Button>
                            <div className="border-start mx-1"></div>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('insertUnorderedList')}
                                type="button"
                            >
                                • List
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('insertOrderedList')}
                                type="button"
                            >
                                1. List
                            </Button>
                            <div className="border-start mx-1"></div>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('formatBlock', 'h3')}
                                type="button"
                            >
                                Heading
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={() => formatText('formatBlock', 'p')}
                                type="button"
                            >
                                Paragraph
                            </Button>
                        </div>

                        {/* Editor Area */}
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleEditorChange}
                            className="form-control"
                            style={{ 
                                minHeight: "150px", 
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0
                            }}
                        />
                    </Form.Group>

                    {/* Multiple Choice Options */}
                    {editedQuestion.type === "multipleChoice" && (
                        <div className="mb-3">
                            <Form.Label>Choices</Form.Label>
                            <small className="text-muted ms-2">(Select the correct answer)</small>
                            {editedQuestion.choices?.map((choice: any, index: number) => (
                                <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="correctChoice"
                                        checked={choice.isCorrect}
                                        onChange={() => {
                                            const newChoices = editedQuestion.choices.map((c: any, i: number) => ({
                                                ...c,
                                                isCorrect: i === index
                                            }));
                                            setEditedQuestion({ ...editedQuestion, choices: newChoices });
                                        }}
                                        label=""
                                    />
                                    <Form.Control
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) => handleChoiceChange(index, "text", e.target.value)}
                                        placeholder={`Choice ${index + 1}`}
                                        required
                                        className="flex-grow-1"
                                    />
                                    {editedQuestion.choices.length > 2 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveChoice(index)}
                                            type="button"
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={handleAddChoice}
                                type="button"
                            >
                                <FaPlus className="me-1" />
                                Add Choice
                            </Button>

                            {/* Show Correct Answer */}
                            <div className="mt-3 p-2 bg-light border rounded">
                                <strong>Correct Answer: </strong>
                                <span className="text-success">
                                    {editedQuestion.choices?.find((c: any) => c.isCorrect)?.text || "Not selected"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* True/False Options */}
                    {editedQuestion.type === "trueFalse" && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Correct Answer</Form.Label>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        label="True"
                                        name="trueFalseAnswer"
                                        checked={editedQuestion.correctAnswer === true}
                                        onChange={() => handleChange("correctAnswer", true)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="False"
                                        name="trueFalseAnswer"
                                        checked={editedQuestion.correctAnswer === false}
                                        onChange={() => handleChange("correctAnswer", false)}
                                    />
                                </div>
                            </Form.Group>

                            {/* Show Correct Answer */}
                            <div className="p-2 bg-light border rounded">
                                <strong>Correct Answer: </strong>
                                <span className="text-success">
                                    {editedQuestion.correctAnswer === true ? "True" : 
                                     editedQuestion.correctAnswer === false ? "False" : "Not selected"}
                                </span>
                            </div>
                        </>
                    )}

                    {/* Fill in the Blank Options */}
                    {editedQuestion.type === "fillInBlank" && (
                        <div className="mb-3">
                            <Form.Label>Possible Correct Answers</Form.Label>
                            {editedQuestion.possibleAnswers?.map((answer: string, index: number) => (
                                <div key={index} className="d-flex gap-2 mb-2">
                                    <Form.Control
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                                        placeholder={`Answer ${index + 1}`}
                                        required
                                    />
                                    {editedQuestion.possibleAnswers.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemovePossibleAnswer(index)}
                                            type="button"
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={handleAddPossibleAnswer}
                                type="button"
                            >
                                <FaPlus className="me-1" />
                                Add Answer
                            </Button>
                            
                            <Form.Group className="mt-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Case Sensitive"
                                    checked={editedQuestion.caseSensitive}
                                    onChange={(e) => handleChange("caseSensitive", e.target.checked)}
                                />
                            </Form.Group>

                            {/* Show Correct Answers */}
                            <div className="mt-3 p-2 bg-light border rounded">
                                <strong>Correct Answers: </strong>
                                <span className="text-success">
                                    {editedQuestion.possibleAnswers?.filter((a: string) => a.trim()).join(", ") || "None"}
                                </span>
                                {editedQuestion.caseSensitive && (
                                    <span className="text-muted ms-2">(Case sensitive)</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button variant="secondary" onClick={onCancel} type="button">
                            <FaTimes className="me-2" />
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <FaSave className="me-2" />
                            {isNew ? "Add Question" : "Update Question"}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}