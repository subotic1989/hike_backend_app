const express = require("express");
const router = express.Router();
const multerPhotosMiddleware = require("../middleware/multerPhotos");

const {
  getPhotosAll,
  uploadPhotos,
} = require("../controllers/galleryController");

router.get("/", getPhotosAll);
router.post("/", uploadPhotos);
// router.post("/", [multerPhotosMiddleware], uploadPhotos);
// router.delete("/:commentId", removeComment);

module.exports = router;
