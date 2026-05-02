const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("./auth.middleware");

jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("auth.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects unauthenticated requests with standardized error", async () => {
    const req = { headers: {} };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.user and calls next for valid token", async () => {
    const req = { headers: { authorization: "Bearer token-123" } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockReturnValue({ sub: "user-1" });
    User.findById.mockResolvedValue({
      id: "user-1",
      name: "Rodrigo",
      email: "rodrigo@email.com",
    });

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({
      id: "user-1",
      name: "Rodrigo",
      email: "rodrigo@email.com",
    });
  });
});
