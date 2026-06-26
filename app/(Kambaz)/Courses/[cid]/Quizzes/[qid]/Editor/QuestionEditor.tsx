"use client"
import { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Badge, Alert } from "react-bootstrap";
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
        
        // Initialize blanks array for fillInBlank if it doesn't exist
        if (editedQuestion.type === "fillInBlank" && !editedQuestion.blanks) {
            setEditedQuestion({
                ...editedQuestion,
                blanks: [{
                    id: "blank0",
                    possibleAnswers: [""],
                    caseSensitive: false
                }]
            });
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

    // ========== NEW: Fill in the Blank with Multiple Blanks ==========
    
    // Add a new blank
    const handleAddBlank = () => {
        const blanks = editedQuestion.blanks || [];
        const newBlankId = `blank${blanks.length}`;
        const newBlanks = [...blanks, {
            id: newBlankId,
            possibleAnswers: [""],
            caseSensitive: false
        }];
        setEditedQuestion({ ...editedQuestion, blanks: newBlanks });
    };

    // Remove a blank
    const handleRemoveBlank = (index: number) => {
        const newBlanks = editedQuestion.blanks.filter((_: any, i: number) => i !== index);
        // Re-index blank IDs
        const reindexedBlanks = newBlanks.map((blank: any, i: number) => ({
            ...blank,
            id: `blank${i}`
        }));
        setEditedQuestion({ ...editedQuestion, blanks: reindexedBlanks });
    };

    // Update blank's case sensitivity
    const handleBlankCaseSensitiveChange = (blankIndex: number, value: boolean) => {
        const newBlanks = [...editedQuestion.blanks];
        newBlanks[blankIndex] = { ...newBlanks[blankIndex], caseSensitive: value };
        setEditedQuestion({ ...editedQuestion, blanks: newBlanks });
    };

    // Add a possible answer to a specific blank
    const handleAddPossibleAnswerToBlank = (blankIndex: number) => {
        const newBlanks = [...editedQuestion.blanks];
        newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: [...newBlanks[blankIndex].possibleAnswers, ""]
        };
        setEditedQuestion({ ...editedQuestion, blanks: newBlanks });
    };

    // Remove a possible answer from a specific blank
    const handleRemovePossibleAnswerFromBlank = (blankIndex: number, answerIndex: number) => {
        const newBlanks = [...editedQuestion.blanks];
        newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: newBlanks[blankIndex].possibleAnswers.filter((_: any, i: number) => i !== answerIndex)
        };
        setEditedQuestion({ ...editedQuestion, blanks: newBlanks });
    };

    // Update a possible answer for a specific blank
    const handlePossibleAnswerChangeForBlank = (blankIndex: number, answerIndex: number, value: string) => {
        const newBlanks = [...editedQuestion.blanks];
        const newAnswers = [...newBlanks[blankIndex].possibleAnswers];
        newAnswers[answerIndex] = value;
        newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: newAnswers
        };
        setEditedQuestion({ ...editedQuestion, blanks: newBlanks });
    };

    // Insert blank placeholder into question text
    const handleInsertBlankPlaceholder = (blankId: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const placeholder = document.createElement('span');
                placeholder.className = 'blank-placeholder bg-warning px-2 py-1 rounded';
                placeholder.contentEditable = 'false';
                placeholder.textContent = `[${blankId}]`;
                range.insertNode(placeholder);
                range.collapse(false);
                handleEditorChange();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Capture final editor content before saving
        if (editorRef.current) {
            editedQuestion.question = editorRef.current.innerHTML;
        }

        // Validation for fillInBlank
        if (editedQuestion.type === "fillInBlank") {
            const blanks = editedQuestion.blanks || [];
            
            // Check if all blanks have at least one answer
            const hasEmptyBlanks = blanks.some((blank: any) => 
                !blank.possibleAnswers || blank.possibleAnswers.length === 0 || 
                blank.possibleAnswers.every((a: string) => !a.trim())
            );
            
            if (hasEmptyBlanks) {
                alert("Each blank must have at least one possible answer!");
                return;
            }

            // Check if question text contains all blank placeholders
            const questionText = editorRef.current?.textContent || "";
            const missingBlanks = blanks.filter((blank: any) => 
                !questionText.includes(`[${blank.id}]`)
            );
            
            if (missingBlanks.length > 0) {
                alert(`Question text is missing placeholders for: ${missingBlanks.map((b: any) => b.id).join(", ")}`);
                return;
            }
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
                            onChange={(e) => {
                                const newType = e.target.value;
                                const updates: any = { type: newType };
                                
                                // Initialize fillInBlank structure when switching to it
                                if (newType === "fillInBlank" && !editedQuestion.blanks) {
                                    updates.blanks = [{
                                        id: "blank0",
                                        possibleAnswers: [""],
                                        caseSensitive: false
                                    }];
                                }
                                
                                setEditedQuestion({ ...editedQuestion, ...updates });
                            }}
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
                            // type="text"
                            as="textarea"
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
                                        // type="text"
                                        as="textarea"
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

                    {/* Fill in the Blank Options - NEW IMPLEMENTATION */}
                    {editedQuestion.type === "fillInBlank" && (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Form.Label className="mb-0">Blanks Configuration</Form.Label>
                                <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={handleAddBlank}
                                    type="button"
                                >
                                    <FaPlus className="me-1" />
                                    Add Blank
                                </Button>
                            </div>

                            <Alert variant="info" className="small">
                                <strong>Instructions:</strong>
                                <ul className="mb-0 mt-2">
                                    <li>Create blanks below and click "Insert" to add them to your question text</li>
                                    {/* <li>Each blank can have multiple correct answers</li> */}
                                    <li>Blanks will appear as <Badge bg="warning" text="dark">[blank0]</Badge>, <Badge bg="warning" text="dark">[blank1]</Badge>, etc.</li>
                                </ul>
                            </Alert>

                            {editedQuestion.blanks?.map((blank: any, blankIndex: number) => (
                                <Card key={blank.id} className="mb-3 border-secondary">
                                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                        <span>
                                            <Badge bg="warning" text="dark" className="me-2">[{blank.id}]</Badge>
                                            <strong>Blank {blankIndex + 1}</strong>
                                        </span>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleInsertBlankPlaceholder(blank.id)}
                                                type="button"
                                            >
                                                Insert into Question
                                            </Button>
                                            {editedQuestion.blanks.length > 1 && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveBlank(blankIndex)}
                                                    type="button"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* Possible Answers for this blank */}
                                        <Form.Label className="small">Possible Correct Answers</Form.Label>
                                        {blank.possibleAnswers?.map((answer: string, answerIndex: number) => (
                                            <div key={answerIndex} className="d-flex gap-2 mb-2">
                                                <Form.Control
                                                    // type="text"
                                                    as="textarea"
                                                    rows={2}
                                                    value={answer}
                                                    onChange={(e) => handlePossibleAnswerChangeForBlank(blankIndex, answerIndex, e.target.value)}
                                                    placeholder={`Answer ${answerIndex + 1}`}
                                                    size="sm"
                                                    required
                                                />
                                                {blank.possibleAnswers.length > 1 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemovePossibleAnswerFromBlank(blankIndex, answerIndex)}
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
                                            onClick={() => handleAddPossibleAnswerToBlank(blankIndex)}
                                            type="button"
                                        >
                                            <FaPlus className="me-1" />
                                            Add Answer
                                        </Button>

                                        {/* Case Sensitive Option */}
                                        <Form.Check
                                            type="checkbox"
                                            label="Case Sensitive"
                                            checked={blank.caseSensitive}
                                            onChange={(e) => handleBlankCaseSensitiveChange(blankIndex, e.target.checked)}
                                            className="mt-2"
                                        />

                                        {/* Show Answers Preview */}
                                        <div className="mt-2 p-2 bg-light border rounded small">
                                            <strong>Accepts: </strong>
                                            <span className="text-success">
                                                {blank.possibleAnswers?.filter((a: string) => a.trim()).join(", ") || "No answers yet"}
                                            </span>
                                            {blank.caseSensitive && (
                                                <Badge bg="secondary" className="ms-2">Case sensitive</Badge>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
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