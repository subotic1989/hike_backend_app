const Activity = require("../models/Activity");
const CustomError = require("../errors");

// ACTIVITY create
const createActivity = async (req, res) => {
  req.body.user = req.user.name;
  req.body.createdBy = req.user.userId;

  const activity = await Activity.create(req.body);

  res.status(201).json({ msg: "Successfully added!", activity });
};

// activity all
const getAllActivity = async (req, res) => {
  const activities = await Activity.find({});

  numActivity = await Activity.countDocuments({});

  res
    .status(200)
    .json({ msg: "Successfully fetched!", activities, count: numActivity });
};

// ACTIVITY update
const updateActivity = async (req, res) => {
  const { activityId } = req.params;

  const activity = await Activity.findOneAndUpdate(
    { _id: activityId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!activity) {
    throw new CustomError.NotFoundError(`No activity with id : ${activityId}`);
  }

  const activityAll = await Activity.find({});

  res.status(200).json({ msg: "Successfully edited!", activityAll });
};

// ACTIVITY remove
const removeActivity = async (req, res) => {
  const { activityId } = req.params;
  const activity = await Activity.findOne({ _id: activityId });

  if (!activity) {
    throw new CustomError.NotFoundError(`No activity with id : ${activityId}`);
  }

  await activity.remove();

  const activityAll = await Activity.find({});

  res.status(200).json({ msg: "Successfully removed!", activityAll });
};

module.exports = {
  createActivity,
  getAllActivity,
  updateActivity,
  removeActivity,
};
