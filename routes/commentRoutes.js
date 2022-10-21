const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  createComment,
  getComments,
  removeComment,
  getCommentsUser,
} = require("../controllers/commentController");

router.get("/commentsUser/:postId", getCommentsUser);
router.get("/:postId", getComments);
router.post("/create", [authentication], createComment);
router.delete("/:commentId", removeComment);

module.exports = router;
