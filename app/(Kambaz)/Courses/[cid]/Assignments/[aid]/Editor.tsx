

export default function AssignmentEditor(){

    return (
        <div>
            <h1>Assignment Name</h1>

            <input  type="text" placeholder="A1 - ENV + HTML"></input>

            <textarea cols={40} rows={10}>The assignment is available online Submit alink to the landing page of your Webapplication running on Netlify. The landingpage should include the following: Your fullname and section Links to each of the labassignments Link to the Kanbas applicationLinks to all relevant source code repositoriesThe Kanbas application should include a linkto navigate back to the landing page.</textarea>

            <label htmlFor="wd-points"></label>
            <input id="wd-points" type="number" placeholder="100"></input>
        </div>
        
    );
}