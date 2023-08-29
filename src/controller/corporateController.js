const sendEmail = require('../utils/email');
const ErrorHandler = require("../utils/ErrorHandler");
const patientApplyService = require("../Model/patApplyService");

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

        console.log(updateCounter)


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

module.exports = {
    emailController,
};
