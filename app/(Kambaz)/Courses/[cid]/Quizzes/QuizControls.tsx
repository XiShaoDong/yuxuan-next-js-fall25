"use client"
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FaPlus, FaEllipsisV, FaSearch } from "react-icons/fa";
import { Button, Form, InputGroup } from "react-bootstrap";
import { addQuiz } from "./reducer";
import * as client from "./client";

export default function QuizControls() {
    const { cid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleAddQuiz = async () => {
        try {
            const newQuiz = {
                title: "Unnamed Quiz",
                description: "",
                quizType: "GradedQuiz",
                points: 0,
                assignmentGroup: "Quizzes",
                shuffleAnswers: true,
                timeLimit: 20,
                multipleAttempts: false,
                howManyAttempts: 1,
                showCorrectAnswers: "",
                accessCode: "",
                oneQuestionAtTime: true,
                webcamRequired: false,
                lockQuestionsAfterAnswering: false,
                published: false,
                questions: []
            };

            const createdQuiz = await client.createQuiz(cid as string, newQuiz);
            dispatch(addQuiz(createdQuiz));

            // Navigate to quiz editor
            router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}/Editor`);
        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Search Bar */}
            <InputGroup style={{ maxWidth: "300px" }}>
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Search for Quiz"
                    aria-label="Search quizzes"
                />
            </InputGroup>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
                <Button
                    variant="danger"
                    onClick={handleAddQuiz}
                    className="d-flex align-items-center"
                >
                    <FaPlus className="me-2" />
                    Quiz
                </Button>
                <Button
                    variant="secondary"
                    className="d-flex align-items-center"
                >
                    <FaEllipsisV />
                </Button>
            </div>
        </div>
    );
}