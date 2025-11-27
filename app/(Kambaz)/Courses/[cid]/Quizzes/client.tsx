import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// Fetch all quizzes (for testing)
export const fetchAllQuizzes = async () => {
    const { data } = await axios.get(QUIZZES_API);
    return data;
};

// Find quizzes for a specific course
export const findQuizzesForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/course/${courseId}`,
        { headers: { 'Cache-Control': 'no-store' } }
    );
    return data;
};

// Find a single quiz by ID
export const findQuizById = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/${quizId}`,
        { headers: { 'Cache-Control': 'no-store' } }
    );
    return data;
};

// Create a new quiz
export const createQuiz = async (courseId: string, quiz: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${courseId}`,
        quiz
    );
    return data;
};

// Update a quiz
export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quiz._id}`,
        quiz
    );
    return data;
};

// Delete a quiz
export const deleteQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${QUIZZES_API}/${quizId}`
    );
    return data;
};

// Toggle publish/unpublish quiz
export const togglePublishQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quizId}/publish`
    );
    return data;
};

// Question operations
export const addQuestion = async (quizId: string, question: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quizId}/questions`,
        question
    );
    return data;
};

export const updateQuestion = async (quizId: string, questionId: string, question: any) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quizId}/questions/${questionId}`,
        question
    );
    return data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${QUIZZES_API}/${quizId}/questions/${questionId}`
    );
    return data;
};