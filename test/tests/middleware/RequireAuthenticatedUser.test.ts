import { afterEach, beforeAll, beforeEach, describe } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { Environment } from "../../../src/environment/handlers/IEnvironment";
import { USER_PROPERTY } from "../../../src/middleware/AuthenticateUser";
import requireAuthenticatedUser from "../../../src/middleware/RequireAuthenticatedUser";

describe("require authentication middleware should work", () => {
  let env: Environment;
  const mockRequest: Request = {} as Request;
  let mockResponse: Response;
  const nextFunction: NextFunction = jest.fn();

  beforeAll(async () => {
    env = await EnvironmentFactory.getHandler().getEnvironment();
  });

  beforeEach(() => {
    mockResponse = {
      locals: {},
    } as Response;
    mockResponse.status = jest.fn(() => mockResponse);
    mockResponse.send = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should block request without authenticated user", async () => {
    await requireAuthenticatedUser(env.logger)(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });

  it("should allow request with authenticated user", async () => {
    const USER_PROPERTY_KEY = USER_PROPERTY as keyof typeof mockResponse.locals;
    mockResponse.locals[USER_PROPERTY_KEY] = "Some authenticated user data";
    await requireAuthenticatedUser(env.logger)(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(0);
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
