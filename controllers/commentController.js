const Comment = require("../models/Comment");
const CustomError = require("../errors");

//  COMMENT create
const createComment = async (req, res) => {
  req.body.user = req.user.name;
  req.body.createdBy = req.user.userId;
  req.body.comment = req.body.comment;
  req.body.postId = req.body.postId;

  const comment = await Comment.create(req.body);

  res.status(201).json({ msg: "Comment successfully added!", comment });
};

// COMMENTS all
const getComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ postId: postId });
  res
    .status(200)
    .json({ msg: "Successfully fetched!", comments, count: comments.length });
};

// COMMENTS from user
const getCommentsUser = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({}).populate({
    path: "createdBy",
  });
  res
    .status(200)
    .json({ msg: "Successfully fetched--!", comments, count: comments.length });
};

// COMMENT remove
const removeComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new CustomError.NotFoundError(`No Comment with id : ${commentId}`);
  }

  await comment.remove();

  const comments = await Comment.find({});

  res.status(200).json({
    msg: "Successfully removed!",
    comments,
    count: comments.length,
  });
};

module.exports = {
  createComment,
  getComments,
  removeComment,
  getCommentsUser,
};
