const Advisor = require("../Model/advisorModel");
const ErrorHandler = require("../utils/ErrorHandler");
const CryptoJS = require("crypto-js");

const advisorClt = {
  createAdvisor: async (req, res, next) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        advisorEmail,
        advisorContactNo,
        password,
        confirmPass,
        advisorAddress,
        gender,
        role,
        profilePic,
        status,
      } = req.body;

      if (password !== confirmPass) {
        throw new ErrorHandler(
          "Password and confirm password are not same",
          400
        );
      }
      const existEmail = await Advisor.find({ advisorEmail });
      if (existEmail.length === 0) {
        const newAdvisorData = {
          firstName,
          middleName,
          lastName,
          advisorEmail,
          advisorContactNo,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          advisorAddress,
          gender,
          role,
          profilePic,
          status,
          superAdminId: req.user._id,
        };

        const newAdvisor = new Advisor(newAdvisorData);
        const savedAdvisor = await newAdvisor.save();

        res.status(201).json({
          success: true,
          advisor: savedAdvisor,
        });
      } else {
        throw new ErrorHandler("Emal Already Exist", 400);
      }
    } catch (err) {
      next(err);
    }
  },

  // Update a branch manager by ID
  getAdvisors: async (req, res, next) => {
    try {
      const advisors = await Advisor.find().select(
        "-password -__v"
      );
      if (!advisors) {
        return res.status(404).json({ error: "Advisors  not found." });
      }

      res.status(200).json({data:advisors});
    } catch (err) {
      next(err);
    }
  },

  // Delete a branch manager by ID
  deleteAdvisor: async (req, res, next) => {
    try {
      const deletedBranchManager = await BranchManager.findByIdAndDelete(
        req.params.id
      );
      if (!deletedBranchManager) {
        return res.status(404).json({ error: "Branch manager not found." });
      }
      res.status(200).json({ message: "Branch manager deleted successfully." });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = advisorClt;
