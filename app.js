require("dotenv").config();
require("express-async-errors");
// express

const express = require("express");
const app = express();
const path = require("path");

// rest of the packages
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const activityRouter = require("./routes/activityRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/uploads", express.static(path.join("uploads")));

app.use(express.static("./public"));
// app.use(fileUpload());

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/activity", activityRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
