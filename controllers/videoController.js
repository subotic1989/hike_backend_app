const Video = require("../models/Video");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// VIDEO get
const getVideo = async (req, res) => {
  const { place } = req.query;
  const video = await Video.find({ videoName: place });

  res.status(200).json({ msg: "Successfully fetched!", video });
};

// VIDEO  names
const getVideosNames = async (req, res) => {
  const videoNames = await Video.find({}).select("-_id").select("videoName");

  res.status(200).json({ msg: "Successfully fetched!", videoNames });
};

// VIDEO upload
const uploadVideo = async (req, res) => {
  console.log("............s.......");
  const result = await cloudinary.uploader.upload(
    req.files.video.tempFilePath,
    { resource_type: "video", use_filename: true, folder: "videos" }
  );

  const test = await Video.create({
    videoPath: result.secure_url,
    videoName: req.files.video.name,
  });

  console.log(test);

  const video = await Video.find({});

  return res.status(200).json({ msg: "Successfully uploaded!", video });
};

module.exports = {
  getVideo,
  getVideosNames,
  uploadVideo,
};
