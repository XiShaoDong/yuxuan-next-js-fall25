import Editor from './Editor'

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name"><b>Assignment Name</b></label><br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description" cols={50} rows={10}>
        The assignment is available online Submit alink to the landing page of
        your Webapplication running on Netlify. The landingpage should include
        the following: Your fullname and section Links to each of the labassignments
        Link to the Kanbas applicNtionLinks to all relevant source code repositories
        The Kanbas application should include a linkto navigate back to the landing page.
      </textarea>
      <br />
      < Editor></Editor>
    </div>
    
  );
}
