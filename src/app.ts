import express from "express";
import { Pool, Client } from "pg";
import environment from "./config/ConfigFactory";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/pgCatalogTableCount", async (req, res) => {
  // TODO: Update DatabaseConfig to return Pool object instead of properties
  // TODO: Figure out how to configure things like isolation levels, transactions, clients, etc
  const pool = new Pool({
    user: environment.database.username,
    host: environment.database.host,
    database: environment.database.database,
    password: environment.database.password,
    port: environment.database.port
  })
  const result = await pool.query("SELECT COUNT(*) FROM pg_catalog.pg_tables")
  await pool.end()
  res.send({
    "rowCount": result.rowCount,
    "rows": result.rows
  });
})

export default app;