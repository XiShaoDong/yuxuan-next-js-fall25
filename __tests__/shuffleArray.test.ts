import { shuffleArray } from "../app/(Kambaz)/Courses/[cid]/Quizzes/[qid]/Attempt/utils";

describe("shuffleArray", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("keeps the same items and length", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const input = ["a", "b", "c", "d"];
    const output = shuffleArray(input);

    expect(output).toHaveLength(input.length);
    expect(output).toEqual(expect.arrayContaining(input));
    expect(input).toEqual(["a", "b", "c", "d"]);
  });

  it("produces a deterministic order when Math.random is mocked", () => {
    const randomValues = [0.9, 0.1, 0.4];
    let index = 0;

    jest.spyOn(Math, "random").mockImplementation(() => randomValues[index++] ?? 0);

    expect(shuffleArray([1, 2, 3, 4])).toEqual([2, 3, 1, 4]);
  });
});
