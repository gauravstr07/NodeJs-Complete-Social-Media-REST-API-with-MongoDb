/** importing dependencies */
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");

/** importing routes */
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const postRoutes = require("./routes/posts");

dotenv.config();

/** congifration to database */
mongoose;
mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected to database..💾`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = process.env.PORT;

/** importing middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

/** defining routes middleware */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Entry Level API",
  });
});

app.listen(port, () => {
  console.log(`server running on port: ${port}📡`);
});
