import { afterEach, describe } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  validateRequestBody,
  validateRequestParams,
} from "../../../src/middleware/ValidateRequestData";

describe("request validation middleware should work", () => {
  const mockRequest: Request = {
    body: {},
    params: {},
  } as Request;
  const mockResponse: Response = {} as Response;
  mockResponse.status = jest.fn(() => mockResponse);
  mockResponse.send = jest.fn();
  const nextFunction: NextFunction = jest.fn();

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

  describe("request param validation should mirror body validation behavior", () => {
    it("should return 400 for incompatible request param and requirement", async () => {
      const requestSchema = z
        .object({
          rightKey: z.string(),
        })
        .strict();
      mockRequest.params = {
        wrongKey: "oops",
      };
      await validateRequestParams(requestSchema)(
        mockRequest,
        mockResponse,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
      expect(nextFunction).toHaveBeenCalledTimes(0);
    });
  });
});
