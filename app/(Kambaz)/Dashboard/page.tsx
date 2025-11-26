"use client"
import { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardImg, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import Link from "next/link";
import * as client from "../Courses/client";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";

import { addUserToCourse, removeUserFromCourse } from "./client";

export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const dispatch = useDispatch();
  const imgStyle = { objectFit: "cover", objectPosition: "top center" } as const;

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY"||currentUser?.role === "AMIN";
  const [isEnrollPage, setIsEnrollPage] = useState(false);

  console.log("Dashbord", currentUser)
  const [course, setCourse] = useState<any>({
    _id: uuidv4(),
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description"
  });
  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses(currentUser);
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const courses = await client.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  }


  //@Lab5 
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c: any) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    })));
  };

  const onRemoveUser = async (course:any)=>{
    await removeUserFromCourse(currentUser,course)
  }

  const onAddUser = async (course:any)=>{
    await addUserToCourse(currentUser,course)
  }

  const onSwitchEnrollPage = async () => {
    if (isEnrollPage) {
      fetchCourses();
    } else {
      fetchAllCourses();
    }
    setIsEnrollPage(!isEnrollPage)
  }

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  if (!currentUser) return <p><Link href={`/Account/Signin`}>Please login</Link></p>;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">{isEnrollPage ? "Enrollment Page" : "Dashboard"}</h1> <hr />
      {isFaculty &&
        <div className="mb-2">
          <h5>New Course
            <button className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse} > Add </button>
            <button className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse} id="wd-update-course-click">
              Update </button>
          </h5><hr />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />

          <FormControl as="textarea" value={course.description} rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        </div>}
      {isFaculty ?
        (<h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>)
        :
        (<div className="d-flex justify-content-between align-items-center">
          <h2 id="wd-dashboard-published">
            {isEnrollPage ? "All Courses" : "Enrolled Courses"} ({courses.length})
          </h2>
          <button className="btn btn-primary"
            id="wd-enroll-course-click"
            onClick={(event) => {
              event.preventDefault();
              onSwitchEnrollPage()
            }}
          >
            Swtich to {isEnrollPage ? "Dashbord" : "Enrollment"} Page
          </button>

        </div>)
      }


      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: any) => (
            <Col className="wd-dashboard-course" key={course._id} style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src="/images/teslabot.jpg" variant="top" width="100%" height={160} style={imgStyle} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description} </CardText>
                    <Button variant="primary"> Go </Button>
                    {isFaculty &&
                      <>
                        <button onClick={(event) => {
                          event.preventDefault();
                          onDeleteCourse(course._id);
                        }} className="btn btn-danger float-end"
                          id="wd-delete-course-click">
                          Delete
                        </button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end" >
                          Edit
                        </button>
                      </>}
                    {isEnrollPage &&
                      <>
                        <button onClick={(event) => {
                          event.preventDefault();
                          onRemoveUser(course);
                        }} className="btn btn-danger float-end"
                          id="wd-delete-course-click">
                          Drop
                        </button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            onAddUser(course);
                          }}
                          className="btn btn-success me-2 float-end" >
                          Enroll
                        </button>

                      </>}

                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>);
}