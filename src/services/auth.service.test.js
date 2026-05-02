const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authService = require("./auth.service");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("auth.service register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates user and returns token for valid payload", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({
      id: "user-1",
      name: "Rodrigo",
      email: "rodrigo@email.com",
    });
    jwt.sign.mockReturnValue("jwt-token");

    const result = await authService.register({
      name: "Rodrigo",
      email: "rodrigo@email.com",
      password: "secret123",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "rodrigo@email.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("secret123", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "Rodrigo",
      email: "rodrigo@email.com",
      password: "hashed-password",
    });
    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Rodrigo",
        email: "rodrigo@email.com",
      },
      token: "jwt-token",
    });
  });

  it("rejects when email already exists", async () => {
    User.findOne.mockResolvedValue({ id: "existing-user" });

    await expect(
      authService.register({
        name: "Rodrigo",
        email: "rodrigo@email.com",
        password: "secret123",
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_CONFLICT",
      details: { fields: ["email"] },
    });
  });

  it("rejects when required fields are missing or invalid", async () => {
    await expect(
      authService.register({
        name: "",
        email: "invalid-email",
        password: "123",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: { fields: ["name", "email", "password"] },
    });
  });
});
