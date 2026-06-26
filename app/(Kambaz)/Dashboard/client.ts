import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ENROLL_API = `${HTTP_SERVER}/api/enrollment`;

export const addUserToCourse = async (user:any, course:any) => {
    const { data } = await axios.post(`${ENROLL_API}/${user._id}/${course._id}`);
    return data;
};


export const removeUserFromCourse = async (user:any, course:any) => {
    const { data } = await axios
        .delete(`${ENROLL_API}/${user._id}/${course._id}`);
    return data;
};