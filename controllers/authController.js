const User = require("../models/User");
const Post = require("../models/Post");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

// REGISTER user
const register = async (req, res) => {
  const { email, name, password, passwordRepeat } = req.body;

  let url = req.body.image;

  if (req.file) {
    url =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  }

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  if (password !== passwordRepeat) {
    throw new CustomError.BadRequestError("Passwords don't match!");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  await User.create({ name, email, password, role, image: url });

  const user = await User.findOne({ email }).select("-password");

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(201).json({ msg: "Successfully registered!", user });
};

// LOGIN user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const userExist = await User.findOne({ email });

  if (!userExist) {
    throw new CustomError.UnauthenticatedError("Email is not correct!");
  }

  const isPasswordCorrect = await userExist.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Password not correct!");
  }

  const user = await User.findOne({ email }).select("-password");

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(200).json({ msg: "Successfully logged!", user });
};

// LOGOUT user
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ msg: "User logged out!" });
};

// EDIT user
const editUser = async (req, res) => {
  const { email, name } = req.body;
  const { userId } = req.params;

  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  let url = req.body.image;

  if (req.file) {
    url =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  }

  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    throw new NotFoundError(`No user with id ${userId}!!`);
  }

  user.name = name;
  user.email = email;
  user.image = url;

  await user.save();
  const posts = await Post.find({});

  res.status(200).json({ msg: "Successfully changed!", user, posts });
};

module.exports = {
  register,
  login,
  logout,
  editUser,
};
