import { NextFunction, Request, Response } from "express";

export const GLOBAL_LOG_OBJ = "GLOBAL_LOG_OBJ";

const correlateLogsInProduction = (
  projectId: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const globalLogFields: { [key: string]: any } = {};
  const traceHeader = req.header("X-Cloud-Trace-Context");
  if (traceHeader && projectId) {
    const [trace] = traceHeader.split("/");
    globalLogFields[
      "logging.googleapis.com/trace"
    ] = `projects/${projectId}/traces/${trace}`;
  }
  res.locals[GLOBAL_LOG_OBJ] = globalLogFields;
  return next();
};

const correlatedRequestLogging = (projectId: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    correlateLogsInProduction(projectId, req, res, next);
  };
};

export default correlatedRequestLogging;
