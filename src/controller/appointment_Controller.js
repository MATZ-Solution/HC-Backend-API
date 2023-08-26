const Appointment = require("../Model/appointmentModel");
const AppointmentStatuses = require("./appointment_Statuses");
const AppointmentStatusModel = require("../Model/appointmentStatusModel");
const ErrorHandler = require("../utils/ErrorHandler");

const createDocAppointment = async (req, res, next) => {
  try {
    const existingRequests = await Appointment.find({
      patId: req.user._id,
      otherCare: req.body.otherCareId,
      service: req.body.serviceId,
    });

    if (existingRequests.length === 0) {
      const newAppointment = new Appointment({
        ...req.body,
        service: req.body.serviceId,
        otherCare: req.body.otherCareId,
        patId: req.user._id,
        appointmentStatus: req.body.appointmentStatusId,
      });
      const savedAppointment = await newAppointment.save();

      let appointments = await Appointment.findOne({
        _id: savedAppointment._id,
      })
        .populate("otherCare", "")
        .populate("appointmentStatus")
        .populate("service");

      res.status(201).json(appointments);
    } else {
      throw new ErrorHandler("You already made Request", 400);
    }
  } catch (error) {
    next(error);
  }
};

const checkAppointment = async (req, res, next) => {
  try {
    const findAppointment = await Appointment.findOne({
      patId: req.user._id,
      otherCare: req.body.otherCareId,
      service: req.body.serviceId,
    });
    if (!findAppointment) {
      // throw new ErrorHandler("APPOINTMENT NOT FOUND", 400);
      res.status(200).json(false);
    }
    res.status(200).json(true);
  } catch (err) {
    next(err);
  }
};

//user dlt the appointment

const dltAppointmentByUser = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const dltAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!dltAppointment) {
      // throw new ErrorHandler("APPOINTMENT NOT FOUND", 400);
      res.status(200).json(false);
    }
    res.status(200).json(true);
  } catch (err) {
    next(err);
  }
};

//superadmin will use this api to approve

const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Update appointment status to "Approved" (status code 2)
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointmentStatus: AppointmentStatuses.APPOINTMENT_STATUS_APPROVED },
      { new: true }
    );

    const statusUpdate = new AppointmentStatusModel({
      title: "Approved",
      legendColor: "#00FF00",
      sortOrder: 2,
      descriptionText: "The appointment has been approved.",
      statusKey: "APPROVED",
      appointmentId: appointmentId,
    });

    await statusUpdate.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};

//get appointment list according to page and limit 

const getAppointment = async (req, res, next) => {
  try {
    const { pages, limit, statusFilter } = req.body;

    if (!statusFilter) {
      if (!limit || typeof pages !== "number" || typeof limit !== "number") {
        return res.status(400).json({ message: "Invalid query params" });
      }

      const userCount = await Appointment.countDocuments({
        patId: req.user._id,
      });

      let appointments = await Appointment.find({ patId: req.user._id })
        .populate("otherCare", "")
        .populate("appointmentStatus")
        .populate("service")
        .skip(pages * limit)
        .limit(limit);

      if (!appointments) {
        throw new ErrorHandler("No appointment Found");
      } else {
        appointments = appointments.map((appointment) => {
          const date = new Date(appointment.eventDate);
          const isoTimestamp = date.toISOString();
          appointment.eventDate = isoTimestamp;
          return appointment;
        });

        res.status(200).json({
          data: {
            aggregate: {
              totalCount: {
                totals: userCount,
              },
            },
          },
          appointments: appointments,
        });
      }
    } else {
      if (!limit || typeof pages !== "number" || typeof limit !== "number") {
        return res.status(400).json({ message: "Invalid query params" });
      }

      const userCount = await Appointment.countDocuments({
        patId: req.user._id,
        appointmentStatus: { $in: statusFilter },
      });

      let appointments = await Appointment.find({
        patId: req.user._id,
        appointmentStatus: { $in: statusFilter },
      })
        .populate("otherCare", "")
        .populate("appointmentStatus")
        .populate("service")
        .skip(pages * limit)
        .limit(limit);

      if (!appointments) {
        throw new ErrorHandler("No appointment Found");
      } else {
        appointments = appointments.map((appointment) => {
          const date = new Date(appointment.eventDate);
          const isoTimestamp = date.toISOString();
          appointment.eventDate = isoTimestamp;
          return appointment;
        });

        res.status(200).json({
          data: {
            aggregate: {
              totalCount: {
                totals: userCount,
              },
            },
          },
          appointments: appointments,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDocAppointment,
  approveAppointment,
  getAppointment,
  dltAppointmentByUser,
  checkAppointment,
};
