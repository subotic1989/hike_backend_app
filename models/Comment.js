const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide Comment"],
      minlength: [3, "The Comment must have at least three characters!"],
      maxlength: [50, "The Comment cannot have more than 50 characters!"],
    },
    user: {
      type: String,
      required: [true, "Please provide user!"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide id"],
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Please provide post"],
    },
  },
  { timestamps: true }
);

CommentSchema.statics.calculateCommentsSum = async function (postId) {
  const result = await this.aggregate([
    { $match: { postId: postId } },
    {
      $group: {
        _id: null,
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Post").findOneAndUpdate(
      { _id: postId },
      {
        numOfComments: result[0]?.numOfComments || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

CommentSchema.post("save", async function () {
  await this.constructor.calculateCommentsSum(this.postId);
});

CommentSchema.post("remove", async function () {
  await this.constructor.calculateCommentsSum(this.postId);
});

module.exports = mongoose.model("Comment", CommentSchema);
