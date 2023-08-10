import express from "express";

const router = express.Router();

router
  .get("/", (req, res) => {
    res.send("Hello, world!");
  })
  .get("/migrations", async (req, res) => {
    const pool = await res.locals.pool;
    const result = await pool.query("SELECT COUNT(*) FROM pgmigrations");
    res.send({
      rowCount: result.rowCount,
      rows: result.rows,
    });
  });

export default router;
