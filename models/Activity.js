const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: [true, "Please provide place"],
    },
    start: {
      type: String,
      required: [true, "Please provide start"],
    },
    up: {
      type: String,
      required: [true, "Please provide up"],
    },
    height: {
      type: String,
      required: [true, "Please provide height"],
    },
    distance: {
      type: String,
      required: [true, "Please provide distance"],
    },
    date: {
      type: String,
      required: [true, "Please provide date"],
    },
    people: {
      type: String,
      required: [true, "Please provide people"],
    },
    link: {
      type: String,
      required: [true, "Please provide link"],
    },
    coordinates: {
      type: String,
      required: [true, "Please provide coordinates"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
