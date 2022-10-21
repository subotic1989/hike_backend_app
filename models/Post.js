const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: [true, "Please provide Post"],
      minlength: [3, "The Post must have at least three characters!"],
      maxlength: [50, "The Post cannot have more than 50 characters!"],
    },
    user: {
      type: String,
      required: [true, "Please provide user"],
      minlength: 3,
      maxlength: 50,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide id"],
    },
    isUserLiked: {
      type: Boolean,
    },
    likedBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  justOne: false,
  // match: { createdBy: "6346a6f54c3e3066a10019e4" },
});

// PostSchema.index({ likedBy: 1, createdBy: 1 }, { unique: true });

PostSchema.pre("remove", async function (next) {
  console.log("obrisano");
  await this.model("Comment").deleteMany({ postId: this._id });
});

module.exports = mongoose.model("Post", PostSchema);
