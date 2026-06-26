"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash, FaCopy, FaCheckCircle, FaBan } from "react-icons/fa";

interface QuizContextMenuProps {
    quizId: string;
    published: boolean;  // ← 添加 published 属性
    onDelete: (quizId: string) => void;
    onTogglePublish: (quizId: string) => void;  // ← 添加 toggle 函数
}

export default function QuizContextMenu({ 
    quizId, 
    published, 
    onDelete, 
    onTogglePublish 
}: QuizContextMenuProps) {
    const { cid } = useParams();
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/Courses/${cid}/Quizzes/${quizId}/Editor`);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            onDelete(quizId);
        }
    };

    const handleCopy = () => {
        alert("Copy functionality coming soon!");
    };

    // ✅ 添加 toggle publish 处理
    const handleTogglePublish = () => {
        onTogglePublish(quizId);
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
                <Dropdown.Item onClick={handleTogglePublish}>
                    {published ? (
                        <>
                            <FaBan className="me-2" />
                            Unpublish
                        </>
                    ) : (
                        <>
                            <FaCheckCircle className="me-2" />
                            Publish
                        </>
                    )}
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