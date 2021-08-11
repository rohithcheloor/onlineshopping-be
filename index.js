const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");

const app = express();
const port = process.env.PORT || 2000;

const authRouter = require("./routes/auth");
const registerRouter = require("./routes/register");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/", express.static(path.join(__dirname, "static")));

app.use("/api", authRouter);
app.use("/api", registerRouter);

app.listen(port, () => console.log(`Server running on port :${port}`));
