const branchModel = require("../Model/branchModel");
const User = require("../Model/User");
const axios = require("axios");
const ErrorHandler = require("../utils/ErrorHandler");

const branchController = {
  // Create a new branch
  createBranch: async (req, res, next) => {
    try {
      const {
        branchName,
        organizationName,
        branchType,
        branchAddress,
        branchRegion,
        branchState,
        branchCity,
        branchZipCode,
        branchEmail,
        branchContactNo,
        branchWebsite,
        branchLicenseNo,
        facilitiesProvided,
        professionalProvided,
        yearsofExperience,
        uploadLegalDoc,
        uploadIncidentReport,
        branchDetail,
        branchLogo,
        branchImages,
        branchVideo,
        videoTitle,
        branchManagerId,
      } = req.body;

      const newBranch = await branchModel.create({
        branchName,
        organizationName,
        branchType,
        branchAddress,
        branchRegion,
        branchState,
        branchCity,
        branchZipCode,
        branchEmail,
        branchContactNo,
        branchWebsite,
        branchLicenseNo,
        facilitiesProvided,
        professionalProvided,
        yearsofExperience,
        uploadLegalDoc,
        uploadIncidentReport,
        branchDetail,
        branchLogo,
        branchImages,
        branchVideo,
        videoTitle,
        branchManagerId,
        corporateId: req.user._id,
      });

      res.status(201).json(newBranch);
    } catch (error) {
      next(error);
    }
  },

  // Get all branches
  getAllBranches: async (req, res, next) => {
    try {
      // Get patid from token
      const patId = req.user._id;

      // Find user
      const user = await User.findOne({ _id: patId });

      // Get longitude and latitude of the user's location
      const zipCodeData = await axios.get(
        `https://api.zippopotam.us/us/${user.zipCode}`
      );
      const { latitude: patientLat, longitude: patientLon } =
        zipCodeData.data.places[0];

      // Retrieve all branches from the database and populate the referenced fields
      const branches = await branchModel
        // .find({isApprovedbYSuperAdmin:true}{isApprovedbYSuperAdmin:true})
        .find()
        .populate("branchManagerId", "-__v")
        .populate("corporateId", "-__v")
        .exec();

      if (!branches) {
        throw new ErrorHandler(404, "Branches not found");
      }

      const getBranchLatLng = async (zipCode) => {
        const zipCodeData = await axios.get(
          `https://api.zippopotam.us/us/${zipCode}`
        );
        const { latitude, longitude } = zipCodeData.data.places[0];
        return { latitude, longitude };
      };

      const formattedBranches = await Promise.all(
        branches.map(async (branch) => {
          const {
            branchName,
            organizationName,
            branchType,
            branchAddress,
            branchRegion,
            branchState,
            branchCity,
            branchZipCode,
            branchEmail,
            branchContactNo,
            branchWebsite,
            branchLicenseNo,
            facilitiesProvided,
            professionalProvided,
            yearsofExperience,
            uploadLegalDoc,
            uploadIncidentReport,
            branchDetail,
            branchLogo,
            branchImages,
            branchVideo,
            videoTitle,
            _id,
          } = branch;
          const { branchManagerId, corporateId } = branch;

          // Fetch longitude and latitude of the branch's location
          const { latitude: branchLat, longitude: branchLon } =
            await getBranchLatLng(branchZipCode);

          // Calculate the distance between the patient and the branch
          const distance = calculateDistance(
            patientLat,
            patientLon,
            branchLat,
            branchLon
          );

          return {
            _id,
            branchName,
            organizationName,
            branchType,
            branchAddress,
            branchRegion,
            branchState,
            branchCity,
            branchZipCode,
            branchEmail,
            branchContactNo,
            branchWebsite,
            branchLicenseNo,
            facilitiesProvided,
            professionalProvided,
            yearsofExperience,
            uploadLegalDoc,
            uploadIncidentReport,
            branchDetail,
            branchLogo,
            branchImages,
            branchVideo,
            videoTitle,
            branchManagerId,
            corporateId,
            distance,
          };
        })
      );

      res.status(200).json({ data: formattedBranches });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branches", error });
    }
  },

  // Get a single branch by ID
  getBranchById: async (req, res) => {
    const branchId = req.params.id;
    try {
      const branch = await branchModel.findById(branchId);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.status(200).json(branch);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch the branch", error });
    }
  },

  // Update a branch by ID
  updateBranchById: async (req, res) => {
    const branchId = req.params.id;
    try {
      const updatedBranch = await branchModel.findByIdAndUpdate(
        branchId,
        req.body,
        {
          new: true, // Return the updated branch instead of the old one
        }
      );
      if (!updatedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.status(200).json(updatedBranch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update the branch", error });
    }
  },

  // Delete a branch by ID
  deleteBranchById: async (req, res) => {
    const branchId = req.params.id;
    try {
      const deletedBranch = await branchModel.findByIdAndDelete(branchId);
      if (!deletedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res
        .status(200)
        .json({ message: "Branch deleted successfully", deletedBranch });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete the branch", error });
    }
  },
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance;
};

module.exports = branchController;
