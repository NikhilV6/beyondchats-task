const express = require("express")
const cors = require("cors")

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json())


const articleRoutes = require("./routes/article.routes");
app.use("/api/articles/", articleRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

module.exports = app;
