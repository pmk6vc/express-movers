import express from "express";
import EnvironmentResolver from "./environment/EnvironmentResolver";

// Spin up app
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/pgCatalogTableCount", async (req, res) => {
  // TODO: Figure out how to configure things like isolation levels, transactions, clients, etc
  const environment = await EnvironmentResolver.getEnvironment();
  const pool = environment.database.getDatabasePool();
  const result = await pool.query("SELECT COUNT(*) FROM pg_catalog.pg_tables");
  res.send({
    rowCount: result.rowCount,
    rows: result.rows,
  });
});

export default app;
