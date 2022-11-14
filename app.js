require("dotenv").config();
require("express-async-errors");
// express

const express = require("express");
const app = express();
const path = require("path");

// rest of the packages
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const activityRouter = require("./routes/activityRoutes");
const galleryRouter = require("./routes/galleryRoutes");
const videoRouter = require("./routes/videoRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Content-Type", "application/json");
//   res.header("Accept", "application/json");
//   next();
// });
app.use(helmet());

app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use("/uploads", express.static(path.join("uploads")));
// app.use("/gallery", express.static(path.join("gallery")));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/activity", activityRouter);
app.use("/api/gallery", [fileUpload({ useTempFiles: true })], galleryRouter);
app.use("/api/video", [fileUpload({ useTempFiles: true })], videoRouter);

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
