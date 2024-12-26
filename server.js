const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

// DB接続
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB connected")).catch((err) => console.log(err));

//　ミドルウェア
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


app.get("/", (req, res) => {
  res.send("Hello express");
});


app.listen(PORT, () => console.log("Server is running on port 3000"));
