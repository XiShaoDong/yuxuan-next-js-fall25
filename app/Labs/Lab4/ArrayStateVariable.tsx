import { useState } from "react";
export default function ArrayStateVariable() {
    const [array, setArray] = useState([1, 2, 3, 4, 5]);
    const addElement = () => {
        setArray([...array, Math.floor(Math.random() * 100)]);
    };
    const deleteElement = (index: number) => {
        setArray(array.filter((item, i) => i !== index));
    };
    return (
        <div id="wd-array-state-variables" className="col-auto">
            <h2>Array State Variable</h2>
            <button onClick={addElement} className="btn btn-success">Add Element</button>
            <ul className="fs-2 list-unstyled">
                {array.map((item, index) => (
                    <li className="d-flex justify-content-between mt-2"key={index}> {item}
                        <button className="btn btn-danger " onClick={() => deleteElement(index)}>
                            Delete</button>
                    </li>))}
            </ul>
            <hr />
        </div>);
}