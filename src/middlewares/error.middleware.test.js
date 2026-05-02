const errorMiddleware = require("./error.middleware");

describe("error middleware", () => {
  it("returns standardized error payload with optional fields", () => {
    const error = new Error("Invalid or missing required fields");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = { fields: ["email", "password"] };

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const response = { status };

    errorMiddleware(error, {}, response, () => {});

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: "Invalid or missing required fields",
      code: "VALIDATION_ERROR",
      details: { fields: ["email", "password"] },
    });
  });
});
