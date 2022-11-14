const express = require("express");
const router = express.Router();

const {
  getPhotosAll,
  uploadPhotos,
  getPhotoAlbumNames,
} = require("../controllers/galleryController");

router.get("/", getPhotosAll);
router.get("/album-names", getPhotoAlbumNames);
router.post("/", uploadPhotos);

module.exports = router;
