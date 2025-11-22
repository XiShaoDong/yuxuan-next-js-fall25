import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

// const COURSES_API = `${HTTP_SERVER}/api/courses`;
const Quiz_API = `${HTTP_SERVER}/api/quizzes`;
export const fetchAllQuizzes = async () => {
    const { data } = await axios.get(Quiz_API);
    return data;
};

export const findMyQuizzes = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${Quiz_API}/current/quizzes/${courseId}`);
    return data;
};


export const createQuizzes = async (courseId: string, quiz: any) => {
    const { data } = await axiosWithCredentials.post(`${Quiz_API}/${courseId}`, quiz);
    return data;
};

export const deleteQuizzes = async (QuizId: string) => {
    const { data } = await axios
        .delete(`${Quiz_API}/${QuizId}`);
    return data;
};


export const updateQuizzes = async (quiz: any) => {
    const { data } = await axios
        .put(`${Quiz_API}/${quiz._id}`, quiz);
    return data;
};




