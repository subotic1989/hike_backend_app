const multer = require("multer");

const MIME_TYPE_MAP = {
  "video/mp4": "mp4",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];

    let error = new Error("Invalid mime type");

    if (isValid) {
      error = null;
    }
    cb(error, "video");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const multerVideoMiddleware = multer({ storage: storage }).any("video");

module.exports = multerVideoMiddleware;
