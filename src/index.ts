import express from "express";

const port = +(process.env.PORT || 3000);
const app = express();

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

app.listen(port, () => {
	console.log(`App starting on port ${port}`);
});
