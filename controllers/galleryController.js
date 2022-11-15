const Photo = require("../models/Photo");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// PHOTOS album-names
const getPhotoAlbumNames = async (req, res) => {
  const albums = await Photo.find({}).select("");

  res.status(200).json({ msg: "Successfully fetched!", albums });
};

// PHOTOS get all
const getPhotosAll = async (req, res) => {
  const { place } = req.query;
  const photos = await Photo.find({ place: place });

  res.status(200).json({ msg: "Successfully fetched!", photos });
};

// PHOTOS upload
const uploadPhotos = async (req, res) => {
  //  multiple photos
  if (req.files.images.length > 1) {
    for (let i = 0; i < req.files.images.length; i++) {
      const result = await cloudinary.uploader.upload(
        req.files.images[i].tempFilePath,
        {
          use_filename: true,
          folder: "Großer_Bösenstein",
        }
      );
      fs.unlinkSync(req.files.images[i].tempFilePath);

      await Photo.create({
        imagePath: result.secure_url,
        place: "großer_bösenstein",
      });
    }
    // single photo
  } else {
    const result = await cloudinary.uploader.upload(
      req.files.images.tempFilePath,
      {
        use_filename: true,
        folder: "Fölzstein",
      }
    );
    fs.unlinkSync(req.files.images.tempFilePath);

    await Photo.create({ imagePath: result.secure_url });
  }

  const photos = await Photo.find({});

  return res.status(200).json({ msg: "Successfully uploaded!", photos });
};

module.exports = {
  getPhotosAll,
  getPhotoAlbumNames,
  uploadPhotos,
};
