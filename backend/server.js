const express = require("express");
const cors = require("cors");
require("dotenv").config();
const notificationRoutes = require("./routes/notificationRoutes");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Vibenet API Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});