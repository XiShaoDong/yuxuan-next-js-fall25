import accountReducer, { setCurrentUser } from "../app/(Kambaz)/Account/reducer";
import coursesReducer, {
  addNewCourse,
  deleteCourse,
  updateCourse,
} from "../app/(Kambaz)/Courses/reducer";
import modulesReducer, {
  addModule,
  deleteModule,
  editModule,
  setModules,
  updateModule,
} from "../app/(Kambaz)/Courses/[cid]/Modules/reducer";
import assignmentsReducer, {
  addAssignment,
  deleteAssignment,
  updateAssignment,
} from "../app/(Kambaz)/Courses/[cid]/Assignments/reducer";
import quizzesReducer, {
  addQuestion,
  addQuiz,
  deleteQuestionFromQuiz,
  deleteQuiz,
  setCurrentQuiz,
  togglePublish,
  updateQuestionInQuiz,
  updateQuiz,
} from "../app/(Kambaz)/Courses/[cid]/Quizzes/reducer";
import type { Question } from "../app/(Kambaz)/types";

describe("Kambaz reducers", () => {
  it("updates the current user", () => {
    const nextState = accountReducer(undefined, setCurrentUser({ _id: "u1", username: "sam", password: "pw" }));

    expect(nextState.currentUser).toMatchObject({ _id: "u1", username: "sam" });
  });

  it("adds, updates and deletes courses", () => {
    const original = coursesReducer(undefined, { type: "@@INIT" });
    const added = coursesReducer(
      original,
      addNewCourse({ name: "AI", number: "CS5100", credits: 4, description: "AI", modules: [] })
    );
    const createdCourse = added.courses.at(-1);

    expect(added.courses).toHaveLength(original.courses.length + 1);
    expect(createdCourse).toMatchObject({ name: "AI", number: "CS5100" });

    const updated = coursesReducer(
      added,
      updateCourse({ ...createdCourse!, name: "Advanced AI" })
    );
    expect(updated.courses.find((course) => course._id === createdCourse?._id)?.name).toBe("Advanced AI");

    const deleted = coursesReducer(updated, deleteCourse(createdCourse!._id));
    expect(deleted.courses.find((course) => course._id === createdCourse?._id)).toBeUndefined();
  });

  it("manages modules without mutating state", () => {
    const added = modulesReducer(
      undefined,
      addModule({ name: "Week 1", course: "CS5000" })
    );
    const module = added.modules[0];

    expect(module).toMatchObject({ name: "Week 1", course: "CS5000" });

    const edited = modulesReducer(added, editModule(module._id));
    expect(edited.modules[0].editing).toBe(true);

    const updated = modulesReducer(edited, updateModule({ ...module, name: "Week 1 Updated" }));
    expect(updated.modules[0].name).toBe("Week 1 Updated");

    const removed = modulesReducer(updated, deleteModule(module._id));
    expect(removed.modules).toHaveLength(0);

    const reset = modulesReducer(removed, setModules([{ _id: "m2", name: "Intro", course: "CS5000", lessons: [] }]));
    expect(reset.modules[0]._id).toBe("m2");
  });

  it("creates assignments with sensible defaults", () => {
    const added = assignmentsReducer(
      undefined,
      addAssignment({ title: "HW1", course: "CS5000", description: "", startDate: "2025-09-01T12:00", dueDate: "2025-09-10T12:00" })
    );
    const beforeDeleteCount = added.assignments.length;
    const assignment = added.assignments.find((item) => item.title === "HW1") ?? added.assignments.at(-1);
    expect(assignment).toBeDefined();

    expect(assignment).toMatchObject({
      title: "HW1",
      course: "CS5000",
      startDate: "2025-09-01T12:00",
      dueDate: "2025-09-10T12:00",
      points: 200,
    });

    const updated = assignmentsReducer(added, updateAssignment({ ...assignment!, title: "HW1 revised" }));
    expect(updated.assignments.find((item) => item._id === assignment!._id)?.title).toBe("HW1 revised");

    const deleted = assignmentsReducer(updated, deleteAssignment(assignment!._id));
    expect(deleted.assignments).toHaveLength(beforeDeleteCount - 1);
    expect(deleted.assignments.find((item) => item._id === assignment!._id)).toBeUndefined();
  });

  it("supports quiz and question CRUD", () => {
    const quiz = {
      course: "CS5000",
      title: "Quiz 1",
      description: "",
      questions: [],
      published: false,
      _id: "q1",
    };

    const withQuiz = quizzesReducer(undefined, setCurrentQuiz(quiz));
    expect(withQuiz.currentQuiz).toMatchObject({ _id: "q1" });

    const { _id: _ignoredId, ...quizWithoutId } = quiz;
    const withAddedQuiz = quizzesReducer(withQuiz, addQuiz(quizWithoutId));
    expect(withAddedQuiz.quizzes).toHaveLength(1);

    const question: Question = { _id: "question-1", type: "trueFalse", title: "Q1", points: 10, question: "2 + 2 = 4", correctAnswer: true };
    const withQuestion = quizzesReducer(withAddedQuiz, addQuestion(question));
    expect(withQuestion.currentQuiz?.questions).toHaveLength(1);

    const updatedQuestion = quizzesReducer(
      withQuestion,
      updateQuestionInQuiz({ questionId: "question-1", question: { ...question, title: "Q1 updated" } })
    );
    expect(updatedQuestion.currentQuiz?.questions[0].title).toBe("Q1 updated");

    const removedQuestion = quizzesReducer(updatedQuestion, deleteQuestionFromQuiz("question-1"));
    expect(removedQuestion.currentQuiz?.questions).toHaveLength(0);

    const createdQuiz = withAddedQuiz.quizzes.find((item) => item.title === "Quiz 1") ?? withAddedQuiz.quizzes[0];
    const toggled = quizzesReducer(withAddedQuiz, togglePublish(createdQuiz._id));
    expect(toggled.quizzes[0].published).toBe(true);

    const updatedQuiz = quizzesReducer(
      withAddedQuiz,
      updateQuiz({ ...quiz, _id: createdQuiz._id, title: "Quiz 1 updated" })
    );
    expect(updatedQuiz.quizzes.find((item) => item._id === createdQuiz._id)?.title).toBe("Quiz 1 updated");

    const deletedQuiz = quizzesReducer(updatedQuiz, deleteQuiz(createdQuiz._id));
    expect(deletedQuiz.quizzes).toHaveLength(0);
  });
});
