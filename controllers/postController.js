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
  const { query, search: post, numericsFilter, user, sort } = req.query;

  const queryObject = {};

  // FIND user posts
  if (query && query === "posts") {
    queryObject.createdBy = req.user.userId;
  }

  // FIND by user
  if (user && user !== "all") {
    queryObject.user = user;
  }

  // FIND by post
  if (post) {
    queryObject.post = { $regex: post, $options: "i" };
  }

  // FIND by num likes
  if (numericsFilter && numericsFilter !== "numOfLikes=all") {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericsFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["numOfLikes", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Post.find(queryObject);

  // SORT
  if (sort) {
    result = result.sort(sort);
  } else {
    result = result.sort("-createdAt");
  }

  // FIND user comments
  if (query && query === "comments") {
    result.populate({
      path: "comments",
      // match: {
      //   createdBy: req.user.userId,
      // },
    });
  }

  let posts = await result;

  if (query && query === "comments") {
    posts = posts.filter((p) => p.comments.length > 0);
  }

  res.status(200).json({ msg: "Successfully fetched!", posts });
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
