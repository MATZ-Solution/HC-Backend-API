const BranchManager = require("../Model/branchManagerModel");
const ErrorHandler = require("../utils/ErrorHandler");
const CryptoJS = require("crypto-js");


const branchManagerClt = {
  createBranchManager: async (req, res, next) => {
    try {

      const {
        firstName,
        middleName,
        lastName,
        branchAdminEmail,
        branchAdminContactNo,
        password,
        confirmPass,
        branchAdminAddress,
        gender,
        branchManagerRole,
        profilePic,
      } = req.body;

      if (password !== confirmPass) {
        throw new ErrorHandler(
          "Password and confirm password are not same",
          400
        );
      }
      const existEmail = await BranchManager.find({ branchAdminEmail });
      if (existEmail.length === 0) {
        const newBranchManagerData = {
          firstName,
          middleName,
          lastName,
          branchAdminEmail,
          branchAdminContactNo,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          branchAdminAddress,
          gender,
          branchManagerRole,
          profilePic,
          corporateId: req.user._id,
        };

        const newBranchManager = new BranchManager(newBranchManagerData);
        const savedBranchManager = await newBranchManager.save();

        res.status(201).json({
          success: true,
          branchManager: savedBranchManager,
        });
      } else {
        throw new ErrorHandler(
          "Emal Already Exist",
          400
        );
      }
    } catch (err) {
      next(err);
    }
  },

  // Update a branch manager by ID
  updateBranchManager: async (req, res, next) => {
    try {
      const updatedBranchManager = await BranchManager.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedBranchManager) {
        return res.status(404).json({ error: 'Branch manager not found.' });
      }
      res.status(200).json(updatedBranchManager);
    } catch (err) {
      next(err)
    }
  },

  // Delete a branch manager by ID
  deleteBranchManager: async (req, res, next) => {
    try {
      const deletedBranchManager = await BranchManager.findByIdAndDelete(req.params.id);
      if (!deletedBranchManager) {
        return res.status(404).json({ error: 'Branch manager not found.' });
      }
      res.status(200).json({ message: 'Branch manager deleted successfully.' });
    } catch (err) {
      next(err)
    }
  },
};
module.exports = branchManagerClt;
