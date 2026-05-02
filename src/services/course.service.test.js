const Course = require("../models/Course");
const courseService = require("./course.service");

jest.mock("../models/Course");

describe("course.service - QST-3 createCourse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a course linked to authenticated user with valid payload", async () => {
    Course.create.mockResolvedValue({
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

    const result = await courseService.createCourse("user-1", {
      name: "API Testing",
      link: "https://example.com/course",
      totalWorkloadHours: 30,
      status: "planned",
      registrationDate: "2026-05-02",
    });

    expect(Course.create).toHaveBeenCalledWith({
      userId: "user-1",
      name: "API Testing",
      link: "https://example.com/course",
      totalWorkloadHours: 30,
      status: "planned",
      registrationDate: "2026-05-02",
    });
    expect(result).toMatchObject({
      id: "course-1",
      userId: "user-1",
      name: "API Testing",
      link: "https://example.com/course",
      totalWorkloadHours: 30,
      status: "planned",
    });
  });

  it("rejects when required fields are missing or invalid", async () => {
    await expect(
      courseService.createCourse("user-1", {
        name: "",
        link: "invalid-link",
        totalWorkloadHours: 0,
        status: "",
        registrationDate: "",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: {
        fields: ["name", "link", "totalWorkloadHours", "status", "registrationDate"],
      },
    });
  });
});
