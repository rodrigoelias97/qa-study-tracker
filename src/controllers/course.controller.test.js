const courseController = require("./course.controller");
const courseService = require("../services/course.service");

jest.mock("../services/course.service");

describe("course.controller createCourse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 with created course payload", async () => {
    const req = {
      user: { id: "user-1" },
      body: {
        name: "API Testing",
        link: "https://example.com/course",
        totalWorkloadHours: 30,
        status: "planned",
        registrationDate: "2026-05-02",
      },
    };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();
    const course = { id: "course-1", name: "API Testing" };
    courseService.createCourse.mockResolvedValue(course);

    await courseController.createCourse(req, res, next);

    expect(courseService.createCourse).toHaveBeenCalledWith("user-1", req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ course });
  });

  it("forwards service errors to next middleware", async () => {
    const req = { user: { id: "user-1" }, body: {} };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    const error = new Error("Invalid payload");
    courseService.createCourse.mockRejectedValue(error);

    await courseController.createCourse(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
