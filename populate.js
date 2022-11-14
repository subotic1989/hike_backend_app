require("dotenv").config();

const connectDB = require("./db/connect");
const Activity = require("./models/Activity");

const activity = require("./mocData/activity.json");

const start = async () => {
  try {
    await connectDB(
      "mongodb+srv://dejan:dejan123@nodeexpressproject.fz40qok.mongodb.net/NETWORK?retryWrites=true&w=majority"
    );
    await Activity.deleteMany();
    await Activity.create(activity);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
