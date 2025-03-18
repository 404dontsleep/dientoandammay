const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/books", bookRoutes);
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
