"use client"
import { useRef, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

interface DetailsEditorProps {
    quiz: any;
    onQuizChange: (field: string, value: any) => void;
}

export default function DetailsEditor({ quiz, onQuizChange }: DetailsEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = quiz.description || "";
        }
    }, []);

    const handleEditorChange = () => {
        if (editorRef.current) {
            onQuizChange("description", editorRef.current.innerHTML);
        }
    };

    // Text formatting functions
    const formatText = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleEditorChange();
    };
    
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        return dateString.slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };

    return (
        <div id="wd-quiz-details-editor">
            <Form>
                {/* Title */}
                <Form.Group className="mb-3" controlId="wd-quiz-title">
                    <Form.Control
                        type="text"
                        value={quiz.title}
                        onChange={(e) => onQuizChange("title", e.target.value)}
                        placeholder="Quiz Title"
                    />
                </Form.Group>

                {/* Description - WYSIWYG */}
                <Form.Group className="mb-3" controlId="wd-quiz-description">
                    {/* WYSIWYG Toolbar */}
                    <div className="border rounded-top p-2 bg-light d-flex gap-2 flex-wrap">
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('bold')}
                            type="button"
                        >
                            <strong>B</strong>
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('italic')}
                            type="button"
                        >
                            <em>I</em>
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('underline')}
                            type="button"
                        >
                            <u>U</u>
                        </button>
                        <div className="border-start mx-1"></div>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('insertUnorderedList')}
                            type="button"
                        >
                            • List
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('insertOrderedList')}
                            type="button"
                        >
                            1. List
                        </button>
                        <div className="border-start mx-1"></div>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('formatBlock', 'h3')}
                            type="button"
                        >
                            Heading
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => formatText('formatBlock', 'p')}
                            type="button"
                        >
                            Paragraph
                        </button>
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

                <hr />

                {/* Quiz Type */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-quiz-type">
                    <Form.Label column sm={2} className="text-end mb-0">Quiz Type</Form.Label>
                    <Col sm={10}>
                        <Form.Select
                            value={quiz.quizType}
                            onChange={(e) => onQuizChange("quizType", e.target.value)}
                        >
                            <option value="GradedQuiz">Graded Quiz</option>
                            <option value="PracticeQuiz">Practice Quiz</option>
                            <option value="GradedSurvey">Graded Survey</option>
                            <option value="UngradedSurvey">Ungraded Survey</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* Points */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-quiz-points">
                    <Form.Label column sm={2} className="text-end mb-0">Points</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="number"
                            value={quiz.points}
                            onChange={(e) => onQuizChange("points", parseInt(e.target.value) || 0)}
                            min="0"
                        />
                    </Col>
                </Form.Group>

                {/* Assignment Group */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-assignment-group">
                    <Form.Label column sm={2} className="text-end mb-0">Assignment Group</Form.Label>
                    <Col sm={10}>
                        <Form.Select
                            value={quiz.assignmentGroup}
                            onChange={(e) => onQuizChange("assignmentGroup", e.target.value)}
                        >
                            <option value="Quizzes">Quizzes</option>
                            <option value="Exams">Exams</option>
                            <option value="Assignments">Assignments</option>
                            <option value="Project">Project</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* Shuffle Answers */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-shuffle-answers">
                    <Form.Label column sm={2} className="text-end mb-0">Shuffle Answers</Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            type="checkbox"
                            label="Yes"
                            checked={quiz.shuffleAnswers}
                            onChange={(e) => onQuizChange("shuffleAnswers", e.target.checked)}
                        />
                    </Col>
                </Form.Group>

                <hr />

                {/* Time Limit */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-time-limit">
                    <Form.Label column sm={2} className="text-end mb-0">Time Limit</Form.Label>
                    <Col sm={10}>
                        <div className="input-group">
                            <Form.Control
                                type="number"
                                value={quiz.timeLimit}
                                onChange={(e) => onQuizChange("timeLimit", parseInt(e.target.value) || 0)}
                                min="0"
                            />
                            <span className="input-group-text">Minutes</span>
                        </div>
                    </Col>
                </Form.Group>

                {/* Multiple Attempts */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-multiple-attempts">
                    <Form.Label column sm={2} className="text-end mb-0">Multiple Attempts</Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            type="checkbox"
                            label="Allow Multiple Attempts"
                            checked={quiz.multipleAttempts}
                            onChange={(e) => onQuizChange("multipleAttempts", e.target.checked)}
                        />
                    </Col>
                </Form.Group>

                {/* How Many Attempts */}
                {quiz.multipleAttempts && (
                    <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-how-many-attempts">
                        <Form.Label column sm={2} className="text-end mb-0">How Many Attempts</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="number"
                                value={quiz.howManyAttempts}
                                onChange={(e) => onQuizChange("howManyAttempts", parseInt(e.target.value) || 1)}
                                min="1"
                            />
                        </Col>
                    </Form.Group>
                )}

                {/* Show Correct Answers */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-show-correct-answers">
                    <Form.Label column sm={2} className="text-end mb-0">Show Correct Answers</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={quiz.showCorrectAnswers}
                            onChange={(e) => onQuizChange("showCorrectAnswers", e.target.value)}
                            placeholder="e.g., Immediately, After submission, Never"
                        />
                    </Col>
                </Form.Group>

                {/* Access Code */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-access-code">
                    <Form.Label column sm={2} className="text-end mb-0">Access Code</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={quiz.accessCode}
                            onChange={(e) => onQuizChange("accessCode", e.target.value)}
                            placeholder="Leave blank for no access code"
                        />
                    </Col>
                </Form.Group>

                {/* One Question at a Time */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-one-question">
                    <Form.Label column sm={2} className="text-end mb-0">One Question at a Time</Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            type="checkbox"
                            label="Yes"
                            checked={quiz.oneQuestionAtTime}
                            onChange={(e) => onQuizChange("oneQuestionAtTime", e.target.checked)}
                        />
                    </Col>
                </Form.Group>

                {/* Webcam Required */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-webcam-required">
                    <Form.Label column sm={2} className="text-end mb-0">Webcam Required</Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            type="checkbox"
                            label="Yes"
                            checked={quiz.webcamRequired}
                            onChange={(e) => onQuizChange("webcamRequired", e.target.checked)}
                        />
                    </Col>
                </Form.Group>

                {/* Lock Questions After Answering */}
                <Form.Group as={Row} className="mb-2 align-items-center" controlId="wd-lock-questions">
                    <Form.Label column sm={2} className="text-end mb-0">Lock Questions After Answering</Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            type="checkbox"
                            label="Yes"
                            checked={quiz.lockQuestionsAfterAnswering}
                            onChange={(e) => onQuizChange("lockQuestionsAfterAnswering", e.target.checked)}
                        />
                    </Col>
                </Form.Group>

                <hr />

                {/* Assign Section */}
                <h5 className="mb-3">Assign</h5>

                <Form.Group as={Row} className="mb-3" controlId="wd-assign-to">
                    <Form.Label column sm={2} className="text-end">Assign to</Form.Label>
                    <Col sm={10}>
                        <div className="border rounded p-3 bg-light">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Assign to</Form.Label>
                                <Form.Control
                                    type="text"
                                    value="Everyone"
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Due</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formatDateForInput(quiz.dueDate)}
                                            onChange={(e) => onQuizChange("dueDate", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">For</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value="Everyone"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-0">
                                        <Form.Label className="fw-bold">Available from</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formatDateForInput(quiz.availableDate)}
                                            onChange={(e) => onQuizChange("availableDate", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-0">
                                        <Form.Label className="fw-bold">Until</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formatDateForInput(quiz.untilDate)}
                                            onChange={(e) => onQuizChange("untilDate", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}