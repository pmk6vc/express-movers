import express from "express";
import DatabaseClient from "../db/DatabaseClient";

const router = express.Router();

const healthCheckRouter = (dbClient: DatabaseClient) => {
  return router.get("/", (req, res) => {
    res.send("Hello, world!");
  });
};

export default healthCheckRouter;
