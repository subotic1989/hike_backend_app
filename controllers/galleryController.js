const Photo = require("../models/Photo");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const CustomError = require("../errors");

// PHOTOS get all
const getPhotosAll = async (req, res) => {
  const photos = await Photo.find({});

  res.status(200).json({ msg: "Successfully fetched!", photos });
};

// PHOTOS upload
const uploadPhotoss = async (req, res) => {
  var imageUrlList = [];
  console.log(req.files.images);

  for (var i = 0; i < req.files.images.length; i++) {
    var locaFilePath = req.files.images[i].tempFilePath;

    var result = await uploadToCloudinary(locaFilePath);
    imageUrlList.push(result.url);
  }

  async function uploadToCloudinary(locaFilePath) {
    return cloudinary.uploader
      .upload(locaFilePath, {
        use_filename: true,
        folder: "gallery",
      })
      .then((result) => {
        fs.unlinkSync(locaFilePath);

        return {
          message: "Success",
          url: result.url,
        };
      })
      .catch((error) => {
        fs.unlinkSync(locaFilePath);
        return { message: "Fail" };
      });
  }
  const photos = await Photo.find({});

  return res.status(200).json({ msg: "Successfully uploaded!", photos });
};

// PHOTOS upload
const uploadPhotos = async (req, res) => {
  //  multiple photos
  if (req.files.images.length < 1) {
    for (let i = 0; i < req.files.images.length; i++) {
      const result = await cloudinary.uploader.upload(
        req.files.images[i].tempFilePath,
        {
          use_filename: true,
          folder: "gallery",
        }
      );
      fs.unlinkSync(req.files.images[i].tempFilePath);

      await Photo.create({ imagePath: result.secure_url });
    }
    // single photo
  } else {
    const result = await cloudinary.uploader.upload(
      req.files.images.tempFilePath,
      {
        use_filename: true,
        folder: "gallery",
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
  uploadPhotos,
};
