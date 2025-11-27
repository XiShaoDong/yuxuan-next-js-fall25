import axios from "axios";

// 添加到现有的 client.tsx 文件末尾
const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;

// Get all attempts for a student on a quiz
export const getStudentAttempts = async (studentId: string, quizId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${ATTEMPTS_API}/student/${studentId}/quiz/${quizId}`
    );
    return data;
};

// Get latest attempt
export const getLatestAttempt = async (studentId: string, quizId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${ATTEMPTS_API}/student/${studentId}/quiz/${quizId}/latest`
    );
    return data;
};


// Submit quiz attempt
export const submitQuizAttempt = async (quizId: string, attemptData: any) => {
    const { data } = await axiosWithCredentials.post(
        `${ATTEMPTS_API}/quiz/${quizId}`,
        attemptData
    );
    return data;
};

// Get attempt by ID
export const getAttemptById = async (attemptId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${ATTEMPTS_API}/${attemptId}`
    );
    return data;
};

// Get all attempts for a quiz (faculty)
export const getQuizAttempts = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${ATTEMPTS_API}/quiz/${quizId}`
    );
    return data;
};