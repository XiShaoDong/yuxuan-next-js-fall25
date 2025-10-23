"use client";
import { Button, ListGroupItem } from "react-bootstrap";
import { useDispatch, UseDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todoReducer";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
    const dispatch = useDispatch()
    return (
        <ListGroupItem key={todo.id} className="d-flex justify-content-between">
            {todo.title}
            <div>
                <Button onClick={() => dispatch(setTodo(todo))}
                    id="wd-set-todo-click"> Edit </Button>
                <Button onClick={() => dispatch(deleteTodo(todo.id))}
                    id="wd-delete-todo-click" className="btn btn-danger ms-2"> Delete </Button>

            </div>
        </ListGroupItem>);
}