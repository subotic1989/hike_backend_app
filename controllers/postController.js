const Post = require("../models/Post");
const CustomError = require("../errors");

// POST create
const createPost = async (req, res) => {
  req.body.user = req.user.name;
  req.body.createdBy = req.user.userId;

  const post = await Post.create(req.body);

  res.status(201).json({ msg: "Successfully added!", post });
};

// POSTS all
const getAllPosts = async (req, res) => {
  let numPosts = 0;
  const { query } = req.query;
  const skip = +req.query.skip || 0;
  let posts;

  if (query === "allPosts") {
    posts = await Post.find({}).skip(skip).limit(2);

    numPosts = await Post.countDocuments({});
  }

  if (query === "posts") {
    posts = await Post.find({ createdBy: req.user.userId });
  }

  if (query === "comments") {
    postsArray = await Post.find({}).populate({
      path: "comments",
      match: {
        createdBy: req.user.userId,
      },
    });

    posts = postsArray.filter((post) => post.comments.length > 0);
  }

  res
    .status(200)
    .json({ msg: "Successfully fetched!", posts, count: numPosts });
};

// POST update
const updatePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    throw new CustomError.NotFoundError(`No Post with id : ${postId}`);
  }

  const posts = await Post.find({});

  res.status(200).json({ msg: "Successfully edited!", posts });
};

// POST remove
const removePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new CustomError.NotFoundError(`No Post with id : ${postId}`);
  }

  await post.remove();

  const posts = await Post.find({});

  res.status(200).json({ msg: "Successfully removed!", posts });
};

// POST like
const likePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new CustomError.NotFoundError(`No Post with id : ${postId}`);
  }

  post.numOfLikes += 1;

  post.likedBy.push(req.user.userId);

  await post.save();

  const posts = await Post.find({});

  res.status(200).json(post);
};

// POST dislike
const dislikePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new CustomError.NotFoundError(`No Post with id : ${postId}`);
  }

  post.numOfLikes -= 1;

  post.likedBy = await post.likedBy.filter((user) => user != req.user.userId);

  await post.save();

  const posts = await Post.find({});

  res.status(200).json(post);
};

module.exports = {
  createPost,
  getAllPosts,
  removePost,
  updatePost,
  likePost,
  dislikePost,
};
