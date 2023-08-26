const branchStatuses = require("./appointment_Statuses");
const branchAppointmentStatus = require("../Model/branchStatusesModel");
const branchRequest = require("../Model/branchRequest");
const ErrorHandler = require("../utils/ErrorHandler");

const branchAppointment = {
  createBranchAppointment: async (req, res, next) => {
    try {
      const existBranch =await branchRequest.find({ branchId: req.body.branchId });

      if (existBranch.length === 0) {
        const branchAppointment = new branchRequest({
          ...req.body,
          patId: req.user._id,
          status: branchStatuses.APPOINTMENT_STATUS_PENDING,
        });

        const newBranchAppointment = await branchAppointment.save();

        const statusUpdate = new branchAppointmentStatus({
          title: "Pending",
          legendColor: "FFF00",
          sortOrder: 1,
          descriptionText: "The branch Request is in review is in review.",
          statusKey: "Pending",
          appointmentId: newBranchAppointment._id,
        });

        await statusUpdate.save();

        res.status(201).json(newBranchAppointment);
      } else {
        throw new ErrorHandler("You already Requested", 400);
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = branchAppointment;
