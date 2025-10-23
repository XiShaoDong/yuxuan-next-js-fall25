import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
export default function TodoList() {
  const {todos} = useSelector((state: any) => state.todoReducer);
  return (
    <div>
      <h2>Todo List</h2>

      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem
            todo={todo} />
        ))}
      </ListGroup>

    </div>
  );
}

