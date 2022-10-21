const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  createActivity,
  getAllActivity,
  updateActivity,
  removeActivity,
} = require("../controllers/activityController");

router.post("/create", [authentication], createActivity);
router.get("/", getAllActivity);
router.patch("/:activityId", [authentication], updateActivity);
router.delete("/:activityId", [authentication], removeActivity);

module.exports = router;
