import express from "express";
import { Environment } from "../environment/handlers/IEnvironment";

const router = express.Router();

const healthCheckRouter = (env: Environment) => {
  return router
    .get("/", (req, res) => {
      res.send("Hello, world!");
    })
    .get("/migrations", async (req, res) => {
      const pool = env.database.getDatabasePool();
      const result = await pool.query("SELECT COUNT(*) FROM pgmigrations");
      res.send({
        rowCount: result.rowCount,
        rows: result.rows,
      });
    });
};

export default healthCheckRouter;
