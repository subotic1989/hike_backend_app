const express = require("express");
const router = express.Router();

const {
  getVideo,
  getVideosNames,
  uploadVideo,
} = require("../controllers/videoController");

router.get("/", getVideo);
router.get("/video-names", getVideosNames);
router.post("/", uploadVideo);

module.exports = router;
