"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash, FaCopy } from "react-icons/fa";

interface QuizContextMenuProps {
    quizId: string;
    onDelete: (quizId: string) => void;
}

export default function QuizContextMenu({ quizId, onDelete }: QuizContextMenuProps) {
    const { cid } = useParams();
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        router.push(`/Courses/${cid}/Quizzes/${quizId}/Editor`);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            onDelete(quizId);
        }
    };

    const handleCopy = () => {
        // TODO optional: Implement copy functionality 
        alert("Copy functionality coming soon!");
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle 
                variant="link" 
                id={`dropdown-${quizId}`}
                className="text-dark p-0 border-0"
            >
                <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleEdit}>
                    <FaEdit className="me-2" />
                    Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDelete} className="text-danger">
                    <FaTrash className="me-2" />
                    Delete
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleCopy}>
                    <FaCopy className="me-2" />
                    Copy
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}