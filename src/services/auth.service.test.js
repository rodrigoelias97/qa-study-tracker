const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authService = require("./auth.service");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("auth.service - QST-1 register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates account and returns authentication response with valid data", async () => {
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
      message: "Email already in use",
    });
  });
});

describe("auth.service - QST-2 login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authenticates with valid credentials", async () => {
    const selectMock = jest.fn().mockResolvedValue({
      id: "user-1",
      name: "Rodrigo",
      email: "rodrigo@email.com",
      password: "hashed-password",
    });
    User.findOne.mockReturnValue({ select: selectMock });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwt-token");

    const result = await authService.login({
      email: "rodrigo@email.com",
      password: "secret123",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "rodrigo@email.com" });
    expect(selectMock).toHaveBeenCalledWith("+password");
    expect(bcrypt.compare).toHaveBeenCalledWith("secret123", "hashed-password");
    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Rodrigo",
        email: "rodrigo@email.com",
      },
      token: "jwt-token",
    });
  });

  it("rejects missing required login fields", async () => {
    await expect(
      authService.login({
        email: "",
        password: "",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: {
        fields: ["email", "password"],
      },
    });
  });

  it("rejects invalid credentials without exposing which field failed", async () => {
    const selectMock = jest.fn().mockResolvedValue({
      id: "user-1",
      name: "Rodrigo",
      email: "rodrigo@email.com",
      password: "hashed-password",
    });
    User.findOne.mockReturnValue({ select: selectMock });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({
        email: "rodrigo@email.com",
        password: "wrong-password",
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });
  });
});
