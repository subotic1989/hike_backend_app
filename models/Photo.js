const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
    },
    place: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Photo", PhotoSchema);
