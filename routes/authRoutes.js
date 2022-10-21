const express = require("express");
const multerMiddleware = require("../middleware/multer");

const router = express.Router();

const {
  register,
  login,
  logout,
  editUser,
} = require("../controllers/authController");

router.post("/register", [multerMiddleware], register);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/edit/:userId", [multerMiddleware], editUser);

module.exports = router;
