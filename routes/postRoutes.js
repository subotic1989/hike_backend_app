const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  createPost,
  getAllPosts,
  removePost,
  updatePost,
  likePost,
  dislikePost,
} = require("../controllers/postController");

router.post("/create", [authentication], createPost);
router.get("/", [authentication], getAllPosts);
router.delete("/:postId", [authentication], removePost);
router.patch("/:postId", [authentication], updatePost);
router.get("/like/:postId", [authentication], likePost);
router.get("/dislike/:postId", [authentication], dislikePost);

module.exports = router;
