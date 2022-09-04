const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const router = require("./routes/user.route.js");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());
// app.use(express.static("public"))
app.set("view engine", "ejs");

app.use("/user", router);

app.get("/", (req, res) => res.send("Welcome to ACC Assignment1"));
app.all("*", (req, res) => res.send("No Route Found"));
app.listen(port, () => console.log("Port is", port));
