import { Button, FormControl, ListGroupItem } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todoReducer";

export default function TodoForm() {
    const { todo } = useSelector((state: any) => state.todoReducer);
    const dispatch = useDispatch();
    return (
        <ListGroupItem className="d-flex justify-content-between">
            <FormControl className="w-50" value={todo.title}
                onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))} />
            <div>
                <Button className="btn btn-warning" onClick={() => dispatch(updateTodo(todo))}
                    id="wd-update-todo-click"> Update </Button>
                <Button className="btn btn-success ms-2" onClick={() => dispatch(addTodo(todo))}
                    id="wd-add-todo-click"> Add </Button>
            </div>


        </ListGroupItem>
    );
}
