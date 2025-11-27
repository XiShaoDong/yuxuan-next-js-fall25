"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Nav, Tab, Button } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import * as client from "../../client";
import { updateQuiz as updateQuizAction } from "../../reducer";
import DetailsEditor from "./DetailsEditor"
import QuestionsEditor from "./QuestionsEditor";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");

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

    const handleSave = async () => {
        try {
            await client.updateQuiz(quiz);
            dispatch(updateQuizAction(quiz));
            router.push(`/Courses/${cid}/Quizzes/${qid}`);
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to save quiz");
        }
    };

    const handleSaveAndPublish = async () => {
        try {
            const updatedQuiz = { ...quiz, published: true };
            await client.updateQuiz(updatedQuiz);
            dispatch(updateQuizAction(updatedQuiz));
            router.push(`/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error saving and publishing quiz:", error);
            alert("Failed to save and publish quiz");
        }
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const handleQuizChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    if (loading) return <div className="text-center my-5"><h4>Loading...</h4></div>;
    if (!quiz) return <div className="text-center my-5"><h4>Quiz not found</h4></div>;

    return (
        <div id="wd-quiz-editor" className="container mt-4">
            {/* Action Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Edit Quiz</h3>
                <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={handleCancel}>
                        <FaTimes className="me-2" />
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        <FaSave className="me-2" />
                        Save
                    </Button>
                    <Button variant="success" onClick={handleSaveAndPublish}>
                        <FaSave className="me-2" />
                        Save & Publish
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="details">Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="questions">Questions</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="details">
                        <DetailsEditor
                            quiz={quiz}
                            onQuizChange={handleQuizChange}
                        />
                    </Tab.Pane>

                    <Tab.Pane eventKey="questions">
                        <QuestionsEditor
                            quiz={quiz}
                            setQuiz={setQuiz}
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
}