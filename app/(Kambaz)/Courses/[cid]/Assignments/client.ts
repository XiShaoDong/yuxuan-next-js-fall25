import axios from "axios";
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


export const createAssignment = async (courseId:string, assignment: any) => {
    const { data } = await axiosWithCredentials.post(`${ASSIGNMENTS_API}/${courseId}`, assignment);
    return data;
};

export const deleteAssignment= async (id: string) => {
    const { data } = await axios
        .delete(`${ASSIGNMENTS_API}/${id}`);
    return data;
};


export const updateAssignment = async (assignment: any) => {
    const { data } = await axios
        .put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return data;
};




