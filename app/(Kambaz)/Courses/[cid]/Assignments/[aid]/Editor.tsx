

export default function AssignmentEditor() {

    return (
        <div>
            <table style={{ border: "1" }}>
                <tbody>
                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-points">Points</label>
                        </td>
                        <td>
                            <input id="wd-points" defaultValue="100" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-group">Assignment Group</label>
                        </td>
                        <td>
                            <select id="wd-group" defaultValue={"ASSIGNMENTS"}>
                                <option value="ASSIGNMENTS" > ASSIGNMENTS</option>
                                <option value="PROJECTS" > PROJECTS</option>
                                <option value="QUIZ"> QUIZ</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-display-grade-as">Display Grade as </label>
                        </td>
                        <td>
                            <select id="wd-display-grade-as" defaultValue="Percentage" >
                                <option value="Percentage" > Percentage</option>
                                <option value="Points" > Points</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-submission-type">Submission Type</label>
                        </td>
                        <td>
                            <select id="wd-submission-type" defaultValue="Online">
                                <option value="Online" > Online</option>
                                <option value="In person" > In person</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top">
                        </td>
                        <td>
                            Online Entry Options<br />
                            <input id="wd-text-entry" type="checkbox"></input>
                            <label htmlFor="wd-text-entry">Text Entry</label><br />
                            <input id=" wd-website-url" type="checkbox"></input>
                            <label htmlFor=" wd-website-url">Website URL</label><br />
                            <input id="/wd-media-recordings" type="checkbox"></input>
                            <label htmlFor="/wd-media-recordings">Media Recordings</label><br />
                            <input id=" wd-student-annotation" type="checkbox"></input>
                            <label htmlFor=" wd-student-annotation">Student Annotation</label><br />
                            <input id=" wd-file-upload" type="checkbox"></input>
                            <label htmlFor=" wd-file-upload">File Uploads</label><br />
                        </td>
                    </tr>
                    <tr>
                        <td align="right" valign="top">
                            Assign
                        </td>
                        <td>
                            <label htmlFor="wd-assign-to">Assign to</label><br />
                            <input id="wd-assign-to" type="text" defaultValue="Everyone"></input><br />

                            <label id="wd-due-date	"> Due </label><br />
                            <input id="wd-due-date	" type="date" defaultValue="2025-09-10"></input><br />
                        </td>
                    </tr>
                    <tr>
                        <td> </td>
                        <td >
                            <label id="wd-available-from"> Available from</label><br />
                            <input id="wd-available-from" type="date" defaultValue="2025-09-11"></input>
                        </td>

                        <td>
                            <label id="wd-available-until"> Until</label><br />
                            <input id="wd-available-until" type="date" defaultValue="2025-09-20"></input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <div style={{ textAlign: 'right' }}>
                <button> Cancel</button>
                <button> Save</button>
            </div>

        </div>

    );
}