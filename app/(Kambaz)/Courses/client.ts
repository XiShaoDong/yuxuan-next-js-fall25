import axios from "axios";
import type { Course, Module, User } from "../types";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
export const fetchAllCourses = async () => {
    const { data } = await axios.get(COURSES_API);
    return data;
};

export const findMyCourses = async (user: Pick<User, "_id">) => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/${user._id}/courses`);
    return data;
};


export const createCourse = async (course: Omit<Course, "_id">) => {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
};

export const deleteCourse = async (id: string) => {
    const { data } = await axios
        .delete(`${COURSES_API}/${id}`);
    return data;
};


export const updateCourse = async (course: Course) => {
    const { data } = await axios
        .put(`${COURSES_API}/${course._id}`, course);
    return data;
};


export const deleteModule = async (courseId: string, moduleId: string) => {
    const response = await axios.delete(
        `${COURSES_API}/${courseId}/modules/${moduleId}`
    );
    return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
};

export const createModuleForCourse = async (
    courseId: string | string[],
    module: { name: string; course: string | string[] }
) => {
    const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
    const response = await axios.post(`${COURSES_API}/${normalizedCourseId}/modules`,
        module
    );
    return response.data;
};


export const updateModule = async (courseId: string, module: Module) => {
    const { data } = await axios.put(
        `${COURSES_API}/${courseId}/modules/${module._id}`,
        module
    );
    return data;
};


export const enrollIntoCourse = async (userId: string, courseId: string) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
};


export const findUsersForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
};




