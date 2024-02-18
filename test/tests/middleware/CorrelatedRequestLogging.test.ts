import { afterEach, describe } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import correlatedRequestLogging, {
  GLOBAL_LOG_OBJ,
} from "../../../src/middleware/CorrelatedRequestLogging";
import { TEST_GCP_PROJECT_ID } from "../../util/TestConstants";

describe("correlated request logging middleware should work", () => {
  const mockRequest: Request = {} as Request;
  mockRequest.header = jest.fn();
  const nextFunction: NextFunction = jest.fn();
  const mockResponse: Response = {
    locals: {},
  } as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not set global log object if trace header is not defined", async () => {
    jest.spyOn(mockRequest, "header").mockReturnValue(undefined);
    await correlatedRequestLogging(TEST_GCP_PROJECT_ID)(
      mockRequest,
      mockResponse,
      nextFunction,
    );
    expect(mockRequest.header).toHaveBeenCalledTimes(1);
    expect(mockRequest.header).toHaveBeenCalledWith("X-Cloud-Trace-Context");
    expect(mockResponse.locals[GLOBAL_LOG_OBJ]).toEqual({});
  });

  it("should set global log object if trace header is defined", async () => {
    const trace = "my-trace-context";
    jest.spyOn(mockRequest, "header").mockReturnValue(trace);
    await correlatedRequestLogging(TEST_GCP_PROJECT_ID)(
      mockRequest,
      mockResponse,
      nextFunction,
    );
    expect(mockRequest.header).toHaveBeenCalledTimes(1);
    expect(mockRequest.header).toHaveBeenCalledWith("X-Cloud-Trace-Context");
    expect(mockResponse.locals[GLOBAL_LOG_OBJ]).toEqual({
      "logging.googleapis.com/trace": `projects/${TEST_GCP_PROJECT_ID}/traces/${trace}`,
    });
  });
});
