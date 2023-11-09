import { NextFunction, Request, Response } from "express";
import { USER_PROPERTY } from "./AuthenticateUser";

const requireAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals[USER_PROPERTY]) {
    res.status(401).send("Unauthenticated request");
    return;
  }
  next();
};

export default requireAuthenticatedUser;
