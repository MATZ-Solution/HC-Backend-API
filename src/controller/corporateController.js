const sendEmail = require('../utils/email');
const ErrorHandler = require("../utils/ErrorHandler");
const patientApplyService = require("../Model/patApplyService");
const Corporate = require("../Model/corporateModel");

const emailController = async (req, res, next) => {
    try {
        const { to, subject, body, corporateNum } = req.body;
        const emailOptions = {
            to,
            subject,
            text: body,
        };

        // Await the database update operation
        const updateCounter = await patientApplyService.findOneAndUpdate(
            { patEmail: to, servicePhoneNumber: corporateNum },
            { $inc: { corporateContacted: 1 } },
            { new: true }
        );

        // Send the email
        await sendEmail({ ...emailOptions, res });

        // Return a success response or perform other actions
        res.status(200).json({
            success: true,
            message: "Email sent and counter updated successfully",
            updateCounter,
        });
    } catch (err) {
        // Handle errors using the ErrorHandler
        next(err);
    }
};

const updateCorporate = async (req, res, next) => {
    try {
        const { mongoDbId } = req.body;

        const updatedCorporate = await Corporate.findByIdAndUpdate(
            { _id: mongoDbId },
            { ...req.body },
            { new: true }
        );

        if (updatedCorporate) {
            res.status(200).json(updatedCorporate);
        } else {
            res.status(404).json({ message: "Not Found" });
        }

    } catch (err) {
        next(err);
    }
}

//for complain add by scraped complain by user

const addComplainId = async (req, res, next) => {
    try {
        const { phoneNumber, mongoDbID, category } = req.body;

        const corporate = await Corporate.findOne({ email: phoneNumber });

        if (!corporate) {
            return res.status(404).json({ message: "Corporate not found" });
        }

        // Check if the same MongoDB ID already exists in the complaintIds array
        const existingComplaint = corporate.complaintIds.find(complaint => complaint.mongoDbID === mongoDbID);
        if (existingComplaint) {
            return res.status(200).json({ message: "Complaint ID already exists in the array" });
        }

        // If the complaint doesn't exist, add it to the complaintIds array
        corporate.complaintIds.push({ mongoDbID, category });
        await corporate.save();

        res.status(200).json({ success: true, message: "Complaint ID added successfully" });
    } catch (err) {
        next(err);
    }
}




module.exports = {
    emailController,
    updateCorporate,
    addComplainId
};
