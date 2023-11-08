import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequestDataHelper = (
  schema: ZodTypeAny,
  data: {},
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).send(result.error.format());
  } else {
    next();
  }
};

export const validateRequestBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    validateRequestDataHelper(schema, req.body, res, next);
  };
};

export const validateRequestParams = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    validateRequestDataHelper(schema, req.params, res, next);
  };
};
