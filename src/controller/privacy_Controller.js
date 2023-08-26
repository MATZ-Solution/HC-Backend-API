const Privacy = require("../Model/privacyModel");
const ErrorHandler = require("../utils/ErrorHandler");

const PrivacyClt = {
  createPrivacyAndPolicy: async (req, res, next) => {
    try {
      const { desc, lastUpdated } = req.body;
      const privacy = await Privacy.create({
        desc,
        lastUpdated,
      });
      res.status(200).json({
        success: true,
        privacy,
      });
    } catch (err) {
      next(err);
    }
  },
  getPrivacyAndPolicy: async (req, res, next) => {
    try {
      const privacy = await Privacy.find({});
      res.status(200).json(privacy);
    } catch (err) {
      next(err);
    }
  },
  updatePrivacyAndPolicy: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(req.params);
      const privacy = await Privacy.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(privacy);
    } catch (err) {
      next(err);
    }
  }
};
module.exports = PrivacyClt;
