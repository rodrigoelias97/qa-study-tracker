const Course = require("../models/Course");
const courseService = require("./course.service");

jest.mock("../models/Course");

describe("course.service - QST-4 getCourseById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns course data when course belongs to authenticated user", async () => {
    Course.findById.mockResolvedValue({
      id: "course-1",
      userId: { toString: () => "user-1" },
      name: "API Testing",
      link: "https://example.com/course",
      totalWorkloadHours: 30,
      status: "planned",
      registrationDate: new Date("2026-05-02T00:00:00.000Z"),
      createdAt: new Date("2026-05-02T10:00:00.000Z"),
      updatedAt: new Date("2026-05-02T10:00:00.000Z"),
    });

    const result = await courseService.getCourseById("user-1", "507f1f77bcf86cd799439011");

    expect(Course.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(result).toMatchObject({
      id: "course-1",
      userId: "user-1",
      name: "API Testing",
      link: "https://example.com/course",
      totalWorkloadHours: 30,
      status: "planned",
    });
  });

  it("rejects access when course belongs to another user", async () => {
    Course.findById.mockResolvedValue({
      id: "course-1",
      userId: { toString: () => "user-2" },
    });

    await expect(courseService.getCourseById("user-1", "507f1f77bcf86cd799439011")).rejects.toMatchObject({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "Forbidden",
    });
  });

  it("returns not found when course does not exist", async () => {
    Course.findById.mockResolvedValue(null);

    await expect(courseService.getCourseById("user-1", "507f1f77bcf86cd799439011")).rejects.toMatchObject({
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      message: "Course not found",
    });
  });

  it("returns not found when course id is invalid", async () => {
    await expect(courseService.getCourseById("user-1", "invalid-id")).rejects.toMatchObject({
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      message: "Course not found",
    });
    expect(Course.findById).not.toHaveBeenCalled();
  });
});
