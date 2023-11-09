import { afterEach, beforeEach, describe } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateRequestBody } from "../../../src/middleware/ValidateRequestData";

describe("request validation middleware should work", () => {
  let mockRequest: Request;
  let nextFunction: NextFunction;
  const mockResponse: Response = {} as Response;
  mockResponse.status = jest.fn(() => mockResponse);
  mockResponse.send = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: {},
    } as Request;
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("request body validation should work", () => {
    it("should return 400 for empty request body and non empty request requirement", async () => {
      const requestSchema = z.object({
        key: z.string(),
      });
      await validateRequestBody(requestSchema)(
        mockRequest,
        mockResponse,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
      expect(nextFunction).toHaveBeenCalledTimes(0);
    });

    it("should return 400 for non empty request body and empty request requirement", async () => {
      const requestSchema = z.object({}).strict();
      mockRequest.body = {
        key: 0,
      };
      await validateRequestBody(requestSchema)(
        mockRequest,
        mockResponse,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
      expect(nextFunction).toHaveBeenCalledTimes(0);
    });

    it("should return 400 for incompatible request body and requirement", async () => {
      const requestSchema = z
        .object({
          rightKey: z.string(),
        })
        .strict();
      mockRequest.body = {
        wrongKey: "oops",
      };
      await validateRequestBody(requestSchema)(
        mockRequest,
        mockResponse,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
      expect(nextFunction).toHaveBeenCalledTimes(0);
    });

    it("should work for compatible request body and requirement", async () => {
      const requestSchema = z
        .object({
          rightKey: z.string(),
        })
        .strict();
      mockRequest.body = {
        rightKey: "I hope this works!",
      };
      await validateRequestBody(requestSchema)(
        mockRequest,
        mockResponse,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.send).toHaveBeenCalledTimes(0);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });
  });
});
