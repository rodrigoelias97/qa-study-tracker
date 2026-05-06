const courseController = require("./course.controller");
const courseService = require("../services/course.service");

jest.mock("../services/course.service");

describe("course.controller - QST-4 getCourseById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with course payload", async () => {
    const req = {
      user: { id: "user-1" },
      params: { id: "course-1" },
    };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();
    const course = { id: "course-1", name: "API Testing" };
    courseService.getCourseById.mockResolvedValue(course);

    await courseController.getCourseById(req, res, next);

    expect(courseService.getCourseById).toHaveBeenCalledWith("user-1", "course-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ course });
  });

  it("forwards service errors to next middleware", async () => {
    const req = {
      user: { id: "user-1" },
      params: { id: "course-1" },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    const error = new Error("Forbidden");
    courseService.getCourseById.mockRejectedValue(error);

    await courseController.getCourseById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
