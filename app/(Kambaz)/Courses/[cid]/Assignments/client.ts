import axios from "axios";
import type { Assignment } from "../../../types";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

// const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
export const fetchAllAssignments = async () => {
    const { data } = await axios.get(ASSIGNMENTS_API);
    return data;
};

export const findMyAssignments = async (courseId:string) => {
    const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/current/assignments/${courseId}`, { headers: { 'Cache-Control': 'no-store' } });
    return data;
};


export const createAssignment = async (
    courseId: string | string[],
    assignment: Partial<Omit<Assignment, "_id" | "course">> & {
        title: string;
        course: string | string[];
    }
) => {
    const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
    const { data } = await axiosWithCredentials.post(`${ASSIGNMENTS_API}/${normalizedCourseId}`, assignment);
    return data;
};

export const deleteAssignment= async (id: string) => {
    const { data } = await axios
        .delete(`${ASSIGNMENTS_API}/${id}`);
    return data;
};


export const updateAssignment = async (assignment: Assignment) => {
    const { data } = await axios
        .put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return data;
};




