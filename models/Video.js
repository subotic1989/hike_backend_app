const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    videoPath: {
      type: String,
    },
    videoName: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);
