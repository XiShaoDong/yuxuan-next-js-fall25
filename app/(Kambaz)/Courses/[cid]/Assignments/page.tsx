export default function Assignments() {
    return (
        <div id="wd-assignments">
            <input placeholder="Search for Assignments"
                id="wd-search-assignment" />
            <button id="wd-add-assignment-group">+ Group</button>
            <button id="wd-add-assignment">+ Assignment</button>
            <h3 id="wd-assignments-title">
                ASSIGNMENTS 40% of Total <button>+</button> </h3>
            <ul id="wd-assignment-list">
                <li className="wd-assignment-list-item">
                    <a href="/Courses/1234/Assignments/123"
                        className="wd-assignment-link" >
                        A1 - ENV + HTML
                    </a> <br />
                    Multiplee MOdules | <b>Not Available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100pts 
                </li>
                <li className="wd-assignment-list-item">
                    <a href="/Courses/1234/Assignments/123"
                        className="wd-assignment-link" >
                        A2 - CSS + BOOTSTRAP
                    </a> <br />
                    Multiplee MOdules | <b>Not Available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | 100pts 
                </li>
                <li className="wd-assignment-list-item">
                    <a href="/Courses/1234/Assignments/123"
                        className="wd-assignment-link" >
                        A3 - JAVASCRIPt + REACT
                    </a> <br />
                    Multiplee MOdules | <b>Not Available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | 100pts 
                </li>
            </ul>
        </div>
    );
}
