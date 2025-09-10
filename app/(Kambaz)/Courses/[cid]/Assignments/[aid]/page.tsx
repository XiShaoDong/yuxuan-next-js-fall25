export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label><br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description" cols={40} rows={10}>
        The assignment is available online Submit alink to the landing page of
        your Webapplication running on Netlify. The landingpage should include
        the following: Your fullname and section Links to each of the labassignments
        Link to the Kanbas applicationLinks to all relevant source code repositories
        The Kanbas application should include a linkto navigate back to the landing page.
      </textarea>
      <br />
      <table>
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
              <select id="wd-group">
                <option defaultValue="ASSIGNMENTS" > ASSIGNMENTS</option>
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
              <select id="wd-display-grade-as">
                <option defaultValue="Percentage" > Percentage</option>
                <option value="Points" > Points</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type">
                <option defaultValue="Online" > Online</option>
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
            <td>
              <label id="wd-available-from"> Availabel from</label><br />
              <input id="wd-available-from" type="date" defaultValue="2025-09-11"></input>
            </td>

            <td>
              <label id="wd-available-until"> Until</label><br />
              <input id="wd-available-until" type="date" defaultValue="2025-09-20"></input>
            </td>
          </tr>
        </tbody>
      </table>
      <hr/>
      <button> Cancel</button>
      <button> Save</button>
    </div>
  );
}
/// wd-points		    wd-group		          wd-display-grade-as	    wd-submission-type	  wd-text-entry
///   wd-website-url	
////wd-media-recordings
/// wd-student-annotation
/// wd-file-upload
///   wd-assign-to		wd-due-date		        wd-available-from	      wd-available-until	  wd-name
