import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { GLOBAL_LOG_OBJ } from "../CorrelatedRequestLogging";
import { USER_PROPERTY } from "./AuthenticateUser";

const requireAuthenticatedUserHelper = (
  req: Request,
  res: Response,
  next: NextFunction,
  logger: Logger
) => {
  if (!res.locals[USER_PROPERTY]) {
    logger.info("Unauthenticated request", res.locals[GLOBAL_LOG_OBJ]);
    res.status(401).send("Unauthenticated request");
    return;
  }
  next();
};

const requireAuthenticatedUser = (logger: Logger) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    requireAuthenticatedUserHelper(req, res, next, logger);
  };
};

export default requireAuthenticatedUser;
